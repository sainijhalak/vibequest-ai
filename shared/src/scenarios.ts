import { ScenarioDefinition } from './index.js';

export const SCENARIOS: ScenarioDefinition[] = [
  // =========================================================================
  // MODE A: SOCIAL SIMULATOR
  // =========================================================================
  {
    id: 'unexpected-message',
    themeId: 'midnight_group_chat',
    mode: 'social_simulator',
    title: 'The Unexpected Message',
    tagline: 'Reconnecting after 8 months of radio silence',
    context: 'Eight months ago, Maya left you on read and dropped off the grid without explanation. It is 11:42 PM on a Tuesday. Your phone lights up on your desk with a notification.',
    character: {
      id: 'maya',
      name: 'Maya Lin',
      role: 'Former close friend',
      bio: 'Spontaneous, creative graphic artist; gets overwhelmed under client stress and retreats into quiet solitude.',
      avatarSeed: 'maya',
      accentColor: '#E5A93B',
      traits: ['creative', 'overwhelmed', 'apologetic'],
      quirks: {
        typingSpeedMs: 1100,
        emojiHabit: 'Uses 😂 when nervous, bursts of fast casual texts',
        messageStyle: 'Spontaneous, emotional, quick to apologize when confronted',
        initialMood: 'hesitant',
        initialMoodDesc: 'Nervous about reconnecting after 8 months of complete silence'
      }
    },
    openingMessage: 'Hey stranger! Remember me? 😂 Honestly was just thinking about that chaotic road trip we took and had to see how you were doing.',
    maxTurns: 5,
    initialChoices: [
      {
        id: 'opt_playful_tease',
        label: 'Playful Irony',
        text: 'Look who decided to resurface from the Bermuda Triangle! 😂 How have you been?',
        impacts: [
          { dimension: 'directness', delta: 1, reason: 'Used playful teasing to acknowledge the unexplained absence' },
          { dimension: 'conflict_engagement', delta: -1, reason: 'Diffused awkwardness with humor rather than pressing' }
        ]
      },
      {
        id: 'opt_direct_inquiry',
        label: 'Unambiguous Inquiry',
        text: 'Hey Maya. It has been eight months of total silence. What prompted the sudden check-in tonight?',
        impacts: [
          { dimension: 'directness', delta: 2, reason: 'Explicitly cited the 8-month timeline and directly asked for purpose' },
          { dimension: 'boundary_expression', delta: 1, reason: 'Established clarity before casually re-engaging' }
        ]
      },
      {
        id: 'opt_warm_empathy',
        label: 'Warm Welcoming Ease',
        text: 'Hey! Good to see your name pop up. That road trip was iconic. How has life been treating you lately?',
        impacts: [
          { dimension: 'perspective_taking', delta: 2, reason: 'Prioritized relational warmth over past distance' },
          { dimension: 'conflict_engagement', delta: -1, reason: 'Chose immediate ease over addressing the ghosting' }
        ]
      },
      {
        id: 'opt_guarded_boundary',
        label: 'Firm Emotional Distance',
        text: 'Hey. Yeah, it has been a long time. Honestly I was pretty hurt when you vanished, so I am cautious about jumping back into small talk.',
        impacts: [
          { dimension: 'boundary_expression', delta: 2, reason: 'Clearly articulated emotional hurt and boundaries' },
          { dimension: 'directness', delta: 2, reason: 'Named feelings plainly without passive aggression' }
        ]
      },
      {
        id: 'opt_calm_inquiry',
        label: 'Curious Check-In',
        text: 'Hey. Was not expecting this text out of nowhere. Are you doing okay? Everything alright on your end?',
        impacts: [
          { dimension: 'perspective_taking', delta: 2, reason: 'Attuned immediately to whether the other person is experiencing a crisis' },
          { dimension: 'conflict_engagement', delta: 1, reason: 'Inquired openly before making assumptions' }
        ]
      }
    ]
  },
  {
    id: 'forgotten-plan',
    themeId: 'rain_window',
    mode: 'social_simulator',
    title: 'The Forgotten Plan',
    tagline: 'Handling the third last-minute dinner cancellation',
    context: 'You booked a table at a favorite ramen spot and have your coat on. Jordan texts you 20 minutes before meeting to cancel for the third time this month.',
    character: {
      id: 'jordan',
      name: 'Jordan Rivera',
      role: 'Chronically overcommitted friend',
      bio: 'Ambitious agency manager; hates disappointing people but habitually says yes to everyone and fails at calendar management.',
      avatarSeed: 'jordan',
      accentColor: '#00E599',
      traits: ['workaholic', 'apologetic', 'overextended'],
      quirks: {
        typingSpeedMs: 950,
        emojiHabit: 'Uses 😭 and rushed ellipsis (...) under stress',
        messageStyle: 'Rapid-fire, over-apologetic, frantic calendar anxiety',
        initialMood: 'annoyed',
        initialMoodDesc: 'Stressed by client escalation, terrified of letting you down again'
      }
    },
    openingMessage: 'Ugh I am SO sorry... Work just exploded with a client escalation. I am literally stuck at my desk until 9pm. Can we please reschedule for next week? So sorry to do this again 😭',
    maxTurns: 5,
    initialChoices: [
      {
        id: 'opt_jordan_boundary',
        label: 'Address Repetitive Pattern',
        text: 'I get work happens, Jordan, but this is the third time in a row you have cancelled last-minute. I am already dressed and heading out. It makes me feel like my time is disposable.',
        impacts: [
          { dimension: 'boundary_expression', delta: 2, reason: 'Explicitly named the pattern of cancellation and emotional impact' },
          { dimension: 'directness', delta: 2, reason: 'Unambiguously addressed the behavior without passive-aggressive hinting' }
        ]
      },
      {
        id: 'opt_jordan_space',
        label: 'Cool Down & Take Space',
        text: 'Thanks for letting me know now instead of when I arrived. I am pretty frustrated, so let us talk about rescheduling later when we both have clear heads.',
        impacts: [
          { dimension: 'conflict_engagement', delta: -1, reason: 'Took space to cool down rather than reacting in the heat of the moment' },
          { dimension: 'directness', delta: 1, reason: 'Stated disappointment plainly without escalating hostility' }
        ]
      },
      {
        id: 'opt_jordan_brush_off',
        label: 'Accommodate & Suppress',
        text: 'No worries at all! Work comes first, do not stress. Just ping me whenever you have free time next week!',
        impacts: [
          { dimension: 'boundary_expression', delta: -2, reason: 'Minimised personal disappointment completely to appease the other party' },
          { dimension: 'perspective_taking', delta: 1, reason: 'Prioritized the other person\'s work stress over personal plans' }
        ]
      },
      {
        id: 'opt_jordan_pivot',
        label: 'Playful Accountability',
        text: 'Bummer, I was really looking forward to that ramen! Go slay the firefight, but next week you are picking the spot and buying the first round. Deal?',
        impacts: [
          { dimension: 'conflict_engagement', delta: 1, reason: 'Constructively reframed frustration into future accountability' },
          { dimension: 'boundary_expression', delta: 1, reason: 'Set a playful condition for future plans' }
        ]
      },
      {
        id: 'opt_jordan_inquire_work',
        label: 'Inquire Into Root Cause',
        text: 'Jordan, is your agency running you into the ground? This keeps happening. What is actually going on with your workload lately?',
        impacts: [
          { dimension: 'perspective_taking', delta: 2, reason: 'Inquired into chronic burnout driving the behavior' },
          { dimension: 'directness', delta: 1, reason: 'Addressed the underlying system rather than just dinner' }
        ]
      }
    ]
  },
  {
    id: 'group-chat-dilemma',
    themeId: 'midnight_group_chat',
    mode: 'social_simulator',
    title: 'The Group Chat Silence',
    tagline: 'When your proposal is left hanging for 5 hours',
    context: 'You spent two hours searching cabin rentals for a group trip and posted dates and pricing. 5 hours of total silence follow, until Leo suddenly drops a random dog meme.',
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
    maxTurns: 5,
    initialChoices: [
      {
        id: 'opt_leo_callout',
        label: 'Humorous Callout',
        text: 'The meme is golden Leo, but wow, the cabin suggestion got left in the dust! 😂 Are we doing this trip or am I booking solo?',
        impacts: [
          { dimension: 'directness', delta: 1, reason: 'Humorously highlighted the overlooked logistical proposal' },
          { dimension: 'conflict_engagement', delta: 1, reason: 'Brought attention back to the plan without hostility' }
        ]
      },
      {
        id: 'opt_leo_direct_poll',
        label: 'Clear Action Deadline',
        text: 'Hey everyone, need a quick thumbs up/down on the cabin weekend by tomorrow 5 PM so I can lock in the deposit before we lose it.',
        impacts: [
          { dimension: 'directness', delta: 2, reason: 'Action-oriented inquiry with a clear boundary deadline' },
          { dimension: 'boundary_expression', delta: 1, reason: 'Protected own time and effort' }
        ]
      },
      {
        id: 'opt_leo_quiet_wait',
        label: 'Step Back in Resignation',
        text: 'Haha accurate meme. Guess everyone is slammed today, I will check back later.',
        impacts: [
          { dimension: 'conflict_engagement', delta: -1, reason: 'Stepped back to avoid pushing group attention' },
          { dimension: 'directness', delta: -1, reason: 'Withheld original need for confirmation' }
        ]
      },
      {
        id: 'opt_leo_private_check',
        label: 'Check in Privately',
        text: 'Hey Leo, dropping you a quick DM—is everyone actually down for this cabin or should I drop it?',
        impacts: [
          { dimension: 'perspective_taking', delta: 1, reason: 'Sought one-on-one calibration to read group climate' },
          { dimension: 'conflict_engagement', delta: 1, reason: 'Addressed friction privately' }
        ]
      },
      {
        id: 'opt_leo_playful_shame',
        label: 'Playful Meme Retaliation',
        text: '[Post crickets GIF] Me waiting for anyone to acknowledge the cabin plans after 5 hours of research 🦗',
        impacts: [
          { dimension: 'directness', delta: 1, reason: 'Used visual satire to prompt peer accountability' },
          { dimension: 'boundary_expression', delta: 1, reason: 'Signaled that own effort deserved acknowledgment' }
        ]
      }
    ]
  },

  // =========================================================================
  // MODE B: CONFLICT ARENA
  // =========================================================================
  {
    id: 'boundary-joke',
    themeId: 'fluorescent_hallway',
    mode: 'conflict_arena',
    title: 'The Joke That Crossed the Line',
    tagline: 'Navigating sharp banter in front of mutual friends',
    context: 'At a dinner gathering, Marcus turns your recent startup shutdown into a punchline for the whole table. Several people chuckle awkwardly while looking at you.',
    character: {
      id: 'marcus',
      name: 'Marcus Brody',
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
    maxTurns: 5,
    initialChoices: [
      {
        id: 'opt_firm_boundary',
        label: 'Quiet, Unshakable Limit',
        text: 'Marcus, I can take a roast, but turning my team losing their jobs into dinner entertainment crossed a line. Do not do that again.',
        impacts: [
          { dimension: 'boundary_expression', delta: 2, reason: 'Set explicit limit without escalating insults' },
          { dimension: 'directness', delta: 2, reason: 'Clearly articulated what was unacceptable' }
        ]
      },
      {
        id: 'opt_pull_aside',
        label: 'Step Aside Privately',
        text: 'Hey, let us step outside for two minutes. I want to talk to you about that without an audience watching us.',
        impacts: [
          { dimension: 'conflict_engagement', delta: 2, reason: 'Proactively addressed conflict while minimizing defensive spectacle' },
          { dimension: 'perspective_taking', delta: 1, reason: 'Allowed counterpart to save face privately' }
        ]
      },
      {
        id: 'opt_clap_back',
        label: 'Public Sharp Counter',
        text: 'Bold roast coming from someone whose biggest career accomplishment this year was color-coding their spreadsheet, Marcus.',
        impacts: [
          { dimension: 'conflict_engagement', delta: 2, reason: 'Directly escalated confrontation' },
          { dimension: 'boundary_expression', delta: 1, reason: 'Retaliated publicly to restore social equilibrium' }
        ]
      },
      {
        id: 'opt_brush_off',
        label: 'Laugh It Off & Deflect',
        text: 'Haha yeah yeah, very funny. You owe me a drink for that one.',
        impacts: [
          { dimension: 'conflict_engagement', delta: -2, reason: 'Deflected conflict to preserve table harmony' },
          { dimension: 'boundary_expression', delta: -2, reason: 'Allowed boundary violation without challenge' }
        ]
      },
      {
        id: 'opt_cold_silence',
        label: 'Uncomfortable Truth Naming',
        text: 'If that was harmless banter, why is everyone at this table suddenly looking at their silverware?',
        impacts: [
          { dimension: 'directness', delta: 2, reason: 'Named the social awkwardness directly' },
          { dimension: 'perspective_taking', delta: 1, reason: 'Highlighted the group impact of the joke' }
        ]
      }
    ]
  },
  {
    id: 'credit-taken',
    themeId: 'fluorescent_hallway',
    mode: 'conflict_arena',
    title: 'The Stolen Spotlight',
    tagline: 'When a teammate presents your architecture research as their own',
    context: 'You spent the entire weekend benchmarking server migration performance. On a departmental call, Elena introduces the deck saying "I developed this architectural roadmap after spotting the bottleneck."',
    character: {
      id: 'elena',
      name: 'Elena Vance',
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
    maxTurns: 5,
    initialChoices: [
      {
        id: 'opt_elena_objective_callout',
        label: 'Objective Credit Correction',
        text: 'I am glad leadership liked the direction, Elena. However, in the walkthrough you presented the migration roadmap as your individual initiative. I spent my weekend producing those benchmarks. In tomorrow\'s follow-up notes, I expect us to be properly co-credited.',
        impacts: [
          { dimension: 'boundary_expression', delta: 2, reason: 'Stated concrete factual ownership and specific remedy required' },
          { dimension: 'directness', delta: 2, reason: 'Addressed credit theft with professional clarity' }
        ]
      },
      {
        id: 'opt_elena_curious_inquiry',
        label: 'Benefit of Doubt Check',
        text: 'Glad the slides resonated! I noticed during the walkthrough you phrased the benchmarks as your solo initiative. Did that just slip out in the rush, or was that deliberate framing?',
        impacts: [
          { dimension: 'perspective_taking', delta: 1, reason: 'Inquired before assuming malicious intent' },
          { dimension: 'directness', delta: 1, reason: 'Pointed out the discrepancy plainly' }
        ]
      },
      {
        id: 'opt_elena_silent_resentment',
        label: 'Passive Compliance',
        text: 'Yeah, sure. Glad the deck worked out.',
        impacts: [
          { dimension: 'boundary_expression', delta: -2, reason: 'Allowed intellectual credit to be appropriated without speaking up' },
          { dimension: 'directness', delta: -2, reason: 'Suppressed genuine grievance behind flat compliance' }
        ]
      },
      {
        id: 'opt_elena_team_norm',
        label: 'Proactive Process Anchor',
        text: 'Going forward Elena, I want us to agree on who presents which sections before client calls so ownership is completely unambiguous.',
        impacts: [
          { dimension: 'conflict_engagement', delta: 1, reason: 'Built structural prevention rather than purely litigating the past' },
          { dimension: 'boundary_expression', delta: 1, reason: 'Asserted structural boundaries for collaboration' }
        ]
      },
      {
        id: 'opt_elena_take_deck',
        label: 'Take Lead on Documentation',
        text: 'Since I ran the underlying benchmarking scripts, I will write the executive recap email and CC the director with the detailed methodology.',
        impacts: [
          { dimension: 'directness', delta: 2, reason: 'Took back narrative control through immediate action' },
          { dimension: 'boundary_expression', delta: 2, reason: 'Protected professional visibility' }
        ]
      }
    ]
  },

  // =========================================================================
  // MODE C: FLIRT LAB (Consenting Adults Only)
  // =========================================================================
  {
    id: 'cafe-spark',
    themeId: 'cafe_golden_hour',
    mode: 'flirt_lab',
    title: 'The Coffee Shop Serendipity',
    tagline: 'Navigating mutual attraction & banter between consenting adults',
    context: 'At a rainy indie café, Sam looks up from reading an annotated copy of your favorite obscure novel. Your eyes meet across the wooden table.',
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
    maxTurns: 5,
    initialChoices: [
      {
        id: 'opt_book_tease',
        label: 'Playful Literary Banter',
        text: 'Never! Just checking if you reached chapter 12 yet, because your reaction to that plot twist will tell me everything I need to know.',
        impacts: [
          { dimension: 'directness', delta: 1, reason: 'Engaged naturally with insider shared curiosity' },
          { dimension: 'perspective_taking', delta: 1, reason: 'Attuned to what the other person was reading' }
        ]
      },
      {
        id: 'opt_direct_introduction',
        label: 'Direct & Grounded Introduction',
        text: 'Haha not at all. Honestly, it is just rare to see someone reading that exact translation. I had to smile. I am [User], by the way.',
        impacts: [
          { dimension: 'directness', delta: 2, reason: 'Introduced self openly without hiding intent' },
          { dimension: 'perspective_taking', delta: 1, reason: 'Honest appreciation of their taste' }
        ]
      },
      {
        id: 'opt_shy_apology',
        label: 'Modest Respectful Retreat',
        text: 'Oh sorry! Caught me staring. That book is just one of my favorites of all time and I got excited. Did not mean to interrupt your peace!',
        impacts: [
          { dimension: 'boundary_expression', delta: 1, reason: 'Respectful of other person\'s quiet bubble' },
          { dimension: 'directness', delta: 1, reason: 'Sincere vulnerability' }
        ]
      },
      {
        id: 'opt_bold_coffee_invite',
        label: 'Bold Invitation to Sit',
        text: 'I am actually judging your drink choice. Mind if I sit across from you and defend the author\'s controversial ending over a fresh espresso?',
        impacts: [
          { dimension: 'directness', delta: 2, reason: 'Took immediate proactive social risk' },
          { dimension: 'conflict_engagement', delta: 1, reason: 'Directly stepped forward into romantic chemistry' }
        ]
      },
      {
        id: 'opt_witty_critique',
        label: 'Intellectual Sparring',
        text: 'I only judge people who skip the footnotes in that edition. Did you read the translator\'s preface or are you a reckless reader?',
        impacts: [
          { dimension: 'perspective_taking', delta: 2, reason: 'Invited their intellectual passion' },
          { dimension: 'directness', delta: 1, reason: 'Playful intellectual challenge' }
        ]
      }
    ]
  },
  {
    id: 'gallery-compliment',
    themeId: 'art_mixer',
    mode: 'flirt_lab',
    title: 'The Gallery Compliment',
    tagline: 'Responding to subtle attraction at an evening art mixer',
    context: 'You are studying an abstract expressionist oil canvas at a late-night opening. Chloe steps beside you holding a glass of sparkling water.',
    character: {
      id: 'chloe',
      name: 'Chloe Moreau',
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
    openingMessage: 'You know, you have been studying that brushwork with more intensity than the artist probably had when painting it. I could not help admiring that kind of focus.',
    maxTurns: 5,
    initialChoices: [
      {
        id: 'opt_chloe_witty_redirect',
        label: 'Witty Flirtatious Redirect',
        text: 'And here I thought I was being subtle! Maybe I was just trying to look cultured until someone interesting came over to talk to me.',
        impacts: [
          { dimension: 'directness', delta: 2, reason: 'Directly reciprocated romantic attraction and interest' },
          { dimension: 'conflict_engagement', delta: 1, reason: 'Stepped forward into social chemistry' }
        ]
      },
      {
        id: 'opt_chloe_deep_inquiry',
        label: 'Artistic Curiosity',
        text: 'Thank you! The brushwork in the upper quadrant caught me off guard. What do you see when you look at it?',
        impacts: [
          { dimension: 'perspective_taking', delta: 2, reason: 'Invited other person\'s perception and taste' },
          { dimension: 'directness', delta: 1, reason: 'Grounded conversation in substantive depth' }
        ]
      },
      {
        id: 'opt_chloe_polite_boundary',
        label: 'Polite Boundary Setting',
        text: 'Oh, thank you. Just enjoying some quiet time with the art tonight.',
        impacts: [
          { dimension: 'boundary_expression', delta: 2, reason: 'Politely declined conversational flirtation' },
          { dimension: 'directness', delta: 1, reason: 'Signaled preference for solitude respectfully' }
        ]
      },
      {
        id: 'opt_chloe_curator_challenge',
        label: 'Playful Curator Challenge',
        text: 'You sound like someone who knows the curator personally—or someone who is about to tell me this entire series was painted in a fever dream.',
        impacts: [
          { dimension: 'perspective_taking', delta: 1, reason: 'Recognized professional presence' },
          { dimension: 'directness', delta: 1, reason: 'Playful rapport building' }
        ]
      },
      {
        id: 'opt_chloe_reception_mingle',
        label: 'Direct Social Connection',
        text: 'Focus is easy when the company is good. I am [User]. What is your favorite piece in this room so far?',
        impacts: [
          { dimension: 'directness', delta: 2, reason: 'Direct self-introduction with reciprocal engagement' },
          { dimension: 'perspective_taking', delta: 2, reason: 'Genuinely inquired into their aesthetic perspective' }
        ]
      }
    ]
  }
];
