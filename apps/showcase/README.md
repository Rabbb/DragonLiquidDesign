# Dragon Liquid Showcase

组件展厅是 `@dragon-liquid/vue` 发布包的文档与集成验证站点。

## 页面结构

- `#/`：介绍首页。
- `#/components/button/basic`：组件工作台入口。
- 左侧大纲选择组件与场景，右侧按需加载案例和代码。

组件目录维护在 `src/catalog.ts`，8 个异步文档组件位于 `src/docs`。展厅通过
`registry/dragon-liquid-vue-0.1.2.tgz` 安装依赖，不直接引用 UI 包源码。

## 构建

```powershell
cd O:\DragonLiquidDesign
npm run build:showcase
```

静态产物输出到 `dist`；`public/web.config` 和 `public/packages` 会原样进入发布产物。
