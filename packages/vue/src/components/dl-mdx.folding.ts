export interface DlMdxComponentFoldRange {
  lineFrom: number
  from: number
  to: number
}

interface SourceLine {
  from: number
  to: number
  text: string
}

function sourceLines(source: string): SourceLine[] {
  const lines: SourceLine[] = []
  let from = 0
  while (from <= source.length) {
    const newline = source.indexOf('\n', from)
    const to = newline < 0 ? source.length : newline
    lines.push({ from, to, text: source.slice(from, to).replace(/\r$/, '') })
    if (newline < 0) break
    from = newline + 1
  }
  return lines
}

/** Finds complete MarkdownX component blocks while ignoring marker-shaped text in fenced code. */
export function findDlMdxComponentFoldRanges(source: string): DlMdxComponentFoldRange[] {
  const ranges: DlMdxComponentFoldRange[] = []
  let componentStart: SourceLine | undefined
  let fence: { marker: string; length: number } | undefined

  for (const line of sourceLines(source)) {
    const value = line.text.trimStart()
    const fenceMarker = value.match(/^(`{3,}|~{3,})/u)?.[1]
    if (fence) {
      if (fenceMarker?.[0] === fence.marker && fenceMarker.length >= fence.length) fence = undefined
      continue
    }
    if (fenceMarker) {
      fence = { marker: fenceMarker[0], length: fenceMarker.length }
      continue
    }
    if (!componentStart && /^\+\+\+component:[A-Za-z][A-Za-z0-9._-]*\s*$/u.test(value)) {
      componentStart = line
      continue
    }
    if (componentStart && /^\+\+\+end\s*$/u.test(value)) {
      if (componentStart.to < line.to) ranges.push({ lineFrom: componentStart.from, from: componentStart.to, to: line.to })
      componentStart = undefined
    }
  }

  return ranges
}

export function findDlMdxComponentFoldRangeAtLine(source: string, lineFrom: number): DlMdxComponentFoldRange | undefined {
  return findDlMdxComponentFoldRanges(source).find(range => range.lineFrom === lineFrom)
}
