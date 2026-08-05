<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  DlAccordion,
  DlAlertDialog,
  DlAvatar,
  DlBadge,
  DlButton,
  DlCard,
  DlCheckbox,
  DlCollapsible,
  DlEditable,
  DlIconButton,
  DlPopover,
  DlProgress,
  DlRating,
  DlScrollArea,
  DlSeparator,
  DlTabs,
  DlTooltip,
  type DlAccordionItem,
  type DlTabItem,
} from '@dragon-liquid/vue'
import { formatLabels, statusLabels } from '../demo.data'
import { useArchiveDemo } from '../useArchiveDemo'

const { selectedItem, favoriteIds, toggleFavorite, updateItem, notify } = useArchiveDemo()
const activeTab = ref('overview')
const staffOpen = ref(false)
const deleteOpen = ref(false)
const draftTitle = ref(selectedItem.value.title)
const notifyNextEpisode = ref(true)

watch(() => selectedItem.value.id, () => { draftTitle.value = selectedItem.value.title })

const tabs: DlTabItem[] = [
  { value: 'overview', label: '概览' },
  { value: 'episodes', label: '剧集' },
  { value: 'notes', label: '笔记' },
]
const sections: DlAccordionItem[] = [
  { value: 'story', title: '故事与主题', description: '不包含关键剧透', content: '旅途不以胜利作为终点，而是从“理解过去”重新开始。作品用细小事件建立时间尺度与人物关系。' },
  { value: 'visual', title: '视听语言', description: '镜头、音乐与制作信息', content: '克制的镜头运动与环境声共同构成安静的观看节奏，动作段落则保持清晰的空间关系。' },
  { value: 'collection', title: '收藏记录', description: '本地数据与观看历史', content: `首次收录于 2024 年，最近更新：${selectedItem.value.updatedAt}。` },
]
const progressPercent = computed(() => Math.round(selectedItem.value.watched / selectedItem.value.episodes * 100))

function saveTitle(value?: string | null) {
  if (!value?.trim()) return
  updateItem(selectedItem.value.id, { title: value.trim() })
  notify('标题已更新', '收藏库中的卡片会同步显示新标题。')
}

function changeProgress(step: number) {
  const watched = Math.max(0, Math.min(selectedItem.value.episodes, selectedItem.value.watched + step))
  updateItem(selectedItem.value.id, { watched, status: watched === selectedItem.value.episodes ? 'completed' : 'watching' })
  notify('观看进度已保存', `${watched} / ${selectedItem.value.episodes} 话`, 'accent')
}
</script>

<template>
  <section class="pattern-view detail-page">
    <div class="detail-breadcrumb"><a href="/patterns/library">收藏库</a><span>/</span><b>{{ selectedItem.title }}</b></div>

    <div class="detail-hero">
      <div class="detail-poster" :style="{ '--cover-accent': selectedItem.accent }"><span>{{ selectedItem.title.slice(0, 1) }}</span><small>{{ selectedItem.originalTitle }}</small></div>
      <div class="detail-hero-content">
        <div class="archive-card-meta"><DlBadge tone="success">{{ statusLabels[selectedItem.status] }}</DlBadge><span>{{ selectedItem.year }} · {{ formatLabels[selectedItem.format] }}</span></div>
        <DlEditable v-model="draftTitle" activation-mode="dblclick" submit-mode="both" @submit="saveTitle" />
        <p class="detail-original">{{ selectedItem.originalTitle }}</p>
        <p class="detail-summary">{{ selectedItem.summary }}</p>
        <div class="detail-rating"><DlRating :model-value="selectedItem.rating" :step="0.1" readonly /><b>{{ selectedItem.rating }}</b><span>个人评分</span></div>
        <div class="pattern-actions">
          <a href="/patterns/editor"><DlButton variant="primary">编辑完整资料</DlButton></a>
          <DlButton variant="secondary" @click="toggleFavorite(selectedItem.id)">{{ favoriteIds.includes(selectedItem.id) ? '取消收藏' : '加入收藏' }}</DlButton>
          <DlTooltip text="删除属于高风险操作，会先二次确认"><DlIconButton label="删除记录" variant="danger" @click="deleteOpen = true">⌫</DlIconButton></DlTooltip>
        </div>
      </div>
    </div>

    <div class="detail-layout">
      <main>
        <DlTabs v-model="activeTab" :items="tabs">
          <template #tab-overview>
            <div class="detail-tab-content">
              <DlAccordion :items="sections" collapsible />
              <DlCollapsible v-model:open="staffOpen" title="制作人员" description="按需展开次要资料，避免主页面过载">
                <div class="staff-list"><span><b>动画制作</b>{{ selectedItem.studio }}</span><span><b>条目维护</b>Dragon Archive Team</span><span><b>最近同步</b>{{ selectedItem.updatedAt }}</span></div>
              </DlCollapsible>
            </div>
          </template>
          <template #tab-episodes>
            <DlScrollArea class="episode-scroll">
            <div class="episode-list">
              <article v-for="episode in Math.min(selectedItem.episodes, 8)" :key="episode" :class="{ watched: episode <= selectedItem.watched }">
                <span>{{ String(episode).padStart(2, '0') }}</span><div><b>第 {{ episode }} 话</b><small>{{ episode <= selectedItem.watched ? '已观看' : '尚未观看' }}</small></div><DlBadge :tone="episode <= selectedItem.watched ? 'success' : 'muted'" size="sm">{{ episode <= selectedItem.watched ? 'DONE' : 'TODO' }}</DlBadge>
              </article>
            </div>
            </DlScrollArea>
          </template>
          <template #tab-notes>
            <div class="notes-preview"><small>COLLECTION NOTE</small><h3>时间并不只意味着遗忘</h3><p>这一页只展示阅读结果；完整的结构化笔记在编辑工作台中通过 DlMdx 维护。</p><a href="/patterns/editor"><DlButton variant="secondary">打开笔记编辑器</DlButton></a></div>
          </template>
        </DlTabs>
      </main>

      <aside class="detail-sidebar">
        <DlCard padding="lg">
          <small>WATCH PROGRESS</small><div class="detail-progress-value"><b>{{ progressPercent }}%</b><span>{{ selectedItem.watched }} / {{ selectedItem.episodes }} 话</span></div>
          <DlProgress :model-value="selectedItem.watched" :max="selectedItem.episodes" tone="accent" />
          <div class="progress-actions"><DlButton variant="secondary" size="sm" :disabled="selectedItem.watched === 0" @click="changeProgress(-1)">上一话</DlButton><DlButton size="sm" variant="primary" :disabled="selectedItem.watched === selectedItem.episodes" @click="changeProgress(1)">完成一话</DlButton></div>
        </DlCard>
        <DlCard padding="lg">
          <small>CURATOR</small><div class="curator"><DlAvatar fallback="DL" size="lg" /><div><b>Dragon Archivist</b><span>最后整理 {{ selectedItem.updatedAt }}</span></div></div>
          <DlSeparator />
          <DlCheckbox v-model="notifyNextEpisode" label="新剧集提醒" description="此设置只保存在当前浏览器演示状态中" />
        </DlCard>
        <DlPopover title="标签含义" side="left" tone="muted">
          <template #trigger><DlButton variant="secondary" block>查看标签说明</DlButton></template>
          <div class="tag-explanation"><span v-for="tag in selectedItem.tags" :key="tag"><b>#{{ tag }}</b>由收藏维护者添加的内容索引</span></div>
        </DlPopover>
      </aside>
    </div>

    <DlAlertDialog v-model:open="deleteOpen" title="移除收藏记录？" description="演示站不会真正删除数据，但这里展示不可逆操作的固定确认语法。" confirm-label="确认移除" @confirm="deleteOpen = false; notify('演示操作已拦截', '静态演示不会删除种子数据。', 'warning')" />
  </section>
</template>
