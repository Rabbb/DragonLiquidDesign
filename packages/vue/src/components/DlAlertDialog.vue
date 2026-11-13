<script setup lang="ts">
import { AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogOverlay, AlertDialogPortal, AlertDialogRoot, AlertDialogTitle, AlertDialogTrigger } from 'reka-ui'
import { useDlModalLayer } from '../composables/useDlLayer'
import DlButton from './DlButton.vue'

const props = withDefaults(defineProps<{
  open?: boolean
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  /** 请求处理中，禁用操作并阻止 Escape 关闭。 */
  loading?: boolean
  /** 仅禁用确认，保留取消操作。 */
  confirmDisabled?: boolean
  /** 确认后自动关闭；异步确认设为 false，由宿主关闭。 */
  closeOnConfirm?: boolean
  tone?: 'warning' | 'danger'
  zIndex?: number
}>(), { open: false, description: undefined, confirmLabel: '确认', cancelLabel: '取消', loading: false, confirmDisabled: false, closeOnConfirm: true, tone: 'danger', zIndex: undefined })
const emit = defineEmits<{ 'update:open': [value: boolean]; confirm: []; cancel: [] }>()
const { overlayZIndex, contentZIndex } = useDlModalLayer(() => props.zIndex)

const updateOpen = (value: boolean): void => { if (!props.loading) emit('update:open', value) }
const confirm = (): void => {
  if (props.loading || props.confirmDisabled) return
  emit('confirm')
  if (props.closeOnConfirm) emit('update:open', false)
}
const cancel = (): void => { if (!props.loading) emit('cancel') }
const escapeKeyDown = (event: KeyboardEvent): void => { if (props.loading) event.preventDefault() }
</script>

<template>
  <AlertDialogRoot :open="open" @update:open="updateOpen">
    <AlertDialogTrigger v-if="$slots.trigger" as-child><slot name="trigger" /></AlertDialogTrigger>
    <AlertDialogPortal>
      <AlertDialogOverlay data-dl data-dl-layer="overlay" :style="{ zIndex: overlayZIndex }" class="fixed inset-0 bg-[#020805]/80 backdrop-blur-md" />
      <AlertDialogContent data-dl data-slot="alert-dialog" data-dl-layer="modal" data-guide-surface="alert-dialog" :aria-busy="loading || undefined" :style="{ zIndex: contentZIndex }" class="fixed left-1/2 top-1/2 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-[var(--dl-radius-lg)] border border-[var(--dl-border-strong)] [background:var(--dl-panel-background,var(--dl-panel))] p-6 text-[var(--dl-text)] shadow-[0_34px_100px_rgba(0,0,0,.58)] outline-none backdrop-blur-2xl" @escape-key-down="escapeKeyDown">
        <span :class="['mb-4 grid size-11 place-items-center rounded-full border text-xl font-black', tone === 'danger' ? 'border-red-300/50 bg-red-50 text-red-700' : 'border-[var(--dl-accent-border)] bg-[var(--dl-accent-surface)] text-[var(--dl-accent-text)]']">!</span>
        <AlertDialogTitle class="text-xl font-black">{{ title }}</AlertDialogTitle>
        <AlertDialogDescription v-if="description" class="mt-2 text-sm leading-6 text-[var(--dl-text-muted)]">{{ description }}</AlertDialogDescription>
        <div v-if="$slots.default" class="mt-4 text-sm leading-6"><slot /></div>
        <div class="mt-6 flex justify-end gap-3">
          <AlertDialogCancel as-child><DlButton data-guide-closes="alert-dialog" :disabled="loading" @click="cancel">{{ cancelLabel }}</DlButton></AlertDialogCancel>
          <DlButton :variant="tone === 'danger' ? 'danger' : 'primary'" :loading="loading" :disabled="confirmDisabled" @click="confirm">{{ confirmLabel }}</DlButton>
        </div>
      </AlertDialogContent>
    </AlertDialogPortal>
  </AlertDialogRoot>
</template>
