import {
  BehavioralDimension,
  DimensionScoreResult,
  EvidenceReceipt,
  Turn,
  ScenarioDefinition,
  TurnRequest,
  TurnResponse,
  ReportRequest,
  ReportResponse,
  ChoiceOption
} from './index.js';
import { SCENARIOS } from './scenarios.js';

export interface ScoringRun {
  scenarioId: string;
  history: Turn[];
}

export interface ScoringOutput {
  scores: Record<BehavioralDimension, DimensionScoreResult>;
  receipts: EvidenceReceipt[];
}

/**
 * Pure deterministic vector scoring algorithm.
 */
export function computeScores(runs: ScoringRun | ScoringRun[]): ScoringOutput {
  const runList = Array.isArray(runs) ? runs : [runs];

  const dimensions: BehavioralDimension[] = [
    'directness',
    'conflict_engagement',
    'boundary_expression',
    'perspective_taking'
  ];

  interface DimensionAccumulator {
    deltas: number[];
    receipts: EvidenceReceipt[];
  }

  const accumulators: Record<BehavioralDimension, DimensionAccumulator> = {
    directness: { deltas: [], receipts: [] },
    conflict_engagement: { deltas: [], receipts: [] },
    boundary_expression: { deltas: [], receipts: [] },
    perspective_taking: { deltas: [], receipts: [] }
  };

  let receiptCounter = 1;

  for (const run of runList) {
    const scenario = SCENARIOS.find(s => s.id === run.scenarioId);
    const userTurns = run.history.filter(t => t.speaker === 'user');

    for (const turn of userTurns) {
      let matchedChoice = false;
      if (turn.choiceId && scenario) {
        const choice = scenario.initialChoices.find(c => c.id === turn.choiceId)
          || getDynamicFollowupChoices(scenario, turn.turnNumber).find(c => c.id === turn.choiceId);

        if (choice && choice.impacts) {
          matchedChoice = true;
          for (const impact of choice.impacts) {
            accumulators[impact.dimension].deltas.push(impact.delta);
            accumulators[impact.dimension].receipts.push({
              id: `rcpt_${receiptCounter++}`,
              turnNumber: turn.turnNumber,
              quote: turn.text,
              dimension: impact.dimension,
              observation: impact.reason
            });
          }
        }
      }

      // Fallback text heuristics for custom write-ins or unlisted choices
      if (!matchedChoice) {
        const lower = turn.text.toLowerCase();
        if (lower.includes('why') || lower.includes('what happened') || lower.includes('tell me')) {
          accumulators.perspective_taking.deltas.push(1);
          accumulators.perspective_taking.receipts.push({
            id: `rcpt_${receiptCounter++}`,
            turnNumber: turn.turnNumber,
            quote: turn.text,
            dimension: 'perspective_taking',
            observation: 'Asked open inquiry to understand their side'
          });
        }
        if (lower.includes('honestly') || lower.includes('directly') || lower.includes('not cool') || lower.includes('unacceptable')) {
          accumulators.directness.deltas.push(2);
          accumulators.boundary_expression.deltas.push(1);
          accumulators.directness.receipts.push({
            id: `rcpt_${receiptCounter++}`,
            turnNumber: turn.turnNumber,
            quote: turn.text,
            dimension: 'directness',
            observation: 'Used explicit, unambiguous phrasing'
          });
        }
      }
    }
  }

  const dimensionMeta: Record<BehavioralDimension, { label: string; lowDesc: string; highDesc: string; midDesc: string }> = {
    directness: {
      label: 'Directness vs Indirect Hinting',
      lowDesc: 'Tended to soften messages, relying on social hinting or gentle cushions.',
      midDesc: 'Balanced clarity with tact, calibrating bluntness to the counterpart.',
      highDesc: 'Valued unambiguous clarity, naming realities and timelines plainly.'
    },
    conflict_engagement: {
      label: 'Conflict Engagement & Timing',
      lowDesc: 'Preferred cooling off, giving situations room to breathe rather than pressing.',
      midDesc: 'Engaged with friction when necessary, but preferred collaborative de-escalation.',
      highDesc: 'Leaned directly into unresolved tension to achieve real-time resolution.'
    },
    boundary_expression: {
      label: 'Boundary Articulation',
      lowDesc: 'Accommodated others readily, sometimes at the expense of stating own limits.',
      midDesc: 'Negotiated boundaries reasonably without rigid finality.',
      highDesc: 'Set clear limits on time, emotional bandwidth, and personal respect.'
    },
    perspective_taking: {
      label: 'Perspective Inquiring vs Stance-First',
      lowDesc: 'Led with personal stance and expectations before exploring the other side.',
      midDesc: 'Blended personal perspective with curiosity about the other person.',
      highDesc: 'Proactively inquired into the counterpart\'s underlying stress or context.'
    }
  };

  const scoresRecord: Partial<Record<BehavioralDimension, DimensionScoreResult>> = {};
  const allReceipts: EvidenceReceipt[] = [];

  for (const dim of dimensions) {
    const acc = accumulators[dim];
    const n = acc.deltas.length;
    allReceipts.push(...acc.receipts);

    if (n < 2) {
      scoresRecord[dim] = {
        dimension: dim,
        label: dimensionMeta[dim].label,
        score: null,
        status: 'insufficient_evidence',
        summary: `Insufficient evidence: Only ${n} data point observed for this dimension.`,
        evidenceIds: acc.receipts.map(r => r.id)
      };
      continue;
    }

    const hasPos = acc.deltas.some(d => d > 0);
    const hasNeg = acc.deltas.some(d => d < 0);
    const spread = Math.max(...acc.deltas) - Math.min(...acc.deltas);

    if (hasPos && hasNeg && spread >= 2) {
      scoresRecord[dim] = {
        dimension: dim,
        label: dimensionMeta[dim].label,
        score: null,
        status: 'context_dependent',
        summary: 'Context-dependent: Your responses shifted significantly between turns, adapting to the counterpart\'s cues.',
        evidenceIds: acc.receipts.map(r => r.id)
      };
      continue;
    }

    const sum = acc.deltas.reduce((a, b) => a + b, 0);
    const base = 50;
    const rawScore = base + (sum * 12);
    const clampedScore = Math.min(95, Math.max(15, rawScore));

    let summaryText = dimensionMeta[dim].midDesc;
    if (clampedScore > 65) {
      summaryText = dimensionMeta[dim].highDesc;
    } else if (clampedScore < 35) {
      summaryText = dimensionMeta[dim].lowDesc;
    }

    scoresRecord[dim] = {
      dimension: dim,
      label: dimensionMeta[dim].label,
      score: clampedScore,
      status: 'evaluated',
      summary: summaryText,
      evidenceIds: acc.receipts.map(r => r.id)
    };
  }

  return {
    scores: scoresRecord as Record<BehavioralDimension, DimensionScoreResult>,
    receipts: allReceipts
  };
}

/**
 * Generate contextual dynamic followup choices for all scenarios.
 */
export function getDynamicFollowupChoices(scenario: ScenarioDefinition, turnNumber: number): ChoiceOption[] {
  if (scenario.id === 'unexpected-message') {
    return [
      {
        id: `opt_turn_${turnNumber}_coffee`,
        label: 'Suggest in-person catch up',
        text: 'Good to hear from you. Let us grab a quick coffee this weekend and catch up properly.',
        impacts: [
          { dimension: 'directness', delta: 2, reason: 'Initiated direct in-person reconnection' },
          { dimension: 'conflict_engagement', delta: 1, reason: 'Proactively stepped into reconnection' }
        ]
      },
      {
        id: `opt_turn_${turnNumber}_ask_closure`,
        label: 'Ask for closure on the silence',
        text: 'I appreciate the apology, but what actually happened back then? You kind of vanished into thin air.',
        impacts: [
          { dimension: 'boundary_expression', delta: 2, reason: 'Addressed past rupture before moving on' },
          { dimension: 'directness', delta: 2, reason: 'Demanded honest clarity' }
        ]
      },
      {
        id: `opt_turn_${turnNumber}_keep_virtual`,
        label: 'Keep it light & distant',
        text: 'Haha totally. Well keep me posted on how your projects turn out!',
        impacts: [
          { dimension: 'boundary_expression', delta: 1, reason: 'Maintained low-investment distance' },
          { dimension: 'conflict_engagement', delta: -1, reason: 'Chose casual distance over deeper repair' }
        ]
      }
    ];
  }

  if (scenario.id === 'forgotten-plan') {
    return [
      {
        id: `opt_turn_${turnNumber}_firm_check`,
        label: 'Set mutual accountability',
        text: 'Let us only put something on the calendar when your sprint is actually wrapped up so neither of us has to scramble.',
        impacts: [
          { dimension: 'boundary_expression', delta: 2, reason: 'Set structural limit on future scheduling' },
          { dimension: 'directness', delta: 1, reason: 'Addressed structural cause of cancellations' }
        ]
      },
      {
        id: `opt_turn_${turnNumber}_check_stress`,
        label: 'Ask about the escalation',
        text: 'Sounds brutal with that client. Are you doing okay under all that fire?',
        impacts: [
          { dimension: 'perspective_taking', delta: 2, reason: 'Prioritized colleague well-being' },
          { dimension: 'conflict_engagement', delta: -1, reason: 'Chose compassion over addressing friction' }
        ]
      }
    ];
  }

  if (scenario.id === 'group-chat-dilemma') {
    return [
      {
        id: `opt_turn_${turnNumber}_poll_vote`,
        label: 'Drop formal emoji poll',
        text: 'Dropping a formal poll: React 🌲 for cabin trip, ❌ for pass. If we have 4 by 6pm, I will lock in the dates!',
        impacts: [
          { dimension: 'directness', delta: 2, reason: 'Implemented organized decision mechanism' },
          { dimension: 'conflict_engagement', delta: 1, reason: 'Moved group from passivity to action' }
        ]
      },
      {
        id: `opt_turn_${turnNumber}_dm_leo`,
        label: 'DM Leo privately',
        text: 'DMing Leo: "Hey, do you actually want to do this cabin trip or is everyone too busy?"',
        impacts: [
          { dimension: 'perspective_taking', delta: 1, reason: 'Calibrated mood in private 1-on-1' },
          { dimension: 'directness', delta: 1, reason: 'Asked for private read on the room' }
        ]
      }
    ];
  }

  if (scenario.id === 'boundary-joke') {
    return [
      {
        id: `opt_turn_${turnNumber}_firm_limit`,
        label: 'Lock in boundary',
        text: 'Thanks Marcus. Appreciate you saying that. Let us keep it moving.',
        impacts: [
          { dimension: 'boundary_expression', delta: 1, reason: 'Maintained firm boundary without lingering grudge' },
          { dimension: 'conflict_engagement', delta: 1, reason: 'De-escalated cleanly once boundary was accepted' }
        ]
      },
      {
        id: `opt_turn_${turnNumber}_reset_vibe`,
        label: 'Lighthearted reset',
        text: 'Fair enough. Just make sure the next drink has an umbrella in it.',
        impacts: [
          { dimension: 'conflict_engagement', delta: -1, reason: 'Restored social levity' },
          { dimension: 'boundary_expression', delta: 1, reason: 'Accepted resolution with humor' }
        ]
      }
    ];
  }

  if (scenario.id === 'credit-taken') {
    return [
      {
        id: `opt_turn_${turnNumber}_confirm_notes`,
        label: 'Confirm email co-authorship',
        text: 'Sounds good Elena. I will draft the bullet points for our joint recap email and send it over for review.',
        impacts: [
          { dimension: 'boundary_expression', delta: 2, reason: 'Enforced formal documentation of credit' },
          { dimension: 'directness', delta: 2, reason: 'Took immediate structural action' }
        ]
      },
      {
        id: `opt_turn_${turnNumber}_align_partnership`,
        label: 'Establish team norm',
        text: 'Going forward, let us make sure we explicitly divide presentation slides before calls so ownership is seamless.',
        impacts: [
          { dimension: 'perspective_taking', delta: 1, reason: 'Collaboratively designed future process' },
          { dimension: 'conflict_engagement', delta: 1, reason: 'Constructive systemic resolution' }
        ]
      }
    ];
  }

  if (scenario.id === 'cafe-spark') {
    return [
      {
        id: `opt_turn_${turnNumber}_coffee_invite`,
        label: 'Invite to share table',
        text: 'Well, since we are both reading enthusiasts, mind if I join you for a coffee?',
        impacts: [
          { dimension: 'directness', delta: 2, reason: 'Clear romantic and conversational interest' },
          { dimension: 'conflict_engagement', delta: 1, reason: 'Bold step forward' }
        ]
      },
      {
        id: `opt_turn_${turnNumber}_discuss_author`,
        label: 'Deep dive into book',
        text: 'Tell me your favorite passage so far—I want to see if we highlighted the same chapter.',
        impacts: [
          { dimension: 'perspective_taking', delta: 2, reason: 'Focused on their literary perspective' },
          { dimension: 'directness', delta: 1, reason: 'Warm intellectual connection' }
        ]
      }
    ];
  }

  // Gallery compliment & default
  return [
    {
      id: `opt_turn_${turnNumber}_explore_canvas`,
      label: 'Explore art perspective',
      text: 'To me, that brush stroke feels like structured chaos. What does it remind you of?',
      impacts: [
        { dimension: 'perspective_taking', delta: 2, reason: 'Invited their emotional perception' },
        { dimension: 'directness', delta: 1, reason: 'Engaged with genuine curiosity' }
      ]
    },
    {
      id: `opt_turn_${turnNumber}_exchange_names`,
      label: 'Warm introduction',
      text: 'I am [User], by the way. What brought you to the opening tonight?',
      impacts: [
        { dimension: 'directness', delta: 2, reason: 'Direct introduction' },
        { dimension: 'boundary_expression', delta: 1, reason: 'Opened conversational connection' }
      ]
    }
  ];
}

/**
 * Generate in-character replies for all 7 scenarios across all turns.
 */
export function simulateTurn(payload: TurnRequest): TurnResponse {
  const scenario = SCENARIOS.find(s => s.id === payload.scenarioId) || SCENARIOS[0];
  const userTurns = payload.history.filter(t => t.speaker === 'user');
  const userTurnCount = userTurns.length;
  const canContinue = userTurnCount < scenario.maxTurns;
  const text = payload.userMessage.toLowerCase();

  let reply = 'I appreciate you sharing that with me. It gives me a lot to consider.';
  let characterMood = scenario.character.quirks?.initialMood || 'neutral';
  let characterMoodDescription = scenario.character.quirks?.initialMoodDesc || 'Assessing the conversational temperature';

  if (scenario.id === 'unexpected-message') {
    if (!canContinue) {
      reply = 'I completely respect that! Let us definitely grab that coffee when things slow down for you. Really glad we talked tonight!';
      characterMood = 'warm';
      characterMoodDescription = 'Relieved, grateful for the open door and mutual warmth';
    } else if (text.includes('bermuda') || text.includes('😂')) {
      reply = 'Haha fair call! I deserve that. Work swallowed me whole and then I felt super awkward reaching out after so long. But I really missed your energy!';
      characterMood = 'amused';
      characterMoodDescription = 'Amused and disarmed by your playful tease; tension evaporated';
    } else if (text.includes('eight months') || text.includes('why') || text.includes('prompted')) {
      reply = 'Oof, you are completely right to ask. I felt terrible about dropping off. I had a rough job transition, but I wanted to apologize and reconnect genuinely.';
      characterMood = 'hesitant';
      characterMoodDescription = 'Contrite and cautious, taking responsibility for the silence';
    } else {
      reply = 'I know it was completely out of the blue, but I am really glad you replied. Life has been a whirlwind lately.';
      characterMood = 'warm';
      characterMoodDescription = 'Gently optimistic, glad you answered the late-night text';
    }
  } else if (scenario.id === 'forgotten-plan') {
    if (!canContinue) {
      reply = 'You are 100% right. I am putting a calendar block right now so work cannot touch it next week. Thank you for keeping it real with me.';
      characterMood = 'relieved';
      characterMoodDescription = 'Accountable and appreciative of clear mutual boundaries';
    } else if (text.includes('third time') || text.includes('disposable') || text.includes('pattern')) {
      reply = 'Ugh... seeing that written down hits hard. You are completely right. It is not fair to you, and I am genuinely sorry for taking your time for granted.';
      characterMood = 'guarded';
      characterMoodDescription = 'Stung by the mirror, realizing the real impact of cancellations';
    } else if (text.includes('disappointed') || text.includes('clear heads')) {
      reply = 'I understand, and you have every right to be disappointed. Take all the time you need, and I will be here whenever you want to talk.';
      characterMood = 'hesitant';
      characterMoodDescription = 'Humbled and giving you space, respecting your emotional boundary';
    } else {
      reply = 'Thanks for bearing with me. I feel awful about the scramble, but I promise I will make it up to you.';
      characterMood = 'relieved';
      characterMoodDescription = 'Relieved by your patience, eager to make amends';
    }
  } else if (scenario.id === 'group-chat-dilemma') {
    if (!canContinue) {
      reply = '[Leo]: Cabin trip is locked in! 🌲 Everyone just chimed in after the poll. Good call on corralling this chaotic group!';
      characterMood = 'amused';
      characterMoodDescription = 'Hype level 100: excited that the group actually organized';
    } else if (text.includes('cabin') || text.includes('dust') || text.includes('solo')) {
      reply = '[Leo]: Hahaha oops! My bad, brain was completely fried by this dog video. Yes! I am 1000% in for the cabin. Who else is confirmed?';
      characterMood = 'amused';
      characterMoodDescription = 'Snapping out of meme-scroll trance, fully rallying for the trip';
    } else {
      reply = '[Leo]: Thumbs up from me! Just needed to check my schedule. Let us make this happen!';
      characterMood = 'warm';
      characterMoodDescription = 'Cooperative and on board with the plan';
    }
  } else if (scenario.id === 'boundary-joke') {
    if (!canContinue) {
      reply = 'Yeah, you are right. That was out of line and I respect you calling me out on it. Next round is on me, no jokes.';
      characterMood = 'warm';
      characterMoodDescription = 'Ego deflated, genuine mutual respect earned';
    } else if (text.includes('not cool') || text.includes('rough chapter') || text.includes('do not do that')) {
      reply = 'Man... honestly, hearing you say that makes me realize it was a cheap shot. My bad, seriously. I will tone it down immediately.';
      characterMood = 'guarded';
      characterMoodDescription = 'Surprised by direct pushback; recalibrating boundaries rapidly';
    } else {
      reply = 'Hey, I really did not mean to strike a sensitive nerve. Let us drop that topic and enjoy the night together.';
      characterMood = 'hesitant';
      characterMoodDescription = 'Stepping back, de-escalating the room tension';
    }
  } else if (scenario.id === 'credit-taken') {
    if (!canContinue) {
      reply = 'Agreed. I just sent the revised recap email crediting your benchmark architecture prominently. Thanks for handling this with professionalism.';
      characterMood = 'relieved';
      characterMoodDescription = 'Partnership preserved with formal credit restored';
    } else if (text.includes('benchmark') || text.includes('co-credited') || text.includes('initiative')) {
      reply = 'You are completely right. In the moment I got caught up in the Q&A rush, but your benchmarks were the backbone of the deck. I will make sure the written recap gives you full lead credit.';
      characterMood = 'guarded';
      characterMoodDescription = 'Defensive instinct neutralized by your factual, measured stance';
    } else {
      reply = 'Thanks for bringing that up directly. I value our partnership and definitely want to ensure our individual contributions are clear.';
      characterMood = 'neutral';
      characterMoodDescription = 'Diplomatic corporate alignment restored';
    }
  } else if (scenario.id === 'cafe-spark') {
    if (!canContinue) {
      reply = 'Haha deal! Well, I am definitely glad you said something. Let us compare notes when I finish the final chapter!';
      characterMood = 'amused';
      characterMoodDescription = 'Delighted by the literary spark; lingering warm connection';
    } else if (text.includes('chapter 12') || text.includes('plot twist')) {
      reply = 'Wait, do not say another word! Chapter 12?! Now my heart rate is up. Okay, you have to sit here and tell me with zero spoilers.';
      characterMood = 'amused';
      characterMoodDescription = 'Genuinely charmed and hooked by the shared book intrigue';
    } else {
      reply = 'Haha thank you. It is rare to meet someone who actually knows this translation. I am Sam, by the way.';
      characterMood = 'warm';
      characterMoodDescription = 'Warmly grounded, appreciating authentic introduction';
    }
  } else if (scenario.id === 'gallery-compliment') {
    if (!canContinue) {
      reply = 'It was wonderful talking to you. It is refreshing to meet someone who looks at art with both their intellect and their heart.';
      characterMood = 'warm';
      characterMoodDescription = 'Deeply appreciative of authentic connection amidst the crowd';
    } else if (text.includes('cultured') || text.includes('interesting')) {
      reply = '[Chloe laughs softly] Well, the mission was a success then. I am Chloe. Tell me what drew you to this piece specifically.';
      characterMood = 'amused';
      characterMoodDescription = 'Playfully intrigued by your confident wit';
    } else {
      reply = 'I appreciate people who take the time to really look rather than just glance. What feeling does this color palette give you?';
      characterMood = 'warm';
      characterMoodDescription = 'Engaged, inviting artistic exploration';
    }
  }

  return {
    characterReply: reply,
    turnCount: userTurnCount,
    canContinue,
    nextChoices: canContinue ? getDynamicFollowupChoices(scenario, userTurnCount) : [],
    mockMode: true,
    characterMood,
    characterMoodDescription
  };
}

/**
 * Generate post-game synthesis reflection and evidence receipts.
 */
export function simulateReport(payload: ReportRequest): ReportResponse {
  const scenario = SCENARIOS.find(s => s.id === payload.scenarioId) || SCENARIOS[0];
  const scoringResult = computeScores({ scenarioId: payload.scenarioId, history: payload.history });

  const whatWeCannotKnow = [
    `How you communicate under chronic fatigue or high financial stakes in the real world.`,
    `Long-term relational patterns built over years of deep trust versus a rapid conversational moment.`,
    `Your unspoken internal boundaries that were held internally without being spoken into the chat.`
  ];

  const directnessScore = scoringResult.scores.directness?.score ?? 50;
  const boundaryScore = scoringResult.scores.boundary_expression?.score ?? 50;

  let vibeSnapshot = `In your interaction with ${scenario.character.name}, you demonstrated a balanced conversational posture, blending clarity with mutual social attunement.`;
  if (directnessScore > 65) {
    vibeSnapshot = `In your interaction with ${scenario.character.name}, you demonstrated high communicative courage—naming timelines, expectations, and reality plainly rather than hiding behind ambiguity.`;
  } else if (boundaryScore > 65) {
    vibeSnapshot = `In your interaction with ${scenario.character.name}, you exhibited grounded self-advocacy, protecting personal bandwidth and expectations without unnecessary hostility.`;
  }

  const observedPatterns = [
    directnessScore > 60
      ? 'Clear, unambiguous framing: You tended to address central issues head-on rather than relying on subtle hints.'
      : 'Harmonious framing: You prioritized relational warmth and conversational ease before pressing difficult topics.',
    boundaryScore > 60
      ? 'Explicit boundary articulation: You signaled healthy limits regarding respect, time, and mutual expectations.'
      : 'Flexible accommodation: You adjusted comfortably to the counterpart\'s pace and context.'
  ];

  const alternativeApproaches = [
    'Test with a clarifying question before taking a definitive stance to invite greater counterpart vulnerability.',
    'Experiment with playful humor to de-escalate tension while maintaining firm underlying boundaries.'
  ];

  return {
    scenarioId: scenario.id,
    scenarioTitle: scenario.title,
    characterName: scenario.character.name,
    scores: scoringResult.scores,
    vibeSnapshot,
    observedPatterns,
    alternativeApproaches,
    receipts: scoringResult.receipts,
    whatWeCannotKnow,
    mockMode: true
  };
}
