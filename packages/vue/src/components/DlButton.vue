<script setup lang="ts">
import { computed } from 'vue'
import { tv } from 'tailwind-variants'
import type { DlSize } from '../types'

const props = withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: DlSize
  type?: 'button' | 'submit' | 'reset'
  block?: boolean
  loading?: boolean
  disabled?: boolean
}>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  block: false,
  loading: false,
  disabled: false,
})

const button = tv({
  base: 'relative inline-flex select-none items-center justify-center gap-2 rounded-[var(--dl-radius-sm)] border font-bold tracking-[0.01em] outline-none transition duration-200 focus-visible:[box-shadow:var(--dl-focus)] disabled:pointer-events-none disabled:opacity-50',
  variants: {
    variant: {
      primary: 'border-[var(--dl-button-primary-border)] [background:var(--dl-button-primary-bg)] text-[var(--dl-button-primary-text)] [text-shadow:var(--dl-button-primary-text-shadow)] [box-shadow:var(--dl-button-primary-shadow)] hover:-translate-y-px hover:border-[var(--dl-button-primary-border-hover)] hover:[background:var(--dl-button-primary-bg-hover)] hover:[text-shadow:var(--dl-button-primary-text-shadow-hover)] hover:[box-shadow:var(--dl-button-primary-shadow-hover)] active:translate-y-0 active:border-[var(--dl-button-primary-border-active)] active:[background:var(--dl-button-primary-bg-active)] active:[text-shadow:var(--dl-button-primary-text-shadow-active)] active:[box-shadow:var(--dl-button-primary-shadow-active)]',
      secondary: 'border-[var(--dl-border)] bg-white/[0.08] text-[var(--dl-text)] shadow-[inset_0_1px_0_rgba(255,255,255,.08)] hover:-translate-y-0.5 hover:border-[var(--dl-border-strong)] hover:bg-white/[0.13]',
      ghost: 'border-transparent bg-transparent text-[var(--dl-text-muted)] hover:bg-white/[0.08] hover:text-[var(--dl-text)]',
      danger: 'border-red-300/30 bg-red-500/15 text-red-100 shadow-[0_10px_30px_rgba(239,68,68,.1)] hover:-translate-y-0.5 hover:bg-red-500/24 hover:border-red-300/45',
    },
    size: {
      sm: 'min-h-9 px-3 text-[0.82rem]',
      md: 'min-h-11 px-4 text-sm',
      lg: 'min-h-[3.25rem] px-6 text-base',
    },
    block: {
      true: 'w-full',
      false: '',
    },
  },
})

const classes = computed(() => button({ variant: props.variant, size: props.size, block: props.block }))
</script>

<template>
  <button
    data-dl
    data-slot="button"
    :type="type"
    :class="classes"
    :disabled="disabled || loading"
    :aria-busy="loading || undefined"
  >
    <span
      v-if="loading"
      class="size-4 animate-spin rounded-full border-2 border-current border-r-transparent"
      aria-hidden="true"
    />
    <slot name="leading" />
    <span><slot /></span>
    <slot name="trailing" />
  </button>
</template>
