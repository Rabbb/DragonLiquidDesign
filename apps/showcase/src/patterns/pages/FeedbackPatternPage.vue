<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import {
  DlAlertDialog,
  DlBadge,
  DlButton,
  DlCard,
  DlDialog,
  DlDrawer,
  DlIconButton,
  DlPopover,
  DlProgress,
  DlSelect,
  DlSeparator,
  DlSplitButton,
  DlToast,
  DlToggleGroup,
  DlTooltip,
  type DlChoiceOption,
  type DlComponentEventSubscription,
  type DlComponentRef,
  type DlMenuItem,
  type DlPropertyChangeEvent,
  type DlSelectOption,
  type DlTone,
} from '@dragon-liquid/vue'

const tones: DlTone[] = ['default', 'accent', 'success', 'warning', 'danger', 'muted']
const toneLabels: Record<DlTone, string> = {
  default: '默认信息', accent: '重点动作', success: '任务成功', warning: '需要注意', danger: '操作失败', muted: '静默摘要',
}
const toneDescriptions: Record<DlTone, string> = {
  default: '不带强烈倾向的普通状态。',
  accent: '与当前主任务直接相关的高优先级信息。',
  success: '操作已经完成，不需要用户继续补救。',
  warning: '流程仍可继续，但用户需要理解潜在影响。',
  danger: '任务失败或动作具有不可逆风险。',
  muted: '可以稍后阅读、不应打断当前工作的辅助信息。',
}
const dialogOpen = ref(false)
const dialogTone = ref<DlTone>('accent')
const dialogSize = ref<'sm' | 'md' | 'lg'>('md')
const drawerOpen = ref(false)
const drawerTone = ref<DlTone>('default')
const drawerPlacement = ref<'bottom' | 'top' | 'left' | 'right'>('right')
const alertTone = ref<'warning' | 'danger'>('warning')
const alertOpen = ref(false)
const toastOpen = ref(false)
const toastTone = ref<DlTone>('success')
const toastProgress = ref(100)
const syncStrategy = ref('merge')
const instanceButton = ref<DlComponentRef | null>(null)
const instanceLogs = ref<string[]>([])
let stopPropertyChange: DlComponentEventSubscription | undefined

const placementOptions: DlChoiceOption[] = [
  { value: 'right', label: '右侧' }, { value: 'left', label: '左侧' }, { value: 'bottom', label: '底部' }, { value: 'top', label: '顶部' },
]
const strategyOptions: DlSelectOption[] = [
  { value: 'merge', label: '自动合并', description: '保留本地编辑内容' },
  { value: 'remote', label: '使用远端版本' },
  { value: 'local', label: '保留本地版本' },
]
const taskActions: DlMenuItem[] = [
  { value: 'retry', label: '仅重试失败任务' },
  { value: 'clear', label: '清理已完成记录' },
]
const tasks = [
  { title: '收藏元数据同步', helper: '后台任务正在继续', value: null, tone: 'default' as DlTone, status: 'default' as const },
  { title: '封面资源生成', helper: '高优先级当前任务', value: 62, tone: 'accent' as DlTone, status: 'default' as const },
  { title: '索引构建完成', helper: '65 个组件已写入索引', value: 100, tone: 'success' as DlTone, status: 'success' as const },
  { title: '来源响应缓慢', helper: '任务仍在重试', value: 48, tone: 'warning' as DlTone, status: 'warning' as const },
  { title: '图片校验中断', helper: '需要重新选择文件', value: 31, tone: 'danger' as DlTone, status: 'danger' as const },
  { title: '历史日志压缩', helper: '无需持续关注', value: 78, tone: 'muted' as DlTone, status: 'default' as const },
]

function showToast(tone: DlTone) {
  toastOpen.value = false
  toastTone.value = tone
  toastProgress.value = tone === 'warning' ? 64 : tone === 'danger' ? 22 : 100
  window.setTimeout(() => { toastOpen.value = true }, 20)
}

function showDialog(tone: DlTone) {
  dialogTone.value = tone
  dialogOpen.value = true
}

function showDrawer(tone: DlTone) {
  drawerTone.value = tone
  drawerOpen.value = true
}

function showAlert(tone: 'warning' | 'danger') {
  alertTone.value = tone
  alertOpen.value = true
}

function connectInstance(instance: DlComponentRef) {
  stopPropertyChange?.()
  instanceButton.value = instance
  stopPropertyChange = instance.on('propertyChange', (event: DlPropertyChangeEvent) => {
    instanceLogs.value.unshift(`${event.name}: ${String(event.previousValue)} → ${String(event.value)}`)
  })
}

function runInstanceSequence() {
  instanceButton.value?.setProperties({ loading: true, variant: 'primary' })
  window.setTimeout(() => instanceButton.value?.setProperty('loading', false), 720)
}

function resetInstanceSequence() {
  instanceButton.value?.resetProperties()
  instanceLogs.value = []
}

onBeforeUnmount(() => stopPropertyChange?.())
</script>

<template>
  <section class="pattern-view feedback-page">
    <div class="demo-page-heading">
      <div><small>FEEDBACK · LAYERS · RECOVERY</small><h1>任务与通知中心</h1><p>同一套语义贯穿徽标、进度、提示、气泡、对话框、抽屉和 Toast；每种色调都对应明确业务含义。</p></div>
      <DlBadge tone="success" variant="outline">6 TONES · ALL INTERACTIVE</DlBadge>
    </div>

    <div class="feedback-summary-grid">
      <DlCard v-for="tone in tones" :key="tone" padding="md" class="tone-summary-card">
        <div><DlBadge :tone="tone">{{ tone }}</DlBadge><b>{{ toneLabels[tone] }}</b></div>
        <p>{{ toneDescriptions[tone] }}</p>
        <DlProgress :model-value="tone === 'muted' ? null : tones.indexOf(tone) * 15 + 22" :tone="tone" size="sm" />
      </DlCard>
    </div>

    <div class="feedback-layout">
      <main>
        <DlCard class="feedback-section" padding="lg">
          <header><div><small>BACKGROUND TASKS</small><h2>进度与任务状态</h2></div><DlBadge tone="muted" variant="outline">DETERMINATE + INDETERMINATE</DlBadge></header>
          <div class="feedback-task-list">
            <article v-for="task in tasks" :key="task.title">
              <DlProgress :model-value="task.value" :label="task.title" :helper="task.helper" :tone="task.tone" :status="task.status" show-value />
              <DlTooltip :tone="task.tone" :title="toneLabels[task.tone]" :text="toneDescriptions[task.tone]"><DlIconButton label="查看任务语义" variant="ghost" size="sm">?</DlIconButton></DlTooltip>
            </article>
          </div>
        </DlCard>

        <DlCard class="feedback-section" padding="lg">
          <header><div><small>TRANSIENT FEEDBACK</small><h2>Toast 全部色调</h2></div><span>单击按钮触发真实通知</span></header>
          <div class="tone-action-grid"><DlButton v-for="tone in tones" :key="tone" :variant="tone === 'danger' ? 'danger' : tone === 'accent' ? 'primary' : 'secondary'" @click="showToast(tone)">{{ toneLabels[tone] }}</DlButton><DlSplitButton label="执行全部" variant="primary" :items="taskActions" menu-label="批量任务操作" @click="showToast('accent')" @select="showToast($event === 'retry' ? 'warning' : 'muted')" /></div>
        </DlCard>

        <DlCard class="feedback-section" padding="lg">
          <header><div><small>CONTEXTUAL LAYERS</small><h2>Tooltip 与 Popover 全部色调</h2></div><span>悬停看短提示，单击看富内容</span></header>
          <div class="feedback-overlay-grid">
            <article v-for="tone in tones" :key="tone">
              <DlTooltip :tone="tone" :title="toneLabels[tone]" :text="toneDescriptions[tone]" side="top"><DlButton variant="secondary">悬停 · {{ tone }}</DlButton></DlTooltip>
              <DlPopover :tone="tone" :title="toneLabels[tone]" align="start">
                <template #trigger><DlButton variant="secondary">单击 · {{ tone }}</DlButton></template>
                <div class="feedback-popover"><DlBadge :tone="tone">{{ tone }}</DlBadge><p>{{ toneDescriptions[tone] }}</p><DlButton variant="secondary" size="sm">查看关联任务</DlButton></div>
              </DlPopover>
            </article>
          </div>
        </DlCard>

        <DlCard class="feedback-section" padding="lg">
          <header><div><small>MANAGED INSTANCE</small><h2>声明式事件与实例控制</h2></div><a href="/instance-api">阅读核心逻辑 →</a></header>
          <div class="instance-demo-row">
            <DlButton ref="instanceButton" variant="secondary" @ready="connectInstance">受管任务按钮</DlButton>
            <DlButton variant="primary" @click="runInstanceSequence">实例启动加载</DlButton>
            <DlButton variant="secondary" @click="instanceButton?.disable()">实例禁用</DlButton>
            <DlButton variant="secondary" @click="resetInstanceSequence">释放覆盖</DlButton>
          </div>
          <pre class="feedback-instance-log">{{ instanceLogs.join('\n') || '等待 propertyChange 事件…' }}</pre>
        </DlCard>
      </main>

      <aside class="feedback-controls">
        <DlCard padding="lg">
          <small>MODAL SCENARIOS</small><h3>Dialog 色调与尺寸</h3>
          <div class="feedback-control-stack"><DlButton v-for="tone in tones" :key="tone" :variant="tone === 'danger' ? 'danger' : tone === 'accent' ? 'primary' : 'secondary'" @click="showDialog(tone)">{{ tone }}</DlButton></div>
          <DlSeparator label="尺寸" />
          <div class="feedback-size-buttons"><DlButton v-for="size in (['sm', 'md', 'lg'] as const)" :key="size" variant="secondary" size="sm" @click="dialogSize = size; showDialog(dialogTone)">{{ size }}</DlButton></div>
        </DlCard>
        <DlCard padding="lg">
          <small>EDGE PANEL SCENARIOS</small><h3>Drawer 方向与色调</h3>
          <DlToggleGroup v-model="drawerPlacement" type="single" :items="placementOptions" />
          <div class="feedback-control-stack"><DlButton v-for="tone in tones" :key="tone" variant="secondary" @click="showDrawer(tone)">{{ toneLabels[tone] }}</DlButton></div>
        </DlCard>
        <DlCard padding="lg">
          <small>BLOCKING DECISION</small><h3>Alert Dialog 风险等级</h3>
          <DlButton variant="secondary" block @click="showAlert('warning')">可恢复警告</DlButton>
          <DlButton variant="danger" block @click="showAlert('danger')">不可逆删除</DlButton>
        </DlCard>
      </aside>
    </div>

    <DlDialog v-model:open="dialogOpen" :title="`${toneLabels[dialogTone]} · Dialog`" :description="toneDescriptions[dialogTone]" :tone="dialogTone" :size="dialogSize">
      <div class="feedback-dialog-body"><DlBadge :tone="dialogTone">{{ dialogTone }} · {{ dialogSize }}</DlBadge><p>这里同时打开 Select、Popover 和 Tooltip，验证它们在 Dialog 内仍按照 tooltip → popover → modal 的层级规则显示。</p><div class="form-field"><label>同步冲突策略</label><DlSelect v-model="syncStrategy" :options="strategyOptions" /></div><DlPopover title="嵌套 Popover" :tone="dialogTone"><template #trigger><DlButton variant="secondary">打开嵌套气泡</DlButton></template><DlTooltip text="Tooltip 应位于 Popover 上方" tone="accent"><DlButton variant="secondary" size="sm">继续悬停</DlButton></DlTooltip></DlPopover></div>
      <template #footer><DlButton variant="secondary" @click="dialogOpen = false">取消</DlButton><DlButton variant="primary" @click="dialogOpen = false; showToast(dialogTone)">确认并通知</DlButton></template>
    </DlDialog>

    <DlDrawer v-model:open="drawerOpen" :title="`${toneLabels[drawerTone]} · Drawer`" :description="`${drawerPlacement} 方向 · ${drawerTone} 色调`" :placement="drawerPlacement" :tone="drawerTone" size="md">
      <div class="feedback-drawer-body"><DlBadge :tone="drawerTone">{{ drawerTone }}</DlBadge><h3>保留页面上下文的边缘任务</h3><p>{{ toneDescriptions[drawerTone] }}</p><DlProgress :model-value="drawerTone === 'warning' ? 54 : 86" :tone="drawerTone" show-value label="当前任务完成度" /></div>
      <template #footer><DlButton variant="secondary" @click="drawerOpen = false">稍后处理</DlButton><DlButton variant="primary" @click="drawerOpen = false; showToast(drawerTone)">完成任务</DlButton></template>
    </DlDrawer>

    <DlAlertDialog v-model:open="alertOpen" :tone="alertTone" :title="alertTone === 'danger' ? '删除全部失败记录？' : '使用远端版本覆盖本地修改？'" :description="alertTone === 'danger' ? '删除后无法恢复，需要用户明确确认。' : '本地草稿仍可从恢复快照找回。'" :confirm-label="alertTone === 'danger' ? '确认删除' : '继续同步'" @confirm="alertOpen = false; showToast(alertTone)" />

    <DlToast v-model:open="toastOpen" :tone="toastTone" :title="toneLabels[toastTone]" :description="toneDescriptions[toastTone]" action-label="查看任务" show-progress :progress="toastProgress" @action="toastOpen = false" />
  </section>
</template>
