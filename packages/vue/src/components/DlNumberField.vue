<script setup lang="ts">
import { computed } from 'vue'
import { NumberFieldDecrement, NumberFieldIncrement, NumberFieldInput, NumberFieldRoot } from 'reka-ui'
import { tv } from 'tailwind-variants'
import type { DlSize } from '../types'

const props = withDefaults(defineProps<{
  modelValue?: number | null
  min?: number
  max?: number
  step?: number
  locale?: string
  formatOptions?: Intl.NumberFormatOptions
  size?: DlSize
  disabled?: boolean
  readonly?: boolean
  name?: string
}>(), { modelValue: null, min: undefined, max: undefined, step: 1, locale: 'zh-CN', formatOptions: undefined, size: 'md', disabled: false, readonly: false, name: undefined })
const emit = defineEmits<{ 'update:modelValue': [value: number] }>()
const field = tv({
  slots: {
    root: 'inline-flex w-full items-stretch overflow-hidden rounded-[var(--dl-radius-sm)] border border-[var(--dl-border)] bg-[var(--dl-surface)] shadow-[inset_0_1px_0_rgba(255,255,255,.06)] transition focus-within:border-[var(--dl-border-focus)] focus-within:[box-shadow:var(--dl-focus)] data-[disabled]:opacity-50',
    button: 'grid shrink-0 place-items-center border-[var(--dl-border)] px-3 font-bold text-[var(--dl-text-muted)] outline-none transition hover:bg-white/[0.08] hover:text-amber-200 disabled:cursor-not-allowed disabled:opacity-35',
    input: 'min-w-0 flex-1 border-0 bg-transparent px-3 text-center text-[var(--dl-text)] outline-none',
  },
  variants: { size: { sm: { root: 'min-h-9 text-xs' }, md: { root: 'min-h-11 text-sm' }, lg: { root: 'min-h-[3.25rem] text-base' } } },
})
const classes = computed(() => field({ size: props.size }))
</script>

<template>
  <NumberFieldRoot data-dl data-slot="number-field" :model-value="modelValue" :min="min" :max="max" :step="step" :locale="locale" :format-options="formatOptions" :disabled="disabled" :readonly="readonly" :name="name" :class="classes.root()" @update:model-value="emit('update:modelValue', $event)">
    <NumberFieldDecrement :class="[classes.button(), 'border-r']" aria-label="减少">−</NumberFieldDecrement>
    <NumberFieldInput :class="classes.input()" />
    <NumberFieldIncrement :class="[classes.button(), 'border-l']" aria-label="增加">＋</NumberFieldIncrement>
  </NumberFieldRoot>
</template>
