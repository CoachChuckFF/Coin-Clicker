/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: true,
  content: [],
  theme: {
    extend: {
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(20px)',
      },
    },
    extend: {
      colors: {
        'solana-black': '#1B1917',
        'solana-dark': '#292524',
        'solana-light': '#FFFFFF',
        'solana-green': '#16F195',
        'solana-blue': '#4AAACE',
        'solana-red': '#CE4A5C',
        'solana-purple': '#9A45FF'
      }
    },
    variants: {
      extend: {
        backdropFilter: ['hover', 'focus'],
      },
    },
  },
  plugins: [],
}

