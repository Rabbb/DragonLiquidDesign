import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import DlSplitButton from './DlSplitButton.vue'

const items = [
  { value: 'edit', label: '编辑项目' },
  { value: 'delete', label: '删除项目' },
]

describe('DlSplitButton', () => {
  it('keeps the primary action and menu trigger as one accessible control', async () => {
    const wrapper = mount(DlSplitButton, {
      props: { label: '启动', items, variant: 'primary', size: 'sm', menuLabel: '项目操作' },
    })
    const buttons = wrapper.findAll('button')

    expect(wrapper.get('[data-slot="split-button"]').attributes('data-variant')).toBe('primary')
    expect(buttons).toHaveLength(2)
    expect(buttons[0].text()).toBe('启动')
    expect(buttons[1].attributes('aria-label')).toBe('项目操作')
    expect(buttons[1].find('svg').exists()).toBe(true)

    await buttons[0].trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
    await buttons[1].trigger('click')
    expect(wrapper.emitted('update:open')?.at(-1)).toEqual([true])
    expect(wrapper.attributes('data-open')).toBe('true')
  })

  it('can disable only the main action while keeping management actions available', () => {
    const wrapper = mount(DlSplitButton, {
      props: { label: '运行中', items, mainDisabled: true },
    })
    const buttons = wrapper.findAll('button')

    expect(buttons[0].attributes()).toHaveProperty('disabled')
    expect(buttons[1].attributes()).not.toHaveProperty('disabled')
  })
})
