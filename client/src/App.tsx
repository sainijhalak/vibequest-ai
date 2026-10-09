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
      {/* Global Top Comic Nav Bar */}
      <nav className="bg-black/80 backdrop-blur border-b-3 border-black py-2.5 px-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <div
            onClick={() => switchTab('landing')}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <span className="text-xl">✨</span>
            <span className="font-display font-black text-lg text-white tracking-tight uppercase">
              VIBEQUEST <span className="text-comic-yellow">3D</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => switchTab('landing')}
              type="button"
              className={`font-display font-black text-xs px-3.5 py-1.5 rounded-xl border-2 border-black transition-all ${
                view === 'landing' || view === 'player'
                  ? 'bg-comic-yellow text-black shadow-cartoon-sm scale-105'
                  : 'bg-white text-black hover:bg-comic-yellow'
              }`}
            >
              🎮 SCENARIOS
            </button>

            <button
              onClick={() => switchTab('roast')}
              type="button"
              className={`font-display font-black text-xs px-3.5 py-1.5 rounded-xl border-2 border-black transition-all ${
                view === 'roast'
                  ? 'bg-comic-pink text-white shadow-cartoon-sm scale-105'
                  : 'bg-white text-black hover:bg-comic-pink hover:text-white'
              }`}
            >
              🔥 ROAST BOT
            </button>

            {activeReport && (
              <button
                onClick={() => switchTab('report')}
                type="button"
                className={`font-display font-black text-xs px-3.5 py-1.5 rounded-xl border-2 border-black transition-all ${
                  view === 'report'
                    ? 'bg-comic-cyan text-black shadow-cartoon-sm scale-105'
                    : 'bg-white text-black hover:bg-comic-cyan'
                }`}
              >
                📜 REPORT CARD
              </button>
            )}
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
