import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import DlColorField from './DlColorField.vue'
import DlColorSlider from './DlColorSlider.vue'
import DlColorSwatch from './DlColorSwatch.vue'
import DlColorSwatchPicker from './DlColorSwatchPicker.vue'
import { formatColorValue, normalizeColorInput, readableColorInk, resolveColorSwatches } from './color-controls'

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver = ResizeObserverMock

describe('Dragon Liquid color controls', () => {
  it('normalizes pasted hex and converts between supported formats', () => {
    expect(normalizeColorInput('FF8C00')).toBe('#FF8C00')
    expect(normalizeColorInput('abcd')).toBe('#abcd')
    expect(normalizeColorInput('abcde')).toBe('abcde')
    expect(formatColorValue('FF8C00', 'rgb')).toBe('rgb(255, 140, 0)')
    expect(formatColorValue('rgba(255, 140, 0, 0.5)', 'hex')).toBe('#ff8c0080')
    expect(readableColorInk('#ffffff')).toBe('#111827')
    expect(readableColorInk('#111111')).toBe('#ffffff')
  })

  it('commits pasted color text in the selected format and rejects invalid text', async () => {
    const wrapper = mount(DlColorField, { props: { modelValue: '#ff8c00', format: 'rgb', label: '主题色' } })
    const input = wrapper.get('input[type="text"]')

    await input.setValue('hsl(210, 100%, 50%)')
    await input.trigger('blur')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['rgb(0, 127, 255)'])

    await input.setValue('not-a-color')
    await input.trigger('blur')
    expect(wrapper.emitted('invalid')?.at(-1)).toEqual(['not-a-color'])
    expect(input.attributes('aria-invalid')).toBe('true')
  })

  it('supports keyboard stepping when a field edits one color channel', async () => {
    const wrapper = mount(DlColorField, { props: { modelValue: '#ff0000', channel: 'hue', format: 'hsl' } })
    const input = wrapper.get('input[type="text"]')
    expect((input.element as HTMLInputElement).value).toBe('0')
    await input.trigger('keydown', { key: 'ArrowUp' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['hsl(1, 100%, 50%)'])
  })

  it('renders readable swatch metadata and resolves rich picker options', () => {
    const swatch = mount(DlColorSwatch, {
      props: { color: '#7aa2f7', label: 'Tokyo Blue', description: 'Primary', labelPosition: 'right' },
    })
    expect(swatch.text()).toContain('Tokyo Blue')
    expect(swatch.text()).toContain('Primary')
    expect(swatch.get('.dl-color-swatch__fill').attributes('style')).toContain('background-color: rgb(122, 162, 247)')
    expect(swatch.get('[role="img"]').attributes('aria-label')).toBe('Tokyo Blue')

    expect(resolveColorSwatches(['#ffffff', { value: '#000000', label: 'Ink', disabled: true }])).toEqual([
      { value: '#ffffff', label: '#FFFFFF' },
      { value: '#000000', label: 'Ink', disabled: true },
    ])
  })

  it('shows values and labels in sliders and labeled swatch grids', () => {
    const slider = mount(DlColorSlider, {
      props: { modelValue: '#ff000080', channel: 'alpha', label: '透明度', showValue: true },
    })
    expect(slider.text()).toContain('透明度')
    expect(slider.text()).toContain('50.2%')

    const picker = mount(DlColorSwatchPicker, {
      props: {
        colors: [{ value: '#7aa2f7', label: 'Tokyo Blue', description: '推荐' }, '#f7768e'],
        modelValue: '#7aa2f7',
        showLabels: true,
      },
    })
    expect(picker.text()).toContain('Tokyo Blue')
    expect(picker.text()).toContain('推荐')
    expect(picker.findAll('[role="option"]')).toHaveLength(2)
    expect(picker.get('.dl-color-swatch-picker__fill').attributes('style')).toContain('background-color: rgb(122, 162, 247)')
  })
})
