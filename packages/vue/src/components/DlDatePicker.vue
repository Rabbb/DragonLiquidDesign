<script setup lang="ts">
import { getLocalTimeZone, today } from '@internationalized/date'
import { computed, ref, shallowRef, watch } from 'vue'
import type { DateValue } from 'reka-ui'
import type { DlSize } from '../types'
import { dlClipboardText, parseDlPastedDate } from './date-time-paste'
import DatePickerCalendarPanel from './DatePickerCalendarPanel.vue'
import DlDateField from './DlDateField.vue'
import MonthPickerPanel from './MonthPickerPanel.vue'
import DlPopover from './DlPopover.vue'
import PickerTriggerButton from './PickerTriggerButton.vue'
import YearPickerPanel from './YearPickerPanel.vue'
import './date-picker-panel.css'

export type DlDatePickerPresentation = 'field' | 'button'

const props = withDefaults(defineProps<{
  open?: boolean
  modelValue?: DateValue | null
  presentation?: DlDatePickerPresentation
  placeholder?: string
  locale?: string
  granularity?: 'day' | 'hour' | 'minute' | 'second'
  hourCycle?: 12 | 24
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  minValue?: DateValue
  maxValue?: DateValue
  isDateDisabled?: (date: DateValue) => boolean
  isDateUnavailable?: (date: DateValue) => boolean
  size?: DlSize
  status?: 'default' | 'success' | 'warning' | 'error'
  clearable?: boolean
  disabled?: boolean
  readonly?: boolean
  name?: string
  id?: string
  zIndex?: number
}>(), {
  open: undefined,
  modelValue: null,
  presentation: 'button',
  placeholder: '选择日期',
  locale: 'zh-CN',
  granularity: 'day',
  hourCycle: 24,
  weekStartsOn: 1,
  minValue: undefined,
  maxValue: undefined,
  isDateDisabled: undefined,
  isDateUnavailable: undefined,
  size: 'md',
  status: 'default',
  clearable: false,
  disabled: false,
  readonly: false,
  name: undefined,
  id: undefined,
  zIndex: undefined,
})
const emit = defineEmits<{
  'update:open': [value: boolean]
  'update:modelValue': [value: DateValue | undefined]
  clear: []
  paste: [value: DateValue, source: string]
  'paste-error': [source: string]
}>()
type Panel = 'day' | 'month' | 'year'

const localOpen = ref(props.open ?? false)
const panel = ref<Panel>('day')
const viewDate = shallowRef<DateValue>(props.modelValue ?? today(getLocalTimeZone()))

watch(() => props.open, value => { if (value !== undefined) localOpen.value = value })
const resolvedOpen = computed({ get: () => props.open ?? localOpen.value, set: value => { localOpen.value = value; emit('update:open', value) } })
const valueText = computed(() => props.modelValue?.toString() ?? props.placeholder)
const yearFormatter = computed(() => new Intl.DateTimeFormat(props.locale, { year: 'numeric' }))
const monthFormatter = computed(() => new Intl.DateTimeFormat(props.locale, { month: 'long' }))

watch(() => props.modelValue, value => {
  if (value)
    viewDate.value = value
})
watch(resolvedOpen, open => {
  if (open)
    resetPanel()
})

function resetPanel() {
  panel.value = 'day'
  viewDate.value = props.modelValue ?? today(getLocalTimeZone())
}

function toNativeDate(value: DateValue) {
  return 'timeZone' in value ? value.toDate() : value.toDate(getLocalTimeZone())
}

function formatYear(value: DateValue) {
  return yearFormatter.value.format(toNativeDate(value))
}

function formatMonth(value: DateValue) {
  return monthFormatter.value.format(toNativeDate(value))
}

function selectYear(value: DateValue | DateValue[] | undefined) {
  if (!value || Array.isArray(value))
    return
  viewDate.value = value
  panel.value = 'month'
}

function selectMonth(value: DateValue | DateValue[] | undefined) {
  if (!value || Array.isArray(value))
    return
  viewDate.value = value
  panel.value = 'day'
}

function update(value: DateValue | undefined) {
  emit('update:modelValue', value)
  if (value)
    resolvedOpen.value = false
}

function updateField(value: DateValue | undefined) {
  emit('update:modelValue', value)
}

function clearValue() {
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
  const value = parseDlPastedDate(source, props.granularity)
  const unavailable = value && (
    (props.minValue && value.compare(props.minValue) < 0)
    || (props.maxValue && value.compare(props.maxValue) > 0)
    || props.isDateDisabled?.(value)
    || props.isDateUnavailable?.(value)
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
      <DlDateField
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
        :id="id"
        class="w-full"
        @keydown.alt.down.prevent="openPicker"
        @update:model-value="updateField"
        @clear="emit('clear')"
        @paste="(value, source) => emit('paste', value, source)"
        @paste-error="emit('paste-error', $event)"
      >
        <template #trailing><button type="button" data-slot="date-picker-trigger" class="dl-structured-field__action text-[var(--dl-accent)]" aria-label="打开日期选择器" :aria-expanded="resolvedOpen" :disabled="disabled || readonly" @click="openPicker">▦</button></template>
      </DlDateField>
      <PickerTriggerButton v-else data-slot="date-picker" data-presentation="button" :value="modelValue ? valueText : ''" :placeholder="placeholder" :size="size" :status="status" :disabled="disabled || readonly" @keydown.alt.down.prevent="openPicker" @paste="handleTriggerPaste" />
    </template>
    <DatePickerCalendarPanel v-if="panel === 'day'" :model-value="modelValue" :placeholder="viewDate" :locale="locale" :week-starts-on="weekStartsOn" :min-value="minValue" :max-value="maxValue" :is-date-disabled="isDateDisabled" :is-date-unavailable="isDateUnavailable" :disabled="disabled" :readonly="readonly" class="border-0 bg-transparent p-0 shadow-none" @update:model-value="update" @update:placeholder="viewDate = $event">
      <template #heading="{ date }">
        <div class="flex items-center justify-center gap-0.5 font-bold text-[var(--dl-text)]">
          <button data-slot="date-picker-year-trigger" type="button" class="dl-date-picker-heading-trigger" :aria-label="`选择年份，当前${formatYear(date)}`" @click="panel = 'year'">{{ formatYear(date) }}</button>
          <button data-slot="date-picker-month-trigger" type="button" class="dl-date-picker-heading-trigger" :aria-label="`选择月份，当前${formatMonth(date)}`" @click="panel = 'month'">{{ formatMonth(date) }}</button>
        </div>
      </template>
    </DatePickerCalendarPanel>
    <MonthPickerPanel v-else-if="panel === 'month'" :model-value="viewDate" :placeholder="viewDate" :locale="locale" prevent-deselect class="border-0 bg-transparent p-0 shadow-none" @update:model-value="selectMonth" @update:placeholder="viewDate = $event">
      <template #heading="{ date }"><button data-slot="date-picker-year-trigger" type="button" class="dl-date-picker-heading-trigger font-bold" :aria-label="`选择年份，当前${formatYear(date)}`" @click="panel = 'year'">{{ formatYear(date) }}</button></template>
    </MonthPickerPanel>
    <YearPickerPanel v-else :model-value="viewDate" :placeholder="viewDate" :locale="locale" prevent-deselect class="border-0 bg-transparent p-0 shadow-none" @update:model-value="selectYear" @update:placeholder="viewDate = $event" />
    <button v-if="clearable && modelValue && !readonly" type="button" class="dl-picker-panel-clear" :disabled="disabled" @click="clearValue">清除日期</button>
  </DlPopover>
</template>
