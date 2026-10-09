import {
  TurnRequest,
  TurnResponse,
  TurnResponseSchema,
  ReportRequest,
  ReportResponse,
  ReportResponseSchema,
  ScoreResponse,
  ScoreResponseSchema,
  HealthResponse,
  HealthResponseSchema,
  ScenarioDefinition,
  SCENARIOS,
  simulateTurn,
  simulateReport,
  computeScores
} from '@vibequest/shared';

// Read API Base URL from Vite environment variables (fallback to '/api')
const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '') + '/api';

export class ApiService {
  /**
   * Healthcheck to detect backend status and AI mode
   */
  public static async getHealth(): Promise<HealthResponse> {
    try {
      const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const data = await res.json();
        return HealthResponseSchema.parse(data);
      }
    } catch (_) {
      // Backend not running or unreachable
    }

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      model: 'client-simulation',
      mockMode: true,
      version: '1.0.0'
    };
  }

  /**
   * Fetch all scenarios or by mode
   */
  public static async getScenarios(mode?: string): Promise<ScenarioDefinition[]> {
    try {
      const url = mode ? `${API_BASE}/scenarios?mode=${mode}` : `${API_BASE}/scenarios`;
      const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data) && json.data.length > 0) {
          return json.data;
        }
      }
    } catch (_) {
      // Backend not running or unreachable
    }

    // Seamless fallback to shared scenario catalog
    return mode ? SCENARIOS.filter(s => s.mode === mode) : SCENARIOS;
  }

  /**
   * Fetch a single scenario by ID
   */
  public static async getScenario(id: string): Promise<ScenarioDefinition> {
    try {
      const res = await fetch(`${API_BASE}/scenarios/${id}`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const json = await res.json();
        if (json.data) return json.data;
      }
    } catch (_) {
      // Backend not running or unreachable
    }

    const found = SCENARIOS.find(s => s.id === id);
    if (!found) {
      throw new Error(`Scenario '${id}' not found.`);
    }
    return found;
  }

  /**
   * Submit dialogue turn (choice or custom text)
   * With automatic client simulation fallback if backend returns 404 or is offline.
   */
  public static async submitTurn(payload: TurnRequest): Promise<TurnResponse> {
    try {
      const res = await fetch(`${API_BASE}/scenario/turn`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10000)
      });

      if (res.ok) {
        const data = await res.json();
        return TurnResponseSchema.parse(data.data);
      }

      // If backend responded with 404 / 502 / 500, log and use client simulation
      console.warn(`[VibeQuest] Backend returned HTTP ${res.status}. Seamlessly falling back to local simulation engine.`);
      return simulateTurn(payload);
    } catch (err: any) {
      // If network offline or connection refused, seamlessly use client simulation
      console.warn('[VibeQuest] Live backend unreachable. Seamlessly using local simulation engine.', err?.message);
      return simulateTurn(payload);
    }
  }

  /**
   * Request raw deterministic score vector and receipts directly
   */
  public static async getScore(payload: ReportRequest): Promise<ScoreResponse> {
    try {
      const res = await fetch(`${API_BASE}/score`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(8000)
      });

      if (res.ok) {
        const data = await res.json();
        return ScoreResponseSchema.parse(data.data);
      }
    } catch (_) {
      // offline or unreachable fallback
    }

    const localResult = computeScores({ scenarioId: payload.scenarioId, history: payload.history });
    return {
      scores: localResult.scores,
      receipts: localResult.receipts
    };
  }

  /**
   * Request post-game reflection report
   * With automatic client simulation fallback if backend returns 404 or is offline.
   */
  public static async getReport(payload: ReportRequest): Promise<ReportResponse> {
    try {
      const res = await fetch(`${API_BASE}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(15000)
      });

      if (res.ok) {
        const data = await res.json();
        return ReportResponseSchema.parse(data.data);
      }

      console.warn(`[VibeQuest] Backend returned HTTP ${res.status}. Seamlessly falling back to local report synthesis.`);
      return simulateReport(payload);
    } catch (err: any) {
      console.warn('[VibeQuest] Live backend unreachable. Seamlessly generating local reflection report.', err?.message);
      return simulateReport(payload);
    }
  }

  /**
   * Submit message to Buster Roast Bot
   */
  public static async submitRoast(payload: {
    message: string;
    history?: Array<{ sender: 'user' | 'bot'; text: string }>;
    mode: 'roast' | 'chat' | 'vibecheck';
  }): Promise<{
    text: string;
    damage?: number;
    roastRating?: string;
    mood: 'happy' | 'roasting' | 'shocked' | 'chill';
  }> {
    try {
      const res = await fetch(`${API_BASE}/roast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10000)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.text) return json.data;
      }
    } catch (_) {
      // Backend offline or timeout fallback
    }
    return {
      text: `"${payload.message.slice(0, 30)}..."? Did you bring that comeback from a 2012 Disney sitcom? Even my GPU didn't flinch!`,
      damage: 45,
      roastRating: 'DAMAGE: 65 HP • SOLID DIG',
      mood: 'roasting'
    };
  }
}

