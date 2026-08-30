import { describe, expect, it } from 'vitest'
import { createDlMdxOutline } from './dl-mdx.outline'

describe('MarkdownX document outline', () => {
  it('creates a stable outline from rendered headings and strips inline syntax', () => {
    const outline = createDlMdxOutline('---\ntitle: Hidden\n---\n# Project **Alpha**\n\n## `API` notes\n\n# Project Alpha')

    expect(outline).toEqual([
      { id: 'project-alpha', label: 'Project Alpha', level: 1 },
      { id: 'api-notes', label: 'API notes', level: 2 },
      { id: 'project-alpha-2', label: 'Project Alpha', level: 1 },
    ])
  })
})
