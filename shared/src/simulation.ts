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
              id: `rcpt_${String(receiptCounter++).padStart(3, '0')}`,
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
        if (lower.includes('why') || lower.includes('what happened') || lower.includes('tell me') || lower.includes('how are you')) {
          accumulators.perspective_taking.deltas.push(1);
          accumulators.perspective_taking.receipts.push({
            id: `rcpt_${String(receiptCounter++).padStart(3, '0')}`,
            turnNumber: turn.turnNumber,
            quote: turn.text,
            dimension: 'perspective_taking',
            observation: 'Asked open inquiry to understand counterpart\'s side'
          });
        }
        if (lower.includes('honestly') || lower.includes('directly') || lower.includes('not cool') || lower.includes('unacceptable') || lower.includes('stop')) {
          accumulators.directness.deltas.push(2);
          accumulators.boundary_expression.deltas.push(1);
          accumulators.directness.receipts.push({
            id: `rcpt_${String(receiptCounter++).padStart(3, '0')}`,
            turnNumber: turn.turnNumber,
            quote: turn.text,
            dimension: 'directness',
            observation: 'Used explicit, unambiguous phrasing'
          });
        }
        if (lower.includes('no worries') || lower.includes('it is fine') || lower.includes('all good')) {
          accumulators.boundary_expression.deltas.push(-1);
          accumulators.conflict_engagement.deltas.push(-1);
          accumulators.boundary_expression.receipts.push({
            id: `rcpt_${String(receiptCounter++).padStart(3, '0')}`,
            turnNumber: turn.turnNumber,
            quote: turn.text,
            dimension: 'boundary_expression',
            observation: 'Chose casual accommodation to diffuse tension'
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

    if (n === 0) {
      scoresRecord[dim] = {
        dimension: dim,
        label: dimensionMeta[dim].label,
        score: null,
        status: 'insufficient_evidence',
        summary: `Not observed in this scenario (0 of 2 observations). The dialogue paths chosen did not test this dimension. Play 2 more scenarios to unlock.`,
        evidenceIds: [],
        observationsCount: 0,
        scenariosNeededToUnlock: 2,
        partialScore: null
      };
      continue;
    }

    const netSum = acc.deltas.reduce((a, b) => a + b, 0);
    const rawScore = 50 + (netSum * 11);
    const clampedScore = Math.min(95, Math.max(15, rawScore));

    if (n === 1) {
      scoresRecord[dim] = {
        dimension: dim,
        label: dimensionMeta[dim].label,
        score: clampedScore,
        status: 'insufficient_evidence',
        summary: `Emerging signal (1 of 2 observations recorded): Early choices lean towards ~${clampedScore}/100. Play 1 more scenario touching this dimension to confirm calibration.`,
        evidenceIds: acc.receipts.map(r => r.id),
        observationsCount: 1,
        scenariosNeededToUnlock: 1,
        partialScore: clampedScore
      };
      continue;
    }

    const hasPos = acc.deltas.some(d => d > 0);
    const hasNeg = acc.deltas.some(d => d < 0);
    const spread = Math.max(...acc.deltas) - Math.min(...acc.deltas);

    if (hasPos && hasNeg && spread >= 2 && Math.abs(netSum) <= 1) {
      scoresRecord[dim] = {
        dimension: dim,
        label: dimensionMeta[dim].label,
        score: 50,
        status: 'context_dependent',
        summary: 'Context-dependent: Your responses shifted significantly between turns, adapting between firmness and conciliation.',
        evidenceIds: acc.receipts.map(r => r.id),
        observationsCount: n,
        scenariosNeededToUnlock: 0,
        partialScore: null
      };
      continue;
    }

    let summaryText = dimensionMeta[dim].midDesc;
    if (clampedScore >= 65) {
      summaryText = dimensionMeta[dim].highDesc;
    } else if (clampedScore <= 35) {
      summaryText = dimensionMeta[dim].lowDesc;
    }

    scoresRecord[dim] = {
      dimension: dim,
      label: dimensionMeta[dim].label,
      score: clampedScore,
      status: 'evaluated',
      summary: summaryText,
      evidenceIds: acc.receipts.map(r => r.id),
      observationsCount: n,
      scenariosNeededToUnlock: 0,
      partialScore: null
    };
  }

  return {
    scores: scoresRecord as Record<BehavioralDimension, DimensionScoreResult>,
    receipts: allReceipts
  };
}

/**
 * Generate rich contextual followup choices (4-5 options per turn) across all 5 turns.
 */
export function getDynamicFollowupChoices(scenario: ScenarioDefinition, turnNumber: number): ChoiceOption[] {
  const t = Math.min(turnNumber, 4);

  if (scenario.id === 'unexpected-message') {
    return [
      {
        id: `opt_maya_t${t}_honest_closure`,
        label: 'Seek Direct Closure',
        text: 'I appreciate the apology, Maya, but what actually happened back then? You vanished into thin air for 8 months.',
        impacts: [
          { dimension: 'boundary_expression', delta: 2, reason: 'Demanded honest closure before moving forward' },
          { dimension: 'directness', delta: 2, reason: 'Addressed past ghosting head-on' }
        ]
      },
      {
        id: `opt_maya_t${t}_coffee_plan`,
        label: 'Propose In-Person Catch Up',
        text: 'Texts are terrible for deep debriefs. Let us grab a quiet coffee this weekend and catch up properly.',
        impacts: [
          { dimension: 'directness', delta: 1, reason: 'Initiated direct in-person reconnection' },
          { dimension: 'conflict_engagement', delta: 1, reason: 'Proactively stepped into reconnection' }
        ]
      },
      {
        id: `opt_maya_t${t}_gentle_empathy`,
        label: 'Empathetic Reassurance',
        text: 'Life gets heavy sometimes, I get it. I am just really glad you are okay and felt safe reaching out.',
        impacts: [
          { dimension: 'perspective_taking', delta: 2, reason: 'Provided emotional safety and non-judgmental acceptance' },
          { dimension: 'conflict_engagement', delta: -1, reason: 'Focused on warmth over past accountability' }
        ]
      },
      {
        id: `opt_maya_t${t}_keep_casual`,
        label: 'Keep Low-Investment Distance',
        text: 'Haha totally. Well keep me posted on how your art projects turn out! Take care.',
        impacts: [
          { dimension: 'boundary_expression', delta: 2, reason: 'Maintained polite but low-investment emotional distance' },
          { dimension: 'directness', delta: 1, reason: 'Gently closed the door without drama' }
        ]
      },
      {
        id: `opt_maya_t${t}_playful_challenge`,
        label: 'Playful Loyalty Test',
        text: 'Only under one condition: if we reconnect, no vanishing acts until at least 2028. Deal?',
        impacts: [
          { dimension: 'boundary_expression', delta: 1, reason: 'Set playful boundary terms for the future' },
          { dimension: 'conflict_engagement', delta: 1, reason: 'Lighthearted accountability' }
        ]
      }
    ];
  }

  if (scenario.id === 'forgotten-plan') {
    return [
      {
        id: `opt_jordan_t${t}_hold_accountable`,
        label: 'Establish Firm Accountability',
        text: 'Jordan, I need you to understand that constantly overpromising and bailing drains trust. I want to see you, but only when you can actually protect the time.',
        impacts: [
          { dimension: 'boundary_expression', delta: 2, reason: 'Held firm line on relationship reliability' },
          { dimension: 'directness', delta: 2, reason: 'Named the erosion of trust plainly' }
        ]
      },
      {
        id: `opt_jordan_t${t}_support_burnout`,
        label: 'Offer Burnout Support',
        text: 'Honestly you sound completely drowned. Eat something and get through the crisis tonight. We will regroup Sunday when you can breathe.',
        impacts: [
          { dimension: 'perspective_taking', delta: 2, reason: 'Supported friend\'s acute distress' },
          { dimension: 'conflict_engagement', delta: -1, reason: 'Postponed discussion to relieve pressure' }
        ]
      },
      {
        id: `opt_jordan_t${t}_calendar_rule`,
        label: 'Require Tangible Commitment',
        text: 'Next time we make plans, put it as a tentative hold on your calendar so your clients do not steamroll it.',
        impacts: [
          { dimension: 'conflict_engagement', delta: 1, reason: 'Proposed concrete systemic solution' },
          { dimension: 'boundary_expression', delta: 1, reason: 'Asserted practical expectations' }
        ]
      },
      {
        id: `opt_jordan_t${t}_dinner_solo`,
        label: 'Go Solo Unfazed',
        text: 'All good. I am already dressed so I am taking myself out to that ramen bar anyway! Good luck with the deck.',
        impacts: [
          { dimension: 'boundary_expression', delta: 2, reason: 'Demonstrated emotional self-sufficiency' },
          { dimension: 'directness', delta: 1, reason: 'Unfazed independence' }
        ]
      },
      {
        id: `opt_jordan_t${t}_pause_plans`,
        label: 'Pause Future Plans',
        text: 'Let us take a break from planning dinner until your client crunch passes. Reach out when your schedule stabilizes.',
        impacts: [
          { dimension: 'boundary_expression', delta: 2, reason: 'Protected bandwidth by freezing open-ended cancellations' },
          { dimension: 'directness', delta: 2, reason: 'Clear boundary action' }
        ]
      }
    ];
  }

  if (scenario.id === 'group-chat-dilemma') {
    return [
      {
        id: `opt_leo_t${t}_lock_in`,
        label: 'Force Binary Decision',
        text: 'Alright team, reservation link expires in 2 hours. If you are in, send your $50 deposit right now. Otherwise I am releasing the cabin.',
        impacts: [
          { dimension: 'directness', delta: 2, reason: 'Forced actionable resolution with high stakes' },
          { dimension: 'boundary_expression', delta: 2, reason: 'Refused to carry emotional labor of chasing adults' }
        ]
      },
      {
        id: `opt_leo_t${t}_delegate_leo`,
        label: 'Pass the Baton to Leo',
        text: 'Since Leo broke the silence with a dog meme, Leo is now officially Head of Trip Logistics. Ball is in your court, Leo!',
        impacts: [
          { dimension: 'conflict_engagement', delta: 1, reason: 'Playfully transferred responsibility' },
          { dimension: 'perspective_taking', delta: 1, reason: 'Engaged friend\'s humor productively' }
        ]
      },
      {
        id: `opt_leo_t${t}_check_mood`,
        label: 'Check Group Energy',
        text: 'Is everyone secretly feeling too busy for a trip right now? Be honest, no judgment if we should push to next month.',
        impacts: [
          { dimension: 'perspective_taking', delta: 2, reason: 'Gave group permission to voice silent reservations' },
          { dimension: 'directness', delta: 1, reason: 'Brought unspoken feelings to the surface' }
        ]
      },
      {
        id: `opt_leo_t${t}_laugh_along`,
        label: 'Join the Meme Train',
        text: 'Hahaha that dog is literally running on 2% battery. Okay fine, group trips are a logistical nightmare, let us just get drinks Friday.',
        impacts: [
          { dimension: 'conflict_engagement', delta: -2, reason: 'Surrendered logistical initiative to match casual tone' },
          { dimension: 'boundary_expression', delta: -1, reason: 'Folded own plan to keep group light' }
        ]
      },
      {
        id: `opt_leo_t${t}_private_core`,
        label: 'Book with the Core Crew',
        text: 'Hey Leo, DM me. If it is just you, me, and Maya, we can downsize the cabin and book right now.',
        impacts: [
          { dimension: 'directness', delta: 2, reason: 'Decisive pragmatic move around passive bystanders' },
          { dimension: 'boundary_expression', delta: 1, reason: 'Filtered for committed participants' }
        ]
      }
    ];
  }

  if (scenario.id === 'boundary-joke') {
    return [
      {
        id: `opt_marcus_t${t}_clear_line`,
        label: 'Uncompromising Respect Line',
        text: 'Marcus, funny banter punches up. Punching down on someone\'s livelihood isn\'t wit, it is insecurity. We are done joking about this.',
        impacts: [
          { dimension: 'boundary_expression', delta: 2, reason: 'Uncompromisingly asserted self-respect' },
          { dimension: 'directness', delta: 2, reason: 'Exposed defense mechanism plainly' }
        ]
      },
      {
        id: `opt_marcus_t${t}_private_unpack`,
        label: 'Private Reality Check',
        text: 'Look, you are a fun guy, but you have this habit of taking cheap shots when people are around. What is that about?',
        impacts: [
          { dimension: 'perspective_taking', delta: 2, reason: 'Inquired into counterpart\'s social competition habit' },
          { dimension: 'conflict_engagement', delta: 2, reason: 'Confronted behavioral pattern constructively' }
        ]
      },
      {
        id: `opt_marcus_t${t}_reset_dinner`,
        label: 'Graceful Table Reset',
        text: 'Apology accepted. Let us change the topic and enjoy the rest of dinner without turning each other into targets.',
        impacts: [
          { dimension: 'conflict_engagement', delta: 1, reason: 'De-escalated and restored group equilibrium' },
          { dimension: 'boundary_expression', delta: 1, reason: 'Closed the incident with poise' }
        ]
      },
      {
        id: `opt_marcus_t${t}_witty_counter_point`,
        label: 'Playful Warning Shot',
        text: 'Just remember Marcus, I know enough embarrassing stories from college to write a three-volume biography. Tread lightly.',
        impacts: [
          { dimension: 'conflict_engagement', delta: 1, reason: 'Signaled deterrence through humor' },
          { dimension: 'boundary_expression', delta: 1, reason: 'Warned counterpart off with banter' }
        ]
      },
      {
        id: `opt_marcus_t${t}_leave_table`,
        label: 'Vote with Your Feet',
        text: 'I am actually going to head out. Thanks for the dinner everyone, catch you guys another time.',
        impacts: [
          { dimension: 'boundary_expression', delta: 2, reason: 'Refused to stay in an uncomfortable social environment' },
          { dimension: 'directness', delta: 2, reason: 'Decisive physical boundary' }
        ]
      }
    ];
  }

  if (scenario.id === 'credit-taken') {
    return [
      {
        id: `opt_elena_t${t}_joint_email`,
        label: 'Mandate Joint Recap Email',
        text: 'Elena, to keep visibility aligned with leadership, I will draft the joint recap email outlining my benchmark scripts and send it from both of us.',
        impacts: [
          { dimension: 'boundary_expression', delta: 2, reason: 'Secured structural credit protection through written trail' },
          { dimension: 'directness', delta: 2, reason: 'Left zero room for individual credit appropriation' }
        ]
      },
      {
        id: `opt_elena_t${t}_strategic_partnership`,
        label: 'Frame as Mutual Strength',
        text: 'We are a lethal team when our partnership is clean. We do not need to elbow each other for director visibility—there is plenty of credit for both of us.',
        impacts: [
          { dimension: 'perspective_taking', delta: 2, reason: 'Framed situation as abundant mutual alliance' },
          { dimension: 'conflict_engagement', delta: 1, reason: 'Constructive collaborative de-escalation' }
        ]
      },
      {
        id: `opt_elena_t${t}_direct_warning`,
        label: 'Plain Professional Warning',
        text: 'If my work is presented as solo effort again, I will correct it live on the call next time instead of waiting for a 1-on-1.',
        impacts: [
          { dimension: 'boundary_expression', delta: 2, reason: 'Established severe consequences for repeated violation' },
          { dimension: 'directness', delta: 2, reason: 'Clear unambiguous professional line' }
        ]
      },
      {
        id: `opt_elena_t${t}_curious_motive`,
        label: 'Inquire Into Pressure',
        text: 'Are you feeling under intense pressure for the quarterly review? Help me understand why you felt the need to claim the benchmarks alone.',
        impacts: [
          { dimension: 'perspective_taking', delta: 2, reason: 'Inquired into counterpart\'s career anxieties' },
          { dimension: 'directness', delta: 1, reason: 'Direct yet psychologically curious' }
        ]
      },
      {
        id: `opt_elena_t${t}_separate_projects`,
        label: 'Propose Divided Scope',
        text: 'For the next sprint, let us take completely separate workstreams so attribution is clean and painless for both of us.',
        impacts: [
          { dimension: 'boundary_expression', delta: 2, reason: 'Divided territory to eliminate conflict' },
          { dimension: 'conflict_engagement', delta: 1, reason: 'Pragmatic structural detachment' }
        ]
      }
    ];
  }

  // Flirt Lab defaults (cafe-spark & gallery-compliment)
  return [
    {
      id: `opt_flirt_t${t}_bold_interest`,
      label: 'Bold Expressive Chemistry',
      text: 'I came in here for a quiet coffee, but talking to you just made this rainy afternoon ten times more interesting.',
      impacts: [
        { dimension: 'directness', delta: 2, reason: 'Directly and courageously signaled authentic romantic chemistry' },
        { dimension: 'conflict_engagement', delta: 1, reason: 'Embraced vulnerable social exposure' }
      ]
    },
    {
      id: `opt_flirt_t${t}_intellectual_inquiry`,
      label: 'Deep Passion Inquiry',
      text: 'Tell me the one passage or detail that completely changed the way you view the world. I want the real answer.',
      impacts: [
        { dimension: 'perspective_taking', delta: 2, reason: 'Invited substantive personal vulnerability and worldview' },
        { dimension: 'directness', delta: 1, reason: 'Warm intellectual depth' }
      ]
    },
    {
      id: `opt_flirt_t${t}_playful_banter`,
      label: 'Playful Banter Sparring',
      text: 'Careful now, you are making dangerous claims. If you are wrong about that ending, you are buying the croissants.',
      impacts: [
        { dimension: 'directness', delta: 1, reason: 'Flirtatious playful teasing' },
        { dimension: 'conflict_engagement', delta: 1, reason: 'Dynamic back-and-forth tension' }
      ]
    },
    {
      id: `opt_flirt_t${t}_gentle_boundary`,
      label: 'Warm Grounded Pace',
      text: 'I really enjoyed this spontaneous moment with you. Let me give you my number so we can continue this over proper drinks.',
      impacts: [
        { dimension: 'boundary_expression', delta: 1, reason: 'Controlled the pacing of the interaction gracefully' },
        { dimension: 'directness', delta: 2, reason: 'Clear decisive invitation' }
      ]
    },
    {
      id: `opt_flirt_t${t}_respectful_bow`,
      label: 'Graceful Respectful Exit',
      text: 'Thank you for the wonderful conversation! I will let you get back to your reading now before I ruin the next chapter.',
      impacts: [
        { dimension: 'boundary_expression', delta: 2, reason: 'Honored personal boundaries and situational respect' },
        { dimension: 'perspective_taking', delta: 1, reason: 'Attuned to counterpart\'s space' }
      ]
    }
  ];
}

/**
 * Generate deep, multi-sentence in-character dialogue reacting dynamically to user choices.
 */
export function simulateTurn(payload: TurnRequest): TurnResponse {
  const scenario = SCENARIOS.find(s => s.id === payload.scenarioId) || SCENARIOS[0];
  const userTurns = payload.history.filter(t => t.speaker === 'user');
  const userTurnCount = userTurns.length;
  const canContinue = userTurnCount < scenario.maxTurns;
  const text = payload.userMessage.toLowerCase();

  let reply = 'I hear what you are saying, and I appreciate you laying it out so clearly for me.';
  let characterMood = scenario.character.quirks?.initialMood || 'neutral';
  let characterMoodDescription = scenario.character.quirks?.initialMoodDesc || 'Assessing conversational temperature';

  if (scenario.id === 'unexpected-message') {
    if (!canContinue) {
      reply = 'I am really glad we had this conversation tonight. It was scary reaching out after vanishing, but you were so real with me. Let us grab that coffee when you are free—no pressure, on your terms.';
      characterMood = 'warm';
      characterMoodDescription = 'Deeply relieved, grateful for mutual emotional honesty';
    } else if (text.includes('bermuda') || text.includes('😂') || text.includes('resurface')) {
      reply = 'Haha fair call! I deserve that roast completely. Work swallowed me whole and then the longer I waited, the more awkward I felt reaching out. But I really missed your energy and had to break the silence.';
      characterMood = 'amused';
      characterMoodDescription = 'Amused and disarmed by your playful tease; awkward tension dissolved';
    } else if (text.includes('eight months') || text.includes('prompted') || text.includes('silence')) {
      reply = 'Oof, seeing "eight months" typed out hits like a truck. You are completely right to call it out. I had a brutal transition leaving my design studio and crawled into a shell, but it wasn\'t fair to leave you hanging. I wanted to apologize properly.';
      characterMood = 'hesitant';
      characterMoodDescription = 'Contrite, taking full accountability for the ghosting';
    } else if (text.includes('hurt') || text.includes('cautious') || text.includes('boundary')) {
      reply = 'I completely understand why you would be guarded. Vanishing like that was selfish, and I do not expect you to just pretend it did not happen. If you need space or want to take things slow, I fully respect that.';
      characterMood = 'guarded';
      characterMoodDescription = 'Humbled and respectful, honoring your declared boundary';
    } else if (text.includes('closure') || text.includes('actually happened')) {
      reply = 'Honestly? I had a major panic attack in October, dropped client contracts, and felt like such a failure that I couldn\'t face anyone who knew me as "the thriving creative". It was pure shame. You deserved an explanation back then.';
      characterMood = 'warm';
      characterMoodDescription = 'Vulnerable, opening up about hidden burnout and shame';
    } else {
      reply = 'I know it was totally out of the blue, but your reply made my week. Life has been a whirlwind lately, but hearing your voice grounds me.';
      characterMood = 'warm';
      characterMoodDescription = 'Relieved, glad the door was not slammed shut';
    }
  } else if (scenario.id === 'forgotten-plan') {
    if (!canContinue) {
      reply = 'You gave me the reality check I desperately needed. I am putting a hard block on my calendar for next week and turning off Slack notifications. Thank you for holding me accountable instead of just letting it rot.';
      characterMood = 'relieved';
      characterMoodDescription = 'Genuinely accountable, thankful for clear boundaries';
    } else if (text.includes('third time') || text.includes('disposable') || text.includes('pattern')) {
      reply = 'Seeing "third time" and "disposable" written out makes me feel sick to my stomach. You are 100% right. My lack of boundaries at work is leaking into my friendships, and it is completely unfair to treat your evening like a backup plan. I am so sorry.';
      characterMood = 'hesitant';
      characterMoodDescription = 'Stung by the mirror, realizing the real interpersonal cost of workaholism';
    } else if (text.includes('disappointed') || text.includes('clear heads') || text.includes('space')) {
      reply = 'I respect that completely. You have every right to be angry and take space. Go enjoy your evening, and whenever you are ready to talk next week, I will be here. I promise to listen.';
      characterMood = 'guarded';
      characterMoodDescription = 'Subdued and giving you space, respecting your emotional perimeter';
    } else if (text.includes('solo') || text.includes('myself out') || text.includes('dressed')) {
      reply = 'Haha damn, now I am double jealous! You go crush that ramen. But seriously, thank you for not letting me ruin your entire evening. I will make this up to you.';
      characterMood = 'relieved';
      characterMoodDescription = 'Impressed by your independence, eager to redeem reputation';
    } else {
      reply = 'I feel awful about this scramble. My VP dropped a fire drill at 5:15 PM and I did not know how to say no. I need to get better at managing this.';
      characterMood = 'annoyed';
      characterMoodDescription = 'Frustrated with work demands, striving to keep your friendship';
    }
  } else if (scenario.id === 'boundary-joke') {
    if (!canContinue) {
      reply = 'Hey, I really respect the way you handled that. A lot of people would have either blown up or secretly hated me for months. You told me straight to my face where the line was. Lesson learned, I promise.';
      characterMood = 'warm';
      characterMoodDescription = 'Chastened, respecting your poise and boundary';
    } else if (text.includes('livelihood') || text.includes('crossed a line') || text.includes('not cool')) {
      reply = 'Whoa... you are right. When you put it like that, it sounds terrible. I was trying to get a cheap laugh from the table and did not stop to think how it felt from your shoes. That was stupid of me, I am genuinely sorry.';
      characterMood = 'hesitant';
      characterMoodDescription = 'Deflated, realizing the joke was cruel rather than clever';
    } else if (text.includes('outside') || text.includes('privately') || text.includes('audience')) {
      reply = 'Yeah, let us step out. [Marcus steps into the hallway, hands in pockets] Look, I got caught up trying to be the loud entertainer at the table. I didn\'t mean to undermine you.';
      characterMood = 'guarded';
      characterMoodDescription = 'Relieved to be away from the crowd, ready to listen without posturing';
    } else if (text.includes('spreadsheet') || text.includes('junior desk') || text.includes('retaliation')) {
      reply = 'Ouch! Alright, fair shot! I walked right into that one. Touché. But seriously, truce? I know when I have crossed the line.';
      characterMood = 'amused';
      characterMoodDescription = 'Taking the hit gracefully, recognizing they got out-sparred';
    } else {
      reply = 'Point taken. I will dial it down. Let us get another round and reset.';
      characterMood = 'relieved';
      characterMoodDescription = 'Accepting the correction, seeking to de-escalate';
    }
  } else if (scenario.id === 'credit-taken') {
    if (!canContinue) {
      reply = 'Understood. The joint recap email is going out with both our names prominently credited on the benchmarks. Moving forward, we will review attribution slides together. Thank you for addressing this directly with me.';
      characterMood = 'warm';
      characterMoodDescription = 'Professional respect established; partnership saved from resentment';
    } else if (text.includes('individual initiative') || text.includes('weekend') || text.includes('co-credited')) {
      reply = 'I hear you, and you are right—those benchmarks were your work. On the call I was trying to keep the executive narrative concise and said "I" instead of "we". It was an oversight, but I can see how it looked like I was taking credit. Let us fix it in the recap notes.';
      characterMood = 'hesitant';
      characterMoodDescription = 'Conceding the factual point, protecting professional reputation';
    } else if (text.includes('separate') || text.includes('warning') || text.includes('live on the call')) {
      reply = 'I would strongly prefer we do not escalate this in front of leadership. I am telling you right now that it was an inadvertent slip of the tongue. I am happy to CC you and highlight your contributions.';
      characterMood = 'guarded';
      characterMoodDescription = 'Defensive, feeling the heat of potential public exposure';
    } else {
      reply = 'I appreciate you bringing this to me 1-on-1 rather than letting it turn into silent resentment. Let us align on tomorrow\'s recap.';
      characterMood = 'relieved';
      characterMoodDescription = 'Glad the conflict was contained professionally';
    }
  } else {
    // Flirt Lab and others
    if (!canContinue) {
      reply = 'It is so rare to meet someone who can banter like that without putting up a false front. Let us definitely finish this conversation over dinner sometime soon.';
      characterMood = 'warm';
      characterMoodDescription = 'Enamored and impressed by your conversational authenticity';
    } else if (text.includes('ten times more interesting') || text.includes('chemistry') || text.includes('espresso')) {
      reply = '[Laughs warmly, tucking hair behind ear] Bold move! I respect someone who doesn\'t hide behind generic small talk. Sit down—the espresso is on me if your defense of chapter 12 actually holds up.';
      characterMood = 'amused';
      characterMoodDescription = 'Delighted by your direct flirtation and confidence';
    } else if (text.includes('world') || text.includes('brushwork') || text.includes('passion')) {
      reply = 'You actually care about what is under the surface, don\'t you? That is refreshing. Look at that corner right there—it represents the exact moment when order collapses into freedom.';
      characterMood = 'warm';
      characterMoodDescription = 'Intellectually captivated, sharing genuine vulnerability';
    } else {
      reply = 'You have a very disarming way of speaking. Tell me more about what brought you here tonight.';
      characterMood = 'warm';
      characterMoodDescription = 'Curious and engaged in reciprocal social rapport';
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
 * Generate post-game synthesis reflection, evidence receipts, and bespoke archetype debrief.
 */
export function simulateReport(payload: ReportRequest): ReportResponse {
  const scenario = SCENARIOS.find(s => s.id === payload.scenarioId) || SCENARIOS[0];
  const scoringResult = computeScores({ scenarioId: payload.scenarioId, history: payload.history });

  const directness = scoringResult.scores.directness?.score ?? 50;
  const boundary = scoringResult.scores.boundary_expression?.score ?? 50;
  const conflict = scoringResult.scores.conflict_engagement?.score ?? 50;
  const perspective = scoringResult.scores.perspective_taking?.score ?? 50;

  // Extract user choices from transcript to build bespoke, personalized receipts
  const userTurns = payload.history.filter(t => t.speaker === 'user');
  const userQuotes = userTurns.map(t => t.text);
  const primaryQuote = userQuotes[0] || 'I hear what you are saying';
  const secondaryQuote = userQuotes[1] || userQuotes[0] || '';

  // Determine user's dynamic behavioral archetype
  let archetype = 'The Calibrated Tactician';
  let archetypeTagline = 'Balancing clarity, boundaries, and social attunement';
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

  // Dynamic Observed Patterns tailored to user's transcript
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

  // Dynamic Alternative Approaches
  const alternativeApproaches = [
    directness >= 65
      ? `Test pairing direct statements with an open curiosity inquiry (e.g. "Here is my view, but what is driving this on your end?") to lower counterpart defense.`
      : `Experiment with stating the hard boundary 10% earlier in the exchange instead of giving multiple exploratory cushions.`,
    conflict >= 60
      ? `Try taking a temporary emotional pause before addressing acute friction to let the other person decompress.`
      : `Practice leaning into the friction in real time rather than deferring the resolution to future dates.`
  ];

  const whatWeCannotKnow = [
    `How you communicate under chronic fatigue or high financial stakes in the real world.`,
    `Long-term relational patterns built over years of deep trust versus a rapid conversational moment.`,
    `Your unspoken internal thoughts that were felt internally without being sent into the dialogue.`
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
    mockMode: true,
    archetype,
    archetypeTagline,
    howItLanded
  };
}
