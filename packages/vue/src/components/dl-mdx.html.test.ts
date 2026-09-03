import { describe, expect, it, vi } from 'vitest'
import { convertDlHtmlToMdx } from './dl-mdx.html'

describe('convertDlHtmlToMdx', () => {
  it('converts common rich HTML into readable MarkdownX', async () => {
    const result = await convertDlHtmlToMdx(`
      <h2>需求说明</h2>
      <p>第一行<br>第二行，包含 <strong>重点</strong> 和 <a href="https://todo.moe">链接</a>。</p>
      <ul><li>班级</li><li>学生<ul><li>张三</li></ul></li></ul>
      <table><tr><th>字段</th><th>值</th></tr><tr><td>城市</td><td>上海</td></tr></table>
    `)

    expect(result.mdx).toContain('## 需求说明')
    expect(result.mdx).toContain('第一行  \n第二行，包含 **重点** 和 [链接](https://todo.moe)')
    expect(result.mdx).toContain('- 学生\n  - 张三')
    expect(result.mdx).toContain('| 字段 | 值 |\n| --- | --- |\n| 城市 | 上海 |')
  })

  it('uploads pasted images and writes the returned attachment URL', async () => {
    const upload = vi.fn(async input => ({
      id: 'image-1',
      url: 'https://todo.moe/api/todo-management/mdx-files/content/00000000-0000-0000-0000-000000000001/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      contentType: input.contentType,
    }))
    const result = await convertDlHtmlToMdx(
      '<p>截图</p><img alt="界面截图" src="data:image/png;base64,iVBORw0KGgo=">',
      { attachmentAdapter: { upload } },
    )

    expect(upload).toHaveBeenCalledOnce()
    expect(upload.mock.calls[0]?.[0].blob).toBeInstanceOf(Blob)
    expect(result.attachments).toHaveLength(1)
    expect(result.failures).toEqual([])
    expect(result.mdx).toContain('![界面截图](https://todo.moe/api/todo-management/mdx-files/content/')
  })

  it('removes executable HTML and does not preserve unsafe URLs', async () => {
    const result = await convertDlHtmlToMdx('<script>alert(1)</script><p><a href="javascript:alert(1)">危险</a><img src="javascript:x"></p>')
    expect(result.mdx).toBe('危险')
  })
})
