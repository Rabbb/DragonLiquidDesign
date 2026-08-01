<script setup lang="ts">
import { computed } from 'vue'
import { TooltipArrow, TooltipContent, TooltipPortal, TooltipProvider, TooltipRoot, TooltipTrigger } from 'reka-ui'
import { useDlTooltipLayer } from '../composables/useDlLayer'
import type { DlTone } from '../types'
import { tooltipStyles } from './overlay.styles'

const props = withDefaults(defineProps<{
  text?: string
  title?: string
  tone?: DlTone
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  delayDuration?: number
  skipDelayDuration?: number
  disabled?: boolean
  maxWidth?: number | string
  zIndex?: number
}>(), {
  text: '',
  title: undefined,
  tone: 'default',
  side: 'top',
  align: 'center',
  delayDuration: 350,
  skipDelayDuration: 300,
  disabled: false,
  maxWidth: 280,
  zIndex: undefined,
})
const contentZIndex = useDlTooltipLayer(() => props.zIndex)
const tooltipText = computed(() => props.text)
const resolvedMaxWidth = computed(() => typeof props.maxWidth === 'number' ? `${props.maxWidth}px` : props.maxWidth)
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
          :style="{ zIndex: contentZIndex, maxWidth: resolvedMaxWidth }"
          :class="tooltipStyles({ tone })"
        >
          <span class="dl-tooltip__body">
            <strong v-if="title || $slots.title" class="dl-tooltip__title"><slot name="title">{{ title }}</slot></strong>
            <span class="dl-tooltip__content"><slot name="content">{{ tooltipText }}</slot></span>
          </span>
          <TooltipArrow class="dl-tooltip__arrow" />
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
</template>

<style>
.dl-tooltip { --dl-tooltip-bg: linear-gradient(180deg, rgba(18, 24, 31, 0.98), rgba(12, 18, 24, 0.96)); --dl-tooltip-arrow: rgba(12, 18, 24, 0.96); --dl-tooltip-text: #fff6d8; --dl-tooltip-rail: linear-gradient(90deg, rgba(255, 223, 128, 0.24), rgba(104, 225, 255, 0.5), rgba(124, 255, 190, 0.16)); position: relative; display: inline-flex; min-width: max-content; max-width: min(280px, 70vw); padding: 10px 12px; overflow: visible; isolation: isolate; border: 1px solid rgba(255, 255, 255, 0.14); border-radius: 14px; background: var(--dl-tooltip-bg); color: var(--dl-tooltip-text); box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 14px 30px rgba(15, 23, 42, 0.28); backdrop-filter: blur(34px) saturate(176%) contrast(0.94); }
.dl-tooltip::before { content: ''; position: absolute; inset: 1px; z-index: -1; border-radius: inherit; background: linear-gradient(135deg, rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.06) 48%, rgba(255, 255, 255, 0.02)); pointer-events: none; opacity: 0.86; }
.dl-tooltip::after { content: ''; position: absolute; z-index: 1; background: var(--dl-tooltip-rail); pointer-events: none; opacity: 0.96; }
.dl-tooltip[data-side='top']::after { inset: 0 14px auto; height: 2px; border-radius: 999px 999px 0 0; }
.dl-tooltip[data-side='bottom']::after { inset: auto 14px 0; height: 2px; border-radius: 0 0 999px 999px; }
.dl-tooltip[data-side='left']::after { inset: 14px auto 14px 1px; width: 2px; border-radius: 999px 0 0 999px; }
.dl-tooltip[data-side='right']::after { inset: 14px 1px 14px auto; width: 2px; border-radius: 0 999px 999px 0; }
.dl-tooltip__body { position: relative; z-index: 2; display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.dl-tooltip__title { color: inherit; font-size: 0.78rem; font-weight: 700; line-height: 1.3; }
.dl-tooltip__content { font-size: 0.82rem; line-height: 1.45; }
.dl-tooltip__arrow { fill: var(--dl-tooltip-arrow); stroke: rgba(255, 255, 255, 0.14); filter: drop-shadow(0 8px 14px rgba(15, 23, 42, 0.24)); }
.dl-tone-accent { --dl-tooltip-bg: linear-gradient(180deg, rgba(97, 62, 8, 0.95), rgba(72, 44, 4, 0.91)); --dl-tooltip-arrow: rgba(72, 44, 4, 0.96); --dl-tooltip-text: #fff8dc; --dl-tooltip-rail: linear-gradient(90deg, rgba(104, 225, 255, 0.2), rgba(255, 215, 110, 0.72), rgba(104, 225, 255, 0.26)); }
.dl-tone-success { --dl-tooltip-bg: linear-gradient(180deg, rgba(12, 74, 52, 0.95), rgba(8, 54, 37, 0.91)); --dl-tooltip-arrow: rgba(8, 54, 37, 0.96); --dl-tooltip-text: #ebfff5; --dl-tooltip-rail: linear-gradient(90deg, rgba(124, 255, 190, 0.24), rgba(0, 206, 209, 0.64), rgba(124, 255, 190, 0.2)); }
.dl-tone-warning { --dl-tooltip-bg: linear-gradient(180deg, rgba(106, 62, 6, 0.95), rgba(78, 45, 4, 0.91)); --dl-tooltip-arrow: rgba(78, 45, 4, 0.96); --dl-tooltip-text: #fff2db; --dl-tooltip-rail: linear-gradient(90deg, rgba(255, 178, 89, 0.28), rgba(255, 215, 110, 0.72), rgba(255, 178, 89, 0.22)); }
.dl-tone-danger { --dl-tooltip-bg: linear-gradient(180deg, rgba(94, 24, 32, 0.95), rgba(68, 17, 23, 0.91)); --dl-tooltip-arrow: rgba(68, 17, 23, 0.96); --dl-tooltip-text: #fff0f0; --dl-tooltip-rail: linear-gradient(90deg, rgba(255, 112, 112, 0.26), rgba(255, 140, 0, 0.68), rgba(255, 112, 112, 0.24)); }
.dl-tone-muted { --dl-tooltip-bg: linear-gradient(180deg, rgba(49, 57, 74, 0.95), rgba(35, 41, 55, 0.91)); --dl-tooltip-arrow: rgba(35, 41, 55, 0.96); --dl-tooltip-text: rgba(233, 240, 255, 0.88); --dl-tooltip-rail: linear-gradient(90deg, rgba(148, 163, 184, 0.22), rgba(104, 225, 255, 0.26), rgba(148, 163, 184, 0.18)); }
.dl-tooltip[data-state='delayed-open'], .dl-tooltip[data-state='instant-open'] { animation: dl-tooltip-in 160ms ease-out; }
.dl-tooltip[data-state='closed'] { animation: dl-tooltip-out 120ms ease-in; }
@keyframes dl-tooltip-in { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
@keyframes dl-tooltip-out { from { opacity: 1; } to { opacity: 0; transform: scale(0.97); } }
</style>
