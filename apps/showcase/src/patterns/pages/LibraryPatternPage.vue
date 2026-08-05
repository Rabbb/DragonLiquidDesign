<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  DlAspectRatio,
  DlAutocomplete,
  DlBadge,
  DlButton,
  DlCard,
  DlCheckbox,
  DlCombobox,
  DlContextMenu,
  DlDrawer,
  DlDropdownMenu,
  DlHoverCard,
  DlIconButton,
  DlPagination,
  DlPopover,
  DlProgress,
  DlRating,
  DlSelect,
  DlSlider,
  DlToggleGroup,
  DlTooltip,
  type DlChoiceOption,
  type DlMenuItem,
  type DlSelectOption,
} from '@dragon-liquid/vue'
import { formatLabels, statusLabels } from '../demo.data'
import type { ArchiveItem } from '../demo.types'
import { useArchiveDemo } from '../useArchiveDemo'

const {
  items, filteredItems, completionRate, query, status, format, page, view,
  favoriteIds, selectedItem, selectItem, toggleFavorite, resetFilters, notify,
} = useArchiveDemo()

const quickViewOpen = ref(false)
const favoritesOnly = ref(false)
const ratingRange = ref([0])
const visibleItems = computed(() => filteredItems.value.filter(item =>
  (!favoritesOnly.value || favoriteIds.value.includes(item.id)) && item.rating >= ratingRange.value[0],
))
const searchSuggestions = computed(() => [...new Set(items.value.flatMap(item => [item.title, item.originalTitle, item.studio, ...item.tags]))])

const statusOptions: DlSelectOption[] = [
  { value: 'all', label: '全部进度' },
  { value: 'watching', label: '追看中', description: '当前仍在观看' },
  { value: 'completed', label: '已完成' },
  { value: 'planned', label: '想看' },
  { value: 'paused', label: '搁置' },
]
const formatOptions: DlChoiceOption[] = [
  { value: 'all', label: '全部形式' },
  { value: 'tv', label: 'TV 动画' },
  { value: 'movie', label: '剧场版' },
  { value: 'ova', label: 'OVA' },
]
const viewOptions: DlChoiceOption[] = [
  { value: 'grid', label: '▦ 卡片' },
  { value: 'list', label: '☷ 列表' },
]
const itemActions: DlMenuItem[] = [
  { value: 'edit', label: '编辑资料', shortcut: 'E' },
  { value: 'progress', label: '更新进度', shortcut: 'P' },
  { value: 'divider', label: '', separator: true },
  { value: 'archive', label: '移入归档' },
]

function showQuickView(item: ArchiveItem) {
  selectItem(item.id)
  quickViewOpen.value = true
}

function handleAction(action: string, item: ArchiveItem) {
  selectItem(item.id)
  if (action === 'edit') {
    window.history.pushState({}, '', '/patterns/editor')
    window.dispatchEvent(new PopStateEvent('popstate'))
  }
  notify('已执行快捷命令', `${item.title} · ${itemActions.find(value => value.value === action)?.label}`, 'accent')
}
</script>

<template>
  <section class="pattern-view library-page">
    <div class="demo-page-heading">
      <div><small>DISCOVER · FILTER · SELECT</small><h1>我的动漫收藏库</h1><p>从查找内容开始；筛选状态会保留到详情与编辑流程。</p></div>
      <div class="demo-heading-actions">
        <DlBadge tone="success" variant="outline">{{ items.length }} ITEMS</DlBadge>
        <DlPopover title="高级筛选" align="end" tone="accent">
          <template #trigger><DlButton variant="secondary">筛选条件</DlButton></template>
          <div class="filter-popover">
            <DlCheckbox v-model="favoritesOnly" label="只看收藏" description="仅展示标记星标的作品" />
            <DlSlider v-model="ratingRange" :min="0" :max="5" :step="0.5" show-value label="最低评分" />
            <DlButton variant="secondary" block @click="favoritesOnly = false; ratingRange = [0]">清除高级筛选</DlButton>
          </div>
        </DlPopover>
      </div>
    </div>

    <div class="library-metrics">
      <DlCard padding="md"><small>总收藏</small><b>{{ items.length }}</b><span>跨越 {{ new Set(items.map(item => item.year)).size }} 个年份</span></DlCard>
      <DlCard padding="md"><small>观看完成度</small><b>{{ completionRate }}%</b><DlProgress :model-value="completionRate" tone="success" size="sm" /></DlCard>
      <DlCard padding="md"><small>本次结果</small><b>{{ visibleItems.length }}</b><span>筛选条件即时生效</span></DlCard>
    </div>

    <DlCard class="library-toolbar" padding="md">
      <div class="library-search">
        <DlAutocomplete v-model="query" :suggestions="searchSuggestions" placeholder="搜索标题、标签或制作公司" />
      </div>
      <DlSelect v-model="status" :options="statusOptions" />
      <DlCombobox v-model="format" :options="formatOptions" placeholder="作品形式" />
      <DlToggleGroup v-model="view" type="single" :items="viewOptions" />
      <DlTooltip text="恢复全部筛选条件" tone="muted"><DlIconButton label="重置筛选" @click="resetFilters">↺</DlIconButton></DlTooltip>
    </DlCard>

    <div v-if="visibleItems.length" class="archive-grid" :class="`archive-grid--${view}`">
      <DlContextMenu v-for="item in visibleItems" :key="item.id" :items="itemActions" :label="item.title" @select="handleAction($event, item)">
      <DlCard class="archive-card" padding="none" interactive>
        <button type="button" class="archive-cover" @click="showQuickView(item)">
          <DlAspectRatio :ratio="view === 'grid' ? 3 / 4 : 16 / 9">
            <div class="archive-cover-art" :style="{ '--cover-accent': item.accent }">
              <span>{{ item.title.slice(0, 1) }}</span>
              <small>{{ item.originalTitle }}</small>
            </div>
          </DlAspectRatio>
        </button>
        <div class="archive-card-body">
          <div class="archive-card-meta">
            <DlBadge :tone="item.status === 'completed' ? 'success' : item.status === 'paused' ? 'warning' : 'accent'" size="sm">{{ statusLabels[item.status] }}</DlBadge>
            <span>{{ item.year }} · {{ formatLabels[item.format] }}</span>
          </div>
          <DlHoverCard align="start">
            <template #trigger><a href="/patterns/detail" class="archive-title" @click="selectItem(item.id)">{{ item.title }}</a></template>
            <div class="archive-hover-content"><small>{{ item.studio }}</small><b>{{ item.originalTitle }}</b><p>{{ item.summary }}</p></div>
          </DlHoverCard>
          <p>{{ item.summary }}</p>
          <div class="archive-card-rating"><DlRating :model-value="item.rating" :step="0.1" size="sm" disabled /><span>{{ item.rating }}</span></div>
          <div class="archive-tags"><span v-for="tag in item.tags" :key="tag">#{{ tag }}</span></div>
          <footer>
            <span>{{ item.watched }} / {{ item.episodes }} 话</span>
            <div>
              <DlTooltip :text="favoriteIds.includes(item.id) ? '取消收藏' : '加入收藏'">
                <DlIconButton label="切换收藏" size="sm" :variant="favoriteIds.includes(item.id) ? 'primary' : 'ghost'" @click="toggleFavorite(item.id)">★</DlIconButton>
              </DlTooltip>
              <DlDropdownMenu :items="itemActions" align="end" @select="handleAction($event, item)">
                <template #trigger><DlIconButton label="更多操作" size="sm" variant="ghost">•••</DlIconButton></template>
              </DlDropdownMenu>
            </div>
          </footer>
        </div>
      </DlCard>
      </DlContextMenu>
    </div>
    <DlCard v-else class="library-empty" padding="lg"><b>没有匹配的作品</b><p>尝试放宽评分或清除筛选条件。</p><DlButton variant="primary" @click="resetFilters(); favoritesOnly = false; ratingRange = [0]">查看全部收藏</DlButton></DlCard>

    <div class="library-pagination"><span>第 {{ page }} 页 · 共 {{ visibleItems.length }} 条</span><DlPagination v-model:page="page" :total="Math.max(visibleItems.length * 3, 1)" :items-per-page="6" /></div>

    <DlDrawer v-model:open="quickViewOpen" placement="right" size="md" tone="accent" :title="selectedItem.title" description="保持收藏库上下文的快速预览">
      <div class="quick-view">
        <div class="quick-view-cover" :style="{ '--cover-accent': selectedItem.accent }"><span>{{ selectedItem.title.slice(0, 1) }}</span></div>
        <div class="archive-card-meta"><DlBadge tone="success">{{ statusLabels[selectedItem.status] }}</DlBadge><span>{{ selectedItem.year }} · {{ selectedItem.studio }}</span></div>
        <h3>{{ selectedItem.originalTitle }}</h3>
        <p>{{ selectedItem.summary }}</p>
        <DlProgress :model-value="selectedItem.watched" :max="selectedItem.episodes" show-value label="观看进度" tone="accent" />
      </div>
      <template #footer>
        <DlButton variant="secondary" @click="quickViewOpen = false">继续浏览</DlButton>
        <a href="/patterns/detail"><DlButton variant="primary">打开完整详情</DlButton></a>
      </template>
    </DlDrawer>
  </section>
</template>
