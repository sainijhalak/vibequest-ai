import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { apiRouter } from './routes/api.js';

dotenv.config();

export const app = express();
const PORT = process.env.PORT || 3001;

// 1. Security Headers via Helmet
app.use(helmet());

// 2. CORS Allowlist
const rawOrigins = process.env.CORS_ORIGIN || 'http://localhost:5173';
const allowedOrigins = rawOrigins.split(',').map(s => s.trim());

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests or matching origins
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked for origin: ${origin}`));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 3. Strict 20kb Request Body Limit (Defend against payload abuse)
app.use(express.json({ limit: '20kb' }));

// 4. Rate Limiting (Abuse prevention)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 120, // Max 120 requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests. Please pause for a few minutes before continuing your journey.'
    }
  }
});
app.use('/api', limiter);

// 5. Sanitized Request Logging (NO raw conversation transcripts logged)
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== 'test') {
      console.log(`[HTTP] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// 6. Mount API Router (mount at both /api and root to support rewrites)
app.use('/api', apiRouter);
app.use(apiRouter);

// 7. 404 Catch-All Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `Endpoint ${req.method} ${req.originalUrl} does not exist.`
    }
  });
});

// 8. Centralized Error Handler (standardized error payload)
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  const statusCode = err.status || err.statusCode || 500;
  console.error(`[SERVER ERROR] ${err.message || 'Unknown error'}`);

  res.status(statusCode).json({
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: process.env.NODE_ENV === 'production' && statusCode === 500
        ? 'An unexpected error occurred. Please try again.'
        : err.message || 'Internal server error.'
    }
  });
});

// Listen only when started directly (not in test runner or serverless function)
if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 VibeQuest AI Server running on http://localhost:${PORT}`);
    console.log(`📡 Healthcheck: http://localhost:${PORT}/api/health`);
    console.log(`🤖 Mode: ${process.env.MOCK_AI === 'true' || !process.env.ANTHROPIC_API_KEY ? 'Mock AI Emulation' : 'Anthropic Claude Live'}`);
    console.log(`======================================================\n`);
  });
}
