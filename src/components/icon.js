import { onBeforeUnmount, defineComponent, h, onMounted, ref } from 'vue'
import { loadIcon, config } from '@/utils/sprite'

export default defineComponent({
  name: 'SvgIcon',
  props: {
    name: { type: String, required: true },
    color: { type: String, default: 'currentColor' },
    lazy: { type: Boolean, required: false, default: true },
  },
  setup(props) {
    const elRef = ref(null);
    const loaded = ref(false);
    let observer = null;

    const load = ()=> {
      if (loaded.value) return;
      loadIcon(props.name)
      loaded.value = true;
    };
    
    // 生命周期：组件挂载时加载图标
    onMounted(() => {
      if (!props.lazy) {
        load();
        return;
      }

      observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          load();
          observer?.disconnect();
        }
      });
      if (elRef.value) observer.observe(elRef.value);
    })

    onBeforeUnmount(() => {
      observer?.disconnect();
    });

    return () =>
      h(
        'svg',
        {
          ref: elRef,
          'aria-hidden': 'true',
          fill: props.color,
        },
        h('use', {
          href: `#${config.prefix}-${props.name}`,
        })
      )
  },
})
