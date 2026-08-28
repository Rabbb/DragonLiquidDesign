<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  DlBadge,
  DlInputSearch,
  DlMdx,
  DlTextarea,
  buildDlMdxUserscript,
  dlMdxOfficialComponents,
  resolveDlMdxEventSchema,
  resolveDlMdxPropSchema,
  type DlMdxActionMap,
  type DlMdxFormatOptions,
  type DlMdxLanguageAnalysis,
} from '@dragon-liquid/vue'
import MdxProjectWorkbench from '../components/MdxProjectWorkbench.vue'

const workspaceMdx = ref([
  '# Release workspace', '',
  'MDX owns the document structure. Script and Style remain separate companion files.', '',
  '+++component:Button', 'variant = "primary"', 'size = "md"', '@click = saveDocument', '+++end',
].join('\n'))
const workspaceScript = ref([
  '/** Save the current document through an application-owned API. */',
  'export async function saveDocument(context: ActionContext) {',
  '  return context.component.id',
  '}',
].join('\n'))
const workspaceStyle = ref(['.release-document {', '  color: var(--dl-text);', '  background: var(--dl-surface);', '}'].join('\n'))
const eventLog = ref('尚未执行动作')
const actions: DlMdxActionMap = {
  saveDocument: {
    description: '由 Vue 宿主注册的保存动作。',
    handler: ({ component, event }) => { eventLog.value = `${event} → saveDocument · line ${component.sourceLine + 1}` },
  },
}

const typedSource = ref([
  '# Typed component block', '',
  '把光标放在组件名、属性或事件上查看类型；按 Ctrl+Space 主动补全。', '',
  '+++component:Button', 'variant = "primary"', 'size = "lg"', '@click = publishRelease', '+++end',
].join('\n'))
const typedScript = ref([
  '/** Publish the release after validation. */',
  'export function publishRelease(context: ActionContext) {',
  '  console.info(context.event)',
  '}',
].join('\n'))
const typedStyle = ref('/* This companion stylesheet is stored separately. */\n')
const diagnostics = ref<DlMdxLanguageAnalysis>({ diagnostics: [], components: [], errorCount: 0, warningCount: 0 })
const diagnosticLabel = computed(() => `${diagnostics.value.errorCount} errors · ${diagnostics.value.warningCount} warnings`)
function updateDiagnostics(value: DlMdxLanguageAnalysis) { diagnostics.value = value }

const formatterSource = ref([
  '# Formatter playground', '',
  '+++component:Button', 'size=\'sm\'', 'variant=\'secondary\'', '@click=publishRelease', '+++end', '', '', '* one', '* two',
].join('\n'))
const formatOptions: DlMdxFormatOptions = {
  propertyOrder: 'schema', equalsSpacing: 'align', quoteStyle: 'double', bulletMarker: '-', maxBlankLines: 1, trailingNewline: true,
}

const richSource = ref([
  '# Editable language tour', '',
  '> 每一个文档案例都可直接改写，右侧预览实时反映结果。', '',
  '## Content', '', '- [x] headings and tasks', '- [ ] safe registered components', '',
  '| Layer | Responsibility |', '| :--- | :--- |', '| MDX | structure and content |', '| Script | action contract |', '| Style | isolated stylesheet |', '',
  '```typescript', 'type DocumentState = "draft" | "published"', 'const state: DocumentState = "draft"', '```',
].join('\n'))

const componentInterfaceQuery = ref('')
const componentInterfaces = computed(() => {
  const query = componentInterfaceQuery.value.trim().toLocaleLowerCase()
  return dlMdxOfficialComponents.map((definition) => {
    const props = Object.keys(resolveDlMdxPropSchema(definition))
    const events = Object.keys(resolveDlMdxEventSchema(definition))
    return { definition, props, events }
  }).filter(({ definition, props, events }) => !query || [
    definition.name,
    definition.description ?? '',
    definition.category ?? '',
    ...props,
    ...events,
  ].some(value => value.toLocaleLowerCase().includes(query)))
})

function componentDocPath(name: string) {
  const slug = name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLocaleLowerCase()
  return `/components/${slug}/basic`
}

const userscriptSource = ref(["(() => {", "  'use strict'", "  GM_addStyle('article { max-width: 76ch; margin: auto }')", '})()'].join('\n'))
const userscriptBuild = computed(() => buildDlMdxUserscript({
  metadata: {
    id: 'mdx-reading-lens',
    name: 'MDX reading lens',
    namespace: 'https://dragon-liquid.dev/userscripts',
    version: '1.0.0',
    description: 'Add a focused reading layout to published MDX websites.',
    matches: ['https://todo.moe/pw/*'],
    grants: ['GM_addStyle'],
    runAt: 'document-idle',
  },
  source: userscriptSource.value,
}))
</script>

<template>
  <main class="mdx-language-page">
    <header class="mdx-language-hero">
      <div>
        <DlBadge tone="accent" variant="outline">MARKDOWNX LANGUAGE</DlBadge>
        <h1>让 MDX 成为主文档</h1>
        <p>它承担传统 HTML 的结构身份；JavaScript / TypeScript 与 CSS 作为独立附加文档保存。类型系统、诊断、格式化和安全动作协议围绕主文档工作。</p>
      </div>
      <dl>
        <div><dt>STRUCTURE</dt><dd>MDX</dd></div>
        <div><dt>BEHAVIOR</dt><dd>Script</dd></div>
        <div><dt>PRESENTATION</dt><dd>Style</dd></div>
      </dl>
    </header>

    <nav class="mdx-language-nav" aria-label="MarkdownX 文档章节">
      <a href="#project-engine">项目引擎</a><a href="#installation">活网站接入</a><a href="#component-interface">控件接口</a><a href="#userscripts">共享脚本</a><a href="#workspace">工作区</a><a href="#language-service">语言服务</a><a href="#events">事件模型</a>
      <a href="#formatter">格式化</a><a href="#syntax">语言特性</a><a href="#security">边界</a>
    </nav>

    <section id="project-engine" class="mdx-language-section">
      <header><small>01 · PROJECT ENGINE</small><h2>从一份文档，扩展成有目录的线上项目</h2><p>项目模式以虚拟文件系统和清单为核心：页面、脚本、样式、数据与资源各自保存；自动发现路由、执行整项目诊断，并通过存储适配器持久化。下面不是静态示意图，而是可创建、移动、删除、导入、导出和自动保存的项目工作台。</p></header>
      <div class="mdx-engine-model">
        <article><b>DOCUMENT</b><span>单个 <code>DlMdx</code> 仍可作为轻量文档编辑器。</span></article>
        <article><b>PROJECT</b><span><code>DlMdxEngine</code> 管理目录、事务、清单与路由。</span></article>
        <article><b>HOST</b><span>宿主接入数据库、发布流水线与受信动作运行时。</span></article>
      </div>
      <MdxProjectWorkbench />
    </section>

    <section id="installation" class="mdx-language-section mdx-language-prose">
      <header><small>02 · LIVE WEBSITE HOST</small><h2>安装引擎，后端由宿主提供</h2><p>npm 包包含虚拟文件系统、构建器、官方控件注册表和存储适配器；账号、数据库、租户隔离、发布 URL 与 Git 仍由接入网站负责。</p></header>
      <div class="mdx-install-grid">
        <article>
          <b>INSTALL</b>
          <pre><code>npm install @dragon-liquid/vue</code></pre>
          <p>在 <code>main.ts</code> 安装 <code>createDlMdxOfficialRegistry()</code>，再用 <code>createDlMdxEngine()</code> 构建项目路由。</p>
        </article>
        <article>
          <b>HTTP STORAGE</b>
          <pre><code>createDlMdxHttpStorageAdapter({
  baseUrl: '/api/mdx/projects'
})</code></pre>
          <p>适配器读取和写入原始项目 JSON，不强迫后端使用某一种框架或数据库。</p>
        </article>
      </div>
      <div class="mdx-contract-table" role="table" aria-label="MDX 项目后端接口">
        <div role="row"><b>GET</b><code>/api/mdx/projects</code><span>项目摘要数组</span></div>
        <div role="row"><b>GET</b><code>/api/mdx/projects/:id</code><span>项目快照 / 404</span></div>
        <div role="row"><b>PUT</b><code>/api/mdx/projects/:id</code><span>保存原始项目快照</span></div>
        <div role="row"><b>DELETE</b><code>/api/mdx/projects/:id</code><span>删除当前用户项目</span></div>
      </div>
      <p>附加脚本只参与动作类型、补全和诊断，绝不隐式 eval。宿主通过 <code>actions</code> 注册可信实现，并负责权限、容量、CSP 与资源 URL 校验。仓库中的 <code>docs/MDX_WEBSITE_HOSTING.md</code> 提供完整源码和后端检查清单。</p>
    </section>

    <section id="component-interface" class="mdx-language-section">
      <header><small>03 · COMPONENT INTERFACES</small><h2>89 个控件，共用一份可检索接口源</h2><p>这里直接读取官方 MDX 注册表，而不是复制一份静态清单。搜索控件名、用途、属性或事件；进入控件页可查看取值范围、默认值、丰富案例和实例 API。</p></header>
      <div class="mdx-interface-toolbar">
        <DlInputSearch v-model="componentInterfaceQuery" placeholder="搜索 Button、modelValue、click…" aria-label="搜索 MDX 控件接口" />
        <span>{{ componentInterfaces.length }} / {{ dlMdxOfficialComponents.length }}</span>
      </div>
      <div class="mdx-interface-grid">
        <a v-for="item in componentInterfaces" :key="item.definition.name" :href="componentDocPath(item.definition.name)" class="mdx-interface-card">
          <header><b>{{ item.definition.name }}</b><span>{{ item.definition.maturity ?? 'stable' }}</span></header>
          <p>{{ item.definition.description || `${item.definition.category ?? 'general'} component` }}</p>
          <dl>
            <div><dt>PROPS</dt><dd>{{ item.props.slice(0, 6).join(' · ') || '—' }}<i v-if="item.props.length > 6"> +{{ item.props.length - 6 }}</i></dd></div>
            <div><dt>EVENTS</dt><dd>{{ item.events.slice(0, 4).join(' · ') || '—' }}<i v-if="item.events.length > 4"> +{{ item.events.length - 4 }}</i></dd></div>
          </dl>
        </a>
      </div>
    </section>

    <section id="userscripts" class="mdx-language-section mdx-language-prose">
      <header><small>04 · USERSCRIPT ENGINE</small><h2>把扩展脚本构建成可审核、可共享的安装源</h2><p>DL-MDX userscript 引擎理解标准元数据、权限、目标网站和版本，并生成 Tampermonkey / Violentmonkey 可安装的 <code>.user.js</code>。它可以解析既有脚本、判断 URL 是否匹配，但构建时永远不执行源码。</p></header>
      <div class="mdx-userscript-grid">
        <div><DlTextarea v-model="userscriptSource" :rows="12" aria-label="可编辑 userscript 源码" /></div>
        <article>
          <header><b>{{ userscriptBuild.ok ? 'BUILD READY' : 'BUILD BLOCKED' }}</b><span>{{ userscriptBuild.diagnostics.length }} diagnostics</span></header>
          <pre><code>{{ userscriptBuild.code }}</code></pre>
        </article>
      </div>
      <div class="mdx-engine-model">
        <article><b>AUTHOR</b><span>在线编辑源码，声明 <code>@match</code>、<code>@grant</code>、依赖和运行时机。</span></article>
        <article><b>SHARE</b><span>宿主保存作者、版本、说明与公开状态，提供可搜索目录和安装 URL。</span></article>
        <article><b>INSTALL</b><span>第三方网站的注入由浏览器扩展执行；普通网页不能绕过同源策略。</span></article>
      </div>
    </section>

    <section id="workspace" class="mdx-language-section">
      <header><small>05 · DOCUMENT MODEL</small><h2>一份主文档，两份附加文档</h2><p>切换 MDX、SCRIPT、STYLE 标签即可编辑。三份源码分别通过 v-model 持有，不再把脚本和样式塞进文档正文。</p></header>
      <DlMdx v-model="workspaceMdx" v-model:script-value="workspaceScript" v-model:style-value="workspaceStyle" :actions="actions" show-companion-documents mode="split" min-height="31rem" aria-label="MDX 主文档工作区" />
      <output class="mdx-action-log">{{ eventLog }}</output>
    </section>

    <section id="language-service" class="mdx-language-section">
      <header><small>06 · LANGUAGE SERVICE</small><h2>类型提示不是属性清单</h2><p>注册组件的 Vue props、显式 schema、emits 和 Script 导出动作会汇合成文档语言模型。</p></header>
      <div class="mdx-capability-grid">
        <article><b>Ctrl + Space</b><span>组件、属性、事件、动作与枚举值补全</span></article>
        <article><b>Hover</b><span>悬浮查看类型、范围、必填状态和说明</span></article>
        <article><b>Diagnostics</b><span>未知组件、类型、范围、重复 ID 与事件检查</span></article>
        <article><b>Quick Fix</b><span>诊断面板提供可安全应用的局部修复</span></article>
      </div>
      <div class="mdx-diagnostic-head"><span>实时自检</span><code>{{ diagnosticLabel }}</code></div>
      <DlMdx v-model="typedSource" v-model:script-value="typedScript" v-model:style-value="typedStyle" show-companion-documents mode="split" min-height="28rem" @diagnostics="updateDiagnostics" />
      <ul v-if="diagnostics.diagnostics.length" class="mdx-diagnostic-list">
        <li v-for="item in diagnostics.diagnostics.slice(0, 6)" :key="`${item.code}-${item.from}`"><b>{{ item.severity }}</b><code>{{ item.code }}</code><span>Ln {{ item.line }} · {{ item.message }}</span></li>
      </ul>
    </section>

    <section id="events" class="mdx-language-section mdx-language-prose">
      <header><small>07 · DECLARATIVE EVENTS</small><h2>文档引用动作，宿主掌握执行权</h2></header>
      <pre><code>+++component:Button · @click = saveDocument · +++end</code></pre>
      <p><code>@click</code> 必须是组件 schema 声明的事件，<code>saveDocument</code> 必须来自附加脚本的导出契约或宿主 action map。附加脚本不会在预览中自动执行；生产应用决定如何编译、装载并注册真正的处理器。</p>
    </section>

    <section id="formatter" class="mdx-language-section">
      <header><small>08 · CONFIGURABLE FORMATTER</small><h2>格式可配置，也可重复得到同一结果</h2><p>点击工具栏末尾的 ↹，或按 Shift+Alt+F。下面启用了 schema 顺序、等号对齐、双引号和统一列表符号。</p></header>
      <DlMdx v-model="formatterSource" :format-options="formatOptions" :language-options="{ actionNames: ['publishRelease'] }" mode="split" min-height="24rem" />
    </section>

    <section id="syntax" class="mdx-language-section">
      <header><small>09 · EDITABLE FEATURE TOUR</small><h2>文档能力必须在编辑中展示</h2><p>标题、引用、任务、表格、代码域和安全组件都应当在同一个可编辑案例里被验证。</p></header>
      <DlMdx v-model="richSource" mode="split" min-height="28rem" />
    </section>

    <section id="security" class="mdx-language-section mdx-language-boundary">
      <header><small>10 · TRUST BOUNDARY</small><h2>分离并不等于隐式执行</h2></header>
      <div>
        <article><b>MDX</b><p>解析为受控 Vue 节点；原始脚本、事件属性和危险 URL 不进入 DOM。</p></article>
        <article><b>Script</b><p>编辑器提取导出符号做类型提示，但预览绝不 eval。应用构建流程负责装载可信实现。</p></article>
        <article><b>Style</b><p>作为独立源码保存，不自动注入全局页面。应用可以在受控作用域内编译和挂载。</p></article>
      </div>
    </section>
  </main>
</template>

<style scoped>
.mdx-language-page{display:grid;gap:34px;padding:52px 0 96px}.mdx-language-hero{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(280px,.6fr);gap:46px;align-items:end;padding:54px;border:1px solid var(--dl-border);border-radius:30px;background:linear-gradient(135deg,color-mix(in srgb,var(--dl-accent-surface) 78%,transparent),var(--dl-surface));box-shadow:var(--dl-shadow-lg)}.mdx-language-hero h1{max-width:760px;margin:18px 0 16px;font-size:clamp(2.8rem,7vw,6.2rem);line-height:.93;letter-spacing:-.065em}.mdx-language-hero p{max-width:760px;margin:0;color:var(--dl-text-muted);font-size:1.04rem;line-height:1.85}.mdx-language-hero dl{display:grid;gap:10px;margin:0}.mdx-language-hero dl div{display:flex;justify-content:space-between;padding:15px 17px;border:1px solid var(--dl-border);border-radius:14px;background:var(--dl-night-soft)}.mdx-language-hero dt{color:var(--dl-text-faint);font:700 .64rem/1 ui-monospace,monospace;letter-spacing:.12em}.mdx-language-hero dd{margin:0;color:var(--dl-accent-text);font-weight:800}
.mdx-language-nav{position:sticky;z-index:8;top:8px;display:flex;flex-wrap:wrap;gap:4px;width:max-content;max-width:100%;margin-inline:auto;padding:6px;border:1px solid var(--dl-border);border-radius:15px;background:color-mix(in srgb,var(--dl-surface-strong) 90%,transparent);box-shadow:var(--dl-shadow-md);backdrop-filter:blur(18px)}.mdx-language-nav a{padding:8px 13px;border-radius:10px;color:var(--dl-text-muted);font-size:.78rem;font-weight:700}.mdx-language-nav a:hover{color:var(--dl-accent-text);background:var(--dl-accent-surface)}
.mdx-language-section{scroll-margin-top:100px;display:grid;gap:18px;padding:30px;border:1px solid var(--dl-border);border-radius:24px;background:color-mix(in srgb,var(--dl-surface) 91%,transparent);box-shadow:var(--dl-shadow-sm)}.mdx-language-section>header{max-width:920px}.mdx-language-section>header small{color:var(--dl-accent-text);font:800 .65rem/1 ui-monospace,monospace;letter-spacing:.12em}.mdx-language-section h2{margin:10px 0 8px;font-size:clamp(1.55rem,3vw,2.6rem);letter-spacing:-.035em}.mdx-language-section header p,.mdx-language-prose>p{margin:0;color:var(--dl-text-muted);line-height:1.75}.mdx-action-log,.mdx-diagnostic-head{display:flex;justify-content:space-between;padding:11px 14px;border:1px solid var(--dl-border);border-radius:12px;color:var(--dl-text-muted);background:var(--dl-night-soft);font:700 .72rem/1.4 ui-monospace,monospace}
.mdx-capability-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}.mdx-capability-grid article{display:grid;gap:8px;padding:16px;border:1px solid var(--dl-border);border-radius:14px;background:var(--dl-night-soft)}.mdx-capability-grid b{color:var(--dl-accent-text);font:800 .76rem/1 ui-monospace,monospace}.mdx-capability-grid span{color:var(--dl-text-muted);font-size:.76rem;line-height:1.6}.mdx-diagnostic-list{display:grid;gap:7px;margin:0;padding:0;list-style:none}.mdx-diagnostic-list li{display:grid;grid-template-columns:70px 180px minmax(0,1fr);gap:10px;align-items:baseline;padding:10px 12px;border-bottom:1px solid var(--dl-border);font-size:.74rem}.mdx-diagnostic-list b{color:var(--dl-accent-text);text-transform:uppercase}.mdx-diagnostic-list span{color:var(--dl-text-muted)}.mdx-language-prose pre{overflow:auto;margin:0;padding:20px;border:1px solid var(--dl-border);border-radius:15px;color:var(--dl-accent-text);background:var(--dl-night-soft)}.mdx-language-prose code{font-family:ui-monospace,monospace}.mdx-language-boundary>div{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.mdx-language-boundary article{padding:19px;border:1px solid var(--dl-border);border-radius:15px;background:var(--dl-night-soft)}.mdx-language-boundary b{color:var(--dl-accent-text);font:800 .78rem/1 ui-monospace,monospace}.mdx-language-boundary p{margin:12px 0 0;color:var(--dl-text-muted);font-size:.8rem;line-height:1.7}
.mdx-engine-model{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.mdx-engine-model article{display:grid;gap:9px;padding:15px;border:1px solid var(--dl-border);border-radius:14px;background:var(--dl-night-soft)}.mdx-engine-model b{color:var(--dl-accent-text);font:800 .68rem/1 ui-monospace,monospace;letter-spacing:.08em}.mdx-engine-model span{color:var(--dl-text-muted);font-size:.76rem;line-height:1.65}.mdx-engine-model code{color:var(--dl-text);font-family:ui-monospace,monospace}
.mdx-install-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.mdx-install-grid article{display:grid;gap:12px;padding:18px;border:1px solid var(--dl-border);border-radius:16px;background:var(--dl-night-soft)}.mdx-install-grid article>b{color:var(--dl-accent-text);font:800 .7rem/1 ui-monospace,monospace;letter-spacing:.1em}.mdx-install-grid pre{padding:14px}.mdx-install-grid p{margin:0;color:var(--dl-text-muted);font-size:.78rem;line-height:1.65}.mdx-contract-table{display:grid;border:1px solid var(--dl-border);border-radius:15px;overflow:hidden}.mdx-contract-table>div{display:grid;grid-template-columns:74px minmax(220px,.7fr) 1fr;gap:14px;padding:12px 15px;border-bottom:1px solid var(--dl-border);font-size:.76rem}.mdx-contract-table>div:last-child{border-bottom:0}.mdx-contract-table b{color:var(--dl-accent-text);font-family:ui-monospace,monospace}.mdx-contract-table span{color:var(--dl-text-muted)}.mdx-interface-toolbar{display:grid;grid-template-columns:minmax(240px,440px) auto;align-items:center;gap:14px}.mdx-interface-toolbar>span{color:var(--dl-text-faint);font:700 .7rem/1 ui-monospace,monospace}.mdx-interface-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:10px;max-height:720px;padding-right:5px;overflow:auto}.mdx-interface-card{display:grid;gap:10px;padding:16px;border:1px solid var(--dl-border);border-radius:15px;color:inherit;background:var(--dl-night-soft);transition:border-color .16s ease,transform .16s ease}.mdx-interface-card:hover{border-color:var(--dl-border-focus);transform:translateY(-2px)}.mdx-interface-card header{display:flex;align-items:center;justify-content:space-between;gap:12px}.mdx-interface-card header b{color:var(--dl-text);font-size:.9rem}.mdx-interface-card header span{color:var(--dl-accent-text);font:800 .6rem/1 ui-monospace,monospace;text-transform:uppercase}.mdx-interface-card p{min-height:2.5em;margin:0;color:var(--dl-text-muted);font-size:.74rem;line-height:1.55}.mdx-interface-card dl{display:grid;gap:7px;margin:0}.mdx-interface-card dl div{display:grid;grid-template-columns:48px 1fr;gap:8px;align-items:start}.mdx-interface-card dt{color:var(--dl-text-faint);font:800 .58rem/1.45 ui-monospace,monospace}.mdx-interface-card dd{margin:0;color:var(--dl-text-muted);font:600 .64rem/1.45 ui-monospace,monospace;overflow-wrap:anywhere}.mdx-interface-card i{color:var(--dl-accent-text);font-style:normal}
.mdx-userscript-grid{display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);gap:12px}.mdx-userscript-grid>article{display:grid;grid-template-rows:auto minmax(0,1fr);min-height:310px;border:1px solid var(--dl-border);border-radius:15px;overflow:hidden;background:var(--dl-night-soft)}.mdx-userscript-grid>article>header{display:flex;justify-content:space-between;padding:12px 14px;border-bottom:1px solid var(--dl-border);color:var(--dl-accent-text);font:800 .64rem/1 ui-monospace,monospace}.mdx-userscript-grid>article>header span{color:var(--dl-text-faint)}.mdx-userscript-grid pre{max-height:360px;border:0;border-radius:0}
@media(max-width:900px){.mdx-language-hero{grid-template-columns:1fr;padding:32px}.mdx-capability-grid{grid-template-columns:repeat(2,1fr)}.mdx-language-boundary>div,.mdx-engine-model,.mdx-install-grid,.mdx-userscript-grid{grid-template-columns:1fr}}@media(max-width:620px){.mdx-language-page{padding-top:28px}.mdx-language-hero,.mdx-language-section{padding:20px;border-radius:18px}.mdx-capability-grid{grid-template-columns:1fr}.mdx-diagnostic-list li,.mdx-contract-table>div{grid-template-columns:1fr}.mdx-language-nav{justify-content:center}.mdx-interface-toolbar{grid-template-columns:1fr}.mdx-interface-grid{grid-template-columns:1fr}}
</style>
