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
`/components/{component}/{scenario}` 深链；额外场景按 `0..n` 声明，左侧只在确有场景时
展开子菜单，右侧只渲染当前案例。目录按 Foundation、Form、Color、Dates、General 分组，对齐 Reka UI 的组件
顺序和 Alpha 标记；当前 42 个稳定组件与 21 个先行组件全部可用。先行组件继续显示
`ALPHA`，表达 API 仍可能演进，但不再使用 ROADMAP 占位页。
组件文档按组件族生成异步 chunk；每个组件先展示一个完整基础案例，仅在确有独立业务场景时增加子菜单。
每个组件页都包含由源码自动生成的 Props API 表；遇到公开结构化类型时追加字段表，并以按需加载的 `vxe-table` 渲染。正式导出的 64 个组件还统一提供 `DlComponentRef` 实例控制器，组件页会继续展示事件表与实例方法表；Button 的“实例控制”场景可直接测试属性覆盖、方法调用和事件记录。
顶部“实例体系”导航对应 `/instance-api`，集中说明受管包装层、运行时属性优先级、v-model 同步、可取消事件管线、组件行为与 SSR 边界。

消费方通过固定 tarball 引用本地构建产物，避免依赖源码目录或 TodoMoe：

```json
{
  "dependencies": {
    "@dragon-liquid/vue": "file:O:/DragonLiquidDesign/registry/dragon-liquid-vue-0.6.0-alpha.5.tgz"
  }
}
```
