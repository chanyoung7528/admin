import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      '@shared/ui': path.resolve(__dirname, './src/components/ui'),
      '@shared/components': path.resolve(__dirname, './src/components'),
      '@shared/lib': path.resolve(__dirname, './src/lib'),
      '@shared/hooks': path.resolve(__dirname, './src/hooks'),
      '@shared/assets': path.resolve(__dirname, './src/assets'),
      '@shared': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
    },
  },
});
