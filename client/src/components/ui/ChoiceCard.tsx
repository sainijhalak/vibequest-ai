import React from 'react';
import { ChoiceOption } from '@vibequest/shared';
import { soundFx } from '../../services/soundFx.js';

interface ChoiceCardProps {
  choice: ChoiceOption;
  index: number;
  disabled?: boolean;
  onSelect: (choice: ChoiceOption) => void;
  className?: string;
}

export const ChoiceCard: React.FC<ChoiceCardProps> = ({
  choice,
  index,
  disabled = false,
  onSelect,
  className = ''
}) => {
  const indexStr = String(index + 1).padStart(2, '0');

  const handleClick = () => {
    if (disabled) return;
    soundFx.playTap();
    soundFx.triggerHaptic(14);
    onSelect(choice);
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={handleClick}
      className={`w-full text-left bg-ink-900 hover:bg-ink-850 border border-ink-700 hover:border-coral/70 rounded-xl p-4 transition-all duration-150 ease-out group hover:scale-[1.012] hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 disabled:opacity-40 disabled:pointer-events-none disabled:transform-none flex flex-col justify-between focus-visible:ring-2 focus-visible:ring-coral relative overflow-hidden hover:shadow-[0_4px_24px_rgba(255,92,53,0.12)] ${className}`}
    >
      {/* Left accent indicator bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-coral transition-colors duration-150" />

      <div className="flex items-center justify-between gap-2 mb-2 w-full pl-1">
        <span className="font-mono text-[11px] font-semibold text-coral/90 group-hover:text-coral transition-colors">
          [{indexStr}]
        </span>
        <span className="font-display font-medium text-xs text-paper-200 group-hover:text-paper-50 tracking-tight transition-colors">
          {choice.label}
        </span>
      </div>

      <p className="text-xs sm:text-sm text-paper-100 font-sans leading-relaxed group-hover:text-white transition-colors pl-1">
        "{choice.text}"
      </p>
    </button>
  );
};
