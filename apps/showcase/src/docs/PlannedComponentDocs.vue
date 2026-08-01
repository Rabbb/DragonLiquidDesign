<script setup lang="ts">
import { computed } from 'vue'
import { DlBadge, DlButton, DlCard } from '@dragon-liquid/vue'
import type { ComponentCategoryId, ComponentDefinition } from '../catalog'

const props = defineProps<{
  scenario: string
  componentDefinition: ComponentDefinition
}>()

const selectedScenario = computed(() => props.componentDefinition.scenarios.find(item => item.id === props.scenario)
  ?? props.componentDefinition.scenarios[0])

const exportName = computed(() => `Dl${props.componentDefinition.id
  .split('-')
  .map(part => part.charAt(0).toUpperCase() + part.slice(1))
  .join('')}`)

const implementationNotes: Record<ComponentCategoryId, string[]> = {
  foundation: ['确认视觉令牌与变体边界', '保持最小公共 API', '补齐键盘与禁用状态'],
  form: ['支持受控值与表单字段语义', '覆盖必填、禁用和校验状态', '验证键盘导航与焦点顺序'],
  color: ['统一颜色空间与输出格式', '联动通道输入、滑块与色板', '补齐可访问名称和对比度反馈'],
  dates: ['统一日期值、时区和本地化边界', '覆盖键盘选择与禁用日期', '验证单值、范围和浮层组合'],
  general: ['组合 Reka UI 行为原语', '接入 Dragon Liquid 外观令牌', '覆盖嵌套、焦点和响应式边界'],
}
</script>

<template>
  <section class="roadmap-doc">
    <div class="roadmap-hero">
      <div class="roadmap-eyebrow">
        <DlBadge tone="accent" variant="outline">ROADMAP</DlBadge>
        <DlBadge v-if="componentDefinition.maturity === 'alpha'" tone="warning" variant="outline">REKA ALPHA</DlBadge>
      </div>
      <span class="roadmap-index">{{ selectedScenario.label }}</span>
      <h2>{{ componentDefinition.name }}</h2>
      <p>
        该组件已纳入 Dragon Liquid Design 目录和场景路由，当前尚未作为
        <code>{{ exportName }}</code> 从组件包导出。本页用于明确实现范围，不会伪造尚不存在的交互案例。
      </p>
      <a v-if="componentDefinition.sourceUrl" :href="componentDefinition.sourceUrl" target="_blank" rel="noreferrer">
        <DlButton variant="secondary">查看 Reka UI 原语 <template #trailing>↗</template></DlButton>
      </a>
    </div>

    <div class="roadmap-grid">
      <DlCard padding="lg" class="roadmap-card">
        <small>SCENARIO</small>
        <h3>{{ selectedScenario.label }}</h3>
        <p>{{ selectedScenario.summary }}。实现时只在此路由加载对应案例，避免目录扩充后一次渲染全部控件。</p>
      </DlCard>
      <DlCard padding="lg" class="roadmap-card">
        <small>IMPLEMENTATION CHECKLIST</small>
        <h3>{{ exportName }}</h3>
        <ul>
          <li v-for="note in implementationNotes[componentDefinition.category]" :key="note"><i />{{ note }}</li>
        </ul>
      </DlCard>
    </div>

    <div class="roadmap-notice">
      <span>i</span>
      <div><b>目录状态不等于可用 API</b><p>只有标记为 READY 的组件可以从当前 npm 包导入；ROADMAP 条目会在实现、测试和发布后切换状态。</p></div>
    </div>
  </section>
</template>
