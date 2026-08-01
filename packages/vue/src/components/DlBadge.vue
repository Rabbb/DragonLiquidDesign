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
    { tone: 'default', variant: 'soft', class: 'border-white/15 bg-white/[0.08] text-slate-100' },
    { tone: 'accent', variant: 'soft', class: 'border-amber-200/25 bg-amber-300/10 text-amber-100 shadow-[0_0_16px_rgba(251,191,36,.08)]' },
    { tone: 'success', variant: 'soft', class: 'border-emerald-200/25 bg-emerald-300/10 text-emerald-100' },
    { tone: 'warning', variant: 'soft', class: 'border-orange-200/25 bg-orange-300/10 text-orange-100' },
    { tone: 'danger', variant: 'soft', class: 'border-red-200/25 bg-red-300/10 text-red-100' },
    { tone: 'muted', variant: 'soft', class: 'border-slate-300/10 bg-slate-300/[0.06] text-slate-300/70' },
    { tone: 'default', variant: 'outline', class: 'border-white/20 text-slate-100' },
    { tone: 'accent', variant: 'outline', class: 'border-amber-200/40 text-amber-100' },
    { tone: 'success', variant: 'outline', class: 'border-emerald-200/40 text-emerald-100' },
    { tone: 'warning', variant: 'outline', class: 'border-orange-200/40 text-orange-100' },
    { tone: 'danger', variant: 'outline', class: 'border-red-200/40 text-red-100' },
    { tone: 'muted', variant: 'outline', class: 'border-slate-300/15 text-slate-300/60' },
    { tone: 'default', variant: 'solid', class: 'border-white/20 bg-slate-100 text-slate-900' },
    { tone: 'accent', variant: 'solid', class: 'border-amber-100/40 bg-amber-300 text-amber-950' },
    { tone: 'success', variant: 'solid', class: 'border-emerald-100/40 bg-emerald-300 text-emerald-950' },
    { tone: 'warning', variant: 'solid', class: 'border-orange-100/40 bg-orange-300 text-orange-950' },
    { tone: 'danger', variant: 'solid', class: 'border-red-100/40 bg-red-300 text-red-950' },
    { tone: 'muted', variant: 'solid', class: 'border-slate-300/20 bg-slate-600 text-slate-100' },
  ],
})
const classes = computed(() => badge({ tone: props.tone, size: props.size, variant: props.variant }))
</script>

<template>
  <span data-dl data-slot="badge" :class="classes"><slot /></span>
</template>
