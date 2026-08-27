<script setup lang="ts">
import { computed, ref, watch } from 'vue'

type ItemKey = string | ((item: unknown, index: number) => string | number)
type ScrollAlignment = 'start' | 'center' | 'end' | 'auto'

const props = withDefaults(defineProps<{
  items: unknown[]
  estimatedItemHeight?: number
  viewportHeight?: number
  overscan?: number
  itemKey?: ItemKey
  ariaLabel?: string
}>(), {
  estimatedItemHeight: 56,
  viewportHeight: 320,
  overscan: 4,
  itemKey: undefined,
  ariaLabel: '虚拟列表',
})

const viewport = ref<HTMLElement | null>(null)
const scrollTop = ref(0)
const itemHeight = computed(() => Math.max(1, Number(props.estimatedItemHeight) || 56))
const height = computed(() => Math.max(itemHeight.value, Number(props.viewportHeight) || 320))
const safeOverscan = computed(() => Math.max(0, Math.floor(props.overscan)))
const totalHeight = computed(() => props.items.length * itemHeight.value)
const visibleCount = computed(() => Math.ceil(height.value / itemHeight.value))
const startIndex = computed(() => Math.max(0, Math.floor(scrollTop.value / itemHeight.value) - safeOverscan.value))
const endIndex = computed(() => Math.min(props.items.length, startIndex.value + visibleCount.value + safeOverscan.value * 2))
const visibleItems = computed(() => props.items.slice(startIndex.value, endIndex.value).map((item, offset) => {
  const index = startIndex.value + offset
  return { item, index, key: resolveKey(item, index) }
}))
const offsetY = computed(() => startIndex.value * itemHeight.value)

function resolveKey(item: unknown, index: number) {
  if (typeof props.itemKey === 'function') return props.itemKey(item, index)
  if (typeof props.itemKey === 'string' && item && typeof item === 'object') {
    return String((item as Record<string, unknown>)[props.itemKey] ?? index)
  }
  return index
}

function handleScroll(event: Event) {
  scrollTop.value = (event.currentTarget as HTMLElement).scrollTop
}

function scrollToIndex(index: number, alignment: ScrollAlignment = 'auto') {
  const element = viewport.value
  if (!element || !props.items.length) return
  const safeIndex = Math.max(0, Math.min(props.items.length - 1, Math.floor(index)))
  const start = safeIndex * itemHeight.value
  const end = start + itemHeight.value
  const viewStart = element.scrollTop
  const viewEnd = viewStart + height.value
  let top = start
  if (alignment === 'center') top = start - (height.value - itemHeight.value) / 2
  else if (alignment === 'end') top = end - height.value
  else if (alignment === 'auto' && start >= viewStart && end <= viewEnd) return
  else if (alignment === 'auto' && end > viewEnd) top = end - height.value
  element.scrollTop = Math.max(0, Math.min(totalHeight.value - height.value, top))
  scrollTop.value = element.scrollTop
}

function scrollToTop() {
  if (viewport.value) viewport.value.scrollTop = 0
  scrollTop.value = 0
}

watch([totalHeight, height], () => {
  const maximum = Math.max(0, totalHeight.value - height.value)
  if (scrollTop.value <= maximum) return
  scrollTop.value = maximum
  if (viewport.value) viewport.value.scrollTop = maximum
})

defineExpose({ scrollToIndex, scrollToTop })
</script>

<template>
  <div data-dl data-slot="virtual-list" class="dl-virtual-list" :data-empty="!items.length || undefined">
    <div
      v-if="items.length"
      ref="viewport"
      data-slot="virtual-list-viewport"
      class="dl-virtual-list__viewport"
      :style="{ height: `${height}px` }"
      role="list"
      :aria-label="ariaLabel"
      tabindex="0"
      @scroll.passive="handleScroll"
    >
      <div class="dl-virtual-list__spacer" :style="{ height: `${totalHeight}px` }">
        <div class="dl-virtual-list__window" :style="{ transform: `translateY(${offsetY}px)` }">
          <div
            v-for="entry in visibleItems"
            :key="entry.key"
            data-slot="virtual-list-item"
            class="dl-virtual-list__item"
            :style="{ height: `${itemHeight}px` }"
            role="listitem"
            :aria-posinset="entry.index + 1"
            :aria-setsize="items.length"
          >
            <slot name="item" :item="entry.item" :index="entry.index">{{ entry.item }}</slot>
          </div>
        </div>
      </div>
    </div>
    <div v-else data-slot="virtual-list-empty" class="dl-virtual-list__empty"><slot name="empty">暂无内容</slot></div>
  </div>
</template>

<style scoped>
.dl-virtual-list { width: 100%; overflow: hidden; border: 1px solid var(--dl-border); border-radius: var(--dl-radius-lg); background: var(--dl-surface); color: var(--dl-text); box-shadow: var(--dl-shadow); }
.dl-virtual-list__viewport { overflow-x: hidden; overflow-y: auto; overscroll-behavior: contain; scrollbar-gutter: stable; scrollbar-color: var(--dl-border-strong) transparent; outline: none; }
.dl-virtual-list__viewport:focus-visible { box-shadow: inset var(--dl-focus); }
.dl-virtual-list__spacer { position: relative; width: 100%; }
.dl-virtual-list__window { position: absolute; inset: 0 0 auto; will-change: transform; }
.dl-virtual-list__item { box-sizing: border-box; width: 100%; overflow: hidden; border-bottom: 1px solid var(--dl-border); }
.dl-virtual-list__empty { display: grid; min-height: 130px; place-items: center; padding: 24px; color: var(--dl-text-faint); font-size: .82rem; text-align: center; }
</style>

