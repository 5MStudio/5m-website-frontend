// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#ff0000ff', // the actual page background
        foreground: '#ff0000ff', // default text fallback (if needed)
      },
      spacing: {
        'grid-margin': '10px',
        'grid-gutter': '30px',
        'grid-bleed': '10px',
      },
      gridTemplateColumns: {
        '2': 'repeat(2, minmax(0, 1fr))',
        '4': 'repeat(4, minmax(0, 1fr))',
        '8': 'repeat(8, minmax(0, 1fr))',
      },
      fontSize: {
        base: ['12px', '14px'],
      },
      fontFamily: {
        sans: ['"AntiqueLegacy"', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
}