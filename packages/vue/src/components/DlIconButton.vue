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
      primary: 'border-amber-200/45 [background:var(--dl-primary)] text-[#271503] shadow-[0_10px_26px_rgba(255,140,0,.22)] hover:-translate-y-0.5 hover:[background:var(--dl-primary-hover)]',
      secondary: 'border-[var(--dl-border)] bg-white/[0.08] text-[var(--dl-text)] hover:-translate-y-0.5 hover:border-[var(--dl-border-strong)] hover:bg-white/[0.14]',
      ghost: 'border-transparent bg-transparent text-[var(--dl-text-muted)] hover:bg-white/[0.08] hover:text-[var(--dl-text)]',
      danger: 'border-red-300/30 bg-red-500/15 text-red-100 hover:bg-red-500/24',
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
