import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import DlDataTable from './DlDataTable.vue'

describe('DlDataTable', () => {
  const rows = [
    { id: 1, title: 'First', status: 'open' },
    { id: 2, title: 'Second', status: 'done' },
  ]
  const columns = [
    { role: 'check' as const, width: 44 },
    { property: 'title', label: 'Title', minWidth: 180 },
    { property: 'status', label: 'Status', width: 100 },
  ]

  it('maps the compact DL surface to the table engine', async () => {
    const wrapper = mount(DlDataTable, {
      props: { rows, columns, density: 'dense', gridLines: 'all', zebra: true, rowIdentity: 'id' },
    })
    await flushPromises()

    const table = wrapper.findComponent({ name: 'VxeTable' })
    expect(table.props('size')).toBe('mini')
    expect(table.props('border')).toBe('full')
    expect(table.props('stripe')).toBe(true)
    expect(table.props('rowConfig')).toEqual(expect.objectContaining({ keyField: 'id', useKey: true, isHover: true }))
  })

  it('emits DL row keys and property names instead of engine row references', async () => {
    const wrapper = mount(DlDataTable, { props: { rows, columns } })
    await flushPromises()
    const table = wrapper.findComponent({ name: 'VxeTable' })
    const event = new MouseEvent('click')

    table.vm.$emit('cell-click', { row: rows[1], column: { field: 'status' }, $event: event })

    expect(wrapper.emitted('cellActivate')?.[0]?.[0]).toEqual({ row: rows[1], rowKey: 2, property: 'status', event })
  })

  it('owns every stripe interaction color through DL theme tokens', () => {
    const source = readFileSync(resolve(process.cwd(), 'src/components/DlDataTable.vue'), 'utf8')
    expect(source).toContain('--vxe-ui-table-row-striped-background-color:color-mix(in srgb,var(--dl-surface)')
    expect(source).toContain('--vxe-ui-table-row-hover-striped-background-color:color-mix(in srgb,var(--dl-accent)')
    expect(source).toContain('--vxe-ui-table-row-hover-checkbox-checked-background-color:color-mix(in srgb,var(--dl-accent)')
  })
})
