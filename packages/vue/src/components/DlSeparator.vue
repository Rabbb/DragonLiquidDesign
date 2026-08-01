<script setup lang="ts">
import { Separator } from 'reka-ui'

withDefaults(defineProps<{
  orientation?: 'horizontal' | 'vertical'
  decorative?: boolean
  label?: string
}>(), {
  orientation: 'horizontal',
  decorative: true,
  label: undefined,
})
</script>

<template>
  <div
    v-if="label && orientation === 'horizontal'"
    data-dl
    data-slot="separator"
    class="flex w-full items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--dl-text-faint)]"
  >
    <Separator :decorative="decorative" class="h-px flex-1 bg-[var(--dl-border)]" />
    <span>{{ label }}</span>
    <Separator :decorative="decorative" class="h-px flex-1 bg-[var(--dl-border)]" />
  </div>
  <Separator
    v-else
    data-dl
    data-slot="separator"
    :orientation="orientation"
    :decorative="decorative"
    :class="orientation === 'horizontal' ? 'h-px w-full bg-[var(--dl-border)]' : 'h-full min-h-6 w-px bg-[var(--dl-border)]'"
  />
</template>
