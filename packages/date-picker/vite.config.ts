import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: ['src/**/*.stories.ts', 'src/**/*.stories.tsx', 'src/**/*.test.ts', 'src/**/*.test.tsx'],
    }),
  ],
  build: {
    outDir: 'dist',
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'DatePicker',
      formats: ['es', 'cjs'],
      fileName: format => `index.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'dayjs',
        'date-fns',
        'date-fns/locale/en-US',
        'react-datepicker',
        'react-datepicker/dist/react-datepicker.css',
        'lodash-es',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'react/jsx-runtime',
          dayjs: 'dayjs',
          'date-fns': 'dateFns',
          'react-datepicker': 'ReactDatePicker',
          'lodash-es': '_',
        },
        assetFileNames: assetInfo => {
          // 모든 CSS 파일을 date-picker.css로 통일
          if (assetInfo.name?.endsWith('.css')) {
            return 'date-picker.css';
          }
          return assetInfo.name ?? 'assets/[name][extname]';
        },
      },
    },
    cssCodeSplit: false,
    sourcemap: true,
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
