<script setup lang="ts">
import { DateRangeFieldInput, DateRangeFieldRoot, type DateRange } from 'reka-ui'
import type { DateValue } from 'reka-ui'
import type { DlSize } from '../types'
import { dlDateFieldClass, dlDateSegmentClass } from './date.styles'
import { dlClipboardText, parseDlPastedDateRange } from './date-time-paste'
import './date-time-field.css'

const props = withDefaults(defineProps<{
  modelValue?: DateRange | null
  locale?: string
  granularity?: 'day' | 'hour' | 'minute' | 'second'
  hourCycle?: 12 | 24
  minValue?: DateValue
  maxValue?: DateValue
  isDateUnavailable?: (date: DateValue) => boolean
  size?: DlSize
  status?: 'default' | 'success' | 'warning' | 'error'
  clearable?: boolean
  disabled?: boolean
  readonly?: boolean
  name?: string
}>(), {
  modelValue: null,
  locale: 'zh-CN',
  granularity: 'day',
  hourCycle: 24,
  minValue: undefined,
  maxValue: undefined,
  isDateUnavailable: undefined,
  size: 'md',
  status: 'default',
  clearable: false,
  disabled: false,
  readonly: false,
  name: undefined,
})
const emit = defineEmits<{
  'update:modelValue': [value: DateRange | undefined]
  clear: []
  paste: [value: DateRange, source: string]
  'paste-error': [source: string]
}>()

function clearValue(event: MouseEvent) {
  event.preventDefault()
  event.stopPropagation()
  emit('update:modelValue', undefined)
  emit('clear')
}

function handlePaste(event: ClipboardEvent) {
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
}
</script>

<template>
  <DateRangeFieldRoot v-slot="{ segments }" data-dl data-slot="date-range-field" :data-size="size" :data-status="status" :model-value="modelValue" :locale="locale" :granularity="granularity" :hour-cycle="hourCycle" :min-value="minValue" :max-value="maxValue" :is-date-unavailable="isDateUnavailable" :disabled="disabled" :readonly="readonly" :name="name" :class="[dlDateFieldClass, 'dl-structured-field']" @paste="handlePaste" @update:model-value="emit('update:modelValue', $event)">
    <slot name="leading" />
    <DateRangeFieldInput v-for="segment in segments.start" :key="`start-${segment.part}`" type="start" :part="segment.part" :class="dlDateSegmentClass">{{ segment.value }}</DateRangeFieldInput>
    <span class="px-1 text-[var(--dl-text-faint)]" aria-hidden="true">—</span>
    <DateRangeFieldInput v-for="segment in segments.end" :key="`end-${segment.part}`" type="end" :part="segment.part" :class="dlDateSegmentClass">{{ segment.value }}</DateRangeFieldInput>
    <button v-if="clearable && modelValue?.start && !disabled && !readonly" type="button" class="dl-structured-field__action" aria-label="清除日期范围" @click="clearValue">×</button>
    <slot name="trailing" />
  </DateRangeFieldRoot>
</template>
