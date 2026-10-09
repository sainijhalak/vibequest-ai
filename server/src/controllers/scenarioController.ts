import { Request, Response, NextFunction } from 'express';
import {
  TurnRequestSchema,
  ReportRequestSchema,
  HealthResponse
} from '@vibequest/shared';
import { SCENARIOS } from '../scenarios/data.js';
import { CharacterEngine } from '../engines/characterEngine.js';
import { ReflectionEngine } from '../engines/reflectionEngine.js';

export class ScenarioController {
  public static getHealth(req: Request, res: Response): void {
    const isMock = process.env.MOCK_AI === 'true' || !process.env.ANTHROPIC_API_KEY;
    const model = process.env.ANTHROPIC_MODEL || 'claude-3-5-haiku-20241022';

    const health: HealthResponse = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      model,
      mockMode: isMock,
      version: '1.0.0'
    };

    res.json(health);
  }

  public static listScenarios(req: Request, res: Response): void {
    const mode = req.query.mode as string | undefined;
    let list = SCENARIOS;
    if (mode) {
      list = list.filter(s => s.mode === mode);
    }

    res.json({
      success: true,
      count: list.length,
      data: list
    });
  }

  public static getScenario(req: Request, res: Response): void {
    const { id } = req.params;
    const scenario = SCENARIOS.find(s => s.id === id);

    if (!scenario) {
      res.status(404).json({
        error: {
          code: 'SCENARIO_NOT_FOUND',
          message: `Scenario with ID '${id}' does not exist.`
        }
      });
      return;
    }

    res.json({
      success: true,
      data: scenario
    });
  }

  public static async handleTurn(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = TurnRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid dialogue turn payload',
            details: parsed.error.format()
          }
        });
        return;
      }

      const { scenarioId, userMessage, history } = parsed.data;
      const scenario = SCENARIOS.find(s => s.id === scenarioId);

      if (!scenario) {
        res.status(404).json({
          error: {
            code: 'SCENARIO_NOT_FOUND',
            message: `Scenario '${scenarioId}' not found.`
          }
        });
        return;
      }

      const turnResult = await CharacterEngine.generateReply(
        scenario,
        userMessage,
        history
      );

      res.json({
        success: true,
        data: turnResult
      });
    } catch (error) {
      next(error);
    }
  }

  public static async handleReport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = ReportRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid report request payload',
            details: parsed.error.format()
          }
        });
        return;
      }

      const { scenarioId, history } = parsed.data;
      const scenario = SCENARIOS.find(s => s.id === scenarioId);

      if (!scenario) {
        res.status(404).json({
          error: {
            code: 'SCENARIO_NOT_FOUND',
            message: `Scenario '${scenarioId}' not found.`
          }
        });
        return;
      }

      const report = await ReflectionEngine.generateReport(scenario, history);

      res.json({
        success: true,
        data: report
      });
    } catch (error) {
      next(error);
    }
  }
}
