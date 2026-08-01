<script setup lang="ts">
import { computed } from 'vue'
import { CheckboxIndicator, CheckboxRoot } from 'reka-ui'
import { tv } from 'tailwind-variants'
import type { DlSize } from '../types'

const props = withDefaults(defineProps<{
  modelValue?: boolean | 'indeterminate'
  label?: string
  description?: string
  size?: DlSize
  disabled?: boolean
  name?: string
  required?: boolean
  value?: string
}>(), {
  modelValue: false,
  label: undefined,
  description: undefined,
  size: 'md',
  disabled: false,
  name: undefined,
  required: false,
  value: 'on',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean | 'indeterminate']
}>()

const styles = tv({
  slots: {
    root: 'group inline-flex cursor-pointer items-start gap-3 text-[var(--dl-text)] data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50',
    control: 'mt-0.5 grid shrink-0 place-items-center rounded-[7px] border border-[var(--dl-border-strong)] bg-[var(--dl-surface)] text-[var(--dl-button-primary-text)] shadow-[inset_0_1px_0_rgba(255,255,255,.08)] outline-none transition group-hover:border-amber-300/45 focus-visible:[box-shadow:var(--dl-focus)] data-[state=checked]:border-amber-200/55 data-[state=checked]:[background:var(--dl-button-primary-bg)] data-[state=indeterminate]:border-amber-200/55 data-[state=indeterminate]:[background:var(--dl-button-primary-bg)]',
    indicator: 'grid place-items-center font-black leading-none',
    label: 'block font-semibold leading-tight',
    description: 'mt-1 block leading-relaxed text-[var(--dl-text-faint)]',
  },
  variants: {
    size: {
      sm: { control: 'size-4', indicator: 'text-[10px]', label: 'text-xs', description: 'text-[11px]' },
      md: { control: 'size-5', indicator: 'text-xs', label: 'text-sm', description: 'text-xs' },
      lg: { control: 'size-6', indicator: 'text-sm', label: 'text-base', description: 'text-sm' },
    },
  },
})
const classes = computed(() => styles({ size: props.size }))
</script>

<template>
  <label data-dl data-slot="checkbox" :class="classes.root()" :data-disabled="disabled">
    <CheckboxRoot
      :model-value="modelValue"
      :disabled="disabled"
      :name="name"
      :required="required"
      :value="value"
      :class="classes.control()"
      @update:model-value="emit('update:modelValue', $event as boolean | 'indeterminate')"
    >
      <CheckboxIndicator :class="classes.indicator()">
        <span aria-hidden="true">{{ modelValue === 'indeterminate' ? '−' : '✓' }}</span>
      </CheckboxIndicator>
    </CheckboxRoot>
    <span v-if="label || description || $slots.default" class="min-w-0">
      <span :class="classes.label()"><slot>{{ label }}</slot></span>
      <span v-if="description" :class="classes.description()">{{ description }}</span>
    </span>
  </label>
</template>
