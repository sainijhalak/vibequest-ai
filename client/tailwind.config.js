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
        }
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
