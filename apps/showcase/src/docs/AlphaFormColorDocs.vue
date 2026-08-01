<script setup lang="ts">
import { computed, ref } from 'vue'
import { DlAutocomplete, DlColorArea, DlColorField, DlColorSlider, DlColorSwatch, DlColorSwatchPicker, DlRating } from '@dragon-liquid/vue'
import type { ComponentDefinition } from '../catalog'
import DocExampleShell from '../components/DocExampleShell.vue'
import { vueSfc, type VueExampleSource } from './exampleCode'

const props = defineProps<{ scenario: string; componentDefinition: ComponentDefinition }>()
const query = ref('异世界')
const rating = ref(4)
const color = ref('#ff8c00')
const swatches = ['#ff8c00', '#ffd700', '#32cd32', '#00ced1', '#4169e1', '#9370db', '#ff69b4']
const suggestions = ['异世界冒险', '异世界日常', '异世界转生', '异世界魔法']

const sources: Record<string, VueExampleSource> = {
  autocomplete: { imports: ['DlAutocomplete'], script: `import { ref } from 'vue'\n\nconst keyword = ref('')\nconst suggestions = ['异世界冒险', '异世界日常', '异世界转生']`, template: `  <DlAutocomplete\n    v-model="keyword"\n    :suggestions="suggestions"\n    placeholder="搜索动漫题材"\n  />` },
  rating: { imports: ['DlRating'], script: `import { ref } from 'vue'\n\nconst score = ref(4)`, template: `  <DlRating v-model="score" :length="5" hoverable clearable />` },
  'color-area': { imports: ['DlColorArea'], script: `import { ref } from 'vue'\n\nconst color = ref('#ff8c00')`, template: `  <DlColorArea v-model="color" color-space="hsl" />` },
  'color-field': { imports: ['DlColorField'], script: `import { ref } from 'vue'\n\nconst color = ref('#ff8c00')`, template: `  <DlColorField v-model="color" placeholder="#RRGGBB" />` },
  'color-slider': { imports: ['DlColorSlider'], script: `import { ref } from 'vue'\n\nconst color = ref('#ff8c00')`, template: `  <DlColorSlider v-model="color" channel="hue" color-space="hsl" />` },
  'color-swatch': { imports: ['DlColorSwatch'], template: `  <div class="swatches">\n    <DlColorSwatch color="#ff8c00" label="Dragon Orange" size="lg" />\n    <DlColorSwatch color="#32cd32" label="Dragon Green" size="lg" />\n  </div>`, style: `.swatches { display: flex; gap: 12px; }` },
  'color-swatch-picker': { imports: ['DlColorSwatchPicker'], script: `import { ref } from 'vue'\n\nconst color = ref('#ff8c00')\nconst colors = ['#ff8c00', '#ffd700', '#32cd32', '#00ced1', '#4169e1']`, template: `  <DlColorSwatchPicker v-model="color" :colors="colors" />` },
}
const content = computed(() => ({
  title: `${props.componentDefinition.name} · Alpha 先行体验`, description: props.componentDefinition.summary,
  code: vueSfc(sources[props.componentDefinition.id]),
  tips: ['Alpha 表示公共 API 仍可能随 Reka UI 演进，但当前组件已可导入和使用。', '示例代码是完整 Vue SFC，可直接复制后运行。'],
}))
</script>

<template>
  <DocExampleShell v-bind="content">
    <div class="alpha-form-demo">
      <DlAutocomplete v-if="componentDefinition.id === 'autocomplete'" v-model="query" :suggestions="suggestions" placeholder="搜索动漫题材" />
      <DlRating v-else-if="componentDefinition.id === 'rating'" v-model="rating" />
      <DlColorArea v-else-if="componentDefinition.id === 'color-area'" v-model="color" />
      <DlColorField v-else-if="componentDefinition.id === 'color-field'" v-model="color" />
      <DlColorSlider v-else-if="componentDefinition.id === 'color-slider'" v-model="color" channel="hue" />
      <div v-else-if="componentDefinition.id === 'color-swatch'" class="swatch-row"><DlColorSwatch v-for="item in swatches" :key="item" :color="item" :label="item" size="lg" /></div>
      <DlColorSwatchPicker v-else v-model="color" :colors="swatches" />
      <output>当前值：{{ componentDefinition.id === 'rating' ? rating : componentDefinition.id === 'autocomplete' ? query : color }}</output>
    </div>
  </DocExampleShell>
</template>

<style scoped>
.alpha-form-demo { display: grid; gap: 1.2rem; width: min(100%, 680px); margin: 0 auto; padding: 1rem; }.swatch-row { display: flex; flex-wrap: wrap; gap: .75rem; }.alpha-form-demo output { color: var(--dl-text-faint); font-size: .76rem; }
</style>
