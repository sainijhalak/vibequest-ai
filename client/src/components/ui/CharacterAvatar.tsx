import React from 'react';

interface CharacterAvatarProps {
  seed: string;
  name: string;
  accentColor?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
  seed,
  name,
  accentColor = '#FF5C35',
  size = 'md',
  className = ''
}) => {
  const sizeMap = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const renderGlyph = () => {
    switch (seed.toLowerCase()) {
      case 'maya':
        // Radiant 8-pointed geometric sunburst
        return (
          <svg viewBox="0 0 40 40" className="w-full h-full p-1.5" fill="none" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="20" cy="20" r="7" fill={accentColor} fillOpacity="0.2" />
            <path d="M20 5v4M20 31v4M5 20h4M31 20h4M9.5 9.5l3 3M27.5 27.5l3 3M9.5 30.5l3-3M27.5 12.5l3-3" />
          </svg>
        );
      case 'jordan':
        // Intersecting dual geometric squares / hourglass
        return (
          <svg viewBox="0 0 40 40" className="w-full h-full p-2" fill="none" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round">
            <rect x="8" y="8" width="16" height="16" transform="rotate(45 16 16)" fill={accentColor} fillOpacity="0.25" />
            <rect x="16" y="16" width="16" height="16" transform="rotate(45 24 24)" />
          </svg>
        );
      case 'leo':
        // Stepped signal wave / pulse
        return (
          <svg viewBox="0 0 40 40" className="w-full h-full p-2" fill="none" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round">
            <path d="M6 24h6l4-12 8 20 5-10h5" />
            <circle cx="20" cy="20" r="14" strokeDasharray="3 3" strokeOpacity="0.4" />
          </svg>
        );
      case 'marcus':
        // Sharp angular crest / diamond guard
        return (
          <svg viewBox="0 0 40 40" className="w-full h-full p-2" fill="none" stroke={accentColor} strokeWidth="2.5" strokeLinejoin="round">
            <polygon points="20,4 34,16 28,34 12,34 6,16" fill={accentColor} fillOpacity="0.2" />
            <line x1="20" y1="4" x2="20" y2="34" />
          </svg>
        );
      case 'elena':
        // Staggered architectural pillars
        return (
          <svg viewBox="0 0 40 40" className="w-full h-full p-2" fill="none" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round">
            <rect x="8" y="14" width="6" height="18" fill={accentColor} fillOpacity="0.2" />
            <rect x="17" y="8" width="6" height="24" fill={accentColor} fillOpacity="0.4" />
            <rect x="26" y="18" width="6" height="14" fill={accentColor} fillOpacity="0.2" />
          </svg>
        );
      case 'sam':
        // Soft nested curves / open book contour
        return (
          <svg viewBox="0 0 40 40" className="w-full h-full p-2" fill="none" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round">
            <path d="M6 28c4-4 9-4 14 0 5-4 10-4 14 0V12c-4-4-9-4-14 0-5-4-10-4-14 0z" fill={accentColor} fillOpacity="0.25" />
            <line x1="20" y1="12" x2="20" y2="28" />
          </svg>
        );
      case 'chloe':
        // Orbital eye / artistic spiral
        return (
          <svg viewBox="0 0 40 40" className="w-full h-full p-2" fill="none" stroke={accentColor} strokeWidth="2.5">
            <circle cx="20" cy="20" r="14" strokeDasharray="4 2" />
            <circle cx="20" cy="20" r="6" fill={accentColor} fillOpacity="0.4" />
            <line x1="6" y1="20" x2="34" y2="20" strokeLinecap="round" />
          </svg>
        );
      default:
        // Generic geometric polygon glyph
        return (
          <svg viewBox="0 0 40 40" className="w-full h-full p-2" fill="none" stroke={accentColor} strokeWidth="2.5">
            <polygon points="20,6 34,32 6,32" fill={accentColor} fillOpacity="0.2" />
            <circle cx="20" cy="22" r="3" fill={accentColor} />
          </svg>
        );
    }
  };

  return (
    <div
      aria-label={`Avatar of ${name}`}
      className={`relative inline-flex items-center justify-center rounded-xl bg-ink-900 border border-ink-700 overflow-hidden flex-shrink-0 ${sizeMap[size]} ${className}`}
    >
      {renderGlyph()}
    </div>
  );
};
