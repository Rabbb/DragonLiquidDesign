<script setup lang="ts">
import { computed } from 'vue'
import { DlBadge, DlButton, DlCard } from '@dragon-liquid/vue'
import DocExampleShell from '../components/DocExampleShell.vue'
import { vueSfc } from './exampleCode'

const props = defineProps<{ scenario: string }>()
const content = computed(() => ({
  basic: {
    title: '容器与交互状态',
    description: 'Card 只负责组织关联内容；interactive 用于整个卡片确实可点击的情况。',
    code: vueSfc({ imports: ['DlCard'], template: `  <div class="cards">\n    <DlCard padding="md">静态内容</DlCard>\n    <DlCard padding="lg" interactive>可交互内容</DlCard>\n  </div>`, style: `.cards { display: grid; gap: 16px; }` }),
    tips: ['卡片内边距由 padding 统一控制。', '若卡片内含多个独立按钮，不要把整个卡片标记为 interactive。'],
  },
  'data-overview': {
    title: '仪表盘数据概览',
    description: '使用一致的卡片结构承载指标、趋势和补充信息。',
    code: vueSfc({ imports: ['DlCard'], template: `  <DlCard padding="md" class="metric-card">\n    <strong>1,284</strong>\n    <span>本月访问</span>\n  </DlCard>`, style: `.metric-card { display: grid; gap: 4px; }\n.metric-card strong { font-size: 2rem; }` }),
    tips: ['同一组指标卡保持相同高度和信息顺序。', '趋势色彩需要配合正负号或箭头，不能只靠颜色。'],
  },
  'media-collection': {
    title: '媒体收藏卡片',
    description: '组合封面、状态、标题、简介和操作，形成可扫描的内容单元。',
    code: vueSfc({ imports: ['DlCard'], script: `const cover = '/covers/made-in-abyss.webp'`, template: `  <DlCard padding="none" interactive class="media-card">\n    <img :src="cover" alt="《来自深渊》作品封面" />\n    <div class="content">\n      <h2>来自深渊</h2>\n      <p>奇幻冒险 · 正在观看</p>\n    </div>\n  </DlCard>`, style: `.media-card { display: grid; grid-template-columns: 120px 1fr; }\n.media-card img { width: 100%; height: 100%; object-fit: cover; }\n.content { padding: 16px; }` }),
    tips: ['封面必须提供替代文本或明确标记为装饰。', '简介限制行数，详情放到独立页面或 Dialog。'],
  },
}[props.scenario] ?? {} as { title: string; description: string; code: string; tips: string[] }))
</script>

<template>
  <DocExampleShell v-bind="content">
    <div v-if="scenario === 'basic'" class="card-variant-grid">
      <DlCard padding="sm"><DlBadge tone="muted">SM</DlBadge><h3>紧凑卡片</h3><p>适合工具条与简短提示。</p></DlCard>
      <DlCard padding="md"><DlBadge tone="accent">MD</DlBadge><h3>默认卡片</h3><p>适合常规内容分组。</p></DlCard>
      <DlCard padding="lg" interactive><DlBadge tone="success">INTERACTIVE</DlBadge><h3>可交互卡片</h3><p>悬停时呈现空间反馈。</p></DlCard>
    </div>

    <div v-else-if="scenario === 'data-overview'" class="dashboard-card-grid">
      <DlCard v-for="metric in [['1,284','本月访问','↑ 12.4%'],['68','活跃项目','↑ 5.2%'],['99.96%','可用性','稳定'],['142 ms','响应时间','↓ 18 ms']]" :key="metric[1]" padding="md">
        <small>{{ metric[1] }}</small><strong>{{ metric[0] }}</strong><DlBadge :tone="metric[2] === '稳定' ? 'accent' : 'success'">{{ metric[2] }}</DlBadge>
      </DlCard>
    </div>

    <div v-else class="media-card-row">
      <DlCard v-for="item in [['葬送的芙莉莲','旅途之后，理解人与时间。','已看完'],['无职转生','从零开始的异世界人生。','观看中']]" :key="item[0]" padding="none" interactive class="media-demo-card">
        <div class="media-cover"><span>{{ item[0].slice(0, 1) }}</span></div>
        <div class="media-body"><DlBadge :tone="item[2] === '已看完' ? 'success' : 'accent'">{{ item[2] }}</DlBadge><h3>{{ item[0] }}</h3><p>{{ item[1] }}</p><DlButton variant="ghost" size="sm">查看资料 →</DlButton></div>
      </DlCard>
    </div>
  </DocExampleShell>
</template>
