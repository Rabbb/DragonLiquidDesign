import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const showcaseRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const componentsRoot = resolve(showcaseRoot, '../../packages/vue/src/components')
const outputFile = resolve(showcaseRoot, 'src/generated/component-api.generated.ts')
const inputControls = JSON.parse(await readFile(resolve(showcaseRoot, 'src/input-controls.json'), 'utf8'))

const descriptions = {
  actionLabel: '操作按钮显示的文字；不传时不显示该操作。',
  allowExternal: '是否允许 http 与 https 外部链接；关闭后相对路径仍然可用。',
  openExternal: '是否在新标签页打开外部链接；外部链接始终带有 noopener noreferrer。',
  allowImages: '是否允许渲染 Markdown 图片。',
  allowDataImages: '是否额外允许受限的 base64 图片 Data URL；默认关闭。',
  allowBlobImages: '是否允许浏览器运行时创建的 blob 图片 URL；默认关闭。',
  allowMailto: '是否允许 mailto 邮件链接；默认关闭。',
  allowRelative: '是否允许站内相对链接、图片和符合扩展名规则的文件；默认开启。',
  allowTel: '是否允许 tel 电话链接；默认关闭。',
  allowCustom: '是否允许把清理后的搜索文字作为自定义选项提交。',
  allowAlpha: '是否保留输入颜色中的透明度通道；关闭时统一输出不透明颜色。',
  allowedProtocols: '外部白名单资源允许使用的网络协议；默认仅 https。',
  domains: '按普通链接、图片和文件分别设置的域名白名单。',
  all: '对普通链接、图片和文件同时生效的共享域名规则。',
  links: '允许作为普通页面链接使用的域名规则。',
  images: '允许加载 Markdown 图片资源的域名规则。',
  files: '允许下载文件的域名规则；仍需同时通过扩展名校验。',
  fileExtensions: '允许下载或引用的文件扩展名白名单；可填写 pdf 或 tar.gz。',
  activationMode: '设置组件进入激活或编辑状态的方式。',
  align: '设置浮层相对触发器的对齐方式。',
  arrow: '是否显示指向触发器的箭头；Popover 与 Tooltip 关闭箭头后，未显式设置的间距会自动归零。',
  arrowPadding: '设置 Tooltip 箭头与内容圆角边缘之间的安全距离。',
  aliases: '组件块可使用的附加名称；同时自动支持 Dl 前缀别名。',
  allowedProps: '允许文档传入的属性白名单；不传时读取组件公开 Props。',
  alt: '图片无法展示时使用的替代文本。',
  ariaLabel: '提供给辅助技术读取的控件名称。',
  debounce: '源文本变化后等待多少毫秒再刷新预览；设为 0 时同步解析。',
  block: '是否让控件占满父容器宽度。',
  bubbleSelect: '选中节点时是否向父节点冒泡选择状态。',
  cancelLabel: '取消操作按钮显示的文字。',
  category: '官方组件定义所属的文档与功能类别。',
  channel: '当前编辑或滑动控制的颜色通道。',
  children: '当前节点或导航项包含的下一级项目。',
  clearable: '是否允许再次操作以清空当前值。',
  createLabel: '日历单元格新建按钮使用的无障碍名称。',
  closeDelay: '指针离开后关闭浮层的延迟时间，单位毫秒。',
  closeLabel: '关闭按钮的无障碍名称。',
  closable: '是否显示并允许使用关闭操作。',
  collapsible: '单选模式下是否允许收起当前已展开项。',
  color: '要展示或编辑的颜色值。',
  colors: '供用户选择的颜色值列表。',
  colorSpace: '颜色值采用的色彩空间。',
  confirmLabel: '确认操作按钮显示的文字。',
  completed: '该步骤是否已经完成。',
  component: '官方或业务注册定义实际渲染的 Vue 组件。',
  content: '从指定内容属性解析出的默认插槽文本。',
  contentProp: '指定哪个组件块属性用作默认插槽文本。',
  decorative: '是否仅作为视觉装饰并从无障碍树中隐藏。',
  delayDuration: '触发后显示浮层的延迟时间，单位毫秒。',
  delayMs: '加载回退内容前等待的时间，单位毫秒。',
  delimiter: '输入多个值时用于分隔内容的字符。',
  description: '补充说明文字；不传时隐藏说明区域。',
  disableWheelChange: '是否阻止滚轮误改独立颜色通道；方向键仍可微调。',
  defaultSize: '面板首次渲染时所占的尺寸百分比。',
  defaultContent: '组件块没有提供内容属性时使用的默认插槽文本。',
  defaultProps: '组件块未覆盖时使用的安全默认属性。',
  direction: '设置布局分割方向。',
  dimensions: '对话框当前宽高；使用 v-model:dimensions 读取或保存用户调整后的尺寸。',
  disabled: '是否禁用控件及其交互。',
  disabledTime: '判断指定 HH:mm 时间是否不可选择的函数。',
  draggable: '是否允许在桌面视口中拖动标题栏或拖动柄来移动对话框。',
  duration: '内容自动关闭前的停留时间，单位毫秒。',
  expanded: '当前已展开节点的标识列表。',
  fallback: '图片不可用时显示的回退文字。',
  fixedWeeks: '是否固定显示完整的六周日期网格。',
  for: '关联表单控件的 id。',
  formatOptions: '传递给 Intl.NumberFormat 的数字格式化选项。',
  granularity: '允许编辑到的最小日期或时间粒度。',
  helper: '显示在主内容下方的辅助说明。',
  hint: '显示在标签下方的格式或操作提示。',
  href: '点击导航项后前往的目标地址。',
  horizontal: '是否同时启用横向滚动。',
  hourCycle: '时间字段使用 12 小时制或 24 小时制。',
  icon: '自定义状态图标；不传时按色调选择默认图标。',
  id: '控件或输入元素使用的唯一标识。',
  interactive: '是否启用悬停抬升等可交互视觉反馈。',
  insertable: '是否允许该可信注册定义出现在 MarkdownX 浮动组件库中。',
  install: '把当前工具注入 Vue 应用；通常由 app.use 自动调用。',
  items: '用于渲染控件内容的结构化项目列表。',
  dayMinHeight: '月历中每个日期单元格允许使用的最小高度，单位像素。',
  itemKey: '从项目读取或计算稳定渲染键的字段名或函数。',
  estimatedItemHeight: '虚拟列表每个等高项目使用的预估像素高度。',
  viewportHeight: '虚拟列表可滚动视口的像素高度。',
  overscan: '可见窗口上下额外渲染的项目数量，用于避免快速滚动露白。',
  itemsPerPage: '每页显示的数据条数。',
  keyboardResizeBy: '键盘操作每次调整面板的百分比。',
  label: '控件的显示标签或无障碍名称。',
  length: '需要渲染或允许输入的项目数量。',
  linear: '是否要求按顺序完成步骤。',
  loading: '是否显示加载状态并阻止重复操作。',
  locale: '日期、时间或数字格式使用的区域语言。',
  loop: '键盘导航到边界时是否循环。',
  labelPosition: '颜色样本标签的显示位置；可隐藏、置右或置于下方。',
  mask: '是否隐藏输入字符。',
  maturity: '组件定义的稳定版、Alpha 或业务自定义标记。',
  max: '允许的最大值。',
  maxValue: '允许选择的最晚日期。',
  maxSize: '面板允许调整到的最大尺寸百分比。',
  maxLength: '允许输入的最大字符数。',
  maxTagCount: '触发器中直接展示的已选标签数量，更多结果合并为计数。',
  maxWidth: '浮层内容允许使用的最大宽度。',
  min: '允许的最小值。',
  minValue: '允许选择的最早日期。',
  minSize: '面板允许调整到的最小尺寸百分比。',
  modal: '是否启用模态交互与焦点限制。',
  modelValue: '组件当前值；使用 v-model 进行双向绑定。',
  mode: '编辑器当前视图模式；使用 v-model:mode 进行双向绑定。',
  toolbar: '格式工具栏中启用的动作及排列顺序；不传时显示全部内置动作。',
  linkPolicy: '链接、外部页面与图片资源的安全渲染策略。',
  emptyText: '文档没有可渲染内容时显示的占位说明。',
  lineWrapping: '是否在编辑器中启用长行自动换行。',
  showToolbar: '是否显示格式操作和视图模式工具栏。',
  showCreate: '是否在日期单元格中显示新建事项入口。',
  showFormat: '是否显示颜色格式切换入口。',
  showLabels: '是否在颜色样本旁显示名称和说明。',
  showPreview: '是否在颜色字段内显示实时颜色预览。',
  showValues: '是否在颜色选项说明为空时显示原始色值。',
  showOutsideDays: '是否显示当前月份之外的补齐日期。',
  showToday: '是否在月历工具栏显示返回今天操作。',
  showStatus: '是否显示行数、字符数、阅读时间和解析状态。',
  taskInteractive: '是否允许在预览区直接切换任务列表状态。',
  minHeight: '组件或工作区允许使用的最小高度。',
  minWidth: '组件允许使用的最小宽度。',
  minuteStep: '分钟滚轮生成选项时使用的步长，限制在 1–30 分钟。',
  maxPreviewHeight: '预览区域的最大高度，超过后在区域内滚动。',
  multiple: '是否允许同时选择多个值。',
  name: '参与表单提交时使用的字段名称。',
  numberOfMonths: '同时显示的月份面板数量。',
  open: '浮层或内容区域是否打开；使用 v-model:open 双向绑定。',
  openDelay: '触发后打开浮层的延迟时间，单位毫秒。',
  options: '可供用户选择的选项列表。',
  overlay: '设置浮层固定为模态面板、底部抽屉或按视口自动适配。',
  orientation: '设置控件的水平或垂直方向。',
  otp: '是否启用一次性验证码输入行为。',
  padding: '设置内容区域的内边距尺寸。',
  page: '当前页码；使用 v-model:page 双向绑定。',
  panels: '分割布局中各面板的尺寸与约束配置。',
  placeholder: '当前值为空时显示的占位提示。',
  presentation: '选择器入口使用可编辑字段或紧凑按钮呈现；不改变值模型和选择面板。',
  placement: '抽屉从视口的哪一侧进入。',
  position: '对话框左上角的视口坐标；使用 v-model:position 读取或保存用户拖动后的位置。',
  progress: '自定义进度百分比。',
  props: '经过默认值合并与安全过滤后的组件块属性。',
  propagateSelect: '选中节点时是否同步选择其子节点。',
  ratio: '内容区域需要保持的宽高比。',
  registry: '覆盖 main.ts 注入的全局 MarkdownX 组件注册表；通常无需逐实例传入。',
  register: '注册或按规范化名称覆盖一个组件定义。',
  registerAll: '按顺序注册一组组件定义，后注册的同名定义优先。',
  render: '不直接使用 Vue 组件时，由业务提供的受信任渲染函数。',
  resolve: '按组件名或别名查询当前生效的注册定义。',
  readonly: '是否只读；保留浏览能力但禁止修改。',
  resetGeometryOnClose: '关闭后是否恢复居中位置与 size 对应的初始尺寸。',
  resizable: '是否允许在桌面视口中拖动右下角缩放柄来调整对话框尺寸。',
  required: '是否标记为表单必填项。',
  scrollHideDelay: '停止滚动后隐藏滚动条的延迟时间，单位毫秒。',
  searchable: '是否始终显示选项搜索框；不传时根据选项数量自动判断。',
  searchPlaceholder: '搜索输入框为空时显示的提示文字。',
  searchThreshold: '自动启用搜索框所需的最少选项数量。',
  separator: '是否将该项目渲染为菜单分隔线。',
  shape: '设置控件的外轮廓形状。',
  showEdges: '是否显示首页与末页导航按钮。',
  showProgress: '是否显示随持续时间递减的进度指示。',
  showValue: '是否显示格式化后的当前数值。',
  copyable: '是否提供复制当前值的快捷按钮。',
  shortcut: '菜单命令旁展示的键盘快捷键说明。',
  shortcutLabel: '时间滚轮中快捷时间按钮显示的文字。',
  shortcutValue: '时间滚轮可一键选取的 HH:mm 快捷值。',
  siblingCount: '当前页两侧保留显示的相邻页码数量。',
  side: '设置浮层相对触发器出现的方位。',
  sideOffset: '浮层与触发器之间的间距；Popover 有箭头时默认 6、无箭头时默认 0，Tooltip 默认 4。',
  size: '设置控件尺寸。',
  skipDelayDuration: '连续触发提示时跳过延迟的有效时间，单位毫秒。',
  src: '要加载的图片资源地址。',
  status: '设置业务状态及对应视觉反馈。',
  sourceLine: '组件块在 Markdown 源码中的零基行号。',
  step: '每次操作改变的数值步长。',
  submitMode: '设置编辑内容提交的触发方式。',
  suggestions: '自动补全候选内容列表。',
  text: '控件显示的主要文字内容。',
  title: '控件或浮层显示的标题。',
  triggerLabel: '需要触发器插槽的浮层组件所显示的默认按钮文字。',
  triggerless: '是否隐藏独立触发器，仅保留选择面板供上层 Picker 组合。',
  tone: '设置语义色调。',
  total: '数据总条数。',
  type: '设置组件的选择模式或原生类型。',
  menus: '菜单栏中显示的菜单分组与命令列表。',
  hoverable: '是否在指针悬停时预览将要提交的评分。',
  value: '表单提交或选择操作使用的值。',
  viewValue: '月历当前浏览的 YYYY-MM 月份；使用 v-model:view-value 双向绑定。',
  variant: '设置控件的视觉变体。',
  weekStartsOn: '一周起始日，0 表示星期日。',
  todayLabel: '月历工具栏返回今天按钮显示的文字。',
  width: '窗口或区域的宽度。',
  height: '窗口或区域的高度。',
  x: '相对视口左侧的横向坐标。',
  y: '相对视口顶部的纵向坐标。',
  xChannel: '二维颜色区域横轴控制的颜色通道。',
  yChannel: '二维颜色区域纵轴控制的颜色通道。',
  columns: '色板网格使用的固定列数；不传时根据容器宽度自动排列。',
  zIndex: '覆盖默认浮层层级；不传时由 Dragon Liquid 层级系统计算。',
  entries: '按注册顺序返回去重后的组件定义快照。',
  unregister: '按名称或别名移除一个注册定义。',
  validate: '使用冻结白名单和 WASM 完整性守卫验证 URL；失败时返回 undefined。',
  verifyIntegrity: '重新计算并核对白名单的 WASM 完整性指纹。',
  wasm: '安全策略是否已经启用内嵌 Rust/WASM 核心。',
  engine: 'MarkdownX 当前使用的解析与安全核心实现。',
  available: 'Rust/WASM 核心是否已成功初始化并可调用。',
  abiVersion: 'JavaScript 包装层与 Rust/WASM 核心之间的 ABI 版本。',
  binarySize: '内嵌 Rust/WASM 二进制的字节数。',
  binaryFingerprint: '构建时生成的 Rust/WASM 二进制 SHA-256 指纹。',
  integrity: '当前白名单规范化快照是否通过完整性校验。',
  fingerprint: '由 Rust/WASM 计算的只读白名单完整性指纹。',
  domainRuleCount: '当前策略包含的域名规则总数。',
  fileExtensionCount: '当前策略包含的文件扩展名数量。',
}

const componentDescriptions = {
  'color-field': {
    format: '完整颜色值提交和显示时使用的 HEX、RGB、HSL 或 HSB 格式。',
    formatOptions: '格式切换入口中允许用户选择的颜色格式列表。',
    error: '字段的外部校验错误；显示文字反馈并标记 aria-invalid。',
  },
  'color-picker': {
    format: '浮层内 ColorField 提交和显示时使用的 HEX、RGB、HSL 或 HSB 格式。',
    formatOptions: '浮层内颜色格式切换入口允许选择的格式列表。',
    orientation: '设置完整选色面板的布局方向；默认横向并排，纵向仅用于窄空间等特殊场景。',
    title: '颜色选择浮层的标题；不传时使用“选择颜色”。',
  },
  'color-swatch-picker': {
    showLabels: '是否在颜色样本右侧显示名称和说明；选项仍按容器宽度二维流式换行。',
    showValues: '是否在颜色选项缺少说明时，于右侧补充显示原始色值。',
  },
}

const structureDescriptions = {
  DlAccordionItem: 'Accordion 的单个折叠面板配置。',
  DlDialogDimensions: 'Dialog 调整后的像素尺寸。',
  DlDialogPosition: 'Dialog 左上角相对视口的像素坐标。',
  DlChoiceOption: '列表、组合框或切换组使用的通用选择项。',
  DlCalendarDay: 'Calendar 日期单元格插槽和交互事件使用的日期上下文。',
  DlCalendarItem: 'Calendar 在指定日期单元格中展示、点击和拖动的业务事项。',
  DlMenuGroup: 'Menubar 的一级菜单分组，内部通过 items 提供命令。',
  DlMenuItem: '菜单、下拉菜单、上下文菜单与工具栏使用的命令项。',
  DlNavigationItem: 'Navigation Menu 使用的可递归导航节点。',
  DlRadioOption: 'Radio Group 中一个互斥选项的配置。',
  DlSelectOption: 'Select 下拉列表中的一个可选项目。',
  DlSplitterPanel: 'Splitter 中一个可调整面板的尺寸与折叠约束。',
  DlStepItem: 'Stepper 中一个流程步骤的标题与状态。',
  DlTabItem: 'Tabs 中一个标签及对应内容入口的配置。',
  DlTreeNode: 'Tree 使用的可递归树节点。',
  DlMdxLinkPolicy: 'MarkdownX 对外部链接、打开方式和图片资源的安全策略。',
  DlMdxParseResult: 'MarkdownX 完成解析后返回的文档统计结果。',
  DlMdxComponentContext: '安全组件块插槽收到的名称、属性和源码位置。',
  DlMdxRegistry: '可通过 app.use 安装，并支持注册、覆盖、查询和移除组件定义的全局注册表。',
  DlMdxComponentDefinition: '一个允许 MarkdownX 安全渲染的组件或自定义渲染器定义。',
  DlMdxRenderContext: '注册渲染器收到的组件名称、属性、源码位置和文本内容。',
  DlMdxSecurityPolicy: '由 app.use 安装的全局 MarkdownX URL 安全守卫，负责验证、完整性检查和状态报告。',
  DlMdxSecurityOptions: '创建 MarkdownX 域名、协议、文件类型及特殊 URL 白名单时使用的配置。',
  DlMdxDomainAllowlist: '分别约束普通链接、图片、文件以及共享来源的域名规则集合。',
  DlMdxSecurityStatus: 'Rust/WASM 安全核心的当前状态、指纹和规则数量快照。',
  DlMdxRustCoreStatus: 'Rust/WASM 解析核心的 ABI、二进制尺寸和构建指纹。',
  DlColorSwatchOption: 'ColorSwatchPicker 使用的命名颜色选项，可附带说明或禁用状态。',
}

const enumDescriptions = {
  DlSize: '组件可用的标准尺寸。',
  DlTone: 'Dragon Liquid 组件共享的语义色调。',
  DlPopoverTone: 'Popover 可用的语义色调，并额外提供低调表面。',
  DlOverlaySide: 'Popover 与 Tooltip 共用的十二方位数字枚举。',
  DlOverlayBaseSide: '兼容 Reka UI 的四个基础方位字符串。',
  DlProgressStatus: 'Progress 用于表达任务结果的业务状态。',
  DlMdxMode: 'MarkdownX 的编辑、预览和分栏工作模式。',
  DlMdxToolbarAction: 'MarkdownX 内置格式工具栏支持的动作。',
  DlMdxComponentCategory: '官方注册定义使用的组件类别。',
  DlMdxComponentMaturity: '官方注册定义的稳定度或自定义来源标记。',
  DlMdxUrlKind: 'MarkdownX URL 守卫区分的普通链接、图片和文件资源类型。',
  DlColorFormat: 'ColorField 支持的颜色字符串输出格式。',
}

const enumValueDescriptions = {
  DlOverlaySide: {
    Top: ['上方居中。', '上'],
    TopLeft: ['上方靠左。', '左上'],
    TopRight: ['上方靠右。', '右上'],
    Right: ['右侧居中。', '右'],
    RightTop: ['右侧靠上。', '右上'],
    RightBottom: ['右侧靠下。', '右下'],
    Bottom: ['下方居中。', '下'],
    BottomLeft: ['下方靠左。', '左下'],
    BottomRight: ['下方靠右。', '右下'],
    Left: ['左侧居中。', '左'],
    LeftTop: ['左侧靠上。', '左上'],
    LeftBottom: ['左侧靠下。', '左下'],
  },
  DlMdxMode: {
    edit: ['只显示 CodeMirror 编辑器，适合集中书写。', '编辑'],
    preview: ['只显示结构化安全预览，适合发布和阅读。', '预览'],
    split: ['并排显示编辑器与实时预览，小屏时自动上下排列。', '分栏'],
  },
  DlMdxToolbarAction: {
    bold: ['切换当前选区的粗体标记。', '粗体'],
    italic: ['切换当前选区的斜体标记。', '斜体'],
    strike: ['切换当前选区的删除线标记。', '删除线'],
    'inline-code': ['切换当前选区的行内代码标记。', '行内代码'],
    link: ['把当前选区转换为 Markdown 链接。', '链接'],
    heading: ['把当前行切换为二级标题。', '标题'],
    blockquote: ['切换当前行或所选行的引用前缀。', '引用'],
    'unordered-list': ['切换当前行或所选行的无序列表前缀。', '无序列表'],
    'task-list': ['切换当前行或所选行的任务列表前缀。', '任务列表'],
    'code-block': ['把选区插入 TypeScript 围栏代码块。', '代码块'],
    component: ['插入显式插槽渲染的安全组件块。', '组件块'],
  },
  DlMdxUrlKind: {
    link: ['普通页面、路由或协议链接。', '链接'],
    image: ['由 Markdown 图片语法引用的资源。', '图片'],
    file: ['带有非页面扩展名并受扩展名白名单约束的下载资源。', '文件'],
  },
  DlSize: {
    sm: ['紧凑尺寸，适合密集界面和次要操作。', '紧凑'],
    md: ['默认尺寸，适合大多数常规界面。', '标准'],
    lg: ['放大尺寸，适合重点内容和宽松布局。', '宽松'],
  },
  DlTone: {
    default: ['默认中性色调，适合普通信息与基础状态。', '中性'],
    accent: ['强调色调，适合品牌重点、当前任务或推荐内容。', '强调'],
    success: ['成功色调，表示任务已经正确完成。', '成功'],
    warning: ['警告色调，提示可恢复且需要留意的问题。', '警告'],
    danger: ['危险色调，表示失败、破坏性操作或高风险状态。', '危险'],
    muted: ['弱化色调，适合低优先级、只读或后台信息。', '弱化'],
  },
  DlPopoverTone: {
    default: ['默认气泡卡片色调，适合普通信息与基础任务。', '中性'],
    accent: ['强调色调，适合品牌重点与当前任务。', '强调'],
    success: ['成功色调，表示任务已经正确完成。', '成功'],
    warning: ['警告色调，提示可恢复且需要留意的问题。', '警告'],
    danger: ['危险色调，表示失败或高风险操作。', '危险'],
    muted: ['弱化色调，适合低优先级与只读信息。', '弱化'],
    subtle: ['低调的纯净表面，适合日期、菜单等以内容为主的紧凑浮层。', '低调'],
  },
  DlProgressStatus: {
    default: ['未指定额外业务状态，视觉由 tone 决定。', '常规'],
    success: ['任务已经完成，并覆盖为成功视觉。', '成功'],
    warning: ['任务仍可继续，但需要用户留意。', '警告'],
    error: ['任务执行失败；与 danger 使用相同的危险视觉。', '错误'],
    danger: ['任务失败或已经中断，并覆盖为危险视觉。', '危险'],
  },
  DlColorFormat: {
    hex: ['十六进制颜色；透明时输出八位 HEX。', 'HEX'],
    rgb: ['CSS rgb() 颜色格式。', 'RGB'],
    hsl: ['CSS hsl() 颜色格式。', 'HSL'],
    hsb: ['色相、饱和度、亮度颜色格式。', 'HSB'],
  },
}

function componentId(filename) {
  return filename
    .replace(/^Dl/, '')
    .replace(/\.vue$/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()
}

function matchingBrace(source, openingIndex) {
  let depth = 0
  let quote = ''
  let escaped = false

  for (let index = openingIndex; index < source.length; index += 1) {
    const character = source[index]
    if (quote) {
      if (escaped) escaped = false
      else if (character === '\\') escaped = true
      else if (character === quote) quote = ''
      continue
    }
    if (character === '"' || character === "'" || character === '`') {
      quote = character
      continue
    }
    if (character === '{') depth += 1
    if (character === '}') {
      depth -= 1
      if (depth === 0) return index
    }
  }
  throw new Error('无法解析 withDefaults 默认值对象。')
}

function defaultValues(source, propNames) {
  const marker = source.indexOf('withDefaults(defineProps<')
  if (marker === -1) return new Map()
  const propsEnd = source.indexOf('}>()', marker)
  const openingIndex = source.indexOf('{', propsEnd)
  if (propsEnd === -1 || openingIndex === -1) return new Map()
  const body = source.slice(openingIndex + 1, matchingBrace(source, openingIndex))
  const result = new Map()

  for (const name of propNames) {
    const match = new RegExp(`(?:^|[,\\n])\\s*${name}\\s*:\\s*`, 'm').exec(body)
    if (!match) continue
    const start = match.index + match[0].length
    let quote = ''
    let escaped = false
    let roundDepth = 0
    let squareDepth = 0
    let curlyDepth = 0
    let end = body.length
    for (let index = start; index < body.length; index += 1) {
      const character = body[index]
      if (quote) {
        if (escaped) escaped = false
        else if (character === '\\') escaped = true
        else if (character === quote) quote = ''
        continue
      }
      if (character === '"' || character === "'" || character === '`') { quote = character; continue }
      if (character === '(') roundDepth += 1
      else if (character === ')') roundDepth -= 1
      else if (character === '[') squareDepth += 1
      else if (character === ']') squareDepth -= 1
      else if (character === '{') curlyDepth += 1
      else if (character === '}') curlyDepth -= 1
      else if (character === ',' && roundDepth === 0 && squareDepth === 0 && curlyDepth === 0) { end = index; break }
    }
    result.set(name, body.slice(start, end).trim())
  }
  return result
}

function propsFromSource(source, id) {
  const propsMatch = source.match(/defineProps<\{([\s\S]*?)\}>\(\)/)
  if (!propsMatch) return []
  const declarations = propsMatch[1].replaceAll(';', '\n')
  const props = [...declarations.matchAll(/^\s*([A-Za-z]\w*)(\?)?:\s*([^\n]+?)\s*$/gm)].map(match => ({
    name: match[1],
    optional: Boolean(match[2]),
    type: match[3].trim(),
  }))
  const defaults = defaultValues(source, props.map(prop => prop.name))

  return props.map(prop => ({
    prop: prop.name,
    description: componentDescriptions[id]?.[prop.name] ?? descriptions[prop.name] ?? `设置 ${prop.name} 属性。`,
    type: prop.type,
    defaultValue: defaults.get(prop.name) ?? (prop.optional ? 'undefined' : '—'),
  }))
}

function modelFromSource(source) {
  const modelMatch = source.match(/defineModel<([^>]+)>\(\)/)
  if (!modelMatch) return []
  return [{
    prop: 'modelValue',
    description: descriptions.modelValue,
    type: modelMatch[1].replace(/\s*\|\s*undefined\s*$/, '').trim(),
    defaultValue: 'undefined',
  }]
}

function structuresFromSource(source) {
  const result = {}
  const interfaces = source.matchAll(/export interface\s+(Dl[A-Za-z0-9]+)\s*\{([\s\S]*?)\n\}/g)

  for (const match of interfaces) {
    const name = match[1]
    const rows = match[2].split(/\r?\n/).map(line => line.trim()).filter(Boolean).map(line => {
      const field = line.match(/^([A-Za-z]\w*)(\?)?:\s*(.+)$/)
      if (!field) throw new Error(`无法解析 ${name} 的字段：${line}`)
      return {
        prop: field[1],
        description: descriptions[field[1]] ?? `设置 ${field[1]} 字段。`,
        type: field[3].trim(),
        defaultValue: field[2] ? '可选' : '必填',
      }
    })
    result[name] = {
      name,
      description: structureDescriptions[name] ?? `${name} 数据结构。`,
      rows,
    }
  }

  return result
}

function enumsFromSource(source) {
  const result = {}
  const aliases = source.matchAll(/(?:export\s+)?type\s+(Dl[A-Za-z0-9]+)\s*=\s*((?:'[^']+'\s*\|\s*)*'[^']+')/g)

  for (const match of aliases) {
    const name = match[1]
    const values = [...match[2].matchAll(/'([^']+)'/g)].map(value => value[1])
    result[name] = {
      kind: 'enum',
      name,
      title: name,
      description: enumDescriptions[name] ?? `${name} 可用的枚举值。`,
      rows: values.map(value => ({
        prop: value,
        description: enumValueDescriptions[name]?.[value]?.[0] ?? `${name} 的 ${value} 选项。`,
        type: `'${value}'`,
        defaultValue: enumValueDescriptions[name]?.[value]?.[1] ?? '枚举值',
      })),
    }
  }

  const enums = source.matchAll(/export\s+enum\s+(Dl[A-Za-z0-9]+)\s*\{([\s\S]*?)\}/g)
  for (const match of enums) {
    const name = match[1]
    let value = 0
    const rows = match[2].split(',').map(source => source.trim()).filter(Boolean).map(source => {
      const member = source.match(/^([A-Za-z]\w*)(?:\s*=\s*(\d+))?$/)
      if (!member) throw new Error(`无法解析 ${name} 的枚举项：${source}`)
      value = member[2] === undefined ? value : Number(member[2])
      const row = {
        prop: member[1],
        description: enumValueDescriptions[name]?.[member[1]]?.[0] ?? `${name} 的 ${member[1]} 选项。`,
        type: String(value++),
        defaultValue: enumValueDescriptions[name]?.[member[1]]?.[1] ?? '枚举值',
      }
      return row
    })
    result[name] = { kind: 'enum', name, title: name, description: enumDescriptions[name] ?? `${name} 可用的枚举值。`, rows }
  }

  return result
}

function mentionedTypes(type, definitions) {
  return Object.keys(definitions)
    .map(name => [name, type.search(new RegExp(`\\b${name}\\b`))])
    .filter(([, index]) => index >= 0)
    .sort((left, right) => left[1] - right[1])
    .map(([name]) => name)
}

function relatedTypesForRows(rows, definitions) {
  const usageCandidates = new Map()
  const selected = []

  function visit(name, usageType) {
    if (!usageCandidates.has(name)) usageCandidates.set(name, [])
    usageCandidates.get(name).push(usageType)
    if (selected.includes(name)) return
    selected.push(name)
    const definition = definitions[name]
    if (definition.kind === 'structure') {
      for (const row of definition.rows) {
        for (const dependency of mentionedTypes(row.type, definitions)) {
          visit(dependency, row.type)
        }
      }
    }
  }

  for (const row of rows) {
    for (const name of mentionedTypes(row.type, definitions)) visit(name, row.type)
  }

  return selected.map(name => {
    const usages = usageCandidates.get(name) ?? []
    const definition = definitions[name]
    const title = name !== 'DlColorFormat' && usages.some(type => new RegExp(`\\b${name}\\[\\]`).test(type)) ? `${name}[]` : name
    return { ...definition, title }
  })
}

const nativeAttributeDefinitions = {
  accept: ['限制文件选择器可接受的文件类型。', 'string', '—'],
  alpha: ['允许颜色值包含透明度通道；浏览器支持情况需要单独确认。', 'boolean attribute', 'false'],
  alt: ['图像无法显示时使用的替代文字，也是图像按钮的可访问名称。', 'string', '—'],
  autocomplete: ['提示浏览器该字段允许采用的自动填充语义。', 'string', '—'],
  capture: ['在支持的移动设备上提示使用前置或后置媒体采集设备。', '"user" | "environment" | string', '—'],
  checked: ['设置复选框或单选按钮的初始选中状态。', 'boolean attribute', 'false'],
  colorspace: ['声明颜色选择器使用的颜色空间。', '"limited-srgb" | "display-p3"', '"limited-srgb"'],
  disabled: ['禁止该输入接收焦点、交互或随表单提交。', 'boolean attribute', 'false'],
  files: ['读取用户已经选择的文件集合；该值由浏览器维护。', 'FileList | null (readonly)', 'null'],
  form: ['通过表单 id 把输入关联到其所属 form 元素。', 'string', '最近的祖先 form'],
  formaction: ['覆盖所属表单的 action，仅对提交型输入生效。', 'URL string', 'form.action'],
  formenctype: ['覆盖提交数据的编码方式，仅对提交型输入生效。', '"application/x-www-form-urlencoded" | "multipart/form-data" | "text/plain"', 'form.enctype'],
  formmethod: ['覆盖提交使用的 HTTP 方法，仅对提交型输入生效。', '"get" | "post" | "dialog"', 'form.method'],
  formnovalidate: ['提交时跳过原生约束校验，仅对提交型输入生效。', 'boolean attribute', 'false'],
  formtarget: ['覆盖提交结果打开的位置，仅对提交型输入生效。', 'string', 'form.target'],
  height: ['设置图像提交按钮的固有显示高度。', 'number (CSS px)', '图片固有高度'],
  list: ['关联 datalist 的 id，为输入提供原生建议值。', 'string', '—'],
  max: ['设置允许输入的最大日期、时间或数值。', '与输入类型匹配的字符串', '—'],
  maxlength: ['限制用户可输入的 UTF-16 代码单元最大数量。', 'non-negative integer', '—'],
  min: ['设置允许输入的最小日期、时间或数值。', '与输入类型匹配的字符串', '—'],
  minlength: ['要求输入至少包含指定数量的 UTF-16 代码单元。', 'non-negative integer', '—'],
  multiple: ['允许输入接收多个邮箱地址或多个文件。', 'boolean attribute', 'false'],
  name: ['定义表单提交时使用的字段名称。', 'string', '—'],
  pattern: ['使用 JavaScript 正则表达式约束输入的完整值。', 'regular expression source', '—'],
  placeholder: ['在空值时显示简短格式提示，不能替代 label。', 'string', '—'],
  readonly: ['保留字段值和焦点能力，但禁止用户修改。', 'boolean attribute', 'false'],
  required: ['要求该控件在表单提交前提供有效值或选择。', 'boolean attribute', 'false'],
  size: ['设置文本输入大致可见的字符宽度。', 'positive integer', '20'],
  src: ['指定图像提交按钮使用的图片资源地址。', 'URL string', '—'],
  step: ['设置合法值之间的步进间隔；可使用 any 取消步进约束。', 'number | "any"', '类型默认值'],
  value: ['设置输入的初始值或提交值。', 'string', '""'],
  width: ['设置图像提交按钮的固有显示宽度。', 'number (CSS px)', '图片固有宽度'],
}

const nativeAttributesByType = {
  button: ['name', 'value', 'disabled', 'form'],
  checkbox: ['name', 'value', 'checked', 'required', 'disabled', 'form'],
  color: ['name', 'value', 'list', 'alpha', 'colorspace', 'disabled', 'form'],
  date: ['name', 'value', 'min', 'max', 'step', 'list', 'readonly', 'required', 'disabled', 'form'],
  'datetime-local': ['name', 'value', 'min', 'max', 'step', 'list', 'readonly', 'required', 'disabled', 'form'],
  email: ['name', 'value', 'autocomplete', 'list', 'multiple', 'minlength', 'maxlength', 'pattern', 'placeholder', 'readonly', 'required', 'size', 'disabled', 'form'],
  file: ['name', 'accept', 'capture', 'multiple', 'required', 'files', 'disabled', 'form'],
  hidden: ['name', 'value', 'form'],
  image: ['name', 'src', 'alt', 'width', 'height', 'formaction', 'formenctype', 'formmethod', 'formnovalidate', 'formtarget', 'disabled', 'form'],
  month: ['name', 'value', 'min', 'max', 'step', 'list', 'readonly', 'required', 'disabled', 'form'],
  number: ['name', 'value', 'min', 'max', 'step', 'list', 'placeholder', 'readonly', 'required', 'disabled', 'form'],
  password: ['name', 'value', 'autocomplete', 'minlength', 'maxlength', 'pattern', 'placeholder', 'readonly', 'required', 'size', 'disabled', 'form'],
  radio: ['name', 'value', 'checked', 'required', 'disabled', 'form'],
  range: ['name', 'value', 'min', 'max', 'step', 'list', 'disabled', 'form'],
  reset: ['name', 'value', 'disabled', 'form'],
  search: ['name', 'value', 'autocomplete', 'list', 'minlength', 'maxlength', 'pattern', 'placeholder', 'readonly', 'required', 'size', 'disabled', 'form'],
  submit: ['name', 'value', 'formaction', 'formenctype', 'formmethod', 'formnovalidate', 'formtarget', 'disabled', 'form'],
  tel: ['name', 'value', 'autocomplete', 'list', 'minlength', 'maxlength', 'pattern', 'placeholder', 'readonly', 'required', 'size', 'disabled', 'form'],
  text: ['name', 'value', 'autocomplete', 'list', 'minlength', 'maxlength', 'pattern', 'placeholder', 'readonly', 'required', 'size', 'disabled', 'form'],
  time: ['name', 'value', 'min', 'max', 'step', 'list', 'readonly', 'required', 'disabled', 'form'],
  url: ['name', 'value', 'autocomplete', 'list', 'minlength', 'maxlength', 'pattern', 'placeholder', 'readonly', 'required', 'size', 'disabled', 'form'],
  week: ['name', 'value', 'min', 'max', 'step', 'list', 'readonly', 'required', 'disabled', 'form'],
}

function inputControlApi(input, componentDefinition) {
  const attributes = nativeAttributesByType[input.type]
  if (!attributes) throw new Error(`input[type="${input.type}"] 缺少专用属性 API。`)
  if (!componentDefinition) throw new Error(`${input.id} 缺少独立 Vue 控件实现。`)
  const componentPropNames = new Set(componentDefinition.props.map(prop => prop.prop))
  const rows = attributes
    .filter(prop => !componentPropNames.has(prop) && prop !== 'checked' && prop !== 'files' && prop !== 'value')
    .map(prop => {
    const definition = nativeAttributeDefinitions[prop]
    if (!definition) throw new Error(`原生 input 属性 ${prop} 缺少 API 描述。`)
    return { prop, description: definition[0], type: definition[1], defaultValue: definition[2] }
  })
  return { props: [...componentDefinition.props, ...rows], relatedTypes: componentDefinition.relatedTypes }
}

const filenames = (await readdir(componentsRoot))
  .filter(filename => /^Dl.+\.vue$/.test(filename))
  .sort((left, right) => left.localeCompare(right, 'en'))

const structures = {}
const componentEnums = {}
for (const filename of ['primitive.types.ts', 'select.types.ts', 'dialog.types.ts', 'calendar.types.ts', 'color-controls.ts', 'dl-mdx.types.ts', 'dl-mdx.registry.ts', 'dl-mdx.language.ts', 'dl-mdx.security.ts', 'dl-mdx.rust.ts']) {
  const typeSource = await readFile(resolve(componentsRoot, filename), 'utf8')
  const parsed = structuresFromSource(typeSource)
  Object.assign(structures, Object.fromEntries(Object.entries(parsed).map(([name, structure]) => [name, { ...structure, kind: 'structure' }])))
  Object.assign(componentEnums, enumsFromSource(typeSource))
}
const sharedEnums = enumsFromSource(await readFile(resolve(componentsRoot, '../types.ts'), 'utf8'))

const api = {}
for (const filename of filenames) {
  const source = await readFile(resolve(componentsRoot, filename), 'utf8')
  const id = componentId(filename)
  const rows = [...modelFromSource(source), ...propsFromSource(source, id)]
  if (!rows.length) throw new Error(`${filename} 未提取到任何公开属性。`)
  const localStructures = Object.fromEntries(
    Object.entries(structuresFromSource(source)).map(([name, structure]) => [name, { ...structure, kind: 'structure' }]),
  )
  const definitions = { ...structures, ...componentEnums, ...localStructures, ...sharedEnums, ...enumsFromSource(source) }
  api[id] = {
    props: rows,
    relatedTypes: relatedTypesForRows(rows, definitions),
  }
}

delete api.input
for (const input of inputControls) api[input.id] = inputControlApi(input, api[input.id])

if (!api.toolbar.relatedTypes.some(type => type.title === 'DlMenuItem[]')) {
  throw new Error('Toolbar 缺少 DlMenuItem[] 数据结构 API。')
}
for (const name of ['DlMdxSecurityPolicy', 'DlMdxSecurityOptions', 'DlMdxDomainAllowlist', 'DlMdxSecurityStatus', 'DlMdxUrlKind', 'DlMdxRustCoreStatus']) {
  const definition = structures[name] ?? componentEnums[name]
  if (!definition) throw new Error(`Mdx 缺少 ${name} 安全策略 API。`)
  api.mdx.relatedTypes.push({ ...definition, title: name })
}
const mdxRelatedTypes = api.mdx?.relatedTypes.map(type => type.title)
if (JSON.stringify(mdxRelatedTypes) !== JSON.stringify([
  'DlMdxMode', 'DlMdxToolbarAction[]', 'DlMdxLinkPolicy', 'DlMdxRegistry',
  'DlMdxComponentDefinition[]', 'DlMdxEventSchema', 'DlMdxTypeSchema', 'DlMdxSchemaType[]',
  'DlMdxComponentCategory', 'DlMdxComponentMaturity', 'DlMdxLanguageOptions', 'DlMdxDiagnosticSeverity', 'DlMdxFormatOptions',
  'DlMdxSecurityPolicy', 'DlMdxSecurityOptions', 'DlMdxDomainAllowlist', 'DlMdxSecurityStatus', 'DlMdxUrlKind', 'DlMdxRustCoreStatus',
])) {
  throw new Error(`Mdx 相关类型 API 顺序不正确：${mdxRelatedTypes?.join(', ')}`)
}
for (const [id, definition] of Object.entries(api)) {
  if (definition.props.some(prop => /\\bDlTone\\b/.test(prop.type)) && !definition.relatedTypes.some(type => type.name === 'DlTone')) {
    throw new Error(`${id} 使用 DlTone，但缺少 DlTone 枚举 API。`)
  }
}

await mkdir(dirname(outputFile), { recursive: true })
await writeFile(
  outputFile,
  `// 此文件由 scripts/generate-component-api.mjs 根据组件源码生成，请勿手工编辑。\nexport default ${JSON.stringify(api, null, 2)} as const\n`,
  'utf8',
)
console.log(`已生成 ${Object.keys(api).length} 个组件的属性 API：${outputFile}`)
