<script setup lang="ts">
import { useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{ modelValue?: string | number | null }>(), { modelValue: '' })
const attrs = useAttrs()
</script>

<template>
  <input v-bind="attrs" data-dl data-slot="input-hidden" type="hidden" :value="modelValue ?? ''">
</template>
