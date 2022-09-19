import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => ({
  base: './',
  build: {
    emptyOutDir: false,
    manifest: true,
    outDir: 'dist',
    rollupOptions: {
      input: {
        composer: 'src/composer/index.ts',
        'micro-lc': 'src/index.ts',
      },
      output: {
        entryFileNames: ({ name }) => `${name}.${mode}.js`,
      },
      plugins: [visualizer()],
    },
  },
  esbuild: {
    format: 'esm',
    target: [
      'es2020',
      'chrome64',
      'edge79',
      'firefox67',
      'node16',
      'safari11.1',
    ],
  },
  resolve: {
    alias: [
      {
        find: /process\.env\.NODE_ENV/,
        replacement: JSON.stringify(mode),
      },
    ],
  },
}))
