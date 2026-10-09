import React from 'react';

interface SceneIllustrationProps {
  scenarioId: string;
  themeId?: string;
  className?: string;
}

export const SceneIllustration: React.FC<SceneIllustrationProps> = ({
  scenarioId,
  themeId = 'midnight_group_chat',
  className = ''
}) => {
  const renderIllustration = () => {
    switch (scenarioId) {
      case 'unexpected-message':
        return (
          <svg
            viewBox="0 0 600 180"
            className="w-full h-full object-cover"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="nightSky" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#060A14" />
                <stop offset="100%" stopColor="#101B2E" />
              </linearGradient>
              <linearGradient id="phoneGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#818CF8" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            {/* Background night sky */}
            <rect width="600" height="180" fill="url(#nightSky)" />

            {/* City window silhouette */}
            <rect x="360" y="20" width="200" height="130" rx="4" fill="#09101C" stroke="#1E293B" strokeWidth="2" />
            <line x1="460" y1="20" x2="460" y2="150" stroke="#1E293B" strokeWidth="2" />
            <line x1="360" y1="85" x2="560" y2="85" stroke="#1E293B" strokeWidth="2" />

            {/* Distant skyline buildings */}
            <rect x="380" y="70" width="25" height="78" fill="#141E30" />
            <rect x="415" y="50" width="30" height="98" fill="#182438" />
            <rect x="470" y="60" width="35" height="88" fill="#141E30" />
            <rect x="515" y="80" width="30" height="68" fill="#182438" />

            {/* Distant building window lights */}
            <circle cx="425" cy="65" r="1.5" fill="#E5A93B" opacity="0.8" />
            <circle cx="433" cy="80" r="1.5" fill="#E5A93B" opacity="0.6" />
            <circle cx="485" cy="75" r="1.5" fill="#38BDF8" opacity="0.7" />
            <circle cx="492" cy="95" r="1.5" fill="#E5A93B" opacity="0.8" />

            {/* Crescent moon & night clouds */}
            <path d="M530 40 a12 12 0 1 0 10 16 a10 10 0 1 1 -10 -16" fill="#F1F5F9" opacity="0.75" />

            {/* Window blinds shadow lines */}
            <line x1="360" y1="35" x2="560" y2="35" stroke="#060A14" strokeWidth="1.5" opacity="0.6" />
            <line x1="360" y1="50" x2="560" y2="50" stroke="#060A14" strokeWidth="1.5" opacity="0.6" />
            <line x1="360" y1="65" x2="560" y2="65" stroke="#060A14" strokeWidth="1.5" opacity="0.6" />
            <line x1="360" y1="100" x2="560" y2="100" stroke="#060A14" strokeWidth="1.5" opacity="0.6" />
            <line x1="360" y1="115" x2="560" y2="115" stroke="#060A14" strokeWidth="1.5" opacity="0.6" />
            <line x1="360" y1="130" x2="560" y2="130" stroke="#060A14" strokeWidth="1.5" opacity="0.6" />

            {/* Desk foreground */}
            <rect x="0" y="140" width="600" height="40" fill="#0C1422" stroke="#1E293B" strokeWidth="1" />
            <line x1="0" y1="140" x2="600" y2="140" stroke="#334155" strokeWidth="1.5" />

            {/* Glowing smartphone on desk */}
            <rect x="110" y="105" width="85" height="52" rx="6" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5" transform="rotate(-6 150 130)" />
            <rect x="114" y="109" width="77" height="44" rx="4" fill="url(#phoneGlow)" transform="rotate(-6 150 130)" />
            {/* Phone notification card */}
            <rect x="122" y="120" width="60" height="18" rx="3" fill="#0F172A" opacity="0.9" transform="rotate(-6 150 130)" />
            <circle cx="130" cy="129" r="4" fill="#E5A93B" transform="rotate(-6 150 130)" />
            <line x1="138" y1="126" x2="175" y2="126" stroke="#F1F5F9" strokeWidth="2" strokeLinecap="round" transform="rotate(-6 150 130)" />
            <line x1="138" y1="132" x2="165" y2="132" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" transform="rotate(-6 150 130)" />

            {/* Ambient phone light cone */}
            <polygon points="120,105 180,100 230,20 80,40" fill="#38BDF8" opacity="0.08" />

            {/* Ceramic coffee mug with steam */}
            <rect x="235" y="118" width="28" height="30" rx="3" fill="#1E293B" stroke="#334155" strokeWidth="1.5" />
            <path d="M263 124 c6 0 6 12 0 12" fill="none" stroke="#334155" strokeWidth="2" />
            <path d="M245 110 q3 -8 -2 -14" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />

            {/* Scene timestamp pill */}
            <rect x="30" y="24" width="110" height="24" rx="12" fill="#0E1726" stroke="#1E293B" strokeWidth="1" />
            <circle cx="44" cy="36" r="3" fill="#38BDF8" />
            <text x="56" y="40" fill="#94A3B8" fontSize="11" fontFamily="JetBrains Mono, monospace" fontWeight="500">11:42 PM</text>
          </svg>
        );

      case 'forgotten-plan':
        return (
          <svg
            viewBox="0 0 600 180"
            className="w-full h-full object-cover"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="rainBg" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#081017" />
                <stop offset="100%" stopColor="#12202C" />
              </linearGradient>
            </defs>
            <rect width="600" height="180" fill="url(#rainBg)" />

            {/* Rain streaks background */}
            <g stroke="#2DD4BF" strokeWidth="1.2" opacity="0.25" strokeLinecap="round">
              <line x1="40" y1="10" x2="25" y2="70" />
              <line x1="120" y1="20" x2="105" y2="80" />
              <line x1="190" y1="5" x2="175" y2="65" />
              <line x1="280" y1="30" x2="265" y2="90" />
              <line x1="370" y1="15" x2="355" y2="75" />
              <line x1="460" y1="25" x2="445" y2="85" />
              <line x1="530" y1="10" x2="515" y2="70" />
              <line x1="90" y1="90" x2="75" y2="150" />
              <line x1="220" y1="85" x2="205" y2="145" />
              <line x1="330" y1="95" x2="315" y2="155" />
              <line x1="490" y1="90" x2="475" y2="150" />
            </g>

            {/* Blurred streetlamp bokeh circles */}
            <circle cx="140" cy="55" r="32" fill="#E5A93B" opacity="0.12" />
            <circle cx="140" cy="55" r="14" fill="#E5A93B" opacity="0.25" />
            <circle cx="430" cy="65" r="40" fill="#2DD4BF" opacity="0.1" />
            <circle cx="430" cy="65" r="18" fill="#2DD4BF" opacity="0.2" />

            {/* Empty reserved restaurant table */}
            <ellipse cx="300" cy="145" rx="140" ry="28" fill="#152431" stroke="#253D4E" strokeWidth="2" />
            {/* Table edge reflection */}
            <ellipse cx="300" cy="148" rx="138" ry="26" fill="none" stroke="#2DD4BF" strokeWidth="1" opacity="0.3" />

            {/* Empty wine glass */}
            <path d="M260 120 l-8 -18 h16 z" fill="#1C3040" stroke="#2DD4BF" strokeWidth="1.2" opacity="0.7" />
            <line x1="260" y1="120" x2="260" y2="132" stroke="#2DD4BF" strokeWidth="1.5" opacity="0.7" />
            <ellipse cx="260" cy="132" rx="7" ry="2.5" fill="#2DD4BF" opacity="0.5" />

            {/* Flickering candle in glass holder */}
            <rect x="330" y="112" width="16" height="22" rx="2" fill="#1A2D3C" stroke="#E5A93B" strokeWidth="1.2" />
            <ellipse cx="338" cy="108" rx="3.5" ry="5.5" fill="#E5A93B" />
            <circle cx="338" cy="108" r="18" fill="#E5A93B" opacity="0.18" />

            {/* "Reserved for 2" table sign */}
            <polygon points="288,126 312,126 316,138 284,138" fill="#0B131B" stroke="#94A3B8" strokeWidth="1" />
            <line x1="292" y1="131" x2="308" y2="131" stroke="#E5A93B" strokeWidth="1.5" />

            {/* Status tag */}
            <rect x="30" y="24" width="130" height="24" rx="12" fill="#111C24" stroke="#1F3342" strokeWidth="1" />
            <circle cx="44" cy="36" r="3" fill="#2DD4BF" />
            <text x="56" y="40" fill="#94A3B8" fontSize="11" fontFamily="JetBrains Mono, monospace">TABLE RESERVED</text>
          </svg>
        );

      case 'group-chat-dilemma':
        return (
          <svg
            viewBox="0 0 600 180"
            className="w-full h-full object-cover"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="600" height="180" fill="#080E1A" />

            {/* Grid pattern background */}
            <pattern id="chatGrid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#172338" strokeWidth="0.8" />
            </pattern>
            <rect width="600" height="180" fill="url(#chatGrid)" opacity="0.7" />

            {/* Vacation cabin map on table */}
            <polygon points="120,40 280,30 290,140 110,150" fill="#0F1A2D" stroke="#1E2F4A" strokeWidth="1.5" />
            {/* Topographic contour lines */}
            <path d="M140 70 q40 -20 80 0 t50 20" fill="none" stroke="#38BDF8" strokeWidth="1" opacity="0.4" />
            <path d="M135 100 q40 -20 80 0 t50 20" fill="none" stroke="#38BDF8" strokeWidth="1" opacity="0.3" />
            {/* Map pin */}
            <circle cx="210" cy="85" r="5" fill="#FF5C35" />
            <polygon points="208,88 212,88 210,98" fill="#FF5C35" />

            {/* Stack of floating unread notifications */}
            <g transform="translate(340, 35)">
              <rect x="0" y="0" width="220" height="38" rx="8" fill="#101C30" stroke="#1E2F4A" strokeWidth="1" />
              <circle cx="22" cy="19" r="8" fill="#38BDF8" opacity="0.2" />
              <circle cx="22" cy="19" r="4" fill="#38BDF8" />
              <text x="40" y="18" fill="#F1F5F9" fontSize="11" fontFamily="Space Grotesk, sans-serif" fontWeight="600">Cabin Rental Itinerary</text>
              <text x="40" y="30" fill="#94A3B8" fontSize="9" fontFamily="JetBrains Mono, monospace">Sent 5h ago • 4 Seen • 0 Replies</text>

              <rect x="15" y="48" width="210" height="36" rx="8" fill="#13233D" stroke="#38BDF8" strokeWidth="1" opacity="0.9" />
              <circle cx="34" cy="66" r="8" fill="#FF5C35" opacity="0.2" />
              <circle cx="34" cy="66" r="4" fill="#FF5C35" />
              <text x="50" y="65" fill="#F1F5F9" fontSize="11" fontFamily="Space Grotesk, sans-serif" fontWeight="600">Leo Chen dropped a meme</text>
              <text x="50" y="77" fill="#38BDF8" fontSize="9" fontFamily="JetBrains Mono, monospace">dog_sitting_in_fire.jpg</text>
            </g>

            {/* Pill badge */}
            <rect x="30" y="24" width="140" height="24" rx="12" fill="#0F1A2D" stroke="#1E2F4A" strokeWidth="1" />
            <circle cx="44" cy="36" r="3" fill="#38BDF8" />
            <text x="56" y="40" fill="#94A3B8" fontSize="11" fontFamily="JetBrains Mono, monospace">5 UNREAD IN CHAT</text>
          </svg>
        );

      case 'boundary-joke':
        return (
          <svg
            viewBox="0 0 600 180"
            className="w-full h-full object-cover"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="600" height="180" fill="#101216" />

            {/* Harsh overhead fluorescent grid */}
            <line x1="80" y1="0" x2="80" y2="180" stroke="#222630" strokeWidth="1" />
            <line x1="220" y1="0" x2="220" y2="180" stroke="#222630" strokeWidth="1" />
            <line x1="380" y1="0" x2="380" y2="180" stroke="#222630" strokeWidth="1" />
            <line x1="520" y1="0" x2="520" y2="180" stroke="#222630" strokeWidth="1" />

            {/* Fluorescent light tubes */}
            <rect x="120" y="10" width="160" height="8" rx="2" fill="#F3F4F6" opacity="0.15" />
            <rect x="340" y="10" width="160" height="8" rx="2" fill="#F3F4F6" opacity="0.15" />
            <polygon points="120,18 280,18 310,120 90,120" fill="#F3F4F6" opacity="0.03" />

            {/* Dinner banquet table silhouette */}
            <rect x="0" y="130" width="600" height="50" fill="#161921" stroke="#374151" strokeWidth="2" />
            <line x1="0" y1="130" x2="600" y2="130" stroke="#F97316" strokeWidth="2" />

            {/* Wine glass knocked / tense silverware placement */}
            <rect x="140" y="112" width="6" height="18" fill="#4B5563" />
            <circle cx="143" cy="110" r="8" fill="#374151" />

            {/* Social tension shockwave ripple */}
            <circle cx="300" cy="120" r="30" fill="none" stroke="#F97316" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5" />
            <circle cx="300" cy="120" r="55" fill="none" stroke="#F97316" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
            <circle cx="300" cy="120" r="80" fill="none" stroke="#F97316" strokeWidth="0.8" opacity="0.15" />

            {/* Awkward silverware resting */}
            <line x1="420" y1="126" x2="455" y2="135" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
            <line x1="465" y1="125" x2="475" y2="136" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />

            {/* Tension tag */}
            <rect x="30" y="24" width="146" height="24" fill="#171B22" stroke="#F97316" strokeWidth="1" />
            <text x="42" y="40" fill="#F97316" fontSize="10" fontFamily="JetBrains Mono, monospace" fontWeight="700">TENSION: ELEVATED</text>
          </svg>
        );

      case 'credit-taken':
        return (
          <svg
            viewBox="0 0 600 180"
            className="w-full h-full object-cover"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="600" height="180" fill="#101216" />

            {/* Projector screen display */}
            <rect x="140" y="20" width="320" height="110" rx="3" fill="#1A1F2B" stroke="#374151" strokeWidth="2" />
            <rect x="150" y="30" width="300" height="90" fill="#111622" />

            {/* Slide title */}
            <text x="165" y="48" fill="#F3F4F6" fontSize="12" fontFamily="Space Grotesk, sans-serif" fontWeight="700">Architecture Migration Roadmap</text>
            <text x="165" y="62" fill="#F97316" fontSize="9" fontFamily="JetBrains Mono, monospace">Lead Architect: Elena Vance</text>

            {/* Slide metrics chart (the user's stolen work) */}
            <path d="M 165 105 L 210 95 L 260 80 L 310 88 L 370 65 L 430 55" fill="none" stroke="#F97316" strokeWidth="2.5" />
            <circle cx="430" cy="55" r="4" fill="#F97316" />
            <line x1="165" y1="110" x2="430" y2="110" stroke="#374151" strokeWidth="1" />

            {/* Laser pointer dot on the chart */}
            <circle cx="370" cy="65" r="3" fill="#FF5C35" />
            <circle cx="370" cy="65" r="8" fill="#FF5C35" opacity="0.3" />

            {/* Corporate conference table */}
            <polygon points="0,180 100,140 500,140 600,180" fill="#161A24" stroke="#374151" strokeWidth="1.5" />
            {/* Laptops on table */}
            <rect x="250" y="145" width="45" height="25" rx="2" fill="#252C3D" stroke="#4B5563" strokeWidth="1" />
            <rect x="360" y="145" width="45" height="25" rx="2" fill="#252C3D" stroke="#4B5563" strokeWidth="1" />

            {/* Corporate tag */}
            <rect x="30" y="24" width="150" height="24" fill="#171B22" stroke="#374151" strokeWidth="1" />
            <text x="42" y="40" fill="#9CA3AF" fontSize="10" fontFamily="JetBrains Mono, monospace" fontWeight="600">DEPARTMENTAL SYNC</text>
          </svg>
        );

      case 'cafe-spark':
        return (
          <svg
            viewBox="0 0 600 180"
            className="w-full h-full object-cover"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <radialGradient id="cafeGlow" cx="50%" cy="30%" r="60%">
                <stop offset="0%" stopColor="#E5A93B" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#15100B" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="600" height="180" fill="#15100B" />
            <rect width="600" height="180" fill="url(#cafeGlow)" />

            {/* Cozy wood café wall paneling */}
            <line x1="100" y1="0" x2="100" y2="180" stroke="#251B12" strokeWidth="1.5" />
            <line x1="220" y1="0" x2="220" y2="180" stroke="#251B12" strokeWidth="1.5" />
            <line x1="380" y1="0" x2="380" y2="180" stroke="#251B12" strokeWidth="1.5" />
            <line x1="500" y1="0" x2="500" y2="180" stroke="#251B12" strokeWidth="1.5" />

            {/* Hanging Edison filament pendant lamp */}
            <line x1="300" y1="0" x2="300" y2="45" stroke="#4A3827" strokeWidth="2" />
            <circle cx="300" cy="52" r="10" fill="#E5A93B" opacity="0.85" />
            <circle cx="300" cy="52" r="28" fill="#E5A93B" opacity="0.15" />
            <path d="M298 48 l4 8 l-4 0 l4 4" fill="none" stroke="#FFFFFF" strokeWidth="1" />

            {/* Wooden café table */}
            <rect x="60" y="125" width="480" height="55" rx="6" fill="#241B13" stroke="#423223" strokeWidth="2" />

            {/* Stack of annotated paperbacks */}
            <rect x="150" y="112" width="75" height="14" rx="2" fill="#3D2B1C" stroke="#E5A93B" strokeWidth="1" />
            <rect x="145" y="98" width="80" height="15" rx="2" fill="#4A3422" stroke="#E5A93B" strokeWidth="1" />
            {/* Ribbon bookmark draped over edge */}
            <path d="M210 100 q-10 15 5 25" fill="none" stroke="#FF5C35" strokeWidth="2" />

            {/* Steaming ceramic latte mug with heart foam art */}
            <rect x="360" y="105" width="34" height="26" rx="4" fill="#FAF5EF" stroke="#4A3827" strokeWidth="1.5" />
            <ellipse cx="377" cy="106" rx="15" ry="4" fill="#C7B299" />
            {/* Handle */}
            <path d="M394 110 c8 0 8 16 0 16" fill="none" stroke="#FAF5EF" strokeWidth="3" />
            {/* Steam curves */}
            <path d="M372 98 q4 -8 -3 -16" fill="none" stroke="#E5A93B" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />
            <path d="M382 95 q-3 -8 4 -16" fill="none" stroke="#E5A93B" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />

            {/* Acoustic mood tag */}
            <rect x="30" y="24" width="134" height="24" rx="12" fill="#201811" stroke="#3E2F22" strokeWidth="1" />
            <circle cx="44" cy="36" r="3" fill="#E5A93B" />
            <text x="56" y="40" fill="#D4C3B3" fontSize="11" fontFamily="Space Grotesk, sans-serif">RAINY CAFÉ NOOK</text>
          </svg>
        );

      case 'gallery-compliment':
        return (
          <svg
            viewBox="0 0 600 180"
            className="w-full h-full object-cover"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="600" height="180" fill="#0A0A0D" />

            {/* Gallery spotlight cones from above */}
            <polygon points="180,0 220,0 320,130 80,130" fill="#FFFFFF" opacity="0.04" />
            <polygon points="420,0 460,0 540,140 340,140" fill="#F43F5E" opacity="0.05" />

            {/* Large framed modern oil canvas */}
            <rect x="150" y="20" width="220" height="105" fill="#141418" stroke="#2E2E38" strokeWidth="3" />
            {/* Inner abstract painting */}
            <rect x="158" y="28" width="204" height="89" fill="#1A1A22" />
            <path d="M165 95 C 200 40, 240 110, 290 50 S 340 70, 355 45" fill="none" stroke="#F43F5E" strokeWidth="5" strokeLinecap="round" />
            <circle cx="280" cy="75" r="18" fill="#F43F5E" opacity="0.4" />
            <rect x="210" y="45" width="35" height="35" transform="rotate(25 225 60)" fill="#A855F7" opacity="0.5" />
            <line x1="170" y1="35" x2="340" y2="105" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.6" />

            {/* Gallery title plaque */}
            <rect x="385" y="65" width="85" height="36" fill="#141418" stroke="#2E2E38" strokeWidth="1" />
            <text x="393" y="78" fill="#FFFFFF" fontSize="9" fontFamily="Space Grotesk, sans-serif" fontWeight="700">UNTITLED NO. 7</text>
            <text x="393" y="90" fill="#A1A1AA" fontSize="8" fontFamily="JetBrains Mono, monospace">Oil on Canvas, 2024</text>

            {/* Polished gallery hardwood floor line */}
            <line x1="0" y1="150" x2="600" y2="150" stroke="#2E2E38" strokeWidth="2" />
            <rect x="0" y="150" width="600" height="30" fill="#0E0E12" />

            {/* Plaque tag */}
            <rect x="30" y="24" width="144" height="24" fill="#141418" stroke="#F43F5E" strokeWidth="1" />
            <text x="42" y="40" fill="#F43F5E" fontSize="10" fontFamily="JetBrains Mono, monospace" fontWeight="700">VERNISSAGE • 9:15 PM</text>
          </svg>
        );

      default:
        return (
          <div className="w-full h-full bg-ink-900 flex items-center justify-center text-paper-300 font-mono text-xs">
            Atmospheric setting
          </div>
        );
    }
  };

  return (
    <div
      aria-hidden="true"
      className={`relative w-full h-32 md:h-40 overflow-hidden border-b transition-all duration-300 ${className}`}
      data-theme={themeId}
    >
      {renderIllustration()}
      {/* Subtle bottom gradient to blend seamlessly into dialogue container */}
      <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#070D18] to-transparent pointer-events-none opacity-80" />
    </div>
  );
};
