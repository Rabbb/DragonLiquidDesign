import { describe, expect, it } from 'vitest'
import { applyDlMdxCommand, insertDlMdxSnippet } from './dl-mdx.commands'

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

  it('inserts a real snippet on block boundaries and places the caret after it', () => {
    const result = insertDlMdxSnippet(
      { source: '开头结尾', selection: { start: 2, end: 2 } },
      '+++component:Notice\ntone = "accent"\n+++end',
    )

    expect(result.source).toBe('开头\n+++component:Notice\ntone = "accent"\n+++end\n\n结尾')
    expect(result.selection).toEqual({ start: 47, end: 47 })
  })

  it('does not fake a component when no registered definition was selected', () => {
    const context = { source: '正文', selection: { start: 2, end: 2 } }
    expect(applyDlMdxCommand('component', context)).toEqual({ source: '正文', selection: { start: 2, end: 2 } })
  })
})
