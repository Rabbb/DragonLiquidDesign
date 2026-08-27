<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
  discoverDlFocusNavigatorZones,
  type DlFocusNavigatorResolvedZone,
  type DlFocusNavigatorZoneDefinition,
} from './focus-navigator'

const open = defineModel<boolean>('open', { default: false })
const props = withDefaults(defineProps<{
  activationKey?: string
  title?: string
  scope?: string
  zones?: readonly DlFocusNavigatorZoneDefinition[]
  autoDiscover?: boolean
  targetSelector?: string
  maxTargetsPerZone?: number
  wrap?: boolean
}>(), {
  activationKey: 'j',
  title: '快速聚焦',
  scope: 'body',
  zones: undefined,
  autoDiscover: true,
  targetSelector: undefined,
  maxTargetsPerZone: 40,
  wrap: true,
})

const emit = defineEmits<{
  open: []
  close: []
  empty: []
  'zone-change': [zone: DlFocusNavigatorResolvedZone]
  'target-change': [zone: DlFocusNavigatorResolvedZone, targetIndex: number]
  focus: [zone: DlFocusNavigatorResolvedZone, element: HTMLElement]
}>()

const panel = ref<HTMLElement>()
const resolvedZones = ref<DlFocusNavigatorResolvedZone[]>([])
const activeZoneIndex = ref(0)
const targetIndexes = ref<Record<string, number>>({})
const chordMode = ref(false)
let previousFocus: HTMLElement | null = null
let previousBodyOverflow = ''
let prepared = false

const activeZone = computed(() => resolvedZones.value[activeZoneIndex.value])
const activeTargetIndex = computed(() => activeZone.value ? targetIndexes.value[activeZone.value.id] ?? 0 : 0)
const activeTarget = computed(() => activeZone.value?.targets[activeTargetIndex.value])
const activeOptionId = computed(() => activeTarget.value ? `dl-focus-navigator-${activeTarget.value.id}` : undefined)
const shortcutLabel = computed(() => `Alt+${props.activationKey.toLocaleUpperCase()}`)

function scopeRoot() {
  return document.querySelector(props.scope) ?? document.body
}

function refresh() {
  const activeElement = document.activeElement instanceof HTMLElement ? document.activeElement : null
  resolvedZones.value = discoverDlFocusNavigatorZones({
    scope: scopeRoot(),
    zones: props.zones,
    autoDiscover: props.autoDiscover,
    targetSelector: props.targetSelector,
    maxTargetsPerZone: props.maxTargetsPerZone,
  })
  targetIndexes.value = Object.fromEntries(resolvedZones.value.map(zone => [zone.id, 0]))

  const zoneIndex = resolvedZones.value.findIndex(zone => zone.targets.some(target => target.element === activeElement || target.element.contains(activeElement)))
  activeZoneIndex.value = zoneIndex >= 0 ? zoneIndex : 0
  const zone = resolvedZones.value[activeZoneIndex.value]
  if (zone && activeElement) {
    const targetIndex = zone.targets.findIndex(target => target.element === activeElement || target.element.contains(activeElement))
    if (targetIndex >= 0) targetIndexes.value[zone.id] = targetIndex
  }
  return resolvedZones.value
}

function boundedIndex(current: number, delta: number, length: number) {
  if (!length) return 0
  if (props.wrap) return (current + delta + length) % length
  return Math.max(0, Math.min(length - 1, current + delta))
}

function moveZone(delta: number) {
  if (!resolvedZones.value.length) return
  activeZoneIndex.value = boundedIndex(activeZoneIndex.value, delta, resolvedZones.value.length)
  const zone = activeZone.value
  if (zone) emit('zone-change', zone)
}

function moveTarget(delta: number) {
  const zone = activeZone.value
  if (!zone) return
  targetIndexes.value = {
    ...targetIndexes.value,
    [zone.id]: boundedIndex(activeTargetIndex.value, delta, zone.targets.length),
  }
  emit('target-change', zone, targetIndexes.value[zone.id])
}

function selectTarget(index: number) {
  const zone = activeZone.value
  if (!zone) return
  targetIndexes.value = { ...targetIndexes.value, [zone.id]: index }
}

function prepare(chord = false) {
  if (open.value) {
    if (!resolvedZones.value.length) {
      previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
      if (!refresh().length) {
        open.value = false
        emit('empty')
        return false
      }
    }
    chordMode.value = chordMode.value || chord
    return true
  }
  previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
  if (!refresh().length) {
    emit('empty')
    return false
  }
  prepared = true
  chordMode.value = chord
  open.value = true
  emit('open')
  return true
}

function show() {
  prepare(false)
}

function close(restoreFocus = true) {
  if (!open.value) return
  open.value = false
  chordMode.value = false
  emit('close')
  if (restoreFocus) nextTick(() => previousFocus?.focus({ preventScroll: true }))
}

function focusSelected() {
  let zone = activeZone.value
  let target = activeTarget.value
  if (!target?.element.isConnected) {
    refresh()
    zone = activeZone.value
    target = activeTarget.value
  }
  if (!zone || !target) return close()
  close(false)
  nextTick(() => {
    target.element.scrollIntoView({ block: 'center', inline: 'nearest' })
    target.element.focus({ preventScroll: true })
    emit('focus', zone!, target!.element)
  })
}

function handleGlobalKeydown(event: KeyboardEvent) {
  if (event.isComposing) return
  const activation = event.altKey && event.key.toLocaleLowerCase() === props.activationKey.toLocaleLowerCase()
  if (!open.value && activation) {
    event.preventDefault()
    event.stopImmediatePropagation()
    if (event.repeat || !prepare(true)) return
    moveTarget(event.shiftKey ? -1 : 1)
    return
  }
  if (!open.value) return

  if (activation) {
    event.preventDefault()
    event.stopImmediatePropagation()
    if (!event.repeat) moveZone(event.shiftKey ? -1 : 1)
    chordMode.value = true
    return
  }

  const handled = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'Enter', 'Escape', 'Tab'].includes(event.key)
  if (!handled) return
  event.preventDefault()
  event.stopImmediatePropagation()

  if (event.key === 'ArrowLeft') moveZone(-1)
  else if (event.key === 'ArrowRight') moveZone(1)
  else if (event.key === 'ArrowUp' || (event.key === 'Tab' && event.shiftKey)) moveTarget(-1)
  else if (event.key === 'ArrowDown' || event.key === 'Tab') moveTarget(1)
  else if (event.key === 'Home' && activeZone.value) selectTarget(0)
  else if (event.key === 'End' && activeZone.value) selectTarget(activeZone.value.targets.length - 1)
  else if (event.key === 'Enter') focusSelected()
  else if (event.key === 'Escape') close()
}

function handleGlobalKeyup(event: KeyboardEvent) {
  if (!open.value || !chordMode.value || event.key !== 'Alt') return
  event.preventDefault()
  event.stopImmediatePropagation()
  focusSelected()
}

watch(open, async value => {
  if (value) {
    if (!prepared && !prepare(false)) return
    prepared = false
    previousBodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    await nextTick()
    panel.value?.focus({ preventScroll: true })
    return
  }
  prepared = false
  document.body.style.overflow = previousBodyOverflow
})

watch([activeZoneIndex, activeTargetIndex], async () => {
  if (!open.value) return
  await nextTick()
  panel.value?.querySelector<HTMLElement>(`#${activeOptionId.value}`)?.scrollIntoView({ block: 'nearest' })
})

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown, true)
  window.addEventListener('keyup', handleGlobalKeyup, true)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleGlobalKeydown, true)
  window.removeEventListener('keyup', handleGlobalKeyup, true)
  document.body.style.overflow = previousBodyOverflow
})

defineExpose({ show, close, refresh, focusSelected })
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="dl-focus-navigator-mask" data-dl-focus-navigator @pointerdown.self="close()">
      <section
        ref="panel"
        data-dl
        data-slot="focus-navigator"
        class="dl-focus-navigator"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dl-focus-navigator-title"
        :aria-activedescendant="activeOptionId"
        tabindex="-1"
      >
        <header>
          <div><small>FOCUS NAVIGATOR</small><h2 id="dl-focus-navigator-title">{{ title }}</h2></div>
          <kbd>{{ shortcutLabel }}</kbd>
        </header>

        <div class="dl-focus-navigator-layout">
          <nav aria-label="焦点区域">
            <small>内容域</small>
            <div>
              <button
                v-for="(zone, index) in resolvedZones"
                :key="zone.id"
                type="button"
                :aria-label="`${zone.label}，${zone.targets.length} 个控件`"
                :title="zone.label"
                :class="{ active: index === activeZoneIndex }"
                tabindex="-1"
                @mouseenter="activeZoneIndex = index"
                @click="activeZoneIndex = index"
              ><i aria-hidden="true">{{ zone.icon }}</i></button>
            </div>
          </nav>

          <section class="dl-focus-navigator-current-zone">
            <header><div><small>当前内容域</small><b>{{ activeZone?.label }}</b></div><span>{{ activeZone?.targets.length ?? 0 }} ITEMS</span></header>
            <div class="dl-focus-navigator-targets" role="listbox" :aria-label="`${activeZone?.label ?? ''}中的控件`">
              <button
                v-for="(target, index) in activeZone?.targets ?? []"
                :id="`dl-focus-navigator-${target.id}`"
                :key="target.id"
                type="button"
                role="option"
                :aria-selected="index === activeTargetIndex"
                :class="{ active: index === activeTargetIndex }"
                tabindex="-1"
                @mouseenter="selectTarget(index)"
                @click="selectTarget(index); focusSelected()"
              >
                <i>{{ String(index + 1).padStart(2, '0') }}</i>
                <span><b>{{ target.label }}</b><small>{{ target.kind }}</small></span>
                <em aria-hidden="true">↗</em>
              </button>
            </div>
          </section>
        </div>

        <footer>
          <span><kbd>←</kbd><kbd>→</kbd> 区域</span>
          <span><kbd>↑</kbd><kbd>↓</kbd> 控件</span>
          <span><kbd>Enter</kbd> 聚焦</span>
          <span><kbd>Esc</kbd> 取消</span>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.dl-focus-navigator-mask { position: fixed; z-index: 2147483000; inset: 0; display: grid; place-items: center; padding: 20px; background: color-mix(in srgb, var(--dl-night, #101315) 68%, transparent); backdrop-filter: blur(14px) saturate(.78); animation: dl-focus-mask-in .14s ease-out; }
.dl-focus-navigator { width: min(860px, 94vw); max-height: min(720px, 88vh); padding: 18px; overflow: hidden; border: 1px solid color-mix(in srgb, var(--dl-accent, #3b82f6) 34%, var(--dl-border, rgba(255,255,255,.12))); border-radius: 23px; outline: none; color: var(--dl-text, #f8fafc); background: color-mix(in srgb, var(--dl-panel, #171a1d) 96%, transparent); box-shadow: 0 32px 110px rgba(0,0,0,.42); animation: dl-focus-panel-in .16s ease-out; }
.dl-focus-navigator > header { display: flex; align-items: center; justify-content: space-between; gap: 18px; padding: 2px 4px 16px; }
.dl-focus-navigator > header div { display: grid; gap: 4px; }
.dl-focus-navigator > header small { color: var(--dl-accent-text, #7dd3fc); font-size: .58rem; font-weight: 900; letter-spacing: .18em; }
.dl-focus-navigator > header h2 { margin: 0; font-size: 1.08rem; }
.dl-focus-navigator kbd { display: inline-grid; min-width: 25px; min-height: 23px; place-items: center; padding: 3px 6px; border: 1px solid var(--dl-border-strong, rgba(255,255,255,.18)); border-radius: 6px; color: var(--dl-text-muted, #cbd5e1); background: var(--dl-night-soft, rgba(0,0,0,.18)); font: 750 .58rem/1 "Cascadia Code", Consolas, monospace; }
.dl-focus-navigator-layout { display: grid; grid-template-columns: 118px minmax(0, 1fr); min-height: 390px; max-height: min(560px, 66vh); overflow: hidden; border: 1px solid var(--dl-border, rgba(255,255,255,.1)); border-radius: 16px; background: var(--dl-surface, rgba(255,255,255,.03)); }
.dl-focus-navigator nav { display: grid; align-content: start; gap: 12px; padding: 12px; overflow: auto; border-right: 1px solid var(--dl-border, rgba(255,255,255,.1)); }
.dl-focus-navigator nav > small { color: var(--dl-text-faint, #94a3b8); font-size: .55rem; font-weight: 850; letter-spacing: .12em; text-align: center; }
.dl-focus-navigator nav > div { display: grid; grid-template-columns: repeat(2, 42px); align-content: start; gap: 8px; }
.dl-focus-navigator nav button, .dl-focus-navigator-targets button { appearance: none; border: 1px solid transparent; color: inherit; background: transparent; cursor: pointer; }
.dl-focus-navigator nav button { display: grid; place-items: center; width: 42px; height: 42px; padding: 0; border-radius: 13px; }
.dl-focus-navigator nav button.active { border-color: var(--dl-accent, #3b82f6); background: var(--dl-accent-surface, rgba(59,130,246,.12)); box-shadow: 0 8px 24px color-mix(in srgb, var(--dl-accent, #3b82f6) 18%, transparent); }
.dl-focus-navigator nav button > i { display: grid; place-items: center; width: 30px; height: 30px; border-radius: 9px; color: var(--dl-accent-text, #7dd3fc); background: var(--dl-accent-surface, rgba(59,130,246,.12)); font: normal 850 .9rem/1 "Cascadia Code", Consolas, monospace; }
.dl-focus-navigator-current-zone { display: grid; grid-template-rows: auto minmax(0,1fr); min-width: 0; overflow: hidden; }
.dl-focus-navigator-current-zone > header { display: flex; align-items: end; justify-content: space-between; gap: 14px; min-height: 64px; padding: 12px 15px; border-bottom: 1px solid var(--dl-border, rgba(255,255,255,.1)); }
.dl-focus-navigator-current-zone > header div { display: grid; gap: 4px; }
.dl-focus-navigator-current-zone > header small { color: var(--dl-accent-text, #7dd3fc); font-size: .55rem; font-weight: 850; letter-spacing: .12em; }
.dl-focus-navigator-current-zone > header b { font-size: .84rem; }
.dl-focus-navigator-current-zone > header > span { color: var(--dl-text-faint, #94a3b8); font: 750 .56rem "Cascadia Code", Consolas, monospace; }
.dl-focus-navigator-targets { display: grid; grid-auto-flow: column; grid-template-rows: repeat(5, minmax(56px, auto)); grid-auto-columns: minmax(210px, 1fr); align-content: start; gap: 5px; overflow: auto; padding: 10px; }
.dl-focus-navigator-targets button { display: grid; grid-template-columns: 32px minmax(0,1fr) auto; align-items: center; gap: 11px; min-height: 56px; padding: 8px 11px; border-radius: 12px; text-align: left; }
.dl-focus-navigator-targets button > span { display: grid; gap: 3px; min-width: 0; }
.dl-focus-navigator-targets button.active { border-color: var(--dl-accent, #3b82f6); background: var(--dl-accent-surface, rgba(59,130,246,.12)); box-shadow: inset 3px 0 0 var(--dl-accent, #3b82f6); }
.dl-focus-navigator-targets button > i { color: var(--dl-text-faint, #94a3b8); font: normal 750 .58rem "Cascadia Code", Consolas, monospace; }
.dl-focus-navigator-targets button b { overflow: hidden; font-size: .76rem; text-overflow: ellipsis; white-space: nowrap; }
.dl-focus-navigator-targets button small { color: var(--dl-text-faint, #94a3b8); font-size: .56rem; letter-spacing: .08em; }
.dl-focus-navigator-targets button em { color: var(--dl-accent-text, #7dd3fc); font-style: normal; opacity: 0; transform: translateX(-4px); transition: .14s ease; }
.dl-focus-navigator-targets button.active em { opacity: 1; transform: none; }
.dl-focus-navigator > footer { display: flex; justify-content: flex-end; gap: 14px; padding: 14px 4px 0; color: var(--dl-text-faint, #94a3b8); font-size: .58rem; }
.dl-focus-navigator > footer span { display: flex; align-items: center; gap: 4px; }
@keyframes dl-focus-mask-in { from { opacity: 0; } }
@keyframes dl-focus-panel-in { from { opacity: 0; transform: translateY(9px) scale(.985); } }
@media (max-width: 620px) { .dl-focus-navigator-mask { padding: 10px; } .dl-focus-navigator { width: 98vw; padding: 12px; border-radius: 18px; } .dl-focus-navigator-layout { grid-template-columns: 70px minmax(0,1fr); } .dl-focus-navigator nav { padding: 9px; } .dl-focus-navigator nav > div { grid-template-columns: 42px; } .dl-focus-navigator-targets { grid-template-rows: repeat(5, minmax(56px, auto)); grid-auto-columns: minmax(190px, 1fr); } .dl-focus-navigator > footer { justify-content: flex-start; flex-wrap: wrap; } }
@media (prefers-reduced-motion: reduce) { .dl-focus-navigator-mask, .dl-focus-navigator { animation: none; } .dl-focus-navigator-targets button em { transition: none; } }
</style>
