<script setup lang="ts">
import { computed } from 'vue'
import type { DlSiteNavigationGroup, DlSiteNavigationItem } from './site-layout.types'

const props = withDefaults(defineProps<{
  groups: DlSiteNavigationGroup[]
  activePath?: string
  mode?: 'top' | 'sidebar' | 'tabs' | 'rail'
  managed?: boolean
  label?: string
}>(), { activePath: '/', mode: 'sidebar', managed: false, label: '网站导航' })
const emit = defineEmits<{ navigate: [item: DlSiteNavigationItem] }>()
const normalizedActive = computed(() => normalizePath(props.activePath))

function normalizePath(value: string) {
  const path = value.split(/[?#]/, 1)[0] || '/'
  return `/${path.replace(/^\/+|\/+$/g, '')}`.replace(/^\/$/, '/')
}
function isActive(item: DlSiteNavigationItem) { return normalizePath(item.href) === normalizedActive.value }
function navigate(event: MouseEvent, item: DlSiteNavigationItem) {
  if (props.managed && !item.external) event.preventDefault()
  emit('navigate', item)
}
</script>

<template>
  <nav data-dl data-slot="site-navigation" :data-mode="mode" :aria-label="label" :class="['dl-site-navigation', `dl-site-navigation--${mode}`]">
    <section v-for="group in groups" :key="group.id" data-slot="site-navigation-group" :data-group="group.id">
      <strong v-if="mode !== 'tabs' && (groups.length > 1 || group.label)" data-slot="site-navigation-group-label">{{ group.label }}</strong>
      <div data-slot="site-navigation-items">
        <a
          v-for="item in group.items"
          :key="item.id"
          :href="item.href"
          :target="item.external ? '_blank' : undefined"
          :rel="item.external ? 'noopener noreferrer' : undefined"
          :aria-current="isActive(item) ? 'page' : undefined"
          :title="mode === 'rail' ? item.label : undefined"
          @click="navigate($event, item)"
        >
          <i v-if="item.icon || mode === 'rail'" aria-hidden="true">{{ item.icon || item.label.slice(0, 1).toUpperCase() }}</i>
          <span><b>{{ item.label }}</b><small v-if="item.description && mode === 'sidebar'">{{ item.description }}</small></span>
        </a>
      </div>
    </section>
  </nav>
</template>

<style scoped>
.dl-site-navigation{min-width:0;color:var(--dl-text-muted)}.dl-site-navigation section{display:grid;gap:8px}.dl-site-navigation section+section{margin-top:20px}.dl-site-navigation [data-slot="site-navigation-group-label"]{padding:0 10px;color:var(--dl-text-faint);font:800 .65rem/1.2 ui-monospace,monospace;letter-spacing:.09em;text-transform:uppercase}.dl-site-navigation [data-slot="site-navigation-items"]{display:grid;gap:3px}.dl-site-navigation a{display:flex;align-items:center;gap:10px;min-width:0;padding:9px 10px;border:1px solid transparent;border-radius:10px;color:inherit;text-decoration:none;outline:none;transition:.16s ease}.dl-site-navigation a:hover{color:var(--dl-text);background:var(--dl-surface-hover)}.dl-site-navigation a[aria-current="page"]{border-color:var(--dl-accent-border);color:var(--dl-accent-text);background:var(--dl-accent-surface)}.dl-site-navigation a i{display:grid;flex:0 0 26px;width:26px;aspect-ratio:1;place-items:center;border-radius:8px;background:var(--dl-night-soft);font:800 .68rem/1 ui-monospace,monospace}.dl-site-navigation a span{display:grid;min-width:0;gap:3px}.dl-site-navigation a b{overflow:hidden;font-size:.82rem;text-overflow:ellipsis;white-space:nowrap}.dl-site-navigation a small{overflow:hidden;color:var(--dl-text-faint);font-size:.68rem;text-overflow:ellipsis;white-space:nowrap}.dl-site-navigation--top{display:flex;align-items:center;gap:12px;overflow-x:auto}.dl-site-navigation--top section{display:flex;align-items:center;gap:4px}.dl-site-navigation--top section+section{margin:0}.dl-site-navigation--top [data-slot="site-navigation-group-label"]{display:none}.dl-site-navigation--top [data-slot="site-navigation-items"]{display:flex;gap:3px}.dl-site-navigation--top a,.dl-site-navigation--tabs a{white-space:nowrap}.dl-site-navigation--tabs section,.dl-site-navigation--tabs [data-slot="site-navigation-items"]{display:flex;gap:4px}.dl-site-navigation--tabs section+section{margin:0}.dl-site-navigation--tabs{display:flex;gap:4px;overflow-x:auto;border-bottom:1px solid var(--dl-border)}.dl-site-navigation--tabs a{border:0;border-bottom:2px solid transparent;border-radius:8px 8px 0 0}.dl-site-navigation--tabs a[aria-current="page"]{border-bottom-color:var(--dl-accent);background:var(--dl-accent-surface)}.dl-site-navigation--rail [data-slot="site-navigation-group-label"],.dl-site-navigation--rail a span{display:none}.dl-site-navigation--rail a{justify-content:center;padding:7px}.dl-site-navigation--rail section+section{margin-top:12px}
</style>
