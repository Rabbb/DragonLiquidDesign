<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { tv } from 'tailwind-variants'
import type { DlSize } from '../types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  modelValue?: string | null
  size?: DlSize
  status?: 'default' | 'success' | 'warning' | 'error'
  disabled?: boolean
}>(), {
  modelValue: '',
  size: 'md',
  status: 'default',
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
const attrs = useAttrs()
const textarea = tv({
  base: 'block min-h-28 w-full resize-y rounded-[var(--dl-radius-sm)] border bg-[var(--dl-surface)] px-3 py-3 text-[var(--dl-text)] shadow-[inset_0_1px_0_rgba(255,255,255,.06),0_8px_24px_rgba(0,0,0,.08)] outline-none backdrop-blur-xl transition placeholder:text-[var(--dl-text-faint)] focus:[box-shadow:var(--dl-focus)] disabled:cursor-not-allowed disabled:opacity-50',
  variants: {
    size: {
      sm: 'text-[0.82rem]',
      md: 'text-sm leading-6',
      lg: 'min-h-36 px-4 py-3.5 text-base leading-7',
    },
    status: {
      default: 'border-[var(--dl-border)] focus:border-[var(--dl-border-focus)]',
      success: 'border-emerald-300/40 focus:border-emerald-200/70',
      warning: 'border-amber-300/40 focus:border-amber-200/70',
      error: 'border-red-300/45 focus:border-red-200/75',
    },
  },
})
const classes = computed(() => textarea({ size: props.size, status: props.status }))
</script>

<template>
  <textarea
    v-bind="attrs"
    data-dl
    data-slot="textarea"
    :value="modelValue ?? ''"
    :disabled="disabled"
    :class="classes"
    @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
  />
</template>
