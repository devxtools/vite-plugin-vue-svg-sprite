import { defineComponent, h } from 'vue'
import { spriteSymbols } from '@/utils/sprite'

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
