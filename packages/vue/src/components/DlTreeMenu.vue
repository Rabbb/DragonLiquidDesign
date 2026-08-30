<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import type { DlTreeMenuItem } from './primitive.types'
import {
  buildDlSearchMatchPresentation,
  matchesDlSearchFields,
  normalizeDlSearch,
  type DlSearchFields,
  type DlSearchMatchPresentation,
} from './search-match'

interface FlatTreeMenuItem {
  item: DlTreeMenuItem
  level: number
  parentId?: string
  hasChildren: boolean
  expanded: boolean
  directMatch: boolean
  presentation: DlSearchMatchPresentation
}

const props = withDefaults(defineProps<{
  modelValue?: string
  items: DlTreeMenuItem[]
  expanded?: string[]
  collapsed?: boolean
  accordion?: boolean
  autoCollapse?: boolean
  collapseBreakpoint?: number
  label?: string
  emptyText?: string
  searchable?: boolean
  searchPlaceholder?: string
}>(), {
  modelValue: undefined,
  expanded: () => [],
  collapsed: undefined,
  accordion: true,
  autoCollapse: true,
  collapseBreakpoint: 1024,
  label: '树目录菜单',
  emptyText: '暂无目录',
  searchable: true,
  searchPlaceholder: '检索名称、路径或关键字',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'update:expanded': [value: string[]]
  'update:collapsed': [value: boolean]
  select: [item: DlTreeMenuItem]
}>()

const internalCollapsed = ref(false)
const compact = ref(false)
const compactOpen = ref(false)
const query = ref('')
const searchInput = ref<HTMLInputElement | null>(null)
let media: MediaQueryList | null = null

const desktopCollapsed = computed(() => props.collapsed ?? internalCollapsed.value)
const panelOpen = computed(() => compact.value ? compactOpen.value : !desktopCollapsed.value)
type BranchMeta = { parentId?: string; descendants: string[] }

const branchMeta = computed(() => {
  const output = new Map<string, BranchMeta>()
  const visit = (items: DlTreeMenuItem[], parentId?: string): string[] => {
    const branchIds: string[] = []
    for (const item of items) {
      if (!item.children?.length) continue
      const descendants = visit(item.children, item.id)
      output.set(item.id, { parentId, descendants })
      branchIds.push(item.id, ...descendants)
    }
    return branchIds
  }
  visit(props.items)
  return output
})

const expandedSet = computed(() => {
  const requested = new Set(props.expanded)
  if (!props.accordion) return requested
  const order = new Map(props.expanded.map((id, index) => [id, index]))
  const normalized = new Set<string>()
  const visit = (items: DlTreeMenuItem[]) => {
    const candidates = items
      .filter(item => item.children?.length && requested.has(item.id))
      .sort((left, right) => (order.get(right.id) ?? -1) - (order.get(left.id) ?? -1))
    const active = candidates[0]
    if (!active) return
    normalized.add(active.id)
    visit(active.children ?? [])
  }
  visit(props.items)
  return normalized
})
const normalizedQuery = computed(() => normalizeDlSearch(query.value))

function searchFields(item: DlTreeMenuItem): DlSearchFields {
  return {
    label: item.label,
    value: item.id,
    description: item.description ?? '',
    keywords: item.keywords ?? [],
  }
}

const flatItems = computed<FlatTreeMenuItem[]>(() => {
  const keyword = normalizedQuery.value
  const visit = (items: DlTreeMenuItem[], level: number, parentId?: string): FlatTreeMenuItem[] => {
    const output: FlatTreeMenuItem[] = []
    for (const item of items) {
      const hasChildren = Boolean(item.children?.length)
      const fields = searchFields(item)
      const directMatch = !keyword || matchesDlSearchFields(fields, keyword)
      const matchingChildren = keyword && hasChildren
        ? visit(item.children ?? [], level + 1, item.id)
        : []
      if (keyword && !directMatch && !matchingChildren.length) continue
      const visibleHasChildren = keyword ? matchingChildren.length > 0 : hasChildren
      const expanded = visibleHasChildren && (keyword ? true : expandedSet.value.has(item.id))
      output.push({
        item,
        level,
        parentId,
        hasChildren: visibleHasChildren,
        expanded,
        directMatch,
        presentation: buildDlSearchMatchPresentation(fields, keyword),
      })
      if (keyword) output.push(...matchingChildren)
      else if (expanded) output.push(...visit(item.children ?? [], level + 1, item.id))
    }
    return output
  }
  return visit(props.items, 1)
})
const visibleMatchCount = computed(() => normalizedQuery.value
  ? flatItems.value.filter(row => row.directMatch).length
  : flatItems.value.length)

function setExpanded(id: string, value: boolean) {
  const next = new Set(expandedSet.value)
  const current = branchMeta.value.get(id)
  if (value) {
    if (props.accordion) {
      for (const [branchId, meta] of branchMeta.value) {
        if (branchId === id || meta.parentId !== current?.parentId) continue
        next.delete(branchId)
        meta.descendants.forEach(descendant => next.delete(descendant))
      }
    }
    next.add(id)
  } else {
    next.delete(id)
    current?.descendants.forEach(descendant => next.delete(descendant))
  }
  emit('update:expanded', [...next])
}

function select(item: DlTreeMenuItem) {
  if (item.disabled) return
  emit('update:modelValue', item.id)
  emit('select', item)
  if (compact.value) compactOpen.value = false
}

function toggleMenu() {
  if (compact.value) {
    compactOpen.value = !compactOpen.value
    return
  }
  const next = !desktopCollapsed.value
  internalCollapsed.value = next
  emit('update:collapsed', next)
}

function clearSearch() {
  query.value = ''
  nextTick(() => searchInput.value?.focus())
}

function onSearchKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && query.value) {
    event.preventDefault()
    clearSearch()
  } else if (event.key === 'ArrowDown' && flatItems.value.length) {
    event.preventDefault()
    focusRow(0)
  }
}

function focusRow(index: number) {
  const rows = document.querySelectorAll<HTMLElement>(`[data-dl-tree-menu="${menuId}"] [data-tree-menu-select]`)
  rows[Math.max(0, Math.min(rows.length - 1, index))]?.focus()
}

function onRowKeydown(event: KeyboardEvent, row: FlatTreeMenuItem, index: number) {
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Home' || event.key === 'End') {
    event.preventDefault()
    focusRow(event.key === 'ArrowDown' ? index + 1 : event.key === 'ArrowUp' ? index - 1 : event.key === 'Home' ? 0 : flatItems.value.length - 1)
    return
  }
  if (event.key === 'ArrowRight' && row.hasChildren) {
    event.preventDefault()
    if (!row.expanded) setExpanded(row.item.id, true)
    else focusRow(index + 1)
    return
  }
  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    if (row.expanded) setExpanded(row.item.id, false)
    else if (row.parentId) focusRow(flatItems.value.findIndex(item => item.item.id === row.parentId))
  }
}

const menuId = `dl-tree-menu-${Math.random().toString(36).slice(2)}`
function syncCompact(event: MediaQueryList | MediaQueryListEvent) {
  compact.value = props.autoCollapse && event.matches
  compactOpen.value = false
}
function connectMedia() {
  media?.removeEventListener('change', syncCompact)
  media = null
  if (!props.autoCollapse || typeof window === 'undefined' || typeof globalThis.matchMedia !== 'function') {
    compact.value = false
    compactOpen.value = false
    return
  }
  media = globalThis.matchMedia(`(max-width: ${props.collapseBreakpoint}px)`)
  syncCompact(media)
  media.addEventListener('change', syncCompact)
}

watch(() => [props.autoCollapse, props.collapseBreakpoint], () => { if (typeof window !== 'undefined') connectMedia() })
onMounted(connectMedia)
onUnmounted(() => media?.removeEventListener('change', syncCompact))
</script>

<template>
  <aside
    :id="menuId"
    :data-dl-tree-menu="menuId"
    data-dl
    data-slot="tree-menu"
    :data-compact="compact || undefined"
    :data-open="panelOpen || undefined"
    :aria-label="label"
    class="dl-tree-menu"
  >
    <div class="dl-tree-menu__panel" :data-search="panelOpen && searchable || undefined">
      <header class="dl-tree-menu__header">
        <div v-if="panelOpen" class="dl-tree-menu__heading"><slot name="header"><strong>{{ label }}</strong></slot></div>
        <button type="button" class="dl-tree-menu__toggle" :aria-label="panelOpen ? '收起目录' : '展开目录'" :aria-expanded="panelOpen" @click="toggleMenu">{{ panelOpen ? '‹' : '☰' }}</button>
      </header>

      <label v-if="panelOpen && searchable" class="dl-tree-menu__search">
        <span aria-hidden="true">⌕</span>
        <input
          ref="searchInput"
          v-model="query"
          type="search"
          autocomplete="off"
          :placeholder="searchPlaceholder"
          :aria-label="searchPlaceholder"
          @keydown="onSearchKeydown"
        />
        <small v-if="query">{{ visibleMatchCount }}</small>
        <button v-if="query" type="button" aria-label="清除检索" @click="clearSearch">×</button>
      </label>

      <div v-if="panelOpen" class="dl-tree-menu__scroll" role="tree">
        <template v-if="flatItems.length">
          <div
            v-for="(row, index) in flatItems"
            :key="row.item.id"
            class="dl-tree-menu__row"
            :data-selected="modelValue === row.item.id || undefined"
            :data-disabled="row.item.disabled || undefined"
            :style="{ '--dl-tree-level': row.level }"
            role="none"
          >
            <button
              v-if="row.hasChildren"
              type="button"
              class="dl-tree-menu__branch"
              tabindex="-1"
              :aria-label="row.expanded ? `收起${row.item.label}` : `展开${row.item.label}`"
              :aria-expanded="row.expanded"
              @click="setExpanded(row.item.id, !row.expanded)"
            >{{ row.expanded ? '▾' : '▸' }}</button>
            <span v-else class="dl-tree-menu__leaf" aria-hidden="true">•</span>
            <button
              type="button"
              class="dl-tree-menu__select"
              data-tree-menu-select
              role="treeitem"
              :aria-level="row.level"
              :aria-expanded="row.hasChildren ? row.expanded : undefined"
              :aria-selected="modelValue === row.item.id"
              :disabled="row.item.disabled"
              @click="select(row.item)"
              @dblclick="row.hasChildren && setExpanded(row.item.id, !row.expanded)"
              @keydown="onRowKeydown($event, row, index)"
            >
              <slot name="item" v-bind="row" :selected="modelValue === row.item.id" :query="query">
                <span v-if="row.item.icon || $slots.icon" class="dl-tree-menu__icon"><slot name="icon" v-bind="row">{{ row.item.icon }}</slot></span>
                <span class="dl-tree-menu__copy">
                  <b><slot name="label" v-bind="row" :query="query">
                    <template v-for="(segment, segmentIndex) in row.presentation.label" :key="segmentIndex">
                      <mark v-if="segment.matched">{{ segment.text }}</mark><template v-else>{{ segment.text }}</template>
                    </template>
                  </slot></b>
                  <small v-if="row.item.description || $slots.description"><slot name="description" v-bind="row" :query="query">
                    <template v-for="(segment, segmentIndex) in row.presentation.description" :key="segmentIndex">
                      <mark v-if="segment.matched">{{ segment.text }}</mark><template v-else>{{ segment.text }}</template>
                    </template>
                  </slot></small>
                  <span v-if="row.presentation.hidden.length" class="dl-tree-menu__matches">
                    <span v-for="match in row.presentation.hidden" :key="match.key">
                      <i>{{ match.kind }}</i>
                      <template v-for="(segment, segmentIndex) in match.segments" :key="segmentIndex">
                        <mark v-if="segment.matched">{{ segment.text }}</mark><template v-else>{{ segment.text }}</template>
                      </template>
                    </span>
                  </span>
                </span>
                <span v-if="row.item.trailing || $slots.trailing" class="dl-tree-menu__trailing"><slot name="trailing" v-bind="row">{{ row.item.trailing }}</slot></span>
              </slot>
            </button>
          </div>
        </template>
        <div v-else class="dl-tree-menu__empty"><slot name="empty">{{ emptyText }}</slot></div>
      </div>
      <footer v-if="panelOpen && $slots.footer" class="dl-tree-menu__footer"><slot name="footer" /></footer>
      <div v-if="!panelOpen && $slots.collapsed" class="dl-tree-menu__collapsed"><slot name="collapsed" /></div>
    </div>
    <button v-if="compact && panelOpen" type="button" class="dl-tree-menu__backdrop" aria-label="关闭目录" @click="compactOpen = false" />
  </aside>
</template>

<style scoped>
.dl-tree-menu{position:relative;z-index:1;width:17rem;min-width:0;min-height:0;color:var(--dl-text)}
.dl-tree-menu__panel{display:grid;width:100%;height:100%;min-height:0;grid-template-rows:auto minmax(0,1fr) auto;border:1px solid var(--dl-border);border-radius:var(--dl-radius-md);background:var(--dl-surface);box-shadow:var(--dl-shadow)}.dl-tree-menu__panel[data-search]{grid-template-rows:auto auto minmax(0,1fr) auto}
.dl-tree-menu__header{display:flex;min-height:2.75rem;align-items:center;justify-content:space-between;gap:.5rem;padding:.4rem;border-bottom:1px solid var(--dl-border)}
.dl-tree-menu__heading{min-width:0;padding-inline:.45rem}.dl-tree-menu__heading strong{font-size:.76rem}
.dl-tree-menu__toggle,.dl-tree-menu__branch,.dl-tree-menu__select{appearance:none;border:0;color:inherit;background:transparent;font:inherit;cursor:pointer}
.dl-tree-menu__toggle{display:grid;width:2rem;aspect-ratio:1;flex:none;place-items:center;border-radius:.6rem;color:var(--dl-text-muted)}.dl-tree-menu__toggle:hover{color:var(--dl-accent-text);background:var(--dl-accent-surface)}
.dl-tree-menu__search{display:grid;grid-template-columns:auto minmax(0,1fr) auto auto;align-items:center;gap:.35rem;margin:.4rem .4rem 0;padding:.38rem .5rem;border:1px solid var(--dl-border);border-radius:.65rem;background:var(--dl-surface-solid);color:var(--dl-text-faint)}.dl-tree-menu__search:focus-within{border-color:var(--dl-border-focus);box-shadow:var(--dl-focus)}.dl-tree-menu__search input{min-width:0;border:0;outline:0;background:transparent;color:var(--dl-text);font:inherit;font-size:.68rem}.dl-tree-menu__search small{font-size:.56rem}.dl-tree-menu__search button{display:grid;width:1.25rem;aspect-ratio:1;place-items:center;border:0;border-radius:50%;background:transparent;color:var(--dl-text-faint);cursor:pointer}.dl-tree-menu__search button:hover{background:var(--dl-surface-hover);color:var(--dl-text)}
.dl-tree-menu__scroll{min-height:0;overflow:auto;padding:.35rem}
.dl-tree-menu__row{display:grid;grid-template-columns:1.15rem minmax(0,1fr);align-items:center;padding-left:calc((var(--dl-tree-level) - 1) * .9rem);border-radius:.65rem}.dl-tree-menu__row:hover{background:var(--dl-surface-hover)}.dl-tree-menu__row[data-selected]{color:var(--dl-accent-text);background:var(--dl-accent-surface);box-shadow:inset 2px 0 var(--dl-accent)}.dl-tree-menu__row[data-disabled]{opacity:.42}
.dl-tree-menu__branch,.dl-tree-menu__leaf{display:grid;width:1.15rem;height:100%;place-items:center;color:var(--dl-text-faint);font-size:.66rem}.dl-tree-menu__branch:hover{color:var(--dl-accent-text)}
.dl-tree-menu__select{display:flex;min-width:0;align-items:center;gap:.5rem;padding:.55rem .45rem;text-align:left;outline:none}.dl-tree-menu__select:focus-visible{border-radius:.55rem;box-shadow:var(--dl-focus)}
.dl-tree-menu__icon{display:grid;width:1.45rem;aspect-ratio:1;flex:none;place-items:center;color:var(--dl-accent-text)}.dl-tree-menu__copy{display:grid;min-width:0;flex:1;gap:.18rem}.dl-tree-menu__copy b,.dl-tree-menu__copy small{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dl-tree-menu__copy b{font-size:.72rem}.dl-tree-menu__copy small{color:var(--dl-text-faint);font-size:.58rem}.dl-tree-menu__copy mark{padding:0 .08em;border-radius:.2em;background:color-mix(in srgb,var(--dl-accent) 30%,transparent);color:var(--dl-text);font-weight:850}.dl-tree-menu__matches{display:flex;min-width:0;flex-wrap:wrap;gap:.22rem}.dl-tree-menu__matches>span{display:inline-flex;min-width:0;align-items:baseline;gap:.2rem;padding:.08rem .3rem;border:1px solid var(--dl-accent-border);border-radius:999px;background:var(--dl-accent-surface);color:var(--dl-text-muted);font-size:.52rem;line-height:1.25}.dl-tree-menu__matches i{color:var(--dl-accent-text);font-size:.46rem;font-style:normal;font-weight:850}.dl-tree-menu__trailing{flex:none;color:var(--dl-text-faint);font-size:.58rem}
.dl-tree-menu__empty{padding:1rem;color:var(--dl-text-faint);font-size:.7rem;text-align:center}.dl-tree-menu__footer{padding:.45rem;border-top:1px solid var(--dl-border)}.dl-tree-menu__collapsed{display:grid;place-items:center;padding:.45rem}
.dl-tree-menu:not([data-open]){width:3.25rem}.dl-tree-menu:not([data-open]) .dl-tree-menu__panel{grid-template-rows:auto 1fr}.dl-tree-menu:not([data-open]) .dl-tree-menu__header{justify-content:center;border-bottom:0}
.dl-tree-menu__backdrop{display:none}
.dl-tree-menu[data-compact]{z-index:30;width:3.25rem;flex:none}.dl-tree-menu[data-compact][data-open] .dl-tree-menu__panel{position:absolute;inset:0 auto auto 0;z-index:2;width:min(19rem,82vw);height:min(100%,100dvh);min-height:22rem;box-shadow:var(--dl-shadow-hover)}.dl-tree-menu[data-compact][data-open] .dl-tree-menu__backdrop{position:fixed;inset:0;z-index:1;display:block;border:0;background:#0006;cursor:default}
@media (prefers-reduced-motion:no-preference){.dl-tree-menu,.dl-tree-menu__panel{transition:width .18s ease,box-shadow .18s ease}}
</style>
