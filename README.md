# Dragon Liquid Design

Dragon Liquid Design 是从 `O:\DEV\Todo.Moe\fd` 的视觉语言中独立提取出的 Vue 3 UI 组件库。新实现以 Reka UI 提供无障碍交互原语，以 Tailwind CSS 提供样式基础，以 Tailwind Variants 管理组件变体；源 TodoMoe 工程保持只读。

工程约束、迁移范围和发布流程见 [工程文档](docs/ENGINEERING.md)。

## 目录

- `packages/vue`：发布为 `@dragon-liquid/vue` 的组件包
- `apps/showcase`：通过本地 `.tgz` 消费组件包的静态展厅
- `registry`：本地 npm 包产物（`.tgz`）
- `docs`：工程与使用文档

## 预期命令

```powershell
npm install
npm run build
npm run build:showcase
npm test
npm run publish:local
```

本机 IIS 组件展厅部署在 `O:\DragonLiquidDesign.deploy`，访问地址：

```text
http://localhost:8030/
```

展厅首页用于介绍设计系统；点击顶部“组件”进入文档工作台。组件文档使用
`#/components/{component}/{scenario}` 深链，左侧大纲按组件展开三个场景，右侧只渲染
当前场景。每个组件文档会生成独立的异步 chunk。

消费方通过固定 tarball 引用本地构建产物，避免依赖源码目录或 TodoMoe：

```json
{
  "dependencies": {
    "@dragon-liquid/vue": "file:O:/DragonLiquidDesign/registry/dragon-liquid-vue-0.1.1.tgz"
  }
}
```
