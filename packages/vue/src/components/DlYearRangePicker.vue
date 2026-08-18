<script setup lang="ts">
import { endOfYear, getLocalTimeZone, startOfYear, today } from '@internationalized/date'
import { computed, ref, shallowRef, watch } from 'vue'
import type { DateRange, DateValue } from 'reka-ui'
import DecadePickerPanel from './DecadePickerPanel.vue'
import DlPopover from './DlPopover.vue'
import YearPickerPanel from './YearPickerPanel.vue'
import './date-picker-panel.css'

const YEARS_PER_PANEL = 10
const props = withDefaults(defineProps<{ open?: boolean; modelValue?: DateRange | null; placeholder?: string; locale?: string; disabled?: boolean; readonly?: boolean; zIndex?: number }>(), { open: undefined, modelValue: null, placeholder: '选择年份范围', locale: 'zh-CN', disabled: false, readonly: false, zIndex: undefined })
const emit = defineEmits<{ 'update:open': [value: boolean]; 'update:modelValue': [value: DateRange] }>()
type Panel = 'year' | 'decade'

const localOpen = ref(props.open ?? false)
const panels = ref<Panel[]>(['year', 'year'])
const draftStart = shallowRef<DateValue | undefined>(props.modelValue?.start)
const draftEnd = shallowRef<DateValue | undefined>(props.modelValue?.end)
const hoverDate = shallowRef<DateValue | undefined>()
const viewDates = shallowRef<DateValue[]>(buildViewDates())

watch(() => props.open, value => { if (value !== undefined) localOpen.value = value })
const resolvedOpen = computed({ get: () => props.open ?? localOpen.value, set: value => { localOpen.value = value; emit('update:open', value) } })
const formatter = computed(() => new Intl.DateTimeFormat(props.locale, { year: 'numeric' }))
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
  return start.year <= end.year ? { start, end } : { start: end, end: start }
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
  panels.value = ['year', 'year']
  viewDates.value = buildViewDates()
})

function buildViewDates() {
  const first = props.modelValue?.start ?? today(getLocalTimeZone())
  const firstPage = pageStart(first)
  const end = props.modelValue?.end
  const second = end && pageStart(end).year > firstPage.year ? end : firstPage.add({ years: YEARS_PER_PANEL })
  return [first, second]
}

function pageStart(value: DateValue) {
  const year = value.year - (value.year % YEARS_PER_PANEL)
  return startOfYear(value.set({ year }))
}

function toNativeDate(value: DateValue) {
  return 'timeZone' in value ? value.toDate() : value.toDate(getLocalTimeZone())
}

function formatValue(value: DateValue) {
  return formatter.value.format(toNativeDate(value))
}

function updateViewDate(index: number, value: DateValue) {
  const values = [...viewDates.value]
  values[index] = clampDate(value, getPanelMinValue(index), getPanelMaxValue(index))
  viewDates.value = values
}

function getPanelMinValue(index: number) {
  return index > 0 ? startOfYear(pageStart(viewDates.value[index - 1]).add({ years: YEARS_PER_PANEL })) : undefined
}

function getPanelMaxValue(index: number) {
  return index < viewDates.value.length - 1 ? endOfYear(pageStart(viewDates.value[index + 1]).subtract({ years: 1 })) : undefined
}

function clampDate(value: DateValue, min: DateValue | undefined, max: DateValue | undefined) {
  if (min && value.compare(min) < 0)
    return min
  if (max && value.compare(max) > 0)
    return max
  return value
}

function showDecadePanel(index: number) {
  hoverDate.value = undefined
  panels.value[index] = 'decade'
}

function selectPanelDecade(index: number, value: DateValue) {
  updateViewDate(index, value)
  panels.value[index] = 'year'
}

function selectYear(value: DateValue | DateValue[] | undefined) {
  if (!value || Array.isArray(value))
    return
  hoverDate.value = undefined
  if (!draftStart.value || draftEnd.value) {
    draftStart.value = value
    draftEnd.value = undefined
    emit('update:modelValue', { start: value, end: undefined })
    return
  }

  const start = value.year < draftStart.value.year ? value : draftStart.value
  const end = value.year < draftStart.value.year ? draftStart.value : value
  draftStart.value = start
  draftEnd.value = end
  emit('update:modelValue', { start, end })
  resolvedOpen.value = false
}
</script>

<template>
  <DlPopover v-model:open="resolvedOpen" tone="subtle" align="start" :arrow="false" :side-offset="0" content-class="dl-date-picker-panel" :z-index="zIndex">
    <template #trigger><button data-dl data-slot="year-range-picker" type="button" :disabled="disabled" class="flex min-h-11 w-full items-center justify-between gap-3 rounded-[var(--dl-radius-sm)] border border-[var(--dl-border)] bg-[var(--dl-surface)] px-3 text-left text-sm text-[var(--dl-text)] outline-none transition hover:border-[var(--dl-border-strong)] focus-visible:[box-shadow:var(--dl-focus)] disabled:opacity-45"><span :class="!modelValue?.start && 'text-[var(--dl-text-faint)]'">{{ valueText }}</span><span class="text-amber-300" aria-hidden="true">▦</span></button></template>
    <div class="dl-independent-range-panels flex flex-wrap gap-4">
      <section v-for="(viewDate, index) in viewDates" :key="index" data-slot="year-range-picker-panel" :data-panel-index="index" :class="index > 0 && 'dl-range-picker-panel--divided'">
        <YearPickerPanel v-if="panels[index] === 'year'" :model-value="null" :placeholder="viewDate" :locale="locale" :disabled="disabled" :readonly="readonly" :min-value="getPanelMinValue(index)" :max-value="getPanelMaxValue(index)" :years-per-page="YEARS_PER_PANEL" :range-start="previewRange.start" :range-end="previewRange.end" class="border-0 bg-transparent p-0 shadow-none" @hover="hoverDate = $event" @update:model-value="selectYear" @update:placeholder="updateViewDate(index, $event)">
          <template #heading="{ headingValue }"><button data-slot="year-range-picker-decade-trigger" type="button" class="dl-date-picker-heading-trigger font-bold" :aria-label="`选择十年区间，当前${headingValue}`" @click="showDecadePanel(index)">{{ headingValue }}</button></template>
        </YearPickerPanel>
        <DecadePickerPanel v-else :model-value="viewDate" :placeholder="viewDate" :disabled="disabled" :readonly="readonly" :min-value="getPanelMinValue(index)" :max-value="getPanelMaxValue(index)" class="border-0 bg-transparent p-0 shadow-none" @update:model-value="selectPanelDecade(index, $event)" @update:placeholder="updateViewDate(index, $event)" />
      </section>
    </div>
  </DlPopover>
</template>
