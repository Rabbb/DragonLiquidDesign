import type {
  DlPathField,
  DlPathFieldValue,
  DlPathNode,
  DlPathParameters,
  DlPathPickerConfig,
  DlPathPickerEvent,
  DlPathPickerState,
  DlPathValidationIssue,
  DlPathValue,
} from './path-picker.types'

export const dlPathKey = (path: readonly string[]): string => JSON.stringify(path)

export const sameDlPath = (left: readonly string[], right: readonly string[]): boolean =>
  left.length === right.length && left.every((value, index) => value === right[index])

export const isDlPathNodeSelectable = (node: DlPathNode): boolean =>
  node.selectable ?? !(node.hasChildren || node.children?.length)

export function findDlPath(items: readonly DlPathNode[], path: readonly string[]): DlPathNode[] {
  const found: DlPathNode[] = []
  let level = items
  for (const value of path) {
    const node = level.find(item => item.value === value)
    if (!node) break
    found.push(node)
    level = node.children ?? []
  }
  return found
}

export function visibleDlPathFields(fields: readonly DlPathField[], parameters: Readonly<DlPathParameters>): DlPathField[] {
  return fields.filter(field => !field.visible || field.visible(parameters))
}

export function createDlPathValue(pathNodes: readonly DlPathNode[], fields: readonly DlPathField[] = []): DlPathValue {
  const node = pathNodes.at(-1)
  if (!node) throw new Error('创建路径选择结果时至少需要一个节点。')
  const parameters = Object.fromEntries(fields
    .filter(field => field.defaultValue !== undefined)
    .map(field => [field.key, cloneDlPathFieldValue(field.defaultValue!)]))
  return {
    value: node.value,
    path: pathNodes.map(item => item.value),
    labels: pathNodes.map(item => item.label),
    parameters,
  }
}

export function cloneDlPathValue(value: DlPathValue): DlPathValue {
  return {
    ...value,
    path: [...value.path],
    labels: [...value.labels],
    parameters: Object.fromEntries(Object.entries(value.parameters).map(([key, fieldValue]) => [key, cloneDlPathFieldValue(fieldValue)])),
  }
}

export function reduceDlPathPicker(
  state: Readonly<DlPathPickerState>,
  event: DlPathPickerEvent,
  config: DlPathPickerConfig = {},
): DlPathPickerState {
  if (event.type === 'path.open') return { ...cloneState(state), activePath: [...event.path] }
  if (event.type === 'path.collapse') return { ...cloneState(state), activePath: state.activePath.slice(0, Math.max(0, event.depth)) }
  if (event.type === 'selection.clear') return { activePath: [...state.activePath], selections: [] }
  if (event.type === 'selection.remove') {
    return {
      activePath: [...state.activePath],
      selections: state.selections.filter(selection => !sameDlPath(selection.path, event.path)).map(cloneDlPathValue),
    }
  }
  if (event.type === 'selection.toggle') {
    const exists = state.selections.some(selection => sameDlPath(selection.path, event.selection.path))
    if (exists) {
      return reduceDlPathPicker(state, { type: 'selection.remove', path: event.selection.path }, config)
    }
    if (config.multiple && config.maxSelections !== undefined && state.selections.length >= config.maxSelections) return cloneState(state)
    return {
      activePath: [...state.activePath],
      selections: config.multiple
        ? [...state.selections.map(cloneDlPathValue), cloneDlPathValue(event.selection)]
        : [cloneDlPathValue(event.selection)],
    }
  }
  if (event.type === 'parameter.change') {
    return {
      activePath: [...state.activePath],
      selections: state.selections.map(selection => {
        if (!sameDlPath(selection.path, event.path)) return cloneDlPathValue(selection)
        const parameters = { ...selection.parameters, [event.key]: cloneDlPathFieldValue(event.value) }
        for (const key of event.resetKeys ?? []) delete parameters[key]
        return { ...cloneDlPathValue(selection), parameters }
      }),
    }
  }
  return cloneState(state)
}

export function validateDlPathValue(value: DlPathValue, fields: readonly DlPathField[]): DlPathValidationIssue[] {
  return visibleDlPathFields(fields, value.parameters).flatMap(field => {
    if (!field.required || hasDlPathFieldValue(value.parameters[field.key])) return []
    return [{ key: field.key, message: `请填写${field.label}` }]
  })
}

function cloneState(state: Readonly<DlPathPickerState>): DlPathPickerState {
  return { activePath: [...state.activePath], selections: state.selections.map(cloneDlPathValue) }
}

function cloneDlPathFieldValue(value: DlPathFieldValue): DlPathFieldValue {
  return Array.isArray(value) ? [...value] : value
}

function hasDlPathFieldValue(value: DlPathFieldValue | undefined): boolean {
  if (Array.isArray(value)) return value.length > 0
  if (typeof value === 'string') return value.trim().length > 0
  return value !== undefined && value !== null
}
