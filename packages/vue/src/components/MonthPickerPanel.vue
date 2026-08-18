<script setup lang="ts">
import { MonthPickerCell, MonthPickerCellTrigger, MonthPickerGrid, MonthPickerGridBody, MonthPickerGridRow, MonthPickerHeader, MonthPickerHeading, MonthPickerNext, MonthPickerPrev, MonthPickerRoot, type DateValue } from 'reka-ui'
import { dlCalendarCellClass, dlCalendarClass, dlCalendarNavClass } from './date.styles'

withDefaults(defineProps<{ modelValue?: DateValue | DateValue[] | null; placeholder?: DateValue; locale?: string; multiple?: boolean; preventDeselect?: boolean; disabled?: boolean; readonly?: boolean }>(), { modelValue: null, placeholder: undefined, locale: 'zh-CN', multiple: false, preventDeselect: false, disabled: false, readonly: false })
const emit = defineEmits<{ 'update:modelValue': [value: DateValue | DateValue[] | undefined]; 'update:placeholder': [value: DateValue] }>()
</script>

<template>
  <MonthPickerRoot v-slot="{ grid, date }" data-dl data-slot="month-picker-panel" :model-value="modelValue" :placeholder="placeholder" :locale="locale" :multiple="multiple" :prevent-deselect="preventDeselect" :disabled="disabled" :readonly="readonly" :class="dlCalendarClass" @update:model-value="emit('update:modelValue', $event)" @update:placeholder="emit('update:placeholder', $event)">
    <MonthPickerHeader class="mb-3 flex items-center justify-between"><MonthPickerPrev :class="dlCalendarNavClass">‹</MonthPickerPrev><slot name="heading" :date="date"><MonthPickerHeading class="font-bold" /></slot><MonthPickerNext :class="dlCalendarNavClass">›</MonthPickerNext></MonthPickerHeader>
    <MonthPickerGrid><MonthPickerGridBody><MonthPickerGridRow v-for="(row, index) in grid.rows" :key="index" class="grid grid-cols-3 gap-1"><MonthPickerCell v-for="month in row" :key="month.toString()" :date="month"><MonthPickerCellTrigger v-slot="{ monthValue }" :month="month" :class="[dlCalendarCellClass, 'w-20']">{{ monthValue }}</MonthPickerCellTrigger></MonthPickerCell></MonthPickerGridRow></MonthPickerGridBody></MonthPickerGrid>
  </MonthPickerRoot>
</template>
