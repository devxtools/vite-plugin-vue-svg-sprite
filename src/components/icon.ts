import { onBeforeUnmount, defineComponent, h, onMounted, ref, Ref } from 'vue'
import { loadIcon, config } from 'virtual:svgs-sprite'

// 注释不能删除，它是替换符
/*! __SPRITE__PATH__ */

export default defineComponent({
  name: 'SvgIcon',
  props: {
    name: { type: String, required: true },
    color: { type: String, default: 'currentColor' },
    lazy: { type: Boolean, required: false, default: true },
  },
  setup(props: { name: string; color?: string; lazy?: boolean; }) {
    const elRef: Ref<SVGSVGElement | null> = ref(null)
    const loaded = ref<boolean>(false)
    let observer: IntersectionObserver | null = null

    const load = () => {
      if (loaded.value) return
      loadIcon(props.name)
      loaded.value = true
    }

    onMounted(() => {
      if (!props.lazy) {
        load()
        return
      }

      observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          load()
          observer?.disconnect()
        }
      })

      if (elRef.value) observer.observe(elRef.value)
    })

    onBeforeUnmount(() => {
      observer?.disconnect()
    })

    return () =>
      h(
        'svg',
        {
          ref: elRef,
          'aria-hidden': 'true',
          // style: {
          //   color: props.color
          // }
        },
        h('use', {
          href: `#${config?.prefix}-${props.name}`,
        })
      )
  },
})
