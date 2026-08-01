<script setup lang="ts">
import { computed, ref } from 'vue'
import type { DateValue } from 'reka-ui'
import DlCalendar from './DlCalendar.vue'
import DlPopover from './DlPopover.vue'

const props = withDefaults(defineProps<{ modelValue?: DateValue | null; placeholder?: string; locale?: string; disabled?: boolean; zIndex?: number }>(), { modelValue: null, placeholder: '选择日期', locale: 'zh-CN', disabled: false, zIndex: undefined })
const emit = defineEmits<{ 'update:modelValue': [value: DateValue | undefined] }>()
const open = ref(false)
const valueText = computed(() => props.modelValue?.toString() ?? props.placeholder)
function update(value: DateValue | undefined) { emit('update:modelValue', value); if (value) open.value = false }
</script>

<template>
  <DlPopover v-model:open="open" title="选择日期" align="start" :z-index="zIndex">
    <template #trigger><button data-dl data-slot="date-picker" type="button" :disabled="disabled" class="flex min-h-11 w-full items-center justify-between gap-3 rounded-[var(--dl-radius-sm)] border border-[var(--dl-border)] bg-[var(--dl-surface)] px-3 text-left text-sm text-[var(--dl-text)] outline-none transition hover:border-[var(--dl-border-strong)] focus-visible:[box-shadow:var(--dl-focus)] disabled:opacity-45"><span :class="!modelValue && 'text-[var(--dl-text-faint)]'">{{ valueText }}</span><span class="text-amber-300" aria-hidden="true">▦</span></button></template>
    <DlCalendar :model-value="modelValue" :locale="locale" class="border-0 bg-transparent p-0 shadow-none" @update:model-value="update" />
  </DlPopover>
</template>
