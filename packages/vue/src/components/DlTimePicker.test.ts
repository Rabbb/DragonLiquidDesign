import { Time } from '@internationalized/date'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import DlTimePicker from './DlTimePicker.vue'

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver = ResizeObserverMock

const wrappers: ReturnType<typeof mount>[] = []
afterEach(() => {
  wrappers.splice(0).forEach(wrapper => wrapper.unmount())
  document.body.innerHTML = ''
})

describe('DlTimePicker', () => {
  it('keeps the editable field and visual wheel on one TimeValue', async () => {
    const wrapper = mount(DlTimePicker, {
      attachTo: document.body,
      props: { modelValue: new Time(20, 30), open: true },
    })
    wrappers.push(wrapper)
    await nextTick()

    expect(wrapper.find('[data-slot="time-field"]').exists()).toBe(true)
    expect(document.body.querySelector('[data-slot="time-wheel-panel"]')).not.toBeNull()
    expect(document.body.querySelector('[data-slot="time-wheel"]')).toBeNull()
  })

  it('supports a compact button presentation without duplicating wheel logic', async () => {
    const wrapper = mount(DlTimePicker, {
      attachTo: document.body,
      props: { modelValue: new Time(9, 30), presentation: 'button', open: true, clearable: true },
    })
    wrappers.push(wrapper)
    await nextTick()

    expect(wrapper.find('[data-slot="picker-trigger"]').text()).toContain('09:30')
    const clear = [...document.body.querySelectorAll<HTMLButtonElement>('[data-slot="time-wheel-panel"] button')]
      .find(button => button.textContent === '清除')
    clear?.click()
    await nextTick()
    expect(wrapper.emitted('update:modelValue')).toEqual([[undefined]])
    expect(wrapper.emitted('clear')).toEqual([[]])
  })
})
