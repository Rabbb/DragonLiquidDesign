<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  DlBadge,
  DlInputButton,
  DlInputCheckbox,
  DlInputColor,
  DlInputDate,
  DlInputDatetimeLocal,
  DlInputEmail,
  DlInputFile,
  DlInputHidden,
  DlInputImage,
  DlInputMonth,
  DlInputNumber,
  DlInputPassword,
  DlInputRadio,
  DlInputRange,
  DlInputReset,
  DlInputSearch,
  DlInputSubmit,
  DlInputTel,
  DlInputText,
  DlInputTime,
  DlInputUrl,
  DlInputWeek,
} from '@dragon-liquid/vue'
import type { ComponentDefinition } from '../catalog'
import inputControls from '../input-controls.json' with { type: 'json' }
import DocExampleShell from '../components/DocExampleShell.vue'
import { vueSfc } from './exampleCode'

const props = defineProps<{ scenario: string; componentDefinition: ComponentDefinition }>()
const definition = computed(() => inputControls.find(input => input.id === props.componentDefinition.id) ?? inputControls[0])
const componentName = computed(() => definition.value.type === 'datetime-local'
  ? 'DlInputDatetimeLocal'
  : `DlInput${definition.value.type[0].toUpperCase()}${definition.value.type.slice(1)}`)
const controlId = computed(() => `control-${definition.value.type}`)
const currentValue = ref(definition.value.sample)
const numberValue = ref(42)
const rangeValue = ref(68)
const checked = ref(false)
const release = ref<string | number | null>('stable')
const fileNames = ref<string[]>([])
const result = ref('尚未触发操作')
const projectName = ref('Dragon Liquid')

const componentAttributes: Record<string, string> = {
  button: 'value="执行操作"',
  checkbox: 'v-model="checked" name="notifications" value="enabled"',
  color: 'v-model="color"',
  date: 'v-model="date" min="2026-01-01" max="2026-12-31"',
  'datetime-local': 'v-model="dateTime" min="2026-08-01T00:00" max="2026-08-31T23:59"',
  email: 'v-model="email" autocomplete="email" required',
  file: 'accept="image/png,image/jpeg" multiple @select="handleFiles"',
  hidden: 'name="recordId" model-value="record-20260828"',
  image: 'src="/input-image-submit.svg" alt="提交表单" :width="240" :height="64"',
  month: 'v-model="month" min="2026-01" max="2026-12"',
  number: 'v-model="count" :min="0" :max="100" :step="1"',
  password: 'v-model="password" autocomplete="current-password" minlength="8" required',
  radio: 'v-model="release" name="release" value="stable"',
  range: 'v-model="progress" :min="0" :max="100" :step="1"',
  reset: 'value="重置表单"',
  search: 'v-model="query" enterkeyhint="search"',
  submit: 'value="提交表单"',
  tel: 'v-model="phone" autocomplete="tel" pattern="[0-9 ]+"',
  text: 'v-model="title" autocomplete="name" maxlength="40"',
  time: 'v-model="time" min="08:00" max="18:00" :step="900"',
  url: 'v-model="url" autocomplete="url" required',
  week: 'v-model="week" min="2026-W01" max="2026-W52"',
}

const code = computed(() => {
  const input = definition.value
  const name = componentName.value
  if (input.type === 'reset') return vueSfc({
    imports: ['DlInputReset', 'DlInputText'],
    script: `import { ref } from 'vue'\n\nconst projectName = ref('Dragon Liquid')`,
    template: `  <form>
    <label for="project-name">项目名</label>
    <DlInputText id="project-name" v-model="projectName" />
    <DlInputReset value="重置表单" />
  </form>`,
  })
  if (input.type === 'submit') return vueSfc({
    imports: ['DlInputSubmit', 'DlInputText'],
    script: `import { ref } from 'vue'\n\nconst projectName = ref('')`,
    template: `  <form action="/save" method="post">
    <label for="project-name">项目名</label>
    <DlInputText id="project-name" v-model="projectName" name="projectName" required />
    <DlInputSubmit value="提交表单" />
  </form>`,
  })
  if (input.type === 'radio') return vueSfc({
    imports: ['DlInputRadio'],
    script: `import { ref } from 'vue'\n\nconst release = ref('stable')`,
    template: `  <fieldset>
    <legend>发布通道</legend>
    <label><DlInputRadio v-model="release" name="release" value="stable" /> Stable</label>
    <label><DlInputRadio v-model="release" name="release" value="preview" /> Preview</label>
  </fieldset>`,
  })
  const script = input.type === 'file'
    ? `function handleFiles(files: FileList | null) {\n  console.log(files)\n}`
    : ['button', 'hidden', 'image'].includes(input.type)
      ? undefined
      : `import { ref } from 'vue'\n\nconst value = ref(${JSON.stringify(input.sample)})`
  const attributeText = componentAttributes[input.type].replace(/v-model="[^"]+"/, 'v-model="value"')
  return vueSfc({
    imports: [name],
    script,
    template: `  <label for="${input.id}">${input.label}</label>\n  <${name} id="${input.id}" ${attributeText} />`,
  })
})

const content = computed(() => ({
  title: `${componentName.value} · input[type="${definition.value.type}"]`,
  description: `${definition.value.summary} ${componentName.value} 是独立控件，原生类型在组件内部固定，公开接口不提供 type 属性。`,
  code: code.value,
  tips: [
    `组件固定封装 input[type="${definition.value.type}"]；不能在运行时切换成其他输入类型。`,
    definition.value.type === 'hidden'
      ? '隐藏字段可被客户端修改，服务端不能把它当作可信权限或价格来源。'
      : 'Placeholder 不能替代 label；请保留浏览器原生校验、键盘和可访问性语义。',
  ],
}))

function updateFiles(files: FileList | null) {
  fileNames.value = [...(files ?? [])].map(file => file.name)
}
</script>

<template>
  <DocExampleShell v-bind="content">
    <div class="input-control-reference">
      <header>
        <DlBadge tone="accent" variant="outline">DL CONTROL</DlBadge>
        <code>{{ componentName }}</code>
        <code>input[type="{{ definition.type }}"]</code>
        <a :href="componentDefinition.sourceUrl" target="_blank" rel="noreferrer">MDN reference ↗</a>
      </header>

      <form v-if="definition.type === 'reset'" class="input-control-demo" @submit.prevent>
        <label for="reset-project">项目名</label>
        <DlInputText id="reset-project" v-model="projectName" />
        <DlInputReset value="重置表单" />
      </form>

      <form v-else-if="definition.type === 'submit'" class="input-control-demo" @submit.prevent="result = '表单已通过校验并提交'">
        <label for="submit-project">项目名</label>
        <DlInputText id="submit-project" v-model="projectName" name="projectName" required />
        <DlInputSubmit value="提交表单" />
        <output>{{ result }}</output>
      </form>

      <div v-else-if="definition.type === 'hidden'" class="input-control-demo input-control-hidden">
        <DlInputHidden name="recordId" :model-value="definition.sample" />
        <span>组件存在于表单中，但不会显示在页面中</span>
        <code>&lt;DlInputHidden name="recordId" model-value="{{ definition.sample }}" /&gt;</code>
      </div>

      <form v-else-if="definition.type === 'radio'" class="input-control-demo" @submit.prevent>
        <fieldset>
          <legend>发布通道</legend>
          <label><DlInputRadio v-model="release" name="release" value="stable" /> Stable</label>
          <label><DlInputRadio v-model="release" name="release" value="preview" /> Preview</label>
        </fieldset>
      </form>

      <label v-else-if="definition.type === 'checkbox'" class="input-control-demo input-control-choice">
        <DlInputCheckbox v-model="checked" name="notifications" value="enabled" />
        <span>接收发布通知</span>
      </label>

      <div v-else-if="definition.type === 'file'" class="input-control-demo">
        <label :for="controlId">{{ definition.label }}</label>
        <DlInputFile :id="controlId" accept="image/png,image/jpeg" multiple @select="updateFiles" />
        <output>{{ fileNames.length ? fileNames.join('、') : '尚未选择文件' }}</output>
      </div>

      <form v-else-if="definition.type === 'image'" class="input-control-demo" @submit.prevent="result = '图像按钮已提交表单'">
        <DlInputImage src="/input-image-submit.svg" alt="提交表单" :width="240" :height="64" />
        <output>{{ result }}</output>
      </form>

      <div v-else-if="definition.type === 'button'" class="input-control-demo">
        <DlInputButton value="执行操作" @click="result = '普通按钮已触发'" />
        <output>{{ result }}</output>
      </div>

      <div v-else-if="definition.type === 'color'" class="input-control-demo"><label :for="controlId">{{ definition.label }}</label><DlInputColor :id="controlId" v-model="currentValue" /><output>当前值：{{ currentValue }}</output></div>
      <div v-else-if="definition.type === 'date'" class="input-control-demo"><label :for="controlId">{{ definition.label }}</label><DlInputDate :id="controlId" v-model="currentValue" min="2026-01-01" max="2026-12-31" /><output>当前值：{{ currentValue }}</output></div>
      <div v-else-if="definition.type === 'datetime-local'" class="input-control-demo"><label :for="controlId">{{ definition.label }}</label><DlInputDatetimeLocal :id="controlId" v-model="currentValue" min="2026-08-01T00:00" max="2026-08-31T23:59" /><output>当前值：{{ currentValue }}</output></div>
      <div v-else-if="definition.type === 'email'" class="input-control-demo"><label :for="controlId">{{ definition.label }}</label><DlInputEmail :id="controlId" v-model="currentValue" autocomplete="email" required /><output>当前值：{{ currentValue }}</output></div>
      <div v-else-if="definition.type === 'month'" class="input-control-demo"><label :for="controlId">{{ definition.label }}</label><DlInputMonth :id="controlId" v-model="currentValue" min="2026-01" max="2026-12" /><output>当前值：{{ currentValue }}</output></div>
      <div v-else-if="definition.type === 'number'" class="input-control-demo"><label :for="controlId">{{ definition.label }}</label><DlInputNumber :id="controlId" v-model="numberValue" :min="0" :max="100" :step="1" /><output>当前值：{{ numberValue }}</output></div>
      <div v-else-if="definition.type === 'password'" class="input-control-demo"><label :for="controlId">{{ definition.label }}</label><DlInputPassword :id="controlId" v-model="currentValue" autocomplete="current-password" minlength="8" required /><output>当前值长度：{{ currentValue.length }}</output></div>
      <div v-else-if="definition.type === 'range'" class="input-control-demo"><label :for="controlId">{{ definition.label }}</label><DlInputRange :id="controlId" v-model="rangeValue" :min="0" :max="100" :step="1" /><output>当前值：{{ rangeValue }}</output></div>
      <div v-else-if="definition.type === 'search'" class="input-control-demo"><label :for="controlId">{{ definition.label }}</label><DlInputSearch :id="controlId" v-model="currentValue" enterkeyhint="search" /><output>当前值：{{ currentValue }}</output></div>
      <div v-else-if="definition.type === 'tel'" class="input-control-demo"><label :for="controlId">{{ definition.label }}</label><DlInputTel :id="controlId" v-model="currentValue" autocomplete="tel" pattern="[0-9 ]+" /><output>当前值：{{ currentValue }}</output></div>
      <div v-else-if="definition.type === 'text'" class="input-control-demo"><label :for="controlId">{{ definition.label }}</label><DlInputText :id="controlId" v-model="currentValue" autocomplete="name" maxlength="40" /><output>当前值：{{ currentValue }}</output></div>
      <div v-else-if="definition.type === 'time'" class="input-control-demo"><label :for="controlId">{{ definition.label }}</label><DlInputTime :id="controlId" v-model="currentValue" min="08:00" max="18:00" :step="900" /><output>当前值：{{ currentValue }}</output></div>
      <div v-else-if="definition.type === 'url'" class="input-control-demo"><label :for="controlId">{{ definition.label }}</label><DlInputUrl :id="controlId" v-model="currentValue" autocomplete="url" required /><output>当前值：{{ currentValue }}</output></div>
      <div v-else-if="definition.type === 'week'" class="input-control-demo"><label :for="controlId">{{ definition.label }}</label><DlInputWeek :id="controlId" v-model="currentValue" min="2026-W01" max="2026-W52" /><output>当前值：{{ currentValue }}</output></div>
    </div>
  </DocExampleShell>
</template>

<style scoped>
.input-control-reference { display: grid; width: min(100%, 820px); gap: 18px; margin-inline: auto; }
.input-control-reference > header { display: flex; align-items: center; gap: 10px; }
.input-control-reference > header code { padding: 5px 8px; border-radius: 8px; color: var(--dl-accent-text); background: var(--dl-accent-surface); font: .72rem "Cascadia Code", Consolas, monospace; }
.input-control-reference > header a { margin-left: auto; color: var(--dl-accent-text); font-size: .7rem; font-weight: 750; }
.input-control-demo { display: grid; gap: 12px; padding: 22px; border: 1px solid var(--dl-border); border-radius: var(--dl-radius-lg); background: var(--dl-surface-soft); }
.input-control-demo > label, .input-control-demo legend { color: var(--dl-text); font-size: .76rem; font-weight: 800; }
.input-control-demo fieldset { display: flex; gap: 18px; padding: 16px; border: 1px solid var(--dl-border); border-radius: var(--dl-radius-sm); }
.input-control-demo fieldset label, .input-control-choice { display: flex; align-items: center; gap: 8px; color: var(--dl-text); }
.input-control-demo output { color: var(--dl-text-faint); font-size: .7rem; }
.input-control-hidden span { color: var(--dl-text-muted); font-weight: 800; }
.input-control-hidden code { overflow-x: auto; padding: 12px; border-radius: 10px; color: var(--dl-accent-text); background: var(--dl-night-soft); font: .72rem "Cascadia Code", Consolas, monospace; }
@media (max-width: 640px) { .input-control-reference > header { align-items: flex-start; flex-wrap: wrap; } .input-control-reference > header a { width: 100%; margin-left: 0; } .input-control-demo { padding: 16px; } }
</style>
