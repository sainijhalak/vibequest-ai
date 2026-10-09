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
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="font-mono text-[11px] uppercase tracking-wider text-paper-400 font-medium">
        TURN {String(Math.min(currentTurn, maxTurns)).padStart(2, '0')}/{String(maxTurns).padStart(2, '0')}
      </span>

      <div className="flex items-center gap-1.5 flex-1">
        {steps.map((step) => {
          const isFilled = step <= currentTurn;
          const isCurrent = step === currentTurn;

          return (
            <div
              key={step}
              className={`h-1.5 flex-1 rounded-sm transition-all duration-200 ${
                isFilled
                  ? 'bg-coral'
                  : 'bg-ink-700'
              } ${isCurrent ? 'ring-1 ring-coral/50' : ''}`}
            />
          );
        })}
      </div>
    </div>
  );
};
