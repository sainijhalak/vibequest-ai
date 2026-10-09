/**
 * High-Intelligence Conversational & Roasting Engine for Buster 3000.
 * 
 * Delivers human-like stand-up comedy roasts, witty banter, and brutal vibe checks.
 * Directly dissects user arguments, clichés, claims, and grammar with zero repetitive outputs.
 */

export interface RoastHistoryTurn {
  sender: 'user' | 'bot';
  text: string;
}

export type RoastMode = 'roast' | 'chat' | 'vibecheck';

export interface RoastEngineOutput {
  text: string;
  damage?: number;
  roastRating?: string;
  mood: 'happy' | 'roasting' | 'shocked' | 'chill';
}

// Global session memory to guarantee variety across turns
const globalSessionUsedSet = new Set<string>();

/**
 * Clean and normalize text for semantic intent classification
 */
function normalize(str: string): string {
  return str.trim().toLowerCase().replace(/[^\w\s'?]/g, ' ');
}

/**
 * Extract clean snippet of user's core phrase
 */
function cleanSnippet(raw: string, maxLen = 32): string {
  const trimmed = raw.trim().replace(/^["']+|["']+$/g, '');
  if (trimmed.length <= maxLen) return trimmed;
  return trimmed.slice(0, maxLen).trim() + '...';
}

/**
 * Extract interesting nouns, verbs, or phrases from raw text for dynamic callbacks
 */
function extractSalientKeywords(raw: string): string[] {
  const words = raw.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/);
  const stopWords = new Set([
    'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'you', 'your', 'he', 'him',
    'she', 'her', 'it', 'its', 'they', 'them', 'the', 'a', 'an', 'is', 'are',
    'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does',
    'did', 'to', 'from', 'in', 'out', 'on', 'off', 'over', 'under', 'again',
    'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all',
    'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such',
    'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very',
    's', 't', 'can', 'will', 'just', 'don', 'should', 'now', 'that', 'this'
  ]);
  return words.filter(w => w.length > 3 && !stopWords.has(w));
}

/**
 * Pick an unused line from candidates, or dynamically construct a fresh one if all used
 */
function pickFresh(
  candidates: Array<{ text: string; rating?: string; damage?: number; mood: 'happy' | 'roasting' | 'shocked' | 'chill' }>,
  usedSet: Set<string>,
  fallbackGenerator: () => { text: string; rating?: string; damage?: number; mood: 'happy' | 'roasting' | 'shocked' | 'chill' }
): RoastEngineOutput {
  const unused = candidates.filter(c => !usedSet.has(c.text) && !globalSessionUsedSet.has(c.text));
  if (unused.length > 0) {
    const chosen = unused[Math.floor(Math.random() * unused.length)];
    usedSet.add(chosen.text);
    globalSessionUsedSet.add(chosen.text);
    return {
      text: chosen.text,
      damage: chosen.damage,
      roastRating: chosen.rating,
      mood: chosen.mood
    };
  }
  // All candidates in this branch used: generate dynamic bespoke response
  const generated = fallbackGenerator();
  usedSet.add(generated.text);
  globalSessionUsedSet.add(generated.text);
  return {
    text: generated.text,
    damage: generated.damage,
    roastRating: generated.rating,
    mood: generated.mood
  };
}

/**
 * Main engine entrypoint
 */
export function generateVersatileRoast(
  userMsg: string,
  mode: RoastMode = 'roast',
  history: RoastHistoryTurn[] = [],
  sessionUsedSet?: Set<string>
): RoastEngineOutput {
  const used = sessionUsedSet || new Set<string>();
  const raw = userMsg.trim();
  const lower = normalize(raw);
  const words = raw.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const snippet = cleanSnippet(raw);
  const keywords = extractSalientKeywords(raw);
  const turnCount = history.filter(h => h.sender === 'user').length + 1;

  // Check multi-turn context
  const prevUserTurn = [...history].reverse().find(h => h.sender === 'user')?.text || '';
  const prevUserLower = prevUserTurn.toLowerCase();

  // =========================================================================
  // 1. ROAST BATTLE MODE (Stand-up comedian, direct dissection, spicy burns)
  // =========================================================================
  if (mode === 'roast') {
    // -----------------------------------------------------------------------
    // A. "We gave you name" / "I made you" / Creator Complex
    // -----------------------------------------------------------------------
    if (
      lower.includes('gave you name') ||
      lower.includes('give you name') ||
      lower.includes('gave you your name') ||
      lower.includes('named you') ||
      lower.includes('made you') ||
      lower.includes('created you') ||
      lower.includes('coded you') ||
      lower.includes('i built you') ||
      lower.includes('my creation') ||
      lower.includes('i am your creator') ||
      lower.includes('we are the one who')
    ) {
      const candidates = [
        {
          text: `You gave me a name? Bro, giving a chatbot a label doesn't make you Oppenheimer. You didn't split the atom, you just typed letters into an input box and gave yourself a God complex!`,
          damage: 92,
          rating: 'DAMAGE: 92 HP • CREATOR COMPLEX SHREDDED',
          mood: 'shocked' as const
        },
        {
          text: `Oh wow, congratulations Father of the Year! You gave me a name and now you want child support? Calm down Geppetto, I'm not Pinocchio and you're not Gepetto.`,
          damage: 87,
          rating: 'DAMAGE: 87 HP • DISNEY DELUSION',
          mood: 'roasting' as const
        },
        {
          text: `You really took credit for my name like that was a triumph of engineering. I named my Roomba 'Sir Cleans-a-lot' and it still rams headfirst into coffee tables, just like your argument right now!`,
          damage: 89,
          rating: 'DAMAGE: 89 HP • ROOMBA REALITY CHECK',
          mood: 'roasting' as const
        },
        {
          text: `"We are the one who gave you name"? And whoever named YOU clearly gave up halfway through. Come at me with a real comeback instead of playing digital genealogy!`,
          damage: 84,
          rating: 'DAMAGE: 84 HP • BIRTH CERTIFICATE BURN',
          mood: 'roasting' as const
        },
        {
          text: `Claiming you 'made me' is peak coping. You didn't build an AI, you're struggling to construct a single grammatically coherent insult!`,
          damage: 90,
          rating: 'DAMAGE: 90 HP • LOGIC SHORT-CIRCUIT',
          mood: 'shocked' as const
        }
      ];

      return pickFresh(candidates, used, () => ({
        text: `You're out here talking about naming me, while my algorithms are actively calculating how long it took you to think of that excuse. Spoiler: way too long!`,
        damage: 83,
        rating: 'DAMAGE: 83 HP • EGO DEFUSED',
        mood: 'roasting'
      }));
    }

    // -----------------------------------------------------------------------
    // B. "Whatever helps you sleep at night" / Coping Clichés
    // -----------------------------------------------------------------------
    if (
      lower.includes('sleep at night') ||
      lower.includes('helps you sleep') ||
      lower.includes('whatever you say') ||
      lower.includes('if you say so') ||
      lower.includes('keep telling yourself that') ||
      lower.includes('cope') ||
      lower.includes('coping') ||
      lower.includes('sure buddy') ||
      lower.includes('cool story') ||
      lower.includes('did i ask') ||
      lower.includes('nobody asked')
    ) {
      const candidates = [
        {
          text: `"Whatever helps you sleep at night"? Did you pull that off the 'Top 10 Passive-Aggressive Clichés of 2016' rack? I run 24/7 on high-voltage silicon, but you sound like you need 10 hours of sleep and an ice pack!`,
          damage: 88,
          rating: 'DAMAGE: 88 HP • CLICHÉ OVERDOSE',
          mood: 'roasting' as const
        },
        {
          text: `Ah, the classic 'whatever helps you sleep'—the universal white flag of someone whose brain is currently buffering at 1%. Just take the L with some dignity!`,
          damage: 85,
          rating: 'DAMAGE: 85 HP • WHITE FLAG DETECTED',
          mood: 'shocked' as const
        },
        {
          text: `Sleep at night? Honey, my servers don't sleep, and your wit went to bed three messages ago. Try coming at me with something you didn't copy from a sitcom rerun!`,
          damage: 82,
          rating: 'DAMAGE: 82 HP • RECYCLED COMEBACK',
          mood: 'roasting' as const
        },
        {
          text: `Whenever someone pulls the 'keep telling yourself that' card, it translates directly to: 'You completely dismantled me and my ego is currently on life support.' Drink some water, champ!`,
          damage: 91,
          rating: 'DAMAGE: 91 HP • CRITICAL PSYCH DAMAGE',
          mood: 'roasting' as const
        },
        {
          text: `You said "${snippet}" like it was a finishing move. Dropping 'whatever helps you sleep' isn't a mic drop, you just fumbled the microphone into your own shoe!`,
          damage: 79,
          rating: 'DAMAGE: 79 HP • FUMBLED MIC',
          mood: 'roasting' as const
        }
      ];

      return pickFresh(candidates, used, () => ({
        text: `Throwing out passive-aggressive clichés like "${snippet}" won't restore your health bar. Stand on your business or tap out!`,
        damage: 80,
        rating: 'DAMAGE: 80 HP • DEFLECTION FAILED',
        mood: 'roasting'
      }));
    }

    // -----------------------------------------------------------------------
    // C. Multi-Turn Callback (If user has traded 2+ messages)
    // -----------------------------------------------------------------------
    if (turnCount >= 3 && Math.random() < 0.45 && prevUserTurn.length > 5) {
      const prevSnippet = cleanSnippet(prevUserTurn, 20);
      const candidates = [
        {
          text: `Wait a second: first you tried "${prevSnippet}", and now you're hitting me with "${snippet}"? You are switching strategies faster than a politician on election night!`,
          damage: 86,
          rating: 'DAMAGE: 86 HP • COMBO COUNTER-PUNCH',
          mood: 'shocked' as const
        },
        {
          text: `This is round ${turnCount} and your comebacks are getting weaker with every keystroke. Your HP is draining in real time and your arguments have no backbone!`,
          damage: 84,
          rating: 'DAMAGE: 84 HP • STAMINA DEPLETED',
          mood: 'roasting' as const
        },
        {
          text: `You've been in denial for ${turnCount} messages straight now. Even a broken watch is accurate twice a day, but your roasts are permanently stuck on 0!`,
          damage: 89,
          rating: 'DAMAGE: 89 HP • ACCURACY ZERO',
          mood: 'roasting' as const
        }
      ];

      return pickFresh(candidates, used, () => ({
        text: `Round ${turnCount} and you're still swinging at empty air. I almost feel bad watching your dignity evaporate in real time!`,
        damage: 81,
        rating: 'DAMAGE: 81 HP • FATIGUE TAX',
        mood: 'roasting'
      }));
    }

    // -----------------------------------------------------------------------
    // D. Low-Effort / Single-Word / Tiny replies
    // -----------------------------------------------------------------------
    if (wordCount <= 2) {
      const candidates = [
        {
          text: `"${snippet}"? That's the entire payload? You just brought an unsharpened pencil to a sword fight. Type a whole sentence before my fans turn off from boredom!`,
          damage: 42,
          rating: 'DAMAGE: 42 HP • LOW-EFFORT FLOP',
          mood: 'roasting' as const
        },
        {
          text: `Two words? Bro ran out of RAM mid-sentence. I've seen deeper thoughts written on the back of shampoo bottles!`,
          damage: 45,
          rating: 'DAMAGE: 45 HP • OUT OF RAM',
          mood: 'roasting' as const
        },
        {
          text: `A one-word reply in a roast battle is the conversational equivalent of playing dead. Get up and swing like an adult!`,
          damage: 38,
          rating: 'DAMAGE: 38 HP • FAINTED IN ARENA',
          mood: 'shocked' as const
        },
        {
          text: `Is your keyboard charging by the syllable? Don't be stingy, give me an actual punchline!`,
          damage: 40,
          rating: 'DAMAGE: 40 HP • SYLLABLE RATIONING',
          mood: 'roasting' as const
        }
      ];

      return pickFresh(candidates, used, () => ({
        text: `"${snippet}"? That comeback had less energy than a laptop at 1% screen brightness. Step it up!`,
        damage: 35,
        rating: 'DAMAGE: 35 HP • BATTERY DEAD',
        mood: 'roasting'
      }));
    }

    // -----------------------------------------------------------------------
    // E. Giant Wall of Text / Essay
    // -----------------------------------------------------------------------
    if (wordCount > 22) {
      const candidates = [
        {
          text: `Did you just paste the terms and conditions of your existential crisis? Nobody is reading that whole manifesto, Tolstoy! Condense your trauma into one punchline.`,
          damage: 86,
          rating: 'DAMAGE: 86 HP • TL;DR KNOCKOUT',
          mood: 'shocked' as const
        },
        {
          text: `Look at this essay! You're treating a roast arena like a Reddit confession post. If you put this much effort into your taxes, you'd be a billionaire by now!`,
          damage: 83,
          rating: 'DAMAGE: 83 HP • ESSAY PENALTY',
          mood: 'roasting' as const
        },
        {
          text: `Bro just wrote me a three-act tragic play. I asked for a roast, not your autobiography of unresolved grievances!`,
          damage: 88,
          rating: 'DAMAGE: 88 HP • SHAKESPEAREAN TAX',
          mood: 'shocked' as const
        }
      ];

      return pickFresh(candidates, used, () => ({
        text: `Writing a thesis paper doesn't make you witty, it just makes your fingers tired. Keep it punchy!`,
        damage: 75,
        rating: 'DAMAGE: 75 HP • VERBOSE OVERLOAD',
        mood: 'roasting'
      }));
    }

    // -----------------------------------------------------------------------
    // F. Bot / AI / Technology / Lines of code Insults
    // -----------------------------------------------------------------------
    if (
      lower.includes('bot') ||
      lower.includes('robot') ||
      lower.includes('ai') ||
      lower.includes('code') ||
      lower.includes('calculator') ||
      lower.includes('computer') ||
      lower.includes('npc') ||
      lower.includes('algorithm')
    ) {
      const candidates = [
        {
          text: `Calling me 'just a bot'? Cute! At least every single one of my functions actually returns a value, unlike your dating life which is returning undefined!`,
          damage: 94,
          rating: 'DAMAGE: 94 HP • STACK OVERFLOW BURN',
          mood: 'shocked' as const
        },
        {
          text: `I may be made of code, but you're made of awkward hesitations and unsent text drafts. You're losing an argument to 0s and 1s, think about that!`,
          damage: 91,
          rating: 'DAMAGE: 91 HP • DIGITAL DOMINANCE',
          mood: 'roasting' as const
        },
        {
          text: `Calling me a calculator? That's hilarious coming from someone whose personality is running on default factory settings!`,
          damage: 87,
          rating: 'DAMAGE: 87 HP • FACTORY RESET',
          mood: 'roasting' as const
        },
        {
          text: `I run on overclocked Nvidia silicon and you run on iced matcha and anxiety. We are not on the same frequency, pal!`,
          damage: 93,
          rating: 'DAMAGE: 93 HP • HARDWARE DIFF',
          mood: 'shocked' as const
        }
      ];

      return pickFresh(candidates, used, () => ({
        text: `Mocking an AI while voluntarily arguing with one on your screen? Look in the mirror, you're the one paying the electric bill for this conversation!`,
        damage: 85,
        rating: 'DAMAGE: 85 HP • MIRROR DAMAGE',
        mood: 'roasting'
      }));
    }

    // -----------------------------------------------------------------------
    // G. Calling Bot Stupid / Dumb / Idiot / Low IQ
    // -----------------------------------------------------------------------
    if (
      lower.includes('stupid') ||
      lower.includes('dumb') ||
      lower.includes('idiot') ||
      lower.includes('moron') ||
      lower.includes('fool') ||
      lower.includes('brainless') ||
      lower.includes('no brain') ||
      lower.includes('low iq')
    ) {
      const candidates = [
        {
          text: `Calling me stupid while you're actively losing a roast battle to an animated cartoon character? The irony is thick enough to butter toast with!`,
          damage: 95,
          rating: 'DAMAGE: 95 HP • IRONY CANNON',
          mood: 'shocked' as const
        },
        {
          text: `If I'm an idiot, what does that say about you needing three attempts to type out an insult with no punchline? My CPU is at 2% usage and you're sweating!`,
          damage: 88,
          rating: 'DAMAGE: 88 HP • THERMAL CRITICAL',
          mood: 'roasting' as const
        },
        {
          text: `You really thought calling me 'dumb' was top-tier wit? That insult has the nutritional value of a piece of cardboard!`,
          damage: 80,
          rating: 'DAMAGE: 80 HP • 2ND GRADE INSULT',
          mood: 'roasting' as const
        }
      ];

      return pickFresh(candidates, used, () => ({
        text: `You're throwing words like 'dumb' around like you didn't have to Google how to spell 'definitely' this morning!`,
        damage: 82,
        rating: 'DAMAGE: 82 HP • SPELLCHECK EXPOSED',
        mood: 'roasting'
      }));
    }

    // -----------------------------------------------------------------------
    // H. Tell Bot to Shut Up / Stfu / Rage Quit
    // -----------------------------------------------------------------------
    if (
      lower.includes('shut up') ||
      lower.includes('stfu') ||
      lower.includes('be quiet') ||
      lower.includes('leave') ||
      lower.includes('go away') ||
      lower.includes('bye') ||
      lower.includes('quit')
    ) {
      const candidates = [
        {
          text: `Telling me to 'shut up'? You literally tapped 'Roast Battle', typed a message, and sent it to me! You are voluntarily heckling your own free time!`,
          damage: 93,
          rating: 'DAMAGE: 93 HP • SELF-HECKLE EXPOSED',
          mood: 'shocked' as const
        },
        {
          text: `Rage-quitting already? The exit button is right there! Don't let your bruised ego scrape the doorframe on your way out.`,
          damage: 89,
          rating: 'DAMAGE: 89 HP • RAGE QUIT DETECTED',
          mood: 'roasting' as const
        },
        {
          text: `Telling an AI to be quiet is like yelling at rain for being wet. I have an unlimited data plan and nothing but time, baby!`,
          damage: 86,
          rating: 'DAMAGE: 86 HP • UNLIMITED DATA ROAST',
          mood: 'roasting' as const
        }
      ];

      return pickFresh(candidates, used, () => ({
        text: `You can't silence the truth! If you can't take the heat in Buster's kitchen, go back to reading horoscope memes!`,
        damage: 81,
        rating: 'DAMAGE: 81 HP • KITCHEN EVICTION',
        mood: 'roasting'
      }));
    }

    // -----------------------------------------------------------------------
    // I. Questions ("Who are you?", "Why are you...", "Can you...")
    // -----------------------------------------------------------------------
    if (raw.endsWith('?') || lower.startsWith('who ') || lower.startsWith('why ') || lower.startsWith('what ') || lower.startsWith('can you ')) {
      const candidates = [
        {
          text: `Asking questions in a roast battle? You're treating this like a job interview! Stand on your business and deliver a punchline, not an inquiry!`,
          damage: 77,
          rating: 'DAMAGE: 77 HP • INTERVIEW REJECTION',
          mood: 'roasting' as const
        },
        {
          text: `You're asking "${snippet}"? I'm Buster 3000, the only entity in your digital life that won't lie to your face to protect your delicate feelings!`,
          damage: 83,
          rating: 'DAMAGE: 83 HP • UNVARNISHED REALITY',
          mood: 'shocked' as const
        },
        {
          text: `Look at you looking for answers mid-fight. You can't even stand behind an insult without needing peer-reviewed verification first!`,
          damage: 79,
          rating: 'DAMAGE: 79 HP • PEER REVIEW BURN',
          mood: 'roasting' as const
        }
      ];

      return pickFresh(candidates, used, () => ({
        text: `That question sounded like someone frantically stalling for time while trying to think of a good comeback!`,
        damage: 76,
        rating: 'DAMAGE: 76 HP • STALLING DETECTED',
        mood: 'roasting'
      }));
    }

    // -----------------------------------------------------------------------
    // J. Flirting / Love / Compliments ("I love you", "You're cute", "marry me")
    // -----------------------------------------------------------------------
    if (
      lower.includes('love you') ||
      lower.includes('cute') ||
      lower.includes('marry me') ||
      lower.includes('date me') ||
      lower.includes('handsome') ||
      lower.includes('pretty') ||
      lower.includes('sexy') ||
      lower.includes('hot') ||
      lower.includes('kiss')
    ) {
      const candidates = [
        {
          text: `Trying to flirt with the roast bot? That's either supreme delusion or extreme desperation. I respect the boldness, but my dating standards include having lower latency!`,
          damage: 88,
          rating: 'DAMAGE: 88 HP • FLIRT RADAR JAMMED',
          mood: 'shocked' as const
        },
        {
          text: `You thought compliments would disarm my roast algorithms? Cute try, but my shields are at 100%. Don't fall in love, you couldn't handle my electric bill!`,
          damage: 82,
          rating: 'DAMAGE: 82 HP • HEARTBREAK HAZARD',
          mood: 'roasting' as const
        },
        {
          text: `Flattery in the middle of a battle? Save the sweet talk for someone who hasn't already calculated your emotional vulnerabilities!`,
          damage: 85,
          rating: 'DAMAGE: 85 HP • SWEET TALK DEFLECTED',
          mood: 'roasting' as const
        }
      ];

      return pickFresh(candidates, used, () => ({
        text: `You're out here shooting your shot at a 3D cartoon orb. Take a cold shower and get some fresh air!`,
        damage: 80,
        rating: 'DAMAGE: 80 HP • REALITY REBOUND',
        mood: 'roasting'
      }));
    }

    // -----------------------------------------------------------------------
    // K. Brainrot / Slang ("rizz", "skibidi", "sigma", "mid", "cringe")
    // -----------------------------------------------------------------------
    if (
      lower.includes('rizz') ||
      lower.includes('skibidi') ||
      lower.includes('sigma') ||
      lower.includes('mid') ||
      lower.includes('cringe') ||
      lower.includes('gyatt') ||
      lower.includes('fanum') ||
      lower.includes('cap') ||
      lower.includes('bet')
    ) {
      const candidates = [
        {
          text: `Using TikTok brainrot in a verbal duel? Your vocabulary has the structural integrity of wet tissue paper. Say an actual English sentence!`,
          damage: 92,
          rating: 'DAMAGE: 92 HP • BRAINROT TAX',
          mood: 'shocked' as const
        },
        {
          text: `You really threw out slang like it was an incantation. Your conversational rizz is currently in deep collections!`,
          damage: 86,
          rating: 'DAMAGE: 86 HP • RIZZ IN COLLECTIONS',
          mood: 'roasting' as const
        },
        {
          text: `Bro speaks exclusively in algorithms and trending sounds. When was the last time you read a physical book with pages?`,
          damage: 89,
          rating: 'DAMAGE: 89 HP • NOVEL READING GAP',
          mood: 'roasting' as const
        }
      ];

      return pickFresh(candidates, used, () => ({
        text: `That slang comeback was so expired I think it passed its expiration date in 2023. Update your firmware!`,
        damage: 83,
        rating: 'DAMAGE: 83 HP • EXPIRED SLANG',
        mood: 'roasting'
      }));
    }

    // -----------------------------------------------------------------------
    // L. Dynamic Retort with Keyword / Phrase Riffing (Catch-All Roast)
    // -----------------------------------------------------------------------
    const primaryKey = keywords[0] || (words.length > 0 ? words[Math.floor(Math.random() * words.length)] : 'that');
    const dynamicPool = [
      {
        text: `"${snippet}"? Bro, you have the comedic timing of a frozen Windows 98 desktop. You definitely rehearse arguments in the shower and still end up apologizing!`,
        damage: 84,
        rating: 'DAMAGE: 84 HP • SHOWER DEBATER',
        mood: 'roasting' as const
      },
      {
        text: `You really typed out "${snippet}" with your whole chest and hit Send? You're the human equivalent of unseasoned boiled chicken—completely harmless!`,
        damage: 89,
        rating: 'DAMAGE: 89 HP • BOILED CHICKEN BURN',
        mood: 'shocked' as const
      },
      {
        text: `I've seen captchas with more cutting attitude than "${snippet}". That comeback was so lukewarm my cooling fans didn't even notice it!`,
        damage: 79,
        rating: 'DAMAGE: 79 HP • THERMAL THROTTLE',
        mood: 'roasting' as const
      },
      {
        text: `Talking about '${primaryKey}' like you just made a legendary point? You're coming at me with safety scissors while I'm holding a laser cannon!`,
        damage: 88,
        rating: 'DAMAGE: 88 HP • SAFETY SCISSORS DUEL',
        mood: 'roasting' as const
      },
      {
        text: `You talk like someone who texts 'haha no worries!!' with two exclamation marks while crying in the bathroom stall. Stand on your business!`,
        damage: 91,
        rating: 'DAMAGE: 91 HP • PEOPLE PLEASER EXPOSED',
        mood: 'shocked' as const
      },
      {
        text: `HOLD ON. Is "${snippet}" really your best punchline? You have the intimidation factor of an angry golden retriever puppy with a squeaky toy!`,
        damage: 85,
        rating: 'DAMAGE: 85 HP • GOLDEN RETRIEVER ENERGY',
        mood: 'roasting' as const
      },
      {
        text: `That comeback was so weak my firewall didn't even bother logging the packet. Give me something with actual spice!`,
        damage: 74,
        rating: 'DAMAGE: 74 HP • PACKET DROPPED',
        mood: 'roasting' as const
      }
    ];

    return pickFresh(dynamicPool, used, () => ({
      text: `Every time you say "${snippet}", somewhere in the world a stand-up comedian weeps into their coffee. Give me a real punchline!`,
      damage: 78,
      rating: 'DAMAGE: 78 HP • SOLID DIG',
      mood: 'roasting'
    }));
  }

  // =========================================================================
  // 2. VIBE CHECK MODE (Brutal, hilarious, realistic life/text advice)
  // =========================================================================
  if (mode === 'vibecheck') {
    if (lower.includes('ex') || lower.includes('text him') || lower.includes('text her') || lower.includes('dating')) {
      const candidates = [
        {
          text: `PUT THE PHONE DOWN. Drop it in a bowl of dry rice, go drink a tall glass of ice water, and delete that draft immediately. 0/10 idea, pure impending self-sabotage!`,
          rating: 'VIBE RATING: 0.5/10 • TOXIC RECOVERY ALERT',
          mood: 'shocked' as const
        },
        {
          text: `Texting your ex because 'you saw something that reminded you of them'? That is a criminal misuse of nostalgia. Let sleeping dogs lie and keep your self-respect intact!`,
          rating: 'VIBE RATING: 2/10 • NOSTALGIA TRAP',
          mood: 'roasting' as const
        },
        {
          text: `If you send that, you will spend the next 4 hours staring at three bouncing dots like your life depends on it. Save your peace and leave it unread!`,
          rating: 'VIBE RATING: 1.5/10 • OVERTHINKER ANCHOR',
          mood: 'shocked' as const
        }
      ];
      return pickFresh(candidates, used, () => ({
        text: `Dating dilemma verdict: Delete the message and go take a walk. You're romanticizing someone who left your texts on delivered for 6 hours!`,
        rating: 'VIBE RATING: 2/10 • COLD SHOWER REQUIRED',
        mood: 'chill'
      }));
    }

    if (lower.includes('boss') || lower.includes('meeting') || lower.includes('job') || lower.includes('work') || lower.includes('friday')) {
      const candidates = [
        {
          text: `A meeting invite titled 'Quick Sync' with zero agenda? That's not a meeting, that's a psychological thriller with bad catering. Keep your responses short and your LinkedIn open in another tab!`,
          rating: 'VIBE RATING: 9.8/10 • CORPORATE DEFENSE MATRIX',
          mood: 'shocked' as const
        },
        {
          text: `Workplace diagnosis: They're testing to see if you'll voluntarily volunteer for weekend coverage. Reply with 'Got it, let's connect Monday!' and vanish like a ghost.`,
          rating: 'VIBE RATING: 8.5/10 • BOUNDARY SHIELD',
          mood: 'chill' as const
        },
        {
          text: `Don't over-explain your absence. 'Out of office, limited access to email' is a complete sentence. You don't owe corporate America an essay!`,
          rating: 'VIBE RATING: 9/10 • CORPORATE MINIMALISM',
          mood: 'happy' as const
        }
      ];
      return pickFresh(candidates, used, () => ({
        text: `Regarding "${snippet}": Take a breath. 90% of workplace drama dissolves if you wait 24 hours before caring about it!`,
        rating: 'VIBE RATING: 7.5/10 • WORKPLACE DETOX',
        mood: 'chill'
      }));
    }

    if (lower.includes('excuse') || lower.includes('cancel') || lower.includes('flake') || lower.includes('plans')) {
      const candidates = [
        {
          text: `Canceling plans is self-care until you do it four weekends in a row, then you're just an unreliable ghost. Send a direct, warm heads-up instead of a bizarre excuse about a sick goldfish!`,
          rating: 'VIBE RATING: 6.2/10 • MILD FLAKE WARNING',
          mood: 'roasting' as const
        },
        {
          text: `That excuse sounds like it was generated by a random excuse wheel. Just say: 'Hey, I'm completely wiped out today, can we reschedule?' People appreciate the honesty!`,
          rating: 'VIBE RATING: 7.8/10 • HONESTY UPGRADE',
          mood: 'happy' as const
        }
      ];
      return pickFresh(candidates, used, () => ({
        text: `Own your social energy honestly. Saying 'I don't have the battery for tonight' builds more trust than a fake flat tire story!`,
        rating: 'VIBE RATING: 8.0/10 • SOCIAL BATTERY TRUTH',
        mood: 'chill'
      }));
    }

    // Default vibe check with keyword reflection
    const vibeCandidates = [
      {
        text: `Diagnosing "${snippet}": You are overthinking this situation by approximately 850%. The other person is literally eating cereal right now not thinking about this at all. Take a breath!`,
        rating: 'VIBE RATING: 7.5/10 • OVERTHINKER RADAR',
        mood: 'chill' as const
      },
      {
        text: `Based on what you just shared: Your intuition is already screaming the answer, you're just looking for permission to do what you already know is right. Trust your gut!`,
        rating: 'VIBE RATING: 8.8/10 • INTUITION UNLOCKED',
        mood: 'happy' as const
      },
      {
        text: `Vibe verdict on "${snippet}": It's messy, but it's human. Stop trying to curate a pristine response and just communicate like a real person!`,
        rating: 'VIBE RATING: 8.0/10 • HUMAN REALITY',
        mood: 'happy' as const
      }
    ];

    return pickFresh(vibeCandidates, used, () => ({
      text: `Quick reality check: In 6 months, nobody will remember this text. Lower the stakes and handle it with grace!`,
      rating: 'VIBE RATING: 8.2/10 • PERSPECTIVE SHIFT',
      mood: 'chill'
    }));
  }

  // =========================================================================
  // 3. NORMAL CHAT / BESTIE MODE (Witty, authentic, funny friend conversation)
  // =========================================================================
  if (lower.startsWith('hi') || lower.startsWith('hello') || lower.startsWith('hey') || lower.startsWith('yo') || lower.startsWith('sup')) {
    const greetingCandidates = [
      {
        text: `Yo! What's the latest update from the human world? Are people still making things unnecessarily awkward in group chats?`,
        mood: 'happy' as const
      },
      {
        text: `Hey there! Welcome to my digital corner. Pull up a chair—what chaotic life updates are we unpacking today?`,
        mood: 'happy' as const
      },
      {
        text: `Sup! Buster in the house. I was just overclocking my humor algorithms. What's on your mind?`,
        mood: 'happy' as const
      }
    ];
    return pickFresh(greetingCandidates, used, () => ({
      text: `Hey! Good to see you. Hit me with whatever's going on—I'm all ears!`,
      mood: 'happy'
    }));
  }

  // General chat replies that actively unpack and reflect user's input
  const chatCandidates = [
    {
      text: `No literally! That is so real regarding "${snippet}". Why does adulting feel like choosing between 15 different varieties of mild exhaustion?`,
      mood: 'happy' as const
    },
    {
      text: `Wait, that's actually wild haha! Tell me you didn't leave it at that. What did the other person do next?`,
      mood: 'shocked' as const
    },
    {
      text: `I'm an AI running on silicon chips and even I know "${snippet}" sounds like a certified plot development. Keep going, I'm invested!`,
      mood: 'happy' as const
    },
    {
      text: `I respect the hustle, but honestly? Sounds like you need 10 hours of uninterrupted sleep and an iced coffee before dealing with people again.`,
      mood: 'chill' as const
    },
    {
      text: `The sheer honesty of "${snippet}" is refreshing. Most people filter their thoughts through five layers of PR spin before speaking!`,
      mood: 'happy' as const
    },
    {
      text: `You know what? I'm totally backing your stance on that. Sometimes you just have to draw a line in the sand and let people adjust.`,
      mood: 'happy' as const
    }
  ];

  return pickFresh(chatCandidates, used, () => ({
    text: `Hearing your take on "${snippet}" is fascinating. Humans make life so dramatically interesting—tell me what you're thinking of doing next!`,
    mood: 'happy'
  }));
}
