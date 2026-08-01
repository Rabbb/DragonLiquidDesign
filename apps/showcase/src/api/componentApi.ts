import componentApi from '../generated/component-api.generated'

export type ComponentApiRow = {
  prop: string
  description: string
  type: string
  defaultValue: string
}

type ComponentStructureApi = {
  name: string
  title: string
  description: string
  rows: readonly ComponentApiRow[]
}

type ComponentApiDefinition = {
  props: readonly ComponentApiRow[]
  structures: readonly ComponentStructureApi[]
}

export type ComponentApiTableDefinition = {
  key: string
  eyebrow: string
  title: string
  description: string
  badge: string
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
      lastColumnTitle: '默认值',
      rows: definition.props,
    },
    ...definition.structures.map(structure => ({
      key: `${componentId}-${structure.name}`,
      eyebrow: 'DATA STRUCTURE',
      title: structure.title,
      description: structure.description,
      badge: `${structure.rows.length} FIELDS`,
      lastColumnTitle: '是否必填',
      rows: structure.rows,
    })),
  ]
}

export function componentsMissingApi(componentIds: readonly string[]): string[] {
  return componentIds.filter(componentId => !apiByComponent[componentId]?.props.length)
}
