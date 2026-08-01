<script setup lang="ts">
import { computed, ref } from 'vue'
import { DlBadge, DlButton, DlCard, DlSelect, DlTextarea, type DlSelectOption } from '@dragon-liquid/vue'
import DocExampleShell from '../components/DocExampleShell.vue'
import { vueSfc } from './exampleCode'

const props = defineProps<{ scenario: string }>()
const basic = ref('液态玻璃、深林绿与龙焰金，共同构成 Dragon Liquid Design 的视觉基因。')
const synopsis = ref('勇者结束旅程以后，时间仍在向前。她重新踏上曾经走过的道路，试着理解短暂却明亮的人类生命。')
const feedback = ref('')
const category = ref('interaction')
const categoryOptions: DlSelectOption[] = [{ value: 'interaction', label: '交互问题' }, { value: 'visual', label: '视觉问题' }, { value: 'accessibility', label: '无障碍问题' }]

const content = computed(() => ({
  basic: {
    title: '多行文本与状态',
    description: 'Textarea 支持尺寸、校验状态和原生属性透传，默认允许垂直调整高度。',
    code: vueSfc({ imports: ['DlTextarea'], script: `import { ref } from 'vue'\n\nconst description = ref('')`, template: `  <DlTextarea\n    v-model="description"\n    :rows="5"\n    placeholder="输入说明"\n  />` }),
    tips: ['为预期内容量提供合适的初始高度。', '限制字数时同时显示剩余数量，不要等提交后才报错。'],
  },
  'content-editor': {
    title: '内容简介编辑',
    description: '在编辑场景中同时展示内容要求、字符计数与保存动作。',
    code: vueSfc({ imports: ['DlTextarea'], script: `import { ref } from 'vue'\n\nconst synopsis = ref('异世界冒险从一封没有署名的委托开始。')`, template: `  <label class="editor">\n    <span>作品简介</span>\n    <DlTextarea v-model="synopsis" :rows="7" maxlength="500" />\n    <small>{{ synopsis.length }} / 500</small>\n  </label>`, style: `.editor { display: grid; gap: 8px; }\n.editor small { justify-self: end; }` }),
    tips: ['长内容编辑应考虑自动保存或草稿恢复。', '字符统计是辅助信息，不应抢占正文视觉层级。'],
  },
  'feedback-message': {
    title: '问题反馈表单',
    description: '先明确问题类别，再引导用户提供复现步骤、预期行为和实际结果。',
    code: vueSfc({ imports: ['DlSelect', 'DlTextarea', 'type DlSelectOption'], script: `import { ref } from 'vue'\n\nconst category = ref('bug')\nconst message = ref('')\nconst categories: DlSelectOption[] = [\n  { value: 'bug', label: '功能异常' },\n  { value: 'style', label: '样式问题' },\n]`, template: `  <form class="feedback">\n    <DlSelect v-model="category" :options="categories" />\n    <DlTextarea v-model="message" placeholder="请描述复现步骤" />\n  </form>`, style: `.feedback { display: grid; gap: 12px; }` }),
    tips: ['placeholder 提供内容结构提示，但字段仍需要可见标签。', '反馈成功后明确说明后续处理方式。'],
  },
}[props.scenario] ?? {} as { title: string; description: string; code: string; tips: string[] }))
</script>

<template>
  <DocExampleShell v-bind="content">
    <div v-if="scenario === 'basic'" class="textarea-stack">
      <label><span>默认</span><DlTextarea v-model="basic" :rows="4" /></label>
      <label><span>成功状态</span><DlTextarea model-value="内容已经通过校验。" status="success" :rows="3" /></label>
      <label><span>错误状态</span><DlTextarea model-value="内容过短。" status="error" :rows="3" /></label>
    </div>

    <DlCard v-else-if="scenario === 'content-editor'" padding="lg" class="content-editor-card">
      <div><DlBadge tone="accent">ANIME PROFILE</DlBadge><h3>编辑作品简介</h3></div>
      <label class="scenario-field"><span>简介内容</span><DlTextarea v-model="synopsis" :rows="7" /></label>
      <footer><small :class="{ warning: synopsis.length > 180 }">{{ synopsis.length }} / 200</small><div><DlButton variant="ghost">保存草稿</DlButton><DlButton>发布修改</DlButton></div></footer>
    </DlCard>

    <DlCard v-else padding="lg" class="feedback-form-card">
      <div><span class="feedback-symbol">?</span><div><h3>告诉我们发生了什么</h3><p>清晰的上下文会帮助维护者更快定位问题。</p></div></div>
      <label class="scenario-field"><span>问题类别</span><DlSelect v-model="category" :options="categoryOptions" /></label>
      <label class="scenario-field"><span>问题描述</span><DlTextarea v-model="feedback" :rows="6" placeholder="复现步骤、预期行为、实际结果……" /></label>
      <DlButton :disabled="feedback.length < 10">提交反馈</DlButton>
    </DlCard>
  </DocExampleShell>
</template>
