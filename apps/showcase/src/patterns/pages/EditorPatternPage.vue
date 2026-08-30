<script setup lang="ts">
import { computed, ref, shallowRef } from 'vue'
import {
  CalendarDate,
  DlBadge,
  DlButton,
  DlCard,
  DlColorSwatchPicker,
  DlDatePicker,
  DlDataTable,
  DlDialog,
  DlInputText,
  DlLabel,
  DlMenubar,
  DlMdx,
  DlProgress,
  DlSelect,
  DlSplitter,
  DlTagsInput,
  DlTextarea,
  DlToggle,
  DlToolbar,
  DlToolbarMenu,
  DlTree,
  DlTreeMenu,
  type DlDataTableColumn,
  type DlMenuItem,
  type DlMenuGroup,
  type DlSelectOption,
  type DlSplitterPanel,
  type DlTreeNode,
  type DlTreeMenuItem,
} from '@dragon-liquid/vue'
import { useArchiveDemo } from '../useArchiveDemo'

const { selectedItem, updateItem, notify } = useArchiveDemo()
const title = ref(selectedItem.value.title)
const summary = ref(selectedItem.value.summary)
const tags = ref([...selectedItem.value.tags])
const status = ref(selectedItem.value.status)
const accent = ref(selectedItem.value.accent)
const publishDate = shallowRef(new CalendarDate(2026, 8, 5))
const mdxMode = ref<'edit' | 'split' | 'preview'>('split')
const documentSource = ref(`# ${selectedItem.value.title}\n\n> 一份由 Dragon Liquid 工作台维护的收藏笔记。\n\n## 观看印象\n\n${selectedItem.value.summary}\n\n- [x] 建立收藏记录\n- [x] 补充标签与评分\n- [ ] 完成长评\n\n::Callout{tone="accent" title="编辑提示"}`)
const selectedSection = ref<DlTreeNode>()
const expanded = ref(['document'])
const routeExpanded = ref(['project', 'notes'])
const selectedRoute = ref('impression-page')
const publishOpen = ref(false)
const saving = ref(false)
const saveProgress = ref(0)
const selectedChanges = ref<(string | number)[]>([2])

const panels: DlSplitterPanel[] = [
  { id: 'outline', defaultSize: 20, minSize: 14, maxSize: 30, collapsible: true },
  { id: 'document', defaultSize: 52, minSize: 36 },
  { id: 'metadata', defaultSize: 28, minSize: 22, maxSize: 38, collapsible: true },
]
const outline: DlTreeNode[] = [
  { id: 'document', label: '收藏文档', children: [
    { id: 'impression', label: '观看印象' },
    { id: 'characters', label: '人物记录' },
    { id: 'production', label: '制作资料' },
  ] },
  { id: 'metadata', label: '条目资料', children: [
    { id: 'classification', label: '分类与标签' },
    { id: 'release', label: '发布设置' },
  ] },
]
const projectRoutes: DlTreeMenuItem[] = [
  { id: 'project', label: '收藏网站', description: '/', icon: 'A', children: [
    { id: 'notes', label: '笔记页面', description: '/notes', children: [
      { id: 'impression-page', label: '观看印象', description: '/notes/impression', keywords: ['review', '长评'], trailing: 'MDX' },
      { id: 'production-page', label: '制作资料', description: '/notes/production', keywords: ['staff'], trailing: 'MDX' },
    ] },
  ] },
]
const toolbarItems: DlMenuItem[] = [
  { value: 'save', label: '保存', shortcut: 'Ctrl+S' },
  { value: 'preview', label: '预览', shortcut: 'Ctrl+P' },
  { value: 'separator', label: '', separator: true },
  { value: 'publish', label: '发布' },
]
const menus: DlMenuGroup[] = [
  { value: 'file', label: '文件', items: [
    { value: 'save', label: '保存草稿', shortcut: 'Ctrl+S' },
    { value: 'publish', label: '检查并发布' },
  ] },
  { value: 'view', label: '视图', items: [
    { value: 'preview', label: '切换预览', shortcut: 'Ctrl+P' },
  ] },
]
const statusOptions: DlSelectOption[] = [
  { value: 'watching', label: '追看中' },
  { value: 'completed', label: '已完成' },
  { value: 'planned', label: '想看' },
  { value: 'paused', label: '搁置' },
]
const themeColors = ['#9ad6bf', '#e4b76a', '#8fb9e8', '#ef9fbd', '#78c59e', '#c9a9e8']
const changeColumns: DlDataTableColumn[] = [
  { type: 'checkbox', width: 44 },
  { field: 'document', title: '文档', minWidth: 180 },
  { field: 'status', title: '状态', width: 100 },
  { field: 'updatedAt', title: '更新', width: 100 },
]
const changeRows = [
  { id: 1, document: '观看印象', status: '已保存', updatedAt: '刚刚' },
  { id: 2, document: '人物记录', status: '待校对', updatedAt: '2 分钟前' },
  { id: 3, document: '制作资料', status: '草稿', updatedAt: '昨天' },
]
const dirty = computed(() => title.value !== selectedItem.value.title || summary.value !== selectedItem.value.summary || documentSource.value.length > 0)
const previewOnly = computed({
  get: () => mdxMode.value === 'preview',
  set: value => { mdxMode.value = value ? 'preview' : 'split' },
})

function runToolbar(action: string) {
  if (action === 'save') saveDraft()
  if (action === 'preview') mdxMode.value = mdxMode.value === 'preview' ? 'split' : 'preview'
  if (action === 'publish') publishOpen.value = true
}

function saveDraft() {
  saving.value = true
  saveProgress.value = 28
  window.setTimeout(() => { saveProgress.value = 72 }, 180)
  window.setTimeout(() => {
    updateItem(selectedItem.value.id, {
      title: title.value,
      summary: summary.value,
      tags: tags.value,
      status: status.value,
      accent: accent.value,
      updatedAt: '刚刚',
    })
    saveProgress.value = 100
    saving.value = false
    notify('草稿已保存', '列表、详情与编辑器已经同步更新。')
  }, 520)
}

function publish() {
  publishOpen.value = false
  saveDraft()
  notify('发布任务已创建', '后台任务完成后会通过 Toast 给出结果。', 'accent')
}
</script>

<template>
  <section class="pattern-view editor-page">
    <div class="demo-page-heading editor-heading">
      <div><small>EDIT · VALIDATE · COMMIT</small><h1>内容编辑工作台</h1><p>页面状态由 v-model 管理，工具命令负责聚焦、切换与提交。</p></div>
      <div class="demo-heading-actions"><DlBadge :tone="dirty ? 'warning' : 'success'">{{ dirty ? 'UNSAVED' : 'SAVED' }}</DlBadge><DlMenubar :menus="menus" @select="runToolbar" /><DlToolbar :items="toolbarItems" @action="runToolbar" /></div>
    </div>

    <div v-if="saving" class="editor-saving"><DlProgress :model-value="saveProgress" show-value label="正在保存本地草稿" tone="accent" /></div>

    <div class="editor-workspace">
      <DlSplitter :panels="panels">
        <template #panel-outline>
          <aside class="editor-panel outline-panel">
            <header><small>DOCUMENT OUTLINE</small><b>内容结构</b></header>
            <DlTreeMenu v-model="selectedRoute" v-model:expanded="routeExpanded" :items="projectRoutes" label="项目路由" search-placeholder="检索页面或路径" />
            <DlTree v-model="selectedSection" v-model:expanded="expanded" :items="outline" />
            <DlCard padding="md"><small>工作台原则</small><p>树负责导航，工具栏负责命令，编辑器负责内容，右侧面板负责持久属性。</p></DlCard>
          </aside>
        </template>
        <template #panel-document>
          <main class="editor-panel document-panel">
            <DlToolbarMenu :menus="menus" @select="runToolbar" />
            <DlMdx v-model="documentSource" v-model:mode="mdxMode" min-height="36rem" aria-label="收藏笔记" />
          </main>
        </template>
        <template #panel-metadata>
          <aside class="editor-panel metadata-panel">
            <header><small>INSPECTOR</small><b>条目属性</b></header>
            <div class="form-field"><DlLabel for="archive-title">显示标题</DlLabel><DlInputText id="archive-title" v-model="title" /></div>
            <div class="form-field"><DlLabel for="archive-summary">内容简介</DlLabel><DlTextarea id="archive-summary" v-model="summary" /></div>
            <div class="form-field"><DlLabel>分类标签</DlLabel><DlTagsInput v-model="tags" :max="8" /></div>
            <div class="form-field"><DlLabel>观看状态</DlLabel><DlSelect v-model="status" :options="statusOptions" /></div>
            <div class="form-field"><DlLabel>主题色</DlLabel><DlColorSwatchPicker v-model="accent" :colors="themeColors" /></div>
            <div class="form-field"><DlLabel>计划发布日期</DlLabel><DlDatePicker v-model="publishDate" /></div>
            <DlToggle v-model="previewOnly" aria-label="预览模式">只看预览</DlToggle>
          </aside>
        </template>
      </DlSplitter>
    </div>

    <DlCard padding="md" class="editor-change-table">
      <header><span><small>DOCUMENT CHANGES</small><b>最近文档记录</b></span><DlBadge tone="muted">已选择 {{ selectedChanges.length }} 项</DlBadge></header>
      <DlDataTable v-model:selected-keys="selectedChanges" :rows="changeRows" :columns="changeColumns" row-key="id" max-height="260" />
    </DlCard>

    <div class="editor-footer"><span>所有数据只存在于当前浏览器内存，不会发送到服务器。</span><div><a href="/patterns/detail"><DlButton variant="secondary">返回详情</DlButton></a><DlButton variant="primary" :loading="saving" @click="publishOpen = true">检查并发布</DlButton></div></div>

    <DlDialog v-model:open="publishOpen" title="发布收藏文档" description="确认标题、标签和预览内容后，将执行同一套保存命令。" tone="accent">
      <div class="publish-summary"><span><small>标题</small><b>{{ title }}</b></span><span><small>标签</small><b>{{ tags.join(' · ') }}</b></span><span><small>发布日期</small><b>{{ publishDate.toString() }}</b></span></div>
      <template #footer><DlButton variant="secondary" @click="publishOpen = false">继续编辑</DlButton><DlButton variant="primary" @click="publish">确认发布</DlButton></template>
    </DlDialog>
  </section>
</template>
