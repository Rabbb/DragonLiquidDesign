<script setup lang="ts">
import { DateRangeFieldInput, DateRangeFieldRoot, type DateRange } from 'reka-ui'
import { dlDateFieldClass, dlDateSegmentClass } from './date.styles'

withDefaults(defineProps<{ modelValue?: DateRange | null; locale?: string; granularity?: 'day' | 'hour' | 'minute' | 'second'; hourCycle?: 12 | 24; disabled?: boolean; readonly?: boolean; name?: string }>(), { modelValue: null, locale: 'zh-CN', granularity: 'day', hourCycle: 24, disabled: false, readonly: false, name: undefined })
const emit = defineEmits<{ 'update:modelValue': [value: DateRange] }>()
</script>

<template>
  <DateRangeFieldRoot v-slot="{ segments }" data-dl data-slot="date-range-field" :model-value="modelValue" :locale="locale" :granularity="granularity" :hour-cycle="hourCycle" :disabled="disabled" :readonly="readonly" :name="name" :class="dlDateFieldClass" @update:model-value="emit('update:modelValue', $event)">
    <DateRangeFieldInput v-for="segment in segments.start" :key="`start-${segment.part}`" type="start" :part="segment.part" :class="dlDateSegmentClass">{{ segment.value }}</DateRangeFieldInput>
    <span class="px-1 text-[var(--dl-text-faint)]" aria-hidden="true">—</span>
    <DateRangeFieldInput v-for="segment in segments.end" :key="`end-${segment.part}`" type="end" :part="segment.part" :class="dlDateSegmentClass">{{ segment.value }}</DateRangeFieldInput>
  </DateRangeFieldRoot>
</template>
