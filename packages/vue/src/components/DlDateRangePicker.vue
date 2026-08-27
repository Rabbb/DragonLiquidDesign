<script setup lang="ts">
import { endOfMonth, getLocalTimeZone, isSameMonth, startOfMonth, today } from '@internationalized/date'
import { computed, ref, shallowRef, watch } from 'vue'
import type { DateRange, DateValue } from 'reka-ui'
import type { DlSize } from '../types'
import { dlClipboardText, parseDlPastedDateRange } from './date-time-paste'
import DlDateRangeField from './DlDateRangeField.vue'
import DlPopover from './DlPopover.vue'
import PickerTriggerButton from './PickerTriggerButton.vue'
import RangePickerCalendarPanel from './RangePickerCalendarPanel.vue'
import './date-picker-panel.css'

type DlDateRangePickerPresentation = 'field' | 'button'

const props = withDefaults(defineProps<{
  open?: boolean
  modelValue?: DateRange | null
  presentation?: DlDateRangePickerPresentation
  placeholder?: string
  locale?: string
  granularity?: 'day' | 'hour' | 'minute' | 'second'
  hourCycle?: 12 | 24
  size?: DlSize
  status?: 'default' | 'success' | 'warning' | 'error'
  clearable?: boolean
  isDateUnavailable?: (date: DateValue) => boolean
  disabled?: boolean
  readonly?: boolean
  name?: string
  minValue?: DateValue
  maxValue?: DateValue
  numberOfMonths?: number
  zIndex?: number
}>(), {
  open: undefined,
  modelValue: null,
  presentation: 'button',
  placeholder: '选择日期范围',
  locale: 'zh-CN',
  granularity: 'day',
  hourCycle: 24,
  size: 'md',
  status: 'default',
  clearable: false,
  isDateUnavailable: undefined,
  disabled: false,
  readonly: false,
  name: undefined,
  minValue: undefined,
  maxValue: undefined,
  numberOfMonths: 2,
  zIndex: undefined,
})
const emit = defineEmits<{
  'update:open': [value: boolean]
  'update:modelValue': [value: DateRange | undefined]
  clear: []
  paste: [value: DateRange, source: string]
  'paste-error': [source: string]
}>()
const localOpen = ref(props.open ?? false)
const draftStart = shallowRef<DateValue | undefined>(props.modelValue?.start)
const draftEnd = shallowRef<DateValue | undefined>(props.modelValue?.end)
const hoverDate = shallowRef<DateValue | undefined>()
const panelCount = computed(() => {
  const requested = Math.max(2, Math.floor(props.numberOfMonths))
  if (!props.minValue || !props.maxValue)
    return requested

  const available = monthDistance(props.minValue, props.maxValue) + 1
  return Math.max(1, Math.min(requested, available))
})
const viewDates = shallowRef<DateValue[]>(buildViewDates())

watch(() => props.open, value => { if (value !== undefined) localOpen.value = value })
const resolvedOpen = computed({ get: () => props.open ?? localOpen.value, set: value => { localOpen.value = value; emit('update:open', value) } })
const valueText = computed(() => {
  if (props.modelValue?.start && props.modelValue?.end)
    return `${props.modelValue.start.toString()} — ${props.modelValue.end.toString()}`
  if (props.modelValue?.start)
    return `${props.modelValue.start.toString()} — …`
  return props.placeholder
})
const previewRange = computed(() => {
  const start = draftStart.value
  const end = draftEnd.value ?? hoverDate.value
  if (!start || !end)
    return { start, end: undefined }
  return start.compare(end) <= 0 ? { start, end } : { start: end, end: start }
})

watch(() => props.modelValue, value => {
  draftStart.value = value?.start
  draftEnd.value = value?.end
  if (!resolvedOpen.value)
    viewDates.value = buildViewDates()
})
watch([() => props.numberOfMonths, () => props.minValue, () => props.maxValue], () => { viewDates.value = buildViewDates() })
watch(resolvedOpen, open => {
  if (!open)
    return
  draftStart.value = props.modelValue?.start
  draftEnd.value = props.modelValue?.end
  hoverDate.value = undefined
  viewDates.value = buildViewDates()
})

function buildViewDates() {
  const count = panelCount.value
  const first = clampDate(props.modelValue?.start ?? today(getLocalTimeZone()), props.minValue, props.maxValue)
  const values = [first]
  if (count > 1) {
    const end = props.modelValue?.end
    values.push(end && monthDistance(first, end) > 0 ? clampDate(end, props.minValue, props.maxValue) : first.add({ months: 1 }))
  }
  while (values.length < count)
    values.push(values.at(-1)!.add({ months: 1 }))

  for (let index = 1; index < values.length; index++) {
    if (monthDistance(values[index - 1], values[index]) <= 0)
      values[index] = values[index - 1].add({ months: 1 })
  }

  if (props.maxValue && monthDistance(values.at(-1)!, props.maxValue) < 0) {
    values[values.length - 1] = props.maxValue
    for (let index = values.length - 2; index >= 0; index--)
      values[index] = values[index + 1].subtract({ months: 1 })
  }

  if (props.minValue && monthDistance(props.minValue, values[0]) < 0) {
    values[0] = props.minValue
    for (let index = 1; index < values.length; index++)
      values[index] = values[index - 1].add({ months: 1 })
  }

  return values
}

function updateViewDate(index: number, value: DateValue) {
  const values = [...viewDates.value]
  const min = getPanelMinValue(index)
  const max = getPanelMaxValue(index)
  values[index] = clampDate(value, min, max)
  viewDates.value = values
}

function getPanelMinValue(index: number) {
  const previousMonth = index > 0 ? startOfMonth(viewDates.value[index - 1].add({ months: 1 })) : undefined
  return laterDate(props.minValue, previousMonth)
}

function getPanelMaxValue(index: number) {
  const nextMonth = index < viewDates.value.length - 1 ? endOfMonth(viewDates.value[index + 1].subtract({ months: 1 })) : undefined
  return earlierDate(props.maxValue, nextMonth)
}

function clampDate(value: DateValue, min: DateValue | undefined, max: DateValue | undefined) {
  if (min && value.compare(min) < 0)
    return min
  if (max && value.compare(max) > 0)
    return max
  return value
}

function laterDate(left: DateValue | undefined, right: DateValue | undefined) {
  if (!left)
    return right
  if (!right)
    return left
  return left.compare(right) >= 0 ? left : right
}

function earlierDate(left: DateValue | undefined, right: DateValue | undefined) {
  if (!left)
    return right
  if (!right)
    return left
  return left.compare(right) <= 0 ? left : right
}

function monthDistance(left: DateValue, right: DateValue) {
  if (isSameMonth(left, right))
    return 0
  return (right.year - left.year) * 12 + right.month - left.month
}

function selectDate(value: DateValue) {
  hoverDate.value = undefined
  if (!draftStart.value || draftEnd.value) {
    draftStart.value = value
    draftEnd.value = undefined
    emit('update:modelValue', { start: value, end: undefined })
    return
  }

  const start = value.compare(draftStart.value) < 0 ? value : draftStart.value
  const end = value.compare(draftStart.value) < 0 ? draftStart.value : value
  draftStart.value = start
  draftEnd.value = end
  emit('update:modelValue', { start, end })
  resolvedOpen.value = false
}

function updateField(value: DateRange | undefined) {
  emit('update:modelValue', value)
}

function clearValue() {
  draftStart.value = undefined
  draftEnd.value = undefined
  hoverDate.value = undefined
  emit('update:modelValue', undefined)
  emit('clear')
  resolvedOpen.value = false
}

function openPicker() {
  if (!props.disabled && !props.readonly)
    resolvedOpen.value = true
}

function handleTriggerPaste(event: ClipboardEvent) {
  if (props.disabled || props.readonly) return
  const source = dlClipboardText(event)
  const value = parseDlPastedDateRange(source, props.granularity)
  const unavailable = value && [value.start, value.end].some(date =>
    (props.minValue && date.compare(props.minValue) < 0)
    || (props.maxValue && date.compare(props.maxValue) > 0)
    || props.isDateUnavailable?.(date),
  )
  if (!value || unavailable) {
    emit('paste-error', source)
    return
  }
  event.preventDefault()
  emit('update:modelValue', value)
  emit('paste', value, source)
  resolvedOpen.value = false
}
</script>

<template>
  <DlPopover v-model:open="resolvedOpen" tone="subtle" align="start" :arrow="false" :side-offset="0" content-class="dl-date-picker-panel" :manual-trigger="presentation === 'field'" :z-index="zIndex">
    <template #trigger>
      <DlDateRangeField
        v-if="presentation === 'field'"
        :model-value="modelValue"
        :locale="locale"
        :granularity="granularity"
        :hour-cycle="hourCycle"
        :min-value="minValue"
        :max-value="maxValue"
        :is-date-unavailable="isDateUnavailable"
        :size="size"
        :status="status"
        :clearable="clearable"
        :disabled="disabled"
        :readonly="readonly"
        :name="name"
        class="w-full"
        @keydown.alt.down.prevent="openPicker"
        @update:model-value="updateField"
        @clear="emit('clear')"
        @paste="(value, source) => emit('paste', value, source)"
        @paste-error="emit('paste-error', $event)"
      >
        <template #trailing><button type="button" data-slot="date-range-picker-trigger" class="dl-structured-field__action text-[var(--dl-accent)]" aria-label="打开日期范围选择器" :aria-expanded="resolvedOpen" :disabled="disabled || readonly" @click="openPicker">▦</button></template>
      </DlDateRangeField>
      <PickerTriggerButton v-else data-slot="date-range-picker" data-presentation="button" :value="modelValue?.start ? valueText : ''" :placeholder="placeholder" :size="size" :status="status" :disabled="disabled || readonly" @keydown.alt.down.prevent="openPicker" @paste="handleTriggerPaste" />
    </template>
    <div class="dl-independent-range-panels flex flex-wrap gap-4">
      <section v-for="(viewDate, index) in viewDates" :key="index" data-slot="range-picker-panel" :data-panel-index="index" :class="index > 0 && 'dl-range-picker-panel--divided'">
        <RangePickerCalendarPanel :placeholder="viewDate" :range-start="previewRange.start" :range-end="previewRange.end" :locale="locale" :disabled="disabled" :min-value="getPanelMinValue(index)" :max-value="getPanelMaxValue(index)" :is-date-unavailable="isDateUnavailable" class="border-0 bg-transparent p-0 shadow-none" @hover="hoverDate = $event" @select="selectDate" @update:placeholder="updateViewDate(index, $event)" />
      </section>
    </div>
    <button v-if="clearable && modelValue?.start && !readonly" type="button" class="dl-picker-panel-clear" :disabled="disabled" @click="clearValue">清除日期范围</button>
  </DlPopover>
</template>
