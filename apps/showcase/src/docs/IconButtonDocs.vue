<script setup lang="ts">
import { computed } from 'vue'
import { DlBadge, DlCard, DlIconButton } from '@dragon-liquid/vue'
import DocExampleShell from '../components/DocExampleShell.vue'
import { vueSfc } from './exampleCode'

const props = defineProps<{ scenario: string }>()
const content = computed(() => ({
  basic: {
    title: '紧凑操作与无障碍标签',
    description: 'IconButton 始终要求 label，即使图标在视觉上看起来足够直观。',
    code: vueSfc({ imports: ['DlIconButton'], template: `  <div class="actions">\n    <DlIconButton label="收藏">☆</DlIconButton>\n    <DlIconButton label="编辑" variant="ghost">✎</DlIconButton>\n  </div>`, style: `.actions { display: flex; gap: 8px; }` }),
    tips: ['图标按钮必须传入可理解的 label。', '不要在同一工具栏混用意义相同但图形不同的图标。'],
  },
  'editor-toolbar': {
    title: '编辑器格式工具栏',
    description: '将同类操作成组排列，并通过 aria-label 保持键盘与读屏体验。',
    code: vueSfc({ imports: ['DlIconButton'], template: `  <div class="toolbar" role="toolbar" aria-label="文字格式">\n    <DlIconButton label="加粗">B</DlIconButton>\n    <DlIconButton label="斜体">I</DlIconButton>\n  </div>`, style: `.toolbar { display: flex; gap: 4px; }` }),
    tips: ['工具栏本身应提供可读名称。', '选中状态需要额外的 pressed 语义；当前版本可由消费方补充。'],
  },
  'card-actions': {
    title: '卡片快捷操作',
    description: '在内容卡片上提供收藏、编辑和移除操作，危险动作保持清晰区分。',
    code: vueSfc({ imports: ['DlIconButton'], template: `  <div class="actions">\n    <DlIconButton label="收藏作品">☆</DlIconButton>\n    <DlIconButton label="编辑资料" variant="ghost">✎</DlIconButton>\n    <DlIconButton label="移出收藏" variant="danger">×</DlIconButton>\n  </div>`, style: `.actions { display: flex; gap: 8px; }` }),
    tips: ['label 应包含操作对象，例如“删除项目”而非仅“删除”。', '危险操作通常仍需 Dialog 二次确认。'],
  },
}[props.scenario] ?? {} as { title: string; description: string; code: string; tips: string[] }))
</script>

<template>
  <DocExampleShell v-bind="content">
    <div v-if="scenario === 'basic'" class="icon-button-matrix">
      <div v-for="variant in (['primary', 'secondary', 'ghost', 'danger'] as const)" :key="variant"><small>{{ variant }}</small><span><DlIconButton label="小尺寸" :variant="variant" size="sm">✦</DlIconButton><DlIconButton label="中尺寸" :variant="variant">✦</DlIconButton><DlIconButton label="大尺寸" :variant="variant" size="lg">✦</DlIconButton></span></div>
    </div>

    <DlCard v-else-if="scenario === 'editor-toolbar'" padding="sm" class="editor-toolbar-card">
      <div role="toolbar" aria-label="文字格式" class="editor-toolbar"><DlIconButton label="撤销" variant="ghost">↶</DlIconButton><i /><DlIconButton label="加粗" variant="secondary"><b>B</b></DlIconButton><DlIconButton label="斜体" variant="ghost"><em>I</em></DlIconButton><DlIconButton label="下划线" variant="ghost"><u>U</u></DlIconButton><i /><DlIconButton label="插入链接" variant="ghost">⌁</DlIconButton><DlIconButton label="更多选项" variant="ghost">•••</DlIconButton></div>
      <div class="editor-canvas"><h3>设计系统的可组合性</h3><p>一致的组件接口，让产品团队能够把精力放在真实问题上。</p></div>
    </DlCard>

    <DlCard v-else padding="none" class="quick-action-card">
      <div class="quick-action-visual">DL</div><div><DlBadge tone="accent">DESIGN SYSTEM</DlBadge><h3>Dragon Liquid Design</h3><p>Vue 3 液态玻璃组件库</p></div><span><DlIconButton label="收藏组件库">☆</DlIconButton><DlIconButton label="编辑组件库" variant="ghost">✎</DlIconButton><DlIconButton label="删除组件库" variant="danger">×</DlIconButton></span>
    </DlCard>
  </DocExampleShell>
</template>
