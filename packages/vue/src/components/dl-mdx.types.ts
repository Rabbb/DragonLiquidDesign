export type DlMdxMode = 'edit' | 'preview' | 'split'

export interface DlMdxAttachmentUpload {
  sourceUrl: string
  fileName: string
  contentType: string
  alt: string
  title?: string
  blob?: Blob
}

export interface DlMdxAttachment {
  id?: string
  fileId?: string
  url: string
  fileName?: string
  contentType?: string
  byteLength?: number
  referenceCount?: number
  createdAt?: string
}

export interface DlMdxAttachmentAdapter {
  upload: (input: DlMdxAttachmentUpload) => Promise<DlMdxAttachment>
  list?: () => Promise<DlMdxAttachment[]>
  remove?: (attachment: DlMdxAttachment) => Promise<void>
  referenceMode?: 'immediate' | 'document-save'
}

export interface DlMdxHtmlPasteFailure {
  sourceUrl: string
  message: string
}

export interface DlMdxHtmlPasteResult {
  mdx: string
  attachments: DlMdxAttachment[]
  failures: DlMdxHtmlPasteFailure[]
}

export type DlMdxToolbarAction =
  'bold'
  | 'italic'
  | 'strike'
  | 'inline-code'
  | 'link'
  | 'heading'
  | 'blockquote'
  | 'unordered-list'
  | 'task-list'
  | 'code-block'
  | 'component'
  | 'attachments'
  | 'format'

export interface DlMdxLinkPolicy {
  allowExternal?: boolean
  openExternal?: boolean
  allowImages?: boolean
  allowDataImages?: boolean
}

export interface DlMdxRuntimeSymbol {
  name: string
  kind: 'variable' | 'method'
  description?: string
  signature?: string
  value?: unknown
  resolve?: () => unknown
}

export interface DlMdxParseResult {
  sourceLength: number
  lineCount: number
  blockCount: number
  headingCount: number
  readingMinutes: number
}

export type DlMdxScalar = string | number | boolean | null
export type DlMdxValue = DlMdxScalar | DlMdxValue[] | { [key: string]: DlMdxValue }

export interface DlMdxComponentContext {
  name: string
  id?: string
  props: Record<string, DlMdxValue>
  events: Record<string, string>
  slots?: Record<string, string>
  sourceLine: number
}

export type DlMdxCodeTokenKind =
  | 'plain'
  | 'comment'
  | 'keyword'
  | 'string'
  | 'number'
  | 'operator'
  | 'punctuation'
  | 'function'
  | 'type'
  | 'property'
  | 'tag'
  | 'attribute'
  | 'variable'
  | 'constant'

export interface DlMdxCodeToken {
  kind: DlMdxCodeTokenKind
  value: string
}

export interface DlMdxHighlightedCode {
  language: string
  supported: boolean
  lines: DlMdxCodeToken[][]
}

export type DlMdxInlineToken =
  | { type: 'text'; value: string }
  | { type: 'break' }
  | { type: 'code'; value: string }
  | { type: 'strong' | 'em' | 'strike' | 'underline' | 'mark' | 'sub' | 'sup' | 'kbd'; children: DlMdxInlineToken[] }
  | { type: 'link'; href: string; title?: string; children: DlMdxInlineToken[] }
  | { type: 'image'; src: string; alt: string; title?: string }

export interface DlMdxListItem {
  tokens: DlMdxInlineToken[]
  checked?: boolean
  sourceLine: number
  children: DlMdxBlock[]
}

export type DlMdxBlock =
  | { type: 'heading'; level: number; id: string; tokens: DlMdxInlineToken[] }
  | { type: 'paragraph'; tokens: DlMdxInlineToken[] }
  | { type: 'blockquote'; blocks: DlMdxBlock[] }
  | { type: 'list'; ordered: boolean; start: number; items: DlMdxListItem[] }
  | { type: 'table'; headers: DlMdxInlineToken[][]; rows: DlMdxInlineToken[][][]; alignments: Array<'left' | 'center' | 'right'> }
  | { type: 'code'; language: string; value: string; id: string }
  | { type: 'divider' }
  | { type: 'component'; context: DlMdxComponentContext }

export interface DlMdxDocument {
  blocks: DlMdxBlock[]
  stats: DlMdxParseResult
}
