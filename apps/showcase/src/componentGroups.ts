import { componentCatalog, type ComponentDefinition } from './catalog.ts'

export type ComponentGroupingMode = 'family' | 'purpose' | 'site'

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
] as const

const familyGroups: ComponentGroupDefinition[] = [
  group('actions', '操作按钮', 'ACTIONS', '执行主操作、快捷操作与组合命令。', ['button', 'split-button', 'icon-button', 'toggle', 'toggle-group']),
  group('text-entry', '文本录入', 'TEXT ENTRY', '输入、编辑和维护短文本或长文本。', ['input', 'textarea', 'editable', 'label']),
  group('structured-entry', '结构化录入', 'STRUCTURED ENTRY', '录入数字、验证码与多个标签值。', ['number-field', 'pin-input', 'tags-input']),
  group('single-choice', '单项选择', 'SINGLE CHOICE', '搜索、浏览并选择一个候选值。', ['select', 'choice-portal', 'combobox', 'autocomplete', 'listbox', 'radio-group', 'segmented']),
  group('state-choice', '状态与多选', 'STATE & MULTI', '表达多个选择、互斥状态或即时开关。', ['multi-choice', 'checkbox', 'radio-group', 'segmented', 'toggle', 'toggle-group', 'switch']),
  group('rating-range', '评分与范围', 'RATING & RANGE', '表达评分、连续数值和区间。', ['rating', 'slider', 'number-field', 'progress']),
  group('color-controls', '颜色控件', 'COLOR', '输入、调整、预览和选择颜色。', ['color-field', 'color-area', 'color-slider', 'color-swatch', 'color-swatch-picker']),
  group('day-date', '日期与日历', 'DAY & DATE', '选择单日、日期范围或直接编辑日期。', ['calendar', 'range-calendar', 'date-field', 'date-picker', 'date-range-field', 'date-range-picker']),
  group('period-pickers', '月年周期', 'MONTH & YEAR', '选择月份、年份及其范围。', ['month-picker', 'month-range-picker', 'year-picker', 'year-range-picker']),
  group('time-controls', '时间控件', 'TIME', '选择具体时间、时间段和触控时间。', ['time-field', 'time-range-field', 'time-wheel']),
  group('navigation', '导航与流程', 'NAVIGATION', '在页面、步骤和层级结构之间移动。', ['navigation-menu', 'menubar', 'tabs', 'pagination', 'stepper', 'tree', 'segmented']),
  group('command-menus', '命令与菜单', 'COMMAND MENUS', '组织工具命令和上下文操作。', ['dropdown-menu', 'context-menu', 'toolbar', 'menubar', 'split-button', 'icon-button']),
  group('overlays', '浮层与提示', 'OVERLAYS', '在当前页面之上承载任务、提示和补充信息。', ['dialog', 'alert-dialog', 'drawer', 'popover', 'hover-card', 'tooltip', 'dropdown-menu', 'context-menu', 'toast']),
  group('disclosure', '展开与收起', 'DISCLOSURE', '按需展开章节或单个补充区域。', ['accordion', 'collapsible', 'tabs']),
  group('content-display', '内容与标识', 'CONTENT DISPLAY', '承载、标记和分隔静态内容。', ['card', 'badge', 'avatar', 'aspect-ratio', 'label', 'separator', 'progress', 'color-swatch', 'mdx']),
  group('feedback', '状态反馈', 'FEEDBACK', '反馈任务进度和短期结果。', ['progress', 'toast', 'badge', 'rating', 'alert-dialog']),
  group('layout-data', '布局与长数据', 'LAYOUT & DATA', '分割布局、管理滚动并高效渲染长列表。', ['splitter', 'scroll-area', 'virtual-list', 'tree', 'pagination', 'listbox', 'card']),
  group('document', '文档编辑', 'DOCUMENT', '编辑和安全渲染结构化富文本文档。', ['mdx', 'textarea', 'editable', 'toolbar', 'menubar']),
]

const purposeGroups: ComponentGroupDefinition[] = [
  group('execute', '执行操作', 'EXECUTE', '提交、切换或触发一条明确命令。', ['button', 'split-button', 'icon-button', 'toggle', 'toggle-group', 'switch', 'toolbar', 'dropdown-menu', 'context-menu', 'menubar']),
  group('write', '文本与内容录入', 'WRITE', '输入、修改和组织文字内容。', ['input', 'textarea', 'editable', 'tags-input', 'mdx', 'label']),
  group('precise-input', '数值与安全输入', 'PRECISE INPUT', '录入受约束数值、验证码和敏感步骤。', ['number-field', 'pin-input', 'input', 'slider']),
  group('choose-filter', '选择与筛选', 'CHOOSE & FILTER', '从候选项中搜索、比较或筛选结果。', ['autocomplete', 'combobox', 'select', 'choice-portal', 'multi-choice', 'listbox', 'checkbox', 'radio-group', 'segmented', 'toggle-group', 'slider', 'rating', 'color-swatch-picker']),
  group('preference', '状态与偏好', 'PREFERENCE', '维护立即生效的布尔状态与显示偏好。', ['checkbox', 'radio-group', 'segmented', 'switch', 'toggle', 'toggle-group', 'select', 'color-swatch-picker']),
  group('schedule', '日期与排期', 'SCHEDULE', '选择日期、时间、周期和统计范围。', ['calendar', 'range-calendar', 'date-field', 'date-picker', 'date-range-field', 'date-range-picker', 'month-picker', 'month-range-picker', 'year-picker', 'year-range-picker', 'time-field', 'time-range-field', 'time-wheel']),
  group('navigate', '导航与流程推进', 'NAVIGATE', '定位页面、步骤、页码和层级节点。', ['navigation-menu', 'menubar', 'tabs', 'pagination', 'stepper', 'tree', 'accordion', 'collapsible']),
  group('context-task', '浮层与上下文任务', 'CONTEXT TASK', '不离开当前上下文完成任务或查看补充信息。', ['dialog', 'alert-dialog', 'drawer', 'popover', 'hover-card', 'tooltip', 'dropdown-menu', 'context-menu', 'choice-portal', 'multi-choice']),
  group('compose-layout', '布局与内容承载', 'COMPOSE LAYOUT', '建立内容比例、区块层级和可调整布局。', ['card', 'aspect-ratio', 'separator', 'splitter', 'accordion', 'collapsible', 'scroll-area']),
  group('status-result', '状态与结果反馈', 'STATUS & RESULT', '显示身份、状态、进度和操作结果。', ['badge', 'avatar', 'progress', 'toast', 'rating']),
  group('theme-visual', '主题与视觉设置', 'THEME & VISUAL', '编辑颜色并预览视觉令牌。', ['color-field', 'color-area', 'color-slider', 'color-swatch', 'color-swatch-picker', 'badge', 'card']),
  group('large-data', '长数据与性能', 'LARGE DATA', '浏览大量记录、层级节点和分页结果。', ['virtual-list', 'scroll-area', 'pagination', 'tree', 'listbox', 'splitter']),
  group('content-publish', '内容编辑与发布', 'CONTENT PUBLISH', '组合文档、媒体、命令和发布反馈。', ['mdx', 'textarea', 'toolbar', 'menubar', 'card', 'aspect-ratio', 'avatar', 'badge', 'dialog', 'toast']),
]

const siteGroups: ComponentGroupDefinition[] = [
  group('admin', '管理后台', 'ADMIN CONSOLE', '高密度表单、数据管理、批量操作和权限配置。', ['button', 'split-button', 'icon-button', 'input', 'textarea', 'select', 'multi-choice', 'segmented', 'autocomplete', 'checkbox', 'combobox', 'editable', 'listbox', 'number-field', 'label', 'pin-input', 'radio-group', 'slider', 'switch', 'tags-input', 'toggle', 'toggle-group', 'calendar', 'date-field', 'date-picker', 'date-range-field', 'date-range-picker', 'range-calendar', 'time-field', 'time-range-field', 'month-picker', 'month-range-picker', 'year-picker', 'year-range-picker', 'alert-dialog', 'context-menu', 'dialog', 'drawer', 'dropdown-menu', 'menubar', 'navigation-menu', 'pagination', 'progress', 'scroll-area', 'separator', 'splitter', 'stepper', 'tabs', 'toast', 'toolbar', 'tooltip', 'tree', 'virtual-list']),
  group('productivity', '效率与待办', 'PRODUCTIVITY', '任务、日程、文档、项目工作台和个人效率产品。', ['button', 'split-button', 'icon-button', 'input', 'textarea', 'choice-portal', 'multi-choice', 'segmented', 'checkbox', 'editable', 'tags-input', 'toggle', 'switch', 'calendar', 'date-picker', 'date-range-picker', 'time-field', 'time-range-field', 'time-wheel', 'month-picker', 'year-picker', 'mdx', 'virtual-list', 'accordion', 'dialog', 'drawer', 'dropdown-menu', 'navigation-menu', 'pagination', 'popover', 'progress', 'scroll-area', 'splitter', 'stepper', 'tabs', 'toast', 'toolbar', 'tooltip', 'tree']),
  group('content-community', '内容与社区', 'CONTENT & COMMUNITY', '内容流、个人资料、评论、收藏和社区互动。', ['button', 'badge', 'card', 'icon-button', 'input', 'textarea', 'autocomplete', 'checkbox', 'editable', 'multi-choice', 'radio-group', 'rating', 'select', 'switch', 'tags-input', 'toggle', 'toggle-group', 'aspect-ratio', 'avatar', 'collapsible', 'dialog', 'drawer', 'dropdown-menu', 'hover-card', 'navigation-menu', 'pagination', 'popover', 'progress', 'scroll-area', 'tabs', 'toast', 'tooltip']),
  group('commerce', '电商与交易', 'COMMERCE', '商品搜索、规格选择、订单流程和交易反馈。', ['button', 'split-button', 'badge', 'card', 'icon-button', 'input', 'autocomplete', 'checkbox', 'combobox', 'number-field', 'radio-group', 'select', 'slider', 'switch', 'tags-input', 'color-swatch-picker', 'calendar', 'date-picker', 'alert-dialog', 'context-menu', 'dialog', 'drawer', 'dropdown-menu', 'hover-card', 'navigation-menu', 'pagination', 'popover', 'progress', 'stepper', 'tabs', 'toast', 'tooltip', 'aspect-ratio']),
  group('media', '影音与娱乐', 'MEDIA', '影音目录、播放设置、评分、进度和沉浸式选择。', ['button', 'badge', 'card', 'icon-button', 'choice-portal', 'segmented', 'slider', 'toggle-group', 'aspect-ratio', 'avatar', 'hover-card', 'navigation-menu', 'progress', 'tabs', 'tooltip', 'drawer', 'rating']),
  group('knowledge', '知识与文档', 'KNOWLEDGE', '知识库、文档站、编辑器和层级内容导航。', ['button', 'split-button', 'badge', 'card', 'icon-button', 'input', 'textarea', 'autocomplete', 'checkbox', 'combobox', 'editable', 'listbox', 'multi-choice', 'select', 'tags-input', 'toggle-group', 'mdx', 'virtual-list', 'accordion', 'aspect-ratio', 'collapsible', 'context-menu', 'dialog', 'dropdown-menu', 'menubar', 'navigation-menu', 'pagination', 'popover', 'scroll-area', 'separator', 'splitter', 'tabs', 'toolbar', 'tooltip', 'tree']),
  group('marketing', '品牌与营销', 'MARKETING', '官网、活动页、产品介绍和线索收集。', ['button', 'badge', 'card', 'icon-button', 'input', 'textarea', 'checkbox', 'radio-group', 'select', 'switch', 'aspect-ratio', 'avatar', 'accordion', 'dialog', 'drawer', 'navigation-menu', 'progress', 'separator', 'tabs', 'toast', 'tooltip']),
  group('mobile', '移动应用与 H5', 'MOBILE & H5', '触控优先、底部抽屉和紧凑导航体验。', ['button', 'icon-button', 'choice-portal', 'multi-choice', 'segmented', 'time-wheel', 'checkbox', 'radio-group', 'slider', 'switch', 'toggle', 'toggle-group', 'drawer', 'navigation-menu', 'tabs', 'toast', 'tooltip', 'progress']),
  group('analytics', '数据与分析', 'ANALYTICS', '指标卡、时间范围、数据浏览和分析工作台。', ['badge', 'card', 'select', 'multi-choice', 'segmented', 'date-range-field', 'date-range-picker', 'range-calendar', 'month-picker', 'month-range-picker', 'year-picker', 'year-range-picker', 'progress', 'pagination', 'scroll-area', 'splitter', 'tabs', 'tooltip', 'tree', 'virtual-list', 'color-swatch']),
  group('account', '账号与权限', 'ACCOUNT & AUTH', '登录、注册、验证、隐私和账号设置。', ['button', 'icon-button', 'input', 'checkbox', 'pin-input', 'radio-group', 'select', 'switch', 'alert-dialog', 'dialog', 'popover', 'toast', 'tooltip', 'avatar']),
  group('booking', '预约与排期', 'BOOKING', '预约、会议、课程、酒店和资源排期。', ['button', 'input', 'select', 'multi-choice', 'segmented', 'checkbox', 'radio-group', 'switch', 'calendar', 'range-calendar', 'date-field', 'date-picker', 'date-range-field', 'date-range-picker', 'month-picker', 'month-range-picker', 'year-picker', 'year-range-picker', 'time-field', 'time-range-field', 'time-wheel', 'dialog', 'drawer', 'popover', 'toast']),
  group('design-tools', '设计与配置工具', 'DESIGN TOOLS', '主题编辑、组件文档、可视化配置和内部工具。', ['button', 'split-button', 'icon-button', 'input', 'textarea', 'number-field', 'label', 'select', 'segmented', 'slider', 'toggle', 'toggle-group', 'color-area', 'color-field', 'color-slider', 'color-swatch', 'color-swatch-picker', 'mdx', 'card', 'badge', 'aspect-ratio', 'separator', 'splitter', 'tabs', 'toolbar', 'tooltip', 'popover', 'dialog']),
]

export const componentGroupDefinitions: Record<ComponentGroupingMode, ComponentGroupDefinition[]> = {
  family: familyGroups,
  purpose: purposeGroups,
  site: siteGroups,
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
