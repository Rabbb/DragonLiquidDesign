import { flushPromises, mount } from '@vue/test-utils'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import DlMdx from './DlMdx.vue'
import DlSplitter from './DlSplitter.vue'
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

  it('renders Rust syntax tokens for fenced programming code without using HTML injection', () => {
    const wrapper = mount(DlMdx, {
      props: {
        modelValue: '```ts\nconst answer: number = 42 // <script>alert(1)</script>\n```',
        mode: 'preview',
        debounce: 0,
      },
    })

    const code = wrapper.get('.dl-mdx__code')
    expect(code.attributes('data-language')).toBe('typescript')
    expect(code.attributes('data-highlighted')).toBe('true')
    expect(code.get('.dl-mdx__code-token--keyword').text()).toBe('const')
    expect(code.get('.dl-mdx__code-token--number').text()).toBe('42')
    expect(code.get('.dl-mdx__code-token--comment').text()).toContain('<script>alert(1)</script>')
    expect(code.find('script').exists()).toBe(false)
  })

  it('marks fenced code as a highlighted editor domain', async () => {
    const wrapper = mount(DlMdx, {
      attachTo: document.body,
      props: {
        modelValue: '```javascript\nconst ready = true\n```',
        mode: 'edit',
        debounce: 0,
      },
    })
    await flushPromises()
    await vi.waitFor(() => expect(wrapper.findAll('.cm-dl-code-domain').length).toBeGreaterThanOrEqual(3))
    expect(wrapper.find('.cm-content').text()).toContain('const ready = true')
    wrapper.unmount()
  })

  it('folds MarkdownX component source by default and allows opting out', async () => {
    const wrapper = mount(DlMdx, {
      attachTo: document.body,
      props: {
        modelValue: '+++component:Notice\ntitle = "密集信息"\n+++slot:default\n## 正文\n+++endslot\n+++end',
        mode: 'edit',
        debounce: 0,
      },
    })
    await flushPromises()
    await vi.waitFor(() => expect(wrapper.get('.cm-foldPlaceholder').text()).toContain('组件代码'))

    await wrapper.setProps({ foldComponents: false })
    await vi.waitFor(() => expect(wrapper.find('.cm-foldPlaceholder').exists()).toBe(false))
    expect(wrapper.get('.cm-content').text()).toContain('title = "密集信息"')
    wrapper.unmount()
  })

  it('uses compact document density by default with a comfortable opt-out', async () => {
    const wrapper = mount(DlMdx, { props: { modelValue: '## 标题', mode: 'preview', debounce: 0 } })
    expect(wrapper.classes()).toContain('dl-mdx--compact')

    await wrapper.setProps({ density: 'comfortable' })
    expect(wrapper.classes()).toContain('dl-mdx--comfortable')
    expect(wrapper.classes()).not.toContain('dl-mdx--compact')
  })

  it('uses a borderless lightweight surface for read-only preview documents', () => {
    const wrapper = mount(DlMdx, {
      props: {
        modelValue: '## 嵌入式结果',
        mode: 'preview',
        readonly: true,
        showModeSwitch: false,
        runtimeSymbols: [{ name: 'DLENV.result', kind: 'variable', value: { ready: true } }],
        debounce: 0,
      },
    })

    expect(wrapper.attributes('data-lightweight-preview')).toBe('true')
    expect(wrapper.attributes('data-bordered')).toBe('false')
    expect(wrapper.attributes('data-toolbar')).toBe('false')
    expect(wrapper.attributes('data-status')).toBe('false')
    expect(wrapper.find('.cm-editor').exists()).toBe(false)
    expect(wrapper.find('.dl-mdx__runtime-trigger').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('DRAGON LIQUID · RENDERED DOCUMENT')
  })

  it('allows editable MDX workspaces to opt out of their outer frame', () => {
    const wrapper = mount(DlMdx, {
      props: { modelValue: '# Frameless editor', mode: 'edit', bordered: false, debounce: 0 },
    })
    expect(wrapper.attributes('data-bordered')).toBe('false')
  })

  it('opens DLENV as a fullscreen data table with collapsible JSON values', async () => {
    const wrapper = mount(DlMdx, {
      attachTo: document.body,
      props: {
        modelValue: '# Runtime',
        mode: 'edit',
        runtimeSymbols: [
          { name: 'DLENV.page', kind: 'variable', description: '页面环境', value: { route: '/', flags: ['draft', 'local'] } },
          { name: 'save', kind: 'method', signature: 'save()', description: '保存页面' },
        ],
        debounce: 0,
      },
    })

    const trigger = wrapper.get('.dl-mdx__runtime-trigger')
    expect(trigger.attributes('aria-label')).toBe('查看 DLENV 运行时环境')
    expect(trigger.text()).toBe('')
    expect(trigger.find('svg').exists()).toBe(true)
    await trigger.trigger('click')
    await flushPromises()
    expect(document.body.querySelector('[data-slot="dialog"][data-fullscreen="true"]')).not.toBeNull()
    expect(document.body.textContent).toContain('DLENV 运行时环境')
    expect(document.body.textContent).toContain('DLENV.page')
    expect(document.body.querySelector('.dl-mdx-runtime-tree')).not.toBeNull()

    const table = wrapper.findComponent({ name: 'DlDataTable' })
    table.vm.$emit('cellClick', { row: table.props('rows')[0], field: 'resolvedValue' })
    await flushPromises()
    expect(document.body.textContent).toContain('JSON 数据详情')
    expect(document.body.querySelectorAll('[data-slot="dialog"]')).toHaveLength(2)
    await vi.waitFor(() => expect(document.body.querySelector('.dl-mdx__runtime-json-editor .cm-editor')).not.toBeNull())
    expect(document.body.querySelector('.dl-mdx__runtime-json-editor .cm-foldGutter')).not.toBeNull()
    expect(document.body.querySelector('.dl-mdx__runtime-json-editor .cm-content')?.textContent).toContain('"route"')
    wrapper.unmount()
  })

  it('lets the host hide the mode switch and control edit or preview directly', async () => {
    const wrapper = mount(DlMdx, {
      props: { modelValue: '# Controlled view', mode: 'edit', showModeSwitch: false, debounce: 0 },
    })

    expect(wrapper.attributes('data-mode-switch')).toBe('false')
    expect(wrapper.find('.dl-mdx__mode-switch').exists()).toBe(false)
    expect(wrapper.classes()).toContain('dl-mdx--edit')

    await wrapper.setProps({ mode: 'preview' })
    expect(wrapper.classes()).toContain('dl-mdx--preview')
    expect(wrapper.get('h1').text()).toContain('Controlled view')

    await wrapper.setProps({ showModeSwitch: true })
    expect(wrapper.findAll('.dl-mdx__mode-switch button').map(button => button.text())).toEqual(['编辑', '分栏', '预览'])
    await wrapper.findAll('.dl-mdx__mode-switch button')[0]!.trigger('click')
    expect(wrapper.emitted('update:mode')?.at(-1)).toEqual(['edit'])
  })

  it('keeps literal component values immutable when the website binding policy is enabled', async () => {
    const ValueControl = defineComponent({
      props: { modelValue: Number, disabled: Boolean },
      emits: ['update:modelValue'],
      setup(props, { emit }) {
        return () => h('button', { class: 'literal-value-control', disabled: props.disabled, onClick: () => emit('update:modelValue', (props.modelValue ?? 0) + 1) }, String(props.modelValue))
      },
    })
    const registry = createDlMdxRegistry([
      defineDlMdxComponent({ name: 'ValueControl', component: ValueControl }),
    ])
    const wrapper = mount(DlMdx, {
      props: {
        modelValue: '+++component:ValueControl\nmodelValue = 12\n+++end',
        mode: 'preview',
        lockLiteralBindings: true,
        registry,
        debounce: 0,
      },
    })

    const control = wrapper.get('.literal-value-control')
    expect(control.text()).toBe('12')
    expect(control.attributes('disabled')).toBeDefined()
    expect(control.attributes('data-dl-binding')).toBe('literal-readonly')
    await control.trigger('click')
    expect(control.text()).toBe('12')
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

  it('inserts companion JSX functions instead of inline component data when script execution is enabled', async () => {
    const registry = createDlMdxRegistry([
      defineDlMdxComponent({
        name: 'Notice',
        component: defineComponent({ props: { tone: String }, setup: () => () => h('p', 'notice') }),
        defaultProps: { tone: 'accent' },
      }),
    ])
    const wrapper = mount(DlMdx, {
      attachTo: document.body,
      props: { modelValue: '', scriptValue: '', mode: 'edit', debounce: 0, registry, executeCompanionScript: true },
    })
    await flushPromises()
    await wrapper.get('[data-slot="mdx-component-library-trigger"]').trigger('click')
    await flushPromises()
    document.body.querySelector<HTMLButtonElement>('[data-component-name="Notice"]')!.click()
    await flushPromises()

    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe('<NoticeBlock1 />\n')
    expect(wrapper.emitted('update:scriptValue')?.at(-1)?.[0]).toContain('export function NoticeBlock1()')
    expect(wrapper.emitted('update:scriptValue')?.at(-1)?.[0]).toContain('tone={"accent"}')
    wrapper.unmount()
  })

  it('keeps both split panes stretched to the workspace height', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/styles/index.css'), 'utf8')
    expect(css).toContain('.dl-mdx--split .dl-mdx__preview-pane { max-height: none; }')
    expect(css).toContain('height: 100%;\n  min-width: 0;\n  min-height: 0;')
  })

  it('uses the shared splitter and forwards a local persistence id', () => {
    const wrapper = mount(DlMdx, {
      props: { modelValue: '# Split', mode: 'split', debounce: 0, splitAutoSaveId: 'notebook:user-1' },
    })

    expect(wrapper.get('[data-slot="splitter"]').attributes('data-slot')).toBe('splitter')
    expect(wrapper.getComponent(DlSplitter).props('autoSaveId')).toBe('notebook:user-1')
  })

  it('binds declared component events to host actions without evaluating document code', async () => {
    const action = vi.fn()
    const registry = createDlMdxRegistry([
      defineDlMdxComponent({
        name: 'ActionButton',
        component: defineComponent({
          emits: ['click'],
          setup: (_, { emit }) => () => h('button', { type: 'button', onClick: () => emit('click', 7) }, 'Run'),
        }),
      }),
    ])
    const wrapper = mount(DlMdx, {
      props: {
        modelValue: '+++component:ActionButton\n@click = saveDocument\n+++end',
        mode: 'preview',
        debounce: 0,
        registry,
        actions: { saveDocument: action },
      },
    })

    await wrapper.get('.dl-mdx__component-block button').trigger('click')
    expect(action).toHaveBeenCalledWith(expect.objectContaining({ action: 'saveDocument', event: 'click', payload: [7] }))
    expect(wrapper.emitted('action')?.at(-1)?.[0]).toEqual(expect.objectContaining({ action: 'saveDocument' }))
  })

  it('provides MDX, script and style documents in one editable workspace', async () => {
    const wrapper = mount(DlMdx, {
      attachTo: document.body,
      props: {
        modelValue: '# Main document',
        scriptValue: 'export function saveDocument() {}',
        styleValue: '.document { color: red; }',
        showCompanionDocuments: true,
        mode: 'split',
        debounce: 0,
      },
    })
    await flushPromises()

    expect(wrapper.findAll('.dl-mdx__document-tabs button').map(button => button.text())).toEqual([
      'MDX STRUCTURE', 'TS FUNCTIONS', 'CSS STYLES',
    ])
    expect(wrapper.findAll('.cm-content')).toHaveLength(3)
    expect(wrapper.text()).toContain('Main document')
    expect(document.body.textContent).toContain('saveDocument')
    expect(document.body.textContent).toContain('color: red')
    wrapper.unmount()
  })

  it('executes named JSX functions from the TypeScript companion document without eval', async () => {
    const registry = createDlMdxRegistry([
      defineDlMdxComponent({
        name: 'JournalCard',
        component: defineComponent({ props: { label: String }, setup: props => () => h('article', { class: 'journal-card' }, props.label) }),
      }),
    ])
    const wrapper = mount(DlMdx, {
      props: {
        modelValue: '# Journal\n\n<Todo_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa />',
        scriptValue: 'export function Todo_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa() { return (<JournalCard label={"Visible Todo"} />) }',
        styleValue: '.journal-card { color: red; }',
        executeCompanionScript: true,
        registry,
        mode: 'preview',
        debounce: 0,
      },
    })
    await flushPromises()

    expect(wrapper.get('.journal-card').text()).toBe('Visible Todo')
    expect(wrapper.get('style').text()).toContain('.journal-card')
  })

  it('formats the main document from the toolbar', async () => {
    const registry = createDlMdxRegistry([
      defineDlMdxComponent({ name: 'Notice', component: defineComponent({ props: { tone: String }, setup: () => () => null }) }),
    ])
    const wrapper = mount(DlMdx, {
      attachTo: document.body,
      props: { modelValue: '+++component:Notice\ntone=\'accent\'\n+++end', mode: 'edit', debounce: 0, registry },
    })
    await flushPromises()
    await wrapper.get('button[aria-label="格式化主文档"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe('+++component:Notice\ntone = "accent"\n+++end\n')
    wrapper.unmount()
  })
})
