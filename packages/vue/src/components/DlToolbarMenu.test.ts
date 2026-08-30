import { flushPromises, mount } from '@vue/test-utils'
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

  it('renders checked toggle items with checkbox menu semantics', async () => {
    const wrapper = mount(DlToolbarMenu, {
      props: {
        menus: [{ value: 'view', label: '视图', items: [{ value: 'rail', label: '显示笔记本栏', checkable: true, checked: true }] }],
      },
    })

    await wrapper.get('.dl-toolbar-menu__trigger').trigger('pointerdown', { button: 0, ctrlKey: false })
    await flushPromises()
    const item = document.body.querySelector('[role="menuitemcheckbox"]')
    expect(item?.getAttribute('aria-checked')).toBe('true')
    expect(item?.textContent).toContain('显示笔记本栏')
    wrapper.unmount()
  })
})
