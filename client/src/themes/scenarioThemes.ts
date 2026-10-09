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
    environment: '11:42 PM • Dim Bedroom Blue Light',
    ambientVibe: 'Subtle notification pulses, late-night phone glow',
    tokens: {
      canvas: '#070D18',
      surface: '#0E1726',
      surfaceElevated: '#172338',
      textPrimary: '#F1F5F9',
      textSecondary: '#94A3B8',
      accent: '#38BDF8',
      accentGlow: 'rgba(56, 189, 248, 0.25)',
      border: '#1E293B',
      borderActive: '#38BDF8',
    },
    classes: {
      container: 'bg-[#070D18] text-[#F1F5F9]',
      headerBanner: 'bg-[#0E1726]/90 border-b border-[#1E293B] shadow-[0_4px_24px_rgba(7,13,24,0.6)]',
      characterBubble: 'bg-[#0E1726] border border-[#1E293B] text-[#F1F5F9] rounded-2xl rounded-bl-sm shadow-[0_2px_12px_rgba(0,0,0,0.35)]',
      userBubble: 'bg-[#172554] border border-[#2563EB]/40 text-[#F8FAFC] rounded-2xl rounded-br-sm shadow-[0_0_16px_rgba(37,99,235,0.2)]',
      choiceCard: 'bg-[#0E1726]/80 hover:bg-[#142035] border-[#1E293B] hover:border-[#38BDF8]/60 shadow-[0_2px_8px_rgba(0,0,0,0.25)]',
      choiceCardActive: 'border-[#38BDF8] bg-[#142035] ring-1 ring-[#38BDF8]/40',
      inputBar: 'bg-[#0E1726] border-[#1E293B] focus-within:border-[#38BDF8] focus-within:shadow-[0_0_15px_rgba(56,189,248,0.2)]',
      tagPill: 'bg-[#0E1726] text-[#38BDF8] border border-[#38BDF8]/30',
    },
  },

  fluorescent_hallway: {
    id: 'fluorescent_hallway',
    name: 'Corporate Corridor',
    environment: '2:15 PM • Cold Overhead Fluorescents',
    ambientVibe: 'Stark linear rules, sterile precision, blueprint tension',
    tokens: {
      canvas: '#101216',
      surface: '#171B22',
      surfaceElevated: '#212631',
      textPrimary: '#F3F4F6',
      textSecondary: '#9CA3AF',
      accent: '#F97316',
      accentGlow: 'rgba(249, 115, 22, 0.25)',
      border: '#374151',
      borderActive: '#F97316',
    },
    classes: {
      container: 'bg-[#101216] text-[#F3F4F6]',
      headerBanner: 'bg-[#171B22] border-b-2 border-[#374151] shadow-[0_2px_10px_rgba(0,0,0,0.4)]',
      characterBubble: 'bg-[#171B22] border-l-4 border-l-[#F97316] border-y border-r border-[#374151] text-[#F3F4F6] rounded-none shadow-none',
      userBubble: 'bg-[#212631] border-r-4 border-r-[#F97316] border-y border-l border-[#374151] text-[#F9FAFB] rounded-none shadow-none',
      choiceCard: 'bg-[#171B22] hover:bg-[#212631] border-[#374151] hover:border-[#F97316] rounded-none',
      choiceCardActive: 'border-[#F97316] bg-[#212631] ring-1 ring-[#F97316]/50 rounded-none',
      inputBar: 'bg-[#171B22] border-[#374151] focus-within:border-[#F97316] rounded-none',
      tagPill: 'bg-[#171B22] text-[#F97316] border border-[#F97316]/40 uppercase tracking-wider text-[11px] rounded-none',
    },
  },

  cafe_golden_hour: {
    id: 'cafe_golden_hour',
    name: 'Golden Hour Café',
    environment: '5:30 PM • Warm Espresso & Amber Lamp',
    ambientVibe: 'Soft paper ticket cards, acoustic calm, warm aromatic glow',
    tokens: {
      canvas: '#15100B',
      surface: '#201811',
      surfaceElevated: '#2C2017',
      textPrimary: '#FAF5EF',
      textSecondary: '#D4C3B3',
      accent: '#E5A93B',
      accentGlow: 'rgba(229, 169, 59, 0.28)',
      border: '#3E2F22',
      borderActive: '#E5A93B',
    },
    classes: {
      container: 'bg-[#15100B] text-[#FAF5EF]',
      headerBanner: 'bg-[#201811]/95 border-b border-[#3E2F22] shadow-[0_4px_20px_rgba(21,16,11,0.7)]',
      characterBubble: 'bg-[#201811] border border-[#3E2F22] text-[#FAF5EF] rounded-3xl rounded-bl-md shadow-[0_2px_12px_rgba(0,0,0,0.3)]',
      userBubble: 'bg-[#2C2017] border border-[#E5A93B]/40 text-[#FFFDF8] rounded-3xl rounded-br-md shadow-[0_0_14px_rgba(229,169,59,0.18)]',
      choiceCard: 'bg-[#201811]/90 hover:bg-[#2C2017] border-[#3E2F22] hover:border-[#E5A93B]/70 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.2)]',
      choiceCardActive: 'border-[#E5A93B] bg-[#2C2017] ring-1 ring-[#E5A93B]/50 rounded-2xl',
      inputBar: 'bg-[#201811] border-[#3E2F22] focus-within:border-[#E5A93B] rounded-2xl',
      tagPill: 'bg-[#201811] text-[#E5A93B] border border-[#E5A93B]/40 rounded-full',
    },
  },

  rain_window: {
    id: 'rain_window',
    name: 'Rain-Streaked Glass',
    environment: '8:45 PM • Cold Rain & Amber Streetlamps',
    ambientVibe: 'Moody slate reflections, damp pavements, quiet distance',
    tokens: {
      canvas: '#091117',
      surface: '#111C24',
      surfaceElevated: '#1A2733',
      textPrimary: '#F0FDFA',
      textSecondary: '#94A3B8',
      accent: '#2DD4BF',
      accentGlow: 'rgba(45, 212, 191, 0.25)',
      border: '#1F3342',
      borderActive: '#2DD4BF',
    },
    classes: {
      container: 'bg-[#091117] text-[#F0FDFA]',
      headerBanner: 'bg-[#111C24]/90 border-b border-[#1F3342] shadow-[0_4px_20px_rgba(9,17,23,0.7)]',
      characterBubble: 'bg-[#111C24] border border-[#1F3342] text-[#F0FDFA] rounded-2xl rounded-bl-sm shadow-[0_2px_10px_rgba(0,0,0,0.3)]',
      userBubble: 'bg-[#132A32] border border-[#2DD4BF]/40 text-[#F0FDFA] rounded-2xl rounded-br-sm shadow-[0_0_14px_rgba(45,212,191,0.18)]',
      choiceCard: 'bg-[#111C24]/85 hover:bg-[#1A2733] border-[#1F3342] hover:border-[#2DD4BF]/60 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.25)]',
      choiceCardActive: 'border-[#2DD4BF] bg-[#1A2733] ring-1 ring-[#2DD4BF]/40 rounded-xl',
      inputBar: 'bg-[#111C24] border-[#1F3342] focus-within:border-[#2DD4BF] rounded-xl',
      tagPill: 'bg-[#111C24] text-[#2DD4BF] border border-[#2DD4BF]/30 rounded-lg',
    },
  },

  art_mixer: {
    id: 'art_mixer',
    name: 'Monochrome Gallery',
    environment: '9:15 PM • Minimalist Opening Reception',
    ambientVibe: 'Editorial pitch-black, lacquer rose punch, exhibition plaque accents',
    tokens: {
      canvas: '#0A0A0D',
      surface: '#141418',
      surfaceElevated: '#1E1E24',
      textPrimary: '#FFFFFF',
      textSecondary: '#A1A1AA',
      accent: '#F43F5E',
      accentGlow: 'rgba(244, 63, 94, 0.3)',
      border: '#2E2E38',
      borderActive: '#F43F5E',
    },
    classes: {
      container: 'bg-[#0A0A0D] text-[#FFFFFF]',
      headerBanner: 'bg-[#141418] border-b border-[#2E2E38] shadow-[0_4px_24px_rgba(10,10,13,0.8)]',
      characterBubble: 'bg-[#141418] border-l-2 border-l-[#F43F5E] border-y border-r border-[#2E2E38] text-[#FFFFFF] rounded-none shadow-[2px_2px_0px_#2E2E38]',
      userBubble: 'bg-[#241219] border-r-2 border-r-[#F43F5E] border-y border-l border-[#F43F5E]/40 text-[#FFFFFF] rounded-none shadow-[2px_2px_0px_rgba(244,63,94,0.3)]',
      choiceCard: 'bg-[#141418] hover:bg-[#1E1E24] border border-[#2E2E38] hover:border-[#F43F5E] rounded-none shadow-[3px_3px_0px_#2E2E38]',
      choiceCardActive: 'border-[#F43F5E] bg-[#1E1E24] shadow-[3px_3px_0px_#F43F5E] rounded-none',
      inputBar: 'bg-[#141418] border border-[#2E2E38] focus-within:border-[#F43F5E] rounded-none shadow-[2px_2px_0px_#2E2E38]',
      tagPill: 'bg-[#141418] text-[#F43F5E] border border-[#F43F5E]/50 uppercase tracking-widest text-[10px] rounded-none',
    },
  },
};

export const getTheme = (themeId?: ScenarioThemeId): ThemeDefinition => {
  if (themeId && SCENARIO_THEMES[themeId]) {
    return SCENARIO_THEMES[themeId];
  }
  return SCENARIO_THEMES.midnight_group_chat;
};
