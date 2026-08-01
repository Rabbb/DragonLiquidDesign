<script setup lang="ts">
import { computed } from 'vue'
import { DrawerClose, DrawerContent, DrawerDescription, DrawerHandle, DrawerOverlay, DrawerPortal, DrawerRoot, DrawerTitle, DrawerTrigger } from 'reka-ui'
import { useDlModalLayer } from '../composables/useDlLayer'
import type { DlSize, DlTone } from '../types'
import { drawerStyles } from './overlay.styles'

const props = withDefaults(defineProps<{
  open?: boolean
  title: string
  description?: string
  placement?: 'bottom' | 'top' | 'left' | 'right'
  size?: DlSize
  tone?: DlTone
  modal?: boolean | 'trap-focus'
  closable?: boolean
  zIndex?: number
}>(), {
  open: false,
  description: undefined,
  placement: 'bottom',
  size: 'sm',
  tone: 'default',
  modal: true,
  closable: true,
  zIndex: undefined,
})

const emit = defineEmits<{ 'update:open': [value: boolean] }>()
const swipeDirection = computed(() => ({ bottom: 'down', top: 'up', left: 'left', right: 'right' } as const)[props.placement])
const { overlayZIndex, contentZIndex } = useDlModalLayer(() => props.zIndex)
</script>

<template>
  <DrawerRoot :open="open" :modal="modal" :swipe-direction="swipeDirection" @update:open="emit('update:open', $event)">
    <DrawerTrigger v-if="$slots.trigger" as-child><slot name="trigger" /></DrawerTrigger>
    <DrawerPortal>
      <DrawerOverlay
        data-dl
        data-dl-layer="overlay"
        :style="{ zIndex: overlayZIndex }"
        class="dl-drawer-overlay"
      />
      <DrawerContent
        data-dl
        data-slot="drawer"
        data-dl-layer="modal"
        :style="{ zIndex: contentZIndex }"
        :class="drawerStyles({ placement, size, tone })"
      >
        <span class="dl-drawer__aura" aria-hidden="true" />
        <span class="dl-drawer__sigil" aria-hidden="true" />
        <span class="dl-drawer__rail" aria-hidden="true" />
        <DrawerHandle v-if="placement === 'bottom' || placement === 'top'" class="dl-drawer__handle" />

        <header class="dl-drawer__header">
          <div class="dl-drawer__header-main">
            <div class="dl-drawer__title-row">
              <span class="dl-drawer__orb" aria-hidden="true" />
              <div class="dl-drawer__meta">
                <DrawerTitle class="dl-drawer__title">{{ title }}</DrawerTitle>
                <DrawerDescription v-if="description" class="dl-drawer__description">{{ description }}</DrawerDescription>
              </div>
            </div>
          </div>
          <DrawerClose v-if="closable" class="dl-drawer__close" aria-label="关闭">×</DrawerClose>
        </header>

        <div class="dl-drawer__body"><slot /></div>
        <footer v-if="$slots.footer" class="dl-drawer__footer"><slot name="footer" /></footer>
      </DrawerContent>
    </DrawerPortal>
  </DrawerRoot>
</template>

<style>
.dl-drawer-overlay { position: fixed; inset: 0; cursor: pointer; background: radial-gradient(circle at 18% 18%, rgba(255, 215, 110, 0.1), transparent 18%), radial-gradient(circle at 78% 20%, rgba(104, 225, 255, 0.12), transparent 22%), radial-gradient(circle at 18% 82%, rgba(124, 255, 190, 0.08), transparent 24%), radial-gradient(circle at 50% 100%, rgba(50, 205, 50, 0.11), transparent 30%), linear-gradient(180deg, rgba(6, 18, 14, 0.58), rgba(5, 12, 18, 0.84)); box-shadow: inset 0 0 80px rgba(4, 14, 12, 0.18); backdrop-filter: blur(16px) saturate(110%); }
.dl-drawer { --dl-drawer-border: rgba(255, 239, 186, 0.22); --dl-drawer-rail: linear-gradient(90deg, rgba(255, 223, 128, 0.22), rgba(104, 225, 255, 0.46), rgba(124, 255, 190, 0.14)); --dl-drawer-glow: rgba(104, 225, 255, 0.08); --dl-drawer-orb: rgba(255, 223, 128, 0.28); --dl-drawer-padding-x: 22px; --dl-drawer-padding-bottom: 20px; position: fixed; display: grid; grid-template-rows: auto minmax(0, 1fr) auto; gap: 18px; padding: 24px var(--dl-drawer-padding-x) var(--dl-drawer-padding-bottom); overflow: hidden; isolation: isolate; border: 1px solid var(--dl-drawer-border); background: radial-gradient(circle at top left, rgba(255, 215, 110, 0.16), transparent 30%), radial-gradient(circle at 82% 14%, rgba(104, 225, 255, 0.14), transparent 34%), radial-gradient(circle at 18% 100%, rgba(50, 205, 50, 0.14), transparent 44%), linear-gradient(180deg, rgba(27, 70, 53, 0.97), rgba(13, 40, 31, 0.96) 56%, rgba(7, 18, 24, 0.97)); box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.11), inset 0 0 0 1px rgba(255, 255, 255, 0.03), 0 24px 64px rgba(4, 14, 12, 0.36), 0 0 40px var(--dl-drawer-glow); color: var(--dl-text); outline: none; backdrop-filter: blur(28px) saturate(132%); }
.dl-drawer::before { content: ''; position: absolute; inset: 1px; z-index: -1; border-radius: inherit; pointer-events: none; background: linear-gradient(135deg, rgba(255, 255, 255, 0.12), transparent 18%, transparent 74%, rgba(255, 255, 255, 0.04)); opacity: 0.88; }
.dl-drawer--right, .dl-drawer--left { inset-block: 0; width: min(100vw, 420px); max-width: 100%; }
.dl-drawer--right { right: 0; border-radius: 28px 0 0 28px; }
.dl-drawer--left { left: 0; border-radius: 0 28px 28px 0; }
.dl-drawer--bottom, .dl-drawer--top { left: 50%; width: min(calc(100vw - 24px), 720px); max-width: 100%; max-height: min(82vh, 760px); translate: -50% 0; }
.dl-drawer--bottom { bottom: 0; border-bottom: 0; border-radius: 30px 30px 0 0; }
.dl-drawer--top { top: 0; border-top: 0; border-radius: 0 0 30px 30px; }
.dl-drawer--md.dl-drawer--right, .dl-drawer--md.dl-drawer--left { width: min(100vw, 560px); }
.dl-drawer--lg.dl-drawer--right, .dl-drawer--lg.dl-drawer--left { width: min(100vw, 720px); }
.dl-drawer--md.dl-drawer--bottom, .dl-drawer--md.dl-drawer--top { width: min(calc(100vw - 24px), 920px); }
.dl-drawer--lg.dl-drawer--bottom, .dl-drawer--lg.dl-drawer--top { width: min(calc(100vw - 24px), 1120px); }
.dl-drawer--right::after, .dl-drawer--left::after { content: ''; position: absolute; top: 18px; bottom: 18px; width: 3px; border-radius: 999px; background: var(--dl-drawer-rail); box-shadow: 0 0 12px var(--dl-drawer-glow); opacity: 0.92; }
.dl-drawer--right::after { left: 0; }
.dl-drawer--left::after { right: 0; }
.dl-drawer__aura, .dl-drawer__sigil, .dl-drawer__rail { position: absolute; pointer-events: none; }
.dl-drawer__aura { inset: 1px; z-index: -1; border: 1px solid rgba(255, 239, 186, 0.09); border-radius: inherit; background: radial-gradient(circle at top right, rgba(104, 225, 255, 0.06), transparent 26%), linear-gradient(120deg, rgba(255, 255, 255, 0.02), rgba(255, 223, 128, 0.035), rgba(113, 209, 173, 0.03), rgba(255, 255, 255, 0.02)); box-shadow: inset 0 0 28px var(--dl-drawer-glow); opacity: 0.92; }
.dl-drawer__sigil { top: -56px; right: -56px; width: 180px; height: 180px; border: 1px solid color-mix(in srgb, var(--dl-drawer-border) 45%, transparent); border-radius: 999px; background: radial-gradient(circle, var(--dl-drawer-orb), transparent 66%); box-shadow: 0 0 32px var(--dl-drawer-glow); opacity: 0.28; }
.dl-drawer__rail { inset: 0 0 auto; height: 3px; background: var(--dl-drawer-rail); opacity: 0.92; }
.dl-drawer__handle { position: absolute; top: 10px; left: 50%; z-index: 2; width: 56px; height: 6px; border-radius: 999px; translate: -50% 0; background: var(--dl-drawer-rail); box-shadow: 0 0 16px var(--dl-drawer-glow), inset 0 1px 0 rgba(255, 255, 255, 0.16); opacity: 0.94; }
.dl-drawer--top .dl-drawer__handle { top: auto; bottom: 10px; }
.dl-drawer__header, .dl-drawer__body, .dl-drawer__footer { position: relative; z-index: 1; }
.dl-drawer__header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
.dl-drawer__header-main { display: grid; flex: 1; min-width: 0; }
.dl-drawer__title-row { display: flex; align-items: flex-start; gap: 14px; min-width: 0; }
.dl-drawer__orb { flex: 0 0 auto; width: 42px; height: 42px; border: 1px solid var(--dl-drawer-border); border-radius: 18px; background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.2), transparent 40%), radial-gradient(circle at 50% 56%, var(--dl-drawer-orb), transparent 62%), linear-gradient(180deg, rgba(49, 104, 81, 0.48), rgba(20, 46, 38, 0.28)); box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 24px var(--dl-drawer-glow); }
.dl-drawer__meta { display: grid; flex: 1; gap: 10px; min-width: 0; }
.dl-drawer__title { margin: 0; color: #fff; font-size: 1.18rem; font-weight: 900; line-height: 1.2; text-shadow: 0 0 18px rgba(113, 209, 173, 0.08); }
.dl-drawer__description { margin: 0; color: var(--dl-text-muted); font-size: 0.95rem; line-height: 1.68; }
.dl-drawer__body { display: grid; gap: 14px; min-height: 0; padding: 2px 2px 0; overflow: auto; overscroll-behavior: contain; }
.dl-drawer__footer { display: flex; justify-content: flex-end; gap: 10px; flex-wrap: wrap; margin: 4px calc(-1 * var(--dl-drawer-padding-x)) calc(-1 * var(--dl-drawer-padding-bottom)); padding: 14px var(--dl-drawer-padding-x) var(--dl-drawer-padding-bottom); border-top: 1px solid rgba(255, 255, 255, 0.06); background: linear-gradient(180deg, rgba(255, 255, 255, 0.055), rgba(255, 255, 255, 0.012)); }
.dl-drawer__close { flex: 0 0 auto; display: grid; place-items: center; width: 40px; height: 40px; padding: 0; border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 20px; background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.2), transparent 42%), radial-gradient(circle at 50% 52%, rgba(255, 223, 128, 0.14), transparent 62%), linear-gradient(180deg, rgba(46, 92, 72, 0.38), rgba(22, 48, 39, 0.26)); box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 20px var(--dl-drawer-glow); color: var(--dl-text); cursor: pointer; outline: none; transition: 0.18s ease; }
.dl-drawer__close:hover { transform: translateY(-1px) scale(1.02); border-color: rgba(175, 235, 212, 0.24); background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.24), transparent 42%), radial-gradient(circle at 50% 52%, rgba(255, 223, 128, 0.18), transparent 62%), linear-gradient(180deg, rgba(58, 110, 88, 0.44), rgba(30, 62, 50, 0.3)); }
.dl-drawer__close:focus-visible, .dl-drawer:focus-visible { box-shadow: var(--dl-focus); }
.dl-tone-accent { --dl-drawer-border: rgba(255, 223, 128, 0.34); --dl-drawer-rail: linear-gradient(90deg, rgba(104, 225, 255, 0.18), rgba(255, 215, 110, 0.74), rgba(104, 225, 255, 0.24)); --dl-drawer-glow: rgba(104, 225, 255, 0.12); --dl-drawer-orb: rgba(104, 225, 255, 0.24); }
.dl-tone-success { --dl-drawer-border: rgba(113, 209, 173, 0.34); --dl-drawer-rail: linear-gradient(90deg, rgba(124, 255, 190, 0.22), rgba(0, 206, 209, 0.62), rgba(124, 255, 190, 0.18)); --dl-drawer-glow: rgba(124, 255, 190, 0.12); --dl-drawer-orb: rgba(124, 255, 190, 0.22); }
.dl-tone-warning { --dl-drawer-border: rgba(255, 179, 71, 0.34); --dl-drawer-rail: linear-gradient(90deg, rgba(255, 178, 89, 0.24), rgba(255, 215, 110, 0.74), rgba(255, 178, 89, 0.2)); --dl-drawer-glow: rgba(255, 178, 89, 0.14); --dl-drawer-orb: rgba(255, 178, 89, 0.22); }
.dl-tone-danger { --dl-drawer-border: rgba(255, 123, 123, 0.34); --dl-drawer-rail: linear-gradient(90deg, rgba(255, 112, 112, 0.24), rgba(255, 140, 0, 0.68), rgba(255, 112, 112, 0.22)); --dl-drawer-glow: rgba(255, 112, 112, 0.14); --dl-drawer-orb: rgba(255, 112, 112, 0.22); }
.dl-tone-muted { --dl-drawer-border: rgba(116, 134, 160, 0.28); --dl-drawer-rail: linear-gradient(90deg, rgba(148, 163, 184, 0.2), rgba(104, 225, 255, 0.24), rgba(148, 163, 184, 0.16)); --dl-drawer-glow: rgba(148, 163, 184, 0.1); --dl-drawer-orb: rgba(148, 163, 184, 0.18); }
.dl-drawer-overlay[data-state='open'] { animation: dl-drawer-fade-in 180ms ease-out; }
.dl-drawer-overlay[data-state='closed'] { animation: dl-drawer-fade-out 160ms ease-in; }
@keyframes dl-drawer-fade-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes dl-drawer-fade-out { from { opacity: 1; } to { opacity: 0; } }
@media (max-width: 720px) {
  .dl-drawer { --dl-drawer-padding-x: 18px; --dl-drawer-padding-bottom: 18px; }
  .dl-drawer--right, .dl-drawer--left { width: 100%; padding-top: 20px; }
  .dl-drawer--bottom, .dl-drawer--top, .dl-drawer--sm.dl-drawer--bottom, .dl-drawer--md.dl-drawer--bottom, .dl-drawer--lg.dl-drawer--bottom, .dl-drawer--sm.dl-drawer--top, .dl-drawer--md.dl-drawer--top, .dl-drawer--lg.dl-drawer--top { left: 0; width: 100%; max-height: min(82vh, 760px); padding-top: 24px; translate: none; }
  .dl-drawer__close { width: 42px; height: 42px; }
}
@media (max-height: 520px) and (orientation: landscape) {
  .dl-drawer { --dl-drawer-padding-x: 12px; --dl-drawer-padding-bottom: 12px; }
  .dl-drawer--bottom, .dl-drawer--top { left: 0; width: 100%; height: 100dvh; max-height: 100dvh; padding-top: 12px; translate: none; border-radius: 0; }
  .dl-drawer--right, .dl-drawer--left { padding-top: 12px; }
  .dl-drawer__header { align-items: center; gap: 10px; }
  .dl-drawer__orb { display: none; }
  .dl-drawer__title-row { gap: 0; }
  .dl-drawer__meta { gap: 4px; }
  .dl-drawer__title { font-size: 1rem; }
  .dl-drawer__description { max-height: 2.6em; overflow: hidden; font-size: 0.78rem; line-height: 1.3; }
  .dl-drawer__close { width: 34px; height: 34px; border-radius: 16px; }
}
</style>
