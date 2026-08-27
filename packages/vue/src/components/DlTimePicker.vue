<script setup lang="ts">
import { Time } from '@internationalized/date'
import { computed, ref, watch } from 'vue'
import type { TimeValue } from 'reka-ui'
import type { DlSize } from '../types'
import DlTimeField from './DlTimeField.vue'
import TimeWheelPanel from './TimeWheelPanel.vue'
import PickerTriggerButton from './PickerTriggerButton.vue'
import { parseDlTimeWheelValue } from './time-wheel.utils'

export type DlTimePickerPresentation = 'field' | 'button'

const props = withDefaults(defineProps<{
  open?: boolean
  modelValue?: TimeValue | null
  presentation?: DlTimePickerPresentation
  placeholder?: string
  locale?: string
  granularity?: 'hour' | 'minute'
  hourCycle?: 12 | 24
  minValue?: TimeValue
  maxValue?: TimeValue
  minuteStep?: number
  size?: DlSize
  status?: 'default' | 'success' | 'warning' | 'error'
  overlay?: 'auto' | 'modal' | 'drawer'
  clearable?: boolean
  shortcutValue?: string
  shortcutLabel?: string
  disabledTime?: (value: string) => boolean
  disabled?: boolean
  readonly?: boolean
  name?: string
  id?: string
  required?: boolean
  zIndex?: number
}>(), {
  open: undefined,
  modelValue: null,
  presentation: 'field',
  placeholder: '选择时间',
  locale: 'zh-CN',
  granularity: 'minute',
  hourCycle: 24,
  minValue: undefined,
  maxValue: undefined,
  minuteStep: 5,
  size: 'md',
  status: 'default',
  overlay: 'auto',
  clearable: false,
  shortcutValue: undefined,
  shortcutLabel: '常用时间',
  disabledTime: undefined,
  disabled: false,
  readonly: false,
  name: undefined,
  id: undefined,
  required: false,
  zIndex: undefined,
})

const emit = defineEmits<{
  'update:open': [value: boolean]
  'update:modelValue': [value: TimeValue | undefined]
  change: [value: TimeValue | undefined]
  clear: []
}>()

const localOpen = ref(props.open ?? false)
watch(() => props.open, value => { if (value !== undefined) localOpen.value = value })
const resolvedOpen = computed({
  get: () => props.open ?? localOpen.value,
  set: (value) => {
    localOpen.value = value
    emit('update:open', value)
  },
})
const stringValue = computed(() => props.modelValue ? `${String(props.modelValue.hour).padStart(2, '0')}:${String(props.modelValue.minute).padStart(2, '0')}` : '')
const displayValue = computed(() => stringValue.value || props.placeholder)

function toMinute(value: TimeValue) {
  return value.hour * 60 + value.minute
}

function isTimeDisabled(value: string) {
  const parsed = parseDlTimeWheelValue(value)
  if (!parsed)
    return true
  const minute = parsed.hour * 60 + parsed.minute
  if (props.minValue && minute < toMinute(props.minValue))
    return true
  if (props.maxValue && minute > toMinute(props.maxValue))
    return true
  return props.disabledTime?.(value) ?? false
}

function openWheel() {
  if (props.disabled || props.readonly)
    return
  resolvedOpen.value = true
}

function updateField(value: TimeValue | undefined) {
  emit('update:modelValue', value)
  emit('change', value)
}

function updateWheel(value: string) {
  const parsed = parseDlTimeWheelValue(value)
  const next = parsed ? new Time(parsed.hour, parsed.minute) : undefined
  emit('update:modelValue', next)
  emit('change', next)
}

function clearValue() {
  emit('update:modelValue', undefined)
  emit('change', undefined)
  emit('clear')
}
</script>

<template>
  <div data-dl data-slot="time-picker" :data-presentation="presentation" class="dl-time-picker" :data-size="size" :data-status="status" :data-disabled="disabled || undefined">
    <DlTimeField
      v-if="presentation === 'field'"
      :model-value="modelValue"
      :locale="locale"
      :granularity="granularity"
      :hour-cycle="hourCycle"
      :min-value="minValue"
      :max-value="maxValue"
      :size="size"
      :status="status"
      :clearable="clearable"
      :disabled="disabled"
      :readonly="readonly"
      :name="name"
      :id="id"
      class="w-full"
      @update:model-value="updateField"
      @clear="emit('clear')"
    >
      <template #trailing>
        <button
          type="button"
          data-slot="time-picker-trigger"
          class="dl-structured-field__action dl-time-picker__toggle"
          aria-label="打开时间选择器"
          :aria-expanded="resolvedOpen"
          :disabled="disabled || readonly"
          @click="openWheel"
        >◷</button>
      </template>
    </DlTimeField>
    <PickerTriggerButton v-else :value="modelValue ? displayValue : ''" :placeholder="placeholder" icon="◷" :size="size" :status="status" :disabled="disabled || readonly" @click="openWheel" />
  </div>

  <TimeWheelPanel
    v-model:open="resolvedOpen"
    :model-value="stringValue"
    :placeholder="placeholder"
    :granularity="granularity"
    :minute-step="minuteStep"
    :overlay="overlay"
    :clearable="clearable"
    :shortcut-value="shortcutValue"
    :shortcut-label="shortcutLabel"
    :disabled-time="isTimeDisabled"
    :disabled="disabled || readonly"
    :z-index="zIndex"
    @update:model-value="updateWheel"
    @clear="emit('clear')"
  />
  <input v-if="name && presentation === 'button'" type="hidden" :name="name" :value="stringValue" :disabled="disabled" :required="required">
</template>

<style scoped>
.dl-time-picker { width: 100%; min-width: 0; }
.dl-time-picker[data-disabled] { opacity: .5; }
.dl-time-picker__toggle { color: var(--dl-accent); }
</style>
