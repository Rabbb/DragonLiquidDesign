<script setup lang="ts">
import { computed, ref, watch } from 'vue'
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
import { useDlSelectLayer } from '../composables/useDlLayer'
import { useDlHoverValue } from '../composables/useDlHoverValue'
import type { DlSize } from '../types'
import type { DlSelectOption } from './select.types'

const props = withDefaults(defineProps<{
  open?: boolean
  hoverValue?: string | null
  modelValue?: string
  options: DlSelectOption[]
  placeholder?: string
  size?: DlSize
  disabled?: boolean
  name?: string
  zIndex?: number
}>(), {
  open: undefined,
  modelValue: undefined,
  placeholder: '请选择',
  size: 'md',
  disabled: false,
  name: undefined,
  zIndex: undefined,
})
const emit = defineEmits<{
  'update:open': [value: boolean]
  'update:modelValue': [value: string]
  'update:hoverValue': [value: string | null]
  hover: [value: string | null]
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
const contentZIndex = useDlSelectLayer(() => props.zIndex)
const visible = ref(props.open ?? false)
watch(() => props.open, value => { if (value !== undefined) visible.value = value })
const hover = useDlHoverValue({ value: () => props.hoverValue, open: () => (props.open ?? visible.value) && !props.disabled,
  choices: () => props.options.filter(option => !option.disabled).map(option => option.value),
  update: value => { emit('update:hoverValue', value); emit('hover', value) } })
function openChanged(value: boolean) { visible.value = value; if (!value) hover.clear(); emit('update:open', value) }
function select(value: unknown) { if (typeof value === 'string' && value) emit('update:modelValue', value); hover.clear() }
</script>

<template>
  <SelectRoot
    :open="open"
    :model-value="modelValue"
    :disabled="disabled"
    :name="name"
    @update:open="openChanged"
    @update:model-value="select"
  >
    <SelectTrigger data-dl data-slot="select-trigger" :class="triggerClasses">
      <SelectValue :placeholder="placeholder" />
      <span class="text-[0.68rem] text-[var(--dl-text-faint)]" aria-hidden="true">▼</span>
    </SelectTrigger>
    <SelectPortal>
      <SelectContent
        data-dl
        data-slot="select-content"
        data-dl-layer="select"
        :style="{ zIndex: contentZIndex }"
        position="popper"
        :side-offset="8"
        class="min-w-[var(--reka-select-trigger-width)] overflow-hidden rounded-[var(--dl-radius-md)] border border-[var(--dl-border-strong)] [background:var(--dl-panel)] p-1.5 text-[var(--dl-text)] shadow-[0_24px_70px_rgba(0,0,0,.42),inset_0_1px_0_rgba(255,255,255,.12)] backdrop-blur-2xl data-[state=open]:animate-in data-[state=closed]:animate-out"
      >
        <SelectViewport class="dl-scrollbar max-h-72">
          <SelectItem
            v-for="option in options"
            :key="option.value"
            :value="option.value"
            :disabled="option.disabled"
            @pointermove="hover.pointer($event, option.value)"
            @pointerleave="hover.leave(option.value)"
            @focus="hover.set(option.value)"
            @blur="hover.leave(option.value)"
            class="relative flex min-h-10 cursor-default select-none items-center rounded-xl py-2 pl-9 pr-3 text-sm outline-none transition data-[disabled]:pointer-events-none data-[disabled]:opacity-40 data-[highlighted]:bg-[var(--dl-surface-hover)] data-[highlighted]:text-[var(--dl-accent-text)] data-[state=checked]:bg-[var(--dl-accent-surface)]"
          >
            <SelectItemIndicator class="absolute left-3 text-[var(--dl-accent)]">◆</SelectItemIndicator>
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
