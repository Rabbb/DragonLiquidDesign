<script setup lang="ts">
import { MonthRangePickerCell, MonthRangePickerCellTrigger, MonthRangePickerGrid, MonthRangePickerGridBody, MonthRangePickerGridRow, MonthRangePickerHeader, MonthRangePickerHeading, MonthRangePickerNext, MonthRangePickerPrev, MonthRangePickerRoot, type DateRange } from 'reka-ui'
import { dlCalendarCellClass, dlCalendarClass, dlCalendarNavClass } from './date.styles'

withDefaults(defineProps<{ modelValue?: DateRange | null; locale?: string; disabled?: boolean; readonly?: boolean }>(), { modelValue: null, locale: 'zh-CN', disabled: false, readonly: false })
const emit = defineEmits<{ 'update:modelValue': [value: DateRange] }>()
</script>

<template>
  <MonthRangePickerRoot v-slot="{ grid }" data-dl data-slot="month-range-picker" :model-value="modelValue" :locale="locale" :disabled="disabled" :readonly="readonly" :class="dlCalendarClass" @update:model-value="emit('update:modelValue', $event)">
    <MonthRangePickerHeader class="mb-3 flex items-center justify-between"><MonthRangePickerPrev :class="dlCalendarNavClass">‹</MonthRangePickerPrev><MonthRangePickerHeading class="font-bold" /><MonthRangePickerNext :class="dlCalendarNavClass">›</MonthRangePickerNext></MonthRangePickerHeader>
    <MonthRangePickerGrid><MonthRangePickerGridBody><MonthRangePickerGridRow v-for="(row, index) in grid.rows" :key="index" class="grid grid-cols-3 gap-1"><MonthRangePickerCell v-for="month in row" :key="month.toString()" :date="month"><MonthRangePickerCellTrigger v-slot="{ monthValue }" :month="month" :class="[dlCalendarCellClass, 'w-20 data-[highlighted]:bg-amber-300/10']">{{ monthValue }}</MonthRangePickerCellTrigger></MonthRangePickerCell></MonthRangePickerGridRow></MonthRangePickerGridBody></MonthRangePickerGrid>
  </MonthRangePickerRoot>
</template>
