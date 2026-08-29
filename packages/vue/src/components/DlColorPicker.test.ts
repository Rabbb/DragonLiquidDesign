import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import DlColorPicker from './DlColorPicker.vue'

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

function mountPicker(props: Record<string, unknown> = {}) {
  const wrapper = mount(DlColorPicker, {
    attachTo: document.body,
    props: { modelValue: '#7aa2f7', open: true, ...props },
  })
  wrappers.push(wrapper)
  return wrapper
}

describe('DlColorPicker', () => {
  it('uses the horizontal panel by default and keeps vertical as an explicit layout', async () => {
    mountPicker()
    await nextTick()

    expect(document.body.querySelector('.dl-color-picker-panel')?.classList.contains('is-horizontal')).toBe(true)
    expect(document.body.querySelector('.dl-color-picker-panel__controls')?.getAttribute('data-orientation')).toBe('horizontal')

    wrappers.splice(0).forEach(wrapper => wrapper.unmount())
    document.body.innerHTML = ''
    mountPicker({ orientation: 'vertical' })
    await nextTick()

    expect(document.body.querySelector('.dl-color-picker-panel')?.classList.contains('is-vertical')).toBe(true)
    expect(document.body.querySelector('.dl-color-picker-panel__controls')?.getAttribute('data-orientation')).toBe('vertical')
  })

  it('keeps area changes in a draft until the user confirms', async () => {
    const wrapper = mountPicker()
    await nextTick()

    const input = document.body.querySelector<HTMLInputElement>('.dl-color-picker-panel .dl-color-field__input')
    expect(input).not.toBeNull()
    expect(document.body.querySelector('[data-slot="color-area"]')).not.toBeNull()
    expect(document.body.querySelectorAll('[data-slot="color-slider"]')).toHaveLength(2)
    input!.value = '#f7768e'
    input!.dispatchEvent(new Event('input', { bubbles: true }))
    input!.dispatchEvent(new FocusEvent('blur', { bubbles: true }))
    await nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    document.body.querySelector<HTMLButtonElement>('.dl-color-picker-panel__button.is-primary')?.click()
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['#f7768e'])
    expect(wrapper.emitted('confirm')?.at(-1)).toEqual(['#f7768e'])
  })

  it('discards the draft when cancelled', async () => {
    const wrapper = mountPicker()
    await nextTick()

    const input = document.body.querySelector<HTMLInputElement>('.dl-color-picker-panel .dl-color-field__input')!
    input.value = '#9ece6a'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    input.dispatchEvent(new FocusEvent('blur', { bubbles: true }))
    await nextTick()
    document.body.querySelector<HTMLButtonElement>('.dl-color-picker-panel__button.is-quiet')?.click()
    await nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.emitted('cancel')).toHaveLength(1)
  })
})
