import React, { useEffect } from 'react';
import { ScenarioDefinition } from '@vibequest/shared';
import { CharacterAvatar } from './CharacterAvatar.js';
import { Button } from './Button.js';
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

  const getCategoryLabel = (mode: string) => {
    switch (mode) {
      case 'conflict_arena':
        return 'CONFLICT ARENA';
      case 'social_simulator':
        return 'SOCIAL SIMULATOR';
      case 'flirt_lab':
        return 'FLIRT LAB';
      default:
        return 'SCENARIO DISPATCH';
    }
  };

  return (
    <div className="min-h-[580px] flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="w-full max-w-2xl bg-ink-900 border border-ink-700/80 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-sm">
        {/* Subtle decorative top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ backgroundColor: scenario.character.accentColor || '#FF5C35' }}
        />

        <div className="flex flex-col gap-6">
          {/* Header metadata */}
          <div className="flex items-center justify-between text-xs font-mono border-b border-ink-800 pb-4">
            <span className="text-coral font-bold tracking-widest uppercase">
              // {getCategoryLabel(scenario.mode)}
            </span>
            <span className="text-paper-400">
              {scenario.maxTurns} TURNS • TARGET: {scenario.character.role.toUpperCase()}
            </span>
          </div>

          {/* Episode Title */}
          <div className="space-y-2">
            <span className="font-mono text-xs uppercase tracking-wider text-paper-400">
              EPISODE TITLE:
            </span>
            <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-paper-50 tracking-tight leading-tight">
              {scenario.title}
            </h1>
          </div>

          {/* Character Dossier Mini-Card */}
          <div className="bg-ink-950 border border-ink-800 rounded-2xl p-4 flex items-center gap-4">
            <CharacterAvatar
              seed={scenario.character.avatarSeed}
              name={scenario.character.name}
              accentColor={scenario.character.accentColor}
              size="lg"
              mood={scenario.character.quirks?.initialMood || 'neutral'}
              showMoodBadge={true}
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-paper-50 text-base">
                  {scenario.character.name}
                </span>
                <span className="font-mono text-xs text-paper-400">
                  [{scenario.character.role}]
                </span>
              </div>
              <p className="text-xs text-paper-300 font-sans line-clamp-2">
                {scenario.character.bio}
              </p>
              {scenario.character.quirks && (
                <div className="font-mono text-[11px] text-paper-400 pt-1 flex items-center gap-2">
                  <span className="text-amber">TEMPERAMENT:</span>
                  <span className="text-paper-200">
                    {scenario.character.quirks.initialMoodDesc}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* The Stakes & Situation */}
          <div className="space-y-3 bg-ink-950/60 border border-ink-800/80 rounded-2xl p-4 sm:p-5">
            <div>
              <span className="font-mono text-[11px] text-coral font-bold tracking-wider uppercase block mb-1">
                THE SITUATION
              </span>
              <p className="font-sans text-xs sm:text-sm text-paper-200 leading-relaxed">
                {scenario.context}
              </p>
            </div>

            <div className="pt-2 border-t border-ink-800/60">
              <span className="font-mono text-[11px] text-amber font-bold tracking-wider uppercase block mb-1">
                THE PREMISE / STAKES
              </span>
              <p className="font-sans text-xs sm:text-sm text-paper-300 italic leading-relaxed">
                "{scenario.tagline}"
              </p>
            </div>
          </div>

          {/* Action Call / Launch Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="font-mono text-[11px] text-paper-400 hidden sm:inline-block">
              Press <kbd className="px-1.5 py-0.5 bg-ink-800 border border-ink-700 rounded text-paper-200">SPACE</kbd> or <kbd className="px-1.5 py-0.5 bg-ink-800 border border-ink-700 rounded text-paper-200">ENTER</kbd> to enter
            </span>

            <Button
              variant="primary"
              size="lg"
              onClick={handleBegin}
              className="w-full sm:w-auto"
            >
              Enter Scenario →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
