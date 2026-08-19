<script setup lang="ts">
import { Label } from 'reka-ui'

const props = withDefaults(defineProps<{
  for?: string
  required?: boolean
  disabled?: boolean
}>(), { for: undefined, required: false, disabled: false })
</script>

<template>
  <Label
    data-dl
    data-slot="label"
    :for="props.for"
    :data-disabled="disabled || undefined"
    class="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--dl-text)] data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
  >
    <slot />
    <span v-if="required" class="text-[var(--dl-accent)]" aria-hidden="true">*</span>
  </Label>
</template>
