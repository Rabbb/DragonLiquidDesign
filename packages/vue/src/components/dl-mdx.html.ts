import type {
  DlMdxAttachment,
  DlMdxAttachmentAdapter,
  DlMdxAttachmentUpload,
  DlMdxHtmlPasteFailure,
  DlMdxHtmlPasteResult,
} from './dl-mdx.types'

export interface DlMdxHtmlConversionOptions {
  attachmentAdapter?: DlMdxAttachmentAdapter
  clipboardFiles?: readonly File[]
}

const blockTags = new Set([
  'address', 'article', 'aside', 'blockquote', 'div', 'dl', 'fieldset', 'figure', 'footer', 'form',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hr', 'main', 'nav', 'ol', 'p', 'pre',
  'section', 'table', 'ul',
])

type StyleMap = Map<string, string>

function styleMap(element: Element): StyleMap {
  return new Map((element.getAttribute('style') ?? '').split(';').flatMap((declaration) => {
    const separator = declaration.indexOf(':')
    if (separator < 1) return []
    const property = declaration.slice(0, separator).trim().toLowerCase()
    const value = declaration.slice(separator + 1).trim().toLowerCase()
    return property && value ? [[property, value] as const] : []
  }))
}

function isBold(styles: StyleMap) {
  const value = styles.get('font-weight') ?? ''
  return /^(?:bold|bolder|[6-9]00)$/.test(value) || Number.parseInt(value, 10) >= 600
}

function hasVisibleBackground(styles: StyleMap) {
  const value = styles.get('background-color') ?? styles.get('background') ?? styles.get('mso-highlight') ?? ''
  return Boolean(value && !/^(?:none|transparent|inherit|initial|unset|rgba\(0\s*,\s*0\s*,\s*0\s*,\s*0\))$/.test(value))
}

function applyInlineStyles(element: Element, value: string, represented: ReadonlySet<string> = new Set()) {
  if (!value) return value
  const styles = styleMap(element)
  let result = value
  const decoration = `${styles.get('text-decoration') ?? ''} ${styles.get('text-decoration-line') ?? ''}`
  const vertical = styles.get('vertical-align') ?? ''
  const family = styles.get('font-family') ?? ''
  if (!represented.has('code') && /(?:mono|consolas|courier|menlo|monaco|cascadia)/i.test(family) && !/[\n`]/.test(element.textContent ?? '')) {
    result = inlineCode(element.textContent ?? '')
  }
  if (!represented.has('strong') && isBold(styles)) result = `**${result}**`
  if (!represented.has('em') && /^(?:italic|oblique)/.test(styles.get('font-style') ?? '')) result = `*${result}*`
  if (!represented.has('strike') && /line-through/.test(decoration)) result = `~~${result}~~`
  if (!represented.has('underline') && /underline/.test(decoration)) result = `<u>${result}</u>`
  if (!represented.has('mark') && hasVisibleBackground(styles)) result = `<mark>${result}</mark>`
  if (!represented.has('sup') && /^(?:super|text-top)$/.test(vertical)) result = `<sup>${result}</sup>`
  if (!represented.has('sub') && /^(?:sub|text-bottom)$/.test(vertical)) result = `<sub>${result}</sub>`
  return result
}

function escapeText(value: string) {
  return value.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').replace(/([\\`*_[\]<>])/g, '\\$1')
}

function escapeAlt(value: string) {
  return value.replace(/([\\\]])/g, '\\$1').replace(/\s+/g, ' ').trim()
}

function safeUrl(value: string, image = false) {
  const url = value.trim()
  if (!url || /[\u0000-\u001f\u007f]/.test(url)) return ''
  if (/^(?:https?:|\/|\.\/|\.\.\/|#)/i.test(url)) return url
  if (!image && /^(?:mailto:|tel:)/i.test(url)) return url
  if (image && /^(?:data:image\/(?:png|jpeg|gif|webp|avif);base64,|blob:)/i.test(url)) return url
  return ''
}

function markdownUrl(value: string) {
  return value.replace(/ /g, '%20').replace(/\(/g, '%28').replace(/\)/g, '%29')
}

function inlineCode(value: string) {
  const fence = value.includes('``') ? '```' : value.includes('`') ? '``' : '`'
  return `${fence}${value}${fence}`
}

function inlineNodes(nodes: Iterable<Node>): string {
  return [...nodes].map(inlineNode).join('')
}

function inlineNode(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) return escapeText(node.textContent ?? '')
  if (node.nodeType !== Node.ELEMENT_NODE) return ''
  const element = node as HTMLElement
  const tag = element.tagName.toLowerCase()
  const children = () => inlineNodes(element.childNodes)
  if (tag === 'br') return '  \n'
  if (tag === 'strong' || tag === 'b') return applyInlineStyles(element, `**${children()}**`, new Set(['strong']))
  if (tag === 'em' || tag === 'i') return applyInlineStyles(element, `*${children()}*`, new Set(['em']))
  if (tag === 'del' || tag === 's' || tag === 'strike') return applyInlineStyles(element, `~~${children()}~~`, new Set(['strike']))
  if (tag === 'code') return applyInlineStyles(element, inlineCode(element.textContent ?? ''), new Set(['code']))
  if (tag === 'mark' || tag === 'sub' || tag === 'sup' || tag === 'kbd' || tag === 'u') {
    const represented = tag === 'u' ? 'underline' : tag
    return applyInlineStyles(element, `<${tag}>${children()}</${tag}>`, new Set([represented]))
  }
  if (tag === 'a') {
    const href = safeUrl(element.getAttribute('href') ?? '')
    const label = children().trim() || escapeText(href)
    const title = element.getAttribute('title')?.replace(/["\n\r]/g, ' ').trim()
    return applyInlineStyles(element, href ? `[${label}](${markdownUrl(href)}${title ? ` "${title}"` : ''})` : label)
  }
  if (tag === 'img') {
    const src = safeUrl(element.getAttribute('src') ?? '', true)
    if (!src) return ''
    const alt = escapeAlt(element.getAttribute('alt') ?? '')
    const title = element.getAttribute('title')?.replace(/["\n\r]/g, ' ').trim()
    return `![${alt}](${markdownUrl(src)}${title ? ` "${title}"` : ''})`
  }
  return applyInlineStyles(element, children())
}

function directChildren(element: Element, tag: string) {
  return [...element.children].filter(child => child.tagName.toLowerCase() === tag)
}

function listBlock(element: Element, depth = 0): string {
  const ordered = element.tagName.toLowerCase() === 'ol'
  const start = Number.parseInt(element.getAttribute('start') ?? '1', 10) || 1
  return directChildren(element, 'li').map((item, index) => {
    const nested = [...item.children].filter(child => ['ul', 'ol'].includes(child.tagName.toLowerCase()))
    const inline = [...item.childNodes].filter(child => !(child.nodeType === Node.ELEMENT_NODE && ['ul', 'ol'].includes((child as Element).tagName.toLowerCase())))
    const checkbox = item.querySelector(':scope > input[type="checkbox"]') as HTMLInputElement | null
    const content = inlineNodes(inline).replace(/^\s+|\s+$/g, '').replace(/^\\?\[\s*\\?\]\s*/, '')
    const marker = ordered ? `${start + index}.` : '-'
    const task = checkbox ? `[${checkbox.checked ? 'x' : ' '}] ` : ''
    const prefix = `${'  '.repeat(depth)}${marker} ${task}`
    const first = `${prefix}${content}`.trimEnd()
    const childLists = nested.map(child => listBlock(child, depth + 1)).filter(Boolean)
    return [first, ...childLists].join('\n')
  }).join('\n')
}

function tableCellValue(cell: Element) {
  return inlineNodes(cell.childNodes).trim().replace(/\|/g, '\\|').replace(/ {2}\n/g, '<br>')
}

function tableBlock(table: Element): string {
  const rows = [...table.querySelectorAll('tr')].filter(row => row.closest('table') === table)
  if (!rows.length) return ''
  const grid: string[][] = []
  const alignments: Array<'left' | 'center' | 'right'> = []
  rows.forEach((row, rowIndex) => {
    grid[rowIndex] ??= []
    let column = 0
    const cells = [...row.querySelectorAll(':scope > th, :scope > td')]
    for (const cell of cells) {
      while (grid[rowIndex][column] !== undefined) column += 1
      const colspan = Math.max(1, Math.min(50, Number.parseInt(cell.getAttribute('colspan') ?? '1', 10) || 1))
      const rowspan = Math.max(1, Math.min(200, Number.parseInt(cell.getAttribute('rowspan') ?? '1', 10) || 1))
      const value = tableCellValue(cell)
      const alignment = (cell.getAttribute('align') ?? styleMap(cell).get('text-align') ?? '').toLowerCase()
      for (let offset = 0; offset < colspan; offset += 1) {
        if (alignment === 'center' || alignment === 'right' || alignment === 'left') alignments[column + offset] ??= alignment
        for (let rowOffset = 0; rowOffset < rowspan; rowOffset += 1) {
          grid[rowIndex + rowOffset] ??= []
          grid[rowIndex + rowOffset][column + offset] = offset === 0 ? value : ''
        }
      }
      column += colspan
    }
  })
  const width = Math.max(...grid.map(row => row.length))
  const normalized = grid.map(row => Array.from({ length: width }, (_, index) => row[index] ?? ''))
  const line = (row: string[]) => `| ${row.join(' | ')} |`
  const divider = Array.from({ length: width }, (_, index) => alignments[index] === 'center' ? ':---:' : alignments[index] === 'right' ? '---:' : alignments[index] === 'left' ? ':---' : '---')
  return [line(normalized[0]), line(divider), ...normalized.slice(1).map(line)].join('\n')
}

function inferredHeadingLevel(element: Element): number | undefined {
  const tag = element.tagName.toLowerCase()
  if (/^h[1-6]$/.test(tag)) return Number(tag[1])
  if (element.getAttribute('role')?.toLowerCase() === 'heading') {
    const level = Number.parseInt(element.getAttribute('aria-level') ?? '', 10)
    if (level >= 1 && level <= 6) return level
  }
  const className = element.getAttribute('class') ?? ''
  const officeHeading = /(?:^|\s)(?:mso)?heading\s*([1-6])(?:\s|$)/i.exec(className)
  if (officeHeading) return Number(officeHeading[1])
  if (/(?:^|\s)(?:msotitle|document-title)(?:\s|$)/i.test(className)) return 1
  const styles = styleMap(element)
  if (!isBold(styles)) return undefined
  const size = /([\d.]+)(pt|px)/.exec(styles.get('font-size') ?? '')
  if (!size) return undefined
  const pixels = Number(size[1]) * (size[2] === 'pt' ? 4 / 3 : 1)
  return pixels >= 30 ? 1 : pixels >= 24 ? 2 : pixels >= 19 ? 3 : undefined
}

function officeListItem(element: Element): string | undefined {
  const styles = element.getAttribute('style') ?? ''
  const className = element.getAttribute('class') ?? ''
  if (!/mso-list\s*:/i.test(styles) && !/\bMsoListParagraph/i.test(className)) return undefined
  const ignored = [...element.querySelectorAll('[style]')].filter(child => /mso-list\s*:\s*ignore/i.test(child.getAttribute('style') ?? ''))
  const markerText = ignored.map(child => child.textContent ?? '').join(' ').replace(/\u00a0/g, ' ').trim()
  const ignoredSet = new Set<Node>(ignored)
  const content = [...element.childNodes].filter(node => !ignoredSet.has(node)).map(inlineNode).join('').trim()
  if (!content) return undefined
  const level = Math.max(1, Math.min(20, Number.parseInt(/level(\d+)/i.exec(styles)?.[1] ?? '1', 10) || 1))
  const ordered = /^\s*(?:\d+|[a-z]+|[ivxlcdm]+)[.)]/i.test(markerText)
  const marker = ordered ? (/\d+/.exec(markerText)?.[0] ?? '1') + '.' : '-'
  return `${'  '.repeat(level - 1)}${marker} ${content}`
}

function convertNodes(nodes: Iterable<Node>): string {
  const blocks: string[] = []
  const officeList: string[] = []
  let inlineBuffer: Node[] = []
  const flushInline = () => {
    const value = inlineNodes(inlineBuffer).trim()
    if (value) blocks.push(value)
    inlineBuffer = []
  }
  const flushOfficeList = () => {
    if (officeList.length) blocks.push(officeList.splice(0).join('\n'))
  }
  for (const node of [...nodes]) {
    const isBlock = node.nodeType === Node.ELEMENT_NODE && blockTags.has((node as Element).tagName.toLowerCase())
    if (!isBlock) {
      if (node.nodeType !== Node.TEXT_NODE || node.textContent?.trim()) {
        flushOfficeList()
        inlineBuffer.push(node)
      }
      continue
    }
    flushInline()
    const listItem = officeListItem(node as Element)
    if (listItem) {
      officeList.push(listItem)
      continue
    }
    flushOfficeList()
    const value = blockNode(node as Element).trim()
    if (value) blocks.push(value)
  }
  flushInline()
  flushOfficeList()
  return blocks.join('\n\n')
}

function blockNode(element: Element): string {
  const tag = element.tagName.toLowerCase()
  const headingLevel = inferredHeadingLevel(element)
  if (headingLevel) return `${'#'.repeat(headingLevel)} ${applyInlineStyles(element, inlineNodes(element.childNodes).trim(), new Set(['strong']))}`
  if (tag === 'p') return applyInlineStyles(element, inlineNodes(element.childNodes).trim())
  if (tag === 'ul' || tag === 'ol') return listBlock(element)
  if (tag === 'blockquote') return convertNodes(element.childNodes).split('\n').map(line => `> ${line}`.trimEnd()).join('\n')
  if (tag === 'pre') {
    const code = element.querySelector(':scope > code') ?? element
    const language = [...code.classList].map(value => /^language-(.+)$/.exec(value)?.[1]).find(Boolean) ?? ''
    const value = (code.textContent ?? '').replace(/^\n|\n$/g, '')
    const fence = value.includes('```') ? '````' : '```'
    return `${fence}${language}\n${value}\n${fence}`
  }
  if (tag === 'table') return tableBlock(element)
  if (tag === 'hr') return '---'
  if (tag === 'figure') {
    const caption = element.querySelector(':scope > figcaption')
    const content = [...element.childNodes].filter(node => node !== caption)
    return [inlineNodes(content).trim(), caption ? `*${inlineNodes(caption.childNodes).trim()}*` : ''].filter(Boolean).join('\n\n')
  }
  const hasDirectBlock = [...element.children].some(child => blockTags.has(child.tagName.toLowerCase()))
  return hasDirectBlock ? convertNodes(element.childNodes) : inlineNodes(element.childNodes).trim()
}

function dataUrlBlob(source: string): Blob | undefined {
  const match = /^data:([^;,]+);base64,([\s\S]+)$/i.exec(source)
  if (!match) return undefined
  try {
    const binary = atob(match[2])
    const bytes = Uint8Array.from(binary, character => character.charCodeAt(0))
    return new Blob([bytes], { type: match[1].toLowerCase() })
  } catch { return undefined }
}

function extensionFor(contentType: string) {
  return ({ 'image/png': 'png', 'image/jpeg': 'jpg', 'image/gif': 'gif', 'image/webp': 'webp', 'image/avif': 'avif' } as Record<string, string>)[contentType] ?? 'bin'
}

function suggestedName(element: HTMLImageElement, blob?: Blob) {
  const source = element.getAttribute('src') ?? ''
  try {
    const name = new URL(source, window.location.href).pathname.split('/').filter(Boolean).at(-1)
    if (name && /\.[A-Za-z0-9]{2,5}$/.test(name)) return decodeURIComponent(name).slice(0, 255)
  } catch { /* use a generated name */ }
  return `pasted-image-${Date.now()}.${extensionFor(blob?.type ?? '')}`
}

async function resolveBlob(source: string, clipboardFile?: File): Promise<Blob | undefined> {
  if (clipboardFile) return clipboardFile
  const data = dataUrlBlob(source)
  if (data) return data
  if (!/^(?:https?:|blob:)/i.test(source)) return undefined
  try {
    const response = await fetch(source, { credentials: 'omit' })
    if (!response.ok) return undefined
    const blob = await response.blob()
    return blob.type.startsWith('image/') ? blob : undefined
  } catch { return undefined }
}

export async function convertDlHtmlToMdx(html: string, options: DlMdxHtmlConversionOptions = {}): Promise<DlMdxHtmlPasteResult> {
  if (typeof DOMParser === 'undefined') return { mdx: html, attachments: [], failures: [] }
  const document = new DOMParser().parseFromString(html, 'text/html')
  document.querySelectorAll('script, style, iframe, object, embed, link, meta, base, template, noscript').forEach(element => element.remove())
  const attachments: DlMdxAttachment[] = []
  const failures: DlMdxHtmlPasteFailure[] = []
  const clipboardFiles = [...(options.clipboardFiles ?? [])].filter(file => file.type.startsWith('image/'))

  if (options.attachmentAdapter) {
    const images = [...document.querySelectorAll('img')]
    await Promise.all(images.map(async (image, index) => {
      const sourceUrl = safeUrl(image.getAttribute('src') ?? '', true)
      if (!sourceUrl) return
      const blob = await resolveBlob(sourceUrl, clipboardFiles[index])
      const input: DlMdxAttachmentUpload = {
        sourceUrl,
        fileName: clipboardFiles[index]?.name || suggestedName(image, blob),
        contentType: blob?.type || clipboardFiles[index]?.type || '',
        alt: image.getAttribute('alt') ?? '',
        title: image.getAttribute('title') ?? undefined,
        blob,
      }
      try {
        const attachment = await options.attachmentAdapter!.upload(input)
        const url = safeUrl(attachment.url, true)
        if (!url) throw new Error('The attachment adapter returned an unsafe image URL.')
        image.setAttribute('src', url)
        attachments.push(attachment)
      } catch (cause) {
        failures.push({ sourceUrl, message: cause instanceof Error ? cause.message : String(cause) })
      }
    }))
  }

  return {
    mdx: convertNodes(document.body.childNodes).replace(/\n{3,}/g, '\n\n').trim(),
    attachments,
    failures,
  }
}
