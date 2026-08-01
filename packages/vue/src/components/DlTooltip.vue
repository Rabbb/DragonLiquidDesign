<script setup lang="ts">
import { computed } from 'vue'
import { TooltipArrow, TooltipContent, TooltipPortal, TooltipProvider, TooltipRoot, TooltipTrigger } from 'reka-ui'
import { useDlTooltipLayer } from '../composables/useDlLayer'
import type { DlTone } from '../types'
import { tooltipStyles } from './overlay.styles'

const props = withDefaults(defineProps<{
  open?: boolean
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
  open: undefined,
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
const emit = defineEmits<{ 'update:open': [value: boolean] }>()
const contentZIndex = useDlTooltipLayer(() => props.zIndex)
const tooltipText = computed(() => props.text)
const resolvedMaxWidth = computed(() => typeof props.maxWidth === 'number' ? `${props.maxWidth}px` : props.maxWidth)
</script>

<template>
  <TooltipProvider :delay-duration="delayDuration" :skip-delay-duration="skipDelayDuration">
    <TooltipRoot :open="open" :disabled="disabled" @update:open="emit('update:open', $event)">
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
.dl-tooltip { --dl-tooltip-bg: linear-gradient(180deg, rgba(18, 24, 31, 0.98), rgba(12, 18, 24, 0.96)); --dl-tooltip-arrow: rgba(12, 18, 24, 0.96); --dl-tooltip-text: #fff6d8; --dl-tooltip-border: rgba(255, 255, 255, 0.14); --dl-tooltip-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 14px 30px rgba(15, 23, 42, 0.28); --dl-tooltip-rail: linear-gradient(90deg, rgba(255, 223, 128, 0.24), rgba(104, 225, 255, 0.5), rgba(124, 255, 190, 0.16)); position: relative; display: inline-flex; min-width: max-content; max-width: min(280px, 70vw); padding: 10px 12px; overflow: visible; isolation: isolate; border: 1px solid var(--dl-tooltip-border); border-radius: 14px; background: var(--dl-tooltip-bg); color: var(--dl-tooltip-text); box-shadow: var(--dl-tooltip-shadow); backdrop-filter: blur(34px) saturate(176%) contrast(0.94); }
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
.dl-tone-default { --dl-tooltip-bg: radial-gradient(circle at 14% 8%, rgba(255, 223, 128, 0.08), transparent 42%), radial-gradient(circle at 92% 100%, rgba(104, 225, 255, 0.1), transparent 48%), linear-gradient(180deg, rgba(25, 31, 37, 0.98), rgba(17, 23, 29, 0.96)); --dl-tooltip-arrow: rgba(17, 23, 29, 0.98); --dl-tooltip-text: #fff6dc; --dl-tooltip-border: rgba(226, 232, 240, 0.16); --dl-tooltip-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 14px 30px rgba(10, 16, 22, 0.3); --dl-tooltip-rail: linear-gradient(90deg, rgba(255, 223, 128, 0.24), rgba(226, 232, 240, 0.52), rgba(104, 225, 255, 0.38), rgba(124, 255, 190, 0.16)); }
.dl-tone-accent { --dl-tooltip-bg: radial-gradient(circle at 16% 8%, rgba(255, 230, 150, 0.18), transparent 42%), radial-gradient(circle at 92% 100%, rgba(104, 225, 255, 0.12), transparent 46%), linear-gradient(180deg, rgba(33, 43, 35, 0.97), rgba(22, 31, 27, 0.95)); --dl-tooltip-arrow: rgba(22, 31, 27, 0.98); --dl-tooltip-text: #fff7dc; --dl-tooltip-border: rgba(255, 226, 142, 0.26); --dl-tooltip-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 14px 30px rgba(12, 24, 19, 0.3), 0 0 18px rgba(255, 220, 118, 0.08); --dl-tooltip-rail: linear-gradient(90deg, rgba(104, 225, 255, 0.38), rgba(255, 246, 210, 0.78), rgba(255, 215, 110, 0.62), rgba(124, 255, 190, 0.28)); }
.dl-tone-success { --dl-tooltip-bg: radial-gradient(circle at 16% 8%, rgba(124, 255, 190, 0.18), transparent 42%), radial-gradient(circle at 90% 100%, rgba(0, 206, 209, 0.12), transparent 48%), linear-gradient(180deg, rgba(17, 59, 44, 0.98), rgba(10, 40, 30, 0.96)); --dl-tooltip-arrow: rgba(10, 40, 30, 0.98); --dl-tooltip-text: #edfff6; --dl-tooltip-border: rgba(124, 255, 190, 0.26); --dl-tooltip-shadow: inset 0 1px 0 rgba(225, 255, 242, 0.1), 0 14px 30px rgba(5, 31, 23, 0.32), 0 0 18px rgba(80, 220, 166, 0.1); --dl-tooltip-rail: linear-gradient(90deg, rgba(80, 220, 166, 0.38), rgba(205, 255, 230, 0.72), rgba(0, 206, 209, 0.58), rgba(124, 255, 190, 0.28)); }
.dl-tone-warning { --dl-tooltip-bg: radial-gradient(circle at 72% 118%, rgba(255, 147, 20, 0.2), transparent 52%), linear-gradient(180deg, rgba(58, 41, 20, 0.98), rgba(38, 30, 20, 0.96)); --dl-tooltip-arrow: rgba(38, 30, 20, 0.98); --dl-tooltip-text: #fff2d6; --dl-tooltip-border: rgba(255, 193, 92, 0.3); --dl-tooltip-shadow: inset 0 1px 0 rgba(255, 244, 194, 0.1), 0 14px 30px rgba(34, 24, 12, 0.32), 0 0 16px rgba(255, 158, 24, 0.1); --dl-tooltip-rail: linear-gradient(90deg, rgba(148, 83, 12, 0.34), rgba(255, 166, 42, 0.7), rgba(255, 226, 126, 0.78), rgba(205, 111, 16, 0.48)); }
.dl-tone-danger { --dl-tooltip-bg: radial-gradient(circle at 16% 8%, rgba(255, 112, 128, 0.2), transparent 42%), radial-gradient(circle at 90% 100%, rgba(190, 72, 132, 0.1), transparent 48%), linear-gradient(180deg, rgba(76, 28, 38, 0.98), rgba(50, 19, 27, 0.96)); --dl-tooltip-arrow: rgba(50, 19, 27, 0.98); --dl-tooltip-text: #fff0f2; --dl-tooltip-border: rgba(255, 123, 139, 0.3); --dl-tooltip-shadow: inset 0 1px 0 rgba(255, 226, 232, 0.1), 0 14px 30px rgba(42, 10, 18, 0.34), 0 0 18px rgba(238, 78, 102, 0.11); --dl-tooltip-rail: linear-gradient(90deg, rgba(207, 54, 79, 0.42), rgba(255, 188, 198, 0.7), rgba(255, 93, 119, 0.62), rgba(190, 72, 132, 0.32)); }
.dl-tone-muted { --dl-tooltip-bg: radial-gradient(circle at 16% 8%, rgba(180, 196, 220, 0.1), transparent 44%), radial-gradient(circle at 92% 100%, rgba(104, 225, 255, 0.06), transparent 50%), linear-gradient(180deg, rgba(42, 49, 61, 0.97), rgba(29, 35, 45, 0.95)); --dl-tooltip-arrow: rgba(29, 35, 45, 0.98); --dl-tooltip-text: rgba(235, 241, 250, 0.84); --dl-tooltip-border: rgba(160, 176, 198, 0.18); --dl-tooltip-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 12px 26px rgba(15, 20, 28, 0.24); --dl-tooltip-rail: linear-gradient(90deg, rgba(148, 163, 184, 0.16), rgba(203, 213, 225, 0.34), rgba(104, 225, 255, 0.2), rgba(148, 163, 184, 0.12)); }
.dl-tooltip[data-state='delayed-open'], .dl-tooltip[data-state='instant-open'] { animation: dl-tooltip-in 160ms ease-out; }
.dl-tooltip[data-state='closed'] { animation: dl-tooltip-out 120ms ease-in; }
@keyframes dl-tooltip-in { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
@keyframes dl-tooltip-out { from { opacity: 1; } to { opacity: 0; transform: scale(0.97); } }
</style>
