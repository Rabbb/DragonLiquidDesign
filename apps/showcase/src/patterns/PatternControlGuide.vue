<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { DlBadge, DlButton, DlProgress, type DlTone } from '@dragon-liquid/vue'
import { componentCatalog, componentCategories, componentRoute, type ComponentDefinition } from '../catalog'

type GuideTarget = {
  id: string
  component: ComponentDefinition
  element: HTMLElement
  instances: number
}

const props = defineProps<{
  open: boolean
  pageKey: string
  initialComponentId?: string
}>()
const emit = defineEmits<{ 'update:open': [value: boolean] }>()

const targets = shallowRef<GuideTarget[]>([])
const activeIndex = ref(-1)
const pendingId = ref('')
const targetStyle = ref<Record<string, string>>({})
const bubbleStyle = ref<Record<string, string>>({})
const placement = ref<'left' | 'right' | 'top' | 'bottom' | 'center'>('right')
const activeTabLabel = ref('')
const activeTabIndex = ref(-1)
const tabCount = ref(0)
const guideTabs = ref<Array<{ index: number; label: string }>>([])
const categoryById = new Map(componentCategories.map(item => [item.id, item.label]))
const slotAliases: Record<string, string> = {
  'select-trigger': 'select',
  'select-content': 'select',
  'popover-content': 'popover',
  'tooltip-content': 'tooltip',
}

const current = computed(() => activeIndex.value >= 0 ? targets.value[activeIndex.value] : undefined)
const pendingComponent = computed(() => componentCatalog.find(item => item.id === pendingId.value))
const progress = computed(() => current.value && targets.value.length
  ? ((activeIndex.value + 1) / targets.value.length) * 100
  : 0)

let mutationObserver: MutationObserver | undefined
let scanTimer = 0
let tabTimer = 0
let tabSwitching = false
const searchedTabs = new Set<string>()

function normalizeSlot(slot: string) {
  return slotAliases[slot] ?? slot
}

function isVisible(element: HTMLElement) {
  const style = window.getComputedStyle(element)
  const rect = element.getBoundingClientRect()
  return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) !== 0 && rect.width > 0 && rect.height > 0
}

function collectElements() {
  return [
    ...document.querySelectorAll<HTMLElement>('.pattern-view [data-dl][data-slot]'),
    ...document.querySelectorAll<HTMLElement>('.pattern-view [data-guide-component]'),
    ...document.querySelectorAll<HTMLElement>('[data-dl][data-slot][data-dl-layer]'),
    ...document.querySelectorAll<HTMLElement>('[data-dl-layer] [data-dl][data-slot]'),
    ...document.querySelectorAll<HTMLElement>('[data-dl-layer] [data-guide-component]'),
  ].filter((element, index, elements) => (
    elements.indexOf(element) === index
    && !element.closest('[data-guide-ignore]')
    && isVisible(element)
  ))
}

function tabState() {
  const root = document.querySelector<HTMLElement>('.pattern-view [data-slot="tabs"]')
  const triggers = root ? [...root.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])')] : []
  const index = triggers.findIndex(trigger => trigger.getAttribute('aria-selected') === 'true' || trigger.dataset.state === 'active')
  activeTabIndex.value = index
  activeTabLabel.value = index >= 0 ? triggers[index].textContent?.trim() ?? '' : ''
  tabCount.value = triggers.length
  guideTabs.value = triggers.map((trigger, triggerIndex) => ({
    index: triggerIndex,
    label: trigger.textContent?.trim() || `Tab ${triggerIndex + 1}`,
  }))
  return { triggers, index }
}

function tabKey(trigger: HTMLButtonElement, index: number) {
  return trigger.id || trigger.getAttribute('aria-controls') || `${index}:${trigger.textContent?.trim() ?? ''}`
}

function tabValue(trigger: HTMLButtonElement) {
  const triggerMarker = '-trigger-'
  const contentMarker = '-content-'
  if (trigger.id.includes(triggerMarker)) return trigger.id.split(triggerMarker).pop() ?? ''
  const controls = trigger.getAttribute('aria-controls') ?? ''
  return controls.includes(contentMarker) ? controls.split(contentMarker).pop() ?? '' : ''
}

function hintedTabIndex(componentId: string, triggers: HTMLButtonElement[]) {
  const host = document.querySelector<HTMLElement>('.pattern-view[data-guide-tabs], .pattern-view [data-guide-tabs]')
  if (!host?.dataset.guideTabs) return -1
  try {
    const hints = JSON.parse(host.dataset.guideTabs) as Record<string, string>
    const value = hints[componentId]
    if (!value) return -1
    return triggers.findIndex(trigger => trigger.id.endsWith(`-trigger-${value}`) || trigger.getAttribute('aria-controls')?.endsWith(`-content-${value}`))
  } catch {
    return -1
  }
}

function scrollCurrentIntoView() {
  current.value?.element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
  window.setTimeout(updatePosition, 260)
}

function activateTab(index: number, targetPosition: 'first' | 'last' | 'pending') {
  const state = tabState()
  const trigger = state.triggers[index]
  if (!trigger) return false
  tabSwitching = true
  window.dispatchEvent(new CustomEvent('dl-guide-tab-request', { detail: { value: tabValue(trigger) } }))
  trigger.click()
  window.clearTimeout(tabTimer)
  tabTimer = window.setTimeout(() => {
    tabSwitching = false
    scanTargets(false)
    if (targetPosition !== 'pending' && targets.value.length) {
      activeIndex.value = targetPosition === 'first' ? 0 : targets.value.length - 1
      nextTick(scrollCurrentIntoView)
    }
  }, 110)
  return true
}

function searchPendingInTabs() {
  if (!pendingId.value || tabSwitching) return
  const state = tabState()
  if (state.triggers.length < 2) return
  const hintedIndex = hintedTabIndex(pendingId.value, state.triggers)
  if (hintedIndex >= 0) {
    if (hintedIndex !== state.index) activateTab(hintedIndex, 'pending')
    return
  }
  if (state.index >= 0) searchedTabs.add(tabKey(state.triggers[state.index], state.index))
  const nextIndex = state.triggers.findIndex((trigger, index) => !searchedTabs.has(tabKey(trigger, index)))
  if (nextIndex >= 0) activateTab(nextIndex, 'pending')
}

function scanTargets(scrollToTarget = false) {
  if (!props.open) return
  tabState()
  const previousId = current.value?.id
  const grouped = new Map<string, HTMLElement[]>()

  for (const element of collectElements()) {
    const slot = element.dataset.slot ?? ''
    const ids = new Set([
      normalizeSlot(slot),
      ...(element.dataset.guideComponent?.split(/\s+/).filter(Boolean) ?? []),
    ])
    for (const id of ids) {
      if (!componentCatalog.some(component => component.id === id)) continue
      const group = grouped.get(id) ?? []
      if (slot === 'select-content' && group.length) continue
      group.push(element)
      grouped.set(id, group)
    }
  }

  targets.value = [...grouped.entries()].flatMap(([id, elements]) => {
    const component = componentCatalog.find(item => item.id === id)
    return component ? [{ id, component, element: elements[0], instances: elements.length }] : []
  })

  const desiredId = pendingId.value || previousId
  const desiredIndex = desiredId ? targets.value.findIndex(item => item.id === desiredId) : -1
  if (desiredIndex >= 0) {
    activeIndex.value = desiredIndex
    pendingId.value = ''
  } else if (pendingId.value) {
    activeIndex.value = -1
  } else {
    activeIndex.value = Math.min(Math.max(activeIndex.value, 0), targets.value.length - 1)
  }

  nextTick(() => {
    if (scrollToTarget && current.value) current.value.element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
    window.setTimeout(updatePosition, scrollToTarget ? 260 : 0)
  })
  if (pendingId.value && desiredIndex < 0) window.setTimeout(searchPendingInTabs, 0)
}

function scheduleScan() {
  window.clearTimeout(scanTimer)
  scanTimer = window.setTimeout(() => scanTargets(false), 80)
}

function updatePosition() {
  const target = current.value?.element
  if (!target?.isConnected) {
    if (props.open) scheduleScan()
    return
  }

  const rect = target.getBoundingClientRect()
  const gap = 18
  const margin = 12
  const bubbleWidth = Math.min(370, window.innerWidth - margin * 2)
  const bubbleElement = document.querySelector<HTMLElement>('.dl-control-guide__popover')
  const bubbleHeight = Math.min(bubbleElement?.offsetHeight ?? 286, window.innerHeight - margin * 2)
  let left = rect.right + gap
  let top = Math.min(Math.max(rect.top + rect.height / 2 - bubbleHeight / 2, margin), window.innerHeight - bubbleHeight - margin)
  let nextPlacement: typeof placement.value = 'right'

  if (left + bubbleWidth > window.innerWidth - margin) {
    if (rect.left - gap - bubbleWidth >= margin) {
      left = rect.left - gap - bubbleWidth
      nextPlacement = 'left'
    } else {
      left = Math.min(Math.max(rect.left + rect.width / 2 - bubbleWidth / 2, margin), window.innerWidth - bubbleWidth - margin)
      if (rect.bottom + gap + bubbleHeight <= window.innerHeight - margin) {
        top = rect.bottom + gap
        nextPlacement = 'bottom'
      } else {
        top = Math.max(margin, rect.top - gap - bubbleHeight)
        nextPlacement = 'top'
      }
    }
  }

  placement.value = nextPlacement
  targetStyle.value = {
    left: `${Math.max(0, rect.left - 6)}px`,
    top: `${Math.max(0, rect.top - 6)}px`,
    width: `${rect.width + 12}px`,
    height: `${rect.height + 12}px`,
  }
  bubbleStyle.value = { left: `${left}px`, top: `${top}px`, width: `${bubbleWidth}px` }
}

function goTo(index: number) {
  if (!targets.value.length) return
  pendingId.value = ''
  searchedTabs.clear()
  if (index >= targets.value.length && switchGuideTab(1)) return
  if (index < 0 && switchGuideTab(-1)) return
  activeIndex.value = (index + targets.value.length) % targets.value.length
  nextTick(() => {
    scrollCurrentIntoView()
  })
}

function switchGuideTab(direction: 1 | -1) {
  const state = tabState()
  if (state.triggers.length < 2 || state.index < 0) return false
  pendingId.value = ''
  searchedTabs.clear()
  const nextIndex = (state.index + direction + state.triggers.length) % state.triggers.length
  return activateTab(nextIndex, direction > 0 ? 'first' : 'last')
}

function toneFor(component: ComponentDefinition): DlTone {
  if (component.maturity === 'alpha') return 'warning'
  if (component.maturity === 'custom') return 'accent'
  return 'success'
}

function handleKeydown(event: KeyboardEvent) {
  if (!props.open) return
  if (event.key === 'Escape') emit('update:open', false)
  if (event.key === 'ArrowRight') goTo(activeIndex.value + 1)
  if (event.key === 'ArrowLeft') goTo(activeIndex.value - 1)
}

function startGuide() {
  searchedTabs.clear()
  pendingId.value = props.initialComponentId ?? ''
  activeIndex.value = -1
  scanTargets(true)
}

watch(() => [props.open, props.pageKey, props.initialComponentId] as const, ([open]) => {
  if (open) nextTick(startGuide)
  else {
    targets.value = []
    activeIndex.value = -1
    pendingId.value = ''
  }
}, { immediate: true })

onMounted(() => {
  window.addEventListener('resize', updatePosition)
  window.addEventListener('scroll', updatePosition, true)
  window.addEventListener('keydown', handleKeydown)
  mutationObserver = new MutationObserver(mutations => {
    const externalMutation = mutations.some(mutation => {
      const target = mutation.target instanceof Element ? mutation.target : mutation.target.parentElement
      return !target?.closest('[data-guide-ignore]')
    })
    if (externalMutation) scheduleScan()
  })
  mutationObserver.observe(document.body, { childList: true, subtree: true })
})

onBeforeUnmount(() => {
  window.clearTimeout(scanTimer)
  window.clearTimeout(tabTimer)
  mutationObserver?.disconnect()
  window.removeEventListener('resize', updatePosition)
  window.removeEventListener('scroll', updatePosition, true)
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="dl-control-guide" data-guide-ignore>
      <div v-if="current" class="dl-control-guide__target" :style="targetStyle">
        <span>{{ activeIndex + 1 }}</span>
      </div>

      <aside
        v-if="current"
        class="dl-control-guide__popover"
        :data-placement="placement"
        :style="bubbleStyle"
        role="dialog"
        aria-live="polite"
        :aria-label="`${current.component.name} 控件简介`"
      >
        <header>
          <div><small>DYNAMIC COMPONENT POPOVER</small><b>{{ current.component.name }}</b></div>
          <button type="button" aria-label="关闭控件导览" @click="emit('update:open', false)">×</button>
        </header>
        <div class="dl-control-guide__badges">
          <DlBadge :tone="toneFor(current.component)" variant="outline" size="sm">{{ current.component.maturity }}</DlBadge>
          <DlBadge tone="muted" variant="outline" size="sm">{{ categoryById.get(current.component.category) }}</DlBadge>
          <span>本页 {{ current.instances }} 个实例</span>
          <span v-if="activeTabLabel">Tab：{{ activeTabLabel }}</span>
        </div>
        <nav v-if="guideTabs.length > 1" class="dl-control-guide__tabs" aria-label="导览页面分区">
          <button
            v-for="tabItem in guideTabs"
            :key="tabItem.index"
            type="button"
            :class="{ active: tabItem.index === activeTabIndex }"
            :aria-current="tabItem.index === activeTabIndex ? 'page' : undefined"
            @click="activateTab(tabItem.index, 'first')"
          >
            {{ tabItem.label }}
          </button>
        </nav>
        <p>{{ current.component.summary }}</p>
        <div class="dl-control-guide__rule"><span>通用定义</span><b>与当前业务场景无关</b></div>
        <DlProgress :model-value="progress" tone="accent" size="sm" />
        <footer>
          <DlButton variant="secondary" size="sm" @click="goTo(activeIndex - 1)">← 上一个</DlButton>
          <a :href="componentRoute(current.id, current.component.scenarios[0].id)"><DlButton variant="primary" size="sm">案例与 API</DlButton></a>
          <DlButton variant="secondary" size="sm" @click="goTo(activeIndex + 1)">下一个 →</DlButton>
        </footer>
        <small class="dl-control-guide__count">{{ activeIndex + 1 }} / {{ targets.length }} · 到达边界后自动切换 Tab</small>
      </aside>

      <aside v-else class="dl-control-guide__popover dl-control-guide__popover--waiting" role="status" aria-live="polite">
        <header>
          <div><small>DYNAMIC COMPONENT POPOVER</small><b>{{ pendingComponent?.name ?? '等待控件渲染' }}</b></div>
          <button type="button" aria-label="关闭控件导览" @click="emit('update:open', false)">×</button>
        </header>
        <p v-if="pendingComponent">{{ pendingComponent.summary }}</p>
        <p>这个控件目前尚未挂载。请在页面中触发相应操作；控件出现后，导览泡泡会自动定位。</p>
        <footer>
          <DlButton variant="secondary" size="sm" @click="pendingId = ''; scanTargets(true)">先看当前控件</DlButton>
          <DlButton variant="primary" size="sm" @click="scanTargets(false)">重新扫描</DlButton>
        </footer>
      </aside>

      <div class="dl-control-guide__dock">
        <span><b>控件导览</b>{{ targets.length }} 种可见控件<small v-if="activeTabLabel">{{ activeTabLabel }} {{ activeTabIndex + 1 }}/{{ tabCount }}</small></span>
        <button v-if="tabCount > 1" type="button" @click="switchGuideTab(1)">下一 Tab</button>
        <button type="button" @click="scanTargets(false)">重新扫描</button>
        <button type="button" @click="emit('update:open', false)">退出 ESC</button>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.dl-control-guide { position: fixed; inset: 0; z-index: 2600; pointer-events: none; }
.dl-control-guide__target { position: fixed; border: 2px solid rgba(255,222,117,.95); border-radius: 14px; background: rgba(255,218,91,.055); box-shadow: 0 0 0 5px rgba(255,218,91,.1), 0 0 34px rgba(255,218,91,.24), inset 0 0 18px rgba(255,255,255,.06); transition: left .2s ease, top .2s ease, width .2s ease, height .2s ease; }
.dl-control-guide__target > span { position: absolute; top: -13px; right: -13px; display: grid; place-items: center; width: 25px; height: 25px; border: 2px solid #112018; border-radius: 50%; color: #182013; background: #ffe078; font: 700 .65rem "Cascadia Code", Consolas, monospace; box-shadow: 0 5px 18px rgba(0,0,0,.35); }
.dl-control-guide__popover { position: fixed; display: grid; gap: 13px; padding: 17px; border: 1px solid rgba(255,225,137,.3); border-radius: 18px; color: var(--dl-text); background: radial-gradient(circle at 18% 0%, rgba(255,220,112,.12), transparent 34%), linear-gradient(150deg, rgba(15,45,36,.98), rgba(4,19,16,.98)); box-shadow: 0 28px 90px rgba(0,0,0,.58), inset 0 1px 0 rgba(255,255,255,.08); backdrop-filter: blur(22px); pointer-events: auto; }
.dl-control-guide__popover::before { position: absolute; width: 13px; height: 13px; border: solid rgba(255,225,137,.3); background: #0b2820; content: ""; transform: rotate(45deg); }
.dl-control-guide__popover[data-placement="right"]::before { top: 50%; left: -7px; border-width: 0 0 1px 1px; }
.dl-control-guide__popover[data-placement="left"]::before { top: 50%; right: -7px; border-width: 1px 1px 0 0; }
.dl-control-guide__popover[data-placement="bottom"]::before { top: -7px; left: 50%; border-width: 1px 0 0 1px; }
.dl-control-guide__popover[data-placement="top"]::before { bottom: -7px; left: 50%; border-width: 0 1px 1px 0; }
.dl-control-guide__popover > header { display: flex; align-items: flex-start; justify-content: space-between; gap: 14px; }
.dl-control-guide__popover > header > div { display: grid; gap: 4px; }
.dl-control-guide__popover > header small { color: #82e8cd; font-size: .56rem; font-weight: 900; letter-spacing: .1em; }
.dl-control-guide__popover > header b { color: #fff; font-size: 1rem; }
.dl-control-guide__popover > header button { display: grid; place-items: center; width: 28px; height: 28px; border: 1px solid rgba(255,255,255,.1); border-radius: 9px; color: var(--dl-text-muted); background: rgba(255,255,255,.04); cursor: pointer; }
.dl-control-guide__badges { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
.dl-control-guide__badges > span { color: var(--dl-text-faint); font-size: .62rem; }
.dl-control-guide__tabs { display: flex; flex-wrap: wrap; gap: 5px; padding: 5px; border: 1px solid rgba(255,255,255,.07); border-radius: 11px; background: rgba(0,0,0,.14); }
.dl-control-guide__tabs button { flex: 1 1 auto; padding: 6px 8px; border: 1px solid transparent; border-radius: 8px; color: var(--dl-text-faint); background: transparent; font-size: .58rem; cursor: pointer; transition: border-color .16s ease, color .16s ease, background .16s ease; }
.dl-control-guide__tabs button:hover { color: #fff; background: rgba(255,255,255,.045); }
.dl-control-guide__tabs button.active { border-color: rgba(255,224,120,.28); color: #ffe49a; background: rgba(255,214,72,.1); box-shadow: inset 0 1px 0 rgba(255,255,255,.06); }
.dl-control-guide__popover > p { margin: 0; color: var(--dl-text-muted); font-size: .75rem; line-height: 1.72; }
.dl-control-guide__rule { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 9px 10px; border: 1px solid rgba(255,255,255,.07); border-radius: 10px; background: rgba(255,255,255,.025); font-size: .63rem; }
.dl-control-guide__rule span { color: var(--dl-text-faint); }
.dl-control-guide__rule b { color: #ffe8a1; }
.dl-control-guide__popover > footer { display: grid; grid-template-columns: 1fr auto 1fr; gap: 6px; }
.dl-control-guide__popover > footer > :last-child { justify-self: stretch; }
.dl-control-guide__count { color: var(--dl-text-faint); font-size: .58rem; text-align: center; }
.dl-control-guide__popover--waiting { top: 50%; left: 50%; width: min(390px, calc(100vw - 24px)); transform: translate(-50%,-50%); }
.dl-control-guide__popover--waiting::before { display: none; }
.dl-control-guide__popover--waiting > footer { grid-template-columns: 1fr 1fr; }
.dl-control-guide__dock { position: fixed; right: 18px; bottom: 18px; display: flex; align-items: center; gap: 6px; padding: 7px; border: 1px solid rgba(255,255,255,.12); border-radius: 14px; background: rgba(3,18,15,.93); box-shadow: 0 16px 48px rgba(0,0,0,.4); backdrop-filter: blur(18px); pointer-events: auto; }
.dl-control-guide__dock span { display: grid; gap: 1px; padding: 0 8px; color: var(--dl-text-faint); font-size: .57rem; }
.dl-control-guide__dock span b { color: #fff; font-size: .66rem; }
.dl-control-guide__dock span small { color: #82e8cd; font-size: .54rem; }
.dl-control-guide__dock button { padding: 7px 9px; border: 1px solid rgba(255,255,255,.09); border-radius: 8px; color: var(--dl-text-muted); background: rgba(255,255,255,.035); font-size: .62rem; cursor: pointer; }
.dl-control-guide__dock button:hover { color: #fff; border-color: rgba(255,225,137,.22); }
@media (max-width: 640px) {
  .dl-control-guide__dock { right: 8px; bottom: 8px; left: 8px; justify-content: space-between; }
  .dl-control-guide__dock span { display: none; }
  .dl-control-guide__popover { max-height: min(420px, calc(100dvh - 24px)); overflow: auto; }
  .dl-control-guide__popover > footer { grid-template-columns: 1fr 1fr; }
  .dl-control-guide__popover > footer a { grid-column: 1 / -1; grid-row: 1; }
}
</style>
