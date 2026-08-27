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

  it('adds text editing conveniences without changing the fixed native type', async () => {
    const update = vi.fn()
    const commit = vi.fn()
    const wrapper = mount(DlInputText, {
      props: {
        modelValue: '  Dragon  ',
        trimOnBlur: true,
        'onUpdate:modelValue': update,
        onCommit: commit,
      },
      attrs: { maxlength: 20 },
    })

    expect(wrapper.get('.dl-input-field__count').text()).toBe('10/20')
    await wrapper.get('input').trigger('blur')
    expect(update).toHaveBeenLastCalledWith('Dragon')
    expect(commit).toHaveBeenLastCalledWith('Dragon')
    await wrapper.get('button[aria-label="清空文本"]').trigger('click')
    expect(update).toHaveBeenLastCalledWith('')
  })

  it('submits and clears search text with dedicated actions', async () => {
    const search = vi.fn()
    const update = vi.fn()
    const wrapper = mount(DlInputSearch, {
      props: { modelValue: '  liquid  ', onSearch: search, 'onUpdate:modelValue': update },
    })

    await wrapper.get('input').trigger('keydown', { key: 'Enter' })
    expect(search).toHaveBeenLastCalledWith('liquid')
    await wrapper.get('button[aria-label="清空搜索"]').trigger('click')
    expect(update).toHaveBeenLastCalledWith('')
  })

  it('steps and clamps numeric values through the DL controls', async () => {
    const update = vi.fn()
    const wrapper = mount(DlInputNumber, {
      props: { modelValue: 9, min: 0, max: 10, step: 2, 'onUpdate:modelValue': update },
    })

    await wrapper.get('button[aria-label="增大"]').trigger('click')
    expect(update).toHaveBeenLastCalledWith(10)
    await wrapper.get('button[aria-label="减小"]').trigger('click')
    expect(update).toHaveBeenLastCalledWith(7)
  })

  it('reveals passwords and reports a visual strength level', async () => {
    const wrapper = mount(DlInputPassword, { props: { modelValue: 'Dragon#2026' } })
    const editor = wrapper.get<HTMLInputElement>('.dl-input-field__control')
    expect(editor.attributes('type')).toBe('password')
    expect(wrapper.findAll('.dl-input-password-strength i[data-filled]')).toHaveLength(3)
    await wrapper.get('button[aria-label="显示密码"]').trigger('click')
    expect(editor.attributes('type')).toBe('text')
  })

  it('normalizes incomplete URLs when editing commits', async () => {
    const update = vi.fn()
    const wrapper = mount(DlInputUrl, {
      props: { modelValue: 'todo.moe', 'onUpdate:modelValue': update },
    })
    await wrapper.get('input').trigger('blur')
    expect(update).toHaveBeenLastCalledWith('https://todo.moe')
  })
})
