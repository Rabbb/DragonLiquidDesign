<script setup lang="ts">
import { endOfYear, getLocalTimeZone, startOfYear, today } from '@internationalized/date'
import { computed, shallowRef, watch } from 'vue'
import type { DateValue } from 'reka-ui'
import { dlCalendarCellClass, dlCalendarClass, dlCalendarNavClass } from './date.styles'

const props = withDefaults(defineProps<{ modelValue?: DateValue | null; placeholder?: DateValue; disabled?: boolean; readonly?: boolean; minValue?: DateValue; maxValue?: DateValue }>(), { modelValue: null, placeholder: undefined, disabled: false, readonly: false, minValue: undefined, maxValue: undefined })
const emit = defineEmits<{ 'update:modelValue': [value: DateValue]; 'update:placeholder': [value: DateValue] }>()
const viewDate = shallowRef<DateValue>(props.placeholder ?? props.modelValue ?? today(getLocalTimeZone()))
const centuryStart = computed(() => viewDate.value.year - (viewDate.value.year % 100))
const decades = computed(() => Array.from({ length: 10 }, (_, index) => startOfYear(viewDate.value.set({ year: centuryStart.value + index * 10 }))))
const heading = computed(() => `${centuryStart.value}–${centuryStart.value + 99}`)

watch(() => props.placeholder, value => {
  if (value)
    viewDate.value = value
})

function isSelected(value: DateValue) {
  return Boolean(props.modelValue && props.modelValue.year >= value.year && props.modelValue.year <= value.year + 9)
}

function isDisabled(value: DateValue) {
  if (props.disabled)
    return true
  if (props.minValue && endOfYear(value.set({ year: value.year + 9 })).compare(props.minValue) < 0)
    return true
  if (props.maxValue && startOfYear(value).compare(props.maxValue) > 0)
    return true
  return false
}

function isPreviousDisabled() {
  const previousEnd = endOfYear(viewDate.value.set({ year: centuryStart.value - 1 }))
  return Boolean(props.disabled || (props.minValue && previousEnd.compare(props.minValue) < 0))
}

function isNextDisabled() {
  const nextStart = startOfYear(viewDate.value.set({ year: centuryStart.value + 100 }))
  return Boolean(props.disabled || (props.maxValue && nextStart.compare(props.maxValue) > 0))
}

function moveCentury(years: number) {
  if ((years < 0 && isPreviousDisabled()) || (years > 0 && isNextDisabled()))
    return
  viewDate.value = viewDate.value.add({ years })
  emit('update:placeholder', viewDate.value)
}

function selectDecade(value: DateValue) {
  if (props.readonly || isDisabled(value))
    return
  emit('update:modelValue', value)
}
</script>

<template>
  <div data-dl data-slot="decade-picker-panel" :data-disabled="disabled ? '' : undefined" :data-readonly="readonly ? '' : undefined" :class="dlCalendarClass">
    <header class="mb-4 flex items-center justify-between">
      <button type="button" :disabled="isPreviousDisabled()" :class="dlCalendarNavClass" aria-label="上一个世纪" @click="moveCentury(-100)">‹</button>
      <div data-slot="decade-picker-heading" role="heading" aria-level="2" class="font-bold">{{ heading }}</div>
      <button type="button" :disabled="isNextDisabled()" :class="dlCalendarNavClass" aria-label="下一个世纪" @click="moveCentury(100)">›</button>
    </header>
    <div class="dl-decade-picker-grid">
      <button v-for="decade in decades" :key="decade.year" type="button" data-dl-decade-picker-cell-trigger :data-value="decade.year" :data-selected="isSelected(decade) ? '' : undefined" :data-disabled="isDisabled(decade) ? '' : undefined" :disabled="isDisabled(decade)" :class="[dlCalendarCellClass, 'dl-decade-picker-cell']" :aria-label="`选择 ${decade.year} 至 ${decade.year + 9} 年`" @click="selectDecade(decade)">{{ decade.year }}–{{ decade.year + 9 }}</button>
    </div>
  </div>
</template>
