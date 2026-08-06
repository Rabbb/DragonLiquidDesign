import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { readFileSync } from 'node:fs'
import { DlOverlaySide } from '../types'
import DlPopover from './DlPopover.vue'
import DlToast from './DlToast.vue'
import DlTooltip from './DlTooltip.vue'
import DlHoverCard from './DlHoverCard.vue'
import DlDialog from './DlDialog.vue'
import DlAutocomplete from './DlAutocomplete.vue'
import DlDatePicker from './DlDatePicker.vue'
import DlDateRangePicker from './DlDateRangePicker.vue'

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

function mountOverlay(...parameters: Parameters<typeof mount>) {
  const wrapper = mount(...parameters)
  wrappers.push(wrapper)
  return wrapper
}

describe('ported overlay presentation', () => {
  it('renders a compact date picker panel without the unused header controls', async () => {
    mountOverlay(DlDatePicker, {
      attachTo: document.body,
      props: { open: true },
    })
    await nextTick()

    const panel = document.body.querySelector<HTMLElement>('.dl-date-picker-panel')
    expect(panel).not.toBeNull()
    expect(panel?.classList.contains('dl-tone-subtle')).toBe(true)
    expect(panel?.dataset.arrow).toBe('hidden')
    expect(panel?.dataset.sideOffset).toBe('0')
    expect(panel?.querySelector('.dl-popover__arrow')).toBeNull()
    expect(panel?.querySelector('[data-slot="calendar"]')).not.toBeNull()
    expect(panel?.querySelector('.dl-popover__header')).toBeNull()
    expect(panel?.querySelector('.dl-popover__close')).toBeNull()
  })

  it('uses the same compact panel for the date range picker', async () => {
    mountOverlay(DlDateRangePicker, {
      attachTo: document.body,
      props: { open: true },
    })
    await nextTick()

    const panel = document.body.querySelector<HTMLElement>('.dl-date-picker-panel')
    expect(panel).not.toBeNull()
    expect(panel?.classList.contains('dl-tone-subtle')).toBe(true)
    expect(panel?.dataset.arrow).toBe('hidden')
    expect(panel?.dataset.sideOffset).toBe('0')
    expect(panel?.querySelector('.dl-popover__arrow')).toBeNull()
    expect(panel?.querySelector('[data-slot="range-calendar"]')).not.toBeNull()
    expect(panel?.querySelector('.dl-popover__header')).toBeNull()
    expect(panel?.querySelector('.dl-popover__close')).toBeNull()
  })

  it('aligns the autocomplete surface to the anchor start edge and width', async () => {
    mountOverlay(DlAutocomplete, {
      attachTo: document.body,
      props: { open: true, modelValue: '', suggestions: ['异世界冒险', '异世界日常'] },
    })
    await nextTick()

    const content = document.body.querySelector<HTMLElement>('[data-dl-layer="select"]')
    expect(content).not.toBeNull()
    expect(content?.dataset.align).toBe('start')
    expect(content?.classList).toContain('w-[var(--reka-combobox-trigger-width)]')
    expect(content?.classList).not.toContain('min-w-[var(--reka-autocomplete-trigger-width)]')
  })

  it('reacts to dialog size changes on the teleported surface', async () => {
    const wrapper = mountOverlay(DlDialog, {
      attachTo: document.body,
      props: { open: true, title: 'Dialog size', size: 'sm' },
      slots: { default: 'Dialog content' },
    })
    await nextTick()

    let dialog = document.body.querySelector<HTMLElement>('[data-slot="dialog"]')
    expect(dialog?.dataset.size).toBe('sm')
    expect(dialog?.classList).toContain('dl-dialog--sm')

    await wrapper.setProps({ size: 'lg' })
    await nextTick()

    dialog = document.body.querySelector<HTMLElement>('[data-slot="dialog"]')
    expect(dialog?.dataset.size).toBe('lg')
    expect(dialog?.classList).toContain('dl-dialog--lg')
    expect(dialog?.classList).not.toContain('dl-dialog--sm')
  })

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
    expect(content?.dataset.arrow).toBe('visible')
    expect(content?.dataset.sideOffset).toBe('6')
    const arrow = content?.querySelector<HTMLElement>('.dl-popover__arrow')
    expect(arrow?.tagName).toBe('SPAN')
  })

  it('removes the popover arrow and trigger gap together', async () => {
    mountOverlay(DlPopover, {
      attachTo: document.body,
      props: { open: true, arrow: false },
      slots: { trigger: '<button>打开</button>', default: '贴近触发器的内容' },
    })
    await nextTick()

    const content = document.body.querySelector<HTMLElement>('[data-slot="popover-content"]')
    expect(content?.dataset.arrow).toBe('hidden')
    expect(content?.dataset.sideOffset).toBe('0')
    expect(content?.querySelector('.dl-popover__arrow')).toBeNull()
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
    expect(tooltip?.dataset.arrow).toBe('visible')
    expect(tooltip?.dataset.arrowPadding).toBe('8')
    expect(tooltip?.dataset.sideOffset).toBe('4')
  })

  it('removes the tooltip arrow and its default gap together', async () => {
    mountOverlay(DlTooltip, {
      attachTo: document.body,
      props: { open: true, text: '无箭头提示', arrow: false },
      slots: { default: '<button>查看提示</button>' },
    })
    await nextTick()

    const tooltip = document.body.querySelector<HTMLElement>('[data-slot="tooltip-content"]')
    expect(tooltip?.dataset.arrow).toBe('hidden')
    expect(tooltip?.dataset.sideOffset).toBe('0')
    expect(tooltip?.querySelector('.dl-tooltip__arrow')).toBeNull()
  })

  it('keeps an arrow mounted with safe padding for edge-aligned tooltips', async () => {
    mountOverlay(DlTooltip, {
      attachTo: document.body,
      props: { open: true, text: '边缘方位', side: DlOverlaySide.TopLeft, arrowPadding: 12 },
      slots: { default: '<button>固定锚点</button>' },
    })
    await nextTick()

    const tooltip = document.body.querySelector<HTMLElement>('[data-slot="tooltip-content"]')
    expect(tooltip?.dataset.arrowPadding).toBe('12')
    expect(tooltip?.querySelector('.dl-tooltip__arrow')).not.toBeNull()
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
