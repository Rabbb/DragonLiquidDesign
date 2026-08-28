<script setup lang="ts">
import { computed, defineAsyncComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import { DlBadge, useDlTheme } from '@dragon-liquid/vue'
import ComponentSwitcher from './components/ComponentSwitcher.vue'
import GlobalSearch from './components/GlobalSearch.vue'
import HomePage from './pages/HomePage.vue'
import { resolveComponent } from './catalog'

const ComponentDocsPage = defineAsyncComponent(() => import('./pages/ComponentDocsPage.vue'))
const InstanceArchitecturePage = defineAsyncComponent(() => import('./pages/InstanceArchitecturePage.vue'))
const PatternShowcasePage = defineAsyncComponent(() => import('./patterns/PatternShowcasePage.vue'))
const ThemePage = defineAsyncComponent(() => import('./pages/ThemePage.vue'))
const KeyboardGuidePage = defineAsyncComponent(() => import('./pages/KeyboardGuidePage.vue'))
const MdxLanguagePage = defineAsyncComponent(() => import('./pages/MdxLanguagePage.vue'))
const theme = useDlTheme()

const themeChoice = computed<string>({
  get: () => theme.themeOverride.value ?? theme.mode.value,
  set: (value) => {
    if (value === 'system' || value === 'light' || value === 'dark') theme.setMode(value)
    else theme.setTheme(value)
  },
})

type ShowcaseRoute = {
  page: 'home' | 'components' | 'instance-api' | 'keyboard' | 'mdx' | 'patterns' | 'themes'
  componentId?: string
  scenarioId?: string
  patternPageId?: string
  guideComponentId?: string
}

function migrateLegacyHashRoute() {
  if (!window.location.hash.startsWith('#/')) return

  const legacyPath = window.location.hash.slice(1)
  window.history.replaceState(window.history.state, '', `${legacyPath}${window.location.search}`)
}

migrateLegacyHashRoute()

const currentPath = ref(window.location.pathname || '/')
const currentSearch = ref(window.location.search)

const route = computed<ShowcaseRoute>(() => {
  const parts = currentPath.value.replace(/^\//, '').split('/').filter(Boolean)
  if (parts[0] === 'keyboard') return { page: 'keyboard' }
  if (parts[0] === 'mdx') return { page: 'mdx' }
  if (parts[0] === 'themes') return { page: 'themes' }
  if (parts[0] === 'instance-api') return { page: 'instance-api' }
  if (parts[0] === 'patterns') return {
    page: 'patterns',
    patternPageId: parts[1] ?? 'overview',
    guideComponentId: new URLSearchParams(currentSearch.value).get('guide') ?? undefined,
  }
  if (parts[0] !== 'components') return { page: 'home' }

  const resolved = resolveComponent(parts[1], parts[2])
  return {
    page: 'components',
    componentId: resolved.component.id,
    scenarioId: resolved.scenario.id,
  }
})

function syncLocation() {
  currentPath.value = window.location.pathname || '/'
  currentSearch.value = window.location.search
  window.scrollTo({ top: 0, behavior: 'instant' })
}

function handleDocumentClick(event: MouseEvent) {
  if (
    event.defaultPrevented
    || event.button !== 0
    || event.ctrlKey
    || event.metaKey
    || event.shiftKey
    || event.altKey
    || !(event.target instanceof Element)
  ) return

  const anchor = event.target.closest<HTMLAnchorElement>('a[href]')
  if (!anchor || anchor.target || anchor.hasAttribute('download')) return

  const href = anchor.getAttribute('href')
  if (!href || href.startsWith('#')) return

  const target = new URL(anchor.href, window.location.href)
  if (target.origin !== window.location.origin) return

  event.preventDefault()
  window.history.pushState(window.history.state, '', `${target.pathname}${target.search}${target.hash}`)
  syncLocation()
}

onMounted(() => {
  window.addEventListener('popstate', syncLocation)
  document.addEventListener('click', handleDocumentClick)
})

onBeforeUnmount(() => {
  window.removeEventListener('popstate', syncLocation)
  document.removeEventListener('click', handleDocumentClick)
})
</script>

<template>
  <div class="showcase-shell dragon-liquid-theme" :class="{ 'docs-mode': route.page === 'components' }">
    <div class="ambient ambient-a" />
    <div class="ambient ambient-b" />
    <div class="grid-field" />

    <header class="topbar">
      <a class="brand" href="/" aria-label="Dragon Liquid Design 首页">
        <span class="brand-glyph">D</span>
        <span>
          <strong>Dragon Liquid</strong>
          <small>DESIGN SYSTEM · VUE</small>
        </span>
      </a>
      <nav aria-label="主导航">
        <a href="/" :class="{ active: route.page === 'home' }">首页</a>
        <a href="/components/button/basic" :class="{ active: route.page === 'components' }">组件</a>
        <a href="/mdx" :class="{ active: route.page === 'mdx' }">MDX</a>
        <a href="/keyboard" :class="{ active: route.page === 'keyboard' }">键盘指南</a>
        <a href="/themes" :class="{ active: route.page === 'themes' }">主题</a>
        <a href="/patterns" :class="{ active: route.page === 'patterns' }">应用演示</a>
        <a href="/instance-api" :class="{ active: route.page === 'instance-api' }">实例体系</a>
        <a href="https://www.npmjs.com/package/@dragon-liquid/vue" target="_blank" rel="noreferrer">NPM ↗</a>
      </nav>
      <div class="topbar-actions">
        <ComponentSwitcher :current-component-id="route.componentId" />
        <GlobalSearch />
        <label class="theme-picker">
          <span>主题</span>
          <select v-model="themeChoice" aria-label="切换配色主题">
            <optgroup label="模式">
              <option value="system">跟随系统</option>
              <option value="light">日间方案</option>
              <option value="dark">夜间方案</option>
            </optgroup>
            <optgroup label="固定主题">
              <option v-for="preset in theme.themes.value" :key="preset.name" :value="preset.name">
                {{ preset.label ?? preset.name }}
              </option>
            </optgroup>
          </select>
        </label>
        <DlBadge tone="success" variant="outline" size="md">
          <span class="live-dot" /> v0.6.0-alpha.37 · ALPHA
        </DlBadge>
      </div>
    </header>

    <HomePage v-if="route.page === 'home'" />
    <ComponentDocsPage
      v-else-if="route.page === 'components'"
      :component-id="route.componentId!"
      :scenario-id="route.scenarioId!"
    />
    <PatternShowcasePage
      v-else-if="route.page === 'patterns'"
      :page-id="route.patternPageId"
      :guide-component-id="route.guideComponentId"
    />
    <KeyboardGuidePage v-else-if="route.page === 'keyboard'" />
    <MdxLanguagePage v-else-if="route.page === 'mdx'" />
    <ThemePage v-else-if="route.page === 'themes'" />
    <InstanceArchitecturePage v-else-if="route.page === 'instance-api'" />

    <footer v-if="route.page === 'home'" class="site-footer">
      <div class="brand compact">
        <span class="brand-glyph">D</span>
        <span><strong>Dragon Liquid</strong><small>DESIGN SYSTEM</small></span>
      </div>
      <p>从 TodoMoe 的视觉语言中独立提取 · Vue 3 Component Library</p>
      <DlBadge tone="success" variant="outline">STATIC · ONLINE</DlBadge>
    </footer>
  </div>
</template>
