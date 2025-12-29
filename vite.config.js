import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        tailwindcss({
          content: [
            "./index.html",
            "./src/**/*.{js,ts,jsx,tsx}",
          ],
          theme: {
            extend: {
              fontFamily: {
                sans: ['Orbitron', 'sans-serif'],
              },
              colors: {
                emerald: '#10B981',
                teal: '#14B8A6',
                lime: '#84CC16',
                cyan: '#22D3EE',
                'soft-blue': '#60A5FA',
              },
              boxShadow: {
                'glow-green-blue': '0 0 25px rgba(16,185,129,0.18), inset 0 0 18px rgba(34,211,238,0.08)',
                'glow-green-blue-hover': '0 0 35px rgba(16,185,129,0.25), inset 0 0 22px rgba(34,211,238,0.12)',
                'icon-glow': '0 4px 18px rgba(16,185,129,0.35)',
                'button-glow': '0 0 20px rgba(16,185,129,0.25)',
              },
              animation: {
                'float-subtle': 'floatY 6s ease-in-out infinite',
                'breathing': 'breathing 3s ease-in-out infinite',
              },
              keyframes: {
                breathing: {
                  '0%, 100%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.05)' },
                },
              },
            },
          },
          plugins: [],
        }),
        autoprefixer,
      ],
    },
  },
  build: {
    outDir: 'dist',
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
