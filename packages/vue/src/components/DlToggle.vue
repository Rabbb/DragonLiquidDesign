<script setup lang="ts">
import { computed } from 'vue'
import { Toggle } from 'reka-ui'
import { tv } from 'tailwind-variants'
import type { DlSize } from '../types'

const props = withDefaults(defineProps<{
  modelValue?: boolean
  size?: DlSize
  disabled?: boolean
  ariaLabel?: string
}>(), { modelValue: false, size: 'md', disabled: false, ariaLabel: undefined })
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()
const toggle = tv({
  base: 'inline-flex items-center justify-center gap-2 rounded-[var(--dl-radius-sm)] border border-transparent font-semibold text-[var(--dl-text-muted)] outline-none transition hover:border-[var(--dl-border)] hover:bg-white/[0.06] hover:text-[var(--dl-text)] focus-visible:[box-shadow:var(--dl-focus)] data-[state=on]:border-amber-200/35 data-[state=on]:bg-amber-300/12 data-[state=on]:text-amber-100 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-45',
  variants: { size: { sm: 'min-h-8 px-2.5 text-xs', md: 'min-h-10 px-3 text-sm', lg: 'min-h-12 px-4 text-base' } },
})
const classes = computed(() => toggle({ size: props.size }))
</script>

<template>
  <Toggle data-dl data-slot="toggle" :model-value="modelValue" :disabled="disabled" :aria-label="ariaLabel" :class="classes" @update:model-value="emit('update:modelValue', $event)">
    <slot />
  </Toggle>
</template>
