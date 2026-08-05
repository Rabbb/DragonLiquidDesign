<script setup lang="ts">
import { computed, ref } from 'vue'
import { RatingItem, RatingItemIndicator, RatingRoot } from 'reka-ui'
import type { DlSize } from '../types'

const props = withDefaults(defineProps<{
  modelValue?: number
  length?: number
  step?: 1 | 0.5 | 0.25 | 0.1
  clearable?: boolean
  hoverable?: boolean
  disabled?: boolean
  readonly?: boolean
  size?: DlSize
  name?: string
}>(), { modelValue: 0, length: 5, step: 1, clearable: true, hoverable: true, disabled: false, readonly: false, size: 'md', name: undefined })
const emit = defineEmits<{ 'update:modelValue': [value: number] }>()

const ratingSegments = [
  '50,50 30.98,56.18 6.25,35.78 38.24,33.82',
  '50,50 50,70 22.96,87.22 30.98,56.18',
  '50,50 38.24,33.82 50,4 61.76,33.82',
  '50,50 69.02,56.18 77.04,87.22 50,70',
  '50,50 61.76,33.82 93.75,35.78 69.02,56.18',
] as const
const previewValue = ref<number>()
const displayedValue = computed(() => Math.min(props.length, Math.max(0, previewValue.value ?? props.modelValue)))

function fillPercentage(item: number) {
  const percentage = Math.min(100, Math.max(0, (displayedValue.value - (item - 1)) * 100))
  return Number(percentage.toFixed(4))
}

function segmentOpacity(item: number, segmentIndex: number) {
  const opacity = Math.min(1, Math.max(0, fillPercentage(item) / 20 - segmentIndex))
  return Number(opacity.toFixed(4))
}

function previewRating(value: number) {
  if (!props.disabled && !props.readonly && props.hoverable) previewValue.value = value
}

function clearPreview() {
  previewValue.value = undefined
}

function updateRating(value: number) {
  if (!props.disabled && !props.readonly) emit('update:modelValue', value)
}
</script>

<template>
  <RatingRoot v-slot="{ items }" data-dl data-slot="rating" :model-value="modelValue" :length="length" :step="step" :clearable="clearable" :hoverable="hoverable && !readonly" :disabled="disabled || readonly" :aria-readonly="readonly || undefined" :name="name" class="flex w-fit select-none items-center gap-1" @mouseleave="clearPreview" @focusout="clearPreview" @update:model-value="updateRating">
    <RatingItem v-for="item in items" :key="item" v-slot="{ steps }" :item="item" :class="['relative grid place-items-center text-slate-600 transition focus-within:[filter:drop-shadow(0_0_6px_rgba(255,215,0,.7))]', !disabled && !readonly && 'hover:scale-110', disabled && 'opacity-40', size === 'sm' ? 'size-6 text-xl' : size === 'lg' ? 'size-10 text-4xl' : 'size-8 text-3xl']">
      <svg class="pointer-events-none size-full overflow-visible [filter:drop-shadow(0_0_5px_rgba(255,193,7,.22))]" viewBox="0 0 100 100" aria-hidden="true">
        <polygon v-for="segment in ratingSegments" :key="`base-${segment}`" :points="segment" class="fill-slate-600 stroke-slate-950/25" stroke-width="1.4" />
        <polygon
          v-for="(segment, segmentIndex) in ratingSegments"
          :key="`fill-${segment}`"
          data-rating-segment
          :data-rating-item="item"
          :data-rating-segment-index="segmentIndex"
          :points="segment"
          class="fill-amber-300 stroke-amber-100/20 transition-opacity duration-100"
          stroke-width="1.1"
          :style="{ opacity: segmentOpacity(item, segmentIndex) }"
        />
      </svg>
      <RatingItemIndicator
        v-for="indicatorStep in steps"
        :key="indicatorStep"
        :step="indicatorStep"
        :aria-label="`${indicatorStep} / ${length}`"
        class="absolute inset-y-0 left-0 m-0 overflow-hidden border-0 bg-transparent p-0 text-transparent outline-none [opacity:var(--reka-rating-item-step-opacity)] [width:var(--reka-rating-item-step-width)] [z-index:var(--reka-rating-item-step-z-index)]"
        @mouseenter="previewRating(indicatorStep)"
      >
        <span class="sr-only">{{ indicatorStep }} / {{ length }}</span>
      </RatingItemIndicator>
    </RatingItem>
  </RatingRoot>
</template>
