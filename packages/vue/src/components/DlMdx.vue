<script setup lang="ts">
import { computed, h, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, useId, watch, type ComponentPublicInstance } from 'vue'
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
  createDlMdxRegistry,
  useDlMdxRegistry,
  type DlMdxComponentCategory,
  type DlMdxComponentDefinition,
  type DlMdxActionInvocation,
  type DlMdxActionMap,
  type DlMdxRegistry,
} from './dl-mdx.registry'
import DlMdxTemplate, { type DlMdxTemplateContext } from './DlMdxTemplate'
import { parseDlMdxTemplate } from './dl-mdx.template'
import { useDlMdxSecurityPolicy } from './dl-mdx.security'
import { parseCachedDlMdx } from './dl-mdx.preview-cache'
import type {
  DlMdxDocument,
  DlMdxAttachment,
  DlMdxAttachmentAdapter,
  DlMdxHtmlPasteResult,
  DlMdxLinkPolicy,
  DlMdxMode,
  DlMdxParseResult,
  DlMdxRuntimeSymbol,
  DlMdxToolbarAction,
} from './dl-mdx.types'
import type { DlSplitterPanel } from './primitive.types'
import type { DlDataTableColumn } from './data-table.types'
import DlDataTable from './DlDataTable.vue'
import DlDialog from './DlDialog.vue'
import DlSplitter from './DlSplitter.vue'
import MdxEditor, { type DlMdxEditorDocumentLanguage } from './MdxEditor.vue'
import MdxPreview from './MdxPreview.vue'
import MdxImage from './MdxImage.vue'
import MdxRuntimeJsonTree from './MdxRuntimeJsonTree.vue'

type ComponentLibraryEntry = {
  definition: DlMdxComponentDefinition
  snippet: string
}

type ComponentLibraryCategory = 'all' | DlMdxComponentCategory
type DlMdxWorkspaceDocument = 'mdx' | 'script' | 'style'
type RuntimeTableRow = DlMdxRuntimeSymbol & Record<string, unknown> & {
  id: string
  displayName: string
  kindLabel: string
  resolvedValue: unknown
}

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
  showModeSwitch?: boolean
  showStatus?: boolean
  taskInteractive?: boolean
  lockLiteralBindings?: boolean
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
  sourceLanguage?: DlMdxEditorDocumentLanguage
  runtimeSymbols?: DlMdxRuntimeSymbol[]
  foldComponents?: boolean
  density?: 'compact' | 'comfortable'
  bordered?: boolean
  optimizePreview?: boolean
  splitAutoSaveId?: string
  splitDefaultSize?: number
  splitMinSize?: number
  executeCompanionScript?: boolean
  templateContext?: DlMdxTemplateContext
  attachmentAdapter?: DlMdxAttachmentAdapter
  htmlPaste?: boolean
  richCopy?: boolean
  previewEditable?: boolean
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
  showModeSwitch: true,
  showStatus: true,
  taskInteractive: true,
  lockLiteralBindings: false,
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
  sourceLanguage: 'mdx',
  runtimeSymbols: () => [],
  foldComponents: true,
  density: 'compact',
  bordered: true,
  optimizePreview: true,
  splitAutoSaveId: undefined,
  splitDefaultSize: 50,
  splitMinSize: 20,
  executeCompanionScript: false,
  templateContext: () => ({}),
  attachmentAdapter: undefined,
  htmlPaste: true,
  richCopy: true,
  previewEditable: true,
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
  splitLayout: [layout: number[]]
  'html-paste': [result: DlMdxHtmlPasteResult]
  'attachment-change': [action: 'insert' | 'replace' | 'remove', attachment: DlMdxAttachment]
}>()

const defaultToolbar: DlMdxToolbarAction[] = ['bold', 'italic', 'strike', 'inline-code', 'link', 'heading', 'blockquote', 'unordered-list', 'task-list', 'code-block', 'attachments', 'component', 'format']
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
  attachments: { symbol: '▧', label: '文档图片' },
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
const attachmentManagerOpen = ref(false)
const attachmentManagerLoading = ref(false)
const attachmentManagerError = ref('')
const managedAttachments = ref<DlMdxAttachment[]>([])
const attachmentFileInput = ref<HTMLInputElement>()
const replacingAttachment = ref<DlMdxAttachment>()
const pendingAttachmentRemoval = ref('')
const runtimePanelOpen = ref(false)
const runtimeValueDetailOpen = ref(false)
const runtimeValueDetailRow = ref<RuntimeTableRow>()
const componentSearch = ref('')
const componentCategory = ref<ComponentLibraryCategory>('all')
const componentLibraryTrigger = ref<HTMLElement>()
const componentLibraryWindow = ref<HTMLElement>()
const componentLibraryPosition = ref({ left: 12, top: 12 })
const resizableSplit = ref(typeof window === 'undefined' || window.innerWidth > 800)
const componentLibraryId = `dl-mdx-component-library-${useId().replace(/[^A-Za-z0-9_-]/g, '')}`
const componentLibraryTitleId = `${componentLibraryId}-title`
const injectedRegistry = useDlMdxRegistry()
const injectedSecurityPolicy = useDlMdxSecurityPolicy()
const startsInLightweightPreview = props.optimizePreview && props.mode === 'preview'
  && !props.showCompanionDocuments && props.scriptValue === null && props.styleValue === null
const document = shallowRef<DlMdxDocument>(startsInLightweightPreview ? parseCachedDlMdx(localSource.value) : parseDlMdx(localSource.value))
const languageAnalysis = shallowRef<DlMdxLanguageAnalysis>({ diagnostics: [], components: [], errorCount: 0, warningCount: 0 })
const parsing = ref(false)
let parseTimer: ReturnType<typeof setTimeout> | undefined

const policy = computed<Required<DlMdxLinkPolicy>>(() => ({
  allowExternal: props.linkPolicy?.allowExternal ?? true,
  openExternal: props.linkPolicy?.openExternal ?? true,
  allowImages: props.linkPolicy?.allowImages ?? true,
  allowDataImages: props.linkPolicy?.allowDataImages ?? false,
}))
const baseRegistry = computed(() => props.registry ?? injectedRegistry)
const companionProgram = computed(() => props.executeCompanionScript ? parseDlMdxTemplate(localScript.value, baseRegistry.value) : null)
const activeRegistry = computed(() => {
  const base = baseRegistry.value
  const program = companionProgram.value
  if (!program || program.diagnostics.some(item => item.severity === 'error')) return base
  const merged = createDlMdxRegistry(base?.entries() ?? [])
  for (const name of Object.keys(program.functions)) {
    merged.register({
      name,
      insertable: false,
      category: 'general',
      maturity: 'custom',
      description: '由当前 TypeScript 伴随文档提供的具名 JSX 函数组件。',
      render: () => h(DlMdxTemplate, {
        source: localScript.value,
        entry: name,
        context: props.templateContext,
        registry: merged,
        lockLiteralBindings: props.lockLiteralBindings,
      }),
    })
  }
  return merged
})
const showDocumentTabs = computed(() => props.showCompanionDocuments || props.scriptValue !== null || props.styleValue !== null)
const lightweightPreview = computed(() => props.optimizePreview && localMode.value === 'preview' && !showDocumentTabs.value)
const effectiveShowToolbar = computed(() => props.showToolbar && (localMode.value !== 'preview' || props.showModeSwitch))
const effectiveShowStatus = computed(() => props.showStatus && localMode.value !== 'preview')
const effectiveBordered = computed(() => props.bordered && localMode.value !== 'preview')
const splitPanels = computed<DlSplitterPanel[]>(() => {
  const minSize = Math.max(10, Math.min(45, props.splitMinSize))
  const sourceSize = Math.max(minSize, Math.min(100 - minSize, props.splitDefaultSize))
  return [
    { id: 'source', defaultSize: sourceSize, minSize },
    { id: 'preview', defaultSize: 100 - sourceSize, minSize },
  ]
})
const scriptSymbols = computed(() => extractDlMdxActionSymbols(localScript.value))
const resolvedRuntimeSymbols = computed<RuntimeTableRow[]>(() => props.runtimeSymbols.map((symbol, index) => {
  let value = symbol.value
  try {
    if (symbol.resolve) value = symbol.resolve()
  } catch (cause) {
    value = cause instanceof Error ? `读取失败：${cause.message}` : `读取失败：${String(cause)}`
  }
  const resolvedValue = normalizeRuntimeValue(value)
  return {
    ...symbol,
    id: `${symbol.kind}:${symbol.name}:${index}`,
    displayName: symbol.signature || symbol.name,
    kindLabel: symbol.kind === 'method' ? '方法' : '变量',
    resolvedValue,
  }
}))
const runtimeColumns: DlDataTableColumn[] = [
  { property: 'kindLabel', label: '类型', width: 88 },
  { property: 'displayName', label: '名称 / 签名', minWidth: 250 },
  { property: 'description', label: '说明', minWidth: 260 },
  { property: 'resolvedValue', label: '当前值', minWidth: 360, cellClass: 'dl-mdx__runtime-value-cell' },
]
const runtimeValueDetailSource = computed(() => {
  if (!runtimeValueDetailRow.value) return ''
  const serialized = JSON.stringify(runtimeValueDetailRow.value.resolvedValue, null, 2)
  return serialized === undefined ? String(runtimeValueDetailRow.value.resolvedValue) : serialized
})
const effectiveLanguageOptions = computed<DlMdxLanguageOptions>(() => {
  const hostActions = Object.keys(props.actions ?? {})
  const documentedActions = scriptSymbols.value.map(symbol => symbol.name)
  const runtimeActions = props.runtimeSymbols.filter(symbol => symbol.kind === 'method').map(symbol => symbol.name)
  const actionNames = [...new Set([...(props.languageOptions?.actionNames ?? []), ...hostActions, ...documentedActions, ...runtimeActions])]
  const scriptDescriptions = Object.fromEntries(scriptSymbols.value.filter(symbol => symbol.description).map(symbol => [symbol.name, symbol.description!]))
  const runtimeDescriptions = Object.fromEntries(props.runtimeSymbols.filter(symbol => symbol.kind === 'method' && symbol.description).map(symbol => [symbol.name, symbol.description!]))
  return {
    ...props.languageOptions,
    actionNames,
    actionDescriptions: { ...scriptDescriptions, ...runtimeDescriptions, ...(props.languageOptions?.actionDescriptions ?? {}) },
  }
})
const componentLibraryEntries = computed<ComponentLibraryEntry[]>(() => (activeRegistry.value?.entries() ?? [])
  .flatMap((definition) => {
    const snippet = createDlMdxComponentSnippet(definition)
    return snippet ? [{ definition, snippet }] : []
  })
  .sort((left, right) => left.definition.name.localeCompare(right.definition.name, 'en')))
const toolbarActions = computed(() => (props.toolbar ?? defaultToolbar)
  .filter(action => action !== 'component' || componentLibraryEntries.value.length > 0)
  .filter(action => action !== 'attachments' || Boolean(props.attachmentAdapter?.list)))
const componentCategoryLabels: Record<ComponentLibraryCategory, string> = {
  all: '全部',
  foundation: '基础',
  layout: '布局',
  form: '表单',
  color: '色彩',
  dates: '日期',
  general: '通用',
}
const availableComponentCategories = computed<ComponentLibraryCategory[]>(() => {
  const categories = new Set(componentLibraryEntries.value.map(entry => entry.definition.category ?? 'general'))
  return ['all', ...(['foundation', 'layout', 'form', 'color', 'dates', 'general'] as DlMdxComponentCategory[])
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
    density: { compact: 'dl-mdx--compact', comfortable: 'dl-mdx--comfortable' },
  },
})({ mode: localMode.value, disabled: props.disabled, density: props.density }))
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
watch([activeRegistry, effectiveLanguageOptions], scheduleParse)
watch(localMode, value => { if (value === 'preview') runtimePanelOpen.value = false })
watch(runtimePanelOpen, open => { if (!open) runtimeValueDetailOpen.value = false })
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
function syncResizableSplit() {
  resizableSplit.value = window.innerWidth > 800
}
onMounted(() => {
  syncResizableSplit()
  window.addEventListener('resize', syncResizableSplit)
})
onBeforeUnmount(() => {
  if (parseTimer) clearTimeout(parseTimer)
  window.removeEventListener('resize', positionComponentLibrary)
  window.removeEventListener('scroll', positionComponentLibrary, true)
  window.removeEventListener('resize', syncResizableSplit)
})

function scheduleParse() {
  if (parseTimer) clearTimeout(parseTimer)
  parsing.value = true
  const run = () => {
    try {
      document.value = lightweightPreview.value ? parseCachedDlMdx(localSource.value) : parseDlMdx(localSource.value)
      languageAnalysis.value = lightweightPreview.value
        ? { diagnostics: [], components: [], errorCount: 0, warningCount: 0 }
        : analyzeDlMdx(localSource.value, activeRegistry.value, effectiveLanguageOptions.value)
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

function normalizeRuntimeValue(value: unknown, seen = new WeakSet<object>(), depth = 0): unknown {
  if (typeof value === 'string') {
    const source = value.trim()
    if ((source.startsWith('{') || source.startsWith('[')) && source.length > 1) {
      try { return normalizeRuntimeValue(JSON.parse(source), seen, depth) }
      catch { return value }
    }
    return value
  }
  if (typeof value === 'function') return `[Function ${value.name || 'anonymous'}]`
  if (typeof value === 'bigint') return `${value}n`
  if (typeof value === 'symbol') return value.toString()
  if (value === null || typeof value !== 'object') return value
  if (value instanceof Date) return value.toISOString()
  if (seen.has(value)) return '[Circular]'
  if (depth >= 8) return '[Max depth]'
  seen.add(value)
  try {
    if (Array.isArray(value)) {
      const result = value.slice(0, 100).map(item => normalizeRuntimeValue(item, seen, depth + 1))
      if (value.length > 100) result.push(`[+${value.length - 100} items]`)
      return result
    }
    const entries = Object.entries(value).slice(0, 100)
    const result = Object.fromEntries(entries.map(([key, item]) => [key, normalizeRuntimeValue(item, seen, depth + 1)]))
    if (Object.keys(value).length > 100) result.$truncated = `+${Object.keys(value).length - 100} properties`
    return result
  } catch (cause) {
    return cause instanceof Error ? `[Unreadable: ${cause.message}]` : '[Unreadable value]'
  }
}

function openRuntimeValueCell(payload: { row: RuntimeTableRow; property?: string }) {
  if (payload.property !== 'resolvedValue' || payload.row.kind !== 'variable') return
  runtimeValueDetailRow.value = payload.row
  runtimeValueDetailOpen.value = true
}

function setMode(value: DlMdxMode) {
  localMode.value = value
  emit('update:mode', value)
  if (value !== 'preview') nextTick(() => editorRef.value?.focus())
}

function openRuntimeEnvironment() {
  if (!props.runtimeSymbols.length || localMode.value === 'preview') return false
  runtimePanelOpen.value = true
  return true
}

defineExpose({
  focus: () => editorRef.value?.focus(),
  openRuntimeEnvironment,
  closeRuntimeEnvironment: () => { runtimePanelOpen.value = false },
})

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
  if (action === 'attachments') {
    attachmentManagerOpen.value = true
    void loadManagedAttachments()
    return
  }
  const selection = editorRef.value?.getSelection() ?? { start: localSource.value.length, end: localSource.value.length }
  const result = applyDlMdxCommand(action, { source: localSource.value, selection })
  if (editorRef.value) editorRef.value.replaceDocument(result.source, result.selection)
  else updateSource(result.source)
}

function attachmentIdentity(attachment: DlMdxAttachment) {
  return attachment.fileId ?? attachment.id ?? attachment.url
}

function attachmentName(attachment: DlMdxAttachment) {
  return attachment.fileName || attachment.url.split('/').at(-1) || '图片'
}

function attachmentSize(value?: number) {
  if (!value || value < 1) return '未知大小'
  if (value < 1024) return `${value} B`
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KiB`
  return `${(value / 1024 / 1024).toFixed(1)} MiB`
}

function attachmentPreviewUrl(attachment: DlMdxAttachment) {
  return /^(?:https?:|\/|\.\/|\.\.\/|data:image\/(?:png|jpeg|gif|webp|avif);base64,|blob:)/i.test(attachment.url) ? attachment.url : undefined
}

async function loadManagedAttachments() {
  if (!props.attachmentAdapter?.list) return
  attachmentManagerLoading.value = true
  attachmentManagerError.value = ''
  try {
    managedAttachments.value = await props.attachmentAdapter.list()
  } catch (cause) {
    attachmentManagerError.value = cause instanceof Error ? cause.message : String(cause)
    emit('error', cause instanceof Error ? cause : new Error(String(cause)))
  } finally {
    attachmentManagerLoading.value = false
  }
}

async function insertManagedAttachment(attachment: DlMdxAttachment) {
  if (!canEdit.value) return
  if (localMode.value === 'preview') {
    setMode('edit')
    await nextTick()
  }
  const label = attachmentName(attachment).replace(/\.[A-Za-z0-9]{2,5}$/, '').replace(/[\\\]]/g, '\\$&')
  const selection = editorRef.value?.getSelection() ?? lastEditorSelection.value
  const result = insertDlMdxSnippet({ source: localSource.value, selection }, `![${label}](${attachment.url})`)
  if (editorRef.value) editorRef.value.replaceDocument(result.source, result.selection)
  else updateSource(result.source)
  emit('attachment-change', 'insert', attachment)
}

function chooseAttachmentFile(replace?: DlMdxAttachment) {
  replacingAttachment.value = replace
  attachmentFileInput.value?.click()
}

async function handleAttachmentFile(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file || !props.attachmentAdapter) return
  attachmentManagerLoading.value = true
  attachmentManagerError.value = ''
  const replaced = replacingAttachment.value
  replacingAttachment.value = undefined
  try {
    const uploaded = await props.attachmentAdapter.upload({
      sourceUrl: '',
      fileName: file.name,
      contentType: file.type,
      alt: file.name.replace(/\.[A-Za-z0-9]{2,5}$/, ''),
      blob: file,
    })
    if (replaced) {
      const updated = localSource.value.split(replaced.url).join(uploaded.url)
      updateSource(updated)
      managedAttachments.value = managedAttachments.value.map(item =>
        attachmentIdentity(item) === attachmentIdentity(replaced) ? uploaded : item)
      if (
        props.attachmentAdapter.referenceMode !== 'document-save'
        && attachmentIdentity(replaced) !== attachmentIdentity(uploaded)
      ) await props.attachmentAdapter.remove?.(replaced)
      emit('attachment-change', 'replace', uploaded)
    } else {
      if (!managedAttachments.value.some(item => attachmentIdentity(item) === attachmentIdentity(uploaded))) {
        managedAttachments.value = [...managedAttachments.value, uploaded]
      }
      await insertManagedAttachment(uploaded)
    }
  } catch (cause) {
    attachmentManagerError.value = cause instanceof Error ? cause.message : String(cause)
    emit('error', cause instanceof Error ? cause : new Error(String(cause)))
  } finally {
    attachmentManagerLoading.value = false
  }
}

function withoutAttachment(source: string, attachment: DlMdxAttachment) {
  const escaped = attachment.url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return source.replace(new RegExp(`!\\[([^\\]]*)\\]\\(${escaped}(?:\\s+["'][^"']*["'])?\\)`, 'g'), '$1')
}

async function removeManagedAttachment(attachment: DlMdxAttachment) {
  const identity = attachmentIdentity(attachment)
  if (pendingAttachmentRemoval.value !== identity) {
    pendingAttachmentRemoval.value = identity
    return
  }
  pendingAttachmentRemoval.value = ''
  attachmentManagerLoading.value = true
  attachmentManagerError.value = ''
  try {
    updateSource(withoutAttachment(localSource.value, attachment))
    managedAttachments.value = managedAttachments.value.filter(item => attachmentIdentity(item) !== identity)
    if (props.attachmentAdapter?.referenceMode !== 'document-save') {
      await props.attachmentAdapter?.remove?.(attachment)
    }
    emit('attachment-change', 'remove', attachment)
  } catch (cause) {
    attachmentManagerError.value = cause instanceof Error ? cause.message : String(cause)
    emit('error', cause instanceof Error ? cause : new Error(String(cause)))
  } finally {
    attachmentManagerLoading.value = false
  }
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

function companionFunctionFor(definition: DlMdxComponentDefinition) {
  const stem = definition.name.replace(/[^A-Za-z0-9]+/g, '') || 'Component'
  const base = `${stem[0].toUpperCase()}${stem.slice(1)}Block`
  let index = 1
  while (companionProgram.value?.functions[`${base}${index}`]) index += 1
  const name = `${base}${index}`
  const attributes = Object.entries(definition.defaultProps ?? {}).flatMap(([property, value]) => {
    try {
      const serialized = JSON.stringify(value)
      return serialized === undefined ? [] : [`      ${property}={${serialized}}`]
    } catch { return [] }
  })
  const element = attributes.length
    ? `<${definition.name}\n${attributes.join('\n')}\n    />`
    : `<${definition.name} />`
  return {
    name,
    source: `export function ${name}() {\n  return (\n    ${element}\n  )\n}`,
  }
}

function insertRegisteredComponent(entry: ComponentLibraryEntry) {
  if (!canEdit.value || !componentLibraryEntries.value.includes(entry)) return
  const selection = editorRef.value?.getSelection() ?? lastEditorSelection.value
  let snippet = entry.snippet
  if (props.executeCompanionScript) {
    const generated = companionFunctionFor(entry.definition)
    snippet = `<${generated.name} />`
    updateScript(`${localScript.value.trimEnd()}${localScript.value.trim() ? '\n\n' : ''}${generated.source}\n`)
  }
  const result = insertDlMdxSnippet({ source: localSource.value, selection }, snippet)
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
    :data-toolbar="effectiveShowToolbar ? 'true' : 'false'"
    :data-mode-switch="showModeSwitch ? 'true' : 'false'"
    :data-status="effectiveShowStatus ? 'true' : 'false'"
    :data-documents="showDocumentTabs ? 'true' : 'false'"
    data-runtime="false"
    :data-bordered="effectiveBordered ? 'true' : 'false'"
    :data-lightweight-preview="lightweightPreview ? 'true' : 'false'"
    :class="rootClass"
    :style="rootStyle"
  >
    <component :is="'style'" v-if="executeCompanionScript && localStyle">{{ localStyle }}</component>
    <header v-if="effectiveShowToolbar" class="dl-mdx__toolbar">
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
      <span v-else-if="activeDocument !== 'mdx'" class="dl-mdx__preview-label">{{ `${activeDocument.toUpperCase()} · COMPANION DOCUMENT` }}</span>
      <button
        v-if="localMode !== 'preview' && runtimeSymbols.length"
        type="button"
        class="dl-mdx__runtime-trigger"
        :class="{ active: runtimePanelOpen }"
        :aria-expanded="runtimePanelOpen"
        aria-label="查看 DLENV 运行时环境"
        title="查看当前页面可用的变量与方法"
        @click="runtimePanelOpen = true"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
          <rect x="3.5" y="4.5" width="17" height="15" rx="3" />
          <path d="m7.5 9 3 3-3 3M13 15h3.5" />
        </svg>
      </button>
      <div v-if="showModeSwitch" class="dl-mdx__mode-switch" aria-label="编辑模式">
        <button v-for="item in ([['edit', '编辑'], ['preview', '渲染'], ['split', '编辑 + 渲染']] as const)" :key="item[0]" type="button" :class="{ active: localMode === item[0] }" :aria-pressed="localMode === item[0]" @click="setMode(item[0])">{{ item[1] }}</button>
      </div>
    </header>

    <DlDialog
      v-if="localMode !== 'preview' && runtimeSymbols.length"
      v-model:open="runtimePanelOpen"
      title="DLENV 运行时环境"
      description="查看当前 MDX 页面可访问的变量、数据结构和开放方法。"
      fullscreen
      :draggable="false"
      :resizable="false"
    >
      <div class="dl-mdx__runtime-page">
        <header class="dl-mdx__runtime-summary">
          <span><b>{{ resolvedRuntimeSymbols.filter(item => item.kind === 'variable').length }}</b><small>变量</small></span>
          <span><b>{{ resolvedRuntimeSymbols.filter(item => item.kind === 'method').length }}</b><small>方法</small></span>
          <p>JSON 对象与数组可在单元格中逐层展开；循环引用和超大结构会安全截断。</p>
        </header>
        <DlDataTable
          :rows="resolvedRuntimeSymbols"
          :columns="runtimeColumns"
          row-identity="id"
          height="100%"
          grid-lines="inside"
          :zebra="false"
          empty-message="当前页面没有公开的运行时信息"
          @cell-activate="openRuntimeValueCell"
        >
          <template #cell-displayName="{ row }"><code class="dl-mdx__runtime-name">{{ row.displayName }}</code></template>
          <template #cell-description="{ row }"><span class="dl-mdx__runtime-description">{{ row.description || '—' }}</span></template>
          <template #cell-resolvedValue="{ row }">
            <MdxRuntimeJsonTree v-if="row.kind === 'variable'" :value="row.resolvedValue" />
            <span v-else class="dl-mdx__runtime-method">由宿主页面提供</span>
          </template>
        </DlDataTable>
      </div>
    </DlDialog>

    <DlDialog
      v-if="runtimeValueDetailRow"
      v-model:open="runtimeValueDetailOpen"
      :title="runtimeValueDetailRow.displayName"
      description="JSON 数据详情"
      size="lg"
      :draggable="false"
    >
      <div class="dl-mdx__runtime-json-editor">
        <MdxEditor
          :model-value="runtimeValueDetailSource"
          readonly
          document-language="json"
          :line-wrapping="false"
          aria-label="JSON 数据详情"
        />
      </div>
    </DlDialog>

    <DlDialog
      v-model:open="attachmentManagerOpen"
      title="文档图片"
      description="浏览、重新插入、替换或移除当前 MDX 文档绑定的图片。"
      size="lg"
      :draggable="false"
      @update:open="value => value && loadManagedAttachments()"
    >
      <section class="dl-mdx__attachment-manager" :aria-busy="attachmentManagerLoading">
        <header>
          <span><b>{{ managedAttachments.length }}</b> 张图片</span>
          <button type="button" :disabled="attachmentManagerLoading || !canEdit" @click="chooseAttachmentFile()">上传并插入</button>
          <input ref="attachmentFileInput" type="file" accept="image/png,image/jpeg,image/gif,image/webp,image/avif" @change="handleAttachmentFile">
        </header>
        <p v-if="attachmentManagerError" class="dl-mdx__attachment-error">{{ attachmentManagerError }}</p>
        <div v-if="managedAttachments.length" class="dl-mdx__attachment-grid">
          <article v-for="attachment in managedAttachments" :key="attachmentIdentity(attachment)">
            <MdxImage v-if="attachmentPreviewUrl(attachment)" :src="attachmentPreviewUrl(attachment)" :alt="attachmentName(attachment)" loading="lazy" />
            <div v-else class="dl-mdx__attachment-placeholder">IMG</div>
            <span><b :title="attachmentName(attachment)">{{ attachmentName(attachment) }}</b><small>{{ attachmentSize(attachment.byteLength) }} · {{ attachment.referenceCount ?? 1 }} 个引用</small></span>
            <footer>
              <button type="button" @click="insertManagedAttachment(attachment)">插入</button>
              <button type="button" @click="chooseAttachmentFile(attachment)">替换</button>
              <a v-if="attachmentPreviewUrl(attachment)" :href="attachmentPreviewUrl(attachment)" :download="attachmentName(attachment)" target="_blank" rel="noopener noreferrer">下载</a>
              <button type="button" class="danger" @click="removeManagedAttachment(attachment)">{{ pendingAttachmentRemoval === attachmentIdentity(attachment) ? '确认移除' : '移除' }}</button>
            </footer>
          </article>
        </div>
        <p v-else-if="!attachmentManagerLoading" class="dl-mdx__attachment-empty">当前文档还没有托管图片，可粘贴图片或从这里上传。</p>
        <p v-if="attachmentManagerLoading" class="dl-mdx__attachment-loading">正在同步文档图片…</p>
      </section>
    </DlDialog>

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
      <button type="button" :class="{ active: activeDocument === 'script' }" :aria-pressed="activeDocument === 'script'" @click="activeDocument = 'script'">{{ scriptLanguage === 'typescript' ? 'TS' : 'JS' }} <small>FUNCTIONS</small></button>
      <button type="button" :class="{ active: activeDocument === 'style' }" :aria-pressed="activeDocument === 'style'" @click="activeDocument = 'style'">CSS <small>STYLES</small></button>
      <span>MDX 为主文档，脚本与样式独立保存</span>
    </nav>

    <div class="dl-mdx__workspace">
      <DlSplitter
        v-if="localMode === 'split' && resizableSplit"
        class="dl-mdx__splitter"
        :panels="splitPanels"
        :auto-save-id="splitAutoSaveId"
        :keyboard-resize-by="2"
        @layout="emit('splitLayout', $event)"
      >
        <template #panel-source>
          <section class="dl-mdx__editor-pane" :class="{ 'dl-mdx__editor-pane--companion': activeDocument !== 'mdx' }" :aria-label="activeDocument === 'mdx' ? 'Markdown 源码' : activeDocument === 'script' ? '脚本附加文档' : '样式附加文档'">
            <MdxEditor
              v-if="activeDocument === 'mdx'"
              :key="`source:${sourceLanguage}`"
              ref="editorRef"
              :model-value="localSource"
              :placeholder="placeholder"
              :readonly="readonly"
              :disabled="disabled"
              :line-wrapping="lineWrapping"
              :fold-components="foldComponents"
              :aria-label="`${ariaLabel}编辑器`"
              :document-language="sourceLanguage"
              :registry="activeRegistry"
              :language-options="effectiveLanguageOptions"
              :attachment-adapter="attachmentAdapter"
              :html-paste="htmlPaste"
              :rich-copy="richCopy"
              @update:model-value="updateSource"
              @selection-change="updateEditorSelection"
              @command="execute"
              @error="emit('error', $event)"
              @html-paste="emit('html-paste', $event)"
              @preview-request="setMode('preview')"
            />
            <MdxEditor
              v-else-if="activeDocument === 'script'"
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
            <MdxEditor
              v-else
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
        </template>
        <template #panel-preview>
          <section class="dl-mdx__preview-pane" :aria-busy="parsing">
            <div v-if="parsing" class="dl-mdx__parsing"><i />正在更新预览</div>
            <MdxPreview
              :document="document"
              :link-policy="policy"
              :task-interactive="taskInteractive && canEdit"
              :lock-literal-bindings="lockLiteralBindings"
              :empty-text="emptyText"
              :ariaLabel="`${ariaLabel}预览`"
              :component-slots="$slots"
              :registry="activeRegistry"
              :actions="props.actions"
              :security-policy="injectedSecurityPolicy"
              :editable="previewEditable && canEdit"
              @toggle-task="toggleTask"
              @error="emit('error', $event)"
              @action="emit('action', $event)"
              @edit-request="setMode('edit')"
            />
          </section>
        </template>
      </DlSplitter>
      <section v-if="localMode !== 'preview' && (localMode !== 'split' || !resizableSplit)" class="dl-mdx__editor-pane" :class="{ 'dl-mdx__editor-pane--companion': activeDocument !== 'mdx' }" :aria-label="activeDocument === 'mdx' ? 'Markdown 源码' : activeDocument === 'script' ? '脚本附加文档' : '样式附加文档'">
        <MdxEditor
          v-if="activeDocument === 'mdx'"
          :key="`source:${sourceLanguage}`"
          ref="editorRef"
          :model-value="localSource"
          :placeholder="placeholder"
          :readonly="readonly"
          :disabled="disabled"
          :line-wrapping="lineWrapping"
          :fold-components="foldComponents"
          :aria-label="`${ariaLabel}编辑器`"
        :document-language="sourceLanguage"
          :registry="activeRegistry"
          :language-options="effectiveLanguageOptions"
          :attachment-adapter="attachmentAdapter"
          :html-paste="htmlPaste"
          :rich-copy="richCopy"
          @update:model-value="updateSource"
          @selection-change="updateEditorSelection"
          @command="execute"
          @error="emit('error', $event)"
          @html-paste="emit('html-paste', $event)"
          @preview-request="setMode('preview')"
        />
        <MdxEditor
          v-else-if="activeDocument === 'script'"
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
        <MdxEditor
          v-else
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
      <section v-if="localMode !== 'edit' && (localMode !== 'split' || !resizableSplit)" class="dl-mdx__preview-pane" :aria-busy="parsing">
        <div v-if="parsing" class="dl-mdx__parsing"><i />正在更新预览</div>
        <MdxPreview
          :document="document"
          :link-policy="policy"
          :task-interactive="taskInteractive && canEdit"
          :lock-literal-bindings="lockLiteralBindings"
          :empty-text="emptyText"
          :ariaLabel="`${ariaLabel}预览`"
          :component-slots="$slots"
          :registry="activeRegistry"
          :actions="props.actions"
          :security-policy="injectedSecurityPolicy"
          :editable="previewEditable && canEdit"
          @toggle-task="toggleTask"
          @error="emit('error', $event)"
          @action="emit('action', $event)"
          @edit-request="setMode('edit')"
        />
      </section>
    </div>

    <footer v-if="effectiveShowStatus" class="dl-mdx__status">
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
