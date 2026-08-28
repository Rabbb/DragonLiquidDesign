<script setup lang="ts">
import { ColorAreaArea, ColorAreaRoot, ColorAreaThumb, type ColorChannel, type ColorSpace } from 'reka-ui'
import { computed, useAttrs, type StyleValue } from 'vue'
import { safeColorValue } from './color-controls'
import './color-controls.css'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  modelValue?: string
  colorSpace?: ColorSpace
  xChannel?: ColorChannel
  yChannel?: ColorChannel
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}>(), {
  modelValue: '#ff8c00',
  colorSpace: 'hsl',
  xChannel: 'saturation',
  yChannel: 'lightness',
  disabled: false,
  size: 'md',
})

const emit = defineEmits<{ 'update:modelValue': [value: string]; changeEnd: [value: string] }>()
const attrs = useAttrs()
const areaAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
})
const visualColor = computed(() => safeColorValue(props.modelValue))
const outerStyle = computed(() => attrs.style as StyleValue)
</script>

<template>
  <div
    data-dl
    data-slot="color-area"
    class="dl-color-area"
    :class="[`is-${size}`, { 'is-disabled': disabled }, $attrs.class]"
    :style="outerStyle"
  >
    <ColorAreaRoot
      v-slot="{ style }"
      :model-value="modelValue"
      :color-space="colorSpace"
      :x-channel="xChannel"
      :y-channel="yChannel"
      :disabled="disabled"
      @update:model-value="emit('update:modelValue', $event)"
      @change-end="emit('changeEnd', $event)"
    >
      <div class="dl-color-area__checker dl-color-checker">
        <ColorAreaArea v-bind="areaAttrs" :style="style" class="dl-color-area__surface">
          <ColorAreaThumb class="dl-color-thumb" :style="{ background: visualColor }" />
        </ColorAreaArea>
      </div>
    </ColorAreaRoot>
  </div>
</template>

<style scoped>
.dl-color-area { width: 100%; }
.dl-color-area__checker { overflow: hidden; border: 1px solid var(--dl-border-strong); border-radius: var(--dl-radius-md); box-shadow: inset 0 1px 0 rgba(255,255,255,.15), 0 13px 34px color-mix(in srgb, var(--dl-night) 22%, transparent); }
.dl-color-area__surface { position: relative; width: 100%; height: 100%; touch-action: none; outline: none; }
.dl-color-area__surface:focus-visible { box-shadow: inset var(--dl-focus); }
.dl-color-area.is-sm .dl-color-area__checker { height: 150px; }
.dl-color-area.is-md .dl-color-area__checker { height: 224px; }
.dl-color-area.is-lg .dl-color-area__checker { height: 300px; }
.dl-color-area.is-disabled { opacity: .46; }
@media (max-width: 560px) { .dl-color-area.is-lg .dl-color-area__checker { height: 240px; } }
</style>
