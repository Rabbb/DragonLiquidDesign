import { createDlManagedComponent } from './component-behavior'
import type { DlComponentBehaviorContext, DlComponentMethodDefinition, DlManagedComponent, DlManagedComponentOptions } from './control.types'
import type { Component } from 'vue'
import RawDlAccordion from './components/DlAccordion.vue'
import RawDlAlertDialog from './components/DlAlertDialog.vue'
import RawDlAspectRatio from './components/DlAspectRatio.vue'
import RawDlAutocomplete from './components/DlAutocomplete.vue'
import RawDlAvatar from './components/DlAvatar.vue'
import RawDlBadge from './components/DlBadge.vue'
import RawDlButton from './components/DlButton.vue'
import RawDlCalendar from './components/DlCalendar.vue'
import RawDlCard from './components/DlCard.vue'
import RawDlCheckbox from './components/DlCheckbox.vue'
import RawDlChoicePortal from './components/DlChoicePortal.vue'
import RawDlCollapsible from './components/DlCollapsible.vue'
import RawDlColorArea from './components/DlColorArea.vue'
import RawDlColorField from './components/DlColorField.vue'
import RawDlColorPicker from './components/DlColorPicker.vue'
import RawDlColorSlider from './components/DlColorSlider.vue'
import RawDlColorSwatch from './components/DlColorSwatch.vue'
import RawDlColorSwatchPicker from './components/DlColorSwatchPicker.vue'
import RawDlCombobox from './components/DlCombobox.vue'
import RawDlContextMenu from './components/DlContextMenu.vue'
import RawDlDateField from './components/DlDateField.vue'
import RawDlDatePicker from './components/DlDatePicker.vue'
import RawDlDateRangeField from './components/DlDateRangeField.vue'
import RawDlDateRangePicker from './components/DlDateRangePicker.vue'
import RawDlDialog from './components/DlDialog.vue'
import RawDlDrawer from './components/DlDrawer.vue'
import RawDlDropdownMenu from './components/DlDropdownMenu.vue'
import RawDlEditable from './components/DlEditable.vue'
import RawDlHoverCard from './components/DlHoverCard.vue'
import RawDlIconButton from './components/DlIconButton.vue'
import RawDlInputButton from './components/DlInputButton.vue'
import RawDlInputCheckbox from './components/DlInputCheckbox.vue'
import RawDlInputColor from './components/DlInputColor.vue'
import RawDlInputDatetimeLocal from './components/DlInputDatetimeLocal.vue'
import RawDlInputEmail from './components/DlInputEmail.vue'
import RawDlInputFile from './components/DlInputFile.vue'
import RawDlInputHidden from './components/DlInputHidden.vue'
import RawDlInputImage from './components/DlInputImage.vue'
import RawDlInputNumber from './components/DlInputNumber.vue'
import RawDlInputPassword from './components/DlInputPassword.vue'
import RawDlInputRadio from './components/DlInputRadio.vue'
import RawDlInputRange from './components/DlInputRange.vue'
import RawDlInputReset from './components/DlInputReset.vue'
import RawDlInputSearch from './components/DlInputSearch.vue'
import RawDlInputSubmit from './components/DlInputSubmit.vue'
import RawDlInputTel from './components/DlInputTel.vue'
import RawDlInputText from './components/DlInputText.vue'
import RawDlInputUrl from './components/DlInputUrl.vue'
import RawDlInputWeek from './components/DlInputWeek.vue'
import RawDlLabel from './components/DlLabel.vue'
import RawDlListbox from './components/DlListbox.vue'
import RawDlMdx from './components/DlMdx.vue'
import RawDlMenubar from './components/DlMenubar.vue'
import RawDlMonthPicker from './components/DlMonthPicker.vue'
import RawDlMonthRangePicker from './components/DlMonthRangePicker.vue'
import RawDlMultiChoice from './components/DlMultiChoice.vue'
import RawDlNavigationMenu from './components/DlNavigationMenu.vue'
import RawDlNumberField from './components/DlNumberField.vue'
import RawDlPagination from './components/DlPagination.vue'
import RawDlPinInput from './components/DlPinInput.vue'
import RawDlPopover from './components/DlPopover.vue'
import RawDlProgress from './components/DlProgress.vue'
import RawDlRadioGroup from './components/DlRadioGroup.vue'
import RawDlRangeCalendar from './components/DlRangeCalendar.vue'
import RawDlRating from './components/DlRating.vue'
import RawDlScrollArea from './components/DlScrollArea.vue'
import RawDlSegmented from './components/DlSegmented.vue'
import RawDlSelect from './components/DlSelect.vue'
import RawDlSeparator from './components/DlSeparator.vue'
import RawDlSlider from './components/DlSlider.vue'
import RawDlSplitButton from './components/DlSplitButton.vue'
import RawDlSplitter from './components/DlSplitter.vue'
import RawDlStepper from './components/DlStepper.vue'
import RawDlSwitch from './components/DlSwitch.vue'
import RawDlTabs from './components/DlTabs.vue'
import RawDlTagsInput from './components/DlTagsInput.vue'
import RawDlTextarea from './components/DlTextarea.vue'
import RawDlTimeField from './components/DlTimeField.vue'
import RawDlTimePicker from './components/DlTimePicker.vue'
import RawDlTimeRangeField from './components/DlTimeRangeField.vue'
import RawDlToast from './components/DlToast.vue'
import RawDlToggle from './components/DlToggle.vue'
import RawDlToggleGroup from './components/DlToggleGroup.vue'
import RawDlToolbar from './components/DlToolbar.vue'
import RawDlTooltip from './components/DlTooltip.vue'
import RawDlTree from './components/DlTree.vue'
import RawDlVirtualList from './components/DlVirtualList.vue'
import RawDlYearPicker from './components/DlYearPicker.vue'
import RawDlYearRangePicker from './components/DlYearRangePicker.vue'

const actionEvents = ['click', 'focus', 'blur', 'keydown', 'keyup'] as const
const fieldEvents = ['focus', 'blur', 'input', 'change', 'keydown', 'keyup'] as const

const method = (name: string, description: string, signature: string, returns = 'boolean'): DlComponentMethodDefinition => ({ name, description, signature, returns })

function managed<T extends Component>(component: T, name: string, options: Omit<DlManagedComponentOptions, 'name'> = {}): DlManagedComponent<T> {
  return createDlManagedComponent(component, { name, ...options })
}

const accordionMethods = {
  expand(context: DlComponentBehaviorContext, value: string) {
    if (context.get('type') === 'multiple') {
      const current = Array.isArray(context.get('modelValue')) ? context.get('modelValue') as string[] : []
      return context.set('modelValue', [...new Set([...current, value])])
    }
    return context.set('modelValue', value)
  },
  collapse(context: DlComponentBehaviorContext, value?: string) {
    if (context.get('type') === 'multiple') {
      const current = Array.isArray(context.get('modelValue')) ? context.get('modelValue') as string[] : []
      return context.set('modelValue', value ? current.filter(item => item !== value) : [])
    }
    return context.set('modelValue', undefined)
  },
  expandAll(context: DlComponentBehaviorContext) {
    const values = ((context.get('items') as Array<{ value: string }> | undefined) ?? []).map(item => item.value)
    return context.set('modelValue', context.get('type') === 'multiple' ? values : values[0])
  },
  collapseAll(context: DlComponentBehaviorContext) {
    return context.set('modelValue', context.get('type') === 'multiple' ? [] : undefined)
  },
}

const numberMethods = {
  increment(context: DlComponentBehaviorContext, amount?: number) {
    const step = amount ?? Number(context.get('step') ?? 1)
    const max = context.get('max') as number | undefined
    const next = Number(context.get('modelValue') ?? 0) + step
    return context.set('modelValue', max === undefined ? next : Math.min(max, next))
  },
  decrement(context: DlComponentBehaviorContext, amount?: number) {
    const step = amount ?? Number(context.get('step') ?? 1)
    const min = context.get('min') as number | undefined
    const next = Number(context.get('modelValue') ?? 0) - step
    return context.set('modelValue', min === undefined ? next : Math.max(min, next))
  },
}

const paginationMethods = {
  first(context: DlComponentBehaviorContext) { return context.set('page', 1) },
  previous(context: DlComponentBehaviorContext) { return context.set('page', Math.max(1, Number(context.get('page') ?? 1) - 1)) },
  next(context: DlComponentBehaviorContext) {
    const last = Math.max(1, Math.ceil(Number(context.get('total') ?? 0) / Number(context.get('itemsPerPage') ?? 10)))
    return context.set('page', Math.min(last, Number(context.get('page') ?? 1) + 1))
  },
  last(context: DlComponentBehaviorContext) {
    return context.set('page', Math.max(1, Math.ceil(Number(context.get('total') ?? 0) / Number(context.get('itemsPerPage') ?? 10))))
  },
  goTo(context: DlComponentBehaviorContext, page: number) {
    const last = Math.max(1, Math.ceil(Number(context.get('total') ?? 0) / Number(context.get('itemsPerPage') ?? 10)))
    return context.set('page', Math.max(1, Math.min(last, page)))
  },
}

const stepperMethods = {
  previous(context: DlComponentBehaviorContext) { return context.set('modelValue', Math.max(1, Number(context.get('modelValue') ?? 1) - 1)) },
  next(context: DlComponentBehaviorContext) {
    const items = context.get('items') as Array<{ step: number; disabled?: boolean }> | undefined
    const current = Number(context.get('modelValue') ?? items?.[0]?.step ?? 1)
    const next = items?.find(item => item.step > current && !item.disabled)?.step ?? current
    return context.set('modelValue', next)
  },
  goTo(context: DlComponentBehaviorContext, step: number) { return context.set('modelValue', step) },
}

const tagsMethods = {
  add(context: DlComponentBehaviorContext, value: string) {
    const current = Array.isArray(context.get('modelValue')) ? context.get('modelValue') as string[] : []
    return value && !current.includes(value) ? context.set('modelValue', [...current, value]) : false
  },
  remove(context: DlComponentBehaviorContext, value: string) {
    const current = Array.isArray(context.get('modelValue')) ? context.get('modelValue') as string[] : []
    return context.set('modelValue', current.filter(item => item !== value))
  },
}

const multiChoiceMethods = {
  select(context: DlComponentBehaviorContext, value: string) {
    const current = Array.isArray(context.get('modelValue')) ? context.get('modelValue') as string[] : []
    return current.includes(value) ? false : context.set('modelValue', [...current, value])
  },
  deselect(context: DlComponentBehaviorContext, value: string) {
    const current = Array.isArray(context.get('modelValue')) ? context.get('modelValue') as string[] : []
    return context.set('modelValue', current.filter(item => item !== value))
  },
  clear(context: DlComponentBehaviorContext) { return context.set('modelValue', []) },
}

const virtualListMethods = {
  scrollToIndex(context: DlComponentBehaviorContext, index: number, alignment?: 'start' | 'center' | 'end' | 'auto') {
    const action = (context.inner as { scrollToIndex?: (value: number, mode?: typeof alignment) => void } | null)?.scrollToIndex
    if (!action) return false
    action(index, alignment)
    return true
  },
  scrollToTop(context: DlComponentBehaviorContext) {
    const action = (context.inner as { scrollToTop?: () => void } | null)?.scrollToTop
    if (!action) return false
    action()
    return true
  },
}

const treeMethods = {
  expand(context: DlComponentBehaviorContext, value: string) {
    const current = Array.isArray(context.get('expanded')) ? context.get('expanded') as string[] : []
    return context.set('expanded', [...new Set([...current, value])])
  },
  collapse(context: DlComponentBehaviorContext, value: string) {
    const current = Array.isArray(context.get('expanded')) ? context.get('expanded') as string[] : []
    return context.set('expanded', current.filter(item => item !== value))
  },
  collapseAll(context: DlComponentBehaviorContext) { return context.set('expanded', []) },
}

export const DlAccordion = managed(RawDlAccordion, 'DlAccordion', {
  methods: accordionMethods,
  methodDefinitions: [
    method('expand', '展开指定面板。', '(value: string)'),
    method('collapse', '折叠指定面板；省略 value 时折叠全部。', '(value?: string)'),
    method('expandAll / collapseAll', '批量展开或折叠面板。', '()'),
  ],
})
export const DlAlertDialog = managed(RawDlAlertDialog, 'DlAlertDialog')
export const DlAspectRatio = managed(RawDlAspectRatio, 'DlAspectRatio')
export const DlAutocomplete = managed(RawDlAutocomplete, 'DlAutocomplete', { domEvents: fieldEvents })
export const DlAvatar = managed(RawDlAvatar, 'DlAvatar')
export const DlBadge = managed(RawDlBadge, 'DlBadge')
export const DlButton = managed(RawDlButton, 'DlButton', {
  domEvents: actionEvents,
  methods: {
    startLoading: context => context.set('loading', true),
    stopLoading: context => context.set('loading', false),
  },
  methodDefinitions: [
    method('startLoading / stopLoading', '切换异步操作状态，并保留当前 variant。', '()'),
  ],
})
export const DlCalendar = managed(RawDlCalendar, 'DlCalendar', { domEvents: fieldEvents })
export const DlCard = managed(RawDlCard, 'DlCard', { domEvents: ['click', 'focus', 'blur'] })
export const DlCheckbox = managed(RawDlCheckbox, 'DlCheckbox', {
  domEvents: fieldEvents,
  methods: {
    check: context => context.set('modelValue', true),
    uncheck: context => context.set('modelValue', false),
  },
  methodDefinitions: [method('check / uncheck', '切换选中状态；toggle() 也可用于布尔值组件。', '()')],
})
export const DlChoicePortal = managed(RawDlChoicePortal, 'DlChoicePortal', { domEvents: fieldEvents })
export const DlCollapsible = managed(RawDlCollapsible, 'DlCollapsible')
export const DlColorArea = managed(RawDlColorArea, 'DlColorArea', { domEvents: fieldEvents })
export const DlColorField = managed(RawDlColorField, 'DlColorField', { domEvents: fieldEvents })
export const DlColorPicker = managed(RawDlColorPicker, 'DlColorPicker', { domEvents: fieldEvents })
export const DlColorSlider = managed(RawDlColorSlider, 'DlColorSlider', { domEvents: fieldEvents })
export const DlColorSwatch = managed(RawDlColorSwatch, 'DlColorSwatch')
export const DlColorSwatchPicker = managed(RawDlColorSwatchPicker, 'DlColorSwatchPicker', { domEvents: fieldEvents })
export const DlCombobox = managed(RawDlCombobox, 'DlCombobox', { domEvents: fieldEvents })
export const DlContextMenu = managed(RawDlContextMenu, 'DlContextMenu')
export const DlDateField = managed(RawDlDateField, 'DlDateField', { domEvents: fieldEvents })
export const DlDatePicker = managed(RawDlDatePicker, 'DlDatePicker', { domEvents: fieldEvents })
export const DlDateRangeField = managed(RawDlDateRangeField, 'DlDateRangeField', { domEvents: fieldEvents })
export const DlDateRangePicker = managed(RawDlDateRangePicker, 'DlDateRangePicker', { domEvents: fieldEvents })
export const DlDialog = managed(RawDlDialog, 'DlDialog')
export const DlDrawer = managed(RawDlDrawer, 'DlDrawer')
export const DlDropdownMenu = managed(RawDlDropdownMenu, 'DlDropdownMenu')
export const DlEditable = managed(RawDlEditable, 'DlEditable', {
  domEvents: fieldEvents,
  methods: {
    edit: context => { (context.element?.querySelector('[data-slot="editable-edit"]') as HTMLElement | null)?.click(); return true },
    submit: context => { (context.element?.querySelector('[data-slot="editable-submit"]') as HTMLElement | null)?.click(); return true },
    cancel: context => { (context.element?.querySelector('[data-slot="editable-cancel"]') as HTMLElement | null)?.click(); return true },
  },
  methodDefinitions: [method('edit / submit / cancel', '进入编辑、提交或取消当前内联编辑。', '()')],
})
export const DlHoverCard = managed(RawDlHoverCard, 'DlHoverCard')
export const DlIconButton = managed(RawDlIconButton, 'DlIconButton', { domEvents: actionEvents })
export const DlInputButton = managed(RawDlInputButton, 'DlInputButton', {
  domEvents: actionEvents,
  methods: { startLoading: context => context.set('loading', true), stopLoading: context => context.set('loading', false) },
  methodDefinitions: [method('startLoading / stopLoading', '控制异步按钮状态，避免操作被重复触发。', '()')],
})
export const DlInputCheckbox = managed(RawDlInputCheckbox, 'DlInputCheckbox', {
  domEvents: fieldEvents,
  methods: { check: context => context.set('modelValue', true), uncheck: context => context.set('modelValue', false) },
  methodDefinitions: [method('check / uncheck', '显式选中或取消当前复选输入。', '()')],
})
export const DlInputColor = managed(RawDlInputColor, 'DlInputColor', { domEvents: fieldEvents })
export const DlInputDatetimeLocal = managed(RawDlInputDatetimeLocal, 'DlInputDatetimeLocal', {
  domEvents: fieldEvents,
  methods: { now: context => { (context.element?.querySelector('[aria-label="选择现在"]') as HTMLElement | null)?.click(); return true } },
  methodDefinitions: [method('now', '填入当前本地日期时间。', '()')],
})
export const DlInputEmail = managed(RawDlInputEmail, 'DlInputEmail', { domEvents: fieldEvents })
export const DlInputFile = managed(RawDlInputFile, 'DlInputFile', { domEvents: fieldEvents })
export const DlInputHidden = managed(RawDlInputHidden, 'DlInputHidden', { domEvents: fieldEvents })
export const DlInputImage = managed(RawDlInputImage, 'DlInputImage', { domEvents: actionEvents })
export const DlInputNumber = managed(RawDlInputNumber, 'DlInputNumber', {
  domEvents: fieldEvents,
  methods: numberMethods,
  methodDefinitions: [method('increment / decrement', '按 step 或传入步长增减数值，并遵守 min/max。', '(amount?: number)')],
})
export const DlInputPassword = managed(RawDlInputPassword, 'DlInputPassword', {
  domEvents: fieldEvents,
  methods: { toggleVisibility: context => { (context.element?.querySelector('[aria-label="显示密码"], [aria-label="隐藏密码"]') as HTMLElement | null)?.click(); return true } },
  methodDefinitions: [method('toggleVisibility', '切换密码明文与遮蔽显示。', '()')],
})
export const DlInputRadio = managed(RawDlInputRadio, 'DlInputRadio', { domEvents: fieldEvents })
export const DlInputRange = managed(RawDlInputRange, 'DlInputRange', {
  domEvents: fieldEvents,
  methods: numberMethods,
  methodDefinitions: [method('increment / decrement', '按 step 调整数值，并遵守范围。', '(amount?: number)')],
})
export const DlInputReset = managed(RawDlInputReset, 'DlInputReset', { domEvents: actionEvents })
export const DlInputSearch = managed(RawDlInputSearch, 'DlInputSearch', {
  domEvents: fieldEvents,
  methods: { search: context => { (context.element?.querySelector('[aria-label="执行搜索"]') as HTMLElement | null)?.click(); return true } },
  methodDefinitions: [method('search', '立即提交当前检索词，不等待防抖计时。', '()')],
})
export const DlInputSubmit = managed(RawDlInputSubmit, 'DlInputSubmit', {
  domEvents: actionEvents,
  methods: { startLoading: context => context.set('loading', true), stopLoading: context => context.set('loading', false) },
  methodDefinitions: [method('startLoading / stopLoading', '控制提交中的禁用与忙碌状态。', '()')],
})
export const DlInputTel = managed(RawDlInputTel, 'DlInputTel', { domEvents: fieldEvents })
export const DlInputText = managed(RawDlInputText, 'DlInputText', { domEvents: fieldEvents })
export const DlInputUrl = managed(RawDlInputUrl, 'DlInputUrl', {
  domEvents: fieldEvents,
  methods: { open: context => { (context.element?.querySelector('[aria-label="打开网址"]') as HTMLElement | null)?.click(); return true } },
  methodDefinitions: [method('open', '在新窗口安全打开规范化后的网址。', '()')],
})
export const DlInputWeek = managed(RawDlInputWeek, 'DlInputWeek', {
  domEvents: fieldEvents,
  methods: {
    previous: context => { (context.element?.querySelector('[aria-label="上一周"]') as HTMLElement | null)?.click(); return true },
    next: context => { (context.element?.querySelector('[aria-label="下一周"]') as HTMLElement | null)?.click(); return true },
    current: context => { (context.element?.querySelector('[aria-label="选择本周"]') as HTMLElement | null)?.click(); return true },
  },
  methodDefinitions: [method('previous / next / current', '按周导航或回到本周，并遵守 min/max。', '()')],
})
export const DlLabel = managed(RawDlLabel, 'DlLabel', { domEvents: ['click'] })
export const DlListbox = managed(RawDlListbox, 'DlListbox', { domEvents: fieldEvents })
export const DlMdx = managed(RawDlMdx, 'DlMdx', {
  domEvents: fieldEvents,
  methods: {
    setMode: (context, mode: 'edit' | 'preview' | 'split') => context.set('mode', mode),
    setSource: (context, source: string) => context.set('modelValue', source),
  },
  methodDefinitions: [
    method('setMode', '切换编辑、预览或分栏模式。', "(mode: 'edit' | 'preview' | 'split')"),
    method('setSource', '替换 MarkdownX 文档源。', '(source: string)'),
  ],
})
export const DlMarkdownX = DlMdx
export const DlMenubar = managed(RawDlMenubar, 'DlMenubar')
export const DlMonthPicker = managed(RawDlMonthPicker, 'DlMonthPicker', { domEvents: fieldEvents })
export const DlMonthRangePicker = managed(RawDlMonthRangePicker, 'DlMonthRangePicker', { domEvents: fieldEvents })
export const DlMultiChoice = managed(RawDlMultiChoice, 'DlMultiChoice', {
  domEvents: fieldEvents,
  methods: multiChoiceMethods,
  methodDefinitions: [
    method('select', '添加一个尚未选中的值。', '(value: string)'),
    method('deselect', '移除一个已经选中的值。', '(value: string)'),
    method('clear', '清除全部选择。', '()'),
  ],
})
export const DlNavigationMenu = managed(RawDlNavigationMenu, 'DlNavigationMenu')
export const DlNumberField = managed(RawDlNumberField, 'DlNumberField', {
  domEvents: fieldEvents,
  methods: numberMethods,
  methodDefinitions: [method('increment / decrement', '按 step 或传入步长增减数值，并遵守 min/max。', '(amount?: number)')],
})
export const DlPagination = managed(RawDlPagination, 'DlPagination', {
  valueProperty: 'page',
  methods: paginationMethods,
  methodDefinitions: [
    method('first / previous / next / last', '在合法分页范围内导航。', '()'),
    method('goTo', '跳转到指定页并自动约束范围。', '(page: number)'),
  ],
})
export const DlPinInput = managed(RawDlPinInput, 'DlPinInput', { domEvents: fieldEvents })
export const DlPopover = managed(RawDlPopover, 'DlPopover')
export const DlProgress = managed(RawDlProgress, 'DlProgress', {
  methods: {
    complete: context => context.set('modelValue', Number(context.get('max') ?? 100)),
    reset: context => context.set('modelValue', 0),
  },
  methodDefinitions: [method('complete / reset', '将进度设为最大值或归零。', '()')],
})
export const DlRadioGroup = managed(RawDlRadioGroup, 'DlRadioGroup', { domEvents: fieldEvents })
export const DlRangeCalendar = managed(RawDlRangeCalendar, 'DlRangeCalendar', { domEvents: fieldEvents })
export const DlRating = managed(RawDlRating, 'DlRating', { domEvents: fieldEvents })
export const DlScrollArea = managed(RawDlScrollArea, 'DlScrollArea')
export const DlSegmented = managed(RawDlSegmented, 'DlSegmented', {
  domEvents: fieldEvents,
  methods: { select: (context, value: string) => context.set('modelValue', value) },
  methodDefinitions: [method('select', '激活指定分段。', '(value: string)')],
})
export const DlSelect = managed(RawDlSelect, 'DlSelect', { domEvents: fieldEvents })
export const DlSeparator = managed(RawDlSeparator, 'DlSeparator')
export const DlSlider = managed(RawDlSlider, 'DlSlider', { domEvents: fieldEvents })
export const DlSplitButton = managed(RawDlSplitButton, 'DlSplitButton', { domEvents: actionEvents })
export const DlSplitter = managed(RawDlSplitter, 'DlSplitter')
export const DlStepper = managed(RawDlStepper, 'DlStepper', {
  methods: stepperMethods,
  methodDefinitions: [
    method('previous / next', '移动到上一步或下一个可用步骤。', '()'),
    method('goTo', '跳转到指定步骤。', '(step: number)'),
  ],
})
export const DlSwitch = managed(RawDlSwitch, 'DlSwitch', {
  domEvents: fieldEvents,
  methodDefinitions: [method('toggle', '切换布尔值，也可传入目标状态。', '(force?: boolean)')],
})
export const DlTabs = managed(RawDlTabs, 'DlTabs', {
  methods: { activate: (context, value: string) => context.set('modelValue', value) },
  methodDefinitions: [method('activate', '激活指定标签页。', '(value: string)')],
})
export const DlTagsInput = managed(RawDlTagsInput, 'DlTagsInput', {
  domEvents: fieldEvents,
  methods: tagsMethods,
  methodDefinitions: [
    method('add', '添加一个不重复的标签。', '(value: string)'),
    method('remove', '删除指定标签。', '(value: string)'),
  ],
})
export const DlTextarea = managed(RawDlTextarea, 'DlTextarea', { domEvents: fieldEvents })
export const DlTimeField = managed(RawDlTimeField, 'DlTimeField', { domEvents: fieldEvents })
export const DlTimePicker = managed(RawDlTimePicker, 'DlTimePicker', { domEvents: fieldEvents })
export const DlTimeRangeField = managed(RawDlTimeRangeField, 'DlTimeRangeField', { domEvents: fieldEvents })
export const DlToast = managed(RawDlToast, 'DlToast', {
  methods: { dismiss: context => context.set('open', false) },
  methodDefinitions: [method('dismiss', '关闭当前通知。', '()')],
})
export const DlToggle = managed(RawDlToggle, 'DlToggle', {
  domEvents: actionEvents,
  methodDefinitions: [method('toggle', '切换按压值，也可传入目标状态。', '(force?: boolean)')],
})
export const DlToggleGroup = managed(RawDlToggleGroup, 'DlToggleGroup', { domEvents: actionEvents })
export const DlToolbar = managed(RawDlToolbar, 'DlToolbar', {
  domEvents: actionEvents,
  methods: { triggerAction: (context, value: string) => { context.control.dispatch('action', value); return true } },
  methodDefinitions: [method('triggerAction', '以编程方式派发工具栏 action。', '(value: string)')],
})
export const DlTooltip = managed(RawDlTooltip, 'DlTooltip')
export const DlTree = managed(RawDlTree, 'DlTree', {
  methods: treeMethods,
  methodDefinitions: [
    method('expand / collapse', '展开或折叠指定节点。', '(value: string)'),
    method('collapseAll', '折叠全部节点。', '()'),
  ],
})
export const DlVirtualList = managed(RawDlVirtualList, 'DlVirtualList', {
  methods: virtualListMethods,
  methodDefinitions: [
    method('scrollToIndex', '把指定索引滚动到视口内。', "(index: number, alignment?: 'start' | 'center' | 'end' | 'auto')"),
    method('scrollToTop', '滚动到列表起点。', '()'),
  ],
})
export const DlYearPicker = managed(RawDlYearPicker, 'DlYearPicker', { domEvents: fieldEvents })
export const DlYearRangePicker = managed(RawDlYearRangePicker, 'DlYearRangePicker', { domEvents: fieldEvents })
