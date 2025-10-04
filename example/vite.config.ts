import { defineConfig } from 'vite'
import path from 'path';
import { fileURLToPath } from 'url';
import vue from '@vitejs/plugin-vue'
// import svgSpritePlugin from 'vite-plugin-vue-svg-sprite';
import svgSpritePlugin from '../dist/index.mjs';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const svgPath = path.resolve(__dirname, "assets", "svg");

export default defineConfig({
  plugins: [
    vue(),
    svgSpritePlugin({
      dir: svgPath
    })
  ],
  resolve: {
    alias: {
      '@pages': path.resolve(__dirname, 'pages'), // 也可以这样多配几个
    },
  },
})
