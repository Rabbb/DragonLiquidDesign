<script setup lang="ts">
import { computed } from 'vue'
import { tv } from 'tailwind-variants'

const props = withDefaults(defineProps<{
  interactive?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}>(), {
  interactive: false,
  padding: 'md',
})

const card = tv({
  base: 'relative overflow-hidden rounded-[var(--dl-radius-lg)] border border-[var(--dl-border)] [background:var(--dl-panel)] text-[var(--dl-text)] [box-shadow:var(--dl-shadow)] backdrop-blur-2xl before:pointer-events-none before:absolute before:inset-x-8 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/35 before:to-transparent',
  variants: {
    interactive: {
      true: 'transition duration-300 hover:-translate-y-1 hover:border-[var(--dl-border-strong)] hover:[box-shadow:var(--dl-shadow-hover)]',
      false: '',
    },
    padding: {
      none: '',
      sm: 'p-3',
      md: 'p-5',
      lg: 'p-7',
    },
  },
})
const classes = computed(() => card({ interactive: props.interactive, padding: props.padding }))
</script>

<template>
  <article data-dl data-slot="card" :class="classes"><slot /></article>
</template>
