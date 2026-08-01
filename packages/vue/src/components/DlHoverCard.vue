<script setup lang="ts">
import { HoverCardArrow, HoverCardContent, HoverCardPortal, HoverCardRoot, HoverCardTrigger } from 'reka-ui'
import { useDlPopoverLayer } from '../composables/useDlLayer'

const props = withDefaults(defineProps<{
  openDelay?: number
  closeDelay?: number
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  zIndex?: number
}>(), { openDelay: 500, closeDelay: 250, side: 'bottom', align: 'center', zIndex: undefined })
const layer = useDlPopoverLayer(() => props.zIndex)
</script>

<template>
  <HoverCardRoot :open-delay="openDelay" :close-delay="closeDelay">
    <HoverCardTrigger as-child><slot name="trigger" /></HoverCardTrigger>
    <HoverCardPortal>
      <HoverCardContent data-dl data-slot="hover-card" data-dl-layer="popover" :side="side" :align="align" :side-offset="10" :style="{ zIndex: layer }" class="w-72 rounded-[var(--dl-radius-md)] border border-[var(--dl-border-strong)] [background:var(--dl-panel)] p-4 text-sm leading-6 text-[var(--dl-text-muted)] shadow-[0_24px_70px_rgba(0,0,0,.42)] outline-none backdrop-blur-2xl">
        <slot />
        <HoverCardArrow class="fill-[rgba(20,54,36,.95)]" />
      </HoverCardContent>
    </HoverCardPortal>
  </HoverCardRoot>
</template>
