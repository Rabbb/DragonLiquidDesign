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

function escapeText(value: string) {
  return value.replace(/\s+/g, ' ').replace(/([\\`*_[\]<>])/g, '\\$1')
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
  if (tag === 'strong' || tag === 'b') return `**${children()}**`
  if (tag === 'em' || tag === 'i') return `*${children()}*`
  if (tag === 'del' || tag === 's' || tag === 'strike') return `~~${children()}~~`
  if (tag === 'code') return inlineCode(element.textContent ?? '')
  if (tag === 'mark' || tag === 'sub' || tag === 'sup' || tag === 'kbd') return `<${tag}>${children()}</${tag}>`
  if (tag === 'a') {
    const href = safeUrl(element.getAttribute('href') ?? '')
    const label = children().trim() || escapeText(href)
    const title = element.getAttribute('title')?.replace(/["\n\r]/g, ' ').trim()
    return href ? `[${label}](${href}${title ? ` "${title}"` : ''})` : label
  }
  if (tag === 'img') {
    const src = safeUrl(element.getAttribute('src') ?? '', true)
    if (!src) return ''
    const alt = escapeAlt(element.getAttribute('alt') ?? '')
    const title = element.getAttribute('title')?.replace(/["\n\r]/g, ' ').trim()
    return `![${alt}](${src}${title ? ` "${title}"` : ''})`
  }
  return children()
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

function tableBlock(table: Element): string {
  const rows = [...table.querySelectorAll('tr')]
  if (!rows.length) return ''
  const cells = rows.map(row => [...row.querySelectorAll(':scope > th, :scope > td')].map(cell => inlineNodes(cell.childNodes).trim().replace(/\|/g, '\\|')))
  const width = Math.max(...cells.map(row => row.length))
  const normalized = cells.map(row => [...row, ...Array.from({ length: width - row.length }, () => '')])
  const line = (row: string[]) => `| ${row.join(' | ')} |`
  return [line(normalized[0]), line(Array.from({ length: width }, () => '---')), ...normalized.slice(1).map(line)].join('\n')
}

function convertNodes(nodes: Iterable<Node>): string {
  const blocks: string[] = []
  let inlineBuffer: Node[] = []
  const flushInline = () => {
    const value = inlineNodes(inlineBuffer).trim()
    if (value) blocks.push(value)
    inlineBuffer = []
  }
  for (const node of nodes) {
    const isBlock = node.nodeType === Node.ELEMENT_NODE && blockTags.has((node as Element).tagName.toLowerCase())
    if (!isBlock) {
      if (node.nodeType !== Node.TEXT_NODE || node.textContent?.trim()) inlineBuffer.push(node)
      continue
    }
    flushInline()
    const value = blockNode(node as Element).trim()
    if (value) blocks.push(value)
  }
  flushInline()
  return blocks.join('\n\n')
}

function blockNode(element: Element): string {
  const tag = element.tagName.toLowerCase()
  if (/^h[1-6]$/.test(tag)) return `${'#'.repeat(Number(tag[1]))} ${inlineNodes(element.childNodes).trim()}`
  if (tag === 'p') return inlineNodes(element.childNodes).trim()
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
  document.querySelectorAll('script, style, iframe, object, embed, link, meta').forEach(element => element.remove())
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
