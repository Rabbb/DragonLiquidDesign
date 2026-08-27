<script setup lang="ts">
import { useAttrs } from 'vue'
import type { DlSize } from '../types'

defineOptions({ inheritAttrs: false })
withDefaults(defineProps<{ value?: string; size?: DlSize; loading?: boolean; disabled?: boolean }>(), { value: '执行操作', size: 'md', loading: false, disabled: false })
const attrs = useAttrs()
</script>

<template>
  <span data-dl data-slot="input-button">
    <input type="button" :value="value" class="dl-input-native" tabindex="-1" aria-hidden="true">
    <button v-bind="attrs" type="button" class="dl-input-action" :data-size="size" :disabled="disabled || loading" :aria-busy="loading || undefined"><span v-if="loading" class="dl-input-action__spinner" aria-hidden="true" /><slot>{{ value }}</slot></button>
  </span>
</template>
