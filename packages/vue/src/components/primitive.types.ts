export interface DlRadioOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

export interface DlAccordionItem {
  value: string
  title: string
  description?: string
  content?: string
  disabled?: boolean
}

export interface DlTabItem {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

export interface DlChoiceOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

export interface DlMenuItem {
  value: string
  label: string
  shortcut?: string
  description?: string
  icon?: string
  checkable?: boolean
  checked?: boolean
  disabled?: boolean
  separator?: boolean
  children?: DlMenuItem[]
}

export interface DlMenuGroup {
  value: string
  label: string
  icon?: string
  items: DlMenuItem[]
}

export type DlDataTableRowKey = string | number

export interface DlDataTableColumn {
  field?: string
  title?: string
  type?: 'checkbox' | 'seq' | 'radio' | 'expand'
  width?: string | number
  minWidth?: string | number
  fixed?: 'left' | 'right'
  align?: 'left' | 'center' | 'right'
  headerAlign?: 'left' | 'center' | 'right'
  sortable?: boolean
  visible?: boolean
  showOverflow?: boolean | 'ellipsis' | 'title' | 'tooltip'
  className?: string
}

export interface DlStepItem {
  step: number
  title: string
  description?: string
  disabled?: boolean
  completed?: boolean
}

export interface DlNavigationItem {
  value: string
  label: string
  description?: string
  href?: string
  disabled?: boolean
  children?: DlNavigationItem[]
}

export interface DlSplitterPanel {
  id: string
  defaultSize?: number
  minSize?: number
  maxSize?: number
  collapsible?: boolean
}

export interface DlTreeNode {
  id: string
  label: string
  description?: string
  disabled?: boolean
  children?: DlTreeNode[]
}

export interface DlTreeMenuItem {
  id: string
  label: string
  description?: string
  keywords?: string[]
  icon?: string
  trailing?: string
  disabled?: boolean
  children?: DlTreeMenuItem[]
  metadata?: Record<string, unknown>
}
