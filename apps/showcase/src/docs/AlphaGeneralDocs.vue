<script setup lang="ts">
import { computed, ref } from 'vue'
import { DlButton, DlDrawer, DlTree, type DlTreeNode } from '@dragon-liquid/vue'
import type { ComponentDefinition } from '../catalog'
import DocExampleShell from '../components/DocExampleShell.vue'
import { vueSfc } from './exampleCode'

const props = defineProps<{ scenario: string; componentDefinition: ComponentDefinition }>()
const drawerOpen = ref(false)
const expanded = ref(['library'])
const selected = ref<DlTreeNode | DlTreeNode[]>()
const nodes: DlTreeNode[] = [{ id: 'library', label: '动漫收藏', children: [{ id: 'watching', label: '正在观看', description: '12 部作品' }, { id: 'completed', label: '已经看完', description: '86 部作品' }] }, { id: 'settings', label: '系统设置' }]
const code = computed(() => props.componentDefinition.id === 'drawer'
  ? vueSfc({ imports: ['DlButton', 'DlDrawer'], script: `import { ref } from 'vue'\n\nconst open = ref(false)`, template: `  <DlButton @click="open = true">打开抽屉</DlButton>\n  <DlDrawer\n    v-model:open="open"\n    title="编辑收藏"\n    description="从屏幕边缘进入的任务面板"\n  >\n    <p>抽屉内容</p>\n  </DlDrawer>` })
  : vueSfc({ imports: ['DlTree', 'type DlTreeNode'], script: `import { ref } from 'vue'\n\nconst expanded = ref(['library'])\nconst selected = ref<DlTreeNode>()\nconst nodes: DlTreeNode[] = [\n  {\n    id: 'library',\n    label: '动漫收藏',\n    children: [\n      { id: 'watching', label: '正在观看' },\n      { id: 'completed', label: '已经看完' },\n    ],\n  },\n]`, template: `  <DlTree\n    v-model="selected"\n    v-model:expanded="expanded"\n    :items="nodes"\n  />` }))
const content = computed(() => ({ title: `${props.componentDefinition.name} · Alpha 先行体验`, description: props.componentDefinition.summary, code: code.value, tips: ['先行组件保留清晰的 Alpha 标记，但不是占位页。', '示例包含完整的状态、类型和模板，可直接复制。'] }))
</script>

<template>
  <DocExampleShell v-bind="content"><div class="alpha-general-demo">
    <template v-if="componentDefinition.id === 'drawer'"><DlButton @click="drawerOpen = true">打开编辑抽屉</DlButton><DlDrawer v-model:open="drawerOpen" title="编辑收藏" description="从屏幕边缘进入的任务面板"><p>这里可以放置作品状态、标签和个人笔记表单。</p></DlDrawer></template>
    <DlTree v-else v-model="selected" v-model:expanded="expanded" :items="nodes" />
  </div></DocExampleShell>
</template>

<style scoped>.alpha-general-demo { width: min(100%, 680px); margin: 0 auto; padding: 1rem; color: var(--dl-text-muted); }</style>
