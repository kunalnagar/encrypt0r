import { defineConfig, externalizeDepsPlugin } from 'electron-vite';

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: { index: 'src/electron/main.ts' },
      },
    },
  },
  renderer: {
    root: 'src/ui',
    build: {
      rollupOptions: {
        input: { index: 'src/ui/index.html' },
      },
    },
  },
});
