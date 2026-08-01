<script setup lang="ts">
import { computed, ref } from 'vue'
import { DlBadge, DlButton, DlCard, DlInput, type DlComponentRef, type DlPropertyChangeEvent } from '@dragon-liquid/vue'
import DocExampleShell from '../components/DocExampleShell.vue'
import { vueSfc } from './exampleCode'

const props = defineProps<{ scenario: string }>()
const loading = ref(false)
const projectName = ref('Isekai Archive')
const buttonControl = ref<DlComponentRef | null>(null)
const behaviorLog = ref<string[]>([])

const content = computed(() => ({
  basic: {
    title: '按钮的层级与状态',
    description: '默认使用 secondary；只有当前区域的主操作才显式使用 primary，size 只负责空间密度。',
    code: vueSfc({ imports: ['DlButton'], template: `  <div class="actions">\n    <DlButton variant="primary">主要操作</DlButton>\n    <DlButton>默认操作</DlButton>\n    <DlButton variant="ghost">轻量操作</DlButton>\n    <DlButton variant="danger">危险操作</DlButton>\n  </div>`, style: `.actions { display: flex; flex-wrap: wrap; gap: 12px; }` }),
    tips: ['遵循 Ant Design 的层级原则：一个操作区域最多保留一个 primary，其余操作使用默认 secondary。', 'loading 会同时禁用按钮并向辅助技术暴露 aria-busy。'],
  },
  'form-submit': {
    title: '表单提交与异步反馈',
    description: '提交期间保持按钮文案稳定，并用 loading 明确表达处理中状态。',
    code: vueSfc({ imports: ['DlButton'], script: `import { ref } from 'vue'\n\nconst saving = ref(false)\nasync function save() {\n  saving.value = true\n  await new Promise(resolve => setTimeout(resolve, 800))\n  saving.value = false\n}`, template: `  <DlButton variant="primary" :loading="saving" @click="save">\n    {{ saving ? '正在保存' : '保存项目' }}\n  </DlButton>` }),
    tips: ['异步操作结束前阻止重复提交。', '取消操作使用 secondary 或 ghost，避免与提交按钮争夺注意力。'],
  },
  'danger-zone': {
    title: '危险操作区',
    description: '不可逆操作应与常规动作分离，并在按钮附近说明具体影响。',
    code: vueSfc({ imports: ['DlButton'], script: `function removeProject() {\n  if (window.confirm('确定永久删除项目吗？')) {\n    console.log('project removed')\n  }\n}`, template: `  <DlButton variant="danger" @click="removeProject">\n    永久删除项目\n  </DlButton>` }),
    tips: ['不要只使用红色表达危险，按钮文字必须说明后果。', '高风险操作应再配合 Dialog 完成二次确认。'],
  },
  'instance-api': {
    title: 'WinForm 式实例控制与事件',
    description: '通过模板 ref 在运行时更新属性、调用行为，并使用 on/once/off 订阅统一事件。',
    code: vueSfc({ imports: ['DlButton', 'type DlComponentRef', 'type DlPropertyChangeEvent'], script: `import { ref } from 'vue'

const control = ref<DlComponentRef | null>(null)
const logs = ref<string[]>([])

function connect(instance: DlComponentRef) {
  instance.on('propertyChange', (event: DlPropertyChangeEvent) => {
    logs.value.unshift(\`${'${event.name}'}: ${'${String(event.previousValue)}'} → ${'${String(event.value)}'}\`)
  })
}

function run() {
  control.value?.setProperties({ variant: 'primary', loading: true })
  window.setTimeout(() => control.value?.setProperty('loading', false), 900)
}

function restore() {
  control.value?.resetProperties()
}`, template: `  <DlButton ref="control" @ready="connect">受控按钮</DlButton>
  <div class="actions">
    <button type="button" @click="run">设为主按钮并加载</button>
    <button type="button" @click="control?.disable()">禁用</button>
    <button type="button" @click="restore">恢复 Props</button>
  </div>
  <pre>{{ logs.join('\\n') || '等待属性事件…' }}</pre>`, style: `.actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
pre { min-height: 80px; padding: 12px; white-space: pre-wrap; }` }),
    tips: ['setProperty 不会修改 Vue 的只读 props，而是在组件实例上建立响应式覆盖。', 'resetProperty/resetProperties 会删除覆盖值，使组件重新跟随父组件传入的 props。'],
  },
}[props.scenario] ?? {} as { title: string; description: string; code: string; tips: string[] }))

async function save() {
  loading.value = true
  await new Promise(resolve => window.setTimeout(resolve, 1400))
  loading.value = false
}

function connectBehavior(instance: DlComponentRef) {
  instance.on('propertyChange', (event: DlPropertyChangeEvent) => {
    behaviorLog.value = [`${event.name}: ${String(event.previousValue)} → ${String(event.value)}`, ...behaviorLog.value].slice(0, 5)
  })
}

function runBehavior() {
  buttonControl.value?.setProperties({ variant: 'primary', loading: true })
  window.setTimeout(() => buttonControl.value?.setProperty('loading', false), 900)
}
</script>

<template>
  <DocExampleShell v-bind="content">
    <div v-if="scenario === 'basic'" class="case-stack">
      <div class="case-row">
        <DlButton variant="primary"><template #leading>✦</template>主要操作</DlButton>
        <DlButton>默认操作</DlButton>
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
      <div class="scenario-actions"><DlButton variant="ghost">取消</DlButton><DlButton variant="primary" :loading="loading" @click="save">{{ loading ? '正在保存' : '保存项目' }}</DlButton></div>
    </DlCard>

    <DlCard v-else-if="scenario === 'danger-zone'" padding="lg" class="danger-zone-card">
      <div><DlBadge tone="danger" variant="solid">DANGER ZONE</DlBadge><h3>永久删除组件草稿</h3><p>删除后，相关预览链接和历史版本都将失效，此操作无法撤销。</p></div>
      <DlButton variant="danger"><template #leading>×</template>永久删除</DlButton>
    </DlCard>

    <DlCard v-else padding="lg" class="behavior-card">
      <div class="behavior-target">
        <small>TEMPLATE REF · DlComponentRef</small>
        <DlButton ref="buttonControl" @ready="connectBehavior">受控按钮</DlButton>
      </div>
      <div class="behavior-actions">
        <DlButton size="sm" @click="runBehavior">Primary + Loading</DlButton>
        <DlButton size="sm" @click="buttonControl?.disable()">Disable()</DlButton>
        <DlButton size="sm" @click="buttonControl?.resetProperties()">Reset Props</DlButton>
      </div>
      <div class="behavior-log">
        <b>PROPERTY EVENTS</b>
        <code v-for="entry in behaviorLog" :key="entry">{{ entry }}</code>
        <span v-if="!behaviorLog.length">等待实例属性变更…</span>
      </div>
    </DlCard>
  </DocExampleShell>
</template>

<style scoped>
.behavior-card, .behavior-target, .behavior-log { display: grid; gap: 14px; }
.behavior-target { justify-items: start; }
.behavior-target small, .behavior-log b { color: var(--dl-text-faint); font-size: 0.7rem; letter-spacing: 0.08em; }
.behavior-actions { display: flex; flex-wrap: wrap; gap: 9px; padding-top: 15px; border-top: 1px solid var(--dl-border); }
.behavior-log { min-height: 112px; align-content: start; padding: 14px; border: 1px solid var(--dl-border); border-radius: 14px; background: rgba(3, 12, 9, 0.28); }
.behavior-log code { color: #ffe7a0; font-size: 0.78rem; }
.behavior-log span { color: var(--dl-text-faint); font-size: 0.82rem; }
</style>
