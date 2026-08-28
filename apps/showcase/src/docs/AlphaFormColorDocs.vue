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
const format = ref<DlColorFormat>('hex')
const multipleColors = ref<string[]>(['#7aa2f7', '#9ece6a'])
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
const colorExampleTitle = computed(() => ({
  'color-area': '纯二维色域',
  'color-picker': '弹出式自由选色',
  'color-field': '精确色值录入',
  'color-slider': '独立通道调整',
  'color-swatch': '只读颜色样本',
  'color-swatch-picker': '预设色板选择',
}[props.componentDefinition.id] ?? '颜色控件'))
const currentValue = computed(() => {
  if (props.componentDefinition.id === 'autocomplete') return query.value || '等待输入'
  if (props.componentDefinition.id === 'rating') return `${rating.value} / 5`
  if (props.componentDefinition.id === 'color-swatch') return `${swatches.length} 个命名色样`
  if (props.componentDefinition.id === 'color-swatch-picker') return Array.isArray(multipleColors.value) ? multipleColors.value.join(' · ') : color.value
  return color.value
})

const sources: Record<string, VueExampleSource> = {
  autocomplete: { imports: ['DlAutocomplete'], script: `import { ref } from 'vue'\n\nconst keyword = ref('')\nconst suggestions = ['异世界冒险', '异世界日常', '异世界转生']`, template: `  <section class="example">\n    <DlAutocomplete v-model="keyword" :suggestions="suggestions" placeholder="搜索动漫题材" aria-label="动漫题材" />\n    <output>当前文本：{{ keyword || '等待输入' }}</output>\n  </section>`, style: `.example { display: grid; gap: 12px; max-width: 480px; }` },
  rating: { imports: ['DlRating'], script: `import { ref } from 'vue'\n\nconst score = ref(3.5)`, template: `  <DlRating v-model="score" :length="5" :step="0.5" hoverable clearable aria-label="作品评分" />`, style: '' },
  'color-area': { imports: ['DlColorArea'], script: `import { ref } from 'vue'\n\nconst color = ref('#7aa2f7')`, template: `  <DlColorArea v-model="color" aria-label="饱和度与明度二维色域" />`, style: `.dl-color-area { max-width: 680px; }` },
  'color-field': { imports: ['DlColorField'], script: `import { ref } from 'vue'\nimport type { DlColorFormat } from '@dragon-liquid/vue'\n\nconst color = ref('#7aa2f7')\nconst format = ref<DlColorFormat>('hex')`, template: `  <DlColorField\n    v-model="color"\n    v-model:format="format"\n    label="品牌强调色"\n    hint="可粘贴任一受支持格式；Enter 提交，Esc 撤销草稿"\n  />`, style: `.dl-color-field { max-width: 520px; }` },
  'color-picker': { imports: ['DlColorPicker'], script: `import { ref } from 'vue'\n\nconst color = ref('#7aa2f7')`, template: `  <DlColorPicker v-model="color" label="品牌强调色" hint="打开浮层后调整，确认时提交" />`, style: `.dl-color-picker { max-width: 420px; }` },
  'color-slider': { imports: ['DlColorSlider'], script: `import { ref } from 'vue'\n\nconst color = ref('#7aa2f780')`, template: `  <div class="channel-stack">\n    <DlColorSlider v-model="color" channel="hue" label="Hue" show-value />\n    <DlColorSlider v-model="color" channel="saturation" label="Saturation" show-value />\n    <DlColorSlider v-model="color" channel="lightness" label="Lightness" show-value />\n    <DlColorSlider v-model="color" channel="alpha" label="Alpha" show-value />\n  </div>`, style: `.channel-stack { display: grid; gap: 12px; max-width: 680px; }` },
  'color-swatch': { imports: ['DlColorSwatch'], template: `  <DlColorSwatch color="#7aa2f7" label="Tokyo Blue" description="Primary" label-position="right" show-value size="lg" />`, style: '' },
  'color-swatch-picker': { imports: ['DlColorSwatchPicker'], script: `import { ref } from 'vue'\n\nconst color = ref('#7aa2f7')\nconst colors = [\n  { value: '#7aa2f7', label: 'Tokyo Blue', description: 'Primary' },\n  { value: '#bb9af7', label: 'Iris', description: 'Creative' },\n]`, template: `  <DlColorSwatchPicker v-model="color" :colors="colors" show-labels show-values aria-label="品牌主题色" />`, style: `.dl-color-swatch-picker { max-width: 680px; }` },
}

const content = computed(() => ({
  title: isColorControl.value ? `${props.componentDefinition.name} · ${colorExampleTitle.value}` : `${props.componentDefinition.name} · Alpha 先行体验`,
  description: componentGuidanceFor(props.componentDefinition.id).example,
  code: vueSfc(sources[props.componentDefinition.id]),
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
        <DlColorArea v-model="color" aria-label="饱和度与明度二维色域" />
      </section>

      <section v-else-if="componentDefinition.id === 'color-picker'" class="color-picker-trigger-gallery">
        <DlColorPicker v-model="color" v-model:format="format" label="品牌强调色" hint="打开浮层后调整，确认时提交" />
        <DlColorPicker v-model="alphaColor" label="透明强调色" size="sm" />
        <DlColorPicker model-value="#9ece6a" label="只读颜色" readonly />
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
        <article><h3>带语义的品牌色</h3><DlColorSwatchPicker v-model="color" :colors="swatches" show-labels show-values aria-label="品牌主题色" /></article>
        <article><h3>紧凑色板</h3><DlColorSwatchPicker v-model="color" :colors="swatchValues" size="sm" aria-label="紧凑主题色" /></article>
        <article><h3>多选色板</h3><DlColorSwatchPicker v-model="multipleColors" :colors="swatches" multiple show-labels :columns="2" aria-label="图表颜色" /></article>
      </section>

      <output>当前值：{{ currentValue }}</output>
    </div>
  </DocExampleShell>
</template>

<style scoped>
.alpha-form-demo { display: grid; gap: 1.2rem; width: min(100%, 820px); margin: 0 auto; padding: 1rem; }
.alpha-form-demo output { color: var(--dl-text-faint); font: .66rem "Cascadia Code", Consolas, monospace; }
.rating-showcase { display: grid; gap: 1rem; }.rating-showcase > div { display: grid; gap: .4rem; }.rating-showcase span { color: var(--dl-text-faint); font-size: .76rem; }
.color-area-demo { width: min(100%, 680px); }
.color-picker-trigger-gallery, .color-field-gallery, .color-slider-gallery, .color-swatch-gallery, .color-picker-gallery { display: grid; gap: 14px; }
.color-picker-trigger-gallery { width: min(100%, 440px); }
.color-result-bar { display: flex; align-items: center; justify-content: space-between; gap: 18px; padding: 13px; border: 1px solid var(--dl-border); border-radius: var(--dl-radius-md); background: var(--dl-surface); }
.color-result-bar > span, .vertical-channel-card > span { display: grid; gap: 4px; text-align: right; }.color-result-bar b, .vertical-channel-card b { color: var(--dl-text); font-size: .72rem; }.color-result-bar small, .vertical-channel-card small { color: var(--dl-text-faint); font-size: .6rem; }
.color-field-gallery { grid-template-columns: repeat(2, minmax(0,1fr)); }.color-field-gallery article, .color-swatch-gallery article, .color-picker-gallery article { display: grid; align-content: start; gap: 12px; padding: 16px; border: 1px solid var(--dl-border); border-radius: var(--dl-radius-md); background: var(--dl-surface); }.color-field-gallery article:last-child { grid-column: 1 / -1; grid-template-columns: repeat(2,minmax(0,1fr)); }.color-field-gallery article:last-child h3 { grid-column: 1 / -1; }
.alpha-form-demo h3 { margin: 0; color: var(--dl-text); font-size: .76rem; }.channel-field-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 10px; }
.color-slider-gallery { grid-template-columns: minmax(0,1fr) 220px; }.channel-stack { display: grid; align-content: start; gap: 14px; }.vertical-channel-card { display: grid; justify-items: center; gap: 18px; padding: 16px; border: 1px solid var(--dl-border); border-radius: var(--dl-radius-md); background: var(--dl-surface); }.vertical-channel-card > span { text-align: center; }.vertical-channel-card > div { display: flex; gap: 28px; }
.color-swatch-gallery { grid-template-columns: 1fr 1fr; }.swatch-row { display: flex; align-items: center; flex-wrap: wrap; gap: 12px; }.swatch-row.rich { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); }
.color-picker-gallery article:first-child { padding: 18px; }.color-picker-gallery article:nth-child(n+2) { grid-template-columns: 130px minmax(0,1fr); align-items: center; }.color-picker-gallery article:nth-child(n+2) h3 { align-self: start; }
@media (max-width: 720px) { .color-field-gallery, .color-slider-gallery, .color-swatch-gallery { grid-template-columns: 1fr; } .color-field-gallery article:last-child { grid-column: auto; grid-template-columns: 1fr; }.color-field-gallery article:last-child h3 { grid-column: auto; }.color-picker-gallery article:nth-child(n+2) { grid-template-columns: 1fr; }.swatch-row.rich { grid-template-columns: 1fr; } }
</style>
