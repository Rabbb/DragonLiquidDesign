# Dragon Liquid Design 控件库升级计划

更新日期：2026-11-04。当前升级版本：`0.6.0-alpha.77`。

控件升级优先解决 TodoMoe 实际流程中的交互可靠性，再完善键盘、主题、移动端和发布质量。已有 Vue 控件继续演进；早期 Solid Foundation 迁移清单仅作为来源记录。

## 当前基线

公开目录共有 102 个控件，其中 23 个保留 alpha 成熟度标记；可用状态与成熟度分别表示能否使用和 API 的演进程度。应用焦点导航 `DlFocusNavigator` 单独导出，不计入目录数量。数量取自 `apps/showcase/src/catalog.ts` 和公共 API 测试。

| 层次 | 已有能力 | 维护重点 |
| --- | --- | --- |
| 视觉基础 | 五套主题、日夜模式、品牌与组件 token、统一按钮变体 | 对比度、焦点、加载与禁用状态，减少页面硬编码 |
| 常用交互 | 输入与选择、日期时间、导航、弹层、数据表、树与路径选择器 | 受控值、键盘与焦点、异步边界、稳定标识 |
| 实例体系 | `DlComponentRef` 属性覆盖、方法、事件和 v-model 同步 | 声明式和实例调用保持一致，避免额外状态源 |
| MDX | CodeMirror、注册表、项目引擎、附件宿主契约、Rust/WASM 内核 | 保存、语言服务、预览和安全策略保持一致 |
| 文档与分发 | 展厅案例、生成式 API 表、目录与案例审计、本地 tarball | 源码、文档、版本包、锁文件和消费方同步 |

TodoMoe 当前包含 `TodoApi` 和 `TodoMobileApi` 两套 API。业务请求、所有者权限、Todo 规则与失败重试策略留在应用层；库提供通用的展示与交互能力，遵循 [工程文档](ENGINEERING.md)。

## 首批交付

| 编号 | 内容 | 验收 | 状态 |
| --- | --- | --- | --- |
| L01 | 完善 `DlAlertDialog` 异步确认 | 默认同步确认兼容；异步确认保持打开；loading 防重并阻止取消和 Escape；失败插槽可显示错误，宿主成功后关闭 | 已完成 |
| L02 | 校正展厅目录状态 | 已实现的 DataTable、ToolbarMenu、TreeMenu 不再显示 ROADMAP；保留原始引入版本，显示已有场景；审计阻止规划项混入可用目录 | 已完成 |
| L03 | 对齐本地发布包 | 组件包、展厅和 TodoMoe Vue 工作台统一为 alpha.77，锁文件对应同一 tarball | 已完成 |
| L04 | 统一运行时说明与规划入口 | TodoMoe Vue 工作台声明 Node 22、维护 `.node-version`，两个仓库文档互链 | 已完成 |

L01 对应的 API 是 `loading=false`、`confirmDisabled=false` 和 `closeOnConfirm=true`。默认插槽用于宿主提供补充内容或带 `role="alert"` 的错误信息。异步模式下，`confirm` 仍然只通知宿主；库不执行请求，也不推断请求是否成功。宿主应设置 loading，在 finally 中复位，并且只在成功后将 open 设为 false。

请求执行期间阻止用户取消，不会阻止宿主主动设置 `open=false`。`confirmDisabled` 只限制确认，取消仍可操作。取消按钮沿用 Reka AlertDialog 的安全初始焦点，两个操作按钮复用 `DlButton` 主题与加载样式。

真实消费场景为 TodoMoe 单条和批量删除：批量操作保存待删除项快照，成功项移出选中状态，失败项保留并允许单独重试。展厅提供首次失败、再次成功的完整异步案例。

## 后续升级顺序

每轮完成一个主要控件能力，同时维护案例、公共类型和消费方；先运行已有契约用例，再针对实际缺口增补测试。

| 编号 | 优先级 | 控件或能力 | 交付与验收条件 | 依赖 |
| --- | --- | --- | --- | --- |
| L10 | P1 | Dialog、Drawer、Popover 与菜单 | 回归嵌套层级、Escape、焦点恢复、非模态窗口和未保存内容；先接入其他异步删除流程 | L01、L03 |
| L11 | P1 | 输入与选择控件 | 逐项校验 label、错误说明、只读与禁用、清除和 v-model；保留固定 `DlInputXxx` 与高层控件的用途区分 | L03 |
| L12 | P1 | DataTable | 以稳定行键验证排序、筛选、刷新、批量选择和部分失败；测量大列表后决定虚拟化和包体优化 | L02、L03 |
| L13 | P1 | 日期与时间 | 回归精确输入、粘贴、键盘、边界限制、区间与 locale；日期归一化继续由宿主与 API 约定 | L11 |
| L14 | P1 | TreeMenu 与 PathPicker | 对现有测试查漏补缺，覆盖异步加载、快速切换、跨分支选择、禁用节点和窄屏导航 | L02、L03 |
| L15 | P1 | MDX 编辑与附件 | 使用 Todo 正文、笔记和数字花园三个宿主验证保存、临时上传、引用建立和回收；保持可信注册表与文档代码边界 | L03 |
| L16 | P1 | 主题与无障碍 | 五主题覆盖常态、focus、loading、disabled、error；主要移动操作至少 40px，尊重减少动画偏好 | 随 L10 到 L15 交付 |
| L17 | P1 | 自动验证和产物交接 | Rust 与 WASM、类型、组件、文档审计、包内容和两个消费方构建形成门槛；干净环境可取得固定 tarball | L03 |
| L18 | P2 | 体积与加载性能 | 记录首页、表格和 MDX 的资源与交互基线；按实际数据拆包；版本升级附前后对比 | L12、L15 |
| L19 | P2 | API 成熟度 | 按逐组件证据制定 alpha 收敛清单，记录废弃与迁移方案后再规划稳定发布 | L10 到 L17 |

L10 先扩展已完成的确认流程；L12 支撑 Todo 批量管理；L15 支撑笔记与内容主线。其余项按实际使用暴露的问题排序，不以增加控件数量作为目标。

## 本地发布与回退

先准备 Node 22、npm 10 及以上，以及 Rust 的 `wasm32-unknown-unknown` target。按以下顺序执行：

1. 运行 `npm run typecheck` 和 `npm test`，验证类型、Rust 和组件契约。
2. 提升 `packages/vue/package.json` 版本，运行 `npm run publish:local` 生成新的固定 tarball。
3. 更新展厅与 TodoMoe 的 `file:` 依赖并安装，提交范围内同步维护锁文件；消费方始终使用打包产物。
4. 运行 `npm run build:showcase`，包含 API 生成、文档及模式审计；运行工作台测试与构建。
5. 检查 `npm pack --dry-run --workspace @dragon-liquid/vue` 的内容，并填写版本说明和验证记录。

本轮只生成和接入本地产物。IIS 部署、公开 npm 发布和 Git 推送沿用各自独立流程。

回退时同时恢复消费方 package.json 与锁文件到上一已验证 tarball，再安装和构建。保留旧 tarball 便于回退；registry 中的包是被忽略的本地产物，跨机器交接仍需按 L17 建立固定版本的获取方式。

Windows 验证若遇到默认 Temp 的目录权限错误，可在当前进程中将 TEMP 与 TMP 指向可写的 `node_modules/.cache/goal-validation` 后重试；不修改系统全局环境。

## 验证记录

| 检查 | alpha.77 结果 |
| --- | --- |
| `npm run typecheck` | 通过 |
| Rust/WASM release 构建 | 通过 |
| Rust 测试 | 8 项通过 |
| Vue 控件测试 | 51 个测试文件、318 项通过，其中 4 项覆盖确认、取消、加载与异步重试 |
| 库构建与 tarball | 通过，`registry/dragon-liquid-vue-0.6.0-alpha.77.tgz` 已生成 |
| 包内容检查 | 293 个文件，仅包含 dist、package.json 和 README 等预期发布内容 |
| 展厅审计与构建 | 通过，102 个控件、195 个案例、102 份 API、五套分组及九个共享状态演示页面 |
| TodoMoe 构建与新增集成测试 | 构建通过；新增 3 项集成测试通过 |
| TodoMoe 全量测试 | 141 项通过，1 项因工作区原有海报缺失失败，见主企划 T05 |
| 发布包一致性 | 展厅与 TodoMoe 的 npm 锁文件 SHA-512 均匹配最终 tarball；TodoMoe bun.lock 同步版本 |

展厅生产主 chunk 为 2147.79 kB，gzip 为 661.27 kB，构建存在大 chunk 提示，列入 L18 的拆包基线。自动交互测试和构建已完成；五主题及真实移动设备的逐项视觉验收按 L16 推进。

TodoMoe 主项目企划及产品待办见 [项目企划 v2](../../DEV/Todo.Moe/docs/planning/todomoe-project-plan-v2.md)。
