# 🎨 VibeQuest AI — Design System & Visual Direction
> **Aesthetic Direction: "Midnight Dispatch — Editorial Zine meets Late-Night Messenger"**

---

## 1. Aesthetic Philosophy & What We Explicitly Ban

Most AI-generated products look indistinguishable: centered hero headers, washed-out indigo-to-purple neon radial gradients, stacked rounded-2xl glassmorphism cards with soft blur, emoji as icons, and generic corporate copy like *"Unlock your communication potential"*.

**VibeQuest AI rejects all of this.**

Communication is human, messy, late-night, and personal. Our visual language is inspired by:
1. **Late-Night Private Messengers**: Real dark-mode messaging threads where people have vulnerable, funny, or tense conversations at 1:15 AM.
2. **Contemporary Independent Editorial Zines**: High-contrast typography, raw borders, crisp rules, tangible paper/grain textures, and asymmetrical layout tension.
3. **Receipts & Transcripts**: Evidence presented like printed slips, ticker stamps, and archival slips—tangible and grounded.

### 🚫 The Banned Tells (Zero Tolerance)
* ❌ NO purple-to-blue or violet-to-cyan gradient washes across backgrounds or buttons.
* ❌ NO glassmorphism / frosted glass overlays (`backdrop-blur-md` card stacks).
* ❌ NO centered hero + 3 identical cards layout.
* ❌ NO emojis used as section headers or fake icon decorations.
* ❌ NO default Inter/Roboto system typography.
* ❌ NO glowing neon orbs or floating sparkle/magic wand icons.
* ❌ NO corporate therapy-speak ("Unlock your inner harmony", "Elevate your journey").

---

## 2. Color Palette (Strict Hex Tokens)

Our palette uses deep ink and night charcoal as a steady container, illuminated by **one dominant fire-copper/coral accent** and **one sharp mint-signal contrast**.

```
Base Inks:
  --bg-primary:     #0D0F15  (Deep void ink)
  --bg-surface:     #141721  (Solid charcoal paper layer)
  --bg-elevated:    #1C202E  (Elevated panel / chat bubble incoming)
  --bg-highlight:   #252B3D  (Interactive hover / selection state)

Borders & Dividers:
  --border-subtle:  #202534  (Quiet structural rules)
  --border-strong:  #2F364B  (Active focus & card outlines)
  --border-focus:   #FF5C35  (Accessibility focus ring)

Typography / Foreground:
  --text-primary:   #F3EFE6  (Warm newsprint white)
  --text-secondary: #9DA5B4  (Muted slate graphite)
  --text-tertiary:  #636B7E  (Timestamp & receipt stamp gray)

Accents (Intentional, Not Washed):
  --accent-primary: #FF5C35  (Fire-coral / copper — bold actions, primary buttons)
  --accent-hover:   #FF7350  (Action hover)
  --accent-signal:  #00E599  (Terminal mint — receipts, evidence matches, live pulse)
  --accent-alert:   #FF3B30  (Boundary breaches, direct conflict)
  --accent-amber:   #E5A93B  (Context notes, reflection cautions)
```

---

## 3. Typography Hierarchy

* **Display / Headline Font**: `Space Grotesk` (Google Fonts). Raw, geometric, editorial, slightly brutalist tracking (`tracking-tight`).
* **Body / Conversational Font**: `Plus Jakarta Sans` (Google Fonts). High x-height, crystal-clear readability for message bubbles and mobile screens.
* **Mono / Evidence Font**: `JetBrains Mono`. Used strictly for receipt IDs, turn stamps, scoring tags, and dimension tickers.

### Scale & Weight Rules:
* Headlines are always sentence case or stark uppercase with letter-spacing, never center-aligned marketing slogans.
* Body copy has generous line-height (`leading-relaxed`) to mimic real text messaging readability.

---

## 4. Chat UI & Component Rules

1. **Message Bubbles**:
   * Character (Incoming): `#1C202E` solid background, `#F3EFE6` text, crisp border `#2F364B`. Subtle rounded corner with an asymmetrical flat bottom-left anchor.
   * User (Outgoing): `#FF5C35` accent background, dark text `#0D0F15` or high-contrast deep coral `#2A1612` with warm border, flat bottom-right anchor.
2. **Choice Cards**:
   * Numbered `[01]`, `[02]`, `[03]` in mono font.
   * High tactile feedback: 1px border shift on hover, physical 1px depression on active press (`active:translate-y-[1px]`).
3. **Avatars**:
   * Custom, distinctive SVGs per character with individualized geometric badge motifs (polygons, crests, solar rays), never stock photos or emojis.
4. **Receipts & Evidence**:
   * Rendered like perforated tape or ticket stubs with dashed left borders, quotation stamps, and dimension tag badges.
5. **Data Visualization**:
   * Custom styled gauge bars with tick marks at 0, 25, 50, 75, 100.
   * Dual-sided indicators showing tendency spectrums (e.g. *Direct* vs *Cautious Reflection*), not generic colorful pie charts.

---

## 5. Motion & Physicality

* Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (snappy entry, natural deceleration).
* Duration: Micro-interactions $\le 150\text{ms}$; message arrivals $220\text{ms}$.
* Accessibility: All transitions respect `@media (prefers-reduced-motion: reduce)`.
