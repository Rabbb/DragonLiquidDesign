<script setup lang="ts">
import { getLocalTimeZone } from '@internationalized/date'
import { computed, ref } from 'vue'
import { CalendarCell, CalendarCellTrigger, CalendarGrid, CalendarGridBody, CalendarGridHead, CalendarGridRow, CalendarHeadCell, CalendarHeader, CalendarHeading, CalendarNext, CalendarPrev, CalendarRoot, type DateValue } from 'reka-ui'
import { dlCalendarCellClass, dlCalendarClass, dlCalendarNavClass } from './date.styles'
import MonthPickerPanel from './MonthPickerPanel.vue'
import YearPickerPanel from './YearPickerPanel.vue'

const props = withDefaults(defineProps<{ placeholder: DateValue; rangeStart?: DateValue; rangeEnd?: DateValue; locale?: string; disabled?: boolean; minValue?: DateValue; maxValue?: DateValue; isDateUnavailable?: (date: DateValue) => boolean }>(), { rangeStart: undefined, rangeEnd: undefined, locale: 'zh-CN', disabled: false, minValue: undefined, maxValue: undefined, isDateUnavailable: undefined })
const emit = defineEmits<{ 'hover': [value: DateValue | undefined]; 'select': [value: DateValue]; 'update:placeholder': [value: DateValue] }>()
type Panel = 'day' | 'month' | 'year'

const panel = ref<Panel>('day')
const yearFormatter = computed(() => new Intl.DateTimeFormat(props.locale, { year: 'numeric' }))
const monthFormatter = computed(() => new Intl.DateTimeFormat(props.locale, { month: 'long' }))

function previousYear(value: DateValue) {
  return value.subtract({ years: 1 })
}

function nextYear(value: DateValue) {
  return value.add({ years: 1 })
}

function isSameDate(left: DateValue | undefined, right: DateValue) {
  return Boolean(left && left.compare(right) === 0)
}

function isInRange(date: DateValue, start: DateValue | undefined, end: DateValue | undefined) {
  return Boolean(start && end && date.compare(start) >= 0 && date.compare(end) <= 0)
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

function showPanel(value: Panel) {
  emit('hover', undefined)
  panel.value = value
}

function updatePlaceholder(value: DateValue) {
  emit('update:placeholder', value)
}

function selectYear(value: DateValue | DateValue[] | undefined) {
  if (!value || Array.isArray(value))
    return
  updatePlaceholder(value)
  panel.value = 'month'
}

function selectMonth(value: DateValue | DateValue[] | undefined) {
  if (!value || Array.isArray(value))
    return
  updatePlaceholder(value)
  panel.value = 'day'
}
</script>

<template>
  <CalendarRoot v-if="panel === 'day'" v-slot="{ weekDays, grid, date: headingDate }" data-dl data-slot="range-picker-calendar-panel" :model-value="null" :placeholder="placeholder" :locale="locale" :week-starts-on="1" fixed-weeks :disabled="disabled" :min-value="minValue" :max-value="maxValue" :is-date-unavailable="isDateUnavailable" :class="dlCalendarClass" @pointerleave="emit('hover', undefined)" @update:model-value="$event && emit('select', $event)" @update:placeholder="updatePlaceholder">
    <CalendarHeader class="mb-3 grid grid-cols-[4rem_1fr_4rem] items-center">
      <div class="flex justify-start">
        <CalendarPrev :prev-page="previousYear" :class="dlCalendarNavClass" aria-label="上一年">«</CalendarPrev>
        <CalendarPrev :class="dlCalendarNavClass" aria-label="上个月">‹</CalendarPrev>
      </div>
      <CalendarHeading as-child>
        <div data-slot="range-picker-calendar-heading" class="flex items-center justify-center gap-0.5 font-bold text-[var(--dl-text)]">
          <button data-slot="date-range-picker-year-trigger" type="button" class="dl-date-picker-heading-trigger" :aria-label="`选择年份，当前${formatYear(headingDate)}`" @click="showPanel('year')">{{ formatYear(headingDate) }}</button>
          <button data-slot="date-range-picker-month-trigger" type="button" class="dl-date-picker-heading-trigger" :aria-label="`选择月份，当前${formatMonth(headingDate)}`" @click="showPanel('month')">{{ formatMonth(headingDate) }}</button>
        </div>
      </CalendarHeading>
      <div class="flex justify-end">
        <CalendarNext :class="dlCalendarNavClass" aria-label="下个月">›</CalendarNext>
        <CalendarNext :next-page="nextYear" :class="dlCalendarNavClass" aria-label="下一年">»</CalendarNext>
      </div>
    </CalendarHeader>
    <CalendarGrid v-for="month in grid" :key="month.value.toString()" class="border-collapse">
      <CalendarGridHead><CalendarGridRow class="grid grid-cols-7"><CalendarHeadCell v-for="day in weekDays" :key="day" class="grid size-9 place-items-center text-[11px] font-semibold text-[var(--dl-text-faint)]">{{ day }}</CalendarHeadCell></CalendarGridRow></CalendarGridHead>
      <CalendarGridBody><CalendarGridRow v-for="(weekDates, index) in month.rows" :key="index" class="grid grid-cols-7"><CalendarCell v-for="date in weekDates" :key="date.toString()" :date="date"><CalendarCellTrigger :day="date" :month="month.value" :data-highlighted="isInRange(date, rangeStart, rangeEnd) ? '' : undefined" :data-selection-start="isSameDate(rangeStart, date) ? '' : undefined" :data-selection-end="isSameDate(rangeEnd, date) ? '' : undefined" :class="[dlCalendarCellClass, 'data-[highlighted]:bg-[var(--dl-accent-surface)] data-[selection-start]:bg-[var(--dl-accent-surface-hover)] data-[selection-start]:font-bold data-[selection-start]:text-[var(--dl-accent-text)] data-[selection-end]:bg-[var(--dl-accent-surface-hover)] data-[selection-end]:font-bold data-[selection-end]:text-[var(--dl-accent-text)]']" @focus="emit('hover', date)" @pointerenter="emit('hover', date)">{{ date.day }}</CalendarCellTrigger></CalendarCell></CalendarGridRow></CalendarGridBody>
    </CalendarGrid>
  </CalendarRoot>
  <MonthPickerPanel v-else-if="panel === 'month'" :model-value="placeholder" :placeholder="placeholder" :locale="locale" :disabled="disabled" :min-value="minValue" :max-value="maxValue" prevent-deselect class="border-0 bg-transparent p-0 shadow-none" @update:model-value="selectMonth" @update:placeholder="updatePlaceholder">
    <template #heading="{ date }"><button data-slot="date-range-picker-year-trigger" type="button" class="dl-date-picker-heading-trigger font-bold" :aria-label="`选择年份，当前${formatYear(date)}`" @click="showPanel('year')">{{ formatYear(date) }}</button></template>
  </MonthPickerPanel>
  <YearPickerPanel v-else :model-value="placeholder" :placeholder="placeholder" :locale="locale" :disabled="disabled" :min-value="minValue" :max-value="maxValue" prevent-deselect class="border-0 bg-transparent p-0 shadow-none" @update:model-value="selectYear" @update:placeholder="updatePlaceholder" />
</template>
