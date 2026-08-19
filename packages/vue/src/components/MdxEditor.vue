<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { DlMdxSelection } from './dl-mdx.commands'

const props = withDefaults(defineProps<{
  modelValue: string
  placeholder?: string
  readonly?: boolean
  disabled?: boolean
  lineWrapping?: boolean
  ariaLabel?: string
}>(), {
  placeholder: '开始书写 Markdown…',
  readonly: false,
  disabled: false,
  lineWrapping: true,
  ariaLabel: 'Markdown 编辑器',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'selection-change': [selection: DlMdxSelection]
  command: [action: 'bold' | 'italic']
  error: [error: Error]
}>()

const host = ref<HTMLElement>()
let view: import('@codemirror/view').EditorView | undefined
let editable: import('@codemirror/state').Compartment | undefined
let wrapping: import('@codemirror/state').Compartment | undefined
let viewModule: typeof import('@codemirror/view') | undefined
let stateModule: typeof import('@codemirror/state') | undefined
let disposed = false
let pendingSelection: DlMdxSelection | undefined
let pendingFocus = false

onMounted(async () => {
  try {
    const [commands, markdownModule, language, loadedState, loadedView] = await Promise.all([
      import('@codemirror/commands'),
      import('@codemirror/lang-markdown'),
      import('@codemirror/language'),
      import('@codemirror/state'),
      import('@codemirror/view'),
    ])
    if (disposed || !host.value) return

    viewModule = loadedView
    stateModule = loadedState
    editable = new loadedState.Compartment()
    wrapping = new loadedState.Compartment()
    const dragonTheme = loadedView.EditorView.theme({
      '&': { height: '100%', minHeight: 'inherit', color: 'var(--dl-text)', backgroundColor: 'transparent', fontSize: '0.9rem' },
      '&.cm-focused': { outline: 'none' },
      '.cm-scroller': { minHeight: 'inherit', fontFamily: '"Cascadia Code", "SFMono-Regular", Consolas, monospace', lineHeight: '1.72', overscrollBehavior: 'auto' },
      '.cm-content': { padding: '1rem 0.9rem 4rem', caretColor: 'var(--dl-accent)' },
      '.cm-line': { padding: '0 0.5rem' },
      '.cm-gutters': {
        color: 'var(--dl-text-faint)',
        backgroundColor: 'color-mix(in srgb, var(--dl-night-soft) 84%, var(--dl-surface-solid))',
        borderRight: '1px solid var(--dl-border)',
      },
      '.cm-lineNumbers': { minWidth: '3.15rem' },
      '.cm-lineNumbers .cm-gutterElement': {
        boxSizing: 'border-box',
        minWidth: '3.15rem',
        padding: '0 .78rem 0 .55rem',
        fontVariantNumeric: 'tabular-nums',
      },
      '.cm-foldGutter .cm-gutterElement': { width: '1.65rem', padding: '0', textAlign: 'center' },
      '.cm-activeLine': { backgroundColor: 'var(--dl-accent-surface)' },
      '.cm-activeLineGutter': { color: 'var(--dl-accent-text)', backgroundColor: 'var(--dl-accent-surface)' },
      '.cm-selectionBackground, &.cm-focused .cm-selectionBackground': { backgroundColor: 'rgba(59, 130, 246, .16)' },
      '.cm-cursor, .cm-dropCursor': { borderLeftColor: 'var(--dl-accent)' },
      '.cm-foldGutter span': { color: 'var(--dl-accent)' },
      '.cm-tooltip': { color: 'var(--dl-text)', backgroundColor: 'var(--dl-surface-strong)', border: '1px solid var(--dl-border-strong)', borderRadius: '12px', overflow: 'hidden' },
    })

    view = new loadedView.EditorView({
      parent: host.value,
      state: loadedState.EditorState.create({
        doc: props.modelValue,
        extensions: [
          loadedView.lineNumbers(),
          language.foldGutter(),
          loadedView.highlightSpecialChars(),
          commands.history(),
          loadedView.drawSelection(),
          language.indentOnInput(),
          language.bracketMatching(),
          language.syntaxHighlighting(language.defaultHighlightStyle, { fallback: true }),
          markdownModule.markdown(),
          loadedView.highlightActiveLine(),
          loadedView.placeholder(props.placeholder),
          loadedView.keymap.of([
            { key: 'Mod-b', run: () => { emit('command', 'bold'); return true } },
            { key: 'Mod-i', run: () => { emit('command', 'italic'); return true } },
            ...commands.defaultKeymap,
            ...commands.historyKeymap,
            commands.indentWithTab,
          ]),
          dragonTheme,
          loadedView.EditorView.contentAttributes.of({ 'aria-label': props.ariaLabel, spellcheck: 'true' }),
          editable.of([loadedView.EditorView.editable.of(!props.readonly && !props.disabled), loadedState.EditorState.readOnly.of(props.readonly || props.disabled)]),
          wrapping.of(props.lineWrapping ? loadedView.EditorView.lineWrapping : []),
          loadedView.EditorView.updateListener.of(update => {
            if (update.docChanged) emit('update:modelValue', update.state.doc.toString())
            if (update.selectionSet || update.docChanged) {
              const selection = update.state.selection.main
              emit('selection-change', { start: selection.from, end: selection.to })
            }
          }),
        ],
      }),
    })
    if (pendingSelection) {
      const length = view.state.doc.length
      view.dispatch({ selection: { anchor: Math.min(pendingSelection.start, length), head: Math.min(pendingSelection.end, length) } })
      pendingSelection = undefined
    }
    if (pendingFocus) {
      pendingFocus = false
      view.focus()
    }
  } catch (cause) {
    emit('error', cause instanceof Error ? cause : new Error(String(cause)))
  }
})

watch(() => props.modelValue, value => {
  if (!view || value === view.state.doc.toString()) return
  view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: value } })
})

watch(() => [props.readonly, props.disabled] as const, ([readonly, disabled]) => {
  if (!view || !editable || !viewModule || !stateModule) return
  view.dispatch({ effects: editable.reconfigure([viewModule.EditorView.editable.of(!readonly && !disabled), stateModule.EditorState.readOnly.of(readonly || disabled)]) })
})

watch(() => props.lineWrapping, value => {
  if (!view || !wrapping || !viewModule) return
  view.dispatch({ effects: wrapping.reconfigure(value ? viewModule.EditorView.lineWrapping : []) })
})

onBeforeUnmount(() => {
  disposed = true
  view?.destroy()
})

function getSelection(): DlMdxSelection {
  const selection = view?.state.selection.main
  return selection ? { start: selection.from, end: selection.to } : { start: 0, end: 0 }
}

function replaceDocument(source: string, selection: DlMdxSelection) {
  if (!view) {
    pendingSelection = selection
    pendingFocus = true
    emit('update:modelValue', source)
    return
  }
  view.dispatch({
    changes: { from: 0, to: view.state.doc.length, insert: source },
    selection: { anchor: selection.start, head: selection.end },
    scrollIntoView: true,
  })
  view.focus()
}

function focus() {
  if (view) view.focus()
  else pendingFocus = true
}

defineExpose({ getSelection, replaceDocument, focus })
</script>

<template>
  <div ref="host" class="dl-mdx__editor-host" :class="{ 'is-disabled': disabled }" />
</template>
