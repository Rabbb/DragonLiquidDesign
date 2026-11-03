# Dragon Liquid Design 版本记录

## 0.6.0-alpha.77

日期：2026-11-04。

- `DlAlertDialog` 新增 `loading`、`confirmDisabled`、`closeOnConfirm` 和默认内容插槽。默认确认行为保持兼容；异步模式由宿主在成功后关闭，失败时可保留错误并重试。
- 加载期间禁用确认与取消，阻止 Escape 关闭；操作按钮复用 `DlButton`，保留安全取消的初始焦点。
- 展厅新增完整异步确认案例，校正 DataTable、ToolbarMenu、TreeMenu 的已实现状态和原始引入版本，目录审计检查可用状态。
- TodoMoe Vue 工作台与展厅对齐 alpha.77 本地 tarball；TodoMoe 接入单条、批量和部分失败重试。

升级方式与后续计划见 [控件库升级计划](docs/COMPONENT_UPGRADE_PLAN.md)。
