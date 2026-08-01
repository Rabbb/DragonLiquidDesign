<script setup lang="ts">
import { ToastAction, ToastClose, ToastDescription, ToastPortal, ToastProvider, ToastRoot, ToastTitle, ToastViewport } from 'reka-ui'
import type { DlTone } from '../types'

const props = withDefaults(defineProps<{
  open?: boolean
  title: string
  description?: string
  duration?: number
  tone?: DlTone
  actionLabel?: string
  closeLabel?: string
  zIndex?: number
}>(), { open: false, description: undefined, duration: 5000, tone: 'default', actionLabel: undefined, closeLabel: '关闭通知', zIndex: undefined })
const emit = defineEmits<{ 'update:open': [value: boolean]; action: [] }>()
</script>

<template>
  <ToastProvider label="通知" :duration="duration" swipe-direction="right">
    <ToastRoot data-dl data-slot="toast" :open="open" :duration="duration" :class="['grid w-[min(380px,calc(100vw-2rem))] grid-cols-[1fr_auto] gap-x-4 gap-y-1 rounded-[var(--dl-radius-md)] border [background:var(--dl-panel)] p-4 text-[var(--dl-text)] shadow-[0_24px_70px_rgba(0,0,0,.48)] backdrop-blur-2xl data-[state=open]:animate-in data-[state=closed]:animate-out', tone === 'danger' ? 'border-red-300/30' : tone === 'success' ? 'border-emerald-300/30' : tone === 'warning' ? 'border-amber-300/30' : 'border-[var(--dl-border-strong)]']" @update:open="emit('update:open', $event)">
      <ToastTitle class="font-bold">{{ title }}</ToastTitle>
      <ToastClose class="row-span-2 grid size-7 place-items-center rounded-lg text-[var(--dl-text-faint)] hover:bg-white/[0.08] hover:text-[var(--dl-text)]" :aria-label="closeLabel">×</ToastClose>
      <ToastDescription v-if="description" class="text-sm leading-5 text-[var(--dl-text-muted)]">{{ description }}</ToastDescription>
      <ToastAction v-if="actionLabel" alt-text="执行通知操作" class="mt-2 w-fit rounded-lg border border-amber-200/25 bg-amber-300/10 px-2.5 py-1 text-xs font-bold text-amber-100 hover:bg-amber-300/15" @click="emit('action')">{{ actionLabel }}</ToastAction>
    </ToastRoot>
    <ToastPortal>
      <ToastViewport data-dl-layer="notification" :style="{ zIndex: zIndex ?? 'var(--dl-layer-notification)' }" class="fixed bottom-0 right-0 flex max-h-screen w-[420px] max-w-full flex-col gap-3 p-4 outline-none" />
    </ToastPortal>
  </ToastProvider>
</template>
