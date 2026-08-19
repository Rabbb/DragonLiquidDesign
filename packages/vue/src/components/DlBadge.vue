<script setup lang="ts">
import { computed } from 'vue'
import { tv } from 'tailwind-variants'
import type { DlSize, DlTone } from '../types'

const props = withDefaults(defineProps<{
  tone?: DlTone
  size?: DlSize
  variant?: 'soft' | 'outline' | 'solid'
}>(), {
  tone: 'default',
  size: 'sm',
  variant: 'soft',
})

const badge = tv({
  base: 'inline-flex items-center gap-1.5 rounded-full border font-bold leading-none tracking-[0.02em] backdrop-blur-md',
  variants: {
    size: {
      sm: 'min-h-6 px-2 text-[0.68rem]',
      md: 'min-h-7 px-2.5 text-xs',
      lg: 'min-h-9 px-3 text-sm',
    },
    tone: {
      default: '', accent: '', success: '', warning: '', danger: '', muted: '',
    },
    variant: {
      soft: '', outline: 'bg-transparent', solid: '',
    },
  },
  compoundVariants: [
    { tone: 'default', variant: 'soft', class: 'border-[var(--dl-border)] bg-[var(--dl-surface-hover)] text-[var(--dl-text-muted)]' },
    { tone: 'accent', variant: 'soft', class: 'border-[var(--dl-accent-border)] bg-[var(--dl-accent-surface)] text-[var(--dl-accent-text)]' },
    { tone: 'success', variant: 'soft', class: 'border-emerald-300/45 bg-emerald-100/70 text-emerald-800' },
    { tone: 'warning', variant: 'soft', class: 'border-orange-300/45 bg-orange-100/70 text-orange-800' },
    { tone: 'danger', variant: 'soft', class: 'border-red-300/45 bg-red-100/70 text-red-800' },
    { tone: 'muted', variant: 'soft', class: 'border-[var(--dl-border)] bg-[var(--dl-night-soft)] text-[var(--dl-text-faint)]' },
    { tone: 'default', variant: 'outline', class: 'border-[var(--dl-border-strong)] text-[var(--dl-text-muted)]' },
    { tone: 'accent', variant: 'outline', class: 'border-[var(--dl-accent-border)] text-[var(--dl-accent-text)]' },
    { tone: 'success', variant: 'outline', class: 'border-emerald-400/60 text-emerald-800' },
    { tone: 'warning', variant: 'outline', class: 'border-orange-400/60 text-orange-800' },
    { tone: 'danger', variant: 'outline', class: 'border-red-400/60 text-red-800' },
    { tone: 'muted', variant: 'outline', class: 'border-[var(--dl-border)] text-[var(--dl-text-faint)]' },
    { tone: 'default', variant: 'solid', class: 'border-[var(--dl-border-strong)] [background:var(--dl-text)] text-[var(--dl-surface-solid)]' },
    { tone: 'accent', variant: 'solid', class: 'border-[var(--dl-accent-border)] [background:var(--dl-primary)] text-[var(--dl-button-primary-text)]' },
    { tone: 'success', variant: 'solid', class: 'border-emerald-100/40 bg-emerald-300 text-emerald-950' },
    { tone: 'warning', variant: 'solid', class: 'border-orange-100/40 bg-orange-300 text-orange-950' },
    { tone: 'danger', variant: 'solid', class: 'border-red-100/40 bg-red-300 text-red-950' },
    { tone: 'muted', variant: 'solid', class: 'border-[var(--dl-border-strong)] bg-[var(--dl-surface-hover)] text-[var(--dl-text-muted)]' },
  ],
})
const classes = computed(() => badge({ tone: props.tone, size: props.size, variant: props.variant }))
</script>

<template>
  <span data-dl data-slot="badge" :class="classes"><slot /></span>
</template>
