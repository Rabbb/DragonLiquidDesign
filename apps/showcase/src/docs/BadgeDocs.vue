<script setup lang="ts">
import { computed } from 'vue'
import { DlBadge, DlCard } from '@dragon-liquid/vue'
import DocExampleShell from '../components/DocExampleShell.vue'
import { vueSfc } from './exampleCode'

const props = defineProps<{ scenario: string }>()
const content = computed(() => ({
  basic: {
    title: '徽标的色调与外观',
    description: 'tone 对应语义，variant 决定视觉强度。状态文案应短而明确。',
    code: vueSfc({ imports: ['DlBadge'], template: `  <div class="badges">
    <DlBadge tone="default">Default</DlBadge>
    <DlBadge tone="accent">Accent</DlBadge>
    <DlBadge tone="success">Success</DlBadge>
    <DlBadge tone="warning">Warning</DlBadge>
    <DlBadge tone="danger">Danger</DlBadge>
    <DlBadge tone="muted">Muted</DlBadge>
  </div>`, style: `.badges { display: flex; flex-wrap: wrap; gap: 8px; }` }),
    tips: ['徽标不应承担主要操作。', '长句或解释性内容应放到正文，而不是塞进徽标。'],
  },
  'content-status': {
    title: '内容发布状态',
    description: '在内容列表中保持状态语言一致，让用户快速识别可见性与处理进度。',
    code: vueSfc({ imports: ['DlBadge'], template: `  <div class="badges">\n    <DlBadge tone="success">已发布</DlBadge>\n    <DlBadge tone="warning">审核中</DlBadge>\n    <DlBadge tone="muted">草稿</DlBadge>\n  </div>`, style: `.badges { display: flex; flex-wrap: wrap; gap: 8px; }` }),
    tips: ['同一业务状态始终使用同一 tone。', '异常状态使用 danger，但不要让整个列表充满高饱和红色。'],
  },
  'active-filters': {
    title: '已生效的数据筛选',
    description: '把当前查询条件呈现为轻量徽标，帮助用户理解列表为什么发生变化。',
    code: vueSfc({ imports: ['DlBadge'], template: `  <div class="filters">\n    <DlBadge tone="accent" variant="outline">类型：TV ×</DlBadge>\n    <DlBadge tone="default" variant="outline">年份：2024 ×</DlBadge>\n  </div>`, style: `.filters { display: flex; flex-wrap: wrap; gap: 8px; }` }),
    tips: ['可移除筛选条件时，为关闭动作提供清晰的无障碍标签。', '筛选徽标属于状态摘要，不替代完整筛选控件。'],
  },
}[props.scenario] ?? {} as { title: string; description: string; code: string; tips: string[] }))
</script>

<template>
  <DocExampleShell v-bind="content">
    <div v-if="scenario === 'basic'" class="badge-showcase-grid">
      <div v-for="variant in (['soft', 'outline', 'solid'] as const)" :key="variant">
        <small>{{ variant }}</small>
        <span>
          <DlBadge tone="default" :variant="variant">Default</DlBadge><DlBadge tone="accent" :variant="variant">Accent</DlBadge>
          <DlBadge tone="success" :variant="variant">Success</DlBadge><DlBadge tone="warning" :variant="variant">Warning</DlBadge>
          <DlBadge tone="danger" :variant="variant">Danger</DlBadge><DlBadge tone="muted" :variant="variant">Muted</DlBadge>
        </span>
      </div>
    </div>

    <div v-else-if="scenario === 'content-status'" class="status-list">
      <DlCard v-for="item in [
        ['组件发布说明', '已发布', 'success'], ['Dialog 焦点规范', '审核中', 'warning'], ['Select 移动端方案', '草稿', 'muted'], ['旧版颜色令牌', '已停用', 'danger'],
      ]" :key="item[0]" padding="md">
        <span class="file-symbol">◇</span><div><b>{{ item[0] }}</b><small>最后编辑于今天</small></div><DlBadge :tone="item[2] as any">{{ item[1] }}</DlBadge>
      </DlCard>
    </div>

    <DlCard v-else padding="lg" class="filter-summary-card">
      <div><b>当前筛选</b><small>12 个结果</small></div>
      <span><DlBadge tone="accent" variant="outline">类型：TV　×</DlBadge><DlBadge variant="outline">年份：2024　×</DlBadge><DlBadge tone="success" variant="outline">状态：已看完　×</DlBadge></span>
    </DlCard>
  </DocExampleShell>
</template>
