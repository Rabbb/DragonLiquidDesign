<script setup lang="ts">
import { TagsInputClear, TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText, TagsInputRoot } from 'reka-ui'

const props = withDefaults(defineProps<{
  modelValue?: string[]
  placeholder?: string
  disabled?: boolean
  max?: number
  delimiter?: string
  clearable?: boolean
  name?: string
}>(), { modelValue: () => [], placeholder: '输入后按 Enter', disabled: false, max: undefined, delimiter: ',', clearable: true, name: undefined })
const emit = defineEmits<{ 'update:modelValue': [value: string[]]; addTag: [value: string]; removeTag: [value: string] }>()
</script>

<template>
  <TagsInputRoot
    data-dl data-slot="tags-input" :model-value="modelValue" :disabled="disabled" :max="max" :delimiter="delimiter" :name="name"
    add-on-paste add-on-tab class="flex min-h-11 w-full flex-wrap items-center gap-2 rounded-[var(--dl-radius-sm)] border border-[var(--dl-border)] bg-[var(--dl-surface)] px-2.5 py-2 text-sm text-[var(--dl-text)] outline-none transition focus-within:border-[var(--dl-border-focus)] focus-within:[box-shadow:var(--dl-focus)] data-[disabled]:opacity-50"
    @update:model-value="emit('update:modelValue', $event as string[])" @add-tag="emit('addTag', $event as string)" @remove-tag="emit('removeTag', $event as string)"
  >
    <TagsInputItem v-for="tag in modelValue" :key="tag" :value="tag" class="inline-flex items-center gap-1 rounded-full border border-amber-200/25 bg-amber-300/10 px-2 py-1 text-xs text-amber-100 data-[state=active]:[box-shadow:var(--dl-focus)]">
      <TagsInputItemText />
      <TagsInputItemDelete class="grid size-4 place-items-center rounded-full text-amber-100/60 hover:bg-white/10 hover:text-amber-50" :aria-label="`移除 ${tag}`">×</TagsInputItemDelete>
    </TagsInputItem>
    <TagsInputInput :placeholder="modelValue.length ? '' : placeholder" class="min-w-28 flex-1 border-0 bg-transparent px-1 outline-none placeholder:text-[var(--dl-text-faint)]" />
    <TagsInputClear v-if="clearable && modelValue.length" class="rounded-lg px-2 py-1 text-xs text-[var(--dl-text-faint)] hover:bg-white/[0.07] hover:text-[var(--dl-text)]">清空</TagsInputClear>
  </TagsInputRoot>
</template>
