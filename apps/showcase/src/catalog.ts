export type ScenarioDefinition = {
  id: string
  label: string
  summary: string
}

export type ComponentDefinition = {
  id: string
  name: string
  category: '通用' | '表单' | '反馈'
  summary: string
  since: string
  scenarios: ScenarioDefinition[]
}

export const componentCatalog: ComponentDefinition[] = [
  {
    id: 'button',
    name: 'Button 按钮',
    category: '通用',
    summary: '触发操作、提交任务，并清晰表达动作层级。',
    since: '0.1.0',
    scenarios: [
      { id: 'basic', label: '通用案例', summary: '变体、尺寸和状态' },
      { id: 'form-submit', label: '表单提交', summary: '保存流程与加载反馈' },
      { id: 'danger-zone', label: '危险操作', summary: '不可逆动作的层级控制' },
    ],
  },
  {
    id: 'badge',
    name: 'Badge 徽标',
    category: '通用',
    summary: '用精炼的标签传递状态、属性和筛选条件。',
    since: '0.1.0',
    scenarios: [
      { id: 'basic', label: '通用案例', summary: '色调、外观和尺寸' },
      { id: 'content-status', label: '内容状态', summary: '发布、草稿与异常状态' },
      { id: 'active-filters', label: '数据筛选', summary: '展示已生效的过滤条件' },
    ],
  },
  {
    id: 'card',
    name: 'Card 卡片',
    category: '通用',
    summary: '承载关联内容和操作，构建稳定的视觉层级。',
    since: '0.1.0',
    scenarios: [
      { id: 'basic', label: '通用案例', summary: '内边距和交互状态' },
      { id: 'data-overview', label: '数据概览', summary: '仪表盘指标容器' },
      { id: 'media-collection', label: '内容收藏', summary: '动漫与媒体条目' },
    ],
  },
  {
    id: 'icon-button',
    name: 'IconButton 图标按钮',
    category: '通用',
    summary: '在紧凑空间提供可访问的快捷操作。',
    since: '0.1.0',
    scenarios: [
      { id: 'basic', label: '通用案例', summary: '变体、尺寸与标签' },
      { id: 'editor-toolbar', label: '编辑器工具栏', summary: '成组的格式化操作' },
      { id: 'card-actions', label: '卡片快捷操作', summary: '收藏、编辑与移除' },
    ],
  },
  {
    id: 'input',
    name: 'Input 输入框',
    category: '表单',
    summary: '采集短文本、数值和搜索关键词。',
    since: '0.1.0',
    scenarios: [
      { id: 'basic', label: '通用案例', summary: '尺寸、插槽和禁用态' },
      { id: 'global-search', label: '全局搜索', summary: '快捷键与搜索提示' },
      { id: 'form-validation', label: '表单校验', summary: '成功、警告与错误反馈' },
    ],
  },
  {
    id: 'select',
    name: 'Select 选择器',
    category: '表单',
    summary: '从有限选项中选择单个明确值。',
    since: '0.1.0',
    scenarios: [
      { id: 'basic', label: '通用案例', summary: '选项、描述和禁用态' },
      { id: 'catalog-filter', label: '收藏库筛选', summary: '组合过滤内容列表' },
      { id: 'preference-level', label: '偏好等级设置', summary: '具有解释的分级选项' },
    ],
  },
  {
    id: 'textarea',
    name: 'Textarea 文本域',
    category: '表单',
    summary: '编辑简介、备注和较长的结构化说明。',
    since: '0.1.0',
    scenarios: [
      { id: 'basic', label: '通用案例', summary: '尺寸、状态和字符内容' },
      { id: 'content-editor', label: '内容简介编辑', summary: '编辑作品或项目说明' },
      { id: 'feedback-message', label: '问题反馈', summary: '引导用户描述上下文' },
    ],
  },
  {
    id: 'dialog',
    name: 'Dialog 对话框',
    category: '反馈',
    summary: '聚焦需要用户确认或完成的短期任务。',
    since: '0.1.0',
    scenarios: [
      { id: 'basic', label: '通用案例', summary: '尺寸、标题与关闭行为' },
      { id: 'create-record', label: '创建收藏记录', summary: '在浮层内完成小型表单' },
      { id: 'delete-confirm', label: '删除确认', summary: '确认不可逆的危险操作' },
    ],
  },
]

export const componentCategories = ['通用', '表单', '反馈'] as const

export function componentRoute(componentId: string, scenarioId = 'basic') {
  return `#/components/${componentId}/${scenarioId}`
}

export function resolveComponent(componentId?: string, scenarioId?: string) {
  const component = componentCatalog.find(item => item.id === componentId) ?? componentCatalog[0]
  const scenario = component.scenarios.find(item => item.id === scenarioId) ?? component.scenarios[0]
  return { component, scenario }
}
