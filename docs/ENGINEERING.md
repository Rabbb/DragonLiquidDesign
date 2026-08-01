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

### 3.3 首期组件

首期只提取动漫网站实际需要、同时具有通用价值的组件：

- `DlButton`
- `DlIconButton`
- `DlInput`
- `DlTextarea`
- `DlSelect`
- `DlBadge`
- `DlCard`
- `DlDialog`

其中 Select 和 Dialog 必须基于 Reka UI；所有有视觉变体的组件使用 Tailwind Variants。

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
3. Nuxt 工程通过 `file:O:/DragonLiquidDesign/registry/dragon-liquid-vue-0.1.1.tgz` 安装，引用的是发布产物而非源码。
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
`file:../../registry/dragon-liquid-vue-0.1.1.tgz` 消费发布包，不能直接引用
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

- `#/`：设计系统介绍首页，只呈现定位、技术分层、组件目录和接入方式。
- `#/components/{component}/{scenario}`：组件查询与案例页。
- 左侧大纲按“通用 / 表单 / 反馈”分组，只展开当前组件的场景子菜单。
- 每个组件固定包含“通用案例”和两个按实际用途命名的情景案例。
- 右侧内容域只挂载当前场景；切换子菜单不会同时保留其他案例 DOM。

组件和场景元数据集中在 `apps/showcase/src/catalog.ts`。新增组件时必须同时补齐三个
场景定义，并在 `ComponentDocsPage.vue` 的异步 loader 映射中注册文档组件。

### 9.2 性能边界

8 个组件文档位于 `apps/showcase/src/docs`，均通过动态 `import()` 加载。Vite production
build 必须为每个组件生成独立 chunk；禁止把全部案例重新合并到首页或一个同步导入的
组件中。场景可以共用当前组件的 chunk，但模板必须使用互斥条件，只渲染被选中的场景。

发布包同时复制到 `public/packages`，IIS 下载地址为：

```text
http://localhost:8030/packages/dragon-liquid-vue-0.1.1.tgz
```
