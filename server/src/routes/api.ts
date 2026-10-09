import { Router } from 'express';
import { ScenarioController } from '../controllers/scenarioController.js';

export const apiRouter = Router();

// Healthcheck endpoint
apiRouter.get('/health', ScenarioController.getHealth);

// Scenario Catalogue endpoints
apiRouter.get('/scenarios', ScenarioController.listScenarios);
apiRouter.get('/scenarios/:id', ScenarioController.getScenario);

// Gameplay & Reflection endpoints
apiRouter.post('/scenario/turn', ScenarioController.handleTurn);
apiRouter.post('/report', ScenarioController.handleReport);
