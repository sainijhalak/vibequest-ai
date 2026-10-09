import { ScenarioDefinition } from './index.js';

export const SCENARIOS: ScenarioDefinition[] = [
  // =========================================================================
  // MODE A: SOCIAL SIMULATOR
  // =========================================================================
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
      traits: ['creative', 'overwhelmed', 'apologetic'],
      quirks: {
        typingSpeedMs: 1300,
        emojiHabit: 'Uses 😂 when nervous, bursts of fast casual texts',
        messageStyle: 'Spontaneous and self-deprecating',
        initialMood: 'hesitant',
        initialMoodDesc: 'Nervous about reconnecting after 8 months of silence'
      }
    },
    openingMessage: 'Hey stranger! Remember me? 😂 Honestly was just thinking about that chaotic road trip we took and had to see how you were doing.',
    maxTurns: 3,
    initialChoices: [
      {
        id: 'opt_playful_tease',
        label: 'Playful teasing',
        text: 'Look who decided to resurface from the Bermuda Triangle! 😂 How have you been?',
        impacts: [
          { dimension: 'directness', delta: 1, reason: 'Used playful irony to acknowledge the absence' },
          { dimension: 'conflict_engagement', delta: -1, reason: 'Softened potential friction with humor' }
        ]
      },
      {
        id: 'opt_direct_inquiry',
        label: 'Direct inquiry',
        text: 'Hey Maya. It has been eight months. What prompted the sudden check-in tonight?',
        impacts: [
          { dimension: 'directness', delta: 2, reason: 'Explicitly cited the 8-month timeline and asked for purpose' },
          { dimension: 'boundary_expression', delta: 1, reason: 'Established clear curiosity before warmly re-engaging' }
        ]
      },
      {
        id: 'opt_warm_empathy',
        label: 'Warm reconnection',
        text: 'Hey! Good to see your name pop up. That road trip was iconic. How has life been treating you lately?',
        impacts: [
          { dimension: 'perspective_taking', delta: 2, reason: 'Prioritized relational warmth over past distance' },
          { dimension: 'conflict_engagement', delta: -1, reason: 'Chose immediate ease over addressing absence' }
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
    id: 'forgotten-plan',
    mode: 'social_simulator',
    title: 'The Forgotten Plan',
    tagline: 'Handling the third last-minute dinner cancellation',
    context: 'You booked a table at a favorite ramen spot. You are putting on your coat when Jordan texts you 25 minutes before you meet.',
    character: {
      id: 'jordan',
      name: 'Jordan Rivera',
      role: 'Chronically overcommitted friend',
      bio: 'Ambitious, takes on too much work, hates disappointing people but repeatedly fails at calendar management.',
      avatarSeed: 'jordan',
      accentColor: '#00E599',
      traits: ['workaholic', 'apologetic', 'overextended'],
      quirks: {
        typingSpeedMs: 950,
        emojiHabit: 'Uses 😭 and rushed ellipsis (...) under stress',
        messageStyle: 'Rapid-fire, over-apologetic, frantic calendar anxiety',
        initialMood: 'annoyed',
        initialMoodDesc: 'Stressed by client escalation, dreading letting you down again'
      }
    },
    openingMessage: 'Ugh I am SO sorry... Work just exploded with a client escalation. I am literally stuck at my desk until 9pm. Can we please reschedule for next week? So sorry to do this again 😭',
    maxTurns: 3,
    initialChoices: [
      {
        id: 'opt_jordan_boundary',
        label: 'Address repetitive pattern',
        text: 'I get work happens, Jordan, but this is the third time in a row you have cancelled last-minute. I am already dressed and heading out. It makes me feel like my time is disposable.',
        impacts: [
          { dimension: 'boundary_expression', delta: 2, reason: 'Explicitly named the pattern of cancellation and emotional impact' },
          { dimension: 'directness', delta: 2, reason: 'Unambiguously addressed the behavior without passive-aggressive hinting' }
        ]
      },
      {
        id: 'opt_jordan_space',
        label: 'Cool down & pause',
        text: 'Thanks for letting me know. I am pretty disappointed right now, so let us talk about rescheduling in a couple days when we have clear heads.',
        impacts: [
          { dimension: 'conflict_engagement', delta: -1, reason: 'Took space to cool down rather than reacting in the heat of the moment' },
          { dimension: 'directness', delta: 1, reason: 'Stated disappointment plainly without escalating' }
        ]
      },
      {
        id: 'opt_jordan_brush_off',
        label: 'Accommodate & brush off',
        text: 'No worries at all! Work comes first, do not stress. Just ping me whenever you have free time next week!',
        impacts: [
          { dimension: 'boundary_expression', delta: -2, reason: 'Minimised personal disappointment completely to appease the other party' },
          { dimension: 'perspective_taking', delta: 1, reason: 'Prioritized the other person\'s work stress' }
        ]
      },
      {
        id: 'opt_jordan_pivot',
        label: 'Playful leverage',
        text: 'Bummer, I was really looking forward to that ramen! Take care of the firefight, but next week you are picking the spot and buying the first round. Deal?',
        impacts: [
          { dimension: 'conflict_engagement', delta: 1, reason: 'Constructively reframed frustration into future accountability' },
          { dimension: 'boundary_expression', delta: 1, reason: 'Set a playful condition for future plans' }
        ]
      }
    ]
  },
  {
    id: 'group-chat-dilemma',
    mode: 'social_simulator',
    title: 'The Group Chat Silence',
    tagline: 'When your proposal is left hanging for 5 hours',
    context: 'You suggested dates for a group getaway. Silence for 5 hours. Then Leo drops a meme and everyone instantly reacts with laughing emojis.',
    character: {
      id: 'leo',
      name: 'Leo Chen',
      role: 'Group chat friend',
      bio: 'Casual, easily distracted, loves memes, does not realize when plans get buried.',
      avatarSeed: 'leo',
      accentColor: '#3D465E',
      traits: ['distracted', 'casual', 'humorous'],
      quirks: {
        typingSpeedMs: 750,
        emojiHabit: 'Meme attachments, 😂😂😂 laughs, short punchy texts',
        messageStyle: 'Casual group-chat banter, easily distracted by media',
        initialMood: 'amused',
        initialMoodDesc: 'Distracted by internet memes, unaware logistics got buried'
      }
    },
    openingMessage: '[Leo posted a dog video] 😂😂😂 Literally me every single Monday morning.',
    maxTurns: 3,
    initialChoices: [
      {
        id: 'opt_leo_callout',
        label: 'Humorous callout',
        text: 'The meme is golden Leo, but wow, the cabin suggestion got left in the dust! 😂 Are we doing this or am I booking solo?',
        impacts: [
          { dimension: 'directness', delta: 1, reason: 'Humorously highlighted the overlooked logistical proposal' },
          { dimension: 'conflict_engagement', delta: 1, reason: 'Brought attention back to the plan without hostility' }
        ]
      },
      {
        id: 'opt_leo_direct_poll',
        label: 'Clear deadline check',
        text: 'Hey everyone, need a quick thumbs up/down on the cabin weekend by tomorrow so I can confirm the reservation.',
        impacts: [
          { dimension: 'directness', delta: 2, reason: 'Action-oriented inquiry with a clear boundary deadline' },
          { dimension: 'boundary_expression', delta: 1, reason: 'Protected own time and effort' }
        ]
      },
      {
        id: 'opt_leo_quiet_wait',
        label: 'Let it breathe',
        text: 'Haha accurate meme. Guess everyone is slammed today, I will check in tomorrow.',
        impacts: [
          { dimension: 'conflict_engagement', delta: -1, reason: 'Stepped back to avoid pushing group attention' },
          { dimension: 'directness', delta: -1, reason: 'Withheld original need for confirmation' }
        ]
      }
    ]
  },

  // =========================================================================
  // MODE B: CONFLICT ARENA
  // =========================================================================
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
      traits: ['sharp-tongued', 'defensive', 'socially-competitive'],
      quirks: {
        typingSpeedMs: 1100,
        emojiHabit: 'Uses 😅 and sarcastic shrugs',
        messageStyle: 'Sharp, performative wit; defers responsibility behind "banter"',
        initialMood: 'amused',
        initialMoodDesc: 'Riding high on table laughter, assuming everyone enjoyed the joke'
      }
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
    id: 'credit-taken',
    mode: 'conflict_arena',
    title: 'The Stolen Spotlight',
    tagline: 'When a teammate presents your architecture research as their own',
    context: 'You spent the entire weekend benchmarking migration performance. On a departmental call, Elena introduces the deck saying "I developed this roadmap after spotting the bottleneck."',
    character: {
      id: 'elena',
      name: 'Elena Rostova',
      role: 'Project partner',
      bio: 'High performer, moves fast, image-conscious, gets defensive when challenged on professional ethics.',
      avatarSeed: 'elena',
      accentColor: '#9DA5B4',
      traits: ['ambitious', 'strategic', 'image-conscious'],
      quirks: {
        typingSpeedMs: 1600,
        emojiHabit: 'Zero emojis; impeccably punctuated, structured sentences',
        messageStyle: 'Corporate polish, strategic diplomacy, image preservation',
        initialMood: 'neutral',
        initialMoodDesc: 'Celebrating leadership praise, expecting swift alignment'
      }
    },
    openingMessage: 'Great call! The director seemed really impressed with the direction. We set ourselves up nicely for the quarterly review.',
    maxTurns: 3,
    initialChoices: [
      {
        id: 'opt_elena_objective_callout',
        label: 'Objective credit correction',
        text: 'I am glad leadership liked the direction, Elena. However, in the walkthrough you presented the migration roadmap as your individual initiative. I spent my weekend producing those benchmarks. In tomorrow\'s follow-up notes, I expect us to be properly co-credited.',
        impacts: [
          { dimension: 'boundary_expression', delta: 2, reason: 'Stated concrete factual ownership and specific remedy required' },
          { dimension: 'directness', delta: 2, reason: 'Addressed credit theft with professional clarity' }
        ]
      },
      {
        id: 'opt_elena_curious_inquiry',
        label: 'Benefit of the doubt check',
        text: 'Glad the slides resonated! I noticed during the walkthrough you phrased the benchmarks as your solo initiative. Did that just slip out in the rush, or was that deliberate framing?',
        impacts: [
          { dimension: 'perspective_taking', delta: 1, reason: 'Inquired before assuming malicious intent' },
          { dimension: 'directness', delta: 1, reason: 'Pointed out the discrepancy plainly' }
        ]
      },
      {
        id: 'opt_elena_silent_resentment',
        label: 'Passive compliance',
        text: 'Yeah, sure. Glad the deck worked out.',
        impacts: [
          { dimension: 'boundary_expression', delta: -2, reason: 'Allowed intellectual credit to be appropriated without speaking up' },
          { dimension: 'directness', delta: -2, reason: 'Suppressed genuine grievance behind flat compliance' }
        ]
      }
    ]
  },

  // =========================================================================
  // MODE C: FLIRT LAB (Consenting Adults Only)
  // =========================================================================
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
      traits: ['observant', 'dry-humor', 'attuned'],
      quirks: {
        typingSpeedMs: 1250,
        emojiHabit: 'Parenthetical stage directions [smiles slightly], quiet punctuation',
        messageStyle: 'Thoughtful, observant, dry literary teasing',
        initialMood: 'hesitant',
        initialMoodDesc: 'Testing whether the spark and eye contact are mutual'
      }
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
  },
  {
    id: 'gallery-compliment',
    mode: 'flirt_lab',
    title: 'The Gallery Compliment',
    tagline: 'Responding to subtle attraction at an evening art mixer',
    context: 'You are studying an abstract expressionist oil canvas at a late-night opening. Chloe steps beside you with a glass of wine.',
    character: {
      id: 'chloe',
      name: 'Chloe Monet',
      role: 'Visiting guest curator',
      bio: 'Expressive, values poise, loves intellectual curiosity and playful social chemistry.',
      avatarSeed: 'chloe',
      accentColor: '#FF5C35',
      traits: ['charismatic', 'cultured', 'witty'],
      quirks: {
        typingSpeedMs: 1450,
        emojiHabit: 'Curated vocabulary, expressive phrasing, measured cadence',
        messageStyle: 'Sophisticated, culturally poised, subtle romantic intrigue',
        initialMood: 'warm',
        initialMoodDesc: 'Intrigued by your focus at the gallery, initiating conversation'
      }
    },
    openingMessage: 'You know, you have been staring at that brushwork with more intensity than the artist probably had when painting it. I could not help admiring that kind of focus.',
    maxTurns: 3,
    initialChoices: [
      {
        id: 'opt_chloe_witty_redirect',
        label: 'Witty flirtatious redirect',
        text: 'And here I thought I was being subtle! Maybe I was just trying to look cultured until someone interesting came over to talk to me.',
        impacts: [
          { dimension: 'directness', delta: 2, reason: 'Directly reciprocated romantic attraction and interest' },
          { dimension: 'conflict_engagement', delta: 1, reason: 'Stepped forward into social chemistry' }
        ]
      },
      {
        id: 'opt_chloe_deep_inquiry',
        label: 'Artistic curiosity',
        text: 'Thank you! The brushwork in the upper quadrant caught me off guard. What do you see when you look at it?',
        impacts: [
          { dimension: 'perspective_taking', delta: 2, reason: 'Invited other person\'s perception and taste' },
          { dimension: 'directness', delta: 1, reason: 'Grounded conversation in substantive depth' }
        ]
      },
      {
        id: 'opt_chloe_polite_boundary',
        label: 'Polite boundary',
        text: 'Oh, thank you. Just enjoying some quiet time with the art tonight.',
        impacts: [
          { dimension: 'boundary_expression', delta: 2, reason: 'Politely declined conversational flirtation' },
          { dimension: 'directness', delta: 1, reason: 'Signaled preference for solitude respectfully' }
        ]
      }
    ]
  }
];
