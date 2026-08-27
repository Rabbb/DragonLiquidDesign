<script setup lang="ts">
import { TimeFieldInput, TimeFieldRoot, type TimeValue } from 'reka-ui'
import type { DlSize } from '../types'
import { dlDateFieldClass, dlDateSegmentClass } from './date.styles'
import { compareDlTimes, dlClipboardText, parseDlPastedTime } from './date-time-paste'
import './date-time-field.css'

const props = withDefaults(defineProps<{
  modelValue?: TimeValue | null
  locale?: string
  granularity?: 'hour' | 'minute' | 'second'
  hourCycle?: 12 | 24
  minValue?: TimeValue
  maxValue?: TimeValue
  size?: DlSize
  status?: 'default' | 'success' | 'warning' | 'error'
  clearable?: boolean
  disabled?: boolean
  readonly?: boolean
  name?: string
  id?: string
}>(), {
  modelValue: null,
  locale: 'zh-CN',
  granularity: 'minute',
  hourCycle: 24,
  minValue: undefined,
  maxValue: undefined,
  size: 'md',
  status: 'default',
  clearable: false,
  disabled: false,
  readonly: false,
  name: undefined,
  id: undefined,
})
const emit = defineEmits<{
  'update:modelValue': [value: TimeValue | undefined]
  clear: []
  paste: [value: TimeValue, source: string]
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
  const value = parseDlPastedTime(source, props.granularity)
  const unavailable = value && (
    (props.minValue && compareDlTimes(value, props.minValue) < 0)
    || (props.maxValue && compareDlTimes(value, props.maxValue) > 0)
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
  <TimeFieldRoot v-slot="{ segments }" data-dl data-slot="time-field" :data-size="size" :data-status="status" :model-value="modelValue" :locale="locale" :granularity="granularity" :hour-cycle="hourCycle" :min-value="minValue" :max-value="maxValue" :disabled="disabled" :readonly="readonly" :name="name" :id="id" :class="[dlDateFieldClass, 'dl-structured-field']" @paste="handlePaste" @update:model-value="emit('update:modelValue', $event)">
    <slot name="leading" />
    <TimeFieldInput v-for="segment in segments" :key="segment.part" :part="segment.part" :class="dlDateSegmentClass">{{ segment.value }}</TimeFieldInput>
    <button v-if="clearable && modelValue && !disabled && !readonly" type="button" class="dl-structured-field__action" aria-label="清除时间" @click="clearValue">×</button>
    <slot name="trailing" />
  </TimeFieldRoot>
</template>
