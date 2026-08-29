<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  DlAutocomplete,
  DlColorArea,
  DlColorField,
  DlColorPicker,
  DlColorSlider,
  DlColorSwatch,
  DlColorSwatchPicker,
  DlRating,
  type DlColorFormat,
  type DlColorSwatchOption,
} from '@dragon-liquid/vue'
import type { ComponentDefinition } from '../catalog'
import { componentGuidanceFor } from '../componentGuidance'
import DocExampleShell from '../components/DocExampleShell.vue'
import { vueSfc, type VueExampleSource } from './exampleCode'

const props = defineProps<{ scenario: string; componentDefinition: ComponentDefinition }>()
const query = ref('异世界')
const rating = ref(3.5)
const color = ref('#7aa2f7')
const alphaColor = ref('#7aa2f780')
const gradientStart = ref('#7aa2f7')
const gradientEnd = ref('#bb9af7')
const format = ref<DlColorFormat>('hex')
const multipleColors = ref<string[]>(['#7aa2f7', '#9ece6a'])
const projectColors = ref([
  { id: 'atlas', name: 'Atlas Dashboard', detail: '数据工作台', color: '#7aa2f7' },
  { id: 'garden', name: 'Focus Garden', detail: '专注与成长', color: '#9ece6a' },
  { id: 'studio', name: 'Moe Studio', detail: '内容创作', color: '#bb9af7' },
])
const swatches: DlColorSwatchOption[] = [
  { value: '#7aa2f7', label: 'Tokyo Blue', description: 'Primary' },
  { value: '#bb9af7', label: 'Iris', description: 'Creative' },
  { value: '#9ece6a', label: 'Leaf', description: 'Success' },
  { value: '#e0af68', label: 'Amber', description: 'Warning' },
  { value: '#f7768e', label: 'Coral', description: 'Danger' },
  { value: '#7dcfff80', label: 'Mist', description: '50% Alpha' },
]
const swatchValues = swatches.map(item => item.value)
const suggestions = ['异世界冒险', '异世界日常', '异世界转生', '异世界魔法']
const isColorControl = computed(() => props.componentDefinition.category === 'color')
const exampleKey = computed(() => ['color-area', 'color-picker'].includes(props.componentDefinition.id) && props.scenario !== 'basic'
  ? `${props.componentDefinition.id}:${props.scenario}`
  : props.componentDefinition.id)
const colorExampleTitle = computed(() => ({
  'color-area': '纯二维色域',
  'color-area:theme-editor': '应用于主题编辑器',
  'color-area:gradient-stops': '应用于渐变节点',
  'color-picker': '弹出式自由选色',
  'color-picker:vertical-layout': '窄空间纵向特例',
  'color-picker:theme-settings': '应用于主题设置',
  'color-picker:collection-list': '应用于列表内编辑',
  'color-field': '精确色值录入',
  'color-slider': '独立通道调整',
  'color-swatch': '只读颜色样本',
  'color-swatch-picker': '预设色板选择',
}[exampleKey.value] ?? '颜色控件'))
const currentValue = computed(() => {
  if (props.componentDefinition.id === 'autocomplete') return query.value || '等待输入'
  if (props.componentDefinition.id === 'rating') return `${rating.value} / 5`
  if (props.componentDefinition.id === 'color-swatch') return `${swatches.length} 个命名色样`
  if (props.componentDefinition.id === 'color-swatch-picker') return Array.isArray(multipleColors.value) ? multipleColors.value.join(' · ') : color.value
  if (exampleKey.value === 'color-area:gradient-stops') return `${gradientStart.value} → ${gradientEnd.value}`
  if (exampleKey.value === 'color-picker:collection-list') return projectColors.value.map(item => `${item.name} ${item.color}`).join(' · ')
  return color.value
})

const sources: Record<string, VueExampleSource> = {
  autocomplete: { imports: ['DlAutocomplete'], script: `import { ref } from 'vue'\n\nconst keyword = ref('')\nconst suggestions = ['异世界冒险', '异世界日常', '异世界转生']`, template: `  <section class="example">\n    <DlAutocomplete v-model="keyword" :suggestions="suggestions" placeholder="搜索动漫题材" aria-label="动漫题材" />\n    <output>当前文本：{{ keyword || '等待输入' }}</output>\n  </section>`, style: `.example { display: grid; gap: 12px; max-width: 480px; }` },
  rating: { imports: ['DlRating'], script: `import { ref } from 'vue'\n\nconst score = ref(3.5)`, template: `  <DlRating v-model="score" :length="5" :step="0.5" hoverable clearable aria-label="作品评分" />`, style: '' },
  'color-area': { imports: ['DlColorArea'], script: `import { ref } from 'vue'\n\nconst color = ref('#7aa2f7')`, template: `  <DlColorArea v-model="color" aria-label="饱和度与明度二维色域" />`, style: `.dl-color-area { max-width: 680px; }` },
  'color-area:theme-editor': {
    imports: ['DlColorArea', 'DlColorField', 'DlColorSlider', 'DlColorSwatch'],
    script: `import { ref } from 'vue'\n\nconst accent = ref('#7aa2f7')`,
    template: `  <section class="theme-editor">
    <div class="theme-editor__controls">
      <header><span>Accent color</span><code>{{ accent }}</code></header>
      <DlColorArea v-model="accent" aria-label="主题强调色饱和度与明度" />
      <DlColorSlider v-model="accent" channel="hue" label="Hue" show-value />
      <DlColorField v-model="accent" label="精确色值" />
    </div>
    <aside class="theme-preview" :style="{ borderColor: accent }">
      <DlColorSwatch :color="accent" label="Accent token" show-value />
      <h2>Project overview</h2><p>同一个色值驱动强调线、按钮和状态标记。</p>
      <button type="button" :style="{ background: accent }">Create project</button>
    </aside>
  </section>`,
    style: `.theme-editor { display:grid;grid-template-columns:minmax(0,1.25fr) minmax(240px,.75fr);gap:18px }.theme-editor__controls,.theme-preview { display:grid;align-content:start;gap:14px;padding:18px;border:1px solid var(--dl-border);border-radius:16px;background:var(--dl-surface) }.theme-editor__controls header { display:flex;justify-content:space-between }.theme-preview { border-width:2px }.theme-preview button { min-height:40px;border:0;border-radius:10px;color:#111827;font-weight:800 } @media(max-width:720px){.theme-editor{grid-template-columns:1fr}}`,
  },
  'color-area:gradient-stops': {
    imports: ['DlColorArea'],
    script: `import { computed, ref } from 'vue'\n\nconst start = ref('#7aa2f7')\nconst end = ref('#bb9af7')\nconst gradient = computed(() => 'linear-gradient(110deg, ' + start.value + ', ' + end.value + ')')`,
    template: `  <section class="gradient-editor">
    <div class="gradient-preview" :style="{ background: gradient }"><span>Hero gradient</span></div>
    <div class="gradient-stops">
      <article><header><b>START</b><code>{{ start }}</code></header><DlColorArea v-model="start" size="sm" aria-label="渐变起点二维色域" /></article>
      <article><header><b>END</b><code>{{ end }}</code></header><DlColorArea v-model="end" size="sm" aria-label="渐变终点二维色域" /></article>
    </div>
  </section>`,
    style: `.gradient-editor { display:grid;gap:16px }.gradient-preview { display:grid;place-items:end start;min-height:180px;padding:18px;border-radius:18px;color:white;font-weight:800 }.gradient-stops { display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px }.gradient-stops article { display:grid;gap:10px;padding:14px;border:1px solid var(--dl-border);border-radius:14px;background:var(--dl-surface) }.gradient-stops header { display:flex;justify-content:space-between } @media(max-width:640px){.gradient-stops{grid-template-columns:1fr}}`,
  },
  'color-field': { imports: ['DlColorField'], script: `import { ref } from 'vue'\nimport type { DlColorFormat } from '@dragon-liquid/vue'\n\nconst color = ref('#7aa2f7')\nconst format = ref<DlColorFormat>('hex')`, template: `  <DlColorField\n    v-model="color"\n    v-model:format="format"\n    label="品牌强调色"\n    hint="可粘贴任一受支持格式；Enter 提交，Esc 撤销草稿"\n  />`, style: `.dl-color-field { max-width: 520px; }` },
  'color-picker': { imports: ['DlColorPicker'], script: `import { ref } from 'vue'\n\nconst color = ref('#7aa2f7')`, template: `  <DlColorPicker v-model="color" label="品牌强调色" hint="打开浮层后调整，确认时提交" />`, style: `.dl-color-picker { max-width: 420px; }` },
  'color-picker:vertical-layout': { imports: ['DlColorPicker'], script: `import { ref } from 'vue'\n\nconst color = ref('#bb9af7')`, template: `  <DlColorPicker\n    v-model="color"\n    orientation="vertical"\n    label="窄侧栏强调色"\n    hint="纵向面板仅用于宽度受限的特殊区域"\n  />`, style: `.dl-color-picker { max-width: 300px; }` },
  'color-picker:theme-settings': {
    imports: ['DlColorPicker'],
    script: `import { ref } from 'vue'\n\nconst accent = ref('#7aa2f7')`,
    template: `  <section class="theme-setting">
    <div><h2>Workspace appearance</h2><p>颜色只在浮层确认后更新右侧预览。</p><DlColorPicker v-model="accent" label="品牌强调色" hint="支持透明度与精确色值" /></div>
    <aside :style="{ borderColor: accent }"><span :style="{ background: accent }">ACTIVE</span><h3>Today</h3><p>Review component documentation</p><button type="button" :style="{ background: accent }">Continue</button></aside>
  </section>`,
    style: `.theme-setting { display:grid;grid-template-columns:minmax(0,1fr) 280px;gap:18px }.theme-setting>div,.theme-setting aside { display:grid;align-content:start;gap:12px;padding:18px;border:1px solid var(--dl-border);border-radius:16px;background:var(--dl-surface) }.theme-setting aside { border-top-width:3px }.theme-setting aside span { width:max-content;padding:3px 7px;border-radius:999px;color:#111827;font-size:11px;font-weight:900 }.theme-setting button { min-height:38px;border:0;border-radius:9px;color:#111827;font-weight:800 } @media(max-width:680px){.theme-setting{grid-template-columns:1fr}}`,
  },
  'color-picker:collection-list': {
    imports: ['DlColorPicker'],
    script: `import { ref } from 'vue'\n\nconst projects = ref([\n  { id: 'atlas', name: 'Atlas Dashboard', detail: '数据工作台', color: '#7aa2f7' },\n  { id: 'garden', name: 'Focus Garden', detail: '专注与成长', color: '#9ece6a' },\n  { id: 'studio', name: 'Moe Studio', detail: '内容创作', color: '#bb9af7' },\n])`,
    template: `  <section class="project-colors">
    <header><div><h2>Project colors</h2><p>在列表中按需打开编辑，不让色域长期占用空间。</p></div><small>{{ projects.length }} projects</small></header>
    <article v-for="project in projects" :key="project.id">
      <i :style="{ background: project.color }" /><span><b>{{ project.name }}</b><small>{{ project.detail }}</small></span>
      <DlColorPicker v-model="project.color" size="sm" :placeholder="project.name + ' 标识色'" />
    </article>
  </section>`,
    style: `.project-colors { display:grid;border:1px solid var(--dl-border);border-radius:16px;background:var(--dl-surface) }.project-colors>header,.project-colors article { display:grid;grid-template-columns:auto minmax(0,1fr) minmax(180px,260px);align-items:center;gap:12px;padding:14px 16px }.project-colors>header { grid-template-columns:minmax(0,1fr) auto }.project-colors article { border-top:1px solid var(--dl-border) }.project-colors i { width:12px;height:38px;border-radius:999px }.project-colors span { display:grid }.project-colors small { color:var(--dl-text-faint) } @media(max-width:620px){.project-colors article{grid-template-columns:auto minmax(0,1fr)}.project-colors .dl-color-picker{grid-column:1/-1}}`,
  },
  'color-slider': { imports: ['DlColorSlider'], script: `import { ref } from 'vue'\n\nconst color = ref('#7aa2f780')`, template: `  <div class="channel-stack">\n    <DlColorSlider v-model="color" channel="hue" label="Hue" show-value />\n    <DlColorSlider v-model="color" channel="saturation" label="Saturation" show-value />\n    <DlColorSlider v-model="color" channel="lightness" label="Lightness" show-value />\n    <DlColorSlider v-model="color" channel="alpha" label="Alpha" show-value />\n  </div>`, style: `.channel-stack { display: grid; gap: 12px; max-width: 680px; }` },
  'color-swatch': { imports: ['DlColorSwatch'], template: `  <DlColorSwatch color="#7aa2f7" label="Tokyo Blue" description="Primary" label-position="right" show-value size="lg" />`, style: '' },
  'color-swatch-picker': { imports: ['DlColorSwatchPicker'], script: `import { ref } from 'vue'\n\nconst color = ref('#7aa2f7')\nconst colors = [\n  { value: '#7aa2f7', label: 'Tokyo Blue', description: 'Primary' },\n  { value: '#bb9af7', label: 'Iris', description: 'Creative' },\n  { value: '#9ece6a', label: 'Leaf', description: 'Success' },\n  { value: '#e0af68', label: 'Amber', description: 'Warning' },\n]`, template: `  <DlColorSwatchPicker v-model="color" :colors="colors" show-labels show-values aria-label="品牌主题色" />`, style: `.dl-color-swatch-picker { max-width: 680px; }` },
}

const scenarioDescription = computed(() => ({
  'color-area': '验证纯二维色域的值模型、尺寸和键盘双轴调整；标签与当前值由使用场景在组件外提供。',
  'color-area:theme-editor': '在专业主题工具中，把纯 ColorArea 与独立 Hue、ColorField 和结果预览组合成常驻工作台。',
  'color-area:gradient-stops': '用两个互不耦合的 ColorArea 编辑渐变端点，业务容器负责命名节点与合成最终视觉。',
  'color-picker': '比较标准、紧凑和只读触发器；默认横向浮层把二维色域与精确控制并排组织。',
  'color-picker:vertical-layout': '纵向布局需要显式设置 orientation="vertical"，适合窄侧栏等宽度受限的特殊区域。',
  'color-picker:theme-settings': '在普通设置页中确认后提交颜色，并让业务预览只响应已提交值。',
  'color-picker:collection-list': '在高密度项目列表中为每一行提供紧凑入口，避免常驻色域破坏列表阅读节奏。',
  'color-swatch-picker': '色板从左向右排列并自动换行，形成宽度由内容决定的二维流，而不是等宽列表。',
}[exampleKey.value] ?? componentGuidanceFor(props.componentDefinition.id).example))

const content = computed(() => ({
  title: isColorControl.value ? `${props.componentDefinition.name} · ${colorExampleTitle.value}` : `${props.componentDefinition.name} · Alpha 先行体验`,
  description: scenarioDescription.value,
  code: vueSfc(sources[exampleKey.value] ?? sources[props.componentDefinition.id]),
  tips: isColorControl.value
    ? ['颜色组件共享同一个 CSS Color 字符串模型，可在视觉选择与精确输入之间直接同步。', '透明色统一使用棋盘底纹；所有选择状态同时提供边框、勾选和文本信息。']
    : ['示例代码是完整 Vue SFC，可直接复制后运行。'],
}))
</script>

<template>
  <DocExampleShell v-bind="content">
    <div class="alpha-form-demo">
      <DlAutocomplete v-if="componentDefinition.id === 'autocomplete'" v-model="query" :suggestions="suggestions" placeholder="搜索动漫题材" />
      <div v-else-if="componentDefinition.id === 'rating'" class="rating-showcase">
        <div><span>可交互 · 半星步进</span><DlRating v-model="rating" :step="0.5" aria-label="作品评分" /></div>
        <div><span>四分之一星 · 4.25</span><DlRating :model-value="4.25" :step="0.25" readonly aria-label="四点二五星" /></div>
        <div><span>十分之一星 · 4.8</span><DlRating :model-value="4.8" :step="0.1" readonly aria-label="四点八星" /></div>
      </div>

      <section v-else-if="componentDefinition.id === 'color-area'" class="color-area-demo">
        <DlColorArea v-if="scenario === 'basic'" v-model="color" aria-label="饱和度与明度二维色域" />
        <div v-else-if="scenario === 'theme-editor'" class="theme-editor-demo">
          <div class="theme-editor-controls">
            <header><span><b>ACCENT COLOR</b><small>常驻专业编辑区</small></span><code>{{ color }}</code></header>
            <DlColorArea v-model="color" aria-label="主题强调色饱和度与明度" />
            <DlColorSlider v-model="color" channel="hue" label="Hue" show-value />
            <DlColorField v-model="color" v-model:format="format" label="精确色值" />
          </div>
          <aside class="theme-live-preview" :style="{ borderColor: color }">
            <DlColorSwatch :color="color" label="Accent token" show-value />
            <div><small>TODAY</small><h3>Project overview</h3><p>同一个色值驱动强调线、按钮和状态标记。</p></div>
            <button type="button" :style="{ background: color }">Create project</button>
          </aside>
        </div>
        <div v-else class="gradient-editor-demo">
          <div class="gradient-preview" :style="{ background: `linear-gradient(110deg, ${gradientStart}, ${gradientEnd})` }"><span>Hero gradient</span><small>{{ gradientStart }} → {{ gradientEnd }}</small></div>
          <div class="gradient-stop-grid">
            <article><header><b>START</b><code>{{ gradientStart }}</code></header><DlColorArea v-model="gradientStart" size="sm" aria-label="渐变起点二维色域" /></article>
            <article><header><b>END</b><code>{{ gradientEnd }}</code></header><DlColorArea v-model="gradientEnd" size="sm" aria-label="渐变终点二维色域" /></article>
          </div>
        </div>
      </section>

      <section v-else-if="componentDefinition.id === 'color-picker'" class="color-picker-trigger-gallery">
        <template v-if="scenario === 'basic'">
          <DlColorPicker v-model="color" v-model:format="format" label="品牌强调色" hint="打开浮层后调整，确认时提交" />
          <DlColorPicker v-model="alphaColor" label="透明强调色" size="sm" />
          <DlColorPicker model-value="#9ece6a" label="只读颜色" readonly />
        </template>
        <DlColorPicker v-else-if="scenario === 'vertical-layout'" v-model="color" v-model:format="format" orientation="vertical" label="窄侧栏强调色" hint="纵向面板仅用于宽度受限的特殊区域" />
        <div v-else-if="scenario === 'theme-settings'" class="theme-setting-demo">
          <div><small>APPEARANCE</small><h3>Workspace appearance</h3><p>浮层确认后才更新右侧品牌预览。</p><DlColorPicker v-model="color" v-model:format="format" label="品牌强调色" hint="支持透明度与精确色值" /></div>
          <aside :style="{ borderColor: color }"><span :style="{ background: color }">ACTIVE</span><h3>Today</h3><p>Review component documentation</p><button type="button" :style="{ background: color }">Continue</button></aside>
        </div>
        <div v-else class="project-color-list">
          <header><span><h3>Project colors</h3><p>逐项按需打开，不让色域长期占用列表。</p></span><small>{{ projectColors.length }} PROJECTS</small></header>
          <article v-for="project in projectColors" :key="project.id">
            <i :style="{ background: project.color }" /><span><b>{{ project.name }}</b><small>{{ project.detail }}</small></span>
            <DlColorPicker v-model="project.color" size="sm" :placeholder="`${project.name} 标识色`" />
          </article>
        </div>
      </section>

      <section v-else-if="componentDefinition.id === 'color-field'" class="color-field-gallery">
        <article>
          <h3>完整格式字段</h3>
          <DlColorField v-model="color" v-model:format="format" label="品牌强调色" hint="切换格式不会改变颜色；Enter 提交，Esc 撤销草稿" />
        </article>
        <article>
          <h3>独立通道微调</h3>
          <div class="channel-field-grid">
            <DlColorField v-model="color" channel="red" label="Red" :show-preview="false" :show-format="false" />
            <DlColorField v-model="color" channel="green" label="Green" :show-preview="false" :show-format="false" />
            <DlColorField v-model="color" channel="blue" label="Blue" :show-preview="false" :show-format="false" />
            <DlColorField v-model="color" channel="alpha" label="Alpha" :show-preview="false" :show-format="false" />
          </div>
        </article>
        <article>
          <h3>状态反馈</h3>
          <DlColorField model-value="#f7768e" label="只读结果" readonly />
          <DlColorField model-value="#f7768e" label="校验错误" error="该颜色与页面背景的对比度不足" />
        </article>
      </section>

      <section v-else-if="componentDefinition.id === 'color-slider'" class="color-slider-gallery">
        <div class="channel-stack">
          <DlColorSlider v-model="alphaColor" channel="hue" label="Hue" description="0–360°" show-value />
          <DlColorSlider v-model="alphaColor" channel="saturation" label="Saturation" description="色彩浓度" show-value />
          <DlColorSlider v-model="alphaColor" channel="lightness" label="Lightness" description="明暗程度" show-value />
          <DlColorSlider v-model="alphaColor" channel="alpha" label="Alpha" description="透明度带棋盘底纹" show-value />
        </div>
        <div class="vertical-channel-card">
          <span><b>RGB 垂直通道</b><small>适用于紧凑工具面板</small></span>
          <div>
            <DlColorSlider v-model="alphaColor" channel="red" color-space="rgb" orientation="vertical" show-value aria-label="红色通道" />
            <DlColorSlider v-model="alphaColor" channel="green" color-space="rgb" orientation="vertical" show-value aria-label="绿色通道" />
            <DlColorSlider v-model="alphaColor" channel="blue" color-space="rgb" orientation="vertical" show-value aria-label="蓝色通道" />
          </div>
        </div>
      </section>

      <section v-else-if="componentDefinition.id === 'color-swatch'" class="color-swatch-gallery">
        <article><h3>命名色样</h3><div class="swatch-row rich"><DlColorSwatch v-for="item in swatches" :key="item.value" :color="item.value" :label="item.label" :description="item.description" label-position="right" show-value /></div></article>
        <article><h3>纯视觉尺寸</h3><div class="swatch-row"><DlColorSwatch color="#9ece6a" label="Small" size="sm" shape="circle" /><DlColorSwatch color="#e0af68" label="Medium" shape="rounded" /><DlColorSwatch color="#7dcfff80" label="Large transparent" size="lg" shape="square" /></div></article>
      </section>

      <section v-else class="color-picker-gallery">
        <article><h3>左右流式品牌色</h3><DlColorSwatchPicker v-model="color" :colors="swatches" show-labels show-values aria-label="品牌主题色" /></article>
        <article><h3>紧凑色板</h3><DlColorSwatchPicker v-model="color" :colors="swatchValues" size="sm" aria-label="紧凑主题色" /></article>
        <article><h3>多选流式色板</h3><DlColorSwatchPicker v-model="multipleColors" :colors="swatches" multiple show-labels aria-label="图表颜色" /></article>
      </section>

      <output>当前值：{{ currentValue }}</output>
    </div>
  </DocExampleShell>
</template>

<style scoped>
.alpha-form-demo { display: grid; gap: 1.2rem; width: min(100%, 820px); margin: 0 auto; padding: 1rem; }
.alpha-form-demo output { color: var(--dl-text-faint); font: .66rem "Cascadia Code", Consolas, monospace; overflow-wrap: anywhere; }
.rating-showcase { display: grid; gap: 1rem; }.rating-showcase > div { display: grid; gap: .4rem; }.rating-showcase span { color: var(--dl-text-faint); font-size: .76rem; }
.color-area-demo { width: 100%; }.color-area-demo > .dl-color-area { max-width: 680px; }
.color-picker-trigger-gallery, .color-field-gallery, .color-slider-gallery, .color-swatch-gallery, .color-picker-gallery { display: grid; gap: 14px; }
.color-picker-trigger-gallery { width: 100%; }.color-picker-trigger-gallery > .dl-color-picker { max-width: 440px; }
.theme-editor-demo { display: grid; grid-template-columns: minmax(0,1.25fr) minmax(240px,.75fr); gap: 18px; }
.theme-editor-controls, .theme-live-preview { display: grid; align-content: start; gap: 14px; padding: 18px; border: 1px solid var(--dl-border); border-radius: var(--dl-radius-md); background: var(--dl-surface); }
.theme-editor-controls > header { display: flex; align-items: start; justify-content: space-between; gap: 12px; }.theme-editor-controls > header span { display: grid; gap: 3px; }.theme-editor-controls code, .gradient-stop-grid code { color: var(--dl-accent-text); font-size: .68rem; }
.theme-live-preview { border-top-width: 3px; }.theme-live-preview > div { display: grid; gap: 5px; padding: 18px 0; }.theme-live-preview p, .theme-setting-demo p, .project-color-list p { margin: 0; color: var(--dl-text-faint); font-size: .72rem; }.theme-live-preview button, .theme-setting-demo button { min-height: 40px; border: 0; border-radius: var(--dl-radius-sm); color: #111827; font-weight: 850; }
.gradient-editor-demo { display: grid; gap: 16px; }.gradient-preview { display: grid; align-content: end; justify-items: start; min-height: 180px; padding: 18px; border-radius: var(--dl-radius-md); color: #fff; box-shadow: inset 0 0 0 1px rgba(255,255,255,.18); }.gradient-preview span { font-size: 1rem; font-weight: 850; }.gradient-preview small { font: .65rem "Cascadia Code", Consolas, monospace; opacity: .8; }
.gradient-stop-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 14px; }.gradient-stop-grid article { display: grid; gap: 10px; padding: 14px; border: 1px solid var(--dl-border); border-radius: var(--dl-radius-md); background: var(--dl-surface); }.gradient-stop-grid header { display: flex; justify-content: space-between; gap: 12px; }
.theme-setting-demo { display: grid; grid-template-columns: minmax(0,1fr) 280px; gap: 18px; }.theme-setting-demo > div, .theme-setting-demo aside { display: grid; align-content: start; gap: 12px; padding: 18px; border: 1px solid var(--dl-border); border-radius: var(--dl-radius-md); background: var(--dl-surface); }.theme-setting-demo aside { border-top-width: 3px; }.theme-setting-demo aside > span { width: max-content; padding: 3px 7px; border-radius: 999px; color: #111827; font-size: .6rem; font-weight: 900; }
.project-color-list { display: grid; overflow: hidden; border: 1px solid var(--dl-border); border-radius: var(--dl-radius-md); background: var(--dl-surface); }.project-color-list > header, .project-color-list article { display: grid; grid-template-columns: auto minmax(0,1fr) minmax(180px,260px); align-items: center; gap: 12px; padding: 14px 16px; }.project-color-list > header { grid-template-columns: minmax(0,1fr) auto; }.project-color-list > header span, .project-color-list article > span { display: grid; gap: 3px; }.project-color-list article { border-top: 1px solid var(--dl-border); }.project-color-list article > i { width: 12px; height: 38px; border-radius: 999px; box-shadow: inset 0 0 0 1px rgba(255,255,255,.2); }.project-color-list small { color: var(--dl-text-faint); }
.vertical-channel-card > span { display: grid; gap: 4px; text-align: right; }.vertical-channel-card b { color: var(--dl-text); font-size: .72rem; }.vertical-channel-card small { color: var(--dl-text-faint); font-size: .6rem; }
.color-field-gallery { grid-template-columns: repeat(2, minmax(0,1fr)); }.color-field-gallery article, .color-swatch-gallery article, .color-picker-gallery article { display: grid; align-content: start; gap: 12px; padding: 16px; border: 1px solid var(--dl-border); border-radius: var(--dl-radius-md); background: var(--dl-surface); }.color-field-gallery article:last-child { grid-column: 1 / -1; grid-template-columns: repeat(2,minmax(0,1fr)); }.color-field-gallery article:last-child h3 { grid-column: 1 / -1; }
.alpha-form-demo h3 { margin: 0; color: var(--dl-text); font-size: .76rem; }.channel-field-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 10px; }
.color-slider-gallery { grid-template-columns: minmax(0,1fr) 220px; }.channel-stack { display: grid; align-content: start; gap: 14px; }.vertical-channel-card { display: grid; justify-items: center; gap: 18px; padding: 16px; border: 1px solid var(--dl-border); border-radius: var(--dl-radius-md); background: var(--dl-surface); }.vertical-channel-card > span { text-align: center; }.vertical-channel-card > div { display: flex; gap: 28px; }
.color-swatch-gallery { grid-template-columns: 1fr 1fr; }.swatch-row { display: flex; align-items: center; flex-wrap: wrap; gap: 12px; }.swatch-row.rich { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); }
.color-picker-gallery article:first-child { padding: 18px; }.color-picker-gallery article:nth-child(n+2) { grid-template-columns: 130px minmax(0,1fr); align-items: center; }.color-picker-gallery article:nth-child(n+2) h3 { align-self: start; }
@media (max-width: 720px) { .theme-editor-demo, .theme-setting-demo, .color-field-gallery, .color-slider-gallery, .color-swatch-gallery { grid-template-columns: 1fr; } .color-field-gallery article:last-child { grid-column: auto; grid-template-columns: 1fr; }.color-field-gallery article:last-child h3 { grid-column: auto; }.color-picker-gallery article:nth-child(n+2) { grid-template-columns: 1fr; }.swatch-row.rich { grid-template-columns: 1fr; } }
@media (max-width: 620px) { .gradient-stop-grid { grid-template-columns: 1fr; }.project-color-list article { grid-template-columns: auto minmax(0,1fr); }.project-color-list article .dl-color-picker { grid-column: 1 / -1; } }
</style>
