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

  it('keeps keyboard editing available and opens the wheel only from its trigger', async () => {
    const wrapper = mount(DlTimePicker, {
      attachTo: document.body,
      props: { modelValue: new Time(20, 30) },
    })
    wrappers.push(wrapper)
    await nextTick()

    await wrapper.find('[data-slot="time-field"]').trigger('focusin')
    expect(document.body.querySelector('[data-slot="time-wheel-panel"]')).toBeNull()

    await wrapper.find('[data-slot="time-picker-trigger"]').trigger('click')
    await nextTick()
    expect(document.body.querySelector('[data-slot="time-wheel-panel"]')).not.toBeNull()
  })

  it('preserves exact minutes and applies field range constraints to the wheel', async () => {
    const wrapper = mount(DlTimePicker, {
      attachTo: document.body,
      props: {
        modelValue: new Time(9, 33),
        minValue: new Time(9, 30),
        maxValue: new Time(18),
        minuteStep: 5,
        open: true,
      },
    })
    wrappers.push(wrapper)
    await nextTick()

    expect(document.body.querySelector('[aria-label="分钟"] [data-cycle="2"][data-wheel-value="33"]')?.getAttribute('aria-selected')).toBe('true')
    expect(document.body.querySelector<HTMLButtonElement>('[aria-label="小时"] [data-cycle="2"][data-wheel-value="8"]')?.disabled).toBe(true)
    expect(document.body.querySelector<HTMLButtonElement>('[aria-label="分钟"] [data-cycle="2"][data-wheel-value="35"]')?.disabled).toBe(false)

    const hour18 = document.body.querySelector<HTMLButtonElement>('[aria-label="小时"] [data-cycle="2"][data-wheel-value="18"]')
    hour18?.click()
    await nextTick()
    expect(document.body.querySelector<HTMLButtonElement>('[aria-label="分钟"] [data-cycle="2"][data-wheel-value="35"]')?.disabled).toBe(true)
  })

  it('uses an hour-only wheel when field granularity is hour', async () => {
    const wrapper = mount(DlTimePicker, {
      attachTo: document.body,
      props: { modelValue: new Time(9), granularity: 'hour', open: true },
    })
    wrappers.push(wrapper)
    await nextTick()

    expect(document.body.querySelector('[aria-label="小时"]')).not.toBeNull()
    expect(document.body.querySelector('[aria-label="分钟"]')).toBeNull()
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
