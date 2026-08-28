<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  as?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  gutter?: 'none' | 'sm' | 'md' | 'lg'
}>(), { as: 'div', size: 'lg', gutter: 'md' })

const maxWidth = computed(() => ({ sm: '720px', md: '960px', lg: '1200px', xl: '1440px', full: 'none' })[props.size])
const padding = computed(() => ({ none: '0px', sm: '12px', md: '24px', lg: '40px' })[props.gutter])
</script>

<template>
  <component :is="as" data-dl data-slot="container" :style="{ '--dl-container-width': maxWidth, '--dl-container-gutter': padding }" class="mx-auto w-full max-w-[var(--dl-container-width)] px-[var(--dl-container-gutter)]">
    <slot />
  </component>
</template>
