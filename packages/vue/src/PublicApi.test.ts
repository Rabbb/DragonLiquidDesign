import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import * as library from './index'
import DlLabel from './components/DlLabel.vue'
import DlNumberField from './components/DlNumberField.vue'

const componentNames = [
  'DlAccordion', 'DlAlertDialog', 'DlAspectRatio', 'DlAutocomplete', 'DlAvatar', 'DlBadge', 'DlButton', 'DlCalendar', 'DlCard', 'DlCheckbox',
  'DlChoicePortal', 'DlCollapsible', 'DlColorArea', 'DlColorField', 'DlColorSlider', 'DlColorSwatch', 'DlColorSwatchPicker', 'DlCombobox', 'DlContextMenu', 'DlDateField', 'DlDatePicker', 'DlDateRangeField', 'DlDateRangePicker', 'DlDialog', 'DlDrawer', 'DlDropdownMenu', 'DlEditable', 'DlHoverCard',
  'DlIconButton',
  'DlInputButton', 'DlInputCheckbox', 'DlInputColor', 'DlInputDatetimeLocal', 'DlInputEmail', 'DlInputFile', 'DlInputHidden', 'DlInputImage', 'DlInputNumber', 'DlInputPassword', 'DlInputRadio', 'DlInputRange', 'DlInputReset', 'DlInputSearch', 'DlInputSubmit', 'DlInputTel', 'DlInputText', 'DlInputUrl', 'DlInputWeek',
  'DlLabel', 'DlListbox', 'DlMdx', 'DlMenubar', 'DlMultiChoice', 'DlNavigationMenu', 'DlNumberField',
  'DlMonthPicker', 'DlMonthRangePicker', 'DlPagination', 'DlPinInput', 'DlPopover', 'DlProgress', 'DlRadioGroup', 'DlRangeCalendar', 'DlRating', 'DlScrollArea', 'DlSegmented', 'DlSelect',
  'DlSeparator', 'DlSlider', 'DlSplitButton', 'DlSplitter', 'DlStepper', 'DlSwitch', 'DlTabs', 'DlTagsInput', 'DlTextarea', 'DlTimeField', 'DlTimePicker', 'DlTimeRangeField',
  'DlToast', 'DlToggle', 'DlToggleGroup', 'DlToolbar', 'DlTooltip', 'DlTree', 'DlVirtualList', 'DlYearPicker', 'DlYearRangePicker',
]

describe('public component API', () => {
  it('exports every stable catalog component', () => {
    expect(componentNames).toHaveLength(88)
    for (const name of componentNames) expect(library).toHaveProperty(name)
  })

  it('keeps the TodoMoe MarkdownX compatibility alias', () => {
    expect(library.DlMarkdownX).toBe(library.DlMdx)
    expect(library).toHaveProperty('parseDlMdx')
    expect(library).toHaveProperty('createDlMdxRegistry')
    expect(library).toHaveProperty('createDlMdxOfficialRegistry')
    expect(library).toHaveProperty('createDlMdxSecurityPolicy')
  })

  it('associates labels with native fields', () => {
    const wrapper = mount(DlLabel, { props: { for: 'title', required: true }, slots: { default: '标题' } })
    expect(wrapper.get('label').attributes('for')).toBe('title')
    expect(wrapper.text()).toContain('*')
  })

  it('renders and updates an accessible number field value', async () => {
    const wrapper = mount(DlNumberField, { props: { modelValue: 12, min: 1, max: 24 } })
    expect(wrapper.get('[role="group"]').attributes('data-slot')).toBe('number-field')
    expect(wrapper.get('input').attributes('role')).toBe('spinbutton')
    expect((wrapper.get('input').element as HTMLInputElement).value).toBe('12')
    await wrapper.get('input').trigger('keydown', { key: 'ArrowUp' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([13])
  })

  it('exports the application focus navigator separately from catalog controls', () => {
    expect(library).toHaveProperty('DlFocusNavigator')
    expect(library).toHaveProperty('discoverDlFocusNavigatorZones')
  })

  it('exports the shared color value helpers', () => {
    expect(library.normalizeColorInput('7aa2f7')).toBe('#7aa2f7')
    expect(library.formatColorValue('#7aa2f7', 'rgb')).toBe('rgb(122, 162, 247)')
    expect(library.resolveColorSwatches(['#7aa2f7'])[0]?.value).toBe('#7aa2f7')
  })
})
