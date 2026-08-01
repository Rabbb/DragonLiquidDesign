import type { Component } from 'vue'
import DlAccordion from './DlAccordion.vue'
import DlAlertDialog from './DlAlertDialog.vue'
import DlAspectRatio from './DlAspectRatio.vue'
import DlAutocomplete from './DlAutocomplete.vue'
import DlAvatar from './DlAvatar.vue'
import DlBadge from './DlBadge.vue'
import DlButton from './DlButton.vue'
import DlCalendar from './DlCalendar.vue'
import DlCard from './DlCard.vue'
import DlCheckbox from './DlCheckbox.vue'
import DlCollapsible from './DlCollapsible.vue'
import DlColorArea from './DlColorArea.vue'
import DlColorField from './DlColorField.vue'
import DlColorSlider from './DlColorSlider.vue'
import DlColorSwatch from './DlColorSwatch.vue'
import DlColorSwatchPicker from './DlColorSwatchPicker.vue'
import DlCombobox from './DlCombobox.vue'
import DlContextMenu from './DlContextMenu.vue'
import DlDateField from './DlDateField.vue'
import DlDatePicker from './DlDatePicker.vue'
import DlDateRangeField from './DlDateRangeField.vue'
import DlDateRangePicker from './DlDateRangePicker.vue'
import DlDialog from './DlDialog.vue'
import DlDrawer from './DlDrawer.vue'
import DlDropdownMenu from './DlDropdownMenu.vue'
import DlEditable from './DlEditable.vue'
import DlHoverCard from './DlHoverCard.vue'
import DlIconButton from './DlIconButton.vue'
import DlInput from './DlInput.vue'
import DlLabel from './DlLabel.vue'
import DlListbox from './DlListbox.vue'
import DlMdx from './DlMdx.vue'
import DlMenubar from './DlMenubar.vue'
import DlMonthPicker from './DlMonthPicker.vue'
import DlMonthRangePicker from './DlMonthRangePicker.vue'
import DlNavigationMenu from './DlNavigationMenu.vue'
import DlNumberField from './DlNumberField.vue'
import DlPagination from './DlPagination.vue'
import DlPinInput from './DlPinInput.vue'
import DlPopover from './DlPopover.vue'
import DlProgress from './DlProgress.vue'
import DlRadioGroup from './DlRadioGroup.vue'
import DlRangeCalendar from './DlRangeCalendar.vue'
import DlRating from './DlRating.vue'
import DlScrollArea from './DlScrollArea.vue'
import DlSelect from './DlSelect.vue'
import DlSeparator from './DlSeparator.vue'
import DlSlider from './DlSlider.vue'
import DlSplitter from './DlSplitter.vue'
import DlStepper from './DlStepper.vue'
import DlSwitch from './DlSwitch.vue'
import DlTabs from './DlTabs.vue'
import DlTagsInput from './DlTagsInput.vue'
import DlTextarea from './DlTextarea.vue'
import DlTimeField from './DlTimeField.vue'
import DlTimeRangeField from './DlTimeRangeField.vue'
import DlToast from './DlToast.vue'
import DlToggle from './DlToggle.vue'
import DlToggleGroup from './DlToggleGroup.vue'
import DlToolbar from './DlToolbar.vue'
import DlTooltip from './DlTooltip.vue'
import DlTree from './DlTree.vue'
import DlYearPicker from './DlYearPicker.vue'
import DlYearRangePicker from './DlYearRangePicker.vue'
import {
  createDlMdxRegistry,
  defineDlMdxComponent,
  type DlMdxComponentCategory,
  type DlMdxComponentDefinition,
  type DlMdxComponentMaturity,
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
  official('Button', DlButton, 'foundation', 'custom', { contentProp: 'text', defaultContent: '执行操作', description: '主要与次要操作。' }),
  official('Badge', DlBadge, 'foundation', 'custom', { contentProp: 'text', defaultContent: 'DRAGON', description: '状态与标签。' }),
  official('Card', DlCard, 'foundation', 'custom', { defaultProps: { padding: 'md' }, defaultContent: 'Dragon Liquid 内容卡片', description: '内容分组容器。' }),
  official('IconButton', DlIconButton, 'foundation', 'custom', { defaultProps: { label: '快捷操作' }, defaultContent: '✦', description: '紧凑图标操作。' }),
  official('Input', DlInput, 'foundation', 'custom', { defaultProps: { modelValue: 'Dragon Liquid' }, description: '单行文本输入。' }),
  official('Textarea', DlTextarea, 'foundation', 'custom', { defaultProps: { modelValue: '在这里记录内容。' }, description: '多行文本输入。' }),

  official('Autocomplete', DlAutocomplete, 'form', 'alpha', { defaultProps: { suggestions: ['Frieren', 'Fern', 'Stark'], placeholder: '搜索角色' } }),
  official('Checkbox', DlCheckbox, 'form', 'stable', { defaultProps: { label: '追踪更新', modelValue: true } }),
  official('Combobox', DlCombobox, 'form', 'stable', { defaultProps: { options: choices, placeholder: '选择类型' } }),
  official('Editable', DlEditable, 'form', 'stable', { defaultProps: { modelValue: '可编辑标题' } }),
  official('Label', DlLabel, 'form', 'stable', { defaultContent: '作品标题' }),
  official('Listbox', DlListbox, 'form', 'stable', { defaultProps: { options: choices } }),
  official('NumberField', DlNumberField, 'form', 'stable', { defaultProps: { modelValue: 12, min: 0, max: 24 } }),
  official('PinInput', DlPinInput, 'form', 'stable', { defaultProps: { length: 6 } }),
  official('RadioGroup', DlRadioGroup, 'form', 'stable', { defaultProps: { options: choices, modelValue: 'anime' } }),
  official('Rating', DlRating, 'form', 'alpha', { defaultProps: { modelValue: 4, max: 5 } }),
  official('Select', DlSelect, 'form', 'stable', { defaultProps: { options: choices, modelValue: 'anime' } }),
  official('Slider', DlSlider, 'form', 'stable', { defaultProps: { modelValue: [68], min: 0, max: 100 } }),
  official('Switch', DlSwitch, 'form', 'stable', { defaultProps: { label: '自动同步', modelValue: true } }),
  official('TagsInput', DlTagsInput, 'form', 'stable', { defaultProps: { modelValue: ['奇幻', '冒险'] } }),
  official('Toggle', DlToggle, 'form', 'stable', { defaultContent: '收藏' }),
  official('ToggleGroup', DlToggleGroup, 'form', 'stable', { defaultProps: { items: choices, modelValue: 'anime' } }),

  official('ColorArea', DlColorArea, 'color', 'alpha', { defaultProps: { color: '#ffb11b' } }),
  official('ColorField', DlColorField, 'color', 'alpha', { defaultProps: { modelValue: '#ffb11b' } }),
  official('ColorSlider', DlColorSlider, 'color', 'alpha', { defaultProps: { channel: 'hue', color: '#ffb11b' } }),
  official('ColorSwatch', DlColorSwatch, 'color', 'alpha', { defaultProps: { color: '#ffb11b' } }),
  official('ColorSwatchPicker', DlColorSwatchPicker, 'color', 'alpha', { defaultProps: { colors: ['#ffb11b', '#32cd32', '#87ceeb'] } }),

  official('Calendar', DlCalendar, 'dates', 'alpha'),
  official('DateField', DlDateField, 'dates', 'alpha'),
  official('DatePicker', DlDatePicker, 'dates', 'alpha'),
  official('DateRangeField', DlDateRangeField, 'dates', 'alpha'),
  official('DateRangePicker', DlDateRangePicker, 'dates', 'alpha'),
  official('RangeCalendar', DlRangeCalendar, 'dates', 'alpha'),
  official('TimeField', DlTimeField, 'dates', 'alpha'),
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
  official('Dialog', DlDialog, 'general', 'stable', { defaultProps: { title: '编辑条目', description: '修改作品的基础资料。' }, defaultContent: '对话框正文由安全注册定义提供。', triggerLabel: '打开对话框' }),
  official('Drawer', DlDrawer, 'general', 'alpha', { defaultProps: { title: '筛选条件', description: '调整收藏库显示范围。' }, defaultContent: '抽屉正文由安全注册定义提供。', triggerLabel: '打开抽屉' }),
  official('DropdownMenu', DlDropdownMenu, 'general', 'stable', { defaultProps: { items: menuItems, label: '条目操作' }, triggerLabel: '打开菜单' }),
  official('HoverCard', DlHoverCard, 'general', 'stable', { defaultContent: '悬浮卡片中的作品摘要。', triggerLabel: '悬停查看资料' }),
  official('Mdx', DlMdx, 'general', 'alpha', { aliases: ['MarkdownX'], defaultProps: { modelValue: '## 嵌套 MarkdownX\n\n官方注册表也包含文档组件。', mode: 'preview', showToolbar: false, minHeight: '12rem' } }),
  official('Menubar', DlMenubar, 'general', 'stable', { defaultProps: { menus: [{ value: 'file', label: '文件', items: menuItems }] } }),
  official('NavigationMenu', DlNavigationMenu, 'general', 'stable', { defaultProps: { items: [{ value: 'home', label: '首页', href: '#/' }, { value: 'archive', label: '档案', href: '#/components/mdx/basic' }] } }),
  official('Pagination', DlPagination, 'general', 'stable', { defaultProps: { total: 120, itemsPerPage: 12, page: 2 } }),
  official('Popover', DlPopover, 'general', 'stable', { defaultProps: { title: '快捷资料' }, defaultContent: 'Popover 中的安全扩展内容。', triggerLabel: '打开气泡卡片' }),
  official('Progress', DlProgress, 'general', 'stable', { defaultProps: { modelValue: 68, showValue: true, label: '整理进度' } }),
  official('ScrollArea', DlScrollArea, 'general', 'stable', { defaultProps: { maxHeight: '10rem' }, defaultContent: '可滚动内容区域 · Dragon Liquid · MarkdownX Registry' }),
  official('Separator', DlSeparator, 'general', 'stable'),
  official('Splitter', DlSplitter, 'general', 'stable', { defaultProps: { panels: [{ id: 'source', defaultSize: 45 }, { id: 'preview', defaultSize: 55 }] } }),
  official('Stepper', DlStepper, 'general', 'stable', { defaultProps: { items: [{ step: 1, title: '草稿', completed: true }, { step: 2, title: '校对' }], modelValue: 2 } }),
  official('Tabs', DlTabs, 'general', 'stable', { defaultProps: { items: [{ value: 'intro', label: '简介', description: '作品简介内容' }, { value: 'episodes', label: '剧集', description: '剧集列表内容' }], modelValue: 'intro' } }),
  official('Toast', DlToast, 'general', 'stable', { defaultProps: { title: '保存完成', description: 'MarkdownX 注册定义已经生效。', open: false } }),
  official('Toolbar', DlToolbar, 'general', 'stable', { defaultProps: { items: menuItems } }),
  official('Tooltip', DlTooltip, 'general', 'stable', { defaultProps: { text: '由官方注册表渲染', tone: 'accent' }, defaultContent: '悬停查看提示' }),
  official('Tree', DlTree, 'general', 'alpha', { defaultProps: { items: [{ id: 'season', label: '季度', children: [{ id: 'spring', label: '春季番' }] }] } }),
]

export function createDlMdxOfficialRegistry(extensions: DlMdxComponentDefinition[] = []): DlMdxRegistry {
  return createDlMdxRegistry([...dlMdxOfficialComponents, ...extensions])
}
