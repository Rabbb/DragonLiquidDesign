<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { DlBadge } from '@dragon-liquid/vue'
import HomePage from './pages/HomePage.vue'
import ComponentDocsPage from './pages/ComponentDocsPage.vue'
import InstanceArchitecturePage from './pages/InstanceArchitecturePage.vue'
import { resolveComponent } from './catalog'

type ShowcaseRoute = {
  page: 'home' | 'components' | 'instance-api'
  componentId?: string
  scenarioId?: string
}

function migrateLegacyHashRoute() {
  if (!window.location.hash.startsWith('#/')) return

  const legacyPath = window.location.hash.slice(1)
  window.history.replaceState(window.history.state, '', `${legacyPath}${window.location.search}`)
}

migrateLegacyHashRoute()

const currentPath = ref(window.location.pathname || '/')

const route = computed<ShowcaseRoute>(() => {
  const parts = currentPath.value.replace(/^\//, '').split('/').filter(Boolean)
  if (parts[0] === 'instance-api') return { page: 'instance-api' }
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
        <a href="/instance-api" :class="{ active: route.page === 'instance-api' }">实例体系</a>
        <a href="https://www.npmjs.com/package/@dragon-liquid/vue" target="_blank" rel="noreferrer">NPM ↗</a>
      </nav>
      <DlBadge tone="success" variant="outline" size="md">
        <span class="live-dot" /> v0.6.0-alpha.5 · ALPHA
      </DlBadge>
    </header>

    <HomePage v-if="route.page === 'home'" />
    <ComponentDocsPage
      v-else-if="route.page === 'components'"
      :component-id="route.componentId!"
      :scenario-id="route.scenarioId!"
    />
    <InstanceArchitecturePage v-else />

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
