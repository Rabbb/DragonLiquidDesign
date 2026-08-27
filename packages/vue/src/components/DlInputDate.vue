<script setup lang="ts">
import { getLocalTimeZone, parseDate, today, type DateValue } from '@internationalized/date'
import { computed, ref, useAttrs } from 'vue'
import type { DlSize } from '../types'
import DlDatePicker from './DlDatePicker.vue'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{
  modelValue?: string | null
  min?: string
  max?: string
  placeholder?: string
  locale?: string
  size?: DlSize
  status?: 'default' | 'success' | 'warning' | 'error'
  disabled?: boolean
  readonly?: boolean
  clearable?: boolean
  todayShortcut?: boolean
}>(), {
  modelValue: '', min: undefined, max: undefined, placeholder: '选择日期', locale: 'zh-CN',
  size: 'md', status: 'default', disabled: false, readonly: false, clearable: true, todayShortcut: true,
})
const emit = defineEmits<{ 'update:modelValue': [value: string]; clear: []; shortcut: [value: string] }>()
const attrs = useAttrs()
const open = ref(false)
const dateValue = computed(() => {
  if (!props.modelValue) return undefined
  try { return parseDate(props.modelValue) } catch { return undefined }
})
function normalize(value: string) {
  if (props.min && value < props.min) return props.min
  if (props.max && value > props.max) return props.max
  return value
}
function update(value: DateValue | undefined) { emit('update:modelValue', value ? normalize(value.toString()) : '') }
function useToday() { const value = normalize(today(getLocalTimeZone()).toString()); emit('update:modelValue', value); emit('shortcut', value) }
function clear() { emit('update:modelValue', ''); emit('clear') }
</script>

<template>
  <div data-dl data-slot="input-date" class="dl-input-date-control" :data-size="size" :data-status="status">
    <input v-bind="attrs" type="date" :value="modelValue ?? ''" :min="min" :max="max" :disabled="disabled" :readonly="readonly" class="dl-input-native" @focus="open = true">
    <DlDatePicker v-model:open="open" :model-value="dateValue" :placeholder="placeholder" :locale="locale" :disabled="disabled || readonly" @update:model-value="update" />
    <span class="dl-input-date-control__actions">
      <button v-if="todayShortcut && !readonly" type="button" class="dl-input-field__action" aria-label="选择今天" title="今天" :disabled="disabled" @click="useToday">今</button>
      <button v-if="clearable && modelValue && !readonly" type="button" class="dl-input-field__action" aria-label="清空日期" :disabled="disabled" @click="clear">×</button>
    </span>
  </div>
</template>
