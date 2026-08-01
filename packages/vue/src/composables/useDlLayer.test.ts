import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { useDlModalLayer, useDlPopoverLayer, useDlSelectLayer, useDlTooltipLayer } from './useDlLayer'

const LayerConsumer = defineComponent({
  props: { zIndex: Number },
  setup(props) {
    const zIndex = useDlSelectLayer(() => props.zIndex)
    return () => h('div', { 'data-consumer-z': zIndex.value })
  },
})

describe('Dragon Liquid layer context', () => {
  it('uses Ant Design inspired defaults outside a modal', () => {
    const wrapper = mount(LayerConsumer)
    expect(wrapper.attributes('data-consumer-z')).toBe('var(--dl-layer-select)')
  })

  it('raises select-like consumers above their modal container', () => {
    const ModalHost = defineComponent({
      setup() {
        const layer = useDlModalLayer(() => undefined)
        return () => h('section', {
          'data-overlay-z': layer.overlayZIndex.value,
          'data-content-z': layer.contentZIndex.value,
        }, [h(LayerConsumer)])
      },
    })

    const wrapper = mount(ModalHost)
    expect(wrapper.attributes('data-overlay-z')).toBe('var(--dl-layer-modal)')
    expect(wrapper.attributes('data-content-z')).toBe('calc(var(--dl-layer-modal) + 1)')
    expect(wrapper.get('[data-consumer-z]').attributes('data-consumer-z')).toBe(
      'calc(calc(var(--dl-layer-popup-base) + var(--dl-layer-container-offset)) + var(--dl-layer-consumer-offset))',
    )
  })

  it('uses a custom modal z-index as the child layer context', () => {
    const ModalHost = defineComponent({
      setup() {
        useDlModalLayer(() => 3000)
        return () => h(LayerConsumer)
      },
    })

    const wrapper = mount(ModalHost)
    expect(wrapper.attributes('data-consumer-z')).toBe('calc(3000 + var(--dl-layer-consumer-offset))')
  })

  it('raises nested popovers and tooltips through the same container context', () => {
    const FloatingHost = defineComponent({
      setup() {
        const popover = useDlPopoverLayer(() => undefined)
        const tooltip = useDlTooltipLayer(() => undefined)
        return () => h('div', {
          'data-popover-z': popover.value,
          'data-tooltip-z': tooltip.value,
        })
      },
    })
    const ModalHost = defineComponent({
      setup() {
        useDlModalLayer(() => undefined)
        return () => h(FloatingHost)
      },
    })

    const wrapper = mount(ModalHost)
    expect(wrapper.attributes('data-popover-z')).toContain('var(--dl-layer-container-offset)')
    expect(wrapper.attributes('data-tooltip-z')).toContain('var(--dl-layer-container-offset)')
    expect(wrapper.attributes('data-tooltip-z')).not.toBe('var(--dl-layer-tooltip)')
  })
})
