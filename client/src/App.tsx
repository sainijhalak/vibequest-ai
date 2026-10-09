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

const STORAGE_VIEW_KEY = 'vibequest_session_view';
const STORAGE_REPORT_KEY = 'vibequest_session_report';
const STORAGE_SCENARIO_ID_KEY = 'vibequest_session_scenario_id';

export const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'player' | 'report'>('landing');
  const [scenarios, setScenarios] = useState<ScenarioDefinition[]>(SCENARIOS);
  const [activeScenario, setActiveScenario] = useState<ScenarioDefinition | null>(null);
  const [activeReport, setActiveReport] = useState<ReportResponse | null>(null);
  const [mockMode, setMockMode] = useState<boolean>(true);

  // Restore session from sessionStorage on mount (prevents losing state on page refresh)
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
    // Attempt to load live health & scenarios from API
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

  return (
    <div className="min-h-screen bg-ink-950 text-paper-50 font-sans selection:bg-coral selection:text-ink-950 flex flex-col justify-between">
      <main className="flex-1">
        {view === 'landing' && (
          <LandingPage
            scenarios={scenarios}
            onSelectScenario={handleSelectScenario}
            onClearData={handleClearData}
            mockMode={mockMode}
          />
        )}

        {view === 'player' && activeScenario && (
          <ScenarioPlayer
            scenario={activeScenario}
            onExit={() => {
              sessionStorage.setItem(STORAGE_VIEW_KEY, 'landing');
              setView('landing');
            }}
            onCompleted={handleCompleted}
          />
        )}

        {view === 'report' && activeReport && (
          <ReportPage
            report={activeReport}
            onReplay={() => {
              sessionStorage.setItem(STORAGE_VIEW_KEY, 'player');
              setView('player');
            }}
            onExploreMore={() => {
              sessionStorage.setItem(STORAGE_VIEW_KEY, 'landing');
              setView('landing');
            }}
          />
        )}
      </main>

      {/* Global Minimal Footer */}
      <footer className="border-t border-ink-800 py-6 px-4 text-center font-mono text-[11px] text-paper-400">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>VibeQuest AI • Midnight Dispatch System</span>
          <span>Zero clinical claims • Grounded evidence • Ephemeral dialogue</span>
        </div>
      </footer>
    </div>
  );
};
export default App;
