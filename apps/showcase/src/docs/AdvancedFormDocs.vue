<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  DlCombobox, DlEditable, DlInput, DlLabel, DlListbox, DlNumberField, DlPinInput, DlTagsInput, DlToggle, DlToggleGroup,
  type DlChoiceOption,
} from '@dragon-liquid/vue'
import type { ComponentDefinition } from '../catalog'
import DocExampleShell from '../components/DocExampleShell.vue'
import { vueSfc } from './exampleCode'

const props = defineProps<{ scenario: string; componentDefinition: ComponentDefinition }>()
const text = ref('来自深渊')
const choice = ref('fantasy')
const choices = ref<string[]>(['fantasy'])
const count = ref(12)
const pin = ref<string[]>([])
const tags = ref(['异世界', '冒险'])
const toggled = ref(true)
const toggleValues = ref<string[]>(['sub'])
const options: DlChoiceOption[] = [
  { value: 'fantasy', label: '奇幻', description: '魔法、异世界与神话题材' },
  { value: 'adventure', label: '冒险', description: '旅途、探索和成长' },
  { value: 'daily', label: '日常', description: '轻松的生活片段' },
  { value: 'locked', label: '未开放分类', disabled: true },
]
const codeById: Record<string, string> = {
  combobox: vueSfc({ imports: ['DlCombobox', 'type DlChoiceOption'], script: `import { ref } from 'vue'\n\nconst genre = ref('fantasy')\nconst options: DlChoiceOption[] = [\n  { value: 'fantasy', label: '奇幻' },\n  { value: 'adventure', label: '冒险' },\n]`, template: `  <DlCombobox v-model="genre" :options="options" />` }),
  editable: vueSfc({ imports: ['DlEditable'], script: `import { ref } from 'vue'\n\nconst title = ref('来自深渊')`, template: `  <DlEditable v-model="title" />` }),
  listbox: vueSfc({ imports: ['DlListbox', 'type DlChoiceOption'], script: `import { ref } from 'vue'\n\nconst genres = ref<string[]>(['fantasy'])\nconst options: DlChoiceOption[] = [\n  { value: 'fantasy', label: '奇幻' },\n  { value: 'adventure', label: '冒险' },\n]`, template: `  <DlListbox v-model="genres" :options="options" multiple />` }),
  'number-field': vueSfc({ imports: ['DlNumberField'], script: `import { ref } from 'vue'\n\nconst episodes = ref(12)`, template: `  <DlNumberField v-model="episodes" :min="1" :max="99" />` }),
  label: vueSfc({ imports: ['DlInput', 'DlLabel'], script: `import { ref } from 'vue'\n\nconst title = ref('')`, template: `  <div class="field">\n    <DlLabel for="title" required>作品标题</DlLabel>\n    <DlInput id="title" v-model="title" />\n  </div>`, style: `.field { display: grid; gap: 8px; }` }),
  'pin-input': vueSfc({ imports: ['DlPinInput'], script: `import { ref } from 'vue'\n\nconst code = ref<string[]>([])`, template: `  <DlPinInput v-model="code" :length="6" />` }),
  'tags-input': vueSfc({ imports: ['DlTagsInput'], script: `import { ref } from 'vue'\n\nconst tags = ref(['异世界', '冒险'])`, template: `  <DlTagsInput v-model="tags" :max="8" />` }),
  toggle: vueSfc({ imports: ['DlToggle'], script: `import { ref } from 'vue'\n\nconst tracked = ref(true)`, template: `  <DlToggle v-model="tracked" aria-label="加入追踪">\n    {{ tracked ? '✓ 已追踪' : '＋ 加入追踪' }}\n  </DlToggle>` }),
  'toggle-group': vueSfc({ imports: ['DlToggleGroup', 'type DlChoiceOption'], script: `import { ref } from 'vue'\n\nconst formats = ref<string[]>(['sub'])\nconst items: DlChoiceOption[] = [\n  { value: 'sub', label: '字幕' },\n  { value: 'dub', label: '配音' },\n]`, template: `  <DlToggleGroup\n    v-model="formats"\n    type="multiple"\n    :items="items"\n  />` }),
}
const content = computed(() => ({
  title: `${props.componentDefinition.name} · ${props.componentDefinition.scenarios.find(item => item.id === props.scenario)?.label ?? '案例'}`,
  description: props.componentDefinition.summary,
  code: codeById[props.componentDefinition.id] ?? '',
  tips: ['公共 API 使用简单值和选项数组，业务层无需直接拼装 Reka 子原语。', '所有控件均保留键盘交互、表单名称和禁用状态。'],
}))
</script>

<template>
  <DocExampleShell v-bind="content">
    <div class="advanced-form-demo">
      <DlCombobox v-if="componentDefinition.id === 'combobox'" v-model="choice" :options="options" placeholder="搜索题材" />
      <DlEditable v-else-if="componentDefinition.id === 'editable'" v-model="text" placeholder="双击编辑作品名" />
      <DlListbox v-else-if="componentDefinition.id === 'listbox'" v-model="choices" :options="options" :multiple="scenario !== 'basic'" />
      <DlNumberField v-else-if="componentDefinition.id === 'number-field'" v-model="count" :min="1" :max="99" :step="scenario === 'form-integration' ? 12 : 1" />
      <div v-else-if="componentDefinition.id === 'label'" class="field-stack"><DlLabel for="advanced-title" required>作品标题</DlLabel><DlInput id="advanced-title" v-model="text" /><small>标签点击后会把焦点移到关联输入框。</small></div>
      <DlPinInput v-else-if="componentDefinition.id === 'pin-input'" v-model="pin" :length="6" :mask="scenario === 'validation'" />
      <DlTagsInput v-else-if="componentDefinition.id === 'tags-input'" v-model="tags" :max="scenario === 'validation' ? 3 : 8" />
      <DlToggle v-else-if="componentDefinition.id === 'toggle'" v-model="toggled" aria-label="加入追踪">{{ toggled ? '✓ 已追踪' : '＋ 加入追踪' }}</DlToggle>
      <DlToggleGroup v-else v-model="toggleValues" type="multiple" :items="[{ value: 'sub', label: '字幕' }, { value: 'dub', label: '配音' }, { value: 'raw', label: '生肉' }]" />
      <output>当前值：{{ componentDefinition.id === 'number-field' ? count : componentDefinition.id === 'pin-input' ? pin.join('') : componentDefinition.id === 'tags-input' ? tags.join('、') : componentDefinition.id === 'editable' ? text : componentDefinition.id === 'listbox' ? choices.join(', ') : choice }}</output>
    </div>
  </DocExampleShell>
</template>

<style scoped>
.advanced-form-demo { display: grid; gap: 1rem; width: min(100%, 680px); margin: 0 auto; padding: 1rem; }
.advanced-form-demo output, .field-stack small { color: var(--dl-text-faint); font-size: .76rem; }
.field-stack { display: grid; gap: .55rem; }
</style>
