import { describe, expect, it } from 'vitest'
import { applyDlMdxCommand } from './dl-mdx.commands'

describe('MarkdownX editor commands', () => {
  it('wraps and unwraps the selected text', () => {
    const bold = applyDlMdxCommand('bold', { source: 'Dragon', selection: { start: 0, end: 6 } })
    expect(bold).toEqual({ source: '**Dragon**', selection: { start: 2, end: 8 } })

    const plain = applyDlMdxCommand('bold', { source: bold.source, selection: bold.selection })
    expect(plain).toEqual({ source: 'Dragon', selection: { start: 0, end: 6 } })
  })

  it('toggles line-oriented task formatting for multiple lines', () => {
    const result = applyDlMdxCommand('task-list', { source: '封面\n标签', selection: { start: 0, end: 5 } })
    expect(result.source).toBe('- [ ] 封面\n- [ ] 标签')
  })

  it('inserts a fenced block while preserving the code selection', () => {
    const result = applyDlMdxCommand('code-block', { source: 'const ok = true', selection: { start: 0, end: 15 } })
    expect(result.source).toContain('```ts\nconst ok = true\n```')
    expect(result.source.slice(result.selection.start, result.selection.end)).toBe('const ok = true')
  })
})
