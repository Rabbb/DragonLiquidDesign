import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import {
  DlButton,
  DlInput,
  DlPagination,
  DlPopover,
  getDlComponentBehavior,
  getDlComponentBehaviors,
  type DlComponentRef,
  type DlPropertyChangeEvent,
} from './index'

function control(wrapper: ReturnType<typeof mount>) {
  return wrapper.vm as unknown as DlComponentRef
}

describe('managed component instance behavior', () => {
  it('overrides and resets properties without mutating the parent prop source', async () => {
    const wrapper = mount(DlButton, {
      props: { variant: 'secondary', loading: false },
      slots: { default: '保存' },
    })
    const instance = control(wrapper)

    expect(instance.componentName).toBe('DlButton')
    expect(instance.getProperty('variant')).toBe('secondary')
    expect(instance.setProperties({ variant: 'primary', loading: true }).changed).toEqual(['variant', 'loading'])
    await nextTick()

    expect(wrapper.get('button').attributes('data-variant')).toBe('primary')
    expect(wrapper.get('button').attributes()).toHaveProperty('disabled')
    expect(instance.resetProperties()).toEqual(['variant', 'loading'])
    await nextTick()
    expect(wrapper.get('button').attributes('data-variant')).toBe('secondary')
    expect(wrapper.get('button').attributes()).not.toHaveProperty('disabled')
  })

  it('supports cancelable changes and both template and instance events', async () => {
    const templateChange = vi.fn()
    const templateClick = vi.fn()
    const wrapper = mount(DlButton, {
      attrs: { onPropertyChange: templateChange, onClick: templateClick },
      slots: { default: '执行' },
    })
    const instance = control(wrapper)
    const instanceChange = vi.fn()
    const instanceClick = vi.fn()
    instance.on('propertyChange', instanceChange)
    instance.on('click', instanceClick)
    instance.on('beforePropertyChange', (event: DlPropertyChangeEvent) => {
      if (event.name === 'disabled') event.preventDefault()
    })

    expect(instance.disable()).toBe(false)
    expect(instance.setProperty('loading', true)).toBe(true)
    await wrapper.get('button').trigger('click')

    expect(instance.getProperty('disabled')).toBe(false)
    expect(instanceChange).toHaveBeenCalledOnce()
    expect(templateChange).toHaveBeenCalledOnce()
    expect(instanceClick).toHaveBeenCalledOnce()
    expect(templateClick).toHaveBeenCalledOnce()
  })

  it('focuses and selects native fields through the component instance', async () => {
    const wrapper = mount(DlInput, { attachTo: document.body, props: { modelValue: 'Dragon Liquid' } })
    const instance = control(wrapper)
    const input = wrapper.get('input').element as HTMLInputElement

    expect(await instance.focus()).toBe(true)
    expect(document.activeElement).toBe(input)
    expect(await instance.select()).toBe(true)
    expect(input.selectionStart).toBe(0)
    expect(input.selectionEnd).toBe(input.value.length)
    expect(instance.clear()).toBe(true)
    await nextTick()
    expect(wrapper.get('input').element.value).toBe('')
    wrapper.unmount()
  })

  it('runs component-specific navigation methods and emits v-model updates', async () => {
    const update = vi.fn()
    const wrapper = mount(DlPagination, {
      props: { page: 2, total: 95, itemsPerPage: 10, 'onUpdate:page': update },
    })
    const instance = control(wrapper)

    expect(instance.invoke('next')).toBe(true)
    expect(instance.getValue()).toBe(3)
    expect(update).toHaveBeenLastCalledWith(3)
    expect(instance.invoke('last')).toBe(true)
    expect(instance.getValue()).toBe(10)
    expect(instance.invoke('goTo', 999)).toBe(false)
    await nextTick()
  })

  it('controls overlay visibility through open, close and toggle', async () => {
    const update = vi.fn()
    const wrapper = mount(DlPopover, {
      props: { title: '属性面板', 'onUpdate:open': update },
      slots: { trigger: '<button>打开</button>', default: '内容' },
      global: { stubs: { teleport: true } },
    })
    const instance = control(wrapper)

    expect(instance.open()).toBe(true)
    expect(instance.getProperty('open')).toBe(true)
    expect(update).toHaveBeenLastCalledWith(true)
    expect(instance.toggle()).toBe(true)
    expect(instance.getProperty('open')).toBe(false)
    expect(instance.close()).toBe(false)
    await nextTick()
  })

  it('publishes behavior metadata for all official components', () => {
    expect(getDlComponentBehaviors()).toHaveLength(67)
    const pagination = getDlComponentBehavior('Pagination')
    expect(pagination?.valueProperty).toBe('page')
    expect(pagination?.methods.map(item => item.name)).toContain('goTo')
    expect(getDlComponentBehavior('Button')?.events.map(item => item.name)).toContain('ready')
    expect(getDlComponentBehavior('Button')?.events.map(item => item.name)).toContain('click')
    expect(getDlComponentBehavior('SplitButton')?.events.map(item => item.name)).toContain('click')
  })
})
