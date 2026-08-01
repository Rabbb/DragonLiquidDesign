<script setup lang="ts">
import { ColorSwatchPickerItem, ColorSwatchPickerItemIndicator, ColorSwatchPickerItemSwatch, ColorSwatchPickerRoot } from 'reka-ui'

withDefaults(defineProps<{ modelValue?: string | string[]; colors: string[]; multiple?: boolean; disabled?: boolean; name?: string }>(), { modelValue: undefined, multiple: false, disabled: false, name: undefined })
const emit = defineEmits<{ 'update:modelValue': [value: string | string[]] }>()
</script>

<template>
  <ColorSwatchPickerRoot data-dl data-slot="color-swatch-picker" :model-value="modelValue" :multiple="multiple" :disabled="disabled" :name="name" class="flex flex-wrap gap-2" @update:model-value="emit('update:modelValue', $event as string | string[])">
    <ColorSwatchPickerItem v-for="color in colors" :key="color" :value="color" class="relative grid size-11 place-items-center rounded-[var(--dl-radius-sm)] border border-transparent p-1 outline-none transition hover:scale-105 data-[state=checked]:border-amber-200/70 focus-visible:[box-shadow:var(--dl-focus)]">
      <ColorSwatchPickerItemSwatch class="size-full rounded-[9px] border border-white/20" />
      <ColorSwatchPickerItemIndicator class="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-amber-200 text-[10px] font-black text-[var(--dl-button-primary-text)] shadow-lg">✓</ColorSwatchPickerItemIndicator>
    </ColorSwatchPickerItem>
  </ColorSwatchPickerRoot>
</template>
