<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, shallowRef, useId, watch, type ComponentPublicInstance } from 'vue'
import { tv } from 'tailwind-variants'
import { applyDlMdxCommand, insertDlMdxSnippet, type DlMdxSelection } from './dl-mdx.commands'
import { parseDlMdx } from './dl-mdx.parser'
import {
  createDlMdxComponentSnippet,
  useDlMdxRegistry,
  type DlMdxComponentCategory,
  type DlMdxComponentDefinition,
  type DlMdxRegistry,
} from './dl-mdx.registry'
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

type ComponentLibraryEntry = {
  definition: DlMdxComponentDefinition
  snippet: string
}

type ComponentLibraryCategory = 'all' | DlMdxComponentCategory

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
  link: { symbol: '↗', label: '链接', shortcut: 'Ctrl+K' },
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
const lastEditorSelection = ref<DlMdxSelection>({ start: localSource.value.length, end: localSource.value.length })
const componentLibraryOpen = ref(false)
const componentSearch = ref('')
const componentCategory = ref<ComponentLibraryCategory>('all')
const componentLibraryTrigger = ref<HTMLElement>()
const componentLibraryWindow = ref<HTMLElement>()
const componentLibraryPosition = ref({ left: 12, top: 12 })
const componentLibraryId = `dl-mdx-component-library-${useId().replace(/[^A-Za-z0-9_-]/g, '')}`
const componentLibraryTitleId = `${componentLibraryId}-title`
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
const activeRegistry = computed(() => props.registry ?? injectedRegistry)
const componentLibraryEntries = computed<ComponentLibraryEntry[]>(() => (activeRegistry.value?.entries() ?? [])
  .flatMap((definition) => {
    const snippet = createDlMdxComponentSnippet(definition)
    return snippet ? [{ definition, snippet }] : []
  })
  .sort((left, right) => left.definition.name.localeCompare(right.definition.name, 'en')))
const actions = computed(() => (props.toolbar ?? defaultToolbar)
  .filter(action => action !== 'component' || componentLibraryEntries.value.length > 0))
const componentCategoryLabels: Record<ComponentLibraryCategory, string> = {
  all: '全部',
  foundation: '基础',
  form: '表单',
  color: '色彩',
  dates: '日期',
  general: '通用',
}
const availableComponentCategories = computed<ComponentLibraryCategory[]>(() => {
  const categories = new Set(componentLibraryEntries.value.map(entry => entry.definition.category ?? 'general'))
  return ['all', ...(['foundation', 'form', 'color', 'dates', 'general'] as DlMdxComponentCategory[])
    .filter(category => categories.has(category))]
})
const filteredComponentEntries = computed(() => {
  const query = componentSearch.value.trim().toLocaleLowerCase()
  return componentLibraryEntries.value.filter(({ definition }) => {
    const category = definition.category ?? 'general'
    if (componentCategory.value !== 'all' && category !== componentCategory.value) return false
    if (!query) return true
    return [definition.name, definition.description, definition.maturity, category]
      .some(value => value?.toLocaleLowerCase().includes(query))
  })
})
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
watch(() => componentLibraryEntries.value.length, (length) => {
  if (!length) componentLibraryOpen.value = false
  if (!availableComponentCategories.value.includes(componentCategory.value)) componentCategory.value = 'all'
})
watch(componentLibraryOpen, (open) => {
  if (open) {
    window.addEventListener('resize', positionComponentLibrary)
    window.addEventListener('scroll', positionComponentLibrary, true)
    void nextTick(positionComponentLibrary)
  } else {
    window.removeEventListener('resize', positionComponentLibrary)
    window.removeEventListener('scroll', positionComponentLibrary, true)
  }
})
onBeforeUnmount(() => {
  if (parseTimer) clearTimeout(parseTimer)
  window.removeEventListener('resize', positionComponentLibrary)
  window.removeEventListener('scroll', positionComponentLibrary, true)
})

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
  if (action === 'component') {
    if (!componentLibraryEntries.value.length) return
    rememberEditorSelection()
    componentLibraryOpen.value = true
    return
  }
  const selection = editorRef.value?.getSelection() ?? { start: localSource.value.length, end: localSource.value.length }
  const result = applyDlMdxCommand(action, { source: localSource.value, selection })
  if (editorRef.value) editorRef.value.replaceDocument(result.source, result.selection)
  else updateSource(result.source)
}

function rememberEditorSelection() {
  lastEditorSelection.value = editorRef.value?.getSelection() ?? lastEditorSelection.value
}

function updateEditorSelection(selection: DlMdxSelection) {
  lastEditorSelection.value = selection
}

function setComponentLibraryTrigger(element: Element | ComponentPublicInstance | null) {
  componentLibraryTrigger.value = element instanceof HTMLElement ? element : undefined
}

function positionComponentLibrary() {
  const trigger = componentLibraryTrigger.value
  if (!trigger || !componentLibraryOpen.value) return
  const triggerRect = trigger.getBoundingClientRect()
  const windowRect = componentLibraryWindow.value?.getBoundingClientRect()
  const width = windowRect?.width || Math.min(608, window.innerWidth - 24)
  const height = windowRect?.height || Math.min(560, window.innerHeight - 24)
  const below = triggerRect.bottom + 8
  const above = triggerRect.top - height - 8
  const desiredTop = below + height <= window.innerHeight - 12 || above < 12 ? below : above
  componentLibraryPosition.value = {
    left: Math.max(12, Math.min(triggerRect.left, window.innerWidth - width - 12)),
    top: Math.max(12, Math.min(desiredTop, window.innerHeight - height - 12)),
  }
}

function toggleComponentLibrary() {
  if (!canEdit.value || !componentLibraryEntries.value.length) return
  rememberEditorSelection()
  componentLibraryOpen.value = !componentLibraryOpen.value
}

function closeComponentLibrary() {
  componentLibraryOpen.value = false
  void nextTick(() => editorRef.value?.focus())
}

function insertRegisteredComponent(entry: ComponentLibraryEntry) {
  if (!canEdit.value || !componentLibraryEntries.value.includes(entry)) return
  const selection = editorRef.value?.getSelection() ?? lastEditorSelection.value
  const result = insertDlMdxSnippet({ source: localSource.value, selection }, entry.snippet)
  lastEditorSelection.value = result.selection
  if (editorRef.value) editorRef.value.replaceDocument(result.source, result.selection)
  else updateSource(result.source)
  componentLibraryOpen.value = true
  void nextTick(() => {
    componentLibraryOpen.value = true
    editorRef.value?.focus()
    positionComponentLibrary()
  })
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
  <section
    data-dl
    data-slot="mdx"
    :data-toolbar="showToolbar ? 'true' : 'false'"
    :data-status="showStatus ? 'true' : 'false'"
    :class="rootClass"
    :style="rootStyle"
  >
    <header v-if="showToolbar" class="dl-mdx__toolbar">
      <div v-if="localMode !== 'preview'" class="dl-mdx__format-actions" role="toolbar" aria-label="Markdown 格式工具">
        <slot name="toolbar-start" />
        <template v-for="action in actions" :key="action">
          <button
            v-if="action === 'component'"
            :ref="setComponentLibraryTrigger"
            data-slot="mdx-component-library-trigger"
            type="button"
            :disabled="!canEdit"
            :aria-label="toolbarLabels.component.label"
            :aria-expanded="componentLibraryOpen"
            :aria-controls="componentLibraryId"
            title="打开当前安全注册表中的可插入组件"
            @pointerdown="rememberEditorSelection"
            @click="toggleComponentLibrary"
          ><b>{{ toolbarLabels.component.symbol }}</b></button>
          <button
            v-else
            type="button"
            :disabled="!canEdit"
            :aria-label="toolbarLabels[action].label"
            :title="toolbarLabels[action].shortcut ? `${toolbarLabels[action].label} · ${toolbarLabels[action].shortcut}` : toolbarLabels[action].label"
            @click="execute(action)"
          ><b>{{ toolbarLabels[action].symbol }}</b></button>
        </template>
        <slot name="toolbar-end" />
      </div>
      <span v-else class="dl-mdx__preview-label">DRAGON LIQUID · RENDERED DOCUMENT</span>
      <div class="dl-mdx__mode-switch" aria-label="视图模式">
        <button v-for="item in ([['edit', '编辑'], ['split', '分栏'], ['preview', '预览']] as const)" :key="item[0]" type="button" :class="{ active: localMode === item[0] }" :aria-pressed="localMode === item[0]" @click="setMode(item[0])">{{ item[1] }}</button>
      </div>
    </header>

    <Teleport to="body">
      <section
        v-if="componentLibraryOpen"
        :id="componentLibraryId"
        ref="componentLibraryWindow"
        data-dl
        data-slot="mdx-component-library-window"
        class="dl-mdx__component-library-window"
        role="dialog"
        :aria-labelledby="componentLibraryTitleId"
        :style="{ left: `${componentLibraryPosition.left}px`, top: `${componentLibraryPosition.top}px` }"
        @keydown.esc.stop.prevent="closeComponentLibrary"
      >
        <header class="dl-mdx__component-library-header">
          <span>
            <small>MARKDOWNX · TRUSTED REGISTRY</small>
            <b :id="componentLibraryTitleId">安全组件库</b>
          </span>
          <button type="button" aria-label="关闭安全组件库" @click="closeComponentLibrary">×</button>
        </header>
        <div class="dl-mdx__component-library">
          <label class="dl-mdx__component-search">
            <span>搜索安全组件</span>
            <input v-model="componentSearch" type="search" placeholder="按名称或说明筛选" autocomplete="off">
          </label>
          <nav class="dl-mdx__component-categories" aria-label="安全组件分类">
            <button
              v-for="category in availableComponentCategories"
              :key="category"
              type="button"
              :class="{ active: componentCategory === category }"
              :aria-pressed="componentCategory === category"
              @click="componentCategory = category"
            >{{ componentCategoryLabels[category] }}</button>
          </nav>
          <div v-if="filteredComponentEntries.length" class="dl-mdx__component-list" role="list">
            <button
              v-for="entry in filteredComponentEntries"
              :key="entry.definition.name"
              type="button"
              role="listitem"
              :data-component-name="entry.definition.name"
              @mousedown.prevent
              @click="insertRegisteredComponent(entry)"
            >
              <span>
                <b>Dl{{ entry.definition.name }}</b>
                <small>{{ entry.definition.description || '已由当前安全注册表提供' }}</small>
              </span>
              <em>{{ (entry.definition.maturity || 'stable').toUpperCase() }}</em>
            </button>
          </div>
          <p v-else class="dl-mdx__component-empty">当前筛选条件下没有可插入的安全组件。</p>
          <footer class="dl-mdx__component-library-foot">
            仅列出当前注册表中可真实解析的定义；点击后浮窗保持打开。
          </footer>
        </div>
      </section>
    </Teleport>

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
          @selection-change="updateEditorSelection"
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
