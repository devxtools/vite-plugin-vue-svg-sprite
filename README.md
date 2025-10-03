# vite-plugin-vue-svg-sprite 

> 一个支持 **动态按需加载 SVG**、**可配置懒加载** 的 Vite 插件。
> 懒加载
  

---

## ✨ 特性

- ⚡ **动态按需加载**：仅加载使用到的SVG  
- 💤 **懒加载模式**：进入可视区域后再请求图标  
- 🔥 **开发友好**：HMR 实时更新，改名/新增 SVG 即时生效  
- 💄 **color**：style 修改， 一样是仅支持单色！

---

## 📦 安装

```bash
pnpm add -D vite-plugin-vue-svg-sprite
# 或
npm i -D vite-plugin-vue-svg-sprite
```


## ⚙️ 在 vite.config.ts 中配置：
```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from "path";

import svgSpritePlugin from 'vite-plugin-vue-svg-sprite';

export default defineConfig({
  plugins: [
    vue(),
    svgSpritePlugin({
      dir: resolve(__dirname, "assets", "svg")
    })
  ]
})

## svgSpritePlugin 配置
```
| 选项                | 类型                        | 默认值               | 说明                              |
| ----------------- | ------------------------- | ----------------- | ------------------------------- |
| `dir`             | `string`                  | `src/assets/svg`  | SVG 目录路径                        |


## ⚙️ 在 app.vue 中配置：
```js
<script setup lang="ts">
// 引入插件提供的虚拟模块
import SvgMaps from 'virtual:svgs-sprite'
</script>
<template>
    <div>
        <main></main>
        <SvgMaps />
    </div>
</template>
```


## ⚙️ 在你的页面，例如：home.vue 中使用：
```js
<script setup lang="ts">
// 引入插件提供的虚拟模块
import SvgIcon from 'virtual:svg-icon'

//例如： /assets/svg/score.svg
//例如： /assets/svg/About/score.svg
</script>
<template>
    <page>
        <SvgIcon style="color: blue" name="score" />
        <SvgIcon name="About/score" />
    </page>
</template>
```



## License

[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2024-present, ASH

