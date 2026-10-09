import React, { useState, useEffect, useRef } from 'react';
import {
  ScenarioDefinition,
  Turn,
  ChoiceOption,
  TurnResponse,
  ReportResponse,
  CharacterMood
} from '@vibequest/shared';
import { ApiService } from '../services/api.js';
import { soundFx } from '../services/soundFx.js';
import { CharacterAvatar } from './ui/CharacterAvatar.js';
import { ChatBubble, TypingIndicator } from './ui/ChatBubble.js';
import { ChoiceCard } from './ui/ChoiceCard.js';
import { ProgressBar } from './ui/ProgressBar.js';
import { Button } from './ui/Button.js';
import { EpisodeTitleCard } from './ui/EpisodeTitleCard.js';

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
  const [characterMood, setCharacterMood] = useState<CharacterMood>(
    scenario.character.quirks?.initialMood || 'neutral'
  );
  const [characterMoodDesc, setCharacterMoodDesc] = useState<string>(
    scenario.character.quirks?.initialMoodDesc || 'Assessing conversational temperature'
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);

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

      if (!response.canContinue || nextTurnNum >= scenario.maxTurns) {
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

      if (!response.canContinue || nextTurnNum >= scenario.maxTurns) {
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
      setError(err.message || 'Failed to synthesize reflection report.');
      setIsEvaluating(false);
    }
  };

  const getMoodBadgeClasses = (mood: CharacterMood) => {
    switch (mood) {
      case 'amused':
        return 'bg-amber-tint border-amber/40 text-amber';
      case 'warm':
        return 'bg-mint-tint border-mint/40 text-mint';
      case 'annoyed':
        return 'bg-coral-tint border-coral/40 text-coral';
      case 'hesitant':
        return 'bg-amber-tint/50 border-amber-400/40 text-amber-300';
      case 'guarded':
        return 'bg-ink-800 border-ink-600 text-paper-300';
      case 'relieved':
        return 'bg-teal-950/40 border-teal-400/40 text-teal-300';
      case 'neutral':
      default:
        return 'bg-ink-800 border-ink-700 text-paper-400';
    }
  };

  // If in episode title card stage, show cinematic briefing screen
  if (showEpisodeIntro) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-ink-800">
          <button
            onClick={onExit}
            type="button"
            className="font-mono text-xs text-paper-400 hover:text-paper-100 flex items-center gap-1.5 transition-colors"
          >
            ← BACK TO SCENARIOS
          </button>

          <button
            type="button"
            onClick={handleToggleSound}
            className={`font-mono text-xs px-3 py-1.5 rounded-lg border transition-all flex items-center gap-2 ${
              soundEnabled
                ? 'bg-ink-850 border-coral/60 text-coral'
                : 'bg-ink-900 border-ink-700 text-paper-400 hover:text-paper-200'
            }`}
            title="Toggle subtle audio effects (off by default)"
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
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Top Header & Turn Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-ink-700/80">
        <div className="flex items-center gap-4">
          <button
            onClick={onExit}
            type="button"
            className="font-mono text-xs text-paper-400 hover:text-paper-100 flex items-center gap-1.5 transition-colors self-start"
          >
            ← EXIT SCENARIO
          </button>

          <button
            type="button"
            onClick={() => setShowEpisodeIntro(true)}
            className="font-mono text-[11px] text-paper-400 hover:text-paper-200 underline transition-colors"
            title="Review episode briefing"
          >
            [BRIEFING]
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleToggleSound}
            className={`font-mono text-xs px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 ${
              soundEnabled
                ? 'bg-ink-850 border-coral/60 text-coral'
                : 'bg-ink-900 border-ink-700 text-paper-400 hover:text-paper-200'
            }`}
            title="Toggle subtle audio effects (off by default)"
          >
            <span>{soundEnabled ? '🔊' : '🔇'}</span>
            <span>SOUND: {soundEnabled ? 'ON' : 'OFF'}</span>
          </button>

          <ProgressBar
            currentTurn={userTurnsCount}
            maxTurns={scenario.maxTurns}
            className="sm:w-56"
          />
        </div>
      </div>

      {/* Character Dossier Banner & Mood Meter */}
      <div className="bg-ink-900 border border-ink-700 rounded-2xl p-4 sm:p-5 flex flex-col gap-3 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <CharacterAvatar
              seed={scenario.character.avatarSeed}
              name={scenario.character.name}
              accentColor={scenario.character.accentColor}
              size="lg"
              mood={characterMood}
              showMoodBadge={true}
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-base sm:text-lg text-paper-50">
                  {scenario.character.name}
                </h2>
                <span className="font-mono text-xs text-paper-400">
                  ({scenario.character.role})
                </span>
              </div>
              <p className="text-xs text-paper-300 line-clamp-1 mt-0.5 font-sans">
                {scenario.character.bio}
              </p>
            </div>
          </div>

          <div className="bg-ink-950 border border-ink-800 rounded-xl px-3 py-2 text-xs font-sans text-paper-300 md:max-w-xs">
            <span className="text-coral font-mono text-[11px] block uppercase mb-0.5">CONTEXT:</span>
            <p className="line-clamp-2 leading-relaxed">{scenario.context}</p>
          </div>
        </div>

        {/* Live Story Mood Meter */}
        <div className="bg-ink-950 border border-ink-800 rounded-xl px-3.5 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-[11px] text-paper-400 uppercase tracking-wider">
              {scenario.character.name.split(' ')[0]}'S MOOD:
            </span>
            <span className={`font-mono text-[11px] px-2 py-0.5 rounded border uppercase font-medium transition-all duration-300 ${getMoodBadgeClasses(characterMood)}`}>
              ● {characterMood}
            </span>
            <span className="text-paper-300 text-xs italic font-sans truncate max-w-xs sm:max-w-md">
              "{characterMoodDesc}"
            </span>
          </div>

          {scenario.character.quirks && (
            <div className="font-mono text-[10px] text-paper-400 flex items-center gap-1.5 sm:self-auto self-start border-t sm:border-t-0 border-ink-800 pt-1 sm:pt-0">
              <span className="text-coral uppercase">QUIRK:</span>
              <span className="text-paper-300">{scenario.character.quirks.emojiHabit}</span>
            </div>
          )}
        </div>
      </div>

      {/* Real Messenger Dialogue Viewport */}
      <div className="bg-ink-950 border border-ink-700 rounded-2xl p-4 sm:p-6 min-h-[380px] max-h-[520px] overflow-y-auto space-y-3.5 shadow-inner">
        {history.map((turn, idx) => (
          <ChatBubble
            key={idx}
            speaker={turn.speaker}
            text={turn.text}
            senderName={scenario.character.name}
            timestamp={turn.timestamp}
            isCustom={turn.isCustom}
          />
        ))}

        {isLoading && (
          <TypingIndicator
            characterName={scenario.character.name}
            typingSpeedMs={scenario.character.quirks?.typingSpeedMs}
          />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error Notice */}
      {error && (
        <div className="p-3.5 rounded-xl bg-coral-tint border border-coral/50 text-coral text-xs font-mono flex items-center justify-between">
          <span>[ERROR]: {error}</span>
          <button
            onClick={() => setError(null)}
            type="button"
            className="underline ml-3"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Interactive Controls / Action Station */}
      {isFinished ? (
        <div className="bg-ink-900 border border-coral/50 rounded-2xl p-6 sm:p-8 text-center space-y-4 shadow-xl">
          <div className="font-mono text-xs text-coral uppercase tracking-wider">
            SCENARIO CONCLUDED
          </div>
          <h3 className="text-xl sm:text-2xl font-display font-bold text-paper-50 tracking-tight">
            Ready to review your communication receipts?
          </h3>
          <p className="text-xs sm:text-sm text-paper-300 max-w-lg mx-auto font-sans leading-relaxed">
            We will calculate your deterministic scores across 4 behavioral dimensions and synthesize an evidence-backed debrief citing your exact choices.
          </p>

          <div className="pt-2">
            <Button
              variant="primary"
              size="lg"
              isLoading={isEvaluating}
              onClick={handleGenerateReport}
              className="mx-auto"
            >
              Reveal Your Reflection & Receipts →
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-paper-300 font-medium">CHOOSE YOUR TACTIC:</span>
            <button
              type="button"
              onClick={() => setIsCustomMode(!isCustomMode)}
              className="text-coral hover:text-coral-hover underline underline-offset-4 transition-colors"
            >
              {isCustomMode ? '← View Preset Choices' : 'Write Custom Response →'}
            </button>
          </div>

          {!isCustomMode ? (
            /* 4-5 Tactile Choice Cards Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentChoices.map((choice, idx) => (
                <ChoiceCard
                  key={choice.id}
                  choice={choice}
                  index={idx}
                  disabled={isLoading}
                  onSelect={handleSelectChoice}
                />
              ))}
            </div>
          ) : (
            /* Custom Text Input Area */
            <form onSubmit={handleCustomSubmit} className="bg-ink-900 border border-ink-700 rounded-2xl p-4 space-y-3">
              <label htmlFor="custom-reply" className="block text-xs font-mono text-paper-300">
                WRITE WHAT YOU WOULD ACTUALLY SAY:
              </label>
              <textarea
                id="custom-reply"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder={`Type your reply to ${scenario.character.name}...`}
                rows={3}
                maxLength={800}
                className="w-full bg-ink-950 border border-ink-700 rounded-xl p-3 text-xs sm:text-sm text-paper-50 placeholder:text-paper-400 focus:outline-none focus:border-coral transition-colors resize-none font-sans"
              />
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-paper-400">
                  {customText.length}/800 characters
                </span>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={!customText.trim() || isLoading}
                >
                  Send Message
                </Button>
              </div>
            </form>
          )}

          {/* End Conversation Early Option */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => setIsFinished(true)}
              className="font-mono text-[11px] text-paper-400 hover:text-paper-200 underline transition-colors"
            >
              End scenario here & review what we observed so far
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
