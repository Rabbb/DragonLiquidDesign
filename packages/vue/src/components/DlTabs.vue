<script setup lang="ts">
import { computed } from 'vue'
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from 'reka-ui'
import { tv } from 'tailwind-variants'
import type { DlSize } from '../types'
import type { DlTabItem } from './primitive.types'

const props = withDefaults(defineProps<{
  modelValue?: string
  items: DlTabItem[]
  orientation?: 'horizontal' | 'vertical'
  activationMode?: 'automatic' | 'manual'
  size?: DlSize
}>(), {
  modelValue: undefined,
  orientation: 'horizontal',
  activationMode: 'automatic',
  size: 'md',
})
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
const styles = tv({
  slots: {
    root: 'flex gap-4 data-[orientation=horizontal]:flex-col data-[orientation=vertical]:flex-row',
    list: 'flex w-fit rounded-[var(--dl-radius-sm)] border border-[var(--dl-border)] bg-black/20 p-1 data-[orientation=vertical]:flex-col',
    trigger: 'rounded-[10px] font-semibold text-[var(--dl-text-muted)] outline-none transition hover:bg-white/[0.04] hover:text-[var(--dl-text)] focus-visible:[box-shadow:var(--dl-focus)] data-[state=active]:bg-[var(--dl-surface-strong)] data-[state=active]:text-amber-200 data-[state=active]:shadow-[inset_0_1px_0_rgba(255,255,255,.1),0_5px_16px_rgba(0,0,0,.2)] data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40',
    content: 'min-w-0 flex-1 rounded-[var(--dl-radius-md)] border border-[var(--dl-border)] bg-[var(--dl-surface)] p-4 text-sm text-[var(--dl-text-muted)] outline-none focus-visible:[box-shadow:var(--dl-focus)]',
  },
  variants: {
    size: { sm: { trigger: 'px-2.5 py-1.5 text-xs' }, md: { trigger: 'px-3.5 py-2 text-sm' }, lg: { trigger: 'px-4 py-2.5 text-base' } },
  },
})
const classes = computed(() => styles({ size: props.size }))
</script>

<template>
  <TabsRoot
    data-dl
    data-slot="tabs"
    :model-value="modelValue"
    :orientation="orientation"
    :activation-mode="activationMode"
    :class="classes.root()"
    @update:model-value="emit('update:modelValue', $event as string)"
  >
    <TabsList :class="classes.list()" :aria-label="$attrs['aria-label'] as string">
      <TabsTrigger v-for="item in items" :key="item.value" :value="item.value" :disabled="item.disabled" :class="classes.trigger()">
        {{ item.label }}
      </TabsTrigger>
    </TabsList>
    <TabsContent v-for="item in items" :key="item.value" :value="item.value" :class="classes.content()">
      <slot :name="`tab-${item.value}`" :item="item">
        <slot :item="item">{{ item.description }}</slot>
      </slot>
    </TabsContent>
  </TabsRoot>
</template>
