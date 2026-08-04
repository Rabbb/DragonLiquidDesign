<script setup lang="ts">
import { computed, ref } from 'vue'
import { DlBadge, DlButton, DlCard, DlInput } from '@dragon-liquid/vue'
import DocExampleShell from '../components/DocExampleShell.vue'
import { vueSfc } from './exampleCode'

const props = defineProps<{ scenario: string }>()
const smallValue = ref('来自深渊')
const mediumValue = ref('葬送的芙莉莲')
const largeValue = ref('Dragon Liquid')
const search = ref('')
const email = ref('designer@dragon.dev')
const username = ref('dragon liquid!')

const content = computed(() => ({
  basic: {
    title: '输入框尺寸与插槽',
    description: '展示三种常用尺寸、前后置内容和禁用状态；字段标题由业务层的 label 提供。',
    code: vueSfc({
      imports: ['DlInput'],
      script: `import { ref } from 'vue'\n\nconst small = ref('来自深渊')\nconst medium = ref('葬送的芙莉莲')\nconst large = ref('Dragon Liquid')`,
      template: `  <div class="input-grid">
    <label>
      <span>Small</span>
      <DlInput v-model="small" size="sm">
        <template #leading>⌕</template>
      </DlInput>
    </label>

    <label>
      <span>Medium</span>
      <DlInput v-model="medium">
        <template #leading>✦</template>
        <template #trailing>12</template>
      </DlInput>
    </label>

    <label>
      <span>Large</span>
      <DlInput v-model="large" size="lg">
        <template #leading>◇</template>
      </DlInput>
    </label>

    <label>
      <span>Disabled</span>
      <DlInput model-value="不可编辑" disabled />
    </label>
  </div>`,
      style: `.input-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.input-grid label { display: grid; gap: 8px; min-width: 0; }
.input-grid label > span { color: #a9b9b0; font-size: .78rem; font-weight: 700; }
@media (max-width: 640px) { .input-grid { grid-template-columns: 1fr; } }`,
    }),
    tips: ['可见标签应放在输入框外，并通过包裹或 for/id 与原生 input 关联。', '前后置插槽只补充上下文，不应取代字段标签。'],
  },
  'global-search': {
    title: '全局搜索入口',
    description: '在宽输入框中组合搜索图标、占位提示和键盘快捷键信息。',
    code: vueSfc({ imports: ['DlInput'], script: `import { ref } from 'vue'\n\nconst query = ref('')`, template: `  <DlInput v-model="query" size="lg" placeholder="搜索组件、场景或 API">
    <template #leading>⌕</template>
    <template #trailing><kbd>⌘ K</kbd></template>
  </DlInput>` }),
    tips: ['搜索结果应在输入防抖后更新。', '快捷键只是增强体验，所有用户都必须能通过普通交互进入搜索。'],
  },
  'form-validation': {
    title: '表单校验状态',
    description: 'status 改变边界反馈；错误原因仍由紧邻字段的可读文本说明。',
    code: vueSfc({ imports: ['DlButton', 'DlInput'], script: `import { ref } from 'vue'\n\nconst email = ref('hello@example.com')\nconst username = ref('无效 名称')`, template: `  <form class="fields" @submit.prevent>
    <label>
      <span>联系邮箱</span>
      <DlInput v-model="email" status="success" type="email" />
      <small>邮箱格式正确。</small>
    </label>
    <label>
      <span>用户名</span>
      <DlInput v-model="username" status="error" />
      <small role="alert">用户名只能包含字母、数字和连字符。</small>
    </label>
    <DlButton variant="primary" type="submit">保存账户信息</DlButton>
  </form>`, style: `.fields, .fields label { display: grid; gap: 12px; }
.fields small { color: #a9b9b0; }
.fields [role='alert'] { color: #fca5a5; }
.fields button { justify-self: end; }` }),
    tips: ['不要在用户尚未完成输入时过早展示错误。', '错误文本使用 role=alert 时，避免在每次按键时频繁播报。'],
  },
}[props.scenario] ?? {} as { title: string; description: string; code: string; tips: string[] }))
</script>

<template>
  <DocExampleShell v-bind="content">
    <div v-if="scenario === 'basic'" class="input-size-stack">
      <label class="input-demo-field"><span>Small</span><DlInput v-model="smallValue" size="sm"><template #leading>⌕</template></DlInput></label>
      <label class="input-demo-field"><span>Medium</span><DlInput v-model="mediumValue"><template #leading>✦</template><template #trailing>12</template></DlInput></label>
      <label class="input-demo-field"><span>Large</span><DlInput v-model="largeValue" size="lg"><template #leading>◇</template></DlInput></label>
      <label class="input-demo-field"><span>Disabled</span><DlInput model-value="不可编辑" disabled /></label>
    </div>

    <div v-else-if="scenario === 'global-search'" class="search-scenario">
      <DlCard padding="lg" class="search-command-card">
        <DlInput v-model="search" size="lg" placeholder="搜索组件、场景或 API..."><template #leading>⌕</template><template #trailing><kbd>⌘ K</kbd></template></DlInput>
        <div class="search-suggestions"><small>{{ search ? '匹配结果' : '热门搜索' }}</small><span><DlBadge tone="accent">Button</DlBadge><DlBadge>Select</DlBadge><DlBadge>Dialog focus</DlBadge></span></div>
      </DlCard>
    </div>

    <DlCard v-else padding="lg" class="validation-form-card">
      <label class="scenario-field"><span>联系邮箱 <i>校验成功</i></span><DlInput v-model="email" status="success"><template #trailing>✓</template></DlInput><small>我们会把发布通知发送到这个地址。</small></label>
      <label class="scenario-field error-field"><span>用户名 <em>需要修改</em></span><DlInput v-model="username" status="error"><template #trailing>!</template></DlInput><small role="alert">用户名只能包含字母、数字和连字符。</small></label>
      <DlButton variant="primary">保存账户信息</DlButton>
    </DlCard>
  </DocExampleShell>
</template>

<style scoped>
.input-size-stack { width: min(100%, 760px); margin-inline: auto; grid-template-columns: repeat(2, minmax(0, 1fr)); align-items: start; }
.input-demo-field { display: grid; min-width: 0; gap: 8px; }
.input-demo-field > span { color: var(--dl-text-muted); font-size: .72rem; font-weight: 800; }
.input-demo-field [data-slot='input'] { width: 100%; }
@media (max-width: 720px) { .input-size-stack { grid-template-columns: 1fr; } }
</style>
