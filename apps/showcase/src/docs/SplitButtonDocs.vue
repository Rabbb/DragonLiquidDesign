<script setup lang="ts">
import { computed, ref } from 'vue'
import { DlBadge, DlCard, DlSplitButton, type DlMenuItem } from '@dragon-liquid/vue'
import DocExampleShell from '../components/DocExampleShell.vue'
import { vueSfc } from './exampleCode'

const props = defineProps<{ scenario: string }>()
const result = ref('等待操作')
const items: DlMenuItem[] = [
  { value: 'edit', label: '编辑项目' },
  { value: 'duplicate', label: '复制配置' },
  { value: 'separator', label: '', separator: true },
  { value: 'delete', label: '删除项目' },
]

const content = computed(() => ({
  title: '明确的主操作与收敛的相关操作',
  description: '主按钮保持直接执行，右侧 SVG 箭头只负责打开菜单；两个区域共享轮廓、状态和尺寸。',
  code: vueSfc({ imports: ['DlSplitButton', 'type DlMenuItem'], script: `const items: DlMenuItem[] = [
  { value: 'edit', label: '编辑项目' },
  { value: 'delete', label: '删除项目' },
]`, template: `  <DlSplitButton
    label="启动"
    variant="primary"
    size="sm"
    :items="items"
    menu-label="项目操作"
    @click="startProject"
    @select="handleAction"
  />` }),
  tips: ['主区域始终执行高频动作，箭头区域只展开相关次级动作。', '只需禁用主动作时使用 main-disabled，菜单仍可用于编辑、删除或查看配置。'],
}))

function selectAction(value: string) {
  result.value = items.find(item => item.value === value)?.label ?? value
}
</script>

<template>
  <DocExampleShell v-bind="content">
    <DlCard padding="lg" class="split-button-demo">
      <div class="split-button-row">
        <DlSplitButton label="启动" variant="primary" size="sm" :items="items" menu-label="项目操作" @click="result = '启动项目'" @select="selectAction" />
        <DlSplitButton label="发布" variant="primary" :items="items" menu-label="发布选项" @click="result = '立即发布'" @select="selectAction" />
        <DlSplitButton label="运行中" variant="secondary" size="lg" :items="items" main-disabled menu-label="运行中项目操作" @select="selectAction" />
      </div>
      <div class="split-button-result"><DlBadge tone="accent">LAST ACTION</DlBadge><span>{{ result }}</span></div>
    </DlCard>
  </DocExampleShell>
</template>

<style scoped>
.split-button-demo { display: grid; gap: 22px; }
.split-button-row { display: flex; flex-wrap: wrap; align-items: center; gap: 18px; }
.split-button-result { display: flex; align-items: center; gap: 10px; min-height: 40px; padding-top: 16px; border-top: 1px solid var(--dl-border); color: var(--dl-text-muted); font-size: 0.84rem; }
</style>
