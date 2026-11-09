<script setup lang="ts">
import { inject, ref, watch } from 'vue'
import { dlMdxImageLoaderKey } from './dl-mdx.images'
const props = defineProps<{ src?: string }>()
const load = inject(dlMdxImageLoaderKey, undefined)
const resolved = ref<string>(), loading = ref(false), failed = ref(false)
watch(() => props.src, (source, _, cleanup) => {
  const controller = new AbortController()
  let objectUrl: string | undefined
  cleanup(() => { controller.abort(); if (objectUrl) URL.revokeObjectURL(objectUrl) })
  resolved.value = undefined; failed.value = false; loading.value = false
  if (!source) return
  if (!load) { resolved.value = source; return }
  loading.value = true
  Promise.resolve().then(() => load(source, controller.signal)).then(value => {
    if (controller.signal.aborted) return
    resolved.value = value instanceof Blob ? (objectUrl = URL.createObjectURL(value)) : value
  }).catch(() => { if (!controller.signal.aborted) failed.value = true })
    .finally(() => { if (!controller.signal.aborted) loading.value = false })
}, { immediate: true })
</script>
<template><img :src="resolved" :data-mdx-loading="loading || undefined" :data-mdx-error="failed || undefined"></template>
