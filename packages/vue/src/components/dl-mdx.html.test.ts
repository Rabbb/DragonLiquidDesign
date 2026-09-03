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

  it('infers semantic formatting and list levels from Word-style HTML', async () => {
    const result = await convertDlHtmlToMdx(`
      <p class="MsoHeading2">接口说明</p>
      <p><span style="font-weight: 700; background-color: yellow">重要内容</span>和<span style="text-decoration: underline">下划线</span></p>
      <p class="MsoListParagraph" style="mso-list:l0 level1 lfo1"><span style="mso-list:Ignore">1.&nbsp;</span>第一项</p>
      <p class="MsoListParagraph" style="mso-list:l0 level2 lfo1"><span style="mso-list:Ignore">a.&nbsp;</span>子项</p>
    `)

    expect(result.mdx).toContain('## 接口说明')
    expect(result.mdx).toContain('<mark>**重要内容**</mark>和<u>下划线</u>')
    expect(result.mdx).toContain('1. 第一项\n  1. 子项')
  })

  it('flattens merged table cells and keeps column alignment', async () => {
    const result = await convertDlHtmlToMdx(`
      <table>
        <tr><th rowspan="2" style="text-align:center">班级</th><th colspan="2">学生</th></tr>
        <tr><th>姓名</th><th style="text-align:right">分数</th></tr>
        <tr><td>一班</td><td>张三</td><td>98</td></tr>
      </table>
    `)

    expect(result.mdx).toBe([
      '| 班级 | 学生 |  |',
      '| :---: | --- | ---: |',
      '| 班级 | 姓名 | 分数 |',
      '| 一班 | 张三 | 98 |',
    ].join('\n'))
  })
})
