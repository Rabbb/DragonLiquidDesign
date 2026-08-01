<script setup lang="ts">
import { RatingItem, RatingItemIndicator, RatingRoot } from 'reka-ui'
import type { DlSize } from '../types'

withDefaults(defineProps<{
  modelValue?: number
  length?: number
  step?: 1 | 0.5 | 0.25 | 0.1
  clearable?: boolean
  hoverable?: boolean
  disabled?: boolean
  size?: DlSize
  name?: string
}>(), { modelValue: 0, length: 5, step: 1, clearable: true, hoverable: true, disabled: false, size: 'md', name: undefined })
const emit = defineEmits<{ 'update:modelValue': [value: number] }>()
</script>

<template>
  <RatingRoot v-slot="{ items }" data-dl data-slot="rating" :model-value="modelValue" :length="length" :step="step" :clearable="clearable" :hoverable="hoverable" :disabled="disabled" :name="name" class="flex w-fit items-center gap-1" @update:model-value="emit('update:modelValue', $event)">
    <RatingItem v-for="item in items" :key="item" v-slot="{ steps }" :item="item" :class="['relative grid place-items-center text-slate-600 outline-none transition hover:scale-110 focus-visible:[filter:drop-shadow(0_0_6px_rgba(255,215,0,.7))] data-[disabled]:opacity-40', size === 'sm' ? 'size-6 text-xl' : size === 'lg' ? 'size-10 text-4xl' : 'size-8 text-3xl']">
      <span aria-hidden="true">★</span>
      <RatingItemIndicator v-for="indicatorStep in steps" :key="indicatorStep" :step="indicatorStep" class="absolute inset-0 overflow-hidden text-amber-300 [filter:drop-shadow(0_0_5px_rgba(255,193,7,.32))]">★</RatingItemIndicator>
    </RatingItem>
  </RatingRoot>
</template>
