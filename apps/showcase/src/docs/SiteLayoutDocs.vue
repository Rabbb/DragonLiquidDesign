<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  DlBadge,
  DlBreadcrumbs,
  DlButton,
  DlCard,
  DlCluster,
  DlGrid,
  DlPageFrame,
  DlSegmented,
  DlSiteShell,
  DlStack,
  type DlChoiceOption,
  type DlSiteEnvironment,
  type DlSiteNavigationGroup,
  type DlSiteNavigationItem,
  type DlSiteNavigationMode,
} from '@dragon-liquid/vue'
import type { ComponentDefinition } from '../catalog'
import DocExampleShell from '../components/DocExampleShell.vue'
import { vueSfc } from './exampleCode'

const props = defineProps<{ scenario: string; componentDefinition: ComponentDefinition }>()
const activePath = ref('/guides/layout')
const navigationMode = ref<DlSiteNavigationMode>('hybrid')
const navigationModes: DlChoiceOption[] = [
  { value: 'hybrid', label: '混合' },
  { value: 'side', label: '侧栏' },
  { value: 'top', label: '顶栏' },
  { value: 'minimal', label: '极简' },
]
const environment: DlSiteEnvironment = {
  siteName: 'Atlas Notes',
  siteCaption: 'Environment · preview',
  homePath: '/',
  basePath: '/pw/demo/-',
  variables: { channel: 'preview', locale: 'zh-CN' },
}
const navigation: DlSiteNavigationGroup[] = [
  { id: 'start', label: '开始', order: 1, items: [
    { id: 'home', label: '首页', href: '/', icon: '⌂' },
    { id: 'about', label: '项目说明', href: '/about', icon: 'i' },
  ] },
  { id: 'guides', label: '使用指南', order: 2, items: [
    { id: 'layout', label: '网站布局', href: '/guides/layout', description: '母版与内容插槽', icon: '▦' },
    { id: 'publish', label: '发布网站', href: '/guides/publish', description: '预览、导出和 Git', icon: '↗' },
  ] },
]

const code = computed(() => vueSfc({
  imports: [
    'DlBreadcrumbs', 'DlButton', 'DlCard', 'DlCluster', 'DlGrid',
    'DlPageFrame', 'DlSiteShell', 'DlStack', 'type DlSiteNavigationGroup',
  ],
  script: `import { ref } from 'vue'\n\nconst activePath = ref('/guides/layout')\nconst navigation: DlSiteNavigationGroup[] = ${JSON.stringify(navigation, null, 2)}`,
  template: `  <DlSiteShell site-name="Atlas Notes" :navigation="navigation" :active-path="activePath" navigation-mode="hybrid" @navigate="activePath = $event.href">
    <DlStack gap="lg">
      <DlBreadcrumbs :items="[{ label: '首页', href: '/' }, { label: '网站布局', current: true }]" />
      <DlPageFrame layout="aside">
        <DlStack><h1>网站布局</h1><p>页面内容插槽。</p></DlStack>
        <template #aside><DlCard>章节目录</DlCard></template>
      </DlPageFrame>
      <DlGrid min-item-width="180px"><DlCard v-for="name in ['母版', '导航', '内容']" :key="name">{{ name }}</DlCard></DlGrid>
      <DlCluster><DlButton variant="primary">开始使用</DlButton></DlCluster>
    </DlStack>
  </DlSiteShell>`,
}))

function navigate(item: DlSiteNavigationItem) {
  activePath.value = item.href
}
</script>

<template>
  <DocExampleShell
    eyebrow="SITE LAYOUT"
    :title="`${componentDefinition.name} · 网站母版实时预览`"
    description="不是静态截图：切换导航模式、点击目录并缩放浏览器，即可验证同一套组件在实际网站中的响应式行为。"
    :code="code"
    :tips="[
      '基础布局组件只处理空间；SiteShell 负责组合页头、导航、内容插槽与页脚。',
      '环境变量通过 environment 传入，页面内容不需要依赖 TodoMoe 或编辑器外壳。',
      'MDX 项目会把隐藏域和 _group.json 编译成这里使用的 navigation 数据。',
    ]"
  >
    <div class="site-layout-lab">
      <DlCluster justify="between">
        <DlBadge tone="accent" variant="outline">当前：{{ componentDefinition.name }}</DlBadge>
        <DlSegmented v-model="navigationMode" :items="navigationModes" size="sm" aria-label="导航模式" />
      </DlCluster>
      <div class="site-layout-viewport">
        <DlSiteShell
          :environment="environment"
          mark="AN"
          :navigation="navigation"
          :active-path="activePath"
          :navigation-mode="navigationMode"
          content-size="md"
          :sticky-header="false"
          @navigate="navigate"
        >
          <DlStack gap="lg">
            <DlBreadcrumbs :items="[
              { label: '首页', href: '/' },
              { label: '指南', href: '/guides' },
              { label: '网站布局', current: true },
            ]" />
            <DlPageFrame layout="aside" aside-width="180px" gap="24px" :sticky-secondary="false">
              <DlStack gap="sm">
                <DlBadge tone="success" variant="outline">LIVE WEBSITE</DlBadge>
                <h1>用内容插槽搭建页面</h1>
                <p>母版负责网站框架，当前 MDX 页面只需要关心正文、组件和交互。</p>
                <DlCluster><DlButton size="sm" variant="primary">开始编辑</DlButton><DlButton size="sm" variant="secondary">查看路由</DlButton></DlCluster>
              </DlStack>
              <template #aside><DlCard padding="sm"><b>页面环境</b><small>channel: preview</small><small>locale: zh-CN</small></DlCard></template>
            </DlPageFrame>
            <DlGrid min-item-width="150px" gap="sm">
              <DlCard v-for="card in ['目录生成导航', '母版套内容', '多端同构预览']" :key="card" padding="sm"><b>{{ card }}</b><small>Dragon Liquid Layout</small></DlCard>
            </DlGrid>
          </DlStack>
          <template #actions><DlBadge tone="accent">PREVIEW</DlBadge></template>
          <template #footer><small>Atlas Notes · generated with DL-MDX</small></template>
        </DlSiteShell>
      </div>
    </div>
  </DocExampleShell>
</template>

<style scoped>
.site-layout-lab { display: grid; gap: 14px; width: 100%; min-width: 0; }
.site-layout-viewport { min-height: 510px; overflow: hidden; border: 1px solid var(--dl-border); border-radius: 16px; background: var(--dl-night); box-shadow: 0 18px 48px rgba(0, 0, 0, .18); }
.site-layout-viewport :deep([data-slot="site-shell"]) { min-height: 510px; }
.site-layout-viewport h1 { margin: 0; font-size: clamp(1.45rem, 4vw, 2.5rem); }
.site-layout-viewport p { margin: 0; color: var(--dl-text-muted); line-height: 1.7; }
.site-layout-viewport :deep([data-slot="card"]) { display: grid; gap: 7px; }
.site-layout-viewport :deep([data-slot="card"] small) { color: var(--dl-text-faint); }
@media (max-width: 720px) { .site-layout-viewport { min-height: 620px; } }
</style>
