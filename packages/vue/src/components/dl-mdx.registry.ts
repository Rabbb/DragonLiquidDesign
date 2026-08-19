import { inject, type App, type Component, type InjectionKey, type VNodeChild } from 'vue'
import type { DlMdxComponentContext, DlMdxValue } from './dl-mdx.types'

export type DlMdxComponentCategory = 'foundation' | 'form' | 'color' | 'dates' | 'general'
export type DlMdxComponentMaturity = 'custom' | 'stable' | 'alpha'

export interface DlMdxRenderContext {
  name: string
  id?: string
  props: Record<string, DlMdxValue>
  sourceLine: number
  content?: string
}

export type DlMdxComponentRenderer = (context: DlMdxRenderContext) => VNodeChild

export interface DlMdxComponentDefinition {
  name: string
  aliases?: string[]
  component?: Component
  render?: DlMdxComponentRenderer
  defaultProps?: Record<string, DlMdxValue>
  allowedProps?: string[]
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
  const value = merged[contentKey]
  return {
    ...context,
    props: merged,
    content: typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' ? String(value) : definition.defaultContent,
  }
}
