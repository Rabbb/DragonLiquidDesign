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
  showCount?: boolean
  trimOnBlur?: boolean
  selectOnFocus?: boolean
}>(), {
  modelValue: '', size: 'md', status: 'default', disabled: false, readonly: false,
  clearable: true, showCount: true, trimOnBlur: false, selectOnFocus: false,
})
const emit = defineEmits<{
  'update:modelValue': [value: string]
  clear: []
  commit: [value: string]
}>()
const attrs = useAttrs()
const input = ref<HTMLInputElement | null>(null)
const maxLength = computed(() => {
  const value = Number(attrs.maxlength)
  return Number.isFinite(value) && value >= 0 ? value : null
})
const valueLength = computed(() => [...(props.modelValue ?? '')].length)

function update(value: string) { emit('update:modelValue', value) }
function commit() {
  const value = props.trimOnBlur ? (props.modelValue ?? '').trim() : (props.modelValue ?? '')
  if (value !== props.modelValue) update(value)
  emit('commit', value)
}
function clear() { update(''); emit('clear'); input.value?.focus() }
</script>

<template>
  <InputFieldShell data-dl data-slot="input-text" :size="size" :status="status" :disabled="disabled">
    <template #leading><slot name="leading"><span aria-hidden="true">T</span></slot></template>
    <input ref="input" v-bind="attrs" type="text" :value="modelValue ?? ''" :disabled="disabled" :readonly="readonly" :aria-invalid="status === 'error' || undefined" class="dl-input-field__control" @input="update(($event.target as HTMLInputElement).value)" @focus="selectOnFocus && ($event.target as HTMLInputElement).select()" @blur="commit" @keydown.enter="commit">
    <template #trailing>
      <span v-if="showCount && maxLength !== null" class="dl-input-field__count" :data-limit="valueLength >= maxLength || undefined">{{ valueLength }}/{{ maxLength }}</span>
      <button v-if="clearable && modelValue && !readonly" type="button" class="dl-input-field__action" aria-label="清空文本" @mousedown.prevent @click="clear">×</button>
      <slot name="trailing" />
    </template>
  </InputFieldShell>
</template>
