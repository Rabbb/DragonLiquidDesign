<script setup lang="ts">
import { CalendarCell, CalendarCellTrigger, CalendarGrid, CalendarGridBody, CalendarGridHead, CalendarGridRow, CalendarHeadCell, CalendarHeader, CalendarHeading, CalendarNext, CalendarPrev, CalendarRoot, type DateValue } from 'reka-ui'
import { dlCalendarCellClass, dlCalendarClass, dlCalendarNavClass } from './date.styles'

withDefaults(defineProps<{ modelValue?: DateValue | DateValue[] | null; locale?: string; weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6; fixedWeeks?: boolean; numberOfMonths?: number; multiple?: boolean; disabled?: boolean; readonly?: boolean }>(), { modelValue: null, locale: 'zh-CN', weekStartsOn: 1, fixedWeeks: true, numberOfMonths: 1, multiple: false, disabled: false, readonly: false })
const emit = defineEmits<{ 'update:modelValue': [value: DateValue | undefined] }>()
</script>

<template>
  <CalendarRoot v-slot="{ weekDays, grid }" data-dl data-slot="calendar" :model-value="modelValue" :locale="locale" :week-starts-on="weekStartsOn" :fixed-weeks="fixedWeeks" :number-of-months="numberOfMonths" :multiple="multiple" :disabled="disabled" :readonly="readonly" :class="dlCalendarClass" @update:model-value="emit('update:modelValue', $event)">
    <CalendarHeader class="mb-3 flex items-center justify-between gap-3"><CalendarPrev :class="dlCalendarNavClass">‹</CalendarPrev><CalendarHeading class="font-bold text-[var(--dl-text)]" /><CalendarNext :class="dlCalendarNavClass">›</CalendarNext></CalendarHeader>
    <div class="flex flex-wrap gap-4">
      <CalendarGrid v-for="month in grid" :key="month.value.toString()" class="border-collapse">
        <CalendarGridHead><CalendarGridRow class="grid grid-cols-7"><CalendarHeadCell v-for="day in weekDays" :key="day" class="grid size-9 place-items-center text-[11px] font-semibold text-[var(--dl-text-faint)]">{{ day }}</CalendarHeadCell></CalendarGridRow></CalendarGridHead>
        <CalendarGridBody><CalendarGridRow v-for="(weekDates, index) in month.rows" :key="index" class="grid grid-cols-7"><CalendarCell v-for="date in weekDates" :key="date.toString()" :date="date"><CalendarCellTrigger :day="date" :month="month.value" :class="dlCalendarCellClass">{{ date.day }}</CalendarCellTrigger></CalendarCell></CalendarGridRow></CalendarGridBody>
      </CalendarGrid>
    </div>
  </CalendarRoot>
</template>
