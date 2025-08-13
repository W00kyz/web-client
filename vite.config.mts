import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['msw/browser', 'msw/core/http'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/'),
      '@datasources': path.resolve(__dirname, 'src/datasources'),
      '@layouts': path.resolve(__dirname, 'src/layouts'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@constants': path.resolve(__dirname, 'src/constants'),
      '@types': path.resolve(__dirname, 'src/types'),
    },
  },
});
