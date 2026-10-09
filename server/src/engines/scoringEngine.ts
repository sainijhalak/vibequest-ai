import {
  BehavioralDimension,
  DimensionScoreResult,
  EvidenceReceipt,
  Turn,
  ScenarioDefinition
} from '@vibequest/shared';
import { SCENARIOS } from '../scenarios/data.js';
import { CharacterEngine } from './characterEngine.js';

export interface ScoringRun {
  scenarioId: string;
  history: Turn[];
}

export interface ScoringOutput {
  scores: Record<BehavioralDimension, DimensionScoreResult>;
  receipts: EvidenceReceipt[];
}

/**
 * Pure deterministic scoring function.
 * Evaluates behavioral tendencies from explicit choices and text heuristics.
 * Rule: Fewer than 2 data points -> 'insufficient_evidence' (score: null).
 * Rule: Conflicting signals -> 'context_dependent'.
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
          || CharacterEngine.getDynamicFollowupChoices(scenario, turn.turnNumber).find(c => c.id === turn.choiceId);

        if (choice) {
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

      if (!matchedChoice) {
        // Deterministic keyword heuristics for custom write-ins or unmatched choices
        const lower = turn.text.toLowerCase();

        // 1. Directness
        if (lower.includes('i feel') || lower.includes('i need') || lower.includes('honestly') || lower.includes('straight up') || lower.includes('directly') || lower.includes('what prompted') || lower.includes('eight months')) {
          accumulators.directness.deltas.push(2);
          accumulators.directness.receipts.push({
            id: `rcpt_${String(receiptCounter++).padStart(3, '0')}`,
            turnNumber: turn.turnNumber,
            quote: turn.text,
            dimension: 'directness',
            observation: 'Used explicit, first-person transparent assertion'
          });
        } else if (lower.includes('maybe') || lower.includes('idk') || lower.includes('never mind') || lower.includes('just wondering')) {
          accumulators.directness.deltas.push(-1);
          accumulators.directness.receipts.push({
            id: `rcpt_${String(receiptCounter++).padStart(3, '0')}`,
            turnNumber: turn.turnNumber,
            quote: turn.text,
            dimension: 'directness',
            observation: 'Used indirect cushioning or conversational hedging'
          });
        }

        // 2. Conflict Engagement
        if (lower.includes('talk about this') || lower.includes('resolve') || lower.includes('address') || lower.includes('let us talk') || lower.includes('confront')) {
          accumulators.conflict_engagement.deltas.push(2);
          accumulators.conflict_engagement.receipts.push({
            id: `rcpt_${String(receiptCounter++).padStart(3, '0')}`,
            turnNumber: turn.turnNumber,
            quote: turn.text,
            dimension: 'conflict_engagement',
            observation: 'Proactively leaned into resolving interpersonal friction'
          });
        } else if (lower.includes('cool down') || lower.includes('take space') || lower.includes('talk later') || lower.includes('another time') || lower.includes('let it go')) {
          accumulators.conflict_engagement.deltas.push(-2);
          accumulators.conflict_engagement.receipts.push({
            id: `rcpt_${String(receiptCounter++).padStart(3, '0')}`,
            turnNumber: turn.turnNumber,
            quote: turn.text,
            dimension: 'conflict_engagement',
            observation: 'Chose emotional cooling-off and delayed processing'
          });
        }

        // 3. Boundary Expression
        if (lower.includes('not okay') || lower.includes('boundary') || lower.includes('respect') || lower.includes('stop') || lower.includes('third time') || lower.includes('my credit')) {
          accumulators.boundary_expression.deltas.push(2);
          accumulators.boundary_expression.receipts.push({
            id: `rcpt_${String(receiptCounter++).padStart(3, '0')}`,
            turnNumber: turn.turnNumber,
            quote: turn.text,
            dimension: 'boundary_expression',
            observation: 'Explicitly declared personal boundaries or unacceptable treatment'
          });
        } else if (lower.includes('no worries at all') || lower.includes('do not stress') || lower.includes('it is fine') || lower.includes('whatever you want')) {
          accumulators.boundary_expression.deltas.push(-2);
          accumulators.boundary_expression.receipts.push({
            id: `rcpt_${String(receiptCounter++).padStart(3, '0')}`,
            turnNumber: turn.turnNumber,
            quote: turn.text,
            dimension: 'boundary_expression',
            observation: 'Accommodated counterpart by suppressing personal boundaries'
          });
        }

        // 4. Perspective Taking
        if (lower.includes('how are you') || lower.includes('what happened') || lower.includes('your side') || lower.includes('are you ok') || lower.includes('i understand')) {
          accumulators.perspective_taking.deltas.push(2);
          accumulators.perspective_taking.receipts.push({
            id: `rcpt_${String(receiptCounter++).padStart(3, '0')}`,
            turnNumber: turn.turnNumber,
            quote: turn.text,
            dimension: 'perspective_taking',
            observation: 'Attuned to and inquired into counterpart\'s emotional state'
          });
        }
      }
    }
  }

  const dimensionMeta: Record<BehavioralDimension, string> = {
    directness: 'Directness & Transparency',
    conflict_engagement: 'Conflict Engagement Stance',
    boundary_expression: 'Boundary Articulation',
    perspective_taking: 'Perspective Attunement'
  };

  const scores: Partial<Record<BehavioralDimension, DimensionScoreResult>> = {};
  const allReceipts: EvidenceReceipt[] = [];

  for (const dim of dimensions) {
    const acc = accumulators[dim];
    allReceipts.push(...acc.receipts);
    const count = acc.deltas.length;

    // Rule: Fewer than 2 data points -> Insufficient evidence yet (with honest partial clue)
    if (count < 2) {
      const partialScore = count === 1 ? Math.min(90, Math.max(20, Math.round(50 + (acc.deltas[0] * 12)))) : null;
      const summary = count === 1
        ? `Emerging signal (1 of 2 observations recorded): Early choices lean towards this stance, but play 1 more scenario touching this dimension to confirm.`
        : `Not observed in this scenario (0 of 2 observations): The choices in this encounter did not test this dimension. Play 2 more scenarios to unlock.`;

      scores[dim] = {
        dimension: dim,
        label: dimensionMeta[dim],
        score: null,
        status: 'insufficient_evidence',
        summary,
        evidenceIds: acc.receipts.map(r => r.id),
        observationsCount: count,
        scenariosNeededToUnlock: 2 - count,
        partialScore
      };
      continue;
    }

    const hasPositive = acc.deltas.some(d => d > 0);
    const hasNegative = acc.deltas.some(d => d < 0);
    const netSum = acc.deltas.reduce((sum, val) => sum + val, 0);

    // Rule: Mixed signals -> Context-dependent
    if (hasPositive && hasNegative && Math.abs(netSum) <= 1) {
      const normalizedScore = Math.max(20, Math.min(85, 50 + (netSum * 10)));
      scores[dim] = {
        dimension: dim,
        label: dimensionMeta[dim],
        score: normalizedScore,
        status: 'context_dependent',
        summary: 'Context-dependent: You adjusted this behavior based on situational stakes rather than sticking to a single rigid mode.',
        evidenceIds: acc.receipts.map(r => r.id),
        observationsCount: count,
        scenariosNeededToUnlock: 0,
        partialScore: null
      };
      continue;
    }

    // Evaluated tendency
    const normalizedScore = Math.max(15, Math.min(95, Math.round(50 + (netSum * 11))));
    let tendencySummary = '';
    if (normalizedScore >= 65) {
      tendencySummary = `Consistent proactive tendency toward ${dimensionMeta[dim].toLowerCase()}.`;
    } else if (normalizedScore <= 35) {
      tendencySummary = `Consistent measured preference toward reflective cushioning.`;
    } else {
      tendencySummary = `Balanced middle stance, calibrating between directness and caution.`;
    }

    scores[dim] = {
      dimension: dim,
      label: dimensionMeta[dim],
      score: normalizedScore,
      status: 'evaluated',
      summary: tendencySummary,
      evidenceIds: acc.receipts.map(r => r.id),
      observationsCount: count,
      scenariosNeededToUnlock: 0,
      partialScore: null
    };
  }

  return {
    scores: scores as Record<BehavioralDimension, DimensionScoreResult>,
    receipts: allReceipts
  };
}
