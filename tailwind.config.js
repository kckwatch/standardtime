/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        burgundy: {
          50: '#fdf2f2',
          100: '#fce7e7',
          200: '#f9d2d2',
          300: '#f4b0b0',
          400: '#ec8080',
          500: '#e15555',
          600: '#cd3737',
          700: '#ab2a2a',
          800: '#8d2626',
          900: '#762525',
          950: '#401010',
        },
      },
    },
  },
  plugins: [],
};