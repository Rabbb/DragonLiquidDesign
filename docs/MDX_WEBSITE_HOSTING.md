# DL-MDX 活网站接入指南

DL-MDX 可以只作为文档编辑器，也可以作为拥有目录、路由、附加脚本、样式和存储适配器的活网站引擎。npm 包负责浏览器端能力；账号、数据库、租户隔离、发布地址与 Git 工作流由宿主网站提供。

## 安装

```powershell
npm install @dragon-liquid/vue
```

在 Vue 入口安装主题和官方 MDX 控件注册表：

```ts
import { createApp } from 'vue'
import {
  createDlMdxOfficialRegistry,
  createDlTheme,
} from '@dragon-liquid/vue'
import App from './App.vue'

createApp(App)
  .use(createDlTheme())
  .use(createDlMdxOfficialRegistry())
  .mount('#app')
```

## 从项目源码构建网站

一个项目快照由 `manifest`、`entries` 和 `revision` 组成。页面放在 `/pages`，共享脚本与样式可放在 `/shared`，图片和数据可放在 `/assets`。

```ts
import {
  createDlMdxEngine,
  createDlMdxHttpStorageAdapter,
  type DlMdxProjectSnapshot,
} from '@dragon-liquid/vue'

const project: DlMdxProjectSnapshot = {
  manifest: {
    schemaVersion: 1,
    id: 'product-handbook',
    name: 'Product handbook',
    version: '1.0.0',
    entry: '/pages/index.mdx',
    sharedScripts: ['/shared/actions.js'],
    sharedStyles: ['/shared/site.css'],
  },
  entries: [
    { kind: 'directory', path: '/' },
    { kind: 'directory', path: '/pages' },
    { kind: 'directory', path: '/shared' },
    { kind: 'file', path: '/pages/index.mdx', language: 'mdx', encoding: 'utf8', content: '# Home' },
    { kind: 'file', path: '/shared/actions.js', language: 'javascript', encoding: 'utf8', content: 'export function publish() {}' },
    { kind: 'file', path: '/shared/site.css', language: 'css', encoding: 'utf8', content: '.site { color: var(--dl-text); }' },
  ],
  revision: 0,
}

const engine = createDlMdxEngine({ project })
const build = engine.build()
const home = build.routes.find(route => route.route === '/')

await engine.save(createDlMdxHttpStorageAdapter({
  baseUrl: '/api/mdx/projects',
  headers: { authorization: `Bearer ${token}` },
}))
```

构建结果中的每条路由均提供 `source`、`rawSource`、`metadata`、`script`、`style`、`scriptFiles`、`styleFiles`、动作符号和诊断结果。`source` 已移除隐藏页面元数据，适合预览；`rawSource` 保留编辑器原文。构建结果还提供按目录整理的 `navigation` 分组。

## 页面隐藏域与目录导航

每个页面可以在文件最前面声明类似 Next 文档系统的隐藏 front matter。它不会进入正文渲染：

```mdx
---
title: Quick start
route: /guides/start
description: Create the first project
group: guides
group-title: Guides
group-order: 10
order: 1
icon: S
layout: docs
hidden: false
---

# Quick start
```

`title`、`route`、`order` 和 `layout` 属于页面；`group` 可以跨目录合并菜单组。没有显式 `group` 时，引擎直接使用 `/pages` 下的目录。目录内可增加 `_group.json` 自定义组名：

```json
{
  "title": "Build with DL",
  "order": 20,
  "collapsed": false,
  "hidden": false
}
```

页面配置优先于 manifest 中同文件的旧式路由声明；没有配置时仍按 `/pages/guides/start.mdx → /guides/start` 推导。无效路由、元数据类型和 `_group.json` 会进入整项目诊断。

## 用户可编辑母版与函数化页面

网站的页面骨架不再写死在宿主中。项目可在清单中声明一份用户自己的母版和若干 JSON 数据文件；宿主只注入菜单、当前路由、项目清单等运行环境：

```ts
const project = {
  manifest: {
    id: 'product-handbook',
    name: 'Product handbook',
    entry: '/pages/index.mdx',
    layout: '/layouts/default.mdx',
    dataFiles: ['/data/site.json'],
    sharedStyles: ['/shared/site.css'],
  },
  entries: [
    { kind: 'file', path: '/data/site.json', language: 'json', encoding: 'utf8', content: '{"hero":{"title":"Build freely"}}' },
  ],
}
```

母版采用受控的函数式 MDX。语法接近 JSX / Razor，但不会通过 `eval` 或 `new Function` 执行字符串：

```mdx
function Brand({ name }) {
  return <strong>{name}</strong>;
}

export default function Layout() {
  return (
    <SiteShell
      siteName={$dlx.project.name}
      navigation={$dlx.navigation}
      activePath={$dlx.route.path}
      navigationMode={$dlx.env.navigationMode ?? "hybrid"}
      onNavigate={$dlx.actions.navigate}
    >
      <Brand name={$dlx.project.name} />
      <If when={$dlx.env.preview}><Badge>PREVIEW</Badge></If>
      <Slot name="page" />
      <Fill name="footer"><small>{$dlx.data.site.footer}</small></Fill>
    </SiteShell>
  );
}
```

函数式内容页增加 `renderer: template`，可以自行决定页面结构和数据循环；普通 Markdown 页面仍由 `DlMdx` 渲染，并填入母版的 `page` 插槽：

```mdx
---
title: Home
route: /
renderer: template
---

export default function Home() {
  const hero = $dlx.data.site.hero;
  return (
    <main class="home">
      <h1>{hero.title}</h1>
      <For each={hero.features} as="feature">
        <Card><h2>{feature.title}</h2><p>{feature.description}</p></Card>
      </For>
    </main>
  );
}
```

运行时内置 `Fragment`、`If` / `Else`、`For`、`Slot` 和 `Fill`。表达式支持安全的属性读取、数组/对象、算术与逻辑运算、空值合并和三元表达式；不允许任意函数调用、原型链访问、动态导入或直接执行 JavaScript。可调用行为只能来自宿主审核后注入的 `$dlx.actions`。

`DLX` 是语言和引擎名称，`$dlx` 是母版与页面唯一的只读运行时入口。它是保留字，不能被函数参数或局部变量覆盖。宿主必须向母版和页面传入同一组上下文：

- `$dlx.env`：用户名、公开地址、预览态、设备或导航模式等外部环境；
- `$dlx.navigation`：引擎从项目目录和页面元数据生成的菜单；
- `$dlx.route`、`$dlx.page`：当前路径、标题、文件和页面元数据；
- `$dlx.project`：项目清单；
- `$dlx.data`：`dataFiles` 合并后的 JSON 数据；
- `$dlx.actions`：经过宿主授权的导航、保存或业务动作；
- `$dlx.state`：宿主提供的页面运行时状态。

`DlSiteShell`、`DlContainer`、`DlStack`、`DlCluster`、`DlGrid`、`DlPageFrame` 等只是可选积木，不再是不可修改的外壳。正式发布、草稿预览和编辑器预览应调用同一个 `DlMdxTemplate` 运行时和同一份项目源码。

## JavaScript 安全边界

附加 JavaScript / TypeScript 用于导出动作契约、补全、悬浮类型和诊断，DL-MDX 不会隐式 `eval` 用户脚本。生产宿主必须把文档中的动作名映射到审核过的函数：

```ts
const trustedActions = {
  publish: async ({ component, event }) => {
    await api.publish({ componentId: component.id, event })
  },
}
```

如果产品确实需要执行用户代码，应使用隔离构建服务、独立源站、严格 CSP、权限与配额，而不是在主应用上下文运行字符串。

## 后端由宿主提供

`createDlMdxHttpStorageAdapter()` 使用以下原始 JSON 契约。响应不要再套 `{ data: ... }` 信封：

| Method | Path | Request | Response |
| --- | --- | --- | --- |
| `GET` | `/api/mdx/projects` | — | `DlMdxProjectStorageEntry[]` |
| `GET` | `/api/mdx/projects/:id` | — | `DlMdxProjectSnapshot`；不存在时 `404` |
| `PUT` | `/api/mdx/projects/:id` | `DlMdxProjectSnapshot` | 任意成功响应 |
| `DELETE` | `/api/mdx/projects/:id` | — | 任意成功响应 |

后端至少应实现：

- 身份认证以及 `owner_id + project_id` 所有权检查；
- 项目 ID、文件路径、数量、单文件与总容量限制；
- 保存事务、并发版本或 ETag、审计与备份；
- CSS/资源 URL 清洗、发布 CSP 和可信动作白名单；
- 需要 Git 时，在用户设备或受控工作进程中执行，而不是把仓库凭据交给文档脚本。

TodoMoe 是完整参考宿主：项目文件存入 PostgreSQL，公开路径使用 `/pw/{username}/{projectId}/{path}`，用户的主项目还可由 `-` 代替项目 ID。这个 URL 规则属于 TodoMoe，不是 npm 包的强制约定。

## 控件接口

先安装 `createDlMdxOfficialRegistry()`，然后在 MDX 中使用不带 `Dl` 前缀的控件名：

```mdx
+++component:Button
text = "Publish"
variant = "primary"
@click = publish
+++end
```

每个官方定义都带有组件名、类别、成熟度、默认值、props schema 和 events schema。可以在代码中读取同一份接口源：

```ts
import {
  dlMdxOfficialComponents,
  resolveDlMdxEventSchema,
  resolveDlMdxPropSchema,
} from '@dragon-liquid/vue'

const interfaces = dlMdxOfficialComponents.map(component => ({
  name: component.name,
  props: resolveDlMdxPropSchema(component),
  events: resolveDlMdxEventSchema(component),
}))
```

在线展厅的 `/mdx#component-interface` 提供可检索总览；每个控件的 `/components/{component}/basic` 页面提供场景、属性范围、默认值、事件和实例 API。

## 生成和共享浏览器脚本

当扩展目标是 TodoMoe 之外的网站时，普通网页受同源策略限制，不能直接替代浏览器扩展。DL-MDX 提供 userscript 构建层，把项目生成标准 `.user.js`，再由 Tampermonkey / Violentmonkey 安装执行：

```ts
import {
  buildDlMdxUserscript,
  dlMdxUserscriptMatchesUrl,
  parseDlMdxUserscript,
} from '@dragon-liquid/vue'

const result = buildDlMdxUserscript({
  metadata: {
    id: 'reading-focus',
    name: 'Reading focus',
    namespace: 'https://example.com/userscripts',
    version: '1.0.0',
    matches: ['https://*.example.com/articles/*'],
    grants: ['GM_addStyle'],
    runAt: 'document-idle',
  },
  source: `GM_addStyle('aside { display: none }')`,
})

if (result.ok) publish(result.filename, result.code)
dlMdxUserscriptMatchesUrl(result.metadata, location.href)
parseDlMdxUserscript(importedSource)
```

引擎校验脚本 ID、版本、目标模式、权限名、1 MiB 源码上限，以及 `@require` 的 HTTPS 约束；动态代码会产生高风险警告。构建、解析与匹配均不执行源码。共享服务应保存作者、版本、说明、源码和公开状态，提供源码审阅、复制和以 `.user.js` 结尾的安装 URL。
