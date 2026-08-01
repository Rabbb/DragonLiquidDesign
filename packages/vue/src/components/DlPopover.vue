<script setup lang="ts">
import { PopoverArrow, PopoverClose, PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'reka-ui'
import { useDlPopoverLayer } from '../composables/useDlLayer'
import type { DlTone } from '../types'
import { popoverStyles } from './overlay.styles'

const props = withDefaults(defineProps<{
  open?: boolean
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  modal?: boolean
  title?: string
  tone?: DlTone
  closeLabel?: string
  zIndex?: number
}>(), {
  open: undefined,
  side: 'bottom',
  align: 'center',
  modal: false,
  title: undefined,
  tone: 'default',
  closeLabel: '关闭',
  zIndex: undefined,
})
const emit = defineEmits<{ 'update:open': [value: boolean] }>()
const contentZIndex = useDlPopoverLayer(() => props.zIndex)
</script>

<template>
  <PopoverRoot :open="open" :modal="modal" @update:open="emit('update:open', $event)">
    <PopoverTrigger as-child>
      <slot name="trigger">
        <button type="button" class="rounded-xl border border-[var(--dl-border)] bg-[var(--dl-surface)] px-3 py-2 text-sm text-[var(--dl-text)]">打开</button>
      </slot>
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent
        data-dl
        data-slot="popover-content"
        data-dl-layer="popover"
        :side="side"
        :align="align"
        :side-offset="10"
        :style="{ zIndex: contentZIndex }"
        :class="popoverStyles({ tone })"
      >
        <div class="dl-popover__aura" aria-hidden="true" />
        <div v-if="title || $slots.title" class="dl-popover__header">
          <h3 class="dl-popover__title"><slot name="title">{{ title }}</slot></h3>
          <PopoverClose class="dl-popover__close" :aria-label="closeLabel">×</PopoverClose>
        </div>
        <div class="dl-popover__body"><slot /></div>
        <PopoverArrow class="dl-popover__arrow" />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>

<style>
.dl-popover { --dl-popover-border: rgba(255, 239, 186, 0.22); --dl-popover-rail: linear-gradient(90deg, rgba(255, 215, 110, 0.2), rgba(104, 225, 255, 0.68), rgba(124, 255, 190, 0.18)); --dl-popover-rail-vertical: linear-gradient(180deg, rgba(255, 215, 110, 0.2), rgba(104, 225, 255, 0.68), rgba(124, 255, 190, 0.18)); --dl-popover-glow: rgba(104, 225, 255, 0.08); --dl-popover-arrow: rgba(11, 32, 28, 0.98); position: relative; display: grid; gap: 16px; width: min(22rem, calc(100vw - 2rem)); padding: 16px; overflow: visible; isolation: isolate; border: 1px solid var(--dl-popover-border); border-radius: 24px; background: radial-gradient(circle at top left, rgba(255, 215, 110, 0.14), transparent 32%), radial-gradient(circle at top right, rgba(104, 225, 255, 0.12), transparent 38%), radial-gradient(circle at bottom left, rgba(50, 205, 50, 0.1), transparent 42%), linear-gradient(180deg, rgba(23, 58, 46, 0.98), rgba(12, 35, 28, 0.97) 56%, rgba(7, 18, 24, 0.98)); color: var(--dl-text-muted); box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12), inset 0 0 0 1px rgba(255, 255, 255, 0.03), 0 22px 46px rgba(4, 14, 12, 0.34), 0 0 28px var(--dl-popover-glow); outline: none; backdrop-filter: blur(28px) saturate(132%); }
.dl-popover::before { content: ''; position: absolute; inset: 1px; z-index: -1; border-radius: inherit; background: linear-gradient(135deg, rgba(255, 255, 255, 0.14), transparent 18%, transparent 70%, rgba(255, 255, 255, 0.05)); opacity: 0.88; pointer-events: none; }
.dl-popover::after { content: ''; position: absolute; z-index: 1; border-radius: 999px; background: var(--dl-popover-rail); box-shadow: 0 0 10px var(--dl-popover-glow), 0 0 18px rgba(255, 215, 110, 0.14); opacity: 0.9; pointer-events: none; }
.dl-popover[data-side='top']::after { inset: 2px 28px auto; height: 4px; }
.dl-popover[data-side='bottom']::after { inset: auto 28px 2px; height: 4px; }
.dl-popover[data-side='left']::after { inset: 28px auto 28px 2px; width: 4px; background: var(--dl-popover-rail-vertical); }
.dl-popover[data-side='right']::after { inset: 28px 2px 28px auto; width: 4px; background: var(--dl-popover-rail-vertical); }
.dl-popover__aura { position: absolute; inset: 1px; z-index: -1; border: 1px solid rgba(255, 239, 186, 0.08); border-radius: inherit; background: linear-gradient(120deg, rgba(255, 255, 255, 0.02), rgba(255, 223, 128, 0.03), rgba(113, 209, 173, 0.03), rgba(255, 255, 255, 0.02)); pointer-events: none; }
.dl-popover__header { position: relative; z-index: 2; display: flex; align-items: flex-start; justify-content: space-between; gap: 14px; }
.dl-popover__title { margin: 0; color: #fff; font-size: 0.98rem; font-weight: 800; line-height: 1.38; }
.dl-popover__body { position: relative; z-index: 2; min-width: 0; font-size: 0.84rem; line-height: 1.65; }
.dl-popover__close { flex: 0 0 auto; display: grid; place-items: center; width: 30px; height: 30px; padding: 0; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 13px; background: rgba(255, 255, 255, 0.06); color: var(--dl-text-faint); cursor: pointer; outline: none; transition: 0.18s ease; }
.dl-popover__close:hover { transform: translateY(-1px); background: rgba(255, 255, 255, 0.12); color: var(--dl-text); }
.dl-popover__close:focus-visible, .dl-popover:focus-visible { box-shadow: var(--dl-focus); }
.dl-popover__arrow { fill: var(--dl-popover-arrow); stroke: var(--dl-popover-border); filter: drop-shadow(0 10px 18px rgba(4, 14, 12, 0.22)); }
.dl-tone-accent { --dl-popover-border: rgba(255, 223, 128, 0.34); --dl-popover-rail: linear-gradient(90deg, rgba(104, 225, 255, 0.2), rgba(255, 215, 110, 0.8), rgba(104, 225, 255, 0.26)); --dl-popover-rail-vertical: linear-gradient(180deg, rgba(104, 225, 255, 0.2), rgba(255, 215, 110, 0.8), rgba(104, 225, 255, 0.26)); --dl-popover-glow: rgba(255, 215, 110, 0.14); }
.dl-tone-success { --dl-popover-border: rgba(113, 209, 173, 0.34); --dl-popover-rail: linear-gradient(90deg, rgba(124, 255, 190, 0.24), rgba(0, 206, 209, 0.72), rgba(124, 255, 190, 0.2)); --dl-popover-rail-vertical: linear-gradient(180deg, rgba(124, 255, 190, 0.24), rgba(0, 206, 209, 0.72), rgba(124, 255, 190, 0.2)); --dl-popover-glow: rgba(124, 255, 190, 0.14); }
.dl-tone-warning { --dl-popover-border: rgba(255, 179, 71, 0.34); --dl-popover-rail: linear-gradient(90deg, rgba(255, 178, 89, 0.3), rgba(255, 215, 110, 0.78), rgba(255, 178, 89, 0.24)); --dl-popover-rail-vertical: linear-gradient(180deg, rgba(255, 178, 89, 0.3), rgba(255, 215, 110, 0.78), rgba(255, 178, 89, 0.24)); --dl-popover-glow: rgba(255, 178, 89, 0.16); }
.dl-tone-danger { --dl-popover-border: rgba(255, 123, 123, 0.34); --dl-popover-rail: linear-gradient(90deg, rgba(255, 112, 112, 0.28), rgba(255, 140, 0, 0.72), rgba(255, 112, 112, 0.24)); --dl-popover-rail-vertical: linear-gradient(180deg, rgba(255, 112, 112, 0.28), rgba(255, 140, 0, 0.72), rgba(255, 112, 112, 0.24)); --dl-popover-glow: rgba(255, 112, 112, 0.16); }
.dl-tone-muted { --dl-popover-border: rgba(116, 134, 160, 0.28); --dl-popover-rail: linear-gradient(90deg, rgba(148, 163, 184, 0.22), rgba(104, 225, 255, 0.3), rgba(148, 163, 184, 0.18)); --dl-popover-rail-vertical: linear-gradient(180deg, rgba(148, 163, 184, 0.22), rgba(104, 225, 255, 0.3), rgba(148, 163, 184, 0.18)); --dl-popover-glow: rgba(148, 163, 184, 0.12); }
.dl-popover[data-state='open'] { animation: dl-popover-in 190ms cubic-bezier(0.16, 1, 0.3, 1); }
.dl-popover[data-state='closed'] { animation: dl-popover-out 140ms ease-in; }
@keyframes dl-popover-in { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
@keyframes dl-popover-out { from { opacity: 1; } to { opacity: 0; transform: scale(0.97); } }
</style>
