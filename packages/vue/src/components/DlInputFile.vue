<script setup lang="ts">
import { useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{
  accept?: string
  capture?: 'user' | 'environment'
  multiple?: boolean
  required?: boolean
  disabled?: boolean
}>(), { accept: undefined, capture: undefined, multiple: false, required: false, disabled: false })
const emit = defineEmits<{ select: [files: FileList | null] }>()
const attrs = useAttrs()
</script>

<template>
  <input
    v-bind="attrs"
    data-dl
    data-slot="input-file"
    type="file"
    :accept="accept"
    :capture="capture"
    :multiple="multiple"
    :required="required"
    :disabled="disabled"
    class="block w-full rounded-[var(--dl-radius-sm)] border border-dashed border-[var(--dl-border)] bg-[var(--dl-surface)] p-3 text-sm text-[var(--dl-text-muted)] outline-none file:mr-3 file:rounded-[var(--dl-radius-xs)] file:border file:border-[var(--dl-accent-border)] file:bg-[var(--dl-accent-surface)] file:px-3 file:py-2 file:text-[var(--dl-accent-text)] focus:[box-shadow:var(--dl-focus)] disabled:cursor-not-allowed disabled:opacity-50"
    @change="emit('select', ($event.target as HTMLInputElement).files)"
  >
</template>
