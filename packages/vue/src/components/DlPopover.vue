<script setup lang="ts">
import { PopoverArrow, PopoverClose, PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'reka-ui'
import { useDlPopoverLayer } from '../composables/useDlLayer'

const props = withDefaults(defineProps<{
  open?: boolean
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  modal?: boolean
  title?: string
  closeLabel?: string
  zIndex?: number
}>(), {
  open: undefined,
  side: 'bottom',
  align: 'center',
  modal: false,
  title: undefined,
  closeLabel: '关闭',
  zIndex: undefined,
})
const emit = defineEmits<{ 'update:open': [value: boolean] }>()
const contentZIndex = useDlPopoverLayer(() => props.zIndex)
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
        :side="side"
        :align="align"
        :side-offset="10"
        :style="{ zIndex: contentZIndex }"
        class="w-72 rounded-[var(--dl-radius-md)] border border-[var(--dl-border-strong)] [background:var(--dl-panel)] p-4 text-sm text-[var(--dl-text-muted)] shadow-[0_24px_70px_rgba(0,0,0,.42),inset_0_1px_0_rgba(255,255,255,.12)] outline-none backdrop-blur-2xl data-[state=open]:animate-in data-[state=closed]:animate-out"
      >
        <div v-if="title || $slots.title" class="mb-3 flex items-start justify-between gap-3">
          <h3 class="font-bold text-[var(--dl-text)]"><slot name="title">{{ title }}</slot></h3>
          <PopoverClose class="grid size-7 shrink-0 place-items-center rounded-lg text-[var(--dl-text-faint)] transition hover:bg-white/[0.08] hover:text-[var(--dl-text)]" :aria-label="closeLabel">×</PopoverClose>
        </div>
        <slot />
        <PopoverArrow class="fill-[rgba(20,54,36,.95)]" />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
