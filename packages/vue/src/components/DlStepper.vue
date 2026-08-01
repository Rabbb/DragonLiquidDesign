<script setup lang="ts">
import { StepperDescription, StepperIndicator, StepperItem, StepperRoot, StepperSeparator, StepperTitle, StepperTrigger } from 'reka-ui'
import type { DlStepItem } from './primitive.types'

withDefaults(defineProps<{
  modelValue?: number
  items: DlStepItem[]
  orientation?: 'horizontal' | 'vertical'
  linear?: boolean
}>(), { modelValue: 1, orientation: 'horizontal', linear: false })
const emit = defineEmits<{ 'update:modelValue': [value: number | undefined] }>()
</script>

<template>
  <StepperRoot data-dl data-slot="stepper" :model-value="modelValue" :orientation="orientation" :linear="linear" :class="['flex w-full gap-2', orientation === 'vertical' ? 'flex-col' : 'items-start']" @update:model-value="emit('update:modelValue', $event)">
    <StepperItem v-for="(item, index) in items" :key="item.step" v-slot="{ state }" :step="item.step" :disabled="item.disabled" :completed="item.completed" :class="['group relative flex gap-3', orientation === 'horizontal' ? 'min-w-0 flex-1 flex-col items-center text-center' : 'min-h-20 items-start']">
      <StepperTrigger class="flex flex-col items-center gap-2 outline-none disabled:opacity-45" :aria-label="item.title">
        <StepperIndicator class="grid size-9 shrink-0 place-items-center rounded-full border border-[var(--dl-border-strong)] bg-[var(--dl-surface)] text-sm font-black text-[var(--dl-text-muted)] transition group-data-[state=active]:border-amber-200/50 group-data-[state=active]:[background:var(--dl-button-primary-bg)] group-data-[state=active]:text-[var(--dl-button-primary-text)] group-data-[state=completed]:border-emerald-300/35 group-data-[state=completed]:bg-emerald-400/15 group-data-[state=completed]:text-emerald-200 focus-visible:[box-shadow:var(--dl-focus)]">
          {{ state === 'completed' ? '✓' : item.step }}
        </StepperIndicator>
        <span v-if="orientation === 'horizontal'">
          <StepperTitle class="block text-sm font-bold text-[var(--dl-text)]">{{ item.title }}</StepperTitle>
          <StepperDescription v-if="item.description" class="mt-1 block text-xs text-[var(--dl-text-faint)]">{{ item.description }}</StepperDescription>
        </span>
      </StepperTrigger>
      <span v-if="orientation === 'vertical'" class="pt-1">
        <StepperTitle class="block text-sm font-bold text-[var(--dl-text)]">{{ item.title }}</StepperTitle>
        <StepperDescription v-if="item.description" class="mt-1 block text-xs text-[var(--dl-text-faint)]">{{ item.description }}</StepperDescription>
      </span>
      <StepperSeparator v-if="index < items.length - 1" :class="['bg-[var(--dl-border)] group-data-[state=completed]:bg-emerald-300/35', orientation === 'horizontal' ? 'absolute left-[calc(50%+1.5rem)] right-[calc(-50%+1.5rem)] top-[18px] h-px' : 'absolute bottom-0 left-[18px] top-10 w-px']" />
    </StepperItem>
  </StepperRoot>
</template>
