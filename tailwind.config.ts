import type { Config } from 'tailwindcss';

// Tokens from DESIGN.md §2 and §4. Do not add colours outside this set —
// colour encodes payer identity, never a verdict. No red, anywhere.
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  darkMode: undefined, // DESIGN.md §1: no dark mode, by design.
  theme: {
    extend: {
      colors: {
        paper: '#F7F5F0',
        ink: '#1F2421',
        rule: '#DCD8CF',
        'payer-1': '#2F6B5E',
        'payer-2': '#4A5C8A',
        'payer-3': '#8A6A3B',
        self: '#5E6861',
        care: '#80371C',
      },
      fontFamily: {
        sans: ['var(--font-atkinson)'],
        mono: ['var(--font-plex-mono)'],
      },
      fontSize: {
        caption: ['16px', { lineHeight: '1.65' }],
        body: ['18px', { lineHeight: '1.65' }],
        'body-lg': ['20px', { lineHeight: '1.65' }],
        key: ['24px', { lineHeight: '1.65' }],
        heading: ['28px', { lineHeight: '1.65' }],
      },
      spacing: {
        target: '48px',
        'target-family': '56px',
      },
      transitionDuration: {
        draw: '500ms',
        state: '180ms',
      },
      transitionTimingFunction: {
        alur: 'cubic-bezier(0.2, 0, 0, 1)',
      },
      borderWidth: {
        focus: '3px',
      },
    },
  },
  plugins: [],
};

export default config;
