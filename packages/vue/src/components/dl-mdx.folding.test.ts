import { describe, expect, it } from 'vitest'
import { findDlMdxComponentFoldRangeAtLine, findDlMdxComponentFoldRanges } from './dl-mdx.folding'

describe('MarkdownX component folding', () => {
  it('folds a full component including its editable MDX slot behind the title line', () => {
    const source = [
      '# Journal',
      '',
      '+++component:JournalTodo',
      'title = "完整副本"',
      '+++slot:default',
      '## 正式 MDX',
      '- [ ] 项目',
      '+++endslot',
      '+++end',
      '',
      '正文',
    ].join('\n')

    const [range] = findDlMdxComponentFoldRanges(source)
    expect(source.slice(range.lineFrom, range.from)).toBe('+++component:JournalTodo')
    expect(source.slice(range.from, range.to)).toContain('## 正式 MDX')
    expect(source.slice(range.from, range.to)).toContain('+++end')
    expect(findDlMdxComponentFoldRangeAtLine(source, range.lineFrom)).toEqual(range)
  })

  it('does not treat component examples inside fenced code as editable component blocks', () => {
    const source = '```mdx\n+++component:Demo\n+++end\n```\n\n+++component:Real\n+++end'
    const ranges = findDlMdxComponentFoldRanges(source)

    expect(ranges).toHaveLength(1)
    expect(source.slice(ranges[0].lineFrom, ranges[0].from)).toBe('+++component:Real')
  })
})
