<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import type { DlSize } from '../types'
import type { DlChoiceOption } from './primitive.types'

const props = withDefaults(defineProps<{
  modelValue?: string
  items: DlChoiceOption[]
  size?: DlSize
  orientation?: 'horizontal' | 'vertical'
  block?: boolean
  disabled?: boolean
  name?: string
}>(), {
  modelValue: '',
  size: 'md',
  orientation: 'horizontal',
  block: false,
  disabled: false,
  name: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
}>()

const root = ref<HTMLElement | null>(null)
const enabledItems = computed(() => props.items.filter(item => !item.disabled))

function select(value: string) {
  if (props.disabled || props.items.find(item => item.value === value)?.disabled) return
  emit('update:modelValue', value)
  emit('change', value)
}

function handleKeydown(event: KeyboardEvent, value: string) {
  const previousKeys = props.orientation === 'horizontal' ? ['ArrowLeft'] : ['ArrowUp']
  const nextKeys = props.orientation === 'horizontal' ? ['ArrowRight'] : ['ArrowDown']
  const direction = previousKeys.includes(event.key) ? -1 : nextKeys.includes(event.key) ? 1 : 0
  const edge = event.key === 'Home' ? 0 : event.key === 'End' ? enabledItems.value.length - 1 : -1
  if ((!direction && edge < 0) || !enabledItems.value.length) return
  event.preventDefault()
  const current = enabledItems.value.findIndex(item => item.value === value)
  const next = edge >= 0 ? edge : (Math.max(0, current) + direction + enabledItems.value.length) % enabledItems.value.length
  const target = enabledItems.value[next]
  if (!target) return
  select(target.value)
  nextTick(() => [...(root.value?.querySelectorAll<HTMLElement>('[data-segment-value]') ?? [])]
    .find(element => element.dataset.segmentValue === target.value)
    ?.focus())
}
</script>

<template>
  <div
    ref="root"
    data-dl
    data-slot="segmented"
    class="dl-segmented"
    :data-size="size"
    :data-orientation="orientation"
    :data-block="block || undefined"
    :data-disabled="disabled || undefined"
    role="radiogroup"
    :aria-orientation="orientation"
  >
    <button
      v-for="item in items"
      :key="item.value"
      type="button"
      role="radio"
      class="dl-segmented__item"
      :class="{ 'is-selected': item.value === modelValue }"
      :aria-checked="item.value === modelValue"
      :data-segment-value="item.value"
      :disabled="disabled || item.disabled"
      :tabindex="item.value === modelValue || (!modelValue && item === enabledItems[0]) ? 0 : -1"
      @click="select(item.value)"
      @keydown="handleKeydown($event, item.value)"
    >
      <slot name="item" :item="item" :selected="item.value === modelValue"><span>{{ item.label }}</span></slot>
    </button>
  </div>
  <input v-if="name" type="hidden" :name="name" :value="modelValue" :disabled="disabled" />
</template>

<style scoped>
.dl-segmented { display: inline-flex; width: fit-content; min-width: 0; align-items: stretch; gap: 4px; padding: 4px; border: 1px solid var(--dl-border); border-radius: var(--dl-radius-md); background: var(--dl-night-soft); color: var(--dl-text-muted); box-shadow: inset 0 1px rgb(255 255 255 / 6%); }
.dl-segmented[data-block] { display: flex; width: 100%; }
.dl-segmented[data-orientation='vertical'] { flex-direction: column; }
.dl-segmented[data-disabled] { opacity: .5; }
.dl-segmented__item { min-width: 0; flex: 1 1 auto; border: 1px solid transparent; border-radius: calc(var(--dl-radius-md) - 5px); background: transparent; color: inherit; font: inherit; font-weight: 750; cursor: pointer; outline: none; transition: border-color .16s ease, background-color .16s ease, color .16s ease, box-shadow .16s ease, transform .16s ease; }
.dl-segmented[data-size='sm'] .dl-segmented__item { min-height: 28px; padding: 0 10px; font-size: .72rem; }
.dl-segmented[data-size='md'] .dl-segmented__item { min-height: 36px; padding: 0 14px; font-size: .8rem; }
.dl-segmented[data-size='lg'] .dl-segmented__item { min-height: 44px; padding: 0 18px; font-size: .9rem; }
.dl-segmented__item:hover:not(:disabled):not(.is-selected) { border-color: var(--dl-border); background: var(--dl-surface-hover); color: var(--dl-text); transform: translateY(-1px); }
.dl-segmented__item.is-selected { border-color: var(--dl-accent-border); background: var(--dl-surface-strong); color: var(--dl-accent-text); box-shadow: 0 5px 16px rgb(0 0 0 / 12%), inset 0 1px rgb(255 255 255 / 8%); }
.dl-segmented__item:focus-visible { box-shadow: var(--dl-focus); }
.dl-segmented__item:disabled { cursor: not-allowed; opacity: .38; }
.dl-segmented__item span { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
</style>
