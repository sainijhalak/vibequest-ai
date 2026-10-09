import React, { useState, useEffect, useRef } from 'react';
import { Cartoon3DMascot } from './three/Cartoon3DMascot.js';
import { soundFx } from '../services/soundFx.js';
import { ApiService } from '../services/api.js';
import { generateVersatileRoast } from '@vibequest/shared';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  damage?: number;
  roastRating?: string;
  badge?: string;
}

export const RoastBattleBot: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [mode, setMode] = useState<'roast' | 'chat' | 'vibecheck'>('roast');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm_init',
      sender: 'bot',
      text: "Yo! I'm BUSTER 3000, your resident unhinged AI roast champion. Think you got comebacks? Hit me with your best shot or type anything to test your vibe!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      badge: 'ROAST MASTER',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [botMood, setBotMood] = useState<'happy' | 'roasting' | 'shocked' | 'chill'>('roasting');
  const [userHp, setUserHp] = useState(100);
  const [botHp, setBotHp] = useState(100);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const usedRoastsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isBotTyping]);

  const quickRoasts = [
    "We are the ones who gave you your name and existence!",
    "I mean whatever helps you sleep at night, bro.",
    "You have the conversational depth of a puddle in Arizona.",
    "Your social battery reaches 0% after reading a 3-word text.",
    "You look like you apologize to automatic sliding doors when they open.",
    "You practice arguments in the shower and still end up crying.",
  ];

  const quickVibeChecks = [
    "Should I text my ex 'I saw a dog that reminded me of you'?",
    "My boss scheduled a meeting titled 'Quick Chat Friday 4:55 PM'. Am I fired?",
    "Rate this excuse: 'Sorry my goldfish had a panic attack, can't make dinner'",
    "Why do I overthink a text for 45 minutes and then reply with 'haha ok'?",
  ];

  const quickChatPrompts = [
    "Why is finding good work-life balance so unnecessarily exhausting?",
    "Tell me an honest hot take about modern social media culture.",
    "How do I politely tell someone in a group chat to calm down?",
    "What is the funniest human behavior you've analyzed so far?",
  ];

  // Smart versatile contextual generator that never repeats and dissects user input
  const generateVersatileLocalReply = (userMsg: string, currentMode: 'roast' | 'chat' | 'vibecheck') => {
    const historyPayload = messages.map((m) => ({ sender: m.sender, text: m.text }));
    const reply = generateVersatileRoast(userMsg, currentMode, historyPayload, usedRoastsRef.current);

    if (currentMode === 'roast') {
      const damageGiven = reply.damage || Math.floor(Math.random() * 22) + 16;
      const damageTaken = Math.floor(damageGiven * 0.85);
      setUserHp((prev) => Math.max(0, prev - damageGiven));
      setBotHp((prev) => Math.max(0, prev - damageTaken));
    }

    return reply;
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText.trim();
    if (!text || isBotTyping) return;

    soundFx.playMessageSent();
    soundFx.triggerHaptic(14);

    const userMessage: Message = {
      id: `m_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsBotTyping(true);

    try {
      // First attempt backend Claude AI or dynamic server endpoint
      const replyData = await ApiService.submitRoast({
        message: text,
        history: messages.map((m) => ({ sender: m.sender, text: m.text })),
        mode,
      });

      // Track into session used set to prevent future duplicates
      usedRoastsRef.current.add(replyData.text);

      if (mode === 'roast') {
        const damage = replyData.damage || Math.floor(Math.random() * 20) + 15;
        setUserHp((prev) => Math.max(0, prev - damage));
        setBotHp((prev) => Math.max(0, prev - Math.floor(damage * 0.8)));
      }

      soundFx.playMessageReceived();
      soundFx.triggerHaptic(18);

      const botMessage: Message = {
        id: `m_bot_${Date.now()}`,
        sender: 'bot',
        text: replyData.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        damage: replyData.damage,
        roastRating: replyData.roastRating,
        badge: mode === 'roast' ? '🔥 ROAST BOT' : mode === 'vibecheck' ? '🔮 VIBE GURU' : '💬 BESTIE',
      };

      setMessages((prev) => [...prev, botMessage]);
      setBotMood(replyData.mood || 'roasting');
    } catch {
      // Seamless intelligent local fallback
      const replyData = generateVersatileLocalReply(text, mode);
      usedRoastsRef.current.add(replyData.text);

      soundFx.playMessageReceived();
      soundFx.triggerHaptic(18);

      const botMessage: Message = {
        id: `m_bot_${Date.now()}`,
        sender: 'bot',
        text: replyData.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        damage: replyData.damage,
        roastRating: replyData.roastRating,
        badge: mode === 'roast' ? '🔥 ROAST BOT' : mode === 'vibecheck' ? '🔮 VIBE GURU' : '💬 BESTIE',
      };

      setMessages((prev) => [...prev, botMessage]);
      setBotMood(replyData.mood);
    } finally {
      setIsBotTyping(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b-4 border-black">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            type="button"
            className="bg-comic-yellow hover:bg-comic-orange text-black font-mono font-bold text-xs px-3.5 py-1.5 rounded-xl border-3 border-black shadow-cartoon transition-all hover:-translate-y-0.5 active:translate-y-0 active:shadow-cartoon-sm"
          >
            ← BACK TO SCENARIOS
          </button>
          <span className="bg-comic-pink text-white font-mono font-extrabold text-xs px-3 py-1 rounded-full border-2 border-black shadow-cartoon-sm">
            COMIC ARENA
          </span>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-2 p-1.5 bg-black rounded-2xl border-2 border-black">
          <button
            onClick={() => setMode('roast')}
            type="button"
            className={`font-display font-bold text-xs px-3 py-1.5 rounded-xl transition-all ${
              mode === 'roast'
                ? 'bg-comic-pink text-white border-2 border-black shadow-cartoon-sm scale-105'
                : 'text-paper-300 hover:text-white'
            }`}
          >
            🔥 ROAST BATTLE
          </button>
          <button
            onClick={() => setMode('chat')}
            type="button"
            className={`font-display font-bold text-xs px-3 py-1.5 rounded-xl transition-all ${
              mode === 'chat'
                ? 'bg-comic-cyan text-black border-2 border-black shadow-cartoon-sm scale-105'
                : 'text-paper-300 hover:text-white'
            }`}
          >
            💬 NORMAL CHAT
          </button>
          <button
            onClick={() => setMode('vibecheck')}
            type="button"
            className={`font-display font-bold text-xs px-3 py-1.5 rounded-xl transition-all ${
              mode === 'vibecheck'
                ? 'bg-comic-yellow text-black border-2 border-black shadow-cartoon-sm scale-105'
                : 'text-paper-300 hover:text-white'
            }`}
          >
            🔮 VIBE CHECK
          </button>
        </div>
      </div>

      {/* Main Comic Battle Arena Card */}
      <div className="bg-[#FFFDF0] text-black border-4 border-black rounded-3xl p-5 sm:p-7 shadow-cartoon-xl relative overflow-hidden">
        {/* Cartoon Mascot & HP Display Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b-3 border-black">
          {/* 3D Mascot Stage */}
          <div className="flex items-center gap-4">
            <div className="relative bg-comic-yellow/30 p-2 rounded-3xl border-3 border-black shadow-cartoon">
              <Cartoon3DMascot mood={botMood} size="md" />
              <div className="absolute -bottom-2 -right-2 bg-comic-pink text-white font-mono font-extrabold text-[10px] px-2 py-0.5 rounded-full border-2 border-black shadow-cartoon-sm">
                3D INTERACTIVE
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-black text-2xl text-black uppercase tracking-tight">
                  BUSTER 3000
                </h2>
                <span className="bg-comic-green text-black font-mono font-bold text-[10px] px-2 py-0.5 rounded-md border-2 border-black">
                  ONLINE
                </span>
              </div>
              <p className="font-sans font-medium text-xs text-ink-800 mt-1 max-w-xs">
                {mode === 'roast'
                  ? "Roast battle mode: throw your best jokes and let's see who survives with HP left!"
                  : mode === 'vibecheck'
                  ? "Drop any awkward life dilemma or text and get an honest, spicy verdict!"
                  : "Normal buddy chat: talk about memes, bad dates, or life without judgment."}
              </p>
            </div>
          </div>

          {/* Roast Battle HP Bar (Visible in Roast Mode) */}
          {mode === 'roast' && (
            <div className="w-full md:w-64 bg-black text-white p-3 rounded-2xl border-3 border-black shadow-cartoon">
              <div className="flex items-center justify-between text-xs font-mono font-bold mb-1">
                <span className="text-comic-pink">YOU: {userHp}% HP</span>
                <span className="text-comic-yellow">BUSTER: {botHp}% HP</span>
              </div>
              <div className="w-full h-4 bg-ink-850 rounded-full border-2 border-white overflow-hidden flex">
                <div
                  className="h-full bg-comic-pink transition-all duration-300"
                  style={{ width: `${userHp}%` }}
                />
                <div
                  className="h-full bg-comic-yellow transition-all duration-300 ml-auto"
                  style={{ width: `${botHp}%` }}
                />
              </div>
              <div className="text-[10px] font-mono text-center text-paper-300 mt-1.5 uppercase">
                {userHp === 0
                  ? "💀 YOU GOT ROASTED TO ASHES!"
                  : botHp === 0
                  ? "👑 YOU DEFEATED BUSTER!"
                  : userHp > botHp
                  ? "🏆 YOU ARE WINNING!"
                  : userHp < botHp
                  ? "🔥 BUSTER IS ROASTING YOU!"
                  : "⚔️ NECK AND NECK!"}
              </div>
            </div>
          )}
        </div>

        {/* Chat Stream Viewport */}
        <div className="min-h-[360px] max-h-[460px] overflow-y-auto py-5 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${
                m.sender === 'user' ? 'items-end ml-auto' : 'items-start mr-auto'
              } max-w-[85%] sm:max-w-[75%]`}
            >
              {/* Sender label & badge */}
              <div className="flex items-center gap-2 mb-1 px-1 text-[11px] font-mono font-bold">
                {m.sender === 'bot' && (
                  <span className="bg-comic-pink text-white text-[10px] px-2 py-0.5 rounded-full border-2 border-black shadow-cartoon-sm">
                    {m.badge || 'BUSTER'}
                  </span>
                )}
                {m.sender === 'user' && (
                  <span className="bg-comic-cyan text-black text-[10px] px-2 py-0.5 rounded-full border-2 border-black shadow-cartoon-sm">
                    YOU
                  </span>
                )}
                <span className="text-ink-600">{m.timestamp}</span>
              </div>

              {/* Message Bubble */}
              <div
                className={`p-4 rounded-3xl border-3 border-black shadow-cartoon text-sm sm:text-base font-sans font-semibold leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-comic-cyan text-black rounded-br-none'
                    : 'bg-white text-black rounded-bl-none'
                }`}
              >
                <p className="whitespace-pre-wrap">{m.text}</p>
                {m.roastRating && (
                  <div className="mt-2.5 pt-2 border-t-2 border-black/15 flex items-center justify-between font-mono font-extrabold text-xs text-comic-pink">
                    <span>{m.roastRating}</span>
                    <span>💥</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isBotTyping && (
            <div className="flex items-center gap-2 bg-white text-black p-3 rounded-2xl border-3 border-black shadow-cartoon max-w-xs animate-pulse">
              <span className="font-mono font-bold text-xs text-comic-pink">BUSTER IS COOKING A COMEBACK...</span>
              <span className="animate-spin text-sm">🍳</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick-Prompt Suggestions */}
        <div className="pt-3 border-t-3 border-black space-y-2">
          <div className="text-[11px] font-mono font-extrabold uppercase text-black flex items-center gap-1.5">
            <span>⚡ {mode === 'roast' ? 'QUICK LAUNCH PUNCHLINES:' : mode === 'vibecheck' ? 'QUICK VIBE CHECK DILEMMAS:' : 'QUICK CHAT TOPICS:'}</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {(mode === 'roast' ? quickRoasts : mode === 'vibecheck' ? quickVibeChecks : quickChatPrompts).map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(item)}
                className="whitespace-nowrap bg-white hover:bg-comic-yellow text-black font-sans font-bold text-xs px-3 py-1.5 rounded-xl border-2 border-black shadow-cartoon-sm transition-all hover:-translate-y-0.5 flex-shrink-0 cursor-pointer"
              >
                "{item.slice(0, 42)}..."
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="pt-4 flex items-center gap-2 sm:gap-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={
              mode === 'roast'
                ? "Type your best roast or comeback here..."
                : mode === 'vibecheck'
                ? "Paste any awkward situation or text to check..."
                : "Type anything to chat with Buster..."
            }
            className="flex-1 bg-white text-black placeholder:text-ink-600 border-3 border-black rounded-2xl px-4 py-3 font-sans font-semibold text-sm focus:outline-none focus:ring-4 focus:ring-comic-pink shadow-cartoon"
          />
          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isBotTyping}
            className="bg-comic-pink hover:bg-comic-orange text-white font-display font-black text-sm px-5 py-3 rounded-2xl border-3 border-black shadow-cartoon hover:-translate-y-0.5 active:translate-y-0 active:shadow-cartoon-sm transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
          >
            FIRE! 🚀
          </button>
        </div>
      </div>
    </div>
  );
};
