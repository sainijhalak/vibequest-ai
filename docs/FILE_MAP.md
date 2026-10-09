# 🗺️ VibeQuest AI — Codebase File & Directory Map

An index of every file in the repository with its architectural role, exports, and dependencies.

---

## Root Level
- **`package.json`**: Monorepo root configuration with npm workspaces (`shared`, `server`, `client`), scripts for dev, build, and test.
- **`package-lock.json`**: Lockfile pinning deterministic dependency versions.
- **`.gitignore`**: Excludes `node_modules/`, `dist/`, `.env`, temporary logs, and OS caches.
- **`.env.example`**: Documentation of required and optional environment variables with non-secret defaults.
- **`README.md`**: Master project introduction, design highlights, architecture, and quickstart commands.
- **`LEARNING_MODE.md`**: Dedicated mentor companion guide walking through full-stack architectural lessons.
- **`render.yaml`**: Infrastructure-as-code blueprint for Render Web Service deployment.

---

## 📦 `@vibequest/shared` (`shared/`)
Pure domain models and schemas shared between browser and server:
- **`shared/package.json`**: ESM library manifest with `"type": "module"` and TypeScript definitions.
- **`shared/tsconfig.json`**: TypeScript configuration emitting ES2022 and `.d.ts` types to `dist/`.
- **`shared/src/index.ts`**: The central source of truth:
  - `GameModeSchema`, `GameMode`: `'social_sim' | 'conflict_arena' | 'flirt_lab'`
  - `BehavioralDimensionSchema`, `BehavioralDimension`: The 5 spectrum dimensions
  - `ChoiceOptionSchema`: Structure for preset choices with tone and mathematical impacts
  - `ScenarioDefinitionSchema`: Schema for scenario catalog entries
  - `TurnRequestSchema` & `TurnResponseSchema`: Turn lifecycle contracts
  - `ReportRequestSchema` & `ReportResponseSchema`: Final reflection contracts
  - `EvidenceReceiptSchema`: Schema for verifiable behavioral citations

---

## ⚙️ Backend API (`server/`)
Stateless Express API, security middleware, and dual-engine AI simulation:
- **`server/package.json`**: Server dependencies (Express, Helmet, Rate-Limit, Anthropic SDK, Zod, Vitest, Supertest).
- **`server/tsconfig.json`**: Target ES2022 with NodeNext module resolution.
- **`server/src/server.ts`**: Express application bootstrapper:
  - Configures Helmet security headers, CORS origin filtering, 20kb body parser limit, rate limiter (120 req/15min).
  - Centralized error handler returning `{ error: { code, message } }`.
- **`server/src/routes/api.ts`**: Express router mounting `/health`, `/scenarios`, `/scenario/turn`, and `/report`.
- **`server/src/controllers/scenarioController.ts`**: HTTP controllers that validate incoming requests with Zod and delegate to engines.
- **`server/src/scenarios/data.ts`**: Repository of 7 scenario definitions across Social Simulator, Conflict Arena, and Flirt Lab.
- **`server/src/engines/`**:
  - **`scoringEngine.ts`**: Pure mathematical vector scoring: baseline 50, sum deltas, clamp [15, 95], evaluate uncertainty (`insufficient_evidence`, `context_dependent`), and extract receipts.
  - **`characterEngine.ts`**: In-character conversational simulator with `<user_message>` prompt injection isolation and procedural mock fallback.
  - **`reflectionEngine.ts`**: Qualitative synthesis engine that quotes deterministic scores and receipts to build non-judgmental debriefs.
- **`server/tests/`**:
  - **`scoring.test.ts`**: 5 unit tests verifying deterministic math, clamping, and uncertainty flags.
  - **`api.test.ts`**: 8 integration tests verifying health, catalog, turn mechanics, write-ins, 20kb limits, and 404/400 error handling.

---

## 🎨 Frontend Application (`client/`)
Single Page Application (Vite + React 18 + Tailwind CSS):
- **`client/package.json`**: Client dependencies and build scripts.
- **`client/vite.config.ts`**: Vite configuration with React plugin and dev proxy.
- **`client/tailwind.config.js`**: Design system tokens for the "Midnight Dispatch" theme (`ink-*`, `coral-*`, `mint-*`, `paper-*`).
- **`client/src/index.css`**: Tailwind directives and typography styling for Space Grotesk, Plus Jakarta Sans, and JetBrains Mono.
- **`client/src/main.tsx`**: React DOM mounting root.
- **`client/src/App.tsx`**: State-machine view controller (`landing` -> `playing` -> `report`).
- **`client/src/services/api.ts`**: Typed HTTP client interacting with the backend.
- **`client/src/components/`**:
  - **`LandingPage.tsx`**: Hero section with live interactive teaser chat, mode filter tabs, scenario catalog grid, and privacy notice.
  - **`ScenarioPlayer.tsx`**: Messenger interface with character avatar, turn progress tracker, message timeline, typing indicator, choice card deck, and custom write-in input.
  - **`ReportPage.tsx`**: Synthesis report with 0-100 spectrum gauge bars, uncertainty disclaimers, observed playbook, alternative moves, evidence receipt cards, and session reset button.
  - **`ui/Button.tsx`**: Reusable button with primary, secondary, and ghost variants.
  - **`ui/CharacterAvatar.tsx`**: Procedural vector geometric avatars for Maya, Jordan, Leo, Marcus, Elena, Sam, and Chloe.
  - **`ui/ChatBubble.tsx`**: Messenger chat bubble layout with sender indicator and timestamp.
  - **`ui/ChoiceCard.tsx`**: Interactive card for player options with tone badges and impact previews.
  - **`ui/ProgressBar.tsx`**: Segmented turn progression indicator.

---

## 📚 Documentation (`docs/`)
Comprehensive engineering specs and learning guides:
- **`docs/DESIGN.md`**: Visual design specification ("Midnight Dispatch" aesthetic and anti-AI-slop rules).
- **`docs/ARCHITECTURE.md`**: High-level system architecture, monorepo boundaries, and security stack.
- **`docs/AI_SYSTEM.md`**: AI system design, prompt templates, `<user_message>` tagging, and mock architecture.
- **`docs/GAME_LOGIC.md`**: Scoring mechanics, 5 dimensions, mathematical formula, and uncertainty rules.
- **`docs/FRONTEND_GUIDE.md`**: Frontend guide, component hierarchy, and avatar rendering.
- **`docs/BACKEND_GUIDE.md`**: Backend guide, API endpoint specifications, and error envelopes.
- **`docs/DATA_FLOW.md`**: Step-by-step turn and report lifecycles with Mermaid diagrams.
- **`docs/TESTING.md`**: Testing strategy, Vitest/Supertest guide, and test suite matrix.
- **`docs/SETUP_AND_DEPLOYMENT.md`**: Local quickstart, Vercel frontend guide, and Render backend guide.
- **`docs/CONTRIBUTING.md`**: Step-by-step instructions to add scenarios and behavioral dimensions.
- **`docs/LEARNING_ROADMAP.md`**: Educational guide on monorepos, Zod, dual-engines, and practice challenges.
- **`docs/IMPLEMENTATION_LOG.md`**: Verification log with exact command outputs and AI-slop audit.
