<script setup lang="ts">
import { computed } from 'vue'
import { ProgressIndicator, ProgressRoot } from 'reka-ui'
import { tv } from 'tailwind-variants'
import type { DlSize, DlTone } from '../types'

const props = withDefaults(defineProps<{
  modelValue?: number | null
  max?: number
  label?: string
  showValue?: boolean
  size?: DlSize
  tone?: DlTone
}>(), {
  modelValue: null,
  max: 100,
  label: undefined,
  showValue: false,
  size: 'md',
  tone: 'accent',
})
const percentage = computed(() => props.modelValue === null ? null : Math.min(100, Math.max(0, (props.modelValue / props.max) * 100)))
const styles = tv({
  slots: {
    track: 'relative w-full overflow-hidden rounded-full border border-[var(--dl-border)] bg-black/30 shadow-inner',
    indicator: 'h-full rounded-full transition-transform duration-500 ease-out',
  },
  variants: {
    size: { sm: { track: 'h-1.5' }, md: { track: 'h-2.5' }, lg: { track: 'h-4' } },
    tone: {
      default: { indicator: 'bg-slate-300' }, accent: { indicator: '[background:var(--dl-primary)]' },
      success: { indicator: 'bg-emerald-400' }, warning: { indicator: 'bg-amber-400' },
      danger: { indicator: 'bg-red-400' }, muted: { indicator: 'bg-slate-500' },
    },
  },
})
const classes = computed(() => styles({ size: props.size, tone: props.tone }))
</script>

<template>
  <div data-dl data-slot="progress" class="w-full">
    <div v-if="label || showValue" class="mb-2 flex items-center justify-between gap-4 text-sm">
      <span class="font-semibold text-[var(--dl-text)]">{{ label }}</span>
      <span v-if="showValue" class="tabular-nums text-[var(--dl-text-muted)]">{{ percentage === null ? '…' : `${Math.round(percentage)}%` }}</span>
    </div>
    <ProgressRoot :model-value="modelValue" :max="max" :class="classes.track()">
      <ProgressIndicator
        :class="classes.indicator()"
        :style="{ transform: `translateX(-${100 - (percentage ?? 35)}%)` }"
        :data-indeterminate="percentage === null ? '' : undefined"
      />
    </ProgressRoot>
  </div>
</template>

<style scoped>
[data-indeterminate] { width: 45%; animation: dl-progress-indeterminate 1.2s ease-in-out infinite; }
@keyframes dl-progress-indeterminate { from { transform: translateX(-110%); } to { transform: translateX(230%); } }
</style>
