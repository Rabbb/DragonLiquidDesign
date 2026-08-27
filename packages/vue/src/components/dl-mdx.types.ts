export type DlMdxMode = 'edit' | 'preview' | 'split'

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

export interface DlMdxLinkPolicy {
  allowExternal?: boolean
  openExternal?: boolean
  allowImages?: boolean
  allowDataImages?: boolean
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
  sourceLine: number
}

export type DlMdxInlineToken =
  | { type: 'text'; value: string }
  | { type: 'break' }
  | { type: 'code'; value: string }
  | { type: 'strong' | 'em' | 'strike' | 'mark' | 'sub' | 'sup' | 'kbd'; children: DlMdxInlineToken[] }
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
