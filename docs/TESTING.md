# 🧪 VibeQuest AI — Testing Strategy & Test Suite Guide

> **Reliability Principle**: Software dealing with user choices and AI synthesis must have rock-solid deterministic test suites. Every calculation, security boundary, and API route must be verified automatically.

---

## 1. Test Architecture & Tooling

VibeQuest AI uses **Vitest** and **Supertest** for fast, native ESM test execution:
- **Runner**: Vitest 3.0.7 (sub-second cold start, native TypeScript/ESM).
- **HTTP Integration**: Supertest 7.0.0 (in-memory Express server requests, testing real middleware and error handlers).
- **Mock Mode**: Tests run with `MOCK_AI=true`, ensuring 100% deterministic results without network calls or API token costs.

---

## 2. Running the Test Suite

### Run All Tests (Root)
```bash
npm test
```

### Run Server Tests in Watch Mode
```bash
npm run dev:server # or npx vitest in server/
```

### Run with Verbose Reporter
```bash
cd server && npx vitest run --reporter=verbose
```

---

## 3. Test Suites Overview

### Suite A: Deterministic Scoring Suite (`server/tests/scoring.test.ts`)
Verifies the mathematical core of the behavioral engine:

| Test Case | What It Validates | Pass Condition |
| :--- | :--- | :--- |
| **Direct calculation** | Adds option deltas to base 50. | Verified mathematically (e.g. $50 + 15 + 20 = 85$). |
| **Conflicting choices** | Detects contradictory user moves across turns. | Flags `uncertaintyFlag: 'context_dependent'` when spread $\ge 35$. |
| **Insufficient evidence** | Evaluates dimensions with only 1 data point. | Flags `uncertaintyFlag: 'insufficient_evidence'` if data points $< 2$. |
| **Score clamping** | Extreme deltas that would sum past 100 or below 0. | Clamped strictly to range $[15, 95]$. |
| **Evidence receipts** | Turn-by-turn trace extraction. | Receipts contain scenario title, turn number, verbatim quote, and delta. |

### Suite B: API Integration Suite (`server/tests/api.test.ts`)
Verifies HTTP endpoints, middleware, and validation gates:

| Test Case | Endpoint | HTTP Code | What It Validates |
| :--- | :--- | :---: | :--- |
| **Health Check** | `GET /api/health` | 200 | Returns status healthy and verifies Helmet security headers. |
| **Scenario Catalog** | `GET /api/scenarios` | 200 | Returns array of 7 scenarios with characters, tags, and initial choices. |
| **Advance Turn (Preset)** | `POST /api/scenario/turn` | 200 | Advances dialogue, returns character reply and dynamic follow-up options. |
| **Advance Turn (Write-in)**| `POST /api/scenario/turn` | 200 | Accepts custom user write-in string, returns responsive character reply. |
| **Scenario Not Found** | `POST /api/scenario/turn` | 404 | Rejects invalid scenario IDs with structured error envelope. |
| **Malformed Payload** | `POST /api/scenario/turn` | 400 | Rejects missing required fields via Zod validation. |
| **Report Generation** | `POST /api/report` | 200 | Synthesizes reflection from completed runs with spectrum scores & receipts. |
| **Body Size Limit** | `POST /api/scenario/turn` | 413 | Enforces 20kb limit and rejects oversized payloads. |

---

## 4. How to Add a New Test

To add a test for a new scenario or engine feature:

1. Open `server/tests/scoring.test.ts` or `server/tests/api.test.ts`.
2. Add a new `it()` block using Vitest's `describe` / `it` / `expect` primitives:

```typescript
it('flags playfulness accurately on high-wit dialogue', () => {
  const mockRuns = [
    {
      scenarioId: 'flirt_coffee_meet',
      scenarioTitle: 'The Accidental Double Take',
      mode: 'flirt_lab',
      turns: [
        {
          turnNumber: 1,
          userChoice: {
            id: 'playful_banter',
            text: 'Careful, if your latte art is that good, people might think you practice.',
            tone: 'playful',
            impacts: { playfulness_vs_gravity: 25 },
          },
          characterReply: 'Sam laughs.',
        },
        {
          turnNumber: 2,
          userChoice: {
            id: 'tease_more',
            text: 'I guess I will have to be the judge of that.',
            tone: 'playful',
            impacts: { playfulness_vs_gravity: 20 },
          },
          characterReply: 'Sam winks.',
        },
      ],
      completedAt: new Date().toISOString(),
    },
  ];

  const results = computeScores(mockRuns);
  const playScore = results.get('playfulness_vs_gravity');

  expect(playScore?.score).toBe(95); // 50 + 25 + 20 = 95
  expect(playScore?.uncertaintyFlag).toBe('sufficient');
});
```
