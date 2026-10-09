import React from 'react';
import { CharacterMood } from '@vibequest/shared';

interface CharacterAvatarProps {
  seed: string;
  name: string;
  accentColor?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  mood?: CharacterMood;
  showMoodBadge?: boolean;
  className?: string;
}

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
  seed,
  name,
  accentColor = '#FF5C35',
  size = 'md',
  mood = 'neutral',
  showMoodBadge = false,
  className = ''
}) => {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  // Group moods into 3 primary expressive states
  const isPositive = mood === 'amused' || mood === 'warm' || mood === 'relieved';
  const isGuarded = mood === 'annoyed' || mood === 'guarded' || mood === 'hesitant';

  const moodAuraMap: Record<CharacterMood, string> = {
    amused: 'ring-2 ring-comic-yellow shadow-cartoon',
    warm: 'ring-2 ring-comic-green shadow-cartoon',
    annoyed: 'ring-2 ring-comic-pink shadow-cartoon',
    hesitant: 'ring-2 ring-comic-orange shadow-cartoon',
    guarded: 'ring-2 ring-gray-400 shadow-cartoon',
    relieved: 'ring-2 ring-comic-cyan shadow-cartoon',
    neutral: 'ring-2 ring-black shadow-cartoon'
  };

  const moodDotColor: Record<CharacterMood, string> = {
    amused: 'bg-comic-yellow border-2 border-black',
    warm: 'bg-comic-green border-2 border-black',
    annoyed: 'bg-comic-pink border-2 border-black',
    hesitant: 'bg-comic-orange border-2 border-black',
    guarded: 'bg-gray-400 border-2 border-black',
    relieved: 'bg-comic-cyan border-2 border-black',
    neutral: 'bg-white border-2 border-black'
  };

  // Helper for expressive mouth path based on mood
  const renderMouth = (cx: number, cy: number) => {
    if (isPositive) {
      // Warm upturned smile
      return <path d={`M ${cx - 5} ${cy} Q ${cx} ${cy + 4} ${cx + 5} ${cy}`} fill="none" stroke="#FAF5EF" strokeWidth="2" strokeLinecap="round" />;
    }
    if (isGuarded) {
      // Annoyed/skeptical tight line or slight downturn
      return <path d={`M ${cx - 5} ${cy + 2} Q ${cx} ${cy - 1} ${cx + 5} ${cy + 1}`} fill="none" stroke="#FAF5EF" strokeWidth="2" strokeLinecap="round" />;
    }
    // Neutral calm line
    return <line x1={cx - 4} y1={cy + 1} x2={cx + 4} y2={cy + 1} stroke="#FAF5EF" strokeWidth="2" strokeLinecap="round" />;
  };

  // Helper for expressive eyebrows based on mood
  const renderEyebrows = (leftX: number, rightX: number, y: number) => {
    if (isPositive) {
      // Lifted, relaxed arcs
      return (
        <g stroke={accentColor} strokeWidth="1.8" strokeLinecap="round">
          <path d={`M ${leftX - 4} ${y + 1} Q ${leftX} ${y - 3} ${leftX + 4} ${y}`} fill="none" />
          <path d={`M ${rightX - 4} ${y} Q ${rightX} ${y - 3} ${rightX + 4} ${y + 1}`} fill="none" />
        </g>
      );
    }
    if (isGuarded) {
      // Furrowed, sharp angled eyebrows
      return (
        <g stroke="#FF5C35" strokeWidth="2" strokeLinecap="round">
          <line x1={leftX - 4} y1={y - 2} x2={leftX + 4} y2={y + 2} />
          <line x1={rightX - 4} y1={y + 2} x2={rightX + 4} y2={y - 2} />
        </g>
      );
    }
    // Neutral level brows
    return (
      <g stroke={accentColor} strokeWidth="1.8" strokeLinecap="round">
        <line x1={leftX - 4} y1={y} x2={leftX + 4} y2={y} />
        <line x1={rightX - 4} y1={y} x2={rightX + 4} y2={y} />
      </g>
    );
  };

  // Helper for expressive eyes based on mood
  const renderEyes = (leftX: number, rightX: number, y: number) => {
    if (isPositive) {
      // Happy smiling curved eye arcs (^ ^)
      return (
        <g stroke="#FAF5EF" strokeWidth="2" strokeLinecap="round" fill="none">
          <path d={`M ${leftX - 3} ${y + 1} Q ${leftX} ${y - 3} ${leftX + 3} ${y + 1}`} />
          <path d={`M ${rightX - 3} ${y + 1} Q ${rightX} ${y - 3} ${rightX + 3} ${y + 1}`} />
        </g>
      );
    }
    if (isGuarded) {
      // Narrowed, skeptical gaze
      return (
        <g stroke="#FAF5EF" strokeWidth="2" strokeLinecap="round">
          <line x1={leftX - 3} y1={y} x2={leftX + 3} y2={y} />
          <line x1={rightX - 3} y1={y} x2={rightX + 3} y2={y} />
          <circle cx={leftX} cy={y + 1} r="1.2" fill={accentColor} />
          <circle cx={rightX} cy={y + 1} r="1.2" fill={accentColor} />
        </g>
      );
    }
    // Open observant pupils
    return (
      <g fill="#FAF5EF">
        <circle cx={leftX} cy={y} r="2.2" />
        <circle cx={rightX} cy={y} r="2.2" />
        <circle cx={leftX + 0.6} cy={y - 0.6} r="0.8" fill="#141721" />
        <circle cx={rightX + 0.6} cy={y - 0.6} r="0.8" fill="#141721" />
      </g>
    );
  };

  const renderCharacterPortrait = () => {
    const key = seed.toLowerCase();

    switch (key) {
      case 'maya':
        // Maya: creative graphic artist, asymmetrical bob hair, circle glasses
        return (
          <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
            {/* Hair back */}
            <path d="M 12 24 C 12 12, 36 12, 36 24 C 36 32, 38 38, 38 42 L 10 42 C 10 38, 12 32, 12 24 Z" fill="#2A1B14" />
            {/* Face base */}
            <ellipse cx="24" cy="26" rx="10" ry="11" fill="#E8B896" />
            {/* Blush when pleased */}
            {isPositive && (
              <>
                <circle cx="17" cy="28" r="2.5" fill="#FF5C35" opacity="0.3" />
                <circle cx="31" cy="28" r="2.5" fill="#FF5C35" opacity="0.3" />
              </>
            )}
            {/* Eyebrows */}
            {renderEyebrows(19, 29, 21)}
            {/* Glasses wire frames */}
            <circle cx="19" cy="25" r="4.5" stroke="#E5A93B" strokeWidth="1.5" />
            <circle cx="29" cy="25" r="4.5" stroke="#E5A93B" strokeWidth="1.5" />
            <line x1="23.5" y1="25" x2="24.5" y2="25" stroke="#E5A93B" strokeWidth="1.5" />
            {/* Eyes */}
            {renderEyes(19, 29, 25)}
            {/* Nose */}
            <path d="M 24 26 L 23.5 28.5 L 25 28.5" stroke="#C48E6C" strokeWidth="1.2" strokeLinecap="round" />
            {/* Mouth */}
            {renderMouth(24, 32)}
            {/* Hair bangs / front fringe */}
            <path d="M 12 22 Q 22 14 34 20 Q 28 22 18 24 Z" fill="#3D261C" />
            <path d="M 13 22 Q 18 27 15 34" stroke="#3D261C" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        );

      case 'jordan':
        // Jordan: agency manager, sharp crop hair, collar
        return (
          <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
            {/* Hair base */}
            <path d="M 14 20 C 14 10, 34 10, 34 20 L 35 24 L 13 24 Z" fill="#1F2430" />
            {/* Face base */}
            <rect x="15" y="18" width="18" height="20" rx="6" fill="#DDB088" />
            {/* Eyebrows */}
            {renderEyebrows(20, 28, 22)}
            {/* Eyes */}
            {renderEyes(20, 28, 26)}
            {/* Nose */}
            <line x1="24" y1="26" x2="24" y2="29" stroke="#B88A64" strokeWidth="1.5" strokeLinecap="round" />
            {/* Mouth */}
            {renderMouth(24, 33)}
            {/* Collared shirt */}
            <polygon points="17,38 24,42 31,38 34,48 14,48" fill="#1E293B" />
            <polygon points="21,38 24,44 27,38 24,40" fill="#00E599" opacity="0.8" />
          </svg>
        );

      case 'leo':
        // Leo: casual, wavy hair, headphones around neck
        return (
          <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
            {/* Wavy hair */}
            <circle cx="16" cy="18" r="6" fill="#3A302A" />
            <circle cx="24" cy="15" r="7" fill="#3A302A" />
            <circle cx="32" cy="18" r="6" fill="#3A302A" />
            {/* Face */}
            <ellipse cx="24" cy="26" rx="9.5" ry="11" fill="#E2BA96" />
            {/* Eyebrows */}
            {renderEyebrows(19, 29, 21)}
            {/* Eyes */}
            {renderEyes(19, 29, 25)}
            {/* Mouth */}
            {renderMouth(24, 32)}
            {/* Headphones resting on neck */}
            <path d="M 12 36 Q 24 44 36 36" stroke="#38BDF8" strokeWidth="3" fill="none" />
            <rect x="10" y="32" width="5" height="9" rx="2" fill="#1E293B" stroke="#38BDF8" strokeWidth="1" />
            <rect x="33" y="32" width="5" height="9" rx="2" fill="#1E293B" stroke="#38BDF8" strokeWidth="1" />
          </svg>
        );

      case 'marcus':
        // Marcus: angular, slicked hair, sharp jaw
        return (
          <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
            {/* Slicked back dark hair */}
            <path d="M 14 18 C 14 8, 34 8, 34 18 L 35 23 L 13 23 Z" fill="#15171C" />
            {/* Angular face */}
            <polygon points="15,20 33,20 31,36 24,40 17,36" fill="#D6A780" />
            {/* Eyebrows */}
            {renderEyebrows(20, 28, 22)}
            {/* Eyes */}
            {renderEyes(20, 28, 26)}
            {/* Nose */}
            <path d="M 24 25 L 23 29 L 25 29" stroke="#AC7D57" strokeWidth="1.5" strokeLinecap="round" />
            {/* Mouth */}
            {renderMouth(24, 33)}
            {/* Jacket collar */}
            <polygon points="16,40 24,46 32,40 36,48 12,48" fill="#1F2430" />
            <line x1="24" y1="42" x2="24" y2="48" stroke="#FF5C35" strokeWidth="2" />
          </svg>
        );

      case 'elena':
        // Elena: sleek corporate updo, high bun, geometric wire frames
        return (
          <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
            {/* Top knot bun */}
            <circle cx="24" cy="11" r="5" fill="#242124" />
            {/* Sleek hair base */}
            <path d="M 14 20 C 14 12, 34 12, 34 20 L 35 30 L 13 30 Z" fill="#242124" />
            {/* Face */}
            <ellipse cx="24" cy="26" rx="9" ry="11" fill="#E5C2A4" />
            {/* Eyebrows */}
            {renderEyebrows(19, 29, 21)}
            {/* Geometric thin glasses */}
            <rect x="15" y="22" width="7" height="5" rx="1" stroke="#9DA5B4" strokeWidth="1.2" />
            <rect x="26" y="22" width="7" height="5" rx="1" stroke="#9DA5B4" strokeWidth="1.2" />
            <line x1="22" y1="24" x2="26" y2="24" stroke="#9DA5B4" strokeWidth="1.2" />
            {/* Eyes */}
            {renderEyes(18.5, 29.5, 24.5)}
            {/* Nose */}
            <line x1="24" y1="26" x2="24" y2="29" stroke="#C29877" strokeWidth="1.2" strokeLinecap="round" />
            {/* Mouth */}
            {renderMouth(24, 33)}
            {/* Blazer collar */}
            <polygon points="16,39 24,44 32,39 36,48 12,48" fill="#1A1F2C" />
          </svg>
        );

      case 'sam':
        // Sam: soft curls, turtleneck, observant gaze
        return (
          <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
            {/* Curly hair outline */}
            <circle cx="15" cy="16" r="6" fill="#423023" />
            <circle cx="21" cy="13" r="6" fill="#423023" />
            <circle cx="27" cy="13" r="6" fill="#423023" />
            <circle cx="33" cy="16" r="6" fill="#423023" />
            {/* Face */}
            <ellipse cx="24" cy="25" rx="9.5" ry="10.5" fill="#E0B692" />
            {/* Eyebrows */}
            {renderEyebrows(19, 29, 20)}
            {/* Eyes */}
            {renderEyes(19, 29, 24)}
            {/* Nose */}
            <path d="M 24 24 L 23.5 27.5 L 25 27.5" stroke="#BA8C68" strokeWidth="1.2" strokeLinecap="round" />
            {/* Mouth */}
            {renderMouth(24, 31)}
            {/* Ribbed turtleneck collar */}
            <rect x="17" y="36" width="14" height="6" rx="2" fill="#292018" stroke="#4A3827" strokeWidth="1" />
            <polygon points="14,41 34,41 36,48 12,48" fill="#292018" />
          </svg>
        );

      case 'chloe':
        // Chloe: chic Parisian bob, sculptural earring, poised gaze
        return (
          <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
            {/* Bob haircut silhouette */}
            <path d="M 12 24 C 12 11, 36 11, 36 24 C 36 34, 38 38, 38 40 L 10 40 C 10 38, 12 34, 12 24 Z" fill="#18151A" />
            {/* Face */}
            <ellipse cx="24" cy="25" rx="9" ry="10.5" fill="#EAC5A8" />
            {/* Sculptural drop earring */}
            <circle cx="14" cy="30" r="2" fill="#F43F5E" />
            <line x1="14" y1="28" x2="14" y2="30" stroke="#F43F5E" strokeWidth="1.5" />
            {/* Eyebrows */}
            {renderEyebrows(19, 29, 20)}
            {/* Eyes */}
            {renderEyes(19, 29, 24)}
            {/* Nose */}
            <line x1="24" y1="24" x2="24" y2="28" stroke="#C49A7A" strokeWidth="1.2" strokeLinecap="round" />
            {/* Mouth */}
            {renderMouth(24, 31.5)}
            {/* Asymmetrical coat lapel */}
            <polygon points="15,38 24,43 33,38 36,48 12,48" fill="#241B26" />
            <line x1="21" y1="39" x2="28" y2="48" stroke="#F43F5E" strokeWidth="1.5" />
          </svg>
        );

      default:
        // Stylized default character with mood reaction
        return (
          <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
            <ellipse cx="24" cy="25" rx="10" ry="12" fill="#DDB088" />
            {renderEyebrows(19, 29, 21)}
            {renderEyes(19, 29, 25)}
            {renderMouth(24, 32)}
          </svg>
        );
    }
  };

  return (
    <div
      aria-label={`Portrait of ${name} (${mood})`}
      className={`relative inline-flex items-center justify-center rounded-2xl bg-white border-3 border-black overflow-visible flex-shrink-0 transition-all duration-300 shadow-cartoon ${moodAuraMap[mood]} ${sizeMap[size]} ${className}`}
    >
      <div className="w-full h-full rounded-xl overflow-hidden flex items-center justify-center">
        {renderCharacterPortrait()}
      </div>
      {showMoodBadge && (
        <span
          title={`Mood: ${mood}`}
          className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full transition-colors duration-300 shadow-cartoon-sm z-10 ${moodDotColor[mood]}`}
        />
      )}
    </div>
  );
};
