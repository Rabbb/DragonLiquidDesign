<script setup lang="ts">
import { getLocalTimeZone, parseDate, Time, today } from '@internationalized/date'
import { computed, ref, useAttrs } from 'vue'
import type { DateValue, TimeValue } from 'reka-ui'
import type { DlSize } from '../types'
import DlDatePicker from './DlDatePicker.vue'
import DlTimePicker from './DlTimePicker.vue'
import { dlClipboardText, parseDlPastedDateTimeLocal } from './date-time-paste'
import { parseDlTimeWheelValue } from './time-wheel.utils'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{
  modelValue?: string | null
  min?: string
  max?: string
  step?: number
  locale?: string
  size?: DlSize
  status?: 'default' | 'success' | 'warning' | 'error'
  disabled?: boolean
  readonly?: boolean
  clearable?: boolean
  nowShortcut?: boolean
}>(), {
  modelValue: '', min: undefined, max: undefined, step: 300, locale: 'zh-CN', size: 'md',
  status: 'default', disabled: false, readonly: false, clearable: true, nowShortcut: true,
})
const emit = defineEmits<{
  'update:modelValue': [value: string]
  clear: []
  shortcut: [value: string]
  paste: [value: string, source: string]
  'paste-error': [source: string]
}>()
const attrs = useAttrs()
const dateOpen = ref(false)
const datePart = computed(() => props.modelValue?.split('T')[0] ?? '')
const timePart = computed(() => props.modelValue?.split('T')[1]?.slice(0, 5) ?? '')
const timeValue = computed(() => {
  const value = parseDlTimeWheelValue(timePart.value)
  return value ? new Time(value.hour, value.minute) : undefined
})
const dateValue = computed(() => { try { return datePart.value ? parseDate(datePart.value) : undefined } catch { return undefined } })
const minuteStep = computed(() => Math.max(1, Math.round(props.step / 60)))
const now = computed(() => { const date = new Date(); return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}` })
function normalize(value: string) {
  if (props.min && value < props.min) return props.min
  if (props.max && value > props.max) return props.max
  return value
}
function updateDate(value: DateValue | undefined) { emit('update:modelValue', value ? normalize(`${value.toString()}T${timePart.value || '09:00'}`) : '') }
function updateTime(value: TimeValue | undefined) {
  const time = value ? `${String(value.hour).padStart(2, '0')}:${String(value.minute).padStart(2, '0')}` : ''
  emit('update:modelValue', time ? normalize(`${datePart.value || today(getLocalTimeZone()).toString()}T${time}`) : '')
}
function useNow() { const value = normalize(`${today(getLocalTimeZone()).toString()}T${now.value}`); emit('update:modelValue', value); emit('shortcut', value) }
function clear() { emit('update:modelValue', ''); emit('clear') }
function disabledTime(value: string) {
  const date = datePart.value || today(getLocalTimeZone()).toString()
  return Boolean((props.min && `${date}T${value}` < props.min) || (props.max && `${date}T${value}` > props.max))
}
function updateNative(event: Event) {
  emit('update:modelValue', normalize((event.target as HTMLInputElement).value))
}
function handlePaste(event: ClipboardEvent, reportError = true) {
  if (props.disabled || props.readonly) return
  const source = dlClipboardText(event)
  const value = parseDlPastedDateTimeLocal(source)
  if (!value) {
    if (reportError) emit('paste-error', source)
    return
  }
  event.preventDefault()
  const normalized = normalize(value)
  emit('update:modelValue', normalized)
  emit('paste', normalized, source)
}
</script>

<template>
  <div data-dl data-slot="input-datetime-local" class="dl-input-date-control" :data-size="size" :data-status="status" @paste.capture="handlePaste($event, false)">
    <input v-bind="attrs" type="datetime-local" :value="modelValue ?? ''" :min="min" :max="max" :step="step" :disabled="disabled" :readonly="readonly" class="dl-input-native" tabindex="-1" aria-hidden="true" @input="updateNative" @change="updateNative" @paste="handlePaste">
    <div class="dl-input-datetime">
      <DlDatePicker v-model:open="dateOpen" :model-value="dateValue" presentation="field" placeholder="选择日期" :locale="locale" :disabled="disabled || readonly" @update:model-value="updateDate" />
      <DlTimePicker :model-value="timeValue" presentation="field" placeholder="选择时间" :minute-step="minuteStep" :size="size" :status="status" :shortcut-value="nowShortcut ? now : undefined" shortcut-label="当前时间" :disabled-time="disabledTime" :disabled="disabled" :readonly="readonly" @update:model-value="updateTime" />
    </div>
    <span class="dl-input-date-control__actions">
      <button v-if="nowShortcut && !readonly" type="button" class="dl-input-field__action" aria-label="选择现在" title="现在" :disabled="disabled" @click="useNow">今</button>
      <button v-if="clearable && modelValue && !readonly" type="button" class="dl-input-field__action" aria-label="清空日期时间" :disabled="disabled" @click="clear">×</button>
    </span>
  </div>
</template>
