import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import DlToolbarMenu from './DlToolbarMenu.vue'

describe('DlToolbarMenu', () => {
  it('dispatches user-configurable shortcuts before an editor can consume them', async () => {
    const wrapper = mount(DlToolbarMenu, {
      props: { menus: [{ value: 'file', label: '文件', items: [{ value: 'save', label: '保存', shortcut: 'Ctrl+Shift+S' }] }] },
      attachTo: document.body,
    })

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 's', ctrlKey: true, shiftKey: true, bubbles: true }))
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('select')).toEqual([['save']])
    wrapper.unmount()
  })
})
