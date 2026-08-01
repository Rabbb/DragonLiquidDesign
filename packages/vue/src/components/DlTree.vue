<script setup lang="ts">
import { TreeItem, TreeRoot } from 'reka-ui'
import type { DlTreeNode } from './primitive.types'

withDefaults(defineProps<{
  modelValue?: DlTreeNode | DlTreeNode[]
  items: DlTreeNode[]
  expanded?: string[]
  multiple?: boolean
  disabled?: boolean
  propagateSelect?: boolean
  bubbleSelect?: boolean
}>(), { modelValue: undefined, expanded: () => [], multiple: false, disabled: false, propagateSelect: false, bubbleSelect: false })
const emit = defineEmits<{ 'update:modelValue': [value: DlTreeNode | DlTreeNode[]]; 'update:expanded': [value: string[]] }>()
</script>

<template>
  <TreeRoot
    v-slot="{ flattenItems }" data-dl data-slot="tree" :model-value="modelValue" :items="items" :expanded="expanded" :multiple="multiple" :disabled="disabled"
    :get-key="item => item.id" :get-children="item => item.children" :propagate-select="propagateSelect" :bubble-select="bubbleSelect"
    class="rounded-[var(--dl-radius-md)] border border-[var(--dl-border)] bg-[var(--dl-surface)] p-1.5 text-sm shadow-[var(--dl-shadow)]"
    @update:model-value="emit('update:modelValue', $event as DlTreeNode | DlTreeNode[])" @update:expanded="emit('update:expanded', $event)"
  >
    <TreeItem v-for="item in flattenItems" :key="item._id" v-bind="item.bind" v-slot="{ isExpanded, isSelected, isIndeterminate }" :disabled="item.value.disabled" class="group flex min-h-10 cursor-default items-center gap-2 rounded-xl pr-3 text-[var(--dl-text-muted)] outline-none transition data-[disabled]:opacity-40 data-[selected]:bg-amber-300/10 data-[selected]:text-amber-100 focus-visible:[box-shadow:var(--dl-focus)] hover:bg-white/[0.055]" :style="{ paddingLeft: `${0.6 + item.level * 1.15}rem` }">
      <span class="grid size-5 shrink-0 place-items-center text-[10px] text-amber-300 transition group-data-[expanded]:rotate-90">{{ item.hasChildren ? '▶' : '•' }}</span>
      <span class="min-w-0 flex-1"><b class="block truncate font-semibold">{{ item.value.label }}</b><small v-if="item.value.description" class="block truncate text-[var(--dl-text-faint)]">{{ item.value.description }}</small></span>
      <span v-if="isSelected || isIndeterminate" class="text-xs text-amber-300">{{ isIndeterminate ? '−' : '✓' }}</span>
      <span class="sr-only">{{ isExpanded ? '已展开' : '已收起' }}</span>
    </TreeItem>
  </TreeRoot>
</template>
