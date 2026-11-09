<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import DlButton from './DlButton.vue'
import DlPopover from './DlPopover.vue'
import type { DlMdxOutlineItem } from './dl-mdx.outline'

const props = withDefaults(defineProps<{
  title?: string
  targetId?: string
  items?: DlMdxOutlineItem[]
  minLevel?: number
  maxLevel?: number
  breakpoint?: number
  topOffset?: number
  width?: number
}>(), { title: '本页目录', targetId: '', minLevel: 1, maxLevel: 6, breakpoint: 1100, topOffset: 68, width: 196 })
const emit = defineEmits<{ select: [item: DlMdxOutlineItem] }>()
const marker = ref<HTMLElement>()
const links = ref<HTMLElement>()
const entries = ref<DlMdxOutlineItem[]>([])
const activeId = ref('')
const open = ref(false)
const embedded = ref(false)
const panel = ref(false)
const visible = ref(false)
const left = ref(0)
const top = ref(0)
const availableHeight = ref(0)
const duplicate = ref(false)
const panelWidth = computed(() => Math.min(320, Math.max(160, props.width)))
const baseLevel = computed(() => Math.min(...entries.value.map(item => item.level), 6))
let target: HTMLElement | null = null
let headings: HTMLElement[] = []
let mutations: MutationObserver | undefined
let resize: ResizeObserver | undefined
let frame = 0
let mounted = false
let previousWidth = ''

function collect() {
  if (!target) return
  const existing = target.querySelector('[data-slot="navigation-pane"]')
  duplicate.value = embedded.value ? !!existing && existing !== marker.value : !!existing
  headings = Array.from(target.querySelectorAll<HTMLElement>('h1[id],h2[id],h3[id],h4[id],h5[id],h6[id]'))
    .filter(heading => !embedded.value || heading.closest('.dl-mdx__document') === target)
  const found = props.items ?? headings.map(heading => ({
    id: heading.id, label: (heading.textContent ?? '').replace(/^#\s*/, '').trim(), level: Number(heading.tagName.slice(1)),
  }))
  entries.value = found.filter(item => item.id && item.label && item.level >= props.minLevel && item.level <= props.maxLevel)
  schedule()
}

function measure() {
  frame = 0
  if (!target || !marker.value) return
  const bounds = target.getBoundingClientRect()
  const width = panelWidth.value
  if (embedded.value && !duplicate.value) target.style.setProperty('--dl-navigation-pane-width', width + 'px')
  const room = embedded.value ? bounds.width >= width + 500 : window.innerWidth - bounds.right >= width + 24
  const docked = window.innerWidth >= props.breakpoint && room && !duplicate.value
  if (panel.value !== docked) { panel.value = docked; open.value = false }
  left.value = embedded.value ? bounds.right - width - 12 : bounds.right + 16
  top.value = Math.max(props.topOffset, bounds.top)
  availableHeight.value = Math.max(0, Math.min(window.innerHeight - top.value - 16, bounds.bottom - top.value))
  visible.value = bounds.bottom > props.topOffset && bounds.top < window.innerHeight && availableHeight.value >= 48
  const eligible = new Set(entries.value.map(item => item.id))
  const ordered = headings.filter(heading => eligible.has(heading.id))
  const container = scrollContainer(ordered[0] ?? target)
  const edge = container ? Math.max(props.topOffset, container.getBoundingClientRect().top + 12) : props.topOffset
  const passed = ordered.filter(heading => heading.getBoundingClientRect().top <= edge + 16)
  const atEnd = container
    ? container.scrollTop > 0 && container.scrollTop + container.clientHeight >= container.scrollHeight - 2
    : window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2
  const last = ordered.at(-1)
  const bottom = container ? Math.min(window.innerHeight, container.getBoundingClientRect().bottom) : window.innerHeight
  activeId.value = (atEnd && last && last.getBoundingClientRect().bottom <= bottom ? last : passed.at(-1) ?? ordered[0])?.id ?? ''
}

function schedule() {
  if (!frame) frame = requestAnimationFrame(measure)
}

async function attach() {
  mutations?.disconnect()
  resize?.disconnect()
  if (target && embedded.value && !duplicate.value) {
    if (previousWidth) target.style.setProperty('--dl-navigation-pane-width', previousWidth)
    else target.style.removeProperty('--dl-navigation-pane-width')
  }
  await nextTick()
  if (!mounted) return
  target = props.targetId ? document.getElementById(props.targetId) : marker.value?.closest<HTMLElement>('.dl-mdx__document') ?? null
  embedded.value = !props.targetId && !!target
  if (!target) { entries.value = []; return }
  previousWidth = target.style.getPropertyValue('--dl-navigation-pane-width')
  mutations = new MutationObserver(collect)
  mutations.observe(target, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['id'] })
  resize = new ResizeObserver(schedule)
  resize.observe(target)
  collect()
}

function scrollContainer(element: HTMLElement) {
  let scrollParent = element.parentElement
  while (scrollParent && scrollParent !== document.documentElement) {
    if (scrollParent.scrollHeight > scrollParent.clientHeight + 1 && /auto|scroll/.test(getComputedStyle(scrollParent).overflowY)) break
    scrollParent = scrollParent.parentElement
  }
  return scrollParent === document.documentElement ? null : scrollParent
}

function select(item: DlMdxOutlineItem, event: MouseEvent) {
  if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
  const heading = headings.find(element => element.id === item.id)
  if (!heading) return
  event.preventDefault()
  open.value = false
  const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
  const scrollParent = scrollContainer(heading)
  if (scrollParent) {
    scrollParent.scrollTo({ top: scrollParent.scrollTop + heading.getBoundingClientRect().top - scrollParent.getBoundingClientRect().top - 12, behavior })
  } else window.scrollTo({ top: window.scrollY + heading.getBoundingClientRect().top - props.topOffset, behavior })
  const url = new URL(window.location.href)
  url.hash = item.id
  window.history.replaceState(window.history.state, '', url)
  activeId.value = item.id
  emit('select', item)
}

async function revealActive() {
  await nextTick()
  const list = links.value, item = list?.querySelector<HTMLElement>('[aria-current="location"]')
  if (!list || !item) return
  const bounds = list.getBoundingClientRect(), current = item.getBoundingClientRect()
  if (current.top < bounds.top) list.scrollTop += current.top - bounds.top
  else if (current.bottom > bounds.bottom) list.scrollTop += current.bottom - bounds.bottom
}

watch([activeId, open, panel], revealActive)
watch(() => props.targetId, () => { if (mounted) void attach() })
watch(() => [props.items, props.minLevel, props.maxLevel], () => { if (mounted) collect() }, { deep: true })
watch(() => [props.width, props.breakpoint, props.topOffset], () => { if (mounted) schedule() })
onMounted(() => {
  mounted = true
  void attach()
  window.addEventListener('scroll', schedule, { capture: true, passive: true })
  window.addEventListener('resize', schedule, { passive: true })
})
onBeforeUnmount(() => {
  mounted = false
  mutations?.disconnect()
  resize?.disconnect()
  cancelAnimationFrame(frame)
  window.removeEventListener('scroll', schedule, true)
  window.removeEventListener('resize', schedule)
  if (target && embedded.value && !duplicate.value) {
    if (previousWidth) target.style.setProperty('--dl-navigation-pane-width', previousWidth)
    else target.style.removeProperty('--dl-navigation-pane-width')
  }
})
</script>

<template>
  <span ref="marker" data-dl data-slot="navigation-pane" :data-embedded="embedded || undefined" :data-layout="panel && entries.length ? 'panel' : 'menu'" class="dl-navigation-pane">
  <Teleport to="body">
    <aside v-if="entries.length && !duplicate && panel && visible" data-dl class="dl-navigation-pane__floating" :aria-label="title" :style="{left:left+'px',top:top+'px',width:panelWidth+'px',maxHeight:availableHeight+'px'}">
      <div class="dl-navigation-pane__title">{{ title }}</div>
      <nav ref="links" class="dl-navigation-pane__links" :aria-label="title">
        <a v-for="item in entries" :key="item.id" :href="'#'+encodeURIComponent(item.id)" :aria-current="activeId===item.id?'location':undefined" :style="{paddingInlineStart:(8+Math.max(0,item.level-baseLevel)*12)+'px'}" @click="select(item,$event)">{{item.label}}</a>
      </nav>
    </aside>
    <div v-else-if="entries.length && !duplicate && !panel" class="dl-navigation-pane__menu">
      <DlPopover v-model:open="open" :title="title" side="top" align="end" :arrow="false" content-class="dl-navigation-pane__popover">
        <template #trigger><DlButton size="sm" variant="secondary" :aria-label="'打开'+title">☰ {{title}}</DlButton></template>
        <nav ref="links" class="dl-navigation-pane__links" :aria-label="title">
          <a v-for="item in entries" :key="item.id" :href="'#'+encodeURIComponent(item.id)" :aria-current="activeId===item.id?'location':undefined" :style="{paddingInlineStart:(8+Math.max(0,item.level-baseLevel)*12)+'px'}" @click="select(item,$event)">{{item.label}}</a>
        </nav>
      </DlPopover>
    </div>
  </Teleport>
  </span>
</template>

<style>
.dl-navigation-pane{display:block;height:0;min-height:0;overflow:hidden}
.dl-navigation-pane__floating{position:fixed;z-index:25;display:flex;flex-direction:column;gap:8px;overflow:hidden;padding:10px 0 10px 12px;border-inline-start:1px solid var(--dl-border);color:var(--dl-text-muted);font-family:inherit}
.dl-navigation-pane__title{flex:none;font-size:12px;font-weight:650;color:var(--dl-text);padding-inline-start:8px}
.dl-navigation-pane__links{display:grid;align-content:start;gap:2px;min-height:0;overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin}
.dl-navigation-pane__links a{display:block;padding:5px 8px;color:var(--dl-text-muted);font-size:12px;line-height:1.5;text-decoration:none;border-radius:5px;overflow-wrap:anywhere}
.dl-navigation-pane__links a:hover{color:var(--dl-text);background:var(--dl-surface-hover)}
.dl-navigation-pane__links a[aria-current=location]{color:var(--dl-accent-text);background:var(--dl-accent-surface);font-weight:650}
.dl-navigation-pane__links a:focus-visible{outline:2px solid var(--dl-accent);outline-offset:-2px}
.dl-navigation-pane__menu{position:fixed;z-index:30;right:max(16px,env(safe-area-inset-right));bottom:max(16px,env(safe-area-inset-bottom))}
.dl-navigation-pane__menu>button{box-shadow:0 3px 16px #0002}
.dl-navigation-pane__popover{width:min(340px,calc(100vw - 24px));padding:12px;border-radius:12px;gap:8px}
.dl-navigation-pane__popover .dl-navigation-pane__links{max-height:min(60dvh,480px)}
.dl-navigation-pane__popover .dl-navigation-pane__links a{font-size:13px;padding-block:8px}
.dl-mdx__document:has([data-slot=navigation-pane][data-embedded=true][data-layout=panel]){padding-inline-end:calc(var(--dl-navigation-pane-width,196px) + 28px)}
.dl-mdx__component-block:has(>[data-slot=navigation-pane]){margin:0;min-height:0}
@media print{
  .dl-navigation-pane,.dl-navigation-pane__floating,.dl-navigation-pane__menu,.dl-navigation-pane__popover{display:none!important}
  .dl-mdx__document:has([data-slot=navigation-pane][data-embedded=true]){padding-inline-end:0!important}
}
</style>
