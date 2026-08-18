<script setup lang="ts">
import { getLocalTimeZone, today } from '@internationalized/date'
import { computed, ref, shallowRef, watch } from 'vue'
import type { DateValue } from 'reka-ui'
import MonthPickerPanel from './MonthPickerPanel.vue'
import DlPopover from './DlPopover.vue'
import './date-picker-panel.css'

const props = withDefaults(defineProps<{ open?: boolean; modelValue?: DateValue | DateValue[] | null; placeholder?: string; locale?: string; multiple?: boolean; preventDeselect?: boolean; disabled?: boolean; readonly?: boolean; zIndex?: number }>(), { open: undefined, modelValue: null, placeholder: '选择月份', locale: 'zh-CN', multiple: false, preventDeselect: false, disabled: false, readonly: false, zIndex: undefined })
const emit = defineEmits<{ 'update:open': [value: boolean]; 'update:modelValue': [value: DateValue | DateValue[] | undefined] }>()
const localOpen = ref(props.open ?? false)
const viewDate = shallowRef<DateValue>(selectedViewDate(props.modelValue))

watch(() => props.open, value => { if (value !== undefined) localOpen.value = value })
watch(() => props.modelValue, value => { viewDate.value = selectedViewDate(value) })
const resolvedOpen = computed({ get: () => props.open ?? localOpen.value, set: value => { localOpen.value = value; emit('update:open', value) } })
const formatter = computed(() => new Intl.DateTimeFormat(props.locale, { year: 'numeric', month: 'long' }))
const valueText = computed(() => {
  const values = Array.isArray(props.modelValue) ? props.modelValue : props.modelValue ? [props.modelValue] : []
  return values.length ? values.map(formatValue).join('、') : props.placeholder
})

watch(resolvedOpen, open => {
  if (open)
    viewDate.value = selectedViewDate(props.modelValue)
})

function selectedViewDate(value: DateValue | DateValue[] | null | undefined) {
  if (Array.isArray(value))
    return value.at(-1) ?? today(getLocalTimeZone())
  return value ?? today(getLocalTimeZone())
}

function toNativeDate(value: DateValue) {
  return 'timeZone' in value ? value.toDate() : value.toDate(getLocalTimeZone())
}

function formatValue(value: DateValue) {
  return formatter.value.format(toNativeDate(value))
}

function update(value: DateValue | DateValue[] | undefined) {
  emit('update:modelValue', value)
  if (!props.multiple && value)
    resolvedOpen.value = false
}
</script>

<template>
  <DlPopover v-model:open="resolvedOpen" tone="subtle" align="start" :arrow="false" :side-offset="0" content-class="dl-date-picker-panel" :z-index="zIndex">
    <template #trigger><button data-dl data-slot="month-picker" type="button" :disabled="disabled" class="flex min-h-11 w-full items-center justify-between gap-3 rounded-[var(--dl-radius-sm)] border border-[var(--dl-border)] bg-[var(--dl-surface)] px-3 text-left text-sm text-[var(--dl-text)] outline-none transition hover:border-[var(--dl-border-strong)] focus-visible:[box-shadow:var(--dl-focus)] disabled:opacity-45"><span :class="!modelValue && 'text-[var(--dl-text-faint)]'">{{ valueText }}</span><span class="text-amber-300" aria-hidden="true">▦</span></button></template>
    <MonthPickerPanel :model-value="modelValue" :placeholder="viewDate" :locale="locale" :multiple="multiple" :prevent-deselect="preventDeselect" :disabled="disabled" :readonly="readonly" class="border-0 bg-transparent p-0 shadow-none" @update:model-value="update" @update:placeholder="viewDate = $event" />
  </DlPopover>
</template>
