<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import RawDlCheckbox from './DlCheckbox.vue'
import RawDlInputText from './DlInputText.vue'
import RawDlNumberField from './DlNumberField.vue'
import RawDlSelect from './DlSelect.vue'
import RawDlSwitch from './DlSwitch.vue'
import {
  cloneDlPathValue,
  createDlPathValue,
  dlPathKey,
  isDlPathNodeSelectable,
  reduceDlPathPicker,
  sameDlPath,
  validateDlPathValue,
  visibleDlPathFields,
} from './path-picker'
import type {
  DlPathContext,
  DlPathField,
  DlPathFieldValue,
  DlPathNode,
  DlPathOption,
  DlPathPickerAdapter,
  DlPathPickerEvent,
  DlPathPickerLoadError,
  DlPathValue,
} from './path-picker.types'

const props = withDefaults(defineProps<{
  modelValue?: DlPathValue[]
  items: DlPathNode[]
  adapter?: DlPathPickerAdapter
  multiple?: boolean
  maxSelections?: number
  levelLabels?: string[]
  label?: string
  description?: string
  selectionLabel?: string
  emptyText?: string
  disabled?: boolean
}>(), {
  modelValue: () => [],
  adapter: undefined,
  multiple: false,
  maxSelections: undefined,
  levelLabels: () => [],
  label: '路径选择',
  description: '沿层级浏览，并把需要的路径加入选择。',
  selectionLabel: '已选择',
  emptyText: '当前层级没有可用项目',
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: DlPathValue[]]
  change: [value: DlPathValue[]]
  'activePathChange': [path: string[]]
  'loadError': [value: DlPathPickerLoadError]
}>()

type PathColumn = { depth: number; prefix: string[]; items: DlPathNode[]; label: string }

const activePath = ref<string[]>([])
const selections = ref<DlPathValue[]>(props.modelValue.map(cloneDlPathValue))
const loadedChildren = ref<Record<string, DlPathNode[]>>({})
const loadedFields = ref<Record<string, DlPathField[]>>({})
const loadedOptions = ref<Record<string, DlPathOption[]>>({})
const loadingKeys = ref<Set<string>>(new Set())
const errorMessage = ref('')

watch(() => props.modelValue, value => { selections.value = value.map(cloneDlPathValue) }, { deep: true })

const columns = computed<PathColumn[]>(() => {
  const result: PathColumn[] = []
  let items = props.items
  const prefix: string[] = []
  let depth = 0
  while (items.length || depth === 0) {
    result.push({ depth, prefix: [...prefix], items, label: props.levelLabels[depth] ?? `第 ${depth + 1} 级` })
    const value = activePath.value[depth]
    if (!value) break
    const node = items.find(item => item.value === value)
    if (!node) break
    prefix.push(node.value)
    items = childrenFor(node, prefix)
    depth += 1
    if (!items.length) break
  }
  return result
})

const activeNodes = computed(() => nodesForPath(activePath.value))
const activeNode = computed(() => activeNodes.value.at(-1))
const activeSelection = computed(() => selections.value.find(selection => sameDlPath(selection.path, activePath.value)))
const activeFields = computed(() => {
  if (!activeNode.value || !activeSelection.value) return []
  return visibleDlPathFields(fieldsFor(activeNode.value, activePath.value), activeSelection.value.parameters)
})
const activeIssues = computed(() => activeSelection.value && activeNode.value
  ? validateDlPathValue(activeSelection.value, fieldsFor(activeNode.value, activePath.value))
  : [])
const canAddMore = computed(() => props.maxSelections === undefined || selections.value.length < props.maxSelections)

function childrenFor(node: DlPathNode, path: string[]): DlPathNode[] {
  return loadedChildren.value[dlPathKey(path)] ?? node.children ?? []
}

function fieldsFor(node: DlPathNode, path: string[]): DlPathField[] {
  return loadedFields.value[dlPathKey(path)] ?? node.fields ?? []
}

function nodesForPath(path: readonly string[]): DlPathNode[] {
  const found: DlPathNode[] = []
  let items = props.items
  const prefix: string[] = []
  for (const value of path) {
    const node = items.find(item => item.value === value)
    if (!node) break
    found.push(node)
    prefix.push(node.value)
    items = childrenFor(node, prefix)
  }
  return found
}

function contextFor(node: DlPathNode, path: string[], parameters: DlPathValue['parameters'] = {}): DlPathContext {
  const nodes = nodesForPath(path)
  return {
    node,
    path: [...path],
    labels: nodes.map(item => item.label),
    parameters: { ...parameters },
    selections: selections.value.map(cloneDlPathValue),
  }
}

function apply(event: DlPathPickerEvent): void {
  const before = { activePath: activePath.value, selections: selections.value }
  const next = reduceDlPathPicker(before, event, { multiple: props.multiple, maxSelections: props.maxSelections })
  activePath.value = next.activePath
  if (event.type.startsWith('path.')) {
    emit('activePathChange', [...next.activePath])
    return
  }
  selections.value = next.selections
  const value = next.selections.map(cloneDlPathValue)
  emit('update:modelValue', value)
  emit('change', value)
}

function isLoading(key: string): boolean {
  return loadingKeys.value.has(key)
}

function startLoading(key: string): void {
  loadingKeys.value = new Set([...loadingKeys.value, key])
}

function finishLoading(key: string): void {
  const next = new Set(loadingKeys.value)
  next.delete(key)
  loadingKeys.value = next
}

function reportLoadError(value: DlPathPickerLoadError): void {
  errorMessage.value = value.error instanceof Error ? value.error.message : '数据加载失败，请稍后重试。'
  emit('loadError', value)
}

async function openNode(node: DlPathNode, prefix: string[]): Promise<void> {
  if (props.disabled || node.disabled) return
  errorMessage.value = ''
  const path = [...prefix, node.value]
  if (activePath.value[prefix.length] === node.value && (node.hasChildren || childrenFor(node, path).length)) {
    apply({ type: 'path.collapse', depth: prefix.length })
    return
  }
  apply({ type: 'path.open', path })
  await ensureChildren(node, path)
}

async function ensureChildren(node: DlPathNode, path: string[]): Promise<DlPathNode[]> {
  const key = dlPathKey(path)
  if (loadedChildren.value[key]) return loadedChildren.value[key]
  if (node.children?.length || !node.hasChildren || !props.adapter?.loadChildren) return node.children ?? []
  const loadingKey = `children:${key}`
  if (isLoading(loadingKey)) return []
  startLoading(loadingKey)
  try {
    const children = await props.adapter.loadChildren(node, contextFor(node, path))
    loadedChildren.value = { ...loadedChildren.value, [key]: children }
    return children
  } catch (error) {
    reportLoadError({ kind: 'children', path: [...path], error })
    return []
  } finally {
    finishLoading(loadingKey)
  }
}

async function ensureFields(node: DlPathNode, path: string[]): Promise<DlPathField[]> {
  const key = dlPathKey(path)
  if (loadedFields.value[key]) return loadedFields.value[key]
  if (!node.fieldSource || !props.adapter?.loadFields) return node.fields ?? []
  const loadingKey = `fields:${key}`
  if (isLoading(loadingKey)) return []
  startLoading(loadingKey)
  try {
    const fields = await props.adapter.loadFields(node, contextFor(node, path))
    loadedFields.value = { ...loadedFields.value, [key]: fields }
    return fields
  } catch (error) {
    reportLoadError({ kind: 'fields', path: [...path], error })
    return []
  } finally {
    finishLoading(loadingKey)
  }
}

function optionCacheKey(selection: DlPathValue, field: DlPathField): string {
  const dependencies = (field.dependsOn ?? []).map(key => [key, selection.parameters[key]])
  return JSON.stringify([selection.path, field.key, field.source, dependencies])
}

function optionsFor(field: DlPathField, selection: DlPathValue): DlPathOption[] {
  return field.options ?? loadedOptions.value[optionCacheKey(selection, field)] ?? []
}

async function ensureOptions(field: DlPathField, selection: DlPathValue): Promise<DlPathOption[]> {
  if (field.options || !field.source || !props.adapter?.loadOptions) return field.options ?? []
  const dependenciesReady = (field.dependsOn ?? []).every(key => hasValue(selection.parameters[key]))
  if (!dependenciesReady) return []
  const key = optionCacheKey(selection, field)
  if (loadedOptions.value[key]) return loadedOptions.value[key]
  const loadingKey = `options:${key}`
  if (isLoading(loadingKey)) return []
  const node = nodesForPath(selection.path).at(-1)
  if (!node) return []
  startLoading(loadingKey)
  try {
    const options = await props.adapter.loadOptions(field, contextFor(node, selection.path, selection.parameters))
    loadedOptions.value = { ...loadedOptions.value, [key]: options }
    return options
  } catch (error) {
    reportLoadError({ kind: 'options', path: [...selection.path], field, error })
    return []
  } finally {
    finishLoading(loadingKey)
  }
}

async function toggleNode(node: DlPathNode, path: string[]): Promise<void> {
  if (props.disabled || node.disabled || !isDlPathNodeSelectable(node)) return
  const existing = selections.value.find(selection => sameDlPath(selection.path, path))
  if (existing) {
    apply({ type: 'selection.remove', path })
    return
  }
  if (!canAddMore.value) return
  apply({ type: 'path.open', path })
  const fields = await ensureFields(node, path)
  const pathNodes = nodesForPath(path)
  if (pathNodes.length !== path.length) return
  const selection = createDlPathValue(pathNodes, fields)
  apply({ type: 'selection.toggle', selection })
  const current = selections.value.find(item => sameDlPath(item.path, path))
  if (current) await Promise.all(fields.map(field => ensureOptions(field, current)))
}

function dependentKeys(fields: readonly DlPathField[], sourceKey: string): string[] {
  const found = new Set<string>()
  let pending = [sourceKey]
  while (pending.length) {
    const current = pending
    pending = []
    for (const field of fields) {
      if (!found.has(field.key) && field.dependsOn?.some(key => current.includes(key))) {
        found.add(field.key)
        pending.push(field.key)
      }
    }
  }
  return [...found]
}

async function updateParameter(selection: DlPathValue, field: DlPathField, value: DlPathFieldValue): Promise<void> {
  const node = nodesForPath(selection.path).at(-1)
  if (!node) return
  const fields = fieldsFor(node, selection.path)
  const resetKeys = dependentKeys(fields, field.key)
  apply({ type: 'parameter.change', path: selection.path, key: field.key, value, resetKeys })
  const current = selections.value.find(item => sameDlPath(item.path, selection.path))
  if (!current) return
  await Promise.all(fields.filter(item => resetKeys.includes(item.key)).map(item => ensureOptions(item, current)))
}

function toggleMultiValue(selection: DlPathValue, field: DlPathField, option: DlPathOption, checked: boolean | 'indeterminate'): void {
  const current = Array.isArray(selection.parameters[field.key]) ? selection.parameters[field.key] as string[] : []
  const value = Boolean(checked)
    ? current.includes(option.value) ? current : [...current, option.value]
    : current.filter(item => item !== option.value)
  void updateParameter(selection, field, value)
}

function clear(): void {
  if (!props.disabled) apply({ type: 'selection.clear' })
}

function openPath(path: string[]): void {
  apply({ type: 'path.open', path })
}

function validate(): boolean {
  return selections.value.every(selection => {
    const node = nodesForPath(selection.path).at(-1)
    return node ? validateDlPathValue(selection, fieldsFor(node, selection.path)).length === 0 : false
  })
}

function fieldStringValue(selection: DlPathValue, field: DlPathField): string {
  const value = selection.parameters[field.key]
  return typeof value === 'string' ? value : ''
}

function fieldNumberValue(selection: DlPathValue, field: DlPathField): number | null {
  const value = selection.parameters[field.key]
  return typeof value === 'number' ? value : null
}

function fieldBooleanValue(selection: DlPathValue, field: DlPathField): boolean {
  return selection.parameters[field.key] === true
}

function fieldArrayValue(selection: DlPathValue, field: DlPathField): string[] {
  const value = selection.parameters[field.key]
  return Array.isArray(value) ? value : []
}

function hasValue(value: DlPathFieldValue | undefined): boolean {
  if (Array.isArray(value)) return value.length > 0
  if (typeof value === 'string') return value.trim().length > 0
  return value !== undefined && value !== null
}

function handleNodeKeydown(event: KeyboardEvent, node: DlPathNode, prefix: string[], index: number): void {
  const current = event.currentTarget as HTMLElement
  if (event.key === 'ArrowRight') {
    event.preventDefault()
    void openNode(node, prefix)
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault()
    apply({ type: 'path.collapse', depth: prefix.length })
  } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    const rows = [...current.closest('[data-path-column]')!.querySelectorAll<HTMLElement>('[data-path-node]')]
    rows[index + (event.key === 'ArrowDown' ? 1 : -1)]?.focus()
  }
}

defineExpose({ clear, openPath, validate })
</script>

<template>
  <section data-dl data-slot="path-picker" class="dl-path-picker" :data-disabled="disabled || undefined" :aria-label="label">
    <header class="dl-path-picker__header">
      <div><small>PATH PICKER</small><strong>{{ label }}</strong><span>{{ description }}</span></div>
      <button v-if="selections.length" type="button" class="dl-path-picker__clear" :disabled="disabled" @click="clear">清空</button>
    </header>

    <nav class="dl-path-picker__crumbs" aria-label="当前选择路径">
      <button type="button" :disabled="disabled" @click="apply({ type: 'path.collapse', depth: 0 })">全部</button>
      <template v-for="(node, index) in activeNodes" :key="dlPathKey(activePath.slice(0, index + 1))">
        <span aria-hidden="true">/</span>
        <button type="button" :disabled="disabled" @click="openPath(activePath.slice(0, index + 1))">{{ node.label }}</button>
      </template>
    </nav>

    <div class="dl-path-picker__workspace" :data-has-fields="activeFields.length > 0 || undefined">
      <div class="dl-path-picker__columns" aria-label="路径层级">
        <section v-for="column in columns" :key="`${column.depth}:${dlPathKey(column.prefix)}`" class="dl-path-picker__column" :data-path-column="column.depth">
          <header><span>{{ column.label }}</span><small>{{ column.items.length }}</small></header>
          <div v-if="column.items.length" class="dl-path-picker__nodes">
            <div
              v-for="(node, index) in column.items"
              :key="node.value"
              class="dl-path-picker__node"
              :data-active="activePath[column.depth] === node.value || undefined"
              :data-selected="selections.some(selection => sameDlPath(selection.path, [...column.prefix, node.value])) || undefined"
            >
              <button
                type="button"
                class="dl-path-picker__node-main"
                data-path-node
                :disabled="disabled || node.disabled"
                :aria-expanded="node.hasChildren || childrenFor(node, [...column.prefix, node.value]).length ? activePath[column.depth] === node.value : undefined"
                @click="openNode(node, column.prefix)"
                @dblclick="toggleNode(node, [...column.prefix, node.value])"
                @keydown="handleNodeKeydown($event, node, column.prefix, index)"
              >
                <span><strong>{{ node.label }}</strong><small v-if="node.description">{{ node.description }}</small></span>
                <i v-if="isLoading(`children:${dlPathKey([...column.prefix, node.value])}`)" aria-label="正在加载">···</i>
                <i v-else-if="node.hasChildren || childrenFor(node, [...column.prefix, node.value]).length" aria-hidden="true">{{ activePath[column.depth] === node.value ? '−' : '›' }}</i>
              </button>
              <button
                v-if="isDlPathNodeSelectable(node)"
                type="button"
                class="dl-path-picker__node-select"
                :aria-label="`${selections.some(selection => sameDlPath(selection.path, [...column.prefix, node.value])) ? '移除' : '选择'}${node.label}`"
                :aria-pressed="selections.some(selection => sameDlPath(selection.path, [...column.prefix, node.value]))"
                :disabled="disabled || node.disabled || (!canAddMore && !selections.some(selection => sameDlPath(selection.path, [...column.prefix, node.value])))"
                @click="toggleNode(node, [...column.prefix, node.value])"
              >{{ selections.some(selection => sameDlPath(selection.path, [...column.prefix, node.value])) ? '✓' : '＋' }}</button>
            </div>
          </div>
          <p v-else class="dl-path-picker__empty">{{ emptyText }}</p>
        </section>
      </div>

      <aside v-if="activeSelection && (activeFields.length || isLoading(`fields:${dlPathKey(activeSelection.path)}`))" class="dl-path-picker__fields" :aria-label="`${activeSelection.labels.join(' / ')}参数`">
        <header><div><small>PARAMETERS</small><strong>{{ activeSelection.labels.at(-1) }}</strong></div><span>{{ activeIssues.length ? `${activeIssues.length} 项待填写` : '参数完整' }}</span></header>
        <p v-if="isLoading(`fields:${dlPathKey(activeSelection.path)}`)" class="dl-path-picker__field-loading">正在加载参数…</p>
        <div v-for="field in activeFields" :key="field.key" class="dl-path-picker__field" :data-invalid="activeIssues.some(issue => issue.key === field.key) || undefined">
          <label :for="`dl-path-${dlPathKey(activeSelection.path)}-${field.key}`"><span>{{ field.label }}<b v-if="field.required">*</b></span><small v-if="field.description">{{ field.description }}</small></label>
          <RawDlInputText
            v-if="field.type === 'text'"
            :id="`dl-path-${dlPathKey(activeSelection.path)}-${field.key}`"
            :model-value="fieldStringValue(activeSelection, field)"
            :placeholder="field.placeholder"
            :disabled="disabled || field.disabled"
            :show-count="false"
            @update:model-value="updateParameter(activeSelection, field, $event)"
          />
          <RawDlNumberField
            v-else-if="field.type === 'number'"
            :id="`dl-path-${dlPathKey(activeSelection.path)}-${field.key}`"
            :model-value="fieldNumberValue(activeSelection, field)"
            :min="field.min"
            :max="field.max"
            :step="field.step"
            :disabled="disabled || field.disabled"
            @update:model-value="updateParameter(activeSelection, field, $event)"
          />
          <RawDlSelect
            v-else-if="field.type === 'select'"
            :model-value="fieldStringValue(activeSelection, field)"
            :options="optionsFor(field, activeSelection)"
            :placeholder="isLoading(`options:${optionCacheKey(activeSelection, field)}`) ? '正在加载…' : field.placeholder"
            :disabled="disabled || field.disabled || isLoading(`options:${optionCacheKey(activeSelection, field)}`)"
            @update:model-value="updateParameter(activeSelection, field, $event)"
          />
          <div v-else-if="field.type === 'multi-select'" class="dl-path-picker__multi" role="group" :aria-label="field.label">
            <RawDlCheckbox
              v-for="option in optionsFor(field, activeSelection)"
              :key="option.value"
              :model-value="fieldArrayValue(activeSelection, field).includes(option.value)"
              :label="option.label"
              :disabled="disabled || field.disabled || option.disabled"
              @update:model-value="toggleMultiValue(activeSelection, field, option, $event)"
            />
          </div>
          <RawDlSwitch
            v-else-if="field.type === 'switch'"
            :model-value="fieldBooleanValue(activeSelection, field)"
            :disabled="disabled || field.disabled"
            @update:model-value="updateParameter(activeSelection, field, $event)"
          />
          <slot
            v-else
            name="field"
            :field="field"
            :selection="activeSelection"
            :value="activeSelection.parameters[field.key]"
            :update="(value: DlPathFieldValue) => updateParameter(activeSelection!, field, value)"
          >
            <p class="dl-path-picker__custom-empty">请通过 field 插槽渲染 {{ field.label }}</p>
          </slot>
          <em v-if="activeIssues.find(issue => issue.key === field.key)">{{ activeIssues.find(issue => issue.key === field.key)?.message }}</em>
        </div>
      </aside>
    </div>

    <p v-if="errorMessage" class="dl-path-picker__error" role="alert">{{ errorMessage }}</p>

    <footer class="dl-path-picker__tray">
      <div><strong>{{ selectionLabel }}</strong><small>{{ selections.length }}{{ maxSelections ? ` / ${maxSelections}` : '' }}</small></div>
      <div v-if="selections.length" class="dl-path-picker__chips">
        <span v-for="selection in selections" :key="dlPathKey(selection.path)"><b>{{ selection.labels.join(' / ') }}</b><button type="button" :aria-label="`移除${selection.labels.join(' / ')}`" :disabled="disabled" @click="apply({ type: 'selection.remove', path: selection.path })">×</button></span>
      </div>
      <p v-else>尚未选择，点击节点右侧的“＋”加入。</p>
    </footer>
  </section>
</template>

<style scoped>
.dl-path-picker { display: grid; min-width: 0; gap: 12px; padding: 14px; border: 1px solid var(--dl-border); border-radius: var(--dl-radius-lg); background: var(--dl-panel); color: var(--dl-text); box-shadow: var(--dl-shadow); }
.dl-path-picker[data-disabled] { opacity: .62; }
.dl-path-picker__header { display: flex; min-width: 0; align-items: flex-start; justify-content: space-between; gap: 16px; }
.dl-path-picker__header > div { display: grid; min-width: 0; gap: 3px; }
.dl-path-picker__header small, .dl-path-picker__fields header small { color: var(--dl-accent-text); font-size: .56rem; font-weight: 900; letter-spacing: .14em; }
.dl-path-picker__header strong { font-size: .92rem; }
.dl-path-picker__header span { color: var(--dl-text-faint); font-size: .7rem; line-height: 1.5; }
.dl-path-picker__clear { padding: 5px 9px; border: 0; border-radius: 8px; background: transparent; color: var(--dl-text-faint); font-size: .68rem; cursor: pointer; }
.dl-path-picker__clear:hover { background: var(--dl-surface-hover); color: var(--dl-text); }
.dl-path-picker__crumbs { display: flex; min-width: 0; align-items: center; gap: 5px; overflow-x: auto; padding: 7px 9px; border: 1px solid var(--dl-border); border-radius: 10px; background: var(--dl-night-soft); color: var(--dl-text-faint); scrollbar-width: thin; }
.dl-path-picker__crumbs button { flex: 0 0 auto; padding: 3px 6px; border: 0; border-radius: 6px; background: transparent; color: var(--dl-text-muted); font-size: .67rem; cursor: pointer; }
.dl-path-picker__crumbs button:hover { background: var(--dl-surface-hover); color: var(--dl-accent-text); }
.dl-path-picker__workspace { display: grid; min-width: 0; gap: 12px; }
.dl-path-picker__workspace[data-has-fields] { grid-template-columns: minmax(0, 1.35fr) minmax(240px, .65fr); }
.dl-path-picker__columns { display: flex; min-width: 0; min-height: 260px; gap: 8px; overflow-x: auto; scroll-snap-type: x proximity; scrollbar-width: thin; }
.dl-path-picker__column { display: grid; width: min(260px, 76vw); min-width: min(220px, 72vw); grid-template-rows: auto minmax(0, 1fr); overflow: hidden; border: 1px solid var(--dl-border); border-radius: 12px; background: color-mix(in srgb, var(--dl-surface-solid) 88%, transparent); scroll-snap-align: start; }
.dl-path-picker__column > header { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 9px 10px; border-bottom: 1px solid var(--dl-border); color: var(--dl-text-faint); font-size: .63rem; font-weight: 800; }
.dl-path-picker__column > header small { font-variant-numeric: tabular-nums; }
.dl-path-picker__nodes { min-height: 0; overflow-y: auto; padding: 5px; scrollbar-width: thin; }
.dl-path-picker__node { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: stretch; border: 1px solid transparent; border-radius: 9px; }
.dl-path-picker__node + .dl-path-picker__node { margin-top: 3px; }
.dl-path-picker__node:hover { background: var(--dl-surface-hover); }
.dl-path-picker__node[data-active] { border-color: var(--dl-accent-border); background: var(--dl-accent-surface); }
.dl-path-picker__node[data-selected] .dl-path-picker__node-main strong { color: var(--dl-accent-text); }
.dl-path-picker__node-main { display: flex; min-width: 0; min-height: 44px; align-items: center; justify-content: space-between; gap: 9px; padding: 7px 8px; border: 0; background: transparent; color: var(--dl-text); text-align: left; cursor: pointer; outline: none; }
.dl-path-picker__node-main:focus-visible, .dl-path-picker__node-select:focus-visible { box-shadow: var(--dl-focus); }
.dl-path-picker__node-main:disabled, .dl-path-picker__node-select:disabled { cursor: not-allowed; opacity: .4; }
.dl-path-picker__node-main > span { display: grid; min-width: 0; gap: 2px; }
.dl-path-picker__node-main strong, .dl-path-picker__node-main small { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dl-path-picker__node-main strong { font-size: .75rem; }
.dl-path-picker__node-main small { color: var(--dl-text-faint); font-size: .61rem; }
.dl-path-picker__node-main i { color: var(--dl-accent-text); font-size: .8rem; font-style: normal; }
.dl-path-picker__node-select { width: 34px; min-width: 34px; margin: 5px; border: 1px solid var(--dl-border); border-radius: 8px; background: var(--dl-surface); color: var(--dl-text-faint); cursor: pointer; }
.dl-path-picker__node-select[aria-pressed='true'] { border-color: var(--dl-accent-border); background: var(--dl-accent-surface); color: var(--dl-accent-text); }
.dl-path-picker__empty { display: grid; min-height: 160px; place-items: center; margin: 0; padding: 16px; color: var(--dl-text-faint); font-size: .7rem; text-align: center; }
.dl-path-picker__fields { display: grid; min-width: 0; align-content: start; gap: 12px; padding: 12px; border: 1px solid var(--dl-accent-border); border-radius: 13px; background: var(--dl-accent-surface); }
.dl-path-picker__fields > header { display: flex; min-width: 0; align-items: flex-start; justify-content: space-between; gap: 10px; padding-bottom: 9px; border-bottom: 1px solid var(--dl-border); }
.dl-path-picker__fields > header > div { display: grid; gap: 3px; }
.dl-path-picker__fields > header strong { font-size: .82rem; }
.dl-path-picker__fields > header > span { color: var(--dl-text-faint); font-size: .61rem; }
.dl-path-picker__field { display: grid; min-width: 0; gap: 6px; }
.dl-path-picker__field > label { display: grid; gap: 2px; color: var(--dl-text-muted); font-size: .68rem; }
.dl-path-picker__field > label b { margin-left: 3px; color: #d75d67; }
.dl-path-picker__field > label small { color: var(--dl-text-faint); font-size: .6rem; line-height: 1.4; }
.dl-path-picker__field > em { color: #d75d67; font-size: .61rem; font-style: normal; }
.dl-path-picker__multi { display: flex; flex-wrap: wrap; gap: 8px 12px; padding: 9px; border: 1px solid var(--dl-border); border-radius: 10px; background: color-mix(in srgb, var(--dl-surface-solid) 72%, transparent); }
.dl-path-picker__field-loading, .dl-path-picker__custom-empty { margin: 0; color: var(--dl-text-faint); font-size: .68rem; }
.dl-path-picker__error { margin: 0; padding: 8px 10px; border: 1px solid color-mix(in srgb, #d75d67 42%, var(--dl-border)); border-radius: 9px; background: color-mix(in srgb, #d75d67 9%, transparent); color: #d75d67; font-size: .68rem; }
.dl-path-picker__tray { display: grid; grid-template-columns: auto minmax(0, 1fr); min-width: 0; align-items: center; gap: 10px 14px; padding-top: 11px; border-top: 1px solid var(--dl-border); }
.dl-path-picker__tray > div:first-child { display: grid; gap: 2px; }
.dl-path-picker__tray > div:first-child strong { font-size: .68rem; }
.dl-path-picker__tray > div:first-child small, .dl-path-picker__tray > p { color: var(--dl-text-faint); font-size: .61rem; }
.dl-path-picker__tray > p { margin: 0; }
.dl-path-picker__chips { display: flex; min-width: 0; flex-wrap: wrap; gap: 5px; }
.dl-path-picker__chips > span { display: inline-flex; max-width: 100%; align-items: center; gap: 5px; padding: 4px 5px 4px 8px; border: 1px solid var(--dl-accent-border); border-radius: 999px; background: var(--dl-accent-surface); color: var(--dl-accent-text); }
.dl-path-picker__chips b { overflow: hidden; font-size: .62rem; text-overflow: ellipsis; white-space: nowrap; }
.dl-path-picker__chips button { display: grid; width: 20px; height: 20px; place-items: center; border: 0; border-radius: 50%; background: transparent; color: inherit; cursor: pointer; }
.dl-path-picker__chips button:hover { background: var(--dl-surface-hover); }
@media (max-width: 760px) {
  .dl-path-picker { padding: 11px; }
  .dl-path-picker__workspace[data-has-fields] { grid-template-columns: minmax(0, 1fr); }
  .dl-path-picker__columns { min-height: 230px; }
  .dl-path-picker__tray { grid-template-columns: minmax(0, 1fr); }
}
</style>
