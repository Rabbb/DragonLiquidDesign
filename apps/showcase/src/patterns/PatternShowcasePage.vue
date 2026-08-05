<script setup lang="ts">
import { computed, defineAsyncComponent, ref, watch } from 'vue'
import { DlBadge, DlButton, DlToast } from '@dragon-liquid/vue'
import PatternSourceDialog from './PatternSourceDialog.vue'
import PatternControlGuide from './PatternControlGuide.vue'
import type { PatternSourceFile } from './PatternSourceDialog.vue'
import { patternPages, resolvePatternPage, type PatternPageId } from './pattern.catalog'
import { useArchiveDemo } from './useArchiveDemo'
import './patterns.css'

const props = defineProps<{ pageId?: string; guideComponentId?: string }>()
const sourceOpen = ref(false)
const guideOpen = ref(Boolean(props.guideComponentId))
const guideInitialId = ref(props.guideComponentId ?? '')
const sourceFiles = ref<PatternSourceFile[]>([])
const sourceLoading = ref(false)
const sourceError = ref('')
const current = computed(() => resolvePatternPage(props.pageId))
const components: Record<PatternPageId, object> = {
  overview: defineAsyncComponent(() => import('./pages/PatternOverviewPage.vue')),
  library: defineAsyncComponent(() => import('./pages/LibraryPatternPage.vue')),
  create: defineAsyncComponent(() => import('./pages/CreatePatternPage.vue')),
  detail: defineAsyncComponent(() => import('./pages/DetailPatternPage.vue')),
  editor: defineAsyncComponent(() => import('./pages/EditorPatternPage.vue')),
  import: defineAsyncComponent(() => import('./pages/ImportPatternPage.vue')),
  settings: defineAsyncComponent(() => import('./pages/SettingsPatternPage.vue')),
  feedback: defineAsyncComponent(() => import('./pages/FeedbackPatternPage.vue')),
  coverage: defineAsyncComponent(() => import('./pages/CoveragePatternPage.vue')),
}
const currentComponent = computed(() => components[current.value.id])
const { toast } = useArchiveDemo()

let sourceRequest = 0

async function openSource() {
  const request = ++sourceRequest
  sourceOpen.value = true
  sourceLoading.value = true
  sourceError.value = ''
  sourceFiles.value = []

  try {
    const files = await current.value.loadSource()
    if (request === sourceRequest) sourceFiles.value = files
  } catch (error) {
    if (request === sourceRequest) {
      sourceError.value = error instanceof Error ? error.message : '源码加载失败，请稍后重试。'
    }
  } finally {
    if (request === sourceRequest) sourceLoading.value = false
  }
}

watch(current, () => {
  sourceOpen.value = false
  sourceFiles.value = []
  sourceRequest += 1
})

watch(() => props.guideComponentId, componentId => {
  guideInitialId.value = componentId ?? ''
  guideOpen.value = Boolean(componentId)
})

function openGuide() {
  guideInitialId.value = ''
  guideOpen.value = true
}

function updateGuideOpen(open: boolean) {
  guideOpen.value = open
  if (open) return
  guideInitialId.value = ''
  const url = new URL(window.location.href)
  if (url.searchParams.has('guide')) {
    url.searchParams.delete('guide')
    window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`)
  }
}
</script>

<template>
  <main class="pattern-site">
    <header class="pattern-site-header">
      <a href="/patterns" class="pattern-site-brand"><span>DL</span><div><b>Archive Patterns</b><small>FRONTEND REFERENCE APP</small></div></a>
      <nav aria-label="应用演示页面">
        <a v-for="page in patternPages" :key="page.id" :href="page.href" :class="{ active: page.id === current.id }">{{ page.label }}</a>
      </nav>
      <DlBadge tone="success" variant="outline">STATIC · MOCK DATA</DlBadge>
    </header>

    <section class="pattern-pagebar">
      <div><small>{{ current.eyebrow }}</small><span>{{ current.description }}</span></div>
      <div class="pattern-pagebar-actions">
        <DlButton variant="secondary" @click="openGuide">◎ 控件导览</DlButton>
        <DlButton variant="primary" @click="openSource">&lt;/&gt; 查看本页源码</DlButton>
      </div>
    </section>

    <component :is="currentComponent" />

    <footer class="pattern-site-footer">
      <span>Dragon Liquid Application Patterns</span>
      <p>纯 Vue 前端 · 本地模拟数据 · 可静态文件部署</p>
      <a href="/components/button/basic">查看组件 API →</a>
    </footer>

    <PatternSourceDialog
      v-model:open="sourceOpen"
      :title="current.label"
      :files="sourceFiles"
      :loading="sourceLoading"
      :error="sourceError"
    />
    <PatternControlGuide
      :open="guideOpen"
      :page-key="current.id"
      :initial-component-id="guideInitialId"
      @update:open="updateGuideOpen"
    />
    <DlToast
      v-model:open="toast.open"
      :title="toast.title"
      :description="toast.description"
      :tone="toast.tone"
      action-label="知道了"
      show-progress
      @action="toast.open = false"
    />
  </main>
</template>
