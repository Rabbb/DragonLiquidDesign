<script setup lang="ts">
import { computed } from 'vue'
import {
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from 'reka-ui'
import { tv } from 'tailwind-variants'
import type { DlSize } from '../types'
import type { DlSelectOption } from './select.types'

const props = withDefaults(defineProps<{
  modelValue?: string
  options: DlSelectOption[]
  placeholder?: string
  size?: DlSize
  disabled?: boolean
  name?: string
}>(), {
  modelValue: undefined,
  placeholder: '请选择',
  size: 'md',
  disabled: false,
  name: undefined,
})
const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const trigger = tv({
  base: 'flex w-full items-center justify-between gap-3 rounded-[var(--dl-radius-sm)] border border-[var(--dl-border)] bg-[var(--dl-surface)] px-3 text-left text-[var(--dl-text)] shadow-[inset_0_1px_0_rgba(255,255,255,.06),0_8px_24px_rgba(0,0,0,.08)] outline-none backdrop-blur-xl transition data-[placeholder]:text-[var(--dl-text-faint)] focus:border-[var(--dl-border-focus)] focus:[box-shadow:var(--dl-focus)] disabled:cursor-not-allowed disabled:opacity-50',
  variants: {
    size: {
      sm: 'min-h-9 text-[0.82rem]',
      md: 'min-h-11 text-sm',
      lg: 'min-h-[3.25rem] px-4 text-base',
    },
  },
})
const triggerClasses = computed(() => trigger({ size: props.size }))
</script>

<template>
  <SelectRoot
    :model-value="modelValue"
    :disabled="disabled"
    :name="name"
    @update:model-value="value => value && emit('update:modelValue', value as string)"
  >
    <SelectTrigger data-dl data-slot="select-trigger" :class="triggerClasses">
      <SelectValue :placeholder="placeholder" />
      <span class="text-[0.68rem] text-[var(--dl-text-faint)]" aria-hidden="true">▼</span>
    </SelectTrigger>
    <SelectPortal>
      <SelectContent
        data-dl
        data-slot="select-content"
        position="popper"
        :side-offset="8"
        class="z-[100] min-w-[var(--reka-select-trigger-width)] overflow-hidden rounded-[var(--dl-radius-md)] border border-[var(--dl-border-strong)] [background:var(--dl-panel)] p-1.5 text-[var(--dl-text)] shadow-[0_24px_70px_rgba(0,0,0,.42),inset_0_1px_0_rgba(255,255,255,.12)] backdrop-blur-2xl data-[state=open]:animate-in data-[state=closed]:animate-out"
      >
        <SelectViewport class="dl-scrollbar max-h-72">
          <SelectItem
            v-for="option in options"
            :key="option.value"
            :value="option.value"
            :disabled="option.disabled"
            class="relative flex min-h-10 cursor-default select-none items-center rounded-xl py-2 pl-9 pr-3 text-sm outline-none transition data-[disabled]:pointer-events-none data-[disabled]:opacity-40 data-[highlighted]:bg-white/[0.1] data-[highlighted]:text-amber-50 data-[state=checked]:bg-amber-300/10"
          >
            <SelectItemIndicator class="absolute left-3 text-amber-300">◆</SelectItemIndicator>
            <SelectItemText>
              <span class="block">{{ option.label }}</span>
              <span v-if="option.description" class="mt-0.5 block text-xs text-[var(--dl-text-faint)]">{{ option.description }}</span>
            </SelectItemText>
          </SelectItem>
        </SelectViewport>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>
