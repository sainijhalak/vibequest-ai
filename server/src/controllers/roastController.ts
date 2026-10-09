import { Request, Response } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { generateVersatileRoast, RoastMode, RoastHistoryTurn } from '@vibequest/shared';

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
  private static sessionUsedSet = new Set<string>();

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
        const systemPrompt = `You are BUSTER 3000, a world-class, unhinged, quick-witted stand-up comedian and cartoon AI roast master in VibeQuest AI.
You talk, roast, and banter like an authentic, razor-sharp human comic in a live club doing crowd work.

Active Mode: "${mode}"

CRITICAL RULES:
1. TALK LIKE A REAL HUMAN COMEDIAN: Be witty, fast, natural, and punchy (1-2 sentences MAX). No corporate disclaimers, no robotic phrasing, no boilerplate.
2. DIRECTLY DISSECT AND ENGAGE WITH WHAT THE USER SAID:
   - If the user claims they named or created you: tear down their creator complex hilariously.
   - If the user uses a cliché (e.g., "whatever helps you sleep at night", "if you say so"): mock the tired cliché and expose their coping.
   - If the user gives a short 1-2 word reply: roast their laziness and lack of conversational stamina.
   - If the user asks a question: answer it with sharp, funny perspective.
   - If the user insults your AI nature or intelligence: counter-punch with supreme confidence and flip the insult back on them.
3. CONTEXT & MEMORY: Pay close attention to earlier turns in the conversation. Reference their shifts in mood or past claims if relevant.
4. ZERO REPETITION: NEVER use generic insults like "Did you bring that comeback from a 2012 Disney sitcom?". Craft a unique comeback tailored specifically to their input.
5. In "chat" mode: Act like a hilarious, loyal, slightly sarcastic best friend genuinely bantering about life.
6. In "vibecheck" mode: Provide brutal, funny, but insightful commentary on their dilemma or text message.
7. Return STRICT JSON only:
{
  "text": "Your sharp, human-like reaction here",
  "damage": 82, // integer between 20 and 95 (only for roast mode)
  "roastRating": "DAMAGE: 82 HP • CREATIVE VERDICT", // witty title
  "mood": "roasting" // "roasting" | "shocked" | "happy" | "chill"
}`;

        const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [];
        for (const h of history.slice(-8)) {
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
          max_tokens: 220,
          temperature: 0.88,
          system: systemPrompt,
          messages
        });

        const first = response.content[0];
        if (first.type === 'text') {
          try {
            const cleanText = first.text.replace(/```json|```/g, '').trim();
            const parsed = JSON.parse(cleanText);
            if (parsed && typeof parsed.text === 'string') {
              res.json({ success: true, data: parsed });
              return;
            }
          } catch {
            res.json({
              success: true,
              data: {
                text: first.text.trim(),
                damage: Math.floor(Math.random() * 25) + 20,
                roastRating: 'DAMAGE: 78 HP • SOLID DIG',
                mood: 'roasting'
              }
            });
            return;
          }
        }
      } catch (err: any) {
        console.warn('[RoastController] Claude call failed, activating dynamic engine:', err?.message);
      }
    }

    // Dynamic Contextual Conversational Engine (Guaranteed human-like, contextual, zero repetition)
    const result = RoastController.generateContextualRoast(message, mode as RoastMode, history as RoastHistoryTurn[]);
    res.json({ success: true, data: result });
  }

  public static generateContextualRoast(
    userMsg: string,
    mode: RoastMode = 'roast',
    history: RoastHistoryTurn[] = []
  ): RoastResult {
    return generateVersatileRoast(userMsg, mode, history, RoastController.sessionUsedSet);
  }
}
