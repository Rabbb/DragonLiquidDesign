<script setup lang="ts">
import { computed, ref } from 'vue'
import { DlBadge } from '@dragon-liquid/vue'
import type { ComponentDefinition } from '../catalog'
import nativeInputTypes from '../native-inputs.json' with { type: 'json' }
import DocExampleShell from '../components/DocExampleShell.vue'
import { vueSfc } from './exampleCode'

const props = defineProps<{ scenario: string; componentDefinition: ComponentDefinition }>()
const definition = computed(() => nativeInputTypes.find(input => input.id === props.componentDefinition.id) ?? nativeInputTypes[0])
const controlId = computed(() => `native-${definition.value.type}`)
const currentValue = ref(definition.value.sample)
const checked = ref(false)
const fileNames = ref<string[]>([])
const result = ref('尚未触发操作')

const typeAttributes: Record<string, string> = {
  button: 'value="执行操作"',
  checkbox: 'name="notifications" value="enabled"',
  color: 'value="#2f80ed"',
  date: 'value="2026-08-28" min="2026-01-01" max="2026-12-31"',
  'datetime-local': 'value="2026-08-28T09:30" min="2026-08-01T00:00" max="2026-08-31T23:59"',
  email: 'value="designer@dragon.dev" autocomplete="email" required',
  file: 'accept="image/png,image/jpeg" multiple',
  hidden: 'name="recordId" value="record-20260828"',
  image: 'src="/input-image-submit.svg" alt="提交表单" width="240" height="64"',
  month: 'value="2026-08" min="2026-01" max="2026-12"',
  number: 'value="42" min="0" max="100" step="1"',
  password: 'value="dragon-secret" autocomplete="current-password" minlength="8" required',
  radio: 'name="release" value="stable"',
  range: 'value="68" min="0" max="100" step="1"',
  reset: 'value="重置表单"',
  search: 'value="液态玻璃组件" enterkeyhint="search"',
  submit: 'value="提交表单"',
  tel: 'value="138 0000 0000" autocomplete="tel" pattern="[0-9 ]+"',
  text: 'value="Dragon Liquid" autocomplete="name" maxlength="40"',
  time: 'value="09:30" min="08:00" max="18:00" step="900"',
  url: 'value="https://todo.moe" autocomplete="url" required',
  week: 'value="2026-W35" min="2026-W01" max="2026-W52"',
}

const code = computed(() => {
  const input = definition.value
  if (input.type === 'hidden') return vueSfc({
    imports: [],
    template: `  <form method="post">
    <input type="hidden" name="recordId" value="record-20260828">
    <button type="submit">提交包含隐藏字段的表单</button>
  </form>`,
  })
  if (input.type === 'reset') return vueSfc({
    imports: [],
    template: `  <form>
    <label for="project-name">项目名</label>
    <input id="project-name" type="text" value="Dragon Liquid">
    <input type="reset" value="重置表单">
  </form>`,
  })
  if (input.type === 'submit') return vueSfc({
    imports: [],
    template: `  <form action="/save" method="post">
    <label for="project-name">项目名</label>
    <input id="project-name" name="projectName" type="text" required>
    <input type="submit" value="提交表单">
  </form>`,
  })
  if (input.type === 'radio') return vueSfc({
    imports: [],
    template: `  <fieldset>
    <legend>发布通道</legend>
    <label><input type="radio" name="release" value="stable" checked> Stable</label>
    <label><input type="radio" name="release" value="preview"> Preview</label>
  </fieldset>`,
  })
  const label = input.type === 'checkbox'
    ? `<label><input type="checkbox" ${typeAttributes[input.type]}> 接收发布通知</label>`
    : `<label for="${input.id}">${input.label}</label>\n  <input id="${input.id}" type="${input.type}" ${typeAttributes[input.type]}>`
  return vueSfc({ imports: [], template: `  ${label}` })
})

const content = computed(() => ({
  title: `${definition.value.label} · input[type="${definition.value.type}"]`,
  description: `${definition.value.summary} 该页只描述 ${definition.value.type} 类型，不通过 DlInput 的 type 属性混合其他控件。`,
  code: code.value,
  tips: [
    `固定选择器为 input[type="${definition.value.type}"]；接口表只列出对该类型有效或关键的属性。`,
    definition.value.type === 'hidden'
      ? '隐藏字段可被客户端修改，服务端不能把它当作可信权限或价格来源。'
      : 'Placeholder 不能替代 label；请保留浏览器原生校验、键盘和可访问性语义。',
  ],
}))

function updateValue(event: Event) {
  currentValue.value = (event.target as HTMLInputElement).value
}

function updateFiles(event: Event) {
  fileNames.value = [...((event.target as HTMLInputElement).files ?? [])].map(file => file.name)
}
</script>

<template>
  <DocExampleShell v-bind="content">
    <div class="native-input-reference">
      <header>
        <DlBadge tone="muted" variant="outline">NATIVE HTML</DlBadge>
        <code>input[type="{{ definition.type }}"]</code>
        <a :href="componentDefinition.sourceUrl" target="_blank" rel="noreferrer">MDN reference ↗</a>
      </header>

      <form v-if="definition.type === 'reset'" class="native-input-demo" @submit.prevent>
        <label for="reset-project">项目名</label>
        <input id="reset-project" type="text" value="Dragon Liquid">
        <input type="reset" value="重置表单">
      </form>

      <form v-else-if="definition.type === 'submit'" class="native-input-demo" @submit.prevent="result = '表单已通过校验并提交'">
        <label for="submit-project">项目名</label>
        <input id="submit-project" name="projectName" type="text" required value="Dragon Liquid">
        <input type="submit" value="提交表单">
        <output>{{ result }}</output>
      </form>

      <div v-else-if="definition.type === 'hidden'" class="native-input-demo native-input-hidden">
        <input type="hidden" name="recordId" :value="definition.sample">
        <span>该控件不会显示在页面中</span>
        <code>&lt;input type="hidden" name="recordId" value="{{ definition.sample }}"&gt;</code>
      </div>

      <form v-else-if="definition.type === 'radio'" class="native-input-demo" @submit.prevent>
        <fieldset>
          <legend>发布通道</legend>
          <label><input type="radio" name="release" value="stable" checked> Stable</label>
          <label><input type="radio" name="release" value="preview"> Preview</label>
        </fieldset>
      </form>

      <label v-else-if="definition.type === 'checkbox'" class="native-input-demo native-input-choice">
        <input v-model="checked" type="checkbox" name="notifications" value="enabled">
        <span>接收发布通知</span>
      </label>

      <div v-else-if="definition.type === 'file'" class="native-input-demo">
        <label :for="controlId">{{ definition.label }}</label>
        <input :id="controlId" type="file" accept="image/png,image/jpeg" multiple @change="updateFiles">
        <output>{{ fileNames.length ? fileNames.join('、') : '尚未选择文件' }}</output>
      </div>

      <form v-else-if="definition.type === 'image'" class="native-input-demo" @submit.prevent="result = '图像按钮已提交表单'">
        <input type="image" src="/input-image-submit.svg" alt="提交表单" width="240" height="64">
        <output>{{ result }}</output>
      </form>

      <div v-else-if="definition.type === 'button'" class="native-input-demo">
        <input type="button" value="执行操作" @click="result = '普通按钮已触发'">
        <output>{{ result }}</output>
      </div>

      <div v-else-if="definition.type === 'color'" class="native-input-demo">
        <label :for="controlId">{{ definition.label }}</label>
        <input :id="controlId" type="color" :value="currentValue" @input="updateValue">
        <output>当前值：{{ currentValue }}</output>
      </div>

      <div v-else-if="definition.type === 'date'" class="native-input-demo">
        <label :for="controlId">{{ definition.label }}</label>
        <input :id="controlId" type="date" :value="currentValue" min="2026-01-01" max="2026-12-31" @input="updateValue">
        <output>当前值：{{ currentValue }}</output>
      </div>

      <div v-else-if="definition.type === 'datetime-local'" class="native-input-demo">
        <label :for="controlId">{{ definition.label }}</label>
        <input :id="controlId" type="datetime-local" :value="currentValue" min="2026-08-01T00:00" max="2026-08-31T23:59" @input="updateValue">
        <output>当前值：{{ currentValue }}</output>
      </div>

      <div v-else-if="definition.type === 'email'" class="native-input-demo">
        <label :for="controlId">{{ definition.label }}</label>
        <input :id="controlId" type="email" :value="currentValue" autocomplete="email" required @input="updateValue">
        <output>当前值：{{ currentValue }}</output>
      </div>

      <div v-else-if="definition.type === 'month'" class="native-input-demo">
        <label :for="controlId">{{ definition.label }}</label>
        <input :id="controlId" type="month" :value="currentValue" min="2026-01" max="2026-12" @input="updateValue">
        <output>当前值：{{ currentValue }}</output>
      </div>

      <div v-else-if="definition.type === 'number'" class="native-input-demo">
        <label :for="controlId">{{ definition.label }}</label>
        <input :id="controlId" type="number" :value="currentValue" min="0" max="100" step="1" @input="updateValue">
        <output>当前值：{{ currentValue }}</output>
      </div>

      <div v-else-if="definition.type === 'password'" class="native-input-demo">
        <label :for="controlId">{{ definition.label }}</label>
        <input :id="controlId" type="password" :value="currentValue" autocomplete="current-password" minlength="8" required @input="updateValue">
        <output>当前值长度：{{ currentValue.length }}</output>
      </div>

      <div v-else-if="definition.type === 'range'" class="native-input-demo">
        <label :for="controlId">{{ definition.label }}</label>
        <input :id="controlId" type="range" :value="currentValue" min="0" max="100" step="1" @input="updateValue">
        <output>当前值：{{ currentValue }}</output>
      </div>

      <div v-else-if="definition.type === 'search'" class="native-input-demo">
        <label :for="controlId">{{ definition.label }}</label>
        <input :id="controlId" type="search" :value="currentValue" enterkeyhint="search" @input="updateValue">
        <output>当前值：{{ currentValue }}</output>
      </div>

      <div v-else-if="definition.type === 'tel'" class="native-input-demo">
        <label :for="controlId">{{ definition.label }}</label>
        <input :id="controlId" type="tel" :value="currentValue" autocomplete="tel" pattern="[0-9 ]+" @input="updateValue">
        <output>当前值：{{ currentValue }}</output>
      </div>

      <div v-else-if="definition.type === 'text'" class="native-input-demo">
        <label :for="controlId">{{ definition.label }}</label>
        <input :id="controlId" type="text" :value="currentValue" autocomplete="name" maxlength="40" @input="updateValue">
        <output>当前值：{{ currentValue }}</output>
      </div>

      <div v-else-if="definition.type === 'time'" class="native-input-demo">
        <label :for="controlId">{{ definition.label }}</label>
        <input :id="controlId" type="time" :value="currentValue" min="08:00" max="18:00" step="900" @input="updateValue">
        <output>当前值：{{ currentValue }}</output>
      </div>

      <div v-else-if="definition.type === 'url'" class="native-input-demo">
        <label :for="controlId">{{ definition.label }}</label>
        <input :id="controlId" type="url" :value="currentValue" autocomplete="url" required @input="updateValue">
        <output>当前值：{{ currentValue }}</output>
      </div>

      <div v-else-if="definition.type === 'week'" class="native-input-demo">
        <label :for="controlId">{{ definition.label }}</label>
        <input :id="controlId" type="week" :value="currentValue" min="2026-W01" max="2026-W52" @input="updateValue">
        <output>当前值：{{ currentValue }}</output>
      </div>
    </div>
  </DocExampleShell>
</template>

<style scoped>
.native-input-reference { display: grid; width: min(100%, 820px); gap: 18px; margin-inline: auto; }
.native-input-reference > header { display: flex; align-items: center; gap: 10px; }
.native-input-reference > header code { padding: 5px 8px; border-radius: 8px; color: var(--dl-accent-text); background: var(--dl-accent-surface); font: .72rem "Cascadia Code", Consolas, monospace; }
.native-input-reference > header a { margin-left: auto; color: var(--dl-accent-text); font-size: .7rem; font-weight: 750; }
.native-input-demo { display: grid; gap: 12px; padding: 22px; border: 1px solid var(--dl-border); border-radius: var(--dl-radius-lg); background: var(--dl-surface-soft); }
.native-input-demo > label, .native-input-demo legend { color: var(--dl-text); font-size: .76rem; font-weight: 800; }
.native-input-demo input:not([type='checkbox']):not([type='radio']):not([type='range']):not([type='color']):not([type='file']):not([type='image']):not([type='button']):not([type='reset']):not([type='submit']) { min-height: 44px; width: 100%; padding: 0 13px; border: 1px solid var(--dl-border); border-radius: var(--dl-radius-sm); outline: none; color: var(--dl-text); background: var(--dl-surface); box-shadow: inset 0 1px rgb(255 255 255 / 6%); }
.native-input-demo input:focus-visible { outline: none; box-shadow: var(--dl-focus); }
.native-input-demo input:is([type='button'], [type='reset'], [type='submit']) { justify-self: start; min-height: 42px; padding: 0 18px; border: 1px solid var(--dl-accent-border); border-radius: var(--dl-radius-sm); color: var(--dl-accent-text); background: var(--dl-accent-surface); font-weight: 800; cursor: pointer; }
.native-input-demo input[type='range'] { width: 100%; accent-color: var(--dl-accent); }
.native-input-demo input[type='color'] { width: 88px; height: 48px; padding: 4px; border: 1px solid var(--dl-border); border-radius: var(--dl-radius-sm); background: var(--dl-surface); }
.native-input-demo input[type='file'] { padding: 12px; border: 1px dashed var(--dl-border); border-radius: var(--dl-radius-sm); color: var(--dl-text-muted); background: var(--dl-surface); }
.native-input-demo fieldset { display: flex; gap: 18px; padding: 16px; border: 1px solid var(--dl-border); border-radius: var(--dl-radius-sm); }
.native-input-demo fieldset label, .native-input-choice { display: flex; align-items: center; gap: 8px; color: var(--dl-text); }
.native-input-demo input:is([type='checkbox'], [type='radio']) { width: 18px; height: 18px; accent-color: var(--dl-accent); }
.native-input-demo output { color: var(--dl-text-faint); font-size: .7rem; }
.native-input-hidden span { color: var(--dl-text-muted); font-weight: 800; }
.native-input-hidden code { overflow-x: auto; padding: 12px; border-radius: 10px; color: var(--dl-accent-text); background: var(--dl-night-soft); font: .72rem "Cascadia Code", Consolas, monospace; }
@media (max-width: 640px) { .native-input-reference > header { align-items: flex-start; flex-wrap: wrap; } .native-input-reference > header a { width: 100%; margin-left: 0; } .native-input-demo { padding: 16px; } }
</style>
