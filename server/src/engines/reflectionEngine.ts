import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import {
  Turn,
  ReportResponse,
  ReportResponseSchema,
  ScenarioDefinition
} from '@vibequest/shared';
import { computeScores } from './scoringEngine.js';

const QualitativeReflectionPayloadSchema = z.object({
  vibeSnapshot: z.string().min(1),
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
      'A 3-turn simulated dialogue is an exploratory moment, not a psychometric diagnosis of your character.',
      'How you communicate in a low-stakes fictional context may differ markedly from high-stress personal relationships.',
      'Tendencies are context-dependent strategies with valid trade-offs, not permanent personality flaws.',
      'You are always free to dismiss or disagree with any observation that does not match your lived experience.'
    ];

    if (!isMock && client) {
      // Try Claude synthesis (with 1 retry)
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const systemPrompt = `You are the Behavioral Reflection Engine for VibeQuest AI.
Your purpose is to provide a non-judgmental, curious, evidence-grounded reflection on a user's communication style during a fictional scenario.

CRITICAL RULES:
1. DO NOT invent or alter the numerical scores provided. The numbers are calculated deterministically by server code.
2. Ground all observations in the user's actual choices and quotes.
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
  "vibeSnapshot": "A 2-3 sentence engaging, witty, observant synthesis of how they showed up in this specific encounter.",
  "observedPatterns": ["2 to 3 bullet points naming specific communication tactics they used"],
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
            // Robustly match the first outermost JSON object in response
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
              // Log the error shape explicitly (never logging raw conversation text)
              console.warn('[ReflectionEngine] Zod validation error shape on reflection output:', JSON.stringify(zodResult.error.format()));
              throw new Error('Reflection payload failed Zod schema validation');
            }

            const parsed = zodResult.data;

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
              mockMode: false
            });
          }
        } catch (err: any) {
          console.warn(`[ReflectionEngine] Attempt ${attempt} failed: ${err?.message}`);
        }
      }
    }

    // High quality contextual fallback debrief
    const fallback = this.generateFallbackReflection(scenario, scoringResult.scores);

    return ReportResponseSchema.parse({
      scenarioId: scenario.id,
      scenarioTitle: scenario.title,
      characterName: scenario.character.name,
      scores: scoringResult.scores,
      vibeSnapshot: fallback.vibeSnapshot,
      observedPatterns: fallback.observedPatterns,
      alternativeApproaches: fallback.alternativeApproaches,
      receipts: scoringResult.receipts,
      whatWeCannotKnow,
      mockMode: isMock
    });
  }

  private static generateFallbackReflection(
    scenario: ScenarioDefinition,
    scores: any
  ): { vibeSnapshot: string; observedPatterns: string[]; alternativeApproaches: string[] } {
    const directness = scores.directness.score ?? 50;
    const boundary = scores.boundary_expression.score ?? 50;

    let snapshot = 'You handled this encounter with calibrated adaptability, balancing your personal boundaries with curiosity toward the counterpart.';
    if (boundary >= 65 && directness >= 65) {
      snapshot = 'In this scenario, you favored unambiguous self-advocacy. You named boundaries directly without passive aggression, establishing clear lines early.';
    } else if (directness < 40) {
      snapshot = 'You favored diplomatic cushioning in this situation, prioritizing interpersonal comfort and relational flow before addressing underlying friction.';
    }

    const patterns = [
      directness >= 55
        ? 'Front-loading clarity: You preferred stating terms and questions directly rather than hinting.'
        : 'Conversational cushioning: You smoothed over tense beats with tact and humor.',
      boundary >= 55
        ? 'Clear limit setting: You signaled where your line was before conceding ground.'
        : 'Relational flexibility: You prioritized rapport and keeping the conversational bridge intact.'
    ];

    const alternatives = [
      scenario.mode === 'conflict_arena'
        ? 'The Private De-escalation: Pulling the counterpart aside to address the grievance without audience ego.'
        : 'The Direct Timeline Ask: Naming expectations clearly at the outset to eliminate lingering guesswork.',
      'The Meta-Observation: Naming the dynamic itself ("It feels like we are talking past each other") rather than debating individual sentences.'
    ];

    return {
      vibeSnapshot: snapshot,
      observedPatterns: patterns,
      alternativeApproaches: alternatives
    };
  }
}
