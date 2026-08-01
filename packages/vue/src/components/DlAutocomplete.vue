<script setup lang="ts">
import { computed } from 'vue'
import { AutocompleteAnchor, AutocompleteContent, AutocompleteEmpty, AutocompleteInput, AutocompleteItem, AutocompleteItemIndicator, AutocompletePortal, AutocompleteRoot, AutocompleteTrigger, AutocompleteViewport } from 'reka-ui'
import { useDlSelectLayer } from '../composables/useDlLayer'
import type { DlSize } from '../types'

const props = withDefaults(defineProps<{
  open?: boolean
  modelValue?: string
  suggestions: string[]
  placeholder?: string
  size?: DlSize
  disabled?: boolean
  name?: string
  required?: boolean
  zIndex?: number
}>(), { open: undefined, modelValue: '', placeholder: '输入关键词', size: 'md', disabled: false, name: undefined, required: false, zIndex: undefined })
const emit = defineEmits<{ 'update:open': [value: boolean]; 'update:modelValue': [value: string]; select: [value: string] }>()
const layer = useDlSelectLayer(() => props.zIndex)
const heightClass = computed(() => ({ sm: 'min-h-9 text-xs', md: 'min-h-11 text-sm', lg: 'min-h-[3.25rem] text-base' }[props.size]))
</script>

<template>
  <AutocompleteRoot :open="open" :model-value="modelValue" :disabled="disabled" :name="name" :required="required" open-on-click open-on-focus @update:open="emit('update:open', $event)" @update:model-value="emit('update:modelValue', $event)">
    <AutocompleteAnchor data-dl data-slot="autocomplete" :class="['flex w-full items-center rounded-[var(--dl-radius-sm)] border border-[var(--dl-border)] bg-[var(--dl-surface)] px-3 shadow-[inset_0_1px_0_rgba(255,255,255,.06)] transition focus-within:border-[var(--dl-border-focus)] focus-within:[box-shadow:var(--dl-focus)]', heightClass]">
      <AutocompleteInput :placeholder="placeholder" class="min-w-0 flex-1 border-0 bg-transparent text-[var(--dl-text)] outline-none placeholder:text-[var(--dl-text-faint)]" />
      <AutocompleteTrigger class="grid size-7 place-items-center rounded-lg text-xs text-[var(--dl-text-faint)] hover:bg-white/[0.07]" aria-label="显示建议">⌄</AutocompleteTrigger>
    </AutocompleteAnchor>
    <AutocompletePortal>
      <AutocompleteContent data-dl data-dl-layer="select" :style="{ zIndex: layer }" position="popper" :side-offset="8" class="min-w-[var(--reka-autocomplete-trigger-width)] overflow-hidden rounded-[var(--dl-radius-md)] border border-[var(--dl-border-strong)] [background:var(--dl-panel)] p-1.5 text-sm text-[var(--dl-text)] shadow-[0_24px_70px_rgba(0,0,0,.44)] backdrop-blur-2xl">
        <AutocompleteViewport class="dl-scrollbar max-h-72">
          <AutocompleteEmpty class="px-3 py-6 text-center text-[var(--dl-text-faint)]">没有建议，仍可使用当前输入</AutocompleteEmpty>
          <AutocompleteItem v-for="suggestion in suggestions" :key="suggestion" :value="suggestion" class="relative flex min-h-9 cursor-default items-center rounded-xl py-2 pl-9 pr-3 outline-none data-[highlighted]:bg-white/[0.09] data-[highlighted]:text-amber-100" @select="emit('select', suggestion)">
            <AutocompleteItemIndicator class="absolute left-3 text-amber-300">↳</AutocompleteItemIndicator>{{ suggestion }}
          </AutocompleteItem>
        </AutocompleteViewport>
      </AutocompleteContent>
    </AutocompletePortal>
  </AutocompleteRoot>
</template>
