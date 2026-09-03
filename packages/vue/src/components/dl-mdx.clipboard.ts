import { parseDlMdx } from './dl-mdx.parser'
import type { DlMdxBlock, DlMdxInlineToken } from './dl-mdx.types'

export const DL_MDX_CLIPBOARD_TYPE = 'application/x-dragon-liquid-mdx'

function escapeHtml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

function safeUrl(value: string, image = false) {
  const url = value.trim()
  if (!url || /[\u0000-\u001f\u007f]/.test(url)) return ''
  if (/^(?:https?:|\/|\.\/|\.\.\/|#)/i.test(url)) return url
  if (!image && /^(?:mailto:|tel:)/i.test(url)) return url
  if (image && /^(?:data:image\/(?:png|jpeg|gif|webp|avif);base64,|blob:)/i.test(url)) return url
  return ''
}

function inlineHtml(tokens: DlMdxInlineToken[]): string {
  return tokens.map((token) => {
    if (token.type === 'text') return escapeHtml(token.value)
    if (token.type === 'break') return '<br>'
    if (token.type === 'code') return `<code>${escapeHtml(token.value)}</code>`
    if (token.type === 'strong') return `<strong>${inlineHtml(token.children)}</strong>`
    if (token.type === 'em') return `<em>${inlineHtml(token.children)}</em>`
    if (token.type === 'strike') return `<del>${inlineHtml(token.children)}</del>`
    if (token.type === 'underline') return `<u>${inlineHtml(token.children)}</u>`
    if (token.type === 'mark' || token.type === 'sub' || token.type === 'sup' || token.type === 'kbd') {
      return `<${token.type}>${inlineHtml(token.children)}</${token.type}>`
    }
    if (token.type === 'link') {
      const href = safeUrl(token.href)
      return href ? `<a href="${escapeHtml(href)}"${token.title ? ` title="${escapeHtml(token.title)}"` : ''}>${inlineHtml(token.children)}</a>` : inlineHtml(token.children)
    }
    if (token.type !== 'image') return ''
    const src = safeUrl(token.src, true)
    return src ? `<img src="${escapeHtml(src)}" alt="${escapeHtml(token.alt)}"${token.title ? ` title="${escapeHtml(token.title)}"` : ''}>` : escapeHtml(token.alt)
  }).join('')
}

function blockHtml(block: DlMdxBlock): string {
  if (block.type === 'heading') return `<h${block.level}>${inlineHtml(block.tokens)}</h${block.level}>`
  if (block.type === 'paragraph') return `<p>${inlineHtml(block.tokens)}</p>`
  if (block.type === 'blockquote') return `<blockquote>${blocksHtml(block.blocks)}</blockquote>`
  if (block.type === 'list') {
    const tag = block.ordered ? 'ol' : 'ul'
    const start = block.ordered && block.start !== 1 ? ` start="${block.start}"` : ''
    const items = block.items.map(item => `<li>${item.checked === undefined ? '' : `<input type="checkbox" disabled${item.checked ? ' checked' : ''}>`}${inlineHtml(item.tokens)}${blocksHtml(item.children)}</li>`).join('')
    return `<${tag}${start}>${items}</${tag}>`
  }
  if (block.type === 'table') {
    const align = (index: number) => block.alignments[index] ? ` style="text-align:${block.alignments[index]}"` : ''
    const header = block.headers.map((tokens, index) => `<th${align(index)}>${inlineHtml(tokens)}</th>`).join('')
    const rows = block.rows.map(row => `<tr>${row.map((tokens, index) => `<td${align(index)}>${inlineHtml(tokens)}</td>`).join('')}</tr>`).join('')
    return `<table><thead><tr>${header}</tr></thead><tbody>${rows}</tbody></table>`
  }
  if (block.type === 'code') return `<pre><code${block.language ? ` class="language-${escapeHtml(block.language)}"` : ''}>${escapeHtml(block.value)}</code></pre>`
  if (block.type === 'divider') return '<hr>'
  const label = escapeHtml(block.context.name)
  const defaultSlot = block.context.slots?.default
  return `<section data-dl-mdx-component="${label}" contenteditable="false"><strong>${label}</strong>${defaultSlot ? blocksHtml(parseDlMdx(defaultSlot).blocks) : ''}</section>`
}

function blocksHtml(blocks: DlMdxBlock[]) {
  return blocks.map(blockHtml).join('')
}

export function convertDlMdxToHtml(source: string): string {
  return blocksHtml(parseDlMdx(source).blocks)
}

export function writeDlMdxClipboard(clipboard: DataTransfer, source: string) {
  clipboard.setData(DL_MDX_CLIPBOARD_TYPE, source)
  clipboard.setData('text/markdown', source)
  clipboard.setData('text/plain', source)
  clipboard.setData('text/html', convertDlMdxToHtml(source))
}
