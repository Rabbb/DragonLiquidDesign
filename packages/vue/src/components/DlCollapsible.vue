<script setup lang="ts">
import { computed } from 'vue'
import { CollapsibleContent, CollapsibleRoot, CollapsibleTrigger } from 'reka-ui'
import { tv } from 'tailwind-variants'

const props = withDefaults(defineProps<{
  open?: boolean
  title?: string
  description?: string
  disabled?: boolean
}>(), {
  open: false,
  title: '展开详情',
  description: undefined,
  disabled: false,
})
const emit = defineEmits<{ 'update:open': [value: boolean] }>()
const styles = tv({
  slots: {
    root: 'overflow-hidden rounded-[var(--dl-radius-md)] border border-[var(--dl-border)] bg-[var(--dl-surface)] shadow-[var(--dl-shadow)] backdrop-blur-xl',
    trigger: 'group flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-sm font-semibold text-[var(--dl-text)] outline-none transition hover:bg-[var(--dl-surface-hover)] focus-visible:[box-shadow:inset_var(--dl-focus)] data-[disabled]:cursor-not-allowed data-[disabled]:opacity-45',
    icon: 'text-xs text-[var(--dl-accent)] transition-transform group-data-[state=open]:rotate-180',
    content: 'overflow-hidden border-t border-[var(--dl-border)] text-sm text-[var(--dl-text-muted)] data-[state=closed]:animate-[dl-collapsible-close_.2s_ease-out] data-[state=open]:animate-[dl-collapsible-open_.25s_ease-out]',
  },
})
const classes = computed(() => styles())
</script>

<template>
  <CollapsibleRoot
    data-dl
    data-slot="collapsible"
    :open="open"
    :disabled="disabled"
    :class="classes.root()"
    @update:open="emit('update:open', $event)"
  >
    <CollapsibleTrigger :class="classes.trigger()">
      <slot name="trigger">
        <span>
          <span class="block">{{ title }}</span>
          <span v-if="description" class="mt-1 block text-xs font-normal text-[var(--dl-text-faint)]">{{ description }}</span>
        </span>
        <span :class="classes.icon()" aria-hidden="true">▼</span>
      </slot>
    </CollapsibleTrigger>
    <CollapsibleContent :class="classes.content()">
      <div class="p-4 leading-relaxed"><slot /></div>
    </CollapsibleContent>
  </CollapsibleRoot>
</template>

<style scoped>
@keyframes dl-collapsible-open { from { height: 0; opacity: 0; } to { height: var(--reka-collapsible-content-height); opacity: 1; } }
@keyframes dl-collapsible-close { from { height: var(--reka-collapsible-content-height); opacity: 1; } to { height: 0; opacity: 0; } }
</style>
