<script setup lang="ts">
import { computed } from 'vue'
import { PinInputInput, PinInputRoot } from 'reka-ui'
import { tv } from 'tailwind-variants'
import type { DlSize } from '../types'

const props = withDefaults(defineProps<{
  modelValue?: string[]
  length?: number
  placeholder?: string
  mask?: boolean
  otp?: boolean
  size?: DlSize
  disabled?: boolean
  name?: string
}>(), { modelValue: () => [], length: 6, placeholder: '○', mask: false, otp: true, size: 'md', disabled: false, name: undefined })
const emit = defineEmits<{ 'update:modelValue': [value: string[]]; complete: [value: string[]] }>()
const input = tv({
  base: 'rounded-[var(--dl-radius-sm)] border border-[var(--dl-border)] bg-[var(--dl-surface)] text-center font-bold text-[var(--dl-text)] caret-amber-300 outline-none transition focus:border-[var(--dl-border-focus)] focus:[box-shadow:var(--dl-focus)] disabled:opacity-45',
  variants: { size: { sm: 'size-8 text-xs', md: 'size-11 text-base', lg: 'size-14 text-xl' } },
})
const inputClasses = computed(() => input({ size: props.size }))
</script>

<template>
  <PinInputRoot data-dl data-slot="pin-input" type="text" :model-value="modelValue" :placeholder="placeholder" :mask="mask" :otp="otp" :disabled="disabled" :name="name" class="flex flex-wrap gap-2" @update:model-value="emit('update:modelValue', $event as string[])" @complete="emit('complete', $event as string[])">
    <PinInputInput v-for="index in length" :key="index" :index="index - 1" :class="inputClasses" />
  </PinInputRoot>
</template>
