<script setup lang="ts">
import { computed, ref } from 'vue'
import { DlBadge, DlCard, DlSelect, type DlSelectOption } from '@dragon-liquid/vue'
import DocExampleShell from '../components/DocExampleShell.vue'
import { vueSfc } from './exampleCode'

const props = defineProps<{ scenario: string }>()
const framework = ref('vue')
const type = ref('all')
const status = ref('watching')
const level = ref('comfortable')

const frameworkOptions: DlSelectOption[] = [
  { value: 'vue', label: 'Vue 3', description: '当前稳定支持' },
  { value: 'nuxt', label: 'Nuxt 4', description: 'SSR 与静态生成' },
  { value: 'react', label: 'React', description: '规划中', disabled: true },
]
const typeOptions: DlSelectOption[] = [{ value: 'all', label: '全部类型' }, { value: 'tv', label: 'TV 动画' }, { value: 'movie', label: '剧场版' }]
const statusOptions: DlSelectOption[] = [{ value: 'all', label: '全部进度' }, { value: 'watching', label: '正在观看' }, { value: 'completed', label: '已经看完' }]
const levelOptions: DlSelectOption[] = [
  { value: 'compact', label: '紧凑', description: '适合高密度后台与大屏数据表格' },
  { value: 'comfortable', label: '舒适', description: '推荐，平衡信息量与可读性' },
  { value: 'spacious', label: '宽松', description: '适合内容浏览与触控设备' },
]

const content = computed(() => ({
  basic: {
    title: '选择器选项与尺寸',
    description: '选项可以带描述或禁用状态，浮层由 Reka UI Portal 管理。',
    code: vueSfc({ imports: ['DlSelect', 'type DlSelectOption'], script: `import { ref } from 'vue'\n\nconst framework = ref('vue')\nconst options: DlSelectOption[] = [\n  { value: 'vue', label: 'Vue 3' },\n  { value: 'nuxt', label: 'Nuxt 4' },\n  { value: 'react', label: 'React', disabled: true },\n]`, template: `  <DlSelect\n    v-model="framework"\n    :options="options"\n    placeholder="选择框架"\n  />` }),
    tips: ['选项数量非常多时应改用可搜索组合框。', 'placeholder 只表达选择提示，不能取代字段标签。'],
  },
  'catalog-filter': {
    title: '收藏库组合筛选',
    description: '多个选择器并排使用时，保持字段顺序固定，并提供清除筛选入口。',
    code: vueSfc({ imports: ['DlSelect', 'type DlSelectOption'], script: `import { ref } from 'vue'\n\nconst type = ref('all')\nconst status = ref('watching')\nconst typeOptions: DlSelectOption[] = [\n  { value: 'all', label: '全部类型' },\n  { value: 'tv', label: 'TV 动画' },\n]\nconst statusOptions: DlSelectOption[] = [\n  { value: 'watching', label: '正在观看' },\n  { value: 'completed', label: '已经看完' },\n]`, template: `  <div class="filters">\n    <DlSelect v-model="type" :options="typeOptions" />\n    <DlSelect v-model="status" :options="statusOptions" />\n  </div>`, style: `.filters { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }` }),
    tips: ['筛选变化应立即反映在结果计数中。', '移动端将筛选器折叠进专用面板，避免横向拥挤。'],
  },
  'preference-level': {
    title: '偏好等级设置',
    description: '选项描述用于解释抽象等级的实际影响，降低选择成本。',
    code: vueSfc({ imports: ['DlSelect', 'type DlSelectOption'], script: `import { ref } from 'vue'\n\nconst density = ref('comfortable')\nconst options: DlSelectOption[] = [\n  { value: 'compact', label: '紧凑', description: '适合高密度后台' },\n  { value: 'comfortable', label: '舒适', description: '平衡信息量与可读性' },\n  { value: 'spacious', label: '宽松', description: '适合内容浏览' },\n]`, template: `  <DlSelect v-model="density" :options="options" size="lg" />` }),
    tips: ['默认值应代表多数用户的推荐选择。', '选项描述保持同一维度，避免混杂无关信息。'],
  },
}[props.scenario] ?? {} as { title: string; description: string; code: string; tips: string[] }))
</script>

<template>
  <DocExampleShell v-bind="content">
    <div v-if="scenario === 'basic'" class="select-example-grid">
      <label><span>默认尺寸</span><DlSelect v-model="framework" :options="frameworkOptions" /></label>
      <label><span>大尺寸</span><DlSelect v-model="framework" :options="frameworkOptions" size="lg" /></label>
      <label><span>禁用状态</span><DlSelect model-value="vue" :options="frameworkOptions" disabled /></label>
    </div>

    <DlCard v-else-if="scenario === 'catalog-filter'" padding="md" class="catalog-filter-card">
      <div><DlSelect v-model="type" :options="typeOptions" /><DlSelect v-model="status" :options="statusOptions" /></div>
      <span><b>12</b><small>部匹配作品</small></span>
    </DlCard>

    <DlCard v-else padding="lg" class="preference-card">
      <div><DlBadge tone="accent">APPEARANCE</DlBadge><h3>界面密度</h3><p>控制列表、卡片和输入控件之间的默认留白。</p></div>
      <label><span>密度等级</span><DlSelect v-model="level" :options="levelOptions" size="lg" /></label>
      <small>当前选择：{{ levelOptions.find(item => item.value === level)?.label }}</small>
    </DlCard>
  </DocExampleShell>
</template>
