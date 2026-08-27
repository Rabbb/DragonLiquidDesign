<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { DlBadge, DlButton, DlProgress, type DlTone } from '@dragon-liquid/vue'
import { componentCatalog, componentRoute, type ComponentDefinition } from '../catalog'
import { primaryComponentGroup } from '../componentGroups'

type GuideTarget = {
  id: string
  component: ComponentDefinition
  element?: HTMLElement
  instances: number
  tabValue?: string
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
const autoTriggerActiveId = ref('')
const slotAliases: Record<string, string> = {
  'select-trigger': 'select',
  'select-content': 'select',
  'popover-content': 'popover',
  'tooltip-content': 'tooltip',
}

const current = computed(() => activeIndex.value >= 0 ? targets.value[activeIndex.value] : undefined)
const pendingComponent = computed(() => current.value?.component ?? componentCatalog.find(item => item.id === pendingId.value))
const progress = computed(() => current.value && targets.value.length
  ? ((activeIndex.value + 1) / targets.value.length) * 100
  : 0)
const sectionProgress = computed(() => {
  const value = current.value?.tabValue
  if (!value) return undefined
  const sectionTargets = targets.value.filter(target => target.tabValue === value)
  const index = sectionTargets.findIndex(target => target.id === current.value?.id)
  return index >= 0 ? { index: index + 1, total: sectionTargets.length } : undefined
})

let mutationObserver: MutationObserver | undefined
let scanTimer = 0
let tabTimer = 0
let tabSwitching = false
let autoClickPrepareTimer = 0
let autoClickActionTimer = 0
let autoClickHideTimer = 0
let autoCountdownInterval = 0
let autoClickMarker: HTMLElement | undefined
let guideWasOpen = false
let lastScannedTabValue = ''
const searchedTabs = new Set<string>()
const discoveredTabById = new Map<string, string>()
const instanceCountById = new Map<string, number>()
const autoTriggeredIds = new Set<string>()

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

function elementComponentIds(element: HTMLElement) {
  const slot = element.dataset.slot ?? ''
  return {
    slot,
    ids: new Set([
      normalizeSlot(slot),
      ...(element.dataset.guideComponent?.split(/\s+/).filter(Boolean) ?? []),
    ]),
  }
}

function guideElementDepth(element: HTMLElement) {
  let depth = 0
  let parent = element.parentElement
  while (parent && !parent.matches('.pattern-view')) {
    if (parent.matches('[data-dl][data-slot], [data-guide-component]')) depth += 1
    parent = parent.parentElement
  }
  return depth
}

function compareGuideTargets(a: GuideTarget, b: GuideTarget) {
  if (!a.element || !b.element) return 0
  if (a.element === b.element) return 0
  if (a.element.contains(b.element)) return -1
  if (b.element.contains(a.element)) return 1
  const depthDifference = guideElementDepth(a.element) - guideElementDepth(b.element)
  if (depthDifference) return depthDifference
  const aRect = a.element.getBoundingClientRect()
  const bRect = b.element.getBoundingClientRect()
  if (Math.abs(aRect.top - bRect.top) > 6) return aRect.top - bRect.top
  if (Math.abs(aRect.left - bRect.left) > 6) return aRect.left - bRect.left
  return a.element.compareDocumentPosition(b.element) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
}

function guideTabHints() {
  const host = document.querySelector<HTMLElement>('.pattern-view[data-guide-tabs], .pattern-view [data-guide-tabs]')
  if (!host?.dataset.guideTabs) return new Map<string, string>()
  try {
    return new Map(Object.entries(JSON.parse(host.dataset.guideTabs) as Record<string, string>))
  } catch {
    return new Map<string, string>()
  }
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
  const value = guideTabHints().get(componentId)
  if (!value) return -1
  return triggers.findIndex(trigger => trigger.id.endsWith(`-trigger-${value}`) || trigger.getAttribute('aria-controls')?.endsWith(`-content-${value}`))
}

function scrollElementIntoGuideView(element: HTMLElement, behavior: ScrollBehavior = 'smooth') {
  const rect = element.getBoundingClientRect()
  const topSafeArea = 18
  const bottomSafeArea = 92
  const visible = rect.top >= topSafeArea && rect.bottom <= window.innerHeight - bottomSafeArea
  if (!visible) element.scrollIntoView({ behavior, block: 'nearest', inline: 'nearest' })
  window.setTimeout(updatePosition, visible ? 0 : 260)
}

function scrollCurrentIntoView() {
  const element = current.value?.element
  if (element) scrollElementIntoGuideView(element)
}

function clearAutoClick() {
  window.clearTimeout(autoClickPrepareTimer)
  window.clearTimeout(autoClickActionTimer)
  window.clearTimeout(autoClickHideTimer)
  window.clearInterval(autoCountdownInterval)
  autoClickMarker?.remove()
  autoClickMarker = undefined
  autoTriggerActiveId.value = ''
}

function createAutoCountdownMarker(trigger: HTMLElement, label: string, duration: number) {
  autoClickMarker?.remove()
  const marker = document.createElement('span')
  const wheel = document.createElement('i')
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  const track = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
  const progress = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
  const count = document.createElement('strong')
  const radius = 29
  const circumference = 2 * Math.PI * radius
  marker.dataset.guideIgnore = ''
  marker.setAttribute('aria-hidden', 'true')
  Object.assign(marker.style, {
    position: 'absolute', left: '50%', top: '50%', zIndex: '20', width: '72px', height: '72px',
    borderRadius: '50%', background: 'rgba(4,22,17,.9)', boxShadow: '0 0 0 7px rgba(255,218,91,.055), 0 0 34px rgba(255,205,54,.3)',
    transform: 'translate(-50%,-50%)', pointerEvents: 'none', overflow: 'visible',
  })
  Object.assign(wheel.style, {
    position: 'absolute', inset: '-5px', border: '1px dashed rgba(123,235,207,.52)', borderRadius: '50%',
  })
  wheel.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }], { duration: 1200, iterations: Infinity, easing: 'linear' })
  svg.setAttribute('viewBox', '0 0 72 72')
  Object.assign(svg.style, { position: 'absolute', inset: '0', width: '72px', height: '72px', transform: 'rotate(-90deg)' })
  for (const circle of [track, progress]) {
    circle.setAttribute('cx', '36')
    circle.setAttribute('cy', '36')
    circle.setAttribute('r', String(radius))
    circle.setAttribute('fill', 'none')
    circle.setAttribute('stroke-width', '5')
  }
  track.setAttribute('stroke', 'rgba(255,255,255,.1)')
  progress.setAttribute('stroke', '#ffe078')
  progress.setAttribute('stroke-linecap', 'round')
  progress.setAttribute('stroke-dasharray', String(circumference))
  progress.setAttribute('stroke-dashoffset', '0')
  progress.style.filter = 'drop-shadow(0 0 5px rgba(255,215,90,.65))'
  progress.animate([
    { strokeDashoffset: '0' },
    { strokeDashoffset: String(circumference) },
  ], { duration, easing: 'linear', fill: 'forwards' })
  count.textContent = '3'
  count.dataset.guideCountdown = ''
  Object.assign(count.style, {
    position: 'absolute', inset: '0', display: 'grid', placeItems: 'center', color: '#fff2bd',
    fontSize: '1.25rem', fontWeight: '900', fontFamily: '"Cascadia Code", Consolas, monospace', textShadow: '0 0 14px rgba(255,215,90,.45)',
  })
  marker.title = `倒计时后自动打开 ${label}`
  svg.append(track, progress)
  marker.append(wheel, svg, count)
  trigger.append(marker)
  marker.animate([
    { opacity: 0, transform: 'translate(-50%,-50%) scale(.82)' },
    { opacity: 1, transform: 'translate(-50%,-50%) scale(1)' },
  ], { duration: 220, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'both' })
  const startedAt = performance.now()
  autoCountdownInterval = window.setInterval(() => {
    const remaining = Math.max(1, Math.ceil(3 * (1 - (performance.now() - startedAt) / duration)))
    count.textContent = String(remaining)
  }, 100)
  autoClickMarker = marker
}

function playAutoClick(trigger: HTMLElement) {
  window.clearInterval(autoCountdownInterval)
  const count = autoClickMarker?.querySelector<HTMLElement>('[data-guide-countdown]')
  if (count) count.textContent = '•'
  autoClickMarker?.animate([
    { opacity: 1, transform: 'translate(-50%,-50%) scale(1)' },
    { opacity: 1, transform: 'translate(-50%,-50%) scale(.72)', offset: .32 },
    { opacity: 0, transform: 'translate(-50%,-50%) scale(1.5)' },
  ], { duration: 620, easing: 'cubic-bezier(.16,.84,.24,1)', fill: 'both' })
  trigger.animate([
    { transform: 'scale(1)', filter: 'brightness(1)' },
    { transform: 'scale(.9)', filter: 'brightness(1.5)' },
    { transform: 'scale(1.04)', filter: 'brightness(1.2)' },
    { transform: 'scale(1)', filter: 'brightness(1)' },
  ], { duration: 620, easing: 'cubic-bezier(.2,.8,.2,1)' })
}

function findAutoTrigger(componentId: string) {
  return [...document.querySelectorAll<HTMLElement>('.pattern-view [data-guide-opens]')]
    .find(element => element.dataset.guideOpens?.split(/\s+/).includes(componentId) && isVisible(element))
}

function closeGuideSurfaces(nextTarget?: GuideTarget) {
  const nextElement = nextTarget?.element
  for (const surface of document.querySelectorAll<HTMLElement>('[data-guide-surface]')) {
    if (nextElement && surface.contains(nextElement)) continue
    const surfaceIds = surface.dataset.guideSurface?.split(/\s+/).filter(Boolean) ?? []
    const closer = [...surface.querySelectorAll<HTMLElement>('[data-guide-closes]')]
      .find(element => element.dataset.guideCloses?.split(/\s+/).some(id => surfaceIds.includes(id)))
    closer?.click()
  }
}

function autoTriggerCurrent() {
  const target = current.value
  if (!props.open || !target || target.element || tabSwitching || autoTriggeredIds.has(target.id)) return
  const trigger = findAutoTrigger(target.id)
  if (!trigger) return

  const countdownDuration = 1800
  autoTriggeredIds.add(target.id)
  autoTriggerActiveId.value = target.id
  scrollElementIntoGuideView(trigger, 'auto')
  createAutoCountdownMarker(trigger, target.component.name, countdownDuration)
  autoClickPrepareTimer = window.setTimeout(() => {
    if (!props.open || !trigger.isConnected || current.value?.id !== target.id) return
    playAutoClick(trigger)
    autoClickActionTimer = window.setTimeout(() => trigger.click(), 260)
    autoClickHideTimer = window.setTimeout(() => {
      autoClickMarker?.remove()
      autoClickMarker = undefined
      if (current.value?.id === target.id && !current.value.element) autoTriggerActiveId.value = ''
    }, 900)
  }, countdownDuration)
}

function activateTab(index: number, targetPosition: 'first' | 'last' | 'pending') {
  const state = tabState()
  const trigger = state.triggers[index]
  if (!trigger) return false
  const targetTabValue = tabValue(trigger)
  if (targetPosition !== 'pending') {
    const tabTargets = targets.value.filter(target => target.tabValue === targetTabValue)
    closeGuideSurfaces(targetPosition === 'first' ? tabTargets[0] : tabTargets[tabTargets.length - 1])
  }
  tabSwitching = true
  activeTabIndex.value = index
  activeTabLabel.value = trigger.textContent?.trim() ?? ''
  window.dispatchEvent(new CustomEvent('dl-guide-tab-request', { detail: { value: targetTabValue } }))
  trigger.click()
  window.clearTimeout(tabTimer)
  tabTimer = window.setTimeout(() => {
    tabSwitching = false
    scanTargets(false)
    if (targetPosition !== 'pending' && targets.value.length) {
      const matchingIndices = targets.value
        .map((target, targetIndex) => target.tabValue === targetTabValue ? targetIndex : -1)
        .filter(targetIndex => targetIndex >= 0)
      activeIndex.value = matchingIndices.length
        ? targetPosition === 'first' ? matchingIndices[0] : matchingIndices[matchingIndices.length - 1]
        : targetPosition === 'first' ? 0 : targets.value.length - 1
      nextTick(() => {
        scrollCurrentIntoView()
        autoTriggerCurrent()
      })
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
  const state = tabState()
  const previousId = current.value?.id
  const grouped = new Map<string, HTMLElement[]>()

  for (const element of collectElements()) {
    const { slot, ids } = elementComponentIds(element)
    for (const id of ids) {
      if (!componentCatalog.some(component => component.id === id)) continue
      const group = grouped.get(id) ?? []
      if (slot === 'select-content' && group.length) continue
      group.push(element)
      grouped.set(id, group)
    }
  }

  const declaredHints = guideTabHints()
  const currentTabValue = state.index >= 0 ? tabValue(state.triggers[state.index]) : ''
  const aggregateTabs = state.triggers.length > 1 && declaredHints.size > 0
  const manuallyChangedTab = aggregateTabs
    && Boolean(lastScannedTabValue)
    && currentTabValue !== lastScannedTabValue
    && !tabSwitching

  if (aggregateTabs) {
    for (const [id, elements] of grouped) {
      if (declaredHints.has(id) || discoveredTabById.has(id)) continue
      const hasPanelElement = elements.some(element => Boolean(element.closest('[role="tabpanel"]')))
      const hasExternalElement = elements.some(element => !element.closest('[role="tabpanel"]') && !element.closest('[data-dl-layer]'))
      if (currentTabValue && hasPanelElement && !hasExternalElement) {
        discoveredTabById.set(id, currentTabValue)
      }
    }

    const resolvedHints = new Map([...declaredHints, ...discoveredTabById])
    const externalTargets = [...grouped.entries()].flatMap(([id, elements]) => {
      if (resolvedHints.has(id)) return []
      const externalElements = elements.filter(element => !element.closest('[role="tabpanel"]') && !element.closest('[data-dl-layer]'))
      const component = componentCatalog.find(item => item.id === id)
      return component && externalElements.length
        ? [{ id, component, element: externalElements[0], instances: externalElements.length }]
        : []
    }).sort(compareGuideTargets)
    const hintedTargets = [...resolvedHints.entries()].flatMap(([id, targetTab]) => {
      const component = componentCatalog.find(item => item.id === id)
      if (!component) return []
      const elements = currentTabValue === targetTab
        ? (grouped.get(id) ?? []).filter(element => Boolean(element.closest('[role="tabpanel"]') || element.closest('[data-dl-layer]')))
        : []
      if (elements.length) instanceCountById.set(id, elements.length)
      return [{
        id,
        component,
        element: elements[0],
        instances: instanceCountById.get(id) ?? 0,
        tabValue: targetTab,
      }]
    })
    targets.value = [...externalTargets, ...hintedTargets]
  } else {
    targets.value = [...grouped.entries()].flatMap(([id, elements]) => {
      const component = componentCatalog.find(item => item.id === id)
      return component ? [{ id, component, element: elements[0], instances: elements.length }] : []
    }).sort(compareGuideTargets)
  }

  const desiredId = pendingId.value || previousId
  const desiredIndex = desiredId ? targets.value.findIndex(item => item.id === desiredId) : -1
  const manualTabStartIndex = manuallyChangedTab
    ? targets.value.findIndex(target => target.tabValue === currentTabValue)
    : -1
  if (manualTabStartIndex >= 0) {
    activeIndex.value = manualTabStartIndex
    pendingId.value = ''
  } else if (desiredIndex >= 0) {
    activeIndex.value = desiredIndex
    pendingId.value = ''
  } else if (pendingId.value) {
    activeIndex.value = -1
  } else {
    activeIndex.value = Math.min(Math.max(activeIndex.value, 0), targets.value.length - 1)
  }
  lastScannedTabValue = aggregateTabs ? currentTabValue : ''
  const selectedTarget = current.value
  if (selectedTarget?.element && autoTriggerActiveId.value === selectedTarget.id) {
    clearAutoClick()
  } else if (!selectedTarget?.element && (!selectedTarget?.tabValue || selectedTarget.tabValue === currentTabValue) && !tabSwitching) {
    autoTriggerCurrent()
  }

  nextTick(() => {
    const target = current.value
    if (target?.tabValue && target.tabValue !== currentTabValue && !tabSwitching) {
      const targetTabIndex = state.triggers.findIndex(trigger => tabValue(trigger) === target.tabValue)
      if (targetTabIndex >= 0) activateTab(targetTabIndex, 'pending')
      return
    }
    if (!target?.element) {
      autoTriggerCurrent()
      return
    }
    if (scrollToTarget && target?.element) {
      scrollElementIntoGuideView(target.element)
      return
    }
    window.setTimeout(updatePosition, 0)
  })
  if (pendingId.value && desiredIndex < 0 && !aggregateTabs) window.setTimeout(searchPendingInTabs, 0)
}

function scheduleScan() {
  window.clearTimeout(scanTimer)
  scanTimer = window.setTimeout(() => scanTargets(false), 80)
}

function updatePosition() {
  const target = current.value?.element
  if (!target) return
  if (!target.isConnected) {
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
  const nextIndex = (index + targets.value.length) % targets.value.length
  const nextTarget = targets.value[nextIndex]
  closeGuideSurfaces(nextTarget)
  const previousId = current.value?.id
  clearAutoClick()
  if (previousId) autoTriggeredIds.delete(previousId)
  pendingId.value = ''
  searchedTabs.clear()
  activeIndex.value = nextIndex
  const target = current.value
  const state = tabState()
  const currentTabValue = state.index >= 0 ? tabValue(state.triggers[state.index]) : ''
  if (target?.tabValue && target.tabValue !== currentTabValue) {
    const targetTabIndex = state.triggers.findIndex(trigger => tabValue(trigger) === target.tabValue)
    if (targetTabIndex >= 0) {
      activateTab(targetTabIndex, 'pending')
      return
    }
  }
  nextTick(() => {
    scrollCurrentIntoView()
    autoTriggerCurrent()
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
  discoveredTabById.clear()
  instanceCountById.clear()
  autoTriggeredIds.clear()
  lastScannedTabValue = ''
  clearAutoClick()
  pendingId.value = props.initialComponentId ?? ''
  activeIndex.value = -1
  scanTargets(true)
}

watch(() => [props.open, props.pageKey, props.initialComponentId] as const, ([open]) => {
  if (open) {
    guideWasOpen = true
    nextTick(startGuide)
  }
  else {
    if (guideWasOpen) closeGuideSurfaces()
    guideWasOpen = false
    clearAutoClick()
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
  clearAutoClick()
  mutationObserver?.disconnect()
  window.removeEventListener('resize', updatePosition)
  window.removeEventListener('scroll', updatePosition, true)
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="dl-control-guide" data-guide-ignore>
      <div v-if="current?.element" class="dl-control-guide__target" :style="targetStyle">
        <span>{{ activeIndex + 1 }}</span>
      </div>

      <aside
        v-if="current?.element"
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
          <DlBadge tone="muted" variant="outline" size="sm">{{ primaryComponentGroup('family', current.component.id)?.label }}</DlBadge>
          <span>当前分区 {{ current.instances }} 个实例</span>
          <span>{{ current.tabValue ? `Tab：${activeTabLabel}` : '公共区域' }}</span>
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
        <small class="dl-control-guide__count">
          全局 {{ activeIndex + 1 }} / {{ targets.length }}
          <template v-if="sectionProgress"> · 本 Tab {{ sectionProgress.index }} / {{ sectionProgress.total }}</template>
          · 由外而内、由上到下
        </small>
      </aside>

      <aside v-else-if="!autoTriggerActiveId" class="dl-control-guide__popover dl-control-guide__popover--waiting" role="status" aria-live="polite">
        <header>
          <div><small>DYNAMIC COMPONENT POPOVER</small><b>{{ pendingComponent?.name ?? '等待控件渲染' }}</b></div>
          <button type="button" aria-label="关闭控件导览" @click="emit('update:open', false)">×</button>
        </header>
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
        <p v-if="pendingComponent">{{ pendingComponent.summary }}</p>
        <p>这个控件属于整页导览队列，但目前尚未挂载。请触发相应的折叠区或条件选项；控件出现后，导览泡泡会自动定位。</p>
        <footer>
          <DlButton variant="secondary" size="sm" @click="goTo(activeIndex - 1)">← 上一个</DlButton>
          <DlButton variant="primary" size="sm" @click="scanTargets(false)">重新扫描</DlButton>
          <DlButton variant="secondary" size="sm" @click="goTo(activeIndex + 1)">下一个 →</DlButton>
        </footer>
        <small v-if="current" class="dl-control-guide__count">
          全局 {{ activeIndex + 1 }} / {{ targets.length }}
          <template v-if="sectionProgress"> · 本 Tab {{ sectionProgress.index }} / {{ sectionProgress.total }}</template>
          · 可跳过尚未挂载的控件
        </small>
      </aside>

      <div class="dl-control-guide__dock">
        <span>
          <b>控件导览</b>{{ targets.length }} 种整页控件
          <small v-if="current?.tabValue && sectionProgress">{{ activeTabLabel }} · 全局 {{ activeIndex + 1 }}/{{ targets.length }} · 分区 {{ sectionProgress.index }}/{{ sectionProgress.total }}</small>
          <small v-else-if="current">公共区域 · 全局 {{ activeIndex + 1 }}/{{ targets.length }}</small>
          <small v-else-if="activeTabLabel">{{ activeTabLabel }} {{ activeTabIndex + 1 }}/{{ tabCount }}</small>
        </span>
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
.dl-control-guide__popover--waiting > footer { grid-template-columns: 1fr auto 1fr; }
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
