import { defineComponent } from 'vue'
import { describe, expect, it } from 'vitest'
import { analyzeDlMdx, completeDlMdx, extractDlMdxActionSymbols, formatDlMdx, hoverDlMdx } from './dl-mdx.language'
import { createDlMdxRegistry, defineDlMdxComponent } from './dl-mdx.registry'

const registry = createDlMdxRegistry([
  defineDlMdxComponent({
    name: 'Notice',
    component: defineComponent({
      props: { tone: String, count: Number, open: Boolean },
      emits: ['click', 'update:open'],
      setup: () => () => null,
    }),
    description: 'Typed notice component.',
    propSchema: {
      tone: { type: 'string', enum: ['quiet', 'accent'], description: 'Visual tone.' },
      count: { type: 'number', minimum: 1, maximum: 5 },
    },
    eventSchema: { click: { description: 'Runs when the notice is activated.' } },
  }),
])

describe('MarkdownX language service', () => {
  it('validates component properties, actions and document structure', () => {
    const source = [
      '+++component:Notice',
      'tone = "loud"',
      'count = 9',
      'unknown = true',
      '@click = missingAction',
      '+++end',
    ].join('\n')
    const analysis = analyzeDlMdx(source, registry, { actionNames: ['saveNotice'] })

    expect(analysis.diagnostics.map(item => item.code)).toEqual(expect.arrayContaining([
      'prop.enum', 'prop.range', 'prop.unknown', 'action.unknown',
    ]))
    expect(analysis.errorCount).toBeGreaterThan(0)
  })

  it('offers schema-aware properties, event actions and hover documentation', () => {
    const propertySource = '+++component:Notice\nto'
    const properties = completeDlMdx(propertySource, propertySource.length, registry, { actionNames: ['saveNotice'] })
    expect(properties?.items.some(item => item.label === 'tone')).toBe(true)
    expect(properties?.items.some(item => item.label === '@click')).toBe(true)

    const actionSource = '+++component:Notice\n@click = sav'
    const actions = completeDlMdx(actionSource, actionSource.length, registry, { actionNames: ['saveNotice'] })
    expect(actions?.items).toContainEqual(expect.objectContaining({ label: 'saveNotice', kind: 'action' }))

    const hoverSource = '+++component:Notice\ntone = "quiet"\n+++end'
    const position = hoverSource.indexOf('tone') + 1
    expect(hoverDlMdx(hoverSource, position, registry)?.documentation).toContain('Visual tone')
  })

  it('completes, explains and validates hidden page metadata', () => {
    const propertySource = '---\ntit\n---\n# Page'
    const propertyPosition = propertySource.indexOf('tit') + 3
    expect(completeDlMdx(propertySource, propertyPosition, registry)?.items).toContainEqual(expect.objectContaining({ label: 'title', kind: 'property' }))

    const valueSource = '---\nlayout: d\n---\n# Page'
    const valuePosition = valueSource.indexOf('layout: d') + 'layout: d'.length
    expect(completeDlMdx(valueSource, valuePosition, registry)?.items).toContainEqual(expect.objectContaining({ label: 'docs', kind: 'value' }))
    expect(hoverDlMdx(valueSource, valueSource.indexOf('layout') + 2, registry)?.detail).toBe('页面布局')

    const invalid = analyzeDlMdx('---\norder: first\nunknown: value\n---\n# Page', registry)
    expect(invalid.diagnostics.map(item => item.code)).toEqual(expect.arrayContaining(['frontmatter.value', 'frontmatter.key']))
  })

  it('offers the hidden menu keywords field', () => {
    const source = '---\nkey\n---\n# Page'
    const completion = completeDlMdx(source, source.indexOf('key') + 3, undefined, {}, true)

    expect(completion?.items).toEqual(expect.arrayContaining([
      expect.objectContaining({ label: 'keywords', apply: 'keywords: ["notes", "work"]' }),
    ]))
  })

  it('formats MDX deterministically with configurable layout', () => {
    const source = '+++component:Notice\ncount=2\ntone=\'accent\'\n@click=saveNotice\n+++end\n\n\n- item'
    expect(formatDlMdx(source, { equalsSpacing: 'align', quoteStyle: 'double', maxBlankLines: 1 }, registry)).toBe([
      '+++component:Notice',
      'tone   = "accent"',
      'count  = 2',
      '@click = saveNotice',
      '+++end',
      '',
      '- item',
      '',
    ].join('\n'))
  })

  it('treats component slot bodies as editable MDX and preserves them while formatting', () => {
    const contentComponent = defineDlMdxComponent({
      name: 'JournalTodo',
      component: defineComponent({ props: { sourceTodoId: String, contentMdx: String }, setup: () => () => null }),
      contentProp: 'contentMdx',
      propSchema: { sourceTodoId: { type: 'string', required: true } },
    })
    const contentRegistry = createDlMdxRegistry([contentComponent])
    const source = '+++component:JournalTodo\nsourceTodoId="todo-1"\n+++slot:default\n## 标题\n\n- [ ] 正式 MDX\n+++endslot\n+++end'
    const analysis = analyzeDlMdx(source, contentRegistry)
    const formatted = formatDlMdx(source, { equalsSpacing: 'single' }, contentRegistry)

    expect(analysis.errorCount).toBe(0)
    expect(analysis.warningCount).toBe(0)
    expect(formatted).toContain('+++slot:default\n## 标题\n\n- [ ] 正式 MDX\n+++endslot')
  })

  it('extracts exported companion-script actions without executing the script', () => {
    globalThis.__dlMdxScriptExecuted = false
    const source = [
      'globalThis.__dlMdxScriptExecuted = true',
      '/** Save the current notice. */',
      'export async function saveNotice(context) {}',
      'export const archiveNotice = () => {}',
    ].join('\n')

    expect(extractDlMdxActionSymbols(source)).toEqual([
      expect.objectContaining({ name: 'saveNotice', description: 'Save the current notice.' }),
      expect.objectContaining({ name: 'archiveNotice' }),
    ])
    expect(globalThis.__dlMdxScriptExecuted).toBe(false)
  })

  it('completes function templates, runtime values and registered component APIs', () => {
    const tagSource = '---\nrenderer: template\n---\nexport default function Page({ data }) { return <No'
    const tagItems = completeDlMdx(tagSource, tagSource.length, registry)?.items ?? []
    expect(tagItems).toContainEqual(expect.objectContaining({ label: 'Notice', kind: 'component' }))

    const expressionSource = 'export default function Page() { return <p>{$dl'
    const expressionItems = completeDlMdx(expressionSource, expressionSource.length, registry)?.items ?? []
    expect(expressionItems).toContainEqual(expect.objectContaining({ label: '$dlx', kind: 'variable' }))

    const memberSource = 'export default function Page() { return <p>{$dlx.da'
    const memberItems = completeDlMdx(memberSource, memberSource.length, registry)?.items ?? []
    expect(memberItems).toContainEqual(expect.objectContaining({ label: 'data', kind: 'property' }))

    const propertySource = 'export default function Page() { return <Notice to'
    const propertyItems = completeDlMdx(propertySource, propertySource.length, registry)?.items ?? []
    expect(propertyItems).toContainEqual(expect.objectContaining({ label: 'tone', kind: 'property' }))
  })
})

declare global {
  var __dlMdxScriptExecuted: boolean
}
