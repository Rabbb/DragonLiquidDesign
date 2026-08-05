import { computed, reactive, ref, watch } from 'vue'
import { archiveSeed } from './demo.data'
import type { ArchiveFormat, ArchiveItem, ArchiveStatus, DemoSettings, DemoToast } from './demo.types'

const items = ref<ArchiveItem[]>(archiveSeed.map(item => ({ ...item, tags: [...item.tags] })))
const selectedId = ref('frieren')
const query = ref('')
const status = ref<ArchiveStatus | 'all'>('all')
const format = ref<ArchiveFormat | 'all'>('all')
const page = ref(1)
const view = ref<'grid' | 'list'>('grid')
const favoriteIds = ref<string[]>(['frieren', 'violet'])
const settings = reactive<DemoSettings>({
  compactCards: false,
  autoplayPreview: true,
  showAdultContent: false,
  defaultView: 'grid',
  weekStartsOn: 'monday',
  pageSize: '6',
  themeTone: 'forest',
})
const toast = reactive<DemoToast>({ open: false, title: '', description: '', tone: 'success' })

const filteredItems = computed(() => {
  const keyword = query.value.trim().toLocaleLowerCase()
  return items.value.filter(item => {
    const matchesQuery = !keyword || [item.title, item.originalTitle, item.studio, ...item.tags]
      .some(value => value.toLocaleLowerCase().includes(keyword))
    return matchesQuery
      && (status.value === 'all' || item.status === status.value)
      && (format.value === 'all' || item.format === format.value)
  })
})
const selectedItem = computed(() => items.value.find(item => item.id === selectedId.value) ?? items.value[0])
const completionRate = computed(() => {
  const total = items.value.reduce((sum, item) => sum + item.episodes, 0)
  const watched = items.value.reduce((sum, item) => sum + item.watched, 0)
  return Math.round((watched / total) * 100)
})

watch([query, status, format], () => { page.value = 1 })

function selectItem(id: string) {
  selectedId.value = id
}

function addItem(item: ArchiveItem) {
  items.value = [item, ...items.value]
  selectedId.value = item.id
}

function toggleFavorite(id: string) {
  favoriteIds.value = favoriteIds.value.includes(id)
    ? favoriteIds.value.filter(value => value !== id)
    : [...favoriteIds.value, id]
  const item = items.value.find(value => value.id === id)
  notify(favoriteIds.value.includes(id) ? '已加入收藏' : '已取消收藏', item?.title ?? id, 'accent')
}

function updateItem(id: string, patch: Partial<ArchiveItem>) {
  items.value = items.value.map(item => item.id === id ? { ...item, ...patch } : item)
}

function resetFilters() {
  query.value = ''
  status.value = 'all'
  format.value = 'all'
}

function notify(title: string, description: string, tone: DemoToast['tone'] = 'success') {
  toast.open = false
  window.setTimeout(() => Object.assign(toast, { open: true, title, description, tone }), 20)
}

export function useArchiveDemo() {
  return {
    items,
    selectedId,
    selectedItem,
    filteredItems,
    completionRate,
    query,
    status,
    format,
    page,
    view,
    favoriteIds,
    settings,
    toast,
    addItem,
    selectItem,
    toggleFavorite,
    updateItem,
    resetFilters,
    notify,
  }
}
