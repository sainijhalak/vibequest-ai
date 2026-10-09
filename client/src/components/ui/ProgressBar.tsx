import React from 'react';

interface ProgressBarProps {
  currentTurn: number;
  maxTurns: number;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentTurn,
  maxTurns,
  className = ''
}) => {
  const steps = Array.from({ length: maxTurns }, (_, i) => i + 1);

  return (
    <div className={`flex items-center gap-2 sm:gap-3 ${className}`}>
      <span className="bg-comic-yellow text-black font-mono font-black text-xs px-2.5 py-1 rounded-xl border-2 border-black shadow-cartoon-sm whitespace-nowrap">
        TURN {String(Math.min(currentTurn, maxTurns)).padStart(2, '0')}/{String(maxTurns).padStart(2, '0')}
      </span>

      <div className="bg-white border-2 border-black rounded-xl p-1 flex items-center gap-1 shadow-cartoon-sm flex-1 min-w-[120px]">
        {steps.map((step) => {
          const isFilled = step <= currentTurn;
          const isCurrent = step === currentTurn;

          return (
            <div
              key={step}
              className={`h-3 flex-1 rounded-md transition-all ${
                isCurrent
                  ? 'bg-comic-pink border-2 border-black shadow-cartoon-sm scale-105'
                  : isFilled
                  ? 'bg-comic-green border border-black'
                  : 'bg-gray-200 border border-black/30'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};
