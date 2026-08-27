<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
import type { DlSize } from '../types'
import InputFieldShell from './InputFieldShell.vue'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{
  modelValue?: number | null
  min?: number
  max?: number
  step?: number
  precision?: number
  unit?: string
  size?: DlSize
  status?: 'default' | 'success' | 'warning' | 'error'
  disabled?: boolean
  readonly?: boolean
  clearable?: boolean
  clampOnBlur?: boolean
}>(), {
  modelValue: null, min: undefined, max: undefined, step: 1, precision: undefined, unit: undefined,
  size: 'md', status: 'default', disabled: false, readonly: false, clearable: true, clampOnBlur: true,
})
const emit = defineEmits<{ 'update:modelValue': [value: number | null]; clear: []; step: [value: number] }>()
const attrs = useAttrs()
const input = ref<HTMLInputElement | null>(null)
const canDecrease = computed(() => !props.disabled && !props.readonly && (props.min === undefined || (props.modelValue ?? props.min) > props.min))
const canIncrease = computed(() => !props.disabled && !props.readonly && (props.max === undefined || (props.modelValue ?? props.max) < props.max))

function normalize(value: number) {
  let next = value
  if (props.min !== undefined) next = Math.max(props.min, next)
  if (props.max !== undefined) next = Math.min(props.max, next)
  const precision = props.precision ?? Math.max(0, `${props.step}`.split('.')[1]?.length ?? 0)
  return Number(next.toFixed(Math.min(12, Math.max(0, precision))))
}
function updateValue(event: Event) {
  const element = event.target as HTMLInputElement
  emit('update:modelValue', element.value === '' || Number.isNaN(element.valueAsNumber) ? null : element.valueAsNumber)
}
function stepBy(direction: -1 | 1) {
  const base = props.modelValue ?? (direction > 0 ? props.min ?? 0 : props.max ?? 0)
  const value = normalize(base + props.step * direction)
  emit('update:modelValue', value)
  emit('step', value)
  input.value?.focus()
}
function clamp() {
  if (!props.clampOnBlur || props.modelValue === null || props.modelValue === undefined) return
  const value = normalize(props.modelValue)
  if (value !== props.modelValue) emit('update:modelValue', value)
}
function clear() { emit('update:modelValue', null); emit('clear'); input.value?.focus() }
</script>

<template>
  <InputFieldShell data-dl data-slot="input-number" :size="size" :status="status" :disabled="disabled">
    <template #leading><slot name="leading"><span aria-hidden="true">#</span></slot></template>
    <input ref="input" v-bind="attrs" type="number" :value="modelValue ?? ''" :min="min" :max="max" :step="step" :disabled="disabled" :readonly="readonly" :aria-invalid="status === 'error' || undefined" class="dl-input-field__control" @input="updateValue" @blur="clamp" @keydown.up.prevent="stepBy(1)" @keydown.down.prevent="stepBy(-1)">
    <template #trailing>
      <span v-if="unit" class="dl-input-field__count">{{ unit }}</span>
      <button v-if="clearable && modelValue !== null && modelValue !== undefined && !readonly" type="button" class="dl-input-field__action" aria-label="清空数值" @mousedown.prevent @click="clear">×</button>
      <span class="dl-input-stepper">
        <button type="button" :disabled="!canDecrease" aria-label="减小" @mousedown.prevent @click="stepBy(-1)">−</button>
        <button type="button" :disabled="!canIncrease" aria-label="增大" @mousedown.prevent @click="stepBy(1)">+</button>
      </span>
      <slot name="trailing" />
    </template>
  </InputFieldShell>
</template>
