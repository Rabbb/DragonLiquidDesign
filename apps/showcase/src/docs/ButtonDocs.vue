<script setup lang="ts">
import { computed, ref } from 'vue'
import { DlBadge, DlButton, DlCard, DlInput } from '@dragon-liquid/vue'
import DocExampleShell from '../components/DocExampleShell.vue'
import { vueSfc } from './exampleCode'

const props = defineProps<{ scenario: string }>()
const loading = ref(false)
const projectName = ref('Isekai Archive')

const content = computed(() => ({
  basic: {
    title: '按钮的层级与状态',
    description: '使用 variant 表达动作优先级，size 只负责空间密度，不改变语义。',
    code: vueSfc({ imports: ['DlButton'], template: `  <div class="actions">\n    <DlButton>主要操作</DlButton>\n    <DlButton variant="secondary">次级操作</DlButton>\n    <DlButton variant="ghost">轻量操作</DlButton>\n    <DlButton variant="danger">危险操作</DlButton>\n  </div>`, style: `.actions { display: flex; flex-wrap: wrap; gap: 12px; }` }),
    tips: ['一个操作区域通常只保留一个 primary 按钮。', 'loading 会同时禁用按钮并向辅助技术暴露 aria-busy。'],
  },
  'form-submit': {
    title: '表单提交与异步反馈',
    description: '提交期间保持按钮文案稳定，并用 loading 明确表达处理中状态。',
    code: vueSfc({ imports: ['DlButton'], script: `import { ref } from 'vue'\n\nconst saving = ref(false)\nasync function save() {\n  saving.value = true\n  await new Promise(resolve => setTimeout(resolve, 800))\n  saving.value = false\n}`, template: `  <DlButton :loading="saving" @click="save">\n    {{ saving ? '正在保存' : '保存项目' }}\n  </DlButton>` }),
    tips: ['异步操作结束前阻止重复提交。', '取消操作使用 secondary 或 ghost，避免与提交按钮争夺注意力。'],
  },
  'danger-zone': {
    title: '危险操作区',
    description: '不可逆操作应与常规动作分离，并在按钮附近说明具体影响。',
    code: vueSfc({ imports: ['DlButton'], script: `function removeProject() {\n  if (window.confirm('确定永久删除项目吗？')) {\n    console.log('project removed')\n  }\n}`, template: `  <DlButton variant="danger" @click="removeProject">\n    永久删除项目\n  </DlButton>` }),
    tips: ['不要只使用红色表达危险，按钮文字必须说明后果。', '高风险操作应再配合 Dialog 完成二次确认。'],
  },
}[props.scenario] ?? {} as { title: string; description: string; code: string; tips: string[] }))

async function save() {
  loading.value = true
  await new Promise(resolve => window.setTimeout(resolve, 1400))
  loading.value = false
}
</script>

<template>
  <DocExampleShell v-bind="content">
    <div v-if="scenario === 'basic'" class="case-stack">
      <div class="case-row">
        <DlButton><template #leading>✦</template>主要操作</DlButton>
        <DlButton variant="secondary">次级操作</DlButton>
        <DlButton variant="ghost">轻量操作</DlButton>
        <DlButton variant="danger">危险操作</DlButton>
      </div>
      <div class="case-row align-end">
        <DlButton size="sm">Small</DlButton><DlButton size="md">Medium</DlButton><DlButton size="lg">Large</DlButton>
        <DlButton loading>加载中</DlButton><DlButton disabled>不可用</DlButton>
      </div>
    </div>

    <DlCard v-else-if="scenario === 'form-submit'" padding="lg" class="scenario-form-card">
      <div class="scenario-card-heading"><span>01</span><div><b>项目设置</b><small>修改项目的显示名称</small></div></div>
      <label class="scenario-field"><span>项目名称</span><DlInput v-model="projectName" /></label>
      <div class="scenario-actions"><DlButton variant="ghost">取消</DlButton><DlButton :loading="loading" @click="save">{{ loading ? '正在保存' : '保存项目' }}</DlButton></div>
    </DlCard>

    <DlCard v-else padding="lg" class="danger-zone-card">
      <div><DlBadge tone="danger" variant="solid">DANGER ZONE</DlBadge><h3>永久删除组件草稿</h3><p>删除后，相关预览链接和历史版本都将失效，此操作无法撤销。</p></div>
      <DlButton variant="danger"><template #leading>×</template>永久删除</DlButton>
    </DlCard>
  </DocExampleShell>
</template>
