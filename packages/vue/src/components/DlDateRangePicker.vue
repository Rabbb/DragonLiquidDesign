<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { DateRange } from 'reka-ui'
import DlPopover from './DlPopover.vue'
import DlRangeCalendar from './DlRangeCalendar.vue'
import './date-picker-panel.css'

const props = withDefaults(defineProps<{ open?: boolean; modelValue?: DateRange | null; placeholder?: string; locale?: string; disabled?: boolean; numberOfMonths?: number; zIndex?: number }>(), { open: undefined, modelValue: null, placeholder: '选择日期范围', locale: 'zh-CN', disabled: false, numberOfMonths: 1, zIndex: undefined })
const emit = defineEmits<{ 'update:open': [value: boolean]; 'update:modelValue': [value: DateRange] }>()
const localOpen = ref(props.open ?? false)
watch(() => props.open, value => { if (value !== undefined) localOpen.value = value })
const resolvedOpen = computed({ get: () => props.open ?? localOpen.value, set: value => { localOpen.value = value; emit('update:open', value) } })
const valueText = computed(() => props.modelValue?.start && props.modelValue?.end ? `${props.modelValue.start.toString()} — ${props.modelValue.end.toString()}` : props.placeholder)
</script>

<template>
  <DlPopover v-model:open="resolvedOpen" tone="subtle" align="start" :arrow="false" :side-offset="0" content-class="dl-date-picker-panel" :z-index="zIndex">
    <template #trigger><button data-dl data-slot="date-range-picker" type="button" :disabled="disabled" class="flex min-h-11 w-full items-center justify-between gap-3 rounded-[var(--dl-radius-sm)] border border-[var(--dl-border)] bg-[var(--dl-surface)] px-3 text-left text-sm text-[var(--dl-text)] outline-none transition hover:border-[var(--dl-border-strong)] focus-visible:[box-shadow:var(--dl-focus)] disabled:opacity-45"><span :class="!modelValue?.start && 'text-[var(--dl-text-faint)]'">{{ valueText }}</span><span class="text-amber-300" aria-hidden="true">▦</span></button></template>
    <DlRangeCalendar :model-value="modelValue" :locale="locale" :number-of-months="numberOfMonths" class="border-0 bg-transparent p-0 shadow-none" @update:model-value="emit('update:modelValue', $event)" />
  </DlPopover>
</template>
