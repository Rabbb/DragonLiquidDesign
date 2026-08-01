import componentApi from '../generated/component-api.generated'

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

  return [
    {
      key: `${componentId}-props`,
      eyebrow: 'API',
      title: '属性',
      description: `${componentName} 的公开 Props、类型与默认值。`,
      badge: `${componentName} · ${definition.props.length} PROPS`,
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
  ]
}

export function componentsMissingApi(componentIds: readonly string[]): string[] {
  return componentIds.filter(componentId => !apiByComponent[componentId]?.props.length)
}
