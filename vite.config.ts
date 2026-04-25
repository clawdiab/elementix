import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { copyFileSync } from 'fs';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: 'index'
    },
    cssCodeSplit: false
  },
  plugins: [
    dts({ insertTypesEntry: true }),
    {
      name: 'copy-theme-css',
      closeBundle() {
        copyFileSync(
          resolve(__dirname, 'src/theme.css'),
          resolve(__dirname, 'dist/theme.css')
        );
      }
    }
  ]
});
