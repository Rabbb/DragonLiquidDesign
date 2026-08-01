<script setup lang="ts">
import { computed } from 'vue'
import { DrawerClose, DrawerContent, DrawerDescription, DrawerHandle, DrawerOverlay, DrawerPortal, DrawerRoot, DrawerTitle, DrawerTrigger } from 'reka-ui'
import { useDlModalLayer } from '../composables/useDlLayer'

const props = withDefaults(defineProps<{
  open?: boolean
  title: string
  description?: string
  placement?: 'bottom' | 'top' | 'left' | 'right'
  modal?: boolean | 'trap-focus'
  closable?: boolean
  zIndex?: number
}>(), { open: false, description: undefined, placement: 'bottom', modal: true, closable: true, zIndex: undefined })
const emit = defineEmits<{ 'update:open': [value: boolean] }>()
const swipeDirection = computed(() => ({ bottom: 'down', top: 'up', left: 'left', right: 'right' } as const)[props.placement])
const placementClass = computed(() => ({
  bottom: 'inset-x-0 bottom-0 max-h-[88vh] rounded-t-[var(--dl-radius-lg)] border-t',
  top: 'inset-x-0 top-0 max-h-[88vh] rounded-b-[var(--dl-radius-lg)] border-b',
  left: 'inset-y-0 left-0 w-[min(420px,90vw)] rounded-r-[var(--dl-radius-lg)] border-r',
  right: 'inset-y-0 right-0 w-[min(420px,90vw)] rounded-l-[var(--dl-radius-lg)] border-l',
}[props.placement]))
const { overlayZIndex, contentZIndex } = useDlModalLayer(() => props.zIndex)
</script>

<template>
  <DrawerRoot :open="open" :modal="modal" :swipe-direction="swipeDirection" @update:open="emit('update:open', $event)">
    <DrawerTrigger v-if="$slots.trigger" as-child><slot name="trigger" /></DrawerTrigger>
    <DrawerPortal>
      <DrawerOverlay data-dl data-dl-layer="overlay" :style="{ zIndex: overlayZIndex }" class="fixed inset-0 bg-[#020805]/75 backdrop-blur-sm" />
      <DrawerContent data-dl data-slot="drawer" data-dl-layer="modal" :style="{ zIndex: contentZIndex }" :class="['fixed overflow-y-auto border-[var(--dl-border-strong)] [background:var(--dl-panel)] p-6 text-[var(--dl-text)] shadow-[0_28px_90px_rgba(0,0,0,.55)] outline-none backdrop-blur-2xl', placementClass]">
        <DrawerHandle v-if="placement === 'bottom' || placement === 'top'" class="mx-auto mb-5 h-1.5 w-12 rounded-full bg-white/20" />
        <header class="mb-5 pr-10"><DrawerTitle class="text-xl font-black">{{ title }}</DrawerTitle><DrawerDescription v-if="description" class="mt-1.5 text-sm leading-6 text-[var(--dl-text-muted)]">{{ description }}</DrawerDescription></header>
        <DrawerClose v-if="closable" class="absolute right-4 top-4 grid size-9 place-items-center rounded-xl border border-white/10 bg-white/[0.06] text-lg text-[var(--dl-text-muted)] hover:bg-white/[0.12] hover:text-white" aria-label="关闭">×</DrawerClose>
        <slot />
        <footer v-if="$slots.footer" class="mt-6 flex justify-end gap-3 border-t border-white/10 pt-5"><slot name="footer" /></footer>
      </DrawerContent>
    </DrawerPortal>
  </DrawerRoot>
</template>
