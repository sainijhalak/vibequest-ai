# ⚡ VibeQuest AI

> **"Play the moment. Discover your vibe."**
> An interactive social intelligence game where users play simulated conversational scenarios with Claude-powered characters, followed by evidence-backed, non-judgmental behavioral reflections.

![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-blue)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![Express](https://img.shields.io/badge/Express-4.21.2-green)
![Anthropic](https://img.shields.io/badge/Anthropic_Claude_API-0.39.0-purple)
![Vitest](https://img.shields.io/badge/Tests-13%2F13_Passing-brightgreen)
![Design](https://img.shields.io/badge/Aesthetic-Midnight_Dispatch-orange)

---

## 🌟 Highlights & Philosophy

- 🎮 **Entertaining First, Insightful Second**: Not a boring 30-question personality test, clinical diagnostic form, or corporate evaluation.
- 🎭 **Dual-Engine AI Architecture**: Decouples in-character roleplay (`CharacterEngine`) from behavioral debriefs (`ReflectionEngine`).
- 🧮 **Deterministic Mathematical Scoring**: Spectrum scores (0-100) are computed mathematically via vector deltas — never hallucinated by an LLM prompt.
- 🧾 **Verifiable Evidence Receipts**: Every score is accompanied by explicit turn-by-turn receipts quoting the user's actual choices.
- ⚖️ **Epistemic Humility**: Acknowledges what cannot be known from a game; flags uncertainty (`insufficient_evidence` when data is thin; `context_dependent` when choices conflict).
- 🎨 **Anti-AI-Slop Visual Direction**: "Midnight Dispatch" aesthetic featuring deep ink charcoal (`#0D0F15`), fire coral accents (`#FF5C35`), custom procedural geometric SVG avatars, and real typographic hierarchy. No purple-blue gradients, glowing blobs, or emoji icons.
- 🛡️ **Hardened Security**: Prompt-injection isolation (`<user_message>` tagging), Helmet HTTP headers, CORS filtering, 20kb request body limits, and IP rate limiting (120 req / 15 min).
- ✈️ **Zero-Cost Offline Simulation**: Includes a full deterministic Mock AI mode (`MOCK_AI=true`), allowing complete local development and testing without an Anthropic API key.

---

## 🚀 Quickstart

### Prerequisites
- Node.js v18.0.0+ (Tested on Node.js v24.21.0)
- npm v9.0.0+

### 1. Clone & Install
```bash
git clone https://github.com/sainijhalak/vibequest-ai.git
cd vibequest-ai
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```
Default `.env` configuration:
```ini
PORT=3001
CORS_ORIGIN=http://localhost:5173
MOCK_AI=true
ANTHROPIC_API_KEY=
ANTHROPIC_MODEL=claude-3-7-sonnet-20250219
```
*(With `MOCK_AI=true`, the game runs completely locally with realistic simulated responses without consuming Claude API tokens.)*

### 3. Launch Development Environment
```bash
npm run dev
```
- Client runs on `http://localhost:5173`
- Server API runs on `http://localhost:3001`

### 4. Run the Test Suite
```bash
npm test
```
Executes 13 unit and integration tests across scoring math, clamping, receipts, and HTTP routes.

### 5. Production Build
```bash
npm run build
```
Compiles `@vibequest/shared`, `vibequest-ai-server`, and bundles `vibequest-ai-client` into production-ready assets.

---

## 🎮 The Three Game Modes & Scenarios

| Mode | Scenarios Available | Core Interpersonal Dynamics |
| :--- | :--- | :--- |
| **Social Simulator** | 1. *The Group Dinner Check Split* (Maya)<br>2. *The Overheard Secret* (Jordan) | Financial boundaries, group expectations, sensitive disclosure, loyalty. |
| **Conflict Arena** | 3. *The Deadline Crunch* (Leo)<br>4. *The Kitchen Cold War* (Marcus)<br>5. *The Plus-One Surprise* (Elena) | Accountability, de-escalation, unaddressed resentment, spatial boundaries. |
| **Flirt Lab** | 6. *The Accidental Double Take* (Sam)<br>7. *The Late Night Text* (Chloe) | Ambiguity, banter vs. clarity, vulnerability, mutual romantic calibration. |

---

## 📐 The Five Behavioral Dimensions

1. **Directness vs. Diplomacy** ($0 = \text{Diplomatic / Indirect}$, $100 = \text{Direct / Candid}$)
2. **Speed vs. Deliberation** ($0 = \text{Deliberate / Patient}$, $100 = \text{Immediate / Swift}$)
3. **Vulnerability vs. Containment** ($0 = \text{Contained / Guarded}$, $100 = \text{Open / Transparent}$)
4. **Boundary Firmness** ($0 = \text{Flexible / Accommodating}$, $100 = \text{Firm / Unyielding}$)
5. **Playfulness vs. Gravity** ($0 = \text{Grave / Earnest}$, $100 = \text{Playful / Humorous}$)

All scores start at baseline 50, accumulate choice impacts, and are clamped strictly to $[15, 95]$ to reject extreme absolutes.

---

## 📚 Complete Documentation Suite

Detailed architectural specifications and learning guides are located in [`docs/`](docs/):

- 🎨 [`docs/DESIGN.md`](docs/DESIGN.md) — Visual design specification and anti-AI-slop guidelines.
- 🏗️ [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — Monorepo layout, dual-engine design, and security architecture.
- 🤖 [`docs/AI_SYSTEM.md`](docs/AI_SYSTEM.md) — Claude prompts, token budgets, and `<user_message>` sandboxing.
- 🎲 [`docs/GAME_LOGIC.md`](docs/GAME_LOGIC.md) — Scoring formulas, vector calculations, and uncertainty rules.
- 🖌️ [`docs/FRONTEND_GUIDE.md`](docs/FRONTEND_GUIDE.md) — React component hierarchy, theme tokens, and SVG avatars.
- ⚙️ [`docs/BACKEND_GUIDE.md`](docs/BACKEND_GUIDE.md) — Express middleware, Zod validation, and API routes.
- 🔄 [`docs/DATA_FLOW.md`](docs/DATA_FLOW.md) — End-to-end data lifecycle with sequence diagrams.
- 🧪 [`docs/TESTING.md`](docs/TESTING.md) — Vitest and Supertest testing strategy and test matrix.
- 🚀 [`docs/SETUP_AND_DEPLOYMENT.md`](docs/SETUP_AND_DEPLOYMENT.md) — Local development, Vercel frontend, and Render backend guides.
- 🛠️ [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md) — Step-by-step guide to add new scenarios, avatars, and dimensions.
- 🗺️ [`docs/LEARNING_ROADMAP.md`](docs/LEARNING_ROADMAP.md) — Core software engineering concepts and 3 practice challenges.
- 🗺️ [`docs/FILE_MAP.md`](docs/FILE_MAP.md) — Comprehensive directory and file registry.
- 📋 [`docs/IMPLEMENTATION_LOG.md`](docs/IMPLEMENTATION_LOG.md) — Command verification log and AI-slop audit.

For learners, read [`LEARNING_MODE.md`](LEARNING_MODE.md) for a line-by-line mentorship walkthrough.

---

## 🚢 Deployment

- **Frontend**: Deployable to **Vercel** with one command (`npx vercel` inside `client/`).
- **Backend**: Deployable to **Render** via Blueprint with [`render.yaml`](render.yaml).

---

## 📜 License & Epistemic Notice

MIT License.

*VibeQuest AI is an entertainment and conversational exploration experience. It is not a clinical, psychological, or diagnostic assessment, and makes no claim to measure permanent human personality traits.*
