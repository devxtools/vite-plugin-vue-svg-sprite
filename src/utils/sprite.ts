import { ref } from 'vue'

// 注释不能删除，它是替换符
export const config = /*! __PURE__VAR__ */{}

const modules: Record<string, unknown> = {
    /*@svg-modules@*/
};

// 已经注册的图标
const loadedIcons = new Set<string>()
export const spriteSymbols = ref<Record<string, string>>({})

function SvgFilter(raw: string) {
  // 匹配 fill="xxx" 或 stroke="xxx"
  const colorMatches = [...raw.matchAll(/(?:fill|stroke)=(['"])(.*?)\1/gi)];

  // 收集颜色值
  const colors = new Set();
  for (const match of colorMatches) {
    const color = match[2].toLowerCase();
    if (color !== 'none' && color !== 'currentcolor') {
      colors.add(color);
    }
  }
  // 如果是单色（或没有颜色），才做替换
  if (colors.size <= 1) {
    raw = raw
      .replace(/fill=(['"])(?!(currentColor|none))[^'"]*\1/gi, 'fill="currentColor"')
      .replace(/stroke=(['"])(?!(currentColor|none))[^'"]*\1/gi, 'stroke="currentColor"');
  }

  return raw;
}

export async function loadIcon(name: string) {
    if (loadedIcons.has(name)) return // ✅ 同名只加载一次
    loadedIcons.add(name)
    const entry = modules[name];
    if (!entry) {
        console.warn(`[SvgIcon] not found: ${name}`)
        return
    }
    const loader = entry as () => Promise<{ default: string }>
    const mod = await loader()
    let raw = (mod.default || mod).toString()
    if (!raw) return
    // 去掉 width / height
    raw = raw.replace(/<svg([^>]*)>/i, (match, attrs) => {
        const newAttrs = attrs.replaceAll(/\s(width|height|fill)="[^"]*"/gi, '')
        return `<svg${newAttrs}>`
    })
    raw = SvgFilter(raw);
    spriteSymbols.value[name] = `<symbol id="${config.prefix}-${name}">${raw}</symbol>`
}
