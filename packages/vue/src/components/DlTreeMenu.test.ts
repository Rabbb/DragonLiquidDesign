import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import DlTreeMenu from './DlTreeMenu.vue'

const items = [{ id: 'docs', label: 'Docs', children: [{ id: 'guide', label: 'Guide', description: '/docs/guide' }] }]

afterEach(() => vi.unstubAllGlobals())

describe('DlTreeMenu', () => {
  it('renders arbitrary nesting and exposes custom node slots', async () => {
    const wrapper = mount(DlTreeMenu, {
      props: { items, expanded: ['docs'], modelValue: 'guide', autoCollapse: false },
      slots: { label: ({ item }: { item: { label: string } }) => `PAGE:${item.label}` },
    })

    expect(wrapper.findAll('[role="treeitem"]')).toHaveLength(2)
    expect(wrapper.text()).toContain('PAGE:Guide')
    expect(wrapper.get('[aria-selected="true"]').text()).toContain('Guide')
  })

  it('auto-collapses at tablet widths and opens as an overlay', async () => {
    const listeners: Array<(event: MediaQueryListEvent) => void> = []
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true, addEventListener: (_: string, listener: (event: MediaQueryListEvent) => void) => listeners.push(listener), removeEventListener: vi.fn() })))
    const wrapper = mount(DlTreeMenu, { props: { items } })
    await nextTick()
    expect(wrapper.attributes('data-compact')).toBe('true')
    expect(wrapper.attributes('data-open')).toBeUndefined()
    await wrapper.get('.dl-tree-menu__toggle').trigger('click')
    expect(wrapper.attributes('data-open')).toBe('true')
    expect(wrapper.find('.dl-tree-menu__backdrop').exists()).toBe(true)
  })

  it('keeps ancestor paths, expands results and highlights hidden keywords', async () => {
    const wrapper = mount(DlTreeMenu, {
      props: {
        items: [{ id: 'root', label: 'Project', children: [{ id: 'settings', label: 'Preferences', keywords: ['Windows configuration'] }] }],
        expanded: [],
        autoCollapse: false,
      },
    })

    await wrapper.get('input[type="search"]').setValue('windows')
    expect(wrapper.findAll('[role="treeitem"]')).toHaveLength(2)
    expect(wrapper.text()).toContain('Project')
    expect(wrapper.text()).toContain('Windows configuration')
    expect(wrapper.get('.dl-tree-menu__matches mark').text()).toBe('Windows')
    expect(wrapper.find('[aria-label="收起Project"]').exists()).toBe(true)
  })

  it('uses accordion expansion by default and removes the closed branch descendants', async () => {
    const wrapper = mount(DlTreeMenu, {
      props: {
        items: [
          { id: 'docs', label: 'Docs', children: [{ id: 'guides', label: 'Guides', children: [{ id: 'start', label: 'Start' }] }] },
          { id: 'api', label: 'API', children: [{ id: 'reference', label: 'Reference' }] },
        ],
        expanded: ['docs', 'guides'],
        autoCollapse: false,
      },
    })

    await wrapper.get('[aria-label="展开API"]').trigger('click')
    expect(wrapper.emitted('update:expanded')?.at(-1)).toEqual([['api']])
  })
})
