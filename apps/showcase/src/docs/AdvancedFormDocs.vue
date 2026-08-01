<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  DlCombobox, DlEditable, DlInput, DlLabel, DlListbox, DlNumberField, DlPinInput, DlTagsInput, DlToggle, DlToggleGroup,
  type DlChoiceOption,
} from '@dragon-liquid/vue'
import type { ComponentDefinition } from '../catalog'
import { componentGuidanceFor } from '../componentGuidance'
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
const currentValue = computed(() => {
  switch (props.componentDefinition.id) {
    case 'editable':
    case 'label': return text.value
    case 'listbox': return choices.value.join('、') || '未选择'
    case 'number-field': return `${count.value} 集`
    case 'pin-input': return pin.value.join('') || '等待输入'
    case 'tags-input': return tags.value.join('、') || '暂无标签'
    case 'toggle': return toggled.value ? '已追踪' : '未追踪'
    case 'toggle-group': return toggleValues.value.join('、') || '未选择'
    default: return options.find(item => item.value === choice.value)?.label ?? choice.value
  }
})
const codeById: Record<string, string> = {
  combobox: vueSfc({ imports: ['DlCombobox', 'type DlChoiceOption'], script: `import { computed, ref } from 'vue'

const genre = ref('fantasy')
const options: DlChoiceOption[] = [
  { value: 'fantasy', label: '奇幻', description: '魔法、异世界与神话题材' },
  { value: 'adventure', label: '冒险', description: '旅途、探索和成长' },
  { value: 'daily', label: '日常', description: '轻松的生活片段' },
  { value: 'locked', label: '未开放分类', disabled: true },
]
const selectedLabel = computed(() => options.find(item => item.value === genre.value)?.label ?? '未选择')`, template: `  <section class="example">
    <DlCombobox v-model="genre" :options="options" placeholder="搜索题材" />
    <output>当前题材：{{ selectedLabel }}</output>
  </section>`, style: `.example { display: grid; gap: 12px; max-width: 480px; }
output { color: #a9b9b0; }` }),
  editable: vueSfc({ imports: ['DlEditable'], script: `import { ref } from 'vue'

const title = ref('来自深渊')`, template: `  <section class="example">
    <DlEditable v-model="title" placeholder="输入作品标题" />
    <output>保存值：{{ title || '尚未填写' }}</output>
  </section>`, style: `.example { display: grid; gap: 12px; max-width: 480px; }
output { color: #a9b9b0; }` }),
  listbox: vueSfc({ imports: ['DlListbox', 'type DlChoiceOption'], script: `import { ref } from 'vue'

const genres = ref<string[]>(['fantasy'])
const options: DlChoiceOption[] = [
  { value: 'fantasy', label: '奇幻', description: '魔法与异世界题材' },
  { value: 'adventure', label: '冒险', description: '旅途、探索与成长' },
  { value: 'daily', label: '日常', description: '轻松生活片段' },
  { value: 'locked', label: '未开放分类', disabled: true },
]`, template: `  <section class="example">
    <DlListbox v-model="genres" :options="options" multiple />
    <output>已选：{{ genres.join('、') || '无' }}</output>
  </section>`, style: `.example { display: grid; gap: 12px; max-width: 480px; }
output { color: #a9b9b0; }` }),
  'number-field': vueSfc({ imports: ['DlNumberField', 'DlLabel'], script: `import { ref } from 'vue'

const episodes = ref(12)`, template: `  <section class="example">
    <DlLabel for="episode-count">总集数</DlLabel>
    <DlNumberField id="episode-count" v-model="episodes" :min="1" :max="99" :step="1" />
    <output>当前：{{ episodes }} 集</output>
  </section>`, style: `.example { display: grid; gap: 10px; max-width: 360px; }
output { color: #a9b9b0; }` }),
  label: vueSfc({ imports: ['DlInput', 'DlLabel'], script: `import { ref } from 'vue'

const title = ref('')`, template: `  <div class="field">
    <DlLabel for="title" required>作品标题</DlLabel>
    <DlInput id="title" v-model="title" placeholder="例如：葬送的芙莉莲" />
    <small>点击标签会把焦点移到输入框。</small>
    <output>当前值：{{ title || '尚未填写' }}</output>
  </div>`, style: `.field { display: grid; gap: 8px; max-width: 480px; }
.field small, .field output { color: #a9b9b0; }` }),
  'pin-input': vueSfc({ imports: ['DlPinInput', 'DlLabel'], script: `import { ref } from 'vue'

const code = ref<string[]>([])`, template: `  <section class="example">
    <DlLabel>六位邀请码</DlLabel>
    <DlPinInput v-model="code" :length="6" />
    <output aria-live="polite">已输入 {{ code.length }} / 6 位</output>
  </section>`, style: `.example { display: grid; gap: 10px; }
output { color: #a9b9b0; }` }),
  'tags-input': vueSfc({ imports: ['DlTagsInput', 'DlLabel'], script: `import { ref } from 'vue'

const tags = ref(['异世界', '冒险'])`, template: `  <section class="example">
    <DlLabel>作品标签</DlLabel>
    <DlTagsInput v-model="tags" :max="8" placeholder="输入后按 Enter" />
    <output>{{ tags.length }} / 8：{{ tags.join('、') || '暂无标签' }}</output>
  </section>`, style: `.example { display: grid; gap: 10px; max-width: 560px; }
output { color: #a9b9b0; }` }),
  toggle: vueSfc({ imports: ['DlToggle'], script: `import { ref } from 'vue'

const tracked = ref(true)`, template: `  <section class="example">
    <DlToggle v-model="tracked" aria-label="追踪作品更新">
      {{ tracked ? '✓ 已追踪' : '＋ 加入追踪' }}
    </DlToggle>
    <output aria-live="polite">{{ tracked ? '新一集会进入待办列表' : '不会追踪后续更新' }}</output>
  </section>`, style: `.example { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
output { color: #a9b9b0; }` }),
  'toggle-group': vueSfc({ imports: ['DlToggleGroup', 'type DlChoiceOption'], script: `import { ref } from 'vue'

const formats = ref<string[]>(['sub'])
const items: DlChoiceOption[] = [
  { value: 'sub', label: '字幕' },
  { value: 'dub', label: '配音' },
  { value: 'raw', label: '生肉' },
]`, template: `  <section class="example">
    <DlToggleGroup v-model="formats" type="multiple" :items="items" aria-label="音轨偏好" />
    <output>已选：{{ formats.join('、') || '无' }}</output>
  </section>`, style: `.example { display: grid; gap: 12px; }
output { color: #a9b9b0; }` }),
}
const content = computed(() => ({
  title: `${props.componentDefinition.name} · ${props.componentDefinition.scenarios.find(item => item.id === props.scenario)?.label ?? '案例'}`,
  description: componentGuidanceFor(props.componentDefinition.id).example,
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
      <output>当前值：{{ currentValue }}</output>
    </div>
  </DocExampleShell>
</template>

<style scoped>
.advanced-form-demo { display: grid; gap: 1rem; width: min(100%, 680px); margin: 0 auto; padding: 1rem; }
.advanced-form-demo output, .field-stack small { color: var(--dl-text-faint); font-size: .76rem; }
.field-stack { display: grid; gap: .55rem; }
</style>
