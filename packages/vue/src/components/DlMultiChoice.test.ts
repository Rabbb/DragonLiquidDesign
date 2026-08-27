import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import DlMultiChoice from './DlMultiChoice.vue'

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver = ResizeObserverMock

const wrappers: ReturnType<typeof mount>[] = []
function paste(element: Element, value: string) {
  const event = new Event('paste', { bubbles: true, cancelable: true })
  Object.defineProperty(event, 'clipboardData', { value: { getData: () => value } })
  element.dispatchEvent(event)
}
afterEach(() => {
  wrappers.splice(0).forEach(wrapper => wrapper.unmount())
  document.body.innerHTML = ''
})

const options = [
  { label: '前端', options: [{ value: 'vue', label: 'Vue' }, { value: 'solid', label: 'Solid' }] },
  { label: '后端', options: [{ value: 'dotnet', label: '.NET' }, { value: 'rust', label: 'Rust', disabled: true }] },
]

describe('DlMultiChoice', () => {
  it('adds and removes values without closing the panel', async () => {
    const wrapper = mount(DlMultiChoice, { attachTo: document.body, props: { open: true, modelValue: ['vue'], options } })
    wrappers.push(wrapper)
    await nextTick()

    document.body.querySelector<HTMLButtonElement>('[data-choice-value="solid"]')?.click()
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['vue', 'solid']])
    expect(document.body.querySelector('[data-slot="multi-choice-panel"]')).not.toBeNull()
  })

  it('filters grouped options and clears the current selection', async () => {
    const wrapper = mount(DlMultiChoice, { attachTo: document.body, props: { open: true, modelValue: ['vue', 'dotnet'], options, searchable: true, clearable: true } })
    wrappers.push(wrapper)
    await nextTick()

    const input = document.body.querySelector<HTMLInputElement>('[data-slot="multi-choice-panel"] input[type="search"]')!
    input.value = 'dot'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await nextTick()
    expect(document.body.textContent).toContain('.NET')
    expect(document.body.textContent).not.toContain('Solid')

    const clear = [...document.body.querySelectorAll<HTMLButtonElement>('[data-slot="multi-choice-panel"] footer button')].find(button => button.textContent === '清除')
    clear?.click()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[]])
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('adds multiple exact labels from one clipboard operation', async () => {
    const wrapper = mount(DlMultiChoice, { props: { modelValue: ['vue'], options } })
    paste(wrapper.get('.dl-multi-choice__trigger').element, 'Solid, .NET')
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['vue', 'solid', 'dotnet']])
  })
})
