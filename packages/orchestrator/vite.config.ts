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
        composer: 'src/composer-plugin.ts',
        'micro-lc': 'src/index.ts',
      },
      output: {
        entryFileNames: ({ name }) => `${name}.${mode}.js`,
        manualChunks: (id) => {
          if (id.match(/qiankun/)) {
            return 'qiankun'
          }
        },
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
      'opera51',
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
