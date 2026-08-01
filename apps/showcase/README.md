# Dragon Liquid Showcase

组件展厅是 `@dragon-liquid/vue` 发布包的文档与集成验证站点。

## 页面结构

- `#/`：介绍首页。
- `#/components/button/basic`：组件工作台入口。
- 左侧大纲选择组件与场景，右侧按需加载案例和代码。
- 每个组件页展示 Props API 表；引用公开结构化类型时继续展示对应字段表，一个组件可包含多张 `vxe-table`。

组件目录维护在 `src/catalog.ts`，8 个异步文档组件位于 `src/docs`。展厅通过
`registry/dragon-liquid-vue-0.6.0-alpha.2.tgz` 安装依赖，不直接引用 UI 包源码。

## 构建

```powershell
cd O:\DragonLiquidDesign
npm run build:showcase
```

静态产物输出到 `dist`；`public/web.config` 和 `public/packages` 会原样进入发布产物。
`prebuild` 会执行 `scripts/generate-component-api.mjs`，从 63 个 `Dl*.vue` 的公开 Props 以及公共接口定义中重新生成多表 API 元数据；生成结果不应手工修改。
