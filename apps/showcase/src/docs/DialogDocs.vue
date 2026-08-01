<script setup lang="ts">
import { computed, ref } from 'vue'
import { DlBadge, DlButton, DlDialog, DlInput, DlSelect, type DlSelectOption } from '@dragon-liquid/vue'
import DocExampleShell from '../components/DocExampleShell.vue'
import { vueSfc } from './exampleCode'

const props = defineProps<{ scenario: string }>()
const basicOpen = ref(false)
const createOpen = ref(false)
const deleteOpen = ref(false)
const title = ref('来自深渊')
const status = ref('planned')
const statusOptions: DlSelectOption[] = [{ value: 'planned', label: '等待观看' }, { value: 'watching', label: '正在观看' }, { value: 'completed', label: '已经看完' }]

const content = computed(() => ({
  basic: {
    title: '模态浮层基础行为',
    description: 'Dialog 管理焦点锁定、Esc 关闭、遮罩交互和标题描述语义。',
    code: vueSfc({ imports: ['DlButton', 'DlDialog'], script: `import { ref } from 'vue'\n\nconst open = ref(false)`, template: `  <DlButton @click="open = true">打开对话框</DlButton>\n  <DlDialog\n    v-model:open="open"\n    title="对话框标题"\n    description="补充说明"\n  >\n    <p>这里是需要用户聚焦处理的内容。</p>\n    <template #footer>\n      <DlButton variant="ghost" @click="open = false">取消</DlButton>\n      <DlButton @click="open = false">完成</DlButton>\n    </template>\n  </DlDialog>` }),
    tips: ['打开后焦点应进入对话框，关闭后返回触发元素。', '不要用 Dialog 承载长篇阅读内容或复杂多步流程。'],
  },
  'create-record': {
    title: '创建收藏记录',
    description: '适合字段较少、上下文明确的小型创建流程。',
    code: vueSfc({ imports: ['DlButton', 'DlDialog', 'DlInput', 'DlSelect', 'type DlSelectOption'], script: `import { ref } from 'vue'\n\nconst open = ref(false)\nconst title = ref('')\nconst status = ref('planned')\nconst statusOptions: DlSelectOption[] = [\n  { value: 'planned', label: '计划观看' },\n  { value: 'watching', label: '正在观看' },\n]`, template: `  <DlButton @click="open = true">收录新作品</DlButton>\n  <DlDialog v-model:open="open" title="收录新作品" size="md">\n    <div class="form">\n      <DlInput v-model="title" placeholder="作品标题" />\n      <DlSelect v-model="status" :options="statusOptions" />\n    </div>\n    <template #footer>\n      <DlButton variant="ghost" @click="open = false">取消</DlButton>\n      <DlButton @click="open = false">确认收录</DlButton>\n    </template>\n  </DlDialog>`, style: `.form { display: grid; gap: 12px; }` }),
    tips: ['表单内容超过一个屏幕时优先使用独立页面。', '提交成功后关闭浮层，并在原页面提供结果反馈。'],
  },
  'delete-confirm': {
    title: '删除确认',
    description: '明确指出将被删除的对象、不可逆后果以及安全的取消路径。',
    code: vueSfc({ imports: ['DlButton', 'DlDialog'], script: `import { ref } from 'vue'\n\nconst open = ref(false)\nfunction remove() {\n  console.log('removed')\n  open.value = false\n}`, template: `  <DlButton variant="danger" @click="open = true">移出收藏</DlButton>\n  <DlDialog v-model:open="open" title="移出收藏">\n    <p>确定移除《来自深渊》吗？该操作无法撤销。</p>\n    <template #footer>\n      <DlButton variant="secondary" @click="open = false">保留作品</DlButton>\n      <DlButton variant="danger" @click="remove">确认移除</DlButton>\n    </template>\n  </DlDialog>` }),
    tips: ['默认焦点优先放在安全操作上。', '危险按钮文案应描述动作，不使用模糊的“确定”。'],
  },
}[props.scenario] ?? {} as { title: string; description: string; code: string; tips: string[] }))
</script>

<template>
  <DocExampleShell v-bind="content">
    <div v-if="scenario === 'basic'" class="dialog-trigger-grid">
      <div v-for="size in (['sm', 'md', 'lg'] as const)" :key="size"><span>{{ size.toUpperCase() }}</span><p>{{ size === 'sm' ? '确认与简短反馈' : size === 'md' ? '小型表单与配置' : '较宽内容与预览' }}</p><DlButton variant="secondary" @click="basicOpen = true">打开 {{ size }}</DlButton></div>
      <DlDialog v-model:open="basicOpen" title="Dragon Liquid Dialog" description="这是一个具备完整无障碍语义的基础对话框。" size="sm"><div class="dialog-inline-demo"><span>龍</span><p>按下 Esc、点击遮罩或关闭按钮都可以离开。</p></div><template #footer><DlButton variant="ghost" @click="basicOpen = false">取消</DlButton><DlButton @click="basicOpen = false">完成</DlButton></template></DlDialog>
    </div>

    <div v-else-if="scenario === 'create-record'" class="center-trigger"><DlButton size="lg" @click="createOpen = true"><template #leading>＋</template>收录新作品</DlButton>
      <DlDialog v-model:open="createOpen" title="收录新作品" description="填写最基本的信息，之后可以继续完善资料。" size="md"><div class="dialog-form"><label class="scenario-field"><span>作品标题</span><DlInput v-model="title" /></label><label class="scenario-field"><span>观看状态</span><DlSelect v-model="status" :options="statusOptions" /></label></div><template #footer><DlButton variant="ghost" @click="createOpen = false">取消</DlButton><DlButton @click="createOpen = false">确认收录</DlButton></template></DlDialog>
    </div>

    <div v-else class="center-trigger"><DlButton variant="danger" size="lg" @click="deleteOpen = true">移出收藏</DlButton>
      <DlDialog v-model:open="deleteOpen" title="移出收藏" description="这个操作无法撤销。" size="sm"><div class="delete-dialog-content"><span>!</span><h3>确定移除《来自深渊》吗？</h3><p>作品资料、观看进度和个人标签都将被永久删除。</p></div><template #footer><DlButton variant="secondary" @click="deleteOpen = false">保留作品</DlButton><DlButton variant="danger" @click="deleteOpen = false">确认移除</DlButton></template></DlDialog>
    </div>
  </DocExampleShell>
</template>
