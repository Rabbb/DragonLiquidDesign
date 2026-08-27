<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
import type { DlSize } from '../types'
import DlTimeWheel from './DlTimeWheel.vue'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{
  modelValue?: string | null
  min?: string
  max?: string
  step?: number
  placeholder?: string
  size?: DlSize
  status?: 'default' | 'success' | 'warning' | 'error'
  disabled?: boolean
  readonly?: boolean
  clearable?: boolean
  nowShortcut?: boolean
}>(), {
  modelValue: '', min: undefined, max: undefined, step: 300, placeholder: '选择时间', size: 'md',
  status: 'default', disabled: false, readonly: false, clearable: true, nowShortcut: true,
})
const emit = defineEmits<{ 'update:modelValue': [value: string]; change: [value: string]; clear: [] }>()
const attrs = useAttrs()
const open = ref(false)
const minuteStep = computed(() => Math.max(1, Math.round(props.step / 60)))
const now = computed(() => { const date = new Date(); return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}` })
function disabledTime(value: string) { return Boolean((props.min && value < props.min) || (props.max && value > props.max)) }
function update(value: string) { emit('update:modelValue', value); emit('change', value) }
</script>

<template>
  <div data-dl data-slot="input-time" class="dl-input-date-control" :data-size="size" :data-status="status">
    <input v-bind="attrs" type="time" :value="modelValue ?? ''" :min="min" :max="max" :step="step" :disabled="disabled" :readonly="readonly" class="dl-input-native" @focus="open = true">
    <DlTimeWheel v-model:open="open" :model-value="modelValue ?? ''" :placeholder="placeholder" :minute-step="minuteStep" :size="size" :status="status" :clearable="clearable" :shortcut-value="nowShortcut ? now : undefined" shortcut-label="当前时间" :disabled-time="disabledTime" :disabled="disabled || readonly" @update:model-value="update" @clear="emit('clear')" />
  </div>
</template>
