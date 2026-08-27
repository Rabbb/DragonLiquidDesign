import type { DlSelectOption } from './select.types'

export interface DlChoicePortalOption extends DlSelectOption {
  /** Additional terms such as abbreviations or pinyin initials. A matching term is revealed and highlighted in search results. */
  keywords?: string[]
}

export interface DlChoicePortalGroup {
  label: string
  options: DlChoicePortalOption[]
}

export type DlChoicePortalEntry = DlChoicePortalOption | DlChoicePortalGroup
export type DlChoicePortalOverlay = 'auto' | 'modal' | 'drawer'
