<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { CalendarDate, Time, DlCalendar, DlDateField, DlDatePicker, DlDateRangeField, DlDateRangePicker, DlMonthPicker, DlMonthRangePicker, DlRangeCalendar, DlTimeField, DlTimeRangeField, DlYearPicker, DlYearRangePicker } from '@dragon-liquid/vue'
import type { ComponentDefinition } from '../catalog'
import DocExampleShell from '../components/DocExampleShell.vue'
import { vueSfc, type VueExampleSource } from './exampleCode'

const props = defineProps<{ scenario: string; componentDefinition: ComponentDefinition }>()
const date = shallowRef(new CalendarDate(2026, 8, 1))
const dateRange = shallowRef({ start: new CalendarDate(2026, 8, 1), end: new CalendarDate(2026, 8, 12) })
const time = shallowRef(new Time(20, 30))
const timeRange = shallowRef({ start: new Time(18, 0), end: new Time(22, 30) })
const componentById: Record<string, string> = {
  calendar: 'DlCalendar', 'date-field': 'DlDateField', 'date-picker': 'DlDatePicker', 'date-range-field': 'DlDateRangeField',
  'date-range-picker': 'DlDateRangePicker', 'range-calendar': 'DlRangeCalendar', 'time-field': 'DlTimeField', 'time-range-field': 'DlTimeRangeField',
  'month-picker': 'DlMonthPicker', 'month-range-picker': 'DlMonthRangePicker', 'year-picker': 'DlYearPicker', 'year-range-picker': 'DlYearRangePicker',
}
const rangeIds = new Set(['date-range-field', 'date-range-picker', 'range-calendar', 'month-range-picker', 'year-range-picker'])
const timeIds = new Set(['time-field', 'time-range-field'])
function sourceFor(id: string): VueExampleSource {
  const component = componentById[id]
  if (id === 'time-range-field') return { imports: [component, 'Time'], script: `import { shallowRef } from 'vue'\n\nconst range = shallowRef({ start: new Time(18, 0), end: new Time(22, 30) })`, template: `  <${component} v-model="range" />` }
  if (id === 'time-field') return { imports: [component, 'Time'], script: `import { shallowRef } from 'vue'\n\nconst time = shallowRef(new Time(20, 30))`, template: `  <${component} v-model="time" />` }
  if (rangeIds.has(id)) return { imports: [component, 'CalendarDate'], script: `import { shallowRef } from 'vue'\n\nconst range = shallowRef({\n  start: new CalendarDate(2026, 8, 1),\n  end: new CalendarDate(2026, 8, 12),\n})`, template: `  <${component} v-model="range" locale="zh-CN" />` }
  return { imports: [component, 'CalendarDate'], script: `import { shallowRef } from 'vue'\n\nconst date = shallowRef(new CalendarDate(2026, 8, 1))`, template: `  <${component} v-model="date" locale="zh-CN" />` }
}
const content = computed(() => ({
  title: `${props.componentDefinition.name} · Alpha 先行体验`, description: props.componentDefinition.summary,
  code: vueSfc(sourceFor(props.componentDefinition.id)),
  tips: ['日期值使用 @internationalized/date 的时区安全对象，并由组件包统一导出。', 'Alpha API 已具备键盘操作和本地化能力，升级时仍需关注变更记录。'],
}))
</script>

<template>
  <DocExampleShell v-bind="content">
    <div class="alpha-date-demo">
      <DlCalendar v-if="componentDefinition.id === 'calendar'" v-model="date" />
      <DlDateField v-else-if="componentDefinition.id === 'date-field'" v-model="date" />
      <DlDatePicker v-else-if="componentDefinition.id === 'date-picker'" v-model="date" />
      <DlDateRangeField v-else-if="componentDefinition.id === 'date-range-field'" v-model="dateRange" />
      <DlDateRangePicker v-else-if="componentDefinition.id === 'date-range-picker'" v-model="dateRange" />
      <DlRangeCalendar v-else-if="componentDefinition.id === 'range-calendar'" v-model="dateRange" />
      <DlTimeField v-else-if="componentDefinition.id === 'time-field'" v-model="time" />
      <DlTimeRangeField v-else-if="componentDefinition.id === 'time-range-field'" v-model="timeRange" />
      <DlMonthPicker v-else-if="componentDefinition.id === 'month-picker'" v-model="date" />
      <DlMonthRangePicker v-else-if="componentDefinition.id === 'month-range-picker'" v-model="dateRange" />
      <DlYearPicker v-else-if="componentDefinition.id === 'year-picker'" v-model="date" />
      <DlYearRangePicker v-else v-model="dateRange" />
      <output>当前值：{{ timeIds.has(componentDefinition.id) ? componentDefinition.id === 'time-field' ? time.toString() : `${timeRange.start} — ${timeRange.end}` : rangeIds.has(componentDefinition.id) ? `${dateRange.start} — ${dateRange.end}` : date.toString() }}</output>
    </div>
  </DocExampleShell>
</template>

<style scoped>
.alpha-date-demo { display: grid; gap: 1rem; width: min(100%, 760px); margin: 0 auto; padding: 1rem; justify-items: start; }.alpha-date-demo output { color: var(--dl-text-faint); font-size: .76rem; }
</style>
