<script setup lang="ts">
import { computed, ref, shallowRef } from 'vue'
import { CalendarDate, Time, DlCalendar, DlDateField, DlDatePicker, DlDateRangeField, DlDateRangePicker, DlMonthPicker, DlMonthRangePicker, DlRangeCalendar, DlTimeField, DlTimeRangeField, DlYearPicker, DlYearRangePicker } from '@dragon-liquid/vue'
import type { DlCalendarDay, DlCalendarItem } from '@dragon-liquid/vue'
import type { ComponentDefinition } from '../catalog'
import { componentGuidanceFor } from '../componentGuidance'
import DocExampleShell from '../components/DocExampleShell.vue'
import { vueSfc, type VueExampleSource } from './exampleCode'

const props = defineProps<{ scenario: string; componentDefinition: ComponentDefinition }>()
const date = shallowRef(new CalendarDate(2026, 8, 1))
const calendarDate = ref('2026-08-28')
const calendarView = ref('2026-08')
const calendarItems = ref<DlCalendarItem[]>([
  { id: 1, date: '2026-08-03', title: '整理需求', color: '#71d1ad' },
  { id: 2, date: '2026-08-03', title: '接口联调', color: '#8fb9e8' },
  { id: 3, date: '2026-08-11', title: '版本评审', color: '#e4b76a' },
  { id: 4, date: '2026-08-28', title: '组件验收', color: '#ef9fbd' },
])
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
  const style = `.example { display: grid; justify-items: start; gap: 12px; }\noutput { color: #a9b9b0; }`
  if (id === 'calendar') return { imports: [component, 'type DlCalendarItem'], script: `import { ref } from 'vue'\n\nconst selected = ref('2026-08-28')\nconst view = ref('2026-08')\nconst items = ref<DlCalendarItem[]>([\n  { id: 1, date: '2026-08-03', title: '整理需求', color: '#71d1ad' },\n  { id: 2, date: '2026-08-11', title: '版本评审', color: '#e4b76a' },\n])\nfunction move(item: DlCalendarItem, day: { key: string }) {\n  items.value = items.value.map(value => value.id === item.id ? { ...value, date: day.key } : value)\n}`, template: `  <${component}\n    v-model="selected"\n    v-model:view-value="view"\n    :items="items"\n    show-create\n    height="520px"\n    @item-drop="move"\n  />`, style: `.example { height: min(70vh, 560px); }` }
  if (id === 'time-range-field') return { imports: [component, 'Time'], script: `import { shallowRef } from 'vue'\n\nconst range = shallowRef({ start: new Time(18, 0), end: new Time(22, 30) })`, template: `  <section class="example">\n    <${component} v-model="range" aria-label="播放时段" />\n    <output>当前范围：{{ range.start.toString() }} — {{ range.end.toString() }}</output>\n  </section>`, style }
  if (id === 'time-field') return { imports: [component, 'Time'], script: `import { shallowRef } from 'vue'\n\nconst time = shallowRef(new Time(20, 30))`, template: `  <section class="example">\n    <${component} v-model="time" aria-label="播放时间" />\n    <output>当前时间：{{ time.toString() }}</output>\n  </section>`, style }
  if (rangeIds.has(id)) return { imports: [component, 'CalendarDate'], script: `import { shallowRef } from 'vue'\n\nconst range = shallowRef({\n  start: new CalendarDate(2026, 8, 1),\n  end: new CalendarDate(2026, 8, 12),\n})`, template: `  <section class="example">\n    <${component} v-model="range" locale="zh-CN" aria-label="日期范围" />\n    <output>当前范围：{{ range.start.toString() }} — {{ range.end.toString() }}</output>\n  </section>`, style }
  return { imports: [component, 'CalendarDate'], script: `import { shallowRef } from 'vue'\n\nconst date = shallowRef(new CalendarDate(2026, 8, 1))`, template: `  <section class="example">\n    <${component} v-model="date" locale="zh-CN" aria-label="日期" />\n    <output>当前日期：{{ date.toString() }}</output>\n  </section>`, style }
}
const content = computed(() => ({
  title: `${props.componentDefinition.name} · Alpha 先行体验`, description: componentGuidanceFor(props.componentDefinition.id).example,
  code: vueSfc(sourceFor(props.componentDefinition.id)),
  tips: ['日期值使用 @internationalized/date 的时区安全对象，并由组件包统一导出。', 'Alpha API 已具备键盘操作和本地化能力，升级时仍需关注变更记录。'],
}))

function moveCalendarItem(item: DlCalendarItem, day: DlCalendarDay) {
  calendarItems.value = calendarItems.value.map(value => value.id === item.id ? { ...value, date: day.key } : value)
}

function createCalendarItem(day: DlCalendarDay) {
  calendarItems.value = [...calendarItems.value, { id: Date.now(), date: day.key, title: '新事项', color: '#9ad6bf' }]
}
</script>

<template>
  <DocExampleShell v-bind="content">
    <div class="alpha-date-demo">
      <DlCalendar v-if="componentDefinition.id === 'calendar'" v-model="calendarDate" v-model:view-value="calendarView" :items="calendarItems" :height="scenario === 'adaptive' ? 420 : 520" :show-create="scenario !== 'basic'" locale="zh-CN" @item-drop="moveCalendarItem" @item-move="moveCalendarItem" @create="createCalendarItem" />
      <DlDateField v-else-if="componentDefinition.id === 'date-field'" v-model="date" locale="zh-CN" aria-label="日期" />
      <DlDatePicker v-else-if="componentDefinition.id === 'date-picker'" v-model="date" locale="zh-CN" aria-label="日期" />
      <DlDateRangeField v-else-if="componentDefinition.id === 'date-range-field'" v-model="dateRange" locale="zh-CN" aria-label="日期范围" />
      <DlDateRangePicker v-else-if="componentDefinition.id === 'date-range-picker'" v-model="dateRange" locale="zh-CN" aria-label="日期范围" />
      <DlRangeCalendar v-else-if="componentDefinition.id === 'range-calendar'" v-model="dateRange" locale="zh-CN" aria-label="日期范围" />
      <DlTimeField v-else-if="componentDefinition.id === 'time-field'" v-model="time" aria-label="播放时间" />
      <DlTimeRangeField v-else-if="componentDefinition.id === 'time-range-field'" v-model="timeRange" aria-label="播放时段" />
      <DlMonthPicker v-else-if="componentDefinition.id === 'month-picker'" v-model="date" locale="zh-CN" aria-label="月份" />
      <DlMonthRangePicker v-else-if="componentDefinition.id === 'month-range-picker'" v-model="dateRange" locale="zh-CN" aria-label="月份范围" />
      <DlYearPicker v-else-if="componentDefinition.id === 'year-picker'" v-model="date" locale="zh-CN" aria-label="年份" />
      <DlYearRangePicker v-else v-model="dateRange" locale="zh-CN" aria-label="年份范围" />
      <output>当前值：{{ componentDefinition.id === 'calendar' ? calendarDate : timeIds.has(componentDefinition.id) ? componentDefinition.id === 'time-field' ? time.toString() : `${timeRange.start} — ${timeRange.end}` : rangeIds.has(componentDefinition.id) ? `${dateRange.start} — ${dateRange.end}` : date.toString() }}</output>
    </div>
  </DocExampleShell>
</template>

<style scoped>
.alpha-date-demo { display: grid; gap: 1rem; width: min(100%, 980px); margin: 0 auto; padding: 1rem; justify-items: start; }.alpha-date-demo output { color: var(--dl-text-faint); font-size: .76rem; }
.alpha-date-demo > [data-slot='calendar'] { justify-self: stretch; }
</style>
