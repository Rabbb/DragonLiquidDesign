<script setup lang="ts">
import { computed } from 'vue'
import { AvatarFallback, AvatarImage, AvatarRoot } from 'reka-ui'
import { tv } from 'tailwind-variants'
import type { DlSize } from '../types'

const props = withDefaults(defineProps<{
  src?: string
  alt?: string
  fallback?: string
  size?: DlSize
  shape?: 'circle' | 'rounded'
  delayMs?: number
}>(), {
  src: undefined,
  alt: '',
  fallback: '?',
  size: 'md',
  shape: 'circle',
  delayMs: 0,
})
const avatar = tv({
  slots: {
    root: 'inline-flex shrink-0 select-none items-center justify-center overflow-hidden border border-[var(--dl-border-strong)] bg-[var(--dl-surface-strong)] shadow-[inset_0_1px_0_rgba(255,255,255,.1),0_8px_22px_rgba(0,0,0,.22)]',
    image: 'size-full object-cover',
    fallback: 'grid size-full place-items-center bg-[radial-gradient(circle_at_30%_20%,rgba(255,215,0,.24),transparent_45%),linear-gradient(145deg,rgba(50,205,50,.2),rgba(13,40,24,.8))] font-black text-amber-100',
  },
  variants: {
    size: { sm: { root: 'size-8', fallback: 'text-xs' }, md: { root: 'size-11', fallback: 'text-sm' }, lg: { root: 'size-16', fallback: 'text-lg' } },
    shape: { circle: { root: 'rounded-full' }, rounded: { root: 'rounded-[var(--dl-radius-sm)]' } },
  },
})
const classes = computed(() => avatar({ size: props.size, shape: props.shape }))
</script>

<template>
  <AvatarRoot data-dl data-slot="avatar" :class="classes.root()">
    <AvatarImage v-if="src" :src="src" :alt="alt" :class="classes.image()" />
    <AvatarFallback :delay-ms="delayMs" :class="classes.fallback()"><slot>{{ fallback }}</slot></AvatarFallback>
  </AvatarRoot>
</template>
