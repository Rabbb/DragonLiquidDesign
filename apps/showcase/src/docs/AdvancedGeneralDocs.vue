<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  DlAlertDialog, DlAspectRatio, DlButton, DlContextMenu, DlDropdownMenu, DlHoverCard, DlMenubar, DlNavigationMenu,
  DlPagination, DlProgress, DlScrollArea, DlSplitter, DlStepper, DlToast, DlToolbar,
  type DlMenuGroup, type DlMenuItem, type DlNavigationItem, type DlSplitterPanel, type DlStepItem, type DlTone,
} from '@dragon-liquid/vue'
import type { ComponentDefinition } from '../catalog'
import DocExampleShell from '../components/DocExampleShell.vue'
import { vueSfc } from './exampleCode'

const props = defineProps<{ scenario: string; componentDefinition: ComponentDefinition }>()
const alertOpen = ref(false)
const page = ref(4)
const step = ref(2)
const toastOpen = ref(false)
const toastTone = ref<DlTone>('default')
const toneOptions: { value: DlTone; label: string; description: string }[] = [
  { value: 'default', label: 'Default 默认', description: '普通信息与基础任务' },
  { value: 'accent', label: 'Accent 强调', description: '品牌重点与当前任务' },
  { value: 'success', label: 'Success 成功', description: '已经正确完成的结果' },
  { value: 'warning', label: 'Warning 警告', description: '可恢复且需要留意的问题' },
  { value: 'danger', label: 'Danger 危险', description: '失败或不可逆操作' },
  { value: 'muted', label: 'Muted 弱化', description: '低优先级与只读信息' },
]
const toastToneInfo = computed(() => toneOptions.find(item => item.value === toastTone.value) ?? toneOptions[0])
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

const baseCodeById: Record<string, string> = {
  'alert-dialog': vueSfc({ imports: ['DlAlertDialog', 'DlButton'], script: `import { ref } from 'vue'\n\nconst open = ref(false)`, template: `  <DlButton variant="danger" @click="open = true">移除收藏</DlButton>
  <DlAlertDialog v-model:open="open" title="移除收藏？" description="观看进度也会一起移除。" />` }),
  'aspect-ratio': vueSfc({ imports: ['DlAspectRatio'], template: `  <DlAspectRatio :ratio="16 / 9"><img src="/cover.webp" alt="作品封面" /></DlAspectRatio>` }),
  'context-menu': vueSfc({ imports: ['DlContextMenu', 'type DlMenuItem'], script: `const items: DlMenuItem[] = [\n  { value: 'edit', label: '编辑作品' },\n  { value: 'favorite', label: '加入收藏' },\n]`, template: `  <DlContextMenu :items="items" @select="console.log"><div class="target">在这里单击右键</div></DlContextMenu>`, style: `.target { min-height: 160px; display: grid; place-content: center; }` }),
  'dropdown-menu': vueSfc({ imports: ['DlButton', 'DlDropdownMenu', 'type DlMenuItem'], script: `const items: DlMenuItem[] = [\n  { value: 'edit', label: '编辑作品' },\n  { value: 'favorite', label: '加入收藏' },\n]`, template: `  <DlDropdownMenu :items="items"><template #trigger><DlButton variant="secondary">打开菜单</DlButton></template></DlDropdownMenu>` }),
  menubar: vueSfc({ imports: ['DlMenubar', 'type DlMenuGroup'], script: `const menus: DlMenuGroup[] = [\n  { value: 'file', label: '文件', items: [{ value: 'save', label: '保存' }] },\n  { value: 'view', label: '视图', items: [{ value: 'grid', label: '网格' }] },\n]`, template: `  <DlMenubar :menus="menus" />` }),
  'navigation-menu': vueSfc({ imports: ['DlNavigationMenu', 'type DlNavigationItem'], script: `const items: DlNavigationItem[] = [\n  { value: 'home', label: '首页', href: '/' },\n  { value: 'library', label: '收藏库', href: '/library' },\n]`, template: `  <DlNavigationMenu :items="items" />` }),
  pagination: vueSfc({ imports: ['DlPagination'], script: `import { ref } from 'vue'\n\nconst page = ref(4)`, template: `  <DlPagination v-model:page="page" :total="240" :items-per-page="12" />` }),
  'scroll-area': vueSfc({ imports: ['DlScrollArea'], template: `  <DlScrollArea class="episode-list"><div v-for="episode in 24" :key="episode">第 {{ episode }} 集</div></DlScrollArea>`, style: `.episode-list { height: 260px; }\n.episode-list div { padding: 12px; }` }),
  splitter: vueSfc({ imports: ['DlSplitter', 'type DlSplitterPanel'], script: `const panels: DlSplitterPanel[] = [\n  { id: 'outline', defaultSize: 35 },\n  { id: 'content', defaultSize: 65 },\n]`, template: `  <DlSplitter :panels="panels" class="workspace"><template #panel-outline>目录</template><template #panel-content>内容</template></DlSplitter>`, style: `.workspace { height: 260px; }` }),
  stepper: vueSfc({ imports: ['DlStepper', 'type DlStepItem'], script: `import { ref } from 'vue'\n\nconst step = ref(2)\nconst steps: DlStepItem[] = [\n  { step: 1, title: '基础资料' },\n  { step: 2, title: '分类标签' },\n  { step: 3, title: '确认发布' },\n]`, template: `  <DlStepper v-model="step" :items="steps" />` }),
  toolbar: vueSfc({ imports: ['DlToolbar', 'type DlMenuItem'], script: `const items: DlMenuItem[] = [\n  { value: 'bold', label: '粗体', shortcut: 'B' },\n  { value: 'italic', label: '斜体', shortcut: 'I' },\n]`, template: `  <DlToolbar :items="items" @action="console.log" />` }),
}

const scenarioCodeById: Record<string, Record<string, string>> = {
  'hover-card': {
    basic: vueSfc({ imports: ['DlHoverCard'], template: `  <DlHoverCard :open-delay="220" align="start">
    <template #trigger><a class="preview-link" href="/anime/1">悬停预览《来自深渊》</a></template>
    <article class="anime-preview">
      <div class="cover">深</div>
      <div><b>来自深渊</b><small>Made in Abyss · 2017</small></div>
      <p>在巨大洞穴“阿比斯”边缘展开的奇幻冒险。</p>
      <span>奇幻冒险 · 已收藏</span>
    </article>
  </DlHoverCard>`, style: `.preview-link { color: #fde68a; text-underline-offset: 4px; }
.anime-preview { display: grid; grid-template-columns: 52px 1fr; gap: 10px 12px; }
.cover { grid-row: span 2; display: grid; place-items: center; min-height: 72px; border-radius: 15px; background: #153d2e; color: #ffe08a; }
.anime-preview small, .anime-preview b { display: block; }
.anime-preview p, .anime-preview span { grid-column: 1 / -1; margin: 0; }` }),
    'creator-profile': vueSfc({ imports: ['DlHoverCard'], template: `  <DlHoverCard side="right" :open-delay="180">
    <template #trigger><button class="creator-link">监督：斋藤圭一郎</button></template>
    <section class="creator-card">
      <div class="avatar">斋</div>
      <div><b>斋藤圭一郎</b><small>动画监督</small></div>
      <p>代表作品包含《葬送的芙莉莲》《孤独摇滚！》。</p>
      <a href="/creators/keiichiro-saito">查看 8 部关联作品 →</a>
    </section>
  </DlHoverCard>`, style: `.creator-link { border: 0; background: transparent; color: #fde68a; text-decoration: underline; cursor: pointer; }
.creator-card { display: grid; grid-template-columns: 48px 1fr; gap: 10px 12px; }
.avatar { grid-row: span 2; display: grid; place-items: center; border-radius: 50%; background: #225843; color: #fff0b0; }
.creator-card b, .creator-card small { display: block; }
.creator-card p, .creator-card a { grid-column: 1 / -1; margin: 0; }
.creator-card a { color: #a7f3d0; }` }),
    'episode-progress': vueSfc({ imports: ['DlHoverCard', 'DlProgress'], template: `  <DlHoverCard side="top" align="start">
    <template #trigger><a class="episode-link" href="/episodes/9">第 9 集 · 断头台阿乌拉</a></template>
    <section class="episode-card">
      <header><b>第 9 集</b><span>24:10</span></header>
      <p>芙莉莲一行抵达格拉纳特伯爵领，与魔族使者展开交涉。</p>
      <DlProgress :model-value="72" label="观看进度" size="sm" tone="accent" show-value />
    </section>
  </DlHoverCard>`, style: `.episode-link { color: #fde68a; text-underline-offset: 4px; }
.episode-card { display: grid; gap: 12px; }
.episode-card header { display: flex; justify-content: space-between; }
.episode-card p { margin: 0; color: #b8c7bf; }` }),
  },
  toast: {
    basic: vueSfc({ imports: ['DlButton', 'DlToast'], script: `import { ref } from 'vue'\n\nconst open = ref(false)`, template: `  <DlButton @click="open = true">保存作品资料</DlButton>
  <DlToast v-model:open="open" title="保存成功" description="作品资料已经更新。" tone="success" action-label="查看" />` }),
    'tone-gallery': vueSfc({ imports: ['DlButton', 'DlToast', 'type DlTone'], script: `import { ref } from 'vue'

const open = ref(false)
const activeTone = ref<DlTone>('default')
const tones: { value: DlTone; label: string; description: string }[] = [
  { value: 'default', label: 'Default 默认', description: '普通信息与基础任务' },
  { value: 'accent', label: 'Accent 强调', description: '品牌重点与当前任务' },
  { value: 'success', label: 'Success 成功', description: '已经正确完成的结果' },
  { value: 'warning', label: 'Warning 警告', description: '可恢复且需要留意的问题' },
  { value: 'danger', label: 'Danger 危险', description: '失败或不可逆操作' },
  { value: 'muted', label: 'Muted 弱化', description: '低优先级与只读信息' },
]

function showTone(tone: DlTone) {
  activeTone.value = tone
  open.value = true
}`, template: `  <div class="tone-grid">
    <DlButton v-for="item in tones" :key="item.value" variant="secondary" @click="showTone(item.value)">
      {{ item.label }}
    </DlButton>
  </div>
  <DlToast
    v-model:open="open"
    :title="activeTone + ' 色调通知'"
    :description="tones.find(item => item.value === activeTone)?.description"
    :tone="activeTone"
    :duration="8000"
    closable
  />`, style: `.tone-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }` }),
    'upload-progress': vueSfc({ imports: ['DlButton', 'DlToast'], script: `import { ref } from 'vue'\n\nconst open = ref(false)\nconst progress = ref(68)`, template: `  <DlButton @click="open = true">上传新封面</DlButton>
  <DlToast
    v-model:open="open"
    title="正在处理封面"
    description="已上传 3.4 MB / 5 MB"
    tone="accent"
    :duration="12000"
    show-progress
    :progress="progress"
  />` }),
    'background-notice': vueSfc({ imports: ['DlButton', 'DlToast'], script: `import { ref } from 'vue'\n\nconst open = ref(false)`, template: `  <DlButton variant="secondary" @click="open = true">运行后台同步</DlButton>
  <DlToast
    v-model:open="open"
    title="后台同步完成"
    description="新增 12 部作品到本地索引。"
    tone="default"
    action-label="查看记录"
    :duration="6000"
  />` }),
    'network-warning': vueSfc({ imports: ['DlButton', 'DlToast'], script: `import { ref } from 'vue'\n\nconst open = ref(false)`, template: `  <DlButton variant="secondary" @click="open = true">模拟网络波动</DlButton>
  <DlToast
    v-model:open="open"
    title="网络连接不稳定"
    description="自动重试会在后台继续，当前修改已保存到本地。"
    tone="warning"
    action-label="查看状态"
    :duration="9000"
  />` }),
    'error-recovery': vueSfc({ imports: ['DlButton', 'DlToast'], script: `import { ref } from 'vue'\n\nconst open = ref(false)\nfunction retry() {\n  open.value = false\n  window.setTimeout(() => { open.value = true }, 300)\n}`, template: `  <DlButton variant="danger" @click="open = true">模拟同步失败</DlButton>
  <DlToast
    v-model:open="open"
    title="同步失败"
    description="无法连接资料服务器，本地修改尚未丢失。"
    tone="danger"
    action-label="重试"
    :duration="10000"
    @action="retry"
  />` }),
    'quiet-summary': vueSfc({ imports: ['DlButton', 'DlToast'], script: `import { ref } from 'vue'\n\nconst open = ref(false)`, template: `  <DlButton variant="ghost" @click="open = true">检查重复条目</DlButton>
  <DlToast
    v-model:open="open"
    title="已跳过重复条目"
    description="3 部作品已存在于收藏库，无需再次导入。"
    tone="muted"
    size="sm"
    :closable="false"
    :duration="3500"
  />` }),
  },
}

const exampleCode = computed(() => scenarioCodeById[props.componentDefinition.id]?.[props.scenario]
  ?? baseCodeById[props.componentDefinition.id]
  ?? '')
const content = computed(() => ({
  title: `${props.componentDefinition.name} · ${props.componentDefinition.scenarios.find(item => item.id === props.scenario)?.label ?? '案例'}`,
  description: props.componentDefinition.summary,
  code: exampleCode.value,
  tips: ['每个场景只渲染当前案例，避免大量 Portal 与交互控件同时挂载。', '案例代码包含完整的状态、模板和必要样式，可直接作为 Vue SFC 使用。'],
}))
function selectAction(value: string) { lastAction.value = value }
</script>

<template>
  <DocExampleShell v-bind="content">
    <div class="advanced-general-demo">
      <template v-if="componentDefinition.id === 'alert-dialog'"><DlButton variant="danger" @click="alertOpen = true">移除收藏记录</DlButton><DlAlertDialog v-model:open="alertOpen" title="移除收藏记录？" description="观看进度和个人评分也会一起移除，此操作无法撤销。" @confirm="lastAction = '已确认移除'" /></template>
      <DlAspectRatio v-else-if="componentDefinition.id === 'aspect-ratio'" :ratio="16 / 9"><div class="ratio-art"><b>16 : 9</b><span>媒体封面安全区域</span></div></DlAspectRatio>
      <DlContextMenu v-else-if="componentDefinition.id === 'context-menu'" :items="menuItems" label="作品操作" @select="selectAction"><div class="context-target">在这里单击右键<br><small>{{ lastAction }}</small></div></DlContextMenu>
      <DlDropdownMenu v-else-if="componentDefinition.id === 'dropdown-menu'" :items="menuItems" label="作品操作" @select="selectAction"><template #trigger><DlButton variant="secondary">打开操作菜单 ▾</DlButton></template></DlDropdownMenu>

      <template v-else-if="componentDefinition.id === 'hover-card'">
        <DlHoverCard v-if="scenario === 'basic'" :open-delay="220" align="start"><template #trigger><a class="hover-link" href="#/components/avatar/basic">悬停预览《来自深渊》</a></template><article class="anime-preview"><div class="anime-preview__cover">深</div><div><b>来自深渊</b><small>Made in Abyss · 2017</small></div><p>在巨大洞穴“阿比斯”边缘展开的奇幻冒险。</p><span>奇幻冒险 · 已收藏</span></article></DlHoverCard>
        <DlHoverCard v-else-if="scenario === 'creator-profile'" side="right" :open-delay="180"><template #trigger><button class="hover-link-button">监督：斋藤圭一郎</button></template><section class="creator-preview"><div class="creator-preview__avatar">斋</div><div><b>斋藤圭一郎</b><small>动画监督</small></div><p>代表作品包含《葬送的芙莉莲》《孤独摇滚！》。</p><a href="#/components/avatar/basic">查看 8 部关联作品 →</a></section></DlHoverCard>
        <DlHoverCard v-else side="top" align="start"><template #trigger><a class="hover-link" href="#/components/progress/basic">第 9 集 · 断头台阿乌拉</a></template><section class="episode-preview"><header><b>第 9 集</b><span>24:10</span></header><p>芙莉莲一行抵达格拉纳特伯爵领，与魔族使者展开交涉。</p><DlProgress :model-value="72" label="观看进度" size="sm" tone="accent" show-value /></section></DlHoverCard>
      </template>

      <DlMenubar v-else-if="componentDefinition.id === 'menubar'" :menus="menus" @select="selectAction" />
      <DlNavigationMenu v-else-if="componentDefinition.id === 'navigation-menu'" :items="navigation" />
      <DlPagination v-else-if="componentDefinition.id === 'pagination'" v-model:page="page" :total="240" :items-per-page="12" />
      <DlScrollArea v-else-if="componentDefinition.id === 'scroll-area'" class="scroll-demo"><div v-for="index in 18" :key="index" class="scroll-row"><b>{{ String(index).padStart(2, '0') }}</b><span>第 {{ index }} 集 · 收藏条目说明</span></div></DlScrollArea>
      <DlSplitter v-else-if="componentDefinition.id === 'splitter'" :panels="panels" class="splitter-demo"><template #panel-outline><div class="split-panel"><b>目录</b><span v-for="index in 5" :key="index">章节 {{ index }}</span></div></template><template #panel-content><div class="split-panel"><b>内容</b><p>拖动中间的把手调整两侧宽度，也可以聚焦把手后使用方向键。</p></div></template></DlSplitter>
      <DlStepper v-else-if="componentDefinition.id === 'stepper'" v-model="step" :items="steps" />

      <template v-else-if="componentDefinition.id === 'toast'">
        <template v-if="scenario === 'basic'"><DlButton @click="toastOpen = true">保存作品资料</DlButton><DlToast v-model:open="toastOpen" title="保存成功" description="作品资料已经更新。" tone="success" action-label="查看" /></template>
        <template v-else-if="scenario === 'tone-gallery'"><div class="toast-tone-grid"><DlButton v-for="item in toneOptions" :key="item.value" variant="secondary" @click="toastTone = item.value; toastOpen = true">{{ item.label }}</DlButton></div><DlToast v-model:open="toastOpen" :title="toastTone + ' 色调通知'" :description="toastToneInfo.description" :tone="toastTone" :duration="8000" closable /></template>
        <template v-else-if="scenario === 'upload-progress'"><DlButton @click="toastOpen = true">上传新封面</DlButton><DlToast v-model:open="toastOpen" title="正在处理封面" description="已上传 3.4 MB / 5 MB" tone="accent" :duration="12000" show-progress :progress="68" /></template>
        <template v-else-if="scenario === 'background-notice'"><DlButton variant="secondary" @click="toastOpen = true">运行后台同步</DlButton><DlToast v-model:open="toastOpen" title="后台同步完成" description="新增 12 部作品到本地索引。" tone="default" action-label="查看记录" :duration="6000" /></template>
        <template v-else-if="scenario === 'network-warning'"><DlButton variant="secondary" @click="toastOpen = true">模拟网络波动</DlButton><DlToast v-model:open="toastOpen" title="网络连接不稳定" description="自动重试会在后台继续，当前修改已保存到本地。" tone="warning" action-label="查看状态" :duration="9000" /></template>
        <template v-else-if="scenario === 'error-recovery'"><DlButton variant="danger" @click="toastOpen = true">模拟同步失败</DlButton><DlToast v-model:open="toastOpen" title="同步失败" description="无法连接资料服务器，本地修改尚未丢失。" tone="danger" action-label="重试" :duration="10000" @action="toastOpen = false" /></template>
        <template v-else><DlButton variant="ghost" @click="toastOpen = true">检查重复条目</DlButton><DlToast v-model:open="toastOpen" title="已跳过重复条目" description="3 部作品已存在于收藏库，无需再次导入。" tone="muted" size="sm" :closable="false" :duration="3500" /></template>
      </template>

      <DlToolbar v-else :items="toolbarItems" @action="selectAction" />
      <output v-if="!['context-menu', 'scroll-area', 'splitter', 'aspect-ratio', 'hover-card', 'toast'].includes(componentDefinition.id)">当前：{{ componentDefinition.id === 'pagination' ? `第 ${page} 页` : componentDefinition.id === 'stepper' ? `步骤 ${step}` : lastAction }}</output>
    </div>
  </DocExampleShell>
</template>

<style scoped>
.advanced-general-demo { display: grid; gap: 1.2rem; width: min(100%, 760px); margin: 0 auto; padding: 1rem; justify-items: start; }
.advanced-general-demo output { color: var(--dl-text-faint); font-size: .76rem; }
.toast-tone-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; width: 100%; }
.ratio-art { display: grid; width: 100%; height: 100%; place-content: center; justify-items: center; gap: .4rem; background: radial-gradient(circle at 30% 20%, rgba(255,215,0,.22), transparent 40%), linear-gradient(145deg, #1a472a, #07130d); color: var(--dl-text); }
.ratio-art b { font-size: 2rem; }.ratio-art span { color: var(--dl-text-muted); }
.context-target { width: 100%; min-height: 180px; display: grid; place-content: center; text-align: center; border: 1px dashed var(--dl-border-strong); border-radius: var(--dl-radius-md); color: var(--dl-text-muted); }.context-target small { margin-top: .4rem; color: var(--dl-text-faint); }
.hover-link, .hover-link-button { color: #fde68a; text-decoration: underline; text-underline-offset: 4px; }.hover-link-button { padding: 0; border: 0; background: transparent; cursor: pointer; font: inherit; }
.anime-preview, .creator-preview { display: grid; grid-template-columns: 52px 1fr; gap: 10px 12px; }.anime-preview__cover, .creator-preview__avatar { grid-row: span 2; display: grid; place-items: center; min-height: 72px; border-radius: 15px; background: linear-gradient(145deg, #285f46, #081c15); color: #ffe08a; font-weight: 900; }.creator-preview__avatar { min-height: 52px; border-radius: 50%; }
.anime-preview b, .anime-preview small, .creator-preview b, .creator-preview small { display: block; }.anime-preview small, .anime-preview p, .creator-preview small, .creator-preview p, .episode-preview p { color: rgba(226,232,240,.7); }.anime-preview p, .anime-preview span, .creator-preview p, .creator-preview a { grid-column: 1 / -1; margin: 0; }.anime-preview span, .creator-preview a { color: #a7f3d0; font-size: .75rem; font-weight: 700; }
.episode-preview { display: grid; gap: 12px; }.episode-preview header { display: flex; justify-content: space-between; }.episode-preview p { margin: 0; }
.scroll-demo { width: 100%; height: 260px; }.scroll-row { display: flex; gap: 1rem; padding: .75rem 1rem; border-bottom: 1px solid var(--dl-border); color: var(--dl-text-muted); }.scroll-row b { color: #fde68a; }
.splitter-demo { width: 100%; height: 260px; }.split-panel { display: flex; height: 100%; flex-direction: column; gap: .7rem; padding: 1rem; color: var(--dl-text-muted); }.split-panel b { color: var(--dl-text); }
@media (max-width: 560px) { .toast-tone-grid { grid-template-columns: 1fr; } }
</style>
