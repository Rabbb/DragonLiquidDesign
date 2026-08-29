import { analyzeDlMdx, extractDlMdxActionSymbols, type DlMdxDiagnosticSeverity, type DlMdxLanguageOptions, type DlMdxScriptSymbol } from './dl-mdx.language'
import { parseDlMdxFrontMatter, type DlMdxPageMetadata } from './dl-mdx.frontmatter'
import { parseDlMdx } from './dl-mdx.parser'
import { analyzeDlMdxTemplate } from './dl-mdx.template'
import type { DlMdxRegistry } from './dl-mdx.registry'
import type { DlMdxDocument, DlMdxValue } from './dl-mdx.types'
import type { DlSiteNavigationGroup } from './site-layout.types'

export const dlMdxProjectSchemaVersion = 1 as const

export type DlMdxProjectFileLanguage = 'mdx' | 'typescript' | 'javascript' | 'css' | 'json' | 'text' | 'asset'
export type DlMdxProjectFileEncoding = 'utf8' | 'base64'

export interface DlMdxProjectFile {
  kind: 'file'
  path: string
  content: string
  language: DlMdxProjectFileLanguage
  encoding: DlMdxProjectFileEncoding
  mediaType?: string
}

export interface DlMdxProjectDirectory {
  kind: 'directory'
  path: string
}

export type DlMdxProjectEntry = DlMdxProjectFile | DlMdxProjectDirectory

export interface DlMdxProjectRouteDefinition {
  path: string
  file: string
  title?: string
}

export interface DlMdxProjectManifest {
  schemaVersion: typeof dlMdxProjectSchemaVersion
  id: string
  name: string
  version: string
  entry: string
  layout?: string
  routes?: DlMdxProjectRouteDefinition[]
  sharedScripts?: string[]
  sharedStyles?: string[]
  dataFiles?: string[]
  metadata?: Record<string, DlMdxValue>
}

export interface DlMdxProjectSnapshot {
  manifest: DlMdxProjectManifest
  entries: DlMdxProjectEntry[]
  revision: number
}

export type DlMdxProjectInput = Omit<Partial<DlMdxProjectSnapshot>, 'manifest'> & {
  manifest?: Partial<DlMdxProjectManifest>
}

export interface DlMdxProjectTreeNode {
  entry: DlMdxProjectEntry
  children: DlMdxProjectTreeNode[]
}

export type DlMdxProjectChangeKind = 'create' | 'update' | 'move' | 'remove' | 'manifest' | 'replace'

export interface DlMdxProjectChange {
  kind: DlMdxProjectChangeKind
  path?: string
  previousPath?: string
}

export interface DlMdxProjectChangeEvent {
  revision: number
  changes: DlMdxProjectChange[]
  snapshot: DlMdxProjectSnapshot
}

export interface DlMdxProjectDiagnostic {
  code: string
  severity: DlMdxDiagnosticSeverity
  message: string
  path?: string
  line?: number
  column?: number
  from?: number
  to?: number
}

export interface DlMdxBuiltRoute {
  route: string
  title?: string
  file: string
  source: string
  rawSource: string
  metadata: DlMdxPageMetadata
  script: string
  style: string
  scriptFiles: string[]
  styleFiles: string[]
  actionSymbols: DlMdxScriptSymbol[]
  document: DlMdxDocument
  diagnostics: DlMdxProjectDiagnostic[]
}

export interface DlMdxBuiltLayout {
  file: string
  source: string
  rawSource: string
  style: string
  styleFiles: string[]
  diagnostics: DlMdxProjectDiagnostic[]
}

export interface DlMdxProjectBuildResult {
  ok: boolean
  revision: number
  entryRoute?: string
  layout?: DlMdxBuiltLayout
  routes: DlMdxBuiltRoute[]
  navigation: DlSiteNavigationGroup[]
  data: Record<string, DlMdxValue>
  diagnostics: DlMdxProjectDiagnostic[]
}

export interface DlMdxProjectBuildOptions {
  registry?: DlMdxRegistry
  languageOptions?: DlMdxLanguageOptions
  limits?: Partial<DlMdxEngineLimits>
}

export interface DlMdxEngineLimits {
  maxEntries: number
  maxFileBytes: number
  maxProjectBytes: number
  maxDepth: number
}

export const defaultDlMdxEngineLimits: Readonly<DlMdxEngineLimits> = Object.freeze({
  maxEntries: 1_000,
  maxFileBytes: 2 * 1024 * 1024,
  maxProjectBytes: 25 * 1024 * 1024,
  maxDepth: 32,
})

export interface DlMdxProjectStorageEntry {
  id: string
  name: string
  version: string
  updatedAt?: string
}

export interface DlMdxProjectStorageAdapter {
  load(id: string): Promise<DlMdxProjectSnapshot | undefined>
  save(project: DlMdxProjectSnapshot): Promise<void>
  remove(id: string): Promise<void>
  list(): Promise<DlMdxProjectStorageEntry[]>
}

export interface DlMdxHttpStorageAdapterOptions {
  baseUrl: string
  fetch?: typeof globalThis.fetch
  headers?: HeadersInit
  credentials?: RequestCredentials
}

export interface DlMdxEngineDraft {
  exists(path: string): boolean
  read(path: string): DlMdxProjectEntry | undefined
  list(path?: string, recursive?: boolean): DlMdxProjectEntry[]
  createDirectory(path: string): void
  writeFile(path: string, content: string, options?: Partial<Pick<DlMdxProjectFile, 'language' | 'encoding' | 'mediaType'>>): void
  move(path: string, target: string): void
  remove(path: string, recursive?: boolean): void
  updateManifest(patch: Partial<Omit<DlMdxProjectManifest, 'schemaVersion'>>): void
}

export interface DlMdxEngine {
  readonly revision: number
  readonly limits: Readonly<DlMdxEngineLimits>
  snapshot(): DlMdxProjectSnapshot
  manifest(): DlMdxProjectManifest
  exists(path: string): boolean
  read(path: string): DlMdxProjectEntry | undefined
  readFile(path: string): DlMdxProjectFile | undefined
  list(path?: string, recursive?: boolean): DlMdxProjectEntry[]
  tree(): DlMdxProjectTreeNode
  createDirectory(path: string): void
  writeFile(path: string, content: string, options?: Partial<Pick<DlMdxProjectFile, 'language' | 'encoding' | 'mediaType'>>): void
  move(path: string, target: string): void
  remove(path: string, recursive?: boolean): void
  updateManifest(patch: Partial<Omit<DlMdxProjectManifest, 'schemaVersion'>>): void
  transaction<T>(callback: (draft: DlMdxEngineDraft) => T): T
  replace(project: DlMdxProjectSnapshot): void
  validate(): DlMdxProjectDiagnostic[]
  build(options?: DlMdxProjectBuildOptions): DlMdxProjectBuildResult
  subscribe(listener: (event: DlMdxProjectChangeEvent) => void): () => void
  save(storage: DlMdxProjectStorageAdapter): Promise<void>
  restore(storage: DlMdxProjectStorageAdapter, id?: string): Promise<boolean>
}

export interface CreateDlMdxEngineOptions {
  project?: DlMdxProjectInput
  registry?: DlMdxRegistry
  languageOptions?: DlMdxLanguageOptions
  limits?: Partial<DlMdxEngineLimits>
}

const idPattern = /^[A-Za-z0-9][A-Za-z0-9._-]{0,79}$/
const routePattern = /^\/(?:[A-Za-z0-9._~-]+\/?)*$/
const textEncoder = new TextEncoder()

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function resolveLimits(input: Partial<DlMdxEngineLimits> = {}): DlMdxEngineLimits {
  const limits = { ...defaultDlMdxEngineLimits, ...input }
  for (const [name, value] of Object.entries(limits)) {
    if (!Number.isSafeInteger(value) || value < 1) throw new Error(`MarkdownX 项目限制 ${name} 必须是正整数。`)
  }
  return limits
}

function compareEntries(left: DlMdxProjectEntry, right: DlMdxProjectEntry): number {
  if (left.kind !== right.kind) return left.kind === 'directory' ? -1 : 1
  return left.path.localeCompare(right.path, 'en')
}

export function normalizeDlMdxProjectPath(input: string): string {
  if (input.includes('\0')) throw new Error('MarkdownX 项目路径不能包含空字符。')
  const replaced = input.trim().replace(/\\/g, '/')
  if (/^[A-Za-z]:/.test(replaced) || /^[a-z][a-z\d+.-]*:/i.test(replaced)) throw new Error(`MarkdownX 项目路径不能使用磁盘或 URL：${input}`)
  const segments = replaced.split('/').filter(segment => segment && segment !== '.')
  if (segments.some(segment => segment === '..')) throw new Error(`MarkdownX 项目路径不能越过项目根目录：${input}`)
  if (segments.some(segment => segment.length > 120)) throw new Error(`MarkdownX 项目路径段过长：${input}`)
  const normalized = `/${segments.join('/')}`
  if (normalized.length > 1024) throw new Error('MarkdownX 项目路径超过 1024 个字符。')
  return normalized || '/'
}

export function dirnameDlMdxProjectPath(path: string): string {
  const normalized = normalizeDlMdxProjectPath(path)
  if (normalized === '/') return '/'
  const index = normalized.lastIndexOf('/')
  return index <= 0 ? '/' : normalized.slice(0, index)
}

function languageFromPath(path: string): DlMdxProjectFileLanguage {
  const extension = path.split('.').at(-1)?.toLowerCase()
  if (extension === 'mdx' || extension === 'md') return 'mdx'
  if (extension === 'ts' || extension === 'tsx') return 'typescript'
  if (extension === 'js' || extension === 'jsx' || extension === 'mjs') return 'javascript'
  if (extension === 'css') return 'css'
  if (extension === 'json') return 'json'
  return 'text'
}

function normalizeRoute(input: string): string {
  const value = `/${input.trim()}`.replace(/\/+/g, '/').replace(/\/$/, '') || '/'
  if (!routePattern.test(value)) throw new Error(`无效的 MarkdownX 项目路由：${input}`)
  return value
}

function routeFromPage(path: string): string {
  const normalized = normalizeDlMdxProjectPath(path)
  const relative = normalized.replace(/^\/pages\/?/, '').replace(/\.(?:md|mdx)$/i, '')
  const route = relative === 'index' ? '/' : `/${relative.replace(/\/index$/i, '')}`
  return normalizeRoute(route)
}

function defaultManifest(partial: Partial<DlMdxProjectManifest> = {}): DlMdxProjectManifest {
  return {
    schemaVersion: dlMdxProjectSchemaVersion,
    id: partial.id ?? 'untitled-mdx-project',
    name: partial.name ?? 'Untitled MarkdownX Project',
    version: partial.version ?? '0.1.0',
    entry: normalizeDlMdxProjectPath(partial.entry ?? '/pages/index.mdx'),
    ...(partial.layout ? { layout: normalizeDlMdxProjectPath(partial.layout) } : {}),
    ...(partial.routes ? { routes: partial.routes.map(route => ({ ...route, path: normalizeRoute(route.path), file: normalizeDlMdxProjectPath(route.file) })) } : {}),
    ...(partial.sharedScripts ? { sharedScripts: partial.sharedScripts.map(normalizeDlMdxProjectPath) } : {}),
    ...(partial.sharedStyles ? { sharedStyles: partial.sharedStyles.map(normalizeDlMdxProjectPath) } : {}),
    ...(partial.dataFiles ? { dataFiles: partial.dataFiles.map(normalizeDlMdxProjectPath) } : {}),
    ...(partial.metadata ? { metadata: clone(partial.metadata) } : {}),
  }
}

function defaultEntries(): DlMdxProjectEntry[] {
  return [
    { kind: 'directory', path: '/' },
    { kind: 'directory', path: '/pages' },
    { kind: 'file', path: '/pages/index.mdx', language: 'mdx', encoding: 'utf8', content: '# Untitled MarkdownX Project\n' },
  ]
}

function normalizeEntry(entry: DlMdxProjectEntry): DlMdxProjectEntry {
  const path = normalizeDlMdxProjectPath(entry.path)
  if (entry.kind === 'directory') return { kind: 'directory', path }
  if (path === '/') throw new Error('项目根目录不能被写成文件。')
  return {
    kind: 'file',
    path,
    content: String(entry.content ?? ''),
    language: entry.language ?? languageFromPath(path),
    encoding: entry.encoding ?? 'utf8',
    ...(entry.mediaType ? { mediaType: entry.mediaType } : {}),
  }
}

function entriesMap(entries: DlMdxProjectEntry[]): Map<string, DlMdxProjectEntry> {
  const map = new Map<string, DlMdxProjectEntry>([['/', { kind: 'directory', path: '/' }]])
  for (const raw of entries) {
    const entry = normalizeEntry(raw)
    if (map.has(entry.path) && entry.path !== '/') throw new Error(`MarkdownX 项目存在重复路径：${entry.path}`)
    map.set(entry.path, entry)
  }
  for (const entry of [...map.values()]) ensureParents(map, entry.path)
  return map
}

function ensureParents(map: Map<string, DlMdxProjectEntry>, path: string) {
  let parent = dirnameDlMdxProjectPath(path)
  while (!map.has(parent)) {
    map.set(parent, { kind: 'directory', path: parent })
    if (parent === '/') break
    parent = dirnameDlMdxProjectPath(parent)
  }
  const parentEntry = map.get(dirnameDlMdxProjectPath(path))
  if (path !== '/' && parentEntry?.kind !== 'directory') throw new Error(`MarkdownX 项目的父路径不是目录：${path}`)
}

function listEntries(map: Map<string, DlMdxProjectEntry>, input = '/', recursive = false): DlMdxProjectEntry[] {
  const path = normalizeDlMdxProjectPath(input)
  const target = map.get(path)
  if (!target || target.kind !== 'directory') return []
  return [...map.values()].filter((entry) => {
    if (entry.path === path) return false
    if (recursive) return path === '/' || entry.path.startsWith(`${path}/`)
    return dirnameDlMdxProjectPath(entry.path) === path
  }).map(clone).sort(compareEntries)
}

function projectTree(map: Map<string, DlMdxProjectEntry>): DlMdxProjectTreeNode {
  const nodes = new Map<string, DlMdxProjectTreeNode>()
  for (const entry of [...map.values()].sort(compareEntries)) nodes.set(entry.path, { entry: clone(entry), children: [] })
  for (const node of nodes.values()) {
    if (node.entry.path === '/') continue
    nodes.get(dirnameDlMdxProjectPath(node.entry.path))?.children.push(node)
  }
  const sort = (node: DlMdxProjectTreeNode) => {
    node.children.sort((left, right) => compareEntries(left.entry, right.entry))
    node.children.forEach(sort)
  }
  const root = nodes.get('/')!
  sort(root)
  return root
}

function snapshotOf(manifest: DlMdxProjectManifest, map: Map<string, DlMdxProjectEntry>, revision: number): DlMdxProjectSnapshot {
  return { manifest: clone(manifest), entries: [...map.values()].map(clone).sort(compareEntries), revision }
}

function validateSnapshot(snapshot: DlMdxProjectSnapshot, limitOptions: Partial<DlMdxEngineLimits> = {}): DlMdxProjectDiagnostic[] {
  const diagnostics: DlMdxProjectDiagnostic[] = []
  const limits = resolveLimits(limitOptions)
  const map = new Map(snapshot.entries.map(entry => [entry.path, entry]))
  if (snapshot.manifest.schemaVersion !== dlMdxProjectSchemaVersion) diagnostics.push({ code: 'manifest.schema', severity: 'error', message: `不支持的项目结构版本：${snapshot.manifest.schemaVersion}` })
  if (!idPattern.test(snapshot.manifest.id)) diagnostics.push({ code: 'manifest.id', severity: 'error', message: '项目 ID 只能包含字母、数字、点、下划线和连字符。' })
  if (!snapshot.manifest.name.trim()) diagnostics.push({ code: 'manifest.name', severity: 'error', message: '项目名称不能为空。' })
  if (snapshot.entries.length > limits.maxEntries) diagnostics.push({ code: 'limit.entries', severity: 'error', message: `项目条目超过 ${limits.maxEntries} 个。` })
  let projectBytes = 0
  const entry = map.get(normalizeDlMdxProjectPath(snapshot.manifest.entry))
  if (!entry || entry.kind !== 'file' || entry.language !== 'mdx') diagnostics.push({ code: 'manifest.entry', severity: 'error', path: snapshot.manifest.entry, message: '项目入口必须指向一个存在的 MDX 文件。' })
  for (const item of snapshot.entries) {
    if (item.path === '/') continue
    const parent = map.get(dirnameDlMdxProjectPath(item.path))
    if (!parent || parent.kind !== 'directory') diagnostics.push({ code: 'filesystem.parent', severity: 'error', path: item.path, message: '文件或目录缺少有效的父目录。' })
    const depth = item.path === '/' ? 0 : item.path.split('/').length - 1
    if (depth > limits.maxDepth) diagnostics.push({ code: 'limit.depth', severity: 'error', path: item.path, message: `目录深度超过 ${limits.maxDepth} 层。` })
    if (item.kind === 'file') {
      const bytes = textEncoder.encode(item.content).byteLength
      projectBytes += bytes
      if (bytes > limits.maxFileBytes) diagnostics.push({ code: 'limit.file-size', severity: 'error', path: item.path, message: `文件超过 ${limits.maxFileBytes} 字节。` })
      if (item.encoding === 'base64' && !/^[A-Za-z\d+/]*={0,2}$/.test(item.content.replace(/\s/g, ''))) diagnostics.push({ code: 'filesystem.base64', severity: 'error', path: item.path, message: '资源文件不是有效的 Base64 内容。' })
    }
  }
  if (projectBytes > limits.maxProjectBytes) diagnostics.push({ code: 'limit.project-size', severity: 'error', message: `项目内容超过 ${limits.maxProjectBytes} 字节。` })
  for (const path of [...(snapshot.manifest.sharedScripts ?? []), ...(snapshot.manifest.sharedStyles ?? []), ...(snapshot.manifest.dataFiles ?? [])]) {
    if (map.get(path)?.kind !== 'file') diagnostics.push({ code: 'manifest.shared-missing', severity: 'error', path, message: '共享脚本或样式文件不存在。' })
  }
  if (snapshot.manifest.layout) {
    const layout = map.get(snapshot.manifest.layout)
    if (!layout || layout.kind !== 'file' || layout.language !== 'mdx') diagnostics.push({ code: 'manifest.layout', severity: 'error', path: snapshot.manifest.layout, message: '项目母版必须指向一个存在的 MDX 文件。' })
  }
  for (const path of snapshot.manifest.dataFiles ?? []) {
    const dataFile = map.get(path)
    if (dataFile?.kind === 'file' && dataFile.language !== 'json') diagnostics.push({ code: 'manifest.data', severity: 'error', path, message: '项目数据文件必须使用 JSON 语言。' })
  }
  return diagnostics
}

function companionFiles(page: DlMdxProjectFile, map: Map<string, DlMdxProjectEntry>, manifest: DlMdxProjectManifest) {
  const base = page.path.replace(/\.(?:md|mdx)$/i, '')
  const localScript = [`${base}.ts`, `${base}.js`].find(path => map.get(path)?.kind === 'file')
  const localStyle = `${base}.css`
  const scriptFiles = [...(manifest.sharedScripts ?? []), ...(localScript ? [localScript] : [])]
  const styleFiles = [...(manifest.sharedStyles ?? []), ...(map.get(localStyle)?.kind === 'file' ? [localStyle] : [])]
  const join = (paths: string[]) => paths.map(path => {
    const file = map.get(path)
    return file?.kind === 'file' ? `/* ${path} */\n${file.content}` : ''
  }).filter(Boolean).join('\n\n')
  return { scriptFiles, styleFiles, script: join(scriptFiles), style: join(styleFiles) }
}

interface ResolvedRouteDefinition extends DlMdxProjectRouteDefinition {
  metadata: DlMdxPageMetadata
  source: string
  rawSource: string
  bodyStartLine: number
}

interface DirectoryGroupConfig {
  title?: string
  order?: number
  hidden?: boolean
  collapsed?: boolean
}

function pageTitle(source: string, file: string): string {
  const heading = source.match(/^#\s+(.+)$/m)?.[1]?.replace(/[*_`~]/g, '').trim()
  if (heading) return heading
  const name = file.split('/').at(-1)?.replace(/\.(?:md|mdx)$/i, '').replace(/[-_]+/g, ' ') ?? 'Page'
  return name.replace(/\b\w/g, value => value.toUpperCase())
}

function routeDefinitions(manifest: DlMdxProjectManifest, map: Map<string, DlMdxProjectEntry>, diagnostics: DlMdxProjectDiagnostic[]): ResolvedRouteDefinition[] {
  const explicitByFile = new Map((manifest.routes ?? []).map(route => [normalizeDlMdxProjectPath(route.file), route]))
  const files = new Map<string, DlMdxProjectFile>()
  for (const entry of map.values()) {
    if (entry.kind === 'file' && entry.language === 'mdx' && entry.path.startsWith('/pages/') && !/(?:^|\/)_(?:group|meta)\.mdx$/i.test(entry.path)) files.set(entry.path, entry)
  }
  for (const file of [manifest.entry, ...explicitByFile.keys()]) {
    const entry = map.get(normalizeDlMdxProjectPath(file))
    if (entry?.kind === 'file' && entry.language === 'mdx') files.set(entry.path, entry)
  }

  return [...files.values()].map((file) => {
    const frontMatter = parseDlMdxFrontMatter(file.content)
    diagnostics.push(...frontMatter.diagnostics.map(item => ({ ...item, path: file.path })))
    const explicit = explicitByFile.get(file.path)
    const fallbackRoute = explicit?.path ?? (file.path === manifest.entry ? '/' : routeFromPage(file.path))
    let path = fallbackRoute
    try { path = normalizeRoute(frontMatter.metadata.route ?? fallbackRoute) }
    catch (cause) {
      diagnostics.push({ code: 'frontmatter.route', severity: 'error', path: file.path, line: 1, message: cause instanceof Error ? cause.message : String(cause) })
      path = normalizeRoute(fallbackRoute)
    }
    return {
      path,
      file: file.path,
      title: frontMatter.metadata.title ?? explicit?.title ?? pageTitle(frontMatter.body, file.path),
      metadata: frontMatter.metadata,
      source: frontMatter.body,
      rawSource: file.content,
      bodyStartLine: frontMatter.bodyStartLine,
    }
  }).sort((left, right) => {
    if (left.file === manifest.entry) return -1
    if (right.file === manifest.entry) return 1
    return (left.metadata.order ?? 0) - (right.metadata.order ?? 0) || left.path.localeCompare(right.path, 'en')
  })
}

function directoryForPage(file: string): string {
  return dirnameDlMdxProjectPath(file).replace(/^\/pages\/?/, '') || 'main'
}

function readableGroupName(value: string): string {
  if (value === 'main') return 'Main'
  return value.split('/').at(-1)!.replace(/[-_]+/g, ' ').replace(/\b\w/g, letter => letter.toUpperCase())
}

function groupConfig(group: string, map: Map<string, DlMdxProjectEntry>, diagnostics: DlMdxProjectDiagnostic[]): DirectoryGroupConfig {
  const path = group === 'main' ? '/pages/_group.json' : `/pages/${group}/_group.json`
  const file = map.get(path)
  if (!file || file.kind !== 'file') return {}
  try {
    const parsed = JSON.parse(file.content) as DirectoryGroupConfig
    if (parsed.order !== undefined && !Number.isFinite(parsed.order)) throw new Error('order 必须是数字。')
    return parsed
  } catch (cause) {
    diagnostics.push({ code: 'navigation.group-config', severity: 'error', path, message: `_group.json 无法读取：${cause instanceof Error ? cause.message : String(cause)}` })
    return {}
  }
}

function buildNavigation(routes: DlMdxBuiltRoute[], map: Map<string, DlMdxProjectEntry>, diagnostics: DlMdxProjectDiagnostic[]): DlSiteNavigationGroup[] {
  const groups = new Map<string, DlSiteNavigationGroup>()
  for (const route of routes) {
    if (route.metadata.hidden) continue
    const directory = directoryForPage(route.file)
    const id = route.metadata.group?.trim() || directory
    const config = groupConfig(directory, map, diagnostics)
    if (config.hidden) continue
    const group = groups.get(id) ?? {
      id,
      label: route.metadata.groupTitle ?? config.title ?? readableGroupName(id),
      order: route.metadata.groupOrder ?? config.order ?? (id === 'main' ? -100 : 0),
      collapsed: config.collapsed,
      items: [],
    }
    group.items.push({
      id: route.file,
      label: route.title ?? pageTitle(route.source, route.file),
      href: route.route,
      description: route.metadata.description,
      file: route.file,
      icon: route.metadata.icon,
      order: route.metadata.order ?? 0,
    })
    groups.set(id, group)
  }
  return [...groups.values()].map(group => ({
    ...group,
    items: group.items.sort((left, right) => (left.order ?? 0) - (right.order ?? 0) || left.href.localeCompare(right.href, 'en')),
  })).filter(group => group.items.length > 0).sort((left, right) => (left.order ?? 0) - (right.order ?? 0) || left.label.localeCompare(right.label))
}

export function buildDlMdxProject(snapshot: DlMdxProjectSnapshot, options: DlMdxProjectBuildOptions = {}): DlMdxProjectBuildResult {
  const project = normalizeDlMdxProjectSnapshot(snapshot)
  const map = new Map(project.entries.map(entry => [entry.path, entry]))
  const diagnostics = validateSnapshot(project, options.limits)
  const routes: DlMdxBuiltRoute[] = []
  const data: Record<string, DlMdxValue> = {}
  for (const path of project.manifest.dataFiles ?? []) {
    const file = map.get(path)
    if (!file || file.kind !== 'file') continue
    try {
      const value = JSON.parse(file.content) as DlMdxValue
      const name = path.split('/').at(-1)?.replace(/\.json$/i, '') ?? path
      if (value && typeof value === 'object' && !Array.isArray(value)) Object.assign(data, value)
      else data[name] = value
    } catch (cause) {
      diagnostics.push({ code: 'data.json', severity: 'error', path, message: `项目数据文件无法读取：${cause instanceof Error ? cause.message : String(cause)}` })
    }
  }
  const usedRoutes = new Set<string>()
  for (const definition of routeDefinitions(project.manifest, map, diagnostics)) {
    const route = normalizeRoute(definition.path)
    if (usedRoutes.has(route)) {
      diagnostics.push({ code: 'route.duplicate', severity: 'error', path: definition.file, message: `路由 ${route} 被重复声明。` })
      continue
    }
    usedRoutes.add(route)
    const file = map.get(definition.file)
    if (!file || file.kind !== 'file' || file.language !== 'mdx') {
      diagnostics.push({ code: 'route.file', severity: 'error', path: definition.file, message: `路由 ${route} 没有有效的 MDX 页面。` })
      continue
    }
    const companion = companionFiles(file, map, project.manifest)
    const symbols = extractDlMdxActionSymbols(companion.script)
    const actionNames = [...new Set([...(options.languageOptions?.actionNames ?? []), ...symbols.map(symbol => symbol.name)])]
    const actionDescriptions = {
      ...Object.fromEntries(symbols.filter(symbol => symbol.description).map(symbol => [symbol.name, symbol.description!])),
      ...(options.languageOptions?.actionDescriptions ?? {}),
    }
    const analysisDiagnostics = definition.metadata.renderer === 'template'
      ? analyzeDlMdxTemplate(definition.source, options.registry)
      : analyzeDlMdx(definition.source, options.registry, { ...options.languageOptions, actionNames, actionDescriptions }).diagnostics
    const pageDiagnostics = analysisDiagnostics.map<DlMdxProjectDiagnostic>(item => ({ ...item, path: file.path, line: item.line === undefined ? undefined : item.line + definition.bodyStartLine - 1 }))
    diagnostics.push(...pageDiagnostics)
    routes.push({
      route,
      title: definition.title,
      file: file.path,
      source: definition.source,
      rawSource: definition.rawSource,
      metadata: definition.metadata,
      ...companion,
      actionSymbols: symbols,
      document: parseDlMdx(definition.source),
      diagnostics: pageDiagnostics,
    })
  }
  const entryRoute = routes.find(route => route.file === project.manifest.entry)?.route
  const navigation = buildNavigation(routes, map, diagnostics)
  let layout: DlMdxBuiltLayout | undefined
  if (project.manifest.layout) {
    const layoutFile = map.get(project.manifest.layout)
    if (layoutFile?.kind === 'file' && layoutFile.language === 'mdx') {
      const frontMatter = parseDlMdxFrontMatter(layoutFile.content)
      const layoutDiagnostics = analyzeDlMdxTemplate(frontMatter.body, options.registry).map<DlMdxProjectDiagnostic>(item => ({ ...item, path: layoutFile.path, line: item.line + frontMatter.bodyStartLine - 1 }))
      diagnostics.push(...layoutDiagnostics)
      const companion = companionFiles(layoutFile, map, project.manifest)
      layout = { file: layoutFile.path, source: frontMatter.body, rawSource: layoutFile.content, style: companion.style, styleFiles: companion.styleFiles, diagnostics: layoutDiagnostics }
    }
  }
  return { ok: !diagnostics.some(item => item.severity === 'error'), revision: project.revision, entryRoute, routes, navigation, layout, data, diagnostics }
}

export function normalizeDlMdxProjectSnapshot(project: DlMdxProjectInput): DlMdxProjectSnapshot {
  const manifest = defaultManifest(project.manifest)
  const map = entriesMap(project.entries?.length ? project.entries : defaultEntries())
  return snapshotOf(manifest, map, Math.max(0, Math.trunc(project.revision ?? 0)))
}

export function serializeDlMdxProject(project: DlMdxProjectSnapshot, pretty = true): string {
  const normalized = normalizeDlMdxProjectSnapshot(project)
  return JSON.stringify(normalized, null, pretty ? 2 : undefined)
}

export function parseDlMdxProject(source: string): DlMdxProjectSnapshot {
  const parsed = JSON.parse(source) as DlMdxProjectInput
  const project = normalizeDlMdxProjectSnapshot(parsed)
  const fatal = validateSnapshot(project).filter(item => item.code.startsWith('manifest.schema') || item.code.startsWith('filesystem.'))
  if (fatal.length) throw new Error(fatal.map(item => item.message).join('\n'))
  return project
}

export function createDlMdxMemoryStorageAdapter(initial: DlMdxProjectSnapshot[] = []): DlMdxProjectStorageAdapter {
  const projects = new Map(initial.map(project => [project.manifest.id, normalizeDlMdxProjectSnapshot(project)]))
  const updated = new Map<string, string>()
  return {
    async load(id) { const project = projects.get(id); return project ? clone(project) : undefined },
    async save(project) { const normalized = normalizeDlMdxProjectSnapshot(project); projects.set(normalized.manifest.id, normalized); updated.set(normalized.manifest.id, new Date().toISOString()) },
    async remove(id) { projects.delete(id); updated.delete(id) },
    async list() { return [...projects.values()].map(project => ({ id: project.manifest.id, name: project.manifest.name, version: project.manifest.version, updatedAt: updated.get(project.manifest.id) })).sort((left, right) => left.name.localeCompare(right.name)) },
  }
}

export function createDlMdxLocalStorageAdapter(options: { storage?: Storage; prefix?: string } = {}): DlMdxProjectStorageAdapter {
  const storage = options.storage ?? globalThis.localStorage
  const prefix = options.prefix ?? 'dragon-liquid:mdx-project:'
  const key = (id: string) => `${prefix}${id}`
  return {
    async load(id) {
      const source = storage.getItem(key(id))
      return source ? parseDlMdxProject(source) : undefined
    },
    async save(project) { storage.setItem(key(project.manifest.id), serializeDlMdxProject(project, false)) },
    async remove(id) { storage.removeItem(key(id)) },
    async list() {
      const results: DlMdxProjectStorageEntry[] = []
      for (let index = 0; index < storage.length; index += 1) {
        const storageKey = storage.key(index)
        if (!storageKey?.startsWith(prefix)) continue
        try {
          const source = storage.getItem(storageKey)
          if (!source) continue
          const project = parseDlMdxProject(source)
          results.push({ id: project.manifest.id, name: project.manifest.name, version: project.manifest.version })
        } catch { /* One broken record must not hide the remaining projects. */ }
      }
      return results.sort((left, right) => left.name.localeCompare(right.name))
    },
  }
}

export function createDlMdxHttpStorageAdapter(options: DlMdxHttpStorageAdapterOptions): DlMdxProjectStorageAdapter {
  const request = options.fetch ?? globalThis.fetch
  if (typeof request !== 'function') throw new Error('当前环境没有可用的 fetch，必须为 HTTP 存储适配器显式提供 fetch。')
  const baseUrl = options.baseUrl.replace(/\/+$/, '')
  if (!baseUrl) throw new Error('HTTP 存储适配器需要 baseUrl。')
  const headers = new Headers(options.headers)
  headers.set('accept', 'application/json')
  const projectUrl = (id: string) => {
    if (!idPattern.test(id)) throw new Error(`无效的 MarkdownX 项目 ID：${id}`)
    return `${baseUrl}/${encodeURIComponent(id)}`
  }
  const send = (input: string, init: RequestInit = {}) => request(input, { credentials: options.credentials, ...init, headers: new Headers({ ...Object.fromEntries(headers.entries()), ...Object.fromEntries(new Headers(init.headers).entries()) }) })
  const requireOk = async (response: Response) => {
    if (response.ok) return response
    const detail = await response.text().catch(() => '')
    throw new Error(`MarkdownX 项目存储请求失败（${response.status}）${detail ? `：${detail}` : ''}`)
  }
  return {
    async load(id) {
      const response = await send(projectUrl(id))
      if (response.status === 404) return undefined
      return normalizeDlMdxProjectSnapshot(await (await requireOk(response)).json() as DlMdxProjectSnapshot)
    },
    async save(project) {
      const normalized = normalizeDlMdxProjectSnapshot(project)
      await requireOk(await send(projectUrl(normalized.manifest.id), { method: 'PUT', headers: { 'content-type': 'application/json' }, body: serializeDlMdxProject(normalized, false) }))
    },
    async remove(id) { await requireOk(await send(projectUrl(id), { method: 'DELETE' })) },
    async list() {
      const result = await (await requireOk(await send(baseUrl))).json() as unknown
      if (!Array.isArray(result)) throw new Error('MarkdownX 项目列表响应必须是数组。')
      return result as DlMdxProjectStorageEntry[]
    },
  }
}

export function createDlMdxEngine(options: CreateDlMdxEngineOptions = {}): DlMdxEngine {
  const limits = resolveLimits(options.limits)
  const initial = normalizeDlMdxProjectSnapshot(options.project ?? {})
  const initialLimitErrors = validateSnapshot(initial, limits).filter(item => item.code.startsWith('limit.'))
  if (initialLimitErrors.length) throw new Error(initialLimitErrors.map(item => item.message).join('\n'))
  let manifest = initial.manifest
  let map = entriesMap(initial.entries)
  let revision = initial.revision
  let transactionActive = false
  const listeners = new Set<(event: DlMdxProjectChangeEvent) => void>()

  const transact = <T>(callback: (draft: DlMdxEngineDraft) => T): T => {
    if (transactionActive) throw new Error('MarkdownX 引擎不支持嵌套事务。')
    transactionActive = true
    const nextMap = entriesMap([...map.values()])
    let nextManifest = clone(manifest)
    const changes: DlMdxProjectChange[] = []

    const draft: DlMdxEngineDraft = {
      exists(path) { return nextMap.has(normalizeDlMdxProjectPath(path)) },
      read(path) { const entry = nextMap.get(normalizeDlMdxProjectPath(path)); return entry ? clone(entry) : undefined },
      list(path = '/', recursive = false) { return listEntries(nextMap, path, recursive) },
      createDirectory(path) {
        const normalized = normalizeDlMdxProjectPath(path)
        if (normalized === '/' || nextMap.has(normalized)) return
        ensureParents(nextMap, normalized)
        nextMap.set(normalized, { kind: 'directory', path: normalized })
        changes.push({ kind: 'create', path: normalized })
      },
      writeFile(path, content, fileOptions = {}) {
        const normalized = normalizeDlMdxProjectPath(path)
        if (normalized === '/') throw new Error('项目根目录不能被写成文件。')
        const previous = nextMap.get(normalized)
        if (previous?.kind === 'directory') throw new Error(`目录不能被直接覆盖为文件：${normalized}`)
        ensureParents(nextMap, normalized)
        const file: DlMdxProjectFile = {
          kind: 'file', path: normalized, content, language: fileOptions.language ?? previous?.language ?? languageFromPath(normalized), encoding: fileOptions.encoding ?? previous?.encoding ?? 'utf8',
          ...(fileOptions.mediaType ?? previous?.mediaType ? { mediaType: fileOptions.mediaType ?? previous?.mediaType } : {}),
        }
        if (previous && JSON.stringify(previous) === JSON.stringify(file)) return
        nextMap.set(normalized, file)
        changes.push({ kind: previous ? 'update' : 'create', path: normalized })
      },
      move(path, target) {
        const source = normalizeDlMdxProjectPath(path)
        const destination = normalizeDlMdxProjectPath(target)
        if (source === '/' || destination === '/') throw new Error('不能移动或覆盖项目根目录。')
        const entry = nextMap.get(source)
        if (!entry) throw new Error(`要移动的路径不存在：${source}`)
        if (destination.startsWith(`${source}/`)) throw new Error('目录不能移动到自己的子目录。')
        const moving = [...nextMap.values()].filter(item => item.path === source || item.path.startsWith(`${source}/`)).sort((left, right) => left.path.length - right.path.length)
        const targets = moving.map(item => `${destination}${item.path.slice(source.length)}`)
        if (targets.some(path => nextMap.has(path) && !moving.some(item => item.path === path))) throw new Error(`移动目标已经存在：${destination}`)
        ensureParents(nextMap, destination)
        for (const item of moving) nextMap.delete(item.path)
        moving.forEach((item, index) => nextMap.set(targets[index], { ...item, path: targets[index] }))
        if (nextManifest.entry === source || nextManifest.entry.startsWith(`${source}/`)) nextManifest.entry = `${destination}${nextManifest.entry.slice(source.length)}`
        if (nextManifest.layout === source || nextManifest.layout?.startsWith(`${source}/`)) nextManifest.layout = `${destination}${nextManifest.layout.slice(source.length)}`
        nextManifest.routes = nextManifest.routes?.map(route => route.file === source || route.file.startsWith(`${source}/`) ? { ...route, file: `${destination}${route.file.slice(source.length)}` } : route)
        nextManifest.sharedScripts = nextManifest.sharedScripts?.map(file => file === source || file.startsWith(`${source}/`) ? `${destination}${file.slice(source.length)}` : file)
        nextManifest.sharedStyles = nextManifest.sharedStyles?.map(file => file === source || file.startsWith(`${source}/`) ? `${destination}${file.slice(source.length)}` : file)
        nextManifest.dataFiles = nextManifest.dataFiles?.map(file => file === source || file.startsWith(`${source}/`) ? `${destination}${file.slice(source.length)}` : file)
        changes.push({ kind: 'move', previousPath: source, path: destination })
      },
      remove(path, recursive = false) {
        const normalized = normalizeDlMdxProjectPath(path)
        if (normalized === '/') throw new Error('不能删除项目根目录。')
        const target = nextMap.get(normalized)
        if (!target) return
        const descendants = [...nextMap.keys()].filter(path => path.startsWith(`${normalized}/`))
        if (descendants.length && !recursive) throw new Error(`目录不是空的：${normalized}`)
        nextMap.delete(normalized)
        descendants.forEach(path => nextMap.delete(path))
        changes.push({ kind: 'remove', path: normalized })
      },
      updateManifest(patch) {
        nextManifest = defaultManifest({ ...nextManifest, ...clone(patch), schemaVersion: dlMdxProjectSchemaVersion })
        changes.push({ kind: 'manifest' })
      },
    }

    try {
      const result = callback(draft)
      if (changes.length) {
        const nextSnapshot = snapshotOf(nextManifest, nextMap, revision + 1)
        const limitErrors = validateSnapshot(nextSnapshot, limits).filter(item => item.code.startsWith('limit.'))
        if (limitErrors.length) throw new Error(limitErrors.map(item => item.message).join('\n'))
        map = nextMap
        manifest = nextManifest
        revision += 1
        const snapshot = snapshotOf(manifest, map, revision)
        const event = { revision, changes: clone(changes), snapshot }
        listeners.forEach((listener) => {
          try { listener(event) } catch { /* Subscriber failures cannot roll back a committed project transaction. */ }
        })
      }
      return result
    } finally {
      transactionActive = false
    }
  }

  const engine: DlMdxEngine = {
    get revision() { return revision },
    get limits() { return Object.freeze({ ...limits }) },
    snapshot: () => snapshotOf(manifest, map, revision),
    manifest: () => clone(manifest),
    exists: path => map.has(normalizeDlMdxProjectPath(path)),
    read(path) { const entry = map.get(normalizeDlMdxProjectPath(path)); return entry ? clone(entry) : undefined },
    readFile(path) { const entry = map.get(normalizeDlMdxProjectPath(path)); return entry?.kind === 'file' ? clone(entry) : undefined },
    list: (path = '/', recursive = false) => listEntries(map, path, recursive),
    tree: () => projectTree(map),
    createDirectory: path => transact(draft => draft.createDirectory(path)),
    writeFile: (path, content, fileOptions) => transact(draft => draft.writeFile(path, content, fileOptions)),
    move: (path, target) => transact(draft => draft.move(path, target)),
    remove: (path, recursive = false) => transact(draft => draft.remove(path, recursive)),
    updateManifest: patch => transact(draft => draft.updateManifest(patch)),
    transaction: transact,
    replace(project) {
      const normalized = normalizeDlMdxProjectSnapshot(project)
      const limitErrors = validateSnapshot(normalized, limits).filter(item => item.code.startsWith('limit.'))
      if (limitErrors.length) throw new Error(limitErrors.map(item => item.message).join('\n'))
      manifest = normalized.manifest
      map = entriesMap(normalized.entries)
      revision = normalized.revision + 1
      const snapshot = engine.snapshot()
      listeners.forEach((listener) => {
        try { listener({ revision, changes: [{ kind: 'replace' }], snapshot }) } catch { /* Isolate subscriber failures. */ }
      })
    },
    validate: () => validateSnapshot(engine.snapshot(), limits),
    build: buildOptions => buildDlMdxProject(engine.snapshot(), { registry: buildOptions?.registry ?? options.registry, languageOptions: buildOptions?.languageOptions ?? options.languageOptions, limits: buildOptions?.limits ?? limits }),
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener) },
    async save(storage) { await storage.save(engine.snapshot()) },
    async restore(storage, id = manifest.id) { const project = await storage.load(id); if (!project) return false; engine.replace(project); return true },
  }
  return engine
}
