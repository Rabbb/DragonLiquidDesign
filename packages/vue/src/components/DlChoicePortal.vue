<script setup lang="ts">
import { computed, nextTick, ref, useId, watch } from 'vue'
import {
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from 'reka-ui'
import { useDlModalLayer } from '../composables/useDlLayer'
import type { DlSize } from '../types'
import type {
  DlChoicePortalEntry,
  DlChoicePortalGroup,
  DlChoicePortalOption,
  DlChoicePortalOverlay,
} from './choice-portal.types'

type ChoicePortalStatus = 'default' | 'success' | 'warning' | 'error'
type IndexedOption = DlChoicePortalOption & { groupLabel?: string; searchText: string; custom?: boolean }

const props = withDefaults(defineProps<{
  open?: boolean
  modelValue?: string
  options: DlChoicePortalEntry[]
  placeholder?: string
  searchPlaceholder?: string
  size?: DlSize
  status?: ChoicePortalStatus
  overlay?: DlChoicePortalOverlay
  searchable?: boolean
  searchThreshold?: number
  clearable?: boolean
  allowCustom?: boolean
  disabled?: boolean
  name?: string
  required?: boolean
  zIndex?: number
}>(), {
  open: undefined,
  modelValue: '',
  placeholder: '请选择',
  searchPlaceholder: '搜索名称、值或关键词',
  size: 'md',
  status: 'default',
  overlay: 'auto',
  searchable: undefined,
  searchThreshold: 8,
  clearable: false,
  allowCustom: false,
  disabled: false,
  name: undefined,
  required: false,
  zIndex: undefined,
})

const emit = defineEmits<{
  'update:open': [value: boolean]
  'update:modelValue': [value: string]
  change: [value: string]
  clear: []
  search: [value: string]
}>()

const internalOpen = ref(false)
const query = ref('')
const highlightedValue = ref<string | null>(null)
const searchInput = ref<HTMLInputElement | null>(null)
const panel = ref<HTMLElement | null>(null)
const list = ref<HTMLElement | null>(null)
const listboxId = `dl-choice-portal-${useId().replace(/:/g, '')}`
const { overlayZIndex, contentZIndex } = useDlModalLayer(() => props.zIndex)

const isGroup = (entry: DlChoicePortalEntry): entry is DlChoicePortalGroup =>
  'options' in entry && Array.isArray(entry.options)

const indexedOptions = computed<IndexedOption[]>(() => props.options.flatMap(entry => {
  if (!isGroup(entry)) return [indexOption(entry)]
  return entry.options.map(option => indexOption(option, entry.label))
}))

const selectedOption = computed(() => indexedOptions.value.find(option => option.value === props.modelValue))
const displayLabel = computed(() => selectedOption.value?.label ?? (props.modelValue || props.placeholder))
const isPlaceholder = computed(() => !selectedOption.value && !props.modelValue)
const resolvedOpen = computed(() => props.open ?? internalOpen.value)
const resolvedSearchable = computed(() => props.allowCustom || props.searchable === true
  || (props.searchable === undefined && indexedOptions.value.length >= props.searchThreshold))
const normalizedQuery = computed(() => query.value.normalize('NFKC').trim().toLocaleLowerCase())

function indexOption(option: DlChoicePortalOption, groupLabel?: string): IndexedOption {
  return {
    ...option,
    groupLabel,
    searchText: [option.label, option.value, option.description, ...(option.keywords ?? [])]
      .filter(Boolean)
      .join(' ')
      .normalize('NFKC')
      .toLocaleLowerCase(),
  }
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

function sanitizeCustomValue(value: string) {
  return value.normalize('NFKC').replace(/[\p{Cc}\p{Cf}]/gu, '').trim()
}

const customOption = computed<IndexedOption | null>(() => {
  if (!props.allowCustom) return null
  const value = sanitizeCustomValue(query.value)
  if (!value || indexedOptions.value.some(option => option.value === value || option.label === value)) return null
  return { value, label: value, groupLabel: '自定义', searchText: value.toLocaleLowerCase(), custom: true }
})

const filteredOptions = computed(() => {
  const keyword = normalizedQuery.value
  const matches = keyword
    ? indexedOptions.value.filter(option => option.searchText.includes(keyword) || fuzzyMatch(option.searchText, keyword))
    : indexedOptions.value
  return customOption.value ? [customOption.value, ...matches] : matches
})

const visibleGroups = computed(() => {
  const groups = new Map<string, IndexedOption[]>()
  for (const option of filteredOptions.value) {
    const label = option.groupLabel ?? ''
    groups.set(label, [...(groups.get(label) ?? []), option])
  }
  return [...groups].map(([label, options]) => ({ label, options }))
})

const enabledOptions = computed(() => filteredOptions.value.filter(option => !option.disabled))
const activeDescendant = computed(() => highlightedValue.value
  ? `${listboxId}-${safeId(highlightedValue.value)}`
  : undefined)

function safeId(value: string) {
  return [...value].map(character => /[a-zA-Z0-9_-]/.test(character)
    ? character
    : `_${character.codePointAt(0)?.toString(16)}`).join('')
}

function setOpen(value: boolean) {
  internalOpen.value = value
  emit('update:open', value)
}

function openPortal() {
  if (!props.disabled) setOpen(true)
}

function closePortal() {
  setOpen(false)
}

function choose(value: string) {
  const option = filteredOptions.value.find(item => item.value === value)
  if (!option || option.disabled) return
  emit('update:modelValue', value)
  emit('change', value)
  closePortal()
}

function clearValue(event: MouseEvent) {
  event.preventDefault()
  event.stopPropagation()
  if (!props.clearable || props.disabled || !props.modelValue) return
  emit('update:modelValue', '')
  emit('change', '')
  emit('clear')
}

function updateSearch(value: string) {
  query.value = value
  emit('search', value)
}

function scrollHighlightedIntoView() {
  nextTick(() => list.value
    ?.querySelector<HTMLElement>(`[data-choice-value="${safeId(highlightedValue.value ?? '')}"]`)
    ?.scrollIntoView({ block: 'nearest' }))
}

function moveHighlight(delta: number) {
  const options = enabledOptions.value
  if (!options.length) return
  const current = options.findIndex(option => option.value === highlightedValue.value)
  const next = Math.max(0, Math.min(options.length - 1, (current < 0 ? 0 : current) + delta))
  highlightedValue.value = options[next]?.value ?? null
  scrollHighlightedIntoView()
}

function handlePanelKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    moveHighlight(1)
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    moveHighlight(-1)
  } else if (event.key === 'Home') {
    event.preventDefault()
    highlightedValue.value = enabledOptions.value[0]?.value ?? null
    scrollHighlightedIntoView()
  } else if (event.key === 'End') {
    event.preventDefault()
    highlightedValue.value = enabledOptions.value.at(-1)?.value ?? null
    scrollHighlightedIntoView()
  } else if (event.key === 'Enter' && (event.target === searchInput.value || event.target === panel.value)) {
    event.preventDefault()
    if (highlightedValue.value) choose(highlightedValue.value)
  }
}

function focusPortal(event: Event) {
  event.preventDefault()
  nextTick(() => (resolvedSearchable.value ? searchInput.value : panel.value)?.focus())
}

watch(resolvedOpen, open => {
  if (!open) return
  query.value = props.allowCustom ? props.modelValue : ''
  highlightedValue.value = props.modelValue
    || enabledOptions.value[0]?.value
    || null
})

watch(filteredOptions, options => {
  if (options.some(option => option.value === highlightedValue.value && !option.disabled)) return
  highlightedValue.value = options.find(option => !option.disabled)?.value ?? null
})
</script>

<template>
  <div
    data-dl
    data-slot="choice-portal"
    class="dl-choice-portal"
    :data-size="size"
    :data-status="status"
    :data-disabled="disabled || undefined"
  >
    <span v-if="$slots.prefix" class="dl-choice-portal__prefix"><slot name="prefix" /></span>
    <button
      type="button"
      class="dl-choice-portal__trigger"
      :class="{ 'is-placeholder': isPlaceholder }"
      :disabled="disabled"
      aria-haspopup="dialog"
      :aria-expanded="resolvedOpen"
      @click="openPortal"
    >{{ displayLabel }}</button>
    <span class="dl-choice-portal__actions">
      <button v-if="clearable && modelValue && !disabled" type="button" class="dl-choice-portal__clear" aria-label="清除当前选择" @click="clearValue">×</button>
      <span aria-hidden="true">⌄</span>
    </span>
  </div>

  <select v-if="name" class="dl-choice-portal__native" :name="name" :value="modelValue" :disabled="disabled" :required="required" tabindex="-1" aria-hidden="true">
    <option value="">{{ placeholder }}</option>
    <option v-for="option in indexedOptions" :key="option.value" :value="option.value" :disabled="option.disabled">{{ option.label }}</option>
    <option v-if="modelValue && !selectedOption" :value="modelValue">{{ modelValue }}</option>
  </select>

  <DialogRoot :open="resolvedOpen" @update:open="setOpen">
    <DialogPortal>
      <DialogOverlay data-dl data-dl-layer="overlay" class="dl-choice-portal__overlay" :style="{ zIndex: overlayZIndex }" />
      <DialogContent
        ref="panel"
        data-dl
        data-slot="choice-portal-panel"
        data-dl-layer="modal"
        class="dl-choice-portal__panel"
        :data-overlay="overlay"
        :style="{ zIndex: contentZIndex }"
        :aria-describedby="`${listboxId}-description`"
        @open-auto-focus="focusPortal"
        @keydown="handlePanelKeydown"
      >
        <header class="dl-choice-portal__header">
          <div>
            <small>CHOICE PORTAL</small>
            <DialogTitle>{{ placeholder }}</DialogTitle>
            <DialogDescription :id="`${listboxId}-description`">{{ indexedOptions.length }} 个选项<span v-if="query"> · {{ filteredOptions.length }} 个匹配</span></DialogDescription>
          </div>
          <button type="button" class="dl-choice-portal__close" aria-label="关闭选择器" @click="closePortal">×</button>
        </header>

        <label v-if="resolvedSearchable" class="dl-choice-portal__search">
          <span aria-hidden="true">⌕</span>
          <input
            ref="searchInput"
            type="search"
            role="combobox"
            autocomplete="off"
            :value="query"
            :placeholder="searchPlaceholder"
            :aria-controls="listboxId"
            :aria-activedescendant="activeDescendant"
            @input="updateSearch(($event.target as HTMLInputElement).value)"
          />
          <kbd>↑↓</kbd><kbd>↵</kbd>
        </label>

        <div ref="list" :id="listboxId" class="dl-choice-portal__list" role="listbox" :aria-activedescendant="activeDescendant">
          <template v-if="visibleGroups.length">
            <section v-for="group in visibleGroups" :key="group.label" class="dl-choice-portal__group" role="group" :aria-label="group.label || undefined">
              <h4 v-if="group.label">{{ group.label }}</h4>
              <button
                v-for="option in group.options"
                :id="`${listboxId}-${safeId(option.value)}`"
                :key="option.value"
                type="button"
                role="option"
                class="dl-choice-portal__option"
                :class="{ 'is-selected': option.value === modelValue, 'is-highlighted': option.value === highlightedValue }"
                :aria-selected="option.value === modelValue"
                :data-choice-value="safeId(option.value)"
                :disabled="option.disabled"
                @mouseenter="highlightedValue = option.disabled ? highlightedValue : option.value"
                @click="choose(option.value)"
              >
                <span><strong>{{ option.label }}</strong><small v-if="option.description">{{ option.description }}</small></span>
                <em v-if="option.custom">CUSTOM</em><b v-else-if="option.value === modelValue" aria-hidden="true">✓</b>
              </button>
            </section>
          </template>
          <div v-else class="dl-choice-portal__empty">没有匹配的选项</div>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<style scoped>
.dl-choice-portal { display: flex; width: 100%; min-width: 0; align-items: center; overflow: hidden; border: 1px solid var(--dl-border); border-radius: var(--dl-radius-sm); background: var(--dl-surface); color: var(--dl-text); box-shadow: inset 0 1px 0 rgb(255 255 255 / 6%), 0 8px 24px rgb(0 0 0 / 8%); transition: border-color .16s ease, box-shadow .16s ease; }
.dl-choice-portal:focus-within { border-color: var(--dl-border-focus); box-shadow: var(--dl-focus); }
.dl-choice-portal[data-size='sm'] { min-height: 36px; font-size: .82rem; }
.dl-choice-portal[data-size='md'] { min-height: 44px; font-size: .875rem; }
.dl-choice-portal[data-size='lg'] { min-height: 52px; font-size: 1rem; }
.dl-choice-portal[data-status='success'] { border-color: color-mix(in srgb, #31a36f 58%, var(--dl-border)); }
.dl-choice-portal[data-status='warning'] { border-color: color-mix(in srgb, #d89a31 58%, var(--dl-border)); }
.dl-choice-portal[data-status='error'] { border-color: color-mix(in srgb, #d84d57 58%, var(--dl-border)); }
.dl-choice-portal[data-disabled] { cursor: not-allowed; opacity: .5; }
.dl-choice-portal__prefix { display: grid; flex: 0 0 auto; place-items: center; padding-left: 12px; color: var(--dl-text-faint); }
.dl-choice-portal__trigger { min-width: 0; flex: 1; align-self: stretch; overflow: hidden; padding: 0 10px 0 13px; border: 0; background: transparent; color: inherit; font: inherit; text-align: left; text-overflow: ellipsis; white-space: nowrap; cursor: pointer; outline: none; }
.dl-choice-portal__trigger.is-placeholder { color: var(--dl-text-faint); }
.dl-choice-portal__trigger:disabled { cursor: not-allowed; }
.dl-choice-portal__actions { display: flex; flex: 0 0 auto; align-items: center; gap: 5px; padding-right: 12px; color: var(--dl-text-faint); font-size: .72rem; }
.dl-choice-portal__clear, .dl-choice-portal__close { display: grid; place-items: center; border: 0; background: transparent; color: var(--dl-text-faint); cursor: pointer; }
.dl-choice-portal__clear { width: 24px; height: 24px; border-radius: 50%; }
.dl-choice-portal__clear:hover { background: var(--dl-surface-hover); color: var(--dl-text); }
.dl-choice-portal__native { position: fixed; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
.dl-choice-portal__overlay { position: fixed; inset: 0; background: rgb(7 14 11 / 46%); backdrop-filter: blur(12px) saturate(108%); }
.dl-choice-portal__panel { position: fixed; top: 50%; left: 50%; display: grid; width: min(calc(100vw - 32px), 680px); max-height: min(82vh, 760px); grid-template-rows: auto auto minmax(0, 1fr); gap: 14px; overflow: hidden; padding: 22px; border: 1px solid var(--dl-border-strong); border-radius: 28px; background: var(--dl-panel); color: var(--dl-text); box-shadow: 0 34px 100px rgb(0 0 0 / 45%), inset 0 1px 0 rgb(255 255 255 / 12%); outline: none; transform: translate(-50%, -50%); }
.dl-choice-portal__overlay[data-state='open'] { animation: dl-choice-fade .16s ease-out; }
.dl-choice-portal__panel[data-state='open'] { animation: dl-choice-in .2s cubic-bezier(.2,.8,.2,1); }
.dl-choice-portal__header { display: flex; min-width: 0; align-items: flex-start; justify-content: space-between; gap: 18px; }
.dl-choice-portal__header > div { display: grid; min-width: 0; gap: 5px; }
.dl-choice-portal__header small { color: var(--dl-accent-text); font-size: .62rem; font-weight: 900; letter-spacing: .18em; }
.dl-choice-portal__header h2 { margin: 0; font-size: 1.18rem; line-height: 1.25; }
.dl-choice-portal__header p { margin: 0; color: var(--dl-text-faint); font-size: .72rem; }
.dl-choice-portal__close { width: 38px; height: 38px; flex: 0 0 auto; border: 1px solid var(--dl-border); border-radius: 50%; background: var(--dl-surface); font-size: 1.15rem; }
.dl-choice-portal__close:hover { border-color: var(--dl-border-strong); background: var(--dl-surface-hover); color: var(--dl-text); }
.dl-choice-portal__search { display: grid; min-width: 0; grid-template-columns: auto minmax(0, 1fr) auto auto; align-items: center; gap: 8px; padding: 9px 12px; border: 1px solid var(--dl-border); border-radius: 14px; background: var(--dl-surface-solid); color: var(--dl-text-faint); }
.dl-choice-portal__search:focus-within { border-color: var(--dl-border-focus); box-shadow: var(--dl-focus); }
.dl-choice-portal__search input { min-width: 0; border: 0; background: transparent; color: var(--dl-text); font: inherit; outline: none; }
.dl-choice-portal__search kbd { padding: 2px 5px; border: 1px solid var(--dl-border); border-radius: 5px; background: var(--dl-night-soft); color: var(--dl-text-faint); font: .58rem/1.2 monospace; }
.dl-choice-portal__list { min-height: 150px; overflow: auto; overscroll-behavior: contain; scrollbar-color: var(--dl-border-strong) transparent; }
.dl-choice-portal__group { display: grid; gap: 5px; }
.dl-choice-portal__group + .dl-choice-portal__group { margin-top: 14px; }
.dl-choice-portal__group h4 { margin: 0; padding: 2px 7px; color: var(--dl-text-faint); font-size: .62rem; letter-spacing: .08em; }
.dl-choice-portal__option { display: flex; width: 100%; min-width: 0; min-height: 50px; align-items: center; justify-content: space-between; gap: 14px; padding: 9px 12px; border: 1px solid transparent; border-radius: 13px; background: transparent; color: var(--dl-text); text-align: left; cursor: pointer; outline: none; }
.dl-choice-portal__option:hover, .dl-choice-portal__option.is-highlighted { border-color: var(--dl-border); background: var(--dl-surface-hover); }
.dl-choice-portal__option.is-selected { border-color: var(--dl-accent-border); background: var(--dl-accent-surface); }
.dl-choice-portal__option:focus-visible { box-shadow: var(--dl-focus); }
.dl-choice-portal__option:disabled { cursor: not-allowed; opacity: .42; }
.dl-choice-portal__option > span { display: grid; min-width: 0; gap: 3px; }
.dl-choice-portal__option strong { overflow: hidden; font-size: .82rem; text-overflow: ellipsis; white-space: nowrap; }
.dl-choice-portal__option small { color: var(--dl-text-faint); font-size: .67rem; line-height: 1.35; }
.dl-choice-portal__option b { color: var(--dl-accent-text); }
.dl-choice-portal__option em { color: var(--dl-accent-text); font-size: .56rem; font-style: normal; font-weight: 900; letter-spacing: .12em; }
.dl-choice-portal__empty { display: grid; min-height: 170px; place-items: center; color: var(--dl-text-faint); font-size: .78rem; }
.dl-choice-portal__panel[data-overlay='drawer'] { top: auto; bottom: 0; width: min(100vw, 760px); max-height: min(86vh, 820px); border-bottom: 0; border-radius: 28px 28px 0 0; transform: translate(-50%, 0); }
@keyframes dl-choice-fade { from { opacity: 0; } }
@keyframes dl-choice-in { from { opacity: 0; transform: translate(-50%, -47%) scale(.96); } }
@media (max-width: 720px) {
  .dl-choice-portal__panel[data-overlay='auto'] { top: auto; bottom: 0; width: 100%; max-height: 88dvh; padding: 18px 16px max(18px, env(safe-area-inset-bottom)); border-right: 0; border-bottom: 0; border-left: 0; border-radius: 26px 26px 0 0; transform: none; left: 0; }
  .dl-choice-portal__search kbd { display: none; }
  .dl-choice-portal__option { min-height: 54px; }
}
@media (prefers-reduced-motion: reduce) {
  .dl-choice-portal__overlay, .dl-choice-portal__panel { animation: none !important; }
}
</style>
