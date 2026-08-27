import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import DlVirtualList from './DlVirtualList.vue'

describe('DlVirtualList', () => {
  it('renders only the visible window plus overscan', async () => {
    const items = Array.from({ length: 100 }, (_, index) => ({ id: index, label: `Item ${index}` }))
    const wrapper = mount(DlVirtualList, {
      props: { items, estimatedItemHeight: 20, viewportHeight: 100, overscan: 1, itemKey: 'id' },
      slots: { item: ({ item, index }: { item: unknown; index: number }) => `${index}:${(item as { label: string }).label}` },
    })
    expect(wrapper.findAll('[data-slot="virtual-list-item"]')).toHaveLength(7)
    expect(wrapper.text()).toContain('0:Item 0')

    const viewport = wrapper.get('[data-slot="virtual-list-viewport"]')
    Object.defineProperty(viewport.element, 'scrollTop', { value: 200, writable: true })
    await viewport.trigger('scroll')
    await nextTick()
    expect(wrapper.text()).toContain('9:Item 9')
    expect(wrapper.text()).not.toContain('0:Item 0')
  })

  it('renders an explicit empty state', () => {
    const wrapper = mount(DlVirtualList, { props: { items: [] }, slots: { empty: '没有结果' } })
    expect(wrapper.get('[data-slot="virtual-list-empty"]').text()).toBe('没有结果')
  })
})
