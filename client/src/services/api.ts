import {
  TurnRequest,
  TurnResponse,
  TurnResponseSchema,
  ReportRequest,
  ReportResponse,
  ReportResponseSchema,
  HealthResponse,
  HealthResponseSchema,
  ScenarioDefinition
} from '@vibequest/shared';

const API_BASE = '/api';

export class ApiService {
  /**
   * Healthcheck to detect backend status and AI mode
   */
  public static async getHealth(): Promise<HealthResponse> {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) {
      throw new Error(`Healthcheck failed with HTTP ${res.status}`);
    }
    const data = await res.json();
    return HealthResponseSchema.parse(data);
  }

  /**
   * Fetch all scenarios or by mode
   */
  public static async getScenarios(mode?: string): Promise<ScenarioDefinition[]> {
    const url = mode ? `${API_BASE}/scenarios?mode=${mode}` : `${API_BASE}/scenarios`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch scenarios: HTTP ${res.status}`);
    }
    const json = await res.json();
    return json.data;
  }

  /**
   * Fetch a single scenario by ID
   */
  public static async getScenario(id: string): Promise<ScenarioDefinition> {
    const res = await fetch(`${API_BASE}/scenarios/${id}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch scenario '${id}': HTTP ${res.status}`);
    }
    const json = await res.json();
    return json.data;
  }

  /**
   * Submit dialogue turn (choice or custom text)
   */
  public static async submitTurn(payload: TurnRequest): Promise<TurnResponse> {
    const res = await fetch(`${API_BASE}/scenario/turn`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Turn request failed with HTTP ${res.status}`);
    }

    const data = await res.json();
    return TurnResponseSchema.parse(data.data);
  }

  /**
   * Request post-game reflection report
   */
  public static async getReport(payload: ReportRequest): Promise<ReportResponse> {
    const res = await fetch(`${API_BASE}/report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Report generation failed with HTTP ${res.status}`);
    }

    const data = await res.json();
    return ReportResponseSchema.parse(data.data);
  }
}
