import { describe, expect, it } from 'vitest'
import { createDlMdxPageFrontMatter, parseDlMdxFrontMatter } from './dl-mdx.frontmatter'

describe('MarkdownX page front matter', () => {
  it('extracts typed hidden metadata and keeps the visible body pure', () => {
    const result = parseDlMdxFrontMatter('---\ntitle: Guide\nroute: /guide\norder: 4\nnavigation: false\n---\n# Start')
    expect(result.metadata).toEqual({ title: 'Guide', route: '/guide', order: 4, hidden: true })
    expect(result.body).toBe('# Start')
    expect(result.bodyStartLine).toBe(7)
  })

  it('serializes metadata in a stable editable order', () => {
    expect(createDlMdxPageFrontMatter({ title: 'API: Start', route: '/api', group: 'docs', order: 2 })).toBe([
      '---', 'title: "API: Start"', 'route: /api', 'group: docs', 'order: 2', '---',
    ].join('\n'))
  })

  it('accepts database text with harmless leading blank lines', () => {
    const result = parseDlMdxFrontMatter('\n\r\n---\ntitle: Database page\nroute: /database\n---\n\n# Visible title')

    expect(result.metadata).toMatchObject({ title: 'Database page', route: '/database' })
    expect(result.body).toBe('# Visible title')
    expect(result.raw).toContain('title: Database page')
  })
})
