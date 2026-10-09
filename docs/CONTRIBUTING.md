# 🛠️ VibeQuest AI — Contributor's Guide

Welcome! This guide explains how to extend VibeQuest AI with new scenarios, characters, and behavioral dimensions while maintaining the codebase's strict types and design principles.

---

## 1. How to Add a New Scenario

### Step 1: Define the Scenario in `server/src/scenarios/data.ts`
Add a new object conforming to `ScenarioDefinition`:

```typescript
{
  id: 'social_workplace_credit',
  mode: 'social_sim',
  title: 'The Stolen Presentation Credit',
  description: 'In an all-hands meeting, your project partner presents your key finding as entirely their own idea.',
  characterName: 'Damon',
  characterPersona: 'Ambitious, slightly defensive peer who values upward visibility.',
  avatarId: 'damon',
  stakes: 'Professional credit vs. immediate team discord.',
  maxTurns: 3,
  initialChoices: [
    {
      id: 'interject_politely',
      text: 'Jump in immediately: "Building on what Damon noted, here is the original breakdown I put together..."',
      tone: 'direct',
      impacts: { directness_vs_diplomacy: 20, boundary_firmness: 20 },
    },
    {
      id: 'address_in_private',
      text: 'Wait for the meeting to end, then send a direct Slack message asking to talk 1-on-1.',
      tone: 'diplomatic',
      impacts: { speed_vs_deliberation: -20, directness_vs_diplomacy: 10 },
    },
    {
      id: 'let_it_slide',
      text: 'Say nothing and let the credit go to keep the peace.',
      tone: 'guarded',
      impacts: { boundary_firmness: -25, directness_vs_diplomacy: -20 },
    },
  ],
}
```

### Step 2: Add Custom SVG Avatar in `client/src/components/CharacterAvatar.tsx`
Add a procedural geometric avatar pattern matching the character's persona:

```tsx
case 'damon':
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect width="100" height="100" fill="#161922" />
      <polygon points="50,15 85,80 15,80" fill="none" stroke="#FF8A00" strokeWidth="6" />
      <circle cx="50" cy="50" r="12" fill="#FF8A00" />
    </svg>
  );
```

### Step 3: Add Mock Responses in `server/src/engines/characterEngine.ts`
Add contextual mock turn lines for offline testing:

```typescript
if (scenario.id === 'social_workplace_credit') {
  if (turnNumber === 1) {
    return {
      reply: "Damon blinks, caught off guard. 'Uh, yeah! Like I was saying, we both looked at that dataset...'",
      followupChoices: [ ... ]
    };
  }
}
```

### Step 4: Verify and Build
```bash
npm test
npm run build
```

---

## 2. How to Add a New Behavioral Dimension

### Step 1: Update `@vibequest/shared`
Open `shared/src/index.ts`:
1. Add the new key to `BehavioralDimensionSchema`:
   ```typescript
   export const BehavioralDimensionSchema = z.enum([
     'directness_vs_diplomacy',
     'speed_vs_deliberation',
     'vulnerability_vs_containment',
     'boundary_firmness',
     'playfulness_vs_gravity',
     'curiosity_vs_advocacy', // New dimension!
   ]);
   ```
2. Build shared: `npm run build --workspace=shared`.

### Step 2: Update Scoring Engine
In `server/src/engines/scoringEngine.ts`, update `DIMENSION_TITLES` to provide human-readable labels:
```typescript
curiosity_vs_advocacy: {
  low: 'Advocate / Stated Perspective',
  mid: 'Balanced Explorer',
  high: 'Inquisitive / Question-First',
  description: 'Tendency to ask probing questions versus declaring positions upfront.'
}
```

### Step 3: Run the Test Suite
Ensure all scoring unit tests pass:
```bash
npm test
```
