<script setup lang="ts">
import { getLocalTimeZone, today } from '@internationalized/date'
import { computed, ref, shallowRef, watch } from 'vue'
import type { DateValue } from 'reka-ui'
import DlCalendar from './DlCalendar.vue'
import MonthPickerPanel from './MonthPickerPanel.vue'
import DlPopover from './DlPopover.vue'
import YearPickerPanel from './YearPickerPanel.vue'
import './date-picker-panel.css'

const props = withDefaults(defineProps<{ open?: boolean; modelValue?: DateValue | null; placeholder?: string; locale?: string; disabled?: boolean; zIndex?: number }>(), { open: undefined, modelValue: null, placeholder: '选择日期', locale: 'zh-CN', disabled: false, zIndex: undefined })
const emit = defineEmits<{ 'update:open': [value: boolean]; 'update:modelValue': [value: DateValue | undefined] }>()
type Panel = 'day' | 'month' | 'year'

const localOpen = ref(props.open ?? false)
const panel = ref<Panel>('day')
const viewDate = shallowRef<DateValue>(props.modelValue ?? today(getLocalTimeZone()))

watch(() => props.open, value => { if (value !== undefined) localOpen.value = value })
const resolvedOpen = computed({ get: () => props.open ?? localOpen.value, set: value => { localOpen.value = value; emit('update:open', value) } })
const valueText = computed(() => props.modelValue?.toString() ?? props.placeholder)
const yearFormatter = computed(() => new Intl.DateTimeFormat(props.locale, { year: 'numeric' }))
const monthFormatter = computed(() => new Intl.DateTimeFormat(props.locale, { month: 'long' }))

watch(() => props.modelValue, value => {
  if (value)
    viewDate.value = value
})
watch(resolvedOpen, open => {
  if (open)
    resetPanel()
})

function resetPanel() {
  panel.value = 'day'
  viewDate.value = props.modelValue ?? today(getLocalTimeZone())
}

function toNativeDate(value: DateValue) {
  return 'timeZone' in value ? value.toDate() : value.toDate(getLocalTimeZone())
}

function formatYear(value: DateValue) {
  return yearFormatter.value.format(toNativeDate(value))
}

function formatMonth(value: DateValue) {
  return monthFormatter.value.format(toNativeDate(value))
}

function selectYear(value: DateValue | DateValue[] | undefined) {
  if (!value || Array.isArray(value))
    return
  viewDate.value = value
  panel.value = 'month'
}

function selectMonth(value: DateValue | DateValue[] | undefined) {
  if (!value || Array.isArray(value))
    return
  viewDate.value = value
  panel.value = 'day'
}

function update(value: DateValue | undefined) {
  emit('update:modelValue', value)
  if (value)
    resolvedOpen.value = false
}
</script>

<template>
  <DlPopover v-model:open="resolvedOpen" tone="subtle" align="start" :arrow="false" :side-offset="0" content-class="dl-date-picker-panel" :z-index="zIndex">
    <template #trigger><button data-dl data-slot="date-picker" type="button" :disabled="disabled" class="flex min-h-11 w-full items-center justify-between gap-3 rounded-[var(--dl-radius-sm)] border border-[var(--dl-border)] bg-[var(--dl-surface)] px-3 text-left text-sm text-[var(--dl-text)] outline-none transition hover:border-[var(--dl-border-strong)] focus-visible:[box-shadow:var(--dl-focus)] disabled:opacity-45"><span :class="!modelValue && 'text-[var(--dl-text-faint)]'">{{ valueText }}</span><span class="text-amber-300" aria-hidden="true">▦</span></button></template>
    <DlCalendar v-if="panel === 'day'" :model-value="modelValue" :placeholder="viewDate" :locale="locale" class="border-0 bg-transparent p-0 shadow-none" @update:model-value="update" @update:placeholder="viewDate = $event">
      <template #heading="{ date }">
        <div class="flex items-center justify-center gap-0.5 font-bold text-[var(--dl-text)]">
          <button data-slot="date-picker-year-trigger" type="button" class="dl-date-picker-heading-trigger" :aria-label="`选择年份，当前${formatYear(date)}`" @click="panel = 'year'">{{ formatYear(date) }}</button>
          <button data-slot="date-picker-month-trigger" type="button" class="dl-date-picker-heading-trigger" :aria-label="`选择月份，当前${formatMonth(date)}`" @click="panel = 'month'">{{ formatMonth(date) }}</button>
        </div>
      </template>
    </DlCalendar>
    <MonthPickerPanel v-else-if="panel === 'month'" :model-value="viewDate" :placeholder="viewDate" :locale="locale" prevent-deselect class="border-0 bg-transparent p-0 shadow-none" @update:model-value="selectMonth" @update:placeholder="viewDate = $event">
      <template #heading="{ date }"><button data-slot="date-picker-year-trigger" type="button" class="dl-date-picker-heading-trigger font-bold" :aria-label="`选择年份，当前${formatYear(date)}`" @click="panel = 'year'">{{ formatYear(date) }}</button></template>
    </MonthPickerPanel>
    <YearPickerPanel v-else :model-value="viewDate" :placeholder="viewDate" :locale="locale" prevent-deselect class="border-0 bg-transparent p-0 shadow-none" @update:model-value="selectYear" @update:placeholder="viewDate = $event" />
  </DlPopover>
</template>
