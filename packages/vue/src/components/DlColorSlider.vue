<script setup lang="ts">
import { ColorSliderRoot, ColorSliderThumb, ColorSliderTrack, type ColorChannel, type ColorSpace } from 'reka-ui'

withDefaults(defineProps<{ modelValue?: string; channel: ColorChannel; colorSpace?: ColorSpace; orientation?: 'horizontal' | 'vertical'; disabled?: boolean; step?: number }>(), { modelValue: '#ff8c00', colorSpace: 'hsl', orientation: 'horizontal', disabled: false, step: undefined })
const emit = defineEmits<{ 'update:modelValue': [value: string]; changeEnd: [value: string] }>()
</script>

<template>
  <ColorSliderRoot data-dl data-slot="color-slider" :model-value="modelValue" :channel="channel" :color-space="colorSpace" :orientation="orientation" :disabled="disabled" :step="step" :class="['flex touch-none select-none items-center data-[disabled]:opacity-45', orientation === 'horizontal' ? 'h-7 w-full' : 'h-56 w-7 flex-col']" @update:model-value="emit('update:modelValue', $event as string)" @change-end="emit('changeEnd', $event)">
    <ColorSliderTrack :class="['relative rounded-full border border-[var(--dl-border-strong)] shadow-inner', orientation === 'horizontal' ? 'h-3 w-full' : 'h-full w-3']" />
    <ColorSliderThumb class="block size-5 rounded-full border-2 border-white bg-transparent shadow-[0_2px_10px_rgba(0,0,0,.65)] outline-none focus-visible:[box-shadow:var(--dl-focus)]" />
  </ColorSliderRoot>
</template>
