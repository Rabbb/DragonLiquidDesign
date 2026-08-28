import { inject, type App, type InjectionKey } from 'vue'
import { getDlMdxRustCoreStatus, hashDlMdxWithRust } from './dl-mdx.rust'

export type DlMdxUrlKind = 'link' | 'image' | 'file'

export interface DlMdxDomainAllowlist {
  all?: readonly string[]
  links?: readonly string[]
  images?: readonly string[]
  files?: readonly string[]
}

export interface DlMdxSecurityOptions {
  domains: DlMdxDomainAllowlist
  fileExtensions?: readonly string[]
  allowedProtocols?: readonly ('https' | 'http')[]
  allowRelative?: boolean
  allowMailto?: boolean
  allowTel?: boolean
  allowDataImages?: boolean
  allowBlobImages?: boolean
}

export interface DlMdxSecurityStatus {
  wasm: true
  engine: 'rust-wasm'
  abiVersion: number
  binarySize: number
  binaryFingerprint: string
  integrity: boolean
  fingerprint: string
  domainRuleCount: number
  fileExtensionCount: number
}

export interface DlMdxSecurityPolicy {
  install: (app: App) => void
  validate: (value: string, kind: Exclude<DlMdxUrlKind, 'file'>) => string | undefined
  verifyIntegrity: () => boolean
  status: () => DlMdxSecurityStatus
}

interface DomainRule {
  protocol?: 'https:' | 'http:'
  hostname: string
  port: string
  wildcard: boolean
}

interface NormalizedSecurityOptions {
  domains: Record<'all' | 'links' | 'images' | 'files', readonly DomainRule[]>
  fileExtensions: readonly string[]
  allowedProtocols: readonly ('https:' | 'http:')[]
  allowRelative: boolean
  allowMailto: boolean
  allowTel: boolean
  allowDataImages: boolean
  allowBlobImages: boolean
}

export const dlMdxSecurityKey: InjectionKey<DlMdxSecurityPolicy> = Symbol('dragon-liquid-mdx-security')

function normalizeDomainRule(source: string): DomainRule {
  const raw = source.trim().toLowerCase()
  if (!raw) throw new Error('MarkdownX 域名白名单中不能包含空规则。')

  const scheme = raw.match(/^(https?):\/\//)?.[1] as 'https' | 'http' | undefined
  let authority = scheme ? raw.slice(scheme.length + 3) : raw
  if (/[\\/?#]/.test(authority)) throw new Error(`MarkdownX 域名规则不能包含路径、查询或片段：${source}`)

  const wildcard = authority.startsWith('*.')
  if (wildcard) authority = authority.slice(2)
  const parsed = new URL(`${scheme ?? 'https'}://${authority}`)
  const hostname = parsed.hostname.toLowerCase()
  if (!hostname || parsed.username || parsed.password) throw new Error(`无效的 MarkdownX 域名规则：${source}`)
  if (wildcard && (!hostname.includes('.') || hostname === 'localhost' || /^\d+(?:\.\d+){3}$/.test(hostname))) {
    throw new Error(`MarkdownX 通配域名只能用于正常域名：${source}`)
  }

  return Object.freeze({
    protocol: scheme ? `${scheme}:` : undefined,
    hostname,
    port: parsed.port,
    wildcard,
  })
}

function normalizeRules(values: readonly string[] | undefined): readonly DomainRule[] {
  const rules = (values ?? []).map(normalizeDomainRule)
  const unique = new Map(rules.map(rule => [JSON.stringify(rule), rule]))
  return Object.freeze([...unique.values()].sort((left, right) => JSON.stringify(left).localeCompare(JSON.stringify(right))))
}

function normalizeExtensions(values: readonly string[] | undefined): readonly string[] {
  const extensions = [...new Set((values ?? []).map(value => value.trim().toLowerCase().replace(/^\./, '')))]
  for (const extension of extensions) {
    if (!/^[a-z0-9][a-z0-9+-]{0,31}(?:\.[a-z0-9][a-z0-9+-]{0,31})*$/.test(extension)) {
      throw new Error(`无效的 MarkdownX 文件扩展名：${extension || '(空)'}`)
    }
  }
  return Object.freeze(extensions.sort((left, right) => right.length - left.length || left.localeCompare(right)))
}

function normalizeOptions(options: DlMdxSecurityOptions): NormalizedSecurityOptions {
  const allowedProtocols: Array<'https:' | 'http:'> = [...new Set(options.allowedProtocols ?? ['https'])]
    .map(protocol => protocol === 'https' ? 'https:' : 'http:')
  if (!allowedProtocols.length) throw new Error('MarkdownX 至少需要允许 https 或 http 中的一种协议。')

  return Object.freeze({
    domains: Object.freeze({
      all: normalizeRules(options.domains.all),
      links: normalizeRules(options.domains.links),
      images: normalizeRules(options.domains.images),
      files: normalizeRules(options.domains.files),
    }),
    fileExtensions: normalizeExtensions(options.fileExtensions),
    allowedProtocols: Object.freeze(allowedProtocols),
    allowRelative: options.allowRelative ?? true,
    allowMailto: options.allowMailto ?? false,
    allowTel: options.allowTel ?? false,
    allowDataImages: options.allowDataImages ?? false,
    allowBlobImages: options.allowBlobImages ?? false,
  })
}

function domainMatches(rule: DomainRule, url: URL): boolean {
  if (rule.protocol && rule.protocol !== url.protocol) return false
  if (rule.port !== url.port) return false
  if (rule.wildcard) return url.hostname.endsWith(`.${rule.hostname}`) && url.hostname !== rule.hostname
  return url.hostname === rule.hostname
}

function decodedPathname(pathname: string): string {
  let decoded = pathname
  for (let index = 0; index < 2; index += 1) {
    try { decoded = decodeURIComponent(decoded) } catch { break }
  }
  return decoded.toLowerCase()
}

function fileExtension(pathname: string, allowed: readonly string[]): string | undefined {
  const path = decodedPathname(pathname)
  return allowed.find(extension => path.endsWith(`.${extension}`))
}

function looksLikeFile(pathname: string): boolean {
  const segment = decodedPathname(pathname).split('/').pop() ?? ''
  const extension = segment.match(/\.([a-z0-9][a-z0-9+.-]{0,63})$/)?.[1]
  return Boolean(extension && !['html', 'htm', 'xhtml', 'php', 'asp', 'aspx', 'jsp'].includes(extension))
}

function isRelativeUrl(value: string): boolean {
  if (value.startsWith('//') || value.startsWith('\\')) return false
  return /^(?:#|\?|\/|\.\/|\.\.\/)/.test(value) || !/^[a-z][a-z0-9+.-]*:/i.test(value)
}

export function createDlMdxSecurityPolicy(options: DlMdxSecurityOptions): DlMdxSecurityPolicy {
  const normalized = normalizeOptions(options)
  const canonical = JSON.stringify(normalized)
  const rustCore = getDlMdxRustCoreStatus()
  if (!rustCore.available) throw new Error('Rust MarkdownX WASM 核心启动失败，安全策略拒绝启动。')
  const wasmHash = hashDlMdxWithRust
  const expectedFingerprint = wasmHash(canonical)

  const verifyIntegrity = () => wasmHash(canonical) === expectedFingerprint
  const validate = (value: string, kind: 'link' | 'image'): string | undefined => {
    if (!verifyIntegrity()) return undefined
    const candidate = value.trim()
    if (!candidate) return undefined

    if (kind === 'image' && /^data:/i.test(candidate)) return normalized.allowDataImages ? candidate : undefined
    if (kind === 'image' && /^blob:/i.test(candidate)) return normalized.allowBlobImages ? candidate : undefined
    if (/^mailto:/i.test(candidate)) return kind === 'link' && normalized.allowMailto ? candidate : undefined
    if (/^tel:/i.test(candidate)) return kind === 'link' && normalized.allowTel ? candidate : undefined

    if (isRelativeUrl(candidate)) {
      if (!normalized.allowRelative) return undefined
      if (kind === 'link' && looksLikeFile(candidate) && !fileExtension(candidate.split(/[?#]/, 1)[0], normalized.fileExtensions)) return undefined
      return candidate
    }

    let url: URL
    try { url = new URL(candidate.startsWith('//') ? `https:${candidate}` : candidate) } catch { return undefined }
    if (!normalized.allowedProtocols.includes(url.protocol as 'https:' | 'http:') || url.username || url.password) return undefined

    let resourceKind: 'links' | 'images' | 'files' = kind === 'image' ? 'images' : 'links'
    if (kind === 'link' && looksLikeFile(url.pathname)) {
      if (!fileExtension(url.pathname, normalized.fileExtensions)) return undefined
      resourceKind = 'files'
    }
    const rules = [...normalized.domains.all, ...normalized.domains[resourceKind]]
    return rules.some(rule => domainMatches(rule, url)) ? candidate : undefined
  }

  const policy: DlMdxSecurityPolicy = {
    install(app) { app.provide(dlMdxSecurityKey, policy) },
    validate,
    verifyIntegrity,
    status: () => Object.freeze({
      wasm: true,
      engine: rustCore.engine,
      abiVersion: rustCore.abiVersion,
      binarySize: rustCore.binarySize,
      binaryFingerprint: rustCore.binaryFingerprint,
      integrity: verifyIntegrity(),
      fingerprint: expectedFingerprint.toString(16).padStart(8, '0'),
      domainRuleCount: Object.values(normalized.domains).reduce((count, rules) => count + rules.length, 0),
      fileExtensionCount: normalized.fileExtensions.length,
    }),
  }
  return Object.freeze(policy)
}

export function useDlMdxSecurityPolicy(fallback?: DlMdxSecurityPolicy): DlMdxSecurityPolicy | undefined {
  return inject(dlMdxSecurityKey, fallback)
}
