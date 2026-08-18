<script setup lang="ts">
import { YearPickerCell, YearPickerCellTrigger, YearPickerGrid, YearPickerGridBody, YearPickerGridRow, YearPickerHeader, YearPickerHeading, YearPickerNext, YearPickerPrev, YearPickerRoot, type DateValue } from 'reka-ui'
import { dlCalendarCellClass, dlCalendarClass, dlCalendarNavClass } from './date.styles'

withDefaults(defineProps<{ modelValue?: DateValue | DateValue[] | null; placeholder?: DateValue; locale?: string; multiple?: boolean; preventDeselect?: boolean; disabled?: boolean; readonly?: boolean }>(), { modelValue: null, placeholder: undefined, locale: 'zh-CN', multiple: false, preventDeselect: false, disabled: false, readonly: false })
const emit = defineEmits<{ 'update:modelValue': [value: DateValue | DateValue[] | undefined]; 'update:placeholder': [value: DateValue] }>()
</script>

<template>
  <YearPickerRoot v-slot="{ grid }" data-dl data-slot="year-picker-panel" :model-value="modelValue" :placeholder="placeholder" :locale="locale" :multiple="multiple" :prevent-deselect="preventDeselect" :disabled="disabled" :readonly="readonly" :class="dlCalendarClass" @update:model-value="emit('update:modelValue', $event)" @update:placeholder="emit('update:placeholder', $event)">
    <YearPickerHeader class="mb-3 flex items-center justify-between"><YearPickerPrev :class="dlCalendarNavClass">‹</YearPickerPrev><YearPickerHeading class="font-bold" /><YearPickerNext :class="dlCalendarNavClass">›</YearPickerNext></YearPickerHeader>
    <YearPickerGrid><YearPickerGridBody><YearPickerGridRow v-for="(row, index) in grid.rows" :key="index" class="grid grid-cols-3 gap-1"><YearPickerCell v-for="year in row" :key="year.toString()" :date="year"><YearPickerCellTrigger v-slot="{ yearValue }" :year="year" :class="[dlCalendarCellClass, 'w-20']">{{ yearValue }}</YearPickerCellTrigger></YearPickerCell></YearPickerGridRow></YearPickerGridBody></YearPickerGrid>
  </YearPickerRoot>
</template>
