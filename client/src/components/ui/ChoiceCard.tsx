import React from 'react';
import { ChoiceOption } from '@vibequest/shared';

interface ChoiceCardProps {
  choice: ChoiceOption;
  index: number;
  disabled?: boolean;
  onSelect: (choice: ChoiceOption) => void;
}

export const ChoiceCard: React.FC<ChoiceCardProps> = ({
  choice,
  index,
  disabled = false,
  onSelect
}) => {
  const indexStr = String(index + 1).padStart(2, '0');

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onSelect(choice)}
      className="w-full text-left bg-ink-900 hover:bg-ink-850 border border-ink-700 hover:border-coral/60 rounded-xl p-4 transition-all duration-150 group active:translate-y-[1px] disabled:opacity-40 disabled:pointer-events-none flex flex-col justify-between focus-visible:ring-2 focus-visible:ring-coral"
    >
      <div className="flex items-center justify-between gap-2 mb-2 w-full">
        <span className="font-mono text-[11px] font-semibold text-coral/90 group-hover:text-coral transition-colors">
          [{indexStr}]
        </span>
        <span className="font-display font-medium text-xs text-paper-200 group-hover:text-paper-50 tracking-tight transition-colors">
          {choice.label}
        </span>
      </div>

      <p className="text-xs sm:text-sm text-paper-100 font-sans leading-relaxed group-hover:text-white transition-colors">
        "{choice.text}"
      </p>
    </button>
  );
};
