<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, shallowRef, useId, watch, type ComponentPublicInstance } from 'vue'
import { tv } from 'tailwind-variants'
import { applyDlMdxCommand, insertDlMdxSnippet, type DlMdxSelection } from './dl-mdx.commands'
import {
  analyzeDlMdx,
  extractDlMdxActionSymbols,
  formatDlMdx,
  type DlMdxFormatOptions,
  type DlMdxLanguageAnalysis,
  type DlMdxLanguageOptions,
} from './dl-mdx.language'
import { parseDlMdx } from './dl-mdx.parser'
import {
  createDlMdxComponentSnippet,
  useDlMdxRegistry,
  type DlMdxComponentCategory,
  type DlMdxComponentDefinition,
  type DlMdxActionInvocation,
  type DlMdxActionMap,
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
type DlMdxWorkspaceDocument = 'mdx' | 'script' | 'style'

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
  actions?: DlMdxActionMap
  scriptValue?: string | null
  styleValue?: string | null
  showCompanionDocuments?: boolean
  scriptLanguage?: 'javascript' | 'typescript'
  languageOptions?: DlMdxLanguageOptions
  formatOptions?: DlMdxFormatOptions
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
  scriptValue: null,
  styleValue: null,
  showCompanionDocuments: false,
  scriptLanguage: 'typescript',
  languageOptions: undefined,
  formatOptions: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'update:scriptValue': [value: string]
  'update:styleValue': [value: string]
  'update:mode': [mode: DlMdxMode]
  parse: [result: DlMdxParseResult]
  error: [error: Error]
  action: [invocation: DlMdxActionInvocation]
  diagnostics: [analysis: DlMdxLanguageAnalysis]
}>()

const defaultToolbar: DlMdxToolbarAction[] = ['bold', 'italic', 'strike', 'inline-code', 'link', 'heading', 'blockquote', 'unordered-list', 'task-list', 'code-block', 'component', 'format']
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
  format: { symbol: '↹', label: '格式化主文档', shortcut: 'Shift+Alt+F' },
}

const localSource = ref(props.modelValue ?? '')
const localScript = ref(props.scriptValue ?? '')
const localStyle = ref(props.styleValue ?? '')
const activeDocument = ref<DlMdxWorkspaceDocument>('mdx')
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
const languageAnalysis = shallowRef<DlMdxLanguageAnalysis>({ diagnostics: [], components: [], errorCount: 0, warningCount: 0 })
const parsing = ref(false)
let parseTimer: ReturnType<typeof setTimeout> | undefined

const policy = computed<Required<DlMdxLinkPolicy>>(() => ({
  allowExternal: props.linkPolicy?.allowExternal ?? true,
  openExternal: props.linkPolicy?.openExternal ?? true,
  allowImages: props.linkPolicy?.allowImages ?? true,
  allowDataImages: props.linkPolicy?.allowDataImages ?? false,
}))
const activeRegistry = computed(() => props.registry ?? injectedRegistry)
const showDocumentTabs = computed(() => props.showCompanionDocuments || props.scriptValue !== null || props.styleValue !== null)
const scriptSymbols = computed(() => extractDlMdxActionSymbols(localScript.value))
const effectiveLanguageOptions = computed<DlMdxLanguageOptions>(() => {
  const hostActions = Object.keys(props.actions ?? {})
  const documentedActions = scriptSymbols.value.map(symbol => symbol.name)
  const actionNames = [...new Set([...(props.languageOptions?.actionNames ?? []), ...hostActions, ...documentedActions])]
  const scriptDescriptions = Object.fromEntries(scriptSymbols.value.filter(symbol => symbol.description).map(symbol => [symbol.name, symbol.description!]))
  return {
    ...props.languageOptions,
    actionNames,
    actionDescriptions: { ...scriptDescriptions, ...(props.languageOptions?.actionDescriptions ?? {}) },
  }
})
const componentLibraryEntries = computed<ComponentLibraryEntry[]>(() => (activeRegistry.value?.entries() ?? [])
  .flatMap((definition) => {
    const snippet = createDlMdxComponentSnippet(definition)
    return snippet ? [{ definition, snippet }] : []
  })
  .sort((left, right) => left.definition.name.localeCompare(right.definition.name, 'en')))
const toolbarActions = computed(() => (props.toolbar ?? defaultToolbar)
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
const activeDocumentSource = computed(() => activeDocument.value === 'script' ? localScript.value : activeDocument.value === 'style' ? localStyle.value : localSource.value)
const activeDocumentLineCount = computed(() => activeDocumentSource.value.split('\n').length)
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
watch(() => props.scriptValue, value => {
  if ((value ?? '') !== localScript.value) localScript.value = value ?? ''
})
watch(() => props.styleValue, value => {
  if ((value ?? '') !== localStyle.value) localStyle.value = value ?? ''
})
watch(() => props.mode, value => { localMode.value = value })
watch(localSource, scheduleParse, { immediate: true })
watch(() => props.debounce, scheduleParse)
watch([activeRegistry, effectiveLanguageOptions], scheduleParse, { deep: true })
watch(showDocumentTabs, visible => { if (!visible) activeDocument.value = 'mdx' })
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
      languageAnalysis.value = analyzeDlMdx(localSource.value, activeRegistry.value, effectiveLanguageOptions.value)
      parsing.value = false
      emit('parse', document.value.stats)
      emit('diagnostics', languageAnalysis.value)
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

function updateScript(value: string) {
  localScript.value = value
  emit('update:scriptValue', value)
}

function updateStyle(value: string) {
  localStyle.value = value
  emit('update:styleValue', value)
}

function setMode(value: DlMdxMode) {
  localMode.value = value
  emit('update:mode', value)
  if (value !== 'preview') nextTick(() => editorRef.value?.focus())
}

function execute(action: DlMdxToolbarAction) {
  if (!canEdit.value) return
  if (action === 'format') {
    const source = formatDlMdx(localSource.value, props.formatOptions, activeRegistry.value)
    const current = editorRef.value?.getSelection() ?? lastEditorSelection.value
    const selection = { start: Math.min(current.start, source.length), end: Math.min(current.end, source.length) }
    if (editorRef.value) editorRef.value.replaceDocument(source, selection)
    else updateSource(source)
    return
  }
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
    :data-documents="showDocumentTabs ? 'true' : 'false'"
    :class="rootClass"
    :style="rootStyle"
  >
    <header v-if="showToolbar" class="dl-mdx__toolbar">
      <div v-if="localMode !== 'preview' && activeDocument === 'mdx'" class="dl-mdx__format-actions" role="toolbar" aria-label="Markdown 格式工具">
        <slot name="toolbar-start" />
        <template v-for="action in toolbarActions" :key="action">
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
      <span v-else class="dl-mdx__preview-label">{{ activeDocument === 'mdx' ? 'DRAGON LIQUID · RENDERED DOCUMENT' : `${activeDocument.toUpperCase()} · COMPANION DOCUMENT` }}</span>
      <div v-if="activeDocument === 'mdx'" class="dl-mdx__mode-switch" aria-label="视图模式">
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

    <nav v-if="showDocumentTabs" class="dl-mdx__document-tabs" aria-label="MarkdownX 文档工作区">
      <button type="button" :class="{ active: activeDocument === 'mdx' }" :aria-pressed="activeDocument === 'mdx'" @click="activeDocument = 'mdx'">MDX <small>STRUCTURE</small></button>
      <button type="button" :class="{ active: activeDocument === 'script' }" :aria-pressed="activeDocument === 'script'" @click="activeDocument = 'script'">SCRIPT <small>{{ scriptLanguage.toUpperCase() }}</small></button>
      <button type="button" :class="{ active: activeDocument === 'style' }" :aria-pressed="activeDocument === 'style'" @click="activeDocument = 'style'">STYLE <small>CSS</small></button>
      <span>MDX 为主文档，脚本与样式独立保存</span>
    </nav>

    <div class="dl-mdx__workspace" :class="{ 'is-companion': activeDocument !== 'mdx' }">
      <section v-show="activeDocument === 'mdx' && localMode !== 'preview'" class="dl-mdx__editor-pane" aria-label="Markdown 源码">
        <MdxEditor
          ref="editorRef"
          :model-value="localSource"
          :placeholder="placeholder"
          :readonly="readonly"
          :disabled="disabled"
          :line-wrapping="lineWrapping"
          :aria-label="`${ariaLabel}编辑器`"
          document-language="mdx"
          :registry="activeRegistry"
          :language-options="effectiveLanguageOptions"
          @update:model-value="updateSource"
          @selection-change="updateEditorSelection"
          @command="execute"
          @error="emit('error', $event)"
        />
      </section>
      <section v-show="activeDocument === 'mdx' && localMode !== 'edit'" class="dl-mdx__preview-pane" :aria-busy="parsing">
        <div v-if="parsing" class="dl-mdx__parsing"><i />正在更新预览</div>
        <MdxPreview
          :document="document"
          :link-policy="policy"
          :task-interactive="taskInteractive && canEdit"
          :empty-text="emptyText"
          :ariaLabel="`${ariaLabel}预览`"
          :component-slots="$slots"
          :registry="activeRegistry"
          :actions="props.actions"
          :security-policy="injectedSecurityPolicy"
          @toggle-task="toggleTask"
          @error="emit('error', $event)"
          @action="emit('action', $event)"
        />
      </section>
      <section v-show="activeDocument === 'script'" class="dl-mdx__editor-pane dl-mdx__editor-pane--companion" aria-label="脚本附加文档">
        <MdxEditor
          :key="scriptLanguage"
          :model-value="localScript"
          placeholder="export function actionName(context) { }"
          :readonly="readonly"
          :disabled="disabled"
          :line-wrapping="lineWrapping"
          :aria-label="`${ariaLabel}脚本附加文档`"
          :document-language="scriptLanguage"
          @update:model-value="updateScript"
          @error="emit('error', $event)"
        />
      </section>
      <section v-show="activeDocument === 'style'" class="dl-mdx__editor-pane dl-mdx__editor-pane--companion" aria-label="样式附加文档">
        <MdxEditor
          :model-value="localStyle"
          placeholder=".document-card { color: var(--dl-text); }"
          :readonly="readonly"
          :disabled="disabled"
          :line-wrapping="lineWrapping"
          :aria-label="`${ariaLabel}样式附加文档`"
          document-language="css"
          @update:model-value="updateStyle"
          @error="emit('error', $event)"
        />
      </section>
    </div>

    <footer v-if="showStatus" class="dl-mdx__status">
      <span :class="{ busy: parsing }"><i />{{ parsing ? '解析中' : '预览已同步' }}</span>
      <span>{{ activeDocumentLineCount }} 行</span>
      <span>{{ activeDocumentSource.length }} 字符</span>
      <span v-if="activeDocument === 'mdx'">约 {{ document.stats.readingMinutes }} 分钟阅读</span>
      <span class="dl-mdx__status-spacer" />
      <span v-if="languageAnalysis.errorCount">{{ languageAnalysis.errorCount }} errors</span>
      <span v-if="languageAnalysis.warningCount">{{ languageAnalysis.warningCount }} warnings</span>
      <span>{{ activeDocument.toUpperCase() }}</span>
      <span>MarkdownX · Safe Preview</span>
    </footer>
  </section>
</template>
