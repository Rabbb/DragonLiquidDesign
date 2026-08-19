<script setup lang="ts">
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuRoot, DropdownMenuSeparator, DropdownMenuTrigger } from 'reka-ui'
import { useDlPopoverLayer } from '../composables/useDlLayer'
import type { DlMenuItem } from './primitive.types'

const props = withDefaults(defineProps<{
  open?: boolean
  items: DlMenuItem[]
  label?: string
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  modal?: boolean
  zIndex?: number
}>(), { open: undefined, label: undefined, side: 'bottom', align: 'start', modal: true, zIndex: undefined })
const emit = defineEmits<{ 'update:open': [value: boolean]; select: [value: string] }>()
const layer = useDlPopoverLayer(() => props.zIndex)
</script>

<template>
  <DropdownMenuRoot :open="open" :modal="modal" @update:open="emit('update:open', $event)">
    <DropdownMenuTrigger as-child data-guide-component="dropdown-menu"><slot name="trigger" /></DropdownMenuTrigger>
    <DropdownMenuPortal>
      <DropdownMenuContent data-dl data-slot="dropdown-menu" data-dl-layer="popover" :side="side" :align="align" :side-offset="8" :style="{ zIndex: layer }" class="min-w-52 rounded-[var(--dl-radius-md)] border border-[var(--dl-border-strong)] [background:var(--dl-panel)] p-1.5 text-sm text-[var(--dl-text)] shadow-[0_24px_70px_rgba(0,0,0,.44)] outline-none backdrop-blur-2xl">
        <DropdownMenuLabel v-if="label" class="px-3 py-2 text-xs font-bold uppercase tracking-wider text-[var(--dl-text-faint)]">{{ label }}</DropdownMenuLabel>
        <template v-for="item in items" :key="item.value">
          <DropdownMenuSeparator v-if="item.separator" class="my-1 h-px bg-[var(--dl-border)]" />
          <DropdownMenuItem v-else :disabled="item.disabled" class="flex min-h-9 cursor-default items-center justify-between gap-4 rounded-xl px-3 outline-none data-[disabled]:opacity-40 data-[highlighted]:bg-[var(--dl-surface-hover)] data-[highlighted]:text-[var(--dl-accent-text)]" @select="emit('select', item.value)">
            <slot name="item" :item="item">{{ item.label }}</slot><kbd v-if="item.shortcut" class="text-[10px] text-[var(--dl-text-faint)]">{{ item.shortcut }}</kbd>
          </DropdownMenuItem>
        </template>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>
