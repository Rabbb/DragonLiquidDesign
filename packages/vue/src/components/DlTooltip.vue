<script setup lang="ts">
import { computed } from 'vue'
import { TooltipArrow, TooltipContent, TooltipPortal, TooltipProvider, TooltipRoot, TooltipTrigger } from 'reka-ui'
import { useDlTooltipLayer } from '../composables/useDlLayer'

const props = withDefaults(defineProps<{
  text?: string
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  delayDuration?: number
  skipDelayDuration?: number
  disabled?: boolean
  zIndex?: number
}>(), {
  text: '',
  side: 'top',
  align: 'center',
  delayDuration: 350,
  skipDelayDuration: 300,
  disabled: false,
  zIndex: undefined,
})
const contentZIndex = useDlTooltipLayer(() => props.zIndex)
const tooltipText = computed(() => props.text)
</script>

<template>
  <TooltipProvider :delay-duration="delayDuration" :skip-delay-duration="skipDelayDuration">
    <TooltipRoot :disabled="disabled">
      <TooltipTrigger as-child><slot /></TooltipTrigger>
      <TooltipPortal>
        <TooltipContent
          data-dl
          data-slot="tooltip-content"
          data-dl-layer="tooltip"
          :side="side"
          :align="align"
          :side-offset="8"
          :style="{ zIndex: contentZIndex }"
          class="max-w-72 rounded-[10px] border border-[var(--dl-border-strong)] bg-[rgba(7,19,13,.96)] px-3 py-2 text-xs leading-relaxed text-[var(--dl-text)] shadow-[0_16px_42px_rgba(0,0,0,.42),inset_0_1px_0_rgba(255,255,255,.08)] backdrop-blur-xl data-[state=delayed-open]:animate-in data-[state=closed]:animate-out"
        >
          <slot name="content">{{ tooltipText }}</slot>
          <TooltipArrow class="fill-[rgba(7,19,13,.96)]" />
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
</template>
