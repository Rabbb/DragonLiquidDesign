<script setup lang="ts">
import { computed } from 'vue'
import { SwitchRoot, SwitchThumb } from 'reka-ui'
import { tv } from 'tailwind-variants'
import type { DlSize } from '../types'

const props = withDefaults(defineProps<{
  modelValue?: boolean
  label?: string
  description?: string
  size?: DlSize
  disabled?: boolean
  name?: string
  required?: boolean
}>(), {
  modelValue: false,
  label: undefined,
  description: undefined,
  size: 'md',
  disabled: false,
  name: undefined,
  required: false,
})

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()
const styles = tv({
  slots: {
    root: 'group inline-flex cursor-pointer items-center gap-3 text-[var(--dl-text)] data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50',
    track: 'relative shrink-0 rounded-full border border-[var(--dl-border-strong)] bg-[var(--dl-night-soft)] p-[3px] shadow-[inset_0_1px_2px_rgba(15,23,42,.1)] outline-none transition group-hover:border-[var(--dl-border-focus)] focus-visible:[box-shadow:var(--dl-focus)] data-[state=checked]:border-[var(--dl-button-primary-border)] data-[state=checked]:[background:var(--dl-button-primary-bg)]',
    thumb: 'block aspect-square h-full rounded-full bg-white shadow-[0_1px_4px_rgba(15,23,42,.24)] transition-transform will-change-transform data-[state=checked]:translate-x-full data-[state=checked]:bg-white',
    label: 'block font-semibold leading-tight',
    description: 'mt-1 block leading-relaxed text-[var(--dl-text-faint)]',
  },
  variants: {
    size: {
      sm: { track: 'h-5 w-9', label: 'text-xs', description: 'text-[11px]' },
      md: { track: 'h-6 w-11', label: 'text-sm', description: 'text-xs' },
      lg: { track: 'h-7 w-[52px]', label: 'text-base', description: 'text-sm' },
    },
  },
})
const classes = computed(() => styles({ size: props.size }))
</script>

<template>
  <label data-dl data-slot="switch" :class="classes.root()" :data-disabled="disabled">
    <SwitchRoot
      :model-value="modelValue"
      :disabled="disabled"
      :name="name"
      :required="required"
      :class="classes.track()"
      @update:model-value="emit('update:modelValue', $event as boolean)"
    >
      <SwitchThumb :class="classes.thumb()" />
    </SwitchRoot>
    <span v-if="label || description || $slots.default" class="min-w-0">
      <span :class="classes.label()"><slot>{{ label }}</slot></span>
      <span v-if="description" :class="classes.description()">{{ description }}</span>
    </span>
  </label>
</template>
