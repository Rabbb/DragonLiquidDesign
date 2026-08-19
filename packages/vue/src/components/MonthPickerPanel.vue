<script setup lang="ts">
import { MonthPickerCell, MonthPickerCellTrigger, MonthPickerGrid, MonthPickerGridBody, MonthPickerGridRow, MonthPickerHeader, MonthPickerHeading, MonthPickerNext, MonthPickerPrev, MonthPickerRoot, type DateValue } from 'reka-ui'
import { dlCalendarCellClass, dlCalendarClass, dlCalendarNavClass } from './date.styles'

const rangeProps = withDefaults(defineProps<{ modelValue?: DateValue | DateValue[] | null; placeholder?: DateValue; locale?: string; multiple?: boolean; preventDeselect?: boolean; disabled?: boolean; readonly?: boolean; minValue?: DateValue; maxValue?: DateValue; rangeStart?: DateValue; rangeEnd?: DateValue }>(), { modelValue: null, placeholder: undefined, locale: 'zh-CN', multiple: false, preventDeselect: false, disabled: false, readonly: false, minValue: undefined, maxValue: undefined, rangeStart: undefined, rangeEnd: undefined })
const emit = defineEmits<{ 'hover': [value: DateValue | undefined]; 'update:modelValue': [value: DateValue | DateValue[] | undefined]; 'update:placeholder': [value: DateValue] }>()

function compareMonth(left: DateValue, right: DateValue) {
  return (left.year - right.year) * 12 + left.month - right.month
}

function isSameMonth(left: DateValue | undefined, right: DateValue) {
  return Boolean(left && compareMonth(left, right) === 0)
}

function isInRange(date: DateValue) {
  return Boolean(rangeProps.rangeStart && rangeProps.rangeEnd && compareMonth(date, rangeProps.rangeStart) >= 0 && compareMonth(date, rangeProps.rangeEnd) <= 0)
}
</script>

<template>
  <MonthPickerRoot v-slot="{ grid, date }" data-dl data-slot="month-picker-panel" :model-value="modelValue" :placeholder="placeholder" :locale="locale" :multiple="multiple" :prevent-deselect="preventDeselect" :disabled="disabled" :readonly="readonly" :min-value="minValue" :max-value="maxValue" :class="dlCalendarClass" @pointerleave="emit('hover', undefined)" @update:model-value="emit('update:modelValue', $event)" @update:placeholder="emit('update:placeholder', $event)">
    <MonthPickerHeader class="mb-4 flex items-center justify-between"><MonthPickerPrev :class="dlCalendarNavClass" aria-label="上一年">‹</MonthPickerPrev><slot name="heading" :date="date"><MonthPickerHeading class="font-bold" /></slot><MonthPickerNext :class="dlCalendarNavClass" aria-label="下一年">›</MonthPickerNext></MonthPickerHeader>
    <MonthPickerGrid><MonthPickerGridBody><MonthPickerGridRow class="dl-month-picker-grid"><MonthPickerCell v-for="month in grid.cells" :key="month.toString()" :date="month"><MonthPickerCellTrigger v-slot="{ monthValue }" :month="month" :data-highlighted="isInRange(month) ? '' : undefined" :data-selection-start="isSameMonth(rangeStart, month) ? '' : undefined" :data-selection-end="isSameMonth(rangeEnd, month) ? '' : undefined" :class="[dlCalendarCellClass, 'dl-month-picker-cell data-[highlighted]:bg-[var(--dl-accent-surface)] data-[selection-start]:bg-[var(--dl-accent-surface-hover)] data-[selection-start]:font-bold data-[selection-start]:text-[var(--dl-accent-text)] data-[selection-end]:bg-[var(--dl-accent-surface-hover)] data-[selection-end]:font-bold data-[selection-end]:text-[var(--dl-accent-text)]']" @focus="emit('hover', month)" @pointerenter="emit('hover', month)">{{ monthValue }}</MonthPickerCellTrigger></MonthPickerCell></MonthPickerGridRow></MonthPickerGridBody></MonthPickerGrid>
  </MonthPickerRoot>
</template>
