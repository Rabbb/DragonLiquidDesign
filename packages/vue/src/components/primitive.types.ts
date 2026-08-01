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
  disabled?: boolean
  separator?: boolean
}

export interface DlMenuGroup {
  value: string
  label: string
  items: DlMenuItem[]
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
