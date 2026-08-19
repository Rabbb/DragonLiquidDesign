<script setup lang="ts">
import { ToolbarButton, ToolbarRoot, ToolbarSeparator } from 'reka-ui'
import type { DlMenuItem } from './primitive.types'

withDefaults(defineProps<{
  items: DlMenuItem[]
  orientation?: 'horizontal' | 'vertical'
  loop?: boolean
}>(), { orientation: 'horizontal', loop: true })
const emit = defineEmits<{ action: [value: string] }>()
</script>

<template>
  <ToolbarRoot data-dl data-slot="toolbar" :orientation="orientation" :loop="loop" :class="['inline-flex w-fit gap-1 rounded-[var(--dl-radius-sm)] border border-[var(--dl-border)] bg-[var(--dl-surface)] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,.07)]', orientation === 'vertical' && 'flex-col']" aria-label="工具栏">
    <template v-for="item in items" :key="item.value">
      <ToolbarSeparator v-if="item.separator" :class="orientation === 'horizontal' ? 'mx-1 w-px bg-[var(--dl-border)]' : 'my-1 h-px bg-[var(--dl-border)]'" />
      <ToolbarButton v-else :disabled="item.disabled" class="flex min-h-9 items-center justify-center gap-2 rounded-[9px] px-3 text-sm font-semibold text-[var(--dl-text-muted)] outline-none transition hover:bg-[var(--dl-surface-hover)] hover:text-[var(--dl-text)] focus-visible:[box-shadow:var(--dl-focus)] disabled:opacity-40" @click="emit('action', item.value)">
        <slot name="item" :item="item">{{ item.label }}</slot><kbd v-if="item.shortcut" class="text-[10px] text-[var(--dl-text-faint)]">{{ item.shortcut }}</kbd>
      </ToolbarButton>
    </template>
  </ToolbarRoot>
</template>
