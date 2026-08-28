<script setup lang="ts">
import { colorToString, getChannelRange, getChannelValue, parseColor, setChannelValue, type ColorChannel } from 'reka-ui'
import { computed, onBeforeUnmount, ref, useAttrs, useId, watch, type StyleValue } from 'vue'
import { formatColorValue, safeColorValue, type DlColorFormat } from './color-controls'
import './color-controls.css'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  modelValue?: string
  format?: DlColorFormat
  formatOptions?: readonly DlColorFormat[]
  channel?: ColorChannel
  label?: string
  hint?: string
  error?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  name?: string
  allowAlpha?: boolean
  showPreview?: boolean
  showFormat?: boolean
  copyable?: boolean
  step?: number
  disableWheelChange?: boolean
}>(), {
  modelValue: '#ff8c00',
  format: 'hex',
  formatOptions: () => ['hex', 'rgb', 'hsl', 'hsb'],
  channel: undefined,
  label: undefined,
  hint: undefined,
  error: undefined,
  placeholder: undefined,
  disabled: false,
  readonly: false,
  required: false,
  name: undefined,
  allowAlpha: true,
  showPreview: true,
  showFormat: true,
  copyable: true,
  step: undefined,
  disableWheelChange: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'update:format': [format: DlColorFormat]
  change: [value: string]
  invalid: [value: string]
  copy: [value: string]
}>()

const attrs = useAttrs()
const fieldId = useId()
const messageId = `${fieldId}-message`
const activeFormat = ref<DlColorFormat>(props.format)
const draft = ref('')
const editing = ref(false)
const invalidDraft = ref(false)
const copied = ref(false)
let copyTimer: ReturnType<typeof setTimeout> | undefined

const inputAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
})
const visualColor = computed(() => safeColorValue(props.modelValue))
const outerStyle = computed(() => attrs.style as StyleValue)
const showMeta = computed(() => Boolean(props.label || props.hint || props.error))
const channelRange = computed(() => props.channel ? getChannelRange(props.channel) : undefined)
const placeholderText = computed(() => props.placeholder ?? (props.channel
  ? `${channelRange.value?.min}–${channelRange.value?.max}`
  : ({ hex: '#RRGGBB', rgb: 'rgb(255, 140, 0)', hsl: 'hsl(33, 100%, 50%)', hsb: 'hsb(33, 100%, 100%)' } as const)[activeFormat.value]))

function formattedModel() {
  try {
    if (props.channel) return String(Math.round(getChannelValue(parseColor(props.modelValue), props.channel)))
    return formatColorValue(props.modelValue, activeFormat.value, props.allowAlpha)
  }
  catch {
    return props.modelValue
  }
}

function syncDraft() {
  if (!editing.value) draft.value = formattedModel()
}

function commit() {
  if (props.disabled || props.readonly) return
  try {
    let value: string
    if (props.channel) {
      const number = Number(draft.value)
      if (!Number.isFinite(number)) throw new Error('Invalid channel')
      const nextColor = setChannelValue(parseColor(props.modelValue), props.channel, number)
      value = colorToString(nextColor, activeFormat.value)
    }
    else {
      value = formatColorValue(draft.value, activeFormat.value, props.allowAlpha)
    }
    invalidDraft.value = false
    draft.value = value
    emit('update:modelValue', value)
    emit('change', value)
  }
  catch {
    invalidDraft.value = true
    emit('invalid', draft.value)
  }
}

function changeFormat(event: Event) {
  const format = (event.target as HTMLSelectElement).value as DlColorFormat
  activeFormat.value = format
  emit('update:format', format)
  try {
    const value = formatColorValue(props.modelValue, format, props.allowAlpha)
    draft.value = value
    emit('update:modelValue', value)
    emit('change', value)
  }
  catch {
    syncDraft()
  }
}

function adjustChannel(direction: number, multiplier = 1) {
  if (!props.channel || props.disabled || props.readonly) return
  const range = getChannelRange(props.channel)
  const current = Number(draft.value)
  const fallback = getChannelValue(parseColor(props.modelValue), props.channel)
  const next = Math.max(range.min, Math.min(range.max, (Number.isFinite(current) ? current : fallback) + direction * (props.step ?? range.step) * multiplier))
  draft.value = String(Math.round(next * 100) / 100)
  commit()
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    event.preventDefault()
    commit()
  }
  else if (event.key === 'Escape') {
    event.preventDefault()
    invalidDraft.value = false
    draft.value = formattedModel()
    ;(event.currentTarget as HTMLInputElement).select()
  }
  else if (props.channel && ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'].includes(event.key)) {
    event.preventDefault()
    const range = getChannelRange(props.channel)
    if (event.key === 'Home' || event.key === 'End') {
      draft.value = String(event.key === 'Home' ? range.min : range.max)
      commit()
    }
    else adjustChannel(event.key === 'ArrowUp' || event.key === 'PageUp' ? 1 : -1, event.key.startsWith('Page') ? 10 : 1)
  }
}

function handleWheel(event: WheelEvent) {
  if (props.disableWheelChange || !props.channel || document.activeElement !== event.currentTarget) return
  event.preventDefault()
  adjustChannel(event.deltaY < 0 ? 1 : -1)
}

async function copyValue() {
  try {
    const value = props.channel ? props.modelValue : formatColorValue(draft.value || props.modelValue, activeFormat.value, props.allowAlpha)
    if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(value)
    else {
      const fallback = document.createElement('textarea')
      fallback.value = value
      fallback.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0'
      document.body.append(fallback)
      fallback.select()
      const succeeded = document.execCommand('copy')
      fallback.remove()
      if (!succeeded) throw new Error('Clipboard unavailable')
    }
    copied.value = true
    emit('copy', value)
    if (copyTimer) clearTimeout(copyTimer)
    copyTimer = setTimeout(() => { copied.value = false }, 1400)
  }
  catch {
    emit('invalid', draft.value)
  }
}

watch(() => props.modelValue, syncDraft, { immediate: true })
watch(() => props.format, value => {
  activeFormat.value = value
  syncDraft()
})
watch(() => props.channel, syncDraft)
onBeforeUnmount(() => { if (copyTimer) clearTimeout(copyTimer) })
</script>

<template>
  <div
    data-dl
    data-slot="color-field"
    class="dl-color-field"
    :class="[{ 'is-invalid': invalidDraft || error, 'is-disabled': disabled }, $attrs.class]"
    :style="outerStyle"
  >
    <div v-if="showMeta" class="dl-color-meta">
      <span><label v-if="label" :for="fieldId">{{ label }}<em v-if="required"> *</em></label><small v-if="error || hint" :id="messageId">{{ error || hint }}</small></span>
      <small v-if="channel">{{ channel.toUpperCase() }} · {{ channelRange?.min }}–{{ channelRange?.max }}</small>
    </div>
    <div class="dl-color-field__control">
      <span v-if="showPreview" class="dl-color-field__preview dl-color-checker" aria-hidden="true"><i :style="{ background: visualColor }" /></span>
      <select
        v-if="showFormat && !channel"
        class="dl-color-field__format"
        :value="activeFormat"
        :disabled="disabled || readonly"
        aria-label="颜色格式"
        @change="changeFormat"
      >
        <option v-for="item in formatOptions" :key="item" :value="item">{{ item.toUpperCase() }}</option>
      </select>
      <span v-else-if="channel" class="dl-color-field__format" aria-hidden="true">{{ channel.slice(0, 1).toUpperCase() }}</span>
      <input
        :id="fieldId"
        v-bind="inputAttrs"
        v-model="draft"
        class="dl-color-field__input"
        type="text"
        :inputmode="channel ? 'decimal' : 'text'"
        :placeholder="placeholderText"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :aria-invalid="Boolean(invalidDraft || error)"
        :aria-describedby="error || hint ? messageId : undefined"
        autocomplete="off"
        spellcheck="false"
        @focus="editing = true"
        @blur="editing = false; commit()"
        @keydown="handleKeydown"
        @wheel="handleWheel"
      >
      <button v-if="copyable && !channel" type="button" class="dl-color-field__copy" :disabled="disabled" :aria-label="copied ? '已复制颜色值' : '复制颜色值'" @click="copyValue">
        {{ copied ? '✓' : '⧉' }}
      </button>
    </div>
    <input v-if="name" type="hidden" :name="name" :value="modelValue">
  </div>
</template>

<style scoped>
.dl-color-field { display: grid; gap: 7px; width: 100%; }
.dl-color-meta label { font-weight: 800; }
.dl-color-meta em { color: var(--dragon-red); font-style: normal; }
.dl-color-field__control { display: flex; align-items: center; min-height: 44px; overflow: hidden; border: 1px solid var(--dl-border); border-radius: var(--dl-radius-sm); color: var(--dl-text); background: var(--dl-surface); transition: border-color .15s ease, box-shadow .15s ease, background .15s ease; }
.dl-color-field__control:hover { border-color: var(--dl-border-strong); background: var(--dl-surface-hover); }
.dl-color-field__control:focus-within { border-color: var(--dl-border-focus); background: var(--dl-surface-strong); box-shadow: var(--dl-focus); }
.dl-color-field__preview { flex: 0 0 34px; align-self: stretch; padding: 5px; border-right: 1px solid var(--dl-border); }
.dl-color-field__preview i { display: block; width: 100%; height: 100%; min-height: 30px; border-radius: 7px; box-shadow: inset 0 0 0 1px rgba(255,255,255,.18); }
.dl-color-field__format { flex: 0 0 auto; min-width: 52px; height: 28px; margin-left: 7px; padding: 0 7px; border: 0; border-right: 1px solid var(--dl-border); color: var(--dl-text-faint); background: transparent; outline: none; font: 800 .58rem "Cascadia Code", Consolas, monospace; cursor: pointer; }
span.dl-color-field__format { display: grid; place-items: center; }
.dl-color-field__input { min-width: 0; flex: 1; align-self: stretch; padding: 0 10px; border: 0; outline: none; color: var(--dl-text); background: transparent; font: 700 .72rem "Cascadia Code", Consolas, monospace; }
.dl-color-field__input::placeholder { color: var(--dl-text-faint); font-weight: 500; }
.dl-color-field__copy { display: grid; flex: 0 0 34px; align-self: stretch; place-items: center; border: 0; border-left: 1px solid var(--dl-border); color: var(--dl-text-faint); background: transparent; cursor: pointer; }
.dl-color-field__copy:hover { color: var(--dl-accent-text); background: var(--dl-accent-surface); }
.dl-color-field.is-invalid .dl-color-field__control { border-color: color-mix(in srgb, var(--dragon-red) 72%, var(--dl-border)); box-shadow: 0 0 0 3px color-mix(in srgb, var(--dragon-red) 13%, transparent); }
.dl-color-field.is-invalid .dl-color-meta small { color: var(--dragon-red); }
.dl-color-field.is-disabled { opacity: .48; }
.dl-color-field.is-disabled .dl-color-field__control { cursor: not-allowed; }
@media (prefers-reduced-motion: reduce) { .dl-color-field__control { transition: none; } }
</style>
