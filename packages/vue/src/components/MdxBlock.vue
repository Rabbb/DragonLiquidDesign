<script setup lang="ts">
import { computed, type Slots } from 'vue'
import type { DlMdxRegistry } from './dl-mdx.registry'
import type { DlMdxSecurityPolicy } from './dl-mdx.security'
import type { DlMdxBlock, DlMdxLinkPolicy } from './dl-mdx.types'
import { highlightDlMdxCodeWithRust } from './dl-mdx.rust'
import MdxInline from './MdxInline.vue'
import MdxRegisteredComponent from './MdxRegisteredComponent'

const props = defineProps<{
  block: DlMdxBlock
  linkPolicy: Required<DlMdxLinkPolicy>
  taskInteractive: boolean
  copiedCodeId?: string
  copyFailedId?: string
  componentSlots: Slots
  registry?: DlMdxRegistry
  securityPolicy?: DlMdxSecurityPolicy
}>()

const emit = defineEmits<{
  'toggle-task': [line: number]
  'copy-code': [id: string, source: string]
}>()

const highlightedCode = computed(() => {
  if (props.block.type !== 'code') return undefined
  try {
    return highlightDlMdxCodeWithRust(props.block.value, props.block.language)
  } catch {
    return {
      language: 'text',
      supported: false,
      lines: props.block.value.split('\n').map(value => value ? [{ kind: 'plain' as const, value }] : []),
    }
  }
})
const componentSlot = computed(() => {
  if (props.block.type !== 'component') return ''
  const normalized = props.block.context.name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/[^A-Za-z0-9-]+/g, '-').toLowerCase()
  return `component-${normalized}`
})
const registeredDefinition = computed(() => props.block.type === 'component' ? props.registry?.resolve(props.block.context.name) : undefined)

function forwardCopy(id: string, source: string) { emit('copy-code', id, source) }
</script>

<template>
  <component :is="`h${block.level}`" v-if="block.type === 'heading'" :id="block.id" class="dl-mdx__heading">
    <a :href="`#${block.id}`" tabindex="-1" aria-hidden="true">#</a><MdxInline :tokens="block.tokens" :link-policy="linkPolicy" :security-policy="securityPolicy" />
  </component>

  <p v-else-if="block.type === 'paragraph'" class="dl-mdx__paragraph"><MdxInline :tokens="block.tokens" :link-policy="linkPolicy" :security-policy="securityPolicy" /></p>

  <blockquote v-else-if="block.type === 'blockquote'" class="dl-mdx__blockquote">
    <MdxBlock
      v-for="(child, index) in block.blocks"
      :key="index"
      :block="child"
      :link-policy="linkPolicy"
      :task-interactive="taskInteractive"
      :copied-code-id="copiedCodeId"
      :copy-failed-id="copyFailedId"
      :component-slots="componentSlots"
      :registry="registry"
      :security-policy="securityPolicy"
      @toggle-task="emit('toggle-task', $event)"
      @copy-code="forwardCopy"
    />
  </blockquote>

  <component :is="block.ordered ? 'ol' : 'ul'" v-else-if="block.type === 'list'" :start="block.ordered ? block.start : undefined" :class="['dl-mdx__list', { 'is-ordered': block.ordered, 'is-task-list': block.items.some(item => item.checked !== undefined) }]">
    <li v-for="(item, itemIndex) in block.items" :key="`${item.sourceLine}-${itemIndex}`" :class="{ 'is-task': item.checked !== undefined, 'is-checked': item.checked }">
      <label v-if="item.checked !== undefined" class="dl-mdx__task">
        <input type="checkbox" :checked="item.checked" :disabled="!taskInteractive" :aria-label="`${item.checked ? '标记未完成' : '标记完成'}：任务 ${itemIndex + 1}`" @change="emit('toggle-task', item.sourceLine)">
        <span><MdxInline :tokens="item.tokens" :link-policy="linkPolicy" :security-policy="securityPolicy" /></span>
      </label>
      <MdxInline v-else :tokens="item.tokens" :link-policy="linkPolicy" :security-policy="securityPolicy" />
      <MdxBlock
        v-for="(child, childIndex) in item.children"
        :key="childIndex"
        :block="child"
        :link-policy="linkPolicy"
        :task-interactive="taskInteractive"
        :copied-code-id="copiedCodeId"
        :copy-failed-id="copyFailedId"
        :component-slots="componentSlots"
        :registry="registry"
        :security-policy="securityPolicy"
        @toggle-task="emit('toggle-task', $event)"
        @copy-code="forwardCopy"
      />
    </li>
  </component>

  <div v-else-if="block.type === 'table'" class="dl-mdx__table-shell">
    <table>
      <thead><tr><th v-for="(cell, index) in block.headers" :key="index" :style="{ textAlign: block.alignments[index] ?? 'left' }"><MdxInline :tokens="cell" :link-policy="linkPolicy" :security-policy="securityPolicy" /></th></tr></thead>
      <tbody><tr v-for="(row, rowIndex) in block.rows" :key="rowIndex"><td v-for="(cell, index) in row" :key="index" :style="{ textAlign: block.alignments[index] ?? 'left' }"><MdxInline :tokens="cell" :link-policy="linkPolicy" :security-policy="securityPolicy" /></td></tr></tbody>
    </table>
  </div>

  <div
    v-else-if="block.type === 'code'"
    class="dl-mdx__code"
    :data-language="highlightedCode?.language || 'text'"
    :data-highlighted="highlightedCode?.supported ? 'true' : 'false'"
  >
    <div class="dl-mdx__code-toolbar">
      <span>{{ block.language || 'text' }}</span>
      <button type="button" :class="{ 'is-copied': copiedCodeId === block.id, 'is-failed': copyFailedId === block.id }" @click="emit('copy-code', block.id, block.value)">
        {{ copiedCodeId === block.id ? '已复制' : copyFailedId === block.id ? '复制失败' : '复制代码' }}
      </button>
    </div>
    <pre><code><span v-for="(line, index) in highlightedCode?.lines || []" :key="index" class="dl-mdx__code-line"><span class="dl-mdx__code-line-number" aria-hidden="true">{{ index + 1 }}</span><span class="dl-mdx__code-line-content"><span v-for="(token, tokenIndex) in line" :key="tokenIndex" :class="`dl-mdx__code-token--${token.kind}`">{{ token.value }}</span>{{ index < (highlightedCode?.lines.length || 0) - 1 ? '\n' : '' }}</span></span></code></pre>
  </div>

  <hr v-else-if="block.type === 'divider'" class="dl-mdx__divider">

  <section v-else-if="block.type === 'component'" class="dl-mdx__component-block" :data-component="block.context.name">
    <component v-if="componentSlots[componentSlot]" :is="componentSlots[componentSlot]" :context="block.context" :props="block.context.props" />
    <MdxRegisteredComponent v-else-if="registeredDefinition" :definition="registeredDefinition" :context="block.context" />
    <div v-else class="dl-mdx__unknown-component">
      <span>SAFE COMPONENT SLOT</span>
      <strong>{{ block.context.name }}</strong>
      <p>提供 <code>#{{ componentSlot }}</code> 插槽后才会渲染该组件，文档内容不会执行任意组件或脚本。</p>
    </div>
  </section>
</template>
