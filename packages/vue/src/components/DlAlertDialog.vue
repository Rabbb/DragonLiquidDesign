<script setup lang="ts">
import { AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogOverlay, AlertDialogPortal, AlertDialogRoot, AlertDialogTitle, AlertDialogTrigger } from 'reka-ui'
import { useDlModalLayer } from '../composables/useDlLayer'

const props = withDefaults(defineProps<{
  open?: boolean
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  tone?: 'warning' | 'danger'
  zIndex?: number
}>(), { open: false, description: undefined, confirmLabel: '确认', cancelLabel: '取消', tone: 'danger', zIndex: undefined })
const emit = defineEmits<{ 'update:open': [value: boolean]; confirm: []; cancel: [] }>()
const { overlayZIndex, contentZIndex } = useDlModalLayer(() => props.zIndex)
</script>

<template>
  <AlertDialogRoot :open="open" @update:open="emit('update:open', $event)">
    <AlertDialogTrigger v-if="$slots.trigger" as-child><slot name="trigger" /></AlertDialogTrigger>
    <AlertDialogPortal>
      <AlertDialogOverlay data-dl data-dl-layer="overlay" :style="{ zIndex: overlayZIndex }" class="fixed inset-0 bg-[#020805]/80 backdrop-blur-md" />
      <AlertDialogContent data-dl data-slot="alert-dialog" data-dl-layer="modal" :style="{ zIndex: contentZIndex }" class="fixed left-1/2 top-1/2 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-[var(--dl-radius-lg)] border border-[var(--dl-border-strong)] [background:var(--dl-panel)] p-6 text-[var(--dl-text)] shadow-[0_34px_100px_rgba(0,0,0,.58)] outline-none backdrop-blur-2xl">
        <span :class="['mb-4 grid size-11 place-items-center rounded-full border text-xl font-black', tone === 'danger' ? 'border-red-300/30 bg-red-400/10 text-red-200' : 'border-amber-300/30 bg-amber-300/10 text-amber-100']">!</span>
        <AlertDialogTitle class="text-xl font-black">{{ title }}</AlertDialogTitle>
        <AlertDialogDescription v-if="description" class="mt-2 text-sm leading-6 text-[var(--dl-text-muted)]">{{ description }}</AlertDialogDescription>
        <div class="mt-6 flex justify-end gap-3">
          <AlertDialogCancel class="min-h-10 rounded-[var(--dl-radius-sm)] border border-[var(--dl-border)] bg-white/[0.06] px-4 text-sm font-bold text-[var(--dl-text)] outline-none hover:bg-white/[0.11] focus-visible:[box-shadow:var(--dl-focus)]" @click="emit('cancel')">{{ cancelLabel }}</AlertDialogCancel>
          <AlertDialogAction :class="['min-h-10 rounded-[var(--dl-radius-sm)] border px-4 text-sm font-bold outline-none focus-visible:[box-shadow:var(--dl-focus)]', tone === 'danger' ? 'border-red-300/25 bg-red-500/85 text-white hover:bg-red-400' : 'border-amber-200/25 [background:var(--dl-button-primary-bg)] text-[var(--dl-button-primary-text)]']" @click="emit('confirm')">{{ confirmLabel }}</AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialogPortal>
  </AlertDialogRoot>
</template>
