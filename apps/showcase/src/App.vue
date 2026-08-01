<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { DlBadge } from '@dragon-liquid/vue'
import HomePage from './pages/HomePage.vue'
import ComponentDocsPage from './pages/ComponentDocsPage.vue'
import { resolveComponent } from './catalog'

type ShowcaseRoute = {
  page: 'home' | 'components'
  componentId?: string
  scenarioId?: string
}

const currentHash = ref(window.location.hash || '#/')

const route = computed<ShowcaseRoute>(() => {
  const parts = currentHash.value.replace(/^#\/?/, '').split('/').filter(Boolean)
  if (parts[0] !== 'components') return { page: 'home' }

  const resolved = resolveComponent(parts[1], parts[2])
  return {
    page: 'components',
    componentId: resolved.component.id,
    scenarioId: resolved.scenario.id,
  }
})

function syncHash() {
  currentHash.value = window.location.hash || '#/'
  window.scrollTo({ top: 0, behavior: 'instant' })
}

onMounted(() => window.addEventListener('hashchange', syncHash))
onBeforeUnmount(() => window.removeEventListener('hashchange', syncHash))
</script>

<template>
  <div class="showcase-shell dragon-liquid-theme" :class="{ 'docs-mode': route.page === 'components' }">
    <div class="ambient ambient-a" />
    <div class="ambient ambient-b" />
    <div class="grid-field" />

    <header class="topbar">
      <a class="brand" href="#/" aria-label="Dragon Liquid Design 首页">
        <span class="brand-glyph">D</span>
        <span>
          <strong>Dragon Liquid</strong>
          <small>DESIGN SYSTEM · VUE</small>
        </span>
      </a>
      <nav aria-label="主导航">
        <a href="#/" :class="{ active: route.page === 'home' }">首页</a>
        <a href="#/components/button/basic" :class="{ active: route.page === 'components' }">组件</a>
        <a href="http://localhost:8020/" target="_blank" rel="noreferrer">示例应用 ↗</a>
      </nav>
      <DlBadge tone="success" variant="outline" size="md">
        <span class="live-dot" /> v0.4.0-alpha.12 · LOCAL
      </DlBadge>
    </header>

    <HomePage v-if="route.page === 'home'" />
    <ComponentDocsPage
      v-else
      :component-id="route.componentId!"
      :scenario-id="route.scenarioId!"
    />

    <footer v-if="route.page === 'home'" class="site-footer">
      <div class="brand compact">
        <span class="brand-glyph">D</span>
        <span><strong>Dragon Liquid</strong><small>DESIGN SYSTEM</small></span>
      </div>
      <p>从 TodoMoe 的视觉语言中独立提取 · Vue 3 Component Library</p>
      <DlBadge tone="success" variant="outline">IIS · ONLINE</DlBadge>
    </footer>
  </div>
</template>
