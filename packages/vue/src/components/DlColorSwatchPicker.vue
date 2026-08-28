<script setup lang="ts">
import { ColorSwatchPickerItem, ColorSwatchPickerItemIndicator, ColorSwatchPickerItemSwatch, ColorSwatchPickerRoot } from 'reka-ui'
import { computed, useAttrs } from 'vue'
import { readableColorInk, resolveColorSwatches, type DlColorSwatchOption } from './color-controls'
import './color-controls.css'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  modelValue?: string | string[]
  colors: readonly (string | DlColorSwatchOption)[]
  multiple?: boolean
  disabled?: boolean
  name?: string
  showLabels?: boolean
  showValues?: boolean
  columns?: number
  size?: 'sm' | 'md' | 'lg'
  loop?: boolean
}>(), {
  modelValue: undefined,
  multiple: false,
  disabled: false,
  name: undefined,
  showLabels: false,
  showValues: false,
  columns: undefined,
  size: 'md',
  loop: true,
})

const emit = defineEmits<{ 'update:modelValue': [value: string | string[]] }>()
const attrs = useAttrs()
const options = computed(() => resolveColorSwatches(props.colors))
const rootAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
})
const gridStyle = computed(() => ({
  gridTemplateColumns: props.columns
    ? `repeat(${props.columns}, minmax(0, 1fr))`
    : props.showLabels
      ? 'repeat(auto-fill, minmax(145px, 1fr))'
      : `repeat(auto-fill, ${props.size === 'sm' ? '34px' : props.size === 'lg' ? '54px' : '44px'})`,
}))
</script>

<template>
  <ColorSwatchPickerRoot
    v-bind="rootAttrs"
    data-dl
    data-slot="color-swatch-picker"
    :model-value="modelValue"
    :multiple="multiple"
    :disabled="disabled"
    :name="name"
    :loop="loop"
    class="dl-color-swatch-picker"
    :class="[`is-${size}`, { 'show-labels': showLabels }, $attrs.class]"
    :style="[$attrs.style, gridStyle]"
    @update:model-value="emit('update:modelValue', $event as string | string[])"
  >
    <ColorSwatchPickerItem
      v-for="option in options"
      :key="option.value"
      :value="option.value"
      :disabled="disabled || option.disabled"
      class="dl-color-swatch-picker__item"
      :style="{ '--dl-swatch-ink': readableColorInk(option.value) }"
    >
      <span class="dl-color-swatch-picker__sample dl-color-checker">
        <i class="dl-color-swatch-picker__fill" aria-hidden="true" :style="{ backgroundColor: option.value }" />
        <ColorSwatchPickerItemSwatch class="dl-color-swatch-picker__semantic" />
        <ColorSwatchPickerItemIndicator class="dl-color-swatch-picker__indicator">✓</ColorSwatchPickerItemIndicator>
      </span>
      <span v-if="showLabels" class="dl-color-swatch-picker__copy">
        <b>{{ option.label }}</b>
        <small v-if="option.description || showValues">{{ option.description || option.value.toUpperCase() }}</small>
      </span>
    </ColorSwatchPickerItem>
  </ColorSwatchPickerRoot>
</template>

<style scoped>
.dl-color-swatch-picker { display: grid; align-items: stretch; gap: 8px; width: 100%; }
.dl-color-swatch-picker__item { position: relative; display: grid; place-items: center; min-width: 0; padding: 3px; border: 1px solid transparent; border-radius: var(--dl-radius-sm); outline: none; color: var(--dl-text); background: transparent; cursor: pointer; transition: border-color .14s ease, background .14s ease, box-shadow .14s ease, transform .14s ease; }
.dl-color-swatch-picker.show-labels .dl-color-swatch-picker__item { grid-template-columns: auto minmax(0,1fr); justify-content: start; gap: 9px; padding: 7px; text-align: left; }
.dl-color-swatch-picker__item:hover:not([data-disabled]) { border-color: var(--dl-border-strong); background: var(--dl-surface-hover); transform: translateY(-1px); }
.dl-color-swatch-picker__item[data-state="checked"] { border-color: var(--dl-accent-border); background: var(--dl-accent-surface); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--dl-accent) 10%, transparent); }
.dl-color-swatch-picker__item:focus-visible { box-shadow: var(--dl-focus); }
.dl-color-swatch-picker__item[data-disabled] { cursor: not-allowed; opacity: .36; }
.dl-color-swatch-picker__sample { position: relative; display: block; overflow: hidden; border: 1px solid var(--dl-border-strong); border-radius: 10px; }
.dl-color-swatch-picker.is-sm .dl-color-swatch-picker__sample { width: 28px; height: 28px; }
.dl-color-swatch-picker.is-md .dl-color-swatch-picker__sample { width: 38px; height: 38px; }
.dl-color-swatch-picker.is-lg .dl-color-swatch-picker__sample { width: 48px; height: 48px; }
.dl-color-swatch-picker__fill { position: absolute; inset: 0; }
.dl-color-swatch-picker__semantic { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); clip-path: inset(50%); white-space: nowrap; }
.dl-color-swatch-picker__indicator { position: absolute; inset: 0; display: grid; place-items: center; color: var(--dl-swatch-ink); font-size: .75rem; font-weight: 950; text-shadow: 0 1px 3px rgba(0,0,0,.22); }
.dl-color-swatch-picker__copy { display: grid; gap: 3px; min-width: 0; }
.dl-color-swatch-picker__copy b, .dl-color-swatch-picker__copy small { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dl-color-swatch-picker__copy b { font-size: .68rem; }
.dl-color-swatch-picker__copy small { color: var(--dl-text-faint); font: .53rem "Cascadia Code", Consolas, monospace; }
@media (prefers-reduced-motion: reduce) { .dl-color-swatch-picker__item { transition: none; } }
</style>
