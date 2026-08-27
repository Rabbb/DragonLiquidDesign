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
  revealable?: boolean
  showStrength?: boolean
  clearable?: boolean
}>(), {
  modelValue: '', size: 'md', status: 'default', disabled: false, readonly: false,
  revealable: true, showStrength: true, clearable: false,
})
const emit = defineEmits<{ 'update:modelValue': [value: string]; clear: []; reveal: [visible: boolean] }>()
const attrs = useAttrs()
const input = ref<HTMLInputElement | null>(null)
const visible = ref(false)
const capsLock = ref(false)
const strength = computed(() => {
  const value = props.modelValue ?? ''
  if (!value) return 0
  let score = value.length >= 8 ? 1 : 0
  if (value.length >= 12) score += 1
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score += 1
  if (/\d/.test(value) && /[^\w\s]/.test(value)) score += 1
  return Math.max(1, Math.min(4, score))
})
function update(value: string) { emit('update:modelValue', value) }
function toggleVisibility() { visible.value = !visible.value; emit('reveal', visible.value); input.value?.focus() }
function clear() { update(''); emit('clear'); input.value?.focus() }
function checkCaps(event: KeyboardEvent) { capsLock.value = event.getModifierState('CapsLock') }
</script>

<template>
  <InputFieldShell data-dl data-slot="input-password" :size="size" :status="status" :disabled="disabled">
    <template #leading><slot name="leading"><span aria-hidden="true">◆</span></slot></template>
    <input type="password" :value="modelValue ?? ''" class="dl-input-native" tabindex="-1" aria-hidden="true">
    <input ref="input" v-bind="attrs" :type="visible ? 'text' : 'password'" :value="modelValue ?? ''" :disabled="disabled" :readonly="readonly" :aria-invalid="status === 'error' || undefined" class="dl-input-field__control" @input="update(($event.target as HTMLInputElement).value)" @keydown="checkCaps" @keyup="checkCaps" @blur="capsLock = false">
    <template #trailing>
      <span v-if="capsLock" class="dl-input-field__notice" role="status">CAPS</span>
      <span v-if="showStrength && modelValue" class="dl-input-password-strength" :title="`密码强度 ${strength}/4`" :aria-label="`密码强度 ${strength}/4`"><i v-for="level in 4" :key="level" :data-filled="level <= strength || undefined" /></span>
      <button v-if="revealable" type="button" class="dl-input-field__action" :data-active="visible || undefined" :aria-label="visible ? '隐藏密码' : '显示密码'" @mousedown.prevent @click="toggleVisibility">{{ visible ? '◉' : '◎' }}</button>
      <button v-if="clearable && modelValue && !readonly" type="button" class="dl-input-field__action" aria-label="清空密码" @mousedown.prevent @click="clear">×</button>
      <slot name="trailing" />
    </template>
  </InputFieldShell>
</template>
