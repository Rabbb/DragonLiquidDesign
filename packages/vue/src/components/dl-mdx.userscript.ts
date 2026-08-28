export type DlMdxUserscriptRunAt = 'document-start' | 'document-body' | 'document-end' | 'document-idle' | 'context-menu'
export type DlMdxUserscriptInjectInto = 'page' | 'content' | 'auto'
export type DlMdxUserscriptDiagnosticSeverity = 'error' | 'warning'

export const dlMdxUserscriptKnownGrants = [
  'none',
  'unsafeWindow',
  'window.close',
  'GM_addElement',
  'GM_addStyle',
  'GM_addValueChangeListener',
  'GM_deleteValue',
  'GM_download',
  'GM_getResourceText',
  'GM_getResourceURL',
  'GM_getTab',
  'GM_getTabs',
  'GM_getValue',
  'GM_info',
  'GM_listValues',
  'GM_log',
  'GM_notification',
  'GM_openInTab',
  'GM_registerMenuCommand',
  'GM_removeValueChangeListener',
  'GM_saveTab',
  'GM_setClipboard',
  'GM_setValue',
  'GM_unregisterMenuCommand',
  'GM_webRequest',
  'GM_xmlhttpRequest',
] as const

export interface DlMdxUserscriptResource {
  name: string
  url: string
}

export interface DlMdxUserscriptMetadata {
  id: string
  name: string
  namespace: string
  version: string
  description?: string
  author?: string
  matches: string[]
  includes?: string[]
  excludes?: string[]
  grants?: string[]
  connect?: string[]
  requires?: string[]
  resources?: DlMdxUserscriptResource[]
  runAt?: DlMdxUserscriptRunAt
  injectInto?: DlMdxUserscriptInjectInto
  noframes?: boolean
  icon?: string
  homepageUrl?: string
  supportUrl?: string
  downloadUrl?: string
  updateUrl?: string
}

export interface DlMdxUserscriptProject {
  metadata: DlMdxUserscriptMetadata
  source: string
}

export interface DlMdxUserscriptDiagnostic {
  code: string
  severity: DlMdxUserscriptDiagnosticSeverity
  message: string
  field?: keyof DlMdxUserscriptMetadata | 'source'
}

export interface DlMdxUserscriptBuildResult {
  ok: boolean
  code: string
  filename: string
  metadata: DlMdxUserscriptMetadata
  diagnostics: DlMdxUserscriptDiagnostic[]
}

const idPattern = /^[a-z0-9][a-z0-9._-]{2,79}$/
const versionPattern = /^\d+(?:\.\d+){0,3}(?:[-+][0-9A-Za-z.-]+)?$/
const metadataBlockPattern = /\/\/\s*==UserScript==[\s\S]*?\/\/\s*==\/UserScript==\s*/i
const matchPattern = /^(\*|https?|file|ftp):\/\/(\*|\*\.[^/*]+|[^/*]+)(\/.*)$/i

function cleanText(value: unknown, fallback = '') {
  return String(value ?? fallback).replace(/[\r\n\u0000-\u001f\u007f]+/g, ' ').trim()
}

function unique(values: readonly string[] | undefined) {
  return [...new Set((values ?? []).map(value => cleanText(value)).filter(Boolean))]
}

function normalizeUrl(value: string | undefined) {
  const cleaned = cleanText(value)
  return cleaned || undefined
}

function normalizeResource(resource: DlMdxUserscriptResource): DlMdxUserscriptResource {
  return { name: cleanText(resource.name), url: cleanText(resource.url) }
}

export function normalizeDlMdxUserscript(project: DlMdxUserscriptProject): DlMdxUserscriptProject {
  const metadata = project?.metadata ?? {} as DlMdxUserscriptMetadata
  const grants = unique(metadata.grants)
  return {
    metadata: {
      id: cleanText(metadata.id).toLocaleLowerCase(),
      name: cleanText(metadata.name, 'Untitled userscript'),
      namespace: cleanText(metadata.namespace, 'https://dragon-liquid.dev/userscripts'),
      version: cleanText(metadata.version, '0.1.0'),
      description: normalizeUrl(metadata.description),
      author: normalizeUrl(metadata.author),
      matches: unique(metadata.matches),
      includes: unique(metadata.includes),
      excludes: unique(metadata.excludes),
      grants: grants.length ? grants : ['none'],
      connect: unique(metadata.connect),
      requires: unique(metadata.requires),
      resources: (metadata.resources ?? []).map(normalizeResource).filter(item => item.name && item.url),
      runAt: metadata.runAt ?? 'document-idle',
      injectInto: metadata.injectInto ?? 'auto',
      noframes: Boolean(metadata.noframes),
      icon: normalizeUrl(metadata.icon),
      homepageUrl: normalizeUrl(metadata.homepageUrl),
      supportUrl: normalizeUrl(metadata.supportUrl),
      downloadUrl: normalizeUrl(metadata.downloadUrl),
      updateUrl: normalizeUrl(metadata.updateUrl),
    },
    source: String(project?.source ?? '').replace(metadataBlockPattern, '').trim(),
  }
}

function isHttpsUrl(value: string) {
  try { return new URL(value).protocol === 'https:' } catch { return false }
}

function isValidMatch(value: string) {
  return value === '<all_urls>' || matchPattern.test(value)
}

export function validateDlMdxUserscript(project: DlMdxUserscriptProject): DlMdxUserscriptDiagnostic[] {
  const { metadata, source } = normalizeDlMdxUserscript(project)
  const diagnostics: DlMdxUserscriptDiagnostic[] = []
  const error = (code: string, message: string, field?: DlMdxUserscriptDiagnostic['field']) => diagnostics.push({ code, severity: 'error', message, field })
  const warning = (code: string, message: string, field?: DlMdxUserscriptDiagnostic['field']) => diagnostics.push({ code, severity: 'warning', message, field })

  if (!idPattern.test(metadata.id)) error('id.invalid', '脚本 ID 必须为 3–80 位小写字母、数字、点、下划线或连字符。', 'id')
  if (!metadata.name || metadata.name.length > 120) error('name.invalid', '脚本名称必须包含 1–120 个字符。', 'name')
  if (!metadata.namespace || metadata.namespace.length > 240) error('namespace.invalid', '命名空间必须包含 1–240 个字符。', 'namespace')
  if (!versionPattern.test(metadata.version)) error('version.invalid', '版本号必须使用 1、1.2、1.2.3 或带预发布后缀的格式。', 'version')
  if (!metadata.matches.length && !(metadata.includes?.length)) error('targets.empty', '至少需要一个 @match 或 @include 目标。', 'matches')
  metadata.matches.filter(value => !isValidMatch(value)).forEach(value => error('match.invalid', `无效的 @match：${value}`, 'matches'))
  if (metadata.grants?.includes('none') && metadata.grants.length > 1) error('grant.none', '@grant none 不能和其他权限同时使用。', 'grants')
  metadata.grants?.filter(value => value !== 'none' && !/^(?:GM(?:[_.][A-Za-z][\w.]*)?|unsafeWindow|window\.close)$/.test(value))
    .forEach(value => error('grant.invalid', `无效的权限名称：${value}`, 'grants'))
  metadata.grants?.filter(value => !(dlMdxUserscriptKnownGrants as readonly string[]).includes(value))
    .forEach(value => warning('grant.unknown', `权限 ${value} 不在内置兼容清单中，安装前请确认目标脚本管理器支持。`, 'grants'))
  metadata.requires?.filter(value => !isHttpsUrl(value)).forEach(value => error('require.https', `@require 只接受 HTTPS：${value}`, 'requires'))
  metadata.resources?.filter(value => !/^[A-Za-z][\w.-]{0,63}$/.test(value.name) || !isHttpsUrl(value.url))
    .forEach(value => error('resource.invalid', `资源必须使用安全名称和 HTTPS URL：${value.name}`, 'resources'))
  for (const [field, value] of Object.entries({ icon: metadata.icon, homepageUrl: metadata.homepageUrl, supportUrl: metadata.supportUrl, downloadUrl: metadata.downloadUrl, updateUrl: metadata.updateUrl })) {
    if (value && !isHttpsUrl(value)) error('url.https', `${field} 只接受 HTTPS URL。`, field as keyof DlMdxUserscriptMetadata)
  }
  if (!source) error('source.empty', '脚本源码不能为空。', 'source')
  if (new TextEncoder().encode(source).byteLength > 1024 * 1024) error('source.size', '脚本源码不能超过 1 MiB。', 'source')
  if (/\b(?:eval|new\s+Function)\s*\(/.test(source)) warning('source.dynamic-code', '源码使用动态代码执行；共享目录会向安装者显示高风险提示。', 'source')
  return diagnostics
}

function headerLine(name: string, value: string) {
  return `// @${name.padEnd(14)} ${cleanText(value)}`
}

export function buildDlMdxUserscript(project: DlMdxUserscriptProject): DlMdxUserscriptBuildResult {
  const normalized = normalizeDlMdxUserscript(project)
  const diagnostics = validateDlMdxUserscript(normalized)
  const metadata = normalized.metadata
  const lines = [
    '// ==UserScript==',
    headerLine('name', metadata.name),
    headerLine('namespace', metadata.namespace),
    headerLine('version', metadata.version),
  ]
  if (metadata.description) lines.push(headerLine('description', metadata.description))
  if (metadata.author) lines.push(headerLine('author', metadata.author))
  metadata.matches.forEach(value => lines.push(headerLine('match', value)))
  metadata.includes?.forEach(value => lines.push(headerLine('include', value)))
  metadata.excludes?.forEach(value => lines.push(headerLine('exclude', value)))
  metadata.grants?.forEach(value => lines.push(headerLine('grant', value)))
  metadata.connect?.forEach(value => lines.push(headerLine('connect', value)))
  metadata.requires?.forEach(value => lines.push(headerLine('require', value)))
  metadata.resources?.forEach(value => lines.push(headerLine('resource', `${value.name} ${value.url}`)))
  lines.push(headerLine('run-at', metadata.runAt ?? 'document-idle'))
  lines.push(headerLine('inject-into', metadata.injectInto ?? 'auto'))
  if (metadata.noframes) lines.push('// @noframes')
  if (metadata.icon) lines.push(headerLine('icon', metadata.icon))
  if (metadata.homepageUrl) lines.push(headerLine('homepageURL', metadata.homepageUrl))
  if (metadata.supportUrl) lines.push(headerLine('supportURL', metadata.supportUrl))
  if (metadata.downloadUrl) lines.push(headerLine('downloadURL', metadata.downloadUrl))
  if (metadata.updateUrl) lines.push(headerLine('updateURL', metadata.updateUrl))
  lines.push('// ==/UserScript==')
  const code = `${lines.join('\n')}\n\n${normalized.source}\n`
  return {
    ok: !diagnostics.some(item => item.severity === 'error'),
    code,
    filename: `${metadata.id || 'userscript'}.user.js`,
    metadata,
    diagnostics,
  }
}

function wildcardExpression(pattern: string) {
  return new RegExp(`^${pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*')}$`, 'i')
}

function matchUrlPattern(pattern: string, url: URL) {
  if (pattern === '<all_urls>') return ['http:', 'https:', 'file:', 'ftp:'].includes(url.protocol)
  const match = pattern.match(matchPattern)
  if (!match) return false
  const [, scheme, hostPattern, pathPattern] = match
  if (scheme === '*' ? !['http:', 'https:'].includes(url.protocol) : `${scheme.toLocaleLowerCase()}:` !== url.protocol) return false
  const hostname = url.hostname.toLocaleLowerCase()
  const expectedHost = hostPattern.toLocaleLowerCase()
  const hostMatches = expectedHost === '*'
    || (expectedHost.startsWith('*.') ? hostname === expectedHost.slice(2) || hostname.endsWith(`.${expectedHost.slice(2)}`) : hostname === expectedHost)
  return hostMatches && wildcardExpression(pathPattern).test(`${url.pathname}${url.search}${url.hash}`)
}

export function dlMdxUserscriptMatchesUrl(project: DlMdxUserscriptProject | DlMdxUserscriptMetadata, input: string | URL) {
  let url: URL
  try { url = input instanceof URL ? input : new URL(input) } catch { return false }
  const metadata = 'metadata' in project ? normalizeDlMdxUserscript(project).metadata : normalizeDlMdxUserscript({ metadata: project, source: 'placeholder' }).metadata
  const fullUrl = url.href
  if (metadata.excludes?.some(pattern => wildcardExpression(pattern).test(fullUrl))) return false
  return metadata.matches.some(pattern => matchUrlPattern(pattern, url))
    || Boolean(metadata.includes?.some(pattern => wildcardExpression(pattern).test(fullUrl)))
}

export function parseDlMdxUserscript(code: string): DlMdxUserscriptProject {
  const block = String(code).match(metadataBlockPattern)?.[0]
  if (!block) throw new Error('源码缺少 ==UserScript== 元数据块。')
  const values = new Map<string, string[]>()
  for (const line of block.split(/\r?\n/)) {
    const match = line.match(/^\/\/\s*@([\w.-]+)(?:\s+(.*?))?\s*$/)
    if (!match) continue
    const key = match[1].toLocaleLowerCase()
    values.set(key, [...(values.get(key) ?? []), cleanText(match[2])])
  }
  const first = (name: string, fallback = '') => values.get(name)?.[0] || fallback
  const resources = (values.get('resource') ?? []).map(value => {
    const separator = value.search(/\s/)
    return { name: separator < 0 ? value : value.slice(0, separator), url: separator < 0 ? '' : value.slice(separator).trim() }
  })
  const name = first('name', 'Imported userscript')
  const inferredId = name.toLocaleLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80)
  return normalizeDlMdxUserscript({
    metadata: {
      id: inferredId.length >= 3 ? inferredId : 'imported-userscript',
      name,
      namespace: first('namespace', 'https://dragon-liquid.dev/userscripts'),
      version: first('version', '0.1.0'),
      description: first('description') || undefined,
      author: first('author') || undefined,
      matches: values.get('match') ?? [],
      includes: values.get('include'),
      excludes: values.get('exclude'),
      grants: values.get('grant'),
      connect: values.get('connect'),
      requires: values.get('require'),
      resources,
      runAt: first('run-at', 'document-idle') as DlMdxUserscriptRunAt,
      injectInto: first('inject-into', 'auto') as DlMdxUserscriptInjectInto,
      noframes: values.has('noframes'),
      icon: first('icon') || undefined,
      homepageUrl: first('homepageurl') || undefined,
      supportUrl: first('supporturl') || undefined,
      downloadUrl: first('downloadurl') || undefined,
      updateUrl: first('updateurl') || undefined,
    },
    source: String(code).replace(metadataBlockPattern, '').trim(),
  })
}
