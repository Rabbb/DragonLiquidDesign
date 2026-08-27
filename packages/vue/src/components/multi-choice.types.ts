import type { DlSelectOption } from './select.types'

export interface DlMultiChoiceOption extends DlSelectOption {
  /** Additional aliases, abbreviations or pinyin initials used by search. */
  keywords?: string[]
}

export interface DlMultiChoiceGroup {
  label: string
  options: DlMultiChoiceOption[]
}

export type DlMultiChoiceEntry = DlMultiChoiceOption | DlMultiChoiceGroup

