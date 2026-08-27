import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import DlChoicePortal from './DlChoicePortal.vue'

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver = ResizeObserverMock
HTMLElement.prototype.scrollIntoView = () => {}

const wrappers: ReturnType<typeof mount>[] = []
afterEach(() => {
  wrappers.splice(0).forEach(wrapper => wrapper.unmount())
  document.body.innerHTML = ''
})

describe('DlChoicePortal', () => {
  it('filters grouped choices by keywords and commits the selected value', async () => {
    const wrapper = mount(DlChoicePortal, {
      attachTo: document.body,
      props: {
        open: true,
        modelValue: 'vue',
        searchable: true,
        options: [
          { label: '前端', options: [
            { value: 'vue', label: 'Vue 3', keywords: ['v3'] },
            { value: 'react', label: 'React' },
          ] },
          { label: '后端', options: [{ value: 'dotnet', label: '.NET', keywords: ['aspnet'] }] },
        ],
      },
    })
    wrappers.push(wrapper)
    await nextTick()

    const input = document.body.querySelector<HTMLInputElement>('.dl-choice-portal__search input')
    expect(input).not.toBeNull()
    input!.value = 'aspnet'
    input!.dispatchEvent(new Event('input', { bubbles: true }))
    await nextTick()

    const options = [...document.body.querySelectorAll<HTMLButtonElement>('.dl-choice-portal__option')]
    expect(options).toHaveLength(1)
    expect(options[0].textContent).toContain('.NET')
    options[0].click()
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['dotnet'])
    expect(wrapper.emitted('change')?.at(-1)).toEqual(['dotnet'])
    expect(wrapper.emitted('update:open')?.at(-1)).toEqual([false])
  })

  it('offers a sanitized custom value when allowCustom is enabled', async () => {
    const wrapper = mount(DlChoicePortal, {
      attachTo: document.body,
      props: { open: true, allowCustom: true, options: [{ value: 'stable', label: '稳定版' }] },
    })
    wrappers.push(wrapper)
    await nextTick()
    const input = document.body.querySelector<HTMLInputElement>('.dl-choice-portal__search input')!
    input.value = ' nightly '
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await nextTick()

    const custom = document.body.querySelector<HTMLButtonElement>('.dl-choice-portal__option')
    expect(custom?.textContent).toContain('nightly')
    custom?.click()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['nightly'])
  })
})
