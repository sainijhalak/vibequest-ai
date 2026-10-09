# 🎨 VibeQuest AI — Frontend Architecture & Component Guide

> **Design Manifesto**: Reject the ubiquitous "AI startup aesthetic" (purple gradient washes, floating neon orbs, symmetrical 3-card features, emoji headers). Embrace **"Midnight Dispatch"** — an editorial, atmospheric messenger combining ink charcoal, warm newsprint, tactile tactile buttons, and custom procedural geometry.

---

## 1. Design System & Theme Tokens

The design system is codified in `client/tailwind.config.js` and `client/src/index.css`:

### Color Palette
- **Ink Charcoal (`ink-950` / `ink-900` / `ink-800`)**: Deep, restful foundation (`#090B0E`, `#0D0F15`, `#161922`).
- **Warm Paper (`paper-100` / `paper-200`)**: High-contrast, natural typography (`#F3EFE6`, `#E5E0D5`).
- **Fire Coral (`coral-500` / `coral-600`)**: Dominant sharp action accent (`#FF5C35`, `#E04B26`).
- **Mint Signal (`mint-500` / `mint-400`)**: System state and confirmation cue (`#00E599`, `#26EDA8`).

### Typography Pairing
- **Display & Headings**: `Space Grotesk` (Google Font) — Technical, confident, architectural.
- **Body & Dialogue**: `Plus Jakarta Sans` (Google Font) — Clean, humanistic, exceptionally legible on dark backgrounds.
- **Metadata & Receipts**: `JetBrains Mono` (Google Font) — Precise, receipt-like monospace for scores, timestamps, and turn numbers.

---

## 2. Component Hierarchy

```
App.tsx (Root View Controller: 'landing' | 'playing' | 'report')
├── LandingPage.tsx
│   ├── Interactive Teaser Messenger (Simulated 2-turn preview)
│   ├── Mode Selector Tabs (All / Social Sim / Conflict Arena / Flirt Lab)
│   ├── Scenario Grid (Custom SVG Avatars, Stakes badges, Turn counts)
│   └── Privacy & Zero-Diagnostic Consent Notice
│
├── ScenarioPlayer.tsx
│   ├── Scenario Header (Title, Character Avatar, Persona tag, End button)
│   ├── ProgressBar (Turn tracker, e.g., Turn 2 of 4)
│   ├── Chat Viewport
│   │   ├── ChatBubble (Character speech vs. User moves)
│   │   └── TypingIndicator (Animated triple-pulse dots)
│   └── Interactive Input Deck
│       ├── Preset Choice Cards (ChoiceCard.tsx with tone badges & preview)
│       └── Custom Write-in Bar (Direct text input + Submit button)
│
└── ReportPage.tsx
    ├── Hero Summary Card (Qualitative analysis from Reflection Engine)
    ├── Spectrum Gauge Grid (5 Dimensions with custom progress bars & uncertainty tags)
    ├── Observed Playbook (Situational tendency cards)
    ├── Alternative Moves (Experimental recommendations)
    ├── Evidence Receipts Accordion (Verbatim turn citations with mathematical deltas)
    └── Epistemic Humility Disclaimers ("What We Cannot Know")
```

---

## 3. Procedural SVG Avatars (`CharacterAvatar.tsx`)

Rather than generic emoji icons or blurry AI-generated headshots, VibeQuest AI renders crisp, vector-based geometric avatars:
- **Maya**: Coral abstract loop on ink background.
- **Jordan**: Emerald concentric rings with diamond core.
- **Leo**: Amber chevron structure with sharp vertical balance.
- **Marcus**: Cyan intersecting arcs with high-tension balance.
- **Elena**: Magenta hexagon lattice with offset balance.
- **Sam**: Teal spiral with soft curved corners.
- **Chloe**: Electric violet starburst with centered focal point.

Avatars scale cleanly to any resolution, load instantly with zero HTTP requests, and match the Midnight Dispatch editorial aesthetic.

---

## 4. State Management & Lifecycle

All state lives client-side in React with zero server-side user session tokens:

```typescript
// App.tsx Root State
const [view, setView] = useState<'landing' | 'playing' | 'report'>('landing');
const [currentScenario, setCurrentScenario] = useState<ScenarioDefinition | null>(null);
const [completedRuns, setCompletedRuns] = useState<SessionRun[]>(() => {
  const saved = localStorage.getItem('vibequest_completed_runs');
  return saved ? JSON.parse(saved) : [];
});
const [reportData, setReportData] = useState<ReportResponse | null>(null);
```

### Flow:
1. **Selection**: User clicks a scenario card on `LandingPage`. `currentScenario` is set, and view switches to `'playing'`.
2. **Gameplay**: User submits choices via `ScenarioPlayer`. Each turn calls `apiService.submitTurn()`. When maximum turns (3 or 4) are reached, the run is appended to `completedRuns` and saved to `localStorage`.
3. **Report Generation**: When user clicks **"Generate Behavioral Report"**, `apiService.generateReport(completedRuns)` is triggered, navigating to `ReportPage`.
4. **Session Reset**: A **"Reset Session & Clear Data"** button purges `localStorage` and returns to `'landing'`.
