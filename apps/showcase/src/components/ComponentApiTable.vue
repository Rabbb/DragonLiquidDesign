<script setup lang="ts">
import { computed } from 'vue'
import { VxeColumn, VxeTable } from 'vxe-table'
import 'vxe-pc-ui/es/style.css'
import 'vxe-table/es/style.css'
import { componentApiTables } from '../api/componentApi'

const props = defineProps<{
  componentId: string
  componentName: string
}>()

const tables = computed(() => componentApiTables(props.componentId, props.componentName))
const columnConfig = { resizable: true }
const rowConfig = { isHover: true }
</script>

<template>
  <div class="component-api-list">
    <section
      v-for="table in tables"
      :key="table.key"
      class="component-api-card"
      :aria-labelledby="`${table.key}-title`"
    >
      <header class="component-api-header">
        <div>
          <p>{{ table.eyebrow }}</p>
          <h2 :id="`${table.key}-title`">{{ table.title }}</h2>
          <small>{{ table.description }}</small>
        </div>
        <span>{{ table.badge }}</span>
      </header>

      <div class="component-api-table-wrap">
        <VxeTable
          class="component-api-table"
          :data="[...table.rows]"
          :column-config="columnConfig"
          :row-config="rowConfig"
          :show-overflow="false"
          border="inner"
          size="small"
          auto-resize
        >
          <VxeColumn field="prop" title="属性" min-width="150">
            <template #default="{ row }"><code>{{ row.prop }}</code></template>
          </VxeColumn>
          <VxeColumn field="description" title="说明" min-width="310" />
          <VxeColumn field="type" title="类型" min-width="280">
            <template #default="{ row }"><code>{{ row.type }}</code></template>
          </VxeColumn>
          <VxeColumn field="defaultValue" :title="table.lastColumnTitle" min-width="150">
            <template #default="{ row }"><code>{{ row.defaultValue }}</code></template>
          </VxeColumn>
        </VxeTable>
      </div>
    </section>
  </div>
</template>

<style scoped>
.component-api-list {
  display: grid;
  gap: 18px;
  margin-top: 34px;
}

.component-api-card {
  padding: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.06);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.045);
}

.component-api-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.component-api-header p {
  margin: 0 0 8px;
  color: #ffd750;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.component-api-header h2 {
  margin: 0;
  color: #fff;
  font-size: 1.15rem;
}

.component-api-header small {
  display: block;
  margin-top: 7px;
  color: rgba(226, 232, 240, 0.58);
  font-size: 0.69rem;
  line-height: 1.55;
}

.component-api-header > span {
  padding: 7px 10px;
  border: 1px solid rgba(255, 215, 80, 0.17);
  border-radius: 999px;
  color: rgba(255, 232, 156, 0.76);
  background: rgba(255, 215, 80, 0.075);
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.07em;
  white-space: nowrap;
}

.component-api-table-wrap {
  overflow-x: auto;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 13px;
}

.component-api-table {
  min-width: 890px;
  --vxe-ui-font-family: Inter, "Microsoft YaHei", sans-serif;
  --vxe-ui-font-size-small: 13px;
  --vxe-ui-font-color: rgba(226, 232, 240, 0.78);
  --vxe-ui-font-primary-color: #ffd750;
  --vxe-ui-layout-background-color: rgba(5, 14, 10, 0.64);
  --vxe-ui-table-header-font-color: #fff;
  --vxe-ui-table-header-background-color: rgba(255, 255, 255, 0.045);
  --vxe-ui-table-border-color: rgba(255, 255, 255, 0.08);
  --vxe-ui-table-row-hover-background-color: rgba(255, 215, 80, 0.055);
  --vxe-ui-table-row-height-small: 46px;
  --vxe-ui-table-cell-padding-small: 9px;
}

:deep(.vxe-table--render-default),
:deep(.vxe-table--body-wrapper),
:deep(.vxe-table--header-wrapper) { background: transparent; }

:deep(.vxe-header--column .vxe-cell) {
  font-size: 0.69rem;
  font-weight: 800;
  letter-spacing: 0.045em;
}

:deep(.vxe-body--column .vxe-cell) {
  line-height: 1.65;
  white-space: normal;
  word-break: break-word;
}

code {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 10px;
  color: #ffe08a;
  background: rgba(255, 255, 255, 0.08);
  font: 0.76rem/1.45 "Cascadia Code", Consolas, monospace;
}

@media (max-width: 640px) {
  .component-api-card { padding: 13px; }
  .component-api-header { align-items: flex-start; }
  .component-api-header > span { white-space: normal; text-align: right; }
}
</style>
