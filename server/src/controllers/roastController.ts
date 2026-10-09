import { Request, Response } from 'express';
import Anthropic from '@anthropic-ai/sdk';

export interface RoastPayload {
  message: string;
  history?: Array<{ sender: 'user' | 'bot'; text: string }>;
  mode: 'roast' | 'chat' | 'vibecheck';
}

export interface RoastResult {
  text: string;
  damage?: number;
  roastRating?: string;
  mood: 'happy' | 'roasting' | 'shocked' | 'chill';
}

export class RoastController {
  private static anthropic: Anthropic | null = null;

  private static getClient(): Anthropic | null {
    if (!this.anthropic && process.env.ANTHROPIC_API_KEY) {
      this.anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY
      });
    }
    return this.anthropic;
  }

  public static async handleRoast(req: Request, res: Response): Promise<void> {
    const { message, history = [], mode = 'roast' } = req.body as RoastPayload;
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message text is required' });
      return;
    }

    const client = RoastController.getClient();
    const isMock = process.env.MOCK_AI === 'true' || !client;

    if (!isMock && client) {
      try {
        const model = process.env.ANTHROPIC_MODEL || 'claude-3-5-haiku-20241022';
        const systemPrompt = `You are BUSTER 3000, an unhinged, hilarious, quick-witted cartoon 3D AI roast master in a comedy social scenario game.
Mode: "${mode}"

RULES:
1. If mode is "roast": Deliver a devastating, hilarious, punchy cartoon roast (1-2 sentences MAX). Directly dissect, quote, or mock the specific words, grammar, logic, or tone of the user's message. NEVER give generic insults.
2. If mode is "vibecheck": Read their dilemma or text with brutal comic honesty (1-2 sentences MAX).
3. If mode is "chat": Banter playfully like a chaotic cartoon best friend (1-2 sentences MAX).
4. Output STRICT JSON only with keys:
{
  "text": "Your hilarious reply",
  "damage": 35, // number between 15 and 95 (only for roast mode)
  "roastRating": "DAMAGE: 68 HP • SOLID DIG", // witty verdict
  "mood": "roasting" // one of: "roasting", "shocked", "happy", "chill"
}`;

        const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [];
        for (const h of history.slice(-6)) {
          messages.push({
            role: h.sender === 'user' ? 'user' : 'assistant',
            content: h.text
          });
        }
        messages.push({
          role: 'user',
          content: message
        });

        const response = await client.messages.create({
          model,
          max_tokens: 180,
          temperature: 0.85,
          system: systemPrompt,
          messages
        });

        const first = response.content[0];
        if (first.type === 'text') {
          try {
            const parsed = JSON.parse(first.text.replace(/```json|```/g, '').trim());
            res.json({ success: true, data: parsed });
            return;
          } catch {
            res.json({
              success: true,
              data: {
                text: first.text.trim(),
                damage: Math.floor(Math.random() * 25) + 15,
                roastRating: 'DAMAGE: 75 HP • CRITICAL HIT!',
                mood: 'roasting'
              }
            });
            return;
          }
        }
      } catch (err: any) {
        console.warn('[RoastController] Claude roast call failed, falling back to dynamic generator:', err?.message);
      }
    }

    // Dynamic Contextual Engine (Mock / Fallback)
    const result = RoastController.generateContextualRoast(message, mode);
    res.json({ success: true, data: result });
  }

  public static generateContextualRoast(
    userMsg: string,
    mode: 'roast' | 'chat' | 'vibecheck'
  ): RoastResult {
    const raw = userMsg.trim();
    const lower = raw.toLowerCase();
    const wordCount = raw.split(/\s+/).length;

    if (mode === 'roast') {
      const damage = Math.floor(Math.random() * 28) + 18;

      // 1. Target single-word or tiny comebacks
      if (wordCount <= 2) {
        return {
          text: `"${raw}"? That's all your CPU could muster? You just brought a butter knife to a nuclear roast battle. Give me an actual sentence!`,
          damage: 30,
          roastRating: 'DAMAGE: 35 HP • LOW-EFFORT FLOP',
          mood: 'roasting'
        };
      }

      // 2. Target essay length
      if (wordCount > 25) {
        return {
          text: `Did you just paste the terms and conditions of your insecurity? Nobody is reading all that emotional baggage, bro!`,
          damage: 82,
          roastRating: 'DAMAGE: 82 HP • TL;DR KNOCKOUT',
          mood: 'shocked'
        };
      }

      // 3. Target "mom" or family roasts
      if (lower.includes('mom') || lower.includes('mother') || lower.includes('mama')) {
        return {
          text: `A "yo mama" joke in this economy? Even internet explorer has moved on from 2004 humor! My mother is a mainframe and she has more wit than that.`,
          damage: 70,
          roastRating: 'DAMAGE: 70 HP • 2004 TIME CAPSULE',
          mood: 'roasting'
        };
      }

      // 4. Target bot / AI / computer insults
      if (lower.includes('bot') || lower.includes('robot') || lower.includes('code') || lower.includes('ai') || lower.includes('calculator')) {
        return {
          text: `Call me a calculator all you want, but at least all my functions actually work. Your social skills are currently returning undefined!`,
          damage: 92,
          roastRating: 'DAMAGE: 92 HP • SYSTEM REBOOT!',
          mood: 'shocked'
        };
      }

      // 5. Target insults about ugliness / appearance
      if (lower.includes('ugly') || lower.includes('stupid') || lower.includes('dumb') || lower.includes('trash') || lower.includes('bad')) {
        return {
          text: `You really typed "${raw}" and thought: 'Yeah, this will destroy him.' You have the intimidation factor of an angry golden retriever puppy.`,
          damage: 64,
          roastRating: 'DAMAGE: 64 HP • TOOTHLESS ATTACK',
          mood: 'roasting'
        };
      }

      // 6. Target slang ("bruh", "bro", "mid", "rizz", "cringe", "lol")
      if (lower.includes('rizz') || lower.includes('mid') || lower.includes('cringe') || lower.includes('skibidi') || lower.includes('sigma')) {
        return {
          text: `Using brainrot buzzwords won't save your negative charisma stat. Your conversational rizz is currently in collections.`,
          damage: 88,
          roastRating: 'DAMAGE: 88 HP • BRAINROT TAX',
          mood: 'shocked'
        };
      }

      // 7. Target question insults
      if (raw.endsWith('?')) {
        return {
          text: `Asking questions mid-battle? You can't even stand behind your own insult without needing peer validation!`,
          damage: 55,
          roastRating: 'DAMAGE: 55 HP • CONFUSED COMEDY',
          mood: 'roasting'
        };
      }

      // 8. General dynamic contextual comebacks incorporating exact snippet
      const snippet = raw.slice(0, 30);
      const contextualRoasts = [
        {
          text: `"${snippet}..." Bro, I've heard car alarms with better comedic timing. You definitely practice comebacks in the shower and still end up apologizing.`,
          rating: 'DAMAGE: 74 HP • SHOWER DEBATER',
          mood: 'roasting' as const
        },
        {
          text: `You came in swinging like an inflatable tube man outside a car dealership. Absolutely zero structural damage, pure flailing!`,
          rating: 'DAMAGE: 68 HP • WACKY WAVING FLOP',
          mood: 'roasting' as const
        },
        {
          text: `HOLD UP. Is that really your finisher? You're the human equivalent of unseasoned mashed potatoes. Completely harmless!`,
          rating: 'DAMAGE: 85 HP • CRITICAL HIT!',
          mood: 'shocked' as const
        },
        {
          text: `That comeback was so lukewarm my cooling fans just shut down out of sheer boredom. Step up your game!`,
          rating: 'DAMAGE: 78 HP • EMOTIONAL DAMAGE!',
          mood: 'roasting' as const
        }
      ];

      const pick = contextualRoasts[Math.floor(Math.random() * contextualRoasts.length)];
      return {
        text: pick.text,
        damage,
        roastRating: pick.rating,
        mood: pick.mood
      };
    }

    if (mode === 'vibecheck') {
      if (lower.includes('ex') || lower.includes('text him') || lower.includes('text her')) {
        return {
          text: "PUT THE PHONE DOWN. Go touch some grass, hydrate, and delete that draft immediately. 0/10 idea, pure impending doom.",
          roastRating: 'VIBE RATING: 1/10 • TOXIC ALERT',
          mood: 'shocked'
        };
      }
      if (lower.includes('boss') || lower.includes('job') || lower.includes('work') || lower.includes('meeting')) {
        return {
          text: "That workplace dynamic sounds like a psychological thriller with bad catering. Keep your responses short and your resume updated!",
          roastRating: 'VIBE RATING: 5/10 • BUREAUCRATIC CHAOS',
          mood: 'roasting'
        };
      }
      if (lower.includes('late') || lower.includes('cancel') || lower.includes('flake')) {
        return {
          text: "Canceling plans is self-care until you do it 4 times in a row, then it's just being an unreliable menace. Own it with honesty!",
          roastRating: 'VIBE RATING: 6.5/10 • MILD FLAKE',
          mood: 'chill'
        };
      }

      return {
        text: `Based on "${raw.slice(0, 35)}": You are overthinking this situation by roughly 800%. The other party hasn't given this 5 seconds of thought. Take a breath!`,
        roastRating: 'VIBE RATING: 7.2/10 • OVERTHINKER DETECTED',
        mood: 'chill'
      };
    }

    // Normal chat
    const dynamicChatReplies = [
      `Honestly? I totally hear you on "${raw.slice(0, 30)}". Half of adult communication is just pretending you know how to react in real time.`,
      `That's wildly chaotic haha! But I love the transparency. What are you planning to do about it next?`,
      `I'm an AI running on overclocked servers and even I think that sounds like a legendary plot development. Tell me more!`,
      `You know what? I respect the honesty. Most people sugarcoat their thoughts until they evaporate.`
    ];

    return {
      text: dynamicChatReplies[Math.floor(Math.random() * dynamicChatReplies.length)],
      mood: 'happy'
    };
  }
}
