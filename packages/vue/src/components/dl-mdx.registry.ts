import { inject, type App, type Component, type InjectionKey, type VNodeChild } from 'vue'
import type { DlMdxComponentContext, DlMdxValue } from './dl-mdx.types'

export type DlMdxComponentCategory = 'foundation' | 'layout' | 'form' | 'color' | 'dates' | 'general'
export type DlMdxComponentMaturity = 'custom' | 'stable' | 'alpha'
export type DlMdxSchemaType = 'string' | 'number' | 'boolean' | 'null' | 'array' | 'object' | 'any'

export interface DlMdxTypeSchema {
  type?: DlMdxSchemaType | DlMdxSchemaType[]
  description?: string
  enum?: DlMdxValue[]
  items?: DlMdxTypeSchema
  properties?: Record<string, DlMdxTypeSchema>
  requiredProperties?: string[]
  minimum?: number
  maximum?: number
  minLength?: number
  maxLength?: number
  pattern?: string
}

export interface DlMdxPropSchema extends DlMdxTypeSchema {
  required?: boolean
  default?: DlMdxValue
  deprecated?: boolean | string
}

export interface DlMdxEventSchema {
  description?: string
  payload?: DlMdxTypeSchema
  deprecated?: boolean | string
}

export interface DlMdxActionInvocation {
  action: string
  event: string
  payload: unknown[]
  component: DlMdxComponentContext
}

export type DlMdxActionHandler = (invocation: DlMdxActionInvocation) => void | Promise<void>

export interface DlMdxActionDefinition {
  handler: DlMdxActionHandler
  description?: string
}

export type DlMdxActionMap = Record<string, DlMdxActionHandler | DlMdxActionDefinition>

export interface DlMdxRenderContext {
  name: string
  id?: string
  props: Record<string, DlMdxValue>
  sourceLine: number
  content?: string
  slots?: Record<string, string>
}

export type DlMdxComponentRenderer = (context: DlMdxRenderContext) => VNodeChild

export interface DlMdxComponentDefinition {
  name: string
  aliases?: string[]
  component?: Component
  render?: DlMdxComponentRenderer
  defaultProps?: Record<string, DlMdxValue>
  allowedProps?: string[]
  propSchema?: Record<string, DlMdxPropSchema>
  eventSchema?: Record<string, DlMdxEventSchema>
  contentProp?: string
  defaultContent?: string
  triggerLabel?: string
  category?: DlMdxComponentCategory
  maturity?: DlMdxComponentMaturity
  description?: string
  insertable?: boolean
}

export interface DlMdxRegistry {
  install: (app: App) => void
  register: (definition: DlMdxComponentDefinition) => DlMdxRegistry
  registerAll: (definitions: DlMdxComponentDefinition[]) => DlMdxRegistry
  unregister: (name: string) => boolean
  resolve: (name: string) => DlMdxComponentDefinition | undefined
  entries: () => DlMdxComponentDefinition[]
}

export const dlMdxRegistryKey: InjectionKey<DlMdxRegistry> = Symbol('dragon-liquid-mdx-registry')

function registryKey(value: string) {
  return value.trim().replace(/^dl(?=[A-Z_-]|mdx|markdown)/i, '').replace(/[^A-Za-z0-9]+/g, '').toLowerCase()
}

function validateDefinition(definition: DlMdxComponentDefinition) {
  if (!/^[A-Za-z][A-Za-z0-9._-]*$/.test(definition.name)) throw new Error(`无效的 MarkdownX 组件名称：${definition.name}`)
  if (!definition.component && !definition.render) throw new Error(`${definition.name} 必须提供 component 或 render。`)
  if (definition.component && definition.render) throw new Error(`${definition.name} 不能同时提供 component 与 render。`)
  for (const name of Object.keys(definition.propSchema ?? {})) {
    if (!/^[A-Za-z][\w.-]*$/.test(name)) throw new Error(`${definition.name} 包含无效的 MarkdownX 属性类型名称：${name}`)
  }
  for (const name of Object.keys(definition.eventSchema ?? {})) {
    if (!/^[A-Za-z][\w:.-]*$/.test(name)) throw new Error(`${definition.name} 包含无效的 MarkdownX 事件类型名称：${name}`)
  }
}

function schemaTypes(value: unknown): DlMdxSchemaType | DlMdxSchemaType[] {
  const constructors = Array.isArray(value) ? value : [value]
  const types = constructors.flatMap((constructor) => {
    if (constructor === String) return ['string' as const]
    if (constructor === Number) return ['number' as const]
    if (constructor === Boolean) return ['boolean' as const]
    if (constructor === Array) return ['array' as const]
    if (constructor === Object) return ['object' as const]
    return []
  })
  return types.length === 1 ? types[0] : types.length ? types : 'any'
}

function componentProps(component?: Component): Record<string, unknown> {
  const declared = (component as { props?: string[] | Record<string, unknown> } | undefined)?.props
  if (Array.isArray(declared)) return Object.fromEntries(declared.map(name => [name, undefined]))
  return declared ?? {}
}

export function resolveDlMdxPropSchema(definition: DlMdxComponentDefinition): Record<string, DlMdxPropSchema> {
  const inferred = Object.fromEntries(Object.entries(componentProps(definition.component)).map(([name, option]) => {
    const normalized = typeof option === 'object' && option !== null ? option as { type?: unknown; required?: boolean; default?: unknown } : { type: option }
    const schema: DlMdxPropSchema = { type: schemaTypes(normalized.type) }
    if (normalized.required) schema.required = true
    const explicitDefault = definition.defaultProps?.[name]
    if (explicitDefault !== undefined) schema.default = explicitDefault
    else if (normalized.default !== undefined && typeof normalized.default !== 'function') schema.default = normalized.default as DlMdxValue
    return [name, schema]
  }))
  for (const name of definition.allowedProps ?? []) inferred[name] ??= { type: 'any' }
  for (const [name, value] of Object.entries(definition.defaultProps ?? {})) inferred[name] ??= { type: Array.isArray(value) ? 'array' : value === null ? 'null' : typeof value as DlMdxSchemaType, default: value }
  inferred.id ??= { type: 'string', description: 'MarkdownX 文档内用于定位和去重的组件标识。' }
  for (const [name, schema] of Object.entries(definition.propSchema ?? {})) inferred[name] = { ...inferred[name], ...schema }
  return inferred
}

export function resolveDlMdxEventSchema(definition: DlMdxComponentDefinition): Record<string, DlMdxEventSchema> {
  const declared = (definition.component as { emits?: string[] | Record<string, unknown> } | undefined)?.emits
  const names = Array.isArray(declared) ? declared : Object.keys(declared ?? {})
  return { ...Object.fromEntries(names.map(name => [name, {}])), ...(definition.eventSchema ?? {}) }
}

export function defineDlMdxComponent(definition: DlMdxComponentDefinition): DlMdxComponentDefinition {
  validateDefinition(definition)
  return definition
}

export function createDlMdxRegistry(definitions: DlMdxComponentDefinition[] = []): DlMdxRegistry {
  const lookup = new Map<string, DlMdxComponentDefinition>()
  const ordered = new Map<string, DlMdxComponentDefinition>()

  const registry: DlMdxRegistry = {
    install(app) { app.provide(dlMdxRegistryKey, registry) },
    register(definition) {
      validateDefinition(definition)
      const normalized = { ...definition, aliases: [...(definition.aliases ?? [])] }
      const canonical = registryKey(normalized.name)
      const previous = ordered.get(canonical)
      if (previous) {
        for (const alias of [previous.name, ...(previous.aliases ?? [])]) lookup.delete(registryKey(alias))
      }
      ordered.set(canonical, normalized)
      for (const alias of [normalized.name, `Dl${normalized.name}`, ...(normalized.aliases ?? [])]) lookup.set(registryKey(alias), normalized)
      return registry
    },
    registerAll(nextDefinitions) {
      for (const definition of nextDefinitions) registry.register(definition)
      return registry
    },
    unregister(name) {
      const definition = registry.resolve(name)
      if (!definition) return false
      ordered.delete(registryKey(definition.name))
      for (const alias of [definition.name, `Dl${definition.name}`, ...(definition.aliases ?? [])]) lookup.delete(registryKey(alias))
      return true
    },
    resolve(name) { return lookup.get(registryKey(name)) },
    entries() { return [...ordered.values()] },
  }

  return registry.registerAll(definitions)
}

function serializeDlMdxValue(value: DlMdxValue): string | undefined {
  if (value === null) return 'null'
  if (typeof value === 'string') return JSON.stringify(value)
  if (typeof value === 'boolean') return String(value)
  if (typeof value === 'number') return Number.isFinite(value) ? String(value) : undefined
  try {
    return JSON.stringify(value)
  } catch {
    return undefined
  }
}

export function createDlMdxComponentSnippet(definition: DlMdxComponentDefinition): string | undefined {
  if (definition.insertable === false || (!definition.component && !definition.render)) return undefined
  const properties = Object.entries(definition.defaultProps ?? {}).flatMap(([name, value]) => {
    if (!/^[A-Za-z][\w.-]*$/.test(name)) return []
    const serialized = serializeDlMdxValue(value)
    return serialized === undefined ? [] : [`${name} = ${serialized}`]
  })
  return [`+++component:${definition.name}`, ...properties, '+++end'].join('\n')
}

export function useDlMdxRegistry(fallback?: DlMdxRegistry): DlMdxRegistry | undefined {
  return inject(dlMdxRegistryKey, fallback)
}

export function toDlMdxRenderContext(context: DlMdxComponentContext, definition: DlMdxComponentDefinition): DlMdxRenderContext {
  const merged = { ...(definition.defaultProps ?? {}), ...context.props }
  const contentKey = definition.contentProp ?? 'content'
  const slotContent = context.slots?.default
  const value = slotContent ?? merged[contentKey]
  return {
    ...context,
    props: slotContent === undefined ? merged : { ...merged, [contentKey]: slotContent },
    content: typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' ? String(value) : definition.defaultContent,
  }
}
