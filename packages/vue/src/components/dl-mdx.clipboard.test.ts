import { describe, expect, it } from 'vitest'
import { convertDlMdxToHtml, DL_MDX_CLIPBOARD_TYPE, writeDlMdxClipboard } from './dl-mdx.clipboard'
import { convertDlHtmlToMdx } from './dl-mdx.html'

describe('MarkdownX rich clipboard', () => {
  it('writes semantic HTML while retaining the exact MarkdownX source', () => {
    const source = '# 标题\n\n正文 **重点** 和 <u>下划线</u>。\n\n- 第一项\n- [x] 已完成'
    const payload = new Map<string, string>()
    const clipboard = { setData: (type: string, value: string) => payload.set(type, value) } as unknown as DataTransfer

    writeDlMdxClipboard(clipboard, source)

    expect(payload.get(DL_MDX_CLIPBOARD_TYPE)).toBe(source)
    expect(payload.get('text/markdown')).toBe(source)
    expect(payload.get('text/plain')).toBe(source)
    expect(payload.get('text/html')).toContain('<h1>标题</h1>')
    expect(payload.get('text/html')).toContain('<strong>重点</strong>')
    expect(payload.get('text/html')).toContain('<u>下划线</u>')
    expect(payload.get('text/html')).toContain('type="checkbox" disabled checked')
  })

  it('round-trips common document structure through HTML', async () => {
    const source = '## 说明\n\n第一行\n第二行\n\n| 名称 | 分数 |\n| --- | ---: |\n| 张三 | 98 |'
    const html = convertDlMdxToHtml(source)
    const converted = await convertDlHtmlToMdx(html)

    expect(converted.mdx).toContain('## 说明')
    expect(converted.mdx).toContain('第一行  \n第二行')
    expect(converted.mdx).toContain('| 名称 | 分数 |\n| :--- | ---: |\n| 张三 | 98 |')
  })

  it('does not export unsafe links into rich clipboard HTML', () => {
    expect(convertDlMdxToHtml('[危险](javascript:evil)')).toBe('<p>危险</p>')
  })
})
