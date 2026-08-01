<script setup lang="ts">
import { computed } from 'vue'
import { ToastAction, ToastClose, ToastDescription, ToastPortal, ToastProvider, ToastRoot, ToastTitle, ToastViewport } from 'reka-ui'
import type { DlSize, DlTone } from '../types'
import { toastStyles } from './overlay.styles'

const props = withDefaults(defineProps<{
  open?: boolean
  title: string
  description?: string
  duration?: number
  tone?: DlTone
  size?: DlSize
  icon?: string
  closable?: boolean
  actionLabel?: string
  closeLabel?: string
  showProgress?: boolean
  progress?: number
  zIndex?: number
}>(), { open: false, description: undefined, duration: 5000, tone: 'default', size: 'md', icon: undefined, closable: true, actionLabel: undefined, closeLabel: '关闭通知', showProgress: false, progress: 100, zIndex: undefined })
const emit = defineEmits<{ 'update:open': [value: boolean]; action: [] }>()
const iconMap: Record<DlTone, string> = { default: '✦', accent: '✦', success: '✓', warning: '!', danger: '⚠', muted: '•' }
const resolvedIcon = computed(() => props.icon ?? iconMap[props.tone])
const resolvedProgress = computed(() => Math.max(0, Math.min(100, props.progress)))
</script>

<template>
  <ToastProvider label="通知" :duration="duration" swipe-direction="right">
    <ToastRoot data-dl data-slot="toast" :open="open" :duration="duration" :class="toastStyles({ tone, size })" @update:open="emit('update:open', $event)">
      <div class="dl-toast__header">
        <div class="dl-toast__icon" aria-hidden="true"><slot name="icon">{{ resolvedIcon }}</slot></div>
        <div class="dl-toast__meta">
          <ToastTitle class="dl-toast__title">{{ title }}</ToastTitle>
          <ToastDescription v-if="description" class="dl-toast__description">{{ description }}</ToastDescription>
        </div>
      </div>
      <div v-if="actionLabel || $slots.actions" class="dl-toast__actions">
        <slot name="actions">
          <ToastAction v-if="actionLabel" alt-text="执行通知操作" class="dl-toast__action" @click="emit('action')">{{ actionLabel }}</ToastAction>
        </slot>
      </div>
      <div v-if="showProgress" class="dl-toast__progress-track" aria-hidden="true">
        <div class="dl-toast__progress" :style="{ transform: `scaleX(${resolvedProgress / 100})` }" />
      </div>
      <ToastClose v-if="closable" class="dl-toast__close" :aria-label="closeLabel">×</ToastClose>
    </ToastRoot>
    <ToastPortal>
      <ToastViewport data-dl-layer="notification" :style="{ zIndex: zIndex ?? 'var(--dl-layer-notification)' }" class="dl-toast-viewport" />
    </ToastPortal>
  </ToastProvider>
</template>

<style>
.dl-toast-viewport { position: fixed; right: 0; bottom: 0; display: grid; gap: 16px; width: min(100%, 440px); max-height: 100vh; padding: 16px; outline: none; }
.dl-toast { --dl-toast-border: rgba(255, 239, 186, 0.22); --dl-toast-rail: linear-gradient(90deg, rgba(255, 223, 128, 0.24), rgba(104, 225, 255, 0.5), rgba(124, 255, 190, 0.16)); --dl-toast-glow: rgba(255, 196, 84, 0.04); --dl-toast-icon: #fff4c4; position: relative; display: grid; gap: 12px; width: min(100%, 408px); padding: 16px 18px; overflow: hidden; isolation: isolate; border: 1px solid var(--dl-toast-border); border-radius: 22px; background: radial-gradient(circle at top left, rgba(255, 215, 110, 0.12), transparent 34%), radial-gradient(circle at top right, rgba(104, 225, 255, 0.12), transparent 42%), radial-gradient(circle at bottom left, rgba(50, 205, 50, 0.1), transparent 38%), linear-gradient(180deg, rgba(20, 54, 40, 0.94), rgba(10, 30, 24, 0.9) 58%, rgba(8, 18, 24, 0.9)); box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.03), 0 18px 38px rgba(6, 18, 14, 0.3), 0 0 28px var(--dl-toast-glow); color: var(--dl-text); backdrop-filter: blur(28px) saturate(132%); }
.dl-toast::before { content: ''; position: absolute; inset: 1px; z-index: -1; border-radius: inherit; pointer-events: none; background: linear-gradient(135deg, rgba(255, 255, 255, 0.12), transparent 22%, transparent 72%, rgba(255, 255, 255, 0.05)); opacity: 0.86; }
.dl-toast::after { content: ''; position: absolute; inset: 0 0 auto; height: 3px; background: var(--dl-toast-rail); opacity: 0.9; pointer-events: none; }
.dl-toast--sm { gap: 10px; padding: 12px 14px; border-radius: 18px; }
.dl-toast--lg { gap: 14px; padding: 20px 22px; border-radius: 24px; }
.dl-tone-accent { --dl-toast-border: rgba(255, 223, 128, 0.34); --dl-toast-rail: linear-gradient(90deg, rgba(104, 225, 255, 0.2), rgba(255, 215, 110, 0.72), rgba(104, 225, 255, 0.26)); --dl-toast-glow: rgba(104, 225, 255, 0.12); --dl-toast-icon: #dffcff; }
.dl-tone-success { --dl-toast-border: rgba(113, 209, 173, 0.34); --dl-toast-rail: linear-gradient(90deg, rgba(124, 255, 190, 0.24), rgba(0, 206, 209, 0.64), rgba(124, 255, 190, 0.2)); --dl-toast-glow: rgba(124, 255, 190, 0.12); --dl-toast-icon: #eafff2; }
.dl-tone-warning { --dl-toast-border: rgba(255, 179, 71, 0.34); --dl-toast-rail: linear-gradient(90deg, rgba(255, 178, 89, 0.28), rgba(255, 215, 110, 0.72), rgba(255, 178, 89, 0.22)); --dl-toast-glow: rgba(255, 178, 89, 0.14); --dl-toast-icon: #fff1cf; }
.dl-tone-danger { --dl-toast-border: rgba(255, 123, 123, 0.34); --dl-toast-rail: linear-gradient(90deg, rgba(255, 112, 112, 0.26), rgba(255, 140, 0, 0.68), rgba(255, 112, 112, 0.24)); --dl-toast-glow: rgba(255, 112, 112, 0.14); --dl-toast-icon: #ffe1e1; }
.dl-tone-muted { --dl-toast-border: rgba(116, 134, 160, 0.28); --dl-toast-rail: linear-gradient(90deg, rgba(148, 163, 184, 0.22), rgba(104, 225, 255, 0.26), rgba(148, 163, 184, 0.18)); --dl-toast-glow: rgba(148, 163, 184, 0.12); --dl-toast-icon: #e6edf7; }
.dl-toast__header { position: relative; z-index: 1; display: flex; align-items: flex-start; gap: 13px; padding-right: 30px; }
.dl-toast__icon { flex: 0 0 auto; display: grid; place-items: center; width: 36px; height: 36px; border: 1px solid color-mix(in srgb, var(--dl-toast-border) 70%, white 8%); border-radius: 14px; background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.2), transparent 48%), linear-gradient(180deg, rgba(46, 92, 72, 0.42), rgba(22, 48, 39, 0.28)); box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 0 18px var(--dl-toast-glow); color: var(--dl-toast-icon); font-size: 0.98rem; }
.dl-toast--sm .dl-toast__icon { width: 32px; height: 32px; border-radius: 12px; }
.dl-toast--lg .dl-toast__icon { width: 40px; height: 40px; }
.dl-toast__meta { display: grid; gap: 5px; min-width: 0; }
.dl-toast__title { color: #fff; font-size: 1rem; font-weight: 800; line-height: 1.2; letter-spacing: 0.01em; }
.dl-toast--sm .dl-toast__title { font-size: 0.92rem; }
.dl-toast--lg .dl-toast__title { font-size: 1.04rem; }
.dl-toast__description { color: var(--dl-text-muted); font-size: 0.92rem; line-height: 1.58; }
.dl-toast--sm .dl-toast__description { font-size: 0.86rem; }
.dl-toast--lg .dl-toast__description { font-size: 0.96rem; }
.dl-toast__actions { position: relative; z-index: 1; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.dl-toast__action { min-height: 30px; padding: 0 11px; border: 1px solid var(--dl-toast-border); border-radius: 999px; background: rgba(255, 255, 255, 0.07); color: var(--dl-toast-icon); font-size: 0.78rem; font-weight: 800; cursor: pointer; outline: none; transition: 0.18s ease; }
.dl-toast__action:hover { transform: translateY(-1px); background: rgba(255, 255, 255, 0.12); }
.dl-toast__action:focus-visible { box-shadow: var(--dl-focus); }
.dl-toast__close { position: absolute; z-index: 2; top: 12px; right: 12px; display: grid; place-items: center; width: 30px; height: 30px; padding: 0; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 999px; background: linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04)); color: var(--dl-text); cursor: pointer; outline: none; transition: 0.18s ease; }
.dl-toast__close:hover { transform: translateY(-1px); border-color: rgba(255, 255, 255, 0.18); background: linear-gradient(180deg, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0.08)); box-shadow: 0 0 16px rgba(104, 225, 255, 0.08); }
.dl-toast__close:focus-visible { box-shadow: var(--dl-focus); }
.dl-toast__progress-track { position: relative; z-index: 1; height: 6px; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 999px; background: linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04)); }
.dl-toast__progress { width: 100%; height: 100%; transform-origin: left center; border-radius: inherit; background: var(--dl-toast-rail); box-shadow: 0 0 20px var(--dl-toast-glow); transition: transform 180ms ease; }
.dl-toast[data-state='open'] { animation: dl-toast-in 240ms cubic-bezier(0.16, 1, 0.3, 1); }
.dl-toast[data-state='closed'] { animation: dl-toast-out 180ms ease-in; }
@keyframes dl-toast-in { from { opacity: 0; transform: translateX(28px) scale(0.98); } to { opacity: 1; transform: none; } }
@keyframes dl-toast-out { from { opacity: 1; } to { opacity: 0; transform: translateX(20px) scale(0.98); } }
</style>
