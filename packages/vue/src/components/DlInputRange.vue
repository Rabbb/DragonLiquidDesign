<script setup lang="ts">
import { useAttrs } from 'vue'
import type { DlSize } from '../types'
import InputFieldShell from './InputFieldShell.vue'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{ modelValue?: number | null; size?: DlSize; status?: 'default' | 'success' | 'warning' | 'error'; disabled?: boolean }>(), { modelValue: 50, size: 'md', status: 'default', disabled: false })
const emit = defineEmits<{ 'update:modelValue': [value: number] }>()
const attrs = useAttrs()
</script>

<template>
  <InputFieldShell data-dl data-slot="input-range" :size="size" :status="status" :disabled="disabled">
    <template v-if="$slots.leading" #leading><slot name="leading" /></template>
    <input v-bind="attrs" type="range" :value="modelValue ?? 50" :disabled="disabled" :aria-invalid="status === 'error' || undefined" class="min-w-0 flex-1 accent-[var(--dl-accent)]" @input="emit('update:modelValue', ($event.target as HTMLInputElement).valueAsNumber)">
    <template v-if="$slots.trailing" #trailing><slot name="trailing" /></template>
  </InputFieldShell>
</template>
