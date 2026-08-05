import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import DlRating from './DlRating.vue'

function segmentOpacities(wrapper: ReturnType<typeof mount>, item: number) {
  return wrapper.findAll(`[data-rating-item="${item}"]`)
    .map(segment => Number((segment.element as SVGPolygonElement).style.opacity))
}

describe('DlRating', () => {
  it('renders decimal values as five angular light segments', () => {
    const tenth = mount(DlRating, { props: { modelValue: 4.8, step: 0.1 } })
    const quarter = mount(DlRating, { props: { modelValue: 4.25, step: 0.25 } })
    const half = mount(DlRating, { props: { modelValue: 4.5, step: 0.5 } })

    expect(segmentOpacities(tenth, 5)).toEqual([1, 1, 1, 1, 0])
    expect(segmentOpacities(quarter, 5)).toEqual([1, 0.25, 0, 0, 0])
    expect(segmentOpacities(half, 5)).toEqual([1, 1, 0.5, 0, 0])
  })

  it('restores the model value after the pointer leaves', async () => {
    const wrapper = mount(DlRating, { props: { modelValue: 3.5, step: 0.5 } })

    await wrapper.get('[aria-label="1.5 / 5"]').trigger('mouseenter')
    expect(segmentOpacities(wrapper, 4)).toEqual([0, 0, 0, 0, 0])

    await wrapper.get('[data-slot="rating"]').trigger('mouseleave')
    expect(segmentOpacities(wrapper, 4)).toEqual([1, 1, 0.5, 0, 0])
  })

  it('keeps readonly ratings stable and does not emit edits', async () => {
    const wrapper = mount(DlRating, { props: { modelValue: 4.8, step: 0.1, readonly: true } })

    await wrapper.get('[aria-label="2 / 5"]').trigger('mouseenter')
    await wrapper.get('[aria-label="2 / 5"]').trigger('click')

    expect(wrapper.get('[data-slot="rating"]').attributes('aria-readonly')).toBe('true')
    expect(segmentOpacities(wrapper, 5)).toEqual([1, 1, 1, 1, 0])
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})
