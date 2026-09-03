import { describe, expect, it } from 'vitest'
import { parseDlMdx, parseDlMdxInline, parseDlMdxWithTypeScript, safeDlMdxUrl } from './dl-mdx.parser'

const defaultPolicy = {
  allowExternal: true,
  openExternal: true,
  allowImages: true,
  allowDataImages: false,
}

describe('MarkdownX parser', () => {
  it('parses the migrated document features without generating HTML', () => {
    const document = parseDlMdx(`# 星海档案

> 保留 **未知**，也保留好奇。

- [ ] 整理封面
- [x] 补充标签

| 字段 | 状态 |
| :--- | ---: |
| 标题 | 完成 |

\`\`\`ts
const safe = true
\`\`\`

+++component:Callout
id = "notice"
tone = "accent"
@click = saveNotice
+++end`)

    expect(document.blocks.map(block => block.type)).toEqual([
      'heading', 'blockquote', 'list', 'table', 'code', 'component',
    ])
    expect(document.stats.headingCount).toBe(1)
    expect(document.stats.blockCount).toBe(6)
    expect(document.blocks.at(-1)).toMatchObject({
      type: 'component',
      context: { name: 'Callout', id: 'notice', props: { tone: 'accent' }, events: { click: 'saveNotice' } },
    })
  })

  it('supports nested list blocks and keeps task source lines', () => {
    const document = parseDlMdx('- [ ] 第一项\n  - 子项目\n- [x] 第二项')
    const list = document.blocks[0]
    expect(list).toMatchObject({ type: 'list', items: [{ checked: false, sourceLine: 0 }, { checked: true, sourceLine: 2 }] })
    if (list.type === 'list') expect(list.items[0].children[0]).toMatchObject({ type: 'list' })
  })

  it('converts allowlisted HTML lists and inline tags into safe document nodes', () => {
    const document = parseDlMdx(`<ul>
  <li><strong>第一项</strong></li>
  <li>第二项<ul><li><em>嵌套项</em></li></ul></li>
</ul>`)

    expect(document.blocks).toHaveLength(1)
    expect(document.blocks[0]).toMatchObject({
      type: 'list',
      ordered: false,
      items: [
        { tokens: [{ type: 'strong' }] },
        { children: [{ type: 'list', items: [{ tokens: [{ type: 'em' }] }] }] },
      ],
    })
  })

  it('keeps executable HTML inert while parsing supported inline HTML', () => {
    const tokens = parseDlMdxInline('<strong>安全</strong><script>window.pwned = true</script>')

    expect(tokens[0]).toMatchObject({ type: 'strong' })
    expect(tokens.some(token => token.type === 'text' && token.value.includes('<script>'))).toBe(true)
  })

  it('tokenizes inline styles, links and images as data', () => {
    const tokens = parseDlMdxInline('**粗体**、[链接](https://example.com) 与 ![封面](/cover.webp)')
    expect(tokens.some(token => token.type === 'strong')).toBe(true)
    expect(tokens.some(token => token.type === 'link')).toBe(true)
    expect(tokens.some(token => token.type === 'image')).toBe(true)
  })

  it.each([
    ['Rust', parseDlMdx],
    ['TypeScript', parseDlMdxWithTypeScript],
  ])('preserves author-entered paragraph line breaks with the %s parser', (_, parse) => {
    const document = parse('第一行\n第二行\n第三行')
    const paragraph = document.blocks[0]

    expect(paragraph).toMatchObject({
      type: 'paragraph',
      tokens: [
        { type: 'text', value: '第一行' },
        { type: 'break' },
        { type: 'text', value: '第二行' },
        { type: 'break' },
        { type: 'text', value: '第三行' },
      ],
    })
  })

  it('accepts bounded JSON data for official component props', () => {
    const document = parseDlMdx('+++component:Select\noptions = [{"value":"anime","label":"动画"}]\n+++end')
    expect(document.blocks[0]).toMatchObject({
      type: 'component',
      context: { props: { options: [{ value: 'anime', label: '动画' }] } },
    })
  })

  it('treats a named JSX function invocation as a component block', () => {
    const document = parseDlMdx('# Journal\n\n<Todo_1234 />')

    expect(document.blocks[1]).toMatchObject({
      type: 'component',
      context: { name: 'Todo_1234', props: {}, events: {} },
    })
  })

  it.each([
    ['Rust', parseDlMdx],
    ['TypeScript', parseDlMdxWithTypeScript],
  ])('keeps formal MDX source inside a component default slot with the %s parser', (_, parse) => {
    const source = '+++component:JournalTodo\nsourceTodoId = "todo-1"\n+++slot:default\n## 完整标题\n\n- [ ] 独立的 **MDX** 描述\n+++endslot\n+++end'
    const document = parse(source)

    expect(document.blocks[0]).toMatchObject({
      type: 'component',
      context: {
        name: 'JournalTodo',
        props: { sourceTodoId: 'todo-1' },
        slots: { default: '## 完整标题\n\n- [ ] 独立的 **MDX** 描述' },
      },
    })
  })

  it('blocks executable and obfuscated protocols', () => {
    expect(safeDlMdxUrl('javascript:alert(1)', 'link', defaultPolicy)).toBeUndefined()
    expect(safeDlMdxUrl('java%73cript:alert(1)', 'link', defaultPolicy)).toBeUndefined()
    expect(safeDlMdxUrl('/\\evil.example.com/path', 'link', defaultPolicy)).toBeUndefined()
    expect(safeDlMdxUrl('data:text/html;base64,xxx', 'image', defaultPolicy)).toBeUndefined()
    expect(safeDlMdxUrl('//example.com/path', 'link', { ...defaultPolicy, allowExternal: false })).toBeUndefined()
    expect(safeDlMdxUrl('/cover.webp', 'image', { ...defaultPolicy, allowImages: false })).toBeUndefined()
    expect(safeDlMdxUrl('/anime/42', 'link', defaultPolicy)).toBe('/anime/42')
    expect(safeDlMdxUrl('https://example.com', 'link', defaultPolicy)).toBe('https://example.com')
  })
})
