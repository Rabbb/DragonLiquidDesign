<script setup lang="ts" generic="TRow extends Record<string, unknown> = Record<string, unknown>">
import { nextTick, ref, useSlots, watch } from 'vue'
import { VxeColumn, VxeTable } from 'vxe-table'
import 'vxe-table/lib/style.css'
import type { DlDataTableColumn, DlDataTableRowKey } from './primitive.types'

const props = withDefaults(defineProps<{
  rows?: TRow[]
  columns: DlDataTableColumn[]
  selectedKeys?: DlDataTableRowKey[]
  rowKey?: string
  loading?: boolean
  border?: boolean | 'default' | 'full' | 'outer' | 'inner' | 'none'
  stripe?: boolean
  round?: boolean
  size?: 'mini' | 'small' | 'medium'
  height?: string | number
  maxHeight?: string | number
  emptyText?: string
}>(), {
  rows: () => [],
  selectedKeys: () => [],
  rowKey: 'id',
  loading: false,
  border: 'inner',
  stripe: true,
  round: true,
  size: 'small',
  height: undefined,
  maxHeight: undefined,
  emptyText: '暂无数据',
})

const emit = defineEmits<{
  'update:selectedKeys': [keys: DlDataTableRowKey[]]
  selectionChange: [rows: TRow[]]
  rowClick: [row: TRow]
  cellClick: [payload: { row: TRow; field?: string }]
  sortChange: [payload: { field?: string; order?: 'asc' | 'desc' | null }]
}>()

type VxeTableRef = {
  clearCheckboxRow: () => Promise<unknown> | void
  setCheckboxRow: (rows: TRow | TRow[], checked: boolean) => Promise<unknown> | void
  getCheckboxRecords: () => TRow[]
  recalculate?: () => Promise<unknown> | void
}

const tableRef = ref<VxeTableRef>()
const slots = useSlots()
let syncing = false

function rowIdentity(row: TRow): DlDataTableRowKey | undefined {
  const value = row[props.rowKey]
  return typeof value === 'string' || typeof value === 'number' ? value : undefined
}

function getSelectedRows(): TRow[] {
  return tableRef.value?.getCheckboxRecords() ?? []
}

function emitSelection() {
  if (syncing) return
  const rows = getSelectedRows()
  emit('update:selectedKeys', rows.map(rowIdentity).filter((key): key is DlDataTableRowKey => key !== undefined))
  emit('selectionChange', rows)
}

async function syncSelection() {
  await nextTick()
  if (!tableRef.value) return
  syncing = true
  try {
    await tableRef.value.clearCheckboxRow()
    const keys = new Set(props.selectedKeys)
    const selected = props.rows.filter(row => {
      const key = rowIdentity(row)
      return key !== undefined && keys.has(key)
    })
    if (selected.length) await tableRef.value.setCheckboxRow(selected, true)
  } finally {
    syncing = false
  }
}

function slotName(column: DlDataTableColumn) {
  return column.field ? `cell-${column.field}` : 'cell'
}

function hasCellSlot(column: DlDataTableColumn) {
  return Boolean(slots[slotName(column)])
}

function cellText(row: TRow, field?: string) {
  if (!field) return ''
  const value = row[field]
  return value === null || value === undefined ? '' : String(value)
}

function clearSelection() {
  void tableRef.value?.clearCheckboxRow()
  emit('update:selectedKeys', [])
  emit('selectionChange', [])
}

watch(() => props.selectedKeys, syncSelection, { deep: true, immediate: true })
watch(() => props.rows, syncSelection, { deep: true })

defineExpose({ clearSelection, getSelectedRows, recalculate: () => tableRef.value?.recalculate?.() })
</script>

<template>
  <div data-dl data-slot="data-table" class="dl-data-table" :aria-busy="loading">
    <VxeTable
      ref="tableRef"
      :data="rows"
      :loading="loading"
      :border="border"
      :stripe="stripe"
      :round="round"
      :size="size"
      :height="height"
      :max-height="maxHeight"
      :empty-text="emptyText"
      :row-config="{ keyField: rowKey, isHover: true }"
      :checkbox-config="{ highlight: true, reserve: false }"
      @checkbox-change="emitSelection"
      @checkbox-all="emitSelection"
      @row-click="emit('rowClick', $event.row as TRow)"
      @cell-click="emit('cellClick', { row: $event.row as TRow, field: $event.column?.field })"
      @sort-change="emit('sortChange', { field: $event.field, order: $event.order || null })"
    >
      <template v-for="column in columns" :key="`${column.type ?? 'field'}:${column.field ?? column.title ?? ''}`">
        <VxeColumn
          v-if="column.type"
          :type="column.type"
          :field="column.field"
          :title="column.title"
          :width="column.width"
          :min-width="column.minWidth"
          :fixed="column.fixed"
          :align="column.align"
          :header-align="column.headerAlign"
          :sortable="column.sortable"
          :visible="column.visible"
          :show-overflow="column.showOverflow"
          :class-name="column.className"
        />
        <VxeColumn
          v-else
          :field="column.field"
          :title="column.title"
          :width="column.width"
          :min-width="column.minWidth"
          :fixed="column.fixed"
          :align="column.align"
          :header-align="column.headerAlign"
          :sortable="column.sortable"
          :visible="column.visible"
          :show-overflow="column.showOverflow"
          :class-name="column.className"
        >
          <template #default="scope">
            <slot v-if="hasCellSlot(column)" :name="slotName(column)" v-bind="scope" />
            <template v-else>{{ cellText(scope.row as TRow, column.field) }}</template>
          </template>
        </VxeColumn>
      </template>
      <template #empty><slot name="empty">{{ emptyText }}</slot></template>
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
  --vxe-ui-table-border-color:var(--dl-border);
  --vxe-ui-table-row-hover-background-color:var(--dl-surface-hover);
  --vxe-ui-table-row-current-background-color:color-mix(in srgb,var(--dl-accent) 13%,var(--dl-panel));
  --vxe-ui-table-row-checkbox-checked-background-color:color-mix(in srgb,var(--dl-accent) 10%,var(--dl-panel));
  min-width:0;color:var(--dl-text);font-family:var(--dl-font-sans,system-ui,sans-serif)
}
.dl-data-table .vxe-table{background:var(--dl-panel)}
.dl-data-table .vxe-table--header-wrapper{background:var(--dl-night-soft)}
.dl-data-table .vxe-header--column{color:var(--dl-text-muted);font-size:.73rem;font-weight:750;letter-spacing:.025em}
.dl-data-table .vxe-body--column{color:var(--dl-text);font-size:.78rem}
.dl-data-table .vxe-table--empty-content{color:var(--dl-text-faint)}
.dl-data-table .vxe-cell--checkbox .vxe-checkbox--icon{color:var(--dl-accent)}
</style>
