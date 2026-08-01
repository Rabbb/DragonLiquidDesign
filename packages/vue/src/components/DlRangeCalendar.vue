<script setup lang="ts">
import { RangeCalendarCell, RangeCalendarCellTrigger, RangeCalendarGrid, RangeCalendarGridBody, RangeCalendarGridHead, RangeCalendarGridRow, RangeCalendarHeadCell, RangeCalendarHeader, RangeCalendarHeading, RangeCalendarNext, RangeCalendarPrev, RangeCalendarRoot, type DateRange } from 'reka-ui'
import { dlCalendarCellClass, dlCalendarClass, dlCalendarNavClass } from './date.styles'

withDefaults(defineProps<{ modelValue?: DateRange | null; locale?: string; weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6; fixedWeeks?: boolean; numberOfMonths?: number; disabled?: boolean; readonly?: boolean }>(), { modelValue: null, locale: 'zh-CN', weekStartsOn: 1, fixedWeeks: true, numberOfMonths: 1, disabled: false, readonly: false })
const emit = defineEmits<{ 'update:modelValue': [value: DateRange] }>()
</script>

<template>
  <RangeCalendarRoot v-slot="{ weekDays, grid }" data-dl data-slot="range-calendar" :model-value="modelValue" :locale="locale" :week-starts-on="weekStartsOn" :fixed-weeks="fixedWeeks" :number-of-months="numberOfMonths" :disabled="disabled" :readonly="readonly" :class="dlCalendarClass" @update:model-value="emit('update:modelValue', $event)">
    <RangeCalendarHeader class="mb-3 flex items-center justify-between gap-3"><RangeCalendarPrev :class="dlCalendarNavClass">‹</RangeCalendarPrev><RangeCalendarHeading class="font-bold text-[var(--dl-text)]" /><RangeCalendarNext :class="dlCalendarNavClass">›</RangeCalendarNext></RangeCalendarHeader>
    <div class="flex flex-wrap gap-4">
      <RangeCalendarGrid v-for="month in grid" :key="month.value.toString()" class="border-collapse">
        <RangeCalendarGridHead><RangeCalendarGridRow class="grid grid-cols-7"><RangeCalendarHeadCell v-for="day in weekDays" :key="day" class="grid size-9 place-items-center text-[11px] font-semibold text-[var(--dl-text-faint)]">{{ day }}</RangeCalendarHeadCell></RangeCalendarGridRow></RangeCalendarGridHead>
        <RangeCalendarGridBody><RangeCalendarGridRow v-for="(weekDates, index) in month.rows" :key="index" class="grid grid-cols-7"><RangeCalendarCell v-for="date in weekDates" :key="date.toString()" :date="date"><RangeCalendarCellTrigger :day="date" :month="month.value" :class="[dlCalendarCellClass, 'data-[highlighted]:bg-amber-300/10 data-[selection-start]:rounded-l-[9px] data-[selection-end]:rounded-r-[9px]']">{{ date.day }}</RangeCalendarCellTrigger></RangeCalendarCell></RangeCalendarGridRow></RangeCalendarGridBody>
      </RangeCalendarGrid>
    </div>
  </RangeCalendarRoot>
</template>
