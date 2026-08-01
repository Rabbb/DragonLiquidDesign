<script setup lang="ts">
import { ColorSwatch } from 'reka-ui'
import type { DlSize } from '../types'

withDefaults(defineProps<{ color?: string; label?: string; size?: DlSize; shape?: 'circle' | 'rounded' }>(), { color: '#ff8c00', label: undefined, size: 'md', shape: 'rounded' })
</script>

<template>
  <ColorSwatch data-dl data-slot="color-swatch" :color="color" :label="label" :class="['inline-block border border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,.2),0_7px_18px_rgba(0,0,0,.25)]', size === 'sm' ? 'size-7' : size === 'lg' ? 'size-14' : 'size-10', shape === 'circle' ? 'rounded-full' : 'rounded-[var(--dl-radius-sm)]']" />
</template>
