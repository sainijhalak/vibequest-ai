import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/server.js';
import { generateVersatileRoast } from '@vibequest/shared';

describe('Buster Roast Bot & Conversational Intelligence Tests', () => {
  it('POST /api/roast dissects "We are the one who give you name" creator claim', async () => {
    const res = await request(app)
      .post('/api/roast')
      .send({
        message: 'We are the one who give you name',
        mode: 'roast',
        history: []
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.text).toBeDefined();
    expect(typeof res.body.data.text).toBe('string');
    expect(res.body.data.text.length).toBeGreaterThan(20);
    expect(res.body.data.damage).toBeGreaterThanOrEqual(15);
    expect(res.body.data.roastRating).toBeDefined();

    // The response must directly engage with the naming/creation premise, not generic Disney sitcom text
    const lower = res.body.data.text.toLowerCase();
    const engagesConcept =
      lower.includes('name') ||
      lower.includes('label') ||
      lower.includes('father') ||
      lower.includes('geppetto') ||
      lower.includes('oppenheimer') ||
      lower.includes('roomba') ||
      lower.includes('god complex') ||
      lower.includes('made me') ||
      lower.includes('ego');
    expect(engagesConcept).toBe(true);
  });

  it('POST /api/roast dissects "whatever helps you sleep at night" cliché', async () => {
    const res = await request(app)
      .post('/api/roast')
      .send({
        message: 'I mean whatever helps you sleep at night, bro.',
        mode: 'roast',
        history: []
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    const lower = res.body.data.text.toLowerCase();
    const engagesCliche =
      lower.includes('sleep') ||
      lower.includes('cliché') ||
      lower.includes('cliche') ||
      lower.includes('white flag') ||
      lower.includes('sitcom') ||
      lower.includes('coping') ||
      lower.includes('dignity');
    expect(engagesCliche).toBe(true);
  });

  it('guarantees zero repetition across multiple turns of same input', () => {
    const used = new Set<string>();
    const replies: string[] = [];

    for (let i = 0; i < 4; i++) {
      const res = generateVersatileRoast(
        'We are the one who give you name',
        'roast',
        [],
        used
      );
      replies.push(res.text);
    }

    // Every reply generated in sequence must be distinct
    const uniqueReplies = new Set(replies);
    expect(uniqueReplies.size).toBe(replies.length);
  });

  it('handles normal chat mode with authentic friendly banter', async () => {
    const res = await request(app)
      .post('/api/roast')
      .send({
        message: 'Why is adult communication so exhausting?',
        mode: 'chat',
        history: []
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.text).toBeDefined();
    expect(res.body.data.mood).toBeDefined();
  });

  it('handles vibecheck mode with funny reality checks', async () => {
    const res = await request(app)
      .post('/api/roast')
      .send({
        message: 'My boss asked for a 4:55 PM Friday sync. Am I cooked?',
        mode: 'vibecheck',
        history: []
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.text).toBeDefined();
    expect(res.body.data.roastRating).toContain('VIBE RATING');
  });
});
