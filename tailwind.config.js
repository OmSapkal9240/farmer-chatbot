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
        'glow-green-blue': '0 0 15px 0 rgba(16, 185, 129, 0.5), 0 0 20px 0 rgba(6, 182, 212, 0.3)',
        'glow-green-blue-hover': '0 0 25px 0 rgba(16, 185, 129, 0.7), 0 0 30px 0 rgba(6, 182, 212, 0.5)',
        'icon-glow': '0 0 10px rgba(16, 185, 129, 0.8)',
      },
      animation: {
        'breathing': 'breathing 3s ease-in-out infinite',
        'hue-shift': 'hue-shift 5s linear infinite',
      },
      keyframes: {
        breathing: {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 10px rgba(16, 185, 129, 0.8)' },
          '50%': { transform: 'scale(1.05)', boxShadow: '0 0 15px rgba(16, 185, 129, 1)' },
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
