<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, shallowRef, watch } from 'vue'
import { tv } from 'tailwind-variants'
import { applyDlMdxCommand } from './dl-mdx.commands'
import { parseDlMdx } from './dl-mdx.parser'
import { useDlMdxRegistry, type DlMdxRegistry } from './dl-mdx.registry'
import { useDlMdxSecurityPolicy } from './dl-mdx.security'
import type {
  DlMdxDocument,
  DlMdxLinkPolicy,
  DlMdxMode,
  DlMdxParseResult,
  DlMdxToolbarAction,
} from './dl-mdx.types'
import MdxEditor from './MdxEditor.vue'
import MdxPreview from './MdxPreview.vue'

const props = withDefaults(defineProps<{
  modelValue?: string | null
  mode?: DlMdxMode
  toolbar?: DlMdxToolbarAction[]
  linkPolicy?: DlMdxLinkPolicy
  placeholder?: string
  emptyText?: string
  readonly?: boolean
  disabled?: boolean
  lineWrapping?: boolean
  showToolbar?: boolean
  showStatus?: boolean
  taskInteractive?: boolean
  debounce?: number
  minHeight?: string
  maxPreviewHeight?: string
  ariaLabel?: string
  registry?: DlMdxRegistry
}>(), {
  modelValue: '',
  mode: 'split',
  toolbar: undefined,
  linkPolicy: undefined,
  placeholder: '开始书写 Markdown…',
  emptyText: '还没有可预览的内容。',
  readonly: false,
  disabled: false,
  lineWrapping: true,
  showToolbar: true,
  showStatus: true,
  taskInteractive: true,
  debounce: 120,
  minHeight: '28rem',
  maxPreviewHeight: 'none',
  ariaLabel: 'MarkdownX 文档',
  registry: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'update:mode': [mode: DlMdxMode]
  parse: [result: DlMdxParseResult]
  error: [error: Error]
}>()

const defaultToolbar: DlMdxToolbarAction[] = ['bold', 'italic', 'strike', 'inline-code', 'link', 'heading', 'blockquote', 'unordered-list', 'task-list', 'code-block', 'component']
const toolbarLabels: Record<DlMdxToolbarAction, { symbol: string; label: string; shortcut?: string }> = {
  bold: { symbol: 'B', label: '粗体', shortcut: 'Ctrl+B' },
  italic: { symbol: 'I', label: '斜体', shortcut: 'Ctrl+I' },
  strike: { symbol: 'S', label: '删除线' },
  'inline-code': { symbol: '<>', label: '行内代码' },
  link: { symbol: '↗', label: '链接' },
  heading: { symbol: 'H2', label: '二级标题' },
  blockquote: { symbol: '❯', label: '引用' },
  'unordered-list': { symbol: '•', label: '无序列表' },
  'task-list': { symbol: '☑', label: '任务列表' },
  'code-block': { symbol: '{}', label: '代码块' },
  component: { symbol: '◇', label: '安全组件块' },
}

const localSource = ref(props.modelValue ?? '')
const localMode = ref<DlMdxMode>(props.mode)
const editorRef = ref<InstanceType<typeof MdxEditor>>()
const injectedRegistry = useDlMdxRegistry()
const injectedSecurityPolicy = useDlMdxSecurityPolicy()
const document = shallowRef<DlMdxDocument>(parseDlMdx(localSource.value))
const parsing = ref(false)
let parseTimer: ReturnType<typeof setTimeout> | undefined

const policy = computed<Required<DlMdxLinkPolicy>>(() => ({
  allowExternal: props.linkPolicy?.allowExternal ?? true,
  openExternal: props.linkPolicy?.openExternal ?? true,
  allowImages: props.linkPolicy?.allowImages ?? true,
  allowDataImages: props.linkPolicy?.allowDataImages ?? false,
}))
const actions = computed(() => props.toolbar ?? defaultToolbar)
const activeRegistry = computed(() => props.registry ?? injectedRegistry)
const canEdit = computed(() => !props.readonly && !props.disabled)
const rootClass = computed(() => tv({
  base: 'dl-mdx',
  variants: {
    mode: { edit: 'dl-mdx--edit', preview: 'dl-mdx--preview', split: 'dl-mdx--split' },
    disabled: { true: 'is-disabled', false: '' },
  },
})({ mode: localMode.value, disabled: props.disabled }))
const rootStyle = computed(() => ({ '--dl-mdx-min-height': props.minHeight, '--dl-mdx-preview-max-height': props.maxPreviewHeight }))

watch(() => props.modelValue, value => {
  if ((value ?? '') !== localSource.value) localSource.value = value ?? ''
})
watch(() => props.mode, value => { localMode.value = value })
watch(localSource, scheduleParse, { immediate: true })
watch(() => props.debounce, scheduleParse)
onBeforeUnmount(() => { if (parseTimer) clearTimeout(parseTimer) })

function scheduleParse() {
  if (parseTimer) clearTimeout(parseTimer)
  parsing.value = true
  const run = () => {
    try {
      document.value = parseDlMdx(localSource.value)
      parsing.value = false
      emit('parse', document.value.stats)
    } catch (cause) {
      parsing.value = false
      emit('error', cause instanceof Error ? cause : new Error(String(cause)))
    }
  }
  if (props.debounce <= 0) run()
  else parseTimer = setTimeout(run, props.debounce)
}

function updateSource(value: string) {
  localSource.value = value
  emit('update:modelValue', value)
}

function setMode(value: DlMdxMode) {
  localMode.value = value
  emit('update:mode', value)
  if (value !== 'preview') nextTick(() => editorRef.value?.focus())
}

function execute(action: DlMdxToolbarAction) {
  if (!canEdit.value) return
  const selection = editorRef.value?.getSelection() ?? { start: localSource.value.length, end: localSource.value.length }
  const result = applyDlMdxCommand(action, { source: localSource.value, selection })
  if (editorRef.value) editorRef.value.replaceDocument(result.source, result.selection)
  else updateSource(result.source)
}

function toggleTask(line: number) {
  if (!props.taskInteractive || !canEdit.value) return
  const lines = localSource.value.split('\n')
  if (!lines[line]) return
  lines[line] = lines[line].replace(/^(\s*(?:>\s*)*(?:[-+*]|\d+[.)])\s+\[)([ xX])(\]\s+)/, (_, start: string, state: string, end: string) => `${start}${state.toLowerCase() === 'x' ? ' ' : 'x'}${end}`)
  updateSource(lines.join('\n'))
}
</script>

<template>
  <section data-dl data-slot="mdx" :class="rootClass" :style="rootStyle">
    <header v-if="showToolbar" class="dl-mdx__toolbar">
      <div v-if="localMode !== 'preview'" class="dl-mdx__format-actions" role="toolbar" aria-label="Markdown 格式工具">
        <slot name="toolbar-start" />
        <button
          v-for="action in actions"
          :key="action"
          type="button"
          :disabled="!canEdit"
          :aria-label="toolbarLabels[action].label"
          :title="toolbarLabels[action].shortcut ? `${toolbarLabels[action].label} · ${toolbarLabels[action].shortcut}` : toolbarLabels[action].label"
          @click="execute(action)"
        ><b>{{ toolbarLabels[action].symbol }}</b></button>
        <slot name="toolbar-end" />
      </div>
      <span v-else class="dl-mdx__preview-label">DRAGON LIQUID · RENDERED DOCUMENT</span>
      <div class="dl-mdx__mode-switch" aria-label="视图模式">
        <button v-for="item in ([['edit', '编辑'], ['split', '分栏'], ['preview', '预览']] as const)" :key="item[0]" type="button" :class="{ active: localMode === item[0] }" :aria-pressed="localMode === item[0]" @click="setMode(item[0])">{{ item[1] }}</button>
      </div>
    </header>

    <div class="dl-mdx__workspace">
      <section v-show="localMode !== 'preview'" class="dl-mdx__editor-pane" aria-label="Markdown 源码">
        <MdxEditor
          ref="editorRef"
          :model-value="localSource"
          :placeholder="placeholder"
          :readonly="readonly"
          :disabled="disabled"
          :line-wrapping="lineWrapping"
          :aria-label="`${ariaLabel}编辑器`"
          @update:model-value="updateSource"
          @command="execute"
          @error="emit('error', $event)"
        />
      </section>
      <section v-show="localMode !== 'edit'" class="dl-mdx__preview-pane" :aria-busy="parsing">
        <div v-if="parsing" class="dl-mdx__parsing"><i />正在更新预览</div>
        <MdxPreview
          :document="document"
          :link-policy="policy"
          :task-interactive="taskInteractive && canEdit"
          :empty-text="emptyText"
          :ariaLabel="`${ariaLabel}预览`"
          :component-slots="$slots"
          :registry="activeRegistry"
          :security-policy="injectedSecurityPolicy"
          @toggle-task="toggleTask"
          @error="emit('error', $event)"
        />
      </section>
    </div>

    <footer v-if="showStatus" class="dl-mdx__status">
      <span :class="{ busy: parsing }"><i />{{ parsing ? '解析中' : '预览已同步' }}</span>
      <span>{{ document.stats.lineCount }} 行</span>
      <span>{{ document.stats.sourceLength }} 字符</span>
      <span>约 {{ document.stats.readingMinutes }} 分钟阅读</span>
      <span class="dl-mdx__status-spacer" />
      <span>MarkdownX · Safe Preview</span>
    </footer>
  </section>
</template>
