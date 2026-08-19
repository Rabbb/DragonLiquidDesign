<script setup lang="ts">
import { ListboxContent, ListboxItem, ListboxItemIndicator, ListboxRoot } from 'reka-ui'
import type { DlChoiceOption } from './primitive.types'

withDefaults(defineProps<{
  modelValue?: string | string[]
  options: DlChoiceOption[]
  multiple?: boolean
  disabled?: boolean
  orientation?: 'horizontal' | 'vertical'
  name?: string
}>(), { modelValue: undefined, multiple: false, disabled: false, orientation: 'vertical', name: undefined })
const emit = defineEmits<{ 'update:modelValue': [value: string | string[]] }>()
</script>

<template>
  <ListboxRoot data-dl data-slot="listbox" :model-value="modelValue" :multiple="multiple" :disabled="disabled" :orientation="orientation" :name="name" class="rounded-[var(--dl-radius-md)] border border-[var(--dl-border)] bg-[var(--dl-surface)] p-1.5 shadow-[var(--dl-shadow)] data-[disabled]:opacity-50" @update:model-value="emit('update:modelValue', $event as string | string[])">
    <ListboxContent class="dl-scrollbar flex max-h-80 gap-1 outline-none data-[orientation=vertical]:flex-col">
      <ListboxItem v-for="option in options" :key="option.value" :value="option.value" :disabled="option.disabled" class="relative flex min-h-11 cursor-default items-start rounded-xl py-2 pl-10 pr-3 text-sm text-[var(--dl-text)] outline-none data-[disabled]:opacity-40 data-[highlighted]:bg-[var(--dl-surface-hover)] data-[state=checked]:bg-[var(--dl-accent-surface)]">
        <ListboxItemIndicator class="absolute left-3 top-3 text-[var(--dl-accent)]">✓</ListboxItemIndicator>
        <span><b class="block font-semibold">{{ option.label }}</b><small v-if="option.description" class="mt-0.5 block text-[var(--dl-text-faint)]">{{ option.description }}</small></span>
      </ListboxItem>
    </ListboxContent>
  </ListboxRoot>
</template>
