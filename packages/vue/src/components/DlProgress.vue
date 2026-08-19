<script setup lang="ts">
import { computed } from 'vue'
import { ProgressIndicator, ProgressRoot } from 'reka-ui'
import { tv } from 'tailwind-variants'
import type { DlSize, DlTone } from '../types'

type DlProgressStatus = 'default' | 'success' | 'warning' | 'error' | 'danger'

const props = withDefaults(defineProps<{
  modelValue?: number | null
  max?: number
  label?: string
  helper?: string
  showValue?: boolean
  size?: DlSize
  tone?: DlTone
  status?: DlProgressStatus
}>(), {
  modelValue: null,
  max: 100,
  label: undefined,
  helper: undefined,
  showValue: false,
  size: 'md',
  tone: 'default',
  status: 'default',
})

const percentage = computed(() => props.modelValue === null ? null : Math.min(100, Math.max(0, (props.modelValue / props.max) * 100)))
const progressStyles = tv({
  base: 'dl-progress',
  variants: {
    size: { sm: 'dl-progress--sm', md: 'dl-progress--md', lg: 'dl-progress--lg' },
    tone: {
      default: 'dl-progress-tone-default', accent: 'dl-progress-tone-accent', success: 'dl-progress-tone-success',
      warning: 'dl-progress-tone-warning', danger: 'dl-progress-tone-danger', muted: 'dl-progress-tone-muted',
    },
    status: {
      default: '', success: 'dl-progress-status-success', warning: 'dl-progress-status-warning',
      error: 'dl-progress-status-danger', danger: 'dl-progress-status-danger',
    },
  },
  defaultVariants: { size: 'md', tone: 'default', status: 'default' },
})
</script>

<template>
  <div data-dl data-slot="progress" :class="progressStyles({ size, tone, status })">
    <header v-if="label || helper || showValue" class="dl-progress__header">
      <div class="dl-progress__meta">
        <span v-if="label" class="dl-progress__label">{{ label }}</span>
        <span v-if="helper" class="dl-progress__helper">{{ helper }}</span>
      </div>
      <span v-if="showValue" class="dl-progress__info">{{ percentage === null ? '…' : `${Math.round(percentage)}%` }}</span>
    </header>
    <ProgressRoot :model-value="modelValue" :max="max" class="dl-progress__track">
      <ProgressIndicator
        class="dl-progress__indicator"
        :style="{ transform: `translateX(-${100 - (percentage ?? 35)}%)` }"
        :data-indeterminate="percentage === null ? '' : undefined"
      />
    </ProgressRoot>
  </div>
</template>

<style scoped>
.dl-progress { --dl-progress-height: 10px; --dl-progress-fill: linear-gradient(90deg, #303740, #64748b); --dl-progress-shadow: 0 2px 8px rgba(15, 23, 42, 0.12); display: grid; gap: 10px; width: 100%; color: var(--dl-text); }
.dl-progress--sm { --dl-progress-height: 8px; }
.dl-progress--lg { --dl-progress-height: 14px; }
.dl-progress-tone-accent { --dl-progress-fill: linear-gradient(90deg, var(--dragon-yellow), var(--dragon-orange-light)); --dl-progress-shadow: 0 0 18px rgba(255, 223, 128, 0.22); }
.dl-progress-tone-success { --dl-progress-fill: linear-gradient(90deg, var(--dragon-green-light), var(--dragon-cyan)); --dl-progress-shadow: 0 0 18px rgba(113, 209, 173, 0.22); }
.dl-progress-tone-warning { --dl-progress-fill: linear-gradient(90deg, var(--dragon-orange-light), var(--dragon-yellow)); --dl-progress-shadow: 0 0 18px rgba(255, 179, 71, 0.22); }
.dl-progress-tone-danger { --dl-progress-fill: linear-gradient(90deg, #ff8f8f, var(--dragon-red)); --dl-progress-shadow: 0 0 18px rgba(255, 123, 123, 0.22); }
.dl-progress-tone-muted { --dl-progress-fill: linear-gradient(90deg, rgba(148, 163, 184, 0.88), rgba(100, 116, 139, 0.92)); --dl-progress-shadow: 0 0 14px rgba(148, 163, 184, 0.12); }
.dl-progress-status-success { --dl-progress-fill: linear-gradient(90deg, var(--dragon-green-light), var(--dragon-cyan)); --dl-progress-shadow: 0 0 18px rgba(113, 209, 173, 0.22); }
.dl-progress-status-warning { --dl-progress-fill: linear-gradient(90deg, var(--dragon-orange-light), var(--dragon-yellow)); --dl-progress-shadow: 0 0 18px rgba(255, 179, 71, 0.22); }
.dl-progress-status-danger { --dl-progress-fill: linear-gradient(90deg, #ff8f8f, var(--dragon-red)); --dl-progress-shadow: 0 0 18px rgba(255, 123, 123, 0.22); }
.dl-progress__header { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.dl-progress__meta { display: grid; gap: 4px; }
.dl-progress__label { font-size: 0.92rem; font-weight: 700; }
.dl-progress__helper { color: var(--dl-text-muted); font-size: 0.78rem; line-height: 1.45; }
.dl-progress__info { color: var(--dl-text); font-size: 0.86rem; font-weight: 700; font-variant-numeric: tabular-nums; }
.dl-progress__track { position: relative; width: 100%; min-height: var(--dl-progress-height); overflow: hidden; border: 1px solid var(--dl-border); border-radius: 999px; background: #e9edf1; box-shadow: inset 0 1px 2px rgba(15, 23, 42, 0.06); }
.dl-progress__indicator { position: absolute; inset: 0; border-radius: inherit; background: var(--dl-progress-fill); box-shadow: var(--dl-progress-shadow); transition: transform 280ms ease; }
.dl-progress__indicator::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.16), transparent); opacity: 0.6; }
[data-indeterminate] { width: 45%; animation: dl-progress-indeterminate 1.2s ease-in-out infinite; }
@keyframes dl-progress-indeterminate { from { transform: translateX(-110%); } to { transform: translateX(230%); } }
</style>
