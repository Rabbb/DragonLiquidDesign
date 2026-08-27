<script setup lang="ts">
import { useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{ value?: string; disabled?: boolean }>(), { value: '重置', disabled: false })
const attrs = useAttrs()
</script>

<template>
  <input v-bind="attrs" data-dl data-slot="input-reset" type="reset" :value="value" :disabled="disabled" class="min-h-10 cursor-pointer rounded-[var(--dl-button-radius)] border border-[var(--dl-button-secondary-border)] bg-[var(--dl-button-secondary-bg)] px-4 font-semibold text-[var(--dl-button-secondary-text)] shadow-[var(--dl-button-secondary-shadow)] transition hover:border-[var(--dl-button-secondary-border-hover)] hover:bg-[var(--dl-button-secondary-bg-hover)] disabled:cursor-not-allowed disabled:opacity-50">
</template>
