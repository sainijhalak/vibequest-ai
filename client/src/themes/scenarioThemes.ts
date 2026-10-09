import { ScenarioThemeId } from '@vibequest/shared';

export interface ThemeDefinition {
  id: ScenarioThemeId;
  name: string;
  environment: string;
  ambientVibe: string;
  tokens: {
    canvas: string;
    surface: string;
    surfaceElevated: string;
    textPrimary: string;
    textSecondary: string;
    accent: string;
    accentGlow: string;
    border: string;
    borderActive: string;
  };
  classes: {
    container: string;
    headerBanner: string;
    characterBubble: string;
    userBubble: string;
    choiceCard: string;
    choiceCardActive: string;
    inputBar: string;
    tagPill: string;
  };
}

export const SCENARIO_THEMES: Record<ScenarioThemeId, ThemeDefinition> = {
  midnight_group_chat: {
    id: 'midnight_group_chat',
    name: 'Midnight Chat',
    environment: '11:42 PM • Dim Bedroom Phone Glow',
    ambientVibe: 'Comic cyan neon pops, late-night texting bubbles',
    tokens: {
      canvas: '#FFFDF0',
      surface: '#FFFFFF',
      surfaceElevated: '#E0F7FA',
      textPrimary: '#000000',
      textSecondary: '#1E293B',
      accent: '#00E5FF',
      accentGlow: 'rgba(0, 229, 255, 0.4)',
      border: '#000000',
      borderActive: '#00E5FF',
    },
    classes: {
      container: 'bg-[#FFFDF0] text-black',
      headerBanner: 'bg-[#FFFDF0] border-b-4 border-black shadow-cartoon',
      characterBubble: 'bg-white text-black border-3 border-black rounded-2xl rounded-bl-none shadow-cartoon font-sans font-medium',
      userBubble: 'bg-comic-cyan text-black border-3 border-black rounded-2xl rounded-br-none shadow-cartoon font-sans font-bold',
      choiceCard: 'bg-white hover:bg-comic-cyan/20 text-black border-3 border-black rounded-2xl shadow-cartoon hover:shadow-cartoon-lg hover:-translate-y-1 active:translate-y-0 transition-all cursor-pointer',
      choiceCardActive: 'border-3 border-black bg-comic-cyan/30 shadow-cartoon-lg',
      inputBar: 'bg-white border-3 border-black focus-within:border-comic-cyan rounded-2xl',
      tagPill: 'bg-comic-cyan text-black border-2 border-black font-mono font-black text-xs px-2.5 py-1 rounded-full shadow-cartoon-sm',
    },
  },

  fluorescent_hallway: {
    id: 'fluorescent_hallway',
    name: 'Corporate Corridor',
    environment: '2:15 PM • High-Stakes Office Drama',
    ambientVibe: 'Comic orange warning stamps, sharp workplace tactics',
    tokens: {
      canvas: '#FFFDF0',
      surface: '#FFFFFF',
      surfaceElevated: '#FFF3E0',
      textPrimary: '#000000',
      textSecondary: '#1E293B',
      accent: '#FF6D00',
      accentGlow: 'rgba(255, 109, 0, 0.4)',
      border: '#000000',
      borderActive: '#FF6D00',
    },
    classes: {
      container: 'bg-[#FFFDF0] text-black',
      headerBanner: 'bg-[#FFFDF0] border-b-4 border-black shadow-cartoon',
      characterBubble: 'bg-white text-black border-3 border-black rounded-2xl rounded-bl-none shadow-cartoon font-sans font-medium',
      userBubble: 'bg-comic-orange text-white border-3 border-black rounded-2xl rounded-br-none shadow-cartoon font-sans font-bold',
      choiceCard: 'bg-white hover:bg-comic-orange/20 text-black border-3 border-black rounded-2xl shadow-cartoon hover:shadow-cartoon-lg hover:-translate-y-1 active:translate-y-0 transition-all cursor-pointer',
      choiceCardActive: 'border-3 border-black bg-comic-orange/30 shadow-cartoon-lg',
      inputBar: 'bg-white border-3 border-black focus-within:border-comic-orange rounded-2xl',
      tagPill: 'bg-comic-orange text-white border-2 border-black font-mono font-black text-xs px-2.5 py-1 rounded-full shadow-cartoon-sm',
    },
  },

  cafe_golden_hour: {
    id: 'cafe_golden_hour',
    name: 'Golden Hour Café',
    environment: '5:30 PM • Warm Espresso & Amber Lamp',
    ambientVibe: 'Comic warm yellow sparks, playful coffee shop banter',
    tokens: {
      canvas: '#FFFDF0',
      surface: '#FFFFFF',
      surfaceElevated: '#FFFDE7',
      textPrimary: '#000000',
      textSecondary: '#1E293B',
      accent: '#FFE600',
      accentGlow: 'rgba(255, 230, 0, 0.4)',
      border: '#000000',
      borderActive: '#FFE600',
    },
    classes: {
      container: 'bg-[#FFFDF0] text-black',
      headerBanner: 'bg-[#FFFDF0] border-b-4 border-black shadow-cartoon',
      characterBubble: 'bg-white text-black border-3 border-black rounded-2xl rounded-bl-none shadow-cartoon font-sans font-medium',
      userBubble: 'bg-comic-yellow text-black border-3 border-black rounded-2xl rounded-br-none shadow-cartoon font-sans font-bold',
      choiceCard: 'bg-white hover:bg-comic-yellow/30 text-black border-3 border-black rounded-2xl shadow-cartoon hover:shadow-cartoon-lg hover:-translate-y-1 active:translate-y-0 transition-all cursor-pointer',
      choiceCardActive: 'border-3 border-black bg-comic-yellow/40 shadow-cartoon-lg',
      inputBar: 'bg-white border-3 border-black focus-within:border-comic-yellow rounded-2xl',
      tagPill: 'bg-comic-yellow text-black border-2 border-black font-mono font-black text-xs px-2.5 py-1 rounded-full shadow-cartoon-sm',
    },
  },

  rain_window: {
    id: 'rain_window',
    name: 'Rain-Streaked Glass',
    environment: '8:45 PM • Rainy Evening Reflection',
    ambientVibe: 'Comic mint & green droplets, moody thoughtful pacing',
    tokens: {
      canvas: '#FFFDF0',
      surface: '#FFFFFF',
      surfaceElevated: '#E8F5E9',
      textPrimary: '#000000',
      textSecondary: '#1E293B',
      accent: '#76FF03',
      accentGlow: 'rgba(118, 255, 3, 0.4)',
      border: '#000000',
      borderActive: '#76FF03',
    },
    classes: {
      container: 'bg-[#FFFDF0] text-black',
      headerBanner: 'bg-[#FFFDF0] border-b-4 border-black shadow-cartoon',
      characterBubble: 'bg-white text-black border-3 border-black rounded-2xl rounded-bl-none shadow-cartoon font-sans font-medium',
      userBubble: 'bg-comic-green text-black border-3 border-black rounded-2xl rounded-br-none shadow-cartoon font-sans font-bold',
      choiceCard: 'bg-white hover:bg-comic-green/20 text-black border-3 border-black rounded-2xl shadow-cartoon hover:shadow-cartoon-lg hover:-translate-y-1 active:translate-y-0 transition-all cursor-pointer',
      choiceCardActive: 'border-3 border-black bg-comic-green/30 shadow-cartoon-lg',
      inputBar: 'bg-white border-3 border-black focus-within:border-comic-green rounded-2xl',
      tagPill: 'bg-comic-green text-black border-2 border-black font-mono font-black text-xs px-2.5 py-1 rounded-full shadow-cartoon-sm',
    },
  },

  art_mixer: {
    id: 'art_mixer',
    name: 'Monochrome Gallery',
    environment: '9:15 PM • Vibrant Gallery Reception',
    ambientVibe: 'Comic hot pink punch, stylish snappy energy',
    tokens: {
      canvas: '#FFFDF0',
      surface: '#FFFFFF',
      surfaceElevated: '#FCE4EC',
      textPrimary: '#000000',
      textSecondary: '#1E293B',
      accent: '#FF4081',
      accentGlow: 'rgba(255, 64, 129, 0.4)',
      border: '#000000',
      borderActive: '#FF4081',
    },
    classes: {
      container: 'bg-[#FFFDF0] text-black',
      headerBanner: 'bg-[#FFFDF0] border-b-4 border-black shadow-cartoon',
      characterBubble: 'bg-white text-black border-3 border-black rounded-2xl rounded-bl-none shadow-cartoon font-sans font-medium',
      userBubble: 'bg-comic-pink text-white border-3 border-black rounded-2xl rounded-br-none shadow-cartoon font-sans font-bold',
      choiceCard: 'bg-white hover:bg-comic-pink/20 text-black border-3 border-black rounded-2xl shadow-cartoon hover:shadow-cartoon-lg hover:-translate-y-1 active:translate-y-0 transition-all cursor-pointer',
      choiceCardActive: 'border-3 border-black bg-comic-pink/30 shadow-cartoon-lg',
      inputBar: 'bg-white border-3 border-black focus-within:border-comic-pink rounded-2xl',
      tagPill: 'bg-comic-pink text-white border-2 border-black font-mono font-black text-xs px-2.5 py-1 rounded-full shadow-cartoon-sm',
    },
  },
};

export const getTheme = (themeId?: ScenarioThemeId): ThemeDefinition => {
  if (themeId && SCENARIO_THEMES[themeId]) {
    return SCENARIO_THEMES[themeId];
  }
  return SCENARIO_THEMES.midnight_group_chat;
};
