<script setup lang="ts">
import { computed, ref } from 'vue'
import { DlButton, DlDrawer, DlInput, DlSelect, DlSwitch, DlTree, type DlSelectOption, type DlTone, type DlTreeNode } from '@dragon-liquid/vue'
import type { ComponentDefinition } from '../catalog'
import { componentGuidanceFor } from '../componentGuidance'
import DocExampleShell from '../components/DocExampleShell.vue'
import { vueSfc } from './exampleCode'

const props = defineProps<{ scenario: string; componentDefinition: ComponentDefinition }>()
const drawerOpen = ref(false)
const placement = ref<'right' | 'bottom' | 'left'>('right')
const drawerTone = ref<DlTone>('default')
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
const toneOptions: { value: DlTone; label: string; description: string }[] = [
  { value: 'default', label: 'Default 默认', description: '普通信息与基础任务' },
  { value: 'accent', label: 'Accent 强调', description: '品牌重点与当前任务' },
  { value: 'success', label: 'Success 成功', description: '已经正确完成的结果' },
  { value: 'warning', label: 'Warning 警告', description: '可恢复且需要留意的问题' },
  { value: 'danger', label: 'Danger 危险', description: '失败或不可逆操作' },
  { value: 'muted', label: 'Muted 弱化', description: '低优先级与只读信息' },
]
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
  'tone-gallery': vueSfc({ imports: ['DlButton', 'DlDrawer', 'type DlTone'], script: `import { ref } from 'vue'

const open = ref(false)
const activeTone = ref<DlTone>('default')
const tones: { value: DlTone; label: string }[] = [
  { value: 'default', label: 'Default 默认' },
  { value: 'accent', label: 'Accent 强调' },
  { value: 'success', label: 'Success 成功' },
  { value: 'warning', label: 'Warning 警告' },
  { value: 'danger', label: 'Danger 危险' },
  { value: 'muted', label: 'Muted 弱化' },
]

function showTone(tone: DlTone) {
  activeTone.value = tone
  open.value = true
}`, template: `  <div class="tone-actions">
    <DlButton v-for="item in tones" :key="item.value" variant="secondary" @click="showTone(item.value)">
      {{ item.label }}
    </DlButton>
  </div>
  <DlDrawer
    v-model:open="open"
    :title="activeTone + ' 色调抽屉'"
    description="比较边框、侧边炫彩条与环境光。"
    :tone="activeTone"
    placement="right"
  >
    <p>当前 Drawer 正在展示 <code>{{ activeTone }}</code> 的完整视觉。</p>
    <template #footer><DlButton @click="open = false">关闭预览</DlButton></template>
  </DlDrawer>`, style: `.tone-actions { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }` }),
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
  'import-success': vueSfc({ imports: ['DlBadge', 'DlButton', 'DlDrawer'], script: `import { ref } from 'vue'\n\nconst open = ref(false)`, template: `  <DlButton @click="open = true">查看导入结果</DlButton>
  <DlDrawer
    v-model:open="open"
    title="导入已经完成"
    description="本地媒体资料已合并到收藏库。"
    placement="right"
    tone="success"
  >
    <div class="result-card">
      <DlBadge tone="success">全部完成</DlBadge>
      <strong>新增 24 部作品</strong>
      <p>另有 3 条重复记录已自动跳过，没有覆盖原有笔记。</p>
    </div>
    <template #footer>
      <DlButton variant="ghost" @click="open = false">关闭</DlButton>
      <DlButton @click="open = false">查看新增作品</DlButton>
    </template>
  </DlDrawer>`, style: `.result-card { display: grid; gap: 12px; }
.result-card p { margin: 0; color: #a9b9b0; line-height: 1.7; }` }),
  'sync-warning': vueSfc({ imports: ['DlButton', 'DlDrawer'], script: `import { ref } from 'vue'\n\nconst open = ref(false)`, template: `  <DlButton variant="secondary" @click="open = true">处理同步冲突</DlButton>
  <DlDrawer
    v-model:open="open"
    title="发现 2 条同步冲突"
    description="远程记录与本地编辑时间接近，需要选择保留方式。"
    placement="right"
    tone="warning"
  >
    <div class="conflict-card">
      <strong>来自深渊 · 观看进度</strong>
      <p>本地：第 8 集 · 10 分钟前</p>
      <p>远程：第 9 集 · 12 分钟前</p>
    </div>
    <template #footer>
      <DlButton variant="ghost" @click="open = false">稍后处理</DlButton>
      <DlButton @click="open = false">保留远程进度</DlButton>
    </template>
  </DlDrawer>`, style: `.conflict-card { display: grid; gap: 8px; padding: 16px; border: 1px solid rgba(255, 179, 71, .22); border-radius: 16px; }
.conflict-card p { margin: 0; color: #a9b9b0; }` }),
  'danger-zone': vueSfc({ imports: ['DlButton', 'DlDrawer'], script: `import { ref } from 'vue'\n\nconst open = ref(false)\n\nfunction clearHistory() {\n  open.value = false\n}`, template: `  <DlButton variant="danger" @click="open = true">打开危险区域</DlButton>
  <DlDrawer
    v-model:open="open"
    title="清空观看历史"
    description="此操作会影响收藏库中的全部作品。"
    placement="right"
    tone="danger"
  >
    <div class="danger-card">
      <strong>将永久删除 428 条观看记录</strong>
      <p>收藏作品和个人标签会保留，但删除后的进度无法恢复。</p>
    </div>
    <template #footer>
      <DlButton variant="secondary" @click="open = false">取消</DlButton>
      <DlButton variant="danger" @click="clearHistory">确认清空历史</DlButton>
    </template>
  </DlDrawer>`, style: `.danger-card { display: grid; gap: 10px; padding: 16px; border: 1px solid rgba(255, 123, 123, .22); border-radius: 16px; }
.danger-card p { margin: 0; color: #a9b9b0; line-height: 1.7; }` }),
  'collection-filter': vueSfc({ imports: ['DlButton', 'DlDrawer', 'DlSelect', 'DlSwitch', 'type DlSelectOption'], script: `import { ref } from 'vue'\n\nconst open = ref(false)\nconst status = ref('all')\nconst onlyUnwatched = ref(false)\nconst options: DlSelectOption[] = [\n  { value: 'all', label: '全部状态' },\n  { value: 'watching', label: '正在观看' },\n  { value: 'completed', label: '已经看完' },\n]`, template: `  <DlButton @click="open = true">筛选收藏库</DlButton>
  <DlDrawer v-model:open="open" title="筛选收藏库" description="适合窄屏操作的低优先级辅助面板" placement="bottom" size="md" tone="muted">
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
  description: componentGuidanceFor(props.componentDefinition.id).example,
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
      <template v-else-if="scenario === 'tone-gallery'">
        <div class="drawer-tone-grid"><button v-for="item in toneOptions" :key="item.value" type="button" @click="drawerTone = item.value; drawerOpen = true"><b>{{ item.label }}</b><span>{{ item.description }}</span></button></div>
        <DlDrawer v-model:open="drawerOpen" :title="drawerTone + ' 色调抽屉'" description="比较边框、侧边炫彩条与环境光。" :tone="drawerTone" placement="right"><p>当前 Drawer 正在展示 <code>{{ drawerTone }}</code> 的完整视觉。</p><template #footer><DlButton @click="drawerOpen = false">关闭预览</DlButton></template></DlDrawer>
      </template>
      <template v-else-if="scenario === 'edit-record'">
        <DlButton @click="drawerOpen = true">编辑收藏</DlButton>
        <DlDrawer v-model:open="drawerOpen" title="编辑收藏" description="修改作品标题与观看状态" placement="right" size="sm" tone="accent"><form class="drawer-form" @submit.prevent="drawerOpen = false"><label><span>作品标题</span><DlInput v-model="title" /></label><label><span>观看状态</span><DlSelect v-model="status" :options="statusOptions" /></label></form><template #footer><DlButton variant="ghost" @click="drawerOpen = false">取消</DlButton><DlButton @click="drawerOpen = false">保存修改</DlButton></template></DlDrawer>
      </template>
      <template v-else-if="scenario === 'import-success'">
        <DlButton @click="drawerOpen = true">查看导入结果</DlButton>
        <DlDrawer v-model:open="drawerOpen" title="导入已经完成" description="本地媒体资料已合并到收藏库。" placement="right" tone="success"><div class="drawer-state-card"><strong>新增 24 部作品</strong><p>另有 3 条重复记录已自动跳过，没有覆盖原有笔记。</p></div><template #footer><DlButton variant="ghost" @click="drawerOpen = false">关闭</DlButton><DlButton @click="drawerOpen = false">查看新增作品</DlButton></template></DlDrawer>
      </template>
      <template v-else-if="scenario === 'sync-warning'">
        <DlButton variant="secondary" @click="drawerOpen = true">处理同步冲突</DlButton>
        <DlDrawer v-model:open="drawerOpen" title="发现 2 条同步冲突" description="远程记录与本地编辑时间接近，需要选择保留方式。" placement="right" tone="warning"><div class="drawer-state-card"><strong>来自深渊 · 观看进度</strong><p>本地：第 8 集 · 10 分钟前</p><p>远程：第 9 集 · 12 分钟前</p></div><template #footer><DlButton variant="ghost" @click="drawerOpen = false">稍后处理</DlButton><DlButton @click="drawerOpen = false">保留远程进度</DlButton></template></DlDrawer>
      </template>
      <template v-else-if="scenario === 'danger-zone'">
        <DlButton variant="danger" @click="drawerOpen = true">打开危险区域</DlButton>
        <DlDrawer v-model:open="drawerOpen" title="清空观看历史" description="此操作会影响收藏库中的全部作品。" placement="right" tone="danger"><div class="drawer-state-card"><strong>将永久删除 428 条观看记录</strong><p>收藏作品和个人标签会保留，但删除后的进度无法恢复。</p></div><template #footer><DlButton variant="secondary" @click="drawerOpen = false">取消</DlButton><DlButton variant="danger" @click="drawerOpen = false">确认清空历史</DlButton></template></DlDrawer>
      </template>
      <template v-else>
        <DlButton @click="drawerOpen = true">筛选收藏库</DlButton>
        <DlDrawer v-model:open="drawerOpen" title="筛选收藏库" description="适合窄屏操作的低优先级辅助面板" placement="bottom" size="md" tone="muted"><div class="filter-form"><label><span>观看状态</span><DlSelect v-model="filterStatus" :options="filterOptions" /></label><div class="switch-row"><span><b>仅显示未看剧集</b><small>隐藏已完成的单集</small></span><DlSwitch v-model="onlyUnwatched" /></div></div><template #footer><DlButton variant="ghost" @click="filterStatus = 'all'; onlyUnwatched = false">重置</DlButton><DlButton @click="drawerOpen = false">查看结果</DlButton></template></DlDrawer>
      </template>
    </template>
    <DlTree v-else v-model="selected" v-model:expanded="expanded" :items="nodes" />
  </div></DocExampleShell>
</template>

<style scoped>
.alpha-general-demo { width: min(100%, 680px); margin: 0 auto; padding: 1rem; color: var(--dl-text-muted); }
.drawer-actions { display: flex; flex-wrap: wrap; gap: 10px; }
.drawer-tone-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; width: 100%; }
.drawer-tone-grid button { display: grid; gap: 5px; padding: 14px; border: 1px solid var(--dl-border); border-radius: var(--dl-radius-md); background: rgba(255,255,255,.06); color: var(--dl-text); text-align: left; cursor: pointer; }
.drawer-tone-grid button:hover { border-color: var(--dl-border-strong); background: rgba(255,255,255,.1); }
.drawer-tone-grid span { color: var(--dl-text-muted); font-size: .78rem; }
.drawer-form, .drawer-form label, .filter-form, .filter-form label { display: grid; gap: 12px; }
.drawer-state-card { display: grid; gap: 10px; padding: 16px; border: 1px solid var(--dl-border); border-radius: var(--dl-radius-md); }
.drawer-state-card p { margin: 0; color: var(--dl-text-muted); line-height: 1.7; }
.switch-row { display: flex; align-items: center; justify-content: space-between; gap: 20px; }
.switch-row b, .switch-row small { display: block; }.switch-row small { margin-top: 5px; color: var(--dl-text-faint); }
@media (max-width: 560px) { .drawer-tone-grid { grid-template-columns: 1fr; } }
</style>
