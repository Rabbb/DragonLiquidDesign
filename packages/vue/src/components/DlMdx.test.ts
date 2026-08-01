import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import DlMdx from './DlMdx.vue'

if (!Range.prototype.getClientRects) {
  Range.prototype.getClientRects = () => ({ length: 0, item: () => null, [Symbol.iterator]: function* () {} }) as DOMRectList
}
if (!Range.prototype.getBoundingClientRect) {
  Range.prototype.getBoundingClientRect = () => new DOMRect()
}

describe('DlMdx', () => {
  it('renders Markdown as Vue nodes and keeps raw HTML inert', () => {
    const wrapper = mount(DlMdx, {
      props: { modelValue: '# 标题\n\n<script>window.pwned = true</script>', mode: 'preview', debounce: 0 },
    })

    expect(wrapper.get('h1').text()).toContain('标题')
    expect(wrapper.find('script').exists()).toBe(false)
    expect(wrapper.text()).toContain('<script>window.pwned = true</script>')
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
})
