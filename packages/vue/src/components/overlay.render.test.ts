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

  it('keeps accent tooltips light and magical without collapsing into warning', () => {
    const filename = 'DlTooltip.vue'
    const source = readFileSync(new URL(filename, import.meta.url), 'utf8')
    const accentRule = source.match(/\.dl-tone-accent \{([^}]+)\}/)?.[1]
    const warningRule = source.match(/\.dl-tone-warning \{([^}]+)\}/)?.[1]

    expect(accentRule).toContain('radial-gradient')
    expect(accentRule).toContain('rgba(104, 225, 255, 0.12)')
    expect(accentRule).toContain('rgba(255, 230, 150, 0.18)')
    expect(accentRule).not.toContain('var(--dl-button-primary-bg)')
    expect(warningRule).not.toContain('var(--dl-button-primary-bg)')
  })

  it('keeps warning tooltips in the amber lava range instead of danger red', () => {
    const filename = 'DlTooltip.vue'
    const source = readFileSync(new URL(filename, import.meta.url), 'utf8')
    const warningRule = source.match(/\.dl-tone-warning \{([^}]+)\}/)?.[1]
    const dangerRule = source.match(/\.dl-tone-danger \{([^}]+)\}/)?.[1]

    expect(warningRule).toContain('radial-gradient')
    expect(warningRule).toContain('rgba(255, 193, 92, 0.3)')
    expect(warningRule).not.toContain('255, 112, 112')
    expect(dangerRule).toContain('rgba(76, 28, 38, 0.98)')
  })

  it('gives every tooltip tone the same layered glass structure', () => {
    const filename = 'DlTooltip.vue'
    const source = readFileSync(new URL(filename, import.meta.url), 'utf8')

    for (const tone of ['default', 'accent', 'success', 'warning', 'danger', 'muted']) {
      const rule = source.match(new RegExp(`\\.dl-tone-${tone} \\{([^}]+)\\}`))?.[1]
      expect(rule).toContain('radial-gradient')
      expect(rule).toContain('--dl-tooltip-border:')
      expect(rule).toContain('--dl-tooltip-shadow:')
      expect(rule).toContain('--dl-tooltip-rail:')
    }
  })
})
