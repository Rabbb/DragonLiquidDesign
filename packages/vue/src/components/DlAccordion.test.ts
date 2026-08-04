import { mount } from '@vue/test-utils'
import { readFileSync } from 'node:fs'
import { defineComponent, h, nextTick, ref, type Component } from 'vue'
import { describe, expect, it } from 'vitest'
import { DlAccordion as ManagedDlAccordion } from '../index'
import RawDlAccordion from './DlAccordion.vue'
import type { DlAccordionItem } from './primitive.types'

const items: DlAccordionItem[] = [
  { value: 'story', title: '故事简介', content: '故事内容' },
  { value: 'staff', title: '制作信息', content: '制作内容' },
]

function mountControlledAccordion(component: Component) {
  return mount(defineComponent({
    setup() {
      const value = ref<string | string[] | undefined>('story')
      return () => h(component, {
        items,
        type: 'single',
        collapsible: true,
        modelValue: value.value,
        'onUpdate:modelValue': (nextValue: string | string[] | undefined) => {
          value.value = nextValue
        },
      })
    },
  }))
}

async function expectOpenItemToCollapse(component: Component) {
  const wrapper = mountControlledAccordion(component)
  const trigger = wrapper.get('button')

  expect(trigger.attributes('aria-expanded')).toBe('true')
  await trigger.trigger('click')
  await nextTick()

  expect(trigger.attributes('aria-expanded')).toBe('false')
  expect(trigger.attributes('data-state')).toBe('closed')
  wrapper.unmount()
}

describe('DlAccordion', () => {
  it('collapses an open item when its title is clicked again', async () => {
    await expectOpenItemToCollapse(RawDlAccordion)
  })

  it('preserves collapse updates through the managed component wrapper', async () => {
    await expectOpenItemToCollapse(ManagedDlAccordion)
  })

  it('keeps animation keyframes global so Reka Presence receives animationend', () => {
    const filename = 'DlAccordion.vue'
    const source = readFileSync(new URL(filename, import.meta.url), 'utf8')

    expect(source).toContain('<style>')
    expect(source).not.toContain('<style scoped>')
    expect(source).toContain(".dl-accordion__content[data-state='closed']")
    expect(source).toContain('@keyframes dl-accordion-close')
  })
})
