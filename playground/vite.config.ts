import path from 'path';
import { defineConfig, getDepsOptimizer } from 'vite';
import vue from '@vitejs/plugin-vue';
import prebundleSrc from '../src';

// change this to see the difference
const ENABLED = true;

export default defineConfig({
  plugins: [
    vue(),
    ENABLED &&
      prebundleSrc(
        // retrieve from your patched version of Vite
        getDepsOptimizer,
        {
          files: ['src/utils/**/*.ts'],
          ignore: ['src/utils/bar/a.ts'],
        }
        // or use multiple options
        // [
        //   {
        //     files: ['src/utils/foo/**/*.ts'],
        //   },
        //   {
        //     files: ['src/utils/bar/**/*.ts'],
        //     ignore: ['src/utils/bar/a.ts'],
        //   },
        // ]
      ),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
