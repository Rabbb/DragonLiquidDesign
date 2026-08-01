<script setup lang="ts">
import { TimeFieldInput, TimeFieldRoot, type TimeValue } from 'reka-ui'
import { dlDateFieldClass, dlDateSegmentClass } from './date.styles'

withDefaults(defineProps<{ modelValue?: TimeValue | null; locale?: string; granularity?: 'hour' | 'minute' | 'second'; hourCycle?: 12 | 24; disabled?: boolean; readonly?: boolean; name?: string; id?: string }>(), { modelValue: null, locale: 'zh-CN', granularity: 'minute', hourCycle: 24, disabled: false, readonly: false, name: undefined, id: undefined })
const emit = defineEmits<{ 'update:modelValue': [value: TimeValue | undefined] }>()
</script>

<template>
  <TimeFieldRoot v-slot="{ segments }" data-dl data-slot="time-field" :model-value="modelValue" :locale="locale" :granularity="granularity" :hour-cycle="hourCycle" :disabled="disabled" :readonly="readonly" :name="name" :id="id" :class="dlDateFieldClass" @update:model-value="emit('update:modelValue', $event)">
    <TimeFieldInput v-for="segment in segments" :key="segment.part" :part="segment.part" :class="dlDateSegmentClass">{{ segment.value }}</TimeFieldInput>
  </TimeFieldRoot>
</template>
