<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { DlBadge, DlButton, DlDialog, DlProgress } from '@dragon-liquid/vue'

export interface PatternSourceFile {
  name: string
  language: string
  source: string
}

const props = defineProps<{
  open: boolean
  title: string
  files: PatternSourceFile[]
  loading?: boolean
  error?: string
}>()
const emit = defineEmits<{ 'update:open': [value: boolean] }>()

const activeFile = ref('')
const copied = ref(false)
const current = computed(() => props.files.find(file => file.name === activeFile.value) ?? props.files[0])

watch(() => [props.open, props.files] as const, ([open, files]) => {
  if (open && files.length) activeFile.value = files[0].name
}, { immediate: true })

async function copySource() {
  if (!current.value) return
  await navigator.clipboard.writeText(current.value.source)
  copied.value = true
  window.setTimeout(() => { copied.value = false }, 1600)
}
</script>

<template>
  <DlDialog
    :open="open"
    size="lg"
    tone="accent"
    :title="`${title} · 页面源码`"
    description="预览与代码来自同一组实际文件。切换左侧文件可查看完整 Vue 与 TypeScript 源码。"
    @update:open="emit('update:open', $event)"
  >
    <div v-if="loading" class="pattern-source-loading" role="status" aria-live="polite">
      <DlProgress indeterminate tone="accent" />
      <strong>正在按需读取完整案例源码…</strong>
      <span>源码不会进入演示站的首屏资源。</span>
    </div>
    <div v-else-if="error" class="pattern-source-loading pattern-source-loading--error" role="alert">
      <strong>源码加载失败</strong>
      <span>{{ error }}</span>
    </div>
    <div v-else class="pattern-source-viewer">
      <aside class="pattern-source-tree" aria-label="源码文件">
        <small>FILES</small>
        <button
          v-for="file in files"
          :key="file.name"
          type="button"
          :class="{ active: file.name === current?.name }"
          @click="activeFile = file.name"
        >
          <span>{{ file.name.endsWith('.vue') ? '◇' : '·' }}</span>
          {{ file.name }}
        </button>
      </aside>
      <section v-if="current" class="pattern-source-code">
        <header>
          <div>
            <strong>{{ current.name }}</strong>
            <DlBadge tone="muted" variant="outline" size="sm">{{ current.language }}</DlBadge>
          </div>
          <DlButton size="sm" :variant="copied ? 'primary' : 'secondary'" @click="copySource">
            {{ copied ? '已复制' : '复制当前文件' }}
          </DlButton>
        </header>
        <pre><code>{{ current.source }}</code></pre>
      </section>
    </div>

    <template #footer>
      <DlButton variant="secondary" @click="emit('update:open', false)">关闭</DlButton>
      <DlButton variant="primary" :disabled="!current || loading" @click="copySource">复制当前文件</DlButton>
    </template>
  </DlDialog>
</template>
