import React, { useState, useEffect } from 'react';
import {
  ScenarioDefinition,
  ReportResponse,
  HealthResponse
} from '@vibequest/shared';
import { ApiService } from './services/api.js';
import { LandingPage } from './components/LandingPage.js';
import { ScenarioPlayer } from './components/ScenarioPlayer.js';
import { ReportPage } from './components/ReportPage.js';

// Initial fallback scenario so landing page loads immediately even if backend is starting
const INITIAL_SCENARIOS: ScenarioDefinition[] = [
  {
    id: 'unexpected-message',
    mode: 'social_simulator',
    title: 'The Unexpected Message',
    tagline: 'Reconnecting after 8 months of radio silence',
    context: 'Eight months ago, Maya left you on read and dropped off the grid. It is 11:42 PM on a Tuesday. Your phone lights up on the bedside table.',
    character: {
      id: 'maya',
      name: 'Maya Lin',
      role: 'Former close friend',
      bio: 'Spontaneous, creative, gets overwhelmed under job stress and retreats into quiet solitude.',
      avatarSeed: 'maya',
      accentColor: '#E5A93B',
      traits: ['creative', 'overwhelmed', 'apologetic']
    },
    openingMessage: 'Hey stranger! Remember me? 😂 Honestly was just thinking about that chaotic road trip we took and had to see how you were doing.',
    maxTurns: 3,
    initialChoices: [
      {
        id: 'opt_playful_tease',
        label: 'Playful teasing',
        text: 'Look who decided to resurface from the Bermuda Triangle! 😂 How have you been?',
        impacts: [
          { dimension: 'directness', delta: 1, reason: 'Used playful irony to acknowledge distance' },
          { dimension: 'conflict_engagement', delta: -1, reason: 'Softened tension with humor rather than pressing' }
        ]
      },
      {
        id: 'opt_direct_inquiry',
        label: 'Direct inquiry',
        text: 'Hey Maya. It has been eight months. What prompted the sudden check-in tonight?',
        impacts: [
          { dimension: 'directness', delta: 2, reason: 'Explicitly named the 8-month timeline and asked for intent' },
          { dimension: 'boundary_expression', delta: 1, reason: 'Required clear motivation before engaging' }
        ]
      },
      {
        id: 'opt_warm_empathy',
        label: 'Warm reconnection',
        text: 'Hey! Good to see your name pop up. That road trip was iconic. How has life been treating you lately?',
        impacts: [
          { dimension: 'perspective_taking', delta: 2, reason: 'Prioritized relational warmth over past absence' },
          { dimension: 'conflict_engagement', delta: -1, reason: 'Steered directly toward comfortable reconnection' }
        ]
      },
      {
        id: 'opt_guarded_boundary',
        label: 'Guarded boundary',
        text: 'Hey. Yeah, it has been a while. Honestly I am pretty swamped with work right now, but hope you are doing well.',
        impacts: [
          { dimension: 'boundary_expression', delta: 2, reason: 'Signaled emotional distance and limited availability' },
          { dimension: 'directness', delta: 1, reason: 'Maintained polite but firm distance' }
        ]
      }
    ]
  },
  {
    id: 'boundary-joke',
    mode: 'conflict_arena',
    title: 'The Joke That Crossed the Line',
    tagline: 'Navigating sharp banter in front of mutual friends',
    context: 'At a dinner gathering, Marcus turns your recent career setback into a punchline for the table. People laugh awkwardly.',
    character: {
      id: 'marcus',
      name: 'Marcus Vance',
      role: 'Witty mutual acquaintance',
      bio: 'Prides himself on razor-sharp banter; defers accountability by claiming people are "too sensitive".',
      avatarSeed: 'marcus',
      accentColor: '#FF5C35',
      traits: ['sharp-tongued', 'defensive', 'socially-competitive']
    },
    openingMessage: 'Haha come on, you know I love you! Do not look at me like that, it was just harmless banter! 😅',
    maxTurns: 3,
    initialChoices: [
      {
        id: 'opt_firm_boundary',
        label: 'Quiet, firm limit',
        text: 'Marcus, I can take a roast, but that was a rough chapter for me and turning it into a public punchline is not cool. Do not do that again.',
        impacts: [
          { dimension: 'boundary_expression', delta: 2, reason: 'Set explicit limit without escalating insults' },
          { dimension: 'directness', delta: 2, reason: 'Clearly articulated what was unacceptable' }
        ]
      },
      {
        id: 'opt_pull_aside',
        label: 'Step aside privately',
        text: 'Hey, let us step outside for a second. I want to talk to you about that without an audience.',
        impacts: [
          { dimension: 'conflict_engagement', delta: 2, reason: 'Proactively addressed conflict while minimizing defensive spectacle' },
          { dimension: 'perspective_taking', delta: 1, reason: 'Allowed counterpart to save face privately' }
        ]
      },
      {
        id: 'opt_clap_back',
        label: 'Sharp retaliation',
        text: 'Bold talk coming from someone who has been sitting at the exact same junior desk for four years, Marcus.',
        impacts: [
          { dimension: 'conflict_engagement', delta: 2, reason: 'Directly escalated confrontation' },
          { dimension: 'boundary_expression', delta: 1, reason: 'Fought fire with fire' }
        ]
      },
      {
        id: 'opt_brush_off',
        label: 'Laugh it off',
        text: 'Haha yeah yeah, very funny. Drinks are on you for that one.',
        impacts: [
          { dimension: 'conflict_engagement', delta: -2, reason: 'Deflected conflict to preserve table harmony' },
          { dimension: 'boundary_expression', delta: -2, reason: 'Allowed boundary violation without challenge' }
        ]
      }
    ]
  },
  {
    id: 'cafe-spark',
    mode: 'flirt_lab',
    title: 'The Coffee Shop Serendipity',
    tagline: 'Navigating mutual attraction & banter between consenting adults',
    context: 'At a rainy indie café, Sam looks up from reading an annotated copy of your favorite novel. Your eyes meet.',
    character: {
      id: 'sam',
      name: 'Sam Vance',
      role: 'Curious book lover at the café',
      bio: 'Thoughtful, appreciative of dry banter, allergic to sleazy pickup lines; loves authentic, grounded wit.',
      avatarSeed: 'sam',
      accentColor: '#00E599',
      traits: ['observant', 'dry-humor', 'attuned']
    },
    openingMessage: '[Sam looks up from the book, notices you looking, and smiles slightly before closing it] Do not tell me—you are judging my reading pace, aren\'t you?',
    maxTurns: 3,
    initialChoices: [
      {
        id: 'opt_book_tease',
        label: 'Playful literary banter',
        text: 'Never! Just checking if you reached chapter 12 yet, because your reaction to that plot twist will tell me everything I need to know.',
        impacts: [
          { dimension: 'directness', delta: 1, reason: 'Engaged naturally with insider shared curiosity' },
          { dimension: 'perspective_taking', delta: 1, reason: 'Attuned to what the other person was reading' }
        ]
      },
      {
        id: 'opt_direct_introduction',
        label: 'Direct & grounded introduction',
        text: 'Haha not at all. Honestly, it is just rare to see someone reading that exact translation. I had to smile. I am [User], by the way.',
        impacts: [
          { dimension: 'directness', delta: 2, reason: 'Introduced self openly without hiding intent' },
          { dimension: 'perspective_taking', delta: 1, reason: 'Honest appreciation of their taste' }
        ]
      },
      {
        id: 'opt_shy_apology',
        label: 'Modest retreat & respect',
        text: 'Oh sorry! Caught me staring. That book is just one of my favorites of all time and I got excited. Did not mean to interrupt your peace!',
        impacts: [
          { dimension: 'boundary_expression', delta: 1, reason: 'Respectful of other person\'s quiet bubble' },
          { dimension: 'directness', delta: 1, reason: 'Sincere vulnerability' }
        ]
      }
    ]
  }
];

export const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'player' | 'report'>('landing');
  const [scenarios, setScenarios] = useState<ScenarioDefinition[]>(INITIAL_SCENARIOS);
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
