import { describe, expect, it } from 'vitest'
import { createDlMdxPageFrontMatter, parseDlMdxFrontMatter } from './dl-mdx.frontmatter'

describe('MarkdownX page front matter', () => {
  it('extracts typed hidden metadata and keeps the visible body pure', () => {
    const result = parseDlMdxFrontMatter('---\ntitle: Guide\nroute: /guide\nkeywords: ["MDX", "keyboard guide"]\norder: 4\nnavigation: false\n---\n# Start')
    expect(result.metadata).toEqual({ title: 'Guide', route: '/guide', keywords: ['MDX', 'keyboard guide'], order: 4, hidden: true })
    expect(result.body).toBe('# Start')
    expect(result.bodyStartLine).toBe(8)
  })

  it('accepts compact comma-separated menu keywords and removes duplicates', () => {
    const result = parseDlMdxFrontMatter('---\nkeywords: 工作, 复盘，工作\n---\n# Daily')

    expect(result.metadata.keywords).toEqual(['工作', '复盘'])
    expect(result.diagnostics).toEqual([])
    expect(createDlMdxPageFrontMatter(result.metadata)).toContain('keywords: ["工作","复盘"]')
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
