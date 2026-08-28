<script setup lang="ts">
import { ColorSwatch } from 'reka-ui'
import { computed } from 'vue'
import type { DlSize } from '../types'
import { safeColorValue } from './color-controls'
import './color-controls.css'

const props = withDefaults(defineProps<{
  color?: string
  label?: string
  description?: string
  size?: DlSize
  shape?: 'circle' | 'rounded' | 'square'
  labelPosition?: 'hidden' | 'right' | 'bottom'
  showValue?: boolean
}>(), {
  color: '#ff8c00',
  label: undefined,
  description: undefined,
  size: 'md',
  shape: 'rounded',
  labelPosition: 'hidden',
  showValue: false,
})

const normalizedValue = computed(() => safeColorValue(props.color).toUpperCase())
const accessibleLabel = computed(() => props.label ?? normalizedValue.value)
</script>

<template>
  <span
    data-dl
    data-slot="color-swatch"
    class="dl-color-swatch"
    :class="[`is-${size}`, `is-${shape}`, `label-${labelPosition}`]"
  >
    <span class="dl-color-swatch__sample dl-color-checker">
      <i class="dl-color-swatch__fill" aria-hidden="true" :style="{ backgroundColor: color }" />
      <ColorSwatch class="dl-color-swatch__semantic" :color="color" :label="accessibleLabel" />
    </span>
    <span v-if="labelPosition !== 'hidden'" class="dl-color-swatch__copy">
      <b>{{ accessibleLabel }}</b>
      <small v-if="description || showValue">{{ description || normalizedValue }}</small>
    </span>
  </span>
</template>

<style scoped>
.dl-color-swatch { display: inline-flex; align-items: center; gap: 10px; min-width: 0; color: var(--dl-text); vertical-align: middle; }
.dl-color-swatch.label-bottom { align-items: flex-start; flex-direction: column; gap: 7px; }
.dl-color-swatch__sample { position: relative; display: inline-block; flex: 0 0 auto; overflow: hidden; border: 1px solid var(--dl-border-strong); box-shadow: inset 0 1px 0 rgba(255,255,255,.2), 0 5px 14px color-mix(in srgb, var(--dl-night) 20%, transparent); }
.dl-color-swatch__fill { position: absolute; inset: 0; }
.dl-color-swatch__semantic { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); clip-path: inset(50%); white-space: nowrap; }
.dl-color-swatch.is-sm .dl-color-swatch__sample { width: 28px; height: 28px; }
.dl-color-swatch.is-md .dl-color-swatch__sample { width: 40px; height: 40px; }
.dl-color-swatch.is-lg .dl-color-swatch__sample { width: 56px; height: 56px; }
.dl-color-swatch.is-circle .dl-color-swatch__sample, .dl-color-swatch.is-circle .dl-color-swatch__fill { border-radius: 999px; }
.dl-color-swatch.is-rounded .dl-color-swatch__sample, .dl-color-swatch.is-rounded .dl-color-swatch__fill { border-radius: var(--dl-radius-sm); }
.dl-color-swatch.is-square .dl-color-swatch__sample, .dl-color-swatch.is-square .dl-color-swatch__fill { border-radius: 4px; }
.dl-color-swatch__copy { display: grid; gap: 4px; min-width: 0; }
.dl-color-swatch__copy b, .dl-color-swatch__copy small { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dl-color-swatch__copy b { font-size: .7rem; }
.dl-color-swatch__copy small { color: var(--dl-text-faint); font: .56rem "Cascadia Code", Consolas, monospace; }
</style>
