import {
  resolveDlMdxEventSchema,
  resolveDlMdxPropSchema,
  type DlMdxComponentDefinition,
  type DlMdxEventSchema,
  type DlMdxPropSchema,
  type DlMdxRegistry,
  type DlMdxSchemaType,
  type DlMdxTypeSchema,
} from './dl-mdx.registry'
import { parseDlMdxFrontMatter } from './dl-mdx.frontmatter'
import type { DlMdxValue } from './dl-mdx.types'

export type DlMdxDiagnosticSeverity = 'error' | 'warning' | 'info'
export type DlMdxDiagnosticCode =
  | 'syntax.component-unclosed'
  | 'syntax.component-orphan-end'
  | 'syntax.component-line'
  | 'syntax.fence-unclosed'
  | 'component.unknown'
  | 'component.duplicate-id'
  | 'prop.unknown'
  | 'prop.duplicate'
  | 'prop.required'
  | 'prop.type'
  | 'prop.enum'
  | 'prop.range'
  | 'prop.pattern'
  | 'event.unknown'
  | 'event.duplicate'
  | 'event.action-invalid'
  | 'action.unknown'
  | 'schema.deprecated'

export interface DlMdxDiagnosticFix {
  label: string
  from: number
  to: number
  insert: string
}

export interface DlMdxDiagnostic {
  code: DlMdxDiagnosticCode | (string & {})
  severity: DlMdxDiagnosticSeverity
  message: string
  from: number
  to: number
  line: number
  column: number
  fix?: DlMdxDiagnosticFix
}

export interface DlMdxLanguageComponentProperty {
  name: string
  value: DlMdxValue | undefined
  rawValue: string
  from: number
  to: number
  line: number
}

export interface DlMdxLanguageComponentEvent {
  name: string
  action: string
  from: number
  to: number
  line: number
}

export interface DlMdxLanguageComponent {
  name: string
  from: number
  to: number
  nameFrom: number
  nameTo: number
  line: number
  endLine: number
  closed: boolean
  properties: DlMdxLanguageComponentProperty[]
  events: DlMdxLanguageComponentEvent[]
}

export interface DlMdxLanguageAnalysis {
  diagnostics: DlMdxDiagnostic[]
  components: DlMdxLanguageComponent[]
  errorCount: number
  warningCount: number
}

export interface DlMdxValidatorContext {
  source: string
  registry?: DlMdxRegistry
  components: readonly DlMdxLanguageComponent[]
}

export type DlMdxValidator = (context: DlMdxValidatorContext) => DlMdxDiagnostic[]

export interface DlMdxLanguageOptions {
  completion?: boolean
  diagnostics?: boolean
  actionNames?: string[]
  actionDescriptions?: Record<string, string>
  severity?: Partial<Record<DlMdxDiagnosticCode, DlMdxDiagnosticSeverity | 'off'>>
  validators?: DlMdxValidator[]
}

export type DlMdxCompletionKind = 'component' | 'property' | 'event' | 'action' | 'value' | 'keyword' | 'snippet'

export interface DlMdxCompletionItem {
  label: string
  kind: DlMdxCompletionKind
  detail?: string
  documentation?: string
  apply: string
  boost?: number
}

export interface DlMdxCompletionResult {
  from: number
  to: number
  items: DlMdxCompletionItem[]
}

export interface DlMdxHoverInfo {
  from: number
  to: number
  title: string
  detail?: string
  documentation?: string
}

export interface DlMdxFormatOptions {
  propertyOrder?: 'preserve' | 'schema' | 'alphabetical'
  equalsSpacing?: 'none' | 'single' | 'align'
  quoteStyle?: 'preserve' | 'double' | 'single'
  indentSize?: number
  bulletMarker?: 'preserve' | '-' | '*'
  normalizeFenceLanguages?: boolean
  maxBlankLines?: number
  trailingNewline?: boolean
}

export interface DlMdxScriptSymbol {
  name: string
  from: number
  to: number
  description?: string
}

/**
 * Reads exported action names from a companion JavaScript/TypeScript document.
 * The source is never evaluated; these symbols only enrich MDX diagnostics and completion.
 */
export function extractDlMdxActionSymbols(source: string): DlMdxScriptSymbol[] {
  const pattern = /\bexport\s+(?:default\s+)?(?:(?:async\s+)?function\s+([A-Za-z_$][\w$]*)|(?:const|let|var)\s+([A-Za-z_$][\w$]*))/g
  const symbols = new Map<string, DlMdxScriptSymbol>()
  let match: RegExpExecArray | null
  while ((match = pattern.exec(source))) {
    const name = match[1] ?? match[2]
    if (!name || symbols.has(name)) continue
    const local = match[0].lastIndexOf(name)
    const from = match.index + Math.max(0, local)
    const before = source.slice(0, match.index)
    const comment = before.match(/\/\*\*([\s\S]*?)\*\/\s*$/)?.[1]
    const description = comment?.split('\n').map(line => line.replace(/^\s*\*?\s?/, '').trim()).filter(Boolean).join(' ')
    symbols.set(name, { name, from, to: from + name.length, description })
  }
  return [...symbols.values()]
}

type SourceLine = { text: string; raw: string; number: number; start: number; end: number }
type ScannedComponent = DlMdxLanguageComponent & { startLine: number; invalidLines: SourceLine[] }

const componentStartPattern = /^(\s*)\+\+\+component:([A-Za-z][\w.-]*)\s*$/
const componentEndPattern = /^\s*\+\+\+end\s*$/
const propertyPattern = /^(\s*)([A-Za-z][\w.-]*)\s*=\s*(.*?)\s*$/
const eventPattern = /^(\s*)@([A-Za-z][\w:.-]*)\s*=\s*(.*?)\s*$/
const actionPattern = /^[A-Za-z][\w.-]*$/

function sourceLines(source: string): SourceLine[] {
  let offset = 0
  return source.split('\n').map((raw, number) => {
    const text = raw.endsWith('\r') ? raw.slice(0, -1) : raw
    const line = { text, raw, number, start: offset, end: offset + text.length }
    offset += raw.length + 1
    return line
  })
}

function lineAt(lines: SourceLine[], position: number): SourceLine {
  let left = 0
  let right = lines.length - 1
  while (left < right) {
    const middle = Math.ceil((left + right) / 2)
    if (lines[middle].start <= position) left = middle
    else right = middle - 1
  }
  return lines[left]
}

function parseString(value: string): string | undefined {
  if (value.length < 2) return undefined
  if (value.startsWith('"') && value.endsWith('"')) {
    try {
      const parsed: unknown = JSON.parse(value)
      return typeof parsed === 'string' ? parsed : undefined
    } catch { return undefined }
  }
  if (value.startsWith("'") && value.endsWith("'")) {
    return value.slice(1, -1).replace(/\\(['\\])/g, '$1')
  }
  return undefined
}

function parseValue(rawValue: string): { value?: DlMdxValue; malformed?: boolean } {
  const value = rawValue.trim()
  const stringValue = parseString(value)
  if (stringValue !== undefined) return { value: stringValue }
  if (value === 'true') return { value: true }
  if (value === 'false') return { value: false }
  if (value === 'null') return { value: null }
  if (/^-?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(value)) return { value: Number(value) }
  if (value.startsWith('[') || value.startsWith('{')) {
    try { return { value: JSON.parse(value) as DlMdxValue } }
    catch { return { malformed: true } }
  }
  return { value }
}

function unquoteAction(value: string): string {
  return parseString(value.trim()) ?? value.trim()
}

function diagnostic(line: SourceLine, from: number, to: number, code: DlMdxDiagnostic['code'], severity: DlMdxDiagnosticSeverity, message: string, fix?: DlMdxDiagnosticFix): DlMdxDiagnostic {
  return { code, severity, message, from, to: Math.max(from + 1, to), line: line.number + 1, column: from - line.start + 1, fix }
}

function scan(source: string): { lines: SourceLine[]; components: ScannedComponent[]; diagnostics: DlMdxDiagnostic[] } {
  const lines = sourceLines(source)
  const components: ScannedComponent[] = []
  const diagnostics: DlMdxDiagnostic[] = []
  let fence: { marker: string; size: number; line: SourceLine } | undefined
  let index = 0
  while (index < lines.length) {
    const line = lines[index]
    const trimmed = line.text.trimStart()
    if (fence) {
      const close = line.text.trim()
      if (close.length >= fence.size && close.split('').every(character => character === fence!.marker)) fence = undefined
      index += 1
      continue
    }
    const fenceMatch = trimmed.match(/^(```+|~~~+)/)
    if (fenceMatch) {
      fence = { marker: fenceMatch[1][0], size: fenceMatch[1].length, line }
      index += 1
      continue
    }
    const opening = line.text.match(componentStartPattern)
    if (!opening) {
      if (componentEndPattern.test(line.text)) diagnostics.push(diagnostic(line, line.start, line.end, 'syntax.component-orphan-end', 'error', '发现没有对应组件起始标记的 +++end。', { label: '删除多余结束标记', from: line.start, to: Math.min(source.length, line.end + 1), insert: '' }))
      index += 1
      continue
    }

    const nameOffset = line.text.indexOf(opening[2])
    const properties: DlMdxLanguageComponentProperty[] = []
    const events: DlMdxLanguageComponentEvent[] = []
    const invalidLines: SourceLine[] = []
    let cursor = index + 1
    while (cursor < lines.length && !componentEndPattern.test(lines[cursor].text)) {
      const current = lines[cursor]
      if (!current.text.trim()) {
        invalidLines.push(current)
        cursor += 1
        continue
      }
      const event = current.text.match(eventPattern)
      const property = current.text.match(propertyPattern)
      if (event) {
        const local = current.text.indexOf(event[2])
        events.push({ name: event[2], action: unquoteAction(event[3]), from: current.start + local, to: current.start + local + event[2].length, line: current.number })
      } else if (property) {
        const local = current.text.indexOf(property[2])
        properties.push({ name: property[2], rawValue: property[3], value: parseValue(property[3]).value, from: current.start + local, to: current.start + local + property[2].length, line: current.number })
      } else invalidLines.push(current)
      cursor += 1
    }
    const closed = cursor < lines.length
    const endLine = closed ? cursor : Math.max(index, lines.length - 1)
    components.push({
      name: opening[2],
      from: line.start,
      to: lines[endLine].end,
      nameFrom: line.start + nameOffset,
      nameTo: line.start + nameOffset + opening[2].length,
      line: line.number,
      endLine,
      closed,
      properties,
      events,
      startLine: index,
      invalidLines,
    })
    if (!closed) diagnostics.push(diagnostic(line, line.start, line.end, 'syntax.component-unclosed', 'error', `组件 ${opening[2]} 缺少 +++end。`, { label: '补上结束标记', from: source.length, to: source.length, insert: `${source.endsWith('\n') ? '' : '\n'}+++end` }))
    for (const invalid of invalidLines.filter(item => item.text.trim())) diagnostics.push(diagnostic(invalid, invalid.start, invalid.end, 'syntax.component-line', 'error', '组件块内只能书写 name = value 或 @event = action。'))
    index = closed ? cursor + 1 : lines.length
  }
  if (fence) diagnostics.push(diagnostic(fence.line, fence.line.start, fence.line.end, 'syntax.fence-unclosed', 'error', '代码围栏没有闭合。', { label: '补上代码围栏', from: source.length, to: source.length, insert: `${source.endsWith('\n') ? '' : '\n'}${fence.marker.repeat(fence.size)}` }))
  return { lines, components, diagnostics }
}

function valueType(value: DlMdxValue | undefined): DlMdxSchemaType | 'undefined' {
  if (value === undefined) return 'undefined'
  if (value === null) return 'null'
  if (Array.isArray(value)) return 'array'
  if (typeof value === 'object') return 'object'
  return typeof value as 'string' | 'number' | 'boolean'
}

function schemaTypeLabel(schema: DlMdxTypeSchema): string {
  const type = schema.type ?? 'any'
  return Array.isArray(type) ? type.join(' | ') : type
}

function matchesType(value: DlMdxValue, schema: DlMdxTypeSchema): boolean {
  const types = Array.isArray(schema.type) ? schema.type : [schema.type ?? 'any']
  return types.includes('any') || types.includes(valueType(value) as DlMdxSchemaType)
}

function valuesEqual(left: DlMdxValue, right: DlMdxValue): boolean {
  return JSON.stringify(left) === JSON.stringify(right)
}

function validateValue(value: DlMdxValue | undefined, schema: DlMdxTypeSchema, property: DlMdxLanguageComponentProperty, line: SourceLine): DlMdxDiagnostic[] {
  if (value === undefined) return [diagnostic(line, property.from, property.to, 'prop.type', 'error', `${property.name} 的值无法解析。`)]
  if (!matchesType(value, schema)) return [diagnostic(line, property.from, property.to, 'prop.type', 'error', `${property.name} 需要 ${schemaTypeLabel(schema)}，当前是 ${valueType(value)}。`)]
  const results: DlMdxDiagnostic[] = []
  if (schema.enum?.length && !schema.enum.some(candidate => valuesEqual(candidate, value))) results.push(diagnostic(line, property.from, property.to, 'prop.enum', 'error', `${property.name} 只能使用：${schema.enum.map(item => JSON.stringify(item)).join('、')}。`))
  if (typeof value === 'number') {
    if (schema.minimum !== undefined && value < schema.minimum) results.push(diagnostic(line, property.from, property.to, 'prop.range', 'error', `${property.name} 不能小于 ${schema.minimum}。`))
    if (schema.maximum !== undefined && value > schema.maximum) results.push(diagnostic(line, property.from, property.to, 'prop.range', 'error', `${property.name} 不能大于 ${schema.maximum}。`))
  }
  if (typeof value === 'string') {
    if (schema.minLength !== undefined && value.length < schema.minLength) results.push(diagnostic(line, property.from, property.to, 'prop.range', 'error', `${property.name} 至少需要 ${schema.minLength} 个字符。`))
    if (schema.maxLength !== undefined && value.length > schema.maxLength) results.push(diagnostic(line, property.from, property.to, 'prop.range', 'error', `${property.name} 最多允许 ${schema.maxLength} 个字符。`))
    if (schema.pattern) {
      try { if (!new RegExp(schema.pattern).test(value)) results.push(diagnostic(line, property.from, property.to, 'prop.pattern', 'error', `${property.name} 不符合格式 ${schema.pattern}。`)) } catch { /* Invalid host schema stays inert. */ }
    }
  }
  if (Array.isArray(value) && schema.items) value.forEach((item, index) => results.push(...validateValue(item, schema.items!, { ...property, name: `${property.name}[${index}]` }, line)))
  if (value && typeof value === 'object' && !Array.isArray(value) && schema.properties) {
    for (const name of schema.requiredProperties ?? []) if (!(name in value)) results.push(diagnostic(line, property.from, property.to, 'prop.required', 'error', `${property.name}.${name} 是必填字段。`))
    for (const [name, child] of Object.entries(value)) if (schema.properties[name]) results.push(...validateValue(child, schema.properties[name], { ...property, name: `${property.name}.${name}` }, line))
  }
  return results
}

function applySeverity(items: DlMdxDiagnostic[], options: DlMdxLanguageOptions): DlMdxDiagnostic[] {
  return items.flatMap((item) => {
    const override = options.severity?.[item.code as DlMdxDiagnosticCode]
    if (override === 'off') return []
    return [{ ...item, severity: override ?? item.severity }]
  })
}

export function analyzeDlMdx(source: string, registry?: DlMdxRegistry, options: DlMdxLanguageOptions = {}): DlMdxLanguageAnalysis {
  const scanned = scan(source)
  const diagnostics = [...scanned.diagnostics]
  const frontMatter = parseDlMdxFrontMatter(source)
  diagnostics.push(...frontMatter.diagnostics.map((item) => {
    const line = scanned.lines[Math.max(0, item.line - 1)] ?? scanned.lines[0]
    return diagnostic(line, line.start, line.end, item.code, item.severity, item.message)
  }))
  const ids = new Map<string, DlMdxLanguageComponentProperty>()
  const actionNames = new Set(options.actionNames ?? [])
  for (const component of scanned.components) {
    const definition = registry?.resolve(component.name)
    const openingLine = scanned.lines[component.line]
    if (registry && !definition) diagnostics.push(diagnostic(openingLine, component.nameFrom, component.nameTo, 'component.unknown', 'error', `未注册 MarkdownX 组件 ${component.name}。`))
    if (!definition) continue
    const propSchema = resolveDlMdxPropSchema(definition)
    const eventSchema = resolveDlMdxEventSchema(definition)
    const seenProps = new Set<string>()
    const seenEvents = new Set<string>()
    for (const property of component.properties) {
      const line = scanned.lines[property.line]
      if (seenProps.has(property.name)) diagnostics.push(diagnostic(line, property.from, property.to, 'prop.duplicate', 'error', `属性 ${property.name} 重复声明。`))
      seenProps.add(property.name)
      const schema = propSchema[property.name]
      if (!schema) diagnostics.push(diagnostic(line, property.from, property.to, 'prop.unknown', 'warning', `${definition.name} 没有属性 ${property.name}。`, { label: '删除未知属性', from: line.start, to: Math.min(source.length, line.end + 1), insert: '' }))
      else {
        diagnostics.push(...validateValue(property.value, schema, property, line))
        if (schema.deprecated) diagnostics.push(diagnostic(line, property.from, property.to, 'schema.deprecated', 'warning', typeof schema.deprecated === 'string' ? schema.deprecated : `${property.name} 已弃用。`))
      }
      if (property.name === 'id' && typeof property.value === 'string') {
        const previous = ids.get(property.value)
        if (previous) diagnostics.push(diagnostic(line, property.from, property.to, 'component.duplicate-id', 'error', `组件 id ${property.value} 已在第 ${previous.line + 1} 行使用。`))
        else ids.set(property.value, property)
      }
    }
    for (const [name, schema] of Object.entries(propSchema)) if (schema.required && !seenProps.has(name) && schema.default === undefined) diagnostics.push(diagnostic(openingLine, component.nameFrom, component.nameTo, 'prop.required', 'error', `${definition.name} 缺少必填属性 ${name}。`, { label: `添加 ${name}`, from: openingLine.end, to: openingLine.end, insert: `\n${name} = ${placeholder(schema)}` }))
    for (const event of component.events) {
      const line = scanned.lines[event.line]
      if (seenEvents.has(event.name)) diagnostics.push(diagnostic(line, event.from, event.to, 'event.duplicate', 'error', `事件 @${event.name} 重复绑定。`))
      seenEvents.add(event.name)
      const schema = eventSchema[event.name]
      if (!schema) diagnostics.push(diagnostic(line, event.from, event.to, 'event.unknown', 'warning', `${definition.name} 不会发出 ${event.name} 事件。`))
      else if (schema.deprecated) diagnostics.push(diagnostic(line, event.from, event.to, 'schema.deprecated', 'warning', typeof schema.deprecated === 'string' ? schema.deprecated : `事件 ${event.name} 已弃用。`))
      if (!actionPattern.test(event.action)) diagnostics.push(diagnostic(line, event.from, event.to, 'event.action-invalid', 'error', `动作名 ${event.action || '(空)'} 无效；这里只能引用宿主注册的动作标识。`))
      else if (actionNames.size && !actionNames.has(event.action)) diagnostics.push(diagnostic(line, event.from, event.to, 'action.unknown', 'error', `宿主没有注册动作 ${event.action}。`))
    }
  }
  for (const validator of options.validators ?? []) {
    try { diagnostics.push(...validator({ source, registry, components: scanned.components })) }
    catch { /* A host validator cannot interrupt the editor language service. */ }
  }
  const filtered = options.diagnostics === false ? [] : applySeverity(diagnostics, options).sort((left, right) => left.from - right.from || left.to - right.to)
  return {
    diagnostics: filtered,
    components: scanned.components,
    errorCount: filtered.filter(item => item.severity === 'error').length,
    warningCount: filtered.filter(item => item.severity === 'warning').length,
  }
}

function serialized(value: DlMdxValue): string {
  return typeof value === 'string' ? JSON.stringify(value) : JSON.stringify(value)
}

function placeholder(schema: DlMdxTypeSchema): string {
  if (schema.enum?.length) return serialized(schema.enum[0])
  if ('default' in schema && (schema as DlMdxPropSchema).default !== undefined) return serialized((schema as DlMdxPropSchema).default!)
  const types = Array.isArray(schema.type) ? schema.type : [schema.type ?? 'any']
  if (types.includes('string')) return '""'
  if (types.includes('number')) return String(schema.minimum ?? 0)
  if (types.includes('boolean')) return 'true'
  if (types.includes('array')) return '[]'
  if (types.includes('object')) return '{}'
  return 'null'
}

function definitionSummary(definition: DlMdxComponentDefinition): string {
  return [definition.description, definition.category ? `分类：${definition.category}` : '', definition.maturity ? `成熟度：${definition.maturity}` : ''].filter(Boolean).join('\n')
}

function propertyDocumentation(name: string, schema: DlMdxPropSchema): string {
  const constraints = [
    `类型：${schemaTypeLabel(schema)}`,
    schema.required ? '必填' : '可选',
    schema.enum?.length ? `可选值：${schema.enum.map(item => JSON.stringify(item)).join('、')}` : '',
    schema.minimum !== undefined || schema.maximum !== undefined ? `范围：${schema.minimum ?? '−∞'} ～ ${schema.maximum ?? '+∞'}` : '',
    schema.deprecated ? '已弃用' : '',
  ].filter(Boolean)
  return [schema.description || `${name} 属性`, constraints.join(' · ')].filter(Boolean).join('\n')
}

function completionRange(line: SourceLine, position: number, pattern = /[@\w:.-]/): { from: number; to: number } {
  let from = position
  while (from > line.start && pattern.test(line.text[from - line.start - 1] ?? '')) from -= 1
  return { from, to: position }
}

const frontMatterFields = [
  { key: 'title', detail: '页面标题', documentation: '用于导航和浏览器标题；不会渲染到正文。', value: 'Page title' },
  { key: 'route', detail: '公开路由', documentation: '以 / 开头的站内路由。', value: '/guide/start' },
  { key: 'description', detail: '导航摘要', documentation: '侧边导航与搜索结果可以显示这段说明。', value: 'Page summary' },
  { key: 'group', detail: '导航组 ID', documentation: '省略时使用 /pages 下的目录。', value: 'guides' },
  { key: 'group-title', detail: '导航组显示名', documentation: '覆盖目录 _group.json 的显示名。', value: 'Guides' },
  { key: 'group-order', detail: '导航组顺序', documentation: '数值越小越靠前。', value: '10' },
  { key: 'order', detail: '页面顺序', documentation: '当前导航组内的排序值。', value: '1' },
  { key: 'icon', detail: '导航图标文本', documentation: 'rail 模式和侧边导航使用的紧凑标记。', value: 'S' },
  { key: 'layout', detail: '页面布局', documentation: '宿主可映射为母版页导航模式。', value: 'docs' },
  { key: 'hidden', detail: '从导航隐藏', documentation: '路由仍然构建，但不会出现在自动导航中。', value: 'false' },
] as const

function frontMatterLine(source: string, lineNumber: number): boolean {
  const lines = source.replace(/^\uFEFF/, '').split(/\r?\n/)
  if (lines[0]?.trim() !== '---') return false
  const closing = lines.findIndex((line, index) => index > 0 && line.trim() === '---')
  return closing > 0 && lineNumber > 0 && lineNumber < closing
}

export function completeDlMdx(source: string, position: number, registry?: DlMdxRegistry, options: DlMdxLanguageOptions = {}, explicit = false): DlMdxCompletionResult | undefined {
  if (options.completion === false) return undefined
  const scanned = scan(source)
  const line = lineAt(scanned.lines, position)
  const before = source.slice(line.start, position)
  if (frontMatterLine(source, line.number)) {
    const valueMatch = before.match(/^\s*([\w-]+)\s*:\s*([\w/-]*)$/)
    if (valueMatch) {
      const from = position - valueMatch[2].length
      const values = valueMatch[1] === 'layout' ? ['landing', 'docs', 'article', 'dashboard'] : ['hidden', 'navigation'].includes(valueMatch[1]) ? ['true', 'false'] : []
      if (values.length) return { from, to: position, items: values.map(value => ({ label: value, kind: 'value', detail: `${valueMatch[1]} value`, apply: value })) }
    }
    if (/^\s*[\w-]*$/.test(before)) {
      const range = completionRange(line, position, /[\w-]/)
      return { ...range, items: frontMatterFields.map(field => ({ label: field.key, kind: 'property', detail: field.detail, documentation: field.documentation, apply: `${field.key}: ${field.value}` })) }
    }
  }
  const componentName = before.match(/^\s*\+\+\+component:([\w.-]*)$/)
  if (componentName) {
    const from = position - componentName[1].length
    return {
      from,
      to: position,
      items: (registry?.entries() ?? []).filter(item => item.insertable !== false).map(definition => ({
        label: definition.name,
        kind: 'component',
        detail: definition.category ? `${definition.category} · ${definition.maturity ?? 'stable'}` : definition.maturity,
        documentation: definitionSummary(definition),
        apply: definition.name,
        boost: definition.maturity === 'custom' ? 2 : 1,
      })),
    }
  }

  const component = scanned.components.find(item => line.number > item.line && line.number <= item.endLine)
  if (component) {
    const definition = registry?.resolve(component.name)
    const eventValue = before.match(/^\s*@([A-Za-z][\w:.-]*)\s*=\s*([\w.-]*)$/)
    if (eventValue) {
      const from = position - eventValue[2].length
      return { from, to: position, items: (options.actionNames ?? []).map(action => ({ label: action, kind: 'action', detail: '宿主动作', documentation: options.actionDescriptions?.[action], apply: action })) }
    }
    const propertyValue = before.match(/^\s*([A-Za-z][\w.-]*)\s*=\s*(.*?)$/)
    if (propertyValue && definition) {
      const schema = resolveDlMdxPropSchema(definition)[propertyValue[1]]
      if (schema?.enum?.length) {
        const from = position - propertyValue[2].length
        return { from, to: position, items: schema.enum.map(value => ({ label: serialized(value), kind: 'value', detail: schemaTypeLabel(schema), documentation: schema.description, apply: serialized(value) })) }
      }
    }
    if (/^\s*@?[\w:.-]*$/.test(before) && definition) {
      const range = completionRange(line, position)
      const seenProps = new Set(component.properties.map(item => item.name))
      const seenEvents = new Set(component.events.map(item => item.name))
      const props = Object.entries(resolveDlMdxPropSchema(definition)).filter(([name]) => !seenProps.has(name)).map(([name, schema]) => ({
        label: name,
        kind: 'property' as const,
        detail: `${schemaTypeLabel(schema)}${schema.required ? ' · required' : ''}`,
        documentation: propertyDocumentation(name, schema),
        apply: `${name} = ${placeholder(schema)}`,
        boost: schema.required ? 3 : 1,
      }))
      const events = Object.entries(resolveDlMdxEventSchema(definition)).filter(([name]) => !seenEvents.has(name)).map(([name, schema]) => ({
        label: `@${name}`,
        kind: 'event' as const,
        detail: schema.payload ? schemaTypeLabel(schema.payload) : 'event',
        documentation: schema.description,
        apply: `@${name} = ${options.actionNames?.[0] ?? 'actionName'}`,
      }))
      return { ...range, items: [...props, ...events, { label: '+++end', kind: 'keyword', detail: '结束组件块', apply: '+++end' }] }
    }
  }

  if (before.trim() === '+++' || before.trim().startsWith('+++c')) {
    const range = completionRange(line, position, /[+\w.-]/)
    return { ...range, items: [{ label: '+++component:', kind: 'snippet', detail: 'MarkdownX 组件块', apply: '+++component:' }] }
  }
  if (explicit) {
    return {
      from: position,
      to: position,
      items: [
        { label: '组件块', kind: 'snippet', detail: 'MarkdownX', documentation: '插入一个带类型提示的安全组件块。', apply: '+++component:' },
        { label: '页面隐藏域', kind: 'snippet', detail: 'DL-MDX page', documentation: '插入标题、路由、分组、顺序和布局配置。', apply: '---\ntitle: Page title\nroute: /page\norder: 1\nlayout: docs\n---\n\n' },
        { label: '二级标题', kind: 'snippet', detail: 'Markdown', apply: '## 标题' },
        { label: '任务列表', kind: 'snippet', detail: 'Markdown', apply: '- [ ] 待办事项' },
        { label: 'TypeScript 代码块', kind: 'snippet', detail: 'Markdown', apply: '```typescript\n\n```' },
        { label: '表格', kind: 'snippet', detail: 'Markdown', apply: '| 字段 | 内容 |\n| :--- | :--- |\n| 名称 | 值 |' },
      ],
    }
  }
  return undefined
}

function tokenRange(line: SourceLine, position: number): { from: number; to: number; value: string } {
  let from = position
  let to = position
  while (from > line.start && /[@\w:.-]/.test(line.text[from - line.start - 1] ?? '')) from -= 1
  while (to < line.end && /[@\w:.-]/.test(line.text[to - line.start] ?? '')) to += 1
  return { from, to, value: sourceSlice(line, from, to) }
}

function sourceSlice(line: SourceLine, from: number, to: number): string {
  return line.text.slice(from - line.start, to - line.start)
}

export function hoverDlMdx(source: string, position: number, registry?: DlMdxRegistry, options: DlMdxLanguageOptions = {}): DlMdxHoverInfo | undefined {
  const scanned = scan(source)
  const line = lineAt(scanned.lines, position)
  if (frontMatterLine(source, line.number)) {
    const token = tokenRange(line, position)
    const field = frontMatterFields.find(item => item.key === token.value.replace(/:$/, ''))
    if (field) return { from: token.from, to: token.to, title: field.key, detail: field.detail, documentation: field.documentation }
  }
  const component = scanned.components.find(item => position >= item.from && position <= item.to)
  if (!component) return undefined
  const definition = registry?.resolve(component.name)
  if (!definition) return undefined
  if (position >= component.nameFrom && position <= component.nameTo) return { from: component.nameFrom, to: component.nameTo, title: definition.name, detail: definition.description, documentation: `${definition.category ?? 'general'} · ${definition.maturity ?? 'stable'}` }
  const token = tokenRange(line, position)
  const propertyName = token.value.replace(/^@/, '')
  const prop = resolveDlMdxPropSchema(definition)[propertyName]
  if (prop && !token.value.startsWith('@')) return { from: token.from, to: token.to, title: propertyName, detail: schemaTypeLabel(prop), documentation: propertyDocumentation(propertyName, prop) }
  const event = resolveDlMdxEventSchema(definition)[propertyName]
  if (event && token.value.startsWith('@')) return { from: token.from, to: token.to, title: token.value, detail: event.payload ? schemaTypeLabel(event.payload) : 'event', documentation: event.description }
  if (options.actionNames?.includes(token.value)) return { from: token.from, to: token.to, title: token.value, detail: '宿主注册动作', documentation: options.actionDescriptions?.[token.value] }
  return undefined
}

function canonicalFenceLanguage(value: string): string {
  const normalized = value.toLowerCase()
  const aliases: Record<string, string> = { js: 'javascript', jsx: 'javascript', ts: 'typescript', tsx: 'typescript', py: 'python', rs: 'rust', cs: 'csharp', 'c#': 'csharp', sh: 'shell', bash: 'shell', ps1: 'powershell', yml: 'yaml', htm: 'html' }
  return aliases[normalized] ?? normalized
}

function formatQuotedValue(value: string, quoteStyle: DlMdxFormatOptions['quoteStyle']): string {
  if (quoteStyle === 'preserve') return value.trim()
  const parsed = parseString(value.trim())
  if (parsed === undefined) return value.trim()
  if (quoteStyle === 'single') return `'${parsed.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
  return JSON.stringify(parsed)
}

function orderEntries<T extends { name: string }>(entries: T[], order: DlMdxFormatOptions['propertyOrder'], definition?: DlMdxComponentDefinition): T[] {
  if (order === 'preserve') return entries
  if (order === 'alphabetical' || !definition) return [...entries].sort((left, right) => left.name.localeCompare(right.name, 'en'))
  const ranks = new Map(Object.keys(resolveDlMdxPropSchema(definition)).map((name, index) => [name, index]))
  return [...entries].sort((left, right) => (ranks.get(left.name) ?? Number.MAX_SAFE_INTEGER) - (ranks.get(right.name) ?? Number.MAX_SAFE_INTEGER) || left.name.localeCompare(right.name, 'en'))
}

export function formatDlMdx(source: string, options: DlMdxFormatOptions = {}, registry?: DlMdxRegistry): string {
  const config: Required<DlMdxFormatOptions> = {
    propertyOrder: options.propertyOrder ?? 'schema',
    equalsSpacing: options.equalsSpacing ?? 'single',
    quoteStyle: options.quoteStyle ?? 'double',
    indentSize: Math.max(0, Math.min(8, Math.trunc(options.indentSize ?? 0))),
    bulletMarker: options.bulletMarker ?? 'preserve',
    normalizeFenceLanguages: options.normalizeFenceLanguages ?? true,
    maxBlankLines: Math.max(0, Math.min(3, Math.trunc(options.maxBlankLines ?? 1))),
    trailingNewline: options.trailingNewline ?? true,
  }
  const normalized = source.replace(/\r\n?/g, '\n')
  const scanned = scan(normalized)
  const byStart = new Map(scanned.components.map(component => [component.startLine, component]))
  const output: string[] = []
  let index = 0
  while (index < scanned.lines.length) {
    const component = byStart.get(index)
    if (component?.closed) {
      const definition = registry?.resolve(component.name)
      const canonicalName = definition?.name ?? component.name
      const properties = orderEntries(component.properties, config.propertyOrder, definition)
      const events = config.propertyOrder === 'alphabetical' ? [...component.events].sort((left, right) => left.name.localeCompare(right.name, 'en')) : component.events
      const rows = [
        ...properties.map(property => ({ name: property.name, value: formatQuotedValue(property.rawValue, config.quoteStyle) })),
        ...events.map(event => ({ name: `@${event.name}`, value: event.action })),
      ]
      const width = config.equalsSpacing === 'align' ? Math.max(0, ...rows.map(row => row.name.length)) : 0
      const indent = ' '.repeat(config.indentSize)
      output.push(`+++component:${canonicalName}`)
      for (const row of rows) {
        const equals = config.equalsSpacing === 'none' ? '=' : config.equalsSpacing === 'align' ? `${' '.repeat(width - row.name.length)} = ` : ' = '
        output.push(`${indent}${row.name}${equals}${row.value}`)
      }
      output.push(...component.invalidLines.filter(line => line.text.trim()).map(line => line.text.trimEnd()))
      output.push('+++end')
      index = component.endLine + 1
      continue
    }
    let value = scanned.lines[index].text.trimEnd()
    if (config.normalizeFenceLanguages) value = value.replace(/^(\s*)(```+|~~~+)\s*([^\s`]*)\s*$/, (_, indent: string, marker: string, language: string) => `${indent}${marker}${language ? canonicalFenceLanguage(language) : ''}`)
    if (config.bulletMarker !== 'preserve') value = value.replace(/^(\s*)[-+*](\s+(?:\[[ xX]\]\s+)?)/, `$1${config.bulletMarker}$2`)
    output.push(value)
    index += 1
  }
  const collapsed: string[] = []
  let blanks = 0
  for (const line of output) {
    if (!line.trim()) {
      blanks += 1
      if (blanks > config.maxBlankLines) continue
    } else blanks = 0
    collapsed.push(line)
  }
  while (collapsed.length && !collapsed[collapsed.length - 1]) collapsed.pop()
  const result = collapsed.join('\n')
  return config.trailingNewline ? `${result}\n` : result
}
