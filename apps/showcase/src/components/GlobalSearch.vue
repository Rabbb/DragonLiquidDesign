<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { DlDialog } from '@dragon-liquid/vue'
import { componentCatalog, componentRoute } from '../catalog'
import { componentChoiceProfileFor, isRecommendedComponent } from '../componentChoices'
import { primaryComponentGroup } from '../componentGroups'
import { patternPages } from '../patterns/pattern.catalog'
import CustomControlMark from './CustomControlMark.vue'

type SearchKind = '页面' | '组件' | '示例'

type SearchEntry = {
  key: string
  kind: SearchKind
  title: string
  description: string
  href: string
  keywords: string
  custom?: boolean
  recommended?: boolean
}

const open = ref(false)
const query = ref('')
const activeIndex = ref(0)
const input = ref<HTMLInputElement>()

const pageEntries: SearchEntry[] = [
  { key: 'page-home', kind: '页面', title: '首页', description: 'Dragon Liquid Design 组件库概览', href: '/', keywords: 'home 首页 开始' },
  { key: 'page-components', kind: '页面', title: '组件目录', description: '浏览全部组件和使用场景', href: '/components/button/basic', keywords: 'components api 组件 文档' },
  { key: 'page-themes', kind: '页面', title: '主题与配色', description: '预览内置主题、日夜模式映射与自定义主题', href: '/themes', keywords: 'theme themes 主题 配色 白天 夜间 dark light forest 自定义' },
  { key: 'page-instance', kind: '页面', title: '实例体系', description: '运行时属性、方法、事件与反射 API', href: '/instance-api', keywords: 'instance api 实例 行为 控制' },
  ...patternPages.map(page => ({
    key: `pattern-${page.id}`,
    kind: '页面' as const,
    title: `应用演示 · ${page.label}`,
    description: page.description,
    href: page.href,
    keywords: `${page.id} ${page.eyebrow} patterns 应用 演示`,
  })),
]

const componentEntries: SearchEntry[] = componentCatalog.flatMap(component => {
  const family = primaryComponentGroup('family', component.id)?.label ?? '组件'
  const choiceProfile = componentChoiceProfileFor(component.id)
  const componentEntry: SearchEntry = {
    key: `component-${component.id}`,
    kind: '组件',
    title: component.name,
    description: `${choiceProfile.label} · ${family} · ${component.summary}`,
    href: componentRoute(component.id, component.scenarios[0]?.id),
    keywords: `${component.id} ${component.name} ${component.summary} ${family}`,
    custom: component.maturity === 'custom',
    recommended: isRecommendedComponent(component),
  }
  const scenarios = component.scenarios.slice(1).map<SearchEntry>(scenario => ({
    key: `scenario-${component.id}-${scenario.id}`,
    kind: '示例',
    title: `${component.name} · ${scenario.label}`,
    description: scenario.summary,
    href: componentRoute(component.id, scenario.id),
    keywords: `${component.id} ${scenario.id} ${component.name} ${scenario.label} ${scenario.summary}`,
    custom: component.maturity === 'custom',
    recommended: isRecommendedComponent(component),
  }))
  return [componentEntry, ...scenarios]
})

const entries = [...pageEntries, ...componentEntries]
const featuredKeys = new Set([
  'page-components',
  'page-themes',
  'component-button',
  'component-input-text',
  'component-date-picker',
  'component-date-range-picker',
  'pattern-overview',
  'page-instance',
])

function normalize(value: string) {
  return value.trim().toLocaleLowerCase().replace(/[\s_-]+/g, ' ')
}

function scoreEntry(entry: SearchEntry, terms: string[]) {
  const title = normalize(entry.title)
  const keywords = normalize(`${entry.title} ${entry.description} ${entry.keywords}`)
  if (!terms.every(term => keywords.includes(term))) return -1
  return terms.reduce((score, term) => {
    if (title === term) return score + 12
    if (title.startsWith(term)) return score + 8
    if (title.includes(term)) return score + 5
    return score + 2
  }, (entry.kind === '组件' ? 2 : 0) + (entry.recommended ? 3 : 0))
}

const results = computed(() => {
  const terms = normalize(query.value).split(' ').filter(Boolean)
  if (!terms.length) return entries.filter(entry => featuredKeys.has(entry.key)).slice(0, 8)
  return entries
    .map(entry => ({ entry, score: scoreEntry(entry, terms) }))
    .filter(result => result.score >= 0)
    .sort((left, right) => right.score - left.score || left.entry.title.localeCompare(right.entry.title, 'zh-CN'))
    .slice(0, 12)
    .map(result => result.entry)
})

function showSearch() {
  open.value = true
}

function closeSearch() {
  open.value = false
}

function activate(entry: SearchEntry) {
  closeSearch()
  window.history.pushState(window.history.state, '', entry.href)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

function handleInputKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    activeIndex.value = Math.min(activeIndex.value + 1, results.value.length - 1)
  }
  else if (event.key === 'ArrowUp') {
    event.preventDefault()
    activeIndex.value = Math.max(activeIndex.value - 1, 0)
  }
  else if (event.key === 'Enter' && results.value[activeIndex.value]) {
    event.preventDefault()
    activate(results.value[activeIndex.value])
  }
}

function handleGlobalKeydown(event: KeyboardEvent) {
  const target = event.target as HTMLElement | null
  const isTyping = target?.matches('input, textarea, select, [contenteditable="true"]')
  if ((event.ctrlKey || event.metaKey) && event.key.toLocaleLowerCase() === 'k') {
    event.preventDefault()
    showSearch()
  }
  else if (event.key === '/' && !isTyping) {
    event.preventDefault()
    showSearch()
  }
}

watch(open, async value => {
  if (!value) {
    query.value = ''
    activeIndex.value = 0
    return
  }
  await nextTick()
  input.value?.focus()
})

watch(results, () => { activeIndex.value = 0 })

onMounted(() => window.addEventListener('keydown', handleGlobalKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', handleGlobalKeydown))
</script>

<template>
  <button class="global-search-trigger" type="button" aria-label="搜索组件库" @click="showSearch">
    <span aria-hidden="true">⌕</span>
    <b>搜索组件</b>
    <kbd>Ctrl K</kbd>
  </button>

  <DlDialog
    v-model:open="open"
    title="搜索组件库"
    description="查找组件、使用场景、应用演示或实例 API。"
    size="md"
  >
    <div class="global-search-panel">
      <label class="global-search-field">
        <span aria-hidden="true">⌕</span>
        <input
          ref="input"
          v-model="query"
          type="search"
          placeholder="输入组件名、功能或场景…"
          autocomplete="off"
          aria-label="搜索组件库"
          @keydown="handleInputKeydown"
        >
        <kbd>/</kbd>
      </label>

      <div class="global-search-summary">
        <span>{{ query ? `找到 ${results.length} 项结果` : '常用入口' }}</span>
        <small>↑↓ 选择 · Enter 打开</small>
      </div>

      <nav v-if="results.length" class="global-search-results" aria-label="搜索结果">
        <a
          v-for="(entry, index) in results"
          :key="entry.key"
          :href="entry.href"
          :class="{ active: index === activeIndex }"
          @mouseenter="activeIndex = index"
          @click.prevent="activate(entry)"
        >
          <span class="global-search-kind">{{ entry.kind }}</span>
          <span class="global-search-copy"><b>{{ entry.title }}<CustomControlMark v-if="entry.custom" /></b><small>{{ entry.description }}</small></span>
          <i aria-hidden="true">↗</i>
        </a>
      </nav>
      <div v-else class="global-search-empty">
        <b>没有找到对应内容</b>
        <span>可以尝试“日期”“表单”“范围”或组件英文名。</span>
      </div>
    </div>
  </DlDialog>
</template>

<style scoped>
.global-search-trigger { display: inline-flex; align-items: center; gap: 8px; height: 36px; padding: 0 9px 0 11px; border: 1px solid var(--dl-border); border-radius: 11px; color: var(--dl-text-muted); background: var(--dl-surface); box-shadow: 0 1px 2px rgba(15,23,42,.05); cursor: pointer; transition: .18s ease; }
.global-search-trigger:hover { border-color: var(--dl-border-strong); color: var(--dl-text); background: var(--dl-surface-hover); }
.global-search-trigger:focus-visible { outline: none; box-shadow: var(--dl-focus); }
.global-search-trigger > span { color: var(--dl-accent-text); font-size: 1rem; line-height: 1; }
.global-search-trigger b { font-size: .72rem; white-space: nowrap; }
.global-search-trigger kbd, .global-search-field kbd { padding: 3px 6px; border: 1px solid var(--dl-border); border-radius: 6px; color: var(--dl-text-faint); background: var(--dl-night-soft); font: 700 .58rem/1 "Cascadia Code", Consolas, monospace; white-space: nowrap; }
.global-search-panel { display: grid; gap: 12px; min-height: 340px; }
.global-search-field { display: flex; align-items: center; gap: 10px; min-height: 50px; padding: 0 13px; border: 1px solid var(--dl-border-strong); border-radius: 14px; background: var(--dl-surface); box-shadow: inset 0 1px 0 rgba(255,255,255,.06); }
.global-search-field:focus-within { border-color: var(--dl-border-focus); box-shadow: var(--dl-focus); }
.global-search-field > span { color: var(--dl-accent-text); font-size: 1.2rem; }
.global-search-field input { min-width: 0; flex: 1; border: 0; outline: 0; color: var(--dl-text); background: transparent; font: 600 .92rem/1.4 Inter, "Microsoft YaHei", sans-serif; }
.global-search-field input::placeholder { color: var(--dl-text-faint); }
.global-search-field input::-webkit-search-cancel-button { opacity: .55; }
.global-search-summary { display: flex; align-items: center; justify-content: space-between; gap: 14px; padding: 0 3px; color: var(--dl-text-faint); font-size: .66rem; }
.global-search-summary span { color: var(--dl-accent-text); font-weight: 800; letter-spacing: .04em; }
.global-search-results { display: grid; gap: 4px; max-height: min(48vh, 430px); overflow: auto; padding-right: 3px; }
.global-search-results a { display: grid; grid-template-columns: 48px minmax(0,1fr) auto; align-items: center; gap: 10px; min-height: 58px; padding: 8px 11px; border: 1px solid transparent; border-radius: 13px; color: inherit; text-decoration: none; }
.global-search-results a.active { border-color: var(--dl-accent-border); background: var(--dl-accent-surface); }
.global-search-kind { display: grid; place-items: center; min-height: 26px; border: 1px solid var(--dl-border); border-radius: 8px; color: var(--dl-text-faint); background: var(--dl-surface); font-size: .6rem; font-weight: 800; }
.global-search-copy { display: grid; gap: 4px; min-width: 0; }
.global-search-copy b { overflow: hidden; color: var(--dl-text); font-size: .82rem; text-overflow: ellipsis; white-space: nowrap; }
.global-search-copy small { overflow: hidden; color: var(--dl-text-faint); font-size: .68rem; text-overflow: ellipsis; white-space: nowrap; }
.global-search-results i { color: var(--dl-accent-text); font-style: normal; opacity: 0; transform: translateX(-3px); transition: .16s ease; }
.global-search-results a.active i { opacity: 1; transform: none; }
.global-search-empty { display: grid; min-height: 220px; place-content: center; gap: 7px; color: var(--dl-text-faint); text-align: center; }
.global-search-empty b { color: var(--dl-text); }
@media (max-width: 1160px) { .global-search-trigger b { display: none; } }
@media (max-width: 720px) { .global-search-trigger kbd { display: none; } .global-search-trigger { width: 36px; justify-content: center; padding: 0; } .global-search-summary small { display: none; } }
</style>
