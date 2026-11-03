import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import DlAlertDialog from './DlAlertDialog.vue'

const wrappers: ReturnType<typeof mount>[] = []

afterEach(() => {
  wrappers.splice(0).forEach(wrapper => wrapper.unmount())
  document.body.innerHTML = ''
})

async function openDialog(props = {}) {
  const wrapper = mount(DlAlertDialog, {
    attachTo: document.body,
    props: { open: true, title: '删除记录？', description: '确认后删除当前记录。', ...props },
    slots: { default: '<p role="alert">失败后可以重试。</p>' },
  })
  wrappers.push(wrapper)
  await flushPromises()
  return wrapper
}

function button(label: string): HTMLButtonElement {
  const element = Array.from(document.body.querySelectorAll('button')).find(item => item.textContent?.trim() === label)
  if (!element) throw new Error(`找不到按钮：${label}`)
  return element
}

describe('DlAlertDialog', () => {
  it('preserves immediate confirmation and focuses the safe cancel action by default', async () => {
    const wrapper = await openDialog()
    expect(document.activeElement).toBe(button('取消'))

    button('确认').click()
    await flushPromises()

    expect(wrapper.emitted('confirm')).toHaveLength(1)
    expect(wrapper.emitted('update:open')).toEqual([[false]])
  })

  it('keeps asynchronous confirmation open for error feedback and retry until the host closes it', async () => {
    const wrapper = await openDialog({ closeOnConfirm: false })
    button('确认').click()
    await flushPromises()

    expect(wrapper.emitted('confirm')).toHaveLength(1)
    expect(wrapper.emitted('update:open')).toBeUndefined()
    expect(document.body.querySelector('[role="alert"]')?.textContent).toBe('失败后可以重试。')

    await wrapper.setProps({ loading: true })
    await wrapper.setProps({ loading: false })
    button('确认').click()
    await flushPromises()
    expect(wrapper.emitted('confirm')).toHaveLength(2)
    expect(wrapper.emitted('update:open')).toBeUndefined()

    await wrapper.setProps({ open: false })
    await flushPromises()
    expect(document.body.querySelector('[role="alertdialog"]')).toBeNull()
  })

  it('blocks repeated confirmation, cancellation and Escape while loading', async () => {
    const wrapper = await openDialog({ loading: true, closeOnConfirm: false })
    const content = document.body.querySelector<HTMLElement>('[role="alertdialog"]')!

    expect(content.getAttribute('aria-busy')).toBe('true')
    expect(button('确认').disabled).toBe(true)
    expect(button('取消').disabled).toBe(true)
    button('确认').click()
    button('取消').click()
    content.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
    await flushPromises()

    expect(wrapper.emitted('confirm')).toBeUndefined()
    expect(wrapper.emitted('cancel')).toBeUndefined()
    expect(wrapper.emitted('update:open')).toBeUndefined()

    await wrapper.setProps({ loading: false })
    button('取消').click()
    await flushPromises()
    expect(wrapper.emitted('cancel')).toHaveLength(1)
    expect(wrapper.emitted('update:open')).toEqual([[false]])
  })

  it('allows cancellation when confirmation alone is disabled', async () => {
    const wrapper = await openDialog({ confirmDisabled: true })
    expect(button('确认').disabled).toBe(true)
    expect(button('取消').disabled).toBe(false)

    button('确认').click()
    button('取消').click()
    await flushPromises()

    expect(wrapper.emitted('confirm')).toBeUndefined()
    expect(wrapper.emitted('cancel')).toHaveLength(1)
    expect(wrapper.emitted('update:open')).toEqual([[false]])
  })
})
