<script setup lang="ts">
import {
  DlBadge,
  DlBreadcrumbs,
  DlButton,
  DlCard,
  DlCluster,
  DlContainer,
  DlGrid,
  DlNavigationMenu,
  DlPageFrame,
  DlProgress,
  DlSiteHeader,
  DlSiteNavigation,
  DlSiteShell,
  DlStack,
  type DlNavigationItem,
  type DlSiteNavigationGroup,
} from '@dragon-liquid/vue'

const stages = [
  { number: '01', title: '发现', text: '导航、搜索与筛选共同缩小内容范围。', href: '/patterns/library', components: 'Input · Select · Combobox' },
  { number: '02', title: '创建', text: '完整表单负责录入、校验、预览与提交。', href: '/patterns/create', components: 'Form · Validation · Dialog' },
  { number: '03', title: '理解', text: '在保持上下文的前提下逐步查看详情。', href: '/patterns/detail', components: 'Card · Drawer · Tabs' },
  { number: '04', title: '编辑', text: '通过一致的表单和命令体系修改内容。', href: '/patterns/editor', components: 'Mdx · Toolbar · Splitter' },
  { number: '05', title: '执行', text: '长任务展示阶段、进度、异常与恢复入口。', href: '/patterns/import', components: 'Stepper · Progress · Toast' },
  { number: '06', title: '偏好', text: '将持续生效的选择集中在设置页面管理。', href: '/patterns/settings', components: 'Color · Date · Preference' },
  { number: '07', title: '反馈', text: '统一管理全部语义色调、浮层和任务恢复。', href: '/patterns/feedback', components: 'Tone · Layer · Instance' },
  { number: '08', title: '追踪', text: '从任何组件场景定位到可运行页面和源码。', href: '/patterns/coverage', components: '65 Components · 128 Scenes' },
]
const navigationItems: DlNavigationItem[] = [
  { value: 'content', label: '内容工作流', children: [
    { value: 'library', label: '收藏库', description: '搜索、筛选和选择内容', href: '/patterns/library' },
    { value: 'create', label: '创建收藏', description: '完整录入、校验和预览', href: '/patterns/create' },
    { value: 'detail', label: '作品详情', description: '理解内容并维护观看进度', href: '/patterns/detail' },
  ] },
  { value: 'production', label: '生产工作流', children: [
    { value: 'editor', label: '编辑工作台', description: '维护资料和结构化笔记', href: '/patterns/editor' },
    { value: 'import', label: '导入任务', description: '处理阶段化的长时间操作', href: '/patterns/import' },
    { value: 'feedback', label: '任务中心', description: '语义反馈、浮层和恢复动作', href: '/patterns/feedback' },
  ] },
  { value: 'system', label: '系统', children: [
    { value: 'settings', label: '偏好设置', href: '/patterns/settings' },
    { value: 'coverage', label: '覆盖索引', href: '/patterns/coverage' },
  ] },
]
const siteNavigation: DlSiteNavigationGroup[] = [
  { id: 'start', label: '开始', items: [
    { id: 'home', label: '首页', href: '/', icon: '⌂' },
    { id: 'about', label: '项目说明', href: '/about', icon: 'i' },
  ] },
  { id: 'guides', label: '指南', items: [
    { id: 'layout', label: '网站布局', href: '/guides/layout', description: '母版与内容插槽', icon: '▦' },
    { id: 'publish', label: '发布网站', href: '/guides/publish', description: '预览与版本管理', icon: '↗' },
  ] },
]
</script>

<template>
  <section class="pattern-view pattern-overview">
    <div class="pattern-hero">
      <div>
        <div class="pattern-kicker"><DlBadge tone="accent">APPLICATION PATTERNS</DlBadge><span>纯前端参考应用</span></div>
        <h1>让组件形成一条<br>可以记住的工作流</h1>
        <p>这不是控件陈列室。九个页面共享同一份动漫收藏数据，从查找和创建开始，经过详情、编辑与导入，最终把反馈送回用户，并能反查每个组件场景。</p>
        <div class="pattern-actions">
          <a href="/patterns/library"><DlButton variant="primary" size="lg">进入收藏库</DlButton></a>
          <a href="/components/button/basic"><DlButton variant="secondary" size="lg">返回组件 API</DlButton></a>
        </div>
        <div class="pattern-navigation-sample"><small>WORKFLOW NAVIGATION</small><DlNavigationMenu :items="navigationItems" /></div>
      </div>
      <DlCard class="pattern-system-card" padding="lg">
        <small>OFFICIAL INTERACTION LOOP</small>
        <ol>
          <li v-for="stage in stages" :key="stage.number"><b>{{ stage.number }}</b><span>{{ stage.title }}</span></li>
        </ol>
        <DlProgress :model-value="100" tone="accent" size="sm" helper="所有步骤共享状态与反馈语义" />
      </DlCard>
    </div>

    <div class="pattern-section-heading">
      <div><small>ONE SYSTEM · MULTIPLE VIEWS</small><h2>从任务记住组件，而不是背诵 API</h2></div>
      <p>每个阶段都是可独立复制的前端页面，同时也是同一套应用逻辑的一部分。</p>
    </div>

    <div class="pattern-stage-grid">
      <a v-for="stage in stages" :key="stage.number" :href="stage.href">
        <DlCard interactive padding="lg">
          <span class="pattern-stage-number">{{ stage.number }}</span>
          <small>{{ stage.components }}</small>
          <h3>{{ stage.title }}</h3>
          <p>{{ stage.text }}</p>
          <b>打开页面 →</b>
        </DlCard>
      </a>
    </div>

    <div class="pattern-section-heading">
      <div><small>SITE LAYOUT SYSTEM</small><h2>从网站母版开始，而不是从空白页面开始</h2></div>
      <p>目录元数据生成导航，SiteShell 统一套用页头、侧栏、正文插槽与响应式规则。</p>
    </div>

    <DlCard padding="none" class="site-pattern-card">
      <DlSiteShell
        site-name="Atlas Notes"
        caption="由目录结构生成"
        mark="AN"
        :navigation="siteNavigation"
        active-path="/guides/layout"
        navigation-mode="hybrid"
        content-size="md"
        :sticky-header="false"
      >
        <DlStack gap="lg">
          <DlBreadcrumbs :items="[{ label: '首页', href: '/' }, { label: '指南', href: '/guides' }, { label: '网站布局', current: true }]" />
          <DlPageFrame layout="aside" aside-width="170px" gap="24px" :sticky-secondary="false">
            <DlStack gap="sm">
              <DlBadge tone="accent" variant="outline">MASTER PAGE</DlBadge>
              <h2>内容页面只填插槽</h2>
              <p>站点名称、主页地址和运行环境从宿主传入；页面文件只声明标题、路由与分组。</p>
              <DlCluster><DlButton variant="primary" size="sm">编辑页面</DlButton><DlButton variant="secondary" size="sm">预览网站</DlButton></DlCluster>
            </DlStack>
            <template #aside><DlCard padding="sm"><b>当前环境</b><small>preview · zh-CN</small></DlCard></template>
          </DlPageFrame>
          <DlGrid min-item-width="150px" gap="sm">
            <DlCard v-for="item in ['目录导航', '母版插槽', '响应式网格']" :key="item" padding="sm"><b>{{ item }}</b><small>LAYOUT PRIMITIVE</small></DlCard>
          </DlGrid>
        </DlStack>
        <template #actions><DlBadge tone="success">LIVE</DlBadge></template>
      </DlSiteShell>

      <DlContainer size="md" gutter="md" class="site-pattern-anatomy">
        <DlStack gap="sm">
          <small>COMPOSABLE PARTS</small>
          <DlSiteHeader site-name="独立页头" caption="也可脱离母版组合" mark="UI" :sticky="false">
            <template #actions><DlBadge tone="muted">HEADER</DlBadge></template>
          </DlSiteHeader>
          <DlSiteNavigation :groups="siteNavigation" active-path="/guides/layout" mode="tabs" />
        </DlStack>
      </DlContainer>
    </DlCard>
  </section>
</template>

<style scoped>
.site-pattern-card { overflow: hidden; }
.site-pattern-card :deep([data-slot="site-shell"]) { min-height: 520px; }
.site-pattern-card h2, .site-pattern-card p { margin: 0; }
.site-pattern-card p { color: var(--dl-text-muted); line-height: 1.7; }
.site-pattern-card :deep([data-slot="card"]) { display: grid; gap: 7px; }
.site-pattern-card :deep([data-slot="card"] small) { color: var(--dl-text-faint); }
.site-pattern-anatomy { padding-block: 24px; border-top: 1px solid var(--dl-border); }
.site-pattern-anatomy > :deep([data-slot="stack"]) > small { color: var(--dl-text-faint); font: 800 .68rem/1 ui-monospace, monospace; letter-spacing: .12em; }
.site-pattern-anatomy :deep([data-slot="site-header"]) { border: 1px solid var(--dl-border); border-radius: 14px; overflow: hidden; }
</style>
