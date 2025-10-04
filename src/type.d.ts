// src/type.d.ts
import type { Ref, DefineComponent } from 'vue'

/**
 * 虚拟模块：SvgSprite 组件
 */
declare module 'virtual:svgs' {
  const Svgs: DefineComponent<{}, {}, any>
  export default Svgs
}

/**
 * 虚拟模块：SvgIcon 功能模块
 */
declare module 'virtual:svg-icon' {
  export const config: { prefix: string }
  export const spriteSymbols: Ref<Record<string, string>>
  export function loadIcon(name: string): Promise<void>
}
