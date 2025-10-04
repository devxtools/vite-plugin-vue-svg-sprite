import { defineComponent, h } from 'vue';
import { spriteSymbols } from 'virtual:svgs-sprite'

// 注释不能删除，它是替换符
/*! __SPRITE__PATH__ */

export default defineComponent({
  name: 'SvgSprite',
  setup() {
    return () =>
      h(
        'svg',
        {
          'aria-hidden': 'true',
          style: {
            position: 'absolute',
            width: '0',
            height: '0',
            overflow: 'hidden',
          },
        },
        // 遍历 spriteSymbols
        Object.entries(spriteSymbols.value).map(([id, raw]) =>
          h('g', { innerHTML: raw, key: id })
        )
      )
  },
})
