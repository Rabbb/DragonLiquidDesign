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

  it('uses the TodoMoe primary appearance tokens for every interaction state', () => {
    const wrapper = mount(DlButton, { props: { variant: 'primary' } })
    const classes = wrapper.get('button').classes()

    expect(classes).toContain('[background:var(--dl-button-primary-bg)]')
    expect(classes).toContain('hover:[background:var(--dl-button-primary-bg-hover)]')
    expect(classes).toContain('active:[background:var(--dl-button-primary-bg-active)]')
    expect(classes).toContain('[box-shadow:var(--dl-button-primary-shadow)]')
  })
})
