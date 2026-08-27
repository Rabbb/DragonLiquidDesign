<script setup lang="ts">
import { computed, defineAsyncComponent, ref, watch, type Component } from 'vue'
import { DlBadge, DlButton, DlSegmented } from '@dragon-liquid/vue'
import { componentsMissingApi } from '../api/componentApi'
import { componentGuidanceFor, componentsMissingGuidance } from '../componentGuidance'
import { componentKeyboardGuidanceFor, componentsMissingKeyboardGuidance } from '../componentKeyboard'
import CustomControlMark from '../components/CustomControlMark.vue'
import {
  componentGroupingModes,
  groupingModeDescription,
  readComponentGroupingMode,
  resolveComponentGroups,
  saveComponentGroupingMode,
  type ComponentGroupingMode,
  type ResolvedComponentGroup,
} from '../componentGroups'
import {
  componentCatalogScopes,
  componentChoiceFamilyFor,
  componentChoiceProfileFor,
  isRecommendedComponent,
  readComponentCatalogScope,
  recommendedComponentCount,
  saveComponentCatalogScope,
  type ComponentCatalogScope,
} from '../componentChoices'
import { componentCatalog, componentRoute, resolveComponent } from '../catalog'

const props = defineProps<{
  componentId: string
  scenarioId: string
}>()

const sidebarOpen = ref(false)
const resolved = computed(() => resolveComponent(props.componentId, props.scenarioId))
const selectedComponent = computed(() => resolved.value.component)
const selectedScenario = computed(() => resolved.value.scenario)
const selectedGuidance = computed(() => componentGuidanceFor(selectedComponent.value.id))
const selectedKeyboardGuidance = computed(() => componentKeyboardGuidanceFor(selectedComponent.value.id))
const selectedChoiceProfile = computed(() => componentChoiceProfileFor(selectedComponent.value.id))
const selectedChoiceFamily = computed(() => componentChoiceFamilyFor(selectedComponent.value.id))
const groupingMode = ref<ComponentGroupingMode>(readComponentGroupingMode())
const groupingModeOptions = componentGroupingModes.map(({ value, label }) => ({ value, label }))
const catalogScope = ref<ComponentCatalogScope>(readComponentCatalogScope())
const catalogScopeOptions = componentCatalogScopes.map(({ value, label }) => ({ value, label }))
const activeMode = computed(() => componentGroupingModes.find(mode => mode.value === groupingMode.value)!)
const activeGroups = computed(() => resolveComponentGroups(groupingMode.value)
  .map(group => ({
    ...group,
    components: group.components.filter(component => (
      catalogScope.value === 'all'
      || isRecommendedComponent(component)
      || component.id === selectedComponent.value.id
    )),
  }))
  .filter(group => group.components.length))
const selectedGroup = computed(() => activeGroups.value.find(group => group.components.some(component => component.id === selectedComponent.value.id)) ?? activeGroups.value[0])
const expandedGroups = ref<Set<string>>(new Set(selectedGroup.value ? [selectedGroup.value.id] : []))
const groupedComponentSequence = computed(() => {
  const seen = new Set<string>()
  return activeGroups.value.flatMap(group => group.components).filter(component => {
    if (seen.has(component.id)) return false
    seen.add(component.id)
    return true
  })
})
const readyCount = computed(() => componentCatalog.filter(component => component.implementation === 'ready').length)
const plannedCount = computed(() => componentCatalog.length - readyCount.value)
const componentById = new Map(componentCatalog.map(component => [component.id, component]))
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
  'input-button': () => import('../docs/InputControlDocs.vue'),
  'input-checkbox': () => import('../docs/InputControlDocs.vue'),
  'input-color': () => import('../docs/InputControlDocs.vue'),
  'input-datetime-local': () => import('../docs/InputControlDocs.vue'),
  'input-email': () => import('../docs/InputControlDocs.vue'),
  'input-file': () => import('../docs/InputControlDocs.vue'),
  'input-hidden': () => import('../docs/InputControlDocs.vue'),
  'input-image': () => import('../docs/InputControlDocs.vue'),
  'input-number': () => import('../docs/InputControlDocs.vue'),
  'input-password': () => import('../docs/InputControlDocs.vue'),
  'input-radio': () => import('../docs/InputControlDocs.vue'),
  'input-range': () => import('../docs/InputControlDocs.vue'),
  'input-reset': () => import('../docs/InputControlDocs.vue'),
  'input-search': () => import('../docs/InputControlDocs.vue'),
  'input-submit': () => import('../docs/InputControlDocs.vue'),
  'input-tel': () => import('../docs/InputControlDocs.vue'),
  'input-text': () => import('../docs/InputControlDocs.vue'),
  'input-url': () => import('../docs/InputControlDocs.vue'),
  'input-week': () => import('../docs/InputControlDocs.vue'),
  select: () => import('../docs/SelectDocs.vue'),
  'choice-portal': () => import('../docs/ChoicePortalDocs.vue'),
  'multi-choice': () => import('../docs/RecommendedControlDocs.vue'),
  segmented: () => import('../docs/RecommendedControlDocs.vue'),
  'time-picker': () => import('../docs/TimePickerDocs.vue'),
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
  'virtual-list': () => import('../docs/RecommendedControlDocs.vue'),
}
const missingKeyboardComponents = componentsMissingKeyboardGuidance(componentCatalog.map(component => component.id))
if (missingKeyboardComponents.length) {
  throw new Error(`以下组件缺少键盘场景说明：${missingKeyboardComponents.join(', ')}`)
}

const sharedDocIds = new Set([
  'checkbox', 'radio-group', 'slider', 'switch', 'accordion', 'avatar', 'collapsible', 'popover', 'progress', 'separator', 'tabs', 'tooltip',
  'combobox', 'editable', 'listbox', 'number-field', 'label', 'pin-input', 'tags-input', 'toggle', 'toggle-group',
  'alert-dialog', 'aspect-ratio', 'context-menu', 'dropdown-menu', 'hover-card', 'menubar', 'navigation-menu', 'pagination', 'scroll-area', 'splitter', 'stepper', 'toast', 'toolbar',
  'autocomplete', 'rating', 'color-area', 'color-field', 'color-slider', 'color-swatch', 'color-swatch-picker',
  'calendar', 'date-field', 'date-picker', 'date-range-field', 'date-range-picker', 'range-calendar', 'time-field', 'time-range-field', 'month-picker', 'month-range-picker', 'year-picker', 'year-range-picker', 'drawer', 'tree',
  'multi-choice', 'segmented', 'virtual-list',
])

const activeDoc = computed(() => defineAsyncComponent({
  loader: docLoaders[selectedComponent.value.id] ?? (() => import('../docs/PlannedComponentDocs.vue')),
  delay: 120,
  timeout: 15000,
}))
const ComponentApiTable = defineAsyncComponent(() => import('../components/ComponentApiTable.vue'))

watch(groupingMode, mode => {
  saveComponentGroupingMode(mode)
  expandedGroups.value = new Set(selectedGroup.value ? [selectedGroup.value.id] : [])
})

watch(catalogScope, scope => {
  saveComponentCatalogScope(scope)
  expandedGroups.value = new Set(selectedGroup.value ? [selectedGroup.value.id] : [])
})

watch(() => [props.componentId, props.scenarioId], () => {
  if (selectedGroup.value) expandedGroups.value = new Set([...expandedGroups.value, selectedGroup.value.id])
  sidebarOpen.value = false
})

function groupExpanded(group: ResolvedComponentGroup) {
  return expandedGroups.value.has(group.id)
}

function toggleGroup(group: ResolvedComponentGroup) {
  const next = new Set(expandedGroups.value)
  next.has(group.id) ? next.delete(group.id) : next.add(group.id)
  expandedGroups.value = next
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
      <small>{{ catalogScope === 'recommended' ? '先显示高频首选，避免在近似控件中反复比较。' : '完整目录包含专用、基础积木与兼容封装。' }}</small>
      <div class="sidebar-catalog-scope">
        <span>目录范围</span>
        <DlSegmented
          v-model="catalogScope"
          :items="catalogScopeOptions"
          size="sm"
          block
          aria-label="组件目录范围"
        />
      </div>
      <div class="sidebar-grouping-mode">
        <span>分组方式</span>
        <DlSegmented
          v-model="groupingMode"
          :items="groupingModeOptions"
          size="sm"
          block
          aria-label="组件目录分组方式"
        />
      </div>
    </div>

    <nav aria-label="组件大纲">
      <section v-for="group in activeGroups" :key="group.id" class="sidebar-group" :class="{ open: groupExpanded(group) }">
        <button
          type="button"
          class="sidebar-group-trigger"
          :aria-expanded="groupExpanded(group)"
          :title="group.summary"
          @click="toggleGroup(group)"
        >
          <span><b>{{ group.label }}</b><small>{{ group.english }} · {{ group.components.length }}</small></span>
          <i>{{ groupExpanded(group) ? '−' : '+' }}</i>
        </button>
        <div v-show="groupExpanded(group)" class="sidebar-group-content">
          <div v-for="item in group.components" :key="`${group.id}-${item.id}`" class="sidebar-component">
            <a
              :href="componentRoute(item.id)"
              :class="{ active: selectedComponent.id === item.id, planned: item.implementation === 'planned' }"
            >
              <span class="sidebar-component-copy">
                <span>{{ item.name }}<CustomControlMark v-if="item.maturity === 'custom'" /></span>
                <small>
                  <em v-if="componentChoiceProfileFor(item.id).tier !== 'recommended'" class="choice-tier">{{ componentChoiceProfileFor(item.id).label }}</em>
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
      <small>{{ catalogScope === 'recommended' ? `${recommendedComponentCount} RECOMMENDED · ${componentCatalog.length} TOTAL` : `${readyCount} READY · ${plannedCount} ROADMAP` }} · 允许跨组复用</small>
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
            {{ activeMode.label }} · {{ selectedGroup?.label }} · {{ selectedComponent.implementation === 'ready' ? `SINCE ${selectedComponent.since}` : 'ROADMAP' }}
          </DlBadge>
          <DlBadge v-if="selectedComponent.maturity === 'alpha'" tone="warning" variant="outline">{{ selectedComponent.sourceUrl ? 'REKA ALPHA' : 'ALPHA' }}</DlBadge>
          <DlBadge v-if="selectedComponent.id.startsWith('input-')" tone="accent" variant="outline">PACKAGED INPUT</DlBadge>
          <DlBadge :tone="selectedChoiceProfile.tier === 'recommended' ? 'success' : selectedChoiceProfile.tier === 'compatibility' ? 'warning' : 'muted'" variant="outline">
            {{ selectedChoiceProfile.label }}
          </DlBadge>
        </div>
        <h1>{{ selectedComponent.name }}<CustomControlMark v-if="selectedComponent.maturity === 'custom'" /></h1>
        <p>{{ selectedComponent.summary }}</p>
      </div>
      <a v-if="selectedComponent.id.startsWith('input-')" :href="selectedComponent.sourceUrl" target="_blank" rel="noreferrer">
        <DlButton variant="secondary" size="sm">查看 MDN 参考 ↗</DlButton>
      </a>
      <a v-else href="https://www.npmjs.com/package/@dragon-liquid/vue" target="_blank" rel="noreferrer">
        <DlButton variant="secondary" size="sm">查看 npm 包 ↗</DlButton>
      </a>
    </header>

    <section v-if="selectedChoiceFamily" class="component-choice-guide" aria-label="相似控件选择指南">
      <header>
        <span>CHOICE GUIDE</span>
        <div>
          <h2>{{ selectedChoiceFamily.question }}</h2>
          <p>{{ selectedChoiceFamily.summary }}</p>
        </div>
      </header>
      <nav :aria-label="`${selectedChoiceFamily.label}控件选择`">
        <a
          v-for="option in selectedChoiceFamily.options"
          :key="option.id"
          :href="componentRoute(option.id)"
          :class="{
            active: option.id === selectedComponent.id,
            preferred: option.id === selectedChoiceFamily.preferredId,
          }"
        >
          <span>
            <b>{{ componentById.get(option.id)?.name }}</b>
            <em v-if="option.id === selectedChoiceFamily.preferredId">常见首选</em>
          </span>
          <small>{{ option.useWhen }}</small>
        </a>
      </nav>
      <footer v-if="selectedChoiceProfile.preferredId">
        当前控件用于兼容特定 HTML 语义；新业务通常先使用
        <a :href="componentRoute(selectedChoiceProfile.preferredId)">{{ componentById.get(selectedChoiceProfile.preferredId)?.name }}</a>。
      </footer>
    </section>

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
      <article class="component-guidance__keyboard">
        <span>KEYBOARD</span>
        <h2>键盘操作</h2>
        <p>{{ selectedKeyboardGuidance.summary }}</p>
        <div><kbd v-for="key in selectedKeyboardGuidance.keys" :key="key">{{ key }}</kbd></div>
        <small v-if="selectedKeyboardGuidance.paste">{{ selectedKeyboardGuidance.paste }}</small>
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
        v-bind="selectedComponent.implementation === 'planned' || selectedComponent.id.startsWith('input-') || sharedDocIds.has(selectedComponent.id) ? { componentDefinition: selectedComponent } : {}"
        :key="selectedComponent.id"
      />
      <template #fallback>
        <div class="doc-loading"><i /><span>正在按需加载 {{ selectedComponent.name }} 案例…</span></div>
      </template>
    </Suspense>

    <ComponentApiTable :component-id="selectedComponent.id" :component-name="selectedComponent.name" />

    <nav class="docs-pagination" aria-label="组件翻页">
      <template v-for="(item, index) in groupedComponentSequence" :key="item.id">
        <a v-if="item.id === selectedComponent.id && index > 0" :href="componentRoute(groupedComponentSequence[index - 1].id)">
          <small>上一个</small><b>← {{ groupedComponentSequence[index - 1].name }}</b>
        </a>
        <span v-else-if="item.id === selectedComponent.id" />
        <a v-if="item.id === selectedComponent.id && index < groupedComponentSequence.length - 1" :href="componentRoute(groupedComponentSequence[index + 1].id)">
          <small>下一个</small><b>{{ groupedComponentSequence[index + 1].name }} →</b>
        </a>
      </template>
    </nav>
  </article>
  <button v-if="sidebarOpen" class="sidebar-scrim" type="button" aria-label="关闭目录" @click="sidebarOpen = false" />
</main>
</template>
