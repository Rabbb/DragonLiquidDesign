<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import {
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from 'reka-ui'
import { useDlModalLayer } from '../composables/useDlLayer'
import type { DlChoicePortalOverlay } from './choice-portal.types'
import {
  buildDlTimeWheelMinutes,
  clampDlTimeWheelMinute,
  formatDlTimeWheelValue,
  parseDlTimeWheelValue,
} from './time-wheel.utils'

type WheelKind = 'hour' | 'minute'
type VirtualValue = { key: string; value: number; cycle: number }

const props = withDefaults(defineProps<{
  open?: boolean
  modelValue?: string
  placeholder?: string
  minuteStep?: number
  overlay?: DlChoicePortalOverlay
  clearable?: boolean
  shortcutValue?: string
  shortcutLabel?: string
  disabledTime?: (value: string) => boolean
  disabled?: boolean
  zIndex?: number
}>(), {
  open: undefined,
  modelValue: '',
  placeholder: '选择时间',
  minuteStep: 5,
  overlay: 'auto',
  clearable: false,
  shortcutValue: undefined,
  shortcutLabel: '常用时间',
  disabledTime: undefined,
  disabled: false,
  zIndex: undefined,
})

const emit = defineEmits<{
  'update:open': [value: boolean]
  'update:modelValue': [value: string]
  change: [value: string]
  clear: []
}>()

const internalOpen = ref(false)
const draftHour = ref(9)
const draftMinute = ref(0)
const hourWheel = ref<HTMLElement | null>(null)
const minuteWheel = ref<HTMLElement | null>(null)
const { overlayZIndex, contentZIndex } = useDlModalLayer(() => props.zIndex)
const hours = Array.from({ length: 24 }, (_, value) => value)
const steppedMinutes = computed(() => buildDlTimeWheelMinutes(props.minuteStep))
const minutes = computed(() => [...new Set([...steppedMinutes.value, draftMinute.value])].sort((left, right) => left - right))
const resolvedOpen = computed(() => props.open ?? internalOpen.value)
const draftValue = computed(() => formatDlTimeWheelValue(draftHour.value, draftMinute.value))
const draftDisabled = computed(() => props.disabledTime?.(draftValue.value) ?? false)
const virtualHours = computed(() => virtualValues(hours))
const virtualMinutes = computed(() => virtualValues(minutes.value))

let hourSnapTimer: ReturnType<typeof setTimeout> | undefined
let minuteSnapTimer: ReturnType<typeof setTimeout> | undefined
let suppressScroll = false
let suppressClickUntil = 0
let dragState: { kind: WheelKind; pointerId: number; startY: number; lastY: number; moved: boolean } | null = null

function virtualValues(values: number[]): VirtualValue[] {
  return Array.from({ length: 5 }, (_, cycle) => values.map(value => ({ key: `${cycle}-${value}`, value, cycle }))).flat()
}

function setOpen(value: boolean) {
  internalOpen.value = value
  emit('update:open', value)
}

function isDisabled(hour: number, minute: number) {
  return props.disabledTime?.(formatDlTimeWheelValue(hour, minute)) ?? false
}

function hourDisabled(hour: number) {
  return minutes.value.every(minute => isDisabled(hour, minute))
}

function wheelFor(kind: WheelKind) {
  return kind === 'hour' ? hourWheel.value : minuteWheel.value
}

function valuesFor(kind: WheelKind) {
  return kind === 'hour' ? hours : minutes.value
}

function scrollToValue(kind: WheelKind, value: number, behavior: ScrollBehavior = 'auto') {
  const wheel = wheelFor(kind)
  const target = wheel?.querySelector<HTMLElement>(`[data-cycle="2"][data-wheel-value="${value}"]`)
  if (!wheel || !target) return
  const top = target.offsetTop - (wheel.clientHeight - target.offsetHeight) / 2
  if (behavior === 'auto' || typeof wheel.scrollTo !== 'function') wheel.scrollTop = top
  else wheel.scrollTo({ top, behavior })
}

function syncWheels() {
  nextTick(() => {
    suppressScroll = true
    scrollToValue('hour', draftHour.value)
    scrollToValue('minute', draftMinute.value)
    requestAnimationFrame(() => { suppressScroll = false })
  })
}

function initializeDraft() {
  const parsed = parseDlTimeWheelValue(props.modelValue)
  const now = new Date()
  draftHour.value = parsed?.hour ?? now.getHours()
  draftMinute.value = clampDlTimeWheelMinute(parsed?.minute ?? now.getMinutes(), props.minuteStep)
}

function closeWheel() {
  setOpen(false)
}

function selectValue(kind: WheelKind, value: number, smooth = true) {
  if (kind === 'hour') {
    if (hourDisabled(value)) return
    draftHour.value = value
    if (isDisabled(value, draftMinute.value)) {
      draftMinute.value = minutes.value.find(minute => !isDisabled(value, minute)) ?? draftMinute.value
    }
  } else {
    if (isDisabled(draftHour.value, value)) return
    draftMinute.value = value
  }
  nextTick(() => scrollToValue(kind, value, smooth ? 'smooth' : 'auto'))
}

function selectClicked(kind: WheelKind, value: number) {
  if (performance.now() < suppressClickUntil) return
  selectValue(kind, value)
}

function nudgeTarget(kind: WheelKind, direction: -1 | 1) {
  if (kind === 'hour') {
    return { hour: (draftHour.value + direction + 24) % 24, minute: draftMinute.value }
  }
  const total = (draftHour.value * 60 + draftMinute.value + direction + 1440) % 1440
  return { hour: Math.floor(total / 60), minute: total % 60 }
}

function canNudge(kind: WheelKind, direction: -1 | 1) {
  const target = nudgeTarget(kind, direction)
  return !isDisabled(target.hour, target.minute)
}

function nudgeTime(kind: WheelKind, direction: -1 | 1) {
  const target = nudgeTarget(kind, direction)
  if (isDisabled(target.hour, target.minute)) return
  draftHour.value = target.hour
  draftMinute.value = target.minute
  syncWheels()
}

function centeredValue(kind: WheelKind) {
  const wheel = wheelFor(kind)
  if (!wheel) return null
  const center = wheel.scrollTop + wheel.clientHeight / 2
  let nearest: HTMLElement | null = null
  let distance = Number.POSITIVE_INFINITY
  for (const option of wheel.querySelectorAll<HTMLElement>('[data-wheel-value]')) {
    const optionDistance = Math.abs(option.offsetTop + option.offsetHeight / 2 - center)
    if (optionDistance < distance) {
      nearest = option
      distance = optionDistance
    }
  }
  const value = Number(nearest?.dataset.wheelValue)
  return Number.isFinite(value) ? value : null
}

function normalizeInfiniteWheel(kind: WheelKind) {
  const wheel = wheelFor(kind)
  const values = valuesFor(kind)
  if (!wheel || !values.length) return
  const cycleHeight = values.length * 48
  if (wheel.scrollTop < cycleHeight) wheel.scrollTop += cycleHeight * 2
  else if (wheel.scrollTop > cycleHeight * 3) wheel.scrollTop -= cycleHeight * 2
}

function syncCentered(kind: WheelKind) {
  const value = centeredValue(kind)
  if (value === null) return
  selectValue(kind, value, false)
}

function handleScroll(kind: WheelKind) {
  if (suppressScroll || dragState) return
  normalizeInfiniteWheel(kind)
  const timer = kind === 'hour' ? hourSnapTimer : minuteSnapTimer
  if (timer) clearTimeout(timer)
  const nextTimer = setTimeout(() => syncCentered(kind), 110)
  if (kind === 'hour') hourSnapTimer = nextTimer
  else minuteSnapTimer = nextTimer
}

function beginDrag(kind: WheelKind, event: PointerEvent) {
  if (event.pointerType !== 'mouse' || event.button !== 0) return
  dragState = { kind, pointerId: event.pointerId, startY: event.clientY, lastY: event.clientY, moved: false }
  ;(event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId)
}

function moveDrag(event: PointerEvent) {
  if (!dragState || dragState.pointerId !== event.pointerId) return
  const wheel = wheelFor(dragState.kind)
  if (!wheel) return
  const delta = event.clientY - dragState.lastY
  dragState.lastY = event.clientY
  if (Math.abs(event.clientY - dragState.startY) > 5) dragState.moved = true
  if (!dragState.moved) return
  event.preventDefault()
  wheel.scrollTop -= delta
  normalizeInfiniteWheel(dragState.kind)
}

function endDrag(event: PointerEvent) {
  if (!dragState || dragState.pointerId !== event.pointerId) return
  const { kind, moved } = dragState
  dragState = null
  if (moved) suppressClickUntil = performance.now() + 180
  syncCentered(kind)
}

function applyShortcut() {
  const shortcut = parseDlTimeWheelValue(props.shortcutValue)
  if (!shortcut) return
  const minute = clampDlTimeWheelMinute(shortcut.minute, props.minuteStep)
  if (isDisabled(shortcut.hour, minute)) return
  draftHour.value = shortcut.hour
  draftMinute.value = minute
  syncWheels()
}

function clearValue(event?: MouseEvent) {
  event?.preventDefault()
  event?.stopPropagation()
  emit('update:modelValue', '')
  emit('change', '')
  emit('clear')
  if (resolvedOpen.value) closeWheel()
}

function commitValue() {
  if (draftDisabled.value) return
  emit('update:modelValue', draftValue.value)
  emit('change', draftValue.value)
  closeWheel()
}

function focusPanel(event: Event) {
  event.preventDefault()
  nextTick(() => hourWheel.value?.focus())
}

watch(resolvedOpen, open => {
  if (!open) return
  initializeDraft()
  syncWheels()
}, { immediate: true })

watch(() => props.minuteStep, () => {
  draftMinute.value = clampDlTimeWheelMinute(draftMinute.value, props.minuteStep)
  if (resolvedOpen.value) syncWheels()
})

onBeforeUnmount(() => {
  if (hourSnapTimer) clearTimeout(hourSnapTimer)
  if (minuteSnapTimer) clearTimeout(minuteSnapTimer)
})
</script>

<template>
  <DialogRoot :open="resolvedOpen" @update:open="setOpen">
    <DialogPortal>
      <DialogOverlay data-dl data-dl-layer="overlay" class="dl-time-wheel__overlay" :style="{ zIndex: overlayZIndex }" />
      <DialogContent
        data-dl
        data-slot="time-wheel-panel"
        data-dl-layer="modal"
        class="dl-time-wheel__panel"
        :data-overlay="overlay"
        :style="{ zIndex: contentZIndex }"
        @open-auto-focus="focusPanel"
      >
        <header class="dl-time-wheel__header">
          <div><small>TIME WHEEL</small><DialogTitle>{{ placeholder }}</DialogTitle><DialogDescription>滚动或拖动小时与分钟，停下后自动对齐。</DialogDescription></div>
          <button type="button" class="dl-time-wheel__close" aria-label="关闭时间选择器" @click="closeWheel">×</button>
        </header>

        <div class="dl-time-wheel__summary" :data-disabled="draftDisabled || undefined">
          <span>当前选择</span>
          <strong class="dl-time-wheel__summary-value" :aria-label="draftValue"><b>{{ String(draftHour).padStart(2, '0') }}</b><i aria-hidden="true">:</i><b>{{ String(draftMinute).padStart(2, '0') }}</b></strong>
          <small v-if="draftDisabled">该时间不可用</small>
        </div>

        <div class="dl-time-wheel__columns">
          <section><h3>小时</h3><span class="dl-time-wheel__band" aria-hidden="true" />
            <div ref="hourWheel" class="dl-time-wheel__viewport" role="listbox" aria-label="小时" tabindex="0" @scroll.passive="handleScroll('hour')" @pointerdown.capture="beginDrag('hour', $event)" @pointermove="moveDrag" @pointerup="endDrag" @pointercancel="endDrag">
              <button v-for="item in virtualHours" :key="item.key" type="button" role="option" :aria-selected="item.value === draftHour" :data-cycle="item.cycle" :data-wheel-value="item.value" :tabindex="item.cycle === 2 ? 0 : -1" :class="{ 'is-selected': item.value === draftHour }" :disabled="hourDisabled(item.value)" @click="selectClicked('hour', item.value)">{{ item.value }}</button>
            </div>
            <span class="dl-time-wheel__stepper" data-slot="time-wheel-hour-stepper">
              <button type="button" aria-label="小时增加 1" :disabled="!canNudge('hour', 1)" @click="nudgeTime('hour', 1)">▲</button>
              <button type="button" aria-label="小时减少 1" :disabled="!canNudge('hour', -1)" @click="nudgeTime('hour', -1)">▼</button>
            </span>
          </section>
          <i aria-hidden="true">:</i>
          <section><h3>分钟</h3><span class="dl-time-wheel__band" aria-hidden="true" />
            <div ref="minuteWheel" class="dl-time-wheel__viewport" role="listbox" aria-label="分钟" tabindex="0" @scroll.passive="handleScroll('minute')" @pointerdown.capture="beginDrag('minute', $event)" @pointermove="moveDrag" @pointerup="endDrag" @pointercancel="endDrag">
              <button v-for="item in virtualMinutes" :key="item.key" type="button" role="option" :aria-selected="item.value === draftMinute" :data-cycle="item.cycle" :data-wheel-value="item.value" :tabindex="item.cycle === 2 ? 0 : -1" :class="{ 'is-selected': item.value === draftMinute }" :disabled="isDisabled(draftHour, item.value)" @click="selectClicked('minute', item.value)">{{ String(item.value).padStart(2, '0') }}</button>
            </div>
            <span class="dl-time-wheel__stepper" data-slot="time-wheel-minute-stepper">
              <button type="button" aria-label="分钟增加 1" :disabled="!canNudge('minute', 1)" @click="nudgeTime('minute', 1)">▲</button>
              <button type="button" aria-label="分钟减少 1" :disabled="!canNudge('minute', -1)" @click="nudgeTime('minute', -1)">▼</button>
            </span>
          </section>
        </div>

        <footer>
          <button v-if="clearable" type="button" class="dl-time-wheel__ghost" @click="clearValue()">清除</button>
          <button v-if="shortcutValue" type="button" class="dl-time-wheel__ghost" :disabled="!parseDlTimeWheelValue(shortcutValue) || disabledTime?.(shortcutValue)" @click="applyShortcut">{{ shortcutLabel }}</button>
          <span />
          <button type="button" class="dl-time-wheel__ghost" @click="closeWheel">取消</button>
          <button type="button" class="dl-time-wheel__primary" :disabled="draftDisabled" @click="commitValue">应用</button>
        </footer>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<style scoped>
.dl-time-wheel__overlay { position: fixed; inset: 0; background: rgb(7 14 11 / 46%); backdrop-filter: blur(12px) saturate(108%); }
.dl-time-wheel__panel { position: fixed; top: 50%; left: 50%; display: grid; width: min(calc(100vw - 32px), 590px); max-height: min(90vh, 760px); grid-template-rows: auto auto minmax(0, 1fr) auto; gap: 16px; overflow: hidden; padding: 22px; border: 1px solid var(--dl-border-strong); border-radius: 28px; background: var(--dl-panel); color: var(--dl-text); box-shadow: 0 34px 100px rgb(0 0 0 / 45%), inset 0 1px 0 rgb(255 255 255 / 12%); outline: none; transform: translate(-50%, -50%); }
.dl-time-wheel__overlay[data-state='open'] { animation: dl-time-wheel-fade .16s ease-out; }
.dl-time-wheel__panel[data-state='open'] { animation: dl-time-wheel-in .2s cubic-bezier(.2,.8,.2,1); }
.dl-time-wheel__header { display: flex; min-width: 0; align-items: flex-start; justify-content: space-between; gap: 18px; }
.dl-time-wheel__header > div { display: grid; min-width: 0; gap: 5px; }
.dl-time-wheel__header small { color: var(--dl-accent-text); font-size: .62rem; font-weight: 900; letter-spacing: .18em; }
.dl-time-wheel__header h2 { margin: 0; font-size: 1.18rem; }
.dl-time-wheel__header p { margin: 0; color: var(--dl-text-faint); font-size: .72rem; }
.dl-time-wheel__close { display: grid; width: 38px; height: 38px; flex: 0 0 auto; place-items: center; border: 1px solid var(--dl-border); border-radius: 50%; background: var(--dl-surface); color: var(--dl-text-faint); font-size: 1.15rem; cursor: pointer; }
.dl-time-wheel__close:hover { border-color: var(--dl-border-strong); background: var(--dl-surface-hover); color: var(--dl-text); }
.dl-time-wheel__summary { position: relative; display: grid; min-height: 76px; gap: 3px; padding: 10px 0 8px; border: 1px solid var(--dl-accent-border); border-radius: 16px; background: var(--dl-accent-surface); }
.dl-time-wheel__summary > span { padding-inline: 16px; color: var(--dl-text-faint); font-size: .66rem; }
.dl-time-wheel__summary-value { display: grid; width: 100%; grid-template-columns: minmax(0, 1fr) 16px minmax(0, 1fr); align-items: center; gap: 12px; color: var(--dl-accent-text); font: 800 1.65rem/1 monospace; }
.dl-time-wheel__summary-value b { font: inherit; text-align: center; }
.dl-time-wheel__summary-value i { display: grid; place-items: center; font: inherit; font-style: normal; }
.dl-time-wheel__summary small { position: absolute; top: 11px; right: 16px; color: #d84d57; font-size: .65rem; }
.dl-time-wheel__summary[data-disabled] { border-color: color-mix(in srgb, #d84d57 48%, var(--dl-border)); }
.dl-time-wheel__columns { display: grid; min-height: 0; grid-template-columns: minmax(0, 1fr) 16px minmax(0, 1fr); align-items: center; gap: 12px; }
.dl-time-wheel__columns > section { position: relative; display: grid; min-width: 0; gap: 7px; overflow: hidden; }
.dl-time-wheel__columns h3 { z-index: 2; margin: 0; color: var(--dl-text-faint); font-size: .64rem; text-align: center; }
.dl-time-wheel__columns > i { display: grid; place-items: center; color: var(--dl-accent-text); font: 900 1.45rem/1 monospace; }
.dl-time-wheel__band { position: absolute; top: calc(50% + 2px); right: 4px; left: 4px; height: 48px; border: 1px solid var(--dl-accent-border); border-radius: 13px; background: var(--dl-accent-surface); pointer-events: none; transform: translateY(-50%); }
.dl-time-wheel__viewport { height: 264px; padding-block: 108px; overflow-y: auto; overscroll-behavior: contain; scroll-snap-type: y mandatory; scrollbar-width: none; cursor: grab; outline: none; touch-action: pan-y; }
.dl-time-wheel__viewport:active { cursor: grabbing; }
.dl-time-wheel__viewport::-webkit-scrollbar { display: none; }
.dl-time-wheel__viewport:focus-visible { box-shadow: inset var(--dl-focus); }
.dl-time-wheel__viewport button { display: block; width: 100%; height: 48px; scroll-snap-align: center; border: 0; border-radius: 12px; background: transparent; color: var(--dl-text-faint); font: 700 1rem/1 monospace; cursor: pointer; outline: none; transition: color .12s ease, font-size .12s ease; }
.dl-time-wheel__viewport button.is-selected { color: var(--dl-accent-text); font-size: 1.3rem; }
.dl-time-wheel__viewport button:focus-visible { box-shadow: var(--dl-focus); }
.dl-time-wheel__viewport button:disabled { cursor: not-allowed; opacity: .2; }
.dl-time-wheel__stepper { position: absolute; z-index: 3; top: calc(50% + 2px); right: 9px; display: grid; overflow: hidden; border: 1px solid var(--dl-border-strong); border-radius: 8px; background: var(--dl-panel); box-shadow: 0 4px 14px rgb(0 0 0 / 18%); transform: translateY(-50%); }
.dl-time-wheel__stepper button { display: grid; width: 28px; height: 22px; place-items: center; border: 0; background: transparent; color: var(--dl-text-muted); font: 700 .52rem/1 sans-serif; cursor: pointer; transition: background-color .14s ease, color .14s ease; }
.dl-time-wheel__stepper button + button { border-top: 1px solid var(--dl-border); }
.dl-time-wheel__stepper button:hover:not(:disabled) { background: var(--dl-surface-hover); color: var(--dl-accent-text); }
.dl-time-wheel__stepper button:focus-visible { position: relative; z-index: 1; outline: none; box-shadow: inset var(--dl-focus); }
.dl-time-wheel__stepper button:disabled { cursor: not-allowed; opacity: .3; }
.dl-time-wheel__panel footer { display: flex; align-items: center; gap: 8px; padding-top: 14px; border-top: 1px solid var(--dl-border); }
.dl-time-wheel__panel footer > span { flex: 1; }
.dl-time-wheel__ghost, .dl-time-wheel__primary { min-height: 36px; padding: 0 14px; border-radius: 10px; font-size: .72rem; font-weight: 800; cursor: pointer; }
.dl-time-wheel__ghost { border: 1px solid var(--dl-border); background: var(--dl-surface); color: var(--dl-text-muted); }
.dl-time-wheel__ghost:hover { border-color: var(--dl-border-strong); background: var(--dl-surface-hover); color: var(--dl-text); }
.dl-time-wheel__primary { border: 1px solid var(--dl-button-primary-border); background: var(--dl-button-primary-bg); color: var(--dl-button-primary-text); box-shadow: var(--dl-button-primary-shadow); }
.dl-time-wheel__primary:hover { background: var(--dl-button-primary-bg-hover); }
.dl-time-wheel__ghost:disabled, .dl-time-wheel__primary:disabled { cursor: not-allowed; opacity: .45; }
.dl-time-wheel__panel[data-overlay='drawer'] { top: auto; bottom: 0; width: min(100vw, 650px); border-bottom: 0; border-radius: 28px 28px 0 0; transform: translate(-50%, 0); }
@keyframes dl-time-wheel-fade { from { opacity: 0; } }
@keyframes dl-time-wheel-in { from { opacity: 0; transform: translate(-50%, -47%) scale(.96); } }
@media (max-width: 720px) {
  .dl-time-wheel__panel[data-overlay='auto'] { top: auto; bottom: 0; left: 0; width: 100%; max-height: 92dvh; padding: 18px 16px max(18px, env(safe-area-inset-bottom)); border-right: 0; border-bottom: 0; border-left: 0; border-radius: 26px 26px 0 0; transform: none; }
  .dl-time-wheel__viewport { height: 240px; padding-block: 96px; }
  .dl-time-wheel__panel footer { flex-wrap: wrap; }
}
@media (max-height: 560px) and (orientation: landscape) {
  .dl-time-wheel__panel { width: min(calc(100vw - 24px), 760px); grid-template-columns: minmax(160px, .7fr) minmax(320px, 1.3fr); grid-template-rows: auto minmax(0, 1fr) auto; }
  .dl-time-wheel__header { grid-column: 1; }
  .dl-time-wheel__summary { grid-column: 1; align-self: start; }
  .dl-time-wheel__columns { grid-column: 2; grid-row: 1 / 3; }
  .dl-time-wheel__panel footer { grid-column: 1 / -1; }
  .dl-time-wheel__viewport { height: 196px; padding-block: 74px; }
}
@media (prefers-reduced-motion: reduce) {
  .dl-time-wheel__overlay, .dl-time-wheel__panel { animation: none !important; }
  .dl-time-wheel__viewport { scroll-behavior: auto; }
}
</style>
