<script setup lang="ts">
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'reka-ui'
import type { DlSplitterPanel } from './primitive.types'

withDefaults(defineProps<{
  panels: DlSplitterPanel[]
  direction?: 'horizontal' | 'vertical'
  keyboardResizeBy?: number
  autoSaveId?: string
}>(), { direction: 'horizontal', keyboardResizeBy: 10 })
const emit = defineEmits<{ layout: [value: number[]] }>()
</script>

<template>
  <SplitterGroup data-dl data-slot="splitter" :direction="direction" :keyboard-resize-by="keyboardResizeBy" :auto-save-id="autoSaveId" :class="['flex size-full overflow-hidden rounded-[var(--dl-radius-md)] border border-[var(--dl-border)] bg-[var(--dl-surface)]', direction === 'vertical' && 'flex-col']" @layout="emit('layout', $event)">
    <template v-for="(panel, index) in panels" :key="panel.id">
      <SplitterPanel :id="panel.id" :order="index" :default-size="panel.defaultSize" :min-size="panel.minSize" :max-size="panel.maxSize" :collapsible="panel.collapsible" class="min-h-0 min-w-0 overflow-auto">
        <slot :name="`panel-${panel.id}`" :panel="panel"><slot :panel="panel" :index="index" /></slot>
      </SplitterPanel>
      <SplitterResizeHandle v-if="index < panels.length - 1" :class="['group relative grid shrink-0 place-items-center bg-[var(--dl-border)] outline-none transition hover:bg-amber-200/45 focus-visible:bg-amber-200/55 data-[state=drag]:bg-amber-200/65', direction === 'horizontal' ? 'w-px cursor-col-resize' : 'h-px cursor-row-resize']">
        <span :class="['absolute rounded-full border border-[var(--dl-border-strong)] bg-[var(--dl-surface-strong)] shadow-lg transition group-hover:border-amber-200/40', direction === 'horizontal' ? 'h-10 w-2' : 'h-2 w-10']" />
      </SplitterResizeHandle>
    </template>
  </SplitterGroup>
</template>
