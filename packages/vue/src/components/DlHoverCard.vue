<script setup lang="ts">
import { HoverCardArrow, HoverCardContent, HoverCardPortal, HoverCardRoot, HoverCardTrigger } from 'reka-ui'
import { useDlPopoverLayer } from '../composables/useDlLayer'

const props = withDefaults(defineProps<{
  open?: boolean
  openDelay?: number
  closeDelay?: number
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  zIndex?: number
}>(), { open: undefined, openDelay: 500, closeDelay: 250, side: 'bottom', align: 'center', zIndex: undefined })
const emit = defineEmits<{ 'update:open': [value: boolean] }>()
const layer = useDlPopoverLayer(() => props.zIndex)
</script>

<template>
  <HoverCardRoot :open="open" :open-delay="openDelay" :close-delay="closeDelay" @update:open="emit('update:open', $event)">
    <HoverCardTrigger as-child><slot name="trigger" /></HoverCardTrigger>
    <HoverCardPortal>
      <HoverCardContent
        data-dl
        data-slot="hover-card"
        data-dl-layer="popover"
        :side="side"
        :align="align"
        :side-offset="12"
        :style="{ zIndex: layer }"
        class="dl-hover-card"
      >
        <span class="dl-hover-card__aura" aria-hidden="true" />
        <span class="dl-hover-card__sigils" aria-hidden="true"><i /><i /><i /></span>
        <div class="dl-hover-card__body"><slot /></div>
        <HoverCardArrow class="dl-hover-card__arrow" />
      </HoverCardContent>
    </HoverCardPortal>
  </HoverCardRoot>
</template>

<style>
.dl-hover-card {
  --dl-hover-card-border: rgba(15, 23, 42, 0.14);
  --dl-hover-card-arrow: var(--dl-surface-solid);
  --dl-hover-card-glow: rgba(15, 23, 42, 0.035);
  --dl-hover-card-rail: linear-gradient(90deg, rgba(164, 105, 11, 0.12), rgba(148, 163, 184, 0.38), rgba(71, 85, 105, 0.08));
  position: relative;
  display: grid;
  width: min(22rem, calc(100vw - 2rem));
  padding: 17px;
  overflow: visible;
  isolation: isolate;
  border: 1px solid var(--dl-hover-card-border);
  border-radius: 24px;
  background: var(--dl-panel);
  color: var(--dl-text-muted);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    0 18px 42px rgba(15, 23, 42, 0.14),
    0 0 30px var(--dl-hover-card-glow);
  outline: none;
  backdrop-filter: blur(24px) saturate(104%);
}

.dl-hover-card::before {
  content: '';
  position: absolute;
  inset: 1px;
  z-index: -1;
  border-radius: inherit;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.14), transparent 18%, transparent 70%, rgba(255, 255, 255, 0.05));
  opacity: 0.88;
  pointer-events: none;
}

.dl-hover-card::after {
  content: '';
  position: absolute;
  z-index: 1;
  border-radius: 999px;
  background: var(--dl-hover-card-rail);
  box-shadow: 0 0 10px var(--dl-hover-card-glow), 0 0 18px rgba(255, 215, 110, 0.14);
  opacity: 0.92;
  pointer-events: none;
}

.dl-hover-card[data-side='top']::after { inset: 2px 28px auto; height: 3px; }
.dl-hover-card[data-side='bottom']::after { inset: auto 28px 2px; height: 3px; }
.dl-hover-card[data-side='left']::after { inset: 28px 2px 28px auto; width: 3px; }
.dl-hover-card[data-side='right']::after { inset: 28px auto 28px 2px; width: 3px; }

.dl-hover-card__aura {
  position: absolute;
  inset: 1px;
  z-index: -1;
  border: 1px solid rgba(255, 239, 186, 0.08);
  border-radius: inherit;
  background: linear-gradient(120deg, rgba(255, 255, 255, 0.02), rgba(255, 223, 128, 0.03), rgba(113, 209, 173, 0.03), rgba(255, 255, 255, 0.02));
  pointer-events: none;
}

.dl-hover-card__sigils {
  position: absolute;
  top: 11px;
  right: 15px;
  z-index: 2;
  display: inline-flex;
  gap: 6px;
  pointer-events: none;
}

.dl-hover-card__sigils i {
  width: 5px;
  height: 5px;
  border-radius: 999px;
  background: rgba(219, 252, 255, 0.62);
  box-shadow: 0 0 10px rgba(104, 225, 255, 0.3);
}

.dl-hover-card__body {
  position: relative;
  z-index: 2;
  display: grid;
  gap: 9px;
  min-width: 0;
  font-size: 0.86rem;
  line-height: 1.65;
}

.dl-hover-card__body > :first-child { color: var(--dl-text); }
.dl-hover-card__body p { margin: 0; }

.dl-hover-card__arrow {
  fill: var(--dl-hover-card-arrow);
  stroke: var(--dl-hover-card-border);
  filter: drop-shadow(0 9px 16px rgba(4, 14, 12, 0.24));
}

.dl-hover-card:focus-visible {
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.12),
    0 22px 46px rgba(4, 14, 12, 0.34),
    0 0 30px var(--dl-hover-card-glow),
    var(--dl-focus);
}

.dl-hover-card[data-state='open'] { animation: dl-hover-card-in 190ms cubic-bezier(0.16, 1, 0.3, 1); }
.dl-hover-card[data-state='closed'] { animation: dl-hover-card-out 140ms ease-in; }

@keyframes dl-hover-card-in {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes dl-hover-card-out {
  from { opacity: 1; transform: scale(1); }
  to { opacity: 0; transform: scale(0.97); }
}

@media (max-width: 640px) {
  .dl-hover-card { width: min(21rem, calc(100vw - 1.5rem)); padding: 15px; border-radius: 20px; }
}
</style>
