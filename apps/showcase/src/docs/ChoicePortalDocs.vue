<script setup lang="ts">
import { computed, ref } from 'vue'
import { DlBadge, DlCard, DlChoicePortal, type DlChoicePortalEntry } from '@dragon-liquid/vue'
import DocExampleShell from '../components/DocExampleShell.vue'
import { vueSfc } from './exampleCode'

const props = defineProps<{ scenario: string }>()
const value = ref('vue')
const customValue = ref('stable')
const groupedOptions: DlChoicePortalEntry[] = [
  { label: '前端', options: [
    { value: 'vue', label: 'Vue 3', description: '渐进式前端框架', keywords: ['v3', 'vuejs'] },
    { value: 'nuxt', label: 'Nuxt 4', description: 'Vue 全栈框架', keywords: ['n4'] },
  ] },
  { label: '服务端', options: [
    { value: 'dotnet', label: '.NET', description: 'ASP.NET Core 服务', keywords: ['aspnet', 'csharp'] },
    { value: 'node', label: 'Node.js', description: 'JavaScript 运行时', keywords: ['nodejs'] },
  ] },
]
const basicOptions: DlChoicePortalEntry[] = [
  { value: 'vue', label: 'Vue 3', description: '当前稳定支持' },
  { value: 'nuxt', label: 'Nuxt 4', description: '服务端渲染与全栈应用' },
  { value: 'react', label: 'React', description: '等待适配', disabled: true },
]

const content = computed(() => ({
  basic: {
    title: '沉浸式单项选择',
    description: '在桌面端打开居中模态面板，小屏自动变为底部抽屉。',
    code: vueSfc({ imports: ['DlChoicePortal', 'type DlChoicePortalEntry'], script: `import { ref } from 'vue'\n\nconst value = ref('vue')\nconst options: DlChoicePortalEntry[] = [\n  { value: 'vue', label: 'Vue 3', description: '当前稳定支持' },\n  { value: 'nuxt', label: 'Nuxt 4' },\n]`, template: `  <DlChoicePortal v-model="value" :options="options" clearable />` }),
    tips: ['适合比普通下拉框更复杂的选择任务。', '移动端抽屉会保留完整搜索和键盘语义。'],
  },
  'grouped-search': {
    title: '分组、关键词与键盘导航',
    description: '搜索会同时匹配名称、值、描述和 keywords，并高亮每个结果的命中依据。方向键与 Enter 可直接提交。',
    code: vueSfc({ imports: ['DlChoicePortal', 'type DlChoicePortalEntry'], script: `import { ref } from 'vue'\n\nconst value = ref('vue')\nconst options: DlChoicePortalEntry[] = [\n  { label: '前端', options: [{ value: 'vue', label: 'Vue 3', keywords: ['v3'] }] },\n  { label: '服务端', options: [{ value: 'dotnet', label: '.NET', keywords: ['aspnet'] }] },\n]`, template: `  <DlChoicePortal v-model="value" :options="options" searchable />` }),
    tips: ['keywords 适合缩写、拼音首字母和历史称呼；隐藏关键词命中时会临时显示。', '禁用项仍可展示说明，但不能被键盘提交。'],
  },
  'custom-value': {
    title: '建议选项与自定义值共存',
    description: 'allow-custom 会将清理后的搜索文字作为自定义候选项。',
    code: vueSfc({ imports: ['DlChoicePortal'], script: `import { ref } from 'vue'\n\nconst channel = ref('stable')\nconst options = [\n  { value: 'stable', label: '稳定版' },\n  { value: 'preview', label: '预览版' },\n]`, template: `  <DlChoicePortal v-model="channel" :options="options" allow-custom clearable />` }),
    tips: ['自定义值会移除不可见控制字符并清理首尾空格。', '如果业务必须限定候选项，请关闭 allow-custom。'],
  },
}[props.scenario] ?? {}) as { title: string; description: string; code: string; tips: string[] })
</script>

<template>
  <DocExampleShell v-bind="content">
    <DlCard padding="lg" class="choice-portal-demo">
      <div><DlBadge tone="accent">PORTED FROM TODOMOE</DlBadge><h3>复杂选择保持专注</h3><p>选项数量增加时，选择任务进入独立界面，不挤压原表单布局。</p></div>
      <DlChoicePortal v-if="scenario === 'basic'" v-model="value" :options="basicOptions" clearable placeholder="选择框架" />
      <DlChoicePortal v-else-if="scenario === 'grouped-search'" v-model="value" :options="groupedOptions" searchable placeholder="搜索技术栈" />
      <DlChoicePortal v-else v-model="customValue" :options="basicOptions" allow-custom clearable placeholder="选择或输入发布通道" />
      <small>当前值：{{ scenario === 'custom-value' ? customValue : value }}</small>
    </DlCard>
  </DocExampleShell>
</template>

<style scoped>
.choice-portal-demo { display: grid; gap: 18px; max-width: 680px; }
.choice-portal-demo > div { display: grid; gap: 8px; }
.choice-portal-demo h3, .choice-portal-demo p { margin: 0; }
.choice-portal-demo p, .choice-portal-demo > small { color: var(--dl-text-muted); }
</style>
