<script setup lang="ts">
import { computed } from 'vue'
import { tv } from 'tailwind-variants'
import type { DlSize } from '../types'

const props = withDefaults(defineProps<{
  label: string
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: DlSize
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}>(), {
  variant: 'secondary',
  size: 'md',
  type: 'button',
  disabled: false,
})

const iconButton = tv({
  base: 'inline-flex shrink-0 select-none items-center justify-center rounded-[var(--dl-radius-sm)] border outline-none transition duration-200 focus-visible:[box-shadow:var(--dl-focus)] disabled:pointer-events-none disabled:opacity-50',
  variants: {
    variant: {
      primary: 'border-[var(--dl-button-primary-border)] [background:var(--dl-primary)] text-white shadow-[var(--dl-button-primary-shadow)] hover:-translate-y-0.5 hover:[background:var(--dl-primary-hover)] hover:shadow-[var(--dl-button-primary-shadow-hover)]',
      secondary: 'border-[var(--dl-border)] bg-[var(--dl-surface)] text-[var(--dl-text)] hover:-translate-y-0.5 hover:border-[var(--dl-border-strong)] hover:bg-[var(--dl-surface-hover)]',
      ghost: 'border-transparent bg-transparent text-[var(--dl-text-muted)] hover:bg-[var(--dl-surface-hover)] hover:text-[var(--dl-text)]',
      danger: 'border-red-300/60 bg-red-50 text-red-700 hover:bg-red-100',
    },
    size: {
      sm: 'size-9 text-sm',
      md: 'size-11 text-base',
      lg: 'size-[3.25rem] text-lg',
    },
  },
})

const classes = computed(() => iconButton({ variant: props.variant, size: props.size }))
</script>

<template>
  <button data-dl data-slot="icon-button" :type="type" :class="classes" :disabled="disabled" :aria-label="label">
    <slot />
  </button>
</template>
