<script setup lang="ts">
import { computed, ref, shallowRef } from 'vue'
import {
  CalendarDate,
  DlAlertDialog,
  DlAutocomplete,
  DlBadge,
  DlButton,
  DlCard,
  DlCheckbox,
  DlColorSwatchPicker,
  DlCombobox,
  DlDatePicker,
  DlDialog,
  DlDrawer,
  DlInputText,
  DlLabel,
  DlNumberField,
  DlPathPicker,
  DlPopover,
  DlRadioGroup,
  DlRating,
  DlSelect,
  DlSlider,
  DlSwitch,
  DlTagsInput,
  DlTextarea,
  DlTooltip,
  type DlChoiceOption,
  type DlPathNode,
  type DlPathValue,
  type DlRadioOption,
  type DlSelectOption,
} from '@dragon-liquid/vue'
import type { ArchiveFormat, ArchiveItem, ArchiveStatus } from '../demo.types'
import { useArchiveDemo } from '../useArchiveDemo'

const { items, addItem, notify } = useArchiveDemo()
const title = ref('')
const originalTitle = ref('')
const summary = ref('')
const studio = ref('')
const format = ref<ArchiveFormat>('tv')
const status = ref<ArchiveStatus>('planned')
const episodes = ref(12)
const ratingRange = ref([4])
const tags = ref<string[]>([])
const catalogPaths = ref<DlPathValue[]>([])
const accent = ref('#9ad6bf')
const releaseDate = shallowRef(new CalendarDate(2026, 10, 1))
const sourceLanguage = ref('ja')
const hasRights = ref(false)
const createAnother = ref(true)
const submitted = ref(false)
const previewOpen = ref(false)
const discardOpen = ref(false)
const helpOpen = ref(false)

const rating = computed({
  get: () => ratingRange.value[0] ?? 0,
  set: value => { ratingRange.value = [value] },
})
const titleStatus = computed<'default' | 'success' | 'warning' | 'error'>(() => {
  if (!submitted.value && !title.value) return 'default'
  if (!title.value.trim()) return 'error'
  if (items.value.some(item => item.title.toLocaleLowerCase() === title.value.trim().toLocaleLowerCase())) return 'warning'
  return 'success'
})
const summaryStatus = computed<'default' | 'success' | 'warning'>(() => {
  if (!summary.value) return 'default'
  return summary.value.length < 24 ? 'warning' : 'success'
})
const canSubmit = computed(() => Boolean(title.value.trim() && summary.value.trim() && studio.value.trim() && hasRights.value))

const formatOptions: DlChoiceOption[] = [
  { value: 'tv', label: 'TV 动画', description: '按剧集维护观看进度' },
  { value: 'movie', label: '剧场版', description: '以单部电影形式归档' },
  { value: 'ova', label: 'OVA / OAD', description: '独立发行的附加篇章' },
]
const statusOptions: DlRadioOption[] = [
  { value: 'planned', label: '想看', description: '加入待看清单' },
  { value: 'watching', label: '追看中', description: '立即开始记录进度' },
  { value: 'completed', label: '已完成', description: '作为已看作品归档' },
]
const languageOptions: DlSelectOption[] = [
  { value: 'ja', label: '日语', description: '保留日文原名与罗马字' },
  { value: 'zh', label: '中文' },
  { value: 'en', label: '英语' },
]
const studioSuggestions = ['Madhouse', 'Kyoto Animation', 'CloverWorks', 'TRIGGER', 'Bones', 'Science SARU']
const themeColors = ['#9ad6bf', '#e4b76a', '#8fb9e8', '#ef9fbd', '#78c59e', '#c9a9e8']
const archiveCategories: DlPathNode[] = [
  {
    value: 'animation', label: '动画', selectable: false, children: [
      { value: 'series', label: '系列作品', selectable: false, children: [{ value: 'tv', label: 'TV 动画' }, { value: 'web', label: '网络动画' }] },
      { value: 'film', label: '电影作品', selectable: false, children: [{ value: 'theatrical', label: '剧场版' }] },
    ],
  },
  {
    value: 'special', label: '特别发行', selectable: false, children: [
      { value: 'disc', label: '实体发行', selectable: false, children: [{ value: 'ova', label: 'OVA / OAD' }] },
    ],
  },
]

function resetForm() {
  title.value = ''
  originalTitle.value = ''
  summary.value = ''
  studio.value = ''
  format.value = 'tv'
  status.value = 'planned'
  episodes.value = 12
  ratingRange.value = [4]
  tags.value = []
  catalogPaths.value = []
  hasRights.value = false
  submitted.value = false
}

function openPreview() {
  submitted.value = true
  if (!canSubmit.value) {
    notify('还有必填内容未完成', '请检查标题、简介、制作公司和资料授权确认。', 'warning')
    return
  }
  previewOpen.value = true
}

function createRecord() {
  const id = `${title.value.trim().toLocaleLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')}-${Date.now()}`
  const item: ArchiveItem = {
    id,
    title: title.value.trim(),
    originalTitle: originalTitle.value.trim() || title.value.trim(),
    summary: summary.value.trim(),
    year: releaseDate.value.year,
    format: format.value,
    status: status.value,
    episodes: Math.max(1, episodes.value),
    watched: status.value === 'completed' ? Math.max(1, episodes.value) : 0,
    rating: rating.value,
    tags: [...tags.value],
    studio: studio.value.trim(),
    accent: accent.value,
    updatedAt: '刚刚创建',
  }
  addItem(item)
  previewOpen.value = false
  notify('收藏记录已创建', `${item.title} 已进入收藏库，并成为当前选中作品。`, 'success')
  if (createAnother.value) resetForm()
  else {
    window.history.pushState({}, '', '/patterns/detail')
    window.dispatchEvent(new PopStateEvent('popstate'))
  }
}
</script>

<template>
  <section class="pattern-view create-page">
    <div class="demo-page-heading">
      <div><small>COMPOSE · VALIDATE · PREVIEW</small><h1>创建动漫收藏记录</h1><p>把输入、选择、校验、浮层预览和提交反馈组合成一条可复用的完整表单流程。</p></div>
      <div class="demo-heading-actions">
        <DlBadge :tone="canSubmit ? 'success' : 'warning'" variant="outline">{{ canSubmit ? 'READY' : 'DRAFT' }}</DlBadge>
        <DlButton variant="secondary" @click="helpOpen = true">填写指南</DlButton>
      </div>
    </div>

    <div class="create-layout">
      <main>
        <DlCard class="create-form" padding="lg">
          <section>
            <header><span>01</span><div><small>IDENTITY</small><h2>基础识别信息</h2></div></header>
            <div class="create-grid">
              <div class="form-field">
                <DlLabel for="create-title">中文标题 *</DlLabel>
                <DlInputText id="create-title" v-model="title" :status="titleStatus" placeholder="例如：葬送的芙莉莲">
                  <template #leading>⌕</template><template #trailing><DlBadge v-if="titleStatus !== 'default'" :tone="titleStatus === 'error' ? 'danger' : titleStatus">{{ titleStatus }}</DlBadge></template>
                </DlInputText>
                <small v-if="titleStatus === 'error'" class="field-message field-message--error">标题不能为空。</small>
                <small v-else-if="titleStatus === 'warning'" class="field-message field-message--warning">收藏库中已有同名作品，可以继续创建不同版本。</small>
              </div>
              <div class="form-field"><DlLabel for="create-original">原始标题</DlLabel><DlInputText id="create-original" v-model="originalTitle" placeholder="Sousou no Frieren" /></div>
              <div class="form-field"><DlLabel>制作公司 *</DlLabel><DlAutocomplete v-model="studio" :suggestions="studioSuggestions" placeholder="输入或选择制作公司" /></div>
              <div class="form-field"><DlLabel>原始语言</DlLabel><DlSelect v-model="sourceLanguage" :options="languageOptions" /></div>
            </div>
          </section>

          <section>
            <header><span>02</span><div><small>CLASSIFICATION</small><h2>分类与观看状态</h2></div></header>
            <div class="create-grid">
              <div class="form-field"><DlLabel>作品形式</DlLabel><DlCombobox v-model="format" :options="formatOptions" placeholder="选择作品形式" /></div>
              <div class="form-field"><DlLabel>总集数</DlLabel><DlNumberField v-model="episodes" :min="1" :max="999" /></div>
              <div class="form-field create-span"><DlLabel>初始观看状态</DlLabel><DlRadioGroup v-model="status" :options="statusOptions" orientation="horizontal" /></div>
              <div class="form-field create-span"><DlLabel>归档路径</DlLabel><DlPathPicker v-model="catalogPaths" :items="archiveCategories" :level-labels="['内容大类', '发行分类', '具体形式']" label="选择归档位置" description="展开路径和加入选择分开操作，结果保留完整上下文。" /></div>
              <div class="form-field create-span"><DlLabel>检索标签</DlLabel><DlTagsInput v-model="tags" :max="8" placeholder="输入标签后回车" /></div>
            </div>
          </section>

          <section>
            <header><span>03</span><div><small>EDITORIAL</small><h2>简介、评分与视觉标识</h2></div></header>
            <div class="form-field"><DlLabel for="create-summary">内容简介 *</DlLabel><DlTextarea id="create-summary" v-model="summary" :status="summaryStatus" placeholder="说明故事前提、人物关系和作品气质……" /><small class="field-message">{{ summary.length }} 字 · 建议至少 24 字</small></div>
            <div class="create-grid create-editorial-grid">
              <div class="form-field"><DlLabel>个人评分</DlLabel><DlSlider v-model="ratingRange" :min="0" :max="5" :step="0.5" show-value /><DlRating v-model="rating" :step="0.5" /></div>
              <div class="form-field"><DlLabel>首播日期</DlLabel><DlDatePicker v-model="releaseDate" /></div>
              <div class="form-field create-span"><DlLabel>封面强调色</DlLabel><DlColorSwatchPicker v-model="accent" :colors="themeColors" /></div>
            </div>
          </section>

          <section class="create-consent">
            <DlCheckbox v-model="hasRights" label="我确认资料可用于当前本地收藏" description="必选校验：静态演示不会上传图片或文字。" />
            <div><span><b>创建后继续录入</b><small>关闭后将直接进入新作品详情页</small></span><DlSwitch v-model="createAnother" /></div>
          </section>
        </DlCard>
      </main>

      <aside class="create-aside">
        <DlCard padding="lg"><small>LIVE PREVIEW</small><div class="create-cover-preview" :style="{ '--cover-accent': accent }"><span>{{ title.slice(0, 1) || '新' }}</span><small>{{ originalTitle || 'ORIGINAL TITLE' }}</small></div><h3>{{ title || '尚未填写标题' }}</h3><p>{{ summary || '简介会在这里形成即时预览，便于提交前检查内容密度。' }}</p><div class="archive-tags"><span v-for="tag in tags" :key="tag">#{{ tag }}</span><span v-if="!tags.length">#待添加标签</span></div></DlCard>
        <DlPopover title="为什么需要预览？" side="left" tone="muted"><template #trigger><DlButton variant="secondary" block>表单设计说明</DlButton></template><p class="create-popover-copy">主表单负责编辑，右侧只读卡负责连续反馈，Dialog 则承担最终确认；三个层级不会争夺同一个任务。</p></DlPopover>
      </aside>
    </div>

    <div class="create-footer">
      <span>必填字段使用状态边框与文本共同反馈，不只依赖颜色。</span>
      <div><DlButton variant="danger" @click="discardOpen = true">放弃草稿</DlButton><DlTooltip text="先校验字段，再打开确认预览" tone="accent"><DlButton variant="primary" @click="openPreview">预览并创建</DlButton></DlTooltip></div>
    </div>

    <DlDialog v-model:open="previewOpen" title="确认创建收藏记录" description="Dialog 内继续包含 Select 与 Popover，用于验证嵌套浮层始终高于模态内容。" tone="accent" size="lg">
      <div class="create-dialog-preview">
        <div class="create-cover-preview" :style="{ '--cover-accent': accent }"><span>{{ title.slice(0, 1) }}</span></div>
        <div><DlBadge tone="success">{{ status }}</DlBadge><h3>{{ title }}</h3><p>{{ summary }}</p><div class="settings-grid"><div class="form-field"><DlLabel>提交前调整语言</DlLabel><DlSelect v-model="sourceLanguage" :options="languageOptions" /></div><div class="form-field"><DlLabel>提交说明</DlLabel><DlPopover title="数据去向" tone="success"><template #trigger><DlButton variant="secondary">查看本地写入范围</DlButton></template><p class="create-popover-copy">确认后只写入 useArchiveDemo 的共享内存，并同步到收藏库和详情页。</p></DlPopover></div></div></div>
      </div>
      <template #footer><DlButton variant="secondary" @click="previewOpen = false">返回修改</DlButton><DlButton variant="primary" @click="createRecord">确认创建</DlButton></template>
    </DlDialog>

    <DlAlertDialog v-model:open="discardOpen" title="放弃当前草稿？" description="输入内容会恢复为空白状态，此操作不能撤销。" confirm-label="确认放弃" @confirm="resetForm(); discardOpen = false; notify('草稿已清空', '可以重新开始创建收藏记录。', 'muted')" />

    <DlDrawer v-model:open="helpOpen" title="高质量收藏资料指南" description="在不中断表单上下文的情况下查看辅助信息" placement="right" size="md" tone="muted">
      <div class="create-help"><section><b>标题</b><p>优先使用常见中文译名，原名独立保存以便检索。</p></section><section><b>简介</b><p>描述故事前提和作品气质，避免关键剧透与评价性结论。</p></section><section><b>标签</b><p>使用题材、叙事和观看体验三个维度，保持 3–6 个最容易复用。</p></section></div>
      <template #footer><DlButton variant="primary" @click="helpOpen = false">继续填写</DlButton></template>
    </DlDrawer>
  </section>
</template>
