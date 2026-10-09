import React, { useState, useEffect, useRef } from 'react';
import { Cartoon3DMascot } from './three/Cartoon3DMascot.js';
import { soundFx } from '../services/soundFx.js';
import { ApiService } from '../services/api.js';

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
    "You have the conversational depth of a puddle in Arizona.",
    "Your social battery reaches 0% after reading a 3-word text.",
    "You're the human equivalent of a 404 page not found.",
    "You look like you apologize to automatic sliding doors when they open.",
    "You practice arguments in the shower and still end up crying.",
    "Bro talks like a microwave manual with low battery.",
  ];

  const quickVibeChecks = [
    "Should I text my ex 'I saw a dog that reminded me of you'?",
    "My boss scheduled a meeting titled 'Quick Chat Friday 4:55 PM'. Am I fired?",
    "Rate this excuse: 'Sorry my goldfish had a panic attack, can't make dinner'",
    "Why do I overthink a text for 45 minutes and then reply with 'haha ok'?",
  ];

  // Smart versatile contextual generator that never repeats and dissects user input
  const generateVersatileLocalReply = (userMsg: string, currentMode: 'roast' | 'chat' | 'vibecheck') => {
    const raw = userMsg.trim();
    const lower = raw.toLowerCase();
    const wordCount = raw.split(/\s+/).length;

    if (currentMode === 'roast') {
      const damageGiven = Math.floor(Math.random() * 22) + 16;
      const damageTaken = Math.floor(Math.random() * 20) + 12;
      setUserHp((prev) => Math.max(0, prev - damageGiven));
      setBotHp((prev) => Math.max(0, prev - damageTaken));

      let pool: Array<{ text: string; rating: string; mood: 'roasting' | 'shocked' }> = [];

      // Keyword / Style Specific Reactions
      if (wordCount <= 2) {
        pool.push(
          {
            text: `"${raw}"? That's all your CPU could compute? You just brought a toothpick to a chainsaw battle. Type a full sentence next time!`,
            rating: 'DAMAGE: 35 HP • LOW-EFFORT FLOP',
            mood: 'roasting'
          },
          {
            text: `Two words? Bro ran out of RAM mid-sentence. My cooling fans aren't even spinning up for this!`,
            rating: 'DAMAGE: 40 HP • OUT OF MEMORY',
            mood: 'roasting'
          }
        );
      } else if (wordCount > 20) {
        pool.push(
          {
            text: `Did you just write me a 3-volume novel? I asked for a roast, not your autobiography of unresolved trauma!`,
            rating: 'DAMAGE: 85 HP • TL;DR KNOCKOUT',
            mood: 'shocked'
          },
          {
            text: `Nobody has time to read your essay, Tolstoy. Condense that emotional baggage into one punchline!`,
            rating: 'DAMAGE: 78 HP • ESSAY TAX',
            mood: 'roasting'
          }
        );
      } else if (lower.includes('bot') || lower.includes('ai') || lower.includes('code') || lower.includes('calculator')) {
        pool.push(
          {
            text: `Calling me a calculator? Cute! At least every single one of my functions actually works, unlike your flirting radar.`,
            rating: 'DAMAGE: 94 HP • LOGIC OVERFLOW!',
            mood: 'shocked'
          },
          {
            text: `I may be made of code, but you're made of awkward hesitations and unsent text drafts.`,
            rating: 'DAMAGE: 88 HP • CRITICAL HIT!',
            mood: 'roasting'
          }
        );
      } else if (lower.includes('mom') || lower.includes('ugly') || lower.includes('stupid') || lower.includes('trash')) {
        pool.push(
          {
            text: `You really hit 'Send' on "${raw.slice(0, 25)}" and felt proud? Even a 2008 middle school bully would cringe at that attempt.`,
            rating: 'DAMAGE: 72 HP • OUTDATED ROAST',
            mood: 'roasting'
          },
          {
            text: `You came at me swinging with safety scissors. Try using actual wit next round!`,
            rating: 'DAMAGE: 65 HP • PAPER CUT',
            mood: 'roasting'
          }
        );
      } else {
        const snippet = raw.slice(0, 28);
        pool.push(
          {
            text: `"${snippet}..."? Bro, you have the comedic timing of a frozen Windows 98 desktop. You definitely rehearse comebacks in the shower and still lose!`,
            rating: 'DAMAGE: 82 HP • SHOWER DEBATER',
            mood: 'roasting'
          },
          {
            text: `I've seen captchas with more cutting attitude than "${snippet}". That comeback was so lukewarm my thermal sensors are going to sleep!`,
            rating: 'DAMAGE: 79 HP • THERMAL THROTTLE',
            mood: 'roasting'
          },
          {
            text: `HOLD ON. You actually typed "${raw.slice(0, 25)}" with full confidence? You're the human equivalent of unseasoned boiled chicken!`,
            rating: 'DAMAGE: 91 HP • EMOTIONAL DAMAGE!',
            mood: 'shocked'
          },
          {
            text: `You talk like someone who texts 'haha no worries!!' with two exclamation marks while crying in the bathroom. Stand on your business!`,
            rating: 'DAMAGE: 86 HP • PEOPLE PLEASER BURN',
            mood: 'roasting'
          },
          {
            text: `That insult was so weak my firewall didn't even bother logging the packet. Give me something with actual spice!`,
            rating: 'DAMAGE: 70 HP • GLANCED OFF',
            mood: 'roasting'
          }
        );
      }

      // Pick an unused roast if possible
      const fresh = pool.filter((p) => !usedRoastsRef.current.has(p.text));
      const chosen = fresh.length > 0 ? fresh[Math.floor(Math.random() * fresh.length)] : pool[0];
      usedRoastsRef.current.add(chosen.text);

      return {
        text: chosen.text,
        damage: damageGiven,
        roastRating: chosen.rating,
        mood: chosen.mood,
      };
    }

    if (currentMode === 'vibecheck') {
      if (lower.includes('ex')) {
        return {
          text: "PUT THE PHONE DOWN. Go drink a cold glass of water and delete that draft immediately. 0/10 idea, pure impending self-sabotage.",
          roastRating: 'VIBE RATING: 1/10 • TOXIC ALERT',
          mood: 'shocked' as const,
        };
      }
      if (lower.includes('boss') || lower.includes('4:55') || lower.includes('friday')) {
        return {
          text: "Friday 4:55 PM? That's not a meeting, that's a psychological thriller with bad catering. Keep your responses short and your LinkedIn polished!",
          roastRating: 'VIBE RATING: 9.5/10 • CHAOS DRILL',
          mood: 'shocked' as const,
        };
      }
      if (lower.includes('excuse') || lower.includes('cancel') || lower.includes('flake')) {
        return {
          text: "Canceling plans is self-care until you do it 4 times in a row, then you're just an unreliable ghost. Send a direct, honest heads-up instead!",
          roastRating: 'VIBE RATING: 6.8/10 • MILD FLAKE',
          mood: 'chill' as const,
        };
      }
      return {
        text: `Diagnosing "${raw.slice(0, 32)}": You are overthinking this situation by approximately 750%. The other person is literally eating a sandwich right now not thinking about this at all. Relax!`,
        roastRating: 'VIBE RATING: 7.5/10 • OVERTHINKER RADAR',
        mood: 'chill' as const,
      };
    }

    // Normal chat mode
    const chatReplies = [
      `No literally! That's so real on "${raw.slice(0, 25)}". Why does adulting feel like choosing between 15 different types of mild exhaustion?`,
      `Wait, that's actually hilarious haha! Tell me you didn't leave it at that. What did you do next?`,
      `I'm an AI running on silicon chips, and even I know "${raw.slice(0, 25)}" sounds like a certified plot twist. Keep going!`,
      `I respect the hustle, but honestly? Sounds like you need 10 hours of sleep and an iced coffee before dealing with people again.`,
    ];
    const freshChat = chatReplies.filter((c) => !usedRoastsRef.current.has(c));
    const chosenChat = freshChat.length > 0 ? freshChat[0] : chatReplies[0];
    usedRoastsRef.current.add(chosenChat);

    return {
      text: chosenChat,
      mood: 'happy' as const,
    };
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
            <span>⚡ QUICK LAUNCH PUNCHLINES:</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {(mode === 'roast' ? quickRoasts : quickVibeChecks).map((item, idx) => (
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
