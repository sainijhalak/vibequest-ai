import React, { useState, useEffect } from 'react';
import {
  ScenarioDefinition,
  ReportResponse,
  ReportResponseSchema,
  HealthResponse,
  SCENARIOS
} from '@vibequest/shared';
import { ApiService } from './services/api.js';
import { LandingPage } from './components/LandingPage.js';
import { ScenarioPlayer } from './components/ScenarioPlayer.js';
import { ReportPage } from './components/ReportPage.js';
import { RoastBattleBot } from './components/RoastBattleBot.js';
import { soundFx } from './services/soundFx.js';

const STORAGE_VIEW_KEY = 'vibequest_session_view';
const STORAGE_REPORT_KEY = 'vibequest_session_report';
const STORAGE_SCENARIO_ID_KEY = 'vibequest_session_scenario_id';

export const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'player' | 'report' | 'roast'>('landing');
  const [scenarios, setScenarios] = useState<ScenarioDefinition[]>(SCENARIOS);
  const [activeScenario, setActiveScenario] = useState<ScenarioDefinition | null>(null);
  const [activeReport, setActiveReport] = useState<ReportResponse | null>(null);
  const [mockMode, setMockMode] = useState<boolean>(true);

  // Restore session from sessionStorage on mount
  useEffect(() => {
    try {
      const savedReportJson = sessionStorage.getItem(STORAGE_REPORT_KEY);
      const savedView = sessionStorage.getItem(STORAGE_VIEW_KEY);
      const savedScenarioId = sessionStorage.getItem(STORAGE_SCENARIO_ID_KEY);

      if (savedScenarioId) {
        const found = SCENARIOS.find(s => s.id === savedScenarioId);
        if (found) setActiveScenario(found);
      }

      if (savedReportJson) {
        const parsedReport = ReportResponseSchema.safeParse(JSON.parse(savedReportJson));
        if (parsedReport.success) {
          setActiveReport(parsedReport.data);
          if (savedView === 'report') {
            setView('report');
          }
        }
      }
    } catch {
      // Ignore storage parse issues
    }
  }, []);

  useEffect(() => {
    ApiService.getHealth()
      .then((h: HealthResponse) => {
        setMockMode(h.mockMode);
      })
      .catch(() => {
        setMockMode(true);
      });

    ApiService.getScenarios()
      .then((fetched) => {
        if (fetched && fetched.length > 0) {
          setScenarios(fetched);
        }
      })
      .catch(() => {
        // Fallback already pre-seeded
      });
  }, []);

  const handleSelectScenario = (scenario: ScenarioDefinition) => {
    soundFx.playTap();
    setActiveScenario(scenario);
    setView('player');
    try {
      sessionStorage.setItem(STORAGE_VIEW_KEY, 'player');
      sessionStorage.setItem(STORAGE_SCENARIO_ID_KEY, scenario.id);
    } catch {
      // ignore
    }
  };

  const handleCompleted = (report: ReportResponse) => {
    setActiveReport(report);
    setView('report');
    try {
      sessionStorage.setItem(STORAGE_VIEW_KEY, 'report');
      sessionStorage.setItem(STORAGE_REPORT_KEY, JSON.stringify(report));
    } catch {
      // ignore
    }
  };

  const handleClearData = () => {
    localStorage.clear();
    sessionStorage.clear();
    setActiveReport(null);
    setActiveScenario(null);
    setView('landing');
    alert('All local data, session state, and cached transcripts cleared.');
  };

  const switchTab = (nextView: 'landing' | 'player' | 'report' | 'roast') => {
    soundFx.playTap();
    setView(nextView);
    sessionStorage.setItem(STORAGE_VIEW_KEY, nextView);
  };

  return (
    <div className="min-h-screen bg-ink-950 text-paper-50 font-sans selection:bg-comic-pink selection:text-white flex flex-col justify-between">
      {/* Global Top Comic Nav Bar matching Screenshot 2026-10-09 222149.png */}
      <nav className="bg-black/95 backdrop-blur border-b-4 border-black py-3 px-4 sm:px-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Left Brand with Green Dot & Tagline */}
          <div
            onClick={() => switchTab('landing')}
            className="flex items-center gap-3 cursor-pointer select-none"
          >
            <div className="w-3.5 h-3.5 rounded-full bg-comic-green border-2 border-black animate-bounce flex-shrink-0" />
            <span className="font-display font-black text-xl sm:text-2xl text-white tracking-tight uppercase flex items-center gap-2">
              VIBEQUEST{' '}
              <span className="bg-comic-yellow text-black font-mono text-xs px-2 py-0.5 rounded-lg border-2 border-black font-black">
                3D CARTOON
              </span>
            </span>
            <span className="hidden lg:inline font-mono text-xs text-paper-300 pl-3 border-l-2 border-paper-400">
              Interactive Social Game & Comedy Report Card
            </span>
          </div>

          {/* Right Header Navigation - Keep all 3 options + Clear Data */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
            {/* 1. SCENARIOS */}
            <button
              onClick={() => switchTab('landing')}
              type="button"
              className={`font-display font-black text-xs px-3.5 py-2 rounded-xl border-3 border-black shadow-cartoon transition-all hover:-translate-y-0.5 active:translate-y-0 ${
                view === 'landing' || view === 'player'
                  ? 'bg-comic-yellow text-black scale-105'
                  : 'bg-white text-black hover:bg-comic-yellow'
              }`}
            >
              🎮 SCENARIOS
            </button>

            {/* 2. ROAST ARENA (Pink Pill) */}
            <button
              onClick={() => switchTab('roast')}
              type="button"
              className={`font-display font-black text-xs px-4 py-2 rounded-xl border-3 border-black shadow-cartoon transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-1.5 ${
                view === 'roast'
                  ? 'bg-comic-pink text-white scale-105 ring-2 ring-white'
                  : 'bg-comic-pink hover:bg-comic-orange text-white'
              }`}
            >
              <span>🔥 ROAST ARENA</span>
            </button>

            {/* 3. REPORT CARD */}
            <button
              onClick={() => switchTab('report')}
              type="button"
              className={`font-display font-black text-xs px-3.5 py-2 rounded-xl border-3 border-black shadow-cartoon transition-all hover:-translate-y-0.5 active:translate-y-0 ${
                view === 'report'
                  ? 'bg-comic-cyan text-black scale-105'
                  : 'bg-white text-black hover:bg-comic-cyan'
              }`}
            >
              📜 REPORT CARD {activeReport ? '★' : ''}
            </button>

            {/* Clear Data Option */}
            <button
              onClick={handleClearData}
              type="button"
              className="font-mono text-xs text-paper-400 hover:text-white underline decoration-paper-400 underline-offset-4 transition-colors ml-1"
            >
              Clear data
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {view === 'landing' && (
          <LandingPage
            scenarios={scenarios}
            onSelectScenario={handleSelectScenario}
            onClearData={handleClearData}
            mockMode={mockMode}
            onGoToRoastBot={() => switchTab('roast')}
          />
        )}

        {view === 'player' && activeScenario && (
          <ScenarioPlayer
            scenario={activeScenario}
            onExit={() => switchTab('landing')}
            onCompleted={handleCompleted}
          />
        )}

        {view === 'roast' && (
          <RoastBattleBot onBack={() => switchTab('landing')} />
        )}

        {view === 'report' && activeReport && (
          <ReportPage
            report={activeReport}
            onReplay={() => {
              if (activeScenario) {
                switchTab('player');
              } else {
                switchTab('landing');
              }
            }}
            onExploreMore={() => switchTab('landing')}
            onGoToRoastBot={() => switchTab('roast')}
          />
        )}
      </main>

      {/* Global Cartoon Footer */}
      <footer className="border-t-3 border-black bg-black py-6 px-4 text-center font-mono text-xs text-paper-300">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-bold text-white">VibeQuest AI • Three.js 3D Cartoon Edition</span>
          <span>Zero clinical claims • 100% comedy report cards • Ephemeral safe simulation</span>
        </div>
      </footer>
    </div>
  );
};
export default App;
