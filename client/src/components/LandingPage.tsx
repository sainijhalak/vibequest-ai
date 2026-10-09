import React, { useState } from 'react';
import { GameMode, ScenarioDefinition } from '@vibequest/shared';
import { Cartoon3DMascot } from './three/Cartoon3DMascot.js';
import { Cartoon3DScene } from './three/Cartoon3DScene.js';
import { CharacterAvatar } from './ui/CharacterAvatar.js';
import { soundFx } from '../services/soundFx.js';

interface LandingPageProps {
  scenarios: ScenarioDefinition[];
  onSelectScenario: (scenario: ScenarioDefinition) => void;
  onClearData: () => void;
  mockMode: boolean;
  onGoToRoastBot?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  scenarios,
  onSelectScenario,
  onClearData,
  mockMode: _mockMode,
  onGoToRoastBot
}) => {
  const [activeFilter, setActiveFilter] = useState<GameMode | 'all'>('all');
  const featuredScenario = scenarios[0];

  const filteredScenarios = activeFilter === 'all'
    ? scenarios
    : scenarios.filter(s => s.mode === activeFilter);

  const getModeLabel = (mode: GameMode) => {
    switch (mode) {
      case 'conflict_arena':
        return '🥊 CONFLICT ARENA';
      case 'social_simulator':
        return '📱 SOCIAL SIMULATOR';
      case 'flirt_lab':
        return '💘 FLIRT LAB';
      default:
        return '🎮 SCENARIO';
    }
  };

  const getModeColor = (mode: GameMode) => {
    switch (mode) {
      case 'conflict_arena':
        return 'bg-comic-pink text-white border-black';
      case 'social_simulator':
        return 'bg-comic-yellow text-black border-black';
      case 'flirt_lab':
        return 'bg-comic-cyan text-black border-black';
      default:
        return 'bg-white text-black border-black';
    }
  };

  return (
    <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16 overflow-hidden">
      {/* 3D Floating Cartoon Background Scene */}
      <Cartoon3DScene className="opacity-40" />

      {/* Top Banner: Status & Navigation */}
      <header className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-4 border-black">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-comic-green border-2 border-black animate-bounce" />
          <span className="font-display font-black text-2xl tracking-tight text-paper-50 uppercase">
            VIBEQUEST <span className="bg-comic-yellow text-black font-mono text-xs px-2 py-0.5 rounded-lg border-2 border-black">3D CARTOON</span>
          </span>
          <span className="hidden md:inline font-mono text-xs text-paper-300 pl-3 border-l-2 border-paper-400">
            Interactive Social Game & Comedy Report Card
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono font-bold">
          {onGoToRoastBot && (
            <button
              onClick={() => {
                soundFx.playTap();
                onGoToRoastBot();
              }}
              type="button"
              className="bg-comic-pink hover:bg-comic-orange text-white font-display font-black px-4 py-2 rounded-xl border-3 border-black shadow-cartoon hover:-translate-y-0.5 active:translate-y-0 transition-transform flex items-center gap-1.5"
            >
              <span>🔥 ROAST ARENA</span>
            </button>
          )}

          <button
            onClick={onClearData}
            type="button"
            className="text-paper-400 hover:text-white underline decoration-paper-400 underline-offset-4 transition-colors"
          >
            Clear data
          </button>
        </div>
      </header>

      {/* Hero Section: 3D Mascot Stage + Bold Comic Hook */}
      <section className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Comic Hook */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-comic-yellow text-black border-3 border-black font-mono text-xs font-black shadow-cartoon-sm">
            <span>⚡ ZERO BORING QUIZZES</span>
            <span>•</span>
            <span>REAL INTERPERSONAL CHOICES</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-display font-black tracking-tight text-white leading-[1.08] uppercase">
            Play The Moment. <br />
            <span className="text-comic-pink bg-black px-2 border-3 border-black shadow-cartoon inline-block my-1">
              DISCOVER YOUR VIBE.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-paper-200 font-sans font-medium leading-relaxed max-w-xl">
            Step into dramatic everyday texts, awkward friend dilemmas, workplace credit heists, and rainy café sparks. Talk directly with expressive cartoon characters, choose your tactics, and receive your hilarious official **Vibe Report Card** with letter grades and teacher remarks!
          </p>

          {/* Quick Action Badges */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onSelectScenario(featuredScenario)}
              className="bg-comic-green hover:bg-comic-yellow text-black font-display font-black text-base px-6 py-3.5 rounded-2xl border-4 border-black shadow-cartoon-lg hover:-translate-y-1 active:translate-y-0 transition-transform flex items-center gap-2"
            >
              <span>🎮 JUMP INTO SCENARIO →</span>
            </button>

            {onGoToRoastBot && (
              <button
                type="button"
                onClick={() => {
                  soundFx.playTap();
                  onGoToRoastBot();
                }}
                className="bg-comic-cyan hover:bg-comic-pink hover:text-white text-black font-display font-black text-base px-6 py-3.5 rounded-2xl border-4 border-black shadow-cartoon-lg hover:-translate-y-1 active:translate-y-0 transition-all flex items-center gap-2"
              >
                <span>🔥 ROAST BATTLE WITH BUSTER</span>
              </button>
            )}
          </div>

          {/* Comic Stickers Row */}
          <div className="flex items-center gap-2 pt-2">
            <span className="bg-white text-black font-mono font-black text-[10px] px-2.5 py-1 rounded-full border-2 border-black rotate-[-3deg] shadow-cartoon-sm">
              ✨ THREE.JS 3D
            </span>
            <span className="bg-comic-pink text-white font-mono font-black text-[10px] px-2.5 py-1 rounded-full border-2 border-black rotate-[2deg] shadow-cartoon-sm">
              💥 100% UNFILTERED
            </span>
            <span className="bg-comic-yellow text-black font-mono font-black text-[10px] px-2.5 py-1 rounded-full border-2 border-black rotate-[-2deg] shadow-cartoon-sm">
              📜 COMEDY REPORT CARD
            </span>
          </div>
        </div>

        {/* Right 3D Interactive Mascot Stage */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="relative bg-[#FFFDF0] p-6 sm:p-8 rounded-3xl border-4 border-black shadow-cartoon-xl text-center w-full max-w-sm">
            {/* Comic Floating Tag */}
            <div className="absolute -top-4 -right-3 bg-comic-pink text-white font-mono font-extrabold text-xs px-3 py-1 rounded-full border-2 border-black rotate-6 shadow-cartoon-sm">
              CLICK TO BOUNCE!
            </div>

            {/* Three.js 3D Mascot */}
            <div className="py-2 flex justify-center">
              <Cartoon3DMascot mood="happy" size="lg" />
            </div>

            <div className="space-y-1 mt-2">
              <div className="font-display font-black text-xl text-black uppercase">
                BUSTER 3000
              </div>
              <p className="font-sans font-semibold text-xs text-ink-700">
                Interactive 3D mascot. Mouse tracks eyes. Ready to roast or cheer you on!
              </p>
            </div>

            {onGoToRoastBot && (
              <button
                type="button"
                onClick={onGoToRoastBot}
                className="w-full mt-4 bg-comic-yellow hover:bg-comic-orange text-black font-display font-black text-xs py-2.5 rounded-xl border-3 border-black shadow-cartoon hover:-translate-y-0.5 active:translate-y-0 transition-transform"
              >
                ENTER ROAST BATTLE ARENA ⚔️
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Standalone Feature: Buster's Roast Battle Banner */}
      {onGoToRoastBot && (
        <section className="relative z-10 bg-comic-pink text-white rounded-3xl border-4 border-black p-6 sm:p-8 shadow-cartoon-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-block bg-black text-comic-yellow font-mono font-extrabold text-xs px-3 py-1 rounded-full border-2 border-black shadow-cartoon-sm">
              NEW GAME MODE: BUSTER ARENA
            </div>
            <h2 className="text-2xl sm:text-4xl font-display font-black tracking-tight text-white uppercase">
              🔥 Have an Unhinged Roast Battle!
            </h2>
            <p className="font-sans font-semibold text-xs sm:text-sm text-white/95 max-w-xl leading-relaxed">
              Think you have sharp comebacks? Trade roasts with Buster in real time, see who runs out of HP first, or drop awkward texts for a brutal vibe check!
            </p>
          </div>

          <button
            type="button"
            onClick={onGoToRoastBot}
            className="bg-comic-yellow hover:bg-comic-green text-black font-display font-black text-sm px-6 py-3.5 rounded-2xl border-3 border-black shadow-cartoon hover:-translate-y-1 active:translate-y-0 transition-transform whitespace-nowrap"
          >
            START ROAST BATTLE →
          </button>
        </section>
      )}

      {/* Scenario Filter & Full Game Catalogue */}
      <section className="relative z-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b-3 border-black">
          <div>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight uppercase">
              EXPLORE SOCIAL ENCOUNTERS
            </h2>
            <p className="font-sans font-medium text-xs text-paper-300 mt-0.5">
              Choose your playground. Every encounter features distinct characters, stakes, and comedy report cards.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {(['all', 'social_simulator', 'conflict_arena', 'flirt_lab'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => {
                  soundFx.playTap();
                  setActiveFilter(mode);
                }}
                className={`font-mono font-bold text-xs px-3 py-1.5 rounded-xl border-2 border-black transition-all ${
                  activeFilter === mode
                    ? 'bg-comic-yellow text-black shadow-cartoon-sm scale-105'
                    : 'bg-white text-black hover:bg-paper-100'
                }`}
              >
                {mode === 'all' ? 'ALL MODES (7)' : getModeLabel(mode)}
              </button>
            ))}
          </div>
        </div>

        {/* 7 Scenario Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredScenarios.map((s) => (
            <div
              key={s.id}
              onClick={() => onSelectScenario(s)}
              className="group bg-[#FFFDF0] text-black rounded-3xl border-4 border-black p-5 shadow-cartoon hover:shadow-cartoon-lg hover:-translate-y-1 transition-all duration-150 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className={`font-mono font-extrabold text-[10px] px-2.5 py-1 rounded-full border-2 ${getModeColor(s.mode)} shadow-cartoon-sm`}>
                    {getModeLabel(s.mode)}
                  </span>
                  <span className="font-mono text-xs font-bold text-ink-600">
                    {s.maxTurns} TURNS
                  </span>
                </div>

                <div className="flex items-start gap-3 pt-1">
                  <CharacterAvatar
                    seed={s.character.avatarSeed}
                    name={s.character.name}
                    accentColor={s.character.accentColor}
                    size="md"
                    mood="warm"
                  />
                  <div>
                    <h3 className="font-display font-black text-lg text-black group-hover:text-comic-pink transition-colors">
                      {s.title}
                    </h3>
                    <span className="font-mono text-xs text-ink-700 font-bold">
                      with {s.character.name} ({s.character.role})
                    </span>
                  </div>
                </div>

                <p className="font-sans font-medium text-xs text-ink-800 line-clamp-2">
                  "{s.tagline}"
                </p>
              </div>

              <div className="pt-4 border-t-2 border-black/10 flex items-center justify-between mt-3">
                <span className="font-sans font-bold text-xs text-comic-pink group-hover:underline">
                  Play this scenario →
                </span>
                <span className="text-base group-hover:scale-125 transition-transform">
                  🚀
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
