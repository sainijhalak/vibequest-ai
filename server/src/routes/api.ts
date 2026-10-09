import { Router } from 'express';
import { ScenarioController } from '../controllers/scenarioController.js';
import { RoastController } from '../controllers/roastController.js';

export const apiRouter = Router();

// Healthcheck endpoint
apiRouter.get('/health', ScenarioController.getHealth);

// Scenario Catalogue endpoints
apiRouter.get('/scenarios', ScenarioController.listScenarios);
apiRouter.get('/scenarios/:id', ScenarioController.getScenario);

// Gameplay, Scoring & Reflection endpoints
apiRouter.post('/scenario/turn', ScenarioController.handleTurn);
apiRouter.post('/score', ScenarioController.handleScore);
apiRouter.post('/report', ScenarioController.handleReport);

// Buster Roast Battle & Vibe Check endpoint
apiRouter.post('/roast', RoastController.handleRoast);
