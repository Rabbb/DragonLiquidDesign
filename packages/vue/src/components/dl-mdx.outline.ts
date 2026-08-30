import { parseDlMdx } from './dl-mdx.parser'
import type { DlMdxBlock, DlMdxDocument, DlMdxInlineToken } from './dl-mdx.types'

export interface DlMdxOutlineItem {
  id: string
  label: string
  level: number
}

function inlineText(tokens: readonly DlMdxInlineToken[]): string {
  return tokens.map(token => {
    if (token.type === 'text' || token.type === 'code') return token.value
    if (token.type === 'break') return ' '
    if (token.type === 'image') return token.alt
    return inlineText(token.children)
  }).join('').replace(/\s+/g, ' ').trim()
}

function collect(blocks: readonly DlMdxBlock[], output: DlMdxOutlineItem[]) {
  for (const block of blocks) {
    if (block.type === 'heading') output.push({ id: block.id, label: inlineText(block.tokens), level: block.level })
    else if (block.type === 'blockquote') collect(block.blocks, output)
    else if (block.type === 'list') block.items.forEach(item => collect(item.children, output))
  }
}

export function createDlMdxOutline(source: string | DlMdxDocument): DlMdxOutlineItem[] {
  const document = typeof source === 'string' ? parseDlMdx(source) : source
  const output: DlMdxOutlineItem[] = []
  collect(document.blocks, output)
  return output
}
