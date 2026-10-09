/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0D0F15',
          900: '#141721',
          850: '#1C202E',
          800: '#252B3D',
          700: '#2F364B',
          600: '#3D465E',
        },
        paper: {
          50: '#F3EFE6',
          100: '#E6E1D6',
          200: '#C7C1B5',
          300: '#9DA5B4',
          400: '#636B7E',
        },
        coral: {
          DEFAULT: '#FF5C35',
          hover: '#FF7350',
          dark: '#CC3E18',
          tint: '#2D1610',
        },
        mint: {
          DEFAULT: '#00E599',
          dark: '#00B377',
          tint: '#0C261C',
        },
        amber: {
          DEFAULT: '#E5A93B',
          tint: '#2B210F',
        },
        comic: {
          yellow: '#FFE600',
          pink: '#FF4081',
          cyan: '#00E5FF',
          green: '#76FF03',
          purple: '#B388FF',
          orange: '#FF6D00',
          card: '#FFFDF0',
          dark: '#141419',
        }
      },
      boxShadow: {
        'cartoon-sm': '3px 3px 0px #000000',
        'cartoon': '4px 4px 0px #000000',
        'cartoon-lg': '6px 6px 0px #000000',
        'cartoon-xl': '8px 8px 0px #000000',
        'cartoon-pop': '5px 5px 0px rgba(0,0,0,0.9)',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
