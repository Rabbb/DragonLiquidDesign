# Dragon Liquid Showcase

组件展厅是 `@dragon-liquid/vue` 发布包的文档与集成验证站点。

## 页面结构

- `/`：介绍首页。
- `/components/button/basic`：组件工作台入口。
- `/patterns`：纯前端应用逻辑演示入口。
- `/patterns/library`、`create`、`detail`、`editor`、`import`、`settings`、`feedback`：共享本地模拟数据的完整业务页面。
- `/patterns/coverage`：101 个独立控件条目和 184 个目录场景的反向覆盖索引。
- 左侧大纲选择组件与场景，右侧按需加载案例和代码。
- 组件目录提供“组件族 / 用途 / 网站类型 / 用户流程 / 数据类型”五种可持久化分组；五种方式均允许同一控件出现在多个相关分组。
- 每个组件页展示 Props API 表；引用公开结构化类型时继续展示对应字段表，一个组件可包含多张 `vxe-table`。
- 每个应用演示页面都提供“查看本页源码”，源码直接从实际 `.vue` 和共享 TypeScript 文件按需读取。
- 每个业务页面提供“控件导览”，通过动态 Popover 高亮并介绍当前可见控件；覆盖清单中的业务链接会直接指认指定控件。

组件目录维护在 `src/catalog.ts`，五套分组维护在 `src/componentGroups.ts`，异步文档组件位于 `src/docs`。开发服务器通过 Vite alias
直接引用 `packages/vue/src`，便于组件热更新；生产构建仍使用 `registry/dragon-liquid-vue-0.6.0-alpha.72.tgz` 验证真实发布包。

## 构建

```powershell
cd O:\DragonLiquidDesign
npm run build:showcase
```

静态产物输出到 `dist`；`public/web.config` 和 `public/packages` 会原样进入发布产物。
构建完成后会为所有应用演示路由生成对应目录下的 `index.html`，并输出 Cloudflare Pages 使用的 `_redirects` 与通用 `404.html`，不需要后端服务。
`prebuild` 会执行 `scripts/generate-component-api.mjs`，从 101 个公开目录组件的 `Dl*.vue` Props 以及公共接口定义中重新生成多表 API 元数据；生成结果不应手工修改。
随后执行文档与应用演示双重审计，确保五套分组、组件目录、API 表、实际渲染以及 168 个场景映射没有遗漏。
