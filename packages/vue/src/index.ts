import './styles/index.css'

export { createDlTheme, dlThemeKey, dlThemePresets, useDlTheme } from './theme'
export type {
  DlResolvedThemeMode,
  DlThemeColorScheme,
  DlThemeDefinition,
  DlThemeManager,
  DlThemeMode,
  DlThemeModeThemes,
  DlThemeOptions,
  DlThemeTarget,
  DlThemeTokens,
} from './theme'

export { CalendarDate, Time } from '@internationalized/date'
export { default as DlFocusNavigator } from './components/FocusNavigator.vue'
export { discoverDlFocusNavigatorZones, dlFocusNavigatorTargetSelector } from './components/focus-navigator'
export type {
  DlFocusNavigatorDiscoveryOptions,
  DlFocusNavigatorResolvedZone,
  DlFocusNavigatorTarget,
  DlFocusNavigatorZoneDefinition,
} from './components/focus-navigator'

export {
  DlAccordion, DlAlertDialog, DlAspectRatio, DlAutocomplete, DlAvatar, DlBadge, DlButton,
  DlCalendar, DlCard, DlCheckbox, DlChoicePortal, DlCollapsible, DlColorArea, DlColorField, DlColorSlider,
  DlColorSwatch, DlColorSwatchPicker, DlCombobox, DlContextMenu, DlDateField, DlDatePicker,
  DlDateRangeField, DlDateRangePicker, DlDialog, DlDrawer, DlDropdownMenu, DlEditable,
  DlHoverCard, DlIconButton,
  DlInputButton, DlInputCheckbox, DlInputColor, DlInputDatetimeLocal, DlInputEmail,
  DlInputFile, DlInputHidden, DlInputImage, DlInputNumber, DlInputPassword,
  DlInputRadio, DlInputRange, DlInputReset, DlInputSearch, DlInputSubmit, DlInputTel, DlInputText,
  DlInputUrl, DlInputWeek,
  DlLabel, DlListbox, DlMarkdownX, DlMdx, DlMenubar,
  DlMonthPicker, DlMonthRangePicker, DlMultiChoice, DlNavigationMenu, DlNumberField, DlPagination, DlPinInput,
  DlPopover, DlProgress, DlRadioGroup, DlRangeCalendar, DlRating, DlScrollArea, DlSegmented, DlSelect,
  DlSeparator, DlSlider, DlSplitButton, DlSplitter, DlStepper, DlSwitch, DlTabs, DlTagsInput, DlTextarea,
  DlTimeField, DlTimePicker, DlTimeRangeField, DlToast, DlToggle, DlToggleGroup, DlToolbar, DlTooltip,
  DlTree, DlVirtualList, DlYearPicker, DlYearRangePicker,
} from './managed-components'

export { createDlManagedComponent, getDlComponentBehavior, getDlComponentBehaviors } from './component-behavior'
export type {
  DlCancelableEvent,
  DlComponentBehaviorContext,
  DlComponentBehaviorMetadata,
  DlComponentEventDefinition,
  DlComponentEventHandler,
  DlComponentEventSubscription,
  DlComponentMethodDefinition,
  DlComponentRef,
  DlComponentTemplateRef,
  DlManagedComponent,
  DlManagedComponentOptions,
  DlMethodCallEvent,
  DlMethodCalledEvent,
  DlPropertyChangeEvent,
  DlPropertyChangeOrigin,
  DlPropertyUpdateResult,
} from './control.types'

export type {
  DlAccordionItem,
  DlChoiceOption,
  DlMenuGroup,
  DlMenuItem,
  DlNavigationItem,
  DlRadioOption,
  DlSplitterPanel,
  DlStepItem,
  DlTabItem,
  DlTreeNode,
} from './components/primitive.types'
export type { DlSelectOption } from './components/select.types'
export type {
  DlChoicePortalEntry,
  DlChoicePortalGroup,
  DlChoicePortalOption,
  DlChoicePortalOverlay,
} from './components/choice-portal.types'
export type { DlMultiChoiceEntry, DlMultiChoiceGroup, DlMultiChoiceOption } from './components/multi-choice.types'
export type { DlCalendarDay, DlCalendarItem } from './components/calendar.types'
export type { DlDialogDimensions, DlDialogPosition } from './components/dialog.types'
export type {
  DlMdxBlock,
  DlMdxComponentContext,
  DlMdxDocument,
  DlMdxInlineToken,
  DlMdxLinkPolicy,
  DlMdxListItem,
  DlMdxMode,
  DlMdxParseResult,
  DlMdxScalar,
  DlMdxToolbarAction,
  DlMdxValue,
} from './components/dl-mdx.types'
export { parseDlMdx, parseDlMdxInline, safeDlMdxUrl } from './components/dl-mdx.parser'
export { applyDlMdxCommand, insertDlMdxSnippet } from './components/dl-mdx.commands'
export type { DlMdxCommandContext, DlMdxCommandResult, DlMdxSelection } from './components/dl-mdx.commands'
export {
  createDlMdxComponentSnippet,
  createDlMdxRegistry,
  defineDlMdxComponent,
  dlMdxRegistryKey,
  useDlMdxRegistry,
} from './components/dl-mdx.registry'
export type {
  DlMdxComponentCategory,
  DlMdxComponentDefinition,
  DlMdxComponentMaturity,
  DlMdxComponentRenderer,
  DlMdxRegistry,
  DlMdxRenderContext,
} from './components/dl-mdx.registry'
export { createDlMdxOfficialRegistry, dlMdxOfficialComponents } from './components/dl-mdx.official'
export {
  createDlMdxSecurityPolicy,
  dlMdxSecurityKey,
  useDlMdxSecurityPolicy,
} from './components/dl-mdx.security'
export type {
  DlMdxDomainAllowlist,
  DlMdxSecurityOptions,
  DlMdxSecurityPolicy,
  DlMdxSecurityStatus,
  DlMdxUrlKind,
} from './components/dl-mdx.security'
export { DlOverlaySide, type DlOverlayBaseSide, type DlPopoverTone, type DlSize, type DlTone } from './types'
export type { ColorChannel, ColorSpace, DateRange, DateValue, TimeValue } from 'reka-ui'
