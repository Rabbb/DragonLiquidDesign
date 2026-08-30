<script setup lang="ts" generic="TRow extends Record<string, unknown> = Record<string, unknown>">
import { computed, h, nextTick, ref, watch } from 'vue'
import { VxeColgroup, VxeColumn, VxeTable } from 'vxe-table'
import 'vxe-table/lib/style.css'
import type { VxeTableInstance, VxeTableProps } from 'vxe-table'
import type {
  DlDataTableCellActivate,
  DlDataTableCheckedRowsChange,
  DlDataTableColumn,
  DlDataTableDensity,
  DlDataTableFeatures,
  DlDataTableGridLines,
  DlDataTablePresentation,
  DlDataTableRowChange,
  DlDataTableRowKey,
  DlDataTableSortChange,
} from './data-table.types'

const props = withDefaults(defineProps<{
  rows?: TRow[]
  columns: DlDataTableColumn[]
  checkedRowKeys?: DlDataTableRowKey[]
  currentRowKey?: DlDataTableRowKey
  chosenRowKey?: DlDataTableRowKey
  expandedRowKeys?: DlDataTableRowKey[]
  rowIdentity?: string
  storageKey?: string
  loading?: boolean
  density?: DlDataTableDensity
  gridLines?: DlDataTableGridLines
  zebra?: boolean
  rounded?: boolean
  height?: string | number
  minHeight?: string | number
  maxHeight?: string | number
  emptyMessage?: string
  presentation?: DlDataTablePresentation
  features?: DlDataTableFeatures
  context?: Record<string, unknown>
}>(), {
  rows: () => [],
  checkedRowKeys: () => [],
  expandedRowKeys: () => [],
  rowIdentity: 'id',
  storageKey: undefined,
  loading: false,
  density: 'compact',
  gridLines: 'inside',
  zebra: true,
  rounded: true,
  height: undefined,
  minHeight: undefined,
  maxHeight: undefined,
  emptyMessage: '暂无数据',
  presentation: () => ({}),
  features: () => ({}),
  context: () => ({}),
})

const emit = defineEmits<{
  'update:checkedRowKeys': [keys: DlDataTableRowKey[]]
  'update:currentRowKey': [key: DlDataTableRowKey | undefined]
  'update:chosenRowKey': [key: DlDataTableRowKey | undefined]
  'update:expandedRowKeys': [keys: DlDataTableRowKey[]]
  checkedRowsChange: [payload: DlDataTableCheckedRowsChange<TRow>]
  currentRowChange: [payload: DlDataTableRowChange<TRow>]
  chosenRowChange: [payload: DlDataTableRowChange<TRow>]
  expandedRowsChange: [payload: DlDataTableCheckedRowsChange<TRow>]
  rowActivate: [payload: { row: TRow; rowKey?: DlDataTableRowKey; event: Event }]
  cellActivate: [payload: DlDataTableCellActivate<TRow>]
  sortChange: [payload: DlDataTableSortChange]
  filterChange: [payload: unknown]
  editBegin: [payload: unknown]
  editEnd: [payload: unknown]
  validationError: [payload: unknown]
  contextAction: [payload: unknown]
  rowDragEnd: [payload: unknown]
  columnDragEnd: [payload: unknown]
  scroll: [payload: unknown]
}>()

type TableEngine = VxeTableInstance<TRow> & Record<string, (...args: any[]) => any>
type TableSlot = (scope: Record<string, any>) => any

const tableRef = ref<VxeTableInstance<TRow>>()
const declaredSlots = defineSlots<{
  empty?: TableSlot
  loading?: TableSlot
  cell?: TableSlot
  header?: TableSlot
  footer?: TableSlot
  details?: TableSlot
  filter?: TableSlot
  edit?: TableSlot
  validation?: TableSlot
  tooltip?: TableSlot
  'row-drag-icon'?: TableSlot
  'column-drag-icon'?: TableSlot
  'header-tooltip'?: TableSlot
  'footer-tooltip'?: TableSlot
  [name: `cell-${string}`]: TableSlot | undefined
  [name: `header-${string}`]: TableSlot | undefined
  [name: `footer-${string}`]: TableSlot | undefined
  [name: `details-${string}`]: TableSlot | undefined
  [name: `filter-${string}`]: TableSlot | undefined
  [name: `floating-filter-${string}`]: TableSlot | undefined
  [name: `edit-${string}`]: TableSlot | undefined
  [name: `validation-${string}`]: TableSlot | undefined
}>()
const slots = declaredSlots as Record<string, TableSlot | undefined>
let syncing = false

const densityMap: Record<DlDataTableDensity, 'mini' | 'small' | 'medium'> = { dense: 'mini', compact: 'small', comfortable: 'medium' }
const gridLineMap: Record<DlDataTableGridLines, 'none' | 'outer' | 'inner' | 'full'> = { none: 'none', frame: 'outer', inside: 'inner', all: 'full' }
const roleMap = { check: 'checkbox', number: 'seq', choice: 'radio', details: 'expand' } as const

function rowKey(row?: TRow | null): DlDataTableRowKey | undefined {
  if (!row) return undefined
  const value = row[props.rowIdentity]
  return typeof value === 'string' || typeof value === 'number' ? value : undefined
}

function rowByKey(key?: DlDataTableRowKey): TRow | undefined {
  if (key === undefined) return undefined
  return props.rows.find(row => rowKey(row) === key)
}

function rowsByKey(keys: readonly DlDataTableRowKey[]): TRow[] {
  const selected = new Set(keys)
  return props.rows.filter(row => {
    const key = rowKey(row)
    return key !== undefined && selected.has(key)
  })
}

function engine(): TableEngine | undefined {
  return tableRef.value as TableEngine | undefined
}

const tableProps = computed(() => {
  const view = props.presentation
  const feature = props.features
  return {
    id: props.storageKey,
    data: props.rows,
    loading: props.loading,
    size: densityMap[props.density],
    border: gridLineMap[props.gridLines],
    stripe: props.zebra,
    round: props.rounded,
    height: props.height,
    minHeight: props.minHeight,
    maxHeight: props.maxHeight,
    emptyText: props.emptyMessage,
    params: props.context,
    align: view.align,
    headerAlign: view.headerAlign,
    footerAlign: view.footerAlign,
    showHeader: view.showHeader,
    showFooter: view.showFooter,
    footerData: view.footerRows,
    footerMethod: view.summarizeFooter as VxeTableProps<TRow>['footerMethod'],
    rowClassName: view.rowClass as VxeTableProps<TRow>['rowClassName'],
    cellClassName: view.cellClass as VxeTableProps<TRow>['cellClassName'],
    headerRowClassName: view.headerRowClass as VxeTableProps<TRow>['headerRowClassName'],
    headerCellClassName: view.headerCellClass as VxeTableProps<TRow>['headerCellClassName'],
    footerRowClassName: view.footerRowClass as VxeTableProps<TRow>['footerRowClassName'],
    footerCellClassName: view.footerCellClass as VxeTableProps<TRow>['footerCellClassName'],
    rowStyle: view.rowStyle as VxeTableProps<TRow>['rowStyle'],
    cellStyle: view.cellStyle as VxeTableProps<TRow>['cellStyle'],
    headerRowStyle: view.headerRowStyle as VxeTableProps<TRow>['headerRowStyle'],
    headerCellStyle: view.headerCellStyle as VxeTableProps<TRow>['headerCellStyle'],
    footerRowStyle: view.footerRowStyle as VxeTableProps<TRow>['footerRowStyle'],
    footerCellStyle: view.footerCellStyle as VxeTableProps<TRow>['footerCellStyle'],
    showCustomHeader: view.customHeader,
    mergeHeaderCells: view.headerMerges,
    mergeCells: view.bodyMerges as VxeTableProps<TRow>['mergeCells'],
    mergeFooterCells: view.footerMerges as VxeTableProps<TRow>['mergeFooterCells'],
    spanMethod: view.mergeBody as VxeTableProps<TRow>['spanMethod'],
    footerSpanMethod: view.mergeFooter as VxeTableProps<TRow>['footerSpanMethod'],
    showOverflow: view.overflow,
    showHeaderOverflow: view.headerOverflow,
    showFooterOverflow: view.footerOverflow,
    keepSource: feature.trackOriginal,
    autoResize: feature.autoResize,
    syncResize: feature.resizeSignal,
    columnConfig: { ...feature.columns, useKey: true },
    rowConfig: {
      ...feature.rows as VxeTableProps<TRow>['rowConfig'],
      keyField: props.rowIdentity,
      useKey: true,
      isHover: feature.rows?.isHover ?? true,
      isCurrent: feature.rows?.isCurrent ?? props.currentRowKey !== undefined,
    },
    cellConfig: feature.cells,
    headerCellConfig: feature.headerCells,
    footerCellConfig: feature.footerCells,
    aggregateConfig: feature.aggregation as VxeTableProps<TRow>['aggregateConfig'],
    aggregateAccuracyConfig: feature.aggregationPrecision as VxeTableProps<TRow>['aggregateAccuracyConfig'],
    currentRowConfig: feature.currentRow as VxeTableProps<TRow>['currentRowConfig'],
    currentColumnConfig: feature.currentColumn as VxeTableProps<TRow>['currentColumnConfig'],
    rowDragConfig: feature.rowDrag as VxeTableProps<TRow>['rowDragConfig'],
    columnDragConfig: feature.columnDrag as VxeTableProps<TRow>['columnDragConfig'],
    customConfig: feature.personalization as VxeTableProps<TRow>['customConfig'],
    resizeConfig: feature.resize,
    resizableConfig: feature.resizing as VxeTableProps<TRow>['resizableConfig'],
    seqConfig: feature.numbering as VxeTableProps<TRow>['seqConfig'],
    sortConfig: feature.sorting as VxeTableProps<TRow>['sortConfig'],
    filterConfig: feature.filtering as VxeTableProps<TRow>['filterConfig'],
    floatingFilterConfig: feature.floatingFilter as VxeTableProps<TRow>['floatingFilterConfig'],
    radioConfig: { highlight: true, ...feature.singleSelection } as VxeTableProps<TRow>['radioConfig'],
    checkboxConfig: { highlight: true, reserve: false, ...feature.multipleSelection } as VxeTableProps<TRow>['checkboxConfig'],
    tooltipConfig: feature.tooltip as VxeTableProps<TRow>['tooltipConfig'],
    headerTooltipConfig: feature.headerTooltip as VxeTableProps<TRow>['headerTooltipConfig'],
    footerTooltipConfig: feature.footerTooltip as VxeTableProps<TRow>['footerTooltipConfig'],
    exportConfig: feature.exporting as VxeTableProps<TRow>['exportConfig'],
    importConfig: feature.importing as VxeTableProps<TRow>['importConfig'],
    printConfig: feature.printing as VxeTableProps<TRow>['printConfig'],
    expandConfig: feature.expansion as VxeTableProps<TRow>['expandConfig'],
    treeConfig: feature.tree as VxeTableProps<TRow>['treeConfig'],
    menuConfig: feature.contextMenu as VxeTableProps<TRow>['menuConfig'],
    mouseConfig: feature.pointer,
    areaConfig: feature.areaSelection as VxeTableProps<TRow>['areaConfig'],
    fnrConfig: feature.findReplace as VxeTableProps<TRow>['fnrConfig'],
    keyboardConfig: feature.keyboard as VxeTableProps<TRow>['keyboardConfig'],
    clipConfig: feature.clipboard as VxeTableProps<TRow>['clipConfig'],
    editConfig: feature.editing as VxeTableProps<TRow>['editConfig'],
    editDirtyConfig: feature.dirtyTracking,
    validConfig: feature.validation as VxeTableProps<TRow>['validConfig'],
    editRules: feature.validationRules as VxeTableProps<TRow>['editRules'],
    undoRedoHistoryConfig: feature.history,
    emptyRender: feature.emptyRenderer,
    loadingConfig: feature.loadingIndicator,
    virtualXConfig: feature.virtualColumns,
    virtualYConfig: feature.virtualRows,
    scrollbarConfig: feature.scrollbars,
    zIndex: feature.layer,
  } as unknown as VxeTableProps<TRow>
})

function columnProps(column: DlDataTableColumn) {
  return {
    colId: column.id,
    type: column.role ? roleMap[column.role] : undefined,
    field: column.property,
    title: column.label,
    width: column.width,
    minWidth: column.minWidth,
    maxWidth: column.maxWidth,
    fixed: column.pin === 'start' ? 'left' : column.pin === 'end' ? 'right' : undefined,
    align: column.align,
    headerAlign: column.headerAlign,
    footerAlign: column.footerAlign,
    verticalAlign: column.verticalAlign,
    resizable: column.resizable,
    visible: column.visible,
    showOverflow: column.overflow,
    showHeaderOverflow: column.headerOverflow,
    showFooterOverflow: column.footerOverflow,
    className: column.cellClass,
    headerClassName: column.headerClass,
    footerClassName: column.footerClass,
    formatter: column.format,
    headerFormatter: column.headerFormat,
    footerFormatter: column.footerFormat,
    padding: column.padded,
    sortable: column.sortable,
    sortBy: column.sortBy,
    sortType: column.sortAs,
    filters: column.filters,
    filterMultiple: column.multipleFilters,
    filterMethod: column.filter,
    filterRender: column.filterRenderer,
    filterResetMethod: column.resetFilter,
    filterRecoverMethod: column.recoverFilter,
    floatingFilters: column.floatingFilter,
    rules: column.rules,
    rowGroupNode: column.groupNode,
    treeNode: column.treeToggle,
    dragSort: column.draggable,
    rowResize: column.rowResizable,
    aggFunc: column.aggregate,
    headerExportMethod: column.exportHeader,
    exportMethod: column.exportCell,
    footerExportMethod: column.exportFooter,
    titlePrefix: column.labelPrefix,
    titleSuffix: column.labelSuffix,
    cellType: column.valueType,
    cellRender: column.renderer,
    editRender: column.editor,
    contentRender: column.detailsRenderer,
    copyMethod: column.copyValue,
    cutMethod: column.clearCutValue,
    pasteMethod: column.pasteValue,
    params: column.context,
  }
}

function columnSlot(kind: string, column: DlDataTableColumn) {
  return slots[column.property ? `${kind}-${column.property}` : kind] ?? slots[kind]
}

function cellText(row: TRow, property?: string) {
  if (!property) return ''
  const value = row[property]
  return value === null || value === undefined ? '' : String(value)
}

function columnSlots(column: DlDataTableColumn) {
  const result: Record<string, (scope: Record<string, any>) => unknown> = {}
  const cell = columnSlot('cell', column)
  const header = columnSlot('header', column)
  const footer = columnSlot('footer', column)
  const details = columnSlot('details', column)
  const filter = columnSlot('filter', column)
  const floatingFilter = columnSlot('floating-filter', column)
  const edit = columnSlot('edit', column)
  const valid = columnSlot('validation', column)
  if (column.role === 'check' && cell) result.checkbox = scope => cell(scope)
  else if (column.role === 'choice' && cell) result.radio = scope => cell(scope)
  else if (!column.role) result.default = scope => cell ? cell(scope) : cellText(scope.row as TRow, column.property)
  if (header) result.header = scope => header(scope)
  if (footer) result.footer = scope => footer(scope)
  if (details) result.content = scope => details(scope)
  if (filter) result.filter = scope => filter(scope)
  if (floatingFilter) result.floatingFilter = scope => floatingFilter(scope)
  if (edit) result.edit = scope => edit(scope)
  if (valid) result.valid = scope => valid(scope)
  return result
}

function TableColumnNode(nodeProps: { column: DlDataTableColumn }) {
  const column = nodeProps.column
  if (column.children?.length) {
    return h(VxeColgroup as any, columnProps(column) as any, {
      default: () => column.children!.map(child => h(TableColumnNode, { key: child.id ?? `${child.role ?? 'cell'}:${child.property ?? child.label ?? ''}`, column: child })),
    })
  }
  return h(VxeColumn as any, columnProps(column) as any, columnSlots(column))
}

async function syncCheckedRows() {
  await nextTick()
  const instance = engine()
  if (!instance) return
  syncing = true
  try {
    await instance.clearCheckboxRow?.()
    if (props.checkedRowKeys.length) await instance.setCheckboxRowByKey?.(props.checkedRowKeys, true)
  } finally { syncing = false }
}

async function syncCurrentRow() {
  await nextTick()
  const instance = engine()
  if (!instance) return
  syncing = true
  try {
    const row = rowByKey(props.currentRowKey)
    if (row) await instance.setCurrentRow?.(row)
    else await instance.clearCurrentRow?.()
  } finally { syncing = false }
}

async function syncChosenRow() {
  await nextTick()
  const instance = engine()
  if (!instance) return
  syncing = true
  try {
    if (props.chosenRowKey !== undefined) await instance.setRadioByRowKey?.(props.chosenRowKey)
    else await instance.clearRadioRow?.()
  } finally { syncing = false }
}

async function syncExpandedRows() {
  await nextTick()
  const instance = engine()
  if (!instance) return
  syncing = true
  try {
    const rows = rowsByKey(props.expandedRowKeys)
    if (props.features.tree) {
      await instance.clearTreeExpand?.()
      if (rows.length) await instance.setTreeExpand?.(rows, true)
    } else {
      await instance.clearRowExpand?.()
      if (rows.length) await instance.setRowExpand?.(rows, true)
    }
  } finally { syncing = false }
}

function emitCheckedRows() {
  if (syncing) return
  const rows = engine()?.getCheckboxRecords?.() as TRow[] | undefined ?? []
  const keys = rows.map(rowKey).filter((key): key is DlDataTableRowKey => key !== undefined)
  emit('update:checkedRowKeys', keys)
  emit('checkedRowsChange', { keys, rows })
}

function emitCurrentRow(payload: Record<string, any>) {
  if (syncing) return
  const row = payload.row as TRow | undefined
  const previousRow = (payload.oldValue ?? payload.oldRow) as TRow | undefined
  const key = rowKey(row)
  emit('update:currentRowKey', key)
  emit('currentRowChange', { key, row, previousKey: rowKey(previousRow), previousRow })
}

function emitChosenRow(payload: Record<string, any>) {
  if (syncing) return
  const row = payload.row as TRow | undefined
  const previousRow = (payload.oldValue ?? payload.oldRow) as TRow | undefined
  const key = rowKey(row)
  emit('update:chosenRowKey', key)
  emit('chosenRowChange', { key, row, previousKey: rowKey(previousRow), previousRow })
}

function emitExpandedRows() {
  if (syncing) return
  const instance = engine()
  const rows = (props.features.tree ? instance?.getTreeExpandRecords?.() : instance?.getRowExpandRecords?.()) as TRow[] | undefined ?? []
  const keys = rows.map(rowKey).filter((key): key is DlDataTableRowKey => key !== undefined)
  emit('update:expandedRowKeys', keys)
  emit('expandedRowsChange', { keys, rows })
}

function emitSort(payload: Record<string, any>) {
  const entries = (payload.sortList?.length ? payload.sortList : [payload]) as Array<Record<string, any>>
  const sorts = entries.filter(item => item.order).map(item => ({ property: item.field as string | undefined, direction: item.order as 'asc' | 'desc' }))
  emit('sortChange', { property: payload.field, direction: payload.order || undefined, sorts })
}

function emitRowActivate(payload: Record<string, any>) {
  const row = payload.row as TRow
  emit('rowActivate', { row, rowKey: rowKey(row), event: payload.$event as Event })
}

function emitCellActivate(payload: Record<string, any>) {
  const row = payload.row as TRow
  emit('cellActivate', { row, rowKey: rowKey(row), property: payload.column?.field, event: payload.$event as Event })
}

function getRows(): TRow[] { return (engine()?.getFullData?.() as TRow[] | undefined) ?? props.rows }
function getVisibleRows(): TRow[] { return (engine()?.getTableData?.()?.visibleData as TRow[] | undefined) ?? props.rows }
function getCheckedRows(): TRow[] { return (engine()?.getCheckboxRecords?.() as TRow[] | undefined) ?? [] }

async function setCheckedRows(keys: DlDataTableRowKey[], checked = true) {
  await engine()?.setCheckboxRowByKey?.(keys, checked)
  emitCheckedRows()
}

async function clearCheckedRows() {
  await engine()?.clearCheckboxRow?.()
  emitCheckedRows()
}

async function setCurrentRow(key?: DlDataTableRowKey) {
  const row = rowByKey(key)
  if (row) await engine()?.setCurrentRow?.(row)
  else await engine()?.clearCurrentRow?.()
  emit('update:currentRowKey', rowKey(row))
}

async function setChosenRow(key?: DlDataTableRowKey) {
  if (key !== undefined) await engine()?.setRadioByRowKey?.(key)
  else await engine()?.clearRadioRow?.()
  emit('update:chosenRowKey', key)
}

async function setExpandedRows(keys: DlDataTableRowKey[]) {
  const rows = rowsByKey(keys)
  if (props.features.tree) {
    await engine()?.clearTreeExpand?.()
    if (rows.length) await engine()?.setTreeExpand?.(rows, true)
  } else {
    await engine()?.clearRowExpand?.()
    if (rows.length) await engine()?.setRowExpand?.(rows, true)
  }
  emit('update:expandedRowKeys', rows.map(rowKey).filter((key): key is DlDataTableRowKey => key !== undefined))
}

async function sortRows(sorts: Array<{ property: string; direction?: 'asc' | 'desc' }>) {
  await engine()?.setSort?.(sorts.map(item => ({ field: item.property, order: item.direction })), true)
}

async function clearSorting(property?: string) { await engine()?.clearSort?.(property) }
async function clearFilters(property?: string) { await engine()?.clearFilter?.(property) }
async function beginEdit(key: DlDataTableRowKey, property: string) {
  const row = rowByKey(key)
  return row ? engine()?.setEditCell?.(row, property) : undefined
}
async function finishEdit() { return engine()?.clearEdit?.() }
async function validateRows(keys?: DlDataTableRowKey[]) { return engine()?.fullValidate?.(keys ? rowsByKey(keys) : true) }
async function insertRows(records: TRow | TRow[], beforeKey?: DlDataTableRowKey) { return beforeKey === undefined ? engine()?.insert?.(records) : engine()?.insertAt?.(records, rowByKey(beforeKey)) }
async function removeRows(keys: DlDataTableRowKey[]) { return engine()?.remove?.(rowsByKey(keys)) }
function getChanges() { return engine()?.getRecordset?.() ?? { insertRecords: [], removeRecords: [], updateRecords: [], pendingRecords: [] } }
async function scrollToRow(key: DlDataTableRowKey, property?: string) { return engine()?.scrollToRow?.(key, property) }
async function scrollToColumn(property: string) { return engine()?.scrollToColumn?.(property) }
async function exportRows(options?: Record<string, unknown>) { return engine()?.exportData?.(options) }
async function importRows(options?: Record<string, unknown>) { return engine()?.importData?.(options) }
async function printRows(options?: Record<string, unknown>) { return engine()?.print?.(options) }
async function resetState() { return engine()?.clearAll?.() }

watch(() => [props.checkedRowKeys, props.rows] as const, syncCheckedRows, { deep: true, immediate: true })
watch(() => [props.currentRowKey, props.rows] as const, syncCurrentRow, { deep: true, immediate: true })
watch(() => [props.chosenRowKey, props.rows] as const, syncChosenRow, { deep: true, immediate: true })
watch(() => [props.expandedRowKeys, props.rows] as const, syncExpandedRows, { deep: true, immediate: true })

defineExpose({
  getRows, getVisibleRows, getCheckedRows, setCheckedRows, clearCheckedRows, setCurrentRow, setChosenRow, setExpandedRows,
  sortRows, clearSorting, clearFilters, beginEdit, finishEdit, validateRows, insertRows, removeRows, getChanges,
  scrollToRow, scrollToColumn, exportRows, importRows, printRows, resetState,
  recalculate: (full = false) => engine()?.recalculate?.(full),
  undo: () => engine()?.undo?.(),
  redo: () => engine()?.redo?.(),
  clearHistory: () => engine()?.clearHistory?.(),
  focus: () => engine()?.focus?.(),
  blur: () => engine()?.blur?.(),
})
</script>

<template>
  <div data-dl data-slot="data-table" class="dl-data-table" :aria-busy="loading">
    <VxeTable
      ref="tableRef"
      v-bind="tableProps"
      @checkbox-change="emitCheckedRows"
      @checkbox-all="emitCheckedRows"
      @current-row-change="emitCurrentRow"
      @radio-change="emitChosenRow"
      @toggle-row-expand="emitExpandedRows"
      @toggle-tree-expand="emitExpandedRows"
      @row-click="emitRowActivate"
      @cell-click="emitCellActivate"
      @sort-change="emitSort"
      @filter-change="emit('filterChange', $event)"
      @edit-activated="emit('editBegin', $event)"
      @edit-closed="emit('editEnd', $event)"
      @valid-error="emit('validationError', $event)"
      @menu-click="emit('contextAction', $event)"
      @row-dragend="emit('rowDragEnd', $event)"
      @column-dragend="emit('columnDragEnd', $event)"
      @scroll="emit('scroll', $event)"
    >
      <TableColumnNode v-for="column in columns" :key="column.id ?? `${column.role ?? 'cell'}:${column.property ?? column.label ?? ''}`" :column="column" />
      <template #empty="scope"><slot name="empty" v-bind="scope">{{ emptyMessage }}</slot></template>
      <template v-if="$slots.loading" #loading="scope"><slot name="loading" v-bind="scope" /></template>
      <template v-if="$slots['row-drag-icon']" #row-drag-icon="scope"><slot name="row-drag-icon" v-bind="scope" /></template>
      <template v-if="$slots['column-drag-icon']" #column-drag-icon="scope"><slot name="column-drag-icon" v-bind="scope" /></template>
      <template v-if="$slots['header-tooltip']" #header-tooltip="scope"><slot name="header-tooltip" v-bind="scope" /></template>
      <template v-if="$slots.tooltip" #tooltip="scope"><slot name="tooltip" v-bind="scope" /></template>
      <template v-if="$slots['footer-tooltip']" #footer-tooltip="scope"><slot name="footer-tooltip" v-bind="scope" /></template>
    </VxeTable>
  </div>
</template>

<style>
.dl-data-table{
  --vxe-ui-font-color:var(--dl-text);
  --vxe-ui-font-lighten-color:var(--dl-text-muted);
  --vxe-ui-font-primary-color:var(--dl-accent);
  --vxe-ui-layout-background-color:var(--dl-panel);
  --vxe-ui-table-background-color:var(--dl-panel);
  --vxe-ui-table-header-background-color:var(--dl-night-soft);
  --vxe-ui-table-footer-background-color:var(--dl-night-soft);
  --vxe-ui-table-border-color:var(--dl-border);
  --vxe-ui-table-row-striped-background-color:color-mix(in srgb,var(--dl-surface) 78%,var(--dl-panel));
  --vxe-ui-table-row-hover-background-color:var(--dl-surface-hover);
  --vxe-ui-table-row-hover-striped-background-color:color-mix(in srgb,var(--dl-accent) 9%,var(--dl-surface-hover));
  --vxe-ui-table-row-current-background-color:color-mix(in srgb,var(--dl-accent) 13%,var(--dl-panel));
  --vxe-ui-table-row-hover-current-background-color:color-mix(in srgb,var(--dl-accent) 18%,var(--dl-surface-hover));
  --vxe-ui-table-row-checkbox-checked-background-color:color-mix(in srgb,var(--dl-accent) 10%,var(--dl-panel));
  --vxe-ui-table-row-hover-checkbox-checked-background-color:color-mix(in srgb,var(--dl-accent) 16%,var(--dl-surface-hover));
  --vxe-ui-table-row-radio-checked-background-color:color-mix(in srgb,var(--dl-accent) 10%,var(--dl-panel));
  --vxe-ui-table-row-hover-radio-checked-background-color:color-mix(in srgb,var(--dl-accent) 16%,var(--dl-surface-hover));
  min-width:0;color:var(--dl-text);font-family:var(--dl-font-sans,system-ui,sans-serif)
}
.dl-data-table .vxe-table{background:var(--dl-panel)}
.dl-data-table .vxe-table--header-wrapper,.dl-data-table .vxe-table--footer-wrapper{background:var(--dl-night-soft)}
.dl-data-table .vxe-header--column{color:var(--dl-text-muted);font-size:.73rem;font-weight:750;letter-spacing:.025em}
.dl-data-table .vxe-body--column{color:var(--dl-text);font-size:.78rem}
.dl-data-table .vxe-table--empty-content{color:var(--dl-text-faint)}
.dl-data-table .vxe-cell--checkbox .vxe-checkbox--icon,.dl-data-table .vxe-cell--radio .vxe-radio--icon{color:var(--dl-accent)}
</style>
