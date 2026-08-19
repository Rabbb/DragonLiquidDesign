<script setup lang="ts">
import { PaginationEllipsis, PaginationFirst, PaginationLast, PaginationList, PaginationListItem, PaginationNext, PaginationPrev, PaginationRoot } from 'reka-ui'

withDefaults(defineProps<{
  page?: number
  total: number
  itemsPerPage?: number
  siblingCount?: number
  showEdges?: boolean
  disabled?: boolean
}>(), { page: 1, itemsPerPage: 10, siblingCount: 1, showEdges: true, disabled: false })
const emit = defineEmits<{ 'update:page': [value: number] }>()
const buttonClass = 'grid size-9 place-items-center rounded-[10px] border border-transparent text-sm font-semibold text-[var(--dl-text-muted)] outline-none transition hover:border-[var(--dl-border)] hover:bg-[var(--dl-surface-hover)] hover:text-[var(--dl-text)] focus-visible:[box-shadow:var(--dl-focus)] disabled:opacity-35 data-[selected]:border-[var(--dl-accent-border)] data-[selected]:bg-[var(--dl-accent-surface)] data-[selected]:text-[var(--dl-accent-text)]'
</script>

<template>
  <PaginationRoot data-dl data-slot="pagination" :page="page" :total="total" :items-per-page="itemsPerPage" :sibling-count="siblingCount" :show-edges="showEdges" :disabled="disabled" @update:page="emit('update:page', $event)">
    <PaginationList v-slot="{ items }" class="flex items-center gap-1">
      <PaginationFirst :class="buttonClass" aria-label="第一页">«</PaginationFirst>
      <PaginationPrev :class="buttonClass" aria-label="上一页">‹</PaginationPrev>
      <template v-for="(item, index) in items" :key="index">
        <PaginationListItem v-if="item.type === 'page'" :value="item.value" :class="buttonClass">{{ item.value }}</PaginationListItem>
        <PaginationEllipsis v-else :index="index" :class="buttonClass">…</PaginationEllipsis>
      </template>
      <PaginationNext :class="buttonClass" aria-label="下一页">›</PaginationNext>
      <PaginationLast :class="buttonClass" aria-label="最后一页">»</PaginationLast>
    </PaginationList>
  </PaginationRoot>
</template>
