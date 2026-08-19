<script setup lang="ts">
import { computed } from 'vue'
import { PopoverArrow, PopoverClose, PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'reka-ui'
import { useDlPopoverLayer } from '../composables/useDlLayer'
import { DlOverlaySide, type DlOverlayBaseSide, type DlPopoverTone } from '../types'
import { popoverStyles, resolveDlOverlayPlacement } from './overlay.styles'

const props = withDefaults(defineProps<{
  open?: boolean
  side?: DlOverlaySide | DlOverlayBaseSide
  align?: 'start' | 'center' | 'end'
  modal?: boolean
  title?: string
  tone?: DlPopoverTone
  closeLabel?: string
  arrow?: boolean
  sideOffset?: number
  contentClass?: string
  zIndex?: number
}>(), {
  open: undefined,
  side: DlOverlaySide.Bottom,
  align: 'center',
  modal: false,
  title: undefined,
  tone: 'default',
  closeLabel: '关闭',
  arrow: true,
  sideOffset: undefined,
  contentClass: undefined,
  zIndex: undefined,
})
const emit = defineEmits<{ 'update:open': [value: boolean] }>()
const contentZIndex = useDlPopoverLayer(() => props.zIndex)
const resolvedSideOffset = computed(() => props.sideOffset ?? (props.arrow ? 6 : 0))
const resolvedPlacement = computed(() => resolveDlOverlayPlacement(props.side, props.align))
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
        :data-arrow="arrow ? 'visible' : 'hidden'"
        :data-side-offset="resolvedSideOffset"
        :side="resolvedPlacement[0]"
        :align="resolvedPlacement[1]"
        :side-offset="resolvedSideOffset"
        :style="{ zIndex: contentZIndex }"
        :class="[popoverStyles({ tone }), contentClass]"
      >
        <div class="dl-popover__aura" aria-hidden="true" />
        <div v-if="title || $slots.title" class="dl-popover__header">
          <h3 class="dl-popover__title"><slot name="title">{{ title }}</slot></h3>
          <PopoverClose class="dl-popover__close" :aria-label="closeLabel">×</PopoverClose>
        </div>
        <div class="dl-popover__body"><slot /></div>
        <PopoverArrow v-if="arrow" as-child>
          <span class="dl-popover__arrow" aria-hidden="true" />
        </PopoverArrow>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>

<style>
.dl-popover { --dl-popover-border: var(--dl-border); --dl-popover-rail: linear-gradient(90deg, var(--dl-accent-surface), var(--dl-border-strong), transparent); --dl-popover-rail-vertical: linear-gradient(180deg, var(--dl-accent-surface), var(--dl-border-strong), transparent); --dl-popover-glow: var(--dl-accent-surface); --dl-popover-arrow: var(--dl-surface-solid); position: relative; display: grid; gap: 16px; width: min(22rem, calc(100vw - 2rem)); padding: 16px; overflow: visible; isolation: isolate; border: 1px solid var(--dl-popover-border); border-radius: 20px; background: var(--dl-surface-solid); color: var(--dl-text-muted); box-shadow: var(--dl-shadow), 0 0 20px var(--dl-popover-glow); outline: none; backdrop-filter: blur(20px) saturate(104%); }
.dl-popover::before { content: ''; position: absolute; inset: 1px; z-index: -1; border-radius: inherit; background: linear-gradient(180deg, rgba(255, 255, 255, 0.045), transparent 32%); pointer-events: none; }
.dl-popover::after { content: ''; position: absolute; z-index: 1; background: var(--dl-popover-rail); box-shadow: 0 0 5px var(--dl-popover-glow); -webkit-mask: var(--dl-popover-rail-mask); mask: var(--dl-popover-rail-mask); opacity: 0.72; pointer-events: none; }
.dl-popover[data-side='top']::after { --dl-popover-rail-mask: linear-gradient(#000 0 0) top/100% 1px no-repeat, radial-gradient(ellipse 50% 100% at 50% 0, #000 94%, transparent 100%) top/100% 100% no-repeat; inset: 0 30px auto; height: 5px; }
.dl-popover[data-side='bottom']::after { --dl-popover-rail-mask: linear-gradient(#000 0 0) bottom/100% 1px no-repeat, radial-gradient(ellipse 50% 100% at 50% 100%, #000 94%, transparent 100%) bottom/100% 100% no-repeat; inset: auto 30px 0; height: 5px; }
.dl-popover[data-side='left']::after { --dl-popover-rail-mask: linear-gradient(#000 0 0) left/1px 100% no-repeat, radial-gradient(ellipse 100% 50% at 0 50%, #000 94%, transparent 100%) left/100% 100% no-repeat; inset: 30px auto 30px 0; width: 5px; background: var(--dl-popover-rail-vertical); }
.dl-popover[data-side='right']::after { --dl-popover-rail-mask: linear-gradient(#000 0 0) right/1px 100% no-repeat, radial-gradient(ellipse 100% 50% at 100% 50%, #000 94%, transparent 100%) right/100% 100% no-repeat; inset: 30px 0 30px auto; width: 5px; background: var(--dl-popover-rail-vertical); }
.dl-popover__aura { position: absolute; inset: 1px; z-index: -1; border: 1px solid rgba(255, 239, 186, 0.06); border-radius: inherit; pointer-events: none; }
.dl-popover__header { position: relative; z-index: 2; display: flex; align-items: flex-start; justify-content: space-between; gap: 14px; }
.dl-popover__title { margin: 0; color: var(--dl-text); font-size: 0.98rem; font-weight: 800; line-height: 1.38; }
.dl-popover__body { position: relative; z-index: 2; min-width: 0; font-size: 0.84rem; line-height: 1.65; }
.dl-popover__close { flex: 0 0 auto; display: grid; place-items: center; width: 30px; height: 30px; padding: 0; border: 1px solid var(--dl-border); border-radius: 13px; background: var(--dl-surface); color: var(--dl-text-faint); cursor: pointer; outline: none; transition: 0.18s ease; }
.dl-popover__close:hover { transform: translateY(-1px); background: #eef1f4; color: var(--dl-text); }
.dl-popover__close:focus-visible, .dl-popover:focus-visible { box-shadow: var(--dl-focus); }
.dl-popover__arrow { position: relative; z-index: -1; display: block; box-sizing: border-box; width: 9px; height: 9px; border: 1px solid var(--dl-popover-border); background: var(--dl-popover-arrow); box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.28); transform: translateY(-4.5px) rotate(45deg); }
.dl-tone-accent { --dl-popover-border: rgba(255, 223, 128, 0.34); --dl-popover-rail: linear-gradient(90deg, rgba(91, 157, 170, 0.12), rgba(207, 175, 101, 0.54), rgba(91, 157, 170, 0.14)); --dl-popover-rail-vertical: linear-gradient(180deg, rgba(91, 157, 170, 0.12), rgba(207, 175, 101, 0.54), rgba(91, 157, 170, 0.14)); --dl-popover-glow: rgba(207, 175, 101, 0.1); }
.dl-tone-success { --dl-popover-border: rgba(113, 209, 173, 0.34); --dl-popover-rail: linear-gradient(90deg, rgba(102, 184, 148, 0.14), rgba(45, 155, 151, 0.5), rgba(102, 184, 148, 0.12)); --dl-popover-rail-vertical: linear-gradient(180deg, rgba(102, 184, 148, 0.14), rgba(45, 155, 151, 0.5), rgba(102, 184, 148, 0.12)); --dl-popover-glow: rgba(102, 184, 148, 0.09); }
.dl-tone-warning { --dl-popover-border: rgba(255, 179, 71, 0.34); --dl-popover-rail: linear-gradient(90deg, rgba(194, 128, 65, 0.16), rgba(207, 167, 88, 0.52), rgba(194, 128, 65, 0.12)); --dl-popover-rail-vertical: linear-gradient(180deg, rgba(194, 128, 65, 0.16), rgba(207, 167, 88, 0.52), rgba(194, 128, 65, 0.12)); --dl-popover-glow: rgba(194, 128, 65, 0.1); }
.dl-tone-danger { --dl-popover-border: rgba(255, 123, 123, 0.34); --dl-popover-rail: linear-gradient(90deg, rgba(190, 80, 80, 0.15), rgba(194, 105, 47, 0.5), rgba(190, 80, 80, 0.12)); --dl-popover-rail-vertical: linear-gradient(180deg, rgba(190, 80, 80, 0.15), rgba(194, 105, 47, 0.5), rgba(190, 80, 80, 0.12)); --dl-popover-glow: rgba(190, 80, 80, 0.1); }
.dl-tone-muted { --dl-popover-border: rgba(116, 134, 160, 0.28); --dl-popover-rail: linear-gradient(90deg, rgba(125, 139, 158, 0.12), rgba(84, 149, 157, 0.26), rgba(125, 139, 158, 0.1)); --dl-popover-rail-vertical: linear-gradient(180deg, rgba(125, 139, 158, 0.12), rgba(84, 149, 157, 0.26), rgba(125, 139, 158, 0.1)); --dl-popover-glow: rgba(125, 139, 158, 0.07); }
.dl-popover.dl-tone-subtle { --dl-popover-border: var(--dl-border); --dl-popover-arrow: var(--dl-surface-solid); border-radius: var(--dl-radius-md); background: var(--dl-surface-solid); box-shadow: var(--dl-shadow); backdrop-filter: none; }
.dl-popover.dl-tone-subtle::before, .dl-popover.dl-tone-subtle::after, .dl-popover.dl-tone-subtle .dl-popover__aura { display: none; }
.dl-popover.dl-tone-subtle .dl-popover__arrow { filter: drop-shadow(0 8px 12px rgba(0, 0, 0, 0.2)); }
.dl-popover[data-state='open'] { animation: dl-popover-in 190ms cubic-bezier(0.16, 1, 0.3, 1); }
.dl-popover[data-state='closed'] { animation: dl-popover-out 140ms ease-in; }
@keyframes dl-popover-in { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
@keyframes dl-popover-out { from { opacity: 1; } to { opacity: 0; transform: scale(0.97); } }
</style>
