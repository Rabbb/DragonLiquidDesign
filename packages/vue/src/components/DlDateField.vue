<script setup lang="ts">
import { DateFieldInput, DateFieldRoot, type DateValue } from 'reka-ui'
import { dlDateFieldClass, dlDateSegmentClass } from './date.styles'

withDefaults(defineProps<{ modelValue?: DateValue | null; locale?: string; granularity?: 'day' | 'hour' | 'minute' | 'second'; hourCycle?: 12 | 24; disabled?: boolean; readonly?: boolean; name?: string; id?: string }>(), { modelValue: null, locale: 'zh-CN', granularity: 'day', hourCycle: 24, disabled: false, readonly: false, name: undefined, id: undefined })
const emit = defineEmits<{ 'update:modelValue': [value: DateValue | undefined] }>()
</script>

<template>
  <DateFieldRoot v-slot="{ segments }" data-dl data-slot="date-field" :model-value="modelValue" :locale="locale" :granularity="granularity" :hour-cycle="hourCycle" :disabled="disabled" :readonly="readonly" :name="name" :id="id" :class="dlDateFieldClass" @update:model-value="emit('update:modelValue', $event)">
    <DateFieldInput v-for="segment in segments" :key="segment.part" :part="segment.part" :class="dlDateSegmentClass">{{ segment.value }}</DateFieldInput>
  </DateFieldRoot>
</template>
