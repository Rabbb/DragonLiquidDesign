import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { DlDropdownMenu, DlSelect } from '../managed-components'

globalThis.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} }
HTMLElement.prototype.scrollIntoView = () => {}
const cleanups: (() => void)[] = []
afterEach(() => { cleanups.splice(0).forEach(cleanup => cleanup()); document.body.innerHTML = ''; vi.restoreAllMocks() })

describe.each(['dropdown', 'select'] as const)('%s hover value', kind => {
  async function setup() {
    const options = [{ value:'a', label:'A' },{ value:'b', label:'B' },{ value:'locked',label:'Locked',disabled:true }]
    const changed=vi.fn(), hovered=vi.fn(), selected=vi.fn()
    const attrs={'onUpdate:hoverValue':changed,onHover:hovered,[kind==='dropdown'?'onSelect':'onUpdate:modelValue']:selected}
    const wrapper = kind === 'dropdown'
      ? mount(DlDropdownMenu, { attachTo:document.body, attrs, props:{ open:true,items:options }, slots:{trigger:'<button>Menu</button>'} })
      : mount(DlSelect, { attachTo:document.body, attrs, props:{ open:true,options,modelValue:'a' } })
    cleanups.push(() => wrapper.unmount())
    await flushPromises()
    const item = (label:string) => [...document.querySelectorAll<HTMLElement>(kind === 'dropdown' ? '[role=menuitem]' : '[role=option]')].find(el => el.textContent?.trim().endsWith(label))!
    const pointer = async (label:string) => { const event = new Event('pointermove',{bubbles:true}); Object.defineProperty(event,'pointerType',{value:'mouse'}); item(label).dispatchEvent(event); await flushPromises() }
    const latest = () => changed.mock.calls.at(-1)?.[0]
    return {wrapper,item,pointer,latest,options,hovered,selected}
  }
  it('previews an enabled option without changing selection and clears on leave/close', async () => {
    const {wrapper,item,pointer,latest,hovered,selected} = await setup()
    await pointer('B'); expect(latest()).toBe('b')
    expect(selected).not.toHaveBeenCalled()
    expect(hovered).toHaveBeenLastCalledWith('b')
    item('B').dispatchEvent(new Event('pointerleave')); await flushPromises(); expect(latest()).toBeNull()
    await pointer('Locked'); expect(latest()).toBeNull()
    await pointer('B'); await wrapper.setProps({open:false}); expect(latest()).toBeNull()
  })
  it('clears on keyboard blur, window blur, option removal and unmount', async () => {
    const {wrapper,item,pointer,latest,options} = await setup()
    item('B').focus(); await flushPromises(); expect(latest()).toBe('b')
    item('B').blur(); await flushPromises(); expect(latest()).toBeNull()
    await pointer('B'); window.dispatchEvent(new Event('blur')); expect(latest()).toBeNull()
    await pointer('B'); await wrapper.setProps(kind === 'dropdown' ? {items:options.filter(o=>o.value!=='b')} : {options:options.filter(o=>o.value!=='b')}); expect(latest()).toBeNull()
    await pointer('A'); wrapper.unmount(); expect(latest()).toBeNull(); cleanups.pop()
  })
})
