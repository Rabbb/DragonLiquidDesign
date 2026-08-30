import inputControls from './input-controls.json' with { type: 'json' }

export const componentCategories = [
  { id: 'foundation', label: '基础', english: 'FOUNDATION', summary: 'Dragon Liquid 的视觉与输入基础组件。' },
  { id: 'form', label: '表单', english: 'FORM', summary: '输入、选择、校验与表单状态。' },
  { id: 'color', label: '色彩', english: 'COLOR', summary: '颜色输入、通道控制与色板选择。' },
  { id: 'dates', label: '日期时间', english: 'DATES', summary: '日期、时间以及范围选择。' },
  { id: 'layout', label: '网站布局', english: 'SITE LAYOUT', summary: '从内容排布到导航母版的响应式网站框架。' },
  { id: 'general', label: '通用', english: 'GENERAL', summary: '导航、浮层、反馈与通用交互原语。' },
] as const

export type ComponentCategoryId = typeof componentCategories[number]['id']
export type ImplementationStatus = 'ready' | 'planned'
export type RekaMaturity = 'custom' | 'stable' | 'alpha'

export type ScenarioDefinition = {
  id: string
  label: string
  summary: string
}

export type ComponentDefinition = {
  id: string
  name: string
  category: ComponentCategoryId
  summary: string
  since: string
  implementation: ImplementationStatus
  maturity: RekaMaturity
  sourceUrl?: string
  scenarios: ScenarioDefinition[]
}

const readyComponents: ComponentDefinition[] = [
  {
    id: 'button',
    name: 'Button 按钮',
    category: 'foundation',
    summary: '触发操作、提交任务，并清晰表达动作层级。',
    since: '0.1.0',
    implementation: 'ready',
    maturity: 'custom',
    scenarios: [
      { id: 'basic', label: '通用案例', summary: '变体、尺寸和状态' },
      { id: 'form-submit', label: '表单提交', summary: '保存流程与加载反馈' },
      { id: 'danger-zone', label: '危险操作', summary: '不可逆动作的层级控制' },
      { id: 'instance-api', label: '实例控制', summary: '运行时属性、方法与事件订阅' },
    ],
  },
  {
    id: 'split-button',
    name: 'SplitButton 分裂按钮',
    category: 'foundation',
    summary: '保留一个直接主操作，并将相关次级命令收进同一控件的菜单。',
    since: '0.6.0-alpha.11',
    implementation: 'ready',
    maturity: 'custom',
    scenarios: [
      { id: 'basic', label: '通用案例', summary: '尺寸、主动作禁用与菜单操作' },
    ],
  },
  {
    id: 'badge',
    name: 'Badge 徽标',
    category: 'foundation',
    summary: '用精炼的标签传递状态、属性和筛选条件。',
    since: '0.1.0',
    implementation: 'ready',
    maturity: 'custom',
    scenarios: [
      { id: 'basic', label: '全部色调', summary: '六种语义色调、外观和尺寸' },
      { id: 'content-status', label: '内容状态', summary: '发布、草稿与异常状态' },
      { id: 'active-filters', label: '数据筛选', summary: '展示已生效的过滤条件' },
    ],
  },
  {
    id: 'card',
    name: 'Card 卡片',
    category: 'foundation',
    summary: '承载关联内容和操作，构建稳定的视觉层级。',
    since: '0.1.0',
    implementation: 'ready',
    maturity: 'custom',
    scenarios: [
      { id: 'basic', label: '通用案例', summary: '内边距和交互状态' },
      { id: 'data-overview', label: '数据概览', summary: '仪表盘指标容器' },
      { id: 'media-collection', label: '内容收藏', summary: '动漫与媒体条目' },
    ],
  },
  {
    id: 'icon-button',
    name: 'IconButton 图标按钮',
    category: 'foundation',
    summary: '在紧凑空间提供可访问的快捷操作。',
    since: '0.1.0',
    implementation: 'ready',
    maturity: 'custom',
    scenarios: [
      { id: 'basic', label: '通用案例', summary: '变体、尺寸与标签' },
      { id: 'editor-toolbar', label: '编辑器工具栏', summary: '成组的格式化操作' },
      { id: 'card-actions', label: '卡片快捷操作', summary: '收藏、编辑与移除' },
    ],
  },
  ...inputControls.map(input => ({
    id: input.id,
    name: `${input.type === 'datetime-local' ? 'DlInputDatetimeLocal' : `DlInput${input.type[0].toUpperCase()}${input.type.slice(1)}`} ${input.label}`,
    category: 'form' as const,
    summary: input.summary,
    since: '0.6.0-alpha.17',
    implementation: 'ready' as const,
    maturity: 'custom' as const,
    sourceUrl: `https://developer.mozilla.org/docs/Web/HTML/Reference/Elements/input/${input.type}`,
    scenarios: [{ id: 'basic', label: '类型化控件', summary: `${input.type} 数据语义、便捷逻辑与交互反馈` }],
  })),
  {
    id: 'textarea',
    name: 'Textarea 文本域',
    category: 'form',
    summary: '编辑简介、备注和较长的结构化说明。',
    since: '0.1.0',
    implementation: 'ready',
    maturity: 'custom',
    scenarios: [
      { id: 'basic', label: '通用案例', summary: '尺寸、状态和字符内容' },
      { id: 'content-editor', label: '内容简介编辑', summary: '编辑作品或项目说明' },
      { id: 'feedback-message', label: '问题反馈', summary: '引导用户描述上下文' },
    ],
  },
  {
    id: 'select',
    name: 'Select 选择器',
    category: 'form',
    summary: '从有限选项中选择单个明确值。',
    since: '0.1.0',
    implementation: 'ready',
    maturity: 'stable',
    sourceUrl: 'https://reka-ui.com/docs/components/select',
    scenarios: [
      { id: 'basic', label: '通用案例', summary: '选项、描述和禁用态' },
      { id: 'catalog-filter', label: '收藏库筛选', summary: '组合过滤内容列表' },
      { id: 'preference-level', label: '偏好等级设置', summary: '具有解释的分级选项' },
    ],
  },
  {
    id: 'choice-portal',
    name: 'ChoicePortal 沉浸选择器',
    category: 'form',
    summary: '把分组、搜索、键盘直达和自定义值集中到自适应模态选择界面。',
    since: '0.6.0-alpha.12',
    implementation: 'ready',
    maturity: 'custom',
    scenarios: [
      { id: 'basic', label: '沉浸选择', summary: '选项描述、清空和自适应浮层' },
      { id: 'grouped-search', label: '分组检索', summary: '关键词、分组和键盘导航' },
      { id: 'custom-value', label: '开放选项', summary: '从建议中选择或提交新值' },
    ],
  },
  {
    id: 'multi-choice',
    name: 'MultiChoice 多选器',
    category: 'form',
    summary: '在自适应浮层中完成分组检索、多项选择；检索与 Choice 共用可见文字及隐藏关键字高亮。',
    since: '0.6.0-alpha.15',
    implementation: 'ready',
    maturity: 'custom',
    scenarios: [
      { id: 'basic', label: '多项选择', summary: '勾选、移除与清空结果' },
      { id: 'grouped-search', label: '分组检索', summary: '别名搜索与键盘导航' },
      { id: 'tag-overflow', label: '紧凑回显', summary: '限制标签数量并汇总溢出项' },
    ],
  },
  {
    id: 'segmented',
    name: 'Segmented 分段选择器',
    category: 'form',
    summary: '在少量互斥选项之间直接切换，保持当前选择始终可见。',
    since: '0.6.0-alpha.15',
    implementation: 'ready',
    maturity: 'custom',
    scenarios: [
      { id: 'basic', label: '横向分段', summary: '互斥选择与即时切换' },
      { id: 'sizes', label: '尺寸与铺满', summary: '三种尺寸和整行布局' },
      { id: 'disabled', label: '禁用选项', summary: '跳过不可用分段的键盘导航' },
    ],
  },
  {
    id: 'time-picker',
    name: 'TimePicker 时间选择器',
    category: 'dates',
    summary: '保留可键入的时间字段，并按需打开小时与分钟滚轮完成可视选择。',
    since: '0.6.0-alpha.20',
    implementation: 'ready',
    maturity: 'custom',
    scenarios: [
      { id: 'basic', label: '字段与选择面板', summary: '键盘编辑、滚动选择与确认' },
      { id: 'minute-step', label: '按钮与分钟步长', summary: '紧凑触发器和常用时间快捷值' },
      { id: 'disabled-time', label: '可用时段', summary: '限制不可预约的具体时间' },
    ],
  },
  {
    id: 'dialog',
    name: 'Dialog 对话框',
    category: 'general',
    summary: '聚焦需要用户确认或完成的短期任务。',
    since: '0.1.0',
    implementation: 'ready',
    maturity: 'stable',
    sourceUrl: 'https://reka-ui.com/docs/components/dialog',
    scenarios: [
      { id: 'basic', label: '通用案例', summary: '拖动位置、调整尺寸与关闭行为' },
      { id: 'workspace-editor', label: '停靠编辑器', summary: '非模态浮窗、边缘停靠与标题条折叠' },
      { id: 'tone-gallery', label: '全部色调', summary: '交互预览六种 DlTone 语义色调' },
      { id: 'create-record', label: '创建收藏记录', summary: '在浮层内完成小型表单' },
      { id: 'featured-preview', label: '重点内容预览', summary: '强调当前推荐或重点任务' },
      { id: 'publish-success', label: '发布完成', summary: '确认成功结果并提供下一步' },
      { id: 'unsaved-warning', label: '未保存提醒', summary: '离开前提醒可恢复的编辑内容' },
      { id: 'delete-confirm', label: '删除确认', summary: '确认不可逆的危险操作' },
      { id: 'archive-note', label: '归档说明', summary: '承载无需立即处理的只读信息' },
    ],
  },
  {
    id: 'checkbox', name: 'Checkbox 复选框', category: 'form', since: '0.2.0', implementation: 'ready', maturity: 'stable',
    summary: '在选中、未选中与不确定状态之间切换。',
    scenarios: [
      { id: 'basic', label: '通用案例', summary: '基本状态、尺寸和说明文本' },
      { id: 'validation', label: '协议确认', summary: '必选校验与禁用状态' },
      { id: 'form-integration', label: '批量选择', summary: '不确定状态与分组选择' },
    ],
  },
  {
    id: 'radio-group', name: 'Radio Group 单选组', category: 'form', since: '0.2.0', implementation: 'ready', maturity: 'stable',
    summary: '在一组互斥选项中选择唯一值。',
    scenarios: [
      { id: 'basic', label: '通用案例', summary: '纵向选项与描述文本' },
      { id: 'validation', label: '内容分级', summary: '必选、禁用与提示状态' },
      { id: 'form-integration', label: '布局模式', summary: '横向排列与受控值' },
    ],
  },
  {
    id: 'slider', name: 'Slider 滑块', category: 'form', since: '0.2.0', implementation: 'ready', maturity: 'stable',
    summary: '在限定范围内选择单值或区间值。',
    scenarios: [
      { id: 'basic', label: '通用案例', summary: '单值滑块与当前值' },
      { id: 'validation', label: '评分区间', summary: '步长、边界与禁用状态' },
      { id: 'form-integration', label: '范围筛选', summary: '双滑块区间筛选' },
    ],
  },
  {
    id: 'switch', name: 'Switch 开关', category: 'form', since: '0.2.0', implementation: 'ready', maturity: 'stable',
    summary: '切换一个即时生效的布尔状态。',
    scenarios: [
      { id: 'basic', label: '通用案例', summary: '开启、关闭与尺寸' },
      { id: 'validation', label: '通知设置', summary: '带说明的偏好开关' },
      { id: 'form-integration', label: '功能控制', summary: '受控状态与禁用逻辑' },
    ],
  },
  {
    id: 'accordion', name: 'Accordion 折叠面板', category: 'general', since: '0.2.0', implementation: 'ready', maturity: 'stable',
    summary: '纵向排列可展开或收起的内容区块。',
    scenarios: [
      { id: 'basic', label: '通用案例', summary: '单项展开与键盘操作' },
      { id: 'application-flow', label: '作品信息', summary: '分组呈现长篇资料' },
      { id: 'nested-composition', label: '多项展开', summary: '同时打开多个内容区块' },
    ],
  },
  {
    id: 'avatar', name: 'Avatar 头像', category: 'general', since: '0.2.0', implementation: 'ready', maturity: 'stable',
    summary: '展示人物或实体图片，并提供可靠回退内容。',
    scenarios: [
      { id: 'basic', label: '通用案例', summary: '图片、回退文字与形状' },
      { id: 'application-flow', label: '成员列表', summary: '不同尺寸的身份标识' },
      { id: 'nested-composition', label: '头像堆叠', summary: '紧凑呈现多个参与者' },
    ],
  },
  {
    id: 'collapsible', name: 'Collapsible 折叠容器', category: 'general', since: '0.2.0', implementation: 'ready', maturity: 'stable',
    summary: '展开或收起一个关联内容面板。',
    scenarios: [
      { id: 'basic', label: '通用案例', summary: '标题、说明与内容区域' },
      { id: 'application-flow', label: '高级筛选', summary: '按需展开次要表单' },
      { id: 'nested-composition', label: '嵌套详情', summary: '在卡片内延迟展示细节' },
    ],
  },
  {
    id: 'popover', name: 'Popover 气泡卡片', category: 'general', since: '0.2.0', implementation: 'ready', maturity: 'stable',
    summary: '通过触发器在 Portal 中展示富内容。',
    scenarios: [
      { id: 'basic', label: '方位实验台', summary: '在固定锚点上切换并比较十二种组合方位' },
      { id: 'tone-gallery', label: '全部色调', summary: '交互预览七种 DlPopoverTone 色调，包含低调表面' },
      { id: 'arrowless', label: '无箭头贴边', summary: '隐藏指向箭头并自动取消触发器间距' },
      { id: 'application-flow', label: '快捷编辑', summary: '不离开页面完成小型任务' },
      { id: 'nested-composition', label: '对话框内浮层', summary: '验证嵌套 Portal 层级' },
      { id: 'saved-summary', label: '保存结果', summary: '展示已成功保存的内容摘要' },
      { id: 'sync-warning', label: '同步提醒', summary: '说明可恢复的同步异常' },
      { id: 'remove-action', label: '移除操作', summary: '就近确认高风险快捷操作' },
      { id: 'metadata-note', label: '元数据说明', summary: '展示低优先级的补充信息' },
    ],
  },
  {
    id: 'progress', name: 'Progress 进度条', category: 'general', since: '0.2.0', implementation: 'ready', maturity: 'stable',
    summary: '展示任务或流程的完成程度。',
    scenarios: [
      { id: 'basic', label: '通用案例', summary: '确定进度与百分比' },
      { id: 'tone-gallery', label: '全部色调', summary: '并列展示六种 DlTone 语义色调' },
      { id: 'application-flow', label: '导入任务', summary: '业务状态与色调表达' },
      { id: 'nested-composition', label: '等待状态', summary: '无法估算时的不确定进度' },
      { id: 'failure-state', label: '失败状态', summary: '标记已中断且需要处理的任务' },
      { id: 'background-task', label: '后台任务', summary: '弱化无需持续关注的进度' },
    ],
  },
  {
    id: 'separator', name: 'Separator 分隔线', category: 'general', since: '0.2.0', implementation: 'ready', maturity: 'stable',
    summary: '从视觉或语义上分隔相邻内容。',
    scenarios: [
      { id: 'basic', label: '通用案例', summary: '水平、垂直与语义模式' },
      { id: 'application-flow', label: '内容分组', summary: '带文字的章节分隔' },
      { id: 'nested-composition', label: '工具栏分隔', summary: '紧凑操作区域中的垂直线' },
    ],
  },
  {
    id: 'tabs', name: 'Tabs 标签页', category: 'general', since: '0.2.0', implementation: 'ready', maturity: 'stable',
    summary: '一次展示一组分层内容中的一个面板。',
    scenarios: [
      { id: 'basic', label: '通用案例', summary: '标签切换与内容插槽' },
      { id: 'application-flow', label: '作品详情', summary: '在资料类型之间切换' },
      { id: 'nested-composition', label: '垂直导航', summary: '侧边标签与手动激活' },
    ],
  },
  {
    id: 'tooltip', name: 'Tooltip 文字提示', category: 'general', since: '0.2.0', implementation: 'ready', maturity: 'stable',
    summary: '在悬停或键盘聚焦时补充简短说明。',
    scenarios: [
      { id: 'basic', label: '方位实验台', summary: '在固定锚点上切换并比较十二种组合方位' },
      { id: 'tone-gallery', label: '全部色调', summary: '悬停预览六种 DlTone 语义色调' },
      { id: 'arrowless', label: '无箭头提示', summary: '隐藏箭头并自动取消默认间距' },
      { id: 'application-flow', label: '图标操作', summary: '为紧凑按钮补充名称' },
      { id: 'nested-composition', label: '浮层内提示', summary: '验证嵌套 Portal 层级' },
      { id: 'secondary-hint', label: '次要提示', summary: '弱化快捷键与辅助元数据' },
    ],
  },
  {
    id: 'mdx', name: 'MDX 富文本文档', category: 'general', since: '0.5.0-alpha.1', implementation: 'ready', maturity: 'alpha',
    summary: '从 TodoMoe 迁移并升级的 MarkdownX 编辑、预览与安全组件扩展工作台。',
    scenarios: [
      { id: 'basic', label: '双栏写作', summary: '全高预览与安全组件浮动插入库' },
      { id: 'archive-document', label: '内容档案', summary: '标题、表格、任务、引用与代码块' },
      { id: 'component-blocks', label: '安全组件块', summary: '通过显式 Vue 插槽扩展 MarkdownX' },
      { id: 'official-foundation', label: '官方注册 · 基础', summary: '基础视觉与文本输入组件定义' },
      { id: 'official-layout', label: '官方注册 · 布局', summary: '网站母版页、导航与响应式内容布局' },
      { id: 'official-form', label: '官方注册 · 表单', summary: '稳定版和 Alpha 表单组件定义' },
      { id: 'official-color', label: '官方注册 · 色彩', summary: '全部 Alpha 色彩组件定义' },
      { id: 'official-dates', label: '官方注册 · 日期', summary: '全部 Alpha 日期时间组件定义' },
      { id: 'official-general', label: '官方注册 · 通用', summary: '布局、浮层、反馈与导航组件定义' },
      { id: 'safe-preview', label: '安全预览', summary: '阻止危险链接、数据图片和原始脚本' },
      { id: 'syntax-highlight', label: '代码高亮', summary: '编程语言语法着色与编辑代码域高亮' },
      { id: 'rust-core', label: 'Rust 解析核心', summary: '同步 WASM 解析、统计与协议识别运行状态' },
      { id: 'security-policy', label: 'Rust/WASM 白名单', summary: '在 main.ts 分离限制链接、图片和文件来源' },
    ],
  },
  {
    id: 'virtual-list',
    name: 'VirtualList 虚拟列表',
    category: 'general',
    summary: '只渲染可见窗口附近的等高项目，让长列表保持稳定滚动性能。',
    since: '0.6.0-alpha.15',
    implementation: 'ready',
    maturity: 'custom',
    scenarios: [
      { id: 'basic', label: '可见窗口', summary: '按固定行高渲染当前窗口' },
      { id: 'large-data', label: '大量数据', summary: '千条记录的平滑局部渲染' },
      { id: 'empty', label: '空结果', summary: '自定义无内容反馈' },
    ],
  },
  {
    id: 'container', name: 'Container 内容容器', category: 'layout', since: '0.6.0-alpha.36', implementation: 'ready', maturity: 'custom',
    summary: '约束页面内容宽度并提供响应式水平留白。',
    scenarios: [{ id: 'basic', label: '内容宽度', summary: '比较窄、标准、宽和通栏内容容器' }],
  },
  {
    id: 'stack', name: 'Stack 纵向布局', category: 'layout', since: '0.6.0-alpha.36', implementation: 'ready', maturity: 'custom',
    summary: '按统一间距纵向排列标题、正文、卡片与操作。',
    scenarios: [{ id: 'basic', label: '纵向节奏', summary: '组织页面章节与内容块的垂直间距' }],
  },
  {
    id: 'cluster', name: 'Cluster 流式布局', category: 'layout', since: '0.6.0-alpha.36', implementation: 'ready', maturity: 'custom',
    summary: '让标签、按钮和短内容自动换行并保持对齐。',
    scenarios: [{ id: 'basic', label: '流式换行', summary: '在有限宽度内自动排列操作与标签' }],
  },
  {
    id: 'grid', name: 'Grid 响应式网格', category: 'layout', since: '0.6.0-alpha.36', implementation: 'ready', maturity: 'custom',
    summary: '以最小列宽或固定列数建立自适应内容网格。',
    scenarios: [{ id: 'basic', label: '自适应网格', summary: '卡片随可用宽度自动分列与回落' }],
  },
  {
    id: 'page-frame', name: 'PageFrame 页面框架', category: 'layout', since: '0.6.0-alpha.36', implementation: 'ready', maturity: 'custom',
    summary: '用标题、说明、操作和内容插槽建立一致的页面骨架。',
    scenarios: [{ id: 'basic', label: '页面骨架', summary: '组合页头、工具区与主体内容插槽' }],
  },
  {
    id: 'breadcrumbs', name: 'Breadcrumbs 面包屑', category: 'layout', since: '0.6.0-alpha.36', implementation: 'ready', maturity: 'custom',
    summary: '显示当前页面在网站层级中的位置和返回路径。',
    scenarios: [{ id: 'basic', label: '层级路径', summary: '为内容页提供紧凑的祖先路径' }],
  },
  {
    id: 'site-navigation', name: 'SiteNavigation 网站导航', category: 'layout', since: '0.6.0-alpha.36', implementation: 'ready', maturity: 'custom',
    summary: '渲染由目录与 MDX 元数据生成的分组网站导航。',
    scenarios: [{ id: 'basic', label: '分组导航', summary: '桌面、平板和移动宽度下的导航组' }],
  },
  {
    id: 'site-header', name: 'SiteHeader 网站页头', category: 'layout', since: '0.6.0-alpha.36', implementation: 'ready', maturity: 'custom',
    summary: '组合品牌、主页入口、顶部导航和移动菜单触发器。',
    scenarios: [{ id: 'basic', label: '响应式页头', summary: '品牌、导航和外部环境信息的统一入口' }],
  },
  {
    id: 'site-shell', name: 'SiteShell 网站母版', category: 'layout', since: '0.6.0-alpha.36', implementation: 'ready', maturity: 'custom',
    summary: '用内容插槽套用网站页头、分组导航、页脚和多种导航模式。',
    scenarios: [{ id: 'basic', label: '网站母版预览', summary: '在同一母版中切换顶栏、侧栏、混合与极简导航' }],
  },
]

type RekaSeed = {
  id: string
  name: string
  category: Exclude<ComponentCategoryId, 'foundation'>
  summary: string
  maturity?: Exclude<RekaMaturity, 'custom'>
}

const rekaSeeds: RekaSeed[] = [
  { id: 'autocomplete', name: 'Autocomplete 自动补全', category: 'form', maturity: 'alpha', summary: '允许自由输入文本，并提供可键盘导航的建议列表。' },
  { id: 'checkbox', name: 'Checkbox 复选框', category: 'form', summary: '在选中、未选中与不确定状态之间切换。' },
  { id: 'combobox', name: 'Combobox 组合框', category: 'form', summary: '从可搜索的建议列表中选择一个值。' },
  { id: 'editable', name: 'Editable 可编辑文本', category: 'form', summary: '在静态文本和单行编辑状态之间切换。' },
  { id: 'listbox', name: 'Listbox 列表框', category: 'form', summary: '通过键盘导航选择一个或多个列表项。' },
  { id: 'number-field', name: 'Number Field 数字输入', category: 'form', summary: '输入数值，并通过步进按钮精确增减。' },
  { id: 'label', name: 'Label 标签', category: 'form', summary: '为输入控件提供可访问的关联标签。' },
  { id: 'pin-input', name: 'Pin Input 验证码输入', category: 'form', summary: '由多个单字符输入框组成验证码或 PIN 输入。' },
  { id: 'radio-group', name: 'Radio Group 单选组', category: 'form', summary: '在一组互斥选项中选择唯一值。' },
  { id: 'rating', name: 'Rating 评分', category: 'form', maturity: 'alpha', summary: '选择支持小数精度的星级评分。' },
  { id: 'select', name: 'Select 选择器', category: 'form', summary: '通过按钮触发选项列表并选择一个值。' },
  { id: 'slider', name: 'Slider 滑块', category: 'form', summary: '在限定范围内选择单值或区间值。' },
  { id: 'switch', name: 'Switch 开关', category: 'form', summary: '切换一个即时生效的布尔状态。' },
  { id: 'tags-input', name: 'Tags Input 标签输入', category: 'form', summary: '在输入框内创建、编辑和移除多个标签。' },
  { id: 'toggle', name: 'Toggle 切换按钮', category: 'form', summary: '表示开启或关闭状态的双态按钮。' },
  { id: 'toggle-group', name: 'Toggle Group 切换按钮组', category: 'form', summary: '组合一组支持单选或多选的切换按钮。' },

  { id: 'color-area', name: 'Color Area 二维色域', category: 'color', maturity: 'alpha', summary: '纯粹的二维颜色选择面，只负责同时调整两个颜色通道。' },
  { id: 'color-field', name: 'Color Field 色值字段', category: 'color', maturity: 'alpha', summary: '粘贴、校验并在 HEX、RGB、HSL、HSB 或独立通道间精确编辑颜色。' },
  { id: 'color-picker', name: 'Color Picker 颜色选择器', category: 'color', maturity: 'alpha', summary: '从字段式触发器打开组合选色浮层，预览调整并在确认时提交颜色。' },
  { id: 'color-slider', name: 'Color Slider 色彩滑块', category: 'color', maturity: 'alpha', summary: '横向或纵向调整颜色通道，显示数值并支持透明度轨道。' },
  { id: 'color-swatch', name: 'Color Swatch 颜色样本', category: 'color', maturity: 'alpha', summary: '以透明底纹、名称、说明和值展示只读颜色样本。' },
  { id: 'color-swatch-picker', name: 'Color Swatch Picker 色板选择器', category: 'color', maturity: 'alpha', summary: '以二维流式色板从预设色中单选或多选，带标签时保持左色块、右说明。' },

  { id: 'calendar', name: 'Calendar 业务日历', category: 'dates', maturity: 'alpha', summary: '在完整月视图中浏览、创建和拖动日程条目，并处理单元格溢出。' },
  { id: 'date-field', name: 'Date Field 日期字段', category: 'dates', maturity: 'alpha', summary: '以分段字段精确键入日期，并共享选择器的范围、状态和清除能力。' },
  { id: 'date-picker', name: 'Date Picker 日期选择器', category: 'dates', maturity: 'alpha', summary: '复用日期字段的值模型与约束，再增加日期、月份和年份选择面板。' },
  { id: 'date-range-field', name: 'Date Range Field 日期范围输入', category: 'dates', maturity: 'alpha', summary: '通过分段字段输入起止日期。' },
  { id: 'date-range-picker', name: 'Date Range Picker 日期范围选择器', category: 'dates', maturity: 'alpha', summary: '结合范围输入和日历选择起止日期。' },
  { id: 'range-calendar', name: 'Range Calendar 范围日历', category: 'dates', maturity: 'alpha', summary: '在日历视图中选择连续日期范围。' },
  { id: 'time-field', name: 'Time Field 时间字段', category: 'dates', maturity: 'alpha', summary: '以分段字段精确键入时间，并共享选择器的范围、状态和清除能力。' },
  { id: 'time-range-field', name: 'Time Range Field 时间范围输入', category: 'dates', maturity: 'alpha', summary: '通过分段字段输入起止时间。' },
  { id: 'month-picker', name: 'Month Picker 月份选择器', category: 'dates', maturity: 'alpha', summary: '在月份网格中选择指定月份。' },
  { id: 'month-range-picker', name: 'Month Range Picker 月份范围选择器', category: 'dates', maturity: 'alpha', summary: '选择连续的起止月份范围。' },
  { id: 'year-picker', name: 'Year Picker 年份选择器', category: 'dates', maturity: 'alpha', summary: '在年份网格中选择指定年份。' },
  { id: 'year-range-picker', name: 'Year Range Picker 年份范围选择器', category: 'dates', maturity: 'alpha', summary: '选择连续的起止年份范围。' },

  { id: 'accordion', name: 'Accordion 折叠面板', category: 'general', summary: '纵向排列可展开或收起的内容区块。' },
  { id: 'alert-dialog', name: 'Alert Dialog 警示对话框', category: 'general', summary: '中断当前流程并要求用户明确响应重要信息。' },
  { id: 'aspect-ratio', name: 'Aspect Ratio 宽高比', category: 'general', summary: '让媒体或内容稳定保持指定宽高比。' },
  { id: 'avatar', name: 'Avatar 头像', category: 'general', summary: '展示人物或实体图片，并提供可靠回退内容。' },
  { id: 'collapsible', name: 'Collapsible 折叠容器', category: 'general', summary: '展开或收起一个关联内容面板。' },
  { id: 'context-menu', name: 'Context Menu 上下文菜单', category: 'general', summary: '通过右键或长按在指针位置展示操作菜单。' },
  { id: 'data-table', name: 'Data Table 数据表格', category: 'general', summary: '以 DL 主题统一呈现、勾选、排序和自定义渲染结构化业务数据。' },
  { id: 'dialog', name: 'Dialog 对话框', category: 'general', summary: '在页面或另一对话框上方呈现模态窗口。' },
  { id: 'drawer', name: 'Drawer 抽屉', category: 'general', maturity: 'alpha', summary: '从屏幕边缘滑入并支持手势关闭的面板。' },
  { id: 'dropdown-menu', name: 'Dropdown Menu 下拉菜单', category: 'general', summary: '通过按钮触发一组操作或功能菜单。' },
  { id: 'hover-card', name: 'Hover Card 悬浮卡片', category: 'general', summary: '悬停或聚焦链接时预览关联内容。' },
  { id: 'menubar', name: 'Menubar 菜单栏', category: 'general', summary: '提供桌面应用式的持久命令菜单。' },
  { id: 'navigation-menu', name: 'Navigation Menu 导航菜单', category: 'general', summary: '组织站点导航链接以及分组内容。' },
  { id: 'pagination', name: 'Pagination 分页', category: 'general', summary: '在分页数据之间定位和切换。' },
  { id: 'popover', name: 'Popover 气泡卡片', category: 'general', summary: '通过触发器在 Portal 中展示富内容。' },
  { id: 'progress', name: 'Progress 进度条', category: 'general', summary: '展示任务或流程的完成程度。' },
  { id: 'scroll-area', name: 'Scroll Area 滚动区域', category: 'general', summary: '增强原生滚动并统一跨浏览器外观。' },
  { id: 'separator', name: 'Separator 分隔线', category: 'general', summary: '从视觉或语义上分隔相邻内容。' },
  { id: 'splitter', name: 'Splitter 分割面板', category: 'general', summary: '把布局划分为可拖拽调整的区域。' },
  { id: 'stepper', name: 'Stepper 步骤条', category: 'general', summary: '表示多步骤流程的当前位置和完成状态。' },
  { id: 'tabs', name: 'Tabs 标签页', category: 'general', summary: '一次展示一组分层内容中的一个面板。' },
  { id: 'toast', name: 'Toast 消息提示', category: 'general', summary: '临时展示简洁、非阻塞的反馈消息。' },
  { id: 'toolbar', name: 'Toolbar 工具栏', category: 'general', summary: '组织按钮、切换组和菜单等相关控件。' },
  { id: 'toolbar-menu', name: 'Toolbar Menu 工具栏菜单', category: 'general', summary: '提供桌面软件式分层文字菜单，并绑定可由用户修改的全局快捷键。' },
  { id: 'tooltip', name: 'Tooltip 文字提示', category: 'general', summary: '在悬停或键盘聚焦时补充简短说明。' },
  { id: 'tree', name: 'Tree 树', category: 'general', maturity: 'alpha', summary: '展示可展开与收起的层级项目列表。' },
  { id: 'tree-menu', name: 'Tree Menu 树目录菜单', category: 'general', summary: '用于项目、文档和路由的多级响应式目录导航，支持祖先路径检索、命中高亮、节点插槽与窄屏收起。' },
]

const scenarioBlueprints: Record<Exclude<ComponentCategoryId, 'foundation'>, ScenarioDefinition[]> = {
  form: [
    { id: 'basic', label: '基础用法', summary: '结构、状态与键盘行为' },
  ],
  color: [
    { id: 'basic', label: '基础用法', summary: '颜色值、状态与键盘行为' },
  ],
  dates: [
    { id: 'basic', label: '基础用法', summary: '日期值、语言与键盘行为' },
  ],
  layout: [
    { id: 'basic', label: '基础用法', summary: '响应式布局、内容插槽与导航行为' },
  ],
  general: [
    { id: 'basic', label: '基础用法', summary: '结构、状态与无障碍语义' },
  ],
}

const componentScenarioOverrides: Partial<Record<string, ScenarioDefinition[]>> = {
  'data-table': [
    { id: 'basic', label: '基础表格', summary: '列模型、主题和溢出处理' },
    { id: 'selection', label: '批量选择', summary: '受控选中项与批量工作流' },
    { id: 'states', label: '业务状态', summary: '自定义单元格、加载与空状态' },
  ],
  'toolbar-menu': [
    { id: 'basic', label: '应用菜单', summary: '文字菜单、图标与命令反馈' },
    { id: 'nested', label: '分层命令', summary: '子菜单、分隔线和禁用状态' },
    { id: 'shortcuts', label: '用户快捷键', summary: '组合键绑定与命令分发' },
  ],
  'color-area': [
    { id: 'basic', label: '纯二维色域', summary: '只呈现色域本体与双通道键盘操作' },
    { id: 'theme-editor', label: '主题编辑器', summary: '组合色域、色相、精确值与实时界面预览' },
    { id: 'gradient-stops', label: '渐变节点', summary: '用多个纯色域编辑渐变两端并即时合成结果' },
  ],
  'color-picker': [
    { id: 'basic', label: '默认横向', summary: '标准、紧凑和只读入口默认打开横向选色工作区' },
    { id: 'vertical-layout', label: '垂直特殊布局', summary: '仅在窄侧栏等受限空间中显式启用纵向面板' },
    { id: 'theme-settings', label: '主题设置', summary: '在普通设置表单中确认颜色并预览品牌界面' },
    { id: 'collection-list', label: '列表内编辑', summary: '在紧凑项目列表中逐项修改标识颜色' },
  ],
  calendar: [
    { id: 'basic', label: '月度日程', summary: '日期单元格、彩色事项与自动滚动' },
    { id: 'drag-create', label: '拖动与新建', summary: '移动事项日期并从单元格创建内容' },
    { id: 'adaptive', label: '自适应高度', summary: '固定高度、六周布局与局部滚动' },
  ],
  drawer: [
    { id: 'basic', label: '通用案例', summary: '方向、尺寸与关闭行为' },
    { id: 'tone-gallery', label: '全部色调', summary: '交互预览六种 DlTone 语义色调' },
    { id: 'edit-record', label: '编辑收藏', summary: '侧边任务表单与固定操作区' },
    { id: 'import-success', label: '导入完成', summary: '展示成功结果与后续操作' },
    { id: 'sync-warning', label: '同步冲突', summary: '处理可恢复的数据冲突' },
    { id: 'danger-zone', label: '危险区域', summary: '隔离高风险批量操作' },
    { id: 'collection-filter', label: '移动端筛选', summary: '底部抽屉承载筛选条件' },
  ],
  'hover-card': [
    { id: 'basic', label: '通用案例', summary: '悬停延迟、定位与内容结构' },
    { id: 'creator-profile', label: '创作者资料', summary: '预览监督与制作人员信息' },
    { id: 'episode-progress', label: '剧集进度', summary: '预览单集状态与观看进度' },
  ],
  toast: [
    { id: 'basic', label: '通用案例', summary: '成功反馈、动作与自动关闭' },
    { id: 'tone-gallery', label: '全部色调', summary: '逐一触发六种 DlTone 语义色调' },
    { id: 'upload-progress', label: '上传进度', summary: '展示封面上传与处理进度' },
    { id: 'background-notice', label: '后台完成', summary: '普通信息与后续查看入口' },
    { id: 'network-warning', label: '网络提醒', summary: '可恢复异常与后台重试说明' },
    { id: 'error-recovery', label: '错误恢复', summary: '失败说明与重试操作' },
    { id: 'quiet-summary', label: '静默摘要', summary: '无需立即处理的低优先级结果' },
  ],
}

const readyById = new Map(readyComponents.map(component => [component.id, component]))
const stableReadyIds = new Set([
  'combobox', 'editable', 'listbox', 'number-field', 'label', 'pin-input', 'tags-input', 'toggle', 'toggle-group',
  'alert-dialog', 'aspect-ratio', 'context-menu', 'dropdown-menu', 'hover-card', 'menubar', 'navigation-menu',
  'pagination', 'scroll-area', 'splitter', 'stepper', 'toast', 'toolbar',
])
const alphaReadyIds = new Set([
  'autocomplete', 'rating', 'color-area', 'color-field', 'color-picker', 'color-slider', 'color-swatch', 'color-swatch-picker',
  'calendar', 'date-field', 'date-picker', 'date-range-field', 'date-range-picker', 'range-calendar', 'time-field',
  'time-range-field', 'month-picker', 'month-range-picker', 'year-picker', 'year-range-picker', 'drawer', 'tree',
])
const singleExampleIds = new Set([
  'checkbox', 'slider', 'switch', 'accordion', 'avatar', 'collapsible', 'separator', 'tabs',
])

function sourceUrl(id: string) {
  return `https://reka-ui.com/docs/components/${id}`
}

function fromRekaSeed(seed: RekaSeed): ComponentDefinition {
  const ready = readyById.get(seed.id)
  if (ready) {
    return {
      ...ready,
      category: seed.category,
      maturity: seed.maturity ?? 'stable',
      sourceUrl: sourceUrl(seed.id),
      scenarios: singleExampleIds.has(seed.id) ? [ready.scenarios[0]] : ready.scenarios,
    }
  }

  if (stableReadyIds.has(seed.id)) {
    return {
      ...seed,
      since: '0.3.0',
      implementation: 'ready',
      maturity: 'stable',
      sourceUrl: sourceUrl(seed.id),
      scenarios: (componentScenarioOverrides[seed.id] ?? scenarioBlueprints[seed.category]).map(scenario => ({ ...scenario })),
    }
  }

  if (alphaReadyIds.has(seed.id)) {
    return {
      ...seed,
      since: '0.4.0-alpha.1',
      implementation: 'ready',
      maturity: 'alpha',
      sourceUrl: sourceUrl(seed.id),
      scenarios: (componentScenarioOverrides[seed.id] ?? scenarioBlueprints[seed.category]).map(scenario => ({ ...scenario })),
    }
  }

  return {
    ...seed,
    since: '规划中',
    implementation: 'planned',
    maturity: seed.maturity ?? 'stable',
    sourceUrl: sourceUrl(seed.id),
    scenarios: scenarioBlueprints[seed.category].map(scenario => ({ ...scenario })),
  }
}

const customComponents = readyComponents.filter(component => !readyById.has(component.id)
  || !rekaSeeds.some(seed => seed.id === component.id))

export const componentCatalog: ComponentDefinition[] = componentCategories.flatMap(category => [
  ...customComponents.filter(component => component.category === category.id),
  ...rekaSeeds.filter(seed => seed.category === category.id).map(fromRekaSeed),
])

export function componentRoute(componentId: string, scenarioId = 'basic') {
  return `/components/${componentId}/${scenarioId}`
}

export function resolveComponent(componentId?: string, scenarioId?: string) {
  const component = componentCatalog.find(item => item.id === componentId) ?? componentCatalog[0]
  const scenario = component.scenarios.find(item => item.id === scenarioId) ?? component.scenarios[0]
  return { component, scenario }
}
