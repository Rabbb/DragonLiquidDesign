<script setup lang="ts">
import { ScrollAreaCorner, ScrollAreaRoot, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport } from 'reka-ui'

withDefaults(defineProps<{
  type?: 'auto' | 'always' | 'scroll' | 'hover'
  scrollHideDelay?: number
  horizontal?: boolean
}>(), { type: 'hover', scrollHideDelay: 600, horizontal: false })
</script>

<template>
  <ScrollAreaRoot data-dl data-slot="scroll-area" :type="type" :scroll-hide-delay="scrollHideDelay" class="relative overflow-hidden rounded-[var(--dl-radius-md)] border border-[var(--dl-border)] bg-[var(--dl-surface)]">
    <ScrollAreaViewport class="size-full rounded-[inherit]"><slot /></ScrollAreaViewport>
    <ScrollAreaScrollbar orientation="vertical" class="flex w-2.5 touch-none select-none p-0.5 transition data-[state=hidden]:opacity-0">
      <ScrollAreaThumb class="relative flex-1 rounded-full bg-amber-200/30 before:absolute before:left-1/2 before:top-1/2 before:size-full before:min-h-11 before:min-w-11 before:-translate-x-1/2 before:-translate-y-1/2" />
    </ScrollAreaScrollbar>
    <ScrollAreaScrollbar v-if="horizontal" orientation="horizontal" class="flex h-2.5 touch-none select-none p-0.5 transition data-[state=hidden]:opacity-0">
      <ScrollAreaThumb class="relative flex-1 rounded-full bg-amber-200/30" />
    </ScrollAreaScrollbar>
    <ScrollAreaCorner class="bg-[var(--dl-surface-strong)]" />
  </ScrollAreaRoot>
</template>
