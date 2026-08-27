<script setup lang="ts">
import { DateFieldInput, DateFieldRoot, type DateValue } from 'reka-ui'
import type { DlSize } from '../types'
import { dlDateFieldClass, dlDateSegmentClass } from './date.styles'
import './date-time-field.css'

withDefaults(defineProps<{
  modelValue?: DateValue | null
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
  id?: string
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
  id: undefined,
})
const emit = defineEmits<{ 'update:modelValue': [value: DateValue | undefined]; clear: [] }>()

function clearValue(event: MouseEvent) {
  event.preventDefault()
  event.stopPropagation()
  emit('update:modelValue', undefined)
  emit('clear')
}
</script>

<template>
  <DateFieldRoot v-slot="{ segments }" data-dl data-slot="date-field" :data-size="size" :data-status="status" :model-value="modelValue" :locale="locale" :granularity="granularity" :hour-cycle="hourCycle" :min-value="minValue" :max-value="maxValue" :is-date-unavailable="isDateUnavailable" :disabled="disabled" :readonly="readonly" :name="name" :id="id" :class="[dlDateFieldClass, 'dl-structured-field']" @update:model-value="emit('update:modelValue', $event)">
    <slot name="leading" />
    <DateFieldInput v-for="segment in segments" :key="segment.part" :part="segment.part" :class="dlDateSegmentClass">{{ segment.value }}</DateFieldInput>
    <button v-if="clearable && modelValue && !disabled && !readonly" type="button" class="dl-structured-field__action" aria-label="清除日期" @click="clearValue">×</button>
    <slot name="trailing" />
  </DateFieldRoot>
</template>
