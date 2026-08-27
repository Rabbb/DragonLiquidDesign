<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import type { DlSize } from '../types'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{
  modelValue?: number | null
  min?: number
  max?: number
  step?: number
  size?: DlSize
  status?: 'default' | 'success' | 'warning' | 'error'
  disabled?: boolean
  showValue?: boolean
  minLabel?: string
  maxLabel?: string
  formatValue?: (value: number) => string
}>(), {
  modelValue: 50, min: 0, max: 100, step: 1, size: 'md', status: 'default', disabled: false,
  showValue: true, minLabel: undefined, maxLabel: undefined, formatValue: undefined,
})
const emit = defineEmits<{ 'update:modelValue': [value: number]; change: [value: number] }>()
const attrs = useAttrs()
const value = computed(() => Math.min(props.max, Math.max(props.min, props.modelValue ?? props.min)))
const progress = computed(() => props.max === props.min ? 0 : ((value.value - props.min) / (props.max - props.min)) * 100)
const displayValue = computed(() => props.formatValue?.(value.value) ?? `${value.value}`)
function update(event: Event) { emit('update:modelValue', (event.target as HTMLInputElement).valueAsNumber) }
function change(event: Event) { emit('change', (event.target as HTMLInputElement).valueAsNumber) }
</script>

<template>
  <div data-dl data-slot="input-range" class="dl-input-range" :data-size="size" :data-status="status" :data-disabled="disabled || undefined" :style="{ '--dl-range-progress': `${progress}%` }">
    <div class="dl-input-range__top"><span>{{ minLabel ?? min }}</span><output v-if="showValue" class="dl-input-range__value">{{ displayValue }}</output><span>{{ maxLabel ?? max }}</span></div>
    <input v-bind="attrs" type="range" :value="value" :min="min" :max="max" :step="step" :disabled="disabled" :aria-valuetext="displayValue" @input="update" @change="change">
  </div>
</template>
