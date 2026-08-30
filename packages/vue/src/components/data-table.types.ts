import type { VxeColumnPropTypes, VxeTablePropTypes } from 'vxe-table'

export type DlDataTableRowKey = string | number

export type DlDataTableColumnRole = 'check' | 'number' | 'choice' | 'details'

export type DlDataTableDensity = 'dense' | 'compact' | 'comfortable'

export type DlDataTableGridLines = 'none' | 'frame' | 'inside' | 'all'

export type DlDataTableOverflow = boolean | 'ellipsis' | 'title' | 'tooltip'

export interface DlDataTableColumn {
  id?: string
  property?: string
  label?: string
  role?: DlDataTableColumnRole
  width?: string | number
  minWidth?: string | number
  maxWidth?: string | number
  pin?: 'start' | 'end'
  align?: 'left' | 'center' | 'right'
  headerAlign?: 'left' | 'center' | 'right'
  footerAlign?: 'left' | 'center' | 'right'
  verticalAlign?: 'top' | 'center' | 'bottom'
  resizable?: VxeColumnPropTypes.Resizable
  visible?: boolean
  overflow?: DlDataTableOverflow
  headerOverflow?: DlDataTableOverflow
  footerOverflow?: DlDataTableOverflow
  cellClass?: VxeColumnPropTypes.ClassName<Record<string, unknown>>
  headerClass?: VxeColumnPropTypes.HeaderClassName<Record<string, unknown>>
  footerClass?: VxeColumnPropTypes.FooterClassName<Record<string, unknown>>
  format?: VxeColumnPropTypes.Formatter<Record<string, unknown>>
  headerFormat?: VxeColumnPropTypes.HeaderFormatter
  footerFormat?: VxeColumnPropTypes.FooterFormatter<Record<string, unknown>>
  padded?: VxeColumnPropTypes.Padding
  sortable?: boolean
  sortBy?: VxeColumnPropTypes.SortBy<Record<string, unknown>>
  sortAs?: VxeColumnPropTypes.SortType
  filters?: VxeColumnPropTypes.Filters
  multipleFilters?: boolean
  filter?: VxeColumnPropTypes.FilterMethod<Record<string, unknown>>
  filterRenderer?: VxeColumnPropTypes.FilterRender
  resetFilter?: VxeColumnPropTypes.FilterResetMethod
  recoverFilter?: VxeColumnPropTypes.FilterRecoverMethod
  floatingFilter?: boolean
  rules?: VxeColumnPropTypes.Rules<Record<string, unknown>>
  groupNode?: boolean
  treeToggle?: boolean
  draggable?: boolean
  rowResizable?: boolean
  aggregate?: VxeColumnPropTypes.AggFunc
  exportHeader?: VxeColumnPropTypes.HeaderExportMethod<Record<string, unknown>>
  exportCell?: VxeColumnPropTypes.ExportMethod<Record<string, unknown>>
  exportFooter?: VxeColumnPropTypes.FooterExportMethod<Record<string, unknown>>
  labelPrefix?: VxeColumnPropTypes.TitlePrefix
  labelSuffix?: VxeColumnPropTypes.TitleSuffix
  valueType?: VxeColumnPropTypes.CellType
  renderer?: VxeColumnPropTypes.CellRender<Record<string, unknown>>
  editor?: VxeColumnPropTypes.EditRender<Record<string, unknown>>
  detailsRenderer?: VxeColumnPropTypes.ContentRender
  copyValue?: VxeColumnPropTypes.CopyMethod
  clearCutValue?: VxeColumnPropTypes.CutMethod
  pasteValue?: VxeColumnPropTypes.PasteMethod
  context?: Record<string, unknown>
  children?: DlDataTableColumn[]
}

export interface DlDataTablePresentation {
  align?: VxeTablePropTypes.Align
  headerAlign?: VxeTablePropTypes.HeaderAlign
  footerAlign?: VxeTablePropTypes.FooterAlign
  showHeader?: boolean
  showFooter?: boolean
  footerRows?: VxeTablePropTypes.FooterData
  summarizeFooter?: VxeTablePropTypes.FooterMethod<Record<string, unknown>>
  rowClass?: VxeTablePropTypes.RowClassName<Record<string, unknown>>
  cellClass?: VxeTablePropTypes.CellClassName<Record<string, unknown>>
  headerRowClass?: VxeTablePropTypes.HeaderRowClassName<Record<string, unknown>>
  headerCellClass?: VxeTablePropTypes.HeaderCellClassName<Record<string, unknown>>
  footerRowClass?: VxeTablePropTypes.FooterRowClassName<Record<string, unknown>>
  footerCellClass?: VxeTablePropTypes.FooterCellClassName<Record<string, unknown>>
  rowStyle?: VxeTablePropTypes.RowStyle<Record<string, unknown>>
  cellStyle?: VxeTablePropTypes.CellStyle<Record<string, unknown>>
  headerRowStyle?: VxeTablePropTypes.HeaderRowStyle<Record<string, unknown>>
  headerCellStyle?: VxeTablePropTypes.HeaderCellStyle<Record<string, unknown>>
  footerRowStyle?: VxeTablePropTypes.FooterRowStyle<Record<string, unknown>>
  footerCellStyle?: VxeTablePropTypes.FooterCellStyle<Record<string, unknown>>
  customHeader?: boolean
  headerMerges?: VxeTablePropTypes.MergeHeaderCells
  bodyMerges?: VxeTablePropTypes.MergeCells<Record<string, unknown>>
  footerMerges?: VxeTablePropTypes.MergeFooterCells<Record<string, unknown>>
  mergeBody?: VxeTablePropTypes.SpanMethod<Record<string, unknown>>
  mergeFooter?: VxeTablePropTypes.FooterSpanMethod<Record<string, unknown>>
  overflow?: VxeTablePropTypes.ShowOverflow
  headerOverflow?: VxeTablePropTypes.ShowHeaderOverflow
  footerOverflow?: VxeTablePropTypes.ShowFooterOverflow
}

export interface DlDataTableFeatures {
  trackOriginal?: boolean
  autoResize?: boolean
  resizeSignal?: boolean | string | number
  columns?: VxeTablePropTypes.ColumnConfig<Record<string, unknown>>
  rows?: VxeTablePropTypes.RowConfig<Record<string, unknown>>
  cells?: VxeTablePropTypes.CellConfig<Record<string, unknown>>
  headerCells?: VxeTablePropTypes.HeaderCellConfig<Record<string, unknown>>
  footerCells?: VxeTablePropTypes.FooterCellConfig<Record<string, unknown>>
  aggregation?: VxeTablePropTypes.AggregateConfig<Record<string, unknown>>
  aggregationPrecision?: VxeTablePropTypes.AggregateAccuracyConfig<Record<string, unknown>>
  currentRow?: VxeTablePropTypes.CurrentRowConfig<Record<string, unknown>>
  currentColumn?: VxeTablePropTypes.CurrentColumnConfig<Record<string, unknown>>
  rowDrag?: VxeTablePropTypes.RowDragConfig<Record<string, unknown>>
  columnDrag?: VxeTablePropTypes.ColumnDragConfig<Record<string, unknown>>
  personalization?: VxeTablePropTypes.CustomConfig<Record<string, unknown>>
  resize?: VxeTablePropTypes.ResizeConfig
  resizing?: VxeTablePropTypes.ResizableConfig<Record<string, unknown>>
  numbering?: VxeTablePropTypes.SeqConfig<Record<string, unknown>>
  sorting?: VxeTablePropTypes.SortConfig<Record<string, unknown>>
  filtering?: VxeTablePropTypes.FilterConfig<Record<string, unknown>>
  floatingFilter?: VxeTablePropTypes.FloatingFilterConfig<Record<string, unknown>>
  singleSelection?: VxeTablePropTypes.RadioConfig<Record<string, unknown>>
  multipleSelection?: VxeTablePropTypes.CheckboxConfig<Record<string, unknown>>
  tooltip?: VxeTablePropTypes.TooltipConfig<Record<string, unknown>>
  headerTooltip?: VxeTablePropTypes.HeaderTooltipConfig<Record<string, unknown>>
  footerTooltip?: VxeTablePropTypes.FooterTooltipConfig<Record<string, unknown>>
  exporting?: VxeTablePropTypes.ExportConfig<Record<string, unknown>>
  importing?: VxeTablePropTypes.ImportConfig<Record<string, unknown>>
  printing?: VxeTablePropTypes.PrintConfig<Record<string, unknown>>
  expansion?: VxeTablePropTypes.ExpandConfig<Record<string, unknown>>
  tree?: VxeTablePropTypes.TreeConfig<Record<string, unknown>>
  contextMenu?: VxeTablePropTypes.MenuConfig<Record<string, unknown>>
  pointer?: VxeTablePropTypes.MouseConfig
  areaSelection?: VxeTablePropTypes.AreaConfig<Record<string, unknown>>
  findReplace?: VxeTablePropTypes.FnrConfig<Record<string, unknown>>
  keyboard?: VxeTablePropTypes.KeyboardConfig<Record<string, unknown>>
  clipboard?: VxeTablePropTypes.ClipConfig<Record<string, unknown>>
  editing?: VxeTablePropTypes.EditConfig<Record<string, unknown>>
  dirtyTracking?: VxeTablePropTypes.EditDirtyConfig
  validation?: VxeTablePropTypes.ValidConfig<Record<string, unknown>>
  validationRules?: VxeTablePropTypes.EditRules<Record<string, unknown>>
  history?: VxeTablePropTypes.UndoRedoHistoryConfig
  emptyRenderer?: VxeTablePropTypes.EmptyRender
  loadingIndicator?: VxeTablePropTypes.LoadingConfig
  virtualColumns?: VxeTablePropTypes.VirtualXConfig
  virtualRows?: VxeTablePropTypes.VirtualYConfig
  scrollbars?: VxeTablePropTypes.ScrollbarConfig
  layer?: number
}

export interface DlDataTableCheckedRowsChange<TRow = Record<string, unknown>> {
  keys: DlDataTableRowKey[]
  rows: TRow[]
}

export interface DlDataTableRowChange<TRow = Record<string, unknown>> {
  key?: DlDataTableRowKey
  row?: TRow
  previousKey?: DlDataTableRowKey
  previousRow?: TRow
}

export interface DlDataTableCellActivate<TRow = Record<string, unknown>> {
  row: TRow
  rowKey?: DlDataTableRowKey
  property?: string
  event: Event
}

export interface DlDataTableSortChange {
  property?: string
  direction?: 'asc' | 'desc'
  sorts: Array<{ property?: string; direction?: 'asc' | 'desc' }>
}
