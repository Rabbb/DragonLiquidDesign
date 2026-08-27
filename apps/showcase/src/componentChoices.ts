import { componentCatalog, type ComponentDefinition } from './catalog.ts'

export type ComponentCatalogScope = 'recommended' | 'all'
export type ComponentChoiceTier = 'recommended' | 'specialized' | 'foundation' | 'compatibility'

export interface ComponentChoiceProfile {
  tier: ComponentChoiceTier
  label: string
  summary: string
  preferredId?: string
}

export interface ComponentChoiceOption {
  id: string
  useWhen: string
}

export interface ComponentChoiceFamily {
  id: string
  label: string
  question: string
  summary: string
  preferredId: string
  options: ComponentChoiceOption[]
}

export const componentCatalogScopes = [
  { value: 'recommended', label: '精简', description: '只显示多数业务应先考虑的控件。' },
  { value: 'all', label: '全部', description: '显示专用控件、底层积木与兼容封装。' },
] as const

const recommendedIds = new Set([
  'button', 'split-button', 'badge', 'card', 'icon-button',
  'input-color', 'input-date', 'input-datetime-local', 'input-email', 'input-file', 'input-month',
  'input-number', 'input-password', 'input-search', 'input-tel', 'input-text', 'input-time', 'input-url', 'input-week',
  'textarea', 'choice-portal', 'multi-choice', 'segmented', 'autocomplete', 'checkbox', 'combobox', 'editable',
  'pin-input', 'radio-group', 'rating', 'select', 'slider', 'switch', 'tags-input', 'color-swatch-picker', 'time-wheel',
  'calendar', 'date-range-picker', 'month-range-picker', 'year-picker', 'year-range-picker', 'mdx', 'virtual-list',
  'accordion', 'alert-dialog', 'avatar', 'context-menu', 'dialog', 'drawer', 'dropdown-menu', 'navigation-menu',
  'pagination', 'popover', 'progress', 'stepper', 'tabs', 'toast', 'tooltip', 'tree',
])

const foundationIds = new Set([
  'label', 'listbox', 'color-area', 'color-slider', 'color-swatch', 'date-field', 'date-range-field',
  'range-calendar', 'time-field', 'time-range-field', 'aspect-ratio', 'collapsible', 'scroll-area', 'separator',
])

const compatibilityPreferredIds: Record<string, string> = {
  'input-button': 'button',
  'input-checkbox': 'checkbox',
  'input-image': 'button',
  'input-radio': 'radio-group',
  'input-range': 'slider',
  'input-reset': 'button',
  'input-submit': 'button',
}

const tierCopy: Record<ComponentChoiceTier, Omit<ComponentChoiceProfile, 'tier' | 'preferredId'>> = {
  recommended: {
    label: '默认推荐',
    summary: '覆盖高频业务任务，第一次选型从这里开始。',
  },
  specialized: {
    label: '专用场景',
    summary: '能力明确但使用频率较低，在场景匹配时选用。',
  },
  foundation: {
    label: '基础积木',
    summary: '用于组合更复杂的控件，普通业务表单通常不直接使用。',
  },
  compatibility: {
    label: '兼容封装',
    summary: '保留固定 HTML 语义或迁移能力，新业务优先使用对应推荐控件。',
  },
}

export const componentChoiceFamilies: ComponentChoiceFamily[] = [
  {
    id: 'actions',
    label: '操作触发',
    question: '这次操作需要几个入口？',
    summary: '先按动作数量和空间约束选择，不要按标签外观选择。',
    preferredId: 'button',
    options: [
      { id: 'button', useWhen: '一个有文字的明确动作' },
      { id: 'icon-button', useWhen: '空间紧凑且图标含义明确' },
      { id: 'split-button', useWhen: '一个高频主动作加一组次级动作' },
      { id: 'input-submit', useWhen: '必须保留原生提交 input 语义' },
      { id: 'input-reset', useWhen: '必须保留原生重置 input 语义' },
      { id: 'input-button', useWhen: '迁移依赖 input 按钮的旧表单' },
      { id: 'input-image', useWhen: '后端依赖图像提交坐标数据' },
    ],
  },
  {
    id: 'boolean',
    label: '布尔状态',
    question: '状态是提交后生效，还是切换后立即生效？',
    summary: 'Checkbox 表达表单选择，Switch 表达立即生效的设置，Toggle 表达工具状态。',
    preferredId: 'checkbox',
    options: [
      { id: 'checkbox', useWhen: '协议、批量选择或随表单提交' },
      { id: 'switch', useWhen: '设置切换后立即生效' },
      { id: 'toggle', useWhen: '工具栏中的按下/未按下状态' },
      { id: 'input-checkbox', useWhen: '迁移依赖原生 checkbox 的旧表单' },
    ],
  },
  {
    id: 'single-choice',
    label: '单项选择',
    question: '候选项有多少，是否需要搜索或同时看见？',
    summary: '选项数量和浏览方式决定控件；不存在一个适用于所有单选任务的“万能选择器”。',
    preferredId: 'select',
    options: [
      { id: 'segmented', useWhen: '2–5 个高频选项，需要直接切换' },
      { id: 'radio-group', useWhen: '少量选项，需要同时比较说明' },
      { id: 'select', useWhen: '固定候选项，页面空间有限' },
      { id: 'combobox', useWhen: '固定候选项较多，需要检索' },
      { id: 'autocomplete', useWhen: '允许自由输入，同时提供建议' },
      { id: 'choice-portal', useWhen: '大量复杂选项，需要沉浸浏览' },
      { id: 'listbox', useWhen: '选项需要始终可见或用于复合控件' },
      { id: 'input-radio', useWhen: '迁移单个原生 radio 的旧表单' },
    ],
  },
  {
    id: 'number',
    label: '数值与程度',
    question: '用户要输入精确值，还是表达一个视觉程度？',
    summary: '精确数值、连续程度和主观评分是三类不同任务。',
    preferredId: 'input-number',
    options: [
      { id: 'input-number', useWhen: '输入精确数字，并需要步进和单位' },
      { id: 'slider', useWhen: '在已知范围内快速调整程度' },
      { id: 'rating', useWhen: '表达满意度等主观评分结果' },
      { id: 'number-field', useWhen: '组合自定义数字输入结构' },
      { id: 'input-range', useWhen: '迁移依赖原生 range 的旧表单' },
    ],
  },
  {
    id: 'date',
    label: '日期选择',
    question: '业务需要字符串字段、日历对象，还是日期范围？',
    summary: '普通表单优先类型化 Input；复杂日历和范围任务再使用日期组件族。',
    preferredId: 'input-date',
    options: [
      { id: 'input-date', useWhen: '提交 YYYY-MM-DD 单日期字符串' },
      { id: 'date-picker', useWhen: '需要日历浮层和结构化日期值' },
      { id: 'calendar', useWhen: '日历需要常驻页面' },
      { id: 'date-range-picker', useWhen: '选择开始与结束日期' },
      { id: 'date-field', useWhen: '组合键盘友好的日期分段输入' },
      { id: 'range-calendar', useWhen: '组合常驻的范围日历' },
      { id: 'date-range-field', useWhen: '组合日期范围分段输入' },
    ],
  },
  {
    id: 'time',
    label: '时间选择',
    question: '输入单个时间，还是面向触屏滚动或时间范围？',
    summary: '普通表单使用 InputTime；移动端滚动选择和复合范围按需升级。',
    preferredId: 'input-time',
    options: [
      { id: 'input-time', useWhen: '提交 HH:mm 单时间字符串' },
      { id: 'time-wheel', useWhen: '移动端或大触控区域滚动选择' },
      { id: 'time-field', useWhen: '组合结构化时间分段输入' },
      { id: 'time-range-field', useWhen: '输入开始与结束时间' },
    ],
  },
  {
    id: 'color',
    label: '颜色选择',
    question: '颜色来自自由输入、预设色板，还是专业调色？',
    summary: '先区分业务配置与设计工具；普通业务不需要暴露完整色彩通道。',
    preferredId: 'input-color',
    options: [
      { id: 'input-color', useWhen: '普通表单输入单个颜色值' },
      { id: 'color-swatch-picker', useWhen: '只能从品牌预设色中选择' },
      { id: 'color-field', useWhen: '精确编辑结构化颜色通道' },
      { id: 'color-area', useWhen: '组合二维饱和度与明度面板' },
      { id: 'color-slider', useWhen: '组合单个颜色通道滑块' },
      { id: 'color-swatch', useWhen: '只呈现颜色样本而不允许编辑' },
    ],
  },
  {
    id: 'text',
    label: '文本录入',
    question: '内容是一行、多行、行内编辑，还是结构化文档？',
    summary: '按内容长度和编辑上下文选择，避免把所有文字都交给一个输入框。',
    preferredId: 'input-text',
    options: [
      { id: 'input-text', useWhen: '姓名、标题等单行短文本字段' },
      { id: 'textarea', useWhen: '备注、说明等多行纯文本内容' },
      { id: 'editable', useWhen: '阅读状态中直接行内修改' },
      { id: 'mdx', useWhen: 'Markdown 与结构化富文档' },
      { id: 'tags-input', useWhen: '录入多个短文本值' },
    ],
  },
  {
    id: 'overlays',
    label: '浮层容器',
    question: '浮层承载任务、确认、补充信息还是一句提示？',
    summary: '内容重量与是否阻断当前任务决定浮层类型。',
    preferredId: 'dialog',
    options: [
      { id: 'dialog', useWhen: '需要聚焦完成一个独立任务' },
      { id: 'alert-dialog', useWhen: '不可逆操作前必须明确确认' },
      { id: 'drawer', useWhen: '移动端或侧边承载较长任务' },
      { id: 'popover', useWhen: '触发点附近的轻量交互内容' },
      { id: 'hover-card', useWhen: '悬停预览非关键补充信息' },
      { id: 'tooltip', useWhen: '解释图标或提供一句短提示' },
    ],
  },
  {
    id: 'menus',
    label: '菜单与命令',
    question: '命令从按钮、对象上下文，还是长期工具区发起？',
    summary: '菜单入口应该反映命令来源，而不是仅为了收纳更多按钮。',
    preferredId: 'dropdown-menu',
    options: [
      { id: 'dropdown-menu', useWhen: '由一个可见触发器展开命令' },
      { id: 'context-menu', useWhen: '命令针对被右键或长按的对象' },
      { id: 'split-button', useWhen: '主动作需直接执行，次级动作收纳' },
      { id: 'toolbar', useWhen: '一组高频工具长期可见' },
      { id: 'menubar', useWhen: '桌面式多层命令体系' },
    ],
  },
]

const choiceFamilyByComponentId = new Map<string, ComponentChoiceFamily>()
for (const family of componentChoiceFamilies) {
  for (const option of family.options) {
    if (!choiceFamilyByComponentId.has(option.id)) choiceFamilyByComponentId.set(option.id, family)
  }
}

export function componentChoiceProfileFor(componentId: string): ComponentChoiceProfile {
  const preferredId = compatibilityPreferredIds[componentId]
  const tier: ComponentChoiceTier = preferredId
    ? 'compatibility'
    : recommendedIds.has(componentId)
      ? 'recommended'
      : foundationIds.has(componentId)
        ? 'foundation'
        : 'specialized'
  return { tier, ...tierCopy[tier], preferredId }
}

export function componentChoiceFamilyFor(componentId: string) {
  return choiceFamilyByComponentId.get(componentId)
}

export function isRecommendedComponent(component: ComponentDefinition | string) {
  const id = typeof component === 'string' ? component : component.id
  return componentChoiceProfileFor(id).tier === 'recommended'
}

export function filterRecommendedComponents(components: ComponentDefinition[]) {
  return components.filter(isRecommendedComponent)
}

export const recommendedComponentCount = componentCatalog.filter(isRecommendedComponent).length

export const componentCatalogScopeStorageKey = 'dl-component-catalog-scope'

export function readComponentCatalogScope(): ComponentCatalogScope {
  if (typeof window === 'undefined') return 'recommended'
  return window.localStorage.getItem(componentCatalogScopeStorageKey) === 'all' ? 'all' : 'recommended'
}

export function saveComponentCatalogScope(scope: ComponentCatalogScope) {
  if (typeof window !== 'undefined') window.localStorage.setItem(componentCatalogScopeStorageKey, scope)
}
