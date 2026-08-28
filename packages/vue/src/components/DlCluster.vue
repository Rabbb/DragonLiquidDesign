<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  as?: string
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg'
  align?: 'start' | 'center' | 'end' | 'baseline' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around'
  wrap?: boolean
}>(), { as: 'div', gap: 'sm', align: 'center', justify: 'start', wrap: true })
const gapValue = computed(() => ({ none: '0px', xs: '6px', sm: '12px', md: '20px', lg: '32px' })[props.gap])
const justifyClass = computed(() => ({ start: 'justify-start', center: 'justify-center', end: 'justify-end', between: 'justify-between', around: 'justify-around' })[props.justify])
const alignValue = computed(() => ({ start: 'flex-start', center: 'center', end: 'flex-end', baseline: 'baseline', stretch: 'stretch' })[props.align])
</script>

<template>
  <component :is="as" data-dl data-slot="cluster" :style="{ '--dl-cluster-gap': gapValue, alignItems: alignValue }" :class="['flex gap-[var(--dl-cluster-gap)]', justifyClass, wrap && 'flex-wrap']"><slot /></component>
</template>
