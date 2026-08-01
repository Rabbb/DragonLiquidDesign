<script setup lang="ts">
import { computed, defineAsyncComponent, ref, watch, type Component } from 'vue'
import { DlBadge, DlButton } from '@dragon-liquid/vue'
import {
  componentCatalog,
  componentCategories,
  componentRoute,
  resolveComponent,
} from '../catalog'

const props = defineProps<{
  componentId: string
  scenarioId: string
}>()

const sidebarOpen = ref(false)
const resolved = computed(() => resolveComponent(props.componentId, props.scenarioId))
const selectedComponent = computed(() => resolved.value.component)
const selectedScenario = computed(() => resolved.value.scenario)

const docLoaders: Record<string, () => Promise<{ default: Component }>> = {
  button: () => import('../docs/ButtonDocs.vue'),
  badge: () => import('../docs/BadgeDocs.vue'),
  card: () => import('../docs/CardDocs.vue'),
  'icon-button': () => import('../docs/IconButtonDocs.vue'),
  input: () => import('../docs/InputDocs.vue'),
  select: () => import('../docs/SelectDocs.vue'),
  textarea: () => import('../docs/TextareaDocs.vue'),
  dialog: () => import('../docs/DialogDocs.vue'),
}

const activeDoc = computed(() => defineAsyncComponent({
  loader: docLoaders[selectedComponent.value.id],
  delay: 120,
  timeout: 15000,
}))

watch(() => [props.componentId, props.scenarioId], () => { sidebarOpen.value = false })

function componentsFor(category: typeof componentCategories[number]) {
  return componentCatalog.filter(component => component.category === category)
}
</script>

<template>
<main class="docs-layout">
  <button class="mobile-outline-toggle" type="button" @click="sidebarOpen = !sidebarOpen">
    <span>☰</span> 组件大纲
  </button>

  <aside class="docs-sidebar" :class="{ open: sidebarOpen }">
    <div class="sidebar-title">
      <span>COMPONENTS</span>
      <b>组件目录</b>
      <small>按组件与场景加载案例</small>
    </div>

    <nav aria-label="组件大纲">
      <section v-for="category in componentCategories" :key="category" class="sidebar-group">
        <h2>{{ category }}</h2>
        <div v-for="item in componentsFor(category)" :key="item.id" class="sidebar-component">
          <a
            :href="componentRoute(item.id)"
            :class="{ active: selectedComponent.id === item.id }"
          >
            <span>{{ item.name }}</span><i>{{ selectedComponent.id === item.id ? '−' : '+' }}</i>
          </a>
          <div v-if="selectedComponent.id === item.id" class="sidebar-scenarios">
            <a
              v-for="scenario in item.scenarios"
              :key="scenario.id"
              :href="componentRoute(item.id, scenario.id)"
              :class="{ active: selectedScenario.id === scenario.id }"
            >
              <i /><span><b>{{ scenario.label }}</b><small>{{ scenario.summary }}</small></span>
            </a>
          </div>
        </div>
      </section>
    </nav>
    <div class="sidebar-foot">
      <DlBadge tone="success" variant="outline">● LAZY LOADED</DlBadge>
      <small>当前只渲染选中的场景</small>
    </div>
  </aside>

  <article class="docs-content">
    <div class="docs-breadcrumb">
      <a href="#/">首页</a><span>/</span><a href="#/components/button/basic">组件</a><span>/</span><b>{{ selectedComponent.name }}</b>
    </div>
    <header class="component-header">
      <div>
        <DlBadge tone="muted" variant="outline">{{ selectedComponent.category }} · SINCE {{ selectedComponent.since }}</DlBadge>
        <h1>{{ selectedComponent.name }}</h1>
        <p>{{ selectedComponent.summary }}</p>
      </div>
      <a href="/packages/dragon-liquid-vue-0.1.1.tgz" download>
        <DlButton variant="secondary" size="sm">下载 npm 包 ↓</DlButton>
      </a>
    </header>

    <div class="scenario-tabs" role="navigation" aria-label="案例场景">
      <a
        v-for="scenario in selectedComponent.scenarios"
        :key="scenario.id"
        :href="componentRoute(selectedComponent.id, scenario.id)"
        :class="{ active: selectedScenario.id === scenario.id }"
      >{{ scenario.label }}</a>
    </div>

    <Suspense>
      <component :is="activeDoc" :scenario="selectedScenario.id" :key="selectedComponent.id" />
      <template #fallback>
        <div class="doc-loading"><i /><span>正在按需加载 {{ selectedComponent.name }} 案例…</span></div>
      </template>
    </Suspense>

    <nav class="docs-pagination" aria-label="组件翻页">
      <template v-for="(item, index) in componentCatalog" :key="item.id">
        <a v-if="item.id === selectedComponent.id && index > 0" :href="componentRoute(componentCatalog[index - 1].id)">
          <small>上一个</small><b>← {{ componentCatalog[index - 1].name }}</b>
        </a>
        <span v-else-if="item.id === selectedComponent.id" />
        <a v-if="item.id === selectedComponent.id && index < componentCatalog.length - 1" :href="componentRoute(componentCatalog[index + 1].id)">
          <small>下一个</small><b>{{ componentCatalog[index + 1].name }} →</b>
        </a>
      </template>
    </nav>
  </article>
  <button v-if="sidebarOpen" class="sidebar-scrim" type="button" aria-label="关闭目录" @click="sidebarOpen = false" />
</main>
</template>
