import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import * as library from './index'
import DlLabel from './components/DlLabel.vue'
import DlNumberField from './components/DlNumberField.vue'

const componentNames = [
  'DlAccordion', 'DlAlertDialog', 'DlAspectRatio', 'DlAutocomplete', 'DlAvatar', 'DlBadge', 'DlButton', 'DlCalendar', 'DlCard', 'DlCheckbox',
  'DlCollapsible', 'DlColorArea', 'DlColorField', 'DlColorSlider', 'DlColorSwatch', 'DlColorSwatchPicker', 'DlCombobox', 'DlContextMenu', 'DlDateField', 'DlDatePicker', 'DlDateRangeField', 'DlDateRangePicker', 'DlDialog', 'DlDrawer', 'DlDropdownMenu', 'DlEditable', 'DlHoverCard',
  'DlIconButton', 'DlInput', 'DlLabel', 'DlListbox', 'DlMdx', 'DlMenubar', 'DlNavigationMenu', 'DlNumberField',
  'DlMonthPicker', 'DlMonthRangePicker', 'DlPagination', 'DlPinInput', 'DlPopover', 'DlProgress', 'DlRadioGroup', 'DlRangeCalendar', 'DlRating', 'DlScrollArea', 'DlSelect',
  'DlSeparator', 'DlSlider', 'DlSplitter', 'DlStepper', 'DlSwitch', 'DlTabs', 'DlTagsInput', 'DlTextarea', 'DlTimeField', 'DlTimeRangeField',
  'DlToast', 'DlToggle', 'DlToggleGroup', 'DlToolbar', 'DlTooltip', 'DlTree', 'DlYearPicker', 'DlYearRangePicker',
]

describe('public component API', () => {
  it('exports every stable catalog component', () => {
    expect(componentNames).toHaveLength(64)
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

  it('renders an accessible number field', () => {
    const wrapper = mount(DlNumberField, { props: { modelValue: 12, min: 1, max: 24 } })
    expect(wrapper.get('[role="group"]').attributes('data-slot')).toBe('number-field')
    expect(wrapper.get('input').attributes('role')).toBe('spinbutton')
  })
})
