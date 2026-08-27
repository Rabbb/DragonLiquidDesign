import componentApi from '../generated/component-api.generated'
import { getDlComponentBehavior } from '@dragon-liquid/vue'

export type ComponentApiRow = {
  prop: string
  description: string
  type: string
  defaultValue: string
}

type ComponentRelatedTypeApi = {
  kind: 'structure' | 'enum'
  name: string
  title: string
  description: string
  rows: readonly ComponentApiRow[]
}

type ComponentApiDefinition = {
  props: readonly ComponentApiRow[]
  relatedTypes: readonly ComponentRelatedTypeApi[]
}

export type ComponentApiTableDefinition = {
  key: string
  eyebrow: string
  title: string
  description: string
  badge: string
  firstColumnTitle: string
  thirdColumnTitle: string
  lastColumnTitle: string
  rows: readonly ComponentApiRow[]
}

const apiByComponent = componentApi as Record<string, ComponentApiDefinition>

export function componentApiTables(componentId: string, componentName: string): ComponentApiTableDefinition[] {
  const definition = apiByComponent[componentId]
  if (!definition) throw new Error(`组件 ${componentId} 缺少属性 API 元数据。`)

  const behavior = getDlComponentBehavior(componentName)
  const isInputControl = componentId.startsWith('input-')

  return [
    {
      key: `${componentId}-props`,
      eyebrow: 'API',
      title: isInputControl ? '组件与原生属性' : '属性',
      description: isInputControl
        ? `${componentName} 的公开 Props，以及该固定输入语义真正适用的 HTML 属性。`
        : `${componentName} 的公开 Props、类型与默认值。`,
      badge: `${componentName} · ${definition.props.length} ${isInputControl ? 'API ENTRIES' : 'PROPS'}`,
      firstColumnTitle: '属性',
      thirdColumnTitle: '类型',
      lastColumnTitle: '默认值',
      rows: definition.props,
    },
    ...definition.relatedTypes.map(type => ({
      key: `${componentId}-${type.name}`,
      eyebrow: type.kind === 'enum' ? 'ENUM' : 'DATA STRUCTURE',
      title: type.title,
      description: type.description,
      badge: `${type.rows.length} ${type.kind === 'enum' ? 'VALUES' : 'FIELDS'}`,
      firstColumnTitle: type.kind === 'enum' ? '值' : '属性',
      thirdColumnTitle: type.kind === 'enum' ? '字面量' : '类型',
      lastColumnTitle: type.kind === 'enum' ? '语义' : '是否必填',
      rows: type.rows,
    })),
    ...(behavior ? [
      {
        key: `${componentId}-events`,
        eyebrow: 'EVENTS',
        title: '事件',
        description: `${componentName} 的声明式事件与实例订阅事件；两种监听方式共享相同触发源。`,
        badge: `${behavior.events.length} EVENTS`,
        firstColumnTitle: '事件名',
        thirdColumnTitle: '参数',
        lastColumnTitle: '取消能力',
        rows: behavior.events.map(event => ({
          prop: event.name,
          description: event.description,
          type: event.payload,
          defaultValue: event.name.startsWith('before') ? 'preventDefault()' : '—',
        })),
      },
      {
        key: `${componentId}-methods`,
        eyebrow: 'INSTANCE API',
        title: '实例属性与方法',
        description: `通过模板 ref 获取 ${componentName} 实例；属性覆盖可随时 reset，重新跟随外部 props。`,
        badge: `${behavior.methods.length} METHODS`,
        firstColumnTitle: '方法',
        thirdColumnTitle: '签名',
        lastColumnTitle: '返回值',
        rows: behavior.methods.map(method => ({
          prop: method.name,
          description: method.description,
          type: method.signature,
          defaultValue: method.returns,
        })),
      },
    ] : []),
  ]
}

export function componentsMissingApi(componentIds: readonly string[]): string[] {
  return componentIds.filter(componentId => !apiByComponent[componentId]?.props.length)
}
