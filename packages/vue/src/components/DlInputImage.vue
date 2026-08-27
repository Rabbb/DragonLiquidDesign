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
  <span data-dl data-slot="input-image">
    <input type="image" :src="src" :alt="alt" class="dl-input-native" tabindex="-1" aria-hidden="true">
    <button v-bind="attrs" type="submit" class="dl-input-action" :disabled="disabled" :aria-label="alt"><img :src="src" :alt="alt" :width="width" :height="height"></button>
  </span>
</template>
