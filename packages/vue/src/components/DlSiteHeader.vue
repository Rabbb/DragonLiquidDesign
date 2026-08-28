<script setup lang="ts">
withDefaults(defineProps<{
  siteName: string
  caption?: string
  homeHref?: string
  mark?: string
  sticky?: boolean
  compact?: boolean
}>(), { caption: '', homeHref: '/', mark: 'DL', sticky: false, compact: false })
</script>

<template>
  <header data-dl data-slot="site-header" :data-compact="compact || undefined" :class="['border-b border-[var(--dl-border)] bg-[var(--dl-surface)]', sticky && 'sticky top-0 z-30 backdrop-blur-xl']">
    <div class="mx-auto flex min-h-16 w-full max-w-[1440px] items-center gap-5 px-6">
      <slot name="brand">
        <a :href="homeHref" data-slot="site-brand" class="flex min-w-0 items-center gap-[10px] rounded-xl text-[var(--dl-text)] no-underline outline-none focus-visible:[box-shadow:var(--dl-focus)]">
          <i class="grid size-9 shrink-0 place-items-center rounded-xl border border-[var(--dl-accent-border)] bg-[var(--dl-accent-surface)] text-[var(--dl-accent-text)] not-italic font-black text-xs">{{ mark }}</i>
          <span class="grid min-w-0 gap-1"><b class="truncate text-sm">{{ siteName }}</b><small v-if="caption && !compact" class="truncate text-[.62rem] text-[var(--dl-text-faint)]">{{ caption }}</small></span>
        </a>
      </slot>
      <div data-slot="site-header-navigation" class="min-w-0 flex-1"><slot name="navigation" /></div>
      <div data-slot="site-header-actions" class="flex shrink-0 items-center gap-2"><slot name="actions" /></div>
    </div>
  </header>
</template>
