<script setup lang="ts">
import { ColorAreaArea, ColorAreaRoot, ColorAreaThumb, type ColorChannel, type ColorSpace } from 'reka-ui'

withDefaults(defineProps<{
  modelValue?: string
  colorSpace?: ColorSpace
  xChannel?: ColorChannel
  yChannel?: ColorChannel
  disabled?: boolean
}>(), { modelValue: '#ff8c00', colorSpace: 'hsl', xChannel: 'saturation', yChannel: 'lightness', disabled: false })
const emit = defineEmits<{ 'update:modelValue': [value: string]; changeEnd: [value: string] }>()
</script>

<template>
  <ColorAreaRoot v-slot="{ style }" data-dl data-slot="color-area" :model-value="modelValue" :color-space="colorSpace" :x-channel="xChannel" :y-channel="yChannel" :disabled="disabled" class="w-full data-[disabled]:opacity-45" @update:model-value="emit('update:modelValue', $event)" @change-end="emit('changeEnd', $event)">
    <ColorAreaArea :style="style" class="relative h-56 w-full touch-none rounded-[var(--dl-radius-md)] border border-[var(--dl-border-strong)] shadow-[inset_0_1px_0_rgba(255,255,255,.15),0_18px_45px_rgba(0,0,0,.28)] outline-none focus-visible:[box-shadow:var(--dl-focus)]">
      <ColorAreaThumb class="size-5 rounded-full border-2 border-white bg-transparent shadow-[0_2px_10px_rgba(0,0,0,.65)] outline-none focus-visible:[box-shadow:var(--dl-focus)]" />
    </ColorAreaArea>
  </ColorAreaRoot>
</template>
