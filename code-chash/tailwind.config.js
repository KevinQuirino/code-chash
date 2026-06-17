/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        posGreen: '#22c55e',
        posBg: '#0f172a',
      },
      boxShadow: {
        soft: '0 12px 34px rgba(15, 23, 42, 0.18)',
      },
    },
  },
  plugins: [],
};
