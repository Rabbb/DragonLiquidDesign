<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  value: unknown
  name?: string
  depth?: number
}>(), {
  name: '',
  depth: 0,
})

const structured = computed(() => props.value !== null && typeof props.value === 'object')
const entries = computed(() => structured.value ? Object.entries(props.value as Record<string, unknown>) : [])
const shape = computed(() => Array.isArray(props.value) ? `[${entries.value.length}]` : `{${entries.value.length}}`)
const primitiveType = computed(() => props.value === null ? 'null' : typeof props.value)
const primitiveText = computed(() => {
  if (props.value === null) return 'null'
  if (props.value === undefined) return 'undefined'
  if (typeof props.value === 'string') return JSON.stringify(props.value)
  return String(props.value)
})
</script>

<template>
  <details v-if="structured" class="dl-mdx-runtime-tree" :open="depth === 0">
    <summary><code v-if="name" class="dl-mdx-runtime-tree__key">{{ name }}</code><span>{{ shape }}</span></summary>
    <div class="dl-mdx-runtime-tree__children">
      <MdxRuntimeJsonTree v-for="entry in entries" :key="entry[0]" :name="entry[0]" :value="entry[1]" :depth="depth + 1" />
      <span v-if="!entries.length" class="dl-mdx-runtime-tree__empty">empty</span>
    </div>
  </details>
  <div v-else class="dl-mdx-runtime-tree__leaf" :data-type="primitiveType">
    <code v-if="name" class="dl-mdx-runtime-tree__key">{{ name }}</code><span>{{ primitiveText }}</span>
  </div>
</template>
