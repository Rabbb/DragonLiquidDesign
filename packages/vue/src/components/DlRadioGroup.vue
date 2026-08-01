<script setup lang="ts">
import { computed } from 'vue'
import { RadioGroupIndicator, RadioGroupItem, RadioGroupRoot } from 'reka-ui'
import { tv } from 'tailwind-variants'
import type { DlSize } from '../types'
import type { DlRadioOption } from './primitive.types'

const props = withDefaults(defineProps<{
  modelValue?: string
  options: DlRadioOption[]
  orientation?: 'horizontal' | 'vertical'
  size?: DlSize
  disabled?: boolean
  name?: string
  required?: boolean
}>(), {
  modelValue: undefined,
  orientation: 'vertical',
  size: 'md',
  disabled: false,
  name: undefined,
  required: false,
})
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
const styles = tv({
  slots: {
    root: 'flex gap-3',
    option: 'group flex cursor-pointer items-start gap-3 rounded-[var(--dl-radius-sm)] border border-transparent p-2 text-[var(--dl-text)] transition hover:border-[var(--dl-border)] hover:bg-white/[0.035] data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-45',
    control: 'mt-0.5 grid shrink-0 place-items-center rounded-full border border-[var(--dl-border-strong)] bg-[var(--dl-surface)] outline-none transition group-hover:border-amber-300/45 focus-visible:[box-shadow:var(--dl-focus)] data-[state=checked]:border-amber-200/60',
    indicator: 'rounded-full [background:var(--dl-primary)] shadow-[0_0_10px_rgba(255,193,7,.45)]',
    label: 'block font-semibold leading-tight',
    description: 'mt-1 block leading-relaxed text-[var(--dl-text-faint)]',
  },
  variants: {
    orientation: { horizontal: { root: 'flex-row flex-wrap' }, vertical: { root: 'flex-col' } },
    size: {
      sm: { control: 'size-4', indicator: 'size-2', label: 'text-xs', description: 'text-[11px]' },
      md: { control: 'size-5', indicator: 'size-2.5', label: 'text-sm', description: 'text-xs' },
      lg: { control: 'size-6', indicator: 'size-3', label: 'text-base', description: 'text-sm' },
    },
  },
})
const classes = computed(() => styles({ orientation: props.orientation, size: props.size }))
</script>

<template>
  <RadioGroupRoot
    data-dl
    data-slot="radio-group"
    :model-value="modelValue"
    :orientation="orientation"
    :disabled="disabled"
    :name="name"
    :required="required"
    :class="classes.root()"
    @update:model-value="emit('update:modelValue', $event as string)"
  >
    <label
      v-for="option in options"
      :key="option.value"
      :class="classes.option()"
      :data-disabled="disabled || option.disabled"
    >
      <RadioGroupItem :value="option.value" :disabled="option.disabled" :class="classes.control()">
        <RadioGroupIndicator :class="classes.indicator()" />
      </RadioGroupItem>
      <span class="min-w-0">
        <span :class="classes.label()">{{ option.label }}</span>
        <span v-if="option.description" :class="classes.description()">{{ option.description }}</span>
      </span>
    </label>
  </RadioGroupRoot>
</template>
