<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  as?: string
  minItemWidth?: string
  columns?: number
  gap?: 'xs' | 'sm' | 'md' | 'lg'
  dense?: boolean
}>(), { as: 'div', minItemWidth: '240px', columns: 0, gap: 'md', dense: false })
const gapValue = computed(() => ({ xs: '8px', sm: '14px', md: '22px', lg: '34px' })[props.gap])
const template = computed(() => props.columns > 0 ? `repeat(${Math.min(12, Math.max(1, props.columns))}, minmax(0, 1fr))` : `repeat(auto-fit, minmax(min(100%, ${props.minItemWidth}), 1fr))`)
</script>

<template>
  <component :is="as" data-dl data-slot="grid" :style="{ '--dl-grid-gap': gapValue, '--dl-grid-template': template }" :class="['grid grid-cols-[var(--dl-grid-template)] gap-[var(--dl-grid-gap)]', dense && '[grid-auto-flow:dense]']"><slot /></component>
</template>
