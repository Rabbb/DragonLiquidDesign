<script setup lang="ts">
import { ref, useAttrs } from 'vue'
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
  format?: 'none' | 'cn-mobile'
}>(), {
  modelValue: '', size: 'md', status: 'default', disabled: false, readonly: false,
  clearable: true, format: 'none',
})
const emit = defineEmits<{ 'update:modelValue': [value: string]; clear: []; commit: [value: string] }>()
const attrs = useAttrs()
const input = ref<HTMLInputElement | null>(null)

function update(value: string) { emit('update:modelValue', value) }
function commit() {
  let value = (props.modelValue ?? '').trim()
  if (props.format === 'cn-mobile') {
    const prefix = value.startsWith('+86') ? '+86 ' : ''
    const digits = value.replace(/^\+86/, '').replace(/\D/g, '').slice(0, 11)
    value = prefix + [digits.slice(0, 3), digits.slice(3, 7), digits.slice(7, 11)].filter(Boolean).join(' ')
  }
  if (value !== props.modelValue) update(value)
  emit('commit', value)
}
function clear() { update(''); emit('clear'); input.value?.focus() }
</script>

<template>
  <InputFieldShell data-dl data-slot="input-tel" :size="size" :status="status" :disabled="disabled">
    <template #leading><slot name="leading"><span aria-hidden="true">☎</span></slot></template>
    <input ref="input" v-bind="attrs" type="tel" inputmode="tel" :value="modelValue ?? ''" :disabled="disabled" :readonly="readonly" :aria-invalid="status === 'error' || undefined" class="dl-input-field__control" @input="update(($event.target as HTMLInputElement).value)" @blur="commit" @keydown.enter="commit">
    <template #trailing>
      <button v-if="clearable && modelValue && !readonly" type="button" class="dl-input-field__action" aria-label="清空电话号码" @mousedown.prevent @click="clear">×</button>
      <slot name="trailing" />
    </template>
  </InputFieldShell>
</template>
