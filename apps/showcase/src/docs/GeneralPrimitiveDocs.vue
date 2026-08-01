<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  DlAccordion,
  DlAvatar,
  DlButton,
  DlCollapsible,
  DlDialog,
  DlPopover,
  DlProgress,
  DlSeparator,
  DlTabs,
  DlTooltip,
  type DlAccordionItem,
  type DlTabItem,
} from '@dragon-liquid/vue'
import type { ComponentDefinition } from '../catalog'
import DocExampleShell from '../components/DocExampleShell.vue'
import { vueSfc } from './exampleCode'

const props = defineProps<{ scenario: string; componentDefinition: ComponentDefinition }>()
const accordionValue = ref<string | string[]>('story')
const tabValue = ref('summary')
const collapsibleOpen = ref(false)
const popoverOpen = ref(false)
const dialogOpen = ref(false)

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

const codeById: Record<string, string> = {
  accordion: vueSfc({ imports: ['DlAccordion', 'type DlAccordionItem'], script: `import { ref } from 'vue'\n\nconst openItem = ref('story')\nconst items: DlAccordionItem[] = [\n  { value: 'story', title: '故事简介', content: '无剧透梗概' },\n  { value: 'staff', title: '制作信息', content: '制作团队资料' },\n]`, template: `  <DlAccordion v-model="openItem" :items="items" />` }),
  avatar: vueSfc({ imports: ['DlAvatar'], template: `  <DlAvatar fallback="DL" size="lg" />` }),
  collapsible: vueSfc({ imports: ['DlCollapsible'], script: `import { ref } from 'vue'\n\nconst open = ref(false)`, template: `  <DlCollapsible v-model:open="open" title="高级筛选">\n    按制作公司、季度和观看状态筛选。\n  </DlCollapsible>` }),
  popover: vueSfc({ imports: ['DlButton', 'DlPopover'], script: `import { ref } from 'vue'\n\nconst open = ref(false)`, template: `  <DlPopover v-model:open="open" title="快捷编辑">\n    <template #trigger>\n      <DlButton variant="secondary">打开气泡卡片</DlButton>\n    </template>\n    在当前页面修改收藏状态。\n  </DlPopover>` }),
  progress: vueSfc({ imports: ['DlProgress'], template: `  <DlProgress :model-value="68" label="资料导入" show-value />` }),
  separator: vueSfc({ imports: ['DlSeparator'], template: `  <section>\n    <p>作品简介与主要资料</p>\n    <DlSeparator label="更多信息" />\n    <p>制作人员、别名和外部链接</p>\n  </section>` }),
  tabs: vueSfc({ imports: ['DlTabs', 'type DlTabItem'], script: `import { ref } from 'vue'\n\nconst tab = ref('summary')\nconst items: DlTabItem[] = [\n  { value: 'summary', label: '简介' },\n  { value: 'episodes', label: '剧集' },\n]`, template: `  <DlTabs v-model="tab" :items="items">\n    <template #tab-summary>作品简介</template>\n    <template #tab-episodes>剧集列表</template>\n  </DlTabs>` }),
  tooltip: vueSfc({ imports: ['DlButton', 'DlTooltip'], template: `  <DlTooltip text="编辑当前收藏">\n    <DlButton variant="secondary">编辑</DlButton>\n  </DlTooltip>` }),
}
const content = computed(() => ({
  title: `${props.componentDefinition.name} · ${props.componentDefinition.scenarios.find(item => item.id === props.scenario)?.label ?? '案例'}`,
  description: props.componentDefinition.summary,
  code: codeById[props.componentDefinition.id] ?? '',
  tips: ['键盘导航、焦点移动和 ARIA 状态由 Reka UI 原语提供。', 'Popover 与 Tooltip 使用 Dragon Liquid 层级上下文，嵌套在 Dialog 中也不会被遮挡。'],
}))
</script>

<template>
  <DocExampleShell v-bind="content">
    <div class="general-demo">
      <DlAccordion v-if="componentDefinition.id === 'accordion'" v-model="accordionValue" :items="accordionItems" :type="scenario === 'nested-composition' ? 'multiple' : 'single'" />

      <div v-else-if="componentDefinition.id === 'avatar'" class="avatar-row">
        <DlAvatar fallback="DL" size="sm" />
        <DlAvatar fallback="龙" size="md" />
        <DlAvatar src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23d97706'/%3E%3Ccircle cx='50' cy='38' r='20' fill='%23fef3c7'/%3E%3Cpath d='M15 100c4-28 18-40 35-40s31 12 35 40' fill='%230d2818'/%3E%3C/svg%3E" fallback="A" size="lg" />
        <DlAvatar fallback="MOE" shape="rounded" size="lg" />
      </div>

      <DlCollapsible v-else-if="componentDefinition.id === 'collapsible'" v-model:open="collapsibleOpen" title="高级筛选" description="按制作公司、季度和观看状态进一步缩小结果">
        这些字段只在需要时挂载，适合把低频选项从主流程中分离出来。
      </DlCollapsible>

      <template v-else-if="componentDefinition.id === 'popover'">
        <DlPopover v-if="scenario !== 'nested-composition'" v-model:open="popoverOpen" title="快捷编辑" align="start">
          <template #trigger><DlButton variant="secondary">打开气泡卡片</DlButton></template>
          不离开当前页面即可修改收藏状态或补充一条简短笔记。
        </DlPopover>
        <template v-else>
          <DlButton @click="dialogOpen = true">验证 Dialog 内层级</DlButton>
          <DlDialog v-model:open="dialogOpen" title="嵌套浮层" description="Popover 应显示在对话框之上。">
            <DlPopover title="层级正确">
              <template #trigger><DlButton variant="secondary">在 Dialog 中打开</DlButton></template>
              此内容通过 Portal 渲染，并继承最近的容器层级。
            </DlPopover>
          </DlDialog>
        </template>
      </template>

      <div v-else-if="componentDefinition.id === 'progress'" class="progress-stack">
        <DlProgress :model-value="68" label="资料导入" show-value />
        <DlProgress :model-value="92" label="封面处理" show-value tone="success" size="sm" />
        <DlProgress :model-value="null" label="正在分析文件" show-value tone="warning" />
      </div>

      <div v-else-if="componentDefinition.id === 'separator'" class="separator-demo">
        <p>作品简介与主要资料</p><DlSeparator label="更多信息" /><p>制作人员、别名和外部链接</p>
        <div class="separator-actions"><span>编辑</span><DlSeparator orientation="vertical" /><span>收藏</span><DlSeparator orientation="vertical" /><span>分享</span></div>
      </div>

      <DlTabs v-else-if="componentDefinition.id === 'tabs'" v-model="tabValue" :items="tabItems" :orientation="scenario === 'nested-composition' ? 'vertical' : 'horizontal'">
        <template #default="{ item }"><strong>{{ item.label }}</strong><p>{{ item.description }}</p></template>
      </DlTabs>

      <div v-else class="tooltip-row">
        <DlTooltip text="编辑当前收藏"><DlButton variant="secondary">悬停或聚焦</DlButton></DlTooltip>
        <DlTooltip side="bottom"><DlButton variant="ghost">富文本提示</DlButton><template #content><b>键盘可用</b><br>按 Tab 聚焦同样会出现。</template></DlTooltip>
        <template v-if="scenario === 'nested-composition'">
          <DlButton @click="dialogOpen = true">Dialog 内提示</DlButton>
          <DlDialog v-model:open="dialogOpen" title="Tooltip 层级验证"><DlTooltip text="我在 Dialog 上方"><DlButton variant="secondary">悬停验证</DlButton></DlTooltip></DlDialog>
        </template>
      </div>
    </div>
  </DocExampleShell>
</template>

<style scoped>
.general-demo { width: min(100%, 720px); margin: 0 auto; padding: 1rem; }
.avatar-row, .tooltip-row, .separator-actions { display: flex; align-items: center; flex-wrap: wrap; gap: 1rem; }
.progress-stack, .separator-demo { display: grid; gap: 1.5rem; }
.separator-demo p { color: var(--dl-text-muted); }
.separator-actions { height: 2rem; color: var(--dl-text); }
</style>
