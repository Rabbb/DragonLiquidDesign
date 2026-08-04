import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ command }) => ({
  plugins: [vue(), ...(command === 'serve' ? [tailwindcss()] : [])],
  resolve: {
    alias: command === 'serve'
      ? [
          {
            find: /^@dragon-liquid\/vue\/style\.css$/,
            replacement: fileURLToPath(new URL('../../packages/vue/src/styles/index.css', import.meta.url)),
          },
          {
            find: /^@dragon-liquid\/vue$/,
            replacement: fileURLToPath(new URL('../../packages/vue/src/index.ts', import.meta.url)),
          },
        ]
      : [],
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
}))
