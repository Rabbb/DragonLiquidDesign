import { CalendarDate } from '@internationalized/date'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import DlDatePicker from './DlDatePicker.vue'

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

function paste(element: Element, value: string) {
  const event = new Event('paste', { bubbles: true, cancelable: true })
  Object.defineProperty(event, 'clipboardData', { value: { getData: () => value } })
  element.dispatchEvent(event)
}

describe('DlDatePicker keyboard interaction', () => {
  it('keeps the field editable and opens only from the explicit keyboard command', async () => {
    const wrapper = mount(DlDatePicker, {
      attachTo: document.body,
      props: { presentation: 'field', modelValue: new CalendarDate(2026, 8, 28) },
    })
    wrappers.push(wrapper)

    await wrapper.get('[data-slot="date-field"]').trigger('focusin')
    expect(document.body.querySelector('[data-slot="popover-content"]')).toBeNull()
    await wrapper.get('[data-slot="date-field"]').trigger('keydown', { key: 'ArrowDown', altKey: true })
    await nextTick()
    expect(document.body.querySelector('[data-slot="popover-content"]')).not.toBeNull()
  })

  it('accepts a complete pasted date from the button presentation', async () => {
    const wrapper = mount(DlDatePicker, { props: { presentation: 'button' } })
    wrappers.push(wrapper)
    paste(wrapper.get('[data-slot="date-picker"]').element, '2026/8/28')
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]?.toString()).toBe('2026-08-28')
  })
})
