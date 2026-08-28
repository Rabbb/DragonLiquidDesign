import { describe, expect, it } from 'vitest'
import {
  getDlMdxRustCoreStatus,
  highlightDlMdxCodeWithRust,
  hashDlMdxWithRust,
  inspectDlMdxUrlWithRust,
  parseDlMdxWithRust,
} from './dl-mdx.rust'
import { parseDlMdxWithTypeScript } from './dl-mdx.parser'

describe('Rust MarkdownX WebAssembly core', () => {
  it('loads the committed binary with the expected ABI', () => {
    expect(getDlMdxRustCoreStatus()).toMatchObject({
      engine: 'rust-wasm',
      available: true,
      abiVersion: 2,
    })
    expect(getDlMdxRustCoreStatus().binarySize).toBeGreaterThan(100_000)
    expect(getDlMdxRustCoreStatus().binaryFingerprint).toMatch(/^[a-f0-9]{64}$/)
  })

  it('parses Unicode MarkdownX and keeps duplicate anchors deterministic', () => {
    const document = parseDlMdxWithRust('# 星海档案\n\n# 星海档案\n\n+++component:Card\npadding = "lg"\nitems = [1,2,3]\n+++end')
    expect(document.blocks).toMatchObject([
      { type: 'heading', id: '星海档案' },
      { type: 'heading', id: '星海档案-2' },
      { type: 'component', context: { name: 'Card', props: { padding: 'lg', items: [1, 2, 3] }, sourceLine: 4 } },
    ])
    expect(document.stats).toMatchObject({ lineCount: 8, blockCount: 3, headingCount: 2 })
  })

  it('releases WASM input and output buffers across repeated documents', () => {
    for (let index = 0; index < 200; index += 1) {
      const document = parseDlMdxWithRust(`# Document ${index}\n\n- [ ] task ${index}`)
      expect(document.blocks).toHaveLength(2)
    }
  })

  it('uses Rust for hashing and protocol inspection', () => {
    expect(hashDlMdxWithRust('Dragon Liquid')).toBe(0x3d351322)
    expect(inspectDlMdxUrlWithRust('java%73cript:alert(1)')).toBe('invalid')
    expect(inspectDlMdxUrlWithRust('/archive/42')).toBe('relative')
    expect(inspectDlMdxUrlWithRust('//example.com')).toBe('protocol-relative')
    expect(inspectDlMdxUrlWithRust('https://example.com')).toBe('https')
  })

  it('highlights programming languages without changing or executing source', () => {
    const source = 'const answer: number = 42\nconsole.log("safe") // done'
    const highlighted = highlightDlMdxCodeWithRust(source, 'ts')
    expect(highlighted).toMatchObject({ language: 'typescript', supported: true })
    expect(highlighted.lines).toHaveLength(2)
    expect(highlighted.lines.map(line => line.map(token => token.value).join('')).join('\n')).toBe(source)
    expect(highlighted.lines.flat()).toEqual(expect.arrayContaining([
      expect.objectContaining({ kind: 'keyword', value: 'const' }),
      expect.objectContaining({ kind: 'number', value: '42' }),
      expect.objectContaining({ kind: 'comment', value: '// done' }),
    ]))
  })

  it('falls back to inert text tokens for unknown code languages', () => {
    const source = '<script>alert("still text")</script>'
    const highlighted = highlightDlMdxCodeWithRust(source, 'unknown-language')
    expect(highlighted).toMatchObject({ language: 'text', supported: false })
    expect(highlighted.lines[0]).toEqual([{ kind: 'plain', value: source }])
  })

  it('keeps the Rust document model aligned with the TypeScript fallback', () => {
    const corpus = [
      '# 标题\n\n正文包含 **粗体**、*强调*、[链接](https://example.com) 与 ![封面](/cover.webp)。',
      '> - [ ] 引用任务\n>   - 嵌套项\n\n1. 第一项\n2. 第二项',
      '| 字段 | 状态 |\n| :--- | ---: |\n| 标题 | 完成 |\n\n```ts\nconst safe = true\n```',
      '+++component:Select\nid = "archive"\noptions = [{"value":"anime","label":"动画"}]\n+++end',
    ]
    for (const source of corpus) {
      expect(parseDlMdxWithRust(source)).toEqual(parseDlMdxWithTypeScript(source))
    }
  })
})
