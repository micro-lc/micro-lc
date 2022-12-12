import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import banner from 'vite-plugin-banner'

import settings from '../../settings.json'

export default defineConfig(({ mode }) => ({
  base: './',
  build: {
    emptyOutDir: false,
    lib: {
      entry: 'src/index.ts',
      fileName: () => `composer.${mode}.js`,
      formats: ['umd'],
      name: '__MICRO_LC_COMPOSER',
    },
    manifest: false,
    minify: !mode.includes('development'),
    outDir: 'dist',
    rollupOptions: {
      plugins: [visualizer()],
    },
  },
  esbuild: {
    target: settings.target,
  },
  plugins: [
    banner(settings.banner.join('\n')),
  ],
}))
