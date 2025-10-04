import { defineConfig } from 'vite'
import { resolve } from "path";
import vue from '@vitejs/plugin-vue'
// import svgSpritePlugin from 'vite-plugin-vue-svg-sprite';
import svgSpritePlugin from '../dist/index.mjs';
// console.log(svgSpritePlugin, 'svgSpritePlugin')
const svgPath = resolve(__dirname, "assets", "svg");

export default defineConfig({
  plugins: [
    vue(),
    svgSpritePlugin({
      dir: svgPath
    })
  ],
  resolve: {
    alias: {
      '@pages': resolve(__dirname, 'pages'), // 也可以这样多配几个
    },
  },
})
