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
  variant: 'secondary',
  size: 'md',
  type: 'button',
  block: false,
  loading: false,
  disabled: false,
})

const button = tv({
  base: 'relative isolate inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-[var(--dl-button-radius)] border text-center font-semibold leading-none outline-none transition-[color,background,border-color,box-shadow,opacity] duration-200 [transition-timing-function:var(--dl-button-motion)] focus-visible:[box-shadow:var(--dl-focus)] disabled:pointer-events-none',
  variants: {
    variant: {
      primary: 'border-[var(--dl-button-primary-border)] [background:var(--dl-button-primary-bg)] text-[var(--dl-button-primary-text)] [text-shadow:var(--dl-button-primary-text-shadow)] [box-shadow:var(--dl-button-primary-shadow)] hover:border-[var(--dl-button-primary-border-hover)] hover:[background:var(--dl-button-primary-bg-hover)] hover:[text-shadow:var(--dl-button-primary-text-shadow-hover)] hover:[box-shadow:var(--dl-button-primary-shadow-hover)] active:border-[var(--dl-button-primary-border-active)] active:[background:var(--dl-button-primary-bg-active)] active:[text-shadow:var(--dl-button-primary-text-shadow-active)] active:[box-shadow:var(--dl-button-primary-shadow-active)]',
      secondary: 'border-[var(--dl-button-secondary-border)] [background:var(--dl-button-secondary-bg)] text-[var(--dl-button-secondary-text)] [box-shadow:var(--dl-button-secondary-shadow)] hover:border-[var(--dl-button-secondary-border-hover)] hover:[background:var(--dl-button-secondary-bg-hover)] hover:text-[var(--dl-button-secondary-text-hover)] active:border-[var(--dl-button-secondary-border-active)] active:[background:var(--dl-button-secondary-bg-active)] active:text-[var(--dl-button-secondary-text-active)] active:[box-shadow:var(--dl-button-secondary-shadow-active)]',
      ghost: 'border-transparent [background:transparent] text-[var(--dl-button-ghost-text)] shadow-none hover:border-transparent hover:[background:var(--dl-button-ghost-bg-hover)] hover:text-[var(--dl-button-ghost-text-hover)] active:[background:var(--dl-button-ghost-bg-active)] active:text-[var(--dl-button-ghost-text-active)]',
      danger: 'border-[var(--dl-button-danger-border)] [background:var(--dl-button-danger-bg)] text-[var(--dl-button-danger-text)] [box-shadow:var(--dl-button-danger-shadow)] hover:border-[var(--dl-button-danger-border-hover)] hover:[background:var(--dl-button-danger-bg-hover)] active:border-[var(--dl-button-danger-border-active)] active:[background:var(--dl-button-danger-bg-active)] active:[box-shadow:var(--dl-button-danger-shadow-active)]',
    },
    size: {
      sm: 'min-h-8 px-3 text-[13px]',
      md: 'min-h-10 px-4 text-sm',
      lg: 'min-h-12 px-5 text-base',
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
    :data-variant="variant"
    :data-size="size"
    :data-loading="loading || undefined"
    :type="type"
    :class="classes"
    :disabled="disabled || loading"
    :aria-busy="loading || undefined"
  >
    <span
      v-if="loading"
      class="size-4 shrink-0 animate-spin rounded-full border-2 border-current border-r-transparent"
      aria-hidden="true"
    />
    <slot name="leading" />
    <span class="min-w-0"><slot /></span>
    <slot name="trailing" />
  </button>
</template>
