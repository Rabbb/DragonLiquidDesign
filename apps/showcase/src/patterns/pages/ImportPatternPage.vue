<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  DlBadge,
  DlButton,
  DlCard,
  DlCheckbox,
  DlDialog,
  DlInput,
  DlListbox,
  DlProgress,
  DlRadioGroup,
  DlStepper,
  type DlChoiceOption,
  type DlRadioOption,
  type DlStepItem,
} from '@dragon-liquid/vue'
import { useArchiveDemo } from '../useArchiveDemo'

const { notify } = useArchiveDemo()
const step = ref(1)
const fileName = ref('my-anime-list.json')
const strategy = ref('merge')
const keepLocalRating = ref(true)
const selectedRecords = ref<string[]>(['frieren', 'dungeon', 'violet', 'bocchi'])
const running = ref(false)
const progress = ref(0)
const progressMessage = ref('等待开始')
const completeOpen = ref(false)

const steps = computed<DlStepItem[]>(() => [
  { step: 1, title: '选择来源', description: '读取本地静态文件', completed: step.value > 1 },
  { step: 2, title: '检查内容', description: '选择要导入的记录', completed: step.value > 2 },
  { step: 3, title: '执行导入', description: '反馈进度与结果', completed: progress.value === 100 },
])
const strategies: DlRadioOption[] = [
  { value: 'merge', label: '智能合并', description: '保留本地修改，只补充缺失资料' },
  { value: 'replace', label: '覆盖已有记录', description: '以导入文件中的内容为准' },
  { value: 'new-only', label: '仅新增', description: '跳过所有已经存在的作品' },
]
const records: DlChoiceOption[] = [
  { value: 'frieren', label: '葬送的芙莉莲', description: '28 话 · 已完成 · 与本地记录匹配' },
  { value: 'dungeon', label: '迷宫饭', description: '24 话 · 追看中 · 进度存在差异' },
  { value: 'violet', label: '紫罗兰永恒花园', description: '13 话 · 已完成 · 新增 2 个标签' },
  { value: 'bocchi', label: '孤独摇滚！', description: '12 话 · 想看 · 新记录' },
  { value: 'invalid', label: '无法识别的条目 #42', description: '缺少标题，将在导入时跳过', disabled: true },
]

function analyze() {
  if (!fileName.value.trim()) return
  step.value = 2
  notify('文件解析完成', '找到 4 条可导入记录与 1 条异常记录。', 'accent')
}

function beginImport() {
  step.value = 3
  running.value = true
  progress.value = 12
  progressMessage.value = '正在建立本地快照'
  const stages = [
    [36, '正在匹配已有收藏'],
    [68, '正在合并标签与观看进度'],
    [88, '正在校验导入结果'],
    [100, '导入完成'],
  ] as const
  stages.forEach(([value, message], index) => window.setTimeout(() => {
    progress.value = value
    progressMessage.value = message
    if (value === 100) {
      running.value = false
      completeOpen.value = true
      notify('导入任务完成', `已处理 ${selectedRecords.value.length} 条记录。`)
    }
  }, 360 * (index + 1)))
}

function reset() {
  step.value = 1
  progress.value = 0
  progressMessage.value = '等待开始'
  completeOpen.value = false
}
</script>

<template>
  <section class="pattern-view import-page">
    <div class="demo-page-heading">
      <div><small>STAGE · PROGRESS · RECOVER</small><h1>本地收藏导入</h1><p>不上传任何文件；演示站只在浏览器中模拟解析、合并与反馈过程。</p></div>
      <DlBadge tone="success" variant="outline">ZERO BACKEND</DlBadge>
    </div>

    <DlCard class="import-stepper" padding="lg"><DlStepper v-model="step" :items="steps" linear /></DlCard>

    <div class="import-layout">
      <main>
        <DlCard v-if="step === 1" class="import-panel" padding="lg">
          <small>STEP 01 · SOURCE</small><h2>选择数据来源</h2><p>真实项目中可由文件选择器读取 JSON；这里使用文件名和固定数据演示完整交互。</p>
          <div class="import-file-row"><span>JSON</span><DlInput v-model="fileName" placeholder="收藏文件名" /><DlButton variant="primary" :disabled="!fileName.trim()" @click="analyze">分析文件</DlButton></div>
          <div class="import-dropzone"><b>把收藏导出文件拖到这里</b><span>支持 JSON · 最大 10 MB · 所有处理均在本地完成</span></div>
        </DlCard>

        <DlCard v-else-if="step === 2" class="import-panel" padding="lg">
          <small>STEP 02 · REVIEW</small><h2>检查待导入内容</h2><p>使用列表选择要处理的记录，异常项保持可见但不可选择。</p>
          <DlListbox v-model="selectedRecords" :options="records" multiple />
          <div class="import-actions"><DlButton variant="secondary" @click="step = 1">返回来源</DlButton><DlButton variant="primary" :disabled="!selectedRecords.length" @click="beginImport">导入 {{ selectedRecords.length }} 条记录</DlButton></div>
        </DlCard>

        <DlCard v-else class="import-panel" padding="lg">
          <small>STEP 03 · EXECUTE</small><h2>{{ progress === 100 ? '导入已经完成' : '正在更新收藏库' }}</h2><p>{{ progressMessage }}</p>
          <div class="import-progress-value"><b>{{ progress }}%</b><span>{{ selectedRecords.length }} 条记录</span></div>
          <DlProgress :model-value="progress" show-value :status="progress === 100 ? 'success' : 'default'" :tone="progress === 100 ? 'success' : 'accent'" size="lg" />
          <div class="import-log"><span :class="{ done: progress >= 36 }">✓ 创建恢复快照</span><span :class="{ done: progress >= 68 }">✓ 合并收藏资料</span><span :class="{ done: progress >= 88 }">✓ 更新观看状态</span><span :class="{ done: progress >= 100 }">✓ 完成一致性检查</span></div>
          <div class="import-actions"><DlButton variant="secondary" :disabled="running" @click="reset">重新演示</DlButton><a href="/patterns/library"><DlButton variant="primary" :disabled="progress < 100">返回收藏库</DlButton></a></div>
        </DlCard>
      </main>

      <aside>
        <DlCard padding="lg"><small>MERGE STRATEGY</small><h3>冲突处理</h3><DlRadioGroup v-model="strategy" :options="strategies" /><DlCheckbox v-model="keepLocalRating" label="始终保留本地评分" description="此规则优先于上面的合并策略" /></DlCard>
        <DlCard padding="lg"><small>SAFETY</small><ul><li>文件不会离开浏览器</li><li>执行前创建恢复快照</li><li>异常记录不会阻塞其他内容</li><li>任务结果使用统一 Toast 通知</li></ul></DlCard>
      </aside>
    </div>

    <DlDialog v-model:open="completeOpen" title="导入完成" description="所有步骤均由前端定时器和本地模拟数据驱动。" tone="success">
      <div class="import-result-grid"><span><b>{{ selectedRecords.length }}</b>成功处理</span><span><b>1</b>自动跳过</span><span><b>0</b>需要人工处理</span></div>
      <template #footer><DlButton variant="secondary" @click="reset">再次演示</DlButton><a href="/patterns/library"><DlButton variant="primary">查看收藏库</DlButton></a></template>
    </DlDialog>
  </section>
</template>
