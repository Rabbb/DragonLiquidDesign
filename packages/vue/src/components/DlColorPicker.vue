<script setup lang="ts">
import type { ColorSpace } from 'reka-ui'
import { computed, ref, watch } from 'vue'
import type { DlOverlayBaseSide, DlOverlaySide, DlSize } from '../types'
import { formatColorValue, safeColorValue, type DlColorFormat } from './color-controls'
import DlColorArea from './DlColorArea.vue'
import DlColorField from './DlColorField.vue'
import DlColorSlider from './DlColorSlider.vue'
import DlPopover from './DlPopover.vue'

const props = withDefaults(defineProps<{
  open?: boolean
  modelValue?: string
  format?: DlColorFormat
  formatOptions?: readonly DlColorFormat[]
  colorSpace?: ColorSpace
  label?: string
  hint?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  name?: string
  allowAlpha?: boolean
  size?: DlSize
  orientation?: 'horizontal' | 'vertical'
  side?: DlOverlaySide | DlOverlayBaseSide
  align?: 'start' | 'center' | 'end'
  title?: string
  confirmLabel?: string
  cancelLabel?: string
  zIndex?: number
}>(), {
  open: undefined,
  modelValue: '#ff8c00',
  format: 'hex',
  formatOptions: () => ['hex', 'rgb', 'hsl', 'hsb'],
  colorSpace: 'hsl',
  label: undefined,
  hint: undefined,
  placeholder: '选择颜色',
  disabled: false,
  readonly: false,
  required: false,
  name: undefined,
  allowAlpha: true,
  size: 'md',
  orientation: 'horizontal',
  side: 'bottom',
  align: 'start',
  title: '选择颜色',
  confirmLabel: '应用',
  cancelLabel: '取消',
  zIndex: undefined,
})

const emit = defineEmits<{
  'update:open': [value: boolean]
  'update:modelValue': [value: string]
  'update:format': [value: DlColorFormat]
  preview: [value: string]
  change: [value: string]
  confirm: [value: string]
  cancel: []
}>()

const localOpen = ref(props.open ?? false)
const draft = ref(props.modelValue)
const activeFormat = ref<DlColorFormat>(props.format)

const resolvedOpen = computed({
  get: () => props.open ?? localOpen.value,
  set: (value) => {
    localOpen.value = value
    emit('update:open', value)
  },
})
const visualColor = computed(() => safeColorValue(props.modelValue))
const panelClass = computed(() => `dl-color-picker-panel is-${props.orientation}`)
const valueText = computed(() => {
  try {
    return formatColorValue(props.modelValue, props.format, props.allowAlpha)
  }
  catch {
    return props.modelValue || props.placeholder
  }
})

watch(() => props.open, value => {
  if (value !== undefined)
    localOpen.value = value
})
watch(() => props.format, value => { activeFormat.value = value })
watch(() => props.modelValue, value => {
  if (!resolvedOpen.value)
    draft.value = value
})
watch(resolvedOpen, open => {
  if (open) {
    draft.value = props.modelValue
    activeFormat.value = props.format
  }
})

function openPicker() {
  if (!props.disabled && !props.readonly)
    resolvedOpen.value = true
}

function updateDraft(value: string) {
  draft.value = value
  emit('preview', value)
}

function updateFormat(value: DlColorFormat) {
  activeFormat.value = value
  emit('update:format', value)
}

function confirm() {
  emit('update:modelValue', draft.value)
  emit('change', draft.value)
  emit('confirm', draft.value)
  resolvedOpen.value = false
}

function cancel() {
  draft.value = props.modelValue
  emit('cancel')
  resolvedOpen.value = false
}
</script>

<template>
  <div
    data-dl
    data-slot="color-picker"
    class="dl-color-picker"
    :class="[`is-${size}`, { 'is-disabled': disabled || readonly }]"
  >
    <span v-if="label || hint" class="dl-color-picker__meta">
      <label v-if="label">{{ label }}<em v-if="required"> *</em></label>
      <small v-if="hint">{{ hint }}</small>
    </span>
    <DlPopover
      v-model:open="resolvedOpen"
      tone="subtle"
      :title="title"
      :side="side"
      :align="align"
      :arrow="false"
      :side-offset="6"
      :content-class="panelClass"
      :z-index="zIndex"
    >
      <template #trigger>
        <slot name="trigger" :value="modelValue" :open="resolvedOpen" :color="visualColor">
          <button
            type="button"
            class="dl-color-picker__trigger"
            :disabled="disabled || readonly"
            :aria-label="label || placeholder"
            :aria-expanded="resolvedOpen"
            :aria-required="required || undefined"
            @keydown.alt.down.prevent="openPicker"
          >
            <span class="dl-color-picker__swatch dl-color-checker" aria-hidden="true"><i :style="{ background: visualColor }" /></span>
            <span class="dl-color-picker__value">{{ valueText }}</span>
            <span class="dl-color-picker__chevron" aria-hidden="true">⌄</span>
          </button>
        </slot>
      </template>

      <div class="dl-color-picker-panel__controls" :data-orientation="orientation">
        <DlColorArea
          :model-value="draft"
          :color-space="colorSpace"
          size="sm"
          aria-label="二维颜色区域"
          @update:model-value="updateDraft"
        />
        <div class="dl-color-picker-panel__rail">
          <DlColorSlider
            :model-value="draft"
            :color-space="colorSpace"
            channel="hue"
            size="sm"
            aria-label="色相"
            @update:model-value="updateDraft"
          />
          <DlColorSlider
            v-if="allowAlpha"
            :model-value="draft"
            :color-space="colorSpace"
            channel="alpha"
            size="sm"
            aria-label="透明度"
            @update:model-value="updateDraft"
          />
          <DlColorField
            :model-value="draft"
            :format="activeFormat"
            :format-options="formatOptions"
            :allow-alpha="allowAlpha"
            :copyable="false"
            @update:model-value="updateDraft"
            @update:format="updateFormat"
          />
        </div>
      </div>
      <div class="dl-color-picker-panel__actions">
        <button type="button" class="dl-color-picker-panel__button is-quiet" @click="cancel">{{ cancelLabel }}</button>
        <button type="button" class="dl-color-picker-panel__button is-primary" @click="confirm">{{ confirmLabel }}</button>
      </div>
    </DlPopover>
    <input v-if="name" type="hidden" :name="name" :value="modelValue">
  </div>
</template>

<style>
.dl-color-picker { display: grid; gap: 7px; width: 100%; }
.dl-color-picker__meta { display: grid; gap: 2px; }
.dl-color-picker__meta label { color: var(--dl-text); font-size: .78rem; font-weight: 800; }
.dl-color-picker__meta em { color: var(--dragon-red); font-style: normal; }
.dl-color-picker__meta small { color: var(--dl-text-faint); font-size: .68rem; }
.dl-color-picker__trigger { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; width: 100%; min-height: 44px; padding: 5px 11px 5px 5px; border: 1px solid var(--dl-border); border-radius: var(--dl-radius-sm); color: var(--dl-text); background: var(--dl-surface); outline: none; cursor: pointer; transition: border-color .15s ease, box-shadow .15s ease, background .15s ease; }
.dl-color-picker__trigger:hover { border-color: var(--dl-border-strong); background: var(--dl-surface-hover); }
.dl-color-picker__trigger:focus-visible, .dl-color-picker__trigger[aria-expanded='true'] { border-color: var(--dl-border-focus); box-shadow: var(--dl-focus); }
.dl-color-picker__swatch { width: 34px; height: 34px; padding: 3px; border: 1px solid var(--dl-border); border-radius: 8px; }
.dl-color-picker__swatch i { display: block; width: 100%; height: 100%; border-radius: 5px; box-shadow: inset 0 0 0 1px rgba(255,255,255,.16); }
.dl-color-picker__value { min-width: 0; padding: 0 10px; overflow: hidden; font: 700 .72rem "Cascadia Code", Consolas, monospace; text-align: left; text-overflow: ellipsis; white-space: nowrap; }
.dl-color-picker__chevron { color: var(--dl-text-faint); font-size: 1rem; line-height: 1; transition: transform .15s ease; }
.dl-color-picker__trigger[aria-expanded='true'] .dl-color-picker__chevron { transform: rotate(180deg); }
.dl-color-picker.is-sm .dl-color-picker__trigger { min-height: 38px; }
.dl-color-picker.is-sm .dl-color-picker__swatch { width: 28px; height: 28px; }
.dl-color-picker.is-lg .dl-color-picker__trigger { min-height: 50px; }
.dl-color-picker.is-lg .dl-color-picker__swatch { width: 40px; height: 40px; }
.dl-color-picker.is-disabled { opacity: .48; }
.dl-color-picker-panel { width: min(38rem, calc(100vw - 1.5rem)); }
.dl-color-picker-panel.is-vertical { width: min(20rem, calc(100vw - 1.5rem)); }
.dl-color-picker-panel__controls { display: grid; gap: 10px; }
.dl-color-picker-panel__rail { display: grid; gap: 10px; }
.dl-color-picker-panel.is-horizontal .dl-color-picker-panel__controls { grid-template-columns: minmax(0, 1.1fr) minmax(14rem, .9fr); align-items: center; column-gap: 16px; }
.dl-color-picker-panel__actions { display: flex; justify-content: flex-end; gap: 8px; padding-top: 13px; }
.dl-color-picker-panel__button { min-width: 68px; min-height: 34px; padding: 0 13px; border: 1px solid var(--dl-border); border-radius: var(--dl-radius-sm); color: var(--dl-text-muted); background: var(--dl-surface); font: inherit; font-weight: 750; cursor: pointer; }
.dl-color-picker-panel__button:hover { border-color: var(--dl-border-strong); background: var(--dl-surface-hover); }
.dl-color-picker-panel__button:focus-visible { outline: none; box-shadow: var(--dl-focus); }
.dl-color-picker-panel__button.is-primary { border-color: color-mix(in srgb, var(--dl-accent) 58%, var(--dl-border)); color: var(--dl-accent-ink); background: var(--dl-accent); }
@media (max-width: 620px) {
  .dl-color-picker-panel.is-horizontal { width: min(20rem, calc(100vw - 1.5rem)); }
  .dl-color-picker-panel.is-horizontal .dl-color-picker-panel__controls { grid-template-columns: 1fr; }
}
@media (prefers-reduced-motion: reduce) { .dl-color-picker__trigger, .dl-color-picker__chevron { transition: none; } }
</style>
