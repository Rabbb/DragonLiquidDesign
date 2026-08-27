<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
import type { DlSize } from '../types'
import InputFieldShell from './InputFieldShell.vue'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{
  modelValue?: string | null
  min?: string
  max?: string
  size?: DlSize
  status?: 'default' | 'success' | 'warning' | 'error'
  disabled?: boolean
  readonly?: boolean
  clearable?: boolean
  currentShortcut?: boolean
}>(), {
  modelValue: '', min: undefined, max: undefined, size: 'md', status: 'default', disabled: false,
  readonly: false, clearable: true, currentShortcut: true,
})
const emit = defineEmits<{ 'update:modelValue': [value: string]; clear: []; step: [value: string] }>()
const attrs = useAttrs()
const editor = ref<HTMLInputElement | null>(null)
const draft = computed(() => props.modelValue ?? '')

function isoWeek(date: Date) {
  const value = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const day = value.getUTCDay() || 7
  value.setUTCDate(value.getUTCDate() + 4 - day)
  const yearStart = new Date(Date.UTC(value.getUTCFullYear(), 0, 1))
  const week = Math.ceil((((value.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
  return `${value.getUTCFullYear()}-W${String(week).padStart(2, '0')}`
}
function weekDate(value: string) {
  const match = /^(\d{4})-W(\d{2})$/.exec(value)
  if (!match) return new Date()
  const year = Number(match[1]); const week = Number(match[2])
  const january4 = new Date(Date.UTC(year, 0, 4))
  const monday = new Date(january4)
  monday.setUTCDate(january4.getUTCDate() - (january4.getUTCDay() || 7) + 1 + (week - 1) * 7)
  return monday
}
function normalize(value: string) {
  if (props.min && value < props.min) return props.min
  if (props.max && value > props.max) return props.max
  return value
}
function update(value: string) { if (/^\d{4}-W\d{2}$/.test(value)) emit('update:modelValue', normalize(value)) }
function stepBy(direction: -1 | 1) {
  const date = weekDate(props.modelValue || isoWeek(new Date()))
  date.setUTCDate(date.getUTCDate() + direction * 7)
  const value = normalize(isoWeek(date))
  emit('update:modelValue', value); emit('step', value); editor.value?.focus()
}
function useCurrent() { emit('update:modelValue', normalize(isoWeek(new Date()))) }
function clear() { emit('update:modelValue', ''); emit('clear'); editor.value?.focus() }
</script>

<template>
  <div data-dl data-slot="input-week" class="dl-input-date-control" :data-size="size" :data-status="status">
    <input v-bind="attrs" type="week" :value="modelValue ?? ''" :min="min" :max="max" :disabled="disabled" :readonly="readonly" class="dl-input-native" @focus="editor?.focus()">
    <InputFieldShell :size="size" :status="status" :disabled="disabled">
      <template #leading><span aria-hidden="true">W</span></template>
      <input ref="editor" type="text" :value="draft" placeholder="YYYY-W00" inputmode="numeric" maxlength="8" :disabled="disabled" :readonly="readonly" class="dl-input-field__control" aria-label="ISO 周" @change="update(($event.target as HTMLInputElement).value)">
      <template #trailing>
        <button v-if="currentShortcut && !readonly" type="button" class="dl-input-field__action" aria-label="选择本周" title="本周" @click="useCurrent">今</button>
        <button v-if="clearable && modelValue && !readonly" type="button" class="dl-input-field__action" aria-label="清空周" @click="clear">×</button>
        <span class="dl-input-stepper"><button type="button" :disabled="disabled || readonly || Boolean(min && modelValue && modelValue <= min)" aria-label="上一周" @click="stepBy(-1)">−</button><button type="button" :disabled="disabled || readonly || Boolean(max && modelValue && modelValue >= max)" aria-label="下一周" @click="stepBy(1)">+</button></span>
      </template>
    </InputFieldShell>
  </div>
</template>
