<script setup lang="ts">
import { YearPickerCell, YearPickerCellTrigger, YearPickerGrid, YearPickerGridBody, YearPickerGridRow, YearPickerHeader, YearPickerHeading, YearPickerNext, YearPickerPrev, YearPickerRoot, type DateValue } from 'reka-ui'
import { dlCalendarCellClass, dlCalendarClass, dlCalendarNavClass } from './date.styles'

const rangeProps = withDefaults(defineProps<{ modelValue?: DateValue | DateValue[] | null; placeholder?: DateValue; locale?: string; multiple?: boolean; preventDeselect?: boolean; disabled?: boolean; readonly?: boolean; minValue?: DateValue; maxValue?: DateValue; yearsPerPage?: number; rangeStart?: DateValue; rangeEnd?: DateValue }>(), { modelValue: null, placeholder: undefined, locale: 'zh-CN', multiple: false, preventDeselect: false, disabled: false, readonly: false, minValue: undefined, maxValue: undefined, yearsPerPage: 12, rangeStart: undefined, rangeEnd: undefined })
const emit = defineEmits<{ 'hover': [value: DateValue | undefined]; 'update:modelValue': [value: DateValue | DateValue[] | undefined]; 'update:placeholder': [value: DateValue] }>()

function isSameYear(left: DateValue | undefined, right: DateValue) {
  return Boolean(left && left.year === right.year)
}

function isInRange(date: DateValue) {
  return Boolean(rangeProps.rangeStart && rangeProps.rangeEnd && date.year >= rangeProps.rangeStart.year && date.year <= rangeProps.rangeEnd.year)
}
</script>

<template>
  <YearPickerRoot v-slot="{ grid }" data-dl data-slot="year-picker-panel" :model-value="modelValue" :placeholder="placeholder" :locale="locale" :multiple="multiple" :prevent-deselect="preventDeselect" :disabled="disabled" :readonly="readonly" :min-value="minValue" :max-value="maxValue" :years-per-page="yearsPerPage" :class="dlCalendarClass" @pointerleave="emit('hover', undefined)" @update:model-value="emit('update:modelValue', $event)" @update:placeholder="emit('update:placeholder', $event)">
    <YearPickerHeader class="mb-4 flex items-center justify-between"><YearPickerPrev :class="dlCalendarNavClass" aria-label="上一页年份">‹</YearPickerPrev><YearPickerHeading v-slot="{ headingValue }" class="font-bold"><slot name="heading" :date="grid.value" :heading-value="headingValue">{{ headingValue }}</slot></YearPickerHeading><YearPickerNext :class="dlCalendarNavClass" aria-label="下一页年份">›</YearPickerNext></YearPickerHeader>
    <YearPickerGrid><YearPickerGridBody><YearPickerGridRow :class="['dl-year-picker-grid', yearsPerPage === 10 && 'dl-year-picker-grid--decade']"><YearPickerCell v-for="year in grid.cells" :key="year.toString()" :date="year"><YearPickerCellTrigger v-slot="{ yearValue }" :year="year" :data-highlighted="isInRange(year) ? '' : undefined" :data-selection-start="isSameYear(rangeStart, year) ? '' : undefined" :data-selection-end="isSameYear(rangeEnd, year) ? '' : undefined" :class="[dlCalendarCellClass, 'dl-year-picker-cell data-[highlighted]:bg-amber-300/10 data-[selection-start]:bg-amber-300/18 data-[selection-start]:font-bold data-[selection-start]:text-amber-100 data-[selection-end]:bg-amber-300/18 data-[selection-end]:font-bold data-[selection-end]:text-amber-100']" @focus="emit('hover', year)" @pointerenter="emit('hover', year)">{{ yearValue }}</YearPickerCellTrigger></YearPickerCell></YearPickerGridRow></YearPickerGridBody></YearPickerGrid>
  </YearPickerRoot>
</template>
