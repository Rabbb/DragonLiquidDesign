<script setup lang="ts">
import { computed, ref } from 'vue'
import { ComboboxAnchor, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxItemIndicator, ComboboxPortal, ComboboxRoot, ComboboxTrigger, ComboboxViewport } from 'reka-ui'
import { useDlSelectLayer } from '../composables/useDlLayer'
import type { DlSize } from '../types'
import type { DlChoiceOption } from './primitive.types'

const props = withDefaults(defineProps<{
  open?: boolean
  modelValue?: string
  options: DlChoiceOption[]
  placeholder?: string
  size?: DlSize
  disabled?: boolean
  name?: string
  zIndex?: number
}>(), { open: undefined, modelValue: undefined, placeholder: '搜索或选择', size: 'md', disabled: false, name: undefined, zIndex: undefined })
const emit = defineEmits<{ 'update:open': [value: boolean]; 'update:modelValue': [value: string]; 'update:searchTerm': [value: string] }>()
const searchTerm = ref('')
const layer = useDlSelectLayer(() => props.zIndex)
const selectedLabel = computed(() => props.options.find(item => item.value === props.modelValue)?.label ?? '')
const heightClass = computed(() => ({ sm: 'min-h-9 text-xs', md: 'min-h-11 text-sm', lg: 'min-h-[3.25rem] text-base' }[props.size]))
</script>

<template>
  <ComboboxRoot
    :open="open" :model-value="modelValue" :disabled="disabled" :name="name" open-on-click open-on-focus
    @update:open="emit('update:open', $event)"
    @update:model-value="$event !== undefined && emit('update:modelValue', $event as string)"
  >
    <ComboboxAnchor data-dl data-slot="combobox" :class="['flex w-full items-center rounded-[var(--dl-radius-sm)] border border-[var(--dl-border)] bg-[var(--dl-surface)] px-3 shadow-[inset_0_1px_0_rgba(255,255,255,.06)] transition focus-within:border-[var(--dl-border-focus)] focus-within:[box-shadow:var(--dl-focus)]', heightClass]">
      <ComboboxInput
        v-model="searchTerm" :placeholder="placeholder" :display-value="() => selectedLabel"
        class="min-w-0 flex-1 border-0 bg-transparent text-[var(--dl-text)] outline-none placeholder:text-[var(--dl-text-faint)]"
        @update:model-value="emit('update:searchTerm', $event)"
      />
      <ComboboxTrigger class="grid size-7 place-items-center rounded-lg text-xs text-[var(--dl-text-faint)] hover:bg-[var(--dl-surface-hover)]" aria-label="打开选项">▼</ComboboxTrigger>
    </ComboboxAnchor>
    <ComboboxPortal>
      <ComboboxContent data-dl data-dl-layer="select" :style="{ zIndex: layer }" position="popper" :side-offset="8" class="min-w-[var(--reka-combobox-trigger-width)] overflow-hidden rounded-[var(--dl-radius-md)] border border-[var(--dl-border-strong)] [background:var(--dl-panel)] p-1.5 text-[var(--dl-text)] shadow-[0_24px_70px_rgba(0,0,0,.42)] backdrop-blur-2xl">
        <ComboboxViewport class="dl-scrollbar max-h-72">
          <ComboboxEmpty class="px-3 py-6 text-center text-sm text-[var(--dl-text-faint)]">没有匹配项</ComboboxEmpty>
          <ComboboxItem v-for="option in options" :key="option.value" :value="option.value" :disabled="option.disabled" class="relative flex min-h-10 cursor-default items-center rounded-xl py-2 pl-9 pr-3 text-sm outline-none data-[disabled]:opacity-40 data-[highlighted]:bg-[var(--dl-surface-hover)] data-[state=checked]:bg-[var(--dl-accent-surface)]">
            <ComboboxItemIndicator class="absolute left-3 text-[var(--dl-accent)]">●</ComboboxItemIndicator>
            <span><b class="block font-medium">{{ option.label }}</b><small v-if="option.description" class="text-[var(--dl-text-faint)]">{{ option.description }}</small></span>
          </ComboboxItem>
        </ComboboxViewport>
      </ComboboxContent>
    </ComboboxPortal>
  </ComboboxRoot>
</template>
