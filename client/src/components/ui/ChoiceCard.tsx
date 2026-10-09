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
      className={`w-full text-left bg-white hover:bg-comic-yellow text-black border-3 border-black rounded-2xl p-4 transition-all duration-150 ease-out group shadow-cartoon hover:shadow-cartoon-lg hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none disabled:transform-none flex flex-col justify-between focus-visible:ring-2 focus-visible:ring-black relative cursor-pointer ${className}`}
    >
      <div className="flex items-center justify-between gap-2 mb-2 w-full">
        <span className="font-mono text-xs font-black bg-black text-white group-hover:bg-comic-pink group-hover:text-white px-2 py-0.5 rounded-lg border-2 border-black shadow-cartoon-sm transition-colors">
          #{indexStr}
        </span>
        <span className="font-display font-black text-xs text-black uppercase tracking-wide group-hover:underline decoration-2">
          {choice.label}
        </span>
      </div>

      <p className="text-xs sm:text-sm font-sans font-bold text-black leading-snug">
        "{choice.text}"
      </p>
    </button>
  );
};
