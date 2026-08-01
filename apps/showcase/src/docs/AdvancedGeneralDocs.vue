<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  DlAlertDialog, DlAspectRatio, DlButton, DlContextMenu, DlDropdownMenu, DlHoverCard, DlMenubar, DlNavigationMenu,
  DlPagination, DlScrollArea, DlSplitter, DlStepper, DlToast, DlToolbar,
  type DlMenuGroup, type DlMenuItem, type DlNavigationItem, type DlSplitterPanel, type DlStepItem,
} from '@dragon-liquid/vue'
import type { ComponentDefinition } from '../catalog'
import DocExampleShell from '../components/DocExampleShell.vue'
import { vueSfc } from './exampleCode'

const props = defineProps<{ scenario: string; componentDefinition: ComponentDefinition }>()
const alertOpen = ref(false)
const page = ref(4)
const step = ref(2)
const toastOpen = ref(false)
const lastAction = ref('尚未执行操作')
const menuItems: DlMenuItem[] = [
  { value: 'edit', label: '编辑作品', shortcut: 'E' }, { value: 'favorite', label: '加入收藏', shortcut: 'F' },
  { value: 'separator', label: '', separator: true }, { value: 'delete', label: '移除记录' }, { value: 'locked', label: '管理员选项', disabled: true },
]
const menus: DlMenuGroup[] = [
  { value: 'file', label: '文件', items: menuItems },
  { value: 'view', label: '视图', items: [{ value: 'grid', label: '网格视图' }, { value: 'list', label: '列表视图' }] },
]
const navigation: DlNavigationItem[] = [
  { value: 'home', label: '首页', href: '#/' },
  { value: 'library', label: '组件', children: [{ value: 'form', label: '表单组件', description: '输入、选择与校验', href: '#/components/input/basic' }, { value: 'overlay', label: '浮层组件', description: '对话框、菜单和提示', href: '#/components/dialog/basic' }] },
  { value: 'docs', label: '工程文档', href: '#/components/button/basic' },
]
const panels: DlSplitterPanel[] = [{ id: 'outline', defaultSize: 34, minSize: 20 }, { id: 'content', defaultSize: 66, minSize: 30 }]
const steps: DlStepItem[] = [{ step: 1, title: '基础资料', description: '标题与封面' }, { step: 2, title: '分类标签', description: '题材与状态' }, { step: 3, title: '确认发布', description: '检查并保存' }]
const toolbarItems: DlMenuItem[] = [{ value: 'bold', label: '粗体', shortcut: 'B' }, { value: 'italic', label: '斜体', shortcut: 'I' }, { value: 'divider', label: '', separator: true }, { value: 'link', label: '链接' }]
const codeById: Record<string, string> = {
  'alert-dialog': vueSfc({ imports: ['DlAlertDialog', 'DlButton'], script: `import { ref } from 'vue'\n\nconst open = ref(false)`, template: `  <DlButton variant="danger" @click="open = true">移除收藏</DlButton>\n  <DlAlertDialog\n    v-model:open="open"\n    title="移除收藏？"\n    description="观看进度也会一起移除。"\n  />` }),
  'aspect-ratio': vueSfc({ imports: ['DlAspectRatio'], template: `  <DlAspectRatio :ratio="16 / 9">\n    <img src="/cover.webp" alt="作品封面" />\n  </DlAspectRatio>` }),
  'context-menu': vueSfc({ imports: ['DlContextMenu', 'type DlMenuItem'], script: `const items: DlMenuItem[] = [\n  { value: 'edit', label: '编辑作品' },\n  { value: 'favorite', label: '加入收藏' },\n]`, template: `  <DlContextMenu :items="items" @select="console.log">\n    <div class="target">在这里单击右键</div>\n  </DlContextMenu>`, style: `.target { min-height: 160px; display: grid; place-content: center; }` }),
  'dropdown-menu': vueSfc({ imports: ['DlButton', 'DlDropdownMenu', 'type DlMenuItem'], script: `const items: DlMenuItem[] = [\n  { value: 'edit', label: '编辑作品' },\n  { value: 'favorite', label: '加入收藏' },\n]`, template: `  <DlDropdownMenu :items="items">\n    <template #trigger>\n      <DlButton variant="secondary">打开菜单</DlButton>\n    </template>\n  </DlDropdownMenu>` }),
  'hover-card': vueSfc({ imports: ['DlHoverCard'], template: `  <DlHoverCard>\n    <template #trigger><a href="/anime/1">来自深渊</a></template>\n    <b>来自深渊</b>\n    <p>奇幻冒险 · 已收藏</p>\n  </DlHoverCard>` }),
  menubar: vueSfc({ imports: ['DlMenubar', 'type DlMenuGroup'], script: `const menus: DlMenuGroup[] = [\n  { value: 'file', label: '文件', items: [{ value: 'save', label: '保存' }] },\n  { value: 'view', label: '视图', items: [{ value: 'grid', label: '网格' }] },\n]`, template: `  <DlMenubar :menus="menus" />` }),
  'navigation-menu': vueSfc({ imports: ['DlNavigationMenu', 'type DlNavigationItem'], script: `const items: DlNavigationItem[] = [\n  { value: 'home', label: '首页', href: '/' },\n  { value: 'library', label: '收藏库', href: '/library' },\n]`, template: `  <DlNavigationMenu :items="items" />` }),
  pagination: vueSfc({ imports: ['DlPagination'], script: `import { ref } from 'vue'\n\nconst page = ref(4)`, template: `  <DlPagination v-model:page="page" :total="240" :items-per-page="12" />` }),
  'scroll-area': vueSfc({ imports: ['DlScrollArea'], template: `  <DlScrollArea class="episode-list">\n    <div v-for="episode in 24" :key="episode">第 {{ episode }} 集</div>\n  </DlScrollArea>`, style: `.episode-list { height: 260px; }\n.episode-list div { padding: 12px; }` }),
  splitter: vueSfc({ imports: ['DlSplitter', 'type DlSplitterPanel'], script: `const panels: DlSplitterPanel[] = [\n  { id: 'outline', defaultSize: 35 },\n  { id: 'content', defaultSize: 65 },\n]`, template: `  <DlSplitter :panels="panels" class="workspace">\n    <template #panel-outline>目录</template>\n    <template #panel-content>内容</template>\n  </DlSplitter>`, style: `.workspace { height: 260px; }` }),
  stepper: vueSfc({ imports: ['DlStepper', 'type DlStepItem'], script: `import { ref } from 'vue'\n\nconst step = ref(2)\nconst steps: DlStepItem[] = [\n  { step: 1, title: '基础资料' },\n  { step: 2, title: '分类标签' },\n  { step: 3, title: '确认发布' },\n]`, template: `  <DlStepper v-model="step" :items="steps" />` }),
  toast: vueSfc({ imports: ['DlButton', 'DlToast'], script: `import { ref } from 'vue'\n\nconst open = ref(false)`, template: `  <DlButton @click="open = true">保存</DlButton>\n  <DlToast\n    v-model:open="open"\n    title="保存成功"\n    description="作品资料已经更新。"\n    tone="success"\n  />` }),
  toolbar: vueSfc({ imports: ['DlToolbar', 'type DlMenuItem'], script: `const items: DlMenuItem[] = [\n  { value: 'bold', label: '粗体', shortcut: 'B' },\n  { value: 'italic', label: '斜体', shortcut: 'I' },\n]`, template: `  <DlToolbar :items="items" @action="console.log" />` }),
}
const content = computed(() => ({
  title: `${props.componentDefinition.name} · ${props.componentDefinition.scenarios.find(item => item.id === props.scenario)?.label ?? '案例'}`,
  description: props.componentDefinition.summary,
  code: codeById[props.componentDefinition.id] ?? '',
  tips: ['菜单、分页、步骤和可调整面板均支持键盘操作。', '高层数组 API 借鉴 Nuxt UI 的使用方式，底层行为仍由 Reka UI 提供。'],
}))
function selectAction(value: string) { lastAction.value = value }
</script>

<template>
  <DocExampleShell v-bind="content">
    <div class="advanced-general-demo">
      <template v-if="componentDefinition.id === 'alert-dialog'">
        <DlButton variant="danger" @click="alertOpen = true">移除收藏记录</DlButton>
        <DlAlertDialog v-model:open="alertOpen" title="移除收藏记录？" description="观看进度和个人评分也会一起移除，此操作无法撤销。" @confirm="lastAction = '已确认移除'" />
      </template>
      <DlAspectRatio v-else-if="componentDefinition.id === 'aspect-ratio'" :ratio="scenario === 'nested-composition' ? 1 : 16 / 9"><div class="ratio-art"><b>16 : 9</b><span>媒体封面安全区域</span></div></DlAspectRatio>
      <DlContextMenu v-else-if="componentDefinition.id === 'context-menu'" :items="menuItems" label="作品操作" @select="selectAction"><div class="context-target">在这里单击右键<br><small>{{ lastAction }}</small></div></DlContextMenu>
      <DlDropdownMenu v-else-if="componentDefinition.id === 'dropdown-menu'" :items="menuItems" label="作品操作" @select="selectAction"><template #trigger><DlButton variant="secondary">打开操作菜单 ▾</DlButton></template></DlDropdownMenu>
      <DlHoverCard v-else-if="componentDefinition.id === 'hover-card'"><template #trigger><a class="hover-link" href="#/components/avatar/basic">悬停预览《来自深渊》</a></template><b>来自深渊</b><p>奇幻冒险 · 2017 · 已收藏</p></DlHoverCard>
      <DlMenubar v-else-if="componentDefinition.id === 'menubar'" :menus="menus" @select="selectAction" />
      <DlNavigationMenu v-else-if="componentDefinition.id === 'navigation-menu'" :items="navigation" />
      <DlPagination v-else-if="componentDefinition.id === 'pagination'" v-model:page="page" :total="240" :items-per-page="12" />
      <DlScrollArea v-else-if="componentDefinition.id === 'scroll-area'" class="scroll-demo"><div v-for="index in 18" :key="index" class="scroll-row"><b>{{ String(index).padStart(2, '0') }}</b><span>第 {{ index }} 集 · 收藏条目说明</span></div></DlScrollArea>
      <DlSplitter v-else-if="componentDefinition.id === 'splitter'" :panels="panels" class="splitter-demo"><template #panel-outline><div class="split-panel"><b>目录</b><span v-for="index in 5" :key="index">章节 {{ index }}</span></div></template><template #panel-content><div class="split-panel"><b>内容</b><p>拖动中间的把手调整两侧宽度，也可以聚焦把手后使用方向键。</p></div></template></DlSplitter>
      <DlStepper v-else-if="componentDefinition.id === 'stepper'" v-model="step" :items="steps" :orientation="scenario === 'nested-composition' ? 'vertical' : 'horizontal'" />
      <template v-else-if="componentDefinition.id === 'toast'"><DlButton @click="toastOpen = true">显示保存结果</DlButton><DlToast v-model:open="toastOpen" title="保存成功" description="《来自深渊》的资料已经更新。" tone="success" action-label="查看" /></template>
      <DlToolbar v-else :items="toolbarItems" @action="selectAction" />
      <output v-if="!['context-menu', 'scroll-area', 'splitter', 'aspect-ratio'].includes(componentDefinition.id)">当前：{{ componentDefinition.id === 'pagination' ? `第 ${page} 页` : componentDefinition.id === 'stepper' ? `步骤 ${step}` : lastAction }}</output>
    </div>
  </DocExampleShell>
</template>

<style scoped>
.advanced-general-demo { display: grid; gap: 1.2rem; width: min(100%, 760px); margin: 0 auto; padding: 1rem; justify-items: start; }
.advanced-general-demo output { color: var(--dl-text-faint); font-size: .76rem; }
.ratio-art { display: grid; width: 100%; height: 100%; place-content: center; justify-items: center; gap: .4rem; background: radial-gradient(circle at 30% 20%, rgba(255,215,0,.22), transparent 40%), linear-gradient(145deg, #1a472a, #07130d); color: var(--dl-text); }
.ratio-art b { font-size: 2rem; }.ratio-art span { color: var(--dl-text-muted); }
.context-target { width: 100%; min-height: 180px; display: grid; place-content: center; text-align: center; border: 1px dashed var(--dl-border-strong); border-radius: var(--dl-radius-md); color: var(--dl-text-muted); }.context-target small { margin-top: .4rem; color: var(--dl-text-faint); }
.hover-link { color: #fde68a; text-decoration: underline; text-underline-offset: 4px; }.scroll-demo { width: 100%; height: 260px; }.scroll-row { display: flex; gap: 1rem; padding: .75rem 1rem; border-bottom: 1px solid var(--dl-border); color: var(--dl-text-muted); }.scroll-row b { color: #fde68a; }
.splitter-demo { width: 100%; height: 260px; }.split-panel { display: flex; height: 100%; flex-direction: column; gap: .7rem; padding: 1rem; color: var(--dl-text-muted); }.split-panel b { color: var(--dl-text); }
</style>
