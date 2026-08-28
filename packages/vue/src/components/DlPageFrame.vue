<script setup lang="ts">
import { computed, useSlots, type Slots } from 'vue'

const props = withDefaults(defineProps<{
  as?: string
  layout?: 'article' | 'sidebar' | 'aside' | 'three-column' | 'full'
  sidebarWidth?: string
  asideWidth?: string
  gap?: string
  stickySecondary?: boolean
}>(), { as: 'main', layout: 'article', sidebarWidth: '240px', asideWidth: '220px', gap: '36px', stickySecondary: true })
const pageSlots: Slots = useSlots()
const hasSidebar = computed<boolean>(() => Boolean(pageSlots.sidebar) && ['sidebar', 'three-column'].includes(props.layout))
const hasAside = computed<boolean>(() => Boolean(pageSlots.aside) && ['aside', 'three-column'].includes(props.layout))
const columns = computed<string>(() => [hasSidebar.value ? props.sidebarWidth : '', 'minmax(0, 1fr)', hasAside.value ? props.asideWidth : ''].filter(Boolean).join(' '))
</script>

<template>
  <component :is="as" data-dl data-slot="page-frame" :data-layout="layout" :style="{ '--dl-page-columns': columns, '--dl-page-gap': gap }" class="grid min-w-0 grid-cols-[var(--dl-page-columns)] gap-[var(--dl-page-gap)]">
    <aside v-if="hasSidebar" data-slot="page-frame-sidebar" :class="stickySecondary && 'sticky top-6 h-max'"><slot name="sidebar" /></aside>
    <section data-slot="page-frame-content" class="min-w-0"><slot /></section>
    <aside v-if="hasAside" data-slot="page-frame-aside" :class="stickySecondary && 'sticky top-6 h-max'"><slot name="aside" /></aside>
  </component>
</template>

<style scoped>
@media(max-width:900px){[data-slot="page-frame"]{grid-template-columns:minmax(0,1fr)}[data-slot="page-frame-sidebar"],[data-slot="page-frame-aside"]{position:static}}
</style>
