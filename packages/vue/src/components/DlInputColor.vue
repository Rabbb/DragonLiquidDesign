<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
import type { DlSize } from '../types'
import InputFieldShell from './InputFieldShell.vue'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{
  modelValue?: string | null
  defaultValue?: string
  size?: DlSize
  status?: 'default' | 'success' | 'warning' | 'error'
  disabled?: boolean
  readonly?: boolean
  copyable?: boolean
  resettable?: boolean
}>(), {
  modelValue: '#000000', defaultValue: '#000000', size: 'md', status: 'default', disabled: false,
  readonly: false, copyable: true, resettable: true,
})
const emit = defineEmits<{ 'update:modelValue': [value: string]; copy: [value: string]; reset: [value: string] }>()
const attrs = useAttrs()
const textInput = ref<HTMLInputElement | null>(null)
const copied = ref(false)
const safeValue = computed(() => /^#[\da-f]{6}$/i.test(props.modelValue ?? '') ? props.modelValue! : props.defaultValue)

function update(value: string) { emit('update:modelValue', value.toLocaleUpperCase()) }
function updateText(value: string) {
  const candidate = value.startsWith('#') ? value : `#${value}`
  if (/^#[\da-f]{6}$/i.test(candidate)) update(candidate)
}
async function copy() {
  await navigator.clipboard?.writeText(safeValue.value)
  copied.value = true
  emit('copy', safeValue.value)
  setTimeout(() => { copied.value = false }, 1200)
}
function reset() { update(props.defaultValue); emit('reset', props.defaultValue); textInput.value?.focus() }
</script>

<template>
  <div data-dl data-slot="input-color" class="dl-input-color">
    <InputFieldShell :size="size" :status="status" :disabled="disabled">
      <template #leading>
        <span class="dl-input-color__swatch" :style="{ background: safeValue }">
          <input v-bind="attrs" type="color" :value="safeValue" :disabled="disabled || readonly" aria-label="打开颜色选择器" @input="update(($event.target as HTMLInputElement).value)">
        </span>
      </template>
      <input ref="textInput" type="text" inputmode="text" :value="safeValue" :disabled="disabled" :readonly="readonly" maxlength="7" spellcheck="false" class="dl-input-field__control" aria-label="十六进制颜色" @input="updateText(($event.target as HTMLInputElement).value)">
      <template #trailing>
        <button v-if="copyable" type="button" class="dl-input-field__action" :aria-label="copied ? '已复制颜色' : '复制颜色'" @click="copy">{{ copied ? '✓' : '⧉' }}</button>
        <button v-if="resettable && safeValue.toLocaleLowerCase() !== defaultValue.toLocaleLowerCase() && !readonly" type="button" class="dl-input-field__action" aria-label="恢复默认颜色" @click="reset">↺</button>
      </template>
    </InputFieldShell>
  </div>
</template>
