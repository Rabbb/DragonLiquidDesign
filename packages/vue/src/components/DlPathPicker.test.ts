import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import DlPathPicker from './DlPathPicker.vue'
import type { DlPathField, DlPathNode, DlPathPickerAdapter } from './path-picker.types'

const classes: DlPathNode[] = [
  { value: 'class-a', label: '一班', selectable: false, children: [{ value: 'student-a', label: '张三' }] },
  { value: 'class-b', label: '二班', selectable: false, children: [{ value: 'student-b', label: '李四' }] },
]

describe('DlPathPicker', () => {
  it('opens a class and selects a student with a complete path value', async () => {
    const wrapper = mount(DlPathPicker, { props: { items: classes, levelLabels: ['班级', '学生'] } })

    await wrapper.get('[data-path-node]').trigger('click')
    expect(wrapper.text()).toContain('学生')
    await wrapper.get('button[aria-label="选择张三"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toEqual([{
      value: 'student-a',
      path: ['class-a', 'student-a'],
      labels: ['一班', '张三'],
      parameters: {},
    }])
    expect(wrapper.text()).toContain('一班 / 张三')
  })

  it('continues selecting students across branches in multiple mode', async () => {
    const wrapper = mount(DlPathPicker, { props: { items: classes, multiple: true } })

    await wrapper.get('[data-path-node]').trigger('click')
    await wrapper.get('button[aria-label="选择张三"]').trigger('click')
    await wrapper.findAll('[data-path-node]')[0].trigger('click')
    await wrapper.findAll('[data-path-node]')[1].trigger('click')
    await wrapper.get('button[aria-label="选择李四"]').trigger('click')

    const value = wrapper.emitted('update:modelValue')?.at(-1)?.[0] as Array<{ value: string }>
    expect(value.map(item => item.value)).toEqual(['student-a', 'student-b'])
    expect(wrapper.findAll('.dl-path-picker__chips > span')).toHaveLength(2)
  })

  it('loads country children asynchronously and exposes the next region column', async () => {
    const loadChildren = vi.fn(async () => [
      { value: 'zhejiang', label: '浙江省', selectable: false, children: [{ value: 'hangzhou', label: '杭州市' }] },
    ])
    const adapter: DlPathPickerAdapter = { loadChildren }
    const items: DlPathNode[] = [{ value: 'china', label: '中国', selectable: false, hasChildren: true }]
    const wrapper = mount(DlPathPicker, { props: { items, adapter, levelLabels: ['国家', '省份', '城市'] } })

    await wrapper.get('[data-path-node]').trigger('click')
    await flushPromises()

    expect(loadChildren).toHaveBeenCalledOnce()
    expect(wrapper.text()).toContain('浙江省')
    await wrapper.findAll('[data-path-node]')[1].trigger('click')
    expect(wrapper.text()).toContain('杭州市')
  })

  it('loads product fields and dependent model options through one adapter', async () => {
    const fields: DlPathField[] = [
      {
        key: 'brand', label: '品牌', type: 'select', required: true, defaultValue: 'lenovo',
        options: [{ value: 'lenovo', label: '联想' }, { value: 'apple', label: 'Apple' }],
      },
      { key: 'model', label: '型号', type: 'select', required: true, source: 'laptop-models', dependsOn: ['brand'] },
      { key: 'memory', label: '内存', type: 'multi-select', options: [{ value: '16', label: '16GB' }, { value: '32', label: '32GB' }] },
    ]
    const loadFields = vi.fn(async () => fields)
    const loadOptions = vi.fn(async () => [{ value: 'thinkbook', label: 'ThinkBook 14+' }])
    const adapter: DlPathPickerAdapter = { loadFields, loadOptions }
    const items: DlPathNode[] = [{
      value: 'goods', label: '商品', selectable: false, children: [
        { value: 'computer', label: '电脑', selectable: false, children: [
          { value: 'laptop', label: '笔记本', fieldSource: 'laptop-specs' },
        ] },
      ],
    }]
    const wrapper = mount(DlPathPicker, { props: { items, adapter, levelLabels: ['大类', '分类', '商品类型'] } })

    await wrapper.get('[data-path-node]').trigger('click')
    await wrapper.findAll('[data-path-node]')[1].trigger('click')
    await wrapper.get('button[aria-label="选择笔记本"]').trigger('click')
    await flushPromises()

    expect(loadFields).toHaveBeenCalledOnce()
    expect(loadOptions).toHaveBeenCalledOnce()
    expect(loadOptions).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ parameters: expect.objectContaining({ brand: 'lenovo' }) }))
    expect(wrapper.text()).toContain('品牌')
    expect(wrapper.text()).toContain('型号')
    expect(wrapper.text()).toContain('内存')
    expect((wrapper.vm as unknown as { validate: () => boolean }).validate()).toBe(false)
  })

  it('collapses an active branch freely and keeps selected values in the tray', async () => {
    const wrapper = mount(DlPathPicker, { props: { items: classes, multiple: true } })
    await wrapper.get('[data-path-node]').trigger('click')
    await wrapper.get('button[aria-label="选择张三"]').trigger('click')
    await wrapper.findAll('[data-path-node]')[0].trigger('click')

    expect(wrapper.findAll('.dl-path-picker__column')).toHaveLength(1)
    expect(wrapper.text()).toContain('一班 / 张三')
  })
})
