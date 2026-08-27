import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import type { Component } from 'vue'
import {
  DlInputButton,
  DlInputCheckbox,
  DlInputColor,
  DlInputDate,
  DlInputDatetimeLocal,
  DlInputEmail,
  DlInputFile,
  DlInputHidden,
  DlInputImage,
  DlInputMonth,
  DlInputNumber,
  DlInputPassword,
  DlInputRadio,
  DlInputRange,
  DlInputReset,
  DlInputSearch,
  DlInputSubmit,
  DlInputTel,
  DlInputText,
  DlInputTime,
  DlInputUrl,
  DlInputWeek,
} from '../index'

const controls: Array<[string, Component, Record<string, unknown>]> = [
  ['button', DlInputButton, {}],
  ['checkbox', DlInputCheckbox, {}],
  ['color', DlInputColor, {}],
  ['date', DlInputDate, {}],
  ['datetime-local', DlInputDatetimeLocal, {}],
  ['email', DlInputEmail, {}],
  ['file', DlInputFile, {}],
  ['hidden', DlInputHidden, {}],
  ['image', DlInputImage, { src: '/submit.png', alt: 'Submit' }],
  ['month', DlInputMonth, {}],
  ['number', DlInputNumber, {}],
  ['password', DlInputPassword, {}],
  ['radio', DlInputRadio, { value: 'stable' }],
  ['range', DlInputRange, {}],
  ['reset', DlInputReset, {}],
  ['search', DlInputSearch, {}],
  ['submit', DlInputSubmit, {}],
  ['tel', DlInputTel, {}],
  ['text', DlInputText, {}],
  ['time', DlInputTime, {}],
  ['url', DlInputUrl, {}],
  ['week', DlInputWeek, {}],
]

describe('independent input controls', () => {
  it.each(controls)('hard-codes input[type="%s"] and ignores a conflicting type attribute', (type, component, props) => {
    const wrapper = mount(component, { props, attrs: { type: 'invalid-override' } })
    expect(wrapper.get('input').attributes('type')).toBe(type)
  })

  it('keeps text input v-model behavior without exposing a type prop', async () => {
    const update = vi.fn()
    const wrapper = mount(DlInputText, { props: { modelValue: '', 'onUpdate:modelValue': update } })
    await wrapper.get('input').setValue('Dragon Liquid')
    expect(update).toHaveBeenLastCalledWith('Dragon Liquid')
    expect(wrapper.props()).not.toHaveProperty('type')
  })

  it('keeps number values numeric', async () => {
    const update = vi.fn()
    const wrapper = mount(DlInputNumber, { props: { modelValue: null, 'onUpdate:modelValue': update } })
    await wrapper.get('input').setValue('42')
    expect(update).toHaveBeenLastCalledWith(42)
  })
})
