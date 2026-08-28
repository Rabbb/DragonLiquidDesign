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
})

declare global {
  var __dlMdxScriptExecuted: boolean
}
