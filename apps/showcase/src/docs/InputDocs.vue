<script setup lang="ts">
import { computed, ref } from 'vue'
import { DlBadge, DlButton, DlCard, DlInput } from '@dragon-liquid/vue'
import DocExampleShell from '../components/DocExampleShell.vue'
import { vueSfc } from './exampleCode'

const props = defineProps<{ scenario: string }>()
const basicValue = ref('Dragon Liquid')
const search = ref('')
const email = ref('designer@dragon.dev')
const username = ref('dragon liquid!')

const content = computed(() => ({
  basic: {
    title: '输入框尺寸与插槽',
    description: '通过 leading 和 trailing 插槽补充上下文，标签和帮助文本由业务层组织。',
    code: vueSfc({ imports: ['DlInput'], script: `import { ref } from 'vue'\n\nconst value = ref('')`, template: `  <DlInput v-model="value" placeholder="输入内容">\n    <template #leading>⌕</template>\n    <template #trailing>⌘ K</template>\n  </DlInput>` }),
    tips: ['可见标签应放在输入框外，并通过 label 关联。', '插槽图标只做补充，不能取代字段标签。'],
  },
  'global-search': {
    title: '全局搜索入口',
    description: '在宽输入框中组合搜索图标、占位提示和键盘快捷键信息。',
    code: vueSfc({ imports: ['DlInput'], script: `import { ref } from 'vue'\n\nconst query = ref('')`, template: `  <DlInput v-model="query" size="lg" placeholder="搜索组件、场景或 API">\n    <template #leading>⌕</template>\n    <template #trailing><kbd>⌘ K</kbd></template>\n  </DlInput>` }),
    tips: ['搜索结果应在输入防抖后更新。', '快捷键只是增强体验，所有用户都必须能通过普通交互进入搜索。'],
  },
  'form-validation': {
    title: '表单校验状态',
    description: 'status 改变边界反馈；错误原因仍应使用紧邻字段的可读文本说明。',
    code: vueSfc({ imports: ['DlInput'], script: `import { ref } from 'vue'\n\nconst email = ref('hello@example.com')\nconst username = ref('无效 名称')`, template: `  <form class="fields">\n    <DlInput v-model="email" status="success" type="email" />\n    <DlInput v-model="username" status="error" />\n    <p role="alert">用户名只能包含字母与数字。</p>\n  </form>`, style: `.fields { display: grid; gap: 12px; }\n[role='alert'] { color: #fca5a5; }` }),
    tips: ['不要在用户尚未完成输入时过早展示错误。', '错误文本使用 role=alert 时避免在每次按键时频繁播报。'],
  },
}[props.scenario] ?? {} as { title: string; description: string; code: string; tips: string[] }))
</script>

<template>
  <DocExampleShell v-bind="content">
    <div v-if="scenario === 'basic'" class="input-size-stack">
      <label><span>Small</span><DlInput v-model="basicValue" size="sm"><template #leading>◇</template></DlInput></label>
      <label><span>Medium</span><DlInput v-model="basicValue"><template #leading>◇</template><template #trailing>12</template></DlInput></label>
      <label><span>Large</span><DlInput v-model="basicValue" size="lg"><template #leading>◇</template></DlInput></label>
      <label><span>Disabled</span><DlInput model-value="不可编辑" disabled /></label>
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
      <DlButton>保存账户信息</DlButton>
    </DlCard>
  </DocExampleShell>
</template>
