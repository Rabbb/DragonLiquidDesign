<script setup lang="ts">
import { useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{
  src: string
  alt: string
  width?: number | string
  height?: number | string
  disabled?: boolean
}>(), { width: undefined, height: undefined, disabled: false })
const attrs = useAttrs()
</script>

<template>
  <input v-bind="attrs" data-dl data-slot="input-image" type="image" :src="src" :alt="alt" :width="width" :height="height" :disabled="disabled" class="cursor-pointer rounded-[var(--dl-radius-sm)] outline-none focus:[box-shadow:var(--dl-focus)] disabled:cursor-not-allowed disabled:opacity-50">
</template>
