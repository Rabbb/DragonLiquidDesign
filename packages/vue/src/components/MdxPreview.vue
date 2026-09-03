<script setup lang="ts">
import { ref, type Slots } from 'vue'
import type { DlMdxActionInvocation, DlMdxActionMap, DlMdxRegistry } from './dl-mdx.registry'
import type { DlMdxSecurityPolicy } from './dl-mdx.security'
import type { DlMdxBlock as DlMdxBlockValue, DlMdxDocument, DlMdxLinkPolicy } from './dl-mdx.types'
import MdxBlock from './MdxBlock.vue'

defineProps<{
  document: DlMdxDocument
  linkPolicy: Required<DlMdxLinkPolicy>
  taskInteractive: boolean
  lockLiteralBindings: boolean
  emptyText: string
  ariaLabel: string
  componentSlots: Slots
  registry?: DlMdxRegistry
  actions?: DlMdxActionMap
  securityPolicy?: DlMdxSecurityPolicy
  editable?: boolean
}>()

const emit = defineEmits<{
  'toggle-task': [line: number]
  error: [error: Error]
  action: [invocation: DlMdxActionInvocation]
  'edit-request': []
}>()

const copiedCodeId = ref<string>()
const copyFailedId = ref<string>()
let resetTimer: ReturnType<typeof setTimeout> | undefined

async function copyCode(id: string, source: string) {
  if (resetTimer) clearTimeout(resetTimer)
  try {
    if (!navigator.clipboard?.writeText) throw new Error('当前浏览器未开放 Clipboard API')
    await navigator.clipboard.writeText(source)
    copiedCodeId.value = id
    copyFailedId.value = undefined
  } catch (cause) {
    copiedCodeId.value = undefined
    copyFailedId.value = id
    emit('error', cause instanceof Error ? cause : new Error(String(cause)))
  }
  resetTimer = setTimeout(() => {
    copiedCodeId.value = undefined
    copyFailedId.value = undefined
  }, 1800)
}

function blockKey(block: DlMdxBlockValue, index: number): string {
  if (block.type === 'component') {
    return `component:${block.context.name}:${block.context.id ?? block.context.sourceLine}`
  }
  if (block.type === 'heading' || block.type === 'code') return `${block.type}:${block.id}`
  return `${block.type}:${index}`
}

function requestEdit(event: MouseEvent) {
  if (!event.currentTarget || (event.target as Element | null)?.closest('a, button, input, textarea, select, [contenteditable="true"]')) return
  emit('edit-request')
}
</script>

<template>
  <article class="dl-mdx__document" :class="{ 'is-editable': editable }" :aria-label="ariaLabel" :title="editable ? '双击进入源码编辑，Esc 返回渲染' : undefined" @dblclick="editable && requestEdit($event)">
    <div v-if="!document.blocks.length" class="dl-mdx__empty">
      <component v-if="componentSlots.empty" :is="componentSlots.empty" />
      <template v-else>{{ emptyText }}</template>
    </div>
    <MdxBlock
      v-for="(block, index) in document.blocks"
      v-else
      :key="blockKey(block, index)"
      :block="block"
      :link-policy="linkPolicy"
      :task-interactive="taskInteractive"
      :lock-literal-bindings="lockLiteralBindings"
      :copied-code-id="copiedCodeId"
      :copy-failed-id="copyFailedId"
      :component-slots="componentSlots"
      :registry="registry"
      :actions="actions"
      :security-policy="securityPolicy"
      @toggle-task="emit('toggle-task', $event)"
      @copy-code="copyCode"
      @action="emit('action', $event)"
    />
  </article>
</template>
