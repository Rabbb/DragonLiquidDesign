import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import DlMdxTemplate from './DlMdxTemplate'
import { createDlMdxRegistry, defineDlMdxComponent } from './dl-mdx.registry'
import { evaluateDlMdxTemplateExpression, parseDlMdxTemplate, parseDlMdxTemplateExpression } from './dl-mdx.template'

const TestShell = defineComponent({
  props: { siteName: String, navigation: Array, activePath: String },
  emits: ['navigate'],
  setup(props, { slots }) { return () => h('section', { class: 'test-shell' }, [h('b', props.siteName), slots.default?.(), slots.footer?.()]) },
})

const registry = createDlMdxRegistry([
  defineDlMdxComponent({
    name: 'SiteShell',
    component: TestShell,
    eventSchema: { navigate: {} },
  }),
])

describe('DL-MDX function templates', () => {
  it('evaluates safe data expressions without function execution', () => {
    const expression = parseDlMdxTemplateExpression('$dlx.data.user.active && ($dlx.state.count + 2 >= 4 ? $dlx.data.user.name : "Guest")')
    expect(evaluateDlMdxTemplateExpression(expression, { $dlx: { data: { user: { active: true, name: 'Fern' } }, state: { count: 2 } } })).toBe('Fern')
    expect(evaluateDlMdxTemplateExpression(parseDlMdxTemplateExpression('user.constructor'), { user: {} })).toBeUndefined()
    expect(() => parseDlMdxTemplateExpression('danger()')).toThrow()
  })

  it('parses functions, local bindings, control flow and project slots', () => {
    const source = `
function RouteTitle({ route }) {
  const title = route.title ?? "Untitled";
  return <h1>{title}</h1>;
}

export default function Layout() {
  return (
    <SiteShell siteName={$dlx.project.name} navigation={$dlx.navigation} activePath={$dlx.route.path} onNavigate={$dlx.actions.navigate}>
      <If when={$dlx.env.preview}><span>Preview</span><Else><span>Published</span></Else></If>
      <RouteTitle route={$dlx.route} />
      <For each={$dlx.navigation} as="group"><small>{group.label}</small></For>
      <Slot name="page" />
      <Fill name="footer"><span>{$dlx.project.version}</span></Fill>
    </SiteShell>
  );
}`
    const program = parseDlMdxTemplate(source, registry)
    expect(program.diagnostics).toEqual([])
    expect(program.entry).toBe('Layout')
    expect(Object.keys(program.functions)).toEqual(['RouteTitle', 'Layout'])
  })

  it('renders a user-owned master page with external environment data', () => {
    const navigate = vi.fn()
    const wrapper = mount(DlMdxTemplate, {
      props: {
        registry,
        source: `export default function Layout() {
          return <SiteShell siteName={$dlx.project.name} navigation={$dlx.navigation} activePath={$dlx.route.path} onNavigate={$dlx.actions.navigate}>
            <If when={$dlx.env.preview}><span class="preview">Draft</span></If>
            <For each={$dlx.navigation} as="group"><i>{group.label}</i></For>
            <Slot name="page" />
            <Fill name="footer"><small>{$dlx.project.version}</small></Fill>
          </SiteShell>;
        }`,
        context: {
          project: { name: 'Living Aurora', version: '0.2.0' },
          navigation: [{ label: 'Main' }, { label: 'Notes' }],
          route: { path: '/notes' },
          env: { preview: true },
          actions: { navigate },
        },
      },
      slots: { page: () => h('article', 'Editable page') },
    })

    expect(wrapper.find('.test-shell > b').text()).toBe('Living Aurora')
    expect(wrapper.find('.preview').text()).toBe('Draft')
    expect(wrapper.findAll('.test-shell > i').map(node => node.text())).toEqual(['Main', 'Notes'])
    expect(wrapper.find('article').text()).toBe('Editable page')
    expect(wrapper.find('footer')).toBeDefined()
    expect(wrapper.text()).toContain('0.2.0')
  })

  it('reports unknown components and malformed JSX', () => {
    expect(parseDlMdxTemplate('export default function App() { return <Missing /> }', registry).diagnostics[0]?.code).toBe('template.component.unknown')
    expect(parseDlMdxTemplate('export default function App() { return <div>broken</span> }', registry).diagnostics[0]?.code).toBe('template.syntax')
  })

  it('reserves the $dlx runtime namespace against local shadowing', () => {
    expect(parseDlMdxTemplate('export default function App() { const $dlx = {}; return <main /> }').diagnostics[0]?.message).toContain('保留字')
    expect(parseDlMdxTemplate('export default function App({ $dlx }) { return <main /> }').diagnostics[0]?.message).toContain('自动提供')
  })
})
