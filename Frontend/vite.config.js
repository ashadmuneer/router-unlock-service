import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      react({
        babel: {
          presets: [
            [
              '@babel/preset-env',
              {
                targets: { chrome: '80' }, // Puppeteer supports Chrome 80+
                bugfixes: true,
              },
            ],
          ],
        },
      }),
    ],
    build: {
      outDir: 'dist',
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: env.VITE_API_URL,
          changeOrigin: true,
        },
      },
    },
  };
});
