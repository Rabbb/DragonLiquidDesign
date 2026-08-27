<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{
  accept?: string
  capture?: 'user' | 'environment'
  multiple?: boolean
  required?: boolean
  disabled?: boolean
  maxFiles?: number
  maxFileSize?: number
  prompt?: string
}>(), {
  accept: undefined, capture: undefined, multiple: false, required: false, disabled: false,
  maxFiles: undefined, maxFileSize: undefined, prompt: '拖放文件到这里，或点击选择',
})
const emit = defineEmits<{
  select: [files: FileList | null]
  change: [files: File[]]
  reject: [file: File, reason: 'type' | 'size' | 'count']
}>()
const attrs = useAttrs()
const input = ref<HTMLInputElement | null>(null)
const files = ref<File[]>([])
const dragging = ref(false)
const acceptHint = computed(() => props.accept ? `支持 ${props.accept}` : '支持任意文件类型')

function accepts(file: File) {
  if (!props.accept) return true
  return props.accept.split(',').map(item => item.trim().toLocaleLowerCase()).some(rule => {
    if (rule.startsWith('.')) return file.name.toLocaleLowerCase().endsWith(rule)
    if (rule.endsWith('/*')) return file.type.toLocaleLowerCase().startsWith(rule.slice(0, -1))
    return file.type.toLocaleLowerCase() === rule
  })
}
function syncNative() {
  if (!input.value || typeof DataTransfer === 'undefined') return
  const transfer = new DataTransfer()
  files.value.forEach(file => transfer.items.add(file))
  input.value.files = transfer.files
}
function applyFiles(candidates: File[]) {
  const accepted: File[] = props.multiple ? [...files.value] : []
  for (const file of candidates) {
    if (!accepts(file)) { emit('reject', file, 'type'); continue }
    if (props.maxFileSize !== undefined && file.size > props.maxFileSize) { emit('reject', file, 'size'); continue }
    if (props.maxFiles !== undefined && accepted.length >= props.maxFiles) { emit('reject', file, 'count'); continue }
    if (!accepted.some(current => current.name === file.name && current.size === file.size && current.lastModified === file.lastModified)) accepted.push(file)
  }
  files.value = props.multiple ? accepted : accepted.slice(-1)
  syncNative()
  emit('change', [...files.value])
}
function selected(event: Event) {
  const selectedFiles = (event.target as HTMLInputElement).files
  applyFiles([...(selectedFiles ?? [])])
  emit('select', selectedFiles)
}
function dropped(event: DragEvent) {
  dragging.value = false
  if (props.disabled) return
  applyFiles([...(event.dataTransfer?.files ?? [])])
  emit('select', event.dataTransfer?.files ?? null)
}
function remove(index: number) { files.value.splice(index, 1); files.value = [...files.value]; syncNative(); emit('change', [...files.value]) }
function formatSize(size: number) { return size < 1024 * 1024 ? `${Math.max(1, Math.round(size / 1024))} KB` : `${(size / 1024 / 1024).toFixed(1)} MB` }
</script>

<template>
  <div data-dl data-slot="input-file" class="dl-input-file">
    <input ref="input" v-bind="attrs" type="file" :accept="accept" :capture="capture" :multiple="multiple" :required="required" :disabled="disabled" class="dl-input-native" @change="selected">
    <button type="button" class="dl-input-file__drop" :data-dragging="dragging || undefined" :data-disabled="disabled || undefined" :disabled="disabled" @click="input?.click()" @dragenter.prevent="dragging = true" @dragover.prevent="dragging = true" @dragleave.prevent="dragging = false" @drop.prevent="dropped">
      <span aria-hidden="true">＋</span><b>{{ prompt }}</b><small>{{ acceptHint }}<template v-if="maxFileSize"> · 单个不超过 {{ formatSize(maxFileSize) }}</template></small>
    </button>
    <ul v-if="files.length" class="dl-input-file__list">
      <li v-for="(file, index) in files" :key="`${file.name}-${file.lastModified}`"><b>{{ file.name }}</b><small>{{ formatSize(file.size) }}</small><button type="button" class="dl-input-field__action" :aria-label="`移除 ${file.name}`" @click="remove(index)">×</button></li>
    </ul>
  </div>
</template>
