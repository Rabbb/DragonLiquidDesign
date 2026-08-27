import { flushPromises, mount } from '@vue/test-utils'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import DlMdx from './DlMdx.vue'
import { createDlMdxRegistry, defineDlMdxComponent } from './dl-mdx.registry'

if (!Range.prototype.getClientRects) {
  Range.prototype.getClientRects = () => ({ length: 0, item: () => null, [Symbol.iterator]: function* () {} }) as DOMRectList
}
if (!Range.prototype.getBoundingClientRect) {
  Range.prototype.getBoundingClientRect = () => new DOMRect()
}
if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('DlMdx', () => {
  it('renders Markdown as Vue nodes and keeps raw HTML inert', () => {
    const wrapper = mount(DlMdx, {
      props: { modelValue: '# 标题\n\n<script>window.pwned = true</script>', mode: 'preview', debounce: 0 },
    })

    expect(wrapper.get('h1').text()).toContain('标题')
    expect(wrapper.find('script').exists()).toBe(false)
    expect(wrapper.text()).toContain('<script>window.pwned = true</script>')
  })

  it('renders safe HTML lists as semantic Vue nodes without copying event attributes', () => {
    const wrapper = mount(DlMdx, {
      props: { modelValue: '<ol start="3"><li onclick="alert(1)"><strong>第三项</strong></li><li>第四项</li></ol>', mode: 'preview', debounce: 0 },
    })

    expect(wrapper.get('ol').attributes('start')).toBe('3')
    expect(wrapper.findAll('li')).toHaveLength(2)
    expect(wrapper.get('strong').text()).toBe('第三项')
    expect(wrapper.get('li').attributes('onclick')).toBeUndefined()
  })

  it('blocks dangerous links in the rendered preview', () => {
    const wrapper = mount(DlMdx, {
      props: { modelValue: '[危险链接](javascript:alert(1))', mode: 'preview', debounce: 0 },
    })

    expect(wrapper.find('a[href^="javascript"]').exists()).toBe(false)
    expect(wrapper.get('.dl-mdx__unsafe-link').text()).toBe('危险链接')
  })

  it('writes task interactions back to the source', async () => {
    const wrapper = mount(DlMdx, {
      props: { modelValue: '- [ ] 整理条目', mode: 'preview', debounce: 0 },
    })

    await wrapper.get('input[type="checkbox"]').setValue(true)
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['- [x] 整理条目'])
  })

  it('writes nested blockquote task interactions back to the original line', async () => {
    const wrapper = mount(DlMdx, {
      props: { modelValue: '> - [ ] 引用内任务', mode: 'preview', debounce: 0 },
    })

    await wrapper.get('input[type="checkbox"]').setValue(true)
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['> - [x] 引用内任务'])
  })

  it('requires an explicit slot before rendering component blocks', () => {
    const source = '+++component:Callout\ntone = "accent"\n+++end'
    const fallback = mount(DlMdx, { props: { modelValue: source, mode: 'preview', debounce: 0 } })
    expect(fallback.text()).toContain('SAFE COMPONENT SLOT')

    const rendered = mount(DlMdx, {
      props: { modelValue: source, mode: 'preview', debounce: 0 },
      slots: { 'component-callout': ({ props }: { props: Record<string, string> }) => `安全插槽：${props.tone}` },
    })
    expect(rendered.text()).toContain('安全插槽：accent')
    expect(rendered.text()).not.toContain('SAFE COMPONENT SLOT')
  })

  it('does not expose a component insertion control without an insertable registry entry', async () => {
    const wrapper = mount(DlMdx, { props: { modelValue: '', mode: 'edit', debounce: 0 } })
    await flushPromises()

    expect(wrapper.find('[data-slot="mdx-component-library-trigger"]').exists()).toBe(false)
    wrapper.unmount()
  })

  it('inserts registered component code, keeps the library open, and restores editor focus', async () => {
    const registry = createDlMdxRegistry([
      defineDlMdxComponent({
        name: 'Notice',
        component: defineComponent(() => () => h('p', 'notice')),
        category: 'general',
        maturity: 'stable',
        description: '真实注册的提示组件',
        defaultProps: { tone: 'accent' },
      }),
    ])
    const wrapper = mount(DlMdx, {
      attachTo: document.body,
      props: { modelValue: '', mode: 'edit', debounce: 0, registry },
    })
    await flushPromises()
    await nextTick()

    await wrapper.get('[data-slot="mdx-component-library-trigger"]').trigger('click')
    await flushPromises()
    await vi.waitFor(() => expect(wrapper.find('.cm-content').exists()).toBe(true))
    const search = document.body.querySelector<HTMLInputElement>('.dl-mdx__component-search input')!
    search.focus()
    document.body.querySelector<HTMLButtonElement>('[data-component-name="Notice"]')!.click()
    await flushPromises()
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([
      '+++component:Notice\ntone = "accent"\n+++end\n',
    ])
    expect(document.body.querySelector('[data-slot="mdx-component-library-window"]')).not.toBeNull()
    expect(document.activeElement?.outerHTML).toContain('cm-content')

    document.body.querySelector<HTMLButtonElement>('[data-component-name="Notice"]')!.click()
    await flushPromises()
    const latestSource = wrapper.emitted('update:modelValue')?.at(-1)?.[0]
    expect(typeof latestSource).toBe('string')
    expect(((latestSource as string).match(/\+\+\+component:Notice/g) ?? [])).toHaveLength(2)
    expect(document.body.querySelector('[data-slot="mdx-component-library-window"]')).not.toBeNull()
    wrapper.unmount()
  })

  it('keeps both split panes stretched to the workspace height', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/styles/index.css'), 'utf8')
    expect(css).toContain('.dl-mdx--split .dl-mdx__preview-pane { max-height: none; }')
    expect(css).toContain('height: 100%;\n  min-width: 0;\n  min-height: 0;')
  })
})
