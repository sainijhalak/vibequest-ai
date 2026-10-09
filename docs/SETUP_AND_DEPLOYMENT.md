# 🚀 VibeQuest AI — Setup, Local Development & Deployment Guide

---

## 1. Prerequisites

- **Node.js**: v18.0.0 or higher (Tested and verified on Node.js v24.21.0)
- **npm**: v9.0.0 or higher
- **Git**: Installed and configured

---

## 2. Local Development Quickstart

### Step 1: Clone and Install
```bash
git clone https://github.com/sainijhalak/vibequest-ai.git
cd vibequest-ai
npm install
```

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env` (or run with mock AI):
```ini
PORT=3001
CORS_ORIGIN=http://localhost:5173
MOCK_AI=true
ANTHROPIC_API_KEY=
ANTHROPIC_MODEL=claude-3-7-sonnet-20250219
```

> **Note**: When `MOCK_AI=true`, you do NOT need an Anthropic API key. The entire game and reflection engine run seamlessly using high-fidelity procedural simulation.

### Step 3: Run the Development Server
```bash
npm run dev
```
This runs:
- `shared`: TypeScript compile in watch mode
- `server`: Express with `tsx watch` on `http://localhost:3001`
- `client`: Vite dev server on `http://localhost:5173`

Open your browser to `http://localhost:5173` to play!

---

## 3. Production Deployment

### Option A: Frontend on Vercel

1. In the `client/` directory or root:
```bash
cd client
npx vercel
```
2. Configure environment variable in Vercel Dashboard:
   - `VITE_API_BASE_URL`: `https://your-backend.onrender.com`
3. Vercel Build Settings:
   - Framework Preset: `Vite`
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `dist`

### Option B: Backend on Render

The repository includes a ready-to-use Render Blueprint specification (`render.yaml`):

1. Link your GitHub repository in the **Render Dashboard**.
2. Create a new **Web Service**:
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build --workspace=shared && npm run build --workspace=server`
   - **Start Command**: `node server/dist/server.js`
3. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (Render default)
   - `CORS_ORIGIN`: `https://your-app.vercel.app`
   - `ANTHROPIC_API_KEY`: `your_sk-ant-..._key`
   - `ANTHROPIC_MODEL`: `claude-3-7-sonnet-20250219`
   - `MOCK_AI`: `false`

---

## 4. Environment Variables Reference

| Variable | Scope | Default | Description |
| :--- | :--- | :--- | :--- |
| `PORT` | Server | `3001` | Port Express listens on. |
| `CORS_ORIGIN` | Server | `http://localhost:5173` | Allowed origin for CORS headers. |
| `MOCK_AI` | Server | `false` | When `true`, uses offline mock responses for zero-cost dev. |
| `ANTHROPIC_API_KEY` | Server | *(none)* | Your Anthropic Claude API key. |
| `ANTHROPIC_MODEL` | Server | `claude-3-7-sonnet-20250219` | Target model for simulation and synthesis. |
| `VITE_API_BASE_URL` | Client | `http://localhost:3001` | Base URL used by browser `ApiService`. |
