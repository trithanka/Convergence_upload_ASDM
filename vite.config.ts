import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'src/assets/*.xlsx', // Copy all .xlsx files
          dest: 'assets', // Ensure they are available in /dist/assets/
        },
      ],
    }),
  ],
  define: {
    'process.env.VITE_API_BASE_URL': JSON.stringify(
      'https://convergence-upload.skillmissionassam.org/nw'
    ),
  },
});
