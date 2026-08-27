<script setup lang="ts">
import { computed } from 'vue'
import { tv } from 'tailwind-variants'

const props = withDefaults(defineProps<{
  interactive?: boolean
  disabled?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}>(), {
  interactive: false,
  disabled: false,
  padding: 'md',
})
const emit = defineEmits<{ click: [event: MouseEvent | KeyboardEvent] }>()

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

function handleClick(event: MouseEvent) {
  if (!props.interactive || props.disabled) return
  const target = event.target as Element
  if (target !== event.currentTarget && target.closest('button, a, input, select, textarea, [role="button"], [role="link"]')) return
  emit('click', event)
}

function handleKeydown(event: KeyboardEvent) {
  if (!props.interactive || props.disabled || (event.key !== 'Enter' && event.key !== ' ')) return
  event.preventDefault()
  emit('click', event)
}
</script>

<template>
  <article data-dl data-slot="card" :class="classes" :data-disabled="disabled || undefined" :role="interactive ? 'button' : undefined" :tabindex="interactive && !disabled ? 0 : undefined" :aria-disabled="interactive && disabled ? true : undefined" @click="handleClick" @keydown="handleKeydown"><slot /></article>
</template>

<style scoped>
[data-slot='card'][role='button'] { outline: none; cursor: pointer; }
[data-slot='card'][role='button']:focus-visible { box-shadow: var(--dl-focus), var(--dl-shadow-hover); }
[data-slot='card'][data-disabled] { cursor: not-allowed; opacity: .5; }
</style>
