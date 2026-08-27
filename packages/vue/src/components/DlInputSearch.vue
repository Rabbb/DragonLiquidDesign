<script setup lang="ts">
import { onBeforeUnmount, ref, useAttrs } from 'vue'
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
  submitButton?: boolean
  searchOnInput?: boolean
  debounce?: number
}>(), {
  modelValue: '', size: 'md', status: 'default', disabled: false, readonly: false,
  clearable: true, submitButton: true, searchOnInput: false, debounce: 250,
})
const emit = defineEmits<{ 'update:modelValue': [value: string]; clear: []; search: [value: string] }>()
const attrs = useAttrs()
const input = ref<HTMLInputElement | null>(null)
let timer: ReturnType<typeof setTimeout> | undefined

function runSearch(value = props.modelValue ?? '') {
  if (timer) clearTimeout(timer)
  emit('search', value.trim())
}
function update(value: string) {
  emit('update:modelValue', value)
  if (!props.searchOnInput) return
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => emit('search', value.trim()), Math.max(0, props.debounce))
}
function clear() {
  if (timer) clearTimeout(timer)
  emit('update:modelValue', '')
  emit('clear')
  if (props.searchOnInput) emit('search', '')
  input.value?.focus()
}
function handleEscape() { if (props.modelValue) clear(); else input.value?.blur() }
onBeforeUnmount(() => { if (timer) clearTimeout(timer) })
</script>

<template>
  <InputFieldShell data-dl data-slot="input-search" :size="size" :status="status" :disabled="disabled">
    <template #leading><slot name="leading"><span aria-hidden="true">⌕</span></slot></template>
    <input ref="input" v-bind="attrs" type="search" enterkeyhint="search" :value="modelValue ?? ''" :disabled="disabled" :readonly="readonly" :aria-invalid="status === 'error' || undefined" class="dl-input-field__control" @input="update(($event.target as HTMLInputElement).value)" @search="update(($event.target as HTMLInputElement).value)" @keydown.enter.prevent="runSearch()" @keydown.esc.prevent="handleEscape">
    <template #trailing>
      <button v-if="clearable && modelValue && !readonly" type="button" class="dl-input-field__action" aria-label="清空搜索" @mousedown.prevent @click="clear">×</button>
      <button v-if="submitButton" type="button" class="dl-input-field__action" data-active aria-label="执行搜索" @mousedown.prevent @click="runSearch()">↵</button>
      <slot name="trailing" />
    </template>
  </InputFieldShell>
</template>
