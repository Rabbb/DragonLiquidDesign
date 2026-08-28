<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{ as?: string; gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'; align?: 'stretch' | 'start' | 'center' | 'end' }>(), { as: 'div', gap: 'md', align: 'stretch' })
const gapValue = computed(() => ({ none: '0px', xs: '6px', sm: '12px', md: '20px', lg: '32px', xl: '52px' })[props.gap])
const alignValue = computed(() => ({ stretch: 'stretch', start: 'flex-start', center: 'center', end: 'flex-end' })[props.align])
</script>

<template>
  <component :is="as" data-dl data-slot="stack" :style="{ '--dl-stack-gap': gapValue, alignItems: alignValue }" class="flex flex-col gap-[var(--dl-stack-gap)]"><slot /></component>
</template>
