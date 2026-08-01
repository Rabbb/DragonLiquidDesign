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

const props = withDefaults(defineProps<{
  open?: boolean
  title: string
  description?: string
  size?: 'sm' | 'md' | 'lg'
  closable?: boolean
  zIndex?: number
}>(), {
  open: false,
  description: undefined,
  size: 'md',
  closable: true,
  zIndex: undefined,
})

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const sizeClasses: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
}

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
        class="fixed inset-0 bg-[#020805]/75 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out"
      />
      <DialogContent
        data-dl
        data-slot="dialog"
        data-dl-layer="modal"
        :style="{ zIndex: contentZIndex }"
        :class="[
          'fixed left-1/2 top-1/2 max-h-[90vh] w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[var(--dl-radius-lg)] border border-[var(--dl-border-strong)] [background:var(--dl-panel)] p-6 text-[var(--dl-text)] shadow-[0_34px_100px_rgba(0,0,0,.55),0_0_50px_rgba(255,215,0,.06),inset_0_1px_0_rgba(255,255,255,.18)] backdrop-blur-2xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out',
          sizeClasses[size],
        ]"
      >
        <div class="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-amber-100/50 to-transparent" />
        <header class="mb-5 pr-10">
          <DialogTitle class="text-xl font-black tracking-tight text-slate-50">{{ title }}</DialogTitle>
          <DialogDescription v-if="description" class="mt-1.5 text-sm leading-6 text-[var(--dl-text-muted)]">
            {{ description }}
          </DialogDescription>
        </header>
        <DialogClose
          v-if="closable"
          class="absolute right-4 top-4 inline-flex size-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-lg text-[var(--dl-text-muted)] outline-none transition hover:bg-white/[0.12] hover:text-white focus-visible:[box-shadow:var(--dl-focus)]"
          aria-label="关闭"
        >
          ×
        </DialogClose>
        <div><slot /></div>
        <footer v-if="$slots.footer" class="mt-6 flex flex-wrap justify-end gap-3 border-t border-white/10 pt-5">
          <slot name="footer" />
        </footer>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
