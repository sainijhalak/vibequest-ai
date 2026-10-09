import React, { useEffect } from 'react';
import { ScenarioDefinition } from '@vibequest/shared';
import { CharacterAvatar } from './CharacterAvatar.js';
import { soundFx } from '../../services/soundFx.js';

interface EpisodeTitleCardProps {
  scenario: ScenarioDefinition;
  onStart: () => void;
}

export const EpisodeTitleCard: React.FC<EpisodeTitleCardProps> = ({ scenario, onStart }) => {
  // Listen for Space or Enter key to start immediately
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        soundFx.playSceneStart();
        soundFx.triggerHaptic(20);
        onStart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStart]);

  const handleBegin = () => {
    soundFx.playSceneStart();
    soundFx.triggerHaptic(20);
    onStart();
  };

  const getCategoryBadge = (mode: string) => {
    switch (mode) {
      case 'conflict_arena':
        return { label: '🥊 CONFLICT ARENA', bg: 'bg-comic-pink text-white' };
      case 'social_simulator':
        return { label: '📱 SOCIAL SIMULATOR', bg: 'bg-comic-yellow text-black' };
      case 'flirt_lab':
        return { label: '💘 CHARM & BANTER RADAR (18+)', bg: 'bg-comic-cyan text-black' };
      default:
        return { label: '🎮 SCENARIO DISPATCH', bg: 'bg-comic-green text-black' };
    }
  };

  const category = getCategoryBadge(scenario.mode);

  return (
    <div className="min-h-[580px] flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      <div className="w-full max-w-3xl bg-[#FFFDF0] text-black border-4 border-black rounded-3xl p-6 sm:p-10 shadow-cartoon-xl relative overflow-hidden">
        {/* Background Comic Halftone / Dot Pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-5"
          style={{
            backgroundImage: 'radial-gradient(#000000 1.5px, transparent 1.5px)',
            backgroundSize: '16px 16px'
          }}
        />

        <div className="relative z-10 flex flex-col gap-6 sm:gap-7">
          {/* Header metadata pill strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b-4 border-black">
            <span className={`${category.bg} font-mono font-black text-xs px-3.5 py-1.5 rounded-full border-2 border-black shadow-cartoon-sm uppercase tracking-wide`}>
              {category.label}
            </span>
            <div className="flex items-center gap-2">
              <span className="bg-white text-black font-mono font-black text-xs px-3 py-1.5 rounded-full border-2 border-black shadow-cartoon-sm">
                🎯 {scenario.maxTurns} TURNS
              </span>
              <span className="bg-white text-black font-mono font-bold text-xs px-3 py-1.5 rounded-full border-2 border-black shadow-cartoon-sm hidden sm:inline-block">
                TARGET: {scenario.character.role.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Episode Title Banner */}
          <div className="space-y-2">
            <div className="inline-block bg-comic-pink text-white font-mono font-black text-xs px-3 py-1 rounded-lg border-2 border-black shadow-cartoon-sm uppercase">
              EPISODE BRIEFING
            </div>
            <h1 className="font-display font-black text-3xl sm:text-5xl text-black tracking-tight leading-tight uppercase">
              {scenario.title}
            </h1>
          </div>

          {/* Character Dossier Comic Card */}
          <div className="bg-white border-3 border-black rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 shadow-cartoon">
            <div className="relative">
              <CharacterAvatar
                seed={scenario.character.avatarSeed}
                name={scenario.character.name}
                accentColor={scenario.character.accentColor || '#FFE600'}
                size="xl"
                mood={scenario.character.quirks?.initialMood || 'neutral'}
                showMoodBadge={true}
              />
            </div>
            <div className="space-y-2 text-center sm:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="font-display font-black text-black text-lg sm:text-xl">
                  {scenario.character.name}
                </span>
                <span className="bg-comic-cyan text-black font-mono text-xs font-black px-2.5 py-0.5 rounded-full border-2 border-black shadow-cartoon-sm">
                  [{scenario.character.role}]
                </span>
              </div>
              <p className="text-xs sm:text-sm text-ink-800 font-sans font-medium leading-relaxed">
                {scenario.character.bio}
              </p>
              {scenario.character.quirks && (
                <div className="bg-comic-yellow/30 border-2 border-black rounded-xl p-2.5 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs font-mono">
                  <span className="bg-black text-white font-black px-2 py-0.5 rounded text-[11px]">
                    TEMPERAMENT
                  </span>
                  <span className="font-bold text-black">
                    {scenario.character.quirks.initialMoodDesc}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Situation & Stakes Comic Panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border-3 border-black rounded-2xl p-4 sm:p-5 shadow-cartoon flex flex-col justify-between">
              <div>
                <span className="bg-comic-orange text-white font-mono font-black text-xs px-2.5 py-1 rounded-md border-2 border-black shadow-cartoon-sm inline-block uppercase mb-2">
                  THE SITUATION
                </span>
                <p className="font-sans text-xs sm:text-sm font-medium text-black leading-relaxed">
                  {scenario.context}
                </p>
              </div>
            </div>

            <div className="bg-white border-3 border-black rounded-2xl p-4 sm:p-5 shadow-cartoon flex flex-col justify-between">
              <div>
                <span className="bg-comic-purple text-white font-mono font-black text-xs px-2.5 py-1 rounded-md border-2 border-black shadow-cartoon-sm inline-block uppercase mb-2">
                  THE PREMISE & STAKES
                </span>
                <p className="font-sans text-xs sm:text-sm font-black text-black italic leading-relaxed">
                  "{scenario.tagline}"
                </p>
              </div>
            </div>
          </div>

          {/* Launch Controls */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="font-mono text-xs font-bold text-ink-800 hidden sm:inline-block">
              Press <kbd className="px-2 py-1 bg-comic-yellow text-black border-2 border-black rounded-lg font-black shadow-cartoon-sm">SPACE</kbd> or <kbd className="px-2 py-1 bg-comic-yellow text-black border-2 border-black rounded-lg font-black shadow-cartoon-sm">ENTER</kbd> to launch!
            </span>

            <button
              type="button"
              onClick={handleBegin}
              className="w-full sm:w-auto bg-comic-green hover:bg-comic-yellow text-black font-display font-black text-base sm:text-lg px-8 py-3.5 rounded-2xl border-4 border-black shadow-cartoon-lg hover:-translate-y-1 active:translate-y-0 transition-transform cursor-pointer flex items-center justify-center gap-2"
            >
              <span>🎮 ENTER SCENARIO →</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
