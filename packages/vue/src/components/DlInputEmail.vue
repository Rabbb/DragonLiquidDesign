<script setup lang="ts">
import { nextTick, ref, useAttrs } from 'vue'
import type { DlSize } from '../types'
import InputFieldShell from './InputFieldShell.vue'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{
  modelValue?: string | null
  size?: DlSize
  status?: 'default' | 'success' | 'warning' | 'error'
  disabled?: boolean
  readonly?: boolean
  clearable?: boolean
  normalizeOnBlur?: boolean
  showValidation?: boolean
}>(), {
  modelValue: '', size: 'md', status: 'default', disabled: false, readonly: false,
  clearable: true, normalizeOnBlur: true, showValidation: true,
})
const emit = defineEmits<{
  'update:modelValue': [value: string]
  clear: []
  commit: [value: string]
  validity: [valid: boolean]
}>()
const attrs = useAttrs()
const input = ref<HTMLInputElement | null>(null)
const validity = ref<'idle' | 'valid' | 'invalid'>('idle')

function normalizeAddress(address: string) {
  const trimmed = address.trim()
  const at = trimmed.lastIndexOf('@')
  return at < 0 ? trimmed : `${trimmed.slice(0, at)}@${trimmed.slice(at + 1).toLocaleLowerCase()}`
}
function normalize(value: string) {
  return attrs.multiple === undefined ? normalizeAddress(value) : value.split(',').map(normalizeAddress).join(', ')
}
function update(value: string) { validity.value = 'idle'; emit('update:modelValue', value) }
async function commit() {
  const value = props.normalizeOnBlur ? normalize(props.modelValue ?? '') : (props.modelValue ?? '')
  if (value !== props.modelValue) emit('update:modelValue', value)
  await nextTick()
  const valid = input.value?.checkValidity() ?? true
  validity.value = value ? (valid ? 'valid' : 'invalid') : 'idle'
  emit('validity', valid)
  emit('commit', value)
}
function clear() { validity.value = 'idle'; emit('update:modelValue', ''); emit('clear'); input.value?.focus() }
</script>

<template>
  <InputFieldShell data-dl data-slot="input-email" :size="size" :status="validity === 'invalid' ? 'error' : status" :disabled="disabled">
    <template #leading><slot name="leading"><span aria-hidden="true">@</span></slot></template>
    <input ref="input" v-bind="attrs" type="email" inputmode="email" :value="modelValue ?? ''" :disabled="disabled" :readonly="readonly" :aria-invalid="validity === 'invalid' || status === 'error' || undefined" class="dl-input-field__control" @input="update(($event.target as HTMLInputElement).value)" @blur="commit" @keydown.enter="commit">
    <template #trailing>
      <span v-if="showValidation && validity !== 'idle'" :title="validity === 'valid' ? '邮箱格式有效' : input?.validationMessage" :style="{ color: validity === 'valid' ? '#31a36f' : '#d84d57' }" aria-live="polite">{{ validity === 'valid' ? '✓' : '!' }}</span>
      <button v-if="clearable && modelValue && !readonly" type="button" class="dl-input-field__action" aria-label="清空邮箱" @mousedown.prevent @click="clear">×</button>
      <slot name="trailing" />
    </template>
  </InputFieldShell>
</template>
