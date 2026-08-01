import type {
  DlMdxBlock,
  DlMdxDocument,
  DlMdxInlineToken,
  DlMdxLinkPolicy,
  DlMdxValue,
} from './dl-mdx.types'
import type { DlMdxSecurityPolicy } from './dl-mdx.security'

type SourceLine = { text: string; number: number }

const blockStart = /^(?:\s*$|#{1,6}\s+|```|~~~|>\s?|\s*(?:[-+*]|\d+[.)])\s+|\s*(?:-{3,}|\*{3,}|_{3,})\s*$|\+\+\+component:)/
const listLine = /^(\s*)([-+*]|\d+[.)])\s+(?:\[([ xX])\]\s+)?(.*)$/
const dividerLine = /^\s*(?:(?:-\s*){3,}|(?:\*\s*){3,}|(?:_\s*){3,})$/
const tableDividerCell = /^:?-{3,}:?$/

function textToken(value: string): DlMdxInlineToken[] {
  return value ? [{ type: 'text', value }] : []
}

export function parseDlMdxInline(source: string): DlMdxInlineToken[] {
  const tokens: DlMdxInlineToken[] = []
  let rest = source

  while (rest) {
    let match: RegExpMatchArray | null
    if ((match = rest.match(/^\\([\\`*_[\]{}()#+\-.!>])/))) {
      tokens.push(...textToken(match[1]))
    } else if ((match = rest.match(/^!\[([^\]]*)\]\((\S+?)(?:\s+["']([^"']*)["'])?\)/))) {
      tokens.push({ type: 'image', alt: match[1], src: match[2], title: match[3] })
    } else if ((match = rest.match(/^\[([^\]]+)\]\((\S+?)(?:\s+["']([^"']*)["'])?\)/))) {
      tokens.push({ type: 'link', href: match[2], title: match[3], children: parseDlMdxInline(match[1]) })
    } else if ((match = rest.match(/^<(https?:\/\/[^>]+|mailto:[^>]+)>/i))) {
      tokens.push({ type: 'link', href: match[1], children: textToken(match[1]) })
    } else if ((match = rest.match(/^(`+)([\s\S]*?)\1/))) {
      tokens.push({ type: 'code', value: match[2].trim() })
    } else if ((match = rest.match(/^(\*\*|__)(?=\S)([\s\S]*?\S)\1/))) {
      tokens.push({ type: 'strong', children: parseDlMdxInline(match[2]) })
    } else if ((match = rest.match(/^~~(?=\S)([\s\S]*?\S)~~/))) {
      tokens.push({ type: 'strike', children: parseDlMdxInline(match[1]) })
    } else if ((match = rest.match(/^(\*|_)(?=\S)([\s\S]*?\S)\1/))) {
      tokens.push({ type: 'em', children: parseDlMdxInline(match[2]) })
    } else if ((match = rest.match(/^ {2,}\n/)) || (match = rest.match(/^\\\n/))) {
      tokens.push({ type: 'break' })
    } else if (rest[0] === '\n') {
      tokens.push({ type: 'text', value: ' ' })
      match = ['\n'] as RegExpMatchArray
    } else {
      const next = rest.slice(1).search(/[\\`*_[\]!<~\n]/)
      const length = next < 0 ? rest.length : next + 1
      tokens.push({ type: 'text', value: rest.slice(0, length) })
      match = [rest.slice(0, length)] as RegExpMatchArray
    }
    rest = rest.slice(match[0].length)
  }
  return tokens
}

function splitTableRow(line: string): string[] {
  const trimmed = line.trim().replace(/^\|/, '').replace(/\|$/, '')
  const cells: string[] = []
  let current = ''
  let escaped = false
  for (const character of trimmed) {
    if (escaped) {
      current += character
      escaped = false
    } else if (character === '\\') {
      escaped = true
    } else if (character === '|') {
      cells.push(current.trim())
      current = ''
    } else current += character
  }
  cells.push(current.trim())
  return cells
}

function isTable(lines: SourceLine[], index: number): boolean {
  if (!lines[index]?.text.includes('|') || !lines[index + 1]?.text.includes('|')) return false
  const dividers = splitTableRow(lines[index + 1].text)
  return dividers.length > 0 && dividers.every(cell => tableDividerCell.test(cell.replaceAll(' ', '')))
}

function isDlMdxValue(value: unknown, depth = 0): value is DlMdxValue {
  if (depth > 12) return false
  if (value === null || ['string', 'number', 'boolean'].includes(typeof value)) return true
  if (Array.isArray(value)) return value.length <= 200 && value.every(item => isDlMdxValue(item, depth + 1))
  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
    return entries.length <= 100 && entries.every(([key, item]) => /^[A-Za-z][\w.-]*$/.test(key) && isDlMdxValue(item, depth + 1))
  }
  return false
}

function parseScalar(value: string): DlMdxValue {
  const trimmed = value.trim()
  if (trimmed === 'true') return true
  if (trimmed === 'false') return false
  if (trimmed === 'null') return null
  if (/^-?\d+(?:\.\d+)?$/.test(trimmed)) return Number(trimmed)
  const quoted = trimmed.match(/^(?:"([\s\S]*)"|'([\s\S]*)')$/)
  if (quoted) return (quoted[1] ?? quoted[2]).replace(/\\([\\"'])/g, '$1')
  if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
    try {
      const parsed: unknown = JSON.parse(trimmed)
      if (isDlMdxValue(parsed)) return parsed
    } catch { /* Preserve invalid structured values as inert text. */ }
  }
  return trimmed
}

function stripIndent(lines: SourceLine[], amount: number): SourceLine[] {
  return lines.map(line => ({ ...line, text: line.text.slice(Math.min(amount, line.text.match(/^\s*/)?.[0].length ?? 0)) }))
}

function parseBlocks(lines: SourceLine[], slugCounts: Map<string, number>): DlMdxBlock[] {
  const blocks: DlMdxBlock[] = []
  let index = 0

  while (index < lines.length) {
    const line = lines[index]
    if (!line.text.trim()) { index += 1; continue }

    const component = line.text.trim().match(/^\+\+\+component:([A-Za-z][\w.-]*)\s*$/)
    if (component) {
      const props: Record<string, DlMdxValue> = {}
      let cursor = index + 1
      while (cursor < lines.length && lines[cursor].text.trim() !== '+++end') {
        const property = lines[cursor].text.match(/^\s*([A-Za-z][\w.-]*)\s*=\s*(.+?)\s*$/)
        if (property) props[property[1]] = parseScalar(property[2])
        cursor += 1
      }
      blocks.push({
        type: 'component',
        context: {
          name: component[1],
          id: typeof props.id === 'string' ? props.id : undefined,
          props,
          sourceLine: line.number,
        },
      })
      index = cursor < lines.length ? cursor + 1 : cursor
      continue
    }

    const fence = line.text.match(/^\s*(```+|~~~+)\s*([^\s`]*)?.*$/)
    if (fence) {
      const marker = fence[1][0]
      const size = fence[1].length
      const body: string[] = []
      let cursor = index + 1
      while (cursor < lines.length && !new RegExp(`^\\s*${marker}{${size},}\\s*$`).test(lines[cursor].text)) {
        body.push(lines[cursor].text)
        cursor += 1
      }
      blocks.push({ type: 'code', language: (fence[2] || 'text').toLowerCase(), value: body.join('\n'), id: `code-${line.number}` })
      index = cursor < lines.length ? cursor + 1 : cursor
      continue
    }

    const heading = line.text.match(/^\s*(#{1,6})\s+(.+?)\s*#*\s*$/)
    if (heading) {
      const rawSlug = heading[2].toLowerCase().replace(/[`*_~]/g, '').replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '') || 'section'
      const count = slugCounts.get(rawSlug) ?? 0
      slugCounts.set(rawSlug, count + 1)
      blocks.push({ type: 'heading', level: heading[1].length, id: count ? `${rawSlug}-${count + 1}` : rawSlug, tokens: parseDlMdxInline(heading[2]) })
      index += 1
      continue
    }

    if (dividerLine.test(line.text)) {
      blocks.push({ type: 'divider' })
      index += 1
      continue
    }

    if (/^\s*>/.test(line.text)) {
      const quoted: SourceLine[] = []
      while (index < lines.length && /^\s*>/.test(lines[index].text)) {
        quoted.push({ ...lines[index], text: lines[index].text.replace(/^\s*>\s?/, '') })
        index += 1
      }
      blocks.push({ type: 'blockquote', blocks: parseBlocks(quoted, slugCounts) })
      continue
    }

    const list = line.text.match(listLine)
    if (list) {
      const indent = list[1].length
      const ordered = /^\d/.test(list[2])
      const start = ordered ? Number.parseInt(list[2], 10) : 1
      const items = []
      let cursor = index
      while (cursor < lines.length) {
        const item = lines[cursor].text.match(listLine)
        if (!item || item[1].length !== indent || /^\d/.test(item[2]) !== ordered) break
        const nestedStart = cursor + 1
        let nestedEnd = nestedStart
        while (nestedEnd < lines.length) {
          const nextItem = lines[nestedEnd].text.match(listLine)
          if (nextItem && nextItem[1].length === indent && /^\d/.test(nextItem[2]) === ordered) break
          if (lines[nestedEnd].text.trim() && (lines[nestedEnd].text.match(/^\s*/)?.[0].length ?? 0) <= indent) break
          nestedEnd += 1
        }
        const nested = stripIndent(lines.slice(nestedStart, nestedEnd), indent + 2)
        items.push({
          tokens: parseDlMdxInline(item[4]),
          checked: item[3] === undefined ? undefined : item[3].toLowerCase() === 'x',
          sourceLine: lines[cursor].number,
          children: nested.some(entry => entry.text.trim()) ? parseBlocks(nested, slugCounts) : [],
        })
        cursor = nestedEnd
      }
      blocks.push({ type: 'list', ordered, start, items })
      index = cursor
      continue
    }

    if (isTable(lines, index)) {
      const headers = splitTableRow(line.text)
      const divider = splitTableRow(lines[index + 1].text)
      const alignments = divider.map(cell => {
        const value = cell.replaceAll(' ', '')
        if (value.startsWith(':') && value.endsWith(':')) return 'center'
        if (value.endsWith(':')) return 'right'
        return 'left'
      }) as Array<'left' | 'center' | 'right'>
      const rows: DlMdxInlineToken[][][] = []
      index += 2
      while (index < lines.length && lines[index].text.includes('|') && lines[index].text.trim()) {
        rows.push(splitTableRow(lines[index].text).map(parseDlMdxInline))
        index += 1
      }
      blocks.push({ type: 'table', headers: headers.map(parseDlMdxInline), rows, alignments })
      continue
    }

    const paragraph: string[] = [line.text.trimStart()]
    index += 1
    while (index < lines.length && lines[index].text.trim() && !blockStart.test(lines[index].text) && !isTable(lines, index)) {
      paragraph.push(lines[index].text.trimStart())
      index += 1
    }
    blocks.push({ type: 'paragraph', tokens: parseDlMdxInline(paragraph.join('\n')) })
  }
  return blocks
}

export function parseDlMdx(source: string): DlMdxDocument {
  const normalized = source.replace(/\r\n?/g, '\n')
  const lines = normalized.split('\n').map((text, number) => ({ text, number }))
  const blocks = parseBlocks(lines, new Map())
  const words = (normalized.match(/[\p{L}\p{N}]+/gu) ?? []).length
  const headingCount = blocks.filter(block => block.type === 'heading').length
  return {
    blocks,
    stats: {
      sourceLength: normalized.length,
      lineCount: lines.length,
      blockCount: blocks.length,
      headingCount,
      readingMinutes: Math.max(1, Math.ceil(words / 260)),
    },
  }
}

function normalizedScheme(value: string): string {
  let decoded = value.trim()
  for (let index = 0; index < 2; index += 1) {
    try { decoded = decodeURIComponent(decoded) } catch { break }
  }
  return decoded.replace(/[\u0000-\u0020\u007f-\u009f]/g, '').toLowerCase()
}

export function safeDlMdxUrl(value: string, kind: 'link' | 'image', policy: Required<DlMdxLinkPolicy>, security?: DlMdxSecurityPolicy): string | undefined {
  const candidate = value.trim()
  const inspected = normalizedScheme(candidate)
  const secured = (approved: string) => security?.validate(approved, kind) ?? (security ? undefined : approved)
  if (!candidate || candidate.includes('\\') || inspected.startsWith('javascript:') || inspected.startsWith('vbscript:')) return undefined
  if (kind === 'image' && !policy.allowImages) return undefined
  if (candidate.startsWith('//')) return kind === 'image' || policy.allowExternal ? secured(candidate) : undefined
  if (/^(?:#|\?|\/|\.\/|\.\.\/)/.test(candidate)) return secured(candidate)

  if (kind === 'image' && inspected.startsWith('data:')) {
    return policy.allowImages && policy.allowDataImages && /^data:image\/(?:png|jpe?g|gif|webp|avif);base64,/i.test(candidate) ? secured(candidate) : undefined
  }

  const protocol = inspected.match(/^([a-z][a-z0-9+.-]*):/)?.[1]
  if (!protocol) return secured(candidate)
  if (kind === 'image') return policy.allowImages && ['http', 'https', 'blob'].includes(protocol) ? secured(candidate) : undefined
  if (['mailto', 'tel'].includes(protocol)) return secured(candidate)
  if (['http', 'https'].includes(protocol)) return policy.allowExternal ? secured(candidate) : undefined
  return undefined
}
