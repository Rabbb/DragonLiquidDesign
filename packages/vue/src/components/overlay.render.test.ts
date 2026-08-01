import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { readFileSync } from 'node:fs'
import DlPopover from './DlPopover.vue'
import DlToast from './DlToast.vue'
import DlTooltip from './DlTooltip.vue'
import DlHoverCard from './DlHoverCard.vue'

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

function mountOverlay(...parameters: Parameters<typeof mount>) {
  const wrapper = mount(...parameters)
  wrappers.push(wrapper)
  return wrapper
}

describe('ported overlay presentation', () => {
  it('renders the popover surface through its portal with the migrated class', async () => {
    mountOverlay(DlPopover, {
      attachTo: document.body,
      props: { open: true, title: '快捷编辑', tone: 'accent' },
      slots: { trigger: '<button>打开</button>', default: '编辑内容' },
    })
    await nextTick()

    const content = document.body.querySelector<HTMLElement>('[data-slot="popover-content"]')
    expect(content).not.toBeNull()
    expect(content?.classList).toContain('dl-popover')
  })

  it('renders the toast in its viewport with the migrated class', async () => {
    mountOverlay(DlToast, {
      attachTo: document.body,
      props: { open: true, title: '保存成功', description: '资料已经更新。', tone: 'success' },
    })
    await nextTick()

    const toast = document.body.querySelector<HTMLElement>('[data-slot="toast"]')
    const viewport = document.body.querySelector<HTMLElement>('[data-dl-layer="notification"]')
    expect(toast).not.toBeNull()
    expect(viewport).not.toBeNull()
    expect(toast?.classList).toContain('dl-toast')
    expect(viewport?.classList).toContain('dl-toast-viewport')
  })

  it('shows the tooltip after keyboard focus with the migrated class', async () => {
    const wrapper = mountOverlay(DlTooltip, {
      attachTo: document.body,
      props: { text: '编辑资料', delayDuration: 0, skipDelayDuration: 0 },
      slots: { default: '<button>编辑</button>' },
    })

    await wrapper.get('button').trigger('focus')
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 20))

    const tooltip = document.body.querySelector<HTMLElement>('[data-slot="tooltip-content"]')
    expect(tooltip).not.toBeNull()
    expect(tooltip?.classList).toContain('dl-tooltip')
  })

  it('shows the hover card through its portal with the migrated class', async () => {
    const wrapper = mountOverlay(DlHoverCard, {
      attachTo: document.body,
      props: { openDelay: 0, closeDelay: 0 },
      slots: { trigger: '<a href="#preview">预览作品</a>', default: '<strong>来自深渊</strong>' },
    })

    await wrapper.get('a').trigger('pointerenter')
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 20))

    const hoverCard = document.body.querySelector<HTMLElement>('[data-slot="hover-card"]')
    expect(hoverCard).not.toBeNull()
    expect(hoverCard?.classList).toContain('dl-hover-card')
  })

  it('keeps portal surface styles global so Reka roots can match them', () => {
    for (const filename of ['DlPopover.vue', 'DlToast.vue', 'DlTooltip.vue', 'DlHoverCard.vue', 'DlDialog.vue', 'DlDrawer.vue']) {
      const source = readFileSync(new URL(filename, import.meta.url), 'utf8')
      expect(source).toContain('<style>')
      expect(source).not.toContain('<style scoped>')
    }
  })

  it('positions the popover energy rail on the edge opposite its arrow', () => {
    const filename = 'DlPopover.vue'
    const source = readFileSync(new URL(filename, import.meta.url), 'utf8')
    expect(source).toContain(".dl-popover[data-side='top']::after")
    expect(source).toContain(".dl-popover[data-side='bottom']::after")
    expect(source).toContain(".dl-popover[data-side='left']::after")
    expect(source).toContain(".dl-popover[data-side='right']::after")
    expect(source).toContain('--dl-popover-rail-vertical')
  })
})
