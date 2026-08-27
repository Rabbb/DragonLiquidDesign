<script setup lang="ts">
import { computed, ref } from 'vue'
import { DlBadge, DlCard, DlTimeWheel } from '@dragon-liquid/vue'
import DocExampleShell from '../components/DocExampleShell.vue'
import { vueSfc } from './exampleCode'

const props = defineProps<{ scenario: string }>()
const time = ref('20:30')
const content = computed(() => ({
  basic: {
    title: '双列无限时间滚轮',
    description: '小时和分钟都可滚动、鼠标拖动或直接点击，停止后会吸附到中线。',
    code: vueSfc({ imports: ['DlTimeWheel'], script: `import { ref } from 'vue'\n\nconst time = ref('20:30')`, template: `  <DlTimeWheel v-model="time" clearable />` }),
    tips: ['桌面端是居中面板，手机端自动使用底部抽屉。', '最终值始终使用 24 小时制 HH:mm。'],
  },
  'minute-step': {
    title: '分钟步长与快捷时间',
    description: '分钟选项按步长生成，快捷值用于回到业务常用时刻。',
    code: vueSfc({ imports: ['DlTimeWheel'], script: `import { ref } from 'vue'\n\nconst time = ref('20:30')`, template: `  <DlTimeWheel\n    v-model="time"\n    :minute-step="15"\n    shortcut-value="20:30"\n    shortcut-label="晚间摘要"\n  />` }),
    tips: ['minute-step 会限制在 1–30 分钟之间。', '不整除 60 的步长仍会补充 59 分选项。'],
  },
  'disabled-time': {
    title: '限制不可用时间',
    description: 'disabled-time 对每个 HH:mm 值判断，禁用选项和最终应用按钮会同步反馈。',
    code: vueSfc({ imports: ['DlTimeWheel'], script: `import { ref } from 'vue'\n\nconst time = ref('10:30')\nconst disabledTime = (value: string) => value < '09:00' || value > '18:00'`, template: `  <DlTimeWheel v-model="time" :disabled-time="disabledTime" />` }),
    tips: ['禁用规则必须稳定且执行快速。', '如果整小时都不可用，对应小时也会禁用。'],
  },
}[props.scenario] ?? {}) as { title: string; description: string; code: string; tips: string[] })
const disabledTime = (value: string) => value < '09:00' || value > '18:00'
</script>

<template>
  <DocExampleShell v-bind="content">
    <DlCard padding="lg" class="time-wheel-demo">
      <div><DlBadge tone="accent">PORTED FROM TODOMOE</DlBadge><h3>提醒时间</h3><p>用滚轮建立触控友好的时间选择节奏。</p></div>
      <DlTimeWheel v-if="scenario === 'basic'" v-model="time" clearable />
      <DlTimeWheel v-else-if="scenario === 'minute-step'" v-model="time" :minute-step="15" shortcut-value="20:30" shortcut-label="晚间摘要" />
      <DlTimeWheel v-else v-model="time" :disabled-time="disabledTime" />
      <small>当前值：{{ time || '未选择' }}</small>
    </DlCard>
  </DocExampleShell>
</template>

<style scoped>
.time-wheel-demo { display: grid; gap: 18px; max-width: 620px; }
.time-wheel-demo > div { display: grid; gap: 8px; }
.time-wheel-demo h3, .time-wheel-demo p { margin: 0; }
.time-wheel-demo p, .time-wheel-demo > small { color: var(--dl-text-muted); }
</style>
