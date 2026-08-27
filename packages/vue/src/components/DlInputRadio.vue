<script setup lang="ts">
import { useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{
  modelValue?: string | number | null
  value: string | number
  disabled?: boolean
}>(), { modelValue: null, disabled: false })
const emit = defineEmits<{ 'update:modelValue': [value: string | number] }>()
const attrs = useAttrs()
</script>

<template>
  <input
    v-bind="attrs"
    data-dl
    data-slot="input-radio"
    type="radio"
    :checked="Object.is(modelValue, value)"
    :value="value"
    :disabled="disabled"
    class="h-4 w-4 cursor-pointer accent-[var(--dl-accent)] disabled:cursor-not-allowed disabled:opacity-50"
    @change="emit('update:modelValue', value)"
  >
</template>
