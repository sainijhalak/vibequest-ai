import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/server.js';

describe('VibeQuest AI API Integration Tests', () => {
  it('GET /api/health returns healthy status and mock mode information', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.version).toBe('1.0.0');
    expect(res.body.model).toBeDefined();
    expect(typeof res.body.mockMode).toBe('boolean');
  });

  it('GET /api/scenarios returns available scenarios across all modes', async () => {
    const res = await request(app).get('/api/scenarios');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBeGreaterThanOrEqual(3);

    const modes = res.body.data.map((s: any) => s.mode);
    expect(modes).toContain('social_simulator');
    expect(modes).toContain('conflict_arena');
    expect(modes).toContain('flirt_lab');
  });

  it('GET /api/scenarios/:id returns specific scenario by ID', async () => {
    const res = await request(app).get('/api/scenarios/unexpected-message');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe('unexpected-message');
    expect(res.body.data.character.name).toBe('Maya Lin');
  });

  it('GET /api/scenarios/:id returns 404 for unknown scenario', async () => {
    const res = await request(app).get('/api/scenarios/non-existent-id');
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('SCENARIO_NOT_FOUND');
  });

  it('POST /api/scenario/turn validates user message and rejects empty text with 400', async () => {
    const res = await request(app)
      .post('/api/scenario/turn')
      .send({
        scenarioId: 'unexpected-message',
        userMessage: '   ', // empty after trim
        history: []
      });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('POST /api/scenario/turn generates valid reply and next choices', async () => {
    const res = await request(app)
      .post('/api/scenario/turn')
      .send({
        scenarioId: 'unexpected-message',
        userMessage: 'Look who decided to resurface from the Bermuda Triangle! 😂',
        choiceId: 'opt_playful_tease',
        history: []
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.characterReply).toBeDefined();
    expect(res.body.data.characterReply.length).toBeGreaterThan(0);
    expect(res.body.data.turnCount).toBe(1);
    expect(res.body.data.canContinue).toBe(true);
    expect(res.body.data.nextChoices.length).toBeGreaterThan(0);
  });

  it('POST /api/report computes scores and synthesizes reflection with evidence receipts', async () => {
    const res = await request(app)
      .post('/api/report')
      .send({
        scenarioId: 'unexpected-message',
        history: [
          {
            turnNumber: 1,
            speaker: 'user',
            text: 'Hey Maya. It has been eight months. What prompted the sudden check-in tonight?',
            choiceId: 'opt_direct_inquiry',
            timestamp: new Date().toISOString()
          },
          {
            turnNumber: 1,
            speaker: 'character',
            text: 'Oof, you are completely right. I felt terrible about dropping off.',
            timestamp: new Date().toISOString()
          },
          {
            turnNumber: 2,
            speaker: 'user',
            text: 'Good to hear from you. Let us grab a quick coffee this weekend and catch up properly.',
            choiceId: 'opt_turn_2_coffee',
            timestamp: new Date().toISOString()
          }
        ]
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    const report = res.body.data;
    expect(report.scores.directness).toBeDefined();
    expect(report.scores.directness.status).toBe('evaluated');
    expect(report.vibeSnapshot).toBeDefined();
    expect(report.observedPatterns.length).toBeGreaterThan(0);
    expect(report.alternativeApproaches.length).toBeGreaterThan(0);
    expect(report.receipts.length).toBeGreaterThan(0);
    expect(report.whatWeCannotKnow.length).toBeGreaterThan(0);
  });

  it('Enforces 20kb request body limit and rejects oversized payloads', async () => {
    const largeString = 'A'.repeat(25 * 1024); // 25kb > 20kb
    const res = await request(app)
      .post('/api/scenario/turn')
      .send({
        scenarioId: 'unexpected-message',
        userMessage: largeString,
        history: []
      });

    // Express json parser with limit rejects with 413 Payload Too Large
    expect(res.status).toBe(413);
  });

  it('POST /api/scenario/turn returns character emotional mood and description', async () => {
    const res = await request(app)
      .post('/api/scenario/turn')
      .send({
        scenarioId: 'unexpected-message',
        userMessage: 'Look who decided to resurface from the Bermuda Triangle! 😂',
        choiceId: 'opt_playful_tease',
        history: []
      });

    expect(res.status).toBe(200);
    expect(res.body.data.characterMood).toBe('amused');
    expect(res.body.data.characterMoodDescription).toBeDefined();
    expect(typeof res.body.data.characterMoodDescription).toBe('string');
  });

  it('POST /api/score returns deterministic score vector and evidence receipts directly', async () => {
    const res = await request(app)
      .post('/api/score')
      .send({
        scenarioId: 'unexpected-message',
        history: [
          {
            turnNumber: 1,
            speaker: 'user',
            text: 'Hey Maya. It has been eight months. What prompted the sudden check-in tonight?',
            choiceId: 'opt_direct_inquiry',
            timestamp: new Date().toISOString()
          }
        ]
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.scenarioId).toBe('unexpected-message');
    expect(res.body.data.scores.directness).toBeDefined();
    expect(res.body.data.scores.directness.status).toBe('insufficient_evidence');
    expect(res.body.data.scores.directness.observationsCount).toBe(1);
    expect(res.body.data.scores.directness.scenariosNeededToUnlock).toBe(1);
    expect(res.body.data.receipts.length).toBeGreaterThan(0);
  });

  it('POST /api/score returns 404 for unknown scenario', async () => {
    const res = await request(app)
      .post('/api/score')
      .send({
        scenarioId: 'unknown-scenario-xyz',
        history: [
          {
            turnNumber: 1,
            speaker: 'user',
            text: 'Testing',
            timestamp: new Date().toISOString()
          }
        ]
      });

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('SCENARIO_NOT_FOUND');
  });

  it('POST /api/score returns 400 validation error when history is empty', async () => {
    const res = await request(app)
      .post('/api/score')
      .send({
        scenarioId: 'unexpected-message',
        history: []
      });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });
});


