# Dragon Liquid Design 工程文档

## 1. 目标与边界

本工程把 `O:\DEV\Todo.Moe\fd` 中已经形成的 Dragon Liquid 设计语言迁移为独立、可构建、可测试、可由 Nuxt 消费的 Vue 3 UI 包。

迁移遵循以下边界：

- TodoMoe 仅作为只读参考源，不修改、不重排、不反向依赖它的文件。
- 继承其品牌色、液态玻璃层次、柔和辉光、金色主操作、尺寸和 tone 语义，不复制 Todo 业务组件。
- 原 `fd` 是 SolidJS + SCSS 实现；独立库是 Vue 3 实现，不追求源码逐行移植，而保持视觉语义和交互能力等价。
- 组件包不承载动漫、Todo 或其他业务词汇。业务状态由应用层映射到 `accent / success / warning / danger / muted` 等展示语义。

## 2. 技术栈与职责

| 技术 | 职责 |
| --- | --- |
| Vue 3 | 组件模型、插槽、事件和类型声明 |
| Reka UI | Dialog、Select 等复杂控件的键盘操作、焦点管理和 ARIA 原语 |
| Tailwind CSS 4 | CSS 构建、基础工具类和消费方样式兼容 |
| Tailwind Variants | `variant / tone / size` 的声明式组合与类型约束 |
| Vite library mode | ESM/CSS/类型声明构建 |
| Vitest + Vue Test Utils | 基础渲染与交互契约测试 |

组件库不会二次封装路由、HTTP、状态管理或业务表单模型。

## 3. 设计语言迁移

### 3.1 Token 分层

包内样式只输出设计系统级 token：

- `--dragon-*`：品牌身份、surface、border、glow、liquid glass。
- `--dl-*`：组件可消费的尺寸、间距、文字与交互语义。

页面布局和动漫业务样式留在消费方。Token 的默认主题是深绿色夜幕背景、金橙色主操作、冷银文字、青绿与紫蓝辉光。

### 3.2 视觉规则

- surface 使用深色半透明渐变、细边界、顶部内高光和受控 blur。
- primary 使用金橙渐变，正文区域保持清晰，魔法感集中在边缘、sheen 和 glow。
- focus 必须始终可见；动画尊重 `prefers-reduced-motion`。
- 玻璃拟态不代替信息层级，正文与表单对比度优先。
- 移动端组件保持至少 40px 的主要点击区域。

### 3.3 组件批次

`0.1.x` 首期只提取动漫网站实际需要、同时具有通用价值的组件：

- `DlButton`
- `DlIconButton`
- `DlInput`
- `DlTextarea`
- `DlSelect`
- `DlBadge`
- `DlCard`
- `DlDialog`

`0.2.0` 参考 Nuxt UI 的架构方式扩展以下 Reka UI 封装：

- 表单：`DlCheckbox`、`DlSwitch`、`DlRadioGroup`、`DlSlider`
- 内容与导航：`DlAccordion`、`DlTabs`、`DlCollapsible`、`DlSeparator`
- 浮层与反馈：`DlTooltip`、`DlPopover`、`DlProgress`
- 媒体：`DlAvatar`

`0.3.0` 继续完成目录中全部稳定 Reka UI 原语：组合框、可编辑文本、列表框、数字与验证码输入、标签输入、切换组，以及菜单、导航、分页、滚动区、分割面板、步骤条、通知和工具栏。

`0.4.0-alpha.1` 落地 21 个先行组件，包括自动补全、评分、完整颜色控件、日期时间控件、Drawer 与 Tree。它们保持 `REKA ALPHA` 标记和预发布版本语义，但提供真实公共 API、样式、类型与案例，不使用不可操作的占位实现。

`0.4.0-alpha.2` 以 `O:\DEV\Todo.Moe\fd` 为只读来源迁移浮层视觉：`Toast.module.scss` 对应 `DlToast`，`Modal.module.scss` 对应 `DlDialog`，`Tooltip.module.scss` 对应 `DlTooltip`；TodoMoe 没有同名 Popover，因此 `DlPopover` 只提取 `Popconfirm.module.scss` 的近源玻璃面、能量线和箭头语言，不复制确认语义。交互、Portal、焦点管理与层级仍由 Reka UI 和 `useDlLayer` 负责。

`0.4.0-alpha.3` 继续从 `Drawer.module.scss` 与 `Progress.module.scss` 提取样式：Drawer 保留四方向、滑动关闭和 Reka 焦点管理，Progress 保留线性 Reka Progress 语义，并补齐尺寸、语义色、状态覆盖与辅助文案。

`0.4.0-alpha.4` 修复 Portal 根节点无法命中 scoped CSS 的问题，恢复 Dialog、Drawer、Popover、Toast、Tooltip 的迁移样式；同时修复 Accordion 的非受控折叠状态，并移除 Drawer 标题区多余的组件名与 tone 徽标。

`0.4.0-alpha.5` 为 Hover Card 迁移 TodoMoe 的大型浮层玻璃语言：以 Popconfirm 的卡片表面、柔光与箭头为近源，以 Tooltip 的随方位能量边为定位反馈，仍由 Reka UI 管理悬停、焦点、延迟和 Portal。

`0.4.0-alpha.6` 修正 Popover 炫彩条的方位逻辑：根据 Reka UI 碰撞定位后的 `data-side` 将能量边放到箭头对侧，并为左右弹出使用纵向渐变。

`0.4.0-alpha.7` 为 Dialog、Drawer、Popover、Tooltip、Toast、Hover Card 与 Progress 补充按用途拆分的常用案例；同时将 Input 外壳改为中性容器，消除业务 label 与组件 label 嵌套造成的布局和语义问题。

`0.4.0-alpha.8` 为全部 `DlTone` 组件提供集中色调展厅，并让 Tooltip Accent 继承 Button Primary 的明亮金色表面与深色文字，使其和深橙色 Warning 保持清晰区分。

`0.4.0-alpha.9` 将 Tooltip Warning 调整为只使用琥珀、橙金与深褐色域的熔岩表面，以高亮熔融核心表达“需要留意”，同时避开 Danger 的红色失败语义。

`0.4.0-alpha.10` 降低 Tooltip Accent 的实体感：不再直接复用 Button Primary 的厚重橙金表面，而以浅金透明玻璃、乳白高光和青绿折射表达短暂浮现的光魔法。

`0.4.0-alpha.11` 将 Tooltip Accent 与 Warning 收敛回组件统一的深色玻璃材质：Accent 仅保留克制的金白魔法微光和少量青色折射，Warning 仅保留暗褐玻璃中的低强度琥珀熔光，避免高亮渐变造成样式断层。

`0.4.0-alpha.12` 将 Tooltip 的 Default、Success、Danger 与 Muted 同步升级为分层深色玻璃；六种 tone 统一背景深度、透明度、边框和阴影结构，仅通过奥术中性光、翡翠生命光、红宝石危险光与月灰弱化光表达语义。

复杂交互必须基于 Reka UI；所有有视觉变体的组件使用 Tailwind Variants。公共 API 保持高层、业务无关，不能直接透传整套 Nuxt UI 依赖。

## 4. 包结构与公共 API

```text
O:\DragonLiquidDesign
├─ docs/
├─ packages/vue/
│  ├─ src/components/
│  ├─ src/styles/
│  ├─ src/index.ts
│  ├─ package.json
│  └─ vite.config.ts
└─ registry/
```

公共入口只从 `src/index.ts` 导出；消费方不得引用 `src/components/*` 深层路径。构建产物包括：

- `dist/index.js`
- `dist/index.d.ts`
- `dist/dragon-liquid.css`

组件统一使用 `Dl` 前缀，DOM 上保留 `data-slot` 以便消费方定向扩展，但不保证内部 class 名稳定。

## 5. 本地 npm 发布

当前机器没有正在监听的 npm 私有 registry，只有 npm 公共镜像配置；因此本阶段采用 npm 官方支持的本地 tarball 包仓库：

1. 在 `packages/vue` 执行构建和测试。
2. 使用 `npm pack --pack-destination O:\DragonLiquidDesign\registry` 生成版本化 `.tgz`。
3. Nuxt 工程通过 `file:O:/DragonLiquidDesign/registry/dragon-liquid-vue-0.6.0-alpha.11.tgz` 安装，引用的是发布产物而非源码。
4. 修改组件后必须提升包版本、重新打包并在消费方重新安装。

若以后部署 Verdaccio，可保持包名和版本不变，执行：

```powershell
npm publish --registry http://<registry-host>:4873
```

然后把消费方依赖从 `file:` 切换为普通 semver 即可。

## 6. 动漫站集成约定

动漫站位于 `O:\CCC\IsekaiAnime`，结构为：

```text
src/IsekaiAnime.Api       ASP.NET Core WebAPI
web                       Nuxt 应用
database                  PostgreSQL 初始化脚本
tests                     后端测试
```

### 6.1 后端

- 目标框架：`.NET 10`。
- 按 `O:\OTS.NETCore` 方式引用本机私有 NuGet 中的 `NewlyProgramCore.WebCore` 和 `NewlyProgramCore.Petapoco`。
- 使用 PostgreSQL/Npgsql；连接字符串沿用 TodoMoe 的 `ConnectionStrings__TodoMoe` 配置入口，但业务表放在独立的 `isekai_anime` schema，避免污染 `todomoe` schema。
- API 使用 NewlyProgramLibrary 的统一 `ApiResponse`、异常处理、OpenAPI、CORS 和 PetaPoco 注入。
- 数据库凭据只通过环境变量/部署 secret 注入，不写进仓库。

### 6.2 数据模型

核心实体 `anime_entries` 至少包含：

- 中文标题、原始标题
- 简介
- 封面 URL
- 作品类型、观看状态
- 首播年份、集数、个人评分
- 标签集合
- 创建和更新时间

标签采用规范化的 `tags` 与 `anime_entry_tags` 关联表，支持筛选、去重和后续统计。

### 6.3 API

首期提供：

- 分页列表、关键字搜索、状态/类型/标签筛选
- 单条详情
- 新增
- 编辑
- 删除
- 筛选元数据（可用标签、状态、类型）

前端只通过运行时配置中的 `public.apiBase` 访问 API，不持有数据库信息。

## 7. 质量门槛

UI 包发布前：

- TypeScript 类型检查通过。
- Vite library build 通过。
- 核心组件测试通过。
- `npm pack --dry-run` 只包含预期发布文件。

动漫站交付前：

- `dotnet build` 和后端测试通过。
- Nuxt 类型检查与 production build 通过。
- 前端依赖解析到 `registry` 中的发布包，不直接读取 DragonLiquidDesign 源码。
- API 的增删改查、空状态、加载态和失败态均有界面反馈。

## 8. 版本与演进

初始版本为 `0.1.0`。在 API 稳定前使用 `0.x`：

- patch：视觉修复与向后兼容修复。
- minor：新增组件、props 或 token。
- breaking change：提升 minor，并在变更记录中给出迁移说明。

Dragon Liquid 的组件只在两个以上业务场景中具有复用价值时扩充；动漫站的一次性布局留在 Nuxt 工程内。

## 9. 组件展厅与 IIS 部署

`apps/showcase` 是独立 Vite 静态站点，用于浏览和手动验证组件状态。它必须通过
`file:../../registry/dragon-liquid-vue-0.6.0-alpha.11.tgz` 消费发布包，不能直接引用
`packages/vue/src`，这样展厅同时承担发布包集成测试的职责。

构建命令：

```powershell
cd O:\DragonLiquidDesign
npm run build:showcase
```

当前 IIS 配置：

- 站点：`DragonLiquidDesign`
- 应用池：`DragonLiquidDesign.Web`（No Managed Code）
- 绑定：`*:8030:`
- 发布目录：`O:\DragonLiquidDesign.deploy`
- 本机地址：`http://localhost:8030/`

更新展厅时，重新构建并将 `apps\showcase\dist` 内容同步到发布目录，然后回收
`DragonLiquidDesign.Web` 应用池。发布目录中的 `web.config` 提供默认文档和 Vue
客户端路由回退。

### 9.1 信息架构

- `/`：设计系统介绍首页，只呈现定位、技术分层、组件目录和接入方式。
- `/components/{component}/{scenario}`：组件查询与案例页。
- 左侧大纲按“基础 Foundation / 表单 Form / 色彩 Color / 日期 Dates / 通用 General”分组，分组可折叠，只展开当前组件的场景子菜单。
- 目录对齐 Reka UI 的 Form、Color、Dates、General 组件顺序并保留 Alpha 标记；Dragon Liquid 自有基础组件单列 Foundation。
- 每个组件先提供一个不进入子菜单的基础示例；额外场景数量为 `0..n`，只有存在不同业务流程、不同组合结构或不同交互边界时才增加场景子菜单。
- 禁止用轻微参数变化凑场景数量；相同演示不得重复出现在多个场景中。
- 代码面板必须给出完整 Vue SFC，包括 `<script setup>`、依赖导入、响应式状态、完整 `<template>` 以及案例所需样式，不能使用省略号或只展示单个控件片段。
- 右侧内容域只挂载当前场景；切换子菜单不会同时保留其他案例 DOM。

组件和场景元数据集中在 `apps/showcase/src/catalog.ts`。新增组件按需声明场景，不设固定数量。
可用组件必须在 `ComponentDocsPage.vue` 的异步 loader 映射中注册文档组件；Alpha 组件同时
保留成熟度徽标和预发布版本信息。

每个组件页必须在案例之后展示一到多张 API 表。第一张为组件 Props，列为“属性 / 说明 / 类型 / 默认值”；
当 Props 引用 `DlMenuItem[]`、`DlSelectOption[]` 等公开结构化类型时，必须继续展示对应数据结构表，
列为“属性 / 说明 / 类型 / 是否必填”，并递归补充嵌套类型。元数据由
`apps/showcase/scripts/generate-component-api.mjs` 从 `packages/vue/src/components/Dl*.vue`、
`primitive.types.ts` 和 `select.types.ts` 自动生成，构建前会校验目录中的 63 个组件均有 Props 数据，
并确保 Toolbar 含有 `DlMenuItem[]` 表。表格使用
`vxe-table`，视觉沿用 TodoMoe API 卡片的半透明表面、金色代码标签和分隔线；VXE 资源仅在
组件页按需加载，不能进入介绍首页的首屏资源。

### 9.2 性能边界

63 个可用组件文档位于 `apps/showcase/src/docs`，均通过动态
`import()` 加载。基础组件使用独立文档 chunk；同族 Reka 封装可以共享表单或通用原语
文档 chunk，但模板必须用互斥条件只渲染当前组件和当前场景。禁止把全部案例重新合并到
首页或同步导入的单个组件中。

发布包由独立的 `DragonLiquidPackages` IIS 站点托管，避免进入组件展厅构建产物。当前配置：

- 应用池：`DragonLiquidPackages.Web`（No Managed Code）
- 绑定：`*:8031:`
- 发布目录：`O:\DragonLiquidPackages.deploy`
- 包目录：`O:\DragonLiquidPackages.deploy\packages`

当前版本下载地址为：

```text
http://localhost:8031/packages/dragon-liquid-vue-0.6.0-alpha.11.tgz
```
