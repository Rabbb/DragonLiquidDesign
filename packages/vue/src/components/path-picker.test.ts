import { describe, expect, it } from 'vitest'
import {
  createDlPathValue,
  reduceDlPathPicker,
  validateDlPathValue,
  visibleDlPathFields,
} from './path-picker'
import type { DlPathField, DlPathNode, DlPathPickerState } from './path-picker.types'

const classNodes: DlPathNode[] = [
  {
    value: 'class-1', label: '一班', selectable: false, children: [
      { value: 'student-1', label: '张三' },
      { value: 'student-2', label: '李四' },
    ],
  },
  {
    value: 'class-2', label: '二班', selectable: false, children: [
      { value: 'student-3', label: '王五' },
    ],
  },
]

describe('DlPathPicker functional core', () => {
  it('selects one class/student path without mutating the previous state', () => {
    const initial: DlPathPickerState = { activePath: ['class-1'], selections: [] }
    const selection = createDlPathValue([classNodes[0], classNodes[0].children![0]])
    const next = reduceDlPathPicker(initial, { type: 'selection.toggle', selection })

    expect(initial.selections).toEqual([])
    expect(next.selections[0]).toEqual({
      value: 'student-1',
      path: ['class-1', 'student-1'],
      labels: ['一班', '张三'],
      parameters: {},
    })
  })

  it('keeps selections from different branches in multiple mode', () => {
    const first = createDlPathValue([classNodes[0], classNodes[0].children![0]])
    const second = createDlPathValue([classNodes[1], classNodes[1].children![0]])
    const one = reduceDlPathPicker({ activePath: [], selections: [] }, { type: 'selection.toggle', selection: first }, { multiple: true })
    const two = reduceDlPathPicker(one, { type: 'selection.toggle', selection: second }, { multiple: true })

    expect(two.selections.map(item => item.labels.join('/'))).toEqual(['一班/张三', '二班/王五'])
  })

  it('replaces the previous result in single mode and respects the multiple limit', () => {
    const first = createDlPathValue([classNodes[0], classNodes[0].children![0]])
    const second = createDlPathValue([classNodes[1], classNodes[1].children![0]])
    const replaced = reduceDlPathPicker(
      { activePath: [], selections: [first] },
      { type: 'selection.toggle', selection: second },
    )
    const limited = reduceDlPathPicker(
      { activePath: [], selections: [first] },
      { type: 'selection.toggle', selection: second },
      { multiple: true, maxSelections: 1 },
    )

    expect(replaced.selections).toEqual([second])
    expect(limited.selections).toEqual([first])
  })

  it('updates a parameter and clears every dependent value immutably', () => {
    const state: DlPathPickerState = {
      activePath: ['computer', 'laptop'],
      selections: [{
        value: 'laptop',
        path: ['computer', 'laptop'],
        labels: ['电脑', '笔记本'],
        parameters: { brand: 'lenovo', model: 'thinkbook', sku: 'tb-01' },
      }],
    }
    const next = reduceDlPathPicker(state, {
      type: 'parameter.change',
      path: ['computer', 'laptop'],
      key: 'brand',
      value: 'apple',
      resetKeys: ['model', 'sku'],
    })

    expect(state.selections[0].parameters).toEqual({ brand: 'lenovo', model: 'thinkbook', sku: 'tb-01' })
    expect(next.selections[0].parameters).toEqual({ brand: 'apple' })
  })

  it('filters conditional fields and validates only visible required parameters', () => {
    const fields: DlPathField[] = [
      { key: 'brand', label: '品牌', type: 'select', required: true },
      { key: 'appleCare', label: 'AppleCare', type: 'switch', required: true, visible: values => values.brand === 'apple' },
    ]
    const value = {
      value: 'laptop', path: ['computer', 'laptop'], labels: ['电脑', '笔记本'], parameters: { brand: 'lenovo' },
    }

    expect(visibleDlPathFields(fields, value.parameters).map(field => field.key)).toEqual(['brand'])
    expect(validateDlPathValue(value, fields)).toEqual([])
    expect(validateDlPathValue({ ...value, parameters: { brand: 'apple' } }, fields)).toEqual([
      { key: 'appleCare', message: '请填写AppleCare' },
    ])
  })
})
