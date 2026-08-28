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

构建结果中的每条路由均提供 `source`、`script`、`style`、`scriptFiles`、`styleFiles`、动作符号和诊断结果。宿主把 `source` 交给 `DlMdx`，在受控页面作用域挂载 `style`，并把允许执行的动作传入 `actions`。

```vue
<template>
  <style v-if="route.style">{{ route.style }}</style>
  <DlMdx
    :model-value="route.source"
    :actions="trustedActions"
    mode="preview"
    :show-toolbar="false"
  />
</template>
```

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
