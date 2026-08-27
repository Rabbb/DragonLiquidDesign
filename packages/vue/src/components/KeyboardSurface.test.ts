import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import DlCard from './DlCard.vue'
import DlContextMenu from './DlContextMenu.vue'

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver = ResizeObserverMock

afterEach(() => { document.body.innerHTML = '' })

describe('keyboard surfaces', () => {
  it('activates an interactive card with Enter', async () => {
    const wrapper = mount(DlCard, { props: { interactive: true }, slots: { default: 'Project' } })
    await wrapper.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('click')).toHaveLength(1)
    expect(wrapper.attributes('role')).toBe('button')
  })

  it('opens a context menu with Shift+F10', async () => {
    const wrapper = mount(DlContextMenu, {
      attachTo: document.body,
      props: { items: [{ value: 'edit', label: 'Edit' }] },
      slots: { default: () => h('div', { 'data-target': 'context' }, 'Target') },
    })
    await wrapper.get('[data-target="context"]').trigger('keydown', { key: 'F10', shiftKey: true })
    await nextTick()
    await nextTick()
    expect(document.body.querySelector('[data-slot="context-menu"]')).not.toBeNull()
    wrapper.unmount()
  })
})
