<script setup lang="ts">
import { useAttrs } from 'vue'
import type { DlSize } from '../types'
import InputFieldShell from './InputFieldShell.vue'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{ modelValue?: string | null; size?: DlSize; status?: 'default' | 'success' | 'warning' | 'error'; disabled?: boolean }>(), { modelValue: '', size: 'md', status: 'default', disabled: false })
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
const attrs = useAttrs()
</script>

<template>
  <InputFieldShell data-dl data-slot="input-time" :size="size" :status="status" :disabled="disabled">
    <template v-if="$slots.leading" #leading><slot name="leading" /></template>
    <input v-bind="attrs" type="time" :value="modelValue ?? ''" :disabled="disabled" :aria-invalid="status === 'error' || undefined" class="min-w-0 flex-1 border-0 bg-transparent text-inherit outline-none" @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)">
    <template v-if="$slots.trailing" #trailing><slot name="trailing" /></template>
  </InputFieldShell>
</template>
