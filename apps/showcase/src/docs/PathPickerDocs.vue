<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  DlPathPicker,
  type DlPathField,
  type DlPathNode,
  type DlPathPickerAdapter,
  type DlPathValue,
} from '@dragon-liquid/vue'
import type { ComponentDefinition } from '../catalog'
import { componentGuidanceFor } from '../componentGuidance'
import DocExampleShell from '../components/DocExampleShell.vue'
import { vueSfc } from './exampleCode'

const props = defineProps<{ scenario: string; componentDefinition: ComponentDefinition }>()
const selected = ref<DlPathValue[]>([])

const classItems: DlPathNode[] = [
  {
    value: 'grade-3-class-1', label: '三年一班', description: '32 人', selectable: false, children: [
      { value: 'student-zhang', label: '张小满', description: '学号 30101' },
      { value: 'student-li', label: '李知夏', description: '学号 30102' },
    ],
  },
  {
    value: 'grade-3-class-2', label: '三年二班', description: '30 人', selectable: false, children: [
      { value: 'student-wang', label: '王星野', description: '学号 30201' },
      { value: 'student-chen', label: '陈思源', description: '学号 30202' },
    ],
  },
]

const regionItems: DlPathNode[] = [
  { value: 'china', label: '中国', description: '异步加载省份', selectable: false, hasChildren: true },
  { value: 'japan', label: '日本', description: '异步加载都道府县', selectable: false, hasChildren: true },
]

const productItems: DlPathNode[] = [
  {
    value: 'goods', label: '商品', selectable: false, children: [
      {
        value: 'digital', label: '数码产品', selectable: false, children: [
          { value: 'laptop', label: '笔记本电脑', description: '选择后加载规格', fieldSource: 'laptop-fields' },
          { value: 'tablet', label: '平板电脑', description: '选择后加载规格', fieldSource: 'tablet-fields' },
        ],
      },
      {
        value: 'home', label: '家居用品', selectable: false, children: [
          { value: 'desk-lamp', label: '护眼台灯' },
        ],
      },
    ],
  },
]

const multiBranchItems: DlPathNode[] = [
  {
    value: 'engineering', label: '研发中心', selectable: false, children: [
      { value: 'frontend', label: '前端组', selectable: false, children: [{ value: 'lin', label: '林青' }, { value: 'zhou', label: '周屿' }] },
      { value: 'backend', label: '后端组', selectable: false, children: [{ value: 'xu', label: '徐行' }] },
    ],
  },
  {
    value: 'product', label: '产品中心', selectable: false, children: [
      { value: 'design', label: '设计组', selectable: false, children: [{ value: 'su', label: '苏木' }] },
    ],
  },
]

const laptopFields: DlPathField[] = [
  {
    key: 'brand', label: '品牌', type: 'select', required: true, defaultValue: 'lenovo',
    options: [{ value: 'lenovo', label: '联想' }, { value: 'apple', label: 'Apple' }],
  },
  { key: 'model', label: '型号', type: 'select', required: true, source: 'models', dependsOn: ['brand'], placeholder: '先选择品牌' },
  {
    key: 'memory', label: '内存', type: 'multi-select', required: true,
    options: [{ value: '16', label: '16GB' }, { value: '32', label: '32GB' }, { value: '64', label: '64GB' }],
  },
  { key: 'screen', label: '屏幕尺寸', type: 'number', required: true, defaultValue: 14, min: 10, max: 19, step: .1 },
  { key: 'refurbished', label: '允许官翻机', type: 'switch', defaultValue: false },
]

const tabletFields: DlPathField[] = [
  {
    key: 'system', label: '系统', type: 'select', required: true,
    options: [{ value: 'ios', label: 'iPadOS' }, { value: 'android', label: 'Android' }, { value: 'windows', label: 'Windows' }],
  },
  { key: 'cellular', label: '需要蜂窝网络', type: 'switch', defaultValue: false },
]

const regionAdapter: DlPathPickerAdapter = {
  async loadChildren(node) {
    await Promise.resolve()
    if (node.value === 'china') return [
      { value: 'zhejiang', label: '浙江省', selectable: false, children: [{ value: 'hangzhou', label: '杭州市' }, { value: 'ningbo', label: '宁波市' }] },
      { value: 'jiangsu', label: '江苏省', selectable: false, children: [{ value: 'nanjing', label: '南京市' }, { value: 'suzhou', label: '苏州市' }] },
    ]
    return [
      { value: 'tokyo', label: '东京都', selectable: false, children: [{ value: 'shinjuku', label: '新宿区' }, { value: 'setagaya', label: '世田谷区' }] },
    ]
  },
}

const productAdapter: DlPathPickerAdapter = {
  async loadFields(node) {
    await Promise.resolve()
    return node.fieldSource === 'tablet-fields' ? tabletFields : laptopFields
  },
  async loadOptions(field, context) {
    await Promise.resolve()
    if (field.source !== 'models') return []
    return context.parameters.brand === 'apple'
      ? [{ value: 'macbook-air', label: 'MacBook Air' }, { value: 'macbook-pro', label: 'MacBook Pro' }]
      : [{ value: 'xiaoxin-pro', label: '小新 Pro' }, { value: 'thinkbook', label: 'ThinkBook 14+' }]
  },
}

const items = computed(() => {
  if (props.scenario === 'region') return regionItems
  if (props.scenario === 'product-parameters') return productItems
  if (props.scenario === 'multi-branch') return multiBranchItems
  return classItems
})
const adapter = computed<DlPathPickerAdapter | undefined>(() => {
  if (props.scenario === 'region') return regionAdapter
  if (props.scenario === 'product-parameters') return productAdapter
  return undefined
})
const multiple = computed(() => props.scenario === 'multi-branch')
const labels = computed(() => {
  if (props.scenario === 'region') return ['国家', '省份 / 州', '城市 / 区']
  if (props.scenario === 'product-parameters') return ['商品大类', '具体分类', '商品类型']
  if (props.scenario === 'multi-branch') return ['中心', '团队', '成员']
  return ['班级', '学生']
})
const pickerLabel = computed(() => ({
  'class-student': '选择学生',
  region: '选择城市',
  'product-parameters': '配置商品类型',
  'multi-branch': '选择协作成员',
}[props.scenario] ?? '路径选择'))

watch(() => props.scenario, () => { selected.value = [] })

const codeByScenario: Record<string, string> = {
  'class-student': vueSfc({
    imports: ['DlPathPicker', 'type DlPathNode', 'type DlPathValue'],
    script: `import { ref } from 'vue'\n\nconst selected = ref<DlPathValue[]>([])\nconst classes: DlPathNode[] = [{\n  value: 'class-1', label: '三年一班', selectable: false, children: [\n    { value: 'student-1', label: '张小满' },\n    { value: 'student-2', label: '李知夏' },\n  ],\n}]`,
    template: `  <DlPathPicker v-model="selected" :items="classes" :level-labels="['班级', '学生']" label="选择学生" />`,
  }),
  region: vueSfc({
    imports: ['DlPathPicker', 'type DlPathNode', 'type DlPathPickerAdapter'],
    script: `const countries: DlPathNode[] = [\n  { value: 'china', label: '中国', selectable: false, hasChildren: true },\n]\nconst adapter: DlPathPickerAdapter = {\n  async loadChildren(node) {\n    return api.getRegions(node.value)\n  },\n}`,
    template: `  <DlPathPicker v-model="selected" :items="countries" :adapter="adapter" :level-labels="['国家', '省份', '城市']" />`,
  }),
  'product-parameters': vueSfc({
    imports: ['DlPathPicker', 'type DlPathNode', 'type DlPathPickerAdapter'],
    script: `const categories: DlPathNode[] = [{\n  value: 'goods', label: '商品', selectable: false, children: [{\n    value: 'digital', label: '数码产品', selectable: false, children: [\n      { value: 'laptop', label: '笔记本电脑', fieldSource: 'laptop-fields' },\n    ],\n  }],\n}]\nconst adapter: DlPathPickerAdapter = {\n  loadFields: node => api.getFields(node.fieldSource),\n  loadOptions: (field, context) => api.getOptions(field.source, context.parameters),\n}`,
    template: `  <DlPathPicker v-model="selected" :items="categories" :adapter="adapter" />`,
  }),
  'multi-branch': vueSfc({
    imports: ['DlPathPicker', 'type DlPathNode', 'type DlPathValue'],
    script: `import { ref } from 'vue'\n\nconst selected = ref<DlPathValue[]>([])\nconst organization: DlPathNode[] = [/* 中心 → 团队 → 成员 */]`,
    template: `  <DlPathPicker v-model="selected" :items="organization" multiple :max-selections="6" />`,
  }),
}

const content = computed(() => ({
  title: `${props.componentDefinition.name} · ${props.componentDefinition.scenarios.find(item => item.id === props.scenario)?.label}`,
  description: componentGuidanceFor('path-picker').example,
  code: codeByScenario[props.scenario] ?? codeByScenario['class-student'],
  tips: [
    '点击整行进入下一级；再次点击当前分支即可收起。点击右侧“＋”才会形成选择，避免展开和选择互相冲突。',
    '简单场景只传 items；异步层级、动态字段和联动选项才提供 adapter。',
  ],
}))
</script>

<template>
  <DocExampleShell v-bind="content">
    <div class="path-picker-demo">
      <DlPathPicker
        :key="scenario"
        v-model="selected"
        :items="items"
        :adapter="adapter"
        :multiple="multiple"
        :max-selections="multiple ? 6 : undefined"
        :level-labels="labels"
        :label="pickerLabel"
        :description="scenario === 'product-parameters' ? '先选分类，再完成当前分类自己的参数。' : '展开路径与加入选择互相独立。'"
      />
      <details><summary>查看聚合值</summary><pre>{{ JSON.stringify(selected, null, 2) }}</pre></details>
    </div>
  </DocExampleShell>
</template>

<style scoped>
.path-picker-demo { display: grid; width: min(100%, 980px); gap: 12px; margin: 0 auto; padding: 1rem; }
.path-picker-demo details { padding: 10px 12px; border: 1px solid var(--dl-border); border-radius: 12px; color: var(--dl-text-muted); background: var(--dl-night-soft); }
.path-picker-demo summary { cursor: pointer; font-size: .7rem; font-weight: 750; }
.path-picker-demo pre { max-height: 260px; overflow: auto; margin: 10px 0 0; color: var(--dl-accent-text); font: .66rem/1.65 "Cascadia Code", Consolas, monospace; }
</style>
