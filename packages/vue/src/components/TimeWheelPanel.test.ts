import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import TimeWheelPanel from './TimeWheelPanel.vue'
import {
  buildDlTimeWheelMinutes,
  clampDlTimeWheelMinute,
  formatDlTimeWheelValue,
  parseDlTimeWheelValue,
} from './time-wheel.utils'

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

describe('TimeWheelPanel utilities', () => {
  it('parses, formats and clamps valid 24-hour values', () => {
    expect(parseDlTimeWheelValue('09:35')).toEqual({ hour: 9, minute: 35 })
    expect(parseDlTimeWheelValue('24:00')).toBeNull()
    expect(formatDlTimeWheelValue(9, 5)).toBe('09:05')
    expect(buildDlTimeWheelMinutes(7)).toEqual([0, 7, 14, 21, 28, 35, 42, 49, 56, 59])
    expect(clampDlTimeWheelMinute(33, 5)).toBe(35)
  })
})

describe('TimeWheelPanel', () => {
  it('uses the configured minute step and commits an available time', async () => {
    const wrapper = mount(TimeWheelPanel, {
      attachTo: document.body,
      props: { open: true, modelValue: '09:30', minuteStep: 15 },
    })
    wrappers.push(wrapper)
    await nextTick()

    const minute = document.body.querySelector<HTMLButtonElement>('[data-slot="time-wheel-panel"] [aria-label="分钟"] [data-cycle="2"][data-wheel-value="45"]')
    expect(minute).not.toBeNull()
    minute?.click()
    await nextTick()
    const apply = [...document.body.querySelectorAll<HTMLButtonElement>('[data-slot="time-wheel-panel"] footer button')]
      .find(button => button.textContent === '应用')
    apply?.click()
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['09:45'])
    expect(wrapper.emitted('change')?.at(-1)).toEqual(['09:45'])
    expect(wrapper.emitted('update:open')?.at(-1)).toEqual([false])
  })

  it('fine-tunes minutes and hours independently of the wheel minute step', async () => {
    const wrapper = mount(TimeWheelPanel, {
      attachTo: document.body,
      props: { open: true, modelValue: '09:30', minuteStep: 15 },
    })
    wrappers.push(wrapper)
    await nextTick()

    document.body.querySelector<HTMLButtonElement>('[aria-label="分钟增加 1"]')?.click()
    await nextTick()
    expect(document.body.querySelector('[data-slot="time-wheel-panel"] .dl-time-wheel__summary strong')?.textContent).toBe('09:31')
    expect(document.body.querySelector('[aria-label="分钟"] [data-cycle="2"][data-wheel-value="31"]')?.getAttribute('aria-selected')).toBe('true')

    document.body.querySelector<HTMLButtonElement>('[aria-label="小时减少 1"]')?.click()
    await nextTick()
    expect(document.body.querySelector('[data-slot="time-wheel-panel"] .dl-time-wheel__summary strong')?.textContent).toBe('08:31')
  })

  it('wraps minute fine-tuning across midnight and blocks disabled targets', async () => {
    const wrapper = mount(TimeWheelPanel, {
      attachTo: document.body,
      props: { open: true, modelValue: '23:59', minuteStep: 1, disabledTime: value => value === '00:01' },
    })
    wrappers.push(wrapper)
    await nextTick()

    document.body.querySelector<HTMLButtonElement>('[aria-label="分钟增加 1"]')?.click()
    await nextTick()
    expect(document.body.querySelector('[data-slot="time-wheel-panel"] .dl-time-wheel__summary strong')?.textContent).toBe('00:00')
    expect(document.body.querySelector<HTMLButtonElement>('[aria-label="分钟增加 1"]')?.disabled).toBe(true)
  })

  it('prevents applying a disabled time', async () => {
    const wrapper = mount(TimeWheelPanel, {
      attachTo: document.body,
      props: { open: true, modelValue: '23:00', disabledTime: value => value >= '22:00' },
    })
    wrappers.push(wrapper)
    await nextTick()

    const apply = [...document.body.querySelectorAll<HTMLButtonElement>('[data-slot="time-wheel-panel"] footer button')]
      .find(button => button.textContent === '应用')
    expect(apply?.disabled).toBe(true)
  })
})
