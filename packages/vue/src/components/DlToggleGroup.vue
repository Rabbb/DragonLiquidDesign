<script setup lang="ts">
import { computed } from 'vue'
import { ToggleGroupItem, ToggleGroupRoot } from 'reka-ui'
import { tv } from 'tailwind-variants'
import type { DlSize } from '../types'
import type { DlChoiceOption } from './primitive.types'

const props = withDefaults(defineProps<{
  modelValue?: string | string[]
  items: DlChoiceOption[]
  type?: 'single' | 'multiple'
  orientation?: 'horizontal' | 'vertical'
  size?: DlSize
  disabled?: boolean
}>(), { modelValue: undefined, type: 'single', orientation: 'horizontal', size: 'md', disabled: false })
const emit = defineEmits<{ 'update:modelValue': [value: string | string[]] }>()
const styles = tv({
  slots: {
    root: 'inline-flex w-fit rounded-[var(--dl-radius-sm)] border border-[var(--dl-border)] bg-black/20 p-1 data-[orientation=vertical]:flex-col',
    item: 'rounded-[9px] font-semibold text-[var(--dl-text-muted)] outline-none transition hover:bg-white/[0.05] hover:text-[var(--dl-text)] focus-visible:[box-shadow:var(--dl-focus)] data-[state=on]:bg-[var(--dl-surface-strong)] data-[state=on]:text-amber-200 data-[state=on]:shadow-[inset_0_1px_0_rgba(255,255,255,.1)] data-[disabled]:opacity-40',
  },
  variants: { size: { sm: { item: 'min-h-7 px-2 text-xs' }, md: { item: 'min-h-9 px-3 text-sm' }, lg: { item: 'min-h-11 px-4 text-base' } } },
})
const classes = computed(() => styles({ size: props.size }))
</script>

<template>
  <ToggleGroupRoot data-dl data-slot="toggle-group" :model-value="modelValue" :type="type" :orientation="orientation" :disabled="disabled" :class="classes.root()" @update:model-value="emit('update:modelValue', $event as string | string[])">
    <ToggleGroupItem v-for="item in items" :key="item.value" :value="item.value" :disabled="item.disabled" :class="classes.item()" :aria-label="item.label">
      <slot name="item" :item="item">{{ item.label }}</slot>
    </ToggleGroupItem>
  </ToggleGroupRoot>
</template>
