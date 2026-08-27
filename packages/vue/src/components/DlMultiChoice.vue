<script setup lang="ts">
import { computed, nextTick, ref, useId, watch } from 'vue'
import { DialogContent, DialogDescription, DialogOverlay, DialogPortal, DialogRoot, DialogTitle } from 'reka-ui'
import { useDlModalLayer } from '../composables/useDlLayer'
import type { DlSize } from '../types'
import type { DlChoicePortalOverlay } from './choice-portal.types'
import type { DlMultiChoiceEntry, DlMultiChoiceGroup, DlMultiChoiceOption } from './multi-choice.types'

type MultiChoiceStatus = 'default' | 'success' | 'warning' | 'error'
type IndexedOption = DlMultiChoiceOption & { groupLabel?: string; searchText: string }

const props = withDefaults(defineProps<{
  open?: boolean
  modelValue?: string[]
  options: DlMultiChoiceEntry[]
  placeholder?: string
  searchPlaceholder?: string
  size?: DlSize
  status?: MultiChoiceStatus
  overlay?: DlChoicePortalOverlay
  searchable?: boolean
  searchThreshold?: number
  clearable?: boolean
  maxTagCount?: number
  disabled?: boolean
  name?: string
  required?: boolean
  zIndex?: number
}>(), {
  open: undefined,
  modelValue: () => [],
  placeholder: '请选择多项',
  searchPlaceholder: '搜索名称、值或关键词',
  size: 'md',
  status: 'default',
  overlay: 'auto',
  searchable: undefined,
  searchThreshold: 8,
  clearable: false,
  maxTagCount: 3,
  disabled: false,
  name: undefined,
  required: false,
  zIndex: undefined,
})

const emit = defineEmits<{
  'update:open': [value: boolean]
  'update:modelValue': [value: string[]]
  change: [value: string[]]
  clear: []
  search: [value: string]
}>()

const internalOpen = ref(false)
const query = ref('')
const highlightedValue = ref<string | null>(null)
const searchInput = ref<HTMLInputElement | null>(null)
const panel = ref<HTMLElement | { $el?: unknown } | null>(null)
const list = ref<HTMLElement | null>(null)
const listboxId = `dl-multi-choice-${useId().replace(/:/g, '')}`
const { overlayZIndex, contentZIndex } = useDlModalLayer(() => props.zIndex)

const isGroup = (entry: DlMultiChoiceEntry): entry is DlMultiChoiceGroup => 'options' in entry && Array.isArray(entry.options)
const indexedOptions = computed<IndexedOption[]>(() => props.options.flatMap(entry => isGroup(entry)
  ? entry.options.map(option => indexOption(option, entry.label))
  : [indexOption(entry)]))
const selectedSet = computed(() => new Set(props.modelValue))
const selectedOptions = computed(() => props.modelValue.map(value => indexedOptions.value.find(option => option.value === value)
  ?? { value, label: value, searchText: value.toLocaleLowerCase() }))
const visibleTags = computed(() => selectedOptions.value.slice(0, Math.max(0, props.maxTagCount)))
const hiddenTagCount = computed(() => Math.max(0, selectedOptions.value.length - visibleTags.value.length))
const resolvedOpen = computed(() => props.open ?? internalOpen.value)
const resolvedSearchable = computed(() => props.searchable === true
  || (props.searchable === undefined && indexedOptions.value.length >= props.searchThreshold))
const normalizedQuery = computed(() => query.value.normalize('NFKC').trim().toLocaleLowerCase())
const filteredOptions = computed(() => normalizedQuery.value
  ? indexedOptions.value.filter(option => option.searchText.includes(normalizedQuery.value) || fuzzyMatch(option.searchText, normalizedQuery.value))
  : indexedOptions.value)
const visibleGroups = computed(() => {
  const groups = new Map<string, IndexedOption[]>()
  for (const option of filteredOptions.value) {
    const label = option.groupLabel ?? ''
    groups.set(label, [...(groups.get(label) ?? []), option])
  }
  return [...groups].map(([label, options]) => ({ label, options }))
})
const enabledOptions = computed(() => filteredOptions.value.filter(option => !option.disabled))
const activeDescendant = computed(() => highlightedValue.value ? `${listboxId}-${safeId(highlightedValue.value)}` : undefined)

function indexOption(option: DlMultiChoiceOption, groupLabel?: string): IndexedOption {
  return { ...option, groupLabel, searchText: [option.label, option.value, option.description, ...(option.keywords ?? [])].filter(Boolean).join(' ').normalize('NFKC').toLocaleLowerCase() }
}

function fuzzyMatch(source: string, keyword: string) {
  let cursor = 0
  for (const character of keyword) {
    cursor = source.indexOf(character, cursor)
    if (cursor < 0) return false
    cursor += 1
  }
  return true
}

function safeId(value: string) {
  return [...value].map(character => /[a-zA-Z0-9_-]/.test(character) ? character : `_${character.codePointAt(0)?.toString(16)}`).join('')
}

function setOpen(value: boolean) {
  internalOpen.value = value
  emit('update:open', value)
}

function toggleValue(value: string) {
  const option = indexedOptions.value.find(item => item.value === value)
  if (props.disabled || option?.disabled) return
  const next = selectedSet.value.has(value) ? props.modelValue.filter(item => item !== value) : [...props.modelValue, value]
  emit('update:modelValue', next)
  emit('change', next)
}

function clearValue(event?: MouseEvent) {
  event?.preventDefault()
  event?.stopPropagation()
  if (props.disabled || !props.modelValue.length) return
  emit('update:modelValue', [])
  emit('change', [])
  emit('clear')
}

function updateSearch(value: string) {
  query.value = value
  emit('search', value)
}

function scrollHighlightedIntoView() {
  nextTick(() => list.value?.querySelector<HTMLElement>(`[data-choice-value="${safeId(highlightedValue.value ?? '')}"]`)?.scrollIntoView({ block: 'nearest' }))
}

function moveHighlight(delta: number) {
  if (!enabledOptions.value.length) return
  const current = enabledOptions.value.findIndex(option => option.value === highlightedValue.value)
  const next = (Math.max(0, current) + delta + enabledOptions.value.length) % enabledOptions.value.length
  highlightedValue.value = enabledOptions.value[next]?.value ?? null
  scrollHighlightedIntoView()
}

function handlePanelKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    moveHighlight(event.key === 'ArrowDown' ? 1 : -1)
  } else if (event.key === 'Home' || event.key === 'End') {
    event.preventDefault()
    highlightedValue.value = event.key === 'Home' ? enabledOptions.value[0]?.value ?? null : enabledOptions.value.at(-1)?.value ?? null
    scrollHighlightedIntoView()
  } else if ((event.key === 'Enter' || event.key === ' ') && highlightedValue.value && (event.target === searchInput.value || event.target === panel.value)) {
    event.preventDefault()
    toggleValue(highlightedValue.value)
  }
}

function focusPanel(event: Event) {
  event.preventDefault()
  nextTick(() => {
    const target = resolvedSearchable.value ? searchInput.value : resolveElement(panel.value)
    target?.focus()
  })
}

function resolveElement(target: HTMLElement | { $el?: unknown } | null) {
  if (target instanceof HTMLElement) return target
  return target?.$el instanceof HTMLElement ? target.$el : null
}

watch(resolvedOpen, open => {
  if (!open) return
  query.value = ''
  highlightedValue.value = enabledOptions.value.find(option => selectedSet.value.has(option.value))?.value ?? enabledOptions.value[0]?.value ?? null
})

watch(filteredOptions, options => {
  if (options.some(option => option.value === highlightedValue.value && !option.disabled)) return
  highlightedValue.value = options.find(option => !option.disabled)?.value ?? null
})
</script>

<template>
  <div data-dl data-slot="multi-choice" class="dl-multi-choice" :data-size="size" :data-status="status" :data-disabled="disabled || undefined">
    <span v-if="$slots.prefix" class="dl-multi-choice__prefix"><slot name="prefix" /></span>
    <button type="button" class="dl-multi-choice__trigger" :class="{ 'is-placeholder': !selectedOptions.length }" :disabled="disabled" aria-haspopup="dialog" :aria-expanded="resolvedOpen" @click="setOpen(true)">
      <span v-if="selectedOptions.length" class="dl-multi-choice__tags">
        <span v-for="option in visibleTags" :key="option.value">{{ option.label }}</span><em v-if="hiddenTagCount">+{{ hiddenTagCount }}</em>
      </span>
      <span v-else>{{ placeholder }}</span>
    </button>
    <span class="dl-multi-choice__actions"><button v-if="clearable && modelValue.length && !disabled" type="button" aria-label="清除全部选择" @click="clearValue">×</button><span aria-hidden="true">⌄</span></span>
  </div>

  <select v-if="name" class="dl-multi-choice__native" :name="name" :value="modelValue" :disabled="disabled" :required="required" multiple tabindex="-1" aria-hidden="true">
    <option v-for="option in indexedOptions" :key="option.value" :value="option.value" :disabled="option.disabled">{{ option.label }}</option>
  </select>

  <DialogRoot :open="resolvedOpen" @update:open="setOpen">
    <DialogPortal>
      <DialogOverlay data-dl data-dl-layer="overlay" class="dl-multi-choice__overlay" :style="{ zIndex: overlayZIndex }" />
      <DialogContent ref="panel" data-dl data-slot="multi-choice-panel" data-dl-layer="modal" class="dl-multi-choice__panel" :data-overlay="overlay" :style="{ zIndex: contentZIndex }" @open-auto-focus="focusPanel" @keydown="handlePanelKeydown">
        <header class="dl-multi-choice__header"><div><small>MULTI CHOICE</small><DialogTitle>{{ placeholder }}</DialogTitle><DialogDescription>{{ indexedOptions.length }} 个选项 · 已选 {{ selectedOptions.length }} 项</DialogDescription></div><button type="button" aria-label="关闭多选器" @click="setOpen(false)">×</button></header>
        <label v-if="resolvedSearchable" class="dl-multi-choice__search"><span aria-hidden="true">⌕</span><input ref="searchInput" type="search" role="combobox" autocomplete="off" :value="query" :placeholder="searchPlaceholder" :aria-controls="listboxId" :aria-activedescendant="activeDescendant" @input="updateSearch(($event.target as HTMLInputElement).value)" /><kbd>↑↓</kbd><kbd>↵</kbd></label>
        <div ref="list" :id="listboxId" class="dl-multi-choice__list" role="listbox" aria-multiselectable="true" :aria-activedescendant="activeDescendant">
          <template v-if="visibleGroups.length">
            <section v-for="group in visibleGroups" :key="group.label" class="dl-multi-choice__group" role="group" :aria-label="group.label || undefined"><h4 v-if="group.label">{{ group.label }}</h4><button v-for="option in group.options" :id="`${listboxId}-${safeId(option.value)}`" :key="option.value" type="button" role="option" class="dl-multi-choice__option" :class="{ 'is-selected': selectedSet.has(option.value), 'is-highlighted': option.value === highlightedValue }" :aria-selected="selectedSet.has(option.value)" :data-choice-value="safeId(option.value)" :disabled="option.disabled" @mouseenter="highlightedValue = option.disabled ? highlightedValue : option.value" @click="toggleValue(option.value)"><span><strong>{{ option.label }}</strong><small v-if="option.description">{{ option.description }}</small></span><b aria-hidden="true">{{ selectedSet.has(option.value) ? '✓' : '+' }}</b></button></section>
          </template>
          <div v-else class="dl-multi-choice__empty">没有匹配的选项</div>
        </div>
        <footer><button v-if="clearable" type="button" class="dl-multi-choice__ghost" :disabled="!modelValue.length" @click="clearValue()">清除</button><span>{{ selectedOptions.length }} 项已选</span><button type="button" class="dl-multi-choice__primary" @click="setOpen(false)">完成</button></footer>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<style scoped>
.dl-multi-choice { display: flex; width: 100%; min-width: 0; align-items: center; overflow: hidden; border: 1px solid var(--dl-border); border-radius: var(--dl-radius-sm); background: var(--dl-surface); color: var(--dl-text); box-shadow: inset 0 1px rgb(255 255 255 / 6%), 0 8px 24px rgb(0 0 0 / 8%); transition: border-color .16s ease, box-shadow .16s ease; }
.dl-multi-choice:focus-within { border-color: var(--dl-border-focus); box-shadow: var(--dl-focus); }
.dl-multi-choice[data-size='sm'] { min-height: 36px; font-size: .78rem; }.dl-multi-choice[data-size='md'] { min-height: 44px; font-size: .84rem; }.dl-multi-choice[data-size='lg'] { min-height: 52px; font-size: .92rem; }
.dl-multi-choice[data-status='success'] { border-color: color-mix(in srgb, #31a36f 58%, var(--dl-border)); }.dl-multi-choice[data-status='warning'] { border-color: color-mix(in srgb, #d89a31 58%, var(--dl-border)); }.dl-multi-choice[data-status='error'] { border-color: color-mix(in srgb, #d84d57 58%, var(--dl-border)); }.dl-multi-choice[data-disabled] { opacity: .5; }
.dl-multi-choice__prefix { padding-left: 12px; color: var(--dl-text-faint); }.dl-multi-choice__trigger { min-width: 0; flex: 1; align-self: stretch; overflow: hidden; padding: 6px 10px 6px 12px; border: 0; background: transparent; color: inherit; text-align: left; cursor: pointer; outline: none; }.dl-multi-choice__trigger.is-placeholder { color: var(--dl-text-faint); }.dl-multi-choice__trigger:disabled { cursor: not-allowed; }
.dl-multi-choice__tags { display: flex; min-width: 0; flex-wrap: nowrap; align-items: center; gap: 5px; overflow: hidden; }.dl-multi-choice__tags > span, .dl-multi-choice__tags em { flex: 0 0 auto; padding: 3px 7px; border: 1px solid var(--dl-border); border-radius: 999px; background: var(--dl-night-soft); color: var(--dl-text-muted); font-size: .68rem; font-style: normal; white-space: nowrap; }.dl-multi-choice__tags em { border-color: var(--dl-accent-border); color: var(--dl-accent-text); }
.dl-multi-choice__actions { display: flex; align-items: center; gap: 5px; padding-right: 12px; color: var(--dl-text-faint); }.dl-multi-choice__actions button { display: grid; width: 24px; height: 24px; place-items: center; border: 0; border-radius: 50%; background: transparent; color: inherit; cursor: pointer; }.dl-multi-choice__actions button:hover { background: var(--dl-surface-hover); color: var(--dl-text); }.dl-multi-choice__native { position: fixed; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
.dl-multi-choice__overlay { position: fixed; inset: 0; background: rgb(7 14 11 / 46%); backdrop-filter: blur(12px) saturate(108%); }.dl-multi-choice__panel { position: fixed; top: 50%; left: 50%; display: grid; width: min(calc(100vw - 32px), 680px); max-height: min(84vh, 780px); grid-template-rows: auto auto minmax(0, 1fr) auto; gap: 14px; overflow: hidden; padding: 22px; border: 1px solid var(--dl-border-strong); border-radius: 28px; background: var(--dl-panel); color: var(--dl-text); box-shadow: 0 34px 100px rgb(0 0 0 / 45%), inset 0 1px rgb(255 255 255 / 12%); outline: none; transform: translate(-50%, -50%); }
.dl-multi-choice__header { display: flex; justify-content: space-between; gap: 18px; }.dl-multi-choice__header > div { display: grid; gap: 4px; }.dl-multi-choice__header small { color: var(--dl-accent-text); font-size: .6rem; font-weight: 900; letter-spacing: .16em; }.dl-multi-choice__header h2 { margin: 0; font-size: 1.18rem; }.dl-multi-choice__header p { margin: 0; color: var(--dl-text-faint); font-size: .7rem; }.dl-multi-choice__header > button { display: grid; width: 38px; height: 38px; place-items: center; border: 1px solid var(--dl-border); border-radius: 50%; background: var(--dl-surface); color: var(--dl-text-faint); cursor: pointer; }
.dl-multi-choice__search { display: grid; grid-template-columns: auto minmax(0, 1fr) auto auto; align-items: center; gap: 8px; padding: 9px 12px; border: 1px solid var(--dl-border); border-radius: 14px; background: var(--dl-surface-solid); color: var(--dl-text-faint); }.dl-multi-choice__search:focus-within { border-color: var(--dl-border-focus); box-shadow: var(--dl-focus); }.dl-multi-choice__search input { min-width: 0; border: 0; background: transparent; color: var(--dl-text); outline: none; }.dl-multi-choice__search kbd { padding: 2px 5px; border: 1px solid var(--dl-border); border-radius: 5px; background: var(--dl-night-soft); font: .58rem/1.2 monospace; }
.dl-multi-choice__list { min-height: 160px; overflow: auto; overscroll-behavior: contain; scrollbar-color: var(--dl-border-strong) transparent; }.dl-multi-choice__group { display: grid; gap: 5px; }.dl-multi-choice__group + .dl-multi-choice__group { margin-top: 14px; }.dl-multi-choice__group h4 { margin: 0; padding: 2px 7px; color: var(--dl-text-faint); font-size: .62rem; letter-spacing: .08em; }
.dl-multi-choice__option { display: flex; width: 100%; min-height: 50px; align-items: center; justify-content: space-between; gap: 14px; padding: 9px 12px; border: 1px solid transparent; border-radius: 13px; background: transparent; color: var(--dl-text); text-align: left; cursor: pointer; outline: none; }.dl-multi-choice__option:hover, .dl-multi-choice__option.is-highlighted { border-color: var(--dl-border); background: var(--dl-surface-hover); }.dl-multi-choice__option.is-selected { border-color: var(--dl-accent-border); background: var(--dl-accent-surface); }.dl-multi-choice__option:focus-visible { box-shadow: var(--dl-focus); }.dl-multi-choice__option:disabled { cursor: not-allowed; opacity: .4; }.dl-multi-choice__option > span { display: grid; min-width: 0; gap: 3px; }.dl-multi-choice__option strong { font-size: .82rem; }.dl-multi-choice__option small { color: var(--dl-text-faint); font-size: .67rem; }.dl-multi-choice__option b { color: var(--dl-accent-text); }
.dl-multi-choice__empty { display: grid; min-height: 170px; place-items: center; color: var(--dl-text-faint); }.dl-multi-choice__panel footer { display: flex; align-items: center; gap: 10px; padding-top: 14px; border-top: 1px solid var(--dl-border); }.dl-multi-choice__panel footer > span { flex: 1; color: var(--dl-text-faint); font-size: .68rem; text-align: right; }.dl-multi-choice__ghost, .dl-multi-choice__primary { min-height: 36px; padding: 0 14px; border-radius: 10px; font-size: .72rem; font-weight: 800; cursor: pointer; }.dl-multi-choice__ghost { border: 1px solid var(--dl-border); background: var(--dl-surface); color: var(--dl-text-muted); }.dl-multi-choice__primary { border: 1px solid var(--dl-button-primary-border); background: var(--dl-button-primary-bg); color: var(--dl-button-primary-text); }.dl-multi-choice__ghost:disabled { cursor: not-allowed; opacity: .4; }
.dl-multi-choice__panel[data-overlay='drawer'] { top: auto; bottom: 0; width: min(100vw, 760px); border-bottom: 0; border-radius: 28px 28px 0 0; transform: translate(-50%, 0); }
@media (max-width: 720px) { .dl-multi-choice__panel[data-overlay='auto'] { top: auto; bottom: 0; left: 0; width: 100%; max-height: 88dvh; padding: 18px 16px max(18px, env(safe-area-inset-bottom)); border-right: 0; border-bottom: 0; border-left: 0; border-radius: 26px 26px 0 0; transform: none; }.dl-multi-choice__search kbd { display: none; }.dl-multi-choice__option { min-height: 54px; } }
</style>
