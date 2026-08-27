<script setup lang="ts">
import { ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuPortal, ContextMenuRoot, ContextMenuSeparator, ContextMenuTrigger } from 'reka-ui'
import { useDlPopoverLayer } from '../composables/useDlLayer'
import type { DlMenuItem } from './primitive.types'

const props = withDefaults(defineProps<{ items: DlMenuItem[]; label?: string; modal?: boolean; zIndex?: number }>(), { label: undefined, modal: true, zIndex: undefined })
const emit = defineEmits<{ select: [value: string] }>()
const layer = useDlPopoverLayer(() => props.zIndex)

function handleTriggerKeydown(event: KeyboardEvent) {
  if (event.key !== 'ContextMenu' && !(event.shiftKey && event.key === 'F10')) return
  event.preventDefault()
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  target.dispatchEvent(new MouseEvent('contextmenu', {
    bubbles: true,
    cancelable: true,
    clientX: rect.left + Math.min(16, rect.width / 2),
    clientY: rect.top + Math.min(16, rect.height / 2),
  }))
}
</script>

<template>
  <ContextMenuRoot :modal="modal">
    <ContextMenuTrigger as-child tabindex="0" aria-haspopup="menu" aria-keyshortcuts="Shift+F10 ContextMenu" @keydown="handleTriggerKeydown"><slot /></ContextMenuTrigger>
    <ContextMenuPortal>
      <ContextMenuContent data-dl data-slot="context-menu" data-dl-layer="popover" :style="{ zIndex: layer }" class="min-w-52 rounded-[var(--dl-radius-md)] border border-[var(--dl-border-strong)] [background:var(--dl-panel)] p-1.5 text-sm text-[var(--dl-text)] shadow-[0_24px_70px_rgba(0,0,0,.44)] outline-none backdrop-blur-2xl">
        <ContextMenuLabel v-if="label" class="px-3 py-2 text-xs font-bold uppercase tracking-wider text-[var(--dl-text-faint)]">{{ label }}</ContextMenuLabel>
        <template v-for="item in items" :key="item.value">
          <ContextMenuSeparator v-if="item.separator" class="my-1 h-px bg-[var(--dl-border)]" />
          <ContextMenuItem v-else :disabled="item.disabled" class="flex min-h-9 cursor-default items-center justify-between gap-4 rounded-xl px-3 outline-none data-[disabled]:opacity-40 data-[highlighted]:bg-[var(--dl-surface-hover)] data-[highlighted]:text-[var(--dl-accent-text)]" @select="emit('select', item.value)">
            <slot name="item" :item="item">{{ item.label }}</slot><kbd v-if="item.shortcut" class="text-[10px] text-[var(--dl-text-faint)]">{{ item.shortcut }}</kbd>
          </ContextMenuItem>
        </template>
      </ContextMenuContent>
    </ContextMenuPortal>
  </ContextMenuRoot>
</template>
