import { mount } from '@vue/test-utils'
import { CalendarDate } from '@internationalized/date'
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
import DlMonthPicker from './DlMonthPicker.vue'
import DlMonthRangePicker from './DlMonthRangePicker.vue'
import DlYearPicker from './DlYearPicker.vue'
import DlYearRangePicker from './DlYearRangePicker.vue'

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
    expect(panel?.querySelector('[data-slot="date-picker-calendar-panel"]')).not.toBeNull()
    expect(panel?.querySelector('.dl-popover__header')).toBeNull()
    expect(panel?.querySelector('.dl-popover__close')).toBeNull()
  })

  it('switches between year, month, and day panels before committing a date', async () => {
    const wrapper = mountOverlay(DlDatePicker, {
      attachTo: document.body,
      props: { open: true, modelValue: new CalendarDate(2024, 10, 15), locale: 'zh-CN' },
    })
    await nextTick()

    const yearTrigger = document.body.querySelector<HTMLElement>('[data-slot="date-picker-year-trigger"]')
    expect(yearTrigger).not.toBeNull()
    yearTrigger?.click()
    await nextTick()

    expect(document.body.querySelector('[data-slot="year-picker-panel"]')).not.toBeNull()
    expect(document.body.querySelector('.dl-year-picker-grid')?.children).toHaveLength(12)
    expect(document.body.querySelector('.dl-year-picker-grid')?.classList.contains('dl-year-picker-grid--decade')).toBe(false)
    const year = document.body.querySelector<HTMLElement>('[data-reka-year-picker-cell-trigger][data-value^="2025-"]')
    expect(year).not.toBeNull()
    year?.click()
    await nextTick()

    expect(document.body.querySelector('[data-slot="month-picker-panel"]')).not.toBeNull()
    expect(document.body.querySelector('.dl-month-picker-grid')?.children).toHaveLength(12)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    const month = document.body.querySelector<HTMLElement>('[data-reka-month-picker-cell-trigger][data-value^="2025-11-"]')
    expect(month).not.toBeNull()
    month?.click()
    await nextTick()

    expect(document.body.querySelector('[data-slot="date-picker-calendar-panel"]')).not.toBeNull()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    const day = document.body.querySelector<HTMLElement>('[data-reka-calendar-cell-trigger][data-value="2025-11-20"]:not([data-outside-view])')
    expect(day).not.toBeNull()
    day?.click()
    await nextTick()

    const selected = wrapper.emitted('update:modelValue')?.at(-1)?.[0] as CalendarDate
    expect(selected.toString()).toBe('2025-11-20')
    expect(wrapper.emitted('update:open')?.at(-1)).toEqual([false])
  })

  it('renders the month picker as an input-triggered popover', async () => {
    const wrapper = mountOverlay(DlMonthPicker, {
      attachTo: document.body,
      props: { open: true, modelValue: new CalendarDate(2026, 8, 1), locale: 'zh-CN' },
    })
    await nextTick()

    expect(wrapper.get('[data-slot="month-picker"]').text()).toContain('2026年8月')
    expect(document.body.querySelector('[data-slot="month-picker-panel"]')).not.toBeNull()
    expect(document.body.querySelector('.dl-month-picker-grid')?.children).toHaveLength(12)
    document.body.querySelector<HTMLElement>('[data-slot="month-picker-year-trigger"]')?.click()
    await nextTick()

    expect(document.body.querySelector('[data-slot="year-picker-panel"]')).not.toBeNull()
    document.body.querySelector<HTMLElement>('[data-reka-year-picker-cell-trigger][data-value^="2027-"]')?.click()
    await nextTick()

    expect(document.body.querySelector('[data-slot="month-picker-panel"]')).not.toBeNull()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    const month = document.body.querySelector<HTMLElement>('[data-reka-month-picker-cell-trigger][data-value^="2027-09-"]')
    expect(month).not.toBeNull()
    month?.click()
    await nextTick()

    const selected = wrapper.emitted('update:modelValue')?.at(-1)?.[0] as CalendarDate
    expect(selected.toString()).toBe('2027-09-01')
    expect(wrapper.emitted('update:open')?.at(-1)).toEqual([false])
  })

  it('renders the month range picker as a two-panel popover with live range preview', async () => {
    const wrapper = mountOverlay(DlMonthRangePicker, {
      attachTo: document.body,
      props: { open: true, modelValue: { start: new CalendarDate(2025, 11, 1), end: new CalendarDate(2026, 2, 1) }, locale: 'zh-CN' },
    })
    await nextTick()

    expect(wrapper.get('[data-slot="month-range-picker"]').text()).toContain('2025年11月 — 2026年2月')
    const panel = document.body.querySelector<HTMLElement>('.dl-date-picker-panel')
    const calendars = panel?.querySelectorAll<HTMLElement>('[data-slot="month-range-picker-panel"]')
    expect(calendars).toHaveLength(2)
    expect(calendars?.[0].querySelector('[data-slot="month-range-picker-year-trigger"]')?.textContent).toBe('2025年')
    expect(calendars?.[1].querySelector('[data-slot="month-range-picker-year-trigger"]')?.textContent).toBe('2026年')
    expect(calendars?.[0].querySelector('[aria-label="下一年"]')?.hasAttribute('disabled')).toBe(true)
    expect(calendars?.[1].querySelector('[aria-label="上一年"]')?.hasAttribute('disabled')).toBe(true)

    calendars?.[0].querySelector<HTMLElement>('[data-reka-month-picker-cell-trigger][data-value^="2025-12-"]')?.click()
    await nextTick()
    const previewEnd = calendars?.[1].querySelector<HTMLElement>('[data-reka-month-picker-cell-trigger][data-value^="2026-03-"]')
    previewEnd?.dispatchEvent(new Event('pointerenter', { bubbles: true }))
    await nextTick()

    expect(calendars?.[0].querySelector('[data-value^="2025-12-"]')?.hasAttribute('data-selection-start')).toBe(true)
    expect(calendars?.[1].querySelector('[data-value^="2026-01-"]')?.hasAttribute('data-highlighted')).toBe(true)
    expect(previewEnd?.hasAttribute('data-selection-end')).toBe(true)
    previewEnd?.click()
    await nextTick()

    const selected = wrapper.emitted('update:modelValue')?.at(-1)?.[0] as { start: CalendarDate; end: CalendarDate }
    expect(`${selected.start.year}-${selected.start.month}`).toBe('2025-12')
    expect(`${selected.end.year}-${selected.end.month}`).toBe('2026-3')
    expect(wrapper.emitted('update:open')?.at(-1)).toEqual([false])
  })

  it('switches either month range panel through a constrained year picker', async () => {
    const wrapper = mountOverlay(DlMonthRangePicker, {
      attachTo: document.body,
      props: { open: true, modelValue: { start: new CalendarDate(2025, 4, 1), end: new CalendarDate(2028, 8, 1) }, locale: 'zh-CN' },
    })
    await nextTick()

    const calendars = document.body.querySelectorAll<HTMLElement>('[data-slot="month-range-picker-panel"]')
    calendars[0].querySelector<HTMLElement>('[data-slot="month-range-picker-year-trigger"]')?.click()
    await nextTick()

    expect(calendars[0].querySelector('[data-slot="year-picker-panel"]')).not.toBeNull()
    expect(calendars[0].querySelector('[data-reka-year-picker-cell-trigger][data-value^="2028-"]')?.hasAttribute('data-disabled')).toBe(true)
    calendars[0].querySelector<HTMLElement>('[data-reka-year-picker-cell-trigger][data-value^="2027-"]')?.click()
    await nextTick()

    expect(calendars[0].querySelector('[data-slot="month-range-picker-year-trigger"]')?.textContent).toBe('2027年')
    expect(calendars[1].querySelector('[data-slot="month-range-picker-year-trigger"]')?.textContent).toBe('2028年')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('renders the year picker as an input-triggered popover', async () => {
    const wrapper = mountOverlay(DlYearPicker, {
      attachTo: document.body,
      props: { open: true, modelValue: new CalendarDate(2026, 8, 1), locale: 'zh-CN' },
    })
    await nextTick()

    expect(wrapper.get('[data-slot="year-picker"]').text()).toContain('2026年')
    expect(document.body.querySelector('[data-slot="year-picker-panel"]')).not.toBeNull()
    expect(document.body.querySelector('.dl-year-picker-grid')?.children).toHaveLength(10)
    expect(document.body.querySelector('.dl-year-picker-grid')?.classList.contains('dl-year-picker-grid--decade')).toBe(true)
    document.body.querySelector<HTMLElement>('[data-slot="year-picker-decade-trigger"]')?.click()
    await nextTick()

    expect(document.body.querySelector('[data-slot="decade-picker-panel"]')).not.toBeNull()
    expect(document.body.querySelector('.dl-decade-picker-grid')?.children).toHaveLength(10)
    document.body.querySelector<HTMLElement>('[data-dl-decade-picker-cell-trigger][data-value="2030"]')?.click()
    await nextTick()

    expect(document.body.querySelector('[data-slot="year-picker-panel"]')).not.toBeNull()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    const year = document.body.querySelector<HTMLElement>('[data-reka-year-picker-cell-trigger][data-value^="2037-"]')
    expect(year).not.toBeNull()
    year?.click()
    await nextTick()

    const selected = wrapper.emitted('update:modelValue')?.at(-1)?.[0] as CalendarDate
    expect(selected.toString()).toBe('2037-08-01')
    expect(wrapper.emitted('update:open')?.at(-1)).toEqual([false])
  })

  it('renders the year range picker as two non-overlapping pages with live range preview', async () => {
    const wrapper = mountOverlay(DlYearRangePicker, {
      attachTo: document.body,
      props: { open: true, modelValue: { start: new CalendarDate(2025, 1, 1), end: new CalendarDate(2034, 1, 1) }, locale: 'zh-CN' },
    })
    await nextTick()

    expect(wrapper.get('[data-slot="year-range-picker"]').text()).toContain('2025年 — 2034年')
    const panel = document.body.querySelector<HTMLElement>('.dl-date-picker-panel')
    const calendars = panel?.querySelectorAll<HTMLElement>('[data-slot="year-range-picker-panel"]')
    expect(calendars).toHaveLength(2)
    expect(calendars?.[0].querySelector('[role="heading"]')?.textContent).toBe('2020年 - 2029年')
    expect(calendars?.[1].querySelector('[role="heading"]')?.textContent).toBe('2030年 - 2039年')
    expect(calendars?.[0].querySelector('[aria-label="下一页年份"]')?.hasAttribute('disabled')).toBe(true)
    expect(calendars?.[1].querySelector('[aria-label="上一页年份"]')?.hasAttribute('disabled')).toBe(true)

    calendars?.[1].querySelector<HTMLElement>('[data-slot="year-range-picker-decade-trigger"]')?.click()
    await nextTick()
    expect(calendars?.[1].querySelector('[data-slot="decade-picker-panel"]')).not.toBeNull()
    expect(calendars?.[1].querySelector('[data-dl-decade-picker-cell-trigger][data-value="2020"]')?.hasAttribute('disabled')).toBe(true)
    calendars?.[1].querySelector<HTMLElement>('[data-dl-decade-picker-cell-trigger][data-value="2040"]')?.click()
    await nextTick()
    expect(calendars?.[1].querySelector('[data-slot="year-range-picker-decade-trigger"]')?.textContent).toBe('2040年 - 2049年')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    calendars?.[0].querySelector<HTMLElement>('[data-reka-year-picker-cell-trigger][data-value^="2028-"]')?.click()
    await nextTick()
    const previewEnd = calendars?.[1].querySelector<HTMLElement>('[data-reka-year-picker-cell-trigger][data-value^="2044-"]')
    previewEnd?.dispatchEvent(new Event('pointerenter', { bubbles: true }))
    await nextTick()

    expect(calendars?.[0].querySelector('[data-value^="2028-"]')?.hasAttribute('data-selection-start')).toBe(true)
    expect(calendars?.[1].querySelector('[data-value^="2040-"]')?.hasAttribute('data-highlighted')).toBe(true)
    expect(previewEnd?.hasAttribute('data-selection-end')).toBe(true)
    previewEnd?.click()
    await nextTick()

    const selected = wrapper.emitted('update:modelValue')?.at(-1)?.[0] as { start: CalendarDate; end: CalendarDate }
    expect(selected.start.year).toBe(2028)
    expect(selected.end.year).toBe(2044)
    expect(wrapper.emitted('update:open')?.at(-1)).toEqual([false])
  })

  it('uses the same compact panel for the date range picker', async () => {
    const wrapper = mountOverlay(DlDateRangePicker, {
      attachTo: document.body,
      props: { open: true, modelValue: { start: new CalendarDate(2026, 1, 10), end: new CalendarDate(2026, 5, 20) }, locale: 'zh-CN' },
    })
    await nextTick()

    const panel = document.body.querySelector<HTMLElement>('.dl-date-picker-panel')
    expect(panel).not.toBeNull()
    expect(panel?.classList.contains('dl-tone-subtle')).toBe(true)
    expect(panel?.dataset.arrow).toBe('hidden')
    expect(panel?.dataset.sideOffset).toBe('0')
    expect(panel?.querySelector('.dl-popover__arrow')).toBeNull()
    const calendars = panel?.querySelectorAll('[data-slot="range-picker-panel"]')
    expect(calendars).toHaveLength(2)
    expect(calendars?.[0].querySelector('[data-slot="range-picker-calendar-heading"]')?.textContent).toBe('2026年一月')
    expect(calendars?.[1].querySelector('[data-slot="range-picker-calendar-heading"]')?.textContent).toBe('2026年五月')
    expect(panel?.querySelector('.dl-popover__header')).toBeNull()
    expect(panel?.querySelector('.dl-popover__close')).toBeNull()

    calendars?.[0].querySelector<HTMLElement>('[aria-label="下个月"]')?.click()
    await nextTick()
    expect(calendars?.[0].querySelector('[data-slot="range-picker-calendar-heading"]')?.textContent).toBe('2026年二月')
    expect(calendars?.[1].querySelector('[data-slot="range-picker-calendar-heading"]')?.textContent).toBe('2026年五月')

    calendars?.[0].querySelector<HTMLElement>('[data-reka-calendar-cell-trigger][data-value="2026-02-12"]:not([data-outside-view])')?.click()
    await nextTick()
    const previewEnd = calendars?.[1].querySelector<HTMLElement>('[data-reka-calendar-cell-trigger][data-value="2026-05-15"]:not([data-outside-view])')
    previewEnd?.dispatchEvent(new Event('pointerenter', { bubbles: true }))
    await nextTick()

    expect(calendars?.[0].querySelector('[data-value="2026-02-12"]')?.hasAttribute('data-selection-start')).toBe(true)
    expect(calendars?.[0].querySelector('[data-value="2026-02-20"]')?.hasAttribute('data-highlighted')).toBe(true)
    expect(calendars?.[1].querySelector('[data-value="2026-05-01"]')?.hasAttribute('data-highlighted')).toBe(true)
    expect(previewEnd?.hasAttribute('data-selection-end')).toBe(true)

    previewEnd?.click()
    await nextTick()

    const selected = wrapper.emitted('update:modelValue')?.at(-1)?.[0] as { start: CalendarDate; end: CalendarDate }
    expect(selected.start.toString()).toBe('2026-02-12')
    expect(selected.end.toString()).toBe('2026-05-15')
    expect(wrapper.emitted('update:open')?.at(-1)).toEqual([false])
  })

  it('switches a range panel through year and month pickers without committing a date', async () => {
    const wrapper = mountOverlay(DlDateRangePicker, {
      attachTo: document.body,
      props: { open: true, modelValue: { start: new CalendarDate(2025, 1, 10), end: new CalendarDate(2026, 5, 20) }, locale: 'zh-CN' },
    })
    await nextTick()

    const panel = document.body.querySelector<HTMLElement>('.dl-date-picker-panel')
    const calendars = panel?.querySelectorAll<HTMLElement>('[data-slot="range-picker-panel"]')
    calendars?.[0].querySelector<HTMLElement>('[data-slot="date-range-picker-year-trigger"]')?.click()
    await nextTick()

    expect(calendars?.[0].querySelector('[data-slot="year-picker-panel"]')).not.toBeNull()
    calendars?.[0].querySelector<HTMLElement>('[data-reka-year-picker-cell-trigger][data-value^="2026-"]')?.click()
    await nextTick()

    expect(calendars?.[0].querySelector('[data-slot="month-picker-panel"]')).not.toBeNull()
    const blockedMonth = calendars?.[0].querySelector<HTMLElement>('[data-reka-month-picker-cell-trigger][data-value^="2026-05-"]')
    expect(blockedMonth?.hasAttribute('data-disabled')).toBe(true)
    calendars?.[0].querySelector<HTMLElement>('[data-reka-month-picker-cell-trigger][data-value^="2026-04-"]')?.click()
    await nextTick()

    expect(calendars?.[0].querySelector('[data-slot="range-picker-calendar-heading"]')?.textContent).toBe('2026年四月')
    expect(calendars?.[1].querySelector('[data-slot="range-picker-calendar-heading"]')?.textContent).toBe('2026年五月')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('keeps independent range picker panels ordered and non-overlapping', async () => {
    mountOverlay(DlDateRangePicker, {
      attachTo: document.body,
      props: { open: true, modelValue: { start: new CalendarDate(2026, 1, 10), end: new CalendarDate(2026, 5, 20) }, locale: 'zh-CN' },
    })
    await nextTick()

    const panel = document.body.querySelector<HTMLElement>('.dl-date-picker-panel')
    const calendars = panel?.querySelectorAll('[data-slot="range-picker-panel"]')
    for (let index = 0; index < 4; index++) {
      calendars?.[0].querySelector<HTMLElement>('[aria-label="下个月"]')?.click()
      await nextTick()
    }

    expect(calendars?.[0].querySelector('[data-slot="range-picker-calendar-heading"]')?.textContent).toBe('2026年四月')
    expect(calendars?.[1].querySelector('[data-slot="range-picker-calendar-heading"]')?.textContent).toBe('2026年五月')
    expect(calendars?.[0].querySelector('[aria-label="下个月"]')?.hasAttribute('disabled')).toBe(true)
    expect(calendars?.[1].querySelector('[aria-label="上个月"]')?.hasAttribute('disabled')).toBe(true)

    calendars?.[1].querySelector<HTMLElement>('[aria-label="下个月"]')?.click()
    await nextTick()
    calendars?.[0].querySelector<HTMLElement>('[aria-label="下个月"]')?.click()
    await nextTick()
    expect(calendars?.[0].querySelector('[data-slot="range-picker-calendar-heading"]')?.textContent).toBe('2026年五月')
    expect(calendars?.[1].querySelector('[data-slot="range-picker-calendar-heading"]')?.textContent).toBe('2026年六月')
  })

  it('uses one range picker panel when the available dates stay in one month', async () => {
    mountOverlay(DlDateRangePicker, {
      attachTo: document.body,
      props: { open: true, minValue: new CalendarDate(2026, 2, 5), maxValue: new CalendarDate(2026, 2, 24), locale: 'zh-CN' },
    })
    await nextTick()

    const panel = document.body.querySelector<HTMLElement>('.dl-date-picker-panel')
    const calendars = panel?.querySelectorAll('[data-slot="range-picker-panel"]')
    expect(calendars).toHaveLength(1)
    expect(calendars?.[0].querySelector('[data-slot="range-picker-calendar-heading"]')?.textContent).toBe('2026年二月')
    expect(calendars?.[0].querySelector('[data-value="2026-02-04"]')?.hasAttribute('data-disabled')).toBe(true)
    expect(calendars?.[0].querySelector('[data-value="2026-02-05"]')?.hasAttribute('data-disabled')).toBe(false)
    expect(calendars?.[0].querySelector('[data-value="2026-02-25"]')?.hasAttribute('data-disabled')).toBe(true)
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

  it('moves and resizes the dialog while keeping geometry observable', async () => {
    const wrapper = mountOverlay(DlDialog, {
      attachTo: document.body,
      props: { open: true, title: 'Movable dialog' },
      slots: { default: 'Dialog content' },
    })
    await nextTick()

    const dialog = document.body.querySelector<HTMLElement>('[data-slot="dialog"]')!
    dialog.getBoundingClientRect = () => ({
      x: 280,
      y: 180,
      left: 280,
      top: 180,
      right: 920,
      bottom: 580,
      width: 640,
      height: 400,
      toJSON: () => ({}),
    })

    const header = dialog.querySelector<HTMLElement>('.dl-dialog__header')!
    header.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, button: 0, clientX: 320, clientY: 200 }))
    window.dispatchEvent(new MouseEvent('pointermove', { bubbles: true, clientX: 370, clientY: 235 }))
    window.dispatchEvent(new MouseEvent('pointerup', { bubbles: true }))
    await nextTick()

    expect(dialog.style.left).toBe('330px')
    expect(dialog.style.top).toBe('215px')
    expect(wrapper.emitted('update:position')?.at(-1)).toEqual([{ x: 330, y: 215 }])
    expect(wrapper.emitted('drag-start')).toEqual([[{ x: 280, y: 180 }]])
    expect(wrapper.emitted('drag-end')).toEqual([[{ x: 330, y: 215 }]])

    const resizeHandle = dialog.querySelector<HTMLElement>('[data-slot="dialog-resize-handle"]')!
    resizeHandle.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowDown' }))
    await nextTick()

    expect(dialog.style.width).toBe('640px')
    expect(dialog.style.height).toBe('410px')
    expect(wrapper.emitted('update:dimensions')?.at(-1)).toEqual([{ width: 640, height: 410 }])

    await wrapper.setProps({ open: false })
    expect(wrapper.emitted('update:position')?.at(-1)).toEqual([null])
    expect(wrapper.emitted('update:dimensions')?.at(-1)).toEqual([null])
  })

  it('can opt out of dialog window controls', async () => {
    mountOverlay(DlDialog, {
      attachTo: document.body,
      props: { open: true, title: 'Fixed dialog', draggable: false, resizable: false },
    })
    await nextTick()

    const dialog = document.body.querySelector<HTMLElement>('[data-slot="dialog"]')
    expect(dialog?.dataset.draggable).toBe('false')
    expect(dialog?.dataset.resizable).toBe('false')
    expect(dialog?.querySelector('[data-slot="dialog-drag-handle"]')).toBeNull()
    expect(dialog?.querySelector('[data-slot="dialog-resize-handle"]')).toBeNull()
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
