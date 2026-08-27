<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  DlAccordion,
  DlAvatar,
  DlBadge,
  DlButton,
  DlCollapsible,
  DlDialog,
  DlIconButton,
  DlInputText,
  DlOverlaySide,
  DlPopover,
  DlProgress,
  DlSeparator,
  DlTabs,
  DlTooltip,
  type DlAccordionItem,
  type DlPopoverTone,
  type DlTabItem,
  type DlTone,
} from '@dragon-liquid/vue'
import type { ComponentDefinition } from '../catalog'
import { componentGuidanceFor } from '../componentGuidance'
import DocExampleShell from '../components/DocExampleShell.vue'
import { vueSfc } from './exampleCode'

const props = defineProps<{ scenario: string; componentDefinition: ComponentDefinition }>()
const accordionValue = ref<string | string[] | undefined>('story')
const tabValue = ref('summary')
const collapsibleOpen = ref(false)
const popoverOpen = ref(false)
const dialogOpen = ref(false)
const note = ref('适合周末继续观看')
const toneOptions: { value: DlTone; label: string; description: string }[] = [
  { value: 'default', label: 'Default 默认', description: '普通信息与基础任务' },
  { value: 'accent', label: 'Accent 强调', description: '品牌重点与当前任务' },
  { value: 'success', label: 'Success 成功', description: '已经正确完成的结果' },
  { value: 'warning', label: 'Warning 警告', description: '可恢复且需要留意的问题' },
  { value: 'danger', label: 'Danger 危险', description: '失败或不可逆操作' },
  { value: 'muted', label: 'Muted 弱化', description: '低优先级与只读信息' },
]
const popoverToneOptions: { value: DlPopoverTone; label: string; description: string }[] = [
  ...toneOptions,
  { value: 'subtle', label: 'Subtle 低调', description: '日期、菜单等以内容为主的紧凑浮层' },
]
const overlaySides = Object.values(DlOverlaySide).filter(Number.isInteger) as DlOverlaySide[]
const popoverLabOpen = ref(true)
const popoverSide = ref(DlOverlaySide.TopLeft)
const tooltipSide = ref(DlOverlaySide.TopLeft)
const overlayPlacementDetails = ['top / center', 'top / start', 'top / end', 'right / center', 'right / start', 'right / end', 'bottom / center', 'bottom / start', 'bottom / end', 'left / center', 'left / start', 'left / end'] as const

const accordionItems: DlAccordionItem[] = [
  { value: 'story', title: '故事简介', description: '展开查看无剧透梗概', content: '异世界冒险从一封没有署名的委托开始，主角需要在城市与迷宫之间寻找线索。' },
  { value: 'staff', title: '制作信息', content: '动画制作：Dragon Studio；系列构成：Liquid Team。' },
  { value: 'spoiler', title: '剧透章节', content: '该章节当前不可用。', disabled: true },
]
const tabItems: DlTabItem[] = [
  { value: 'summary', label: '简介', description: '作品简介、别名与播出信息。' },
  { value: 'episodes', label: '剧集', description: '剧集列表和个人观看进度。' },
  { value: 'notes', label: '笔记', description: '只对当前用户可见的收藏笔记。' },
]

const baseCodeById: Record<string, string> = {
  accordion: vueSfc({ imports: ['DlAccordion', 'type DlAccordionItem'], script: `import { ref } from 'vue'

const openItem = ref<string | string[]>('story')
const items: DlAccordionItem[] = [
  { value: 'story', title: '故事简介', description: '展开查看无剧透梗概', content: '异世界冒险从一封没有署名的委托开始。' },
  { value: 'staff', title: '制作信息', content: '动画制作：Dragon Studio；系列构成：Liquid Team。' },
  { value: 'spoiler', title: '剧透章节', content: '该章节不可用。', disabled: true },
]`, template: `  <section class="example">
    <DlAccordion v-model="openItem" :items="items" collapsible />
    <output>当前展开：{{ openItem || '无' }}</output>
  </section>`, style: `.example { display: grid; gap: 12px; max-width: 640px; }
output { color: #a9b9b0; }` }),
  avatar: vueSfc({ imports: ['DlAvatar'], template: `  <div class="avatars" aria-label="头像尺寸与形状">
    <DlAvatar fallback="DL" size="sm" />
    <DlAvatar fallback="龙" size="md" />
    <DlAvatar fallback="MOE" shape="rounded" size="lg" />
  </div>`, style: `.avatars { display: flex; align-items: center; gap: 16px; }` }),
  collapsible: vueSfc({ imports: ['DlCollapsible'], script: `import { ref } from 'vue'

const open = ref(false)`, template: `  <section class="example">
    <DlCollapsible
      v-model:open="open"
      title="高级筛选"
      description="按需展开低频筛选条件"
    >
      按制作公司、季度和观看状态筛选。
    </DlCollapsible>
    <output>面板：{{ open ? '已展开' : '已收起' }}</output>
  </section>`, style: `.example { display: grid; gap: 12px; max-width: 640px; }
output { color: #a9b9b0; }` }),
  separator: vueSfc({ imports: ['DlSeparator'], template: `  <section>
    <p>作品简介与主要资料</p>
    <DlSeparator label="更多信息" />
    <p>制作人员、别名和外部链接</p>
  </section>` }),
  tabs: vueSfc({ imports: ['DlTabs', 'type DlTabItem'], script: `import { ref } from 'vue'

const tab = ref('summary')
const items: DlTabItem[] = [
  { value: 'summary', label: '简介', description: '作品简介、别名与播出信息。' },
  { value: 'episodes', label: '剧集', description: '剧集列表和个人观看进度。' },
  { value: 'notes', label: '笔记', description: '只对当前用户可见的收藏笔记。' },
]`, template: `  <section class="example">
    <DlTabs v-model="tab" :items="items" aria-label="作品资料">
      <template #default="{ item }">
        <strong>{{ item.label }}</strong>
        <p>{{ item.description }}</p>
      </template>
    </DlTabs>
    <output>当前面板：{{ tab }}</output>
  </section>`, style: `.example { display: grid; gap: 12px; }
output { color: #a9b9b0; }` }),
}

const scenarioCodeById: Record<string, Record<string, string>> = {
  popover: {
    basic: vueSfc({ imports: ['DlButton', 'DlOverlaySide', 'DlPopover'], script: `import { ref } from 'vue'

const sides = Object.values(DlOverlaySide).filter(Number.isInteger) as DlOverlaySide[]
const open = ref(true)
const side = ref(DlOverlaySide.TopLeft)
const details = ['top / center', 'top / start', 'top / end', 'right / center', 'right / start', 'right / end', 'bottom / center', 'bottom / start', 'bottom / end', 'left / center', 'left / start', 'left / end'] as const

function selectSide(value: DlOverlaySide) {
  side.value = value
  open.value = true
}`, template: `  <section class="placement-lab">
    <div class="placement-stage">
      <DlPopover v-model:open="open" :side="side" :title="DlOverlaySide[side]">
        <template #trigger>
          <DlButton class="placement-anchor" variant="secondary">固定锚点 · 180px</DlButton>
        </template>
        当前映射为 <code>{{ details[side] }}</code>，切换方位时始终使用同一个锚点。
      </DlPopover>
    </div>

    <div class="placement-controls" aria-label="Popover 方位">
      <DlButton
        v-for="item in sides"
        :key="item"
        size="sm"
        :variant="item === side ? 'primary' : 'secondary'"
        @click="selectSide(item)"
      >
        {{ DlOverlaySide[item] }}
      </DlButton>
    </div>
    <output>DlOverlaySide.{{ DlOverlaySide[side] }} → {{ details[side] }}</output>
  </section>`, style: `.placement-lab { display: grid; gap: 16px; }
.placement-stage { position: relative; display: grid; place-items: center; min-height: 340px; overflow: visible; border: 1px solid rgba(148, 163, 184, .16); border-radius: 18px; background: radial-gradient(circle, rgba(104, 225, 255, .06), transparent 48%); }
.placement-stage::before, .placement-stage::after { content: ''; position: absolute; border-color: rgba(148, 163, 184, .2); border-style: dashed; pointer-events: none; }
.placement-stage::before { inset: 50% 24px auto; border-width: 1px 0 0; }
.placement-stage::after { inset: 24px auto 24px 50%; border-width: 0 0 0 1px; }
.placement-anchor { position: relative; z-index: 1; width: 180px; }
.placement-controls { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
output { color: #a9b9b0; font: 500 .82rem/1.5 ui-monospace, monospace; text-align: center; }` }),
    'tone-gallery': vueSfc({ imports: ['DlButton', 'DlPopover', 'type DlPopoverTone'], script: `const tones: { value: DlPopoverTone; label: string; description: string }[] = [
  { value: 'default', label: 'Default 默认', description: '普通信息与基础任务' },
  { value: 'accent', label: 'Accent 强调', description: '品牌重点与当前任务' },
  { value: 'success', label: 'Success 成功', description: '已经正确完成的结果' },
  { value: 'warning', label: 'Warning 警告', description: '可恢复且需要留意的问题' },
  { value: 'danger', label: 'Danger 危险', description: '失败或不可逆操作' },
  { value: 'muted', label: 'Muted 弱化', description: '低优先级与只读信息' },
  { value: 'subtle', label: 'Subtle 低调', description: '日期、菜单等以内容为主的紧凑浮层' },
]`, template: `  <div class="tone-grid">
    <DlPopover v-for="item in tones" :key="item.value" :title="item.label" :tone="item.value">
      <template #trigger><DlButton variant="secondary">{{ item.label }}</DlButton></template>
      {{ item.description }}。当前展示 <code>{{ item.value }}</code> 的完整视觉。
    </DlPopover>
  </div>`, style: `.tone-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }` }),
    arrowless: vueSfc({ imports: ['DlButton', 'DlPopover'], script: `import { ref } from 'vue'

const open = ref(false)`, template: `  <DlPopover
    v-model:open="open"
    title="紧贴触发器"
    tone="subtle"
    :arrow="false"
    align="start"
  >
    <template #trigger>
      <DlButton variant="secondary">打开无箭头浮层</DlButton>
    </template>
    显示箭头时默认保留 6px 间距；隐藏箭头后 sideOffset 自动归零，也可显式传入自定义间距。
  </DlPopover>` }),
    'application-flow': vueSfc({ imports: ['DlButton', 'DlInputText', 'DlPopover'], script: `import { ref } from 'vue'\n\nconst open = ref(false)\nconst note = ref('适合周末继续观看')`, template: `  <DlPopover v-model:open="open" title="快捷编辑笔记" tone="accent" align="start">
    <template #trigger>
      <DlButton variant="primary">编辑个人笔记</DlButton>
    </template>
    <form class="quick-edit" @submit.prevent="open = false">
      <label>
        <span>收藏笔记</span>
        <DlInputText v-model="note" />
      </label>
      <footer>
        <DlButton type="button" variant="ghost" @click="open = false">取消</DlButton>
        <DlButton variant="primary" type="submit">保存</DlButton>
      </footer>
    </form>
  </DlPopover>`, style: `.quick-edit, .quick-edit label { display: grid; gap: 12px; }
.quick-edit footer { display: flex; justify-content: flex-end; gap: 8px; padding-top: 6px; }` }),
    'nested-composition': vueSfc({ imports: ['DlButton', 'DlDialog', 'DlPopover'], script: `import { ref } from 'vue'\n\nconst dialogOpen = ref(false)\nconst popoverOpen = ref(false)`, template: `  <DlButton variant="primary" @click="dialogOpen = true">打开编辑对话框</DlButton>
  <DlDialog v-model:open="dialogOpen" title="编辑作品资料">
    <DlPopover v-model:open="popoverOpen" title="选择说明" side="right">
      <template #trigger>
        <DlButton variant="secondary">查看字段说明</DlButton>
      </template>
      Popover 会显示在 Dialog 上方，并保持各自的焦点与层级。
    </DlPopover>
  </DlDialog>` }),
    'saved-summary': vueSfc({ imports: ['DlBadge', 'DlButton', 'DlPopover'], script: `import { ref } from 'vue'\n\nconst open = ref(false)`, template: `  <DlPopover v-model:open="open" title="保存结果" tone="success" align="start">
    <template #trigger>
      <DlButton variant="secondary">查看保存结果</DlButton>
    </template>
    <div class="saved-summary">
      <DlBadge tone="success">已同步</DlBadge>
      <strong>个人笔记已保存</strong>
      <p>修改已同步到所有设备，离线副本也已更新。</p>
    </div>
  </DlPopover>`, style: `.saved-summary { display: grid; gap: 9px; }
.saved-summary p { margin: 0; color: #a9b9b0; }` }),
    'sync-warning': vueSfc({ imports: ['DlButton', 'DlPopover'], script: `import { ref } from 'vue'\n\nconst open = ref(false)`, template: `  <DlPopover v-model:open="open" title="同步暂时中断" tone="warning" align="start">
    <template #trigger>
      <DlButton variant="secondary">查看同步状态</DlButton>
    </template>
    <div class="sync-warning">
      <p>网络连接不稳定，本次编辑已保存在本机。</p>
      <DlButton variant="primary" size="sm" @click="open = false">后台重试</DlButton>
    </div>
  </DlPopover>`, style: `.sync-warning { display: grid; gap: 12px; }
.sync-warning p { margin: 0; }` }),
    'remove-action': vueSfc({ imports: ['DlButton', 'DlPopover'], script: `import { ref } from 'vue'\n\nconst open = ref(false)\n\nfunction removeTag() {\n  open.value = false\n}`, template: `  <DlPopover v-model:open="open" title="移除个人标签" tone="danger" align="end">
    <template #trigger>
      <DlButton variant="danger">移除标签</DlButton>
    </template>
    <div class="remove-action">
      <p>“年度最佳”将从 18 部作品中移除，此操作无法撤销。</p>
      <footer>
        <DlButton size="sm" variant="ghost" @click="open = false">取消</DlButton>
        <DlButton size="sm" variant="danger" @click="removeTag">确认移除</DlButton>
      </footer>
    </div>
  </DlPopover>`, style: `.remove-action { display: grid; gap: 12px; }
.remove-action p { margin: 0; }
.remove-action footer { display: flex; justify-content: flex-end; gap: 8px; }` }),
    'metadata-note': vueSfc({ imports: ['DlButton', 'DlPopover'], script: `import { ref } from 'vue'\n\nconst open = ref(false)`, template: `  <DlPopover v-model:open="open" title="元数据来源" tone="muted" side="top">
    <template #trigger>
      <DlButton variant="ghost">查看资料来源</DlButton>
    </template>
    <dl class="metadata-note">
      <div><dt>最后更新</dt><dd>2026-08-01 09:42</dd></div>
      <div><dt>数据来源</dt><dd>本地媒体信息</dd></div>
      <div><dt>可信度</dt><dd>仅供参考</dd></div>
    </dl>
  </DlPopover>`, style: `.metadata-note { display: grid; gap: 9px; margin: 0; }
.metadata-note div { display: flex; justify-content: space-between; gap: 20px; }
.metadata-note dt, .metadata-note dd { margin: 0; }
.metadata-note dt { color: #a9b9b0; }` }),
  },
  progress: {
    basic: vueSfc({ imports: ['DlProgress'], template: `  <div class="progress-list">
    <DlProgress :model-value="28" label="Small" size="sm" show-value />
    <DlProgress :model-value="64" label="Medium" tone="accent" show-value />
    <DlProgress :model-value="100" label="Large" size="lg" tone="success" status="success" show-value />
  </div>`, style: `.progress-list { display: grid; gap: 24px; }` }),
    'tone-gallery': vueSfc({ imports: ['DlProgress', 'type DlTone'], script: `const tones: { value: DlTone; label: string; valueNow: number }[] = [
  { value: 'default', label: 'Default 默认', valueNow: 18 },
  { value: 'accent', label: 'Accent 强调', valueNow: 34 },
  { value: 'success', label: 'Success 成功', valueNow: 100 },
  { value: 'warning', label: 'Warning 警告', valueNow: 62 },
  { value: 'danger', label: 'Danger 危险', valueNow: 43 },
  { value: 'muted', label: 'Muted 弱化', valueNow: 76 },
]`, template: `  <div class="progress-tones">
    <DlProgress
      v-for="item in tones"
      :key="item.value"
      :model-value="item.valueNow"
      :label="item.label"
      :tone="item.value"
      show-value
    />
  </div>`, style: `.progress-tones { display: grid; gap: 22px; }` }),
    'application-flow': vueSfc({ imports: ['DlProgress'], template: `  <section class="import-task">
    <DlProgress :model-value="100" label="读取媒体信息" helper="已完成" tone="success" status="success" show-value />
    <DlProgress :model-value="68" label="同步分类标签" helper="正在合并本地与远程标签" tone="accent" show-value />
    <DlProgress :model-value="16" label="生成封面缩略图" helper="剩余 5 张" tone="warning" show-value />
  </section>`, style: `.import-task { display: grid; gap: 24px; }` }),
    'nested-composition': vueSfc({ imports: ['DlProgress'], template: `  <div class="waiting-card">
    <b>正在分析媒体文件</b>
    <p>任务耗时暂时无法估算，请保持页面开启。</p>
    <DlProgress :model-value="null" tone="accent" label="分析中" show-value />
  </div>`, style: `.waiting-card { display: grid; gap: 14px; padding: 20px; border: 1px solid rgba(255,255,255,.1); border-radius: 18px; }
.waiting-card p { margin: 0; color: #a9b9b0; }` }),
    'failure-state': vueSfc({ imports: ['DlButton', 'DlProgress'], script: `import { ref } from 'vue'\n\nconst progress = ref(43)\n\nfunction retry() {\n  progress.value = 0\n}`, template: `  <section class="failed-task">
    <DlProgress
      :model-value="progress"
      label="上传原始封面"
      helper="连接已中断，文件没有完成上传"
      tone="danger"
      status="danger"
      show-value
    />
    <DlButton variant="danger" size="sm" @click="retry">重新上传</DlButton>
  </section>`, style: `.failed-task { display: grid; justify-items: start; gap: 16px; }` }),
    'background-task': vueSfc({ imports: ['DlProgress'], template: `  <section class="background-task">
    <span>后台维护</span>
    <DlProgress
      :model-value="72"
      label="压缩旧版封面缓存"
      helper="无需保持页面开启"
      tone="muted"
      size="sm"
      show-value
    />
  </section>`, style: `.background-task { display: grid; gap: 12px; padding: 18px; border: 1px solid rgba(148, 163, 184, .16); border-radius: 16px; }
.background-task > span { color: #94a3b8; font-size: .78rem; }` }),
  },
  tooltip: {
    basic: vueSfc({ imports: ['DlButton', 'DlOverlaySide', 'DlTooltip'], script: `import { ref } from 'vue'

const sides = Object.values(DlOverlaySide).filter(Number.isInteger) as DlOverlaySide[]
const side = ref(DlOverlaySide.TopLeft)
const details = ['top / center', 'top / start', 'top / end', 'right / center', 'right / start', 'right / end', 'bottom / center', 'bottom / start', 'bottom / end', 'left / center', 'left / start', 'left / end'] as const`, template: `  <section class="placement-lab">
    <div class="placement-stage">
      <DlTooltip
        :open="true"
        :side="side"
        :title="DlOverlaySide[side]"
        :text="details[side]"
      >
        <DlButton class="placement-anchor" variant="secondary">固定锚点 · 180px</DlButton>
      </DlTooltip>
    </div>

    <div class="placement-controls" aria-label="Tooltip 方位">
      <DlButton
        v-for="item in sides"
        :key="item"
        size="sm"
        :variant="item === side ? 'primary' : 'secondary'"
        @click="side = item"
      >
        {{ DlOverlaySide[item] }}
      </DlButton>
    </div>
    <output>DlOverlaySide.{{ DlOverlaySide[side] }} → {{ details[side] }}</output>
  </section>`, style: `.placement-lab { display: grid; gap: 16px; }
.placement-stage { position: relative; display: grid; place-items: center; min-height: 340px; overflow: visible; border: 1px solid rgba(148, 163, 184, .16); border-radius: 18px; background: radial-gradient(circle, rgba(104, 225, 255, .06), transparent 48%); }
.placement-stage::before, .placement-stage::after { content: ''; position: absolute; border-color: rgba(148, 163, 184, .2); border-style: dashed; pointer-events: none; }
.placement-stage::before { inset: 50% 24px auto; border-width: 1px 0 0; }
.placement-stage::after { inset: 24px auto 24px 50%; border-width: 0 0 0 1px; }
.placement-anchor { position: relative; z-index: 1; width: 180px; }
.placement-controls { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
output { color: #a9b9b0; font: 500 .82rem/1.5 ui-monospace, monospace; text-align: center; }` }),
    'tone-gallery': vueSfc({ imports: ['DlButton', 'DlTooltip', 'type DlTone'], script: `const tones: { value: DlTone; label: string; description: string }[] = [
  { value: 'default', label: 'Default 默认', description: '普通信息与基础任务' },
  { value: 'accent', label: 'Accent 强调', description: '品牌重点与当前任务' },
  { value: 'success', label: 'Success 成功', description: '已经正确完成的结果' },
  { value: 'warning', label: 'Warning 警告', description: '可恢复且需要留意的问题' },
  { value: 'danger', label: 'Danger 危险', description: '失败或不可逆操作' },
  { value: 'muted', label: 'Muted 弱化', description: '低优先级与只读信息' },
]`, template: `  <div class="tone-grid">
    <DlTooltip
      v-for="item in tones"
      :key="item.value"
      :title="item.label"
      :text="item.description"
      :tone="item.value"
      side="bottom"
    >
      <DlButton variant="secondary">{{ item.label }}</DlButton>
    </DlTooltip>
  </div>`, style: `.tone-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }` }),
    arrowless: vueSfc({ imports: ['DlButton', 'DlTooltip'], template: `  <DlTooltip
    text="无箭头时默认取消间距，也可通过 sideOffset 主动留白。"
    :arrow="false"
  >
    <DlButton variant="secondary">悬停查看无箭头提示</DlButton>
  </DlTooltip>` }),
    'application-flow': vueSfc({ imports: ['DlIconButton', 'DlTooltip'], template: `  <div class="toolbar">
    <DlTooltip text="加入收藏"><DlIconButton label="加入收藏">☆</DlIconButton></DlTooltip>
    <DlTooltip text="编辑作品资料" tone="accent"><DlIconButton label="编辑作品资料">✎</DlIconButton></DlTooltip>
    <DlTooltip text="移除收藏" tone="danger"><DlIconButton label="移除收藏" variant="danger">×</DlIconButton></DlTooltip>
  </div>`, style: `.toolbar { display: flex; gap: 8px; }` }),
    'nested-composition': vueSfc({ imports: ['DlButton', 'DlDialog', 'DlTooltip'], script: `import { ref } from 'vue'\n\nconst open = ref(false)`, template: `  <DlButton variant="primary" @click="open = true">打开详情对话框</DlButton>
  <DlDialog v-model:open="open" title="作品详情">
    <p>对话框中的紧凑操作仍可使用 Tooltip。</p>
    <DlTooltip title="键盘可用" text="悬停或按 Tab 聚焦都会显示提示。" tone="accent">
      <DlButton variant="secondary">聚焦或悬停</DlButton>
    </DlTooltip>
  </DlDialog>` }),
    'secondary-hint': vueSfc({ imports: ['DlButton', 'DlTooltip'], template: `  <div class="secondary-hint">
    <span>列表视图</span>
    <DlTooltip
      title="键盘快捷键"
      text="按 G，然后按 L，可从任意页面返回收藏列表。"
      tone="muted"
      side="bottom"
      :delay-duration="500"
    >
      <DlButton variant="ghost" size="sm" aria-label="查看列表视图快捷键">G L</DlButton>
    </DlTooltip>
  </div>`, style: `.secondary-hint { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 16px; border: 1px solid rgba(148, 163, 184, .16); border-radius: 16px; color: #a9b9b0; }` }),
  },
}

const exampleCode = computed(() => scenarioCodeById[props.componentDefinition.id]?.[props.scenario]
  ?? baseCodeById[props.componentDefinition.id]
  ?? '')

const content = computed(() => ({
  title: `${props.componentDefinition.name} · ${props.componentDefinition.scenarios.find(item => item.id === props.scenario)?.label ?? '案例'}`,
  description: componentGuidanceFor(props.componentDefinition.id).example,
  code: exampleCode.value,
  tips: ['键盘导航、焦点移动和 ARIA 状态由 Reka UI 原语提供。', '每个场景独立加载，并给出可以直接复制的完整 Vue SFC 代码。'],
}))
</script>

<template>
  <DocExampleShell v-bind="content">
    <div class="general-demo">
      <template v-if="componentDefinition.id === 'accordion'">
        <DlAccordion v-model="accordionValue" :items="accordionItems" collapsible />
        <output class="accordion-value">当前展开：{{ accordionValue || '无' }}</output>
      </template>

      <div v-else-if="componentDefinition.id === 'avatar'" class="avatar-row">
        <DlAvatar fallback="DL" size="sm" /><DlAvatar fallback="龙" size="md" /><DlAvatar fallback="MOE" shape="rounded" size="lg" />
      </div>

      <DlCollapsible v-else-if="componentDefinition.id === 'collapsible'" v-model:open="collapsibleOpen" title="高级筛选" description="按制作公司、季度和观看状态进一步缩小结果">
        这些字段只在需要时挂载，适合把低频选项从主流程中分离出来。
      </DlCollapsible>

      <template v-else-if="componentDefinition.id === 'popover'">
        <section v-if="scenario === 'basic'" class="overlay-placement-lab">
          <div class="overlay-placement-stage"><DlPopover v-model:open="popoverLabOpen" :side="popoverSide" :title="DlOverlaySide[popoverSide]"><template #trigger><DlButton class="overlay-placement-anchor" variant="secondary">固定锚点 · 180px</DlButton></template>当前映射为 <code>{{ overlayPlacementDetails[popoverSide] }}</code>，切换方位时始终使用同一个锚点。</DlPopover></div>
          <div class="overlay-placement-controls" aria-label="Popover 方位"><DlButton v-for="side in overlaySides" :key="side" size="sm" :variant="side === popoverSide ? 'primary' : 'secondary'" @click="popoverSide = side; popoverLabOpen = true">{{ DlOverlaySide[side] }}</DlButton></div>
          <output>DlOverlaySide.{{ DlOverlaySide[popoverSide] }} → {{ overlayPlacementDetails[popoverSide] }}</output>
        </section>
        <div v-else-if="scenario === 'tone-gallery'" class="tone-control-grid">
          <DlPopover v-for="item in popoverToneOptions" :key="item.value" :title="item.label" :tone="item.value"><template #trigger><DlButton variant="secondary">{{ item.label }}</DlButton></template>{{ item.description }}。当前展示 <code>{{ item.value }}</code> 的完整视觉。</DlPopover>
        </div>
        <DlPopover v-else-if="scenario === 'arrowless'" v-model:open="popoverOpen" title="紧贴触发器" tone="subtle" :arrow="false" align="start">
          <template #trigger><DlButton variant="secondary">打开无箭头浮层</DlButton></template>
          显示箭头时默认保留 6px 间距；隐藏箭头后 sideOffset 自动归零，也可显式传入自定义间距。
        </DlPopover>
        <DlPopover v-else-if="scenario === 'application-flow'" v-model:open="popoverOpen" title="快捷编辑笔记" tone="accent" align="start">
          <template #trigger><DlButton variant="primary">编辑个人笔记</DlButton></template>
          <form class="popover-quick-edit" @submit.prevent="popoverOpen = false"><label><span>收藏笔记</span><DlInputText v-model="note" /></label><footer><DlButton type="button" variant="ghost" @click="popoverOpen = false">取消</DlButton><DlButton variant="primary" type="submit">保存</DlButton></footer></form>
        </DlPopover>
        <template v-else-if="scenario === 'nested-composition'">
          <DlButton variant="primary" @click="dialogOpen = true">打开编辑对话框</DlButton>
          <DlDialog v-model:open="dialogOpen" title="编辑作品资料" description="验证嵌套 Portal 的层级关系。"><DlPopover title="选择说明" side="right"><template #trigger><DlButton variant="secondary">查看字段说明</DlButton></template>Popover 会显示在 Dialog 上方，并保持各自的焦点与层级。</DlPopover></DlDialog>
        </template>
        <DlPopover v-else-if="scenario === 'saved-summary'" v-model:open="popoverOpen" title="保存结果" tone="success" align="start">
          <template #trigger><DlButton variant="secondary">查看保存结果</DlButton></template>
          <div class="popover-state"><DlBadge tone="success">已同步</DlBadge><strong>个人笔记已保存</strong><p>修改已同步到所有设备，离线副本也已更新。</p></div>
        </DlPopover>
        <DlPopover v-else-if="scenario === 'sync-warning'" v-model:open="popoverOpen" title="同步暂时中断" tone="warning" align="start">
          <template #trigger><DlButton variant="secondary">查看同步状态</DlButton></template>
          <div class="popover-state"><p>网络连接不稳定，本次编辑已保存在本机。</p><DlButton variant="primary" size="sm" @click="popoverOpen = false">后台重试</DlButton></div>
        </DlPopover>
        <DlPopover v-else-if="scenario === 'remove-action'" v-model:open="popoverOpen" title="移除个人标签" tone="danger" align="end">
          <template #trigger><DlButton variant="danger">移除标签</DlButton></template>
          <div class="popover-state"><p>“年度最佳”将从 18 部作品中移除，此操作无法撤销。</p><footer><DlButton size="sm" variant="ghost" @click="popoverOpen = false">取消</DlButton><DlButton size="sm" variant="danger" @click="popoverOpen = false">确认移除</DlButton></footer></div>
        </DlPopover>
        <DlPopover v-else v-model:open="popoverOpen" title="元数据来源" tone="muted" side="top">
          <template #trigger><DlButton variant="ghost">查看资料来源</DlButton></template>
          <dl class="metadata-note"><div><dt>最后更新</dt><dd>2026-08-01 09:42</dd></div><div><dt>数据来源</dt><dd>本地媒体信息</dd></div><div><dt>可信度</dt><dd>仅供参考</dd></div></dl>
        </DlPopover>
      </template>

      <div v-else-if="componentDefinition.id === 'progress'" class="progress-stack">
        <template v-if="scenario === 'basic'"><DlProgress :model-value="28" label="Small" size="sm" show-value /><DlProgress :model-value="64" label="Medium" tone="accent" show-value /><DlProgress :model-value="100" label="Large" size="lg" tone="success" status="success" show-value /></template>
        <template v-else-if="scenario === 'tone-gallery'"><DlProgress v-for="(item, index) in toneOptions" :key="item.value" :model-value="[18, 34, 100, 62, 43, 76][index]" :label="item.label" :tone="item.value" show-value /></template>
        <template v-else-if="scenario === 'application-flow'"><DlProgress :model-value="100" label="读取媒体信息" helper="已完成" tone="success" status="success" show-value /><DlProgress :model-value="68" label="同步分类标签" helper="正在合并本地与远程标签" tone="accent" show-value /><DlProgress :model-value="16" label="生成封面缩略图" helper="剩余 5 张" tone="warning" show-value /></template>
        <div v-else-if="scenario === 'nested-composition'" class="waiting-card"><b>正在分析媒体文件</b><p>任务耗时暂时无法估算，请保持页面开启。</p><DlProgress :model-value="null" tone="accent" label="分析中" show-value /></div>
        <div v-else-if="scenario === 'failure-state'" class="progress-action"><DlProgress :model-value="43" label="上传原始封面" helper="连接已中断，文件没有完成上传" tone="danger" status="danger" show-value /><DlButton variant="danger" size="sm">重新上传</DlButton></div>
        <div v-else class="background-task"><span>后台维护</span><DlProgress :model-value="72" label="压缩旧版封面缓存" helper="无需保持页面开启" tone="muted" size="sm" show-value /></div>
      </div>

      <div v-else-if="componentDefinition.id === 'separator'" class="separator-demo"><p>作品简介与主要资料</p><DlSeparator label="更多信息" /><p>制作人员、别名和外部链接</p></div>

      <DlTabs v-else-if="componentDefinition.id === 'tabs'" v-model="tabValue" :items="tabItems"><template #default="{ item }"><strong>{{ item.label }}</strong><p>{{ item.description }}</p></template></DlTabs>

      <template v-else-if="componentDefinition.id === 'tooltip'">
        <section v-if="scenario === 'basic'" class="overlay-placement-lab">
          <div class="overlay-placement-stage"><DlTooltip :open="true" :side="tooltipSide" :title="DlOverlaySide[tooltipSide]" :text="overlayPlacementDetails[tooltipSide]"><DlButton class="overlay-placement-anchor" variant="secondary">固定锚点 · 180px</DlButton></DlTooltip></div>
          <div class="overlay-placement-controls" aria-label="Tooltip 方位"><DlButton v-for="side in overlaySides" :key="side" size="sm" :variant="side === tooltipSide ? 'primary' : 'secondary'" @click="tooltipSide = side">{{ DlOverlaySide[side] }}</DlButton></div>
          <output>DlOverlaySide.{{ DlOverlaySide[tooltipSide] }} → {{ overlayPlacementDetails[tooltipSide] }}</output>
        </section>
        <div v-else-if="scenario === 'tone-gallery'" class="tone-control-grid"><DlTooltip v-for="item in toneOptions" :key="item.value" :title="item.label" :text="item.description" :tone="item.value" side="bottom"><DlButton variant="secondary">{{ item.label }}</DlButton></DlTooltip></div>
        <div v-else-if="scenario === 'arrowless'" class="tooltip-row"><DlTooltip text="无箭头时默认取消间距，也可通过 sideOffset 主动留白。" :arrow="false"><DlButton variant="secondary">悬停查看无箭头提示</DlButton></DlTooltip></div>
        <div v-else-if="scenario === 'application-flow'" class="tooltip-row"><DlTooltip text="加入收藏"><DlIconButton label="加入收藏">☆</DlIconButton></DlTooltip><DlTooltip text="编辑作品资料" tone="accent"><DlIconButton label="编辑作品资料">✎</DlIconButton></DlTooltip><DlTooltip text="移除收藏" tone="danger"><DlIconButton label="移除收藏" variant="danger">×</DlIconButton></DlTooltip></div>
        <template v-else-if="scenario === 'nested-composition'"><DlButton variant="primary" @click="dialogOpen = true">打开详情对话框</DlButton><DlDialog v-model:open="dialogOpen" title="作品详情"><p>对话框中的紧凑操作仍可使用 Tooltip。</p><DlTooltip title="键盘可用" text="悬停或按 Tab 聚焦都会显示提示。" tone="accent"><DlButton variant="secondary">聚焦或悬停</DlButton></DlTooltip></DlDialog></template>
        <div v-else class="secondary-hint"><span>列表视图</span><DlTooltip title="键盘快捷键" text="按 G，然后按 L，可从任意页面返回收藏列表。" tone="muted" side="bottom" :delay-duration="500"><DlButton variant="ghost" size="sm" aria-label="查看列表视图快捷键">G L</DlButton></DlTooltip></div>
      </template>
    </div>
  </DocExampleShell>
</template>

<style scoped>
.general-demo { width: min(100%, 720px); margin: 0 auto; padding: 1rem; }
.accordion-value { color: var(--dl-text-muted); font-size: 0.82rem; }
.avatar-row, .tooltip-row { display: flex; align-items: center; flex-wrap: wrap; gap: 1rem; }
.overlay-placement-lab { display: grid; gap: 16px; width: 100%; }
.overlay-placement-stage { position: relative; display: grid; place-items: center; min-height: 340px; overflow: visible; border: 1px solid rgba(148, 163, 184, .16); border-radius: var(--dl-radius-md); background: radial-gradient(circle, rgba(104, 225, 255, .06), transparent 48%); }
.overlay-placement-stage::before, .overlay-placement-stage::after { content: ''; position: absolute; border-color: rgba(148, 163, 184, .2); border-style: dashed; pointer-events: none; }
.overlay-placement-stage::before { inset: 50% 24px auto; border-width: 1px 0 0; }
.overlay-placement-stage::after { inset: 24px auto 24px 50%; border-width: 0 0 0 1px; }
.overlay-placement-anchor { position: relative; z-index: 1; width: 180px; }
.overlay-placement-controls { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
.overlay-placement-lab output { color: var(--dl-text-muted); font: 500 .82rem/1.5 ui-monospace, monospace; text-align: center; }
.tone-control-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; width: 100%; }
.progress-stack, .separator-demo { display: grid; gap: 1.5rem; width: 100%; }
.separator-demo p, .waiting-card p { color: var(--dl-text-muted); }
.popover-quick-edit, .popover-quick-edit label { display: grid; gap: 12px; }
.popover-quick-edit footer { display: flex; justify-content: flex-end; gap: 8px; padding-top: 6px; }
.popover-state { display: grid; gap: 10px; }
.popover-state p { margin: 0; }
.popover-state footer { display: flex; justify-content: flex-end; gap: 8px; }
.metadata-note { display: grid; gap: 9px; margin: 0; }
.metadata-note div { display: flex; justify-content: space-between; gap: 20px; }
.metadata-note dt, .metadata-note dd { margin: 0; }
.metadata-note dt { color: var(--dl-text-muted); }
.progress-action { display: grid; justify-items: start; gap: 16px; }
.background-task { display: grid; gap: 12px; padding: 18px; border: 1px solid rgba(148, 163, 184, .16); border-radius: var(--dl-radius-md); }
.background-task > span { color: #94a3b8; font-size: .78rem; }
.secondary-hint { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 16px; border: 1px solid rgba(148, 163, 184, .16); border-radius: var(--dl-radius-md); color: var(--dl-text-muted); }
@media (max-width: 560px) { .tone-control-grid, .overlay-placement-controls { grid-template-columns: 1fr; } }
.waiting-card { display: grid; gap: 14px; padding: 20px; border: 1px solid var(--dl-border); border-radius: var(--dl-radius-md); background: rgba(3, 14, 8, .32); }
.waiting-card p { margin: 0; }
</style>
