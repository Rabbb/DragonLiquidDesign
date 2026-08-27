<script setup lang="ts">
import { computed, ref } from 'vue'
import type { DlSize } from '../types'
import DlButton from './DlButton.vue'
import DlDropdownMenu from './DlDropdownMenu.vue'
import type { DlMenuItem } from './primitive.types'

type DlButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

const props = withDefaults(defineProps<{
  label?: string
  items?: DlMenuItem[]
  open?: boolean
  variant?: DlButtonVariant
  size?: DlSize
  type?: 'button' | 'submit' | 'reset'
  block?: boolean
  loading?: boolean
  disabled?: boolean
  mainDisabled?: boolean
  menuDisabled?: boolean
  menuLabel?: string
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  modal?: boolean
  zIndex?: number
}>(), {
  label: '',
  items: () => [],
  open: undefined,
  variant: 'secondary',
  size: 'md',
  type: 'button',
  block: false,
  loading: false,
  disabled: false,
  mainDisabled: false,
  menuDisabled: false,
  menuLabel: '',
  side: 'bottom',
  align: 'end',
  modal: true,
  zIndex: undefined,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
  select: [value: string]
  'update:open': [value: boolean]
}>()

const internalOpen = ref(false)
const resolvedOpen = computed(() => props.open ?? internalOpen.value)
const hasMenu = computed(() => props.items.some(item => !item.separator))
const resolvedMenuLabel = computed(() => props.menuLabel || `${props.label || '主操作'}的更多操作`)

const updateOpen = (value: boolean): void => {
  if (props.open === undefined) internalOpen.value = value
  emit('update:open', value)
}
</script>

<template>
  <div
    data-dl
    data-slot="split-button"
    :data-variant="variant"
    :data-size="size"
    :data-open="resolvedOpen || undefined"
    :data-block="block || undefined"
    :class="['dl-split-button', { 'dl-split-button--block': block }]"
    role="group"
  >
    <DlButton
      class="dl-split-button__main"
      :variant="variant"
      :size="size"
      :type="type"
      :block="block"
      :loading="loading"
      :disabled="disabled || mainDisabled"
      @click="emit('click', $event)"
    >
      <template v-if="$slots.leading" #leading><slot name="leading" /></template>
      <slot>{{ label }}</slot>
      <template v-if="$slots.trailing" #trailing><slot name="trailing" /></template>
    </DlButton>

    <DlDropdownMenu
      :open="resolvedOpen"
      :items="items"
      :side="side"
      :align="align"
      :modal="modal"
      :z-index="zIndex"
      @update:open="updateOpen"
      @select="emit('select', $event)"
    >
      <template #trigger>
        <DlButton
          class="dl-split-button__toggle"
          :variant="variant"
          :size="size"
          type="button"
          :disabled="disabled || menuDisabled || !hasMenu"
          :aria-label="resolvedMenuLabel"
          :aria-expanded="resolvedOpen"
        >
          <svg class="dl-split-button__chevron" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="m4.5 6 3.5 3.5L11.5 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </DlButton>
      </template>
      <template #item="{ item }"><slot name="item" :item="item">{{ item.label }}</slot></template>
    </DlDropdownMenu>
  </div>
</template>

<style scoped>
.dl-split-button {
  position: relative;
  display: inline-flex;
  align-items: stretch;
  isolation: isolate;
  border-radius: var(--dl-button-radius);
  vertical-align: middle;
}

.dl-split-button--block {
  display: flex;
  width: 100%;
}

.dl-split-button[data-variant='primary'] { box-shadow: var(--dl-button-primary-shadow); }
.dl-split-button[data-variant='secondary'] { box-shadow: var(--dl-button-secondary-shadow); }
.dl-split-button[data-variant='danger'] { box-shadow: var(--dl-button-danger-shadow); }
.dl-split-button[data-variant='ghost'] { box-shadow: none; }

.dl-split-button[data-variant='primary']:has(button:hover) { box-shadow: var(--dl-button-primary-shadow-hover); }
.dl-split-button[data-variant='primary']:has(button:active) { box-shadow: var(--dl-button-primary-shadow-active); }
.dl-split-button[data-variant='secondary']:has(button:active) { box-shadow: var(--dl-button-secondary-shadow-active); }
.dl-split-button[data-variant='danger']:has(button:active) { box-shadow: var(--dl-button-danger-shadow-active); }

.dl-split-button :deep(.dl-split-button__main),
.dl-split-button :deep(.dl-split-button__toggle) {
  box-shadow: none;
}

.dl-split-button :deep(.dl-split-button__main) {
  z-index: 1;
  flex: 1 1 auto;
  border-radius: var(--dl-button-radius) 0 0 var(--dl-button-radius);
}

.dl-split-button :deep(.dl-split-button__toggle) {
  z-index: 2;
  flex: 0 0 auto;
  min-width: var(--dl-split-button-toggle-size, 40px);
  margin-left: -1px;
  padding-inline: 0;
  border-left-color: color-mix(in srgb, currentColor 22%, transparent);
  border-radius: 0 var(--dl-button-radius) var(--dl-button-radius) 0;
}

.dl-split-button[data-size='sm'] :deep(.dl-split-button__toggle) { min-width: var(--dl-split-button-toggle-size, 32px); }
.dl-split-button[data-size='lg'] :deep(.dl-split-button__toggle) { min-width: var(--dl-split-button-toggle-size, 48px); }

.dl-split-button :deep(.dl-split-button__chevron) {
  width: 16px;
  height: 16px;
  transition: transform 180ms ease;
}

.dl-split-button[data-open='true'] :deep(.dl-split-button__chevron) {
  transform: rotate(180deg);
}

.dl-split-button :deep(button:focus-visible) {
  z-index: 3;
}
</style>
