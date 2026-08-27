import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import FocusNavigator from './FocusNavigator.vue'
import { discoverDlFocusNavigatorZones } from './focus-navigator'

const visibleRect = { x: 0, y: 0, width: 100, height: 32, top: 0, right: 100, bottom: 32, left: 0, toJSON: () => ({}) }
const originalScrollIntoView = HTMLElement.prototype.scrollIntoView

beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, 'getClientRects').mockReturnValue([visibleRect] as unknown as DOMRectList)
  HTMLElement.prototype.scrollIntoView = vi.fn()
})

afterEach(() => {
  vi.restoreAllMocks()
  HTMLElement.prototype.scrollIntoView = originalScrollIntoView
  document.body.innerHTML = ''
})

describe('focus navigator discovery', () => {
  it('groups explicit regions and resolves useful control labels', () => {
    document.body.innerHTML = `
      <nav data-dl-focus-zone="navigation" data-dl-focus-label="顶部导航"><a href="/home">首页</a></nav>
      <aside data-dl-focus-zone="sidebar" aria-label="项目侧栏"><button>需求列表</button></aside>
      <main data-dl-focus-zone="content" data-dl-focus-label="内容"><label>标题<input /></label><button aria-label="保存项目">保存</button></main>
    `
    const zones = discoverDlFocusNavigatorZones({ scope: document.body })
    expect(zones.map(zone => zone.label)).toEqual(['顶部导航', '项目侧栏', '内容'])
    expect(zones.map(zone => zone.icon)).toEqual(['◇', '◇', '◇'])
    expect(zones[2].targets.map(target => target.label)).toEqual(['标题', '保存项目'])
  })

  it('discovers semantic navigation, sidebar and content when no annotations exist', () => {
    document.body.innerHTML = '<header><nav><a href="/">首页</a></nav></header><aside><button>筛选</button></aside><main><input aria-label="搜索" /></main>'
    const zones = discoverDlFocusNavigatorZones({ scope: document.body })
    expect(zones.map(zone => zone.id)).toEqual(['top-navigation', 'sidebar', 'content'])
  })
})

describe('FocusNavigator', () => {
  it('captures arrows before controls and focuses the selected target when Alt is released', async () => {
    document.body.innerHTML = `
      <div id="app-shell">
        <nav data-dl-focus-zone="navigation" data-dl-focus-label="导航"><button id="home">首页</button><button id="calendar">日历</button></nav>
        <main data-dl-focus-zone="content" data-dl-focus-label="内容"><input id="search" aria-label="搜索" /><button id="save">保存</button></main>
      </div>
    `
    const calendar = document.querySelector<HTMLElement>('#calendar')!
    calendar.focus()
    const swallowed = vi.fn()
    calendar.addEventListener('keydown', swallowed)

    const wrapper = mount(FocusNavigator, { attachTo: document.body, props: { scope: '#app-shell' } })
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'j', altKey: true, bubbles: true }))
    await nextTick()
    expect(document.body.querySelector('[data-slot="focus-navigator"]')).not.toBeNull()

    calendar.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', altKey: true, bubbles: true }))
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', altKey: true, bubbles: true }))
    expect(swallowed).not.toHaveBeenCalled()
    window.dispatchEvent(new KeyboardEvent('keyup', { key: 'Alt', bubbles: true }))
    await nextTick()

    expect(document.activeElement).toBe(document.querySelector('#save'))
    expect(document.body.querySelector('[data-slot="focus-navigator"]')).toBeNull()
    wrapper.unmount()
  })

  it('restores the original focus when Escape cancels navigation', async () => {
    document.body.innerHTML = '<main id="scope" data-dl-focus-zone="content"><button id="first">第一项</button><button>第二项</button></main>'
    const first = document.querySelector<HTMLElement>('#first')!
    first.focus()
    const wrapper = mount(FocusNavigator, { attachTo: document.body, props: { scope: '#scope' } })
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'j', altKey: true, bubbles: true }))
    await nextTick()
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await nextTick()
    expect(document.activeElement).toBe(first)
    wrapper.unmount()
  })
})
