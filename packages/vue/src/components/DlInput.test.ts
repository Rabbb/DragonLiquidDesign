import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import DlInput from './DlInput.vue'

describe('DlInput', () => {
  it('emits v-model updates', async () => {
    const wrapper = mount(DlInput, { props: { modelValue: '' } })
    await wrapper.get('input').setValue('葬送的芙莉莲')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['葬送的芙莉莲'])
  })

  it('uses a neutral field shell so consumers can provide an associated label', () => {
    const wrapper = mount(DlInput, { props: { modelValue: '' } })
    expect(wrapper.element.tagName).toBe('DIV')
    expect(wrapper.find('label').exists()).toBe(false)
  })
})
