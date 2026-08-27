<script setup lang="ts">
import type { DlSize } from '../types'

withDefaults(defineProps<{
  value?: string
  placeholder?: string
  icon?: string
  size?: DlSize
  status?: 'default' | 'success' | 'warning' | 'error'
  disabled?: boolean
}>(), {
  value: '',
  placeholder: '请选择',
  icon: '▦',
  size: 'md',
  status: 'default',
  disabled: false,
})
</script>

<template>
  <button
    type="button"
    data-dl
    data-slot="picker-trigger"
    :data-size="size"
    :data-status="status"
    :disabled="disabled"
    class="dl-picker-trigger"
  >
    <span :class="!value && 'is-placeholder'">{{ value || placeholder }}</span>
    <span class="dl-picker-trigger__icon" aria-hidden="true">{{ icon }}</span>
  </button>
</template>

<style scoped>
.dl-picker-trigger { display: flex; width: 100%; min-width: 0; min-height: 44px; align-items: center; justify-content: space-between; gap: 12px; padding: 0 12px; border: 1px solid var(--dl-border); border-radius: var(--dl-radius-sm); background: var(--dl-surface); color: var(--dl-text); font: inherit; text-align: left; outline: none; cursor: pointer; transition: border-color .16s ease, box-shadow .16s ease; }
.dl-picker-trigger:hover:not(:disabled) { border-color: var(--dl-border-strong); }
.dl-picker-trigger:focus-visible { border-color: var(--dl-border-focus); box-shadow: var(--dl-focus); }
.dl-picker-trigger:disabled { cursor: not-allowed; opacity: .45; }
.dl-picker-trigger > span:first-child { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dl-picker-trigger .is-placeholder { color: var(--dl-text-faint); }
.dl-picker-trigger__icon { flex: 0 0 auto; color: var(--dl-accent); }
.dl-picker-trigger[data-size='sm'] { min-height: 36px; font-size: .82rem; }
.dl-picker-trigger[data-size='lg'] { min-height: 52px; font-size: 1rem; }
.dl-picker-trigger[data-status='success'] { border-color: color-mix(in srgb, #31a36f 58%, var(--dl-border)); }
.dl-picker-trigger[data-status='warning'] { border-color: color-mix(in srgb, #d89a31 58%, var(--dl-border)); }
.dl-picker-trigger[data-status='error'] { border-color: color-mix(in srgb, #d84d57 58%, var(--dl-border)); }
</style>
