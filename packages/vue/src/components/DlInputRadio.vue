<script setup lang="ts">
import { useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{
  modelValue?: string | number | null
  value: string | number
  label?: string
  description?: string
  disabled?: boolean
}>(), { modelValue: null, label: undefined, description: undefined, disabled: false })
const emit = defineEmits<{ 'update:modelValue': [value: string | number] }>()
const attrs = useAttrs()
</script>

<template>
  <label data-dl data-slot="input-radio" class="dl-input-choice" data-kind="radio" :data-disabled="disabled || undefined">
    <input v-bind="attrs" type="radio" :checked="Object.is(modelValue, value)" :value="value" :disabled="disabled" class="dl-input-native" @change="emit('update:modelValue', value)">
    <span class="dl-input-choice__control" aria-hidden="true" />
    <span v-if="label || description || $slots.default" class="dl-input-choice__copy"><strong><slot>{{ label }}</slot></strong><small v-if="description">{{ description }}</small></span>
  </label>
</template>
