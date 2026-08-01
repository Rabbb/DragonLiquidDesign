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
  --dl-hover-card-border: rgba(255, 239, 186, 0.22);
  --dl-hover-card-arrow: rgba(11, 32, 28, 0.98);
  --dl-hover-card-glow: rgba(104, 225, 255, 0.1);
  --dl-hover-card-rail: linear-gradient(90deg, rgba(255, 215, 110, 0.26), rgba(104, 225, 255, 0.8), rgba(124, 255, 190, 0.24));
  position: relative;
  display: grid;
  width: min(22rem, calc(100vw - 2rem));
  padding: 17px;
  overflow: visible;
  isolation: isolate;
  border: 1px solid var(--dl-hover-card-border);
  border-radius: 24px;
  background:
    radial-gradient(circle at top left, rgba(255, 215, 110, 0.14), transparent 32%),
    radial-gradient(circle at top right, rgba(104, 225, 255, 0.12), transparent 38%),
    radial-gradient(circle at bottom left, rgba(50, 205, 50, 0.1), transparent 42%),
    linear-gradient(180deg, rgba(23, 58, 46, 0.98), rgba(12, 35, 28, 0.97) 56%, rgba(7, 18, 24, 0.98));
  color: var(--dl-text-muted);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.12),
    inset 0 0 0 1px rgba(255, 255, 255, 0.03),
    0 22px 46px rgba(4, 14, 12, 0.34),
    0 0 30px var(--dl-hover-card-glow);
  outline: none;
  backdrop-filter: blur(28px) saturate(132%);
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

.dl-hover-card__body > :first-child { color: #fff; }
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
