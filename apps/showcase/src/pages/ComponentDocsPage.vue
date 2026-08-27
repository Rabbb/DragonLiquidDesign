<script setup lang="ts">
import { computed, defineAsyncComponent, ref, watch, type Component } from 'vue'
import { DlBadge, DlButton } from '@dragon-liquid/vue'
import { componentsMissingApi } from '../api/componentApi'
import { componentGuidanceFor, componentsMissingGuidance } from '../componentGuidance'
import CustomControlMark from '../components/CustomControlMark.vue'
import {
  componentCatalog,
  componentCategories,
  componentRoute,
  resolveComponent,
  type ComponentCategoryId,
} from '../catalog'

const props = defineProps<{
  componentId: string
  scenarioId: string
}>()

const sidebarOpen = ref(false)
const resolved = computed(() => resolveComponent(props.componentId, props.scenarioId))
const selectedComponent = computed(() => resolved.value.component)
const selectedScenario = computed(() => resolved.value.scenario)
const selectedGuidance = computed(() => componentGuidanceFor(selectedComponent.value.id))
const selectedCategory = computed(() => componentCategories.find(category => category.id === selectedComponent.value.category)!)
const expandedCategories = ref<Set<ComponentCategoryId>>(new Set([selectedComponent.value.category]))
const readyCount = computed(() => componentCatalog.filter(component => component.implementation === 'ready').length)
const plannedCount = computed(() => componentCatalog.length - readyCount.value)
const missingApiComponents = componentsMissingApi(componentCatalog.map(component => component.id))
if (missingApiComponents.length) {
  throw new Error(`以下组件缺少属性 API：${missingApiComponents.join(', ')}`)
}
const missingGuidanceComponents = componentsMissingGuidance(componentCatalog.map(component => component.id))
if (missingGuidanceComponents.length) {
  throw new Error(`以下组件缺少使用决策说明：${missingGuidanceComponents.join(', ')}`)
}

const docLoaders: Record<string, () => Promise<{ default: Component }>> = {
  button: () => import('../docs/ButtonDocs.vue'),
  'split-button': () => import('../docs/SplitButtonDocs.vue'),
  badge: () => import('../docs/BadgeDocs.vue'),
  card: () => import('../docs/CardDocs.vue'),
  'icon-button': () => import('../docs/IconButtonDocs.vue'),
  input: () => import('../docs/InputDocs.vue'),
  select: () => import('../docs/SelectDocs.vue'),
  'choice-portal': () => import('../docs/ChoicePortalDocs.vue'),
  'time-wheel': () => import('../docs/TimeWheelDocs.vue'),
  textarea: () => import('../docs/TextareaDocs.vue'),
  dialog: () => import('../docs/DialogDocs.vue'),
  checkbox: () => import('../docs/FormPrimitiveDocs.vue'),
  'radio-group': () => import('../docs/FormPrimitiveDocs.vue'),
  slider: () => import('../docs/FormPrimitiveDocs.vue'),
  switch: () => import('../docs/FormPrimitiveDocs.vue'),
  accordion: () => import('../docs/GeneralPrimitiveDocs.vue'),
  avatar: () => import('../docs/GeneralPrimitiveDocs.vue'),
  collapsible: () => import('../docs/GeneralPrimitiveDocs.vue'),
  popover: () => import('../docs/GeneralPrimitiveDocs.vue'),
  progress: () => import('../docs/GeneralPrimitiveDocs.vue'),
  separator: () => import('../docs/GeneralPrimitiveDocs.vue'),
  tabs: () => import('../docs/GeneralPrimitiveDocs.vue'),
  tooltip: () => import('../docs/GeneralPrimitiveDocs.vue'),
  combobox: () => import('../docs/AdvancedFormDocs.vue'),
  editable: () => import('../docs/AdvancedFormDocs.vue'),
  listbox: () => import('../docs/AdvancedFormDocs.vue'),
  'number-field': () => import('../docs/AdvancedFormDocs.vue'),
  label: () => import('../docs/AdvancedFormDocs.vue'),
  'pin-input': () => import('../docs/AdvancedFormDocs.vue'),
  'tags-input': () => import('../docs/AdvancedFormDocs.vue'),
  toggle: () => import('../docs/AdvancedFormDocs.vue'),
  'toggle-group': () => import('../docs/AdvancedFormDocs.vue'),
  'alert-dialog': () => import('../docs/AdvancedGeneralDocs.vue'),
  'aspect-ratio': () => import('../docs/AdvancedGeneralDocs.vue'),
  'context-menu': () => import('../docs/AdvancedGeneralDocs.vue'),
  'dropdown-menu': () => import('../docs/AdvancedGeneralDocs.vue'),
  'hover-card': () => import('../docs/AdvancedGeneralDocs.vue'),
  menubar: () => import('../docs/AdvancedGeneralDocs.vue'),
  mdx: () => import('../docs/MdxDocs.vue'),
  'navigation-menu': () => import('../docs/AdvancedGeneralDocs.vue'),
  pagination: () => import('../docs/AdvancedGeneralDocs.vue'),
  'scroll-area': () => import('../docs/AdvancedGeneralDocs.vue'),
  splitter: () => import('../docs/AdvancedGeneralDocs.vue'),
  stepper: () => import('../docs/AdvancedGeneralDocs.vue'),
  toast: () => import('../docs/AdvancedGeneralDocs.vue'),
  toolbar: () => import('../docs/AdvancedGeneralDocs.vue'),
  autocomplete: () => import('../docs/AlphaFormColorDocs.vue'),
  rating: () => import('../docs/AlphaFormColorDocs.vue'),
  'color-area': () => import('../docs/AlphaFormColorDocs.vue'),
  'color-field': () => import('../docs/AlphaFormColorDocs.vue'),
  'color-slider': () => import('../docs/AlphaFormColorDocs.vue'),
  'color-swatch': () => import('../docs/AlphaFormColorDocs.vue'),
  'color-swatch-picker': () => import('../docs/AlphaFormColorDocs.vue'),
  calendar: () => import('../docs/AlphaDateDocs.vue'),
  'date-field': () => import('../docs/AlphaDateDocs.vue'),
  'date-picker': () => import('../docs/AlphaDateDocs.vue'),
  'date-range-field': () => import('../docs/AlphaDateDocs.vue'),
  'date-range-picker': () => import('../docs/AlphaDateDocs.vue'),
  'range-calendar': () => import('../docs/AlphaDateDocs.vue'),
  'time-field': () => import('../docs/AlphaDateDocs.vue'),
  'time-range-field': () => import('../docs/AlphaDateDocs.vue'),
  'month-picker': () => import('../docs/AlphaDateDocs.vue'),
  'month-range-picker': () => import('../docs/AlphaDateDocs.vue'),
  'year-picker': () => import('../docs/AlphaDateDocs.vue'),
  'year-range-picker': () => import('../docs/AlphaDateDocs.vue'),
  drawer: () => import('../docs/AlphaGeneralDocs.vue'),
  tree: () => import('../docs/AlphaGeneralDocs.vue'),
}

const sharedDocIds = new Set([
  'checkbox', 'radio-group', 'slider', 'switch', 'accordion', 'avatar', 'collapsible', 'popover', 'progress', 'separator', 'tabs', 'tooltip',
  'combobox', 'editable', 'listbox', 'number-field', 'label', 'pin-input', 'tags-input', 'toggle', 'toggle-group',
  'alert-dialog', 'aspect-ratio', 'context-menu', 'dropdown-menu', 'hover-card', 'menubar', 'navigation-menu', 'pagination', 'scroll-area', 'splitter', 'stepper', 'toast', 'toolbar',
  'autocomplete', 'rating', 'color-area', 'color-field', 'color-slider', 'color-swatch', 'color-swatch-picker',
  'calendar', 'date-field', 'date-picker', 'date-range-field', 'date-range-picker', 'range-calendar', 'time-field', 'time-range-field', 'month-picker', 'month-range-picker', 'year-picker', 'year-range-picker', 'drawer', 'tree',
])

const activeDoc = computed(() => defineAsyncComponent({
  loader: docLoaders[selectedComponent.value.id] ?? (() => import('../docs/PlannedComponentDocs.vue')),
  delay: 120,
  timeout: 15000,
}))
const ComponentApiTable = defineAsyncComponent(() => import('../components/ComponentApiTable.vue'))

watch(() => [props.componentId, props.scenarioId], () => {
  expandedCategories.value = new Set([...expandedCategories.value, selectedComponent.value.category])
  sidebarOpen.value = false
})

function componentsFor(category: typeof componentCategories[number]) {
  return componentCatalog.filter(component => component.category === category.id)
}

function categoryExpanded(category: typeof componentCategories[number]) {
  return expandedCategories.value.has(category.id)
}

function toggleCategory(category: typeof componentCategories[number]) {
  const next = new Set(expandedCategories.value)
  next.has(category.id) ? next.delete(category.id) : next.add(category.id)
  expandedCategories.value = next
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
      <small>按组件与场景加载案例 · ◆ 自研</small>
    </div>

    <nav aria-label="组件大纲">
      <section v-for="category in componentCategories" :key="category.id" class="sidebar-group" :class="{ open: categoryExpanded(category) }">
        <button
          type="button"
          class="sidebar-group-trigger"
          :aria-expanded="categoryExpanded(category)"
          @click="toggleCategory(category)"
        >
          <span><b>{{ category.label }}</b><small>{{ category.english }} · {{ componentsFor(category).length }}</small></span>
          <i>{{ categoryExpanded(category) ? '−' : '+' }}</i>
        </button>
        <div v-show="categoryExpanded(category)" class="sidebar-group-content">
          <div v-for="item in componentsFor(category)" :key="item.id" class="sidebar-component">
            <a
              :href="componentRoute(item.id)"
              :class="{ active: selectedComponent.id === item.id, planned: item.implementation === 'planned' }"
            >
              <span class="sidebar-component-copy">
                <span>{{ item.name }}<CustomControlMark v-if="item.maturity === 'custom'" /></span>
                <small>
                  <em v-if="item.implementation === 'planned'">ROADMAP</em>
                  <em v-if="item.maturity === 'alpha'" class="alpha">ALPHA</em>
                </small>
              </span>
              <i v-if="item.scenarios.length > 1">{{ selectedComponent.id === item.id ? '−' : '+' }}</i>
            </a>
            <div v-if="selectedComponent.id === item.id && item.scenarios.length > 1" class="sidebar-scenarios">
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
        </div>
      </section>
    </nav>
    <div class="sidebar-foot">
      <DlBadge tone="success" variant="outline">● LAZY LOADED</DlBadge>
      <small>{{ readyCount }} READY · {{ plannedCount }} ROADMAP · 当前只渲染选中场景</small>
    </div>
  </aside>

  <article class="docs-content">
    <div class="docs-breadcrumb">
      <a href="/">首页</a><span>/</span><a href="/components/button/basic">组件</a><span>/</span><b>{{ selectedComponent.name }}</b>
    </div>
    <header class="component-header">
      <div>
        <div class="component-kicker">
          <DlBadge :tone="selectedComponent.implementation === 'ready' ? 'muted' : 'accent'" variant="outline">
            {{ selectedCategory.label }} · {{ selectedComponent.implementation === 'ready' ? `SINCE ${selectedComponent.since}` : 'ROADMAP' }}
          </DlBadge>
          <DlBadge v-if="selectedComponent.maturity === 'alpha'" tone="warning" variant="outline">{{ selectedComponent.sourceUrl ? 'REKA ALPHA' : 'ALPHA' }}</DlBadge>
        </div>
        <h1>{{ selectedComponent.name }}<CustomControlMark v-if="selectedComponent.maturity === 'custom'" /></h1>
        <p>{{ selectedComponent.summary }}</p>
      </div>
      <a href="https://www.npmjs.com/package/@dragon-liquid/vue" target="_blank" rel="noreferrer">
        <DlButton variant="secondary" size="sm">查看 npm 包 ↗</DlButton>
      </a>
    </header>

    <section class="component-guidance" aria-label="组件使用决策">
      <article>
        <span>WHEN TO USE</span>
        <h2>适合使用</h2>
        <ul>
          <li v-for="item in selectedGuidance.useWhen" :key="item">{{ item }}</li>
        </ul>
      </article>
      <article>
        <span>AVOID MISUSE</span>
        <h2>避免误用</h2>
        <p>{{ selectedGuidance.avoidWhen }}</p>
      </article>
      <article>
        <span>ACCESSIBILITY</span>
        <h2>无障碍要求</h2>
        <p>{{ selectedGuidance.accessibility }}</p>
      </article>
    </section>

    <div v-if="selectedComponent.scenarios.length > 1" class="scenario-tabs" role="navigation" aria-label="案例场景">
      <a
        v-for="scenario in selectedComponent.scenarios"
        :key="scenario.id"
        :href="componentRoute(selectedComponent.id, scenario.id)"
        :class="{ active: selectedScenario.id === scenario.id }"
      >{{ scenario.label }}</a>
    </div>

    <Suspense>
      <component
        :is="activeDoc"
        :scenario="selectedScenario.id"
        v-bind="selectedComponent.implementation === 'planned' || sharedDocIds.has(selectedComponent.id) ? { componentDefinition: selectedComponent } : {}"
        :key="selectedComponent.id"
      />
      <template #fallback>
        <div class="doc-loading"><i /><span>正在按需加载 {{ selectedComponent.name }} 案例…</span></div>
      </template>
    </Suspense>

    <ComponentApiTable :component-id="selectedComponent.id" :component-name="selectedComponent.name" />

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
