<script setup lang="ts">
import { computed } from 'vue'
import { DlBadge, DlButton, DlCard } from '@dragon-liquid/vue'
import { componentCatalog, componentCategories, componentRoute } from '../catalog'

const readyCount = computed(() => componentCatalog.filter(component => component.implementation === 'ready').length)
const roadmapCount = computed(() => componentCatalog.length - readyCount.value)
const readyScenarioCount = computed(() => componentCatalog
  .filter(component => component.implementation === 'ready')
  .reduce((total, component) => total + component.scenarios.length, 0))

function componentsFor(categoryId: typeof componentCategories[number]['id']) {
  return componentCatalog.filter(component => component.category === categoryId)
}

function previewFor(categoryId: typeof componentCategories[number]['id']) {
  return [...componentsFor(categoryId)]
    .sort((left, right) => Number(right.implementation === 'ready') - Number(left.implementation === 'ready'))
    .slice(0, 4)
}
</script>

<template>
  <main class="home-main">
    <section class="hero">
      <div class="hero-copy">
        <DlBadge tone="accent" variant="outline" size="md">✦ DRAGON LIQUID DESIGN</DlBadge>
        <h1>让界面拥有<br><em>流动的生命力。</em></h1>
        <p>
          Dragon Liquid Design 是面向 Vue 3 的液态玻璃组件系统。
          它从 TodoMoe 的视觉语言中独立提取，用稳定的设计令牌与可访问组件，
          支撑从内容收藏到后台工具的多种产品界面。
        </p>
        <div class="hero-actions">
          <a href="#/components/button/basic">
            <DlButton size="lg"><template #leading>✦</template>开始浏览组件</DlButton>
          </a>
          <a href="#quick-start">
            <DlButton variant="secondary" size="lg">快速开始<template #trailing>↓</template></DlButton>
          </a>
        </div>
        <div class="tech-row">
          <span>REKA UI</span><i />
          <span>TAILWIND CSS 4</span><i />
          <span>TAILWIND VARIANTS</span>
        </div>
      </div>

      <div class="hero-stage" aria-label="组件库安装方式">
        <div class="orb orb-main"><span>DL</span></div>
        <div class="orb orb-small">◆</div>
        <div class="orbit orbit-one" />
        <div class="orbit orbit-two" />
        <DlCard class="install-card" padding="md">
          <div class="code-head">
            <span><i /> npm package</span>
            <DlBadge tone="success">LOCAL REGISTRY</DlBadge>
          </div>
          <code>npm i @dragon-liquid/vue</code>
          <div class="code-rule" />
          <code><b>import</b> { DlButton } <b>from</b> <q>'@dragon-liquid/vue'</q></code>
        </DlCard>
      </div>
    </section>

    <section class="metrics" aria-label="组件库指标">
      <DlCard v-for="metric in [
        [String(componentCatalog.length).padStart(2, '0'), '组件目录', `${readyCount} READY`],
        [String(readyScenarioCount).padStart(2, '0'), '完成案例', '按需加载'],
        [String(roadmapCount).padStart(2, '0'), '规划组件', 'REKA ROADMAP'],
        ['06', '语义色调', '状态完整'],
      ]" :key="metric[1]" padding="md" class="metric-card">
        <strong>{{ metric[0] }}</strong>
        <div><b>{{ metric[1] }}</b><small>{{ metric[2] }}</small></div>
      </DlCard>
    </section>

    <section class="content-section intro-section">
      <div class="section-heading">
        <span>01 · FOUNDATION</span>
        <div><h2>为真实产品而设计</h2><p>不是孤立的视觉片段，而是一套可以持续演进的界面基础设施。</p></div>
      </div>
      <div class="principle-grid">
        <DlCard v-for="principle in [
          ['01', '可访问的骨架', '以 Reka UI 管理焦点、键盘导航和浮层语义，让视觉表现建立在可靠交互之上。'],
          ['02', '可组合的外观', '以 Tailwind Variants 管理尺寸、色调和状态，避免组件之间产生不可预测的差异。'],
          ['03', '可替换的令牌', '颜色、圆角、阴影和焦点样式通过 CSS Variables 暴露，让业务主题可以安全覆盖。'],
        ]" :key="principle[0]" padding="lg" interactive class="principle-card">
          <span>{{ principle[0] }}</span><h3>{{ principle[1] }}</h3><p>{{ principle[2] }}</p>
        </DlCard>
      </div>
    </section>

    <section class="content-section architecture-section">
      <div class="section-heading">
        <span>02 · ARCHITECTURE</span>
        <div><h2>清晰的技术分层</h2><p>每一层只承担自己的职责，让交互、样式和业务保持松耦合。</p></div>
      </div>
      <DlCard padding="lg" class="architecture-card">
        <div v-for="(layer, index) in [
          ['REKA UI', '无障碍行为与交互原语'],
          ['VUE COMPONENTS', '稳定的 Props、Slots 与事件接口'],
          ['TAILWIND VARIANTS', '类型化的尺寸、色调与状态组合'],
          ['DESIGN TOKENS', 'Dragon Liquid 视觉变量与主题边界'],
        ]" :key="layer[0]" class="architecture-layer">
          <span>{{ String(index + 1).padStart(2, '0') }}</span>
          <div><b>{{ layer[0] }}</b><small>{{ layer[1] }}</small></div>
          <i v-if="index < 3">→</i>
        </div>
      </DlCard>
    </section>

    <section class="content-section catalog-intro">
      <div class="section-heading">
        <span>03 · CATALOG</span>
        <div><h2>从组件目录开始查询</h2><p>组件文档按类别、组件和实际场景分层，只加载正在阅读的内容。</p></div>
      </div>
      <div class="home-catalog-grid">
        <DlCard v-for="category in componentCategories" :key="category.id" padding="lg" class="home-category-card">
          <header><span>{{ category.label }} <small>{{ category.english }}</small></span><DlBadge tone="muted">{{ componentsFor(category.id).length }} ITEMS</DlBadge></header>
          <a
            v-for="item in previewFor(category.id)"
            :key="item.id"
            :href="componentRoute(item.id)"
          >
            <b>{{ item.name }} <em :class="{ alpha: item.maturity === 'alpha' }">{{ item.maturity === 'alpha' ? 'ALPHA' : item.implementation === 'ready' ? 'READY' : 'ROADMAP' }}</em></b>
            <small>{{ item.summary }}</small><i>→</i>
          </a>
          <a class="home-category-more" :href="componentRoute(componentsFor(category.id)[0].id)">
            <b>浏览 {{ category.label }}完整目录</b><small>{{ category.summary }}</small><i>＋{{ Math.max(componentsFor(category.id).length - 4, 0) }}</i>
          </a>
        </DlCard>
      </div>
    </section>

    <section id="quick-start" class="content-section quick-start-section">
      <div class="section-heading">
        <span>04 · QUICK START</span>
        <div><h2>两步接入项目</h2><p>消费构建后的 npm 包，不依赖组件库源码目录。</p></div>
      </div>
      <div class="quick-start-grid">
        <DlCard padding="lg" class="code-panel">
          <div class="code-head"><span><i /> PowerShell</span><DlBadge tone="accent">INSTALL</DlBadge></div>
          <pre><code><b>npm install</b> O:/DragonLiquidDesign/registry/dragon-liquid-vue-0.4.0-alpha.12.tgz</code></pre>
        </DlCard>
        <DlCard padding="lg" class="code-panel">
          <div class="code-head"><span><i /> main.ts</span><DlBadge tone="success">IMPORT</DlBadge></div>
          <pre><code><b>import</b> '@dragon-liquid/vue/style.css'
<b>import</b> { DlButton } <b>from</b> '@dragon-liquid/vue'</code></pre>
        </DlCard>
      </div>
      <div class="home-cta">
        <div><DlBadge tone="accent" variant="outline">READY TO EXPLORE</DlBadge><h3>在按需加载的案例中查看每一个状态。</h3></div>
        <a href="#/components/button/basic"><DlButton size="lg">进入组件文档 <template #trailing>→</template></DlButton></a>
      </div>
    </section>
  </main>
</template>
