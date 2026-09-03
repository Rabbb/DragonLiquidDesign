import type { Component } from 'vue'
import DlAccordion from './DlAccordion.vue'
import DlAlertDialog from './DlAlertDialog.vue'
import DlAspectRatio from './DlAspectRatio.vue'
import DlAutocomplete from './DlAutocomplete.vue'
import DlAvatar from './DlAvatar.vue'
import DlBadge from './DlBadge.vue'
import MdxTextHighlight from './MdxTextHighlight.vue'
import DlBreadcrumbs from './DlBreadcrumbs.vue'
import DlButton from './DlButton.vue'
import DlCalendar from './DlCalendar.vue'
import DlCard from './DlCard.vue'
import DlCheckbox from './DlCheckbox.vue'
import DlChoicePortal from './DlChoicePortal.vue'
import DlCluster from './DlCluster.vue'
import DlCollapsible from './DlCollapsible.vue'
import DlColorArea from './DlColorArea.vue'
import DlColorField from './DlColorField.vue'
import DlColorPicker from './DlColorPicker.vue'
import DlColorSlider from './DlColorSlider.vue'
import DlColorSwatch from './DlColorSwatch.vue'
import DlColorSwatchPicker from './DlColorSwatchPicker.vue'
import DlCombobox from './DlCombobox.vue'
import DlContainer from './DlContainer.vue'
import DlContextMenu from './DlContextMenu.vue'
import DlDataTable from './DlDataTable.vue'
import DlDateField from './DlDateField.vue'
import DlDatePicker from './DlDatePicker.vue'
import DlDateRangeField from './DlDateRangeField.vue'
import DlDateRangePicker from './DlDateRangePicker.vue'
import DlDialog from './DlDialog.vue'
import DlDrawer from './DlDrawer.vue'
import DlDropdownMenu from './DlDropdownMenu.vue'
import DlEditable from './DlEditable.vue'
import DlHoverCard from './DlHoverCard.vue'
import DlGrid from './DlGrid.vue'
import DlIconButton from './DlIconButton.vue'
import DlInputButton from './DlInputButton.vue'
import DlInputCheckbox from './DlInputCheckbox.vue'
import DlInputColor from './DlInputColor.vue'
import DlInputDatetimeLocal from './DlInputDatetimeLocal.vue'
import DlInputEmail from './DlInputEmail.vue'
import DlInputFile from './DlInputFile.vue'
import DlInputHidden from './DlInputHidden.vue'
import DlInputImage from './DlInputImage.vue'
import DlInputNumber from './DlInputNumber.vue'
import DlInputPassword from './DlInputPassword.vue'
import DlInputRadio from './DlInputRadio.vue'
import DlInputRange from './DlInputRange.vue'
import DlInputReset from './DlInputReset.vue'
import DlInputSearch from './DlInputSearch.vue'
import DlInputSubmit from './DlInputSubmit.vue'
import DlInputTel from './DlInputTel.vue'
import DlInputText from './DlInputText.vue'
import DlInputUrl from './DlInputUrl.vue'
import DlInputWeek from './DlInputWeek.vue'
import DlLabel from './DlLabel.vue'
import DlListbox from './DlListbox.vue'
import DlMdx from './DlMdx.vue'
import DlMenubar from './DlMenubar.vue'
import DlMonthPicker from './DlMonthPicker.vue'
import DlMonthRangePicker from './DlMonthRangePicker.vue'
import DlMultiChoice from './DlMultiChoice.vue'
import DlNavigationMenu from './DlNavigationMenu.vue'
import DlNumberField from './DlNumberField.vue'
import DlPagination from './DlPagination.vue'
import DlPageFrame from './DlPageFrame.vue'
import DlPinInput from './DlPinInput.vue'
import DlPopover from './DlPopover.vue'
import DlProgress from './DlProgress.vue'
import DlRadioGroup from './DlRadioGroup.vue'
import DlRangeCalendar from './DlRangeCalendar.vue'
import DlRating from './DlRating.vue'
import DlScrollArea from './DlScrollArea.vue'
import DlSegmented from './DlSegmented.vue'
import DlSelect from './DlSelect.vue'
import DlSeparator from './DlSeparator.vue'
import DlSlider from './DlSlider.vue'
import DlSiteHeader from './DlSiteHeader.vue'
import DlSiteNavigation from './DlSiteNavigation.vue'
import DlSiteShell from './DlSiteShell.vue'
import DlSplitButton from './DlSplitButton.vue'
import DlSplitter from './DlSplitter.vue'
import DlStack from './DlStack.vue'
import DlStepper from './DlStepper.vue'
import DlSwitch from './DlSwitch.vue'
import DlTabs from './DlTabs.vue'
import DlTagsInput from './DlTagsInput.vue'
import DlTextarea from './DlTextarea.vue'
import DlTimeField from './DlTimeField.vue'
import DlTimePicker from './DlTimePicker.vue'
import DlTimeRangeField from './DlTimeRangeField.vue'
import DlToast from './DlToast.vue'
import DlToggle from './DlToggle.vue'
import DlToggleGroup from './DlToggleGroup.vue'
import DlToolbar from './DlToolbar.vue'
import DlToolbarMenu from './DlToolbarMenu.vue'
import DlTooltip from './DlTooltip.vue'
import DlTree from './DlTree.vue'
import DlTreeMenu from './DlTreeMenu.vue'
import DlVirtualList from './DlVirtualList.vue'
import DlYearPicker from './DlYearPicker.vue'
import DlYearRangePicker from './DlYearRangePicker.vue'
import {
  createDlMdxRegistry,
  defineDlMdxComponent,
  type DlMdxComponentCategory,
  type DlMdxComponentDefinition,
  type DlMdxComponentMaturity,
  type DlMdxEventSchema,
  type DlMdxPropSchema,
  type DlMdxRegistry,
} from './dl-mdx.registry'
import type { DlMdxValue } from './dl-mdx.types'

type OfficialOptions = {
  defaultProps?: Record<string, DlMdxValue>
  contentProp?: string
  defaultContent?: string
  triggerLabel?: string
  aliases?: string[]
  description?: string
  propSchema?: Record<string, DlMdxPropSchema>
  eventSchema?: Record<string, DlMdxEventSchema>
}

function official(
  name: string,
  component: Component,
  category: DlMdxComponentCategory,
  maturity: DlMdxComponentMaturity,
  options: OfficialOptions = {},
): DlMdxComponentDefinition {
  return defineDlMdxComponent({ name, component, category, maturity, ...options })
}

const choices = [
  { value: 'anime', label: '动画' },
  { value: 'manga', label: '漫画' },
]
const menuItems = [
  { value: 'edit', label: '编辑', shortcut: 'E' },
  { value: 'archive', label: '归档', shortcut: 'A' },
]

export const dlMdxOfficialComponents: DlMdxComponentDefinition[] = [
  official('Container', DlContainer, 'layout', 'custom', { defaultProps: { size: 'md', gutter: 'md' }, defaultContent: '居中的响应式内容区域。', description: '约束页面内容宽度并提供响应式边距。' }),
  official('Stack', DlStack, 'layout', 'custom', { defaultProps: { gap: 'md' }, defaultContent: '纵向内容流', description: '使用一致间距纵向排列内容。' }),
  official('Cluster', DlCluster, 'layout', 'custom', { defaultProps: { gap: 'sm', wrap: true }, defaultContent: '水平操作组', description: '可换行的横向布局，适合工具栏与标签组。' }),
  official('Grid', DlGrid, 'layout', 'custom', { defaultProps: { minItemWidth: '220px', gap: 'md' }, defaultContent: '响应式网格内容', description: '按最小项目宽度自动分栏的响应式网格。' }),
  official('PageFrame', DlPageFrame, 'layout', 'custom', { defaultProps: { layout: 'article', gap: '36px' }, defaultContent: '页面主内容', description: '覆盖文章、侧栏、辅助栏与三栏页面结构。' }),
  official('Breadcrumbs', DlBreadcrumbs, 'layout', 'custom', { defaultProps: { items: [{ label: 'Home', href: '/' }, { label: 'Guide', current: true }] }, description: '展示当前位置与上级页面路径。' }),
  official('SiteNavigation', DlSiteNavigation, 'layout', 'custom', { defaultProps: { mode: 'sidebar', groups: [{ id: 'guide', label: 'Guide', items: [{ id: 'start', label: 'Start', href: '/start' }] }] }, description: '支持顶部、侧边、标签与图标栏导航。' }),
  official('SiteHeader', DlSiteHeader, 'layout', 'custom', { defaultProps: { siteName: 'Dragon Liquid Site', caption: 'Built with DL', mark: 'DL' }, description: '网站品牌、导航与操作区域。' }),
  official('SiteShell', DlSiteShell, 'layout', 'custom', { defaultProps: { siteName: 'Dragon Liquid Site', navigationMode: 'hybrid', navigation: [{ id: 'main', label: 'Main', items: [{ id: 'home', label: 'Home', href: '/' }] }] }, defaultContent: '网站母版页内容插槽', description: '统一网站头部、导航、内容插槽、侧栏和页脚的母版页。' }),

  official('Button', DlButton, 'foundation', 'custom', {
    contentProp: 'text',
    defaultContent: '执行操作',
    description: '主要与次要操作。',
    propSchema: {
      variant: { type: 'string', enum: ['primary', 'secondary', 'ghost', 'danger'], description: '按钮的视觉层级。' },
      size: { type: 'string', enum: ['sm', 'md', 'lg'], description: '按钮尺寸。' },
    },
    eventSchema: { click: { description: '用户激活按钮时触发。' } },
  }),
  official('SplitButton', DlSplitButton, 'foundation', 'custom', { defaultProps: { label: '发布', items: menuItems }, description: '主操作与相关菜单操作。' }),
  official('Badge', DlBadge, 'foundation', 'custom', { contentProp: 'text', defaultContent: 'DRAGON', description: '状态与标签。' }),
  official('Highlight', MdxTextHighlight, 'foundation', 'custom', {
    aliases: ['Highlighter', 'TextHighlight'],
    contentProp: 'text',
    defaultProps: { variant: 'solid', speed: 2.4 },
    defaultContent: '高亮文本',
    description: '保留文本换行的主题高亮，支持纯色、渐变、彩虹、呼吸灯、波浪线和下横线。',
    propSchema: {
      variant: { type: 'string', enum: ['solid', 'gradient', 'rainbow', 'breathing', 'wavy', 'underline'], description: '高亮效果。' },
      color: { type: 'string', description: '主色，支持 CSS 颜色或 Dragon Liquid 主题变量。' },
      colorEnd: { type: 'string', description: '渐变结束色。' },
      colors: { type: 'array', items: { type: 'string' }, description: '彩虹或呼吸灯的自定义颜色序列。' },
      textColor: { type: 'string', description: '可选文字颜色。' },
      speed: { type: 'number', minimum: 0.6, maximum: 12, description: '呼吸动画周期，单位秒。' },
    },
  }),
  official('Card', DlCard, 'foundation', 'custom', { defaultProps: { padding: 'md' }, defaultContent: 'Dragon Liquid 内容卡片', description: '内容分组容器。' }),
  official('IconButton', DlIconButton, 'foundation', 'custom', { defaultProps: { label: '快捷操作' }, defaultContent: '✦', description: '紧凑图标操作。' }),
  official('InputButton', DlInputButton, 'form', 'custom', { defaultProps: { value: '执行操作' }, description: '固定为 button 的输入按钮。' }),
  official('InputCheckbox', DlInputCheckbox, 'form', 'custom', { defaultProps: { modelValue: true }, description: '固定为 checkbox 的布尔输入。' }),
  official('InputColor', DlInputColor, 'form', 'custom', { defaultProps: { modelValue: '#2f80ed' }, description: '固定为 color 的颜色输入。' }),
  official('InputDatetimeLocal', DlInputDatetimeLocal, 'form', 'custom', { defaultProps: { modelValue: '2026-08-28T09:30' }, description: '固定为 datetime-local 的本地日期时间输入。' }),
  official('InputEmail', DlInputEmail, 'form', 'custom', { defaultProps: { modelValue: 'designer@dragon.dev' }, description: '固定为 email 的邮箱输入。' }),
  official('InputFile', DlInputFile, 'form', 'custom', { description: '固定为 file 的文件选择输入。' }),
  official('InputHidden', DlInputHidden, 'form', 'custom', { defaultProps: { modelValue: 'record-20260828' }, description: '固定为 hidden 的隐藏表单字段。' }),
  official('InputImage', DlInputImage, 'form', 'custom', { defaultProps: { src: '/input-image-submit.svg', alt: '提交表单' }, description: '固定为 image 的图像提交输入。' }),
  official('InputNumber', DlInputNumber, 'form', 'custom', { defaultProps: { modelValue: 42 }, description: '固定为 number 的数值输入。' }),
  official('InputPassword', DlInputPassword, 'form', 'custom', { defaultProps: { modelValue: 'dragon-secret' }, description: '固定为 password 的密码输入。' }),
  official('InputRadio', DlInputRadio, 'form', 'custom', { defaultProps: { value: 'stable', modelValue: 'stable' }, description: '固定为 radio 的单选输入。' }),
  official('InputRange', DlInputRange, 'form', 'custom', { defaultProps: { modelValue: 68 }, description: '固定为 range 的范围输入。' }),
  official('InputReset', DlInputReset, 'form', 'custom', { defaultProps: { value: '重置' }, description: '固定为 reset 的表单重置输入。' }),
  official('InputSearch', DlInputSearch, 'form', 'custom', { defaultProps: { modelValue: '液态玻璃组件' }, description: '固定为 search 的搜索输入。' }),
  official('InputSubmit', DlInputSubmit, 'form', 'custom', { defaultProps: { value: '提交' }, description: '固定为 submit 的表单提交输入。' }),
  official('InputTel', DlInputTel, 'form', 'custom', { defaultProps: { modelValue: '138 0000 0000' }, description: '固定为 tel 的电话输入。' }),
  official('InputText', DlInputText, 'form', 'custom', { defaultProps: { modelValue: 'Dragon Liquid' }, description: '固定为 text 的单行文本输入。' }),
  official('InputUrl', DlInputUrl, 'form', 'custom', { defaultProps: { modelValue: 'https://todo.moe' }, description: '固定为 url 的网址输入。' }),
  official('InputWeek', DlInputWeek, 'form', 'custom', { defaultProps: { modelValue: '2026-W35' }, description: '固定为 week 的周输入。' }),
  official('Textarea', DlTextarea, 'foundation', 'custom', { defaultProps: { modelValue: '在这里记录内容。' }, description: '多行文本输入。' }),

  official('Autocomplete', DlAutocomplete, 'form', 'alpha', { defaultProps: { suggestions: ['Frieren', 'Fern', 'Stark'], placeholder: '搜索角色' } }),
  official('Checkbox', DlCheckbox, 'form', 'stable', { defaultProps: { label: '追踪更新', modelValue: true } }),
  official('ChoicePortal', DlChoicePortal, 'form', 'custom', { defaultProps: { options: choices, modelValue: 'anime', placeholder: '选择内容类型' } }),
  official('Combobox', DlCombobox, 'form', 'stable', { defaultProps: { options: choices, placeholder: '选择类型' } }),
  official('Editable', DlEditable, 'form', 'stable', { defaultProps: { modelValue: '可编辑标题' } }),
  official('Label', DlLabel, 'form', 'stable', { defaultContent: '作品标题' }),
  official('Listbox', DlListbox, 'form', 'stable', { defaultProps: { options: choices } }),
  official('MultiChoice', DlMultiChoice, 'form', 'custom', { defaultProps: { options: choices, modelValue: ['anime'], placeholder: '选择内容类型' } }),
  official('NumberField', DlNumberField, 'form', 'stable', { defaultProps: { modelValue: 12, min: 0, max: 24 } }),
  official('PinInput', DlPinInput, 'form', 'stable', { defaultProps: { length: 6 } }),
  official('RadioGroup', DlRadioGroup, 'form', 'stable', { defaultProps: { options: choices, modelValue: 'anime' } }),
  official('Rating', DlRating, 'form', 'alpha', { defaultProps: { modelValue: 4, length: 5 } }),
  official('Segmented', DlSegmented, 'form', 'custom', { defaultProps: { items: choices, modelValue: 'anime' } }),
  official('Select', DlSelect, 'form', 'stable', { defaultProps: { options: choices, modelValue: 'anime' } }),
  official('Slider', DlSlider, 'form', 'stable', { defaultProps: { modelValue: [68], min: 0, max: 100 } }),
  official('Switch', DlSwitch, 'form', 'stable', { defaultProps: { label: '自动同步', modelValue: true } }),
  official('TagsInput', DlTagsInput, 'form', 'stable', { defaultProps: { modelValue: ['奇幻', '冒险'] } }),
  official('Toggle', DlToggle, 'form', 'stable', { defaultContent: '收藏' }),
  official('ToggleGroup', DlToggleGroup, 'form', 'stable', { defaultProps: { items: choices, modelValue: 'anime' } }),

  official('ColorArea', DlColorArea, 'color', 'alpha', { defaultProps: { modelValue: '#ffb11b' } }),
  official('ColorField', DlColorField, 'color', 'alpha', { defaultProps: { modelValue: '#ffb11b' } }),
  official('ColorPicker', DlColorPicker, 'color', 'alpha', { defaultProps: { modelValue: '#ffb11b' } }),
  official('ColorSlider', DlColorSlider, 'color', 'alpha', { defaultProps: { channel: 'hue', modelValue: '#ffb11b' } }),
  official('ColorSwatch', DlColorSwatch, 'color', 'alpha', { defaultProps: { color: '#ffb11b' } }),
  official('ColorSwatchPicker', DlColorSwatchPicker, 'color', 'alpha', { defaultProps: { colors: ['#ffb11b', '#32cd32', '#87ceeb'] } }),

  official('Calendar', DlCalendar, 'dates', 'alpha'),
  official('DateField', DlDateField, 'dates', 'alpha'),
  official('DatePicker', DlDatePicker, 'dates', 'alpha'),
  official('DateRangeField', DlDateRangeField, 'dates', 'alpha'),
  official('DateRangePicker', DlDateRangePicker, 'dates', 'alpha'),
  official('RangeCalendar', DlRangeCalendar, 'dates', 'alpha'),
  official('TimeField', DlTimeField, 'dates', 'alpha'),
  official('TimePicker', DlTimePicker, 'dates', 'custom'),
  official('TimeRangeField', DlTimeRangeField, 'dates', 'alpha'),
  official('MonthPicker', DlMonthPicker, 'dates', 'alpha'),
  official('MonthRangePicker', DlMonthRangePicker, 'dates', 'alpha'),
  official('YearPicker', DlYearPicker, 'dates', 'alpha'),
  official('YearRangePicker', DlYearRangePicker, 'dates', 'alpha'),

  official('Accordion', DlAccordion, 'general', 'stable', { defaultProps: { items: [{ value: 'intro', title: '作品简介', content: '冒险结束后的新旅程。' }] } }),
  official('AlertDialog', DlAlertDialog, 'general', 'stable', { defaultProps: { title: '确认操作', description: '请确认是否继续。' }, defaultContent: '此操作需要再次确认。', triggerLabel: '打开警示对话框' }),
  official('AspectRatio', DlAspectRatio, 'general', 'stable', { defaultProps: { ratio: 1.7778 }, defaultContent: '16 : 9' }),
  official('Avatar', DlAvatar, 'general', 'stable', { defaultProps: { fallback: 'DL' } }),
  official('Collapsible', DlCollapsible, 'general', 'stable', { defaultProps: { title: '更多资料' }, defaultContent: '按需展开的补充内容。' }),
  official('ContextMenu', DlContextMenu, 'general', 'stable', { defaultProps: { items: menuItems }, defaultContent: '在此区域打开上下文菜单' }),
  official('DataTable', DlDataTable, 'general', 'custom', { defaultProps: { columns: [{ role: 'check', width: 44 }, { property: 'title', label: '标题' }, { property: 'status', label: '状态', width: 100 }], rows: [{ id: 1, title: '整理 MDX 笔记', status: '进行中' }, { id: 2, title: '刷新 TODO 快照', status: '待办' }] }, description: '适配 DL 主题、稳定行键状态与完整数据工作流的数据表格。' }),
  official('Dialog', DlDialog, 'general', 'stable', { defaultProps: { title: '编辑条目', description: '修改作品的基础资料。' }, defaultContent: '对话框正文由安全注册定义提供。', triggerLabel: '打开对话框' }),
  official('Drawer', DlDrawer, 'general', 'alpha', { defaultProps: { title: '筛选条件', description: '调整收藏库显示范围。' }, defaultContent: '抽屉正文由安全注册定义提供。', triggerLabel: '打开抽屉' }),
  official('DropdownMenu', DlDropdownMenu, 'general', 'stable', { defaultProps: { items: menuItems, label: '条目操作' }, triggerLabel: '打开菜单' }),
  official('HoverCard', DlHoverCard, 'general', 'stable', { defaultContent: '悬浮卡片中的作品摘要。', triggerLabel: '悬停查看资料' }),
  official('Mdx', DlMdx, 'general', 'alpha', { aliases: ['MarkdownX'], defaultProps: { modelValue: '## 嵌套 MarkdownX\n\n官方注册表也包含文档组件。', mode: 'preview', showToolbar: false, minHeight: '12rem' } }),
  official('Menubar', DlMenubar, 'general', 'stable', { defaultProps: { menus: [{ value: 'file', label: '文件', items: menuItems }] } }),
  official('NavigationMenu', DlNavigationMenu, 'general', 'stable', { defaultProps: { items: [{ value: 'home', label: '首页', href: '/' }, { value: 'archive', label: '档案', href: '/components/mdx/basic' }] } }),
  official('Pagination', DlPagination, 'general', 'stable', { defaultProps: { total: 120, itemsPerPage: 12, page: 2 } }),
  official('Popover', DlPopover, 'general', 'stable', { defaultProps: { title: '快捷资料' }, defaultContent: 'Popover 中的安全扩展内容。', triggerLabel: '打开气泡卡片' }),
  official('Progress', DlProgress, 'general', 'stable', { defaultProps: { modelValue: 68, showValue: true, label: '整理进度' } }),
  official('ScrollArea', DlScrollArea, 'general', 'stable', { defaultProps: { type: 'always' }, defaultContent: '可滚动内容区域 · Dragon Liquid · MarkdownX Registry' }),
  official('Separator', DlSeparator, 'general', 'stable'),
  official('Splitter', DlSplitter, 'general', 'stable', { defaultProps: { panels: [{ id: 'source', defaultSize: 45 }, { id: 'preview', defaultSize: 55 }] } }),
  official('Stepper', DlStepper, 'general', 'stable', { defaultProps: { items: [{ step: 1, title: '草稿', completed: true }, { step: 2, title: '校对' }], modelValue: 2 } }),
  official('Tabs', DlTabs, 'general', 'stable', { defaultProps: { items: [{ value: 'intro', label: '简介', description: '作品简介内容' }, { value: 'episodes', label: '剧集', description: '剧集列表内容' }], modelValue: 'intro' } }),
  official('Toast', DlToast, 'general', 'stable', { defaultProps: { title: '保存完成', description: 'MarkdownX 注册定义已经生效。', open: false } }),
  official('Toolbar', DlToolbar, 'general', 'stable', { defaultProps: { items: menuItems } }),
  official('ToolbarMenu', DlToolbarMenu, 'general', 'custom', { defaultProps: { menus: [{ value: 'file', label: '文件', items: menuItems }] }, description: '面向桌面应用场景的分层工具栏菜单与快捷键绑定。' }),
  official('Tooltip', DlTooltip, 'general', 'stable', { defaultProps: { text: '由官方注册表渲染', tone: 'accent' }, defaultContent: '悬停查看提示' }),
  official('Tree', DlTree, 'general', 'alpha', { defaultProps: { items: [{ id: 'season', label: '季度', children: [{ id: 'spring', label: '春季番' }] }] } }),
  official('TreeMenu', DlTreeMenu, 'general', 'stable', { defaultProps: { label: '文档目录', items: [{ id: 'home', label: '首页', description: '/' }, { id: 'docs', label: '文档', children: [{ id: 'start', label: '开始使用', description: '/docs/start' }] }] } }),
  official('VirtualList', DlVirtualList, 'general', 'custom', { defaultProps: { items: ['动画', '漫画', '轻小说'], estimatedItemHeight: 48, viewportHeight: 144 } }),
]

export function createDlMdxOfficialRegistry(extensions: DlMdxComponentDefinition[] = []): DlMdxRegistry {
  return createDlMdxRegistry([...dlMdxOfficialComponents, ...extensions])
}
