<script setup lang="ts">
import { endOfYear, getLocalTimeZone, startOfYear, today } from '@internationalized/date'
import { computed, ref, shallowRef, watch } from 'vue'
import type { DateRange, DateValue } from 'reka-ui'
import DlPopover from './DlPopover.vue'
import MonthPickerPanel from './MonthPickerPanel.vue'
import YearPickerPanel from './YearPickerPanel.vue'
import './date-picker-panel.css'

const props = withDefaults(defineProps<{ open?: boolean; modelValue?: DateRange | null; placeholder?: string; locale?: string; disabled?: boolean; readonly?: boolean; zIndex?: number }>(), { open: undefined, modelValue: null, placeholder: '选择月份范围', locale: 'zh-CN', disabled: false, readonly: false, zIndex: undefined })
const emit = defineEmits<{ 'update:open': [value: boolean]; 'update:modelValue': [value: DateRange] }>()
type Panel = 'month' | 'year'

const localOpen = ref(props.open ?? false)
const panels = ref<Panel[]>(['month', 'month'])
const draftStart = shallowRef<DateValue | undefined>(props.modelValue?.start)
const draftEnd = shallowRef<DateValue | undefined>(props.modelValue?.end)
const hoverDate = shallowRef<DateValue | undefined>()
const viewDates = shallowRef<DateValue[]>(buildViewDates())

watch(() => props.open, value => { if (value !== undefined) localOpen.value = value })
const resolvedOpen = computed({ get: () => props.open ?? localOpen.value, set: value => { localOpen.value = value; emit('update:open', value) } })
const formatter = computed(() => new Intl.DateTimeFormat(props.locale, { year: 'numeric', month: 'long' }))
const yearFormatter = computed(() => new Intl.DateTimeFormat(props.locale, { year: 'numeric' }))
const valueText = computed(() => {
  if (props.modelValue?.start && props.modelValue?.end)
    return `${formatValue(props.modelValue.start)} — ${formatValue(props.modelValue.end)}`
  if (props.modelValue?.start)
    return `${formatValue(props.modelValue.start)} — …`
  return props.placeholder
})
const previewRange = computed(() => {
  const start = draftStart.value
  const end = draftEnd.value ?? hoverDate.value
  if (!start || !end)
    return { start, end: undefined }
  return compareMonth(start, end) <= 0 ? { start, end } : { start: end, end: start }
})

watch(() => props.modelValue, value => {
  draftStart.value = value?.start
  draftEnd.value = value?.end
  if (!resolvedOpen.value)
    viewDates.value = buildViewDates()
})
watch(resolvedOpen, open => {
  if (!open)
    return
  draftStart.value = props.modelValue?.start
  draftEnd.value = props.modelValue?.end
  hoverDate.value = undefined
  panels.value = ['month', 'month']
  viewDates.value = buildViewDates()
})

function buildViewDates() {
  const first = props.modelValue?.start ?? today(getLocalTimeZone())
  const end = props.modelValue?.end
  return [first, end && end.year > first.year ? end : first.add({ years: 1 })]
}

function toNativeDate(value: DateValue) {
  return 'timeZone' in value ? value.toDate() : value.toDate(getLocalTimeZone())
}

function formatValue(value: DateValue) {
  return formatter.value.format(toNativeDate(value))
}

function formatYear(value: DateValue) {
  return yearFormatter.value.format(toNativeDate(value))
}

function compareMonth(left: DateValue, right: DateValue) {
  return (left.year - right.year) * 12 + left.month - right.month
}

function updateViewDate(index: number, value: DateValue) {
  const values = [...viewDates.value]
  values[index] = clampDate(value, getPanelMinValue(index), getPanelMaxValue(index))
  viewDates.value = values
}

function getPanelMinValue(index: number) {
  return index > 0 ? startOfYear(viewDates.value[index - 1].add({ years: 1 })) : undefined
}

function getPanelMaxValue(index: number) {
  return index < viewDates.value.length - 1 ? endOfYear(viewDates.value[index + 1].subtract({ years: 1 })) : undefined
}

function clampDate(value: DateValue, min: DateValue | undefined, max: DateValue | undefined) {
  if (min && value.compare(min) < 0)
    return min
  if (max && value.compare(max) > 0)
    return max
  return value
}

function showYearPanel(index: number) {
  hoverDate.value = undefined
  panels.value[index] = 'year'
}

function selectPanelYear(index: number, value: DateValue | DateValue[] | undefined) {
  if (!value || Array.isArray(value))
    return
  updateViewDate(index, value)
  panels.value[index] = 'month'
}

function selectMonth(value: DateValue | DateValue[] | undefined) {
  if (!value || Array.isArray(value))
    return
  hoverDate.value = undefined
  if (!draftStart.value || draftEnd.value) {
    draftStart.value = value
    draftEnd.value = undefined
    emit('update:modelValue', { start: value, end: undefined })
    return
  }

  const start = compareMonth(value, draftStart.value) < 0 ? value : draftStart.value
  const end = compareMonth(value, draftStart.value) < 0 ? draftStart.value : value
  draftStart.value = start
  draftEnd.value = end
  emit('update:modelValue', { start, end })
  resolvedOpen.value = false
}
</script>

<template>
  <DlPopover v-model:open="resolvedOpen" tone="subtle" align="start" :arrow="false" :side-offset="0" content-class="dl-date-picker-panel" :z-index="zIndex">
    <template #trigger><button data-dl data-slot="month-range-picker" type="button" :disabled="disabled" class="flex min-h-11 w-full items-center justify-between gap-3 rounded-[var(--dl-radius-sm)] border border-[var(--dl-border)] bg-[var(--dl-surface)] px-3 text-left text-sm text-[var(--dl-text)] outline-none transition hover:border-[var(--dl-border-strong)] focus-visible:[box-shadow:var(--dl-focus)] disabled:opacity-45"><span :class="!modelValue?.start && 'text-[var(--dl-text-faint)]'">{{ valueText }}</span><span class="text-amber-300" aria-hidden="true">▦</span></button></template>
    <div class="dl-independent-range-panels flex flex-wrap gap-4">
      <section v-for="(viewDate, index) in viewDates" :key="index" data-slot="month-range-picker-panel" :data-panel-index="index" :class="index > 0 && 'dl-range-picker-panel--divided'">
        <MonthPickerPanel v-if="panels[index] === 'month'" :model-value="null" :placeholder="viewDate" :locale="locale" :disabled="disabled" :readonly="readonly" :min-value="getPanelMinValue(index)" :max-value="getPanelMaxValue(index)" :range-start="previewRange.start" :range-end="previewRange.end" class="border-0 bg-transparent p-0 shadow-none" @hover="hoverDate = $event" @update:model-value="selectMonth" @update:placeholder="updateViewDate(index, $event)">
          <template #heading="{ date }"><button data-slot="month-range-picker-year-trigger" type="button" class="dl-date-picker-heading-trigger font-bold" :aria-label="`选择年份，当前${formatYear(date)}`" @click="showYearPanel(index)">{{ formatYear(date) }}</button></template>
        </MonthPickerPanel>
        <YearPickerPanel v-else :model-value="viewDate" :placeholder="viewDate" :locale="locale" :disabled="disabled" :readonly="readonly" :min-value="getPanelMinValue(index)" :max-value="getPanelMaxValue(index)" prevent-deselect class="border-0 bg-transparent p-0 shadow-none" @update:model-value="selectPanelYear(index, $event)" @update:placeholder="updateViewDate(index, $event)" />
      </section>
    </div>
  </DlPopover>
</template>
