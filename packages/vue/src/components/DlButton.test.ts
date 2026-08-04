import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import DlButton from './DlButton.vue'

describe('DlButton', () => {
  it('renders content and native button semantics', () => {
    const wrapper = mount(DlButton, {
      props: { type: 'submit', variant: 'primary' },
      slots: { default: '保存影片' },
    })

    expect(wrapper.get('button').text()).toContain('保存影片')
    expect(wrapper.get('button').attributes('type')).toBe('submit')
    expect(wrapper.get('button').attributes('data-slot')).toBe('button')
  })

  it('disables the action while loading', () => {
    const wrapper = mount(DlButton, { props: { loading: true } })
    expect(wrapper.get('button').attributes('disabled')).toBeDefined()
    expect(wrapper.get('button').attributes('aria-busy')).toBe('true')
  })

  it('uses the secondary style when variant is omitted', () => {
    const wrapper = mount(DlButton, { slots: { default: '默认操作' } })
    const button = wrapper.get('button')

    expect(button.attributes('data-variant')).toBe('secondary')
    expect(button.classes()).toContain('[background:var(--dl-button-secondary-bg)]')
    expect(button.classes()).toContain('hover:border-[var(--dl-button-secondary-border-hover)]')
    expect(button.classes()).not.toContain('[background:var(--dl-button-primary-bg)]')
  })

  it('keeps secondary available as an explicit supporting action too', () => {
    const button = mount(DlButton, { props: { variant: 'secondary' } }).get('button')

    expect(button.attributes('data-variant')).toBe('secondary')
    expect(button.classes()).toContain('[background:var(--dl-button-secondary-bg)]')
  })

  it('uses the TodoMoe primary appearance tokens for every interaction state', () => {
    const wrapper = mount(DlButton, { props: { variant: 'primary' } })
    const classes = wrapper.get('button').classes()

    expect(classes).toContain('[background:var(--dl-button-primary-bg)]')
    expect(classes).toContain('hover:[background:var(--dl-button-primary-bg-hover)]')
    expect(classes).toContain('active:[background:var(--dl-button-primary-bg-active)]')
    expect(classes).toContain('[box-shadow:var(--dl-button-primary-shadow)]')
    expect(classes.some(className => className.includes('translate-y'))).toBe(false)
  })

  it('keeps the public variant and size names while applying semantic state tokens', () => {
    const ghost = mount(DlButton, { props: { variant: 'ghost', size: 'sm' } }).get('button')
    const danger = mount(DlButton, { props: { variant: 'danger', size: 'lg' } }).get('button')

    expect(ghost.attributes('data-variant')).toBe('ghost')
    expect(ghost.attributes('data-size')).toBe('sm')
    expect(ghost.classes()).toContain('hover:[background:var(--dl-button-ghost-bg-hover)]')
    expect(danger.attributes('data-variant')).toBe('danger')
    expect(danger.attributes('data-size')).toBe('lg')
    expect(danger.classes()).toContain('[background:var(--dl-button-danger-bg)]')
  })
})
