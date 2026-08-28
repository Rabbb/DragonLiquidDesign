<script setup lang="ts">
import { computed } from 'vue'
import DlContainer from './DlContainer.vue'
import DlSiteHeader from './DlSiteHeader.vue'
import DlSiteNavigation from './DlSiteNavigation.vue'
import type { DlSiteEnvironment, DlSiteNavigationGroup, DlSiteNavigationItem, DlSiteNavigationMode } from './site-layout.types'

const props = withDefaults(defineProps<{
  siteName?: string
  caption?: string
  mark?: string
  navigation?: DlSiteNavigationGroup[]
  activePath?: string
  navigationMode?: DlSiteNavigationMode
  environment?: DlSiteEnvironment
  contentSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  stickyHeader?: boolean
  sidebarWidth?: string
}>(), { siteName: 'Untitled site', caption: '', mark: 'DL', navigation: () => [], activePath: '/', navigationMode: 'hybrid', environment: () => ({}), contentSize: 'lg', stickyHeader: true, sidebarWidth: '236px' })
const emit = defineEmits<{ navigate: [item: DlSiteNavigationItem] }>()

const resolvedName = computed(() => props.environment.siteName || props.siteName)
const resolvedCaption = computed(() => props.environment.siteCaption || props.caption)
const homePath = computed(() => props.environment.homePath || '/')
const activeGroup = computed(() => props.navigation.find(group => group.items.some(item => normalize(item.href) === normalize(props.activePath))) ?? props.navigation[0])
const sideGroups = computed(() => props.navigationMode === 'hybrid' && activeGroup.value ? [activeGroup.value] : props.navigation)
const hasSide = computed(() => ['side', 'hybrid', 'rail'].includes(props.navigationMode) && sideGroups.value.length > 0)
const sideMode = computed(() => props.navigationMode === 'rail' ? 'rail' as const : 'sidebar' as const)
const showTop = computed(() => props.navigationMode === 'top')
function normalize(value: string) { return `/${value.split(/[?#]/, 1)[0].replace(/^\/+|\/+$/g, '')}`.replace(/^\/$/, '/') }
</script>

<template>
  <section data-dl data-slot="site-shell" :data-navigation-mode="navigationMode" :style="{ '--dl-site-sidebar-width': sidebarWidth }" class="min-h-full bg-[var(--dl-night)] text-[var(--dl-text)]">
    <DlSiteHeader :site-name="resolvedName" :caption="resolvedCaption" :home-href="homePath" :mark="mark" :sticky="stickyHeader" :compact="navigationMode === 'rail'">
      <template v-if="$slots.brand" #brand><slot name="brand" :environment="environment" /></template>
      <template v-if="$slots.navigation || showTop" #navigation>
        <slot name="navigation" :environment="environment" :groups="navigation">
          <DlSiteNavigation v-if="showTop" :groups="navigation" :active-path="activePath" mode="top" managed @navigate="emit('navigate', $event)" />
        </slot>
      </template>
      <template #actions><slot name="actions" :environment="environment" /></template>
    </DlSiteHeader>
    <div data-slot="site-shell-body" :class="['mx-auto grid w-full max-w-[1440px]', hasSide ? 'grid-cols-[var(--dl-site-sidebar-width)_minmax(0,1fr)]' : 'grid-cols-1']">
      <aside v-if="hasSide" data-slot="site-shell-sidebar" class="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto border-r border-[var(--dl-border)] bg-[var(--dl-surface)] p-4">
        <slot name="sidebar" :environment="environment" :groups="sideGroups">
          <DlSiteNavigation :groups="sideGroups" :active-path="activePath" :mode="sideMode" managed @navigate="emit('navigate', $event)" />
        </slot>
      </aside>
      <DlContainer as="main" :size="contentSize" gutter="md" data-slot="site-shell-content" class="min-w-0 py-8">
        <slot :environment="environment" :active-group="activeGroup" />
      </DlContainer>
    </div>
    <footer v-if="$slots.footer" data-slot="site-shell-footer" class="border-t border-[var(--dl-border)] bg-[var(--dl-surface)]"><DlContainer :size="contentSize" gutter="md" class="py-6"><slot name="footer" :environment="environment" /></DlContainer></footer>
  </section>
</template>

<style scoped>
@media(max-width:760px){[data-slot="site-shell-body"]{grid-template-columns:1fr}[data-slot="site-shell-sidebar"]{position:static;top:auto;height:auto;overflow-x:auto;border-right:0;border-bottom:1px solid var(--dl-border);padding:8px 14px}[data-slot="site-shell-sidebar"] :deep([data-slot="site-navigation"]){display:flex;gap:6px}[data-slot="site-shell-sidebar"] :deep([data-slot="site-navigation-group"]){display:flex;margin:0}[data-slot="site-shell-sidebar"] :deep([data-slot="site-navigation-group-label"]){display:none}[data-slot="site-shell-sidebar"] :deep([data-slot="site-navigation-items"]){display:flex;gap:3px}}
</style>
