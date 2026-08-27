import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import DlSegmented from './DlSegmented.vue'

const items = [
  { value: 'list', label: '列表' },
  { value: 'board', label: '看板' },
  { value: 'calendar', label: '日历', disabled: true },
]

describe('DlSegmented', () => {
  it('selects enabled segments and emits a change event', async () => {
    const wrapper = mount(DlSegmented, { props: { modelValue: 'list', items } })
    await wrapper.get('[data-segment-value="board"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['board'])
    expect(wrapper.emitted('change')?.at(-1)).toEqual(['board'])
  })

  it('moves focus and selection with arrow keys while skipping disabled items', async () => {
    const wrapper = mount(DlSegmented, { attachTo: document.body, props: { modelValue: 'board', items } })
    await wrapper.get('[data-segment-value="board"]').trigger('keydown', { key: 'ArrowRight' })
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['list'])
    expect(document.activeElement?.getAttribute('data-segment-value')).toBe('list')
    wrapper.unmount()
  })
})

