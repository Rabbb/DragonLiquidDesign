import { createDlManagedComponent } from './component-behavior'
import type { DlComponentBehaviorContext, DlComponentEventDefinition, DlComponentMethodDefinition, DlManagedComponent, DlManagedComponentOptions } from './control.types'
import type { Component } from 'vue'
import RawDlAccordion from './components/DlAccordion.vue'
import RawDlAlertDialog from './components/DlAlertDialog.vue'
import RawDlAspectRatio from './components/DlAspectRatio.vue'
import RawDlAutocomplete from './components/DlAutocomplete.vue'
import RawDlAvatar from './components/DlAvatar.vue'
import RawDlBadge from './components/DlBadge.vue'
import RawDlButton from './components/DlButton.vue'
import RawDlCalendar from './components/DlCalendar.vue'
import RawDlCard from './components/DlCard.vue'
import RawDlCluster from './components/DlCluster.vue'
import RawDlCheckbox from './components/DlCheckbox.vue'
import RawDlChoicePortal from './components/DlChoicePortal.vue'
import RawDlCollapsible from './components/DlCollapsible.vue'
import RawDlColorArea from './components/DlColorArea.vue'
import RawDlColorField from './components/DlColorField.vue'
import RawDlColorPicker from './components/DlColorPicker.vue'
import RawDlColorSlider from './components/DlColorSlider.vue'
import RawDlColorSwatch from './components/DlColorSwatch.vue'
import RawDlColorSwatchPicker from './components/DlColorSwatchPicker.vue'
import RawDlContainer from './components/DlContainer.vue'
import RawDlCombobox from './components/DlCombobox.vue'
import RawDlContextMenu from './components/DlContextMenu.vue'
import RawDlDataTable from './components/DlDataTable.vue'
import RawDlDateField from './components/DlDateField.vue'
import RawDlDatePicker from './components/DlDatePicker.vue'
import RawDlDateRangeField from './components/DlDateRangeField.vue'
import RawDlDateRangePicker from './components/DlDateRangePicker.vue'
import RawDlDialog from './components/DlDialog.vue'
import RawDlDrawer from './components/DlDrawer.vue'
import RawDlDropdownMenu from './components/DlDropdownMenu.vue'
import RawDlEditable from './components/DlEditable.vue'
import RawDlHoverCard from './components/DlHoverCard.vue'
import RawDlIconButton from './components/DlIconButton.vue'
import RawDlInputButton from './components/DlInputButton.vue'
import RawDlInputCheckbox from './components/DlInputCheckbox.vue'
import RawDlInputColor from './components/DlInputColor.vue'
import RawDlInputDatetimeLocal from './components/DlInputDatetimeLocal.vue'
import RawDlInputEmail from './components/DlInputEmail.vue'
import RawDlInputFile from './components/DlInputFile.vue'
import RawDlInputHidden from './components/DlInputHidden.vue'
import RawDlInputImage from './components/DlInputImage.vue'
import RawDlInputNumber from './components/DlInputNumber.vue'
import RawDlInputPassword from './components/DlInputPassword.vue'
import RawDlInputRadio from './components/DlInputRadio.vue'
import RawDlInputRange from './components/DlInputRange.vue'
import RawDlInputReset from './components/DlInputReset.vue'
import RawDlInputSearch from './components/DlInputSearch.vue'
import RawDlInputSubmit from './components/DlInputSubmit.vue'
import RawDlInputTel from './components/DlInputTel.vue'
import RawDlInputText from './components/DlInputText.vue'
import RawDlInputUrl from './components/DlInputUrl.vue'
import RawDlInputWeek from './components/DlInputWeek.vue'
import RawDlLabel from './components/DlLabel.vue'
import RawDlListbox from './components/DlListbox.vue'
import RawDlMdx from './components/DlMdx.vue'
import RawDlMenubar from './components/DlMenubar.vue'
import RawDlMonthPicker from './components/DlMonthPicker.vue'
import RawDlMonthRangePicker from './components/DlMonthRangePicker.vue'
import RawDlMultiChoice from './components/DlMultiChoice.vue'
import RawDlNavigationMenu from './components/DlNavigationMenu.vue'
import RawDlNumberField from './components/DlNumberField.vue'
import RawDlPagination from './components/DlPagination.vue'
import RawDlPageFrame from './components/DlPageFrame.vue'
import RawDlPathPicker from './components/DlPathPicker.vue'
import RawDlPinInput from './components/DlPinInput.vue'
import RawDlPopover from './components/DlPopover.vue'
import RawDlProgress from './components/DlProgress.vue'
import RawDlRadioGroup from './components/DlRadioGroup.vue'
import RawDlRangeCalendar from './components/DlRangeCalendar.vue'
import RawDlRating from './components/DlRating.vue'
import RawDlScrollArea from './components/DlScrollArea.vue'
import RawDlSegmented from './components/DlSegmented.vue'
import RawDlSelect from './components/DlSelect.vue'
import RawDlSeparator from './components/DlSeparator.vue'
import RawDlSlider from './components/DlSlider.vue'
import RawDlSiteHeader from './components/DlSiteHeader.vue'
import RawDlSiteNavigation from './components/DlSiteNavigation.vue'
import RawDlSiteShell from './components/DlSiteShell.vue'
import RawDlSplitButton from './components/DlSplitButton.vue'
import RawDlSplitter from './components/DlSplitter.vue'
import RawDlStack from './components/DlStack.vue'
import RawDlStepper from './components/DlStepper.vue'
import RawDlSwitch from './components/DlSwitch.vue'
import RawDlTabs from './components/DlTabs.vue'
import RawDlTagsInput from './components/DlTagsInput.vue'
import RawDlTextarea from './components/DlTextarea.vue'
import RawDlTimeField from './components/DlTimeField.vue'
import RawDlTimePicker from './components/DlTimePicker.vue'
import RawDlTimeRangeField from './components/DlTimeRangeField.vue'
import RawDlToast from './components/DlToast.vue'
import RawDlToggle from './components/DlToggle.vue'
import RawDlToggleGroup from './components/DlToggleGroup.vue'
import RawDlToolbar from './components/DlToolbar.vue'
import RawDlToolbarMenu from './components/DlToolbarMenu.vue'
import RawDlTooltip from './components/DlTooltip.vue'
import RawDlTree from './components/DlTree.vue'
import RawDlTreeMenu from './components/DlTreeMenu.vue'
import RawDlVirtualList from './components/DlVirtualList.vue'
import RawDlGrid from './components/DlGrid.vue'
import RawDlBreadcrumbs from './components/DlBreadcrumbs.vue'
import RawDlYearPicker from './components/DlYearPicker.vue'
import RawDlYearRangePicker from './components/DlYearRangePicker.vue'

const actionEvents = ['click', 'focus', 'blur', 'keydown', 'keyup'] as const
const fieldEvents = ['focus', 'blur', 'input', 'change', 'keydown', 'keyup'] as const

const method = (name: string, description: string, signature: string, returns = 'boolean'): DlComponentMethodDefinition => ({ name, description, signature, returns })
const event = (name: string, description: string, payload: string): DlComponentEventDefinition => ({ name, description, payload })

function callInner(context: DlComponentBehaviorContext, name: string, ...args: unknown[]) {
  return (context.inner as Record<string, (...values: unknown[]) => unknown> | null)?.[name]?.(...args)
}

function managed<T extends Component>(component: T, name: string, options: Omit<DlManagedComponentOptions, 'name'> = {}): DlManagedComponent<T> {
  return createDlManagedComponent(component, { name, ...options })
}

const accordionMethods = {
  expand(context: DlComponentBehaviorContext, value: string) {
    if (context.get('type') === 'multiple') {
      const current = Array.isArray(context.get('modelValue')) ? context.get('modelValue') as string[] : []
      return context.set('modelValue', [...new Set([...current, value])])
    }
    return context.set('modelValue', value)
  },
  collapse(context: DlComponentBehaviorContext, value?: string) {
    if (context.get('type') === 'multiple') {
      const current = Array.isArray(context.get('modelValue')) ? context.get('modelValue') as string[] : []
      return context.set('modelValue', value ? current.filter(item => item !== value) : [])
    }
    return context.set('modelValue', undefined)
  },
  expandAll(context: DlComponentBehaviorContext) {
    const values = ((context.get('items') as Array<{ value: string }> | undefined) ?? []).map(item => item.value)
    return context.set('modelValue', context.get('type') === 'multiple' ? values : values[0])
  },
  collapseAll(context: DlComponentBehaviorContext) {
    return context.set('modelValue', context.get('type') === 'multiple' ? [] : undefined)
  },
}

const numberMethods = {
  increment(context: DlComponentBehaviorContext, amount?: number) {
    const step = amount ?? Number(context.get('step') ?? 1)
    const max = context.get('max') as number | undefined
    const next = Number(context.get('modelValue') ?? 0) + step
    return context.set('modelValue', max === undefined ? next : Math.min(max, next))
  },
  decrement(context: DlComponentBehaviorContext, amount?: number) {
    const step = amount ?? Number(context.get('step') ?? 1)
    const min = context.get('min') as number | undefined
    const next = Number(context.get('modelValue') ?? 0) - step
    return context.set('modelValue', min === undefined ? next : Math.max(min, next))
  },
}

const paginationMethods = {
  first(context: DlComponentBehaviorContext) { return context.set('page', 1) },
  previous(context: DlComponentBehaviorContext) { return context.set('page', Math.max(1, Number(context.get('page') ?? 1) - 1)) },
  next(context: DlComponentBehaviorContext) {
    const last = Math.max(1, Math.ceil(Number(context.get('total') ?? 0) / Number(context.get('itemsPerPage') ?? 10)))
    return context.set('page', Math.min(last, Number(context.get('page') ?? 1) + 1))
  },
  last(context: DlComponentBehaviorContext) {
    return context.set('page', Math.max(1, Math.ceil(Number(context.get('total') ?? 0) / Number(context.get('itemsPerPage') ?? 10))))
  },
  goTo(context: DlComponentBehaviorContext, page: number) {
    const last = Math.max(1, Math.ceil(Number(context.get('total') ?? 0) / Number(context.get('itemsPerPage') ?? 10)))
    return context.set('page', Math.max(1, Math.min(last, page)))
  },
}

const stepperMethods = {
  previous(context: DlComponentBehaviorContext) { return context.set('modelValue', Math.max(1, Number(context.get('modelValue') ?? 1) - 1)) },
  next(context: DlComponentBehaviorContext) {
    const items = context.get('items') as Array<{ step: number; disabled?: boolean }> | undefined
    const current = Number(context.get('modelValue') ?? items?.[0]?.step ?? 1)
    const next = items?.find(item => item.step > current && !item.disabled)?.step ?? current
    return context.set('modelValue', next)
  },
  goTo(context: DlComponentBehaviorContext, step: number) { return context.set('modelValue', step) },
}

const tagsMethods = {
  add(context: DlComponentBehaviorContext, value: string) {
    const current = Array.isArray(context.get('modelValue')) ? context.get('modelValue') as string[] : []
    return value && !current.includes(value) ? context.set('modelValue', [...current, value]) : false
  },
  remove(context: DlComponentBehaviorContext, value: string) {
    const current = Array.isArray(context.get('modelValue')) ? context.get('modelValue') as string[] : []
    return context.set('modelValue', current.filter(item => item !== value))
  },
}

const multiChoiceMethods = {
  select(context: DlComponentBehaviorContext, value: string) {
    const current = Array.isArray(context.get('modelValue')) ? context.get('modelValue') as string[] : []
    return current.includes(value) ? false : context.set('modelValue', [...current, value])
  },
  deselect(context: DlComponentBehaviorContext, value: string) {
    const current = Array.isArray(context.get('modelValue')) ? context.get('modelValue') as string[] : []
    return context.set('modelValue', current.filter(item => item !== value))
  },
  clear(context: DlComponentBehaviorContext) { return context.set('modelValue', []) },
}

const virtualListMethods = {
  scrollToIndex(context: DlComponentBehaviorContext, index: number, alignment?: 'start' | 'center' | 'end' | 'auto') {
    const action = (context.inner as { scrollToIndex?: (value: number, mode?: typeof alignment) => void } | null)?.scrollToIndex
    if (!action) return false
    action(index, alignment)
    return true
  },
  scrollToTop(context: DlComponentBehaviorContext) {
    const action = (context.inner as { scrollToTop?: () => void } | null)?.scrollToTop
    if (!action) return false
    action()
    return true
  },
}

const treeMethods = {
  expand(context: DlComponentBehaviorContext, value: string) {
    const current = Array.isArray(context.get('expanded')) ? context.get('expanded') as string[] : []
    return context.set('expanded', [...new Set([...current, value])])
  },
  collapse(context: DlComponentBehaviorContext, value: string) {
    const current = Array.isArray(context.get('expanded')) ? context.get('expanded') as string[] : []
    return context.set('expanded', current.filter(item => item !== value))
  },
  collapseAll(context: DlComponentBehaviorContext) { return context.set('expanded', []) },
}

export const DlAccordion = managed(RawDlAccordion, 'DlAccordion', {
  methods: accordionMethods,
  methodDefinitions: [
    method('expand', '展开指定面板。', '(value: string)'),
    method('collapse', '折叠指定面板；省略 value 时折叠全部。', '(value?: string)'),
    method('expandAll / collapseAll', '批量展开或折叠面板。', '()'),
  ],
})
export const DlAlertDialog = managed(RawDlAlertDialog, 'DlAlertDialog')
export const DlAspectRatio = managed(RawDlAspectRatio, 'DlAspectRatio')
export const DlAutocomplete = managed(RawDlAutocomplete, 'DlAutocomplete', { domEvents: fieldEvents })
export const DlAvatar = managed(RawDlAvatar, 'DlAvatar')
export const DlBadge = managed(RawDlBadge, 'DlBadge')
export const DlBreadcrumbs = managed(RawDlBreadcrumbs, 'DlBreadcrumbs')
export const DlButton = managed(RawDlButton, 'DlButton', {
  domEvents: actionEvents,
  methods: {
    startLoading: context => context.set('loading', true),
    stopLoading: context => context.set('loading', false),
  },
  methodDefinitions: [
    method('startLoading / stopLoading', '切换异步操作状态，并保留当前 variant。', '()'),
  ],
})
export const DlCalendar = managed(RawDlCalendar, 'DlCalendar', { domEvents: fieldEvents })
export const DlCard = managed(RawDlCard, 'DlCard', { domEvents: ['click', 'focus', 'blur'] })
export const DlCluster = managed(RawDlCluster, 'DlCluster')
export const DlCheckbox = managed(RawDlCheckbox, 'DlCheckbox', {
  domEvents: fieldEvents,
  methods: {
    check: context => context.set('modelValue', true),
    uncheck: context => context.set('modelValue', false),
  },
  methodDefinitions: [method('check / uncheck', '切换选中状态；toggle() 也可用于布尔值组件。', '()')],
})
export const DlChoicePortal = managed(RawDlChoicePortal, 'DlChoicePortal', { domEvents: fieldEvents })
export const DlCollapsible = managed(RawDlCollapsible, 'DlCollapsible')
export const DlColorArea = managed(RawDlColorArea, 'DlColorArea', { domEvents: fieldEvents })
export const DlColorField = managed(RawDlColorField, 'DlColorField', { domEvents: fieldEvents })
export const DlColorPicker = managed(RawDlColorPicker, 'DlColorPicker', { domEvents: fieldEvents })
export const DlColorSlider = managed(RawDlColorSlider, 'DlColorSlider', { domEvents: fieldEvents })
export const DlColorSwatch = managed(RawDlColorSwatch, 'DlColorSwatch')
export const DlColorSwatchPicker = managed(RawDlColorSwatchPicker, 'DlColorSwatchPicker', { domEvents: fieldEvents })
export const DlContainer = managed(RawDlContainer, 'DlContainer')
export const DlCombobox = managed(RawDlCombobox, 'DlCombobox', { domEvents: fieldEvents })
export const DlContextMenu = managed(RawDlContextMenu, 'DlContextMenu')
export const DlDataTable = managed(RawDlDataTable, 'DlDataTable', {
  domEvents: ['focus', 'blur', 'keydown', 'keyup'],
  eventDefinitions: [
    event('checkedRowsChange', '复选行键或对应行集合发生变化。', '{ keys: DlDataTableRowKey[]; rows: TRow[] }'),
    event('currentRowChange', '当前高亮行发生变化。', 'DlDataTableRowChange<TRow>'),
    event('chosenRowChange', '单选行发生变化。', 'DlDataTableRowChange<TRow>'),
    event('expandedRowsChange', '详情行或树节点的展开集合发生变化。', '{ keys: DlDataTableRowKey[]; rows: TRow[] }'),
    event('rowActivate', '用户点击或激活一行。', '{ row: TRow; rowKey?: DlDataTableRowKey; event: Event }'),
    event('cellActivate', '用户点击或激活一个单元格。', 'DlDataTableCellActivate<TRow>'),
    event('sortChange', '排序列与方向发生变化。', 'DlDataTableSortChange'),
    event('filterChange', '筛选条件发生变化。', 'unknown'),
    event('editBegin', '单元格进入编辑状态。', 'unknown'),
    event('editEnd', '单元格结束编辑状态。', 'unknown'),
    event('validationError', '编辑校验失败。', 'unknown'),
    event('contextAction', '执行表格上下文菜单命令。', 'unknown'),
    event('rowDragEnd', '行拖动排序结束。', 'unknown'),
    event('columnDragEnd', '列拖动排序结束。', 'unknown'),
    event('scroll', '表格视口滚动。', 'unknown'),
  ],
  methods: {
    getRows: context => callInner(context, 'getRows') ?? [],
    getVisibleRows: context => callInner(context, 'getVisibleRows') ?? [],
    getCheckedRows: context => callInner(context, 'getCheckedRows') ?? [],
    setCheckedRows: (context, keys, checked) => callInner(context, 'setCheckedRows', keys, checked),
    clearCheckedRows: context => callInner(context, 'clearCheckedRows'),
    setCurrentRow: (context, key) => callInner(context, 'setCurrentRow', key),
    setChosenRow: (context, key) => callInner(context, 'setChosenRow', key),
    setExpandedRows: (context, keys) => callInner(context, 'setExpandedRows', keys),
    sortRows: (context, sorts) => callInner(context, 'sortRows', sorts),
    clearSorting: (context, property) => callInner(context, 'clearSorting', property),
    clearFilters: (context, property) => callInner(context, 'clearFilters', property),
    beginEdit: (context, key, property) => callInner(context, 'beginEdit', key, property),
    finishEdit: context => callInner(context, 'finishEdit'),
    validateRows: (context, keys) => callInner(context, 'validateRows', keys),
    insertRows: (context, rows, beforeKey) => callInner(context, 'insertRows', rows, beforeKey),
    removeRows: (context, keys) => callInner(context, 'removeRows', keys),
    getChanges: context => callInner(context, 'getChanges'),
    scrollToRow: (context, key, property) => callInner(context, 'scrollToRow', key, property),
    scrollToColumn: (context, property) => callInner(context, 'scrollToColumn', property),
    exportRows: (context, options) => callInner(context, 'exportRows', options),
    importRows: (context, options) => callInner(context, 'importRows', options),
    printRows: (context, options) => callInner(context, 'printRows', options),
    resetState: context => callInner(context, 'resetState'),
    recalculate: (context, full) => callInner(context, 'recalculate', full),
    undo: context => callInner(context, 'undo'),
    redo: context => callInner(context, 'redo'),
    clearHistory: context => callInner(context, 'clearHistory'),
  },
  methodDefinitions: [
    method('getRows', '返回包含树层级在内的完整行集合。', '()', 'TRow[]'),
    method('getVisibleRows', '返回排序和筛选后的可见行集合。', '()', 'TRow[]'),
    method('getCheckedRows', '返回当前复选行数据。', '()', 'TRow[]'),
    method('setCheckedRows', '按稳定行键勾选或取消多行。', '(keys: DlDataTableRowKey[], checked = true)', 'Promise<void>'),
    method('clearCheckedRows', '清除全部复选行。', '()', 'Promise<void>'),
    method('setCurrentRow', '按稳定行键设置或清除当前高亮行。', '(key?: DlDataTableRowKey)', 'Promise<void>'),
    method('setChosenRow', '按稳定行键设置或清除单选行。', '(key?: DlDataTableRowKey)', 'Promise<void>'),
    method('setExpandedRows', '按稳定行键控制详情行或树节点展开集合。', '(keys: DlDataTableRowKey[])', 'Promise<void>'),
    method('sortRows', '以 DL property / direction 模型执行单列或多列排序。', '(sorts: Array<{ property: string; direction?: "asc" | "desc" }>)', 'Promise<void>'),
    method('clearSorting', '清除指定属性或全部排序。', '(property?: string)', 'Promise<void>'),
    method('clearFilters', '清除指定属性或全部筛选。', '(property?: string)', 'Promise<void>'),
    method('beginEdit', '按行键和属性名进入单元格编辑。', '(key: DlDataTableRowKey, property: string)', 'Promise<unknown>'),
    method('finishEdit', '结束当前单元格编辑。', '()', 'Promise<unknown>'),
    method('validateRows', '完整校验指定行键或整张表格。', '(keys?: DlDataTableRowKey[])', 'Promise<unknown>'),
    method('insertRows', '插入行；提供 beforeKey 时插入到指定行之前。', '(rows: TRow | TRow[], beforeKey?: DlDataTableRowKey)', 'Promise<unknown>'),
    method('removeRows', '按稳定行键删除表格行。', '(keys: DlDataTableRowKey[])', 'Promise<unknown>'),
    method('getChanges', '返回新增、删除、修改与待处理记录集。', '()', 'DlDataTableChanges<TRow>'),
    method('scrollToRow', '滚动到指定行键，可同时定位属性列。', '(key: DlDataTableRowKey, property?: string)', 'Promise<unknown>'),
    method('scrollToColumn', '滚动到指定属性列。', '(property: string)', 'Promise<unknown>'),
    method('exportRows / importRows / printRows', '执行 features 中配置的数据交换或打印流程。', '(options?: Record<string, unknown>)', 'Promise<unknown>'),
    method('resetState', '清除排序、筛选、编辑、选择与滚动等运行状态。', '()', 'Promise<void>'),
    method('recalculate', '重新计算表格布局；full=true 时完整重算。', '(full = false)', 'Promise<void>'),
    method('undo / redo / clearHistory', '控制 features.history 启用后的撤销与重做历史。', '()', 'Promise<unknown>'),
  ],
})
export const DlDateField = managed(RawDlDateField, 'DlDateField', { domEvents: fieldEvents })
export const DlDatePicker = managed(RawDlDatePicker, 'DlDatePicker', { domEvents: fieldEvents })
export const DlDateRangeField = managed(RawDlDateRangeField, 'DlDateRangeField', { domEvents: fieldEvents })
export const DlDateRangePicker = managed(RawDlDateRangePicker, 'DlDateRangePicker', { domEvents: fieldEvents })
export const DlDialog = managed(RawDlDialog, 'DlDialog')
export const DlDrawer = managed(RawDlDrawer, 'DlDrawer')
export const DlDropdownMenu = managed(RawDlDropdownMenu, 'DlDropdownMenu')
export const DlEditable = managed(RawDlEditable, 'DlEditable', {
  domEvents: fieldEvents,
  methods: {
    edit: context => { (context.element?.querySelector('[data-slot="editable-edit"]') as HTMLElement | null)?.click(); return true },
    submit: context => { (context.element?.querySelector('[data-slot="editable-submit"]') as HTMLElement | null)?.click(); return true },
    cancel: context => { (context.element?.querySelector('[data-slot="editable-cancel"]') as HTMLElement | null)?.click(); return true },
  },
  methodDefinitions: [method('edit / submit / cancel', '进入编辑、提交或取消当前内联编辑。', '()')],
})
export const DlGrid = managed(RawDlGrid, 'DlGrid')
export const DlHoverCard = managed(RawDlHoverCard, 'DlHoverCard')
export const DlIconButton = managed(RawDlIconButton, 'DlIconButton', { domEvents: actionEvents })
export const DlInputButton = managed(RawDlInputButton, 'DlInputButton', {
  domEvents: actionEvents,
  methods: { startLoading: context => context.set('loading', true), stopLoading: context => context.set('loading', false) },
  methodDefinitions: [method('startLoading / stopLoading', '控制异步按钮状态，避免操作被重复触发。', '()')],
})
export const DlInputCheckbox = managed(RawDlInputCheckbox, 'DlInputCheckbox', {
  domEvents: fieldEvents,
  methods: { check: context => context.set('modelValue', true), uncheck: context => context.set('modelValue', false) },
  methodDefinitions: [method('check / uncheck', '显式选中或取消当前复选输入。', '()')],
})
export const DlInputColor = managed(RawDlInputColor, 'DlInputColor', { domEvents: fieldEvents })
export const DlInputDatetimeLocal = managed(RawDlInputDatetimeLocal, 'DlInputDatetimeLocal', {
  domEvents: fieldEvents,
  methods: { now: context => { (context.element?.querySelector('[aria-label="选择现在"]') as HTMLElement | null)?.click(); return true } },
  methodDefinitions: [method('now', '填入当前本地日期时间。', '()')],
})
export const DlInputEmail = managed(RawDlInputEmail, 'DlInputEmail', { domEvents: fieldEvents })
export const DlInputFile = managed(RawDlInputFile, 'DlInputFile', { domEvents: fieldEvents })
export const DlInputHidden = managed(RawDlInputHidden, 'DlInputHidden', { domEvents: fieldEvents })
export const DlInputImage = managed(RawDlInputImage, 'DlInputImage', { domEvents: actionEvents })
export const DlInputNumber = managed(RawDlInputNumber, 'DlInputNumber', {
  domEvents: fieldEvents,
  methods: numberMethods,
  methodDefinitions: [method('increment / decrement', '按 step 或传入步长增减数值，并遵守 min/max。', '(amount?: number)')],
})
export const DlInputPassword = managed(RawDlInputPassword, 'DlInputPassword', {
  domEvents: fieldEvents,
  methods: { toggleVisibility: context => { (context.element?.querySelector('[aria-label="显示密码"], [aria-label="隐藏密码"]') as HTMLElement | null)?.click(); return true } },
  methodDefinitions: [method('toggleVisibility', '切换密码明文与遮蔽显示。', '()')],
})
export const DlInputRadio = managed(RawDlInputRadio, 'DlInputRadio', { domEvents: fieldEvents })
export const DlInputRange = managed(RawDlInputRange, 'DlInputRange', {
  domEvents: fieldEvents,
  methods: numberMethods,
  methodDefinitions: [method('increment / decrement', '按 step 调整数值，并遵守范围。', '(amount?: number)')],
})
export const DlInputReset = managed(RawDlInputReset, 'DlInputReset', { domEvents: actionEvents })
export const DlInputSearch = managed(RawDlInputSearch, 'DlInputSearch', {
  domEvents: fieldEvents,
  methods: { search: context => { (context.element?.querySelector('[aria-label="执行搜索"]') as HTMLElement | null)?.click(); return true } },
  methodDefinitions: [method('search', '立即提交当前检索词，不等待防抖计时。', '()')],
})
export const DlInputSubmit = managed(RawDlInputSubmit, 'DlInputSubmit', {
  domEvents: actionEvents,
  methods: { startLoading: context => context.set('loading', true), stopLoading: context => context.set('loading', false) },
  methodDefinitions: [method('startLoading / stopLoading', '控制提交中的禁用与忙碌状态。', '()')],
})
export const DlInputTel = managed(RawDlInputTel, 'DlInputTel', { domEvents: fieldEvents })
export const DlInputText = managed(RawDlInputText, 'DlInputText', { domEvents: fieldEvents })
export const DlInputUrl = managed(RawDlInputUrl, 'DlInputUrl', {
  domEvents: fieldEvents,
  methods: { open: context => { (context.element?.querySelector('[aria-label="打开网址"]') as HTMLElement | null)?.click(); return true } },
  methodDefinitions: [method('open', '在新窗口安全打开规范化后的网址。', '()')],
})
export const DlInputWeek = managed(RawDlInputWeek, 'DlInputWeek', {
  domEvents: fieldEvents,
  methods: {
    previous: context => { (context.element?.querySelector('[aria-label="上一周"]') as HTMLElement | null)?.click(); return true },
    next: context => { (context.element?.querySelector('[aria-label="下一周"]') as HTMLElement | null)?.click(); return true },
    current: context => { (context.element?.querySelector('[aria-label="选择本周"]') as HTMLElement | null)?.click(); return true },
  },
  methodDefinitions: [method('previous / next / current', '按周导航或回到本周，并遵守 min/max。', '()')],
})
export const DlLabel = managed(RawDlLabel, 'DlLabel', { domEvents: ['click'] })
export const DlListbox = managed(RawDlListbox, 'DlListbox', { domEvents: fieldEvents })
export const DlMdx = managed(RawDlMdx, 'DlMdx', {
  domEvents: fieldEvents,
  methods: {
    setMode: (context, mode: 'edit' | 'preview' | 'split') => context.set('mode', mode),
    setSource: (context, source: string) => context.set('modelValue', source),
    openRuntimeEnvironment: context => callInner(context, 'openRuntimeEnvironment'),
  },
  methodDefinitions: [
    method('setMode', '切换编辑、预览或分栏模式。', "(mode: 'edit' | 'preview' | 'split')"),
    method('setSource', '替换 MarkdownX 文档源。', '(source: string)'),
    method('openRuntimeEnvironment', '打开当前文档的 DLENV 变量与开放方法页面。', '()', 'boolean'),
  ],
})
export const DlMarkdownX = DlMdx
export const DlMenubar = managed(RawDlMenubar, 'DlMenubar')
export const DlMonthPicker = managed(RawDlMonthPicker, 'DlMonthPicker', { domEvents: fieldEvents })
export const DlMonthRangePicker = managed(RawDlMonthRangePicker, 'DlMonthRangePicker', { domEvents: fieldEvents })
export const DlMultiChoice = managed(RawDlMultiChoice, 'DlMultiChoice', {
  domEvents: fieldEvents,
  methods: multiChoiceMethods,
  methodDefinitions: [
    method('select', '添加一个尚未选中的值。', '(value: string)'),
    method('deselect', '移除一个已经选中的值。', '(value: string)'),
    method('clear', '清除全部选择。', '()'),
  ],
})
export const DlNavigationMenu = managed(RawDlNavigationMenu, 'DlNavigationMenu')
export const DlNumberField = managed(RawDlNumberField, 'DlNumberField', {
  domEvents: fieldEvents,
  methods: numberMethods,
  methodDefinitions: [method('increment / decrement', '按 step 或传入步长增减数值，并遵守 min/max。', '(amount?: number)')],
})
export const DlPagination = managed(RawDlPagination, 'DlPagination', {
  valueProperty: 'page',
  methods: paginationMethods,
  methodDefinitions: [
    method('first / previous / next / last', '在合法分页范围内导航。', '()'),
    method('goTo', '跳转到指定页并自动约束范围。', '(page: number)'),
  ],
})
export const DlPageFrame = managed(RawDlPageFrame, 'DlPageFrame')
export const DlPathPicker = managed(RawDlPathPicker, 'DlPathPicker', {
  domEvents: fieldEvents,
  methods: {
    clear: context => context.set('modelValue', []),
    openPath: (context, path) => callInner(context, 'openPath', path),
    validate: context => callInner(context, 'validate') ?? false,
  },
  methodDefinitions: [
    method('clear', '清除全部路径选择及其参数。', '()'),
    method('openPath', '展开指定值路径。', '(path: string[])'),
    method('validate', '校验所有已选路径的必填动态参数。', '()', 'boolean'),
  ],
})
export const DlPinInput = managed(RawDlPinInput, 'DlPinInput', { domEvents: fieldEvents })
export const DlPopover = managed(RawDlPopover, 'DlPopover')
export const DlProgress = managed(RawDlProgress, 'DlProgress', {
  methods: {
    complete: context => context.set('modelValue', Number(context.get('max') ?? 100)),
    reset: context => context.set('modelValue', 0),
  },
  methodDefinitions: [method('complete / reset', '将进度设为最大值或归零。', '()')],
})
export const DlRadioGroup = managed(RawDlRadioGroup, 'DlRadioGroup', { domEvents: fieldEvents })
export const DlRangeCalendar = managed(RawDlRangeCalendar, 'DlRangeCalendar', { domEvents: fieldEvents })
export const DlRating = managed(RawDlRating, 'DlRating', { domEvents: fieldEvents })
export const DlScrollArea = managed(RawDlScrollArea, 'DlScrollArea')
export const DlSegmented = managed(RawDlSegmented, 'DlSegmented', {
  domEvents: fieldEvents,
  methods: { select: (context, value: string) => context.set('modelValue', value) },
  methodDefinitions: [method('select', '激活指定分段。', '(value: string)')],
})
export const DlSelect = managed(RawDlSelect, 'DlSelect', { domEvents: fieldEvents })
export const DlSeparator = managed(RawDlSeparator, 'DlSeparator')
export const DlSlider = managed(RawDlSlider, 'DlSlider', { domEvents: fieldEvents })
export const DlSiteHeader = managed(RawDlSiteHeader, 'DlSiteHeader')
export const DlSiteNavigation = managed(RawDlSiteNavigation, 'DlSiteNavigation')
export const DlSiteShell = managed(RawDlSiteShell, 'DlSiteShell')
export const DlSplitButton = managed(RawDlSplitButton, 'DlSplitButton', { domEvents: actionEvents })
export const DlSplitter = managed(RawDlSplitter, 'DlSplitter')
export const DlStack = managed(RawDlStack, 'DlStack')
export const DlStepper = managed(RawDlStepper, 'DlStepper', {
  methods: stepperMethods,
  methodDefinitions: [
    method('previous / next', '移动到上一步或下一个可用步骤。', '()'),
    method('goTo', '跳转到指定步骤。', '(step: number)'),
  ],
})
export const DlSwitch = managed(RawDlSwitch, 'DlSwitch', {
  domEvents: fieldEvents,
  methodDefinitions: [method('toggle', '切换布尔值，也可传入目标状态。', '(force?: boolean)')],
})
export const DlTabs = managed(RawDlTabs, 'DlTabs', {
  methods: { activate: (context, value: string) => context.set('modelValue', value) },
  methodDefinitions: [method('activate', '激活指定标签页。', '(value: string)')],
})
export const DlTagsInput = managed(RawDlTagsInput, 'DlTagsInput', {
  domEvents: fieldEvents,
  methods: tagsMethods,
  methodDefinitions: [
    method('add', '添加一个不重复的标签。', '(value: string)'),
    method('remove', '删除指定标签。', '(value: string)'),
  ],
})
export const DlTextarea = managed(RawDlTextarea, 'DlTextarea', { domEvents: fieldEvents })
export const DlTimeField = managed(RawDlTimeField, 'DlTimeField', { domEvents: fieldEvents })
export const DlTimePicker = managed(RawDlTimePicker, 'DlTimePicker', { domEvents: fieldEvents })
export const DlTimeRangeField = managed(RawDlTimeRangeField, 'DlTimeRangeField', { domEvents: fieldEvents })
export const DlToast = managed(RawDlToast, 'DlToast', {
  methods: { dismiss: context => context.set('open', false) },
  methodDefinitions: [method('dismiss', '关闭当前通知。', '()')],
})
export const DlToggle = managed(RawDlToggle, 'DlToggle', {
  domEvents: actionEvents,
  methodDefinitions: [method('toggle', '切换按压值，也可传入目标状态。', '(force?: boolean)')],
})
export const DlToggleGroup = managed(RawDlToggleGroup, 'DlToggleGroup', { domEvents: actionEvents })
export const DlToolbar = managed(RawDlToolbar, 'DlToolbar', {
  domEvents: actionEvents,
  methods: { triggerAction: (context, value: string) => { context.control.dispatch('action', value); return true } },
  methodDefinitions: [method('triggerAction', '以编程方式派发工具栏 action。', '(value: string)')],
})
export const DlToolbarMenu = managed(RawDlToolbarMenu, 'DlToolbarMenu', {
  domEvents: actionEvents,
  methods: { triggerAction: (context, value: string) => { context.control.dispatch('select', value); return true } },
  methodDefinitions: [method('triggerAction', '以编程方式执行一个菜单命令。', '(value: string)')],
})
export const DlTooltip = managed(RawDlTooltip, 'DlTooltip')
export const DlTree = managed(RawDlTree, 'DlTree', {
  methods: treeMethods,
  methodDefinitions: [
    method('expand / collapse', '展开或折叠指定节点。', '(value: string)'),
    method('collapseAll', '折叠全部节点。', '()'),
  ],
})
export const DlTreeMenu = managed(RawDlTreeMenu, 'DlTreeMenu', {
  methods: treeMethods,
  methodDefinitions: [
    method('expand / collapse', '展开或折叠指定目录节点。', '(value: string)'),
    method('collapseAll', '折叠全部目录节点。', '()'),
  ],
})
export const DlVirtualList = managed(RawDlVirtualList, 'DlVirtualList', {
  methods: virtualListMethods,
  methodDefinitions: [
    method('scrollToIndex', '把指定索引滚动到视口内。', "(index: number, alignment?: 'start' | 'center' | 'end' | 'auto')"),
    method('scrollToTop', '滚动到列表起点。', '()'),
  ],
})
export const DlYearPicker = managed(RawDlYearPicker, 'DlYearPicker', { domEvents: fieldEvents })
export const DlYearRangePicker = managed(RawDlYearRangePicker, 'DlYearRangePicker', { domEvents: fieldEvents })
