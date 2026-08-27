<script setup lang="ts">
import { TimeRangeFieldInput, TimeRangeFieldRoot, type TimeValue } from 'reka-ui'
import { dlDateFieldClass, dlDateSegmentClass } from './date.styles'
import { dlClipboardText, parseDlPastedTimeRange } from './date-time-paste'

type DlTimeRange = { start: TimeValue; end: TimeValue }
const props = withDefaults(defineProps<{ modelValue?: DlTimeRange | null; locale?: string; granularity?: 'hour' | 'minute' | 'second'; hourCycle?: 12 | 24; disabled?: boolean; readonly?: boolean; name?: string }>(), { modelValue: null, locale: 'zh-CN', granularity: 'minute', hourCycle: 24, disabled: false, readonly: false, name: undefined })
const emit = defineEmits<{
  'update:modelValue': [value: DlTimeRange]
  paste: [value: DlTimeRange, source: string]
  'paste-error': [source: string]
}>()

function handlePaste(event: ClipboardEvent) {
  if (props.disabled || props.readonly) return
  const source = dlClipboardText(event)
  const value = parseDlPastedTimeRange(source, props.granularity)
  if (!value) {
    emit('paste-error', source)
    return
  }
  event.preventDefault()
  emit('update:modelValue', value)
  emit('paste', value, source)
}
</script>

<template>
  <TimeRangeFieldRoot v-slot="{ segments }" data-dl data-slot="time-range-field" :model-value="modelValue" :locale="locale" :granularity="granularity" :hour-cycle="hourCycle" :disabled="disabled" :readonly="readonly" :name="name" :class="dlDateFieldClass" @paste="handlePaste" @update:model-value="emit('update:modelValue', $event as DlTimeRange)">
    <TimeRangeFieldInput v-for="segment in segments.start" :key="`start-${segment.part}`" type="start" :part="segment.part" :class="dlDateSegmentClass">{{ segment.value }}</TimeRangeFieldInput>
    <span class="px-1 text-[var(--dl-text-faint)]" aria-hidden="true">—</span>
    <TimeRangeFieldInput v-for="segment in segments.end" :key="`end-${segment.part}`" type="end" :part="segment.part" :class="dlDateSegmentClass">{{ segment.value }}</TimeRangeFieldInput>
  </TimeRangeFieldRoot>
</template>
