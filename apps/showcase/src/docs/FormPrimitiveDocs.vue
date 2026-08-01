<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  DlCheckbox,
  DlRadioGroup,
  DlSlider,
  DlSwitch,
  type DlRadioOption,
} from '@dragon-liquid/vue'
import type { ComponentDefinition } from '../catalog'
import DocExampleShell from '../components/DocExampleShell.vue'
import { vueSfc } from './exampleCode'

const props = defineProps<{ scenario: string; componentDefinition: ComponentDefinition }>()
const checked = ref(true)
const mixed = ref<boolean | 'indeterminate'>('indeterminate')
const enabled = ref(true)
const choice = ref('watching')
const score = ref([72])
const range = ref([24, 86])

const radioOptions: DlRadioOption[] = [
  { value: 'planned', label: '计划观看', description: '稍后加入观看队列' },
  { value: 'watching', label: '正在观看', description: '显示在首页继续观看区域' },
  { value: 'completed', label: '已经看完', description: '保留评分和观看记录' },
  { value: 'paused', label: '暂时搁置', disabled: true },
]

const meta = computed(() => ({
  checkbox: { title: '复选框状态', description: '支持选中、未选中、不确定状态以及完整的键盘和表单语义。', code: vueSfc({ imports: ['DlCheckbox'], script: `import { ref } from 'vue'

const tracked = ref(true)
const season = ref<boolean | 'indeterminate'>('indeterminate')`, template: `  <section class="states">
    <DlCheckbox
      v-model="tracked"
      label="收藏后自动追踪更新"
      description="新一集发布时同步到待办列表"
    />
    <DlCheckbox
      v-model="season"
      label="选择本季度作品"
      description="部分条目已选中，显示不确定状态"
    />
    <DlCheckbox :model-value="false" label="不可用的选项" disabled />
    <output>追踪：{{ tracked ? '开启' : '关闭' }}；季度：{{ season }}</output>
  </section>`, style: `.states { display: grid; gap: 16px; max-width: 560px; }
output { color: #a9b9b0; }` }) },
  switch: { title: '即时状态开关', description: '适合切换立即生效的设置，不用于需要额外提交确认的字段。', code: vueSfc({ imports: ['DlSwitch'], script: `import { ref } from 'vue'

const enabled = ref(true)`, template: `  <section class="states">
    <DlSwitch
      v-model="enabled"
      label="更新提醒"
      description="有新一集时发送站内通知"
    />
    <DlSwitch :model-value="false" label="移动网络自动播放" size="sm" />
    <DlSwitch :model-value="true" label="管理员策略" disabled />
    <output aria-live="polite">提醒：{{ enabled ? '开启' : '关闭' }}</output>
  </section>`, style: `.states { display: grid; gap: 16px; max-width: 560px; }
output { color: #a9b9b0; }` }) },
  'radio-group': { title: '互斥选项组', description: '将相关选项组织成可使用方向键浏览的单选组。', code: vueSfc({ imports: ['DlRadioGroup', 'type DlRadioOption'], script: `import { computed, ref } from 'vue'

const status = ref('watching')
const options: DlRadioOption[] = [
  { value: 'planned', label: '计划观看', description: '稍后加入观看队列' },
  { value: 'watching', label: '正在观看', description: '显示在首页继续观看区域' },
  { value: 'completed', label: '已经看完', description: '保留评分和观看记录' },
  { value: 'paused', label: '暂时搁置', disabled: true },
]
const selectedLabel = computed(() => options.find(item => item.value === status.value)?.label)`, template: `  <section class="states">
    <DlRadioGroup v-model="status" :options="options" />
    <output>当前进度：{{ selectedLabel }}</output>
  </section>`, style: `.states { display: grid; gap: 16px; max-width: 560px; }
output { color: #a9b9b0; }` }) },
  slider: { title: '数值与范围选择', description: '支持单值、双端范围、步长、键盘操作以及提交事件。', code: vueSfc({ imports: ['DlSlider'], script: `import { ref } from 'vue'

const score = ref([72])
const range = ref([24, 86])`, template: `  <section class="states">
    <DlSlider v-model="score" label="推荐度" :min="0" :max="100" show-value />
    <DlSlider v-model="range" label="评分范围" :min="0" :max="100" :step="2" show-value />
    <DlSlider :model-value="[38]" label="禁用状态" disabled size="sm" />
  </section>`, style: `.states { display: grid; gap: 24px; max-width: 620px; }` }) },
}[props.componentDefinition.id] ?? { title: props.componentDefinition.name, description: props.componentDefinition.summary, code: '' }))

const content = computed(() => ({
  title: `${meta.value.title} · ${props.componentDefinition.scenarios.find(item => item.id === props.scenario)?.label ?? '案例'}`,
  description: meta.value.description,
  code: meta.value.code,
  tips: ['控件标签和说明文本由同一个组件管理，点击区域完整且语义关联。', '交互行为来自 Reka UI，视觉变体由 Tailwind Variants 和 Dragon Liquid 令牌控制。'],
}))
</script>

<template>
  <DocExampleShell v-bind="content">
    <div v-if="componentDefinition.id === 'checkbox'" class="primitive-stack">
      <DlCheckbox v-model="checked" label="收藏后自动追踪更新" description="新一集发布时同步到待办列表。" />
      <DlCheckbox v-model="mixed" label="选择本季度作品" description="部分条目已选中，显示不确定状态。" />
      <DlCheckbox :model-value="false" label="不可用的选项" disabled />
      <output>当前状态：{{ checked ? '已开启' : '已关闭' }} / {{ mixed }}</output>
    </div>

    <div v-else-if="componentDefinition.id === 'switch'" class="primitive-stack">
      <DlSwitch v-model="enabled" label="更新提醒" description="关注的作品有新一集时发送站内通知。" />
      <DlSwitch :model-value="false" label="移动网络自动播放" size="sm" />
      <DlSwitch :model-value="true" label="管理员策略" disabled />
      <output>提醒：{{ enabled ? '开启' : '关闭' }}</output>
    </div>

    <div v-else-if="componentDefinition.id === 'radio-group'" class="primitive-stack">
      <DlRadioGroup v-model="choice" :options="radioOptions" :orientation="scenario === 'form-integration' ? 'horizontal' : 'vertical'" />
      <output>当前进度：{{ radioOptions.find(item => item.value === choice)?.label }}</output>
    </div>

    <div v-else class="primitive-stack">
      <DlSlider v-if="scenario !== 'form-integration'" v-model="score" label="推荐度" :step="1" show-value />
      <DlSlider v-else v-model="range" label="评分范围" :min="0" :max="100" :step="2" show-value />
      <DlSlider :model-value="[38]" label="禁用状态" disabled size="sm" />
    </div>
  </DocExampleShell>
</template>

<style scoped>
.primitive-stack { display: grid; gap: 1.1rem; width: min(100%, 660px); margin: 0 auto; padding: 1rem; }
.primitive-stack output { justify-self: start; border: 1px solid var(--dl-border); border-radius: 999px; padding: .38rem .7rem; color: var(--dl-text-muted); font-size: .76rem; background: rgba(0,0,0,.16); }
</style>
