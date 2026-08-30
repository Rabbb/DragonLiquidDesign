<script setup lang="ts">
import { computed, ref } from 'vue'
import { DlBadge, DlButton, DlCard, DlDataTable, DlToolbarMenu, type DlDataTableColumn, type DlMenuGroup } from '@dragon-liquid/vue'
import type { ComponentDefinition } from '../catalog'
import DocExampleShell from '../components/DocExampleShell.vue'
import { vueSfc } from './exampleCode'

const props = defineProps<{ scenario: string; componentDefinition: ComponentDefinition }>()
const selected = ref<(string | number)[]>([2])
const lastCommand = ref('尚未执行命令')
const showNotebookRail = ref(false)
const loading = ref(false)
const rows = [
  { id: 1, title: '整理 MDX 日记', status: '进行中', owner: 'Admin' },
  { id: 2, title: '刷新 TODO 快照', status: '待测试', owner: 'Guest' },
  { id: 3, title: '发布组件文档', status: '已完成', owner: 'Admin' },
]
const columns: DlDataTableColumn[] = [
  { role: 'check', width: 44 },
  { property: 'title', label: '需求', minWidth: 220 },
  { property: 'status', label: '状态', width: 110 },
  { property: 'owner', label: '负责人', width: 110 },
]
const menus = computed<DlMenuGroup[]>(() => [
  { value: 'file', label: '文件', items: [{ value: 'new', label: '新建', icon: '＋', shortcut: 'Ctrl+N' }, { value: 'save', label: '保存', icon: '⌘', shortcut: 'Ctrl+S' }] },
  { value: 'view', label: '视图', items: [{ value: 'rail', label: '显示笔记本栏', checkable: true, checked: showNotebookRail.value }, { value: 'separator', label: '', separator: true }, { value: 'import', label: '导入 TODO', children: [{ value: 'today', label: '今日' }, { value: 'week', label: '本周' }] }, { value: 'refresh', label: '刷新', shortcut: 'Ctrl+Alt+R' }, { value: 'locked', label: '仅管理员', disabled: true }] },
])

const tableCode = computed(() => vueSfc({
  imports: ['DlDataTable', 'type DlDataTableColumn'],
  script: `import { ref } from 'vue'

const selected = ref<(string | number)[]>([2])
const rows = [
  { id: 1, title: '整理 MDX 日记', status: '进行中' },
  { id: 2, title: '刷新 TODO 快照', status: '待测试' },
]
const columns: DlDataTableColumn[] = [
  { role: 'check', width: 44 },
  { property: 'title', label: '需求', minWidth: 220 },
  { property: 'status', label: '状态', width: 110 },
]`,
  template: `  <DlDataTable
    v-model:checked-row-keys="selected"
    :rows="rows"
    :columns="columns"
    row-identity="id"
    max-height="360"
  >
    <template #cell-status="{ row }"><strong>{{ row.status }}</strong></template>
  </DlDataTable>`,
}))

const menuCode = computed(() => vueSfc({
  imports: ['DlToolbarMenu', 'type DlMenuGroup'],
  script: `import { computed, ref } from 'vue'

const command = ref('')
const showRail = ref(false)
const menus = computed<DlMenuGroup[]>(() => [{
  value: 'view', label: '视图', items: [
    { value: 'rail', label: '显示笔记本栏', checkable: true, checked: showRail.value },
    { value: 'import', label: '导入', children: [
      { value: 'today', label: '今日' },
      { value: 'week', label: '本周' },
    ] },
  ],
}])
function run(value: string) {
  command.value = value
  if (value === 'rail') showRail.value = !showRail.value
}`,
  template: `  <DlToolbarMenu :menus="menus" @select="run" />
  <output>最后命令：{{ command }}</output>`,
}))

const content = computed(() => props.componentDefinition.id === 'data-table'
  ? {
      title: props.scenario === 'selection' ? '受控批量选择' : props.scenario === 'states' ? '业务单元格与数据状态' : '统一主题的数据工作台表格',
      description: 'DL 用稳定行键、语义化列模型和分组能力配置包装 VXETable，页面不需要继承底层历史属性。',
      code: tableCode.value,
      tips: ['checkedRowKeys 只保存稳定行键，刷新数据后仍可重建选择。', '使用 cell-{property} 插槽呈现状态徽标、按钮或更丰富的业务内容。', 'presentation 管理表头、表尾、合并、样式与溢出；features 管理排序、筛选、编辑、校验、树、虚拟滚动、导入导出等工作流。', '所有状态通过行键传值，实例方法也使用行键而不是泄漏 VXETable 行对象。'],
    }
  : {
      title: props.scenario === 'shortcuts' ? '用户快捷键驱动同一命令' : props.scenario === 'nested' ? '多级桌面应用命令' : '编辑器式文字菜单',
      description: '菜单点击和全局组合键统一派发 select 命令，业务只维护一套处理函数。',
      code: menuCode.value,
      tips: ['checkable + checked 创建受控的 checkbox/toggle 菜单项。', 'children 创建子菜单，separator 与 disabled 保持统一语义。', 'shortcut 是显示和实际绑定的同一数据源。', 'active=false 可在页面被遮挡或停用时暂停快捷键。'],
    })

function flashLoading() {
  loading.value = true
  window.setTimeout(() => { loading.value = false }, 800)
}
</script>

<template>
  <DocExampleShell v-bind="content">
    <DlCard v-if="componentDefinition.id === 'data-table'" padding="lg" class="workbench-demo">
      <header><span><DlBadge tone="accent">THEMED VXE WRAPPER</DlBadge><h3>TODO 快照刷新</h3></span><DlButton variant="ghost" size="sm" @click="flashLoading">模拟加载</DlButton></header>
      <DlDataTable v-model:checked-row-keys="selected" :rows="scenario === 'states' && !loading ? [] : rows" :columns="columns" row-identity="id" :loading="loading" max-height="360" empty-message="当前没有待刷新的记录">
        <template #cell-status="{ row }"><DlBadge :tone="row.status === '已完成' ? 'success' : row.status === '待测试' ? 'warning' : 'accent'">{{ row.status }}</DlBadge></template>
      </DlDataTable>
      <small>已选择：{{ selected.join('、') || '无' }}</small>
    </DlCard>
    <DlCard v-else padding="lg" class="workbench-demo">
      <header><span><DlBadge tone="accent">DESKTOP COMMANDS</DlBadge><h3>MDX 笔记本</h3></span></header>
      <DlToolbarMenu :menus="menus" @select="value => { lastCommand = value; if (value === 'rail') showNotebookRail = !showNotebookRail }" />
      <output>最后命令：{{ lastCommand }}</output>
      <small>笔记本栏：{{ showNotebookRail ? '显示' : '隐藏' }}</small>
    </DlCard>
  </DocExampleShell>
</template>

<style scoped>
.workbench-demo{display:grid;gap:16px;max-width:900px}.workbench-demo>header{display:flex;align-items:center;justify-content:space-between;gap:12px}.workbench-demo>header span{display:grid;gap:7px}.workbench-demo h3{margin:0}.workbench-demo>small,.workbench-demo output{color:var(--dl-text-muted);font-size:.7rem}
</style>
