<script setup lang="ts">
import { useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{
  modelValue?: boolean
  value?: string
  disabled?: boolean
}>(), { modelValue: false, value: 'on', disabled: false })
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()
const attrs = useAttrs()
</script>

<template>
  <input
    v-bind="attrs"
    data-dl
    data-slot="input-checkbox"
    type="checkbox"
    :checked="modelValue"
    :value="value"
    :disabled="disabled"
    class="h-4 w-4 cursor-pointer accent-[var(--dl-accent)] disabled:cursor-not-allowed disabled:opacity-50"
    @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
  >
</template>
