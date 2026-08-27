import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { describe, expect, it } from 'vitest'
import DlMdx from './DlMdx.vue'
import { createDlMdxOfficialRegistry, dlMdxOfficialComponents } from './dl-mdx.official'
import { createDlMdxComponentSnippet, createDlMdxRegistry, defineDlMdxComponent } from './dl-mdx.registry'

if (!Range.prototype.getClientRects) {
  Range.prototype.getClientRects = () => ({ length: 0, item: () => null, [Symbol.iterator]: function* () {} }) as DOMRectList
}
if (!Range.prototype.getBoundingClientRect) Range.prototype.getBoundingClientRect = () => new DOMRect()
if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
}

describe('MarkdownX component registry', () => {
  it('registers aliases, supports replacement and remains chainable', () => {
    const first = defineDlMdxComponent({ name: 'Notice', component: defineComponent(() => () => h('p', 'first')) })
    const second = defineDlMdxComponent({ name: 'Notice', aliases: ['Callout'], component: defineComponent(() => () => h('p', 'second')) })
    const registry = createDlMdxRegistry([first])

    expect(registry.resolve('DlNotice')).toBeDefined()
    expect(registry.register(second)).toBe(registry)
    expect(registry.resolve('callout')?.aliases).toEqual(['Callout'])
    expect(registry.entries()).toHaveLength(1)
    expect(registry.unregister('notice')).toBe(true)
    expect(registry.resolve('Callout')).toBeUndefined()
  })

  it('generates insertion code only for real insertable definitions', () => {
    const component = defineComponent(() => () => h('p', 'notice'))
    const notice = defineDlMdxComponent({
      name: 'Notice',
      component,
      defaultProps: { tone: 'accent', count: 2, options: ['one', 'two'] },
    })
    const internal = defineDlMdxComponent({ name: 'InternalOnly', component, insertable: false })

    expect(createDlMdxComponentSnippet(notice)).toBe([
      '+++component:Notice',
      'tone = "accent"',
      'count = 2',
      'options = ["one","two"]',
      '+++end',
    ].join('\n'))
    expect(createDlMdxComponentSnippet(internal)).toBeUndefined()
  })

  it('renders globally registered components and lets local slots override them', () => {
    const registry = createDlMdxRegistry([
      defineDlMdxComponent({
        name: 'Notice',
        component: defineComponent({
          props: { tone: String },
          setup: props => () => h('p', { 'data-tone': props.tone }, '全局定义'),
        }),
      }),
    ])
    const source = '+++component:Notice\ntone = "accent"\nstyle = "display:none"\n+++end'
    const global = mount(DlMdx, { global: { plugins: [registry] }, props: { modelValue: source, mode: 'preview', debounce: 0 } })
    expect(global.get('[data-tone="accent"]').text()).toBe('全局定义')
    expect(global.get('[data-tone="accent"]').attributes('style')).toBeUndefined()

    const local = mount(DlMdx, {
      global: { plugins: [registry] },
      props: { modelValue: source, mode: 'preview', debounce: 0 },
      slots: { 'component-notice': () => h('p', '局部插槽') },
    })
    expect(local.text()).toContain('局部插槽')
    expect(local.text()).not.toContain('全局定义')
  })

  it('ships a unique official definition for every public component', () => {
    expect(dlMdxOfficialComponents).toHaveLength(70)
    expect(new Set(dlMdxOfficialComponents.map(item => item.name)).size).toBe(70)
    expect(dlMdxOfficialComponents.filter(item => item.maturity === 'alpha').length).toBeGreaterThan(10)
    expect(dlMdxOfficialComponents.every(item => item.component || item.render)).toBe(true)
  })

  it('resolves all official component blocks without unsafe fallbacks', () => {
    const registry = createDlMdxOfficialRegistry()
    const source = dlMdxOfficialComponents.map(item => `+++component:${item.name}\n+++end`).join('\n\n')
    const wrapper = mount(DlMdx, {
      global: { plugins: [registry] },
      props: { modelValue: source, mode: 'preview', debounce: 0, taskInteractive: false },
    })

    expect(wrapper.findAll('.dl-mdx__component-block')).toHaveLength(70)
    expect(wrapper.findAll('.dl-mdx__unknown-component')).toHaveLength(0)
  })
})
