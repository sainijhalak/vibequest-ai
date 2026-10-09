import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import {
  Turn,
  ReportResponse,
  ReportResponseSchema,
  ScenarioDefinition,
  simulateReport
} from '@vibequest/shared';
import { computeScores } from './scoringEngine.js';

const QualitativeReflectionPayloadSchema = z.object({
  archetype: z.string().min(1).default('The Calibrated Tactician'),
  archetypeTagline: z.string().min(1).default('Adaptive, situational, balancing multiple social currents'),
  vibeSnapshot: z.string().min(1),
  howItLanded: z.string().min(1).default(''),
  observedPatterns: z.array(z.string()).min(1),
  alternativeApproaches: z.array(z.string()).min(1)
});

export class ReflectionEngine {
  private static anthropic: Anthropic | null = null;

  private static getClient(): Anthropic | null {
    if (!this.anthropic && process.env.ANTHROPIC_API_KEY) {
      this.anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY
      });
    }
    return this.anthropic;
  }

  public static async generateReport(
    scenario: ScenarioDefinition,
    history: Turn[]
  ): Promise<ReportResponse> {
    // 1. Calculate deterministic scores FIRST (ground truth)
    const scoringResult = computeScores({
      scenarioId: scenario.id,
      history
    });

    const isMock = process.env.MOCK_AI === 'true' || !process.env.ANTHROPIC_API_KEY;
    const client = this.getClient();
    const model = process.env.ANTHROPIC_MODEL || 'claude-3-5-haiku-20241022';

    const whatWeCannotKnow = [
      'A simulated dialogue is an exploratory moment, not a psychometric diagnosis of your character.',
      'How you communicate in a low-stakes fictional context may differ markedly from high-stress personal relationships.',
      'Tendencies are context-dependent strategies with valid trade-offs, not permanent personality flaws.',
      'You are always free to dismiss or disagree with any observation that does not match your lived experience.'
    ];

    if (!isMock && client) {
      // Try Claude synthesis (with 1 retry)
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const systemPrompt = `You are the Behavioral Reflection Engine for VibeQuest AI.
Your purpose is to provide an entertaining, witty, non-judgmental, evidence-grounded reflection on a user's communication style during a fictional scenario.

CRITICAL RULES:
1. DO NOT invent or alter the numerical scores provided. The numbers are calculated deterministically by server code.
2. Ground all observations in the user's actual choices and quotes from the transcript.
3. Express epistemic uncertainty: use phrasing like "tended to", "in this situation", "your choices favored".
4. NEVER infer mental illness, intelligence, criminality, trustworthiness, or sexuality.
5. NO derogatory or pseudoscientific labels (never use "toxic", "narcissist", "alpha", "weak", "people-pleaser", "manipulative").
6. Output MUST be valid JSON strictly matching the requested format.`;

          const userPrompt = `Scenario: "${scenario.title}" (${scenario.mode})
Context: ${scenario.context}
Character: ${scenario.character.name}

Conversation Transcript:
${history.map(t => `${t.speaker.toUpperCase()} [Turn ${t.turnNumber}]: "${t.text}"`).join('\n')}

Deterministic Dimension Scores (Ground Truth):
- Directness: ${scoringResult.scores.directness.score ?? 'Insufficient evidence'} (${scoringResult.scores.directness.status})
- Conflict Engagement: ${scoringResult.scores.conflict_engagement.score ?? 'Insufficient evidence'} (${scoringResult.scores.conflict_engagement.status})
- Boundary Expression: ${scoringResult.scores.boundary_expression.score ?? 'Insufficient evidence'} (${scoringResult.scores.boundary_expression.status})
- Perspective Taking: ${scoringResult.scores.perspective_taking.score ?? 'Insufficient evidence'} (${scoringResult.scores.perspective_taking.status})

Evidence Receipts:
${scoringResult.receipts.map(r => `Receipt ${r.id} (Turn ${r.turnNumber}): "${r.quote}" -> ${r.observation}`).join('\n')}

Return a JSON object with:
{
  "archetype": "A creative, fun archetype title (e.g. 'The Unflinching Truth-Teller', 'The Harmonious De-Escalator', 'The Strategic Boundary Guardian', 'The Empathetic Anchor', 'The Proactive Catalyst')",
  "archetypeTagline": "A punchy, witty 1-sentence tagline describing their style",
  "vibeSnapshot": "A 3-4 sentence engaging, witty synthesis citing their actual choices and quotes.",
  "howItLanded": "A 2-sentence first-person reflection from the fictional character's voice (${scenario.character.name}) about how the user's choices made them feel, quoting a key phrase.",
  "observedPatterns": ["2 to 3 bullet points naming specific communication tactics citing their actual quotes"],
  "alternativeApproaches": ["2 alternative conversational approaches they could have taken with different trade-offs"]
}`;

          const response = await client.messages.create({
            model,
            max_tokens: 1200,
            temperature: 0.3,
            system: systemPrompt,
            messages: [{ role: 'user', content: userPrompt }]
          });

          const first = response.content[0];
          if (first.type === 'text') {
            const rawText = first.text.trim();
            const jsonMatch = rawText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
              throw new Error('No JSON object found in Claude reflection output');
            }

            let parsedJson: unknown;
            try {
              parsedJson = JSON.parse(jsonMatch[0]);
            } catch (jsonErr: any) {
              console.warn('[ReflectionEngine] JSON parse failed on AI reflection payload:', jsonErr?.message);
              throw jsonErr;
            }

            const zodResult = QualitativeReflectionPayloadSchema.safeParse(parsedJson);
            if (!zodResult.success) {
              console.warn('[ReflectionEngine] Zod validation error shape on reflection output:', JSON.stringify(zodResult.error.format()));
              throw new Error('Reflection payload failed Zod schema validation');
            }

            const parsed = zodResult.data;

            const simulated = simulateReport({ scenarioId: scenario.id, history });
            return ReportResponseSchema.parse({
              scenarioId: scenario.id,
              scenarioTitle: scenario.title,
              characterName: scenario.character.name,
              scores: scoringResult.scores,
              vibeSnapshot: parsed.vibeSnapshot,
              observedPatterns: parsed.observedPatterns,
              alternativeApproaches: parsed.alternativeApproaches,
              receipts: scoringResult.receipts,
              whatWeCannotKnow,
              mockMode: false,
              archetype: parsed.archetype,
              archetypeTagline: parsed.archetypeTagline,
              howItLanded: parsed.howItLanded,
              reportCard: simulated.reportCard
            });
          }
        } catch (err: any) {
          console.warn(`[ReflectionEngine] Attempt ${attempt} failed: ${err?.message}`);
        }
      }
    }

    // High quality contextual fallback debrief
    const simulated = simulateReport({ scenarioId: scenario.id, history });

    return ReportResponseSchema.parse({
      ...simulated,
      mockMode: isMock
    });
  }

  private static generateFallbackReflection(
    scenario: ScenarioDefinition,
    scores: any,
    history: Turn[]
  ): {
    archetype: string;
    archetypeTagline: string;
    vibeSnapshot: string;
    howItLanded: string;
    observedPatterns: string[];
    alternativeApproaches: string[];
  } {
    const directness = scores.directness.score ?? 50;
    const boundary = scores.boundary_expression.score ?? 50;
    const conflict = scores.conflict_engagement.score ?? 50;
    const perspective = scores.perspective_taking.score ?? 50;

    const userTurns = history.filter(t => t.speaker === 'user');
    const userQuotes = userTurns.map(t => t.text);
    const primaryQuote = userQuotes[0] || 'I hear what you are saying';
    const secondaryQuote = userQuotes[1] || userQuotes[0] || '';

    let archetype = 'The Calibrated Tactician';
    let archetypeTagline = 'Adaptive, situational, balancing multiple social currents';
    let vibeSnapshot = '';
    let howItLanded = '';

    if (boundary >= 68 && directness >= 65) {
      archetype = 'The Unflinching Truth-Teller';
      archetypeTagline = 'Uncompromising self-respect and razor-sharp clarity';
      vibeSnapshot = `In your confrontation with ${scenario.character.name}, you operated as The Unflinching Truth-Teller. When presented with ${scenario.tagline.toLowerCase()}, you refused to hide behind polite ambiguity or social cushions. By choosing to declare "${primaryQuote}", you set an immediate standard of self-respect, establishing that your time and boundaries are non-negotiable.`;
      howItLanded = `"${scenario.character.name}: 'Honestly? You caught me completely off-guard when you said "${primaryQuote}". I was expecting you to let it slide or make a polite excuse, but you held a mirror right up to me. I respected that.'"`
    } else if (perspective >= 65 && conflict <= 45) {
      archetype = 'The Harmonious De-Escalator';
      archetypeTagline = 'Prioritizing emotional safety, warmth, and relational continuity';
      vibeSnapshot = `During your interaction with ${scenario.character.name}, you operated as The Harmonious De-Escalator. You consistently prioritized psychological safety and mutual understanding over proving a point. When you responded with "${primaryQuote}", you gave the other person room to save face, defusing acute tension before exploring what actually happened.`;
      howItLanded = `"${scenario.character.name}: 'When you responded with "${primaryQuote}", all the anxiety in my chest just melted away. You didn\'t attack me or put me on trial—you gave me permission to be human.'"`
    } else if (directness >= 65 && conflict >= 60) {
      archetype = 'The Proactive Catalyst';
      archetypeTagline = 'Leaning directly into unresolved friction to forge resolution';
      vibeSnapshot = `In your dialogue with ${scenario.character.name}, you operated as The Proactive Catalyst. You treated tension not as an awkward threat to be swept under the rug, but as a problem to solve in real time. Your choice to declare "${primaryQuote}" challenged the status quo, forcing mutual accountability and cutting through hours of passive avoidance.`;
      howItLanded = `"${scenario.character.name}: 'You definitely don\'t beat around the bush! Hearing "${primaryQuote}" stung for a second, but it forced us to stop tip-toeing around the elephant in the room.'"`
    } else if (perspective >= 65 && directness >= 60) {
      archetype = 'The Empathetic Anchor';
      archetypeTagline = 'Grounded inquiry paired with honest, supportive presence';
      vibeSnapshot = `Throughout your encounter with ${scenario.character.name}, you operated as The Empathetic Anchor. You displayed the rare ability to be simultaneously radically clear and deeply curious. By asking "${primaryQuote}", you validated the underlying stress driving the situation while maintaining your own grounded posture.`;
      howItLanded = `"${scenario.character.name}: 'You have a really grounded way of talking. When you said "${primaryQuote}", I felt seen rather than interrogated. That is rare.'"`
    } else if (boundary <= 38 && conflict <= 38) {
      archetype = 'The Accommodating Peacekeeper';
      archetypeTagline = 'Minimizing friction to preserve interpersonal comfort';
      vibeSnapshot = `In your exchange with ${scenario.character.name}, you operated as The Accommodating Peacekeeper. When faced with ${scenario.tagline.toLowerCase()}, your instinctive reaction was to absorb the friction and reassure the other person with "${primaryQuote}". While this preserves immediate harmony, it often comes at the silent cost of your own unspoken boundaries.`;
      howItLanded = `"${scenario.character.name}: 'You were so generous when you said "${primaryQuote}". Part of me felt relieved, but another part wondered if you were secretly annoyed and just being too nice to say so.'"`
    } else {
      archetype = 'The Calibrated Tactician';
      archetypeTagline = 'Adaptive, situational, balancing multiple social currents';
      vibeSnapshot = `In your interaction with ${scenario.character.name}, you operated as The Calibrated Tactician. You avoided extreme dogmatism—choosing "${primaryQuote}" to gauge the temperature of the room before committing to a rigid stance. You modulate between directness and cushioning depending on the other person's cues.`;
      howItLanded = `"${scenario.character.name}: 'You were really thoughtful. When you said "${primaryQuote}", it felt measured and mature—like someone who reads the room before making their move.'"`
    }

    const observedPatterns = [
      directness >= 60
        ? `Front-loaded clarity: You established your posture early (e.g. Turn 1: "${primaryQuote.slice(0, 50)}...") rather than relying on indirect hinting.`
        : `Relational cushioning: You smoothed over conversational friction with conversational buffers before stating your position.`,
      boundary >= 60
        ? `Explicit limit setting: You clearly signaled where your bandwidth or patience ended, making your expectations predictable.`
        : `High relational accommodation: You adapted generously to the counterpart\'s pace and stress, prioritizing their comfort.`,
      secondaryQuote
        ? `Dynamic calibration: In later turns, you followed up with "${secondaryQuote.slice(0, 55)}...", demonstrating responsiveness to their emotional shift.`
        : `Single-stance consistency: You held a steady emotional tone throughout the dialogue.`
    ];

    const alternativeApproaches = [
      directness >= 65
        ? `Test pairing direct statements with an open curiosity inquiry to lower counterpart defense.`
        : `Experiment with stating the hard boundary 10% earlier in the exchange instead of giving multiple exploratory cushions.`,
      conflict >= 60
        ? `Try taking a temporary emotional pause before addressing acute friction to let the other person decompress.`
        : `Practice leaning into the friction in real time rather than deferring the resolution to future dates.`
    ];

    return {
      archetype,
      archetypeTagline,
      vibeSnapshot,
      howItLanded,
      observedPatterns,
      alternativeApproaches
    };
  }
}
