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
  const [teaserSelected, setTeaserSelected] = useState<string | null>(null);
  const [teaserReply, setTeaserReply] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<GameMode | 'all'>('all');

  const handleTeaserClick = (choiceId: string, reply: string) => {
    setTeaserSelected(choiceId);
    setTimeout(() => {
      setTeaserReply(reply);
    }, 450);
  };

  const filteredScenarios = activeFilter === 'all'
    ? scenarios
    : scenarios.filter(s => s.mode === activeFilter);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* Top Banner: Status & Privacy */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-ink-700/80">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-coral animate-pulse" />
          <span className="font-display font-bold text-lg sm:text-xl tracking-tight text-paper-50">
            VIBEQUEST <span className="font-mono text-xs text-coral font-medium tracking-normal">[0.1]</span>
          </span>
          <span className="hidden md:inline font-mono text-[11px] text-paper-400 pl-2 border-l border-ink-700">
            Fictional Social Simulation
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          {mockMode && (
            <span className="px-2 py-0.5 rounded bg-amber/10 border border-amber/30 text-amber text-[11px]">
              MOCK MODE (OFFLINE / DEV)
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

      {/* Hero Section: Asymmetrical Editorial Opening + Live Chat Teaser */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Editorial Hook (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-ink-850 border border-ink-700 font-mono text-[11px] text-paper-300">
            <span className="w-1.5 h-1.5 rounded-full bg-mint" />
            <span>NO QUIZZES • ACTUAL CONVERSATION CHOICES</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-display font-bold tracking-tight text-paper-50 leading-[1.15]">
            You get a text at 11:42 PM from someone who disappeared six months ago.
          </h1>

          <p className="text-base sm:text-lg text-paper-300 font-sans leading-relaxed max-w-xl">
            What do you actually say? Skip the 30-question questionnaires. Play out realistic, messy everyday moments with Claude-powered characters. See how your actual replies reflect your boundaries, directness, and interpersonal instincts.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            {scenarios[0] && (
              <Button
                variant="primary"
                size="lg"
                onClick={() => onSelectScenario(scenarios[0])}
              >
                Enter First Scenario →
              </Button>
            )}

            <a
              href="#scenarios"
              className="font-mono text-xs text-paper-300 hover:text-paper-100 flex items-center justify-center sm:justify-start gap-1.5 py-2 px-1 transition-colors"
            >
              Browse all 3 modes ↓
            </a>
          </div>

          {/* Privacy & Consent Notice */}
          <div className="pt-4 border-t border-ink-800 text-xs font-mono text-paper-400 space-y-1">
            <p>
              * <strong className="text-paper-200">Notice & Consent:</strong> Conversation text is processed ephemerally via Anthropic Claude when live. We do not require accounts, passwords, or track personal profiles.
            </p>
            <p className="text-[11px] text-paper-400">
              * VibeQuest AI provides entertainment and behavioral observations; it is NOT a clinical psychological assessment.
            </p>
          </div>
        </div>

        {/* Right Live Chat Teaser (5 Cols) */}
        <div className="lg:col-span-5 bg-ink-900 border border-ink-700 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-ink-700/80">
            <div className="flex items-center gap-3">
              <CharacterAvatar seed="maya" name="Maya Lin" size="sm" accentColor="#E5A93B" />
              <div>
                <div className="font-display font-medium text-xs text-paper-100">Maya Lin</div>
                <div className="font-mono text-[10px] text-paper-400">College friend • 11:42 PM</div>
              </div>
            </div>
            <span className="font-mono text-[10px] text-mint px-1.5 py-0.5 rounded bg-mint/10 border border-mint/20">
              LIVE TEASER
            </span>
          </div>

          {/* Opening Bubble */}
          <div className="bg-ink-850 border border-ink-700 rounded-2xl rounded-bl-sm p-3.5 text-xs sm:text-sm text-paper-100 leading-relaxed">
            "Hey stranger! Remember me? 😂 Honestly was just thinking about that chaotic road trip we took and had to see how you were doing."
          </div>

          {/* Interactive Quick Choices */}
          {!teaserSelected ? (
            <div className="space-y-2 pt-2">
              <div className="font-mono text-[11px] text-paper-400">PICK A REACTION TO TEST THE ENGINE:</div>
              <button
                type="button"
                onClick={() => handleTeaserClick('bermuda', 'Haha fair call! Work swallowed me whole and I felt super awkward reaching out after so long.')}
                className="w-full text-left bg-ink-950 hover:bg-ink-800 border border-ink-700 hover:border-coral rounded-xl p-2.5 text-xs text-paper-200 transition-all font-sans"
              >
                <span className="font-mono text-coral mr-1.5">[01]</span>
                "Look who decided to resurface from the Bermuda Triangle! 😂 How are you?"
              </button>
              <button
                type="button"
                onClick={() => handleTeaserClick('direct', 'Oof, you are completely right. Eight months is a long time. I had a rough transition, but I missed your energy.')}
                className="w-full text-left bg-ink-950 hover:bg-ink-800 border border-ink-700 hover:border-coral rounded-xl p-2.5 text-xs text-paper-200 transition-all font-sans"
              >
                <span className="font-mono text-coral mr-1.5">[02]</span>
                "Eight months of radio silence is a long time. What prompted the sudden check-in?"
              </button>
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              {/* User outgoing bubble */}
              <div className="bg-coral-tint border border-coral/40 rounded-2xl rounded-br-sm p-3 text-xs text-paper-50 text-right ml-auto max-w-[85%]">
                {teaserSelected === 'bermuda'
                  ? "Look who decided to resurface from the Bermuda Triangle! 😂 How are you?"
                  : "Eight months of radio silence is a long time. What prompted the sudden check-in?"}
              </div>

              {/* Character dynamic response */}
              {teaserReply ? (
                <div className="bg-ink-850 border border-ink-700 rounded-2xl rounded-bl-sm p-3.5 text-xs text-paper-100 leading-relaxed animate-fadeIn">
                  "{teaserReply}"
                </div>
              ) : (
                <div className="text-[11px] font-mono text-paper-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-coral animate-ping" />
                  <span>Maya is typing...</span>
                </div>
              )}

              <button
                type="button"
                onClick={() => { setTeaserSelected(null); setTeaserReply(null); }}
                className="text-[11px] font-mono text-paper-400 hover:text-paper-200 underline pt-1 block"
              >
                Reset teaser
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Scenarios Section: Mode Filter & Scenario Grid */}
      <section id="scenarios" className="space-y-8 pt-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-ink-700/80">
          <div>
            <div className="font-mono text-[11px] text-coral uppercase tracking-wider mb-1">
              SCENARIO DISPATCH
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-paper-50 tracking-tight">
              Select Your Scenario
            </h2>
          </div>

          {/* Mode Switcher Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 font-mono text-xs">
            {(['all', 'social_simulator', 'conflict_arena', 'flirt_lab'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setActiveFilter(mode)}
                className={`px-3 py-1.5 rounded-lg uppercase tracking-wider transition-all whitespace-nowrap ${
                  activeFilter === mode
                    ? 'bg-coral text-ink-950 font-semibold'
                    : 'bg-ink-900 hover:bg-ink-850 text-paper-300 border border-ink-700'
                }`}
              >
                {mode.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Scenario Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScenarios.map((scenario, idx) => (
            <article
              key={scenario.id}
              className="bg-ink-900 border border-ink-700 hover:border-coral/60 rounded-2xl p-5 flex flex-col justify-between transition-all group active:translate-y-[1px]"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-paper-400 uppercase tracking-wider px-2 py-0.5 rounded bg-ink-950 border border-ink-800">
                    {scenario.mode.replace('_', ' ')}
                  </span>
                  <span className="font-mono text-[11px] text-coral">
                    [#{String(idx + 1).padStart(2, '0')}]
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <CharacterAvatar
                    seed={scenario.character.avatarSeed}
                    name={scenario.character.name}
                    accentColor={scenario.character.accentColor}
                    size="lg"
                  />
                  <div>
                    <h3 className="font-display font-bold text-base text-paper-50 group-hover:text-coral transition-colors leading-snug">
                      {scenario.title}
                    </h3>
                    <p className="text-xs text-paper-400 font-mono mt-0.5">
                      {scenario.character.name} • {scenario.character.role}
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-paper-200 leading-relaxed font-sans line-clamp-3">
                  {scenario.context}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {scenario.character.traits.map(t => (
                    <span key={t} className="text-[10px] font-mono text-paper-400 px-2 py-0.5 rounded bg-ink-850 border border-ink-700/60">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-ink-800 flex items-center justify-between">
                <span className="font-mono text-[11px] text-paper-400">
                  {scenario.maxTurns} turns
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onSelectScenario(scenario)}
                >
                  Enter Scenario →
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
