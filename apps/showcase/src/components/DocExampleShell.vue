<script setup lang="ts">
import { ref } from 'vue'
import { DlBadge, DlButton, DlCard } from '@dragon-liquid/vue'

const props = withDefaults(defineProps<{
  eyebrow?: string
  title: string
  description: string
  code: string
  tips?: string[]
}>(), {
  eyebrow: 'LIVE EXAMPLE',
  tips: () => [],
})

const copied = ref(false)

async function copyCode() {
  await navigator.clipboard.writeText(props.code)
  copied.value = true
  window.setTimeout(() => { copied.value = false }, 1600)
}
</script>

<template>
  <div class="doc-example">
    <section class="doc-case-heading">
      <DlBadge tone="accent" variant="outline">{{ eyebrow }}</DlBadge>
      <h2>{{ title }}</h2>
      <p>{{ description }}</p>
    </section>

    <DlCard padding="lg" class="live-example-card">
      <div class="example-toolbar">
        <span><i /> PREVIEW</span>
        <DlBadge tone="success" variant="outline">INTERACTIVE</DlBadge>
      </div>
      <div class="example-stage"><slot /></div>
    </DlCard>

    <section class="code-example">
      <header>
        <span>Vue · Composition API</span>
        <DlButton variant="ghost" size="sm" @click="copyCode">{{ copied ? '已复制' : '复制代码' }}</DlButton>
      </header>
      <pre><code>{{ code }}</code></pre>
    </section>

    <DlCard v-if="tips.length" padding="md" class="usage-notes">
      <b>使用提示</b>
      <ul><li v-for="tip in tips" :key="tip">{{ tip }}</li></ul>
    </DlCard>
  </div>
</template>
