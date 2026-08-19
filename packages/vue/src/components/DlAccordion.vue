<script setup lang="ts">
import { computed } from 'vue'
import { AccordionContent, AccordionHeader, AccordionItem, AccordionRoot, AccordionTrigger } from 'reka-ui'
import { tv } from 'tailwind-variants'
import type { DlAccordionItem } from './primitive.types'

const props = withDefaults(defineProps<{
  items: DlAccordionItem[]
  type?: 'single' | 'multiple'
  collapsible?: boolean
  disabled?: boolean
}>(), {
  type: 'single',
  collapsible: true,
  disabled: false,
})
const modelValue = defineModel<string | string[] | undefined>()
const styles = tv({
  slots: {
    root: 'overflow-hidden rounded-[var(--dl-radius-md)] border border-[var(--dl-border)] bg-[var(--dl-surface)] shadow-[var(--dl-shadow)] backdrop-blur-xl',
    item: 'border-b border-[var(--dl-border)] last:border-b-0',
    trigger: 'group flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left text-sm font-semibold text-[var(--dl-text)] outline-none transition hover:bg-[var(--dl-surface-hover)] focus-visible:[box-shadow:inset_var(--dl-focus)] data-[disabled]:cursor-not-allowed data-[disabled]:opacity-45',
    icon: 'text-xs text-[var(--dl-accent)] transition-transform duration-200 group-data-[state=open]:rotate-180',
    content: 'dl-accordion__content overflow-hidden text-sm text-[var(--dl-text-muted)]',
  },
})
const classes = computed(() => styles())
</script>

<template>
  <AccordionRoot
    data-dl
    data-slot="accordion"
    v-model="modelValue"
    :type="type"
    :collapsible="type === 'single' ? collapsible : undefined"
    :disabled="disabled"
    :class="classes.root()"
  >
    <AccordionItem v-for="item in items" :key="item.value" :value="item.value" :disabled="item.disabled" :class="classes.item()">
      <AccordionHeader>
        <AccordionTrigger :class="classes.trigger()">
          <span>
            <span class="block">{{ item.title }}</span>
            <span v-if="item.description" class="mt-1 block text-xs font-normal text-[var(--dl-text-faint)]">{{ item.description }}</span>
          </span>
          <span :class="classes.icon()" aria-hidden="true">▼</span>
        </AccordionTrigger>
      </AccordionHeader>
      <AccordionContent :class="classes.content()">
        <div class="px-4 pb-4 leading-relaxed">
          <slot :name="`item-${item.value}`" :item="item">{{ item.content }}</slot>
        </div>
      </AccordionContent>
    </AccordionItem>
  </AccordionRoot>
</template>

<style>
.dl-accordion__content[data-state='open'] { animation: dl-accordion-open 250ms ease-out; }
.dl-accordion__content[data-state='closed'] { animation: dl-accordion-close 200ms ease-out; }
@keyframes dl-accordion-open { from { height: 0; opacity: 0; } to { height: var(--reka-accordion-content-height); opacity: 1; } }
@keyframes dl-accordion-close { from { height: var(--reka-accordion-content-height); opacity: 1; } to { height: 0; opacity: 0; } }
</style>
