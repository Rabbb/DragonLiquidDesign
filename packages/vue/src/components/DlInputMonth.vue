<script setup lang="ts">
import { CalendarDate, getLocalTimeZone, today, type DateValue } from '@internationalized/date'
import { computed, ref, useAttrs } from 'vue'
import type { DlSize } from '../types'
import DlMonthPicker from './DlMonthPicker.vue'

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
  currentShortcut?: boolean
}>(), {
  modelValue: '', min: undefined, max: undefined, placeholder: '选择月份', locale: 'zh-CN',
  size: 'md', status: 'default', disabled: false, readonly: false, clearable: true, currentShortcut: true,
})
const emit = defineEmits<{ 'update:modelValue': [value: string]; clear: []; shortcut: [value: string] }>()
const attrs = useAttrs()
const open = ref(false)
const monthValue = computed(() => {
  const match = /^(\d{4})-(\d{2})$/.exec(props.modelValue ?? '')
  if (!match) return undefined
  return new CalendarDate(Number(match[1]), Number(match[2]), 1)
})
function normalize(value: string) {
  if (props.min && value < props.min) return props.min
  if (props.max && value > props.max) return props.max
  return value
}
function update(value: DateValue | DateValue[] | undefined) {
  const selected = Array.isArray(value) ? value.at(-1) : value
  emit('update:modelValue', selected ? normalize(selected.toString().slice(0, 7)) : '')
}
function useCurrent() { const value = normalize(today(getLocalTimeZone()).toString().slice(0, 7)); emit('update:modelValue', value); emit('shortcut', value) }
function clear() { emit('update:modelValue', ''); emit('clear') }
</script>

<template>
  <div data-dl data-slot="input-month" class="dl-input-date-control" :data-size="size" :data-status="status">
    <input v-bind="attrs" type="month" :value="modelValue ?? ''" :min="min" :max="max" :disabled="disabled" :readonly="readonly" class="dl-input-native" @focus="open = true">
    <DlMonthPicker v-model:open="open" :model-value="monthValue" :placeholder="placeholder" :locale="locale" :disabled="disabled" :readonly="readonly" prevent-deselect @update:model-value="update" />
    <span class="dl-input-date-control__actions">
      <button v-if="currentShortcut && !readonly" type="button" class="dl-input-field__action" aria-label="选择本月" title="本月" :disabled="disabled" @click="useCurrent">今</button>
      <button v-if="clearable && modelValue && !readonly" type="button" class="dl-input-field__action" aria-label="清空月份" :disabled="disabled" @click="clear">×</button>
    </span>
  </div>
</template>
