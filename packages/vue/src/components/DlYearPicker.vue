<script setup lang="ts">
import { getLocalTimeZone, today } from '@internationalized/date'
import { computed, ref, shallowRef, watch } from 'vue'
import type { DateValue } from 'reka-ui'
import { dlClipboardText, parseDlPastedYear } from './date-time-paste'
import DecadePickerPanel from './DecadePickerPanel.vue'
import DlPopover from './DlPopover.vue'
import YearPickerPanel from './YearPickerPanel.vue'
import './date-picker-panel.css'

const props = withDefaults(defineProps<{ open?: boolean; modelValue?: DateValue | DateValue[] | null; placeholder?: string; locale?: string; multiple?: boolean; preventDeselect?: boolean; disabled?: boolean; readonly?: boolean; zIndex?: number }>(), { open: undefined, modelValue: null, placeholder: '选择年份', locale: 'zh-CN', multiple: false, preventDeselect: false, disabled: false, readonly: false, zIndex: undefined })
const emit = defineEmits<{
  'update:open': [value: boolean]
  'update:modelValue': [value: DateValue | DateValue[] | undefined]
  paste: [value: DateValue, source: string]
  'paste-error': [source: string]
}>()
type Panel = 'year' | 'decade'
const localOpen = ref(props.open ?? false)
const panel = ref<Panel>('year')
const viewDate = shallowRef<DateValue>(selectedViewDate(props.modelValue))

watch(() => props.open, value => { if (value !== undefined) localOpen.value = value })
watch(() => props.modelValue, value => { viewDate.value = selectedViewDate(value) })
const resolvedOpen = computed({ get: () => props.open ?? localOpen.value, set: value => { localOpen.value = value; emit('update:open', value) } })
const formatter = computed(() => new Intl.DateTimeFormat(props.locale, { year: 'numeric' }))
const valueText = computed(() => {
  const values = Array.isArray(props.modelValue) ? props.modelValue : props.modelValue ? [props.modelValue] : []
  return values.length ? values.map(formatValue).join('、') : props.placeholder
})

watch(resolvedOpen, open => {
  if (open) {
    panel.value = 'year'
    viewDate.value = selectedViewDate(props.modelValue)
  }
})

function selectedViewDate(value: DateValue | DateValue[] | null | undefined) {
  if (Array.isArray(value))
    return value.at(-1) ?? today(getLocalTimeZone())
  return value ?? today(getLocalTimeZone())
}

function toNativeDate(value: DateValue) {
  return 'timeZone' in value ? value.toDate() : value.toDate(getLocalTimeZone())
}

function formatValue(value: DateValue) {
  return formatter.value.format(toNativeDate(value))
}

function update(value: DateValue | DateValue[] | undefined) {
  emit('update:modelValue', value)
  if (!props.multiple && value)
    resolvedOpen.value = false
}

function selectDecade(value: DateValue) {
  viewDate.value = value
  panel.value = 'year'
}

function handlePaste(event: ClipboardEvent) {
  if (props.disabled || props.readonly) return
  const source = dlClipboardText(event)
  const value = parseDlPastedYear(source)
  if (!value) {
    emit('paste-error', source)
    return
  }
  event.preventDefault()
  if (props.multiple) {
    const current = Array.isArray(props.modelValue) ? props.modelValue : props.modelValue ? [props.modelValue] : []
    emit('update:modelValue', current.some(item => item.year === value.year) ? current : [...current, value])
  }
  else {
    emit('update:modelValue', value)
    resolvedOpen.value = false
  }
  emit('paste', value, source)
}
</script>

<template>
  <DlPopover v-model:open="resolvedOpen" tone="subtle" align="start" :arrow="false" :side-offset="0" content-class="dl-date-picker-panel" :z-index="zIndex">
    <template #trigger><button data-dl data-slot="year-picker" type="button" :disabled="disabled || readonly" class="flex min-h-11 w-full items-center justify-between gap-3 rounded-[var(--dl-radius-sm)] border border-[var(--dl-border)] bg-[var(--dl-surface)] px-3 text-left text-sm text-[var(--dl-text)] outline-none transition hover:border-[var(--dl-border-strong)] focus-visible:[box-shadow:var(--dl-focus)] disabled:opacity-45" @keydown.alt.down.prevent="resolvedOpen = true" @paste="handlePaste"><span :class="!modelValue && 'text-[var(--dl-text-faint)]'">{{ valueText }}</span><span class="text-[var(--dl-accent)]" aria-hidden="true">▦</span></button></template>
    <YearPickerPanel v-if="panel === 'year'" :model-value="modelValue" :placeholder="viewDate" :locale="locale" :multiple="multiple" :prevent-deselect="preventDeselect" :disabled="disabled" :readonly="readonly" :years-per-page="10" class="border-0 bg-transparent p-0 shadow-none" @update:model-value="update" @update:placeholder="viewDate = $event">
      <template #heading="{ headingValue }"><button data-slot="year-picker-decade-trigger" type="button" class="dl-date-picker-heading-trigger font-bold" :aria-label="`选择十年区间，当前${headingValue}`" @click="panel = 'decade'">{{ headingValue }}</button></template>
    </YearPickerPanel>
    <DecadePickerPanel v-else :model-value="viewDate" :placeholder="viewDate" :disabled="disabled" :readonly="readonly" class="border-0 bg-transparent p-0 shadow-none" @update:model-value="selectDecade" @update:placeholder="viewDate = $event" />
  </DlPopover>
</template>
