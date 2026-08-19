import type { DlMdxToolbarAction } from './dl-mdx.types'

export type DlMdxSelection = { start: number; end: number }
export type DlMdxCommandContext = { source: string; selection: DlMdxSelection }
export type DlMdxCommandResult = { source: string; selection: DlMdxSelection }

const normalize = ({ start, end }: DlMdxSelection): DlMdxSelection => start <= end ? { start, end } : { start: end, end: start }

function replace(context: DlMdxCommandContext, value: string, selection?: DlMdxSelection): DlMdxCommandResult {
  const range = normalize(context.selection)
  const source = `${context.source.slice(0, range.start)}${value}${context.source.slice(range.end)}`
  const caret = range.start + value.length
  return { source, selection: selection ?? { start: caret, end: caret } }
}

export function insertDlMdxSnippet(context: DlMdxCommandContext, snippet: string): DlMdxCommandResult {
  const range = normalize(context.selection)
  const normalizedSnippet = snippet.trim()
  if (!normalizedSnippet) return { source: context.source, selection: range }
  const leadingBreak = range.start > 0 && context.source[range.start - 1] !== '\n' ? '\n' : ''
  const trailingBreak = range.end < context.source.length && context.source[range.end] !== '\n' ? '\n' : ''
  const value = `${leadingBreak}${normalizedSnippet}\n${trailingBreak}`
  return replace(context, value)
}

function wrap(context: DlMdxCommandContext, left: string, right = left, placeholder = ''): DlMdxCommandResult {
  const range = normalize(context.selection)
  const selected = context.source.slice(range.start, range.end)
  const inner = selected || placeholder
  const value = `${left}${inner}${right}`
  return replace(context, value, {
    start: range.start + left.length,
    end: range.start + left.length + inner.length,
  })
}

function toggleWrap(context: DlMdxCommandContext, marker: string, placeholder: string): DlMdxCommandResult {
  const range = normalize(context.selection)
  const selected = context.source.slice(range.start, range.end)
  const outsideLeft = context.source.slice(Math.max(0, range.start - marker.length), range.start)
  const outsideRight = context.source.slice(range.end, range.end + marker.length)

  if (outsideLeft === marker && outsideRight === marker) {
    return {
      source: `${context.source.slice(0, range.start - marker.length)}${selected}${context.source.slice(range.end + marker.length)}`,
      selection: { start: range.start - marker.length, end: range.end - marker.length },
    }
  }
  if (selected.startsWith(marker) && selected.endsWith(marker) && selected.length >= marker.length * 2) {
    const inner = selected.slice(marker.length, -marker.length)
    return replace(context, inner, { start: range.start, end: range.start + inner.length })
  }
  return wrap(context, marker, marker, placeholder)
}

function transformLines(context: DlMdxCommandContext, transform: (line: string) => string): DlMdxCommandResult {
  const range = normalize(context.selection)
  const start = context.source.lastIndexOf('\n', Math.max(0, range.start - 1)) + 1
  const nextBreak = context.source.indexOf('\n', range.end)
  const end = nextBreak < 0 ? context.source.length : nextBreak
  const value = context.source.slice(start, end).split('\n').map(transform).join('\n')
  return {
    source: `${context.source.slice(0, start)}${value}${context.source.slice(end)}`,
    selection: { start, end: start + value.length },
  }
}

function togglePrefix(context: DlMdxCommandContext, prefix: string, pattern = prefix): DlMdxCommandResult {
  const range = normalize(context.selection)
  const start = context.source.lastIndexOf('\n', Math.max(0, range.start - 1)) + 1
  const nextBreak = context.source.indexOf('\n', range.end)
  const end = nextBreak < 0 ? context.source.length : nextBreak
  const lines = context.source.slice(start, end).split('\n')
  const allActive = lines.every(line => line.startsWith(pattern))
  const value = lines.map(line => allActive ? line.slice(pattern.length) : `${prefix}${line.replace(/^\s*(?:[-+*]|\d+[.)])\s+/, '')}`).join('\n')
  return {
    source: `${context.source.slice(0, start)}${value}${context.source.slice(end)}`,
    selection: { start, end: start + value.length },
  }
}

export function applyDlMdxCommand(action: DlMdxToolbarAction, context: DlMdxCommandContext): DlMdxCommandResult {
  switch (action) {
    case 'bold': return toggleWrap(context, '**', '粗体文本')
    case 'italic': return toggleWrap(context, '*', '斜体文本')
    case 'strike': return toggleWrap(context, '~~', '删除文本')
    case 'inline-code': return toggleWrap(context, '`', 'code')
    case 'link': return wrap(context, '[', '](https://example.com)', '链接文本')
    case 'heading': return transformLines(context, line => line.startsWith('## ') ? line.slice(3) : `## ${line.replace(/^#{1,6}\s+/, '')}`)
    case 'blockquote': return togglePrefix(context, '> ')
    case 'unordered-list': return togglePrefix(context, '- ')
    case 'task-list': return togglePrefix(context, '- [ ] ', '- [ ] ')
    case 'code-block': {
      const range = normalize(context.selection)
      const selected = context.source.slice(range.start, range.end)
      const value = `\n\`\`\`ts\n${selected}\n\`\`\`\n`
      return replace(context, value, selected
        ? { start: range.start + 7, end: range.start + 7 + selected.length }
        : { start: range.start + 7, end: range.start + 7 })
    }
    case 'component': return { source: context.source, selection: normalize(context.selection) }
  }
}
