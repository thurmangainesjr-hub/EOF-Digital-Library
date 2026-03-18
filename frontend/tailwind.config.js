/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        eof: {
          gold: '#D4AF37',
          'gold-light': '#E8C558',
          purple: '#4A0E4E',
          'purple-light': '#6B2C6F',
          dark: '#0D0D0D',
          'dark-lighter': '#1A1A1A',
          cream: '#FDF5E6'
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}
