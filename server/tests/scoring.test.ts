import { describe, it, expect } from 'vitest';
import { computeScores } from '../src/engines/scoringEngine.js';
import { Turn } from '@vibequest/shared';

describe('Pure Deterministic Scoring Engine', () => {
  it('returns insufficient_evidence with honest partial score and unlock count when only 1 data point exists', () => {
    // Only 1 turn touching directness
    const history: Turn[] = [
      {
        turnNumber: 1,
        speaker: 'user',
        text: 'Look who decided to resurface from the Bermuda Triangle! 😂',
        choiceId: 'opt_playful_tease',
        timestamp: new Date().toISOString()
      }
    ];

    const result = computeScores({
      scenarioId: 'unexpected-message',
      history
    });

    // directness had only 1 delta -> insufficient_evidence with emerging clue
    expect(result.scores.directness.status).toBe('insufficient_evidence');
    expect(result.scores.directness.score).toBeNull();
    expect(result.scores.directness.observationsCount).toBe(1);
    expect(result.scores.directness.scenariosNeededToUnlock).toBe(1);
    expect(result.scores.directness.partialScore).toBeTypeOf('number');
    expect(result.scores.directness.summary).toContain('Emerging signal (1 of 2 observations recorded)');

    // perspective_taking had 0 deltas -> unobserved with 2 needed to unlock
    expect(result.scores.perspective_taking.observationsCount).toBe(0);
    expect(result.scores.perspective_taking.scenariosNeededToUnlock).toBe(2);
    expect(result.scores.perspective_taking.partialScore).toBeNull();
    expect(result.scores.perspective_taking.summary).toContain('Not observed in this scenario');
  });

  it('evaluates tendency when 2 or more data points confirm directness', () => {
    const history: Turn[] = [
      {
        turnNumber: 1,
        speaker: 'user',
        text: 'Hey Maya. It has been eight months. What prompted the sudden check-in tonight?',
        choiceId: 'opt_direct_inquiry',
        timestamp: new Date().toISOString()
      },
      {
        turnNumber: 2,
        speaker: 'user',
        text: 'Good to hear from you. Let us grab a quick coffee this weekend and catch up properly.',
        choiceId: 'opt_turn_2_coffee',
        timestamp: new Date().toISOString()
      }
    ];

    const result = computeScores({
      scenarioId: 'unexpected-message',
      history
    });

    expect(result.scores.directness.status).toBe('evaluated');
    expect(result.scores.directness.score).toBeGreaterThanOrEqual(65);
    expect(result.scores.directness.observationsCount).toBeGreaterThanOrEqual(2);
    expect(result.scores.directness.scenariosNeededToUnlock).toBe(0);
    expect(result.receipts.length).toBeGreaterThanOrEqual(2);
    expect(result.receipts[0].quote).toContain('eight months');
  });

  it('detects context_dependent behavior when choices give mixed signals', () => {
    const history: Turn[] = [
      {
        turnNumber: 1,
        speaker: 'user',
        text: 'Marcus, that was a rough chapter for me and turning it into a public punchline is not cool.',
        choiceId: 'opt_firm_boundary', // boundary +2, directness +2
        timestamp: new Date().toISOString()
      },
      {
        turnNumber: 2,
        speaker: 'user',
        text: 'Haha yeah yeah, very funny. Drinks are on you for that one.',
        choiceId: 'opt_brush_off', // boundary -2, conflict_engagement -2
        timestamp: new Date().toISOString()
      }
    ];

    const result = computeScores({
      scenarioId: 'boundary-joke',
      history
    });

    // Boundary has +2 and -2 (net 0) -> context_dependent
    expect(result.scores.boundary_expression.status).toBe('context_dependent');
    expect(result.scores.boundary_expression.score).toBe(50);
    expect(result.scores.boundary_expression.summary).toContain('Context-dependent');
  });

  it('handles empty run gracefully without crashing', () => {
    const result = computeScores({
      scenarioId: 'unexpected-message',
      history: []
    });

    for (const scoreResult of Object.values(result.scores)) {
      expect(scoreResult.status).toBe('insufficient_evidence');
      expect(scoreResult.score).toBeNull();
      expect(scoreResult.observationsCount).toBe(0);
      expect(scoreResult.scenariosNeededToUnlock).toBe(2);
    }
    expect(result.receipts).toHaveLength(0);
  });

  it('analyzes custom text heuristics deterministically', () => {
    const history: Turn[] = [
      {
        turnNumber: 1,
        speaker: 'user',
        text: 'I feel like this is not okay and crossed a boundary.',
        isCustom: true,
        timestamp: new Date().toISOString()
      },
      {
        turnNumber: 2,
        speaker: 'user',
        text: 'Honestly we need to talk about respect and stop doing this.',
        isCustom: true,
        timestamp: new Date().toISOString()
      }
    ];

    const result = computeScores({
      scenarioId: 'boundary-joke',
      history
    });

    expect(result.scores.boundary_expression.status).toBe('evaluated');
    expect(result.scores.boundary_expression.score).toBeGreaterThan(65);
    expect(result.receipts.some(r => r.observation.includes('boundaries'))).toBe(true);
  });

  it('clamps all numerical scores between 15 and 95', () => {
    // Extreme accumulation of 5 direct choices
    const history: Turn[] = [
      { turnNumber: 1, speaker: 'user', text: 'direct 1', choiceId: 'opt_direct_inquiry', timestamp: new Date().toISOString() },
      { turnNumber: 2, speaker: 'user', text: 'direct 2', choiceId: 'opt_direct_inquiry', timestamp: new Date().toISOString() },
      { turnNumber: 3, speaker: 'user', text: 'direct 3', choiceId: 'opt_direct_inquiry', timestamp: new Date().toISOString() },
      { turnNumber: 4, speaker: 'user', text: 'direct 4', choiceId: 'opt_direct_inquiry', timestamp: new Date().toISOString() },
      { turnNumber: 5, speaker: 'user', text: 'direct 5', choiceId: 'opt_direct_inquiry', timestamp: new Date().toISOString() }
    ];

    const result = computeScores({
      scenarioId: 'unexpected-message',
      history
    });

    for (const scoreResult of Object.values(result.scores)) {
      if (scoreResult.score !== null) {
        expect(scoreResult.score).toBeGreaterThanOrEqual(15);
        expect(scoreResult.score).toBeLessThanOrEqual(95);
      }
    }
  });
});
