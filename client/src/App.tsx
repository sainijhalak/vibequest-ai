import React, { useState, useEffect } from 'react';
import {
  ScenarioDefinition,
  ReportResponse,
  HealthResponse,
  SCENARIOS
} from '@vibequest/shared';
import { ApiService } from './services/api.js';
import { LandingPage } from './components/LandingPage.js';
import { ScenarioPlayer } from './components/ScenarioPlayer.js';
import { ReportPage } from './components/ReportPage.js';

export const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'player' | 'report'>('landing');
  const [scenarios, setScenarios] = useState<ScenarioDefinition[]>(SCENARIOS);
  const [activeScenario, setActiveScenario] = useState<ScenarioDefinition | null>(null);
  const [activeReport, setActiveReport] = useState<ReportResponse | null>(null);
  const [mockMode, setMockMode] = useState<boolean>(true);

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
  };

  const handleCompleted = (report: ReportResponse) => {
    setActiveReport(report);
    setView('report');
  };

  const handleClearData = () => {
    localStorage.clear();
    alert('All local data, state, and cached transcripts cleared.');
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
            onExit={() => setView('landing')}
            onCompleted={handleCompleted}
          />
        )}

        {view === 'report' && activeReport && (
          <ReportPage
            report={activeReport}
            onReplay={() => setView('player')}
            onExploreMore={() => setView('landing')}
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
