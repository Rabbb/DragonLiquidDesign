<script setup lang="ts">
import { YearRangePickerCell, YearRangePickerCellTrigger, YearRangePickerGrid, YearRangePickerGridBody, YearRangePickerGridRow, YearRangePickerHeader, YearRangePickerHeading, YearRangePickerNext, YearRangePickerPrev, YearRangePickerRoot, type DateRange } from 'reka-ui'
import { dlCalendarCellClass, dlCalendarClass, dlCalendarNavClass } from './date.styles'

withDefaults(defineProps<{ modelValue?: DateRange | null; locale?: string; disabled?: boolean; readonly?: boolean }>(), { modelValue: null, locale: 'zh-CN', disabled: false, readonly: false })
const emit = defineEmits<{ 'update:modelValue': [value: DateRange] }>()
</script>

<template>
  <YearRangePickerRoot v-slot="{ grid }" data-dl data-slot="year-range-picker" :model-value="modelValue" :locale="locale" :disabled="disabled" :readonly="readonly" :class="dlCalendarClass" @update:model-value="emit('update:modelValue', $event)">
    <YearRangePickerHeader class="mb-3 flex items-center justify-between"><YearRangePickerPrev :class="dlCalendarNavClass">‹</YearRangePickerPrev><YearRangePickerHeading class="font-bold" /><YearRangePickerNext :class="dlCalendarNavClass">›</YearRangePickerNext></YearRangePickerHeader>
    <YearRangePickerGrid><YearRangePickerGridBody><YearRangePickerGridRow v-for="(row, index) in grid.rows" :key="index" class="grid grid-cols-3 gap-1"><YearRangePickerCell v-for="year in row" :key="year.toString()" :date="year"><YearRangePickerCellTrigger v-slot="{ yearValue }" :year="year" :class="[dlCalendarCellClass, 'w-20 data-[highlighted]:bg-amber-300/10']">{{ yearValue }}</YearRangePickerCellTrigger></YearRangePickerCell></YearRangePickerGridRow></YearRangePickerGridBody></YearRangePickerGrid>
  </YearRangePickerRoot>
</template>
