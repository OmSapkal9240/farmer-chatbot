import { defineConfig, loadEnv } from 'vite';
import path from "path";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return defineConfig({
  define: {
      'import.meta.env.VITE_AGMARK_API_KEY': JSON.stringify(env.VITE_AGMARK_API_KEY)
    },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ['@tsparticles/react', '@tsparticles/slim'],
  },
})};
