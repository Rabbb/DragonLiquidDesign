import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import DlCalendar from './DlCalendar.vue'

describe('DlCalendar', () => {
  it('renders a fixed month board with scrollable business items', async () => {
    const wrapper = mount(DlCalendar, {
      props: {
        modelValue: '2026-08-28',
        viewValue: '2026-08',
        items: [
          { id: 'one', date: '2026-08-03', title: '整理需求', color: '#71d1ad' },
          { id: 'two', date: '2026-08-03', title: '接口联调', color: '#8fb9e8' },
        ],
      },
    })

    expect(wrapper.findAll('.dl-calendar__day')).toHaveLength(42)
    expect(wrapper.find('[aria-label="2026-08-28"]').classes()).toContain('is-selected')
    expect(wrapper.find('[aria-label="2026-08-03"] .dl-calendar__items').text()).toContain('整理需求')

    await wrapper.find('[aria-label="2026-08-04"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['2026-08-04'])
    await wrapper.find('button[aria-label="下个月"]').trigger('click')
    expect(wrapper.emitted('update:viewValue')?.at(-1)).toEqual(['2026-09'])
  })

  it('emits item movement only after a valid cross-day drop', async () => {
    const wrapper = mount(DlCalendar, {
      props: {
        viewValue: '2026-08',
        items: [{ id: 'move-me', date: '2026-08-03', title: '移动事项' }],
      },
    })
    const transfer = {
      effectAllowed: '',
      dropEffect: '',
      setData: vi.fn(),
      getData: vi.fn(() => 'move-me'),
    }

    await wrapper.find('.dl-calendar__item').trigger('dragstart', { dataTransfer: transfer })
    await wrapper.find('[aria-label="2026-08-04"]').trigger('dragover', { dataTransfer: transfer })
    await wrapper.find('[aria-label="2026-08-04"]').trigger('drop', { dataTransfer: transfer })

    const dropped = wrapper.emitted('item-drop')?.[0]
    expect(dropped?.[0]).toMatchObject({ id: 'move-me' })
    expect(dropped?.[1]).toMatchObject({ key: '2026-08-04' })
  })

  it('uses a roving day focus and provides a keyboard alternative to dragging', async () => {
    const wrapper = mount(DlCalendar, {
      attachTo: document.body,
      props: {
        modelValue: '2026-08-28',
        viewValue: '2026-08',
        items: [{ id: 'move-me', date: '2026-08-28', title: '移动事项' }],
      },
    })
    const selected = wrapper.get('[data-day-key="2026-08-28"]')
    expect(selected.attributes('tabindex')).toBe('0')
    expect(wrapper.findAll('.dl-calendar__day[tabindex="0"]')).toHaveLength(1)

    await selected.trigger('keydown', { key: 'ArrowRight' })
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(document.activeElement?.getAttribute('data-day-key')).toBe('2026-08-29')

    await wrapper.get('.dl-calendar__item').trigger('keydown', { key: 'ArrowDown', altKey: true })
    const moved = wrapper.emitted('item-move')?.at(-1)
    expect(moved?.[1]).toMatchObject({ key: '2026-08-28' })
    expect(moved?.[2]).toMatchObject({ key: '2026-09-04' })
    wrapper.unmount()
  })
})
