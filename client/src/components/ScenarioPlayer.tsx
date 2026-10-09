import React, { useState, useEffect, useRef } from 'react';
import {
  ScenarioDefinition,
  Turn,
  ChoiceOption,
  TurnResponse,
  ReportResponse,
  CharacterMood,
  simulateReport
} from '@vibequest/shared';
import { ApiService } from '../services/api.js';
import { soundFx } from '../services/soundFx.js';
import { CharacterAvatar } from './ui/CharacterAvatar.js';
import { ChatBubble, TypingIndicator } from './ui/ChatBubble.js';
import { ChoiceCard } from './ui/ChoiceCard.js';
import { ProgressBar } from './ui/ProgressBar.js';
import { EpisodeTitleCard } from './ui/EpisodeTitleCard.js';
import { getTheme } from '../themes/scenarioThemes.js';
import { SceneIllustration } from './ui/SceneIllustration.js';
import { Scenario3DCompanion } from './three/Scenario3DCompanion.js';

interface ScenarioPlayerProps {
  scenario: ScenarioDefinition;
  onExit: () => void;
  onCompleted: (report: ReportResponse) => void;
}

export const ScenarioPlayer: React.FC<ScenarioPlayerProps> = ({
  scenario,
  onExit,
  onCompleted
}) => {
  const theme = getTheme(scenario.themeId);
  const [showEpisodeIntro, setShowEpisodeIntro] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(soundFx.isEnabled());
  const [history, setHistory] = useState<Turn[]>([
    {
      turnNumber: 0,
      speaker: 'character',
      text: scenario.openingMessage,
      timestamp: new Date().toISOString()
    }
  ]);
  const [currentChoices, setCurrentChoices] = useState<ChoiceOption[]>(scenario.initialChoices);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [customText, setCustomText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [evaluatingSeconds, setEvaluatingSeconds] = useState<number>(0);
  const [characterMood, setCharacterMood] = useState<CharacterMood>(
    scenario.character.quirks?.initialMood || 'neutral'
  );
  const [characterMoodDesc, setCharacterMoodDesc] = useState<string>(
    scenario.character.quirks?.initialMoodDesc || 'Assessing conversational temperature'
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Cold start timer for report generation
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isEvaluating) {
      interval = setInterval(() => {
        setEvaluatingSeconds(s => s + 1);
      }, 1000);
    } else {
      setEvaluatingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isEvaluating]);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    if (!showEpisodeIntro) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, isLoading, showEpisodeIntro]);

  const userTurnsCount = history.filter(t => t.speaker === 'user').length;

  const handleToggleSound = () => {
    const next = !soundEnabled;
    soundFx.setEnabled(next);
    setSoundEnabled(next);
  };

  const handleSelectChoice = async (choice: ChoiceOption) => {
    if (isLoading || isFinished) return;
    setError(null);

    soundFx.playMessageSent();
    soundFx.triggerHaptic(14);

    const nextTurnNum = userTurnsCount + 1;
    const userTurn: Turn = {
      turnNumber: nextTurnNum,
      speaker: 'user',
      text: choice.text,
      choiceId: choice.id,
      timestamp: new Date().toISOString()
    };

    const newHistory = [...history, userTurn];
    setHistory(newHistory);
    setIsLoading(true);

    const minTypingDelay = scenario.character.quirks?.typingSpeedMs || 1000;

    try {
      const [response]: [TurnResponse, unknown] = await Promise.all([
        ApiService.submitTurn({
          scenarioId: scenario.id,
          userMessage: choice.text,
          choiceId: choice.id,
          isCustom: false,
          history: newHistory
        }),
        new Promise(resolve => setTimeout(resolve, minTypingDelay))
      ]);

      const characterTurn: Turn = {
        turnNumber: nextTurnNum,
        speaker: 'character',
        text: response.characterReply,
        timestamp: new Date().toISOString()
      };

      setHistory(prev => [...prev, characterTurn]);
      setCurrentChoices(response.nextChoices);

      soundFx.playMessageReceived();
      soundFx.triggerHaptic(18);

      if (response.characterMood) {
        setCharacterMood(response.characterMood);
      }
      if (response.characterMoodDescription) {
        setCharacterMoodDesc(response.characterMoodDescription);
      }

      if (nextTurnNum >= scenario.maxTurns) {
        setIsFinished(true);
        soundFx.triggerHaptic([20, 40, 20]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to receive character reply.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim() || isLoading || isFinished) return;
    setError(null);

    soundFx.playMessageSent();
    soundFx.triggerHaptic(14);

    const nextTurnNum = userTurnsCount + 1;
    const text = customText.trim();
    setCustomText('');

    const userTurn: Turn = {
      turnNumber: nextTurnNum,
      speaker: 'user',
      text,
      isCustom: true,
      timestamp: new Date().toISOString()
    };

    const newHistory = [...history, userTurn];
    setHistory(newHistory);
    setIsLoading(true);

    const minTypingDelay = scenario.character.quirks?.typingSpeedMs || 1000;

    try {
      const [response]: [TurnResponse, unknown] = await Promise.all([
        ApiService.submitTurn({
          scenarioId: scenario.id,
          userMessage: text,
          isCustom: true,
          history: newHistory
        }),
        new Promise(resolve => setTimeout(resolve, minTypingDelay))
      ]);

      const characterTurn: Turn = {
        turnNumber: nextTurnNum,
        speaker: 'character',
        text: response.characterReply,
        timestamp: new Date().toISOString()
      };

      setHistory(prev => [...prev, characterTurn]);
      setCurrentChoices(response.nextChoices);

      soundFx.playMessageReceived();
      soundFx.triggerHaptic(18);

      if (response.characterMood) {
        setCharacterMood(response.characterMood);
      }
      if (response.characterMoodDescription) {
        setCharacterMoodDesc(response.characterMoodDescription);
      }

      if (nextTurnNum >= scenario.maxTurns) {
        setIsFinished(true);
        soundFx.triggerHaptic([20, 40, 20]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to receive character reply.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    setIsEvaluating(true);
    setError(null);
    try {
      const report = await ApiService.getReport({
        scenarioId: scenario.id,
        history
      });
      onCompleted(report);
    } catch (err: any) {
      setError(err.message || 'Reflection synthesis is taking longer than expected. You can retry or view instant scores.');
      setIsEvaluating(false);
    }
  };

  const handleInstantDeterministicScores = () => {
    setIsEvaluating(false);
    setError(null);
    try {
      const report = simulateReport({
        scenarioId: scenario.id,
        history
      });
      onCompleted(report);
    } catch {
      setError('Failed to compute instant scores.');
    }
  };

  const getMoodBadgeClasses = (mood: CharacterMood) => {
    switch (mood) {
      case 'amused':
        return 'bg-comic-yellow text-black';
      case 'warm':
        return 'bg-comic-green text-black';
      case 'annoyed':
        return 'bg-comic-pink text-white';
      case 'hesitant':
        return 'bg-comic-orange text-white';
      case 'guarded':
        return 'bg-gray-300 text-black';
      case 'relieved':
        return 'bg-comic-cyan text-black';
      case 'neutral':
      default:
        return 'bg-white text-black';
    }
  };

  // If in episode title card stage, show comic briefing document
  if (showEpisodeIntro) {
    return (
      <div data-theme={theme.id} className="min-h-screen py-6 sm:py-8 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b-4 border-black">
            <button
              onClick={onExit}
              type="button"
              className="bg-white hover:bg-comic-pink hover:text-white text-black font-mono font-black text-xs px-3.5 py-2 rounded-xl border-3 border-black shadow-cartoon transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-1.5"
            >
              ← BACK TO SCENARIOS
            </button>

            <button
              type="button"
              onClick={handleToggleSound}
              className={`font-mono font-black text-xs px-3.5 py-2 rounded-xl border-3 border-black shadow-cartoon transition-all hover:-translate-y-0.5 flex items-center gap-2 ${
                soundEnabled
                  ? 'bg-comic-green text-black'
                  : 'bg-white text-black hover:bg-comic-green'
              }`}
              title="Toggle audio effects"
            >
              <span>{soundEnabled ? '🔊' : '🔇'}</span>
              <span>SOUND: {soundEnabled ? 'ON' : 'OFF'}</span>
            </button>
          </div>

          <EpisodeTitleCard
            scenario={scenario}
            onStart={() => setShowEpisodeIntro(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div data-theme={theme.id} className="min-h-screen py-6 sm:py-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Top Header & Turn Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-4 border-black">
          <div className="flex items-center gap-3">
            <button
              onClick={onExit}
              type="button"
              className="bg-white hover:bg-comic-pink hover:text-white text-black font-mono font-black text-xs px-3.5 py-2 rounded-xl border-3 border-black shadow-cartoon transition-all hover:-translate-y-0.5"
            >
              ← EXIT SCENARIO
            </button>

            <button
              type="button"
              onClick={() => setShowEpisodeIntro(true)}
              className="bg-comic-yellow hover:bg-comic-orange text-black font-mono font-black text-xs px-3.5 py-2 rounded-xl border-3 border-black shadow-cartoon transition-all hover:-translate-y-0.5"
              title="Review episode briefing"
            >
              📋 BRIEFING
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleToggleSound}
              className={`font-mono font-black text-xs px-3 py-2 rounded-xl border-3 border-black shadow-cartoon transition-all hover:-translate-y-0.5 flex items-center gap-1.5 ${
                soundEnabled
                  ? 'bg-comic-green text-black'
                  : 'bg-white text-black hover:bg-comic-green'
              }`}
              title="Toggle audio effects"
            >
              <span>{soundEnabled ? '🔊' : '🔇'}</span>
              <span>SOUND: {soundEnabled ? 'ON' : 'OFF'}</span>
            </button>

            <ProgressBar
              currentTurn={userTurnsCount}
              maxTurns={scenario.maxTurns}
              className="sm:w-64"
            />
          </div>
        </div>

        {/* Bespoke Scene Art Header Banner & Character Dossier */}
        <div className="bg-[#FFFDF0] text-black border-4 border-black rounded-3xl overflow-hidden shadow-cartoon-xl">
          {/* Layered SVG Scene Illustration */}
          <div className="border-b-4 border-black relative">
            <SceneIllustration scenarioId={scenario.id} themeId={theme.id} />
          </div>

          {/* Character Dossier Banner & Mood Meter */}
          <div className="p-4 sm:p-6 flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <CharacterAvatar
                  seed={scenario.character.avatarSeed}
                  name={scenario.character.name}
                  accentColor={theme.tokens.accent}
                  size="lg"
                  mood={characterMood}
                  showMoodBadge={true}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display font-black text-lg sm:text-xl text-black">
                      {scenario.character.name}
                    </h2>
                    <span className="bg-comic-yellow text-black font-mono text-xs font-bold px-2.5 py-0.5 rounded-md border-2 border-black shadow-cartoon-sm">
                      ({scenario.character.role})
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-ink-800 line-clamp-1 mt-0.5 font-sans font-medium">
                    {scenario.character.bio}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Scenario3DCompanion
                  mood={characterMood}
                  turnNumber={userTurnsCount}
                  characterName={scenario.character.name}
                />
                <div className="px-3.5 py-1.5 rounded-full border-2 border-black text-xs font-mono font-black tracking-wide bg-comic-cyan text-black shadow-cartoon-sm hidden sm:inline-block">
                  {theme.environment}
                </div>
              </div>
            </div>

            {/* Live Story Mood Meter */}
            <div className="bg-white border-3 border-black rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-cartoon">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs text-black font-black uppercase tracking-wider">
                  {scenario.character.name.split(' ')[0]}'S MOOD:
                </span>
                <span className={`font-mono text-xs px-2.5 py-0.5 rounded-lg border-2 border-black uppercase font-black shadow-cartoon-sm transition-all duration-300 ${getMoodBadgeClasses(characterMood)}`}>
                  ● {characterMood}
                </span>
                <span className="text-black text-xs sm:text-sm italic font-sans font-bold truncate max-w-xs sm:max-w-md">
                  "{characterMoodDesc}"
                </span>
              </div>

              {scenario.character.quirks && (
                <div className="font-mono text-xs text-black flex items-center gap-2 sm:self-auto self-start border-t sm:border-t-0 border-black pt-2 sm:pt-0">
                  <span className="bg-black text-white px-2 py-0.5 rounded text-[11px] font-bold">QUIRK</span>
                  <span className="font-bold text-black">{scenario.character.quirks.emojiHabit}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Real Messenger Dialogue Viewport */}
        <div className="bg-[#FFFDF0] text-black border-4 border-black rounded-3xl p-4 sm:p-6 min-h-[400px] max-h-[540px] overflow-y-auto space-y-4 shadow-cartoon-xl relative">
          {/* Subtle comic dot grid */}
          <div
            className="absolute inset-0 pointer-events-none opacity-5"
            style={{
              backgroundImage: 'radial-gradient(#000000 1.5px, transparent 1.5px)',
              backgroundSize: '16px 16px'
            }}
          />

          <div className="relative z-10 space-y-3.5">
            {history.map((turn, idx) => (
              <ChatBubble
                key={idx}
                speaker={turn.speaker}
                text={turn.text}
                senderName={scenario.character.name}
                timestamp={turn.timestamp}
                isCustom={turn.isCustom}
                bubbleClassName={turn.speaker === 'user' ? theme.classes.userBubble : theme.classes.characterBubble}
              />
            ))}

            {isLoading && (
              <TypingIndicator
                characterName={scenario.character.name}
                typingSpeedMs={scenario.character.quirks?.typingSpeedMs}
                bubbleClassName={theme.classes.characterBubble}
              />
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Error Notice */}
        {error && (
          <div className="p-4 rounded-2xl bg-comic-pink text-white border-3 border-black text-xs font-mono font-bold shadow-cartoon flex items-center justify-between">
            <span>⚠️ [ERROR]: {error}</span>
            <button
              onClick={() => setError(null)}
              type="button"
              className="underline ml-3 font-black"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Interactive Controls / Action Station */}
        {isFinished ? (
          <div className="bg-[#FFFDF0] text-black border-4 border-black rounded-3xl p-6 sm:p-10 text-center space-y-5 shadow-cartoon-xl relative overflow-hidden">
            <div className="inline-block bg-comic-pink text-white font-mono font-black text-xs px-3.5 py-1.5 rounded-full border-2 border-black shadow-cartoon-sm uppercase">
              🎓 SCENARIO CONCLUDED
            </div>
            <h3 className="text-2xl sm:text-4xl font-display font-black text-black tracking-tight uppercase">
              Ready To Reveal Your Official Vibe Report Card?
            </h3>
            <p className="text-xs sm:text-sm text-ink-800 max-w-lg mx-auto font-sans font-medium leading-relaxed">
              We evaluated your deterministic communication metrics across all 4 core dimensions and generated your hilarious letter grades, GPA, and receipts!
            </p>

            <div className="pt-3 flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={handleGenerateReport}
                disabled={isEvaluating}
                className="w-full sm:w-auto bg-comic-green hover:bg-comic-yellow text-black font-display font-black text-base sm:text-lg px-8 py-4 rounded-2xl border-4 border-black shadow-cartoon-lg hover:-translate-y-1 active:translate-y-0 transition-transform cursor-pointer flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
              >
                <span>{isEvaluating ? '⏳ GENERATING REPORT CARD...' : '📜 REVEAL REPORT CARD & RECEIPTS →'}</span>
              </button>

              {isEvaluating && evaluatingSeconds >= 3 && (
                <div className="font-mono text-xs font-bold text-black bg-comic-yellow border-2 border-black px-3 py-1.5 rounded-xl shadow-cartoon-sm animate-pulse">
                  ⚡ Synthesizing AI reflection & receipts... ({evaluatingSeconds}s elapsed)
                </div>
              )}

              {(error || evaluatingSeconds >= 5) && (
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="button"
                    onClick={handleGenerateReport}
                    disabled={isEvaluating}
                    className="bg-white hover:bg-comic-yellow text-black font-mono font-black text-xs px-4 py-2.5 rounded-xl border-3 border-black shadow-cartoon"
                  >
                    ↺ Retry Reflection
                  </button>

                  <button
                    type="button"
                    onClick={handleInstantDeterministicScores}
                    className="bg-comic-cyan hover:bg-comic-yellow text-black font-mono font-black text-xs px-4 py-2.5 rounded-xl border-3 border-black shadow-cartoon"
                  >
                    ⚡ View Instant Report Card Now
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">

            <div className="flex items-center justify-between text-xs font-mono">
              <span className="bg-black text-white font-black px-2.5 py-1 rounded-md border-2 border-black shadow-cartoon-sm">
                CHOOSE YOUR TACTIC:
              </span>
              <button
                type="button"
                onClick={() => setIsCustomMode(!isCustomMode)}
                className="bg-white hover:bg-comic-pink hover:text-white text-black font-black px-2.5 py-1 rounded-md border-2 border-black shadow-cartoon-sm transition-all"
              >
                {isCustomMode ? '← View Preset Choices' : 'Write Custom Response →'}
              </button>
            </div>

            {!isCustomMode ? (
              /* Choice Cards Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentChoices.map((choice, idx) => (
                  <ChoiceCard
                    key={choice.id}
                    choice={choice}
                    index={idx}
                    disabled={isLoading}
                    onSelect={handleSelectChoice}
                    className={theme.classes.choiceCard}
                  />
                ))}
              </div>
            ) : (
              /* Custom Text Input Area */
              <form onSubmit={handleCustomSubmit} className="bg-[#FFFDF0] border-4 border-black rounded-2xl p-4 sm:p-5 space-y-3 shadow-cartoon">
                <label htmlFor="custom-reply" className="block text-xs font-mono font-black text-black uppercase">
                  WRITE WHAT YOU WOULD ACTUALLY SAY:
                </label>
                <textarea
                  id="custom-reply"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder={`Type your reply to ${scenario.character.name}...`}
                  rows={3}
                  maxLength={800}
                  className="w-full bg-white border-3 border-black rounded-xl p-3 text-xs sm:text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-comic-pink transition-colors resize-none font-sans font-medium"
                />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-gray-600">
                    {customText.length}/800 characters
                  </span>
                  <button
                    type="submit"
                    disabled={!customText.trim() || isLoading}
                    className="bg-comic-pink hover:bg-comic-orange text-white font-display font-black text-xs px-5 py-2.5 rounded-xl border-3 border-black shadow-cartoon hover:-translate-y-0.5 active:translate-y-0 transition-transform disabled:opacity-50"
                  >
                    SEND MESSAGE →
                  </button>
                </div>
              </form>
            )}

            {/* On-Demand Finish and Grade Option */}
            <div className="pt-3 text-center flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsFinished(true)}
                className="bg-white hover:bg-comic-yellow text-black font-display font-black text-xs px-5 py-2.5 rounded-xl border-3 border-black shadow-cartoon hover:-translate-y-0.5 active:translate-y-0 transition-transform flex items-center gap-2 cursor-pointer"
              >
                <span>📜 FINISH & GENERATE REPORT CARD ANYTIME ({userTurnsCount} turns recorded)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
