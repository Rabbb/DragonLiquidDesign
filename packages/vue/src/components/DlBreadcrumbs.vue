<script setup lang="ts">
import type { DlBreadcrumbItem } from './site-layout.types'

withDefaults(defineProps<{ items: DlBreadcrumbItem[]; separator?: string }>(), { separator: '/' })
</script>

<template>
  <nav data-dl data-slot="breadcrumbs" aria-label="面包屑" class="flex min-w-0 flex-wrap items-center gap-2 text-sm text-[var(--dl-text-muted)]">
    <template v-for="(item, index) in items" :key="`${item.label}-${index}`">
      <span v-if="index" aria-hidden="true" class="text-[var(--dl-text-faint)]">{{ separator }}</span>
      <a v-if="item.href && !item.current" :href="item.href" class="rounded-md outline-none transition hover:text-[var(--dl-accent-text)] focus-visible:[box-shadow:var(--dl-focus)]">{{ item.label }}</a>
      <span v-else :aria-current="item.current ? 'page' : undefined" :class="item.current && 'font-semibold text-[var(--dl-text)]'">{{ item.label }}</span>
    </template>
  </nav>
</template>
