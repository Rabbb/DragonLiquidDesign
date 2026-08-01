<script setup lang="ts">
import { computed, ref } from 'vue'
import { DlButton, DlDrawer, DlInput, DlSelect, DlSwitch, DlTree, type DlSelectOption, type DlTreeNode } from '@dragon-liquid/vue'
import type { ComponentDefinition } from '../catalog'
import DocExampleShell from '../components/DocExampleShell.vue'
import { vueSfc } from './exampleCode'

const props = defineProps<{ scenario: string; componentDefinition: ComponentDefinition }>()
const drawerOpen = ref(false)
const placement = ref<'right' | 'bottom' | 'left'>('right')
const title = ref('来自深渊')
const status = ref('watching')
const filterStatus = ref('all')
const onlyUnwatched = ref(false)
const statusOptions: DlSelectOption[] = [
  { value: 'planned', label: '计划观看' },
  { value: 'watching', label: '正在观看' },
  { value: 'completed', label: '已经看完' },
]
const filterOptions: DlSelectOption[] = [{ value: 'all', label: '全部状态' }, ...statusOptions]
const expanded = ref(['library'])
const selected = ref<DlTreeNode | DlTreeNode[]>()
const nodes: DlTreeNode[] = [{ id: 'library', label: '动漫收藏', children: [{ id: 'watching', label: '正在观看', description: '12 部作品' }, { id: 'completed', label: '已经看完', description: '86 部作品' }] }, { id: 'settings', label: '系统设置' }]

const drawerCodes: Record<string, string> = {
  basic: vueSfc({ imports: ['DlButton', 'DlDrawer'], script: `import { ref } from 'vue'\n\ntype Placement = 'left' | 'right' | 'bottom'\nconst open = ref(false)\nconst placement = ref<Placement>('right')\n\nfunction show(next: Placement) {\n  placement.value = next\n  open.value = true\n}`, template: `  <div class="actions">
    <DlButton variant="secondary" @click="show('left')">从左侧打开</DlButton>
    <DlButton variant="secondary" @click="show('right')">从右侧打开</DlButton>
    <DlButton variant="secondary" @click="show('bottom')">从底部打开</DlButton>
  </div>
  <DlDrawer v-model:open="open" title="抽屉预览" description="支持方向、尺寸与滑动关闭" :placement="placement" size="sm">
    <p>当前方向：{{ placement }}</p>
    <template #footer><DlButton @click="open = false">完成</DlButton></template>
  </DlDrawer>`, style: `.actions { display: flex; flex-wrap: wrap; gap: 10px; }` }),
  'edit-record': vueSfc({ imports: ['DlButton', 'DlDrawer', 'DlInput', 'DlSelect', 'type DlSelectOption'], script: `import { ref } from 'vue'\n\nconst open = ref(false)\nconst title = ref('来自深渊')\nconst status = ref('watching')\nconst statusOptions: DlSelectOption[] = [\n  { value: 'planned', label: '计划观看' },\n  { value: 'watching', label: '正在观看' },\n  { value: 'completed', label: '已经看完' },\n]`, template: `  <DlButton @click="open = true">编辑收藏</DlButton>
  <DlDrawer v-model:open="open" title="编辑收藏" description="修改作品标题与观看状态" placement="right" size="sm" tone="accent">
    <form class="drawer-form" @submit.prevent="open = false">
      <label><span>作品标题</span><DlInput v-model="title" /></label>
      <label><span>观看状态</span><DlSelect v-model="status" :options="statusOptions" /></label>
    </form>
    <template #footer>
      <DlButton variant="ghost" @click="open = false">取消</DlButton>
      <DlButton @click="open = false">保存修改</DlButton>
    </template>
  </DlDrawer>`, style: `.drawer-form, .drawer-form label { display: grid; gap: 12px; }` }),
  'collection-filter': vueSfc({ imports: ['DlButton', 'DlDrawer', 'DlSelect', 'DlSwitch', 'type DlSelectOption'], script: `import { ref } from 'vue'\n\nconst open = ref(false)\nconst status = ref('all')\nconst onlyUnwatched = ref(false)\nconst options: DlSelectOption[] = [\n  { value: 'all', label: '全部状态' },\n  { value: 'watching', label: '正在观看' },\n  { value: 'completed', label: '已经看完' },\n]`, template: `  <DlButton @click="open = true">筛选收藏库</DlButton>
  <DlDrawer v-model:open="open" title="筛选收藏库" description="适合窄屏操作的底部筛选面板" placement="bottom" size="md">
    <div class="filter-form">
      <label><span>观看状态</span><DlSelect v-model="status" :options="options" /></label>
      <div class="switch-row"><span><b>仅显示未看剧集</b><small>隐藏已完成的单集</small></span><DlSwitch v-model="onlyUnwatched" /></div>
    </div>
    <template #footer>
      <DlButton variant="ghost" @click="status = 'all'; onlyUnwatched = false">重置</DlButton>
      <DlButton @click="open = false">查看结果</DlButton>
    </template>
  </DlDrawer>`, style: `.filter-form, .filter-form label { display: grid; gap: 12px; }
.switch-row { display: flex; align-items: center; justify-content: space-between; gap: 20px; }
.switch-row b, .switch-row small { display: block; }
.switch-row small { margin-top: 5px; color: #a9b9b0; }` }),
}

const treeCode = vueSfc({ imports: ['DlTree', 'type DlTreeNode'], script: `import { ref } from 'vue'\n\nconst expanded = ref(['library'])\nconst selected = ref<DlTreeNode>()\nconst nodes: DlTreeNode[] = [\n  { id: 'library', label: '动漫收藏', children: [\n    { id: 'watching', label: '正在观看' },\n    { id: 'completed', label: '已经看完' },\n  ] },\n]`, template: `  <DlTree v-model="selected" v-model:expanded="expanded" :items="nodes" />` })
const code = computed(() => props.componentDefinition.id === 'drawer' ? drawerCodes[props.scenario] ?? drawerCodes.basic : treeCode)
const content = computed(() => ({
  title: `${props.componentDefinition.name} · ${props.componentDefinition.scenarios.find(item => item.id === props.scenario)?.label ?? 'Alpha 先行体验'}`,
  description: props.componentDefinition.summary,
  code: code.value,
  tips: ['先行组件保留清晰的 Alpha 标记，但每个案例都是可运行实现。', 'Drawer 的页脚固定在独立全宽区域，长内容只在主体区域滚动。'],
}))

function showDrawer(next: 'right' | 'bottom' | 'left') {
  placement.value = next
  drawerOpen.value = true
}
</script>

<template>
  <DocExampleShell v-bind="content"><div class="alpha-general-demo">
    <template v-if="componentDefinition.id === 'drawer'">
      <template v-if="scenario === 'basic'">
        <div class="drawer-actions"><DlButton variant="secondary" @click="showDrawer('left')">从左侧打开</DlButton><DlButton variant="secondary" @click="showDrawer('right')">从右侧打开</DlButton><DlButton variant="secondary" @click="showDrawer('bottom')">从底部打开</DlButton></div>
        <DlDrawer v-model:open="drawerOpen" title="抽屉预览" description="支持方向、尺寸与滑动关闭" :placement="placement" size="sm"><p>当前方向：{{ placement }}</p><template #footer><DlButton @click="drawerOpen = false">完成</DlButton></template></DlDrawer>
      </template>
      <template v-else-if="scenario === 'edit-record'">
        <DlButton @click="drawerOpen = true">编辑收藏</DlButton>
        <DlDrawer v-model:open="drawerOpen" title="编辑收藏" description="修改作品标题与观看状态" placement="right" size="sm" tone="accent"><form class="drawer-form" @submit.prevent="drawerOpen = false"><label><span>作品标题</span><DlInput v-model="title" /></label><label><span>观看状态</span><DlSelect v-model="status" :options="statusOptions" /></label></form><template #footer><DlButton variant="ghost" @click="drawerOpen = false">取消</DlButton><DlButton @click="drawerOpen = false">保存修改</DlButton></template></DlDrawer>
      </template>
      <template v-else>
        <DlButton @click="drawerOpen = true">筛选收藏库</DlButton>
        <DlDrawer v-model:open="drawerOpen" title="筛选收藏库" description="适合窄屏操作的底部筛选面板" placement="bottom" size="md"><div class="filter-form"><label><span>观看状态</span><DlSelect v-model="filterStatus" :options="filterOptions" /></label><div class="switch-row"><span><b>仅显示未看剧集</b><small>隐藏已完成的单集</small></span><DlSwitch v-model="onlyUnwatched" /></div></div><template #footer><DlButton variant="ghost" @click="filterStatus = 'all'; onlyUnwatched = false">重置</DlButton><DlButton @click="drawerOpen = false">查看结果</DlButton></template></DlDrawer>
      </template>
    </template>
    <DlTree v-else v-model="selected" v-model:expanded="expanded" :items="nodes" />
  </div></DocExampleShell>
</template>

<style scoped>
.alpha-general-demo { width: min(100%, 680px); margin: 0 auto; padding: 1rem; color: var(--dl-text-muted); }
.drawer-actions { display: flex; flex-wrap: wrap; gap: 10px; }
.drawer-form, .drawer-form label, .filter-form, .filter-form label { display: grid; gap: 12px; }
.switch-row { display: flex; align-items: center; justify-content: space-between; gap: 20px; }
.switch-row b, .switch-row small { display: block; }.switch-row small { margin-top: 5px; color: var(--dl-text-faint); }
</style>
