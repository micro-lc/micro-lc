import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'

import target from './scripts/target'

export default defineConfig({
  base: './',
  build: {
    emptyOutDir: false,
    manifest: true,
    outDir: 'dist',
    rollupOptions: {
      input: {
        'mlc-layout': 'src/index.ts',
      },
      output: {
        entryFileNames: ({ name }) => `${name}.js`,
        // manualChunks: (id) => {
        //   if (id.match(/qiankun/)) {
        //     return 'qiankun'
        //   }
        // },
      },
      plugins: [visualizer()],
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          'ant-prefix': 'mlc',
          'html-selector': ':host',
          'zindex-header': 'var(--micro-lc-zindex-header, 1000)',
        },
      },
    },
  },
  esbuild: {
    target,
  },
})
