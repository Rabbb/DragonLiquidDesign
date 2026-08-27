<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
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
  openable?: boolean
}>(), {
  modelValue: '', size: 'md', status: 'default', disabled: false, readonly: false,
  clearable: true, normalizeOnBlur: true, openable: true,
})
const emit = defineEmits<{ 'update:modelValue': [value: string]; clear: []; commit: [value: string]; open: [value: string] }>()
const attrs = useAttrs()
const input = ref<HTMLInputElement | null>(null)
const normalizedUrl = computed(() => {
  const value = (props.modelValue ?? '').trim()
  if (!value) return ''
  return /^[a-z][a-z\d+.-]*:/i.test(value) ? value : `https://${value}`
})

function update(value: string) { emit('update:modelValue', value) }
function commit() {
  const value = props.normalizeOnBlur ? normalizedUrl.value : (props.modelValue ?? '').trim()
  if (value !== props.modelValue) update(value)
  emit('commit', value)
}
function clear() { update(''); emit('clear'); input.value?.focus() }
function open() {
  if (!normalizedUrl.value) return
  emit('open', normalizedUrl.value)
  window.open(normalizedUrl.value, '_blank', 'noopener,noreferrer')
}
</script>

<template>
  <InputFieldShell data-dl data-slot="input-url" :size="size" :status="status" :disabled="disabled">
    <template #leading><slot name="leading"><span aria-hidden="true">↗</span></slot></template>
    <input ref="input" v-bind="attrs" type="url" inputmode="url" :value="modelValue ?? ''" :disabled="disabled" :readonly="readonly" :aria-invalid="status === 'error' || undefined" class="dl-input-field__control" @input="update(($event.target as HTMLInputElement).value)" @blur="commit" @keydown.enter="commit">
    <template #trailing>
      <button v-if="openable && normalizedUrl" type="button" class="dl-input-field__action" aria-label="打开网址" title="打开网址" @mousedown.prevent @click="open">↗</button>
      <button v-if="clearable && modelValue && !readonly" type="button" class="dl-input-field__action" aria-label="清空网址" @mousedown.prevent @click="clear">×</button>
      <slot name="trailing" />
    </template>
  </InputFieldShell>
</template>
