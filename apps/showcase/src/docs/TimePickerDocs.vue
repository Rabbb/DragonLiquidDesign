<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { DlBadge, DlCard, DlTimePicker, Time } from '@dragon-liquid/vue'
import DocExampleShell from '../components/DocExampleShell.vue'
import { vueSfc } from './exampleCode'

const props = defineProps<{ scenario: string }>()
const time = shallowRef(new Time(20, 30))
const disabledTime = (value: string) => value < '09:00' || value > '18:00'
const content = computed(() => ({
  basic: {
    title: '同一个值，两种输入方式',
    description: 'TimePicker 直接复用 TimeField；打开 TIME WHEEL 后仍可精确键入，也可以滚动或拖动选择。',
    code: vueSfc({ imports: ['DlTimePicker', 'Time'], script: `import { shallowRef } from 'vue'\n\nconst time = shallowRef(new Time(20, 30))`, template: `  <DlTimePicker v-model="time" clearable />` }),
    tips: ['面板输入框、小时与分钟滚轮、微调按钮共享同一个草稿值。', '鼠标滚轮的一次连续事件只移动一个可用选项；指针拖动仍按实际位移滚动，不受限速影响。', 'TimeField 与 TimePicker 是两个正式控件，但共享 TimeValue、范围、状态和清除语义。'],
  },
  'minute-step': {
    title: '紧凑按钮与分钟步长',
    description: 'presentation 只改变入口呈现，不会复制或改变滚轮选择逻辑。',
    code: vueSfc({ imports: ['DlTimePicker', 'Time'], script: `import { shallowRef } from 'vue'\n\nconst time = shallowRef(new Time(20, 30))`, template: `  <DlTimePicker\n    v-model="time"\n    presentation="button"\n    :minute-step="15"\n    shortcut-value="20:30"\n    shortcut-label="晚间摘要"\n  />` }),
    tips: ['按钮入口适合工具栏和紧凑表单，默认字段入口适合直接编辑。', '面板可输入任意有效分钟；滚轮按 minute-step 移动可见选项，箭头仍可按 1 分钟微调。'],
  },
  'disabled-time': {
    title: '统一限制可用时段',
    description: '字段的最小/最大值与滚轮的 disabled-time 共同约束同一个 TimeValue。',
    code: vueSfc({ imports: ['DlTimePicker', 'Time'], script: `import { shallowRef } from 'vue'\n\nconst time = shallowRef(new Time(10, 30))\nconst disabledTime = (value: string) => value < '09:00' || value > '18:00'`, template: `  <DlTimePicker\n    v-model="time"\n    :min-value="new Time(9)"\n    :max-value="new Time(18)"\n    :disabled-time="disabledTime"\n  />` }),
    tips: ['范围负责字段输入，disabled-time 可表达午休、预约占用等离散规则。', '禁用规则应稳定且执行快速。'],
  },
}[props.scenario] ?? {}) as { title: string; description: string; code: string; tips: string[] })
</script>

<template>
  <DocExampleShell v-bind="content">
    <DlCard padding="lg" class="time-picker-demo">
      <div><DlBadge tone="accent">FIELD + PICKER</DlBadge><h3>提醒时间</h3><p>精确键入与可视选择共用一个值。</p></div>
      <DlTimePicker
        v-model="time"
        :presentation="scenario === 'minute-step' ? 'button' : 'field'"
        :minute-step="scenario === 'minute-step' ? 15 : 5"
        :min-value="scenario === 'disabled-time' ? new Time(9) : undefined"
        :max-value="scenario === 'disabled-time' ? new Time(18) : undefined"
        :disabled-time="scenario === 'disabled-time' ? disabledTime : undefined"
        :shortcut-value="scenario === 'minute-step' ? '20:30' : undefined"
        shortcut-label="晚间摘要"
        clearable
      />
      <small>当前值：{{ time?.toString() || '未选择' }}</small>
    </DlCard>
  </DocExampleShell>
</template>

<style scoped>
.time-picker-demo { display: grid; gap: 18px; max-width: 620px; }
.time-picker-demo > div { display: grid; gap: 8px; }
.time-picker-demo h3, .time-picker-demo p { margin: 0; }
.time-picker-demo p, .time-picker-demo > small { color: var(--dl-text-muted); }
</style>
