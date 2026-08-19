<script setup lang="ts">
import { computed } from 'vue'
import { SliderRange, SliderRoot, SliderThumb, SliderTrack } from 'reka-ui'
import { tv } from 'tailwind-variants'
import type { DlSize } from '../types'

const props = withDefaults(defineProps<{
  modelValue?: number[]
  min?: number
  max?: number
  step?: number
  size?: DlSize
  disabled?: boolean
  name?: string
  required?: boolean
  showValue?: boolean
  label?: string
}>(), {
  modelValue: () => [0],
  min: 0,
  max: 100,
  step: 1,
  size: 'md',
  disabled: false,
  name: undefined,
  required: false,
  showValue: false,
  label: undefined,
})
const emit = defineEmits<{
  'update:modelValue': [value: number[]]
  valueCommit: [value: number[]]
}>()
const styles = tv({
  slots: {
    root: 'relative flex w-full touch-none select-none items-center data-[disabled]:cursor-not-allowed data-[disabled]:opacity-45',
    track: 'relative grow overflow-hidden rounded-full border border-[var(--dl-border)] bg-[var(--dl-night-soft)] shadow-inner',
    range: 'absolute h-full rounded-full [background:var(--dl-primary)] shadow-[0_1px_3px_rgba(15,23,42,.18)]',
    thumb: 'block rounded-full border border-slate-500 bg-white shadow-[0_2px_8px_rgba(15,23,42,.2)] outline-none transition hover:scale-110 focus-visible:[box-shadow:var(--dl-focus)]',
  },
  variants: {
    size: {
      sm: { root: 'h-5', track: 'h-1.5', thumb: 'size-4' },
      md: { root: 'h-6', track: 'h-2', thumb: 'size-5' },
      lg: { root: 'h-8', track: 'h-2.5', thumb: 'size-6' },
    },
  },
})
const classes = computed(() => styles({ size: props.size }))
const valueText = computed(() => props.modelValue.join(' – '))
</script>

<template>
  <div data-dl data-slot="slider" class="w-full">
    <div v-if="label || showValue" class="mb-2 flex items-center justify-between gap-4 text-sm">
      <span class="font-semibold text-[var(--dl-text)]">{{ label }}</span>
      <output v-if="showValue" class="tabular-nums text-[var(--dl-text-muted)]">{{ valueText }}</output>
    </div>
    <SliderRoot
      :model-value="modelValue"
      :min="min"
      :max="max"
      :step="step"
      :disabled="disabled"
      :name="name"
      :required="required"
      :class="classes.root()"
      @update:model-value="emit('update:modelValue', $event as number[])"
      @value-commit="emit('valueCommit', $event as number[])"
    >
      <SliderTrack :class="classes.track()">
        <SliderRange :class="classes.range()" />
      </SliderTrack>
      <SliderThumb v-for="(_, index) in modelValue" :key="index" :class="classes.thumb()" />
    </SliderRoot>
  </div>
</template>
