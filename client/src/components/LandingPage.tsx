import React, { useState } from 'react';
import { GameMode, ScenarioDefinition } from '@vibequest/shared';
import { Button } from './ui/Button.js';
import { CharacterAvatar } from './ui/CharacterAvatar.js';

interface LandingPageProps {
  scenarios: ScenarioDefinition[];
  onSelectScenario: (scenario: ScenarioDefinition) => void;
  onClearData: () => void;
  mockMode: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  scenarios,
  onSelectScenario,
  onClearData,
  mockMode
}) => {
  const [activeFilter, setActiveFilter] = useState<GameMode | 'all'>('all');
  const [featuredScenarioId, setFeaturedScenarioId] = useState<string>(scenarios[0]?.id || 'unexpected-message');

  const featuredScenario = scenarios.find(s => s.id === featuredScenarioId) || scenarios[0];

  const filteredScenarios = activeFilter === 'all'
    ? scenarios
    : scenarios.filter(s => s.mode === activeFilter);

  const getModeLabel = (mode: GameMode) => {
    switch (mode) {
      case 'conflict_arena':
        return 'CONFLICT ARENA';
      case 'social_simulator':
        return 'SOCIAL SIMULATOR';
      case 'flirt_lab':
        return 'FLIRT LAB';
      default:
        return 'SCENARIO';
    }
  };

  const getModeColor = (mode: GameMode) => {
    switch (mode) {
      case 'conflict_arena':
        return 'text-coral border-coral/40 bg-coral/10';
      case 'social_simulator':
        return 'text-amber border-amber/40 bg-amber/10';
      case 'flirt_lab':
        return 'text-mint border-mint/40 bg-mint/10';
      default:
        return 'text-paper-300 border-ink-700 bg-ink-850';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* Top Banner: Status & Privacy */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-ink-700/80">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-coral animate-pulse" />
          <span className="font-display font-bold text-lg sm:text-xl tracking-tight text-paper-50">
            VIBEQUEST <span className="font-mono text-xs text-coral font-medium tracking-normal">[0.2]</span>
          </span>
          <span className="hidden md:inline font-mono text-[11px] text-paper-400 pl-2 border-l border-ink-700">
            Fictional Social Simulation & Behavioral Reflection
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          {mockMode && (
            <span className="px-2 py-0.5 rounded bg-amber/10 border border-amber/30 text-amber text-[11px]">
              OFFLINE / EMULATION ENGINE
            </span>
          )}
          <button
            onClick={onClearData}
            type="button"
            className="text-paper-400 hover:text-paper-100 underline decoration-ink-700 underline-offset-4 transition-colors"
          >
            Clear local data
          </button>
        </div>
      </header>

      {/* Hero Section: Asymmetrical Editorial Opening + Live Encounter Showcase */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Editorial Hook (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ink-850 border border-ink-700 font-mono text-[11px] text-paper-300 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-mint animate-pulse" />
            <span className="text-mint font-semibold">NO BORING QUESTIONNAIRES</span>
            <span className="text-paper-400">• ACTUAL CONVERSATIONAL TACTICS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight text-paper-50 leading-[1.12]">
            Play the moment. <br />
            <span className="text-coral">Discover your vibe.</span>
          </h1>

          <p className="text-base sm:text-lg text-paper-300 font-sans leading-relaxed max-w-xl">
            Enter simulated everyday social dilemmas, relationship crossroads, and workplace conflicts. Interact with nuanced characters who react to your actual words. Uncover your real communication instincts—not through generic multiple-choice quizzes, but through the decisions you make under pressure.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            {featuredScenario && (
              <Button
                variant="primary"
                size="lg"
                onClick={() => onSelectScenario(featuredScenario)}
              >
                Launch Simulation ({featuredScenario.title}) →
              </Button>
            )}

            <a
              href="#scenarios"
              className="font-mono text-xs text-paper-300 hover:text-paper-100 flex items-center justify-center sm:justify-start gap-1.5 py-2 px-1 transition-colors underline underline-offset-4"
            >
              Explore all 7 scenarios ↓
            </a>
          </div>

          {/* Key Tenet Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-ink-800 text-xs font-mono text-paper-400">
            <div className="flex items-center gap-2">
              <span className="text-coral">✓</span>
              <span>5 Turns per Scenario</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-mint">✓</span>
              <span>4-5 Tactical Moves</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-amber">✓</span>
              <span>Zero Judgmental Labels</span>
            </div>
          </div>
        </div>

        {/* Right Feature Showcase: Live Encounter Dossier Terminal (6 Cols) */}
        {featuredScenario && (
          <div className="lg:col-span-6 bg-ink-900 border border-ink-700/80 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 relative overflow-hidden backdrop-blur-md">
            {/* Top Terminal Strip */}
            <div className="flex items-center justify-between pb-4 border-b border-ink-800 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-coral animate-ping" />
                <span className="text-paper-300 font-bold uppercase tracking-wider">
                  FEATURED ENCOUNTER TERMINAL
                </span>
              </div>
              <span className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase font-semibold border ${getModeColor(featuredScenario.mode)}`}>
                {getModeLabel(featuredScenario.mode)}
              </span>
            </div>

            {/* Quick Scenario Selector Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {scenarios.slice(0, 3).map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setFeaturedScenarioId(s.id)}
                  type="button"
                  className={`font-mono text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                    featuredScenario.id === s.id
                      ? 'bg-coral-tint border-coral text-coral font-bold'
                      : 'bg-ink-950 border-ink-800 text-paper-400 hover:text-paper-200'
                  }`}
                >
                  [0{idx + 1}] {s.character.name.split(' ')[0]}
                </button>
              ))}
            </div>

            {/* Character Dossier Hero Card */}
            <div className="bg-ink-950 border border-ink-800 rounded-2xl p-4 sm:p-5 flex items-start gap-4 shadow-inner">
              <CharacterAvatar
                seed={featuredScenario.character.avatarSeed}
                name={featuredScenario.character.name}
                accentColor={featuredScenario.character.accentColor}
                size="lg"
                mood={featuredScenario.character.quirks?.initialMood || 'neutral'}
                showMoodBadge={true}
              />
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display font-bold text-base sm:text-lg text-paper-50 truncate">
                    {featuredScenario.character.name}
                  </h3>
                  <span className="font-mono text-[10px] text-paper-400">
                    5 TURNS • {featuredScenario.maxTurns} ROADS
                  </span>
                </div>
                <p className="font-mono text-xs text-coral">
                  {featuredScenario.character.role}
                </p>
                <p className="font-sans text-xs text-paper-300 leading-relaxed line-clamp-2">
                  {featuredScenario.character.bio}
                </p>
              </div>
            </div>

            {/* Premise & Stakes Card */}
            <div className="bg-ink-950/70 border border-ink-800 rounded-xl p-4 space-y-2 text-xs">
              <div className="font-mono text-[10px] text-amber font-semibold uppercase tracking-wider">
                THE PREMISE & STAKES:
              </div>
              <p className="font-sans text-paper-200 leading-relaxed italic">
                "{featuredScenario.context}"
              </p>
              <div className="pt-1 flex items-center justify-between text-[11px] font-mono text-paper-400 border-t border-ink-800/80">
                <span>Quirk: {featuredScenario.character.quirks?.messageStyle || 'Direct pacing'}</span>
                <span className="text-mint font-medium">{featuredScenario.character.quirks?.emojiHabit}</span>
              </div>
            </div>

            {/* Launch Button */}
            <Button
              variant="primary"
              size="md"
              onClick={() => onSelectScenario(featuredScenario)}
              className="w-full"
            >
              Enter Scenario as You Are →
            </Button>
          </div>
        )}
      </section>

      {/* Scenarios Section: Mode Filter & Scenario Grid */}
      <section id="scenarios" className="space-y-8 pt-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-ink-700/80">
          <div>
            <div className="font-mono text-[11px] text-coral uppercase tracking-wider mb-1">
              FULL CATALOGUE
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-paper-50 tracking-tight">
              Select Your Scenario
            </h2>
            <p className="font-sans text-xs text-paper-400 mt-1">
              Choose an interpersonal moment to play. Each encounter explores different communication dynamics.
            </p>
          </div>

          {/* Mode Switcher Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 font-mono text-xs">
            {(['all', 'social_simulator', 'conflict_arena', 'flirt_lab'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setActiveFilter(mode)}
                type="button"
                className={`px-3 py-1.5 rounded-lg border transition-all uppercase whitespace-nowrap text-[11px] ${
                  activeFilter === mode
                    ? 'bg-ink-800 border-coral text-coral font-semibold'
                    : 'bg-ink-900 border-ink-700 text-paper-400 hover:text-paper-100 hover:border-ink-600'
                }`}
              >
                {mode === 'all' ? 'All Encounters' : getModeLabel(mode)}
              </button>
            ))}
          </div>
        </div>

        {/* 7 Scenario Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredScenarios.map((scenario) => (
            <div
              key={scenario.id}
              onClick={() => onSelectScenario(scenario)}
              className="group bg-ink-900 hover:bg-ink-850 border border-ink-700/80 hover:border-coral/70 rounded-2xl p-5 sm:p-6 transition-all duration-200 flex flex-col justify-between cursor-pointer hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden"
            >
              {/* Category tag */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className={`font-mono text-[10px] px-2 py-0.5 rounded border uppercase font-semibold ${getModeColor(scenario.mode)}`}>
                  {getModeLabel(scenario.mode)}
                </span>
                <span className="font-mono text-[10px] text-paper-400">
                  {scenario.maxTurns} TURNS
                </span>
              </div>

              {/* Character Header */}
              <div className="flex items-center gap-3.5 mb-3.5">
                <CharacterAvatar
                  seed={scenario.character.avatarSeed}
                  name={scenario.character.name}
                  accentColor={scenario.character.accentColor}
                  size="md"
                  mood={scenario.character.quirks?.initialMood || 'neutral'}
                />
                <div>
                  <h3 className="font-display font-bold text-base text-paper-50 group-hover:text-white transition-colors">
                    {scenario.character.name}
                  </h3>
                  <span className="font-mono text-xs text-paper-400">
                    {scenario.character.role}
                  </span>
                </div>
              </div>

              {/* Scenario Title & Tagline */}
              <div className="space-y-1.5 mb-4 flex-1">
                <h4 className="font-display font-bold text-sm text-paper-100 group-hover:text-coral transition-colors">
                  {scenario.title}
                </h4>
                <p className="font-sans text-xs text-paper-300 leading-relaxed line-clamp-3">
                  {scenario.context}
                </p>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-ink-800 flex items-center justify-between text-xs font-mono">
                <span className="text-[11px] text-paper-400 group-hover:text-paper-300 transition-colors">
                  {scenario.initialChoices.length} tactical choices
                </span>
                <span className="text-coral group-hover:translate-x-1 transition-transform font-bold flex items-center gap-1">
                  Play →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Philosophy & Scientific Humility Section */}
      <section className="bg-ink-900 border border-ink-700 rounded-3xl p-6 sm:p-10 space-y-6">
        <div className="flex items-center gap-2 font-mono text-xs text-coral uppercase tracking-wider">
          <span>// PHILOSOPHY & DESIGN PRINCIPLES</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-paper-50 tracking-tight">
          Tendencies, Not Fixed Personality Prisons
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm text-paper-300 font-sans leading-relaxed">
          <div className="space-y-2">
            <h4 className="font-display font-bold text-paper-100 text-sm">Evidence-Backed Receipts</h4>
            <p>
              Every observation cites your exact quotes from the transcript. We never tell you what kind of person you are without pointing to what you literally chose to do.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-display font-bold text-paper-100 text-sm">Context Over Dogma</h4>
            <p>
              Directness is powerful when asking for a promotion; subtle cushioning is wise when de-escalating family dinner tension. We analyze tactical trade-offs, not "good" vs "bad" people.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-display font-bold text-paper-100 text-sm">Radical Epistemic Humility</h4>
            <p>
              A 5-turn dialogue game is an exploratory mirror, not a clinical psychiatric diagnosis. We openly list what we cannot know about your real-world relationships.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
