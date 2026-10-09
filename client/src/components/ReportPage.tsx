import React, { useState } from 'react';
import { ReportResponse } from '@vibequest/shared';
import { Cartoon3DMascot } from './three/Cartoon3DMascot.js';
import { CharacterAvatar } from './ui/CharacterAvatar.js';
import { soundFx } from '../services/soundFx.js';

interface ReportPageProps {
  report: ReportResponse;
  onReplay: () => void;
  onExploreMore: () => void;
  onGoToRoastBot?: () => void;
}

export const ReportPage: React.FC<ReportPageProps> = ({
  report,
  onReplay,
  onExploreMore,
  onGoToRoastBot
}) => {
  const [selectedReceiptId, setSelectedReceiptId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Fallback report card data if not generated
  const reportCard = report.reportCard || {
    overallGpa: '3.8 / 4.0 GPA',
    overallGrade: 'A-',
    honorRollTitle: 'CERTIFIED CHAOTIC GOOD',
    funnySuperlative: 'Most likely to reply "haha no worries!" while plotting mild revenge',
    teacherRemarks: `Student handled encounter with ${report.characterName} with distinct personality. Stood their ground, gave no free passes, and made choices with pure main-character energy.`,
    subjectGrades: [
      {
        subject: 'Directness & Truth Bombing',
        grade: 'A',
        score: report.scores.directness?.score ?? 82,
        funnyComment: 'Delivers truth with the subtlety of a rogue fire engine. Zero subtext.'
      },
      {
        subject: 'Conflict Boxing & Drama Navigation',
        grade: 'B+',
        score: report.scores.conflict_engagement?.score ?? 74,
        funnyComment: 'Walks directly into unresolved drama with popcorn and a strategy.'
      },
      {
        subject: 'Boundary Articulation & Walls',
        grade: 'A-',
        score: report.scores.boundary_expression?.score ?? 85,
        funnyComment: 'Reinforced concrete perimeter. Trespassers will be politely dismantled.'
      },
      {
        subject: 'Empathy & Room-Reading Radar',
        grade: 'B',
        score: report.scores.perspective_taking?.score ?? 68,
        funnyComment: 'Reads social cues instantly, then decides whether to care.'
      }
    ],
    stampBadge: 'PASSED WITH FLYING RED FLAGS',
    roastVerdict: '10/10 would analyze your questionable texting habits again.'
  };

  const handleCopyReport = () => {
    soundFx.playTap();
    const copyText = `📜 VIBEQUEST OFFICIAL REPORT CARD
------------------------------------
Student: YOU
Scenario: ${report.scenarioTitle}
Archetype: ${report.archetype || 'The Calibrated Tactician'}
Overall GPA: ${reportCard.overallGpa} (${reportCard.overallGrade})
Senior Superlative: "${reportCard.funnySuperlative}"

GRADES:
${reportCard.subjectGrades.map(s => `• ${s.subject}: ${s.grade} (${s.score}/100) — ${s.funnyComment}`).join('\n')}

Counselor Remarks:
"${reportCard.teacherRemarks}"
------------------------------------
Test your vibe at VibeQuest AI!`;

    navigator.clipboard.writeText(copyText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      {/* Cartoon Report Card Envelope & Top Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b-4 border-black">
        <div className="flex items-center gap-3">
          <button
            onClick={onExploreMore}
            type="button"
            className="bg-comic-yellow hover:bg-comic-orange text-black font-mono font-extrabold text-xs px-3.5 py-1.5 rounded-xl border-3 border-black shadow-cartoon transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            ← PLAY ANOTHER SCENARIO
          </button>
          <span className="bg-comic-green text-black font-mono font-extrabold text-xs px-3 py-1 rounded-full border-2 border-black shadow-cartoon-sm">
            OFFICIAL REPORT CARD
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onGoToRoastBot && (
            <button
              onClick={onGoToRoastBot}
              type="button"
              className="bg-comic-pink text-white hover:bg-comic-orange font-display font-black text-xs px-3.5 py-2 rounded-xl border-3 border-black shadow-cartoon transition-all hover:-translate-y-0.5"
            >
              🔥 CHALLENGE ROAST BOT!
            </button>
          )}

          <button
            onClick={handleCopyReport}
            type="button"
            className="bg-white hover:bg-comic-yellow text-black font-mono font-bold text-xs px-3.5 py-2 rounded-xl border-3 border-black shadow-cartoon transition-all hover:-translate-y-0.5 flex items-center gap-1.5"
          >
            <span>{copied ? '✅ COPIED!' : '📋 SHARE CARD'}</span>
          </button>
        </div>
      </div>

      {/* Main Comic Report Card Document */}
      <div className="bg-[#FFFDF0] text-black border-4 border-black rounded-3xl p-6 sm:p-10 shadow-cartoon-xl relative overflow-hidden">
        {/* Background Comic Dot Grid Motif */}
        <div
          className="absolute inset-0 pointer-events-none opacity-5"
          style={{
            backgroundImage: 'radial-gradient(#000000 1.5px, transparent 1.5px)',
            backgroundSize: '16px 16px'
          }}
        />

        {/* Top Header Stamp & Mascot */}
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b-4 border-black">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-black text-white font-mono font-extrabold text-[10px] px-2.5 py-0.5 rounded tracking-widest uppercase">
                ACADEMIC YEAR 2026
              </span>
              <span className="font-mono text-xs text-ink-600 font-bold">
                ENCOUNTER #{report.scenarioId.toUpperCase()}
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-black text-black tracking-tight uppercase">
              VIBE REPORT CARD
            </h1>
            <p className="font-sans font-semibold text-xs sm:text-sm text-ink-800 mt-1">
              Academy of Social Survival & Interpersonal Boxing
            </p>
          </div>

          {/* 3D Mascot & Grade Badge */}
          <div className="flex items-center gap-4 self-center md:self-auto">
            <div className="text-center">
              <div className="relative inline-block bg-comic-yellow p-1 rounded-2xl border-3 border-black shadow-cartoon">
                <Cartoon3DMascot mood="happy" size="sm" />
              </div>
            </div>

            {/* Huge Overall Letter Grade Circle */}
            <div className="relative bg-comic-pink text-white w-24 h-24 rounded-3xl border-4 border-black shadow-cartoon flex flex-col items-center justify-center transform rotate-3 hover:rotate-0 transition-transform">
              <span className="font-display font-black text-4xl leading-none">
                {reportCard.overallGrade}
              </span>
              <span className="font-mono font-bold text-[9px] uppercase tracking-wider mt-0.5">
                GPA {reportCard.overallGpa.split(' ')[0]}
              </span>

              {/* Comic Stamp Angle Ribbon */}
              <div className="absolute -top-3 -right-3 bg-comic-green text-black font-mono font-black text-[9px] px-2 py-0.5 rounded-full border-2 border-black shadow-cartoon-sm rotate-12">
                PASSED!
              </div>
            </div>
          </div>
        </div>

        {/* Honor Roll & Senior Superlative Banner */}
        <div className="my-6 p-4 rounded-2xl bg-comic-yellow border-3 border-black shadow-cartoon flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏆</span>
            <div>
              <div className="font-mono text-[10px] font-extrabold text-black uppercase tracking-wider">
                SENIOR SUPERLATIVE & ARCHETYPE:
              </div>
              <div className="font-display font-black text-base sm:text-lg text-black">
                {report.archetype || reportCard.honorRollTitle}
              </div>
            </div>
          </div>

          <div className="bg-white text-black font-sans font-bold text-xs px-3 py-1.5 rounded-xl border-2 border-black italic shadow-cartoon-sm">
            "{reportCard.funnySuperlative}"
          </div>
        </div>

        {/* Subjects & Grades Breakdown Table */}
        <div className="space-y-4 my-8">
          <div className="flex items-center justify-between font-mono font-extrabold text-xs text-black pb-2 border-b-2 border-black uppercase">
            <span>CORE SUBJECT / BEHAVIOR</span>
            <span>GRADE / PERCENTILE</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {reportCard.subjectGrades.map((subject, idx) => (
              <div
                key={idx}
                className="bg-white p-4 rounded-2xl border-3 border-black shadow-cartoon flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:-translate-y-0.5 transition-transform"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-extrabold text-xs text-comic-pink">
                      [{String(idx + 1).padStart(2, '0')}]
                    </span>
                    <h3 className="font-display font-black text-base text-black">
                      {subject.subject}
                    </h3>
                  </div>
                  <p className="font-sans font-medium text-xs text-ink-700 leading-relaxed">
                    💬 {subject.funnyComment}
                  </p>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <div className="w-24 bg-ink-950/10 h-3 rounded-full border border-black overflow-hidden hidden sm:block">
                    <div
                      className="bg-comic-pink h-full"
                      style={{ width: `${subject.score}%` }}
                    />
                  </div>
                  <div className="bg-comic-cyan text-black px-3 py-1.5 rounded-xl border-2 border-black font-display font-black text-lg shadow-cartoon-sm min-w-[54px] text-center">
                    {subject.grade}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Counselor's Confidential Remarks Box */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border-3 border-black shadow-cartoon space-y-3 relative">
          <div className="flex items-center gap-2">
            <span className="bg-comic-pink text-white font-mono font-extrabold text-[10px] px-2 py-0.5 rounded border border-black">
              COUNSELOR REMARKS
            </span>
            <span className="font-mono text-xs font-bold text-ink-600">CONFIDENTIAL FILE</span>
          </div>
          <p className="font-sans font-medium text-xs sm:text-sm text-black leading-relaxed">
            {reportCard.teacherRemarks}
          </p>
          {report.vibeSnapshot && (
            <p className="font-sans text-xs text-ink-800 italic pt-2 border-t-2 border-black/10">
              "{report.vibeSnapshot}"
            </p>
          )}
        </div>

        {/* In-Character Reaction ("How It Landed with Character") */}
        {report.howItLanded && (
          <div className="mt-6 bg-comic-yellow/30 p-5 rounded-2xl border-3 border-black shadow-cartoon flex items-start gap-4">
            <CharacterAvatar
              seed={report.scenarioId}
              name={report.characterName}
              size="md"
              mood="warm"
            />
            <div className="space-y-1">
              <span className="font-mono text-[10px] font-extrabold text-black uppercase tracking-wider block">
                PEER REVIEW FROM {report.characterName.toUpperCase()}:
              </span>
              <p className="font-sans font-semibold text-xs sm:text-sm text-black italic leading-relaxed">
                {report.howItLanded}
              </p>
            </div>
          </div>
        )}

        {/* Evidence Receipts Drawer */}
        <div className="mt-8 pt-6 border-t-4 border-black space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-black text-lg text-black uppercase">
              EXHIBIT A: YOUR ACTUAL CONVERSATION RECEIPTS
            </h3>
            <span className="font-mono text-xs font-bold text-ink-600">
              {report.receipts.length} RECEIPTS LOGGED
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {report.receipts.map((receipt) => {
              const isSelected = selectedReceiptId === receipt.id;
              return (
                <button
                  key={receipt.id}
                  type="button"
                  onClick={() => setSelectedReceiptId(isSelected ? null : receipt.id)}
                  className={`text-left p-4 rounded-2xl border-3 border-black transition-all ${
                    isSelected
                      ? 'bg-comic-cyan shadow-cartoon-sm'
                      : 'bg-white hover:bg-comic-yellow/30 shadow-cartoon hover:-translate-y-0.5'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono font-bold mb-1.5">
                    <span className="text-comic-pink">TURN #{receipt.turnNumber}</span>
                    <span className="text-black uppercase text-[10px]">
                      {receipt.dimension.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="font-sans font-bold text-xs sm:text-sm text-black line-clamp-2">
                    "{receipt.quote}"
                  </p>
                  <p className="font-sans text-[11px] text-ink-700 mt-2 italic">
                    Observation: {receipt.observation}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Stamp of Approval Footer Badge */}
        <div className="mt-10 pt-6 border-t-3 border-black flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-comic-pink text-white font-mono font-black text-xs px-3 py-1 rounded-full border-2 border-black rotate-[-4deg] shadow-cartoon-sm">
              {reportCard.stampBadge}
            </div>
            <span className="font-mono text-xs text-ink-600 font-bold">
              VERIFIED BY VIBEQUEST COGNITIVE ENGINE
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onReplay}
              type="button"
              className="bg-white hover:bg-comic-yellow text-black font-display font-black text-xs px-4 py-2.5 rounded-xl border-3 border-black shadow-cartoon transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              🔄 REPLAY SCENARIO
            </button>
            <button
              onClick={onExploreMore}
              type="button"
              className="bg-comic-yellow hover:bg-comic-orange text-black font-display font-black text-xs px-4 py-2.5 rounded-xl border-3 border-black shadow-cartoon transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              🎮 MORE SCENARIOS →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
