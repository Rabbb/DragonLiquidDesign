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
export { formatColorValue, normalizeColorInput, readableColorInk, resolveColorSwatches, safeColorValue } from './components/color-controls'
export type { DlColorFormat, DlColorSwatchOption, DlColorSwatchSource } from './components/color-controls'

export {
  DlAccordion, DlAlertDialog, DlAspectRatio, DlAutocomplete, DlAvatar, DlBadge, DlBreadcrumbs, DlButton,
  DlCalendar, DlCard, DlCheckbox, DlChoicePortal, DlCluster, DlCollapsible, DlColorArea, DlColorField, DlColorPicker, DlColorSlider,
  DlColorSwatch, DlColorSwatchPicker, DlCombobox, DlContainer, DlContextMenu, DlDataTable, DlDateField, DlDatePicker,
  DlDateRangeField, DlDateRangePicker, DlDialog, DlDrawer, DlDropdownMenu, DlEditable,
  DlGrid, DlHoverCard, DlIconButton,
  DlInputButton, DlInputCheckbox, DlInputColor, DlInputDatetimeLocal, DlInputEmail,
  DlInputFile, DlInputHidden, DlInputImage, DlInputNumber, DlInputPassword,
  DlInputRadio, DlInputRange, DlInputReset, DlInputSearch, DlInputSubmit, DlInputTel, DlInputText,
  DlInputUrl, DlInputWeek,
  DlLabel, DlListbox, DlMarkdownX, DlMdx, DlMenubar,
  DlMonthPicker, DlMonthRangePicker, DlMultiChoice, DlNavigationMenu, DlNumberField, DlPagination, DlPageFrame, DlPinInput,
  DlPopover, DlProgress, DlRadioGroup, DlRangeCalendar, DlRating, DlScrollArea, DlSegmented, DlSelect,
  DlSeparator, DlSiteHeader, DlSiteNavigation, DlSiteShell, DlSlider, DlSplitButton, DlSplitter, DlStack, DlStepper, DlSwitch, DlTabs, DlTagsInput, DlTextarea,
  DlTimeField, DlTimePicker, DlTimeRangeField, DlToast, DlToggle, DlToggleGroup, DlToolbar, DlToolbarMenu, DlTooltip,
  DlTree, DlTreeMenu, DlVirtualList, DlYearPicker, DlYearRangePicker,
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
  DlBreadcrumbItem,
  DlSiteEnvironment,
  DlSiteNavigationGroup,
  DlSiteNavigationItem,
  DlSiteNavigationMode,
} from './components/site-layout.types'
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
  DlTreeMenuItem,
} from './components/primitive.types'
export type {
  DlDataTableCellActivate,
  DlDataTableCheckedRowsChange,
  DlDataTableColumn,
  DlDataTableColumnRole,
  DlDataTableDensity,
  DlDataTableFeatures,
  DlDataTableGridLines,
  DlDataTableOverflow,
  DlDataTablePresentation,
  DlDataTableRowChange,
  DlDataTableRowKey,
  DlDataTableSortChange,
} from './components/data-table.types'
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
  DlMdxRuntimeSymbol,
  DlMdxScalar,
  DlMdxToolbarAction,
  DlMdxValue,
} from './components/dl-mdx.types'
export { parseDlMdx, parseDlMdxInline, safeDlMdxUrl } from './components/dl-mdx.parser'
export { default as DlMdxTemplate } from './components/DlMdxTemplate'
export { analyzeDlMdxTemplate, evaluateDlMdxTemplateExpression, parseDlMdxTemplate, parseDlMdxTemplateExpression } from './components/dl-mdx.template'
export type {
  DlMdxTemplateAttribute,
  DlMdxTemplateAttributeValue,
  DlMdxTemplateBinding,
  DlMdxTemplateDiagnostic,
  DlMdxTemplateDiagnosticSeverity,
  DlMdxTemplateExpression,
  DlMdxTemplateFunction,
  DlMdxTemplateNode,
  DlMdxTemplateProgram,
  DlMdxTemplateScope,
} from './components/dl-mdx.template'
export type { DlMdxTemplateContext } from './components/DlMdxTemplate'
export type { DlMdxEditorDocumentLanguage } from './components/MdxEditor.vue'
export { createDlMdxPageFrontMatter, parseDlMdxFrontMatter } from './components/dl-mdx.frontmatter'
export type { DlMdxFrontMatterDiagnostic, DlMdxFrontMatterResult, DlMdxPageMetadata } from './components/dl-mdx.frontmatter'
export { createDlMdxOutline } from './components/dl-mdx.outline'
export type { DlMdxOutlineItem } from './components/dl-mdx.outline'
export { analyzeDlMdx, completeDlMdx, extractDlMdxActionSymbols, formatDlMdx, hoverDlMdx } from './components/dl-mdx.language'
export type {
  DlMdxCompletionItem,
  DlMdxCompletionKind,
  DlMdxCompletionResult,
  DlMdxDiagnostic,
  DlMdxDiagnosticCode,
  DlMdxDiagnosticFix,
  DlMdxDiagnosticSeverity,
  DlMdxFormatOptions,
  DlMdxHoverInfo,
  DlMdxLanguageAnalysis,
  DlMdxLanguageComponent,
  DlMdxLanguageComponentEvent,
  DlMdxLanguageComponentProperty,
  DlMdxLanguageOptions,
  DlMdxScriptSymbol,
  DlMdxValidator,
  DlMdxValidatorContext,
} from './components/dl-mdx.language'
export {
  buildDlMdxProject,
  createDlMdxEngine,
  createDlMdxHttpStorageAdapter,
  createDlMdxLocalStorageAdapter,
  createDlMdxMemoryStorageAdapter,
  defaultDlMdxEngineLimits,
  dirnameDlMdxProjectPath,
  dlMdxProjectSchemaVersion,
  normalizeDlMdxProjectPath,
  normalizeDlMdxProjectSnapshot,
  parseDlMdxProject,
  serializeDlMdxProject,
} from './components/dl-mdx.engine'
export type {
  CreateDlMdxEngineOptions,
  DlMdxBuiltRoute,
  DlMdxBuiltLayout,
  DlMdxEngine,
  DlMdxEngineDraft,
  DlMdxEngineLimits,
  DlMdxHttpStorageAdapterOptions,
  DlMdxProjectBuildOptions,
  DlMdxProjectBuildResult,
  DlMdxProjectChange,
  DlMdxProjectChangeEvent,
  DlMdxProjectChangeKind,
  DlMdxProjectDiagnostic,
  DlMdxProjectDirectory,
  DlMdxProjectEntry,
  DlMdxProjectFile,
  DlMdxProjectFileEncoding,
  DlMdxProjectFileLanguage,
  DlMdxProjectInput,
  DlMdxProjectManifest,
  DlMdxProjectRouteDefinition,
  DlMdxProjectSnapshot,
  DlMdxProjectStorageAdapter,
  DlMdxProjectStorageEntry,
  DlMdxProjectTreeNode,
} from './components/dl-mdx.engine'
export { getDlMdxRustCoreStatus } from './components/dl-mdx.rust'
export type { DlMdxRustCoreStatus, DlMdxUrlInspection } from './components/dl-mdx.rust'
export {
  buildDlMdxUserscript,
  dlMdxUserscriptKnownGrants,
  dlMdxUserscriptMatchesUrl,
  normalizeDlMdxUserscript,
  parseDlMdxUserscript,
  validateDlMdxUserscript,
} from './components/dl-mdx.userscript'
export type {
  DlMdxUserscriptBuildResult,
  DlMdxUserscriptDiagnostic,
  DlMdxUserscriptDiagnosticSeverity,
  DlMdxUserscriptInjectInto,
  DlMdxUserscriptMetadata,
  DlMdxUserscriptProject,
  DlMdxUserscriptResource,
  DlMdxUserscriptRunAt,
} from './components/dl-mdx.userscript'
export { applyDlMdxCommand, insertDlMdxSnippet } from './components/dl-mdx.commands'
export type { DlMdxCommandContext, DlMdxCommandResult, DlMdxSelection } from './components/dl-mdx.commands'
export {
  createDlMdxComponentSnippet,
  createDlMdxRegistry,
  defineDlMdxComponent,
  dlMdxRegistryKey,
  resolveDlMdxEventSchema,
  resolveDlMdxPropSchema,
  useDlMdxRegistry,
} from './components/dl-mdx.registry'
export type {
  DlMdxComponentCategory,
  DlMdxComponentDefinition,
  DlMdxComponentMaturity,
  DlMdxComponentRenderer,
  DlMdxActionDefinition,
  DlMdxActionHandler,
  DlMdxActionInvocation,
  DlMdxActionMap,
  DlMdxEventSchema,
  DlMdxPropSchema,
  DlMdxRegistry,
  DlMdxRenderContext,
  DlMdxSchemaType,
  DlMdxTypeSchema,
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
