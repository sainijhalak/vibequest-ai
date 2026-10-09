import React from 'react';
import { ReportResponse, BehavioralDimension } from '@vibequest/shared';
import { Button } from './ui/Button.js';

interface ReportPageProps {
  report: ReportResponse;
  onReplay: () => void;
  onExploreMore: () => void;
}

export const ReportPage: React.FC<ReportPageProps> = ({
  report,
  onReplay,
  onExploreMore
}) => {
  const dimensionMeta: Record<BehavioralDimension, { title: string; leftLabel: string; rightLabel: string }> = {
    directness: {
      title: 'Directness Spectrum',
      leftLabel: 'Subtle / Indirect',
      rightLabel: 'Unambiguous / Direct'
    },
    conflict_engagement: {
      title: 'Conflict Engagement Stance',
      leftLabel: 'Cool-Down / Reflection',
      rightLabel: 'Proactive Resolution'
    },
    boundary_expression: {
      title: 'Boundary Articulation',
      leftLabel: 'Accommodating Rapport',
      rightLabel: 'Firm Limit Setting'
    },
    perspective_taking: {
      title: 'Perspective Attunement',
      leftLabel: 'Self-Anchored Focus',
      rightLabel: 'Attuned Inquiring'
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'insufficient_evidence':
        return (
          <span className="font-mono text-[10px] text-paper-400 px-2 py-0.5 rounded bg-ink-800 border border-ink-700">
            [INSUFFICIENT EVIDENCE YET]
          </span>
        );
      case 'context_dependent':
        return (
          <span className="font-mono text-[10px] text-amber px-2 py-0.5 rounded bg-amber-tint border border-amber/30">
            [CONTEXT-DEPENDENT TENDENCY]
          </span>
        );
      case 'evaluated':
      default:
        return (
          <span className="font-mono text-[10px] text-mint px-2 py-0.5 rounded bg-mint-tint border border-mint/30">
            [OBSERVED TENDENCY]
          </span>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
      {/* Editorial Header */}
      <div className="border-b border-ink-700/80 pb-6 space-y-2">
        <div className="flex items-center justify-between font-mono text-xs text-paper-400">
          <span>RECEIPT DEBRIEF #{report.scenarioId.toUpperCase()}</span>
          <span>COMPLETED TRANSCRIPT</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-paper-50 tracking-tight">
          Your Behavioral Reflection
        </h1>
        <p className="text-sm font-mono text-coral">
          Observed during dialogue with {report.characterName} in "{report.scenarioTitle}"
        </p>
      </div>

      {/* Vibe Snapshot Summary Card */}
      <section className="bg-ink-900 border border-ink-700 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 font-mono text-xs text-mint">
          <span className="w-2 h-2 rounded-full bg-mint" />
          <span>SYNTHESIS: HOW YOU SHOWED UP</span>
        </div>
        <p className="text-base sm:text-lg text-paper-100 font-sans leading-relaxed">
          {report.vibeSnapshot}
        </p>
      </section>

      {/* Custom Designed Dimension Meters (Not Default Charts) */}
      <section className="space-y-6">
        <div className="flex items-end justify-between border-b border-ink-700/80 pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-paper-50 tracking-tight">
              Observed Tendency Meters
            </h2>
            <p className="text-xs font-mono text-paper-400 mt-0.5">
              Deterministic calculations based on your explicit choices. Not clinical personality labels.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5">
          {(Object.entries(report.scores) as [BehavioralDimension, any][]).map(([dim, data]) => {
            const meta = dimensionMeta[dim] || {
              title: dim,
              leftLabel: 'Low',
              rightLabel: 'High'
            };
            const score = data.score !== null ? data.score : 50;

            return (
              <div
                key={dim}
                className="bg-ink-900 border border-ink-700 rounded-2xl p-5 space-y-3.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <div className="flex items-center gap-3">
                    <h3 className="font-display font-bold text-sm sm:text-base text-paper-50">
                      {meta.title}
                    </h3>
                    {getStatusBadge(data.status)}
                  </div>

                  <span className="font-mono text-xs text-paper-300">
                    {data.score !== null ? `${data.score} / 100` : '—'}
                  </span>
                </div>

                {/* Custom Spectrum Gauge with tick marks */}
                <div className="space-y-1.5">
                  <div className="relative w-full h-3 bg-ink-950 rounded-sm border border-ink-700 overflow-hidden">
                    {/* Neutral Midline Marker */}
                    <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-ink-700 z-10" />

                    {/* Active Score Bar */}
                    {data.score !== null && (
                      <div
                        className="h-full bg-coral transition-all duration-500"
                        style={{ width: `${score}%` }}
                      />
                    )}
                  </div>

                  <div className="flex justify-between text-[10px] font-mono text-paper-400">
                    <span>← {meta.leftLabel}</span>
                    <span>{meta.rightLabel} →</span>
                  </div>
                </div>

                <p className="text-xs text-paper-300 font-sans leading-relaxed pt-1">
                  {data.summary}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Patterns & Alternative Moves Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Observed Patterns */}
        <div className="bg-ink-900 border border-ink-700 rounded-2xl p-6 space-y-4">
          <div className="font-mono text-xs text-coral font-medium uppercase tracking-wider">
            [OBSERVED COMMUNICATION PLAYBOOK]
          </div>
          <ul className="space-y-3 font-sans text-xs sm:text-sm text-paper-200">
            {report.observedPatterns.map((pat, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="font-mono text-coral text-xs select-none">›</span>
                <span className="leading-relaxed">{pat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Alternative Approaches */}
        <div className="bg-ink-900 border border-ink-700 rounded-2xl p-6 space-y-4">
          <div className="font-mono text-xs text-mint font-medium uppercase tracking-wider">
            [ALTERNATIVE STRATEGIC MOVES]
          </div>
          <ul className="space-y-3 font-sans text-xs sm:text-sm text-paper-200">
            {report.alternativeApproaches.map((app, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="font-mono text-mint text-xs select-none">›</span>
                <span className="leading-relaxed">{app}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Tappable Receipts (Evidence Trail) */}
      <section className="space-y-4">
        <div className="border-b border-ink-700/80 pb-2">
          <h2 className="font-display font-bold text-xl text-paper-50 tracking-tight">
            The Receipts (Supporting Evidence)
          </h2>
          <p className="font-mono text-xs text-paper-400">
            Every observation is anchored to your exact quotes during the encounter.
          </p>
        </div>

        <div className="space-y-3">
          {report.receipts.map((receipt) => (
            <div
              key={receipt.id}
              className="bg-ink-950 border-l-2 border-l-coral border border-ink-800 rounded-r-xl p-4 font-mono text-xs space-y-2"
            >
              <div className="flex items-center justify-between text-[11px] text-paper-400">
                <span className="text-coral">
                  RECEIPT #{receipt.id} • TURN {String(receipt.turnNumber).padStart(2, '0')}
                </span>
                <span className="uppercase text-paper-300">
                  LINKED: {receipt.dimension.replace('_', ' ')}
                </span>
              </div>

              <p className="font-sans text-paper-100 text-xs sm:text-sm italic pl-2 border-l border-ink-700">
                "{receipt.quote}"
              </p>

              <div className="text-paper-300 text-[11px]">
                <strong className="text-paper-200">Observed impact:</strong> {receipt.observation}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* What We Cannot Know (Scientific Humility Notice) */}
      <section className="bg-amber-tint/40 border border-amber/40 rounded-2xl p-6 space-y-3">
        <div className="font-mono text-xs text-amber font-semibold flex items-center gap-2">
          <span>⚠️ [WHAT WE CANNOT KNOW — SCIENTIFIC HUMILITY]</span>
        </div>
        <ul className="font-sans text-xs text-paper-200 space-y-2 leading-relaxed">
          {report.whatWeCannotKnow.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-amber">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Footer Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-ink-800">
        <Button variant="outline" size="md" onClick={onReplay}>
          ↺ Replay This Scenario
        </Button>
        <Button variant="primary" size="md" onClick={onExploreMore}>
          Explore Other Scenarios →
        </Button>
      </div>
    </div>
  );
};
