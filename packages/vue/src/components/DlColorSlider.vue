<script setup lang="ts">
import { ColorSliderRoot, ColorSliderThumb, ColorSliderTrack, getChannelValue, parseColor, type ColorChannel, type ColorSpace } from 'reka-ui'
import { computed, useAttrs, type StyleValue } from 'vue'
import { safeColorValue } from './color-controls'
import './color-controls.css'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  modelValue?: string
  channel: ColorChannel
  colorSpace?: ColorSpace
  orientation?: 'horizontal' | 'vertical'
  disabled?: boolean
  step?: number
  label?: string
  description?: string
  showValue?: boolean
  size?: 'sm' | 'md' | 'lg'
}>(), {
  modelValue: '#ff8c00',
  colorSpace: 'hsl',
  orientation: 'horizontal',
  disabled: false,
  step: undefined,
  label: undefined,
  description: undefined,
  showValue: false,
  size: 'md',
})

const emit = defineEmits<{ 'update:modelValue': [value: string]; changeEnd: [value: string] }>()
const attrs = useAttrs()
const rootAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
})
const visualColor = computed(() => safeColorValue(props.modelValue))
const outerStyle = computed(() => attrs.style as StyleValue)
const channelValue = computed(() => {
  try {
    const value = Math.round(getChannelValue(parseColor(props.modelValue), props.channel) * 100) / 100
    return props.channel === 'alpha' || ['saturation', 'lightness', 'brightness'].includes(props.channel) ? `${value}%` : props.channel === 'hue' ? `${value}°` : String(value)
  }
  catch {
    return '—'
  }
})
</script>

<template>
  <div
    data-dl
    data-slot="color-slider"
    class="dl-color-slider"
    :class="[`is-${size}`, `is-${orientation}`, { 'is-disabled': disabled }, $attrs.class]"
    :style="outerStyle"
  >
    <div v-if="label || description || showValue" class="dl-color-meta">
      <span><b v-if="label">{{ label }}</b><small v-if="description">{{ description }}</small></span>
      <small v-if="showValue">{{ channelValue }}</small>
    </div>
    <ColorSliderRoot
      v-bind="rootAttrs"
      :model-value="modelValue"
      :channel="channel"
      :color-space="colorSpace"
      :orientation="orientation"
      :disabled="disabled"
      :step="step"
      class="dl-color-slider__root"
      @update:model-value="emit('update:modelValue', $event as string)"
      @change-end="emit('changeEnd', $event)"
    >
      <ColorSliderTrack class="dl-color-slider__track" />
      <ColorSliderThumb class="dl-color-thumb" :style="{ background: visualColor }" />
    </ColorSliderRoot>
  </div>
</template>

<style scoped>
.dl-color-slider { display: grid; gap: 7px; width: 100%; }
.dl-color-slider__root { position: relative; display: flex; align-items: center; touch-action: none; user-select: none; }
.dl-color-slider.is-horizontal .dl-color-slider__root { width: 100%; }
.dl-color-slider.is-vertical { width: max-content; }
.dl-color-slider.is-vertical .dl-color-slider__root { height: 224px; flex-direction: column; }
.dl-color-slider__track { position: relative; overflow: hidden; border: 1px solid var(--dl-border-strong); border-radius: 999px; box-shadow: inset 0 1px 3px rgba(0,0,0,.22); }
.dl-color-slider.is-horizontal .dl-color-slider__track { width: 100%; }
.dl-color-slider.is-vertical .dl-color-slider__track { width: 100%; height: 100%; }
.dl-color-slider.is-horizontal.is-sm .dl-color-slider__root { height: 24px; }.dl-color-slider.is-horizontal.is-sm .dl-color-slider__track { height: 8px; }
.dl-color-slider.is-horizontal.is-md .dl-color-slider__root { height: 30px; }.dl-color-slider.is-horizontal.is-md .dl-color-slider__track { height: 13px; }
.dl-color-slider.is-horizontal.is-lg .dl-color-slider__root { height: 36px; }.dl-color-slider.is-horizontal.is-lg .dl-color-slider__track { height: 17px; }
.dl-color-slider.is-vertical.is-sm .dl-color-slider__root { width: 24px; }.dl-color-slider.is-vertical.is-sm .dl-color-slider__track { width: 8px; }
.dl-color-slider.is-vertical.is-md .dl-color-slider__root { width: 30px; }.dl-color-slider.is-vertical.is-md .dl-color-slider__track { width: 13px; }
.dl-color-slider.is-vertical.is-lg .dl-color-slider__root { width: 36px; }.dl-color-slider.is-vertical.is-lg .dl-color-slider__track { width: 17px; }
.dl-color-slider.is-disabled { opacity: .46; }
</style>
