/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        emerald: '#10b981',
        cyan: '#06b6d4',
      },
      boxShadow: {
        'glow-green-blue': '0 0 8px 0 rgba(16, 185, 129, 0.3), 0 0 10px 0 rgba(6, 182, 212, 0.15)',
        'glow-green-blue-hover': '0 0 12px 0 rgba(16, 185, 129, 0.5), 0 0 15px 0 rgba(6, 182, 212, 0.3)',
        'icon-glow': '0 0 8px rgba(16, 185, 129, 0.6)',
      },
      animation: {
        'breathing': 'breathing 3s ease-in-out infinite',
        'hue-shift': 'hue-shift 5s linear infinite',
      },
      keyframes: {
        breathing: {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)' },
          '50%': { transform: 'scale(1.02)', boxShadow: '0 0 12px rgba(16, 185, 129, 0.8)' },
        },
        'hue-shift': {
          '0%, 100%': { filter: 'hue-rotate(0deg)' },
          '50%': { filter: 'hue-rotate(-20deg)' },
        }
      }
    },
  },
  plugins: [],
}
