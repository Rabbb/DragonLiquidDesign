import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import DlAccordion from './DlAccordion.vue'
import DlCheckbox from './DlCheckbox.vue'
import DlProgress from './DlProgress.vue'
import DlSwitch from './DlSwitch.vue'
import DlTabs from './DlTabs.vue'

describe('Dragon Liquid Reka primitives', () => {
  it('emits checkbox state changes', async () => {
    const wrapper = mount(DlCheckbox, { props: { label: '追踪更新' } })
    await wrapper.get('button').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
    expect(wrapper.text()).toContain('追踪更新')
  })

  it('emits switch state changes', async () => {
    const wrapper = mount(DlSwitch, { props: { modelValue: false, label: '提醒' } })
    await wrapper.get('button').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
  })

  it('renders accordion items with accessible triggers', () => {
    const wrapper = mount(DlAccordion, {
      props: { items: [{ value: 'story', title: '故事简介', content: '内容' }] },
    })

    expect(wrapper.get('button').attributes('aria-controls')).toBeDefined()
    expect(wrapper.text()).toContain('故事简介')
  })

  it('opens and closes an uncontrolled collapsible accordion item', async () => {
    const wrapper = mount(DlAccordion, {
      props: { items: [{ value: 'story', title: '故事简介', content: '内容' }] },
    })
    const trigger = wrapper.get('button')

    await trigger.trigger('click')
    expect(trigger.attributes('aria-expanded')).toBe('true')

    await trigger.trigger('click')
    expect(trigger.attributes('aria-expanded')).toBe('false')
  })

  it('emits the collapsed state for a controlled accordion', async () => {
    const wrapper = mount(DlAccordion, {
      props: {
        modelValue: 'story',
        items: [{ value: 'story', title: '故事简介', content: '内容' }],
      },
    })

    await wrapper.get('button').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([undefined])
  })

  it('renders the selected tab panel', () => {
    const wrapper = mount(DlTabs, {
      props: {
        modelValue: 'summary',
        items: [
          { value: 'summary', label: '简介', description: '作品信息' },
          { value: 'episodes', label: '剧集', description: '剧集列表' },
        ],
      },
    })

    expect(wrapper.get('[role="tab"][aria-selected="true"]').text()).toBe('简介')
    expect(wrapper.get('[role="tabpanel"]').text()).toContain('作品信息')
  })

  it('clamps progress values to the visual range', () => {
    const wrapper = mount(DlProgress, { props: { modelValue: 120, max: 100, showValue: true } })

    expect(wrapper.text()).toContain('100%')
    expect(wrapper.get('[role="progressbar"]').attributes('aria-valuenow')).toBe('120')
  })

  it('applies migrated progress tone, status and helper styles', () => {
    const wrapper = mount(DlProgress, {
      props: { modelValue: 68, tone: 'muted', status: 'success', helper: '正在同步作品信息' },
    })

    expect(wrapper.get('[data-slot="progress"]').classes()).toContain('dl-progress-tone-muted')
    expect(wrapper.get('[data-slot="progress"]').classes()).toContain('dl-progress-status-success')
    expect(wrapper.text()).toContain('正在同步作品信息')
  })
})
