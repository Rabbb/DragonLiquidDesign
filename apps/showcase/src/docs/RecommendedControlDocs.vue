<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  DlBadge,
  DlCard,
  DlMultiChoice,
  DlSegmented,
  DlVirtualList,
  type DlChoiceOption,
  type DlMultiChoiceEntry,
} from '@dragon-liquid/vue'
import type { ComponentDefinition } from '../catalog'
import DocExampleShell from '../components/DocExampleShell.vue'
import { vueSfc } from './exampleCode'

const props = defineProps<{ scenario: string; componentDefinition: ComponentDefinition }>()
const selected = ref(['vue', 'dotnet', 'postgres'])
const segment = ref('balanced')
const groupedOptions: DlMultiChoiceEntry[] = [
  { label: '客户端', options: [
    { value: 'vue', label: 'Vue 3', description: '渐进式前端框架', keywords: ['vuejs', 'v3'] },
    { value: 'react', label: 'React', description: '组件化界面库' },
  ] },
  { label: '服务端', options: [
    { value: 'dotnet', label: '.NET', description: 'ASP.NET Core 服务', keywords: ['csharp', 'aspnet'] },
    { value: 'node', label: 'Node.js', description: 'JavaScript 运行时', keywords: ['nodejs'] },
    { value: 'postgres', label: 'PostgreSQL', description: '关系型数据库', keywords: ['pgsql'] },
  ] },
]
const segmentItems: DlChoiceOption[] = [
  { value: 'quiet', label: '安静' },
  { value: 'balanced', label: '均衡' },
  { value: 'active', label: '活跃' },
]
const disabledSegmentItems: DlChoiceOption[] = [
  ...segmentItems.slice(0, 2),
  { value: 'active', label: '活跃', disabled: true },
  { value: 'focus', label: '专注' },
]
const shortRecords = Array.from({ length: 80 }, (_, index) => ({ id: index + 1, title: `构建记录 ${String(index + 1).padStart(3, '0')}`, status: index % 3 === 0 ? '已完成' : '等待同步' }))
const largeRecords = Array.from({ length: 1000 }, (_, index) => ({ id: index + 1, title: `归档条目 ${String(index + 1).padStart(4, '0')}`, status: index % 5 === 0 ? '有更新' : '已同步' }))
const virtualRecords = computed(() => props.scenario === 'large-data' ? largeRecords : props.scenario === 'empty' ? [] : shortRecords)

function record(item: unknown) {
  return item as { id: number; title: string; status: string }
}

const multiContent = computed(() => ({
  basic: {
    title: '在一个字段中选择多个结果',
    description: '选中结果留在浮层内继续操作，关闭后以标签紧凑回显。',
    code: vueSfc({ imports: ['DlMultiChoice', 'type DlMultiChoiceEntry'], script: `import { ref } from 'vue'\n\nconst value = ref(['vue'])\nconst options: DlMultiChoiceEntry[] = [\n  { value: 'vue', label: 'Vue 3' },\n  { value: 'dotnet', label: '.NET' },\n]`, template: `  <DlMultiChoice v-model="value" :options="options" clearable />` }),
    tips: ['适合同时选择多个结果，不会在每次选择后关闭。', 'clearable 同时清除所有已选值。'],
  },
  'grouped-search': {
    title: '分组、别名与键盘检索',
    description: '搜索名称、值、描述与关键词，并允许方向键移动高亮项。',
    code: vueSfc({ imports: ['DlMultiChoice'], script: `import { ref } from 'vue'\n\nconst value = ref<string[]>([])\nconst options = [\n  { label: '客户端', options: [{ value: 'vue', label: 'Vue 3', keywords: ['v3'] }] },\n  { label: '服务端', options: [{ value: 'dotnet', label: '.NET', keywords: ['csharp'] }] },\n]`, template: `  <DlMultiChoice v-model="value" :options="options" searchable />` }),
    tips: ['keywords 可保存缩写、拼音首字母或旧称。', '禁用项仍可展示，但不会进入键盘提交。'],
  },
  'tag-overflow': {
    title: '控制字段内的标签密度',
    description: '超过 max-tag-count 的结果合并为计数，避免表单行被撑高。',
    code: vueSfc({ imports: ['DlMultiChoice'], script: `import { ref } from 'vue'\n\nconst value = ref(['vue', 'dotnet', 'postgres'])`, template: `  <DlMultiChoice v-model="value" :options="options" :max-tag-count="1" />` }),
    tips: ['模型值不会被截断，只压缩触发器中的视觉回显。', '字段外可另行展示完整选择摘要。'],
  },
}[props.scenario] ?? {}) as { title: string; description: string; code: string; tips: string[] })

const segmentedContent = computed(() => ({
  basic: {
    title: '少量选项即时切换',
    description: '分段始终并列展示，适合高频互斥状态。',
    code: vueSfc({ imports: ['DlSegmented'], script: `import { ref } from 'vue'\n\nconst value = ref('balanced')\nconst items = [\n  { value: 'quiet', label: '安静' },\n  { value: 'balanced', label: '均衡' },\n  { value: 'active', label: '活跃' },\n]`, template: `  <DlSegmented v-model="value" :items="items" />` }),
    tips: ['使用方向键在可用分段间循环。', '值会在单次点击后立即更新。'],
  },
  sizes: {
    title: '尺寸与整行布局',
    description: '尺寸控制触达面积，block 让各分段均分容器宽度。',
    code: vueSfc({ imports: ['DlSegmented'], script: `import { ref } from 'vue'\n\nconst value = ref('balanced')`, template: `  <DlSegmented v-model="value" :items="items" size="sm" />\n  <DlSegmented v-model="value" :items="items" block />\n  <DlSegmented v-model="value" :items="items" size="lg" />` }),
    tips: ['紧凑工具栏使用 sm，触控卡片可使用 lg。', 'block 只改变宽度，不改变选项语义。'],
  },
  disabled: {
    title: '跳过不可用分段',
    description: '禁用项保留上下文，但鼠标和方向键都不会选中它。',
    code: vueSfc({ imports: ['DlSegmented'], script: `import { ref } from 'vue'\n\nconst value = ref('balanced')\nconst items = [\n  { value: 'quiet', label: '安静' },\n  { value: 'active', label: '活跃', disabled: true },\n  { value: 'focus', label: '专注' },\n]`, template: `  <DlSegmented v-model="value" :items="items" />` }),
    tips: ['禁用分段不能成为唯一默认值。', '整个控件不可用时使用 disabled。'],
  },
}[props.scenario] ?? {}) as { title: string; description: string; code: string; tips: string[] })

const virtualContent = computed(() => ({
  basic: {
    title: '只渲染当前可见窗口',
    description: '滚动条表达完整数据长度，DOM 只保留窗口附近的等高项目。',
    code: vueSfc({ imports: ['DlVirtualList'], script: `const items = Array.from({ length: 80 }, (_, id) => ({ id, title: \`记录 \${id + 1}\` }))`, template: `  <DlVirtualList :items="items" item-key="id" :estimated-item-height="52">\n    <template #item="{ item }">{{ item.title }}</template>\n  </DlVirtualList>` }),
    tips: ['项目必须保持相同高度。', 'item-key 应使用业务中的稳定标识。'],
  },
  'large-data': {
    title: '千条记录保持轻量渲染',
    description: 'overscan 在窗口上下预渲染少量项目，快速滚动时不易露白。',
    code: vueSfc({ imports: ['DlVirtualList'], script: `const items = Array.from({ length: 1000 }, (_, id) => ({ id, title: \`记录 \${id + 1}\` }))`, template: `  <DlVirtualList :items="items" item-key="id" :overscan="6" :viewport-height="360" />` }),
    tips: ['增加 overscan 会用更多 DOM 换取快速滚动稳定性。', '可通过实例方法 scrollToIndex 定位记录。'],
  },
  empty: {
    title: '明确的空结果反馈',
    description: '没有项目时不会创建滚动视口，并允许业务替换空状态。',
    code: vueSfc({ imports: ['DlVirtualList'], script: `const items: unknown[] = []`, template: `  <DlVirtualList :items="items">\n    <template #empty>没有符合条件的记录</template>\n  </DlVirtualList>` }),
    tips: ['空状态应说明原因或下一步。', '过滤结果恢复后，列表会自动重新计算高度。'],
  },
}[props.scenario] ?? {}) as { title: string; description: string; code: string; tips: string[] })

const content = computed(() => props.componentDefinition.id === 'multi-choice'
  ? multiContent.value
  : props.componentDefinition.id === 'segmented'
    ? segmentedContent.value
    : virtualContent.value)
</script>

<template>
  <DocExampleShell v-bind="content">
    <DlCard v-if="componentDefinition.id === 'multi-choice'" padding="lg" class="recommended-demo">
      <div><DlBadge tone="accent">PORTED FROM TODOMOE</DlBadge><h3>技术栈</h3><p>在同一个字段里检索并保留多个结果。</p></div>
      <DlMultiChoice v-model="selected" :options="groupedOptions" :searchable="scenario === 'grouped-search'" clearable :max-tag-count="scenario === 'tag-overflow' ? 1 : 3" placeholder="选择技术栈" />
      <small>当前值：{{ selected.join(' · ') || '未选择' }}</small>
    </DlCard>

    <DlCard v-else-if="componentDefinition.id === 'segmented'" padding="lg" class="recommended-demo">
      <div><DlBadge tone="accent">PORTED FROM TODOMOE</DlBadge><h3>通知强度</h3><p>当前状态和可切换状态同时可见。</p></div>
      <template v-if="scenario === 'sizes'">
        <DlSegmented v-model="segment" :items="segmentItems" size="sm" />
        <DlSegmented v-model="segment" :items="segmentItems" block />
        <DlSegmented v-model="segment" :items="segmentItems" size="lg" />
      </template>
      <DlSegmented v-else v-model="segment" :items="scenario === 'disabled' ? disabledSegmentItems : segmentItems" />
      <small>当前值：{{ segment }}</small>
    </DlCard>

    <DlCard v-else padding="lg" class="recommended-demo virtual-demo">
      <div><DlBadge tone="accent">PORTED FROM TODOMOE</DlBadge><h3>同步记录</h3><p>{{ virtualRecords.length }} 条数据，页面中只保留可见项目。</p></div>
      <DlVirtualList :items="virtualRecords" item-key="id" :estimated-item-height="52" :viewport-height="scenario === 'large-data' ? 360 : 260" :overscan="6" aria-label="同步记录">
        <template #item="{ item, index }"><span><b>{{ record(item).title }}</b><small>#{{ index + 1 }} · {{ record(item).status }}</small></span></template>
        <template #empty><span>没有符合当前条件的记录</span></template>
      </DlVirtualList>
    </DlCard>
  </DocExampleShell>
</template>

<style scoped>
.recommended-demo { display: grid; gap: 18px; max-width: 720px; }
.recommended-demo > div { display: grid; gap: 7px; }
.recommended-demo h3, .recommended-demo p { margin: 0; }
.recommended-demo p, .recommended-demo > small { color: var(--dl-text-muted); }
.virtual-demo { max-width: 820px; }
.virtual-demo :deep([data-slot='virtual-list-item'] > span) { display: flex; height: 100%; align-items: center; justify-content: space-between; gap: 16px; padding: 0 16px; }
.virtual-demo :deep([data-slot='virtual-list-item'] small) { color: var(--dl-text-faint); }
</style>
