import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MdxTextHighlight from './MdxTextHighlight.vue'

describe('MdxTextHighlight', () => {
  it.each(['solid', 'gradient', 'rainbow', 'breathing', 'wavy', 'underline'] as const)(
    'renders the %s highlight effect',
    variant => {
      const wrapper = mount(MdxTextHighlight, {
        props: { variant },
        slots: { default: '重点文本' },
      })

      expect(wrapper.attributes('data-variant')).toBe(variant)
      expect(wrapper.text()).toBe('重点文本')
    },
  )

  it('keeps safe custom colors and rejects CSS injection-like values', () => {
    const wrapper = mount(MdxTextHighlight, {
      props: {
        color: 'url(https://example.com/tracker)',
        colorEnd: 'var(--dl-accent)',
        textColor: '#102018',
        colors: ['#ff5f6d', 'bad;color:red', '#68e1ff'],
        speed: 99,
      },
    })
    const style = wrapper.attributes('style')

    expect(style).not.toContain('url(')
    expect(style).not.toContain('bad;color')
    expect(style).toContain('--dl-highlight-color-end: var(--dl-accent)')
    expect(style).toContain('--dl-highlight-text: #102018')
    expect(style).toContain('--dl-highlight-speed: 12s')
  })
})
