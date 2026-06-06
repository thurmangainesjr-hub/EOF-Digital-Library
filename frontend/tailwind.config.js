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
          gold:           '#D4AF37',
          'gold-light':   '#E8C558',
          'gold-dim':     '#A8892A',
          crimson:        '#C0392B',
          'crimson-light':'#E74C3C',
          'crimson-dark': '#922B21',
          purple:         '#4A0E4E',
          'purple-light': '#6B2C6F',
          dark:           '#0D0D0D',
          'dark-lighter': '#141414',
          'dark-card':    '#1A1A1A',
          'dark-border':  '#2A2A2A',
          cream:          '#FDF5E6',
          muted:          '#6B7280',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans:  ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient':    'linear-gradient(135deg, #D4AF37, #E8C558)',
        'crimson-gradient': 'linear-gradient(135deg, #C0392B, #E74C3C)',
        'dark-gradient':    'linear-gradient(180deg, #141414 0%, #0D0D0D 100%)',
      },
      boxShadow: {
        'gold-sm':  '0 0 12px rgba(212,175,55,0.25)',
        'gold-md':  '0 0 24px rgba(212,175,55,0.35)',
        'gold-lg':  '0 0 40px rgba(212,175,55,0.45)',
        'crimson':  '0 0 24px rgba(192,57,43,0.40)',
        'card':     '0 4px 24px rgba(0,0,0,0.6)',
      },
      animation: {
        'fade-in':    'fadeIn 0.4s ease-out',
        'slide-in':   'slideIn 0.35s cubic-bezier(0.4,0,0.2,1)',
        'pulse-gold': 'pulseGold 2.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        pulseGold: {
          '0%,100%': { boxShadow: '0 0 10px rgba(212,175,55,0.25)' },
          '50%':     { boxShadow: '0 0 28px rgba(212,175,55,0.55)' },
        },
      },
    },
  },
  plugins: [],
}
