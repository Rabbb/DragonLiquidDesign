<script setup lang="ts">
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from 'reka-ui'
import { useDlModalLayer } from '../composables/useDlLayer'
import type { DlTone } from '../types'
import { dialogStyles } from './overlay.styles'

const props = withDefaults(defineProps<{
  open?: boolean
  title: string
  description?: string
  size?: 'sm' | 'md' | 'lg'
  tone?: DlTone
  closable?: boolean
  zIndex?: number
}>(), {
  open: false,
  description: undefined,
  size: 'md',
  tone: 'default',
  closable: true,
  zIndex: undefined,
})

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const { overlayZIndex, contentZIndex } = useDlModalLayer(() => props.zIndex)
</script>

<template>
  <DialogRoot :open="open" @update:open="emit('update:open', $event)">
    <DialogTrigger v-if="$slots.trigger" as-child><slot name="trigger" /></DialogTrigger>
    <DialogPortal>
      <DialogOverlay
        data-dl
        data-dl-layer="overlay"
        :style="{ zIndex: overlayZIndex }"
        class="dl-dialog-overlay"
      />
      <DialogContent
        data-dl
        data-slot="dialog"
        data-dl-layer="modal"
        data-guide-surface="dialog"
        :data-size="size"
        :style="{ zIndex: contentZIndex }"
        :class="dialogStyles({ size, tone })"
      >
        <header class="dl-dialog__header">
          <div class="dl-dialog__meta">
            <DialogTitle class="dl-dialog__title">{{ title }}</DialogTitle>
            <DialogDescription v-if="description" class="dl-dialog__description">{{ description }}</DialogDescription>
          </div>
          <DialogClose
            v-if="closable"
            data-guide-closes="dialog"
            class="dl-dialog__close"
            aria-label="关闭"
          >
            ×
          </DialogClose>
        </header>
        <div class="dl-dialog__body"><slot /></div>
        <footer v-if="$slots.footer" class="dl-dialog__footer">
          <slot name="footer" />
        </footer>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<style>
.dl-dialog-overlay {
  position: fixed;
  inset: 0;
  background:
    radial-gradient(circle at 50% 12%, rgba(190, 126, 22, 0.05), transparent 24%),
    rgba(15, 23, 42, 0.28);
  backdrop-filter: blur(10px) saturate(104%);
}

.dl-dialog {
  --dl-dialog-width: 640px;
  --dl-overlay-border: rgba(15, 23, 42, 0.14);
  --dl-overlay-rail: linear-gradient(90deg, rgba(164, 105, 11, 0.12), rgba(148, 163, 184, 0.32), rgba(71, 85, 105, 0.08));
  --dl-overlay-glow: rgba(15, 23, 42, 0.04);
  position: fixed;
  left: 50%;
  top: 50%;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  gap: 20px;
  width: min(calc(100vw - 2rem), var(--dl-dialog-width));
  max-width: var(--dl-dialog-width);
  max-height: calc(100dvh - 48px);
  padding: 24px;
  transform: translate(-50%, -50%);
  overflow: hidden;
  isolation: isolate;
  border: 1px solid var(--dl-overlay-border);
  border-radius: 28px;
  background: var(--dl-panel);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    0 24px 60px rgba(15, 23, 42, 0.18),
    0 0 40px var(--dl-overlay-glow);
  color: var(--dl-text);
  outline: none;
  backdrop-filter: blur(24px) saturate(106%);
}

.dl-dialog::before {
  content: '';
  position: absolute;
  inset: 1px;
  z-index: -1;
  border-radius: inherit;
  pointer-events: none;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.65), transparent 24%);
  opacity: 0.6;
}

.dl-dialog::after {
  content: '';
  position: absolute;
  inset: 0 0 auto;
  height: 3px;
  background: var(--dl-overlay-rail);
  opacity: 0.92;
  pointer-events: none;
}

.dl-dialog--sm { --dl-dialog-width: 500px; gap: 16px; padding: 20px; border-radius: 22px; }
.dl-dialog--md { --dl-dialog-width: 640px; }
.dl-dialog--lg { --dl-dialog-width: 840px; gap: 24px; padding: 28px; border-radius: 32px; }
.dl-tone-accent { --dl-overlay-border: rgba(255, 223, 128, 0.34); --dl-overlay-rail: linear-gradient(90deg, rgba(104, 225, 255, 0.18), rgba(255, 215, 110, 0.74), rgba(104, 225, 255, 0.24)); --dl-overlay-glow: rgba(104, 225, 255, 0.12); }
.dl-tone-success { --dl-overlay-border: rgba(113, 209, 173, 0.34); --dl-overlay-rail: linear-gradient(90deg, rgba(124, 255, 190, 0.22), rgba(0, 206, 209, 0.62), rgba(124, 255, 190, 0.18)); --dl-overlay-glow: rgba(124, 255, 190, 0.12); }
.dl-tone-warning { --dl-overlay-border: rgba(255, 179, 71, 0.34); --dl-overlay-rail: linear-gradient(90deg, rgba(255, 178, 89, 0.24), rgba(255, 215, 110, 0.74), rgba(255, 178, 89, 0.2)); --dl-overlay-glow: rgba(255, 178, 89, 0.14); }
.dl-tone-danger { --dl-overlay-border: rgba(255, 123, 123, 0.34); --dl-overlay-rail: linear-gradient(90deg, rgba(255, 112, 112, 0.24), rgba(255, 140, 0, 0.68), rgba(255, 112, 112, 0.22)); --dl-overlay-glow: rgba(255, 112, 112, 0.14); }
.dl-tone-muted { --dl-overlay-border: rgba(116, 134, 160, 0.28); --dl-overlay-rail: linear-gradient(90deg, rgba(148, 163, 184, 0.2), rgba(104, 225, 255, 0.22), rgba(148, 163, 184, 0.14)); --dl-overlay-glow: rgba(148, 163, 184, 0.08); }

.dl-dialog__header { position: relative; z-index: 1; display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
.dl-dialog__meta { display: grid; gap: 9px; min-width: 0; }
.dl-dialog__title { margin: 0; color: var(--dl-text); font-size: 1.24rem; line-height: 1.18; font-weight: 900; letter-spacing: 0.01em; }
.dl-dialog--sm .dl-dialog__title { font-size: 1.12rem; }
.dl-dialog--lg .dl-dialog__title { font-size: 1.32rem; }
.dl-dialog__description { margin: 0; color: var(--dl-text-muted); font-size: 0.96rem; line-height: 1.65; }
.dl-dialog__body { position: relative; z-index: 1; min-height: 0; display: grid; gap: 14px; overflow: auto; overscroll-behavior: contain; }
.dl-dialog__footer { position: relative; z-index: 1; display: flex; justify-content: flex-end; gap: 10px; flex-wrap: wrap; }
.dl-dialog__close { flex: 0 0 auto; display: grid; place-items: center; width: 38px; height: 38px; padding: 0; border: 1px solid var(--dl-border); border-radius: 18px; background: var(--dl-surface); color: var(--dl-text-muted); font-size: 1.1rem; line-height: 1; cursor: pointer; outline: none; transition: 0.18s ease; }
.dl-dialog__close:hover { transform: translateY(-1px); border-color: var(--dl-border-strong); background: var(--dl-surface-hover); color: var(--dl-text); box-shadow: 0 6px 16px rgba(15, 23, 42, 0.08); }
.dl-dialog__close:focus-visible, .dl-dialog:focus-visible { box-shadow: var(--dl-focus); }
.dl-dialog[data-state='open'], .dl-dialog-overlay[data-state='open'] { animation: dl-overlay-in 180ms ease-out; }
.dl-dialog[data-state='closed'], .dl-dialog-overlay[data-state='closed'] { animation: dl-overlay-out 150ms ease-in; }

@keyframes dl-overlay-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes dl-overlay-out { from { opacity: 1; } to { opacity: 0; } }

@media (max-width: 720px) {
  .dl-dialog, .dl-dialog--sm, .dl-dialog--md, .dl-dialog--lg { width: calc(100vw - 1.75rem); }
}

@media (max-height: 520px) and (orientation: landscape) {
  .dl-dialog, .dl-dialog--sm, .dl-dialog--md, .dl-dialog--lg { width: 100%; max-width: none; min-height: 100dvh; max-height: 100dvh; gap: 8px; padding: 10px 12px; border-radius: 0; }
  .dl-dialog__header { align-items: center; gap: 10px; }
  .dl-dialog__meta { gap: 2px; }
  .dl-dialog__title { font-size: 1rem; }
  .dl-dialog__description { max-height: 2.6em; overflow: hidden; font-size: 0.78rem; line-height: 1.3; }
  .dl-dialog__body { gap: 10px; }
  .dl-dialog__close { width: 34px; height: 34px; border-radius: 16px; }
}
</style>
