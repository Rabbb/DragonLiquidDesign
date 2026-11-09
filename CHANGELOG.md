# Dragon Liquid Design 版本记录

## 0.6.0-alpha.78

日期：2026-11-09。

- `DlDropdownMenu`、`DlSelect` 新增 `v-model:hoverValue` 和 `hover` 事件，值为可操作项的字符串标识或 `null`。悬停和键盘焦点不改变已选值；移出、失焦、关闭、选项移除/禁用、页面隐藏及卸载时统一清空。
- 主题管理器增加 `previewTheme` 和 `setPreviewTheme(name | null)`，临时预览不写入持久偏好；确认选择后保存主题，清空预览恢复已选主题或系统模式。
- 补齐已发布包中的 MarkdownX 接口测试、正文导航和宿主图片加载能力及其文档。

## 0.6.0-alpha.77

日期：2026-11-04。

- `DlAlertDialog` 新增 `loading`、`confirmDisabled`、`closeOnConfirm` 和默认内容插槽。默认确认行为保持兼容；异步模式由宿主在成功后关闭，失败时可保留错误并重试。
- 加载期间禁用确认与取消，阻止 Escape 关闭；操作按钮复用 `DlButton`，保留安全取消的初始焦点。
- 展厅新增完整异步确认案例，校正 DataTable、ToolbarMenu、TreeMenu 的已实现状态和原始引入版本，目录审计检查可用状态。
- TodoMoe Vue 工作台与展厅对齐 alpha.77 本地 tarball；TodoMoe 接入单条、批量和部分失败重试。

升级方式与后续计划见 [控件库升级计划](docs/COMPONENT_UPGRADE_PLAN.md)。
