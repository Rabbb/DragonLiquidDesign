<script setup lang="ts">
import { computed, defineAsyncComponent, ref } from 'vue'
import {
  DlBadge,
  DlInputSearch,
  DlMdx,
  DlSegmented,
  DlSiteShell,
  DlTextarea,
  buildDlMdxProject,
  buildDlMdxUserscript,
  dlMdxOfficialComponents,
  getDlMdxRustCoreStatus,
  resolveDlMdxEventSchema,
  resolveDlMdxPropSchema,
  type DlMdxActionMap,
  type DlMdxFormatOptions,
  type DlMdxLanguageAnalysis,
  type DlChoiceOption,
  type DlMdxProjectSnapshot,
  type DlSiteNavigationItem,
} from '@dragon-liquid/vue'
import MdxProjectWorkbench from '../components/MdxProjectWorkbench.vue'

type MdxDocumentationPageId = 'overview' | 'project' | 'integration' | 'api' | 'editing' | 'language' | 'core' | 'extensions' | 'security'

interface MdxDocumentationPage {
  id: MdxDocumentationPageId
  label: string
  eyebrow: string
  title: string
  description: string
}

const props = defineProps<{ pageId?: string }>()
const documentationGroups: Array<{ label: string; pages: MdxDocumentationPage[] }> = [
  {
    label: '开始',
    pages: [
      { id: 'overview', label: '概览与最新能力', eyebrow: 'MARKDOWNX LANGUAGE', title: '让 MDX 成为主文档', description: '用 Markdown 保持可读写的正文，用安全组件补足交互；脚本、样式与附件由宿主按明确边界管理。' },
    ],
  },
  {
    label: '构建与接入',
    pages: [
      { id: 'project', label: '项目引擎与整站', eyebrow: 'PROJECT & WEBSITE', title: '从一份文档扩展成有目录的网站', description: '用虚拟文件系统、页面隐藏域、自动路由和同构母版连接编辑、预览与发布。' },
      { id: 'integration', label: '宿主接入与附件', eyebrow: 'HOST INTEGRATION', title: '后端契约、附件引用与回收', description: '组件库提供前端适配器契约；业务系统负责鉴权、文件持久化、文档事务与定时回收。' },
    ],
  },
  {
    label: '写作与组件',
    pages: [
      { id: 'api', label: '接口与组件语法', eyebrow: 'MDX API & COMPONENT SYNTAX', title: 'DlMdx 接口与受控组件语法', description: '从 DlMdx 自身的 props、事件和数据结构，到文档内可用的组件块，全部由源码生成并保持同步。' },
      { id: 'editing', label: '编辑、格式与语法', eyebrow: 'AUTHORING', title: '编辑体验回归文本文档', description: '保留自然换行、中文阅读字体、富文本粘贴、高亮语法和确定性格式化，同时让源码随时可见。' },
      { id: 'language', label: '语言服务与事件', eyebrow: 'LANGUAGE SERVICE', title: '让文档拥有类型提示', description: '组件 props、事件和宿主动作汇合为补全、悬浮说明、诊断与快速修复。' },
    ],
  },
  {
    label: '扩展与安全',
    pages: [
      { id: 'core', label: 'Rust / WASM 内核', eyebrow: 'RUST / WASM CORE', title: '同步、内嵌且可回退的解析内核', description: '核心负责 MarkdownX 解析、代码着色、文档统计、URL 协议识别与策略指纹；Vue 层负责安全节点渲染和编辑交互。' },
      { id: 'extensions', label: '共享脚本', eyebrow: 'USERSCRIPT ENGINE', title: '构建可审核、可共享的扩展脚本', description: '在线处理元数据、权限、匹配范围和源码构建，但不在组件库上下文执行用户代码。' },
      { id: 'security', label: '安全边界', eyebrow: 'TRUST BOUNDARY', title: '默认拒绝隐式执行', description: '结构、行为、样式和资源地址各有边界；宿主始终掌握最终的信任与执行权。' },
    ],
  },
]
const documentationPages = documentationGroups.flatMap(group => group.pages)
const activePage = computed(() => documentationPages.find(page => page.id === props.pageId) ?? documentationPages[0])
const activePageIndex = computed(() => documentationPages.findIndex(page => page.id === activePage.value.id))
const previousPage = computed(() => documentationPages[activePageIndex.value - 1])
const nextPage = computed(() => documentationPages[activePageIndex.value + 1])
const ComponentApiTable = defineAsyncComponent(() => import('../components/ComponentApiTable.vue'))
const rustCoreStatus = getDlMdxRustCoreStatus()

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

const layoutPages = ref<Record<string, string>>({
  '/pages/index.mdx': ['---', 'title: Studio home', 'route: /', 'group: main', 'group-title: Studio', 'order: 0', 'layout: landing', '---', '', '# A real site preview', '', '> 修改左侧隐藏域或正文，右侧母版页会立即重建。', '', '## One source of truth', '', '编辑预览与发布页面共享 SiteShell、导航清单和内容插槽。'].join('\n'),
  '/pages/guides/start.mdx': ['---', 'title: Quick start', 'route: /guides/start', 'description: Create the first page', 'order: 1', 'icon: S', 'layout: docs', '---', '', '# Quick start', '', '目录自动成为导航组；`_group.json` 可以为目录设置显示名和顺序。'].join('\n'),
  '/pages/guides/layouts.mdx': ['---', 'title: Layout modes', 'route: /guides/layouts', 'description: Top, side, hybrid and rail', 'order: 2', 'icon: L', 'layout: docs', '---', '', '# Layout modes', '', '页面可以选择 landing、docs、article 或 dashboard，宿主映射为相应导航模式。'].join('\n'),
})
const layoutActivePath = ref('/')
const layoutDevice = ref<'desktop' | 'tablet' | 'mobile'>('desktop')
const layoutDevices: DlChoiceOption[] = [{ value: 'desktop', label: '电脑' }, { value: 'tablet', label: '平板' }, { value: 'mobile', label: '手机' }]
const layoutPreviewWidth = computed(() => ({ desktop: '100%', tablet: '760px', mobile: '390px' })[layoutDevice.value])
const layoutBuild = computed(() => buildDlMdxProject({
  manifest: { schemaVersion: 1, id: 'live-layout-preview', name: 'Northstar Studio', version: '1.0.0', entry: '/pages/index.mdx', metadata: { layout: 'docs' } },
  entries: [
    { kind: 'directory', path: '/' }, { kind: 'directory', path: '/pages' }, { kind: 'directory', path: '/pages/guides' },
    { kind: 'file', path: '/pages/guides/_group.json', language: 'json', encoding: 'utf8', content: '{"title":"Guides","order":10}' },
    ...Object.entries(layoutPages.value).map(([path, content]) => ({ kind: 'file' as const, path, language: 'mdx' as const, encoding: 'utf8' as const, content })),
  ],
  revision: 0,
} satisfies DlMdxProjectSnapshot))
const layoutRoute = computed(() => layoutBuild.value.routes.find(route => route.route === layoutActivePath.value) ?? layoutBuild.value.routes[0])
const layoutSource = computed({
  get: () => layoutRoute.value ? layoutPages.value[layoutRoute.value.file] ?? '' : '',
  set: (value: string) => { if (layoutRoute.value) layoutPages.value = { ...layoutPages.value, [layoutRoute.value.file]: value } },
})
function navigateLayout(item: DlSiteNavigationItem) { layoutActivePath.value = item.href }

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
  if (['Container', 'Stack', 'Cluster', 'Grid', 'PageFrame', 'Breadcrumbs', 'SiteNavigation', 'SiteHeader', 'SiteShell'].includes(name)) return '/mdx/project#site-layout'
  if (name === 'PathPicker') return '/components/path-picker/class-student'
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
    <div class="mdx-documentation-layout">
      <aside class="mdx-documentation-sidebar">
        <a class="mdx-documentation-brand" href="/mdx">
          <span>MX</span>
          <span><b>MarkdownX</b><small>语言与运行时</small></span>
        </a>
        <nav aria-label="MarkdownX 文档分页">
          <section v-for="group in documentationGroups" :key="group.label">
            <h2>{{ group.label }}</h2>
            <a
              v-for="page in group.pages"
              :key="page.id"
              :href="`/mdx/${page.id}`"
              :class="{ active: activePage.id === page.id }"
              :aria-current="activePage.id === page.id ? 'page' : undefined"
            >
              <span>{{ page.label }}</span><small>→</small>
            </a>
          </section>
          <section>
            <h2>组件参考</h2>
            <a href="/components/mdx/basic"><span>DlMdx 组件页</span><small>↗</small></a>
          </section>
        </nav>
      </aside>

      <div class="mdx-documentation-content">
        <header v-if="activePage.id === 'overview'" class="mdx-language-hero">
          <div>
            <DlBadge tone="accent" variant="outline">{{ activePage.eyebrow }}</DlBadge>
            <h1>{{ activePage.title }}</h1>
            <p>{{ activePage.description }}</p>
          </div>
          <dl>
            <div><dt>STRUCTURE</dt><dd>MDX</dd></div>
            <div><dt>BEHAVIOR</dt><dd>Script</dd></div>
            <div><dt>PRESENTATION</dt><dd>Style</dd></div>
          </dl>
        </header>
        <header v-else class="mdx-documentation-heading">
          <small>{{ activePage.eyebrow }}</small>
          <h1>{{ activePage.title }}</h1>
          <p>{{ activePage.description }}</p>
        </header>

        <section v-if="activePage.id === 'overview'" class="mdx-language-section mdx-overview-section">
          <header><small>WHAT'S NEW</small><h2>最新能力已经汇入同一条写作链路</h2><p>从外部内容进入编辑器，到图片持久化、文档保存和最终回收，每个阶段都有明确契约；组件语法仍保持可读、可复制、可版本管理。</p></header>
          <div class="mdx-overview-grid">
            <a href="/components/mdx/html-paste"><b>HTML / Word / WPS 粘贴</b><span>转换标题、列表、表格、样式与图片，优先保留可维护的 MDX。</span><small>打开交互案例 →</small></a>
            <a href="/mdx/integration#attachments"><b>附件引用生命周期</b><span>上传先暂存，保存后再建立引用；无引用文件由宿主按窗口回收。</span><small>查看接入契约 →</small></a>
            <a href="/components/mdx/basic"><b>中文文档阅读</b><span>自然换行、阅读字体切换、渲染优先与图标工具栏共同降低编辑干扰。</span><small>进入 DlMdx →</small></a>
            <a href="/components/mdx/component-blocks"><b>安全组件与高亮</b><span>纯色、渐变、彩虹、呼吸灯、下划线与波浪线都使用受控组件表达。</span><small>查看组件语法 →</small></a>
          </div>
          <div class="mdx-reading-paths">
            <a v-for="page in documentationPages.slice(1)" :key="page.id" :href="`/mdx/${page.id}`">
              <span>{{ page.eyebrow }}</span><b>{{ page.label }}</b><p>{{ page.description }}</p>
            </a>
          </div>
        </section>

    <section v-if="activePage.id === 'project'" id="project-engine" class="mdx-language-section">
      <header><small>01 · PROJECT ENGINE</small><h2>从一份文档，扩展成有目录的线上项目</h2><p>项目模式以虚拟文件系统和清单为核心：页面、脚本、样式、数据与资源各自保存；自动发现路由、执行整项目诊断，并通过存储适配器持久化。下面不是静态示意图，而是可创建、移动、删除、导入、导出和自动保存的项目工作台。</p></header>
      <div class="mdx-engine-model">
        <article><b>DOCUMENT</b><span>单个 <code>DlMdx</code> 仍可作为轻量文档编辑器。</span></article>
        <article><b>PROJECT</b><span><code>DlMdxEngine</code> 管理目录、事务、清单与路由。</span></article>
        <article><b>HOST</b><span>宿主接入数据库、发布流水线与受信动作运行时。</span></article>
      </div>
      <MdxProjectWorkbench />
    </section>

    <section v-if="activePage.id === 'project'" id="site-layout" class="mdx-language-section">
      <header><small>02 · SITE SHELL & ROUTING</small><h2>母版页套内容插槽，目录生成导航</h2><p>这不是静态截图。左侧直接编辑页面 front matter 和正文，右侧使用发布时相同的 SiteShell、分组导航和设备宽度渲染；页面元数据不会出现在正文。</p></header>
      <div class="mdx-site-preview-toolbar"><DlSegmented v-model="layoutDevice" :items="layoutDevices" size="sm" aria-label="整站预览设备" /><code>{{ layoutRoute?.route }} · {{ layoutRoute?.file }}</code></div>
      <div class="mdx-site-preview-grid">
        <DlMdx v-model="layoutSource" mode="split" min-height="36rem" aria-label="可编辑网站页面" />
        <div class="mdx-site-preview-stage"><div class="mdx-site-preview-device" :data-device="layoutDevice" :style="{ width: layoutPreviewWidth }">
          <DlSiteShell
            site-name="Northstar Studio"
            caption="Editable DL-MDX project"
            :environment="{ siteName: 'Northstar Studio', siteCaption: 'HOST ENV · preview', variables: { projectId: 'live-layout-preview' } }"
            :navigation="layoutBuild.navigation"
            :active-path="layoutRoute?.route ?? '/'"
            :navigation-mode="layoutRoute?.metadata.layout === 'landing' ? 'top' : 'hybrid'"
            content-size="md"
            @navigate="navigateLayout"
          >
            <DlMdx :model-value="layoutRoute?.source ?? ''" mode="preview" :show-toolbar="false" :show-status="false" min-height="24rem" max-preview-height="none" />
            <template #footer><div class="mdx-site-preview-footer"><span>Northstar Studio</span><span>{{ layoutBuild.routes.length }} routes</span></div></template>
          </DlSiteShell>
        </div></div>
      </div>
      <div class="mdx-engine-model"><article><b>PAGE FRONT MATTER</b><span><code>title / route / group / order / layout</code> 保存在 MDX 顶部隐藏域。</span></article><article><b>DIRECTORY CONFIG</b><span><code>_group.json</code> 自定义目录组名、顺序、折叠和隐藏状态。</span></article><article><b>HOST ENVIRONMENT</b><span>宿主传入网站名、基础路径、用户与项目变量，页面不硬编码部署环境。</span></article></div>
    </section>

    <section v-if="activePage.id === 'integration'" id="installation" class="mdx-language-section mdx-language-prose">
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

    <section v-if="activePage.id === 'integration'" id="attachments" class="mdx-language-section mdx-language-prose">
      <header><small>ATTACHMENT LIFECYCLE</small><h2>上传只产生暂存文件，保存才改变正式引用</h2><p>推荐把二进制文件与文档附件关系分开存储。<code>DlMdx</code> 只通过适配器处理上传、列举和移除，不绑定某个数据库；宿主在文档保存事务里根据正文资源地址同步指针表和引用计数。</p></header>
      <div class="mdx-lifecycle" aria-label="附件生命周期">
        <article><span>1</span><b>上传</b><p>文件表写入二进制与内容哈希，引用数保持 0，并记录 <code>unreferenced_at</code>。</p></article>
        <i>→</i>
        <article><span>2</span><b>编辑</b><p>返回安全资源 URL 写入 MDX；放弃编辑不会制造正式文档关系。</p></article>
        <i>→</i>
        <article><span>3</span><b>保存</b><p>同一事务对比新旧正文，新增或删除附件指针并原子更新引用计数。</p></article>
        <i>→</i>
        <article><span>4</span><b>回收</b><p>每 30 分钟扫描一次；引用为 0 且已暂存超过 2 小时的文件才可删除。</p></article>
      </div>
      <pre><code>const attachmentAdapter: DlMdxAttachmentAdapter = {
  referenceMode: 'document-save',
  upload: input =&gt; api.uploadPendingFile(input),
  list: () =&gt; api.listDocumentFiles(documentId),
  remove: file =&gt; api.removeDocumentFile(documentId, file.fileId),
}

// POST /documents/:id/save
// save document + sync attachment pointers + update reference counts (one transaction)</code></pre>
      <div class="mdx-contract-table" role="table" aria-label="附件后端职责">
        <div role="row"><b>FILE</b><code>binary + hash + ref_count</code><span>内容实体，可被多份文档或分享记录复用</span></div>
        <div role="row"><b>POINTER</b><code>document_id + file_id</code><span>文件附件表只保存关系，不复制二进制</span></div>
        <div role="row"><b>SAVE</b><code>referenceMode: document-save</code><span>编辑期的替换和移除只改正文与本地管理器</span></div>
        <div role="row"><b>GC</b><code>30 min / 2 hours</code><span>短暂断线或慢速编辑不会误删刚上传的图片</span></div>
      </div>
      <p>引用计数应由指针关系推导和校验，而不是相信浏览器传入的增减值。删除 MDX、替换附件和临时分享链接到期，都应走同一套引用释放逻辑；只有计数归零并越过保护窗口后，物理文件才进入回收。</p>
    </section>

    <section v-if="activePage.id === 'api'" id="mdx-api" class="mdx-language-section">
      <header><small>DLMDX PUBLIC API</small><h2>组件属性、事件和数据结构由源码生成</h2><p>下面只描述 <code>DlMdx</code> 自身的公共接口。生成器直接读取组件 props、受管行为和公开 TypeScript 类型，避免文档与实际发布包发生偏差。</p></header>
      <Suspense>
        <ComponentApiTable component-id="mdx" component-name="DlMdx" />
        <template #fallback><div class="mdx-api-loading">正在加载 DlMdx 接口…</div></template>
      </Suspense>
    </section>

    <section v-if="activePage.id === 'api'" id="component-interface" class="mdx-language-section">
      <header><small>DOCUMENT COMPONENT BLOCKS</small><h2>{{ dlMdxOfficialComponents.length }} 个受控组件块，共用一份可检索接口源</h2><p>这是 MarkdownX 文档语法能够引用的官方注册表，不是组件库目录。搜索组件块名称、属性或事件，可核对文档源码在渲染时允许使用的明确边界。</p></header>
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

    <section v-if="activePage.id === 'core'" id="rust-core" class="mdx-language-section mdx-language-prose">
      <header><small>RUST / WASM CORE</small><h2>解析内核随包内嵌，公共解析 API 保持同步</h2><p>构建阶段把 Rust crate 编译成 WASM 并编码进 npm 包，不发起运行时网络请求。纯 Markdown、MarkdownX 组件块、代码高亮、统计和 URL 协议识别优先走内核；受支持 HTML 仍交给浏览器 DOM 安全适配层。</p></header>
      <div class="mdx-core-status">
        <article><small>ENGINE</small><b>{{ rustCoreStatus.engine }}</b><span>{{ rustCoreStatus.available ? 'READY' : 'FALLBACK' }}</span></article>
        <article><small>ABI</small><b>{{ rustCoreStatus.abiVersion || '—' }}</b><span>同步边界</span></article>
        <article><small>BINARY</small><b>{{ Math.round(rustCoreStatus.binarySize / 1024) }} KB</b><span>包内嵌</span></article>
        <article><small>SHA-256</small><b>{{ rustCoreStatus.binaryFingerprint.slice(0, 12) }}…</b><span>构建指纹</span></article>
      </div>
      <div class="mdx-core-pipeline">
        <article><b>01 · INPUT</b><p>JavaScript 将 UTF-8 文本写入 WASM 线性内存。</p></article><i>→</i>
        <article><b>02 · CORE</b><p>Rust 解析块、行内 token、代码 token 与 URL 类型。</p></article><i>→</i>
        <article><b>03 · MODEL</b><p>JSON 结果还原为强类型 <code>DlMdxDocument</code>。</p></article><i>→</i>
        <article><b>04 · VUE</b><p>Vue 只创建受控节点，不通过 <code>v-html</code> 执行内容。</p></article>
      </div>
      <div class="mdx-contract-table" role="table" aria-label="Rust WASM 内核职责">
        <div role="row"><b>RUST</b><code>parse / highlight / inspect / hash</code><span>确定性文本计算与安全协议识别</span></div>
        <div role="row"><b>TS</b><code>fallback + DOM adapter</code><span>WASM 不可用时兼容回退；白名单 HTML 走 DOMParser</span></div>
        <div role="row"><b>VUE</b><code>editor + renderer</code><span>状态、快捷键、附件管理与安全节点渲染</span></div>
        <div role="row"><b>TEST</b><code>Rust + Vitest parity</code><span>ABI、内存释放、Unicode、重复解析及双实现结果对齐</span></div>
      </div>
      <pre><code>const status = getDlMdxRustCoreStatus()
const document = parseDlMdx('# 中文文档\n\n- [x] 同步解析')

// parseDlMdx 始终是同步 API；WASM 不可用时自动使用 TypeScript 兼容实现。</code></pre>
    </section>

    <section v-if="activePage.id === 'extensions'" id="userscripts" class="mdx-language-section mdx-language-prose">
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

    <section v-if="activePage.id === 'editing'" id="workspace" class="mdx-language-section">
      <header><small>05 · DOCUMENT MODEL</small><h2>一份主文档，两份附加文档</h2><p>切换 MDX、SCRIPT、STYLE 标签即可编辑。三份源码分别通过 v-model 持有，不再把脚本和样式塞进文档正文。</p></header>
      <DlMdx v-model="workspaceMdx" v-model:script-value="workspaceScript" v-model:style-value="workspaceStyle" :actions="actions" show-companion-documents mode="split" min-height="31rem" aria-label="MDX 主文档工作区" />
      <output class="mdx-action-log">{{ eventLog }}</output>
    </section>

    <section v-if="activePage.id === 'language'" id="language-service" class="mdx-language-section">
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

    <section v-if="activePage.id === 'language'" id="events" class="mdx-language-section mdx-language-prose">
      <header><small>07 · DECLARATIVE EVENTS</small><h2>文档引用动作，宿主掌握执行权</h2></header>
      <pre><code>+++component:Button · @click = saveDocument · +++end</code></pre>
      <p><code>@click</code> 必须是组件 schema 声明的事件，<code>saveDocument</code> 必须来自附加脚本的导出契约或宿主 action map。附加脚本不会在预览中自动执行；生产应用决定如何编译、装载并注册真正的处理器。</p>
    </section>

    <section v-if="activePage.id === 'editing'" id="formatter" class="mdx-language-section">
      <header><small>08 · CONFIGURABLE FORMATTER</small><h2>格式可配置，也可重复得到同一结果</h2><p>点击工具栏末尾的 ↹，或按 Shift+Alt+F。下面启用了 schema 顺序、等号对齐、双引号和统一列表符号。</p></header>
      <DlMdx v-model="formatterSource" :format-options="formatOptions" :language-options="{ actionNames: ['publishRelease'] }" mode="split" min-height="24rem" />
    </section>

    <section v-if="activePage.id === 'editing'" id="syntax" class="mdx-language-section">
      <header><small>09 · EDITABLE FEATURE TOUR</small><h2>文档能力必须在编辑中展示</h2><p>标题、引用、任务、表格、代码域和安全组件都应当在同一个可编辑案例里被验证。</p></header>
      <DlMdx v-model="richSource" mode="split" min-height="28rem" />
    </section>

    <section v-if="activePage.id === 'security'" id="security" class="mdx-language-section mdx-language-boundary">
      <header><small>10 · TRUST BOUNDARY</small><h2>分离并不等于隐式执行</h2></header>
      <div>
        <article><b>MDX</b><p>解析为受控 Vue 节点；原始脚本、事件属性和危险 URL 不进入 DOM。</p></article>
        <article><b>Script</b><p>编辑器提取导出符号做类型提示，但预览绝不 eval。应用构建流程负责装载可信实现。</p></article>
        <article><b>Style</b><p>作为独立源码保存，不自动注入全局页面。应用可以在受控作用域内编译和挂载。</p></article>
      </div>
    </section>

        <nav class="mdx-page-pagination" aria-label="MarkdownX 文档前后页">
          <a v-if="previousPage" :href="`/mdx/${previousPage.id}`"><small>← 上一页</small><b>{{ previousPage.label }}</b></a>
          <span v-else />
          <a v-if="nextPage" :href="`/mdx/${nextPage.id}`"><small>下一页 →</small><b>{{ nextPage.label }}</b></a>
        </nav>
      </div>
    </div>
  </main>
</template>

<style scoped>
.mdx-language-page{display:grid;gap:34px;padding:52px 0 96px}.mdx-language-hero{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(280px,.6fr);gap:46px;align-items:end;padding:54px;border:1px solid var(--dl-border);border-radius:30px;background:linear-gradient(135deg,color-mix(in srgb,var(--dl-accent-surface) 78%,transparent),var(--dl-surface));box-shadow:var(--dl-shadow-lg)}.mdx-language-hero h1{max-width:760px;margin:18px 0 16px;font-size:clamp(2.8rem,7vw,6.2rem);line-height:.93;letter-spacing:-.065em}.mdx-language-hero p{max-width:760px;margin:0;color:var(--dl-text-muted);font-size:1.04rem;line-height:1.85}.mdx-language-hero dl{display:grid;gap:10px;margin:0}.mdx-language-hero dl div{display:flex;justify-content:space-between;padding:15px 17px;border:1px solid var(--dl-border);border-radius:14px;background:var(--dl-night-soft)}.mdx-language-hero dt{color:var(--dl-text-faint);font:700 .64rem/1 ui-monospace,monospace;letter-spacing:.12em}.mdx-language-hero dd{margin:0;color:var(--dl-accent-text);font-weight:800}
.mdx-documentation-layout{display:grid;grid-template-columns:224px minmax(0,1fr);gap:30px;align-items:start}.mdx-documentation-content{display:grid;min-width:0;gap:26px}.mdx-documentation-sidebar{position:sticky;top:104px;display:grid;gap:18px;max-height:calc(100vh - 124px);padding:18px 14px;overflow:auto;border:1px solid var(--dl-border);border-radius:20px;background:color-mix(in srgb,var(--dl-surface-strong) 92%,transparent);box-shadow:var(--dl-shadow-sm);backdrop-filter:blur(18px)}.mdx-documentation-brand{display:flex;align-items:center;gap:10px;padding:4px 6px 15px;border-bottom:1px solid var(--dl-border)}.mdx-documentation-brand>span:first-child{display:grid;place-items:center;width:36px;height:36px;border-radius:11px;color:var(--dl-accent-text);background:var(--dl-accent-surface);font:850 .68rem/1 ui-monospace,monospace}.mdx-documentation-brand>span:last-child{display:grid;gap:3px}.mdx-documentation-brand b{font-size:.82rem}.mdx-documentation-brand small{color:var(--dl-text-faint);font-size:.64rem}.mdx-documentation-sidebar nav{display:grid;gap:18px}.mdx-documentation-sidebar nav section{display:grid;gap:3px}.mdx-documentation-sidebar h2{margin:0 7px 5px;color:var(--dl-text-faint);font:800 .58rem/1.3 ui-monospace,monospace;letter-spacing:.11em;text-transform:uppercase}.mdx-documentation-sidebar nav a{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:9px 9px;border-radius:10px;color:var(--dl-text-muted);font-size:.75rem;font-weight:700;transition:background .15s ease,color .15s ease}.mdx-documentation-sidebar nav a small{opacity:0;color:var(--dl-accent-text);transform:translateX(-4px);transition:opacity .15s ease,transform .15s ease}.mdx-documentation-sidebar nav a:hover,.mdx-documentation-sidebar nav a.active{color:var(--dl-text);background:var(--dl-accent-surface)}.mdx-documentation-sidebar nav a:hover small,.mdx-documentation-sidebar nav a.active small{opacity:1;transform:none}
.mdx-documentation-heading{padding:34px 38px;border-left:3px solid var(--dl-accent);border-radius:0 22px 22px 0;background:linear-gradient(110deg,var(--dl-accent-surface),color-mix(in srgb,var(--dl-surface) 88%,transparent))}.mdx-documentation-heading>small{color:var(--dl-accent-text);font:800 .66rem/1 ui-monospace,monospace;letter-spacing:.12em}.mdx-documentation-heading h1{margin:13px 0 10px;font-size:clamp(2rem,4.5vw,4rem);line-height:1;letter-spacing:-.05em}.mdx-documentation-heading p{max-width:820px;margin:0;color:var(--dl-text-muted);line-height:1.8}.mdx-overview-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.mdx-overview-grid a,.mdx-reading-paths a{display:grid;gap:9px;padding:18px;border:1px solid var(--dl-border);border-radius:15px;background:var(--dl-night-soft);transition:border-color .16s ease,transform .16s ease}.mdx-overview-grid a:hover,.mdx-reading-paths a:hover{border-color:var(--dl-border-focus);transform:translateY(-2px)}.mdx-overview-grid b,.mdx-reading-paths b{font-size:.86rem}.mdx-overview-grid span,.mdx-reading-paths p{margin:0;color:var(--dl-text-muted);font-size:.75rem;line-height:1.65}.mdx-overview-grid small,.mdx-reading-paths span{color:var(--dl-accent-text);font:750 .62rem/1.4 ui-monospace,monospace;letter-spacing:.05em}.mdx-reading-paths{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px}.mdx-reading-paths a{min-height:150px}.mdx-page-pagination{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding-top:2px}.mdx-page-pagination a{display:grid;gap:6px;padding:17px 19px;border:1px solid var(--dl-border);border-radius:15px;background:var(--dl-night-soft)}.mdx-page-pagination a:last-child{text-align:right}.mdx-page-pagination a:hover{border-color:var(--dl-border-focus)}.mdx-page-pagination small{color:var(--dl-text-faint);font-size:.66rem}.mdx-page-pagination b{color:var(--dl-accent-text);font-size:.82rem}
.mdx-language-nav{position:sticky;z-index:8;top:8px;display:flex;flex-wrap:wrap;gap:4px;width:max-content;max-width:100%;margin-inline:auto;padding:6px;border:1px solid var(--dl-border);border-radius:15px;background:color-mix(in srgb,var(--dl-surface-strong) 90%,transparent);box-shadow:var(--dl-shadow-md);backdrop-filter:blur(18px)}.mdx-language-nav a{padding:8px 13px;border-radius:10px;color:var(--dl-text-muted);font-size:.78rem;font-weight:700}.mdx-language-nav a:hover{color:var(--dl-accent-text);background:var(--dl-accent-surface)}
.mdx-language-section{scroll-margin-top:100px;display:grid;gap:18px;padding:30px;border:1px solid var(--dl-border);border-radius:24px;background:color-mix(in srgb,var(--dl-surface) 91%,transparent);box-shadow:var(--dl-shadow-sm)}.mdx-language-section>header{max-width:920px}.mdx-language-section>header small{color:var(--dl-accent-text);font:800 .65rem/1 ui-monospace,monospace;letter-spacing:.12em}.mdx-language-section h2{margin:10px 0 8px;font-size:clamp(1.55rem,3vw,2.6rem);letter-spacing:-.035em}.mdx-language-section header p,.mdx-language-prose>p{margin:0;color:var(--dl-text-muted);line-height:1.75}.mdx-action-log,.mdx-diagnostic-head{display:flex;justify-content:space-between;padding:11px 14px;border:1px solid var(--dl-border);border-radius:12px;color:var(--dl-text-muted);background:var(--dl-night-soft);font:700 .72rem/1.4 ui-monospace,monospace}
.mdx-capability-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}.mdx-capability-grid article{display:grid;gap:8px;padding:16px;border:1px solid var(--dl-border);border-radius:14px;background:var(--dl-night-soft)}.mdx-capability-grid b{color:var(--dl-accent-text);font:800 .76rem/1 ui-monospace,monospace}.mdx-capability-grid span{color:var(--dl-text-muted);font-size:.76rem;line-height:1.6}.mdx-diagnostic-list{display:grid;gap:7px;margin:0;padding:0;list-style:none}.mdx-diagnostic-list li{display:grid;grid-template-columns:70px 180px minmax(0,1fr);gap:10px;align-items:baseline;padding:10px 12px;border-bottom:1px solid var(--dl-border);font-size:.74rem}.mdx-diagnostic-list b{color:var(--dl-accent-text);text-transform:uppercase}.mdx-diagnostic-list span{color:var(--dl-text-muted)}.mdx-language-prose pre{overflow:auto;margin:0;padding:20px;border:1px solid var(--dl-border);border-radius:15px;color:var(--dl-accent-text);background:var(--dl-night-soft)}.mdx-language-prose code{font-family:ui-monospace,monospace}.mdx-language-boundary>div{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.mdx-language-boundary article{padding:19px;border:1px solid var(--dl-border);border-radius:15px;background:var(--dl-night-soft)}.mdx-language-boundary b{color:var(--dl-accent-text);font:800 .78rem/1 ui-monospace,monospace}.mdx-language-boundary p{margin:12px 0 0;color:var(--dl-text-muted);font-size:.8rem;line-height:1.7}
.mdx-engine-model{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.mdx-engine-model article{display:grid;gap:9px;padding:15px;border:1px solid var(--dl-border);border-radius:14px;background:var(--dl-night-soft)}.mdx-engine-model b{color:var(--dl-accent-text);font:800 .68rem/1 ui-monospace,monospace;letter-spacing:.08em}.mdx-engine-model span{color:var(--dl-text-muted);font-size:.76rem;line-height:1.65}.mdx-engine-model code{color:var(--dl-text);font-family:ui-monospace,monospace}
.mdx-install-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.mdx-install-grid article{display:grid;gap:12px;padding:18px;border:1px solid var(--dl-border);border-radius:16px;background:var(--dl-night-soft)}.mdx-install-grid article>b{color:var(--dl-accent-text);font:800 .7rem/1 ui-monospace,monospace;letter-spacing:.1em}.mdx-install-grid pre{padding:14px}.mdx-install-grid p{margin:0;color:var(--dl-text-muted);font-size:.78rem;line-height:1.65}.mdx-contract-table{display:grid;border:1px solid var(--dl-border);border-radius:15px;overflow:hidden}.mdx-contract-table>div{display:grid;grid-template-columns:74px minmax(220px,.7fr) 1fr;gap:14px;padding:12px 15px;border-bottom:1px solid var(--dl-border);font-size:.76rem}.mdx-contract-table>div:last-child{border-bottom:0}.mdx-contract-table b{color:var(--dl-accent-text);font-family:ui-monospace,monospace}.mdx-contract-table span{color:var(--dl-text-muted)}.mdx-interface-toolbar{display:grid;grid-template-columns:minmax(240px,440px) auto;align-items:center;gap:14px}.mdx-interface-toolbar>span{color:var(--dl-text-faint);font:700 .7rem/1 ui-monospace,monospace}.mdx-interface-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:10px;max-height:720px;padding-right:5px;overflow:auto}.mdx-interface-card{display:grid;gap:10px;padding:16px;border:1px solid var(--dl-border);border-radius:15px;color:inherit;background:var(--dl-night-soft);transition:border-color .16s ease,transform .16s ease}.mdx-interface-card:hover{border-color:var(--dl-border-focus);transform:translateY(-2px)}.mdx-interface-card header{display:flex;align-items:center;justify-content:space-between;gap:12px}.mdx-interface-card header b{color:var(--dl-text);font-size:.9rem}.mdx-interface-card header span{color:var(--dl-accent-text);font:800 .6rem/1 ui-monospace,monospace;text-transform:uppercase}.mdx-interface-card p{min-height:2.5em;margin:0;color:var(--dl-text-muted);font-size:.74rem;line-height:1.55}.mdx-interface-card dl{display:grid;gap:7px;margin:0}.mdx-interface-card dl div{display:grid;grid-template-columns:48px 1fr;gap:8px;align-items:start}.mdx-interface-card dt{color:var(--dl-text-faint);font:800 .58rem/1.45 ui-monospace,monospace}.mdx-interface-card dd{margin:0;color:var(--dl-text-muted);font:600 .64rem/1.45 ui-monospace,monospace;overflow-wrap:anywhere}.mdx-interface-card i{color:var(--dl-accent-text);font-style:normal}
.mdx-userscript-grid{display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);gap:12px}.mdx-userscript-grid>article{display:grid;grid-template-rows:auto minmax(0,1fr);min-height:310px;border:1px solid var(--dl-border);border-radius:15px;overflow:hidden;background:var(--dl-night-soft)}.mdx-userscript-grid>article>header{display:flex;justify-content:space-between;padding:12px 14px;border-bottom:1px solid var(--dl-border);color:var(--dl-accent-text);font:800 .64rem/1 ui-monospace,monospace}.mdx-userscript-grid>article>header span{color:var(--dl-text-faint)}.mdx-userscript-grid pre{max-height:360px;border:0;border-radius:0}
.mdx-site-preview-toolbar{display:flex;align-items:center;justify-content:space-between;gap:14px}.mdx-site-preview-toolbar code{color:var(--dl-text-faint);font-size:.7rem}.mdx-site-preview-grid{display:grid;grid-template-columns:minmax(0,.85fr) minmax(0,1.15fr);gap:12px;min-width:0}.mdx-site-preview-stage{display:flex;min-width:0;justify-content:center;overflow:auto;padding:14px;border:1px solid var(--dl-border);border-radius:18px;background:var(--dl-night-soft)}.mdx-site-preview-device{min-width:320px;overflow:hidden;border:1px solid var(--dl-border);border-radius:14px;background:var(--dl-night);box-shadow:var(--dl-shadow-lg);transition:width .2s ease}.mdx-site-preview-device :deep(.dl-mdx),.mdx-site-preview-device :deep(.dl-mdx__workspace),.mdx-site-preview-device :deep(.dl-mdx__preview-pane),.mdx-site-preview-device :deep(.dl-mdx__document){border:0;background:transparent;box-shadow:none}.mdx-site-preview-device :deep(.dl-mdx__preview-pane),.mdx-site-preview-device :deep(.dl-mdx__document){padding:0}.mdx-site-preview-footer{display:flex;justify-content:space-between;color:var(--dl-text-faint);font:700 .62rem/1 ui-monospace,monospace}
.mdx-lifecycle{display:grid;grid-template-columns:repeat(7,minmax(0,auto));align-items:stretch;gap:8px}.mdx-lifecycle article{display:grid;grid-template-columns:auto 1fr;align-content:start;gap:8px;padding:15px;border:1px solid var(--dl-border);border-radius:14px;background:var(--dl-night-soft)}.mdx-lifecycle article span{display:grid;place-items:center;width:23px;height:23px;border-radius:999px;color:var(--dl-accent-text);background:var(--dl-accent-surface);font:800 .64rem/1 ui-monospace,monospace}.mdx-lifecycle article b{font-size:.78rem;line-height:23px}.mdx-lifecycle article p{grid-column:1/-1;margin:0;color:var(--dl-text-muted);font-size:.7rem;line-height:1.6}.mdx-lifecycle>i,.mdx-core-pipeline>i{align-self:center;color:var(--dl-text-faint);font-style:normal}.mdx-core-status{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}.mdx-core-status article{display:grid;gap:8px;padding:17px;border:1px solid var(--dl-border);border-radius:14px;background:var(--dl-night-soft)}.mdx-core-status small{color:var(--dl-text-faint);font:800 .58rem/1 ui-monospace,monospace;letter-spacing:.08em}.mdx-core-status b{overflow:hidden;color:var(--dl-accent-text);font:800 1rem/1.2 ui-monospace,monospace;text-overflow:ellipsis}.mdx-core-status span{color:var(--dl-text-muted);font-size:.68rem}.mdx-core-pipeline{display:grid;grid-template-columns:repeat(7,minmax(0,auto));align-items:stretch;gap:8px}.mdx-core-pipeline article{padding:15px;border:1px solid var(--dl-border);border-radius:14px;background:var(--dl-night-soft)}.mdx-core-pipeline b{color:var(--dl-accent-text);font:800 .66rem/1 ui-monospace,monospace}.mdx-core-pipeline p{margin:10px 0 0;color:var(--dl-text-muted);font-size:.72rem;line-height:1.65}.mdx-api-loading{padding:24px;border:1px dashed var(--dl-border);border-radius:14px;color:var(--dl-text-muted);text-align:center}
@media(max-width:1180px){.mdx-documentation-layout{grid-template-columns:200px minmax(0,1fr)}.mdx-reading-paths{grid-template-columns:repeat(2,minmax(0,1fr))}.mdx-site-preview-grid{grid-template-columns:1fr}.mdx-lifecycle,.mdx-core-pipeline{grid-template-columns:repeat(2,minmax(0,1fr))}.mdx-lifecycle>i,.mdx-core-pipeline>i{display:none}}
@media(max-width:900px){.mdx-documentation-layout{grid-template-columns:1fr}.mdx-documentation-sidebar{position:static;max-height:none}.mdx-documentation-sidebar nav{grid-template-columns:repeat(2,minmax(0,1fr))}.mdx-documentation-sidebar nav section:last-child{grid-column:1/-1}.mdx-language-hero{grid-template-columns:1fr;padding:32px}.mdx-capability-grid,.mdx-core-status{grid-template-columns:repeat(2,1fr)}.mdx-language-boundary>div,.mdx-engine-model,.mdx-install-grid,.mdx-userscript-grid{grid-template-columns:1fr}}
@media(max-width:620px){.mdx-language-page{padding-top:28px}.mdx-documentation-sidebar nav,.mdx-overview-grid,.mdx-reading-paths,.mdx-lifecycle,.mdx-core-pipeline{grid-template-columns:1fr}.mdx-language-hero,.mdx-language-section,.mdx-documentation-heading{padding:20px;border-radius:18px}.mdx-language-hero h1{font-size:clamp(2.4rem,15vw,4rem)}.mdx-capability-grid,.mdx-core-status{grid-template-columns:1fr}.mdx-diagnostic-list li,.mdx-contract-table>div{grid-template-columns:1fr}.mdx-language-nav{justify-content:center}.mdx-interface-toolbar{grid-template-columns:1fr}.mdx-interface-grid{grid-template-columns:1fr}.mdx-site-preview-toolbar{align-items:flex-start;flex-direction:column}.mdx-page-pagination{grid-template-columns:1fr}.mdx-page-pagination>span{display:none}.mdx-page-pagination a:last-child{text-align:left}}
</style>
