<script setup lang="ts">
import { useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{
  modelValue?: boolean
  value?: string
  label?: string
  description?: string
  disabled?: boolean
}>(), { modelValue: false, value: 'on', label: undefined, description: undefined, disabled: false })
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()
const attrs = useAttrs()
</script>

<template>
  <label data-dl data-slot="input-checkbox" class="dl-input-choice" data-kind="checkbox" :data-disabled="disabled || undefined">
    <input v-bind="attrs" type="checkbox" :checked="modelValue" :value="value" :disabled="disabled" class="dl-input-native" @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)">
    <span class="dl-input-choice__control" aria-hidden="true" />
    <span v-if="label || description || $slots.default" class="dl-input-choice__copy"><strong><slot>{{ label }}</slot></strong><small v-if="description">{{ description }}</small></span>
  </label>
</template>
