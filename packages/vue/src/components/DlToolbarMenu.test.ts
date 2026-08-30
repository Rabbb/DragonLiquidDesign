import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import DlToolbarMenu from './DlToolbarMenu.vue'

describe('DlToolbarMenu', () => {
  it('renders an optional menu group icon', () => {
    const wrapper = mount(DlToolbarMenu, {
      props: { menus: [{ value: 'notebook', label: '笔记本', icon: '📓', items: [] }] },
    })
    expect(wrapper.get('.dl-toolbar-menu__trigger').text()).toContain('📓')
    expect(wrapper.get('.dl-toolbar-menu__trigger').text()).toContain('笔记本')
  })

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
