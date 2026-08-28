<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, shallowRef } from 'vue'
import {
  CalendarDate,
  Time,
  DlAlertDialog,
  DlBadge,
  DlButton,
  DlCalendar,
  DlCard,
  DlCheckbox,
  DlChoicePortal,
  DlCollapsible,
  DlColorArea,
  DlColorField,
  DlColorPicker,
  DlColorSlider,
  DlColorSwatch,
  DlColorSwatchPicker,
  DlDateField,
  DlDatePicker,
  DlDateRangeField,
  DlDateRangePicker,
  DlLabel,
  DlMonthPicker,
  DlMonthRangePicker,
  DlMultiChoice,
  DlNumberField,
  DlPinInput,
  DlRadioGroup,
  DlRangeCalendar,
  DlSelect,
  DlSegmented,
  DlSeparator,
  DlSwitch,
  DlTabs,
  DlTimeField,
  DlTimePicker,
  DlTimeRangeField,
  DlYearPicker,
  DlYearRangePicker,
  type DateRange,
  type DlRadioOption,
  type DlChoicePortalEntry,
  type DlMultiChoiceEntry,
  type DlChoiceOption,
  type DlSelectOption,
  type DlTabItem,
} from '@dragon-liquid/vue'
import { useArchiveDemo } from '../useArchiveDemo'

const { settings, view, notify } = useArchiveDemo()
const tab = ref('appearance')
const reminderTime = shallowRef(new Time(20, 30))
const reminderPicker = shallowRef(new Time(20, 30))
const contentSource = ref('all')
const enabledSources = ref(['local', 'bangumi', 'anilist'])
const digestFrequency = ref('weekly')
const digestDate = shallowRef(new CalendarDate(2026, 8, 9))
const calendarDate = ref('2026-08-09')
const calendarView = ref('2026-08')
const calendarItems = ref([
  { id: 'digest', date: '2026-08-09', title: '每周摘要', color: '#71d1ad' },
  { id: 'archive', date: '2026-08-18', title: '月度归档', color: '#e4b76a' },
])
const reportRange = shallowRef<DateRange>({ start: new CalendarDate(2026, 8, 1), end: new CalendarDate(2026, 8, 31) })
const monthValue = shallowRef(new CalendarDate(2026, 8, 1))
const monthRange = shallowRef<DateRange>({ start: new CalendarDate(2026, 7, 1), end: new CalendarDate(2026, 9, 1) })
const yearValue = shallowRef(new CalendarDate(2026, 1, 1))
const yearRange = shallowRef<DateRange>({ start: new CalendarDate(2024, 1, 1), end: new CalendarDate(2026, 1, 1) })
const quietHours = shallowRef({ start: new Time(23, 0), end: new Time(7, 30) })
const accentColor = ref('#9ad6bf')
const cacheLimit = ref(512)
const pin = ref<string[]>([])
const protectChanges = ref(false)
const resetOpen = ref(false)

const tabs: DlTabItem[] = [
  { value: 'appearance', label: '外观与布局' },
  { value: 'behavior', label: '行为与提醒' },
  { value: 'schedule', label: '日期与归档' },
  { value: 'privacy', label: '本地数据' },
]
const componentGuideTabs: Record<string, string> = {
  label: 'appearance',
  'radio-group': 'appearance',
  separator: 'appearance',
  'color-swatch-picker': 'appearance',
  'color-field': 'appearance',
  'color-picker': 'appearance',
  collapsible: 'appearance',
  switch: 'appearance',
  'color-area': 'appearance',
  'color-slider': 'appearance',
  'color-swatch': 'appearance',
  'date-picker': 'behavior',
  'time-field': 'behavior',
  select: 'behavior',
  'choice-portal': 'behavior',
  'multi-choice': 'behavior',
  segmented: 'behavior',
  'time-picker': 'behavior',
  'date-field': 'schedule',
  'time-range-field': 'schedule',
  'date-range-picker': 'schedule',
  'date-range-field': 'schedule',
  calendar: 'schedule',
  'range-calendar': 'schedule',
  'month-picker': 'schedule',
  'month-range-picker': 'schedule',
  'year-picker': 'schedule',
  'year-range-picker': 'schedule',
  'number-field': 'privacy',
  checkbox: 'privacy',
  'pin-input': 'privacy',
  'alert-dialog': 'privacy',
}
const layoutOptions: DlRadioOption[] = [
  { value: 'grid', label: '卡片网格', description: '适合封面驱动的内容浏览' },
  { value: 'list', label: '紧凑列表', description: '同一屏幕展示更多元数据' },
]
const toneOptions: DlRadioOption[] = [
  { value: 'forest', label: '森林', description: 'Dragon Liquid 默认深绿色调' },
  { value: 'aurora', label: '极光', description: '更明显的青蓝边缘光' },
  { value: 'ember', label: '余烬', description: '偏温暖的琥珀色强调' },
]
const pageSizeOptions: DlSelectOption[] = [
  { value: '6', label: '每页 6 条' },
  { value: '12', label: '每页 12 条' },
  { value: '24', label: '每页 24 条' },
]
const contentSourceOptions: DlChoicePortalEntry[] = [
  { label: '本地内容', options: [
    { value: 'all', label: '全部收藏', description: '包含本地条目与已同步内容', keywords: ['全部', 'all'] },
    { value: 'watching', label: '正在观看', description: '只包含当前追看作品', keywords: ['追番', 'watching'] },
  ] },
  { label: '云端来源', options: [
    { value: 'bangumi', label: 'Bangumi', description: '使用 Bangumi 收藏目录', keywords: ['bgm'] },
    { value: 'anilist', label: 'AniList', description: '使用 AniList 媒体清单', keywords: ['al'] },
  ] },
]
const enabledSourceOptions: DlMultiChoiceEntry[] = [
  { label: '本地内容', options: [
    { value: 'local', label: '本地收藏', description: '浏览器内维护的收藏与进度', keywords: ['local'] },
    { value: 'history', label: '观看历史', description: '最近播放和暂停的记录', keywords: ['history'] },
  ] },
  { label: '同步服务', options: [
    { value: 'bangumi', label: 'Bangumi', description: '同步 Bangumi 收藏目录', keywords: ['bgm'] },
    { value: 'anilist', label: 'AniList', description: '同步 AniList 媒体清单', keywords: ['al'] },
  ] },
]
const digestFrequencyOptions: DlChoiceOption[] = [
  { value: 'daily', label: '每日' },
  { value: 'weekly', label: '每周' },
  { value: 'monthly', label: '每月' },
]

function saveSettings() {
  view.value = settings.defaultView
  notify('偏好设置已保存', '新的默认布局会同步到收藏库页面。')
}

function resetSettings() {
  Object.assign(settings, {
    compactCards: false,
    autoplayPreview: true,
    showAdultContent: false,
    defaultView: 'grid',
    weekStartsOn: 'monday',
    pageSize: '6',
    themeTone: 'forest',
  })
  resetOpen.value = false
  notify('已恢复默认设置', '演示状态已经重置。', 'warning')
}

function moveCalendarItem(item: { id: string }, day: { key: string }) {
  calendarItems.value = calendarItems.value.map(value => value.id === item.id ? { ...value, date: day.key } : value)
}

function handleGuideTabRequest(event: Event) {
  const value = (event as CustomEvent<{ value?: string }>).detail?.value
  if (value && tabs.some(item => item.value === value)) tab.value = value
}

onMounted(() => window.addEventListener('dl-guide-tab-request', handleGuideTabRequest))
onBeforeUnmount(() => window.removeEventListener('dl-guide-tab-request', handleGuideTabRequest))
</script>

<template>
  <section class="pattern-view settings-page" :data-guide-tabs="JSON.stringify(componentGuideTabs)">
    <div class="demo-page-heading">
      <div><small>PREFERENCE · PERSISTENCE · RESET</small><h1>应用偏好设置</h1><p>持续生效的选择集中管理；即时开关和提交型设置使用不同反馈方式。</p></div>
      <DlBadge tone="accent" variant="outline">LOCAL STATE</DlBadge>
    </div>

    <div class="settings-layout">
      <main>
        <DlTabs v-model="tab" :items="tabs" orientation="vertical">
          <template #tab-appearance>
            <div class="settings-section">
              <header><small>APPEARANCE</small><h2>外观与内容密度</h2><p>影响整个收藏工作台的长期视觉偏好。</p></header>
              <div class="settings-field"><DlLabel>默认收藏库布局</DlLabel><DlRadioGroup v-model="settings.defaultView" :options="layoutOptions" orientation="horizontal" /></div>
              <DlSeparator />
              <div class="settings-field"><DlLabel>界面氛围</DlLabel><DlRadioGroup v-model="settings.themeTone" :options="toneOptions" /></div>
              <div class="settings-field"><DlLabel>自定义强调色</DlLabel><DlColorSwatchPicker v-model="accentColor" :colors="['#9ad6bf', '#8fb9e8', '#e4b76a', '#ef9fbd', '#c9a9e8']" /><DlColorField v-model="accentColor" /></div>
              <div class="settings-field"><DlLabel>弹出式任意颜色</DlLabel><DlColorPicker v-model="accentColor" /></div>
              <DlCollapsible title="精细调整强调色" description="二维色域、色相通道和最终色样共同编辑一个颜色值">
                <div class="color-workbench"><DlColorArea v-model="accentColor" /><DlColorSlider v-model="accentColor" channel="hue" /><div class="color-result"><DlColorSwatch :color="accentColor" label="当前强调色" size="lg" /><span><b>{{ accentColor.toUpperCase() }}</b><small>全局预览同步更新</small></span></div></div>
              </DlCollapsible>
              <div class="setting-row"><div><b>紧凑卡片</b><span>减少封面间距与辅助信息</span></div><DlSwitch v-model="settings.compactCards" /></div>
            </div>
          </template>

          <template #tab-schedule>
            <div class="settings-section schedule-section">
              <header><small>DATE &amp; ARCHIVE</small><h2>日期、范围与归档周期</h2><p>字段负责精确键入，弹出选择器负责浏览，内联日历用于核心日期任务。</p></header>
              <div class="settings-grid"><div class="settings-field"><DlLabel>摘要日期字段</DlLabel><DlDateField v-model="digestDate" /></div><div class="settings-field"><DlLabel>免打扰时段</DlLabel><DlTimeRangeField v-model="quietHours" /></div></div>
              <div class="settings-grid"><div class="settings-field"><DlLabel>统计日期范围</DlLabel><DlDateRangePicker v-model="reportRange" /></div><div class="settings-field"><DlLabel>精确范围字段</DlLabel><DlDateRangeField v-model="reportRange" /></div></div>
              <DlCollapsible title="浏览月度日程" description="事项可在日期之间拖动，单元格内容过多时独立滚动">
                <DlCalendar v-model="calendarDate" v-model:view-value="calendarView" :items="calendarItems" height="420px" @item-drop="moveCalendarItem" />
              </DlCollapsible>
              <DlCollapsible title="选择连续日期" description="常驻范围选择器用于需要同时观察起止日期的任务">
                <DlRangeCalendar v-model="reportRange" />
              </DlCollapsible>
              <DlCollapsible title="选择月份周期" description="月度回顾与季度统计">
                <div class="schedule-picker-grid"><DlMonthPicker v-model="monthValue" /><DlMonthRangePicker v-model="monthRange" /></div>
              </DlCollapsible>
              <DlCollapsible title="选择年度归档" description="单一归档年与跨年度收藏范围">
                <div class="schedule-picker-grid"><DlYearPicker v-model="yearValue" /><DlYearRangePicker v-model="yearRange" /></div>
              </DlCollapsible>
            </div>
          </template>

          <template #tab-behavior>
            <div class="settings-section">
              <header><small>BEHAVIOR</small><h2>播放与提醒</h2><p>开关项立即生效，日期和时间组成下一次摘要计划。</p></header>
              <div class="setting-row"><div><b>自动播放静音预览</b><span>鼠标悬停封面后播放短预览</span></div><DlSwitch v-model="settings.autoplayPreview" /></div>
              <div class="setting-row"><div><b>显示成人内容</b><span>仍会保留内容分级与二次确认</span></div><DlSwitch v-model="settings.showAdultContent" /></div>
              <DlSeparator />
              <div class="settings-grid"><div class="settings-field"><DlLabel>每周摘要日期</DlLabel><DlDatePicker v-model="digestDate" /></div><div class="settings-field"><DlLabel>提醒时间</DlLabel><DlTimeField v-model="reminderTime" /></div></div>
              <div class="settings-grid"><div class="settings-field"><DlLabel>内容来源</DlLabel><DlChoicePortal v-model="contentSource" :options="contentSourceOptions" searchable clearable placeholder="选择收藏来源" /></div><div class="settings-field"><DlLabel>触控提醒时间</DlLabel><DlTimePicker v-model="reminderPicker" :minute-step="5" shortcut-value="20:30" shortcut-label="晚间摘要" clearable /></div></div>
              <div class="settings-grid"><div class="settings-field"><DlLabel>摘要包含来源</DlLabel><DlMultiChoice v-model="enabledSources" :options="enabledSourceOptions" searchable clearable :max-tag-count="2" placeholder="选择多个内容来源" /></div><div class="settings-field"><DlLabel>摘要频率</DlLabel><DlSegmented v-model="digestFrequency" :items="digestFrequencyOptions" block /></div></div>
              <div class="settings-field"><DlLabel>收藏库分页</DlLabel><DlSelect v-model="settings.pageSize" :options="pageSizeOptions" /></div>
            </div>
          </template>

          <template #tab-privacy>
            <div class="settings-section">
              <header><small>LOCAL DATA</small><h2>本地数据与保护</h2><p>演示站没有账号和服务器，所有选项只影响浏览器内存。</p></header>
              <div class="settings-field"><DlLabel>本地封面缓存上限（MB）</DlLabel><DlNumberField v-model="cacheLimit" :min="64" :max="2048" :step="64" /></div>
              <DlCheckbox v-model="protectChanges" data-guide-opens="pin-input" label="重要设置需要 PIN 确认" description="展示固定长度敏感输入与设置项之间的联动" />
              <div v-if="protectChanges" class="settings-field"><DlLabel>设置四位本地 PIN</DlLabel><DlPinInput v-model="pin" :length="4" mask /></div>
              <DlSeparator label="危险区域" />
              <DlCard class="danger-setting" padding="md"><div><b>恢复全部默认设置</b><span>重置当前演示会话中的界面偏好</span></div><DlButton variant="danger" data-guide-opens="alert-dialog" @click="resetOpen = true">恢复默认</DlButton></DlCard>
            </div>
          </template>
        </DlTabs>
      </main>

      <aside>
        <DlCard padding="lg"><small>LIVE PREVIEW</small><div class="settings-preview" :style="{ '--preview-accent': accentColor }"><span>葬</span><div><b>葬送的芙莉莲</b><small>{{ settings.defaultView === 'grid' ? '卡片网格' : '紧凑列表' }} · {{ settings.themeTone }}</small></div></div><ul><li>每页 {{ settings.pageSize }} 条</li><li>预览{{ settings.autoplayPreview ? '自动播放' : '手动播放' }}</li><li>摘要 {{ digestDate.toString() }} {{ reminderTime.toString() }}</li></ul></DlCard>
        <DlButton variant="primary" block @click="saveSettings">保存全部偏好</DlButton>
      </aside>
    </div>

    <DlAlertDialog v-model:open="resetOpen" title="恢复默认设置？" description="这会清除当前演示会话中的全部偏好，但不会影响收藏数据。" tone="warning" confirm-label="确认恢复" @confirm="resetSettings" />
  </section>
</template>
