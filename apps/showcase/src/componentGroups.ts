import { componentCatalog, type ComponentDefinition } from './catalog.ts'
import inputControls from './input-controls.json' with { type: 'json' }

export type ComponentGroupingMode = 'family' | 'purpose' | 'site' | 'flow' | 'data'

export interface ComponentGroupDefinition {
  id: string
  label: string
  english: string
  summary: string
  componentIds: string[]
}

export interface ResolvedComponentGroup extends Omit<ComponentGroupDefinition, 'componentIds'> {
  components: ComponentDefinition[]
}

export const componentGroupingModes = [
  { value: 'family', label: '组件族', description: '按结构与交互亲缘关系细分，组合型控件可以同时属于多个组件族。' },
  { value: 'purpose', label: '用途', description: '按用户要完成的任务分组，同一控件可以服务多个用途。' },
  { value: 'site', label: '网站类型', description: '按常见网站和产品类型组织，同一控件可以跨站点复用。' },
  { value: 'flow', label: '用户流程', description: '按用户从发现、录入到执行、反馈和恢复的任务阶段组织。' },
  { value: 'data', label: '数据类型', description: '按控件处理或呈现的文本、数值、状态、日期和集合等数据形态组织。' },
] as const

const inputControlIds = inputControls.map(input => input.id)
const textInputControlIds = inputControls
  .filter(input => ['text', 'search', 'email', 'password', 'tel', 'url'].includes(input.type))
  .map(input => input.id)

const familyGroups: ComponentGroupDefinition[] = [
  group('site-layout', '网站布局与母版', 'SITE LAYOUT', '从内容排布、页面骨架到完整网站导航母版。', ['container', 'stack', 'cluster', 'grid', 'page-frame', 'breadcrumbs', 'site-navigation', 'site-header', 'site-shell']),
  group('actions', '操作按钮', 'ACTIONS', '执行主操作、快捷操作与组合命令。', ['button', 'split-button', 'icon-button', 'toggle', 'toggle-group']),
  group('native-inputs', 'Input 独立控件', 'INPUT COMPONENTS', '每个原生 type 都由独立的 Dragon Liquid 控件固定封装。', inputControlIds),
  group('text-entry', '文本录入', 'TEXT ENTRY', '输入、编辑和维护短文本或长文本。', ['textarea', 'editable', 'label', ...textInputControlIds]),
  group('structured-entry', '结构化录入', 'STRUCTURED ENTRY', '录入数字、验证码与多个标签值。', ['number-field', 'pin-input', 'tags-input']),
  group('single-choice', '单项选择', 'SINGLE CHOICE', '搜索、浏览并选择一个候选值。', ['select', 'choice-portal', 'path-picker', 'combobox', 'autocomplete', 'listbox', 'radio-group', 'segmented']),
  group('state-choice', '状态与多选', 'STATE & MULTI', '表达多个选择、互斥状态或即时开关。', ['multi-choice', 'checkbox', 'radio-group', 'segmented', 'toggle', 'toggle-group', 'switch']),
  group('rating-range', '评分与范围', 'RATING & RANGE', '表达评分、连续数值和区间。', ['rating', 'slider', 'number-field', 'progress']),
  group('color-entry', '颜色输入与弹出选择', 'COLOR ENTRY', '直接编辑色值，或从触发器打开完整选色浮层。', ['input-color', 'color-field', 'color-picker']),
  group('color-surfaces', '色域与色彩通道', 'COLOR SURFACES', '通过纯二维色域或单通道轨道连续调整颜色。', ['color-area', 'color-slider', 'color-picker']),
  group('color-palettes', '色样与预设色板', 'SWATCHES & PALETTES', '展示颜色样本，或从受控的预设颜色集合中选择。', ['color-swatch', 'color-swatch-picker']),
  group('day-date', '日期与日历', 'DAY & DATE', '选择单日、日期范围或直接编辑日期。', ['calendar', 'range-calendar', 'date-field', 'date-picker', 'date-range-field', 'date-range-picker']),
  group('period-pickers', '月年周期', 'MONTH & YEAR', '选择月份、年份及其范围。', ['month-picker', 'month-range-picker', 'year-picker', 'year-range-picker']),
  group('time-controls', '时间控件', 'TIME', '选择具体时间、时间段和触控时间。', ['time-field', 'time-range-field', 'time-picker']),
  group('navigation', '导航与流程', 'NAVIGATION', '在页面、步骤和层级结构之间移动。', ['navigation-menu', 'menubar', 'tabs', 'pagination', 'stepper', 'tree', 'tree-menu', 'segmented']),
  group('command-menus', '命令与菜单', 'COMMAND MENUS', '组织工具命令和上下文操作。', ['dropdown-menu', 'context-menu', 'toolbar', 'toolbar-menu', 'menubar', 'split-button', 'icon-button']),
  group('overlays', '浮层与提示', 'OVERLAYS', '在当前页面之上承载任务、提示和补充信息。', ['dialog', 'alert-dialog', 'drawer', 'popover', 'hover-card', 'tooltip', 'dropdown-menu', 'context-menu', 'toast']),
  group('disclosure', '展开与收起', 'DISCLOSURE', '按需展开章节或单个补充区域。', ['accordion', 'collapsible', 'tabs']),
  group('content-display', '内容与标识', 'CONTENT DISPLAY', '承载、标记和分隔静态内容。', ['card', 'badge', 'avatar', 'aspect-ratio', 'label', 'separator', 'progress', 'color-swatch', 'mdx']),
  group('feedback', '状态反馈', 'FEEDBACK', '反馈任务进度和短期结果。', ['progress', 'toast', 'badge', 'rating', 'alert-dialog']),
  group('layout-data', '布局与长数据', 'LAYOUT & DATA', '分割布局、管理滚动并高效渲染长列表。', ['splitter', 'scroll-area', 'virtual-list', 'data-table', 'tree', 'pagination', 'listbox', 'card']),
  group('document', '文档编辑', 'DOCUMENT', '编辑和安全渲染结构化富文本文档。', ['mdx', 'textarea', 'editable', 'toolbar', 'toolbar-menu', 'menubar']),
]

const purposeGroups: ComponentGroupDefinition[] = [
  group('build-site', '搭建网站框架', 'BUILD SITE', '建立响应式内容布局、目录导航和可复用母版页。', ['container', 'stack', 'cluster', 'grid', 'page-frame', 'breadcrumbs', 'site-navigation', 'site-header', 'site-shell']),
  group('execute', '执行操作', 'EXECUTE', '提交、切换或触发一条明确命令。', ['button', 'split-button', 'icon-button', 'toggle', 'toggle-group', 'switch', 'toolbar', 'toolbar-menu', 'dropdown-menu', 'context-menu', 'menubar']),
  group('native-form-inputs', '原生输入任务', 'NATIVE INPUT', '按固定 HTML type 完成各类原生表单输入任务。', inputControlIds),
  group('write', '文本与内容录入', 'WRITE', '输入、修改和组织文字内容。', ['textarea', 'editable', 'tags-input', 'mdx', 'label', ...textInputControlIds]),
  group('precise-input', '数值与安全输入', 'PRECISE INPUT', '录入受约束数值、验证码和敏感步骤。', ['number-field', 'pin-input', 'slider', 'input-number', 'input-password']),
  group('choose-filter', '选择与筛选', 'CHOOSE & FILTER', '从候选项中搜索、比较或筛选结果。', ['autocomplete', 'combobox', 'select', 'choice-portal', 'path-picker', 'multi-choice', 'listbox', 'checkbox', 'radio-group', 'segmented', 'toggle-group', 'slider', 'rating', 'color-picker', 'color-swatch-picker']),
  group('preference', '状态与偏好', 'PREFERENCE', '维护立即生效的布尔状态与显示偏好。', ['checkbox', 'radio-group', 'segmented', 'switch', 'toggle', 'toggle-group', 'select', 'color-picker', 'color-swatch-picker']),
  group('schedule', '日期与排期', 'SCHEDULE', '选择日期、时间、周期和统计范围。', ['calendar', 'range-calendar', 'date-field', 'date-picker', 'date-range-field', 'date-range-picker', 'month-picker', 'month-range-picker', 'year-picker', 'year-range-picker', 'time-field', 'time-range-field', 'time-picker']),
  group('navigate', '导航与流程推进', 'NAVIGATE', '定位页面、步骤、页码和层级节点。', ['navigation-menu', 'menubar', 'tabs', 'pagination', 'stepper', 'tree', 'tree-menu', 'accordion', 'collapsible']),
  group('context-task', '浮层与上下文任务', 'CONTEXT TASK', '不离开当前上下文完成任务或查看补充信息。', ['dialog', 'alert-dialog', 'drawer', 'popover', 'hover-card', 'tooltip', 'dropdown-menu', 'context-menu', 'choice-portal', 'multi-choice']),
  group('compose-layout', '布局与内容承载', 'COMPOSE LAYOUT', '建立内容比例、区块层级和可调整布局。', ['card', 'aspect-ratio', 'separator', 'splitter', 'accordion', 'collapsible', 'scroll-area']),
  group('status-result', '状态与结果反馈', 'STATUS & RESULT', '显示身份、状态、进度和操作结果。', ['badge', 'avatar', 'progress', 'toast', 'rating']),
  group('theme-visual', '主题与视觉设置', 'THEME & VISUAL', '编辑颜色并预览视觉令牌。', ['color-picker', 'color-field', 'color-area', 'color-slider', 'color-swatch', 'color-swatch-picker', 'badge', 'card']),
  group('large-data', '长数据与性能', 'LARGE DATA', '浏览大量记录、层级节点和分页结果。', ['data-table', 'virtual-list', 'scroll-area', 'pagination', 'tree', 'listbox', 'splitter']),
  group('content-publish', '内容编辑与发布', 'CONTENT PUBLISH', '组合文档、媒体、命令和发布反馈。', ['mdx', 'textarea', 'toolbar', 'menubar', 'card', 'aspect-ratio', 'avatar', 'badge', 'dialog', 'toast']),
]

const siteGroups: ComponentGroupDefinition[] = [
  group('site-builder', '活网站与站点生成器', 'SITE BUILDER', '在线编辑、预览并发布具有目录导航的多页面网站。', ['site-shell', 'site-header', 'site-navigation', 'tree-menu', 'breadcrumbs', 'page-frame', 'container', 'stack', 'cluster', 'grid', 'mdx']),
  group('admin', '管理后台', 'ADMIN CONSOLE', '高密度表单、数据管理、批量操作和权限配置。', ['button', 'split-button', 'icon-button', ...inputControlIds, 'textarea', 'select', 'multi-choice', 'segmented', 'autocomplete', 'checkbox', 'combobox', 'editable', 'listbox', 'number-field', 'label', 'pin-input', 'radio-group', 'slider', 'switch', 'tags-input', 'toggle', 'toggle-group', 'calendar', 'date-field', 'date-picker', 'date-range-field', 'date-range-picker', 'range-calendar', 'time-field', 'time-range-field', 'month-picker', 'month-range-picker', 'year-picker', 'year-range-picker', 'alert-dialog', 'context-menu', 'data-table', 'dialog', 'drawer', 'dropdown-menu', 'menubar', 'navigation-menu', 'pagination', 'progress', 'scroll-area', 'separator', 'splitter', 'stepper', 'tabs', 'toast', 'toolbar', 'toolbar-menu', 'tooltip', 'tree', 'virtual-list']),
  group('productivity', '效率与待办', 'PRODUCTIVITY', '任务、日程、文档、项目工作台和个人效率产品。', ['button', 'split-button', 'icon-button', ...textInputControlIds, 'textarea', 'choice-portal', 'multi-choice', 'segmented', 'checkbox', 'editable', 'tags-input', 'toggle', 'switch', 'calendar', 'date-picker', 'date-range-picker', 'time-field', 'time-range-field', 'time-picker', 'month-picker', 'year-picker', 'mdx', 'virtual-list', 'accordion', 'dialog', 'drawer', 'dropdown-menu', 'navigation-menu', 'pagination', 'popover', 'progress', 'scroll-area', 'splitter', 'stepper', 'tabs', 'toast', 'toolbar', 'tooltip', 'tree']),
  group('content-community', '内容与社区', 'CONTENT & COMMUNITY', '内容流、个人资料、评论、收藏和社区互动。', ['button', 'badge', 'card', 'icon-button', ...textInputControlIds, 'textarea', 'autocomplete', 'checkbox', 'editable', 'multi-choice', 'radio-group', 'rating', 'select', 'switch', 'tags-input', 'toggle', 'toggle-group', 'aspect-ratio', 'avatar', 'collapsible', 'dialog', 'drawer', 'dropdown-menu', 'hover-card', 'navigation-menu', 'pagination', 'popover', 'progress', 'scroll-area', 'tabs', 'toast', 'tooltip']),
  group('commerce', '电商与交易', 'COMMERCE', '商品搜索、规格选择、订单流程和交易反馈。', ['button', 'split-button', 'badge', 'card', 'icon-button', ...textInputControlIds, 'input-number', 'input-range', 'input-color', 'autocomplete', 'checkbox', 'combobox', 'path-picker', 'number-field', 'radio-group', 'select', 'slider', 'switch', 'tags-input', 'color-swatch-picker', 'calendar', 'date-picker', 'alert-dialog', 'context-menu', 'dialog', 'drawer', 'dropdown-menu', 'hover-card', 'navigation-menu', 'pagination', 'popover', 'progress', 'stepper', 'tabs', 'toast', 'tooltip', 'aspect-ratio']),
  group('media', '影音与娱乐', 'MEDIA', '影音目录、播放设置、评分、进度和沉浸式选择。', ['button', 'badge', 'card', 'icon-button', 'choice-portal', 'segmented', 'slider', 'toggle-group', 'aspect-ratio', 'avatar', 'hover-card', 'navigation-menu', 'progress', 'tabs', 'tooltip', 'drawer', 'rating']),
  group('knowledge', '知识与文档', 'KNOWLEDGE', '知识库、文档站、编辑器和层级内容导航。', ['button', 'split-button', 'badge', 'card', 'icon-button', ...textInputControlIds, 'textarea', 'autocomplete', 'checkbox', 'combobox', 'editable', 'listbox', 'multi-choice', 'select', 'tags-input', 'toggle-group', 'mdx', 'virtual-list', 'accordion', 'aspect-ratio', 'collapsible', 'context-menu', 'dialog', 'dropdown-menu', 'menubar', 'navigation-menu', 'pagination', 'popover', 'scroll-area', 'separator', 'splitter', 'tabs', 'toolbar', 'tooltip', 'tree']),
  group('marketing', '品牌与营销', 'MARKETING', '官网、活动页、产品介绍和线索收集。', ['button', 'badge', 'card', 'icon-button', ...textInputControlIds, 'textarea', 'checkbox', 'radio-group', 'select', 'switch', 'aspect-ratio', 'avatar', 'accordion', 'dialog', 'drawer', 'navigation-menu', 'progress', 'separator', 'tabs', 'toast', 'tooltip']),
  group('mobile', '移动应用与 H5', 'MOBILE & H5', '触控优先、底部抽屉和紧凑导航体验。', ['button', 'icon-button', 'choice-portal', 'multi-choice', 'segmented', 'time-picker', 'checkbox', 'radio-group', 'slider', 'switch', 'toggle', 'toggle-group', 'drawer', 'navigation-menu', 'tabs', 'toast', 'tooltip', 'progress']),
  group('analytics', '数据与分析', 'ANALYTICS', '指标卡、时间范围、数据浏览和分析工作台。', ['badge', 'card', 'select', 'multi-choice', 'segmented', 'date-range-field', 'date-range-picker', 'range-calendar', 'month-picker', 'month-range-picker', 'year-picker', 'year-range-picker', 'progress', 'pagination', 'scroll-area', 'splitter', 'tabs', 'tooltip', 'tree', 'virtual-list', 'color-swatch']),
  group('account', '账号与权限', 'ACCOUNT & AUTH', '登录、注册、验证、隐私和账号设置。', ['button', 'icon-button', ...textInputControlIds, 'checkbox', 'pin-input', 'radio-group', 'select', 'switch', 'alert-dialog', 'dialog', 'popover', 'toast', 'tooltip', 'avatar']),
  group('booking', '预约与排期', 'BOOKING', '预约、会议、课程、酒店和资源排期。', ['button', ...textInputControlIds, 'input-datetime-local', 'input-week', 'select', 'multi-choice', 'segmented', 'checkbox', 'radio-group', 'switch', 'calendar', 'range-calendar', 'date-field', 'date-picker', 'date-range-field', 'date-range-picker', 'month-picker', 'month-range-picker', 'year-picker', 'year-range-picker', 'time-field', 'time-range-field', 'time-picker', 'dialog', 'drawer', 'popover', 'toast']),
  group('design-tools', '设计与配置工具', 'DESIGN TOOLS', '主题编辑、组件文档、可视化配置和内部工具。', ['button', 'split-button', 'icon-button', ...inputControlIds, 'textarea', 'number-field', 'label', 'select', 'segmented', 'slider', 'toggle', 'toggle-group', 'color-picker', 'color-area', 'color-field', 'color-slider', 'color-swatch', 'color-swatch-picker', 'mdx', 'card', 'badge', 'aspect-ratio', 'separator', 'splitter', 'tabs', 'toolbar', 'tooltip', 'popover', 'dialog']),
]

const flowGroups: ComponentGroupDefinition[] = [
  group('frame-site', '建立站点框架', 'FRAME SITE', '先组织网站母版、导航和页面插槽，再填充业务内容。', ['site-shell', 'site-header', 'site-navigation', 'breadcrumbs', 'page-frame', 'container', 'stack', 'cluster', 'grid']),
  group('discover-explore', '发现与浏览', 'DISCOVER', '搜索、预览并浏览可用内容和功能入口。', ['navigation-menu', 'menubar', 'tabs', 'tree', 'tree-menu', 'pagination', 'scroll-area', 'virtual-list', 'autocomplete', 'combobox', 'listbox', 'hover-card', 'card']),
  group('native-input-flow', '类型化输入流程', 'PACKAGED INPUT FLOW', '按固定数据语义使用经过交互增强的录入、选择与提交控件。', inputControlIds),
  group('capture-write', '录入与编辑', 'CAPTURE & WRITE', '创建或修改文本、数值、标签和结构化文档。', ['textarea', 'editable', 'number-field', 'pin-input', 'tags-input', 'mdx', 'label', ...textInputControlIds]),
  group('choose-decide', '选择与决策', 'CHOOSE & DECIDE', '比较候选项并确定单选、多选或连续范围。', ['select', 'choice-portal', 'path-picker', 'multi-choice', 'checkbox', 'radio-group', 'segmented', 'toggle', 'toggle-group', 'switch', 'slider', 'rating', 'color-swatch-picker', 'listbox', 'autocomplete', 'combobox']),
  group('schedule-plan', '计划与排期', 'PLAN & SCHEDULE', '安排日期、周期、时间点和连续时间范围。', ['calendar', 'range-calendar', 'date-field', 'date-picker', 'date-range-field', 'date-range-picker', 'month-picker', 'month-range-picker', 'year-picker', 'year-range-picker', 'time-field', 'time-range-field', 'time-picker']),
  group('configure-customize', '配置与定制', 'CONFIGURE', '调整偏好、主题、颜色和立即生效的界面状态。', ['select', 'multi-choice', 'segmented', 'checkbox', 'radio-group', 'slider', 'switch', 'toggle', 'toggle-group', 'color-picker', 'color-field', 'color-area', 'color-slider', 'color-swatch', 'color-swatch-picker', 'number-field']),
  group('invoke-command', '执行与命令', 'EXECUTE', '触发主操作、快捷命令和上下文动作。', ['button', 'split-button', 'icon-button', 'dropdown-menu', 'context-menu', 'toolbar', 'toolbar-menu', 'menubar', 'toggle', 'toggle-group', 'switch']),
  group('reveal-inspect', '查看与展开', 'REVEAL & INSPECT', '按需展开、预览或查看补充信息。', ['card', 'badge', 'avatar', 'aspect-ratio', 'label', 'separator', 'accordion', 'collapsible', 'popover', 'hover-card', 'tooltip', 'drawer', 'dialog']),
  group('compose-organize', '编排与组织', 'COMPOSE', '组织内容区块、文档、层级和可调布局。', ['card', 'splitter', 'scroll-area', 'virtual-list', 'data-table', 'tree', 'tabs', 'accordion', 'collapsible', 'separator', 'aspect-ratio', 'mdx', 'toolbar']),
  group('progress-track', '推进与跟踪', 'TRACK PROGRESS', '展示步骤、分页、进度和阶段完成情况。', ['progress', 'stepper', 'pagination', 'tabs', 'badge', 'toast', 'calendar', 'range-calendar']),
  group('confirm-protect', '确认与保护', 'CONFIRM & PROTECT', '在关键操作前确认意图并保护敏感步骤。', ['dialog', 'alert-dialog', 'drawer', 'popover', 'button', 'split-button', 'checkbox', 'pin-input', 'stepper']),
  group('communicate-feedback', '反馈与告知', 'COMMUNICATE', '传达状态、结果、风险和短期提示。', ['toast', 'tooltip', 'badge', 'progress', 'alert-dialog', 'dialog', 'hover-card', 'popover']),
  group('recover-correct', '纠错与恢复', 'RECOVER', '修改错误输入、撤回选择或从失败操作中恢复。', ['alert-dialog', 'dialog', 'toast', 'textarea', 'editable', 'select', 'checkbox', 'stepper', 'context-menu', 'dropdown-menu', ...textInputControlIds]),
]

const dataGroups: ComponentGroupDefinition[] = [
  group('site-structure', '站点结构与路由', 'SITE STRUCTURE', '承载导航组、页面层级、路由和响应式内容几何。', ['site-shell', 'site-header', 'site-navigation', 'breadcrumbs', 'page-frame', 'container', 'stack', 'cluster', 'grid']),
  group('native-input-data', '类型化表单数据', 'PACKAGED INPUT DATA', '按数据类型区分字符串、布尔、文件、数值、日期和命令，并提供相应便捷逻辑。', inputControlIds),
  group('plain-text', '文本与字符串', 'TEXT & STRING', '录入、选择、编辑或呈现文本字符串。', ['textarea', 'editable', 'label', 'autocomplete', 'combobox', 'select', 'choice-portal', 'tags-input', 'pin-input', 'mdx', 'badge', 'tooltip', ...textInputControlIds]),
  group('numeric-value', '数值与范围', 'NUMBER & RANGE', '处理计数、步进、比例、评分和连续数值范围。', ['number-field', 'slider', 'rating', 'progress', 'pagination', 'stepper']),
  group('binary-state', '布尔与开关状态', 'BOOLEAN', '表达开启、关闭、选中和未选中状态。', ['checkbox', 'switch', 'toggle', 'toggle-group']),
  group('single-option', '单值与枚举', 'SINGLE VALUE', '从有限候选集合中确定一个值。', ['radio-group', 'segmented', 'select', 'choice-portal', 'combobox', 'autocomplete', 'listbox', 'tabs', 'rating', 'color-swatch-picker', 'calendar', 'date-picker', 'month-picker', 'year-picker']),
  group('multi-values', '多值与集合选择', 'MULTI VALUE', '维护多个值、标签、区间或批量选择结果。', ['multi-choice', 'checkbox', 'tags-input', 'listbox', 'toggle-group', 'range-calendar', 'date-range-field', 'date-range-picker', 'month-range-picker', 'year-range-picker', 'time-range-field']),
  group('date-value', '日期与日期范围', 'DATE', '处理具体日期和连续日期范围。', ['calendar', 'range-calendar', 'date-field', 'date-picker', 'date-range-field', 'date-range-picker']),
  group('period-time', '周期与时间', 'PERIOD & TIME', '处理月份、年份、时刻和时间范围。', ['month-picker', 'month-range-picker', 'year-picker', 'year-range-picker', 'time-field', 'time-range-field', 'time-picker']),
  group('color-value', '颜色与色彩通道', 'COLOR', '处理颜色值、色彩通道和预设色板。', ['color-picker', 'color-field', 'color-area', 'color-slider', 'color-swatch', 'color-swatch-picker']),
  group('identity-media', '身份与媒体', 'IDENTITY & MEDIA', '呈现人物身份、图片、媒体比例和摘要卡片。', ['avatar', 'aspect-ratio', 'card', 'hover-card', 'badge']),
  group('command-event', '命令与事件', 'COMMAND & EVENT', '产生操作事件而非直接维护业务字段值。', ['button', 'split-button', 'icon-button', 'dropdown-menu', 'context-menu', 'toolbar', 'toolbar-menu', 'menubar', 'navigation-menu', 'toggle']),
  group('collection-tree', '列表、集合与层级', 'COLLECTION & TREE', '呈现列表、分页集合、菜单和层级节点。', ['data-table', 'listbox', 'path-picker', 'accordion', 'collapsible', 'tabs', 'tree', 'tree-menu', 'pagination', 'scroll-area', 'virtual-list', 'navigation-menu', 'dropdown-menu', 'context-menu', 'menubar', 'toolbar']),
  group('document-content', '文档与富内容', 'DOCUMENT & CONTENT', '承载文档、长文本、内容区块和补充说明。', ['mdx', 'textarea', 'editable', 'card', 'label', 'badge', 'separator', 'tooltip', 'popover', 'drawer', 'dialog', 'hover-card']),
  group('status-message', '状态与消息', 'STATUS & MESSAGE', '呈现进度、状态、警告和瞬时消息。', ['badge', 'progress', 'toast', 'tooltip', 'alert-dialog', 'stepper', 'switch', 'checkbox', 'dialog']),
  group('layout-geometry', '布局与几何', 'LAYOUT & GEOMETRY', '维护尺寸、比例、滚动边界和空间分割。', ['splitter', 'scroll-area', 'aspect-ratio', 'separator', 'drawer', 'popover', 'card']),
]

export const componentGroupDefinitions: Record<ComponentGroupingMode, ComponentGroupDefinition[]> = {
  family: familyGroups,
  purpose: purposeGroups,
  site: siteGroups,
  flow: flowGroups,
  data: dataGroups,
}

const componentById = new Map(componentCatalog.map(component => [component.id, component]))

export function resolveComponentGroups(mode: ComponentGroupingMode): ResolvedComponentGroup[] {
  return componentGroupDefinitions[mode].map(({ componentIds, ...definition }) => ({
    ...definition,
    components: componentIds.flatMap(id => componentById.get(id) ?? []),
  }))
}

export function componentGroupsFor(mode: ComponentGroupingMode, componentId: string): ResolvedComponentGroup[] {
  return resolveComponentGroups(mode).filter(group => group.components.some(component => component.id === componentId))
}

export function primaryComponentGroup(mode: ComponentGroupingMode, componentId: string): ResolvedComponentGroup | undefined {
  return componentGroupsFor(mode, componentId)[0]
}

export function groupingModeDescription(mode: ComponentGroupingMode) {
  return componentGroupingModes.find(item => item.value === mode)?.description ?? componentGroupingModes[0].description
}

export const componentGroupingStorageKey = 'dl-component-grouping-mode'

export function readComponentGroupingMode(): ComponentGroupingMode {
  if (typeof window === 'undefined') return 'family'
  const value = window.localStorage.getItem(componentGroupingStorageKey)
  return componentGroupingModes.some(mode => mode.value === value) ? value as ComponentGroupingMode : 'family'
}

export function saveComponentGroupingMode(mode: ComponentGroupingMode) {
  if (typeof window !== 'undefined') window.localStorage.setItem(componentGroupingStorageKey, mode)
}

function group(id: string, label: string, english: string, summary: string, componentIds: string[]): ComponentGroupDefinition {
  return { id, label, english, summary, componentIds }
}
