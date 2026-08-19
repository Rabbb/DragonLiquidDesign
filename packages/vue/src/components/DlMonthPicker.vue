<script setup lang="ts">
import { getLocalTimeZone, today } from '@internationalized/date'
import { computed, ref, shallowRef, watch } from 'vue'
import type { DateValue } from 'reka-ui'
import MonthPickerPanel from './MonthPickerPanel.vue'
import DlPopover from './DlPopover.vue'
import YearPickerPanel from './YearPickerPanel.vue'
import './date-picker-panel.css'

const props = withDefaults(defineProps<{ open?: boolean; modelValue?: DateValue | DateValue[] | null; placeholder?: string; locale?: string; multiple?: boolean; preventDeselect?: boolean; disabled?: boolean; readonly?: boolean; zIndex?: number }>(), { open: undefined, modelValue: null, placeholder: '选择月份', locale: 'zh-CN', multiple: false, preventDeselect: false, disabled: false, readonly: false, zIndex: undefined })
const emit = defineEmits<{ 'update:open': [value: boolean]; 'update:modelValue': [value: DateValue | DateValue[] | undefined] }>()
type Panel = 'month' | 'year'
const localOpen = ref(props.open ?? false)
const panel = ref<Panel>('month')
const viewDate = shallowRef<DateValue>(selectedViewDate(props.modelValue))

watch(() => props.open, value => { if (value !== undefined) localOpen.value = value })
watch(() => props.modelValue, value => { viewDate.value = selectedViewDate(value) })
const resolvedOpen = computed({ get: () => props.open ?? localOpen.value, set: value => { localOpen.value = value; emit('update:open', value) } })
const formatter = computed(() => new Intl.DateTimeFormat(props.locale, { year: 'numeric', month: 'long' }))
const yearFormatter = computed(() => new Intl.DateTimeFormat(props.locale, { year: 'numeric' }))
const valueText = computed(() => {
  const values = Array.isArray(props.modelValue) ? props.modelValue : props.modelValue ? [props.modelValue] : []
  return values.length ? values.map(formatValue).join('、') : props.placeholder
})

watch(resolvedOpen, open => {
  if (open) {
    panel.value = 'month'
    viewDate.value = selectedViewDate(props.modelValue)
  }
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

function formatYear(value: DateValue) {
  return yearFormatter.value.format(toNativeDate(value))
}

function selectYear(value: DateValue | DateValue[] | undefined) {
  if (!value || Array.isArray(value))
    return
  viewDate.value = value
  panel.value = 'month'
}

function update(value: DateValue | DateValue[] | undefined) {
  emit('update:modelValue', value)
  if (!props.multiple && value)
    resolvedOpen.value = false
}
</script>

<template>
  <DlPopover v-model:open="resolvedOpen" tone="subtle" align="start" :arrow="false" :side-offset="0" content-class="dl-date-picker-panel" :z-index="zIndex">
    <template #trigger><button data-dl data-slot="month-picker" type="button" :disabled="disabled" class="flex min-h-11 w-full items-center justify-between gap-3 rounded-[var(--dl-radius-sm)] border border-[var(--dl-border)] bg-[var(--dl-surface)] px-3 text-left text-sm text-[var(--dl-text)] outline-none transition hover:border-[var(--dl-border-strong)] focus-visible:[box-shadow:var(--dl-focus)] disabled:opacity-45"><span :class="!modelValue && 'text-[var(--dl-text-faint)]'">{{ valueText }}</span><span class="text-[var(--dl-accent)]" aria-hidden="true">▦</span></button></template>
    <MonthPickerPanel v-if="panel === 'month'" :model-value="modelValue" :placeholder="viewDate" :locale="locale" :multiple="multiple" :prevent-deselect="preventDeselect" :disabled="disabled" :readonly="readonly" class="border-0 bg-transparent p-0 shadow-none" @update:model-value="update" @update:placeholder="viewDate = $event">
      <template #heading="{ date }"><button data-slot="month-picker-year-trigger" type="button" class="dl-date-picker-heading-trigger font-bold" :aria-label="`选择年份，当前${formatYear(date)}`" @click="panel = 'year'">{{ formatYear(date) }}</button></template>
    </MonthPickerPanel>
    <YearPickerPanel v-else :model-value="viewDate" :placeholder="viewDate" :locale="locale" :disabled="disabled" :readonly="readonly" prevent-deselect class="border-0 bg-transparent p-0 shadow-none" @update:model-value="selectYear" @update:placeholder="viewDate = $event" />
  </DlPopover>
</template>
