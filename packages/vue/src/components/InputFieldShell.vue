<script setup lang="ts">
import type { DlSize } from '../types'

withDefaults(defineProps<{
  size?: DlSize
  status?: 'default' | 'success' | 'warning' | 'error'
  disabled?: boolean
}>(), {
  size: 'md',
  status: 'default',
  disabled: false,
})

</script>

<template>
  <div class="dl-input-field" :data-size="size" :data-status="status" :data-disabled="disabled || undefined">
    <span v-if="$slots.leading" class="dl-input-field__leading"><slot name="leading" /></span>
    <slot />
    <span v-if="$slots.trailing" class="dl-input-field__trailing"><slot name="trailing" /></span>
  </div>
</template>
