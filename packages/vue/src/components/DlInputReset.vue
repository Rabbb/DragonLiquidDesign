<script setup lang="ts">
import { useAttrs } from 'vue'
import type { DlSize } from '../types'

defineOptions({ inheritAttrs: false })
withDefaults(defineProps<{ value?: string; size?: DlSize; disabled?: boolean }>(), { value: '重置', size: 'md', disabled: false })
const attrs = useAttrs()
</script>

<template>
  <span data-dl data-slot="input-reset">
    <input type="reset" :value="value" class="dl-input-native" tabindex="-1" aria-hidden="true">
    <button v-bind="attrs" type="reset" class="dl-input-action" :data-size="size" :disabled="disabled"><slot>{{ value }}</slot></button>
  </span>
</template>
