<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  DlBadge,
  DlButton,
  DlCard,
  DlInput,
  DlPagination,
  DlProgress,
  DlSelect,
  DlToggleGroup,
  type DlChoiceOption,
  type DlSelectOption,
  type DlTone,
} from '@dragon-liquid/vue'
import { VxeColumn, VxeTable } from 'vxe-table'
import 'vxe-pc-ui/es/style.css'
import 'vxe-table/es/style.css'
import { componentCatalog, componentCategories, componentRoute } from '../../catalog'
import { componentHomes, componentUsageLocations, scenarioCoverage } from '../pattern.coverage'
import { patternPages } from '../pattern.catalog'

const query = ref('')
const category = ref('all')
const maturity = ref('all')
const demoPage = ref('all')
const listPage = ref(1)
const pageSize = 12
const treeTable = ref<{ setAllTreeExpand: (expanded: boolean) => unknown } | null>(null)
const treeConfig = { childrenField: 'children', rowField: 'key', trigger: 'cell' as const }
const columnConfig = { resizable: true }
const rowConfig = { keyField: 'key', isHover: true }

const categoryOptions: DlSelectOption[] = [
  { value: 'all', label: '全部分类' },
  ...componentCategories.map(item => ({ value: item.id, label: item.label, description: item.summary })),
]
const maturityOptions: DlChoiceOption[] = [
  { value: 'all', label: '全部' },
  { value: 'custom', label: '自研' },
  { value: 'stable', label: '稳定' },
  { value: 'alpha', label: 'Alpha' },
]
const demoPageOptions: DlSelectOption[] = [
  { value: 'all', label: '全部业务演示' },
  ...patternPages
    .filter(item => item.id !== 'coverage')
    .map(item => ({ value: item.id, label: item.label, description: item.description })),
]
const pageById = new Map(patternPages.map(item => [item.id, item]))
const categoryById = new Map(componentCategories.map(item => [item.id, item.label]))

const rows = componentCatalog.flatMap(component => {
  const scenarioPages = scenarioCoverage(component)
  return component.scenarios.map(scenario => {
    const pageId = scenarioPages.find(item => item.scenarioId === scenario.id)?.pageId ?? componentHomes[component.id]
    return {
      key: `${component.id}/${scenario.id}`,
      component,
      scenario,
      page: pageById.get(pageId) ?? patternPages[0],
      usage: componentUsageLocations[component.id],
    }
  })
})

const filtered = computed(() => {
  const keyword = query.value.trim().toLocaleLowerCase()
  return rows.filter(row => {
    const matchesText = !keyword || [
      row.component.id,
      row.component.name,
      row.component.summary,
      row.scenario.label,
      row.scenario.summary,
      row.page.label,
      row.page.description,
      row.usage,
    ].some(value => value.toLocaleLowerCase().includes(keyword))

    return matchesText
      && (category.value === 'all' || row.component.category === category.value)
      && (maturity.value === 'all' || row.component.maturity === maturity.value)
      && (demoPage.value === 'all' || row.page.id === demoPage.value)
  })
})
const filteredTree = computed(() => componentCatalog.flatMap(component => {
  const children = filtered.value
    .filter(row => row.component.id === component.id)
    .map(row => ({ ...row, kind: 'scenario' as const }))

  if (!children.length) return []
  const pageLabels = [...new Set(children.map(row => row.page.label))]
  return [{
    key: `component:${component.id}`,
    kind: 'component' as const,
    component,
    usage: componentUsageLocations[component.id],
    pageSummary: pageLabels.join(' · '),
    children,
  }]
}))
const visible = computed(() => filteredTree.value.slice((listPage.value - 1) * pageSize, listPage.value * pageSize))
const filteredComponentCount = computed(() => filteredTree.value.length)
const visibleScenarioCount = computed(() => visible.value.reduce((total, row) => total + row.children.length, 0))

watch([query, category, maturity, demoPage], () => { listPage.value = 1 })

function resetFilters() {
  query.value = ''
  category.value = 'all'
  maturity.value = 'all'
  demoPage.value = 'all'
}

function maturityTone(value: string): DlTone {
  if (value === 'alpha') return 'warning'
  if (value === 'custom') return 'accent'
  return 'success'
}

function setAllTreeExpand(expanded: boolean) {
  treeTable.value?.setAllTreeExpand(expanded)
}

function treeRowClassName({ row }: { row: { kind: string } }) {
  return row.kind === 'component' ? 'coverage-tree-parent-row' : 'coverage-tree-scenario-row'
}
</script>

<template>
  <section class="pattern-view coverage-page">
    <div class="demo-page-heading">
      <div>
        <small>COVERAGE · TRACEABILITY · SOURCE</small>
        <h1>控件示例详细清单</h1>
        <p>逐行列出每个控件场景、业务演示位置，以及对应的完整代码与 API 入口。</p>
      </div>
      <DlBadge tone="success" variant="outline">{{ componentCatalog.length }} COMPONENTS · {{ rows.length }} SCENARIOS</DlBadge>
    </div>

    <div class="coverage-metrics">
      <DlCard padding="md"><small>公开控件</small><b>{{ componentCatalog.length }}</b><span>稳定版、自研与 Alpha 全部包含</span></DlCard>
      <DlCard padding="md"><small>场景明细</small><b>{{ rows.length }}</b><span>一个场景对应清单中的独立一行</span></DlCard>
      <DlCard padding="md"><small>当前结果</small><b>{{ filtered.length }}</b><span>来自 {{ filteredComponentCount }} 个控件</span></DlCard>
      <DlCard padding="md"><small>覆盖状态</small><b>100%</b><DlProgress :model-value="100" tone="success" size="sm" /></DlCard>
    </div>

    <DlCard class="coverage-toolbar" padding="md">
      <DlInput v-model="query" placeholder="搜索控件、场景、业务页或用途">
        <template #leading>⌕</template>
        <template #trailing><kbd>/</kbd></template>
      </DlInput>
      <DlSelect v-model="category" :options="categoryOptions" />
      <DlSelect v-model="demoPage" :options="demoPageOptions" />
      <DlToggleGroup v-model="maturity" type="single" :items="maturityOptions" />
      <DlButton variant="secondary" @click="resetFilters">重置</DlButton>
    </DlCard>

    <DlCard v-if="visible.length" class="coverage-list-card" padding="none">
      <header class="coverage-list-heading">
        <div><small>COMPONENT → SCENARIO → APPLICATION</small><h2>控件与示例位置</h2></div>
        <div class="coverage-tree-actions">
          <span>展开控件后查看它的全部场景、实景位置和完整源码。</span>
          <DlButton variant="secondary" size="sm" @click="setAllTreeExpand(true)">展开本页</DlButton>
          <DlButton variant="secondary" size="sm" @click="setAllTreeExpand(false)">折叠本页</DlButton>
        </div>
      </header>

      <div class="coverage-table-wrap">
        <VxeTable
          ref="treeTable"
          class="coverage-tree-table"
          :data="visible"
          :tree-config="treeConfig"
          :column-config="columnConfig"
          :row-config="rowConfig"
          :row-class-name="treeRowClassName"
          :show-overflow="false"
          border="inner"
          size="small"
          auto-resize
        >
          <VxeColumn field="component.name" title="控件 / 场景" tree-node min-width="330">
            <template #default="{ row }">
              <div v-if="row.kind === 'component'" class="coverage-tree-component">
                <strong>{{ row.component.name }}</strong>
                <span>{{ row.component.summary }}</span>
              </div>
              <div v-else class="coverage-tree-scenario">
                <strong>{{ row.scenario.label }}</strong>
                <code>{{ row.scenario.id }}</code>
              </div>
            </template>
          </VxeColumn>
          <VxeColumn title="分类与状态" width="155">
            <template #default="{ row }">
              <div v-if="row.kind === 'component'" class="coverage-tree-meta">
                <span>{{ categoryById.get(row.component.category) }} · {{ row.component.since }}</span>
                <DlBadge :tone="maturityTone(row.component.maturity)" variant="outline" size="sm">{{ row.component.maturity }}</DlBadge>
              </div>
              <span v-else class="coverage-tree-child-mark">SCENARIO</span>
            </template>
          </VxeColumn>
          <VxeColumn title="可以在哪个业务示例找到" min-width="260">
            <template #default="{ row }">
              <div v-if="row.kind === 'component'" class="coverage-tree-summary">
                <strong>{{ row.children.length }} 个场景</strong>
                <span>{{ row.pageSummary }}</span>
              </div>
              <a v-else :href="`${row.page.href}?guide=${row.component.id}`" class="coverage-tree-page-link">
                <small>{{ row.page.eyebrow }}</small>
                <strong>{{ row.page.label }} · 指认控件 →</strong>
              </a>
            </template>
          </VxeColumn>
          <VxeColumn title="示例中的位置与用途" min-width="340">
            <template #default="{ row }">
              <div class="coverage-tree-usage">
                <strong v-if="row.kind === 'component'">{{ row.usage }}</strong>
                <template v-else>
                  <strong>{{ row.scenario.summary }}</strong>
                  <span>{{ row.usage }}</span>
                </template>
              </div>
            </template>
          </VxeColumn>
          <VxeColumn title="完整案例与源码" width="210">
            <template #default="{ row }">
              <a
                :href="componentRoute(row.component.id, row.kind === 'component' ? row.component.scenarios[0].id : row.scenario.id)"
                class="coverage-tree-code-link"
              >
                <strong>{{ row.kind === 'component' ? '组件文档与 API' : '打开完整案例' }} →</strong>
                <span>{{ row.kind === 'component' ? '查看全部独立场景' : 'Vue 源码 · Props API' }}</span>
              </a>
            </template>
          </VxeColumn>
        </VxeTable>
      </div>

      <footer class="coverage-list-footer">
        <span>第 {{ listPage }} 页 · {{ visible.length }} 个控件、{{ visibleScenarioCount }} 个场景 · 共 {{ filteredComponentCount }} 个控件</span>
        <DlPagination v-model:page="listPage" :total="filteredComponentCount" :items-per-page="pageSize" />
      </footer>
    </DlCard>

    <DlCard v-else class="coverage-empty" padding="lg">
      <b>没有匹配项</b>
      <p>清除关键词，或者切换分类、成熟度与业务演示页。</p>
      <DlButton variant="primary" @click="resetFilters">查看全部控件场景</DlButton>
    </DlCard>
  </section>
</template>
