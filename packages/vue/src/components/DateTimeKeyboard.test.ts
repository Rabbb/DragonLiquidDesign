import { CalendarDate, Time } from '@internationalized/date'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import DlDateField from './DlDateField.vue'
import DlDateRangeField from './DlDateRangeField.vue'
import DlTimeField from './DlTimeField.vue'
import DlTimeRangeField from './DlTimeRangeField.vue'

function paste(element: Element, value: string) {
  const event = new Event('paste', { bubbles: true, cancelable: true })
  Object.defineProperty(event, 'clipboardData', { value: { getData: () => value } })
  element.dispatchEvent(event)
  return event
}

describe('structured field keyboard paste', () => {
  it('pastes and normalizes a whole date instead of filling one segment', async () => {
    const wrapper = mount(DlDateField, { props: { modelValue: new CalendarDate(2026, 1, 1) } })
    const event = paste(wrapper.get('[data-slot="date-field"]').element, '2026年8月28日')
    await nextTick()

    expect(event.defaultPrevented).toBe(true)
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]?.toString()).toBe('2026-08-28')
    expect(wrapper.emitted('paste')?.at(-1)?.[1]).toBe('2026年8月28日')
  })

  it('pastes complete date and time ranges', async () => {
    const date = mount(DlDateRangeField)
    paste(date.get('[data-slot="date-range-field"]').element, '2026/8/1 至 2026/8/5')
    await nextTick()
    expect((date.emitted('update:modelValue')?.at(-1)?.[0] as { end: CalendarDate }).end.toString()).toBe('2026-08-05')

    const time = mount(DlTimeRangeField)
    paste(time.get('[data-slot="time-range-field"]').element, '09:30 ~ 18:00')
    await nextTick()
    expect((time.emitted('update:modelValue')?.at(-1)?.[0] as { end: Time }).end.toString()).toBe('18:00:00')
  })

  it('keeps invalid or out-of-range clipboard content out of the value', async () => {
    const wrapper = mount(DlTimeField, { props: { minValue: new Time(9), maxValue: new Time(18) } })
    const event = paste(wrapper.get('[data-slot="time-field"]').element, '23:30')
    await nextTick()

    expect(event.defaultPrevented).toBe(false)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.emitted('paste-error')?.at(-1)).toEqual(['23:30'])
  })
})
