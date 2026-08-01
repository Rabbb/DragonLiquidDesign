<script setup lang="ts">
import { AspectRatio } from 'reka-ui'

withDefaults(defineProps<{ ratio?: number }>(), { ratio: 16 / 9 })
</script>

<template>
  <AspectRatio data-dl data-slot="aspect-ratio" :ratio="ratio" class="overflow-hidden rounded-[var(--dl-radius-md)] bg-[var(--dl-surface)]"><slot /></AspectRatio>
</template>
