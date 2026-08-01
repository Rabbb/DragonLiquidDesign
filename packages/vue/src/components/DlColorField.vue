<script setup lang="ts">
import { ColorFieldInput, ColorFieldRoot, type ColorChannel, type ColorSpace } from 'reka-ui'

withDefaults(defineProps<{ modelValue?: string; colorSpace?: ColorSpace; channel?: ColorChannel; placeholder?: string; disabled?: boolean; readonly?: boolean; name?: string }>(), { modelValue: '#ff8c00', colorSpace: 'hsl', channel: undefined, placeholder: '#RRGGBB', disabled: false, readonly: false, name: undefined })
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <ColorFieldRoot data-dl data-slot="color-field" :model-value="modelValue" :color-space="colorSpace" :channel="channel" :placeholder="placeholder" :disabled="disabled" :readonly="readonly" :name="name" class="flex min-h-11 w-full items-center gap-3 rounded-[var(--dl-radius-sm)] border border-[var(--dl-border)] bg-[var(--dl-surface)] px-3 text-sm transition focus-within:border-[var(--dl-border-focus)] focus-within:[box-shadow:var(--dl-focus)] data-[disabled]:opacity-45" @update:model-value="emit('update:modelValue', $event)">
    <span class="size-6 shrink-0 rounded-lg border border-white/20 shadow-inner" :style="{ backgroundColor: modelValue }" />
    <ColorFieldInput class="min-w-0 flex-1 border-0 bg-transparent font-mono uppercase text-[var(--dl-text)] outline-none placeholder:text-[var(--dl-text-faint)]" />
  </ColorFieldRoot>
</template>
