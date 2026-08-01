<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { tv } from 'tailwind-variants'
import type { DlSize } from '../types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  modelValue?: string | number | null
  size?: DlSize
  status?: 'default' | 'success' | 'warning' | 'error'
  type?: string
  disabled?: boolean
}>(), {
  modelValue: '',
  size: 'md',
  status: 'default',
  type: 'text',
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const attrs = useAttrs()
const field = tv({
  base: 'flex items-center gap-2 rounded-[var(--dl-radius-sm)] border bg-[var(--dl-surface)] px-3 text-[var(--dl-text)] shadow-[inset_0_1px_0_rgba(255,255,255,.06),0_8px_24px_rgba(0,0,0,.08)] backdrop-blur-xl transition focus-within:[box-shadow:var(--dl-focus)]',
  variants: {
    size: {
      sm: 'min-h-9 text-[0.82rem]',
      md: 'min-h-11 text-sm',
      lg: 'min-h-[3.25rem] px-4 text-base',
    },
    status: {
      default: 'border-[var(--dl-border)] focus-within:border-[var(--dl-border-focus)]',
      success: 'border-emerald-300/40 focus-within:border-emerald-200/70',
      warning: 'border-amber-300/40 focus-within:border-amber-200/70',
      error: 'border-red-300/45 focus-within:border-red-200/75',
    },
    disabled: {
      true: 'cursor-not-allowed opacity-50',
      false: '',
    },
  },
})
const classes = computed(() => field({ size: props.size, status: props.status, disabled: props.disabled }))
</script>

<template>
  <label data-dl data-slot="input" :class="classes">
    <span v-if="$slots.leading" class="text-[var(--dl-text-faint)]"><slot name="leading" /></span>
    <input
      v-bind="attrs"
      :type="type"
      :value="modelValue ?? ''"
      :disabled="disabled"
      class="min-w-0 flex-1 border-0 bg-transparent text-inherit outline-none placeholder:text-[var(--dl-text-faint)]"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    >
    <span v-if="$slots.trailing" class="text-[var(--dl-text-faint)]"><slot name="trailing" /></span>
  </label>
</template>
