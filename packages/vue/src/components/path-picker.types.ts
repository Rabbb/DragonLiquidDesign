export type DlPathFieldValue = string | number | boolean | string[] | null
export type DlPathParameters = Record<string, DlPathFieldValue>

export interface DlPathOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

export type DlPathFieldType = 'text' | 'number' | 'select' | 'multi-select' | 'switch' | 'custom'

export interface DlPathField {
  key: string
  label: string
  type: DlPathFieldType
  description?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  defaultValue?: DlPathFieldValue
  options?: DlPathOption[]
  source?: string
  dependsOn?: string[]
  min?: number
  max?: number
  step?: number
  visible?: (parameters: Readonly<DlPathParameters>) => boolean
}

export interface DlPathNode {
  value: string
  label: string
  description?: string
  disabled?: boolean
  selectable?: boolean
  children?: DlPathNode[]
  hasChildren?: boolean
  fields?: DlPathField[]
  fieldSource?: string
  metadata?: Record<string, unknown>
}

export interface DlPathValue {
  value: string
  path: string[]
  labels: string[]
  parameters: DlPathParameters
}

export interface DlPathContext {
  node: DlPathNode
  path: string[]
  labels: string[]
  parameters: Readonly<DlPathParameters>
  selections: readonly DlPathValue[]
}

export interface DlPathPickerAdapter {
  loadChildren?: (node: DlPathNode, context: DlPathContext) => Promise<DlPathNode[]>
  loadFields?: (node: DlPathNode, context: DlPathContext) => Promise<DlPathField[]>
  loadOptions?: (field: DlPathField, context: DlPathContext) => Promise<DlPathOption[]>
}

export interface DlPathPickerState {
  activePath: string[]
  selections: DlPathValue[]
}

export interface DlPathPickerConfig {
  multiple?: boolean
  maxSelections?: number
}

export type DlPathPickerEvent =
  | { type: 'path.open'; path: string[] }
  | { type: 'path.collapse'; depth: number }
  | { type: 'selection.toggle'; selection: DlPathValue }
  | { type: 'selection.remove'; path: string[] }
  | { type: 'selection.clear' }
  | { type: 'parameter.change'; path: string[]; key: string; value: DlPathFieldValue; resetKeys?: string[] }

export interface DlPathValidationIssue {
  key: string
  message: string
}

export interface DlPathPickerLoadError {
  kind: 'children' | 'fields' | 'options'
  path: string[]
  field?: DlPathField
  error: unknown
}
