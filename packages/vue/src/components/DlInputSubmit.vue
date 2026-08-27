<script setup lang="ts">
import { useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{ value?: string; disabled?: boolean }>(), { value: '提交', disabled: false })
const attrs = useAttrs()
</script>

<template>
  <input v-bind="attrs" data-dl data-slot="input-submit" type="submit" :value="value" :disabled="disabled" class="min-h-10 cursor-pointer rounded-[var(--dl-button-radius)] border border-[var(--dl-button-primary-border)] bg-[image:var(--dl-button-primary-bg)] px-4 font-semibold text-[var(--dl-button-primary-text)] shadow-[var(--dl-button-primary-shadow)] transition hover:bg-[image:var(--dl-button-primary-bg-hover)] disabled:cursor-not-allowed disabled:opacity-50">
</template>
