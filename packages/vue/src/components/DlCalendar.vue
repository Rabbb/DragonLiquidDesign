<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import type { DlCalendarDay, DlCalendarItem } from './calendar.types'

const props = withDefaults(defineProps<{
  modelValue?: string | null
  viewValue?: string
  items?: DlCalendarItem[]
  locale?: string
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  fixedWeeks?: boolean
  showOutsideDays?: boolean
  showToolbar?: boolean
  showToday?: boolean
  showCreate?: boolean
  todayLabel?: string
  createLabel?: string
  dayMinHeight?: number
  height?: string | number
  draggable?: boolean
  disabled?: boolean
}>(), {
  modelValue: null,
  viewValue: undefined,
  items: () => [],
  locale: 'zh-CN',
  weekStartsOn: 1,
  fixedWeeks: true,
  showOutsideDays: true,
  showToolbar: true,
  showToday: true,
  showCreate: false,
  todayLabel: '今天',
  createLabel: '新建',
  dayMinHeight: 112,
  height: undefined,
  draggable: true,
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'update:viewValue': [value: string]
  'day-click': [day: DlCalendarDay, event: MouseEvent | KeyboardEvent]
  'create': [day: DlCalendarDay, event: MouseEvent]
  'item-click': [item: DlCalendarItem, day: DlCalendarDay, event: MouseEvent]
  'item-drop': [item: DlCalendarItem, day: DlCalendarDay, event: DragEvent]
  'item-drag-start': [item: DlCalendarItem, event: DragEvent]
  'item-drag-end': [item: DlCalendarItem, event: DragEvent]
  'item-move': [item: DlCalendarItem, from: DlCalendarDay, to: DlCalendarDay, event: KeyboardEvent]
}>()

const currentMonth = monthKey(new Date())
const internalView = ref(normalizeMonth(props.viewValue) ?? currentMonth)
const draggingId = ref('')
const dropTarget = ref('')
const calendarRoot = ref<HTMLElement | null>(null)
const focusedDayKey = ref('')

watch(() => props.viewValue, (value) => {
  const normalized = normalizeMonth(value)
  if (normalized) internalView.value = normalized
})

const resolvedView = computed(() => normalizeMonth(props.viewValue) ?? internalView.value)
const itemsByDate = computed(() => {
  const result = new Map<string, DlCalendarItem[]>()
  for (const item of props.items) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(item.date)) continue
    result.set(item.date, [...(result.get(item.date) ?? []), item])
  }
  return result
})
const todayKey = computed(() => dateKey(new Date()))
const viewParts = computed(() => resolvedView.value.split('-').map(Number) as [number, number])
const heading = computed(() => new Intl.DateTimeFormat(props.locale, { year: 'numeric', month: 'long' }).format(new Date(viewParts.value[0], viewParts.value[1] - 1, 1)))
const weekDays = computed(() => {
  const formatter = new Intl.DateTimeFormat(props.locale, { weekday: 'short' })
  const sunday = new Date(2024, 0, 7)
  return Array.from({ length: 7 }, (_, index) => {
    const dayOffset = (props.weekStartsOn + index) % 7
    const date = new Date(sunday)
    date.setDate(sunday.getDate() + dayOffset)
    return formatter.format(date)
  })
})
const days = computed<DlCalendarDay[]>(() => {
  const [year, month] = viewParts.value
  const first = new Date(year, month - 1, 1)
  const offset = (first.getDay() - props.weekStartsOn + 7) % 7
  const daysInMonth = new Date(year, month, 0).getDate()
  const naturalCellCount = Math.ceil((offset + daysInMonth) / 7) * 7
  const cellCount = props.fixedWeeks ? 42 : naturalCellCount
  const start = new Date(year, month - 1, 1 - offset)

  return Array.from({ length: cellCount }, (_, index) => {
    const date = new Date(start)
    date.setDate(start.getDate() + index)
    const key = dateKey(date)
    return {
      key,
      date,
      day: date.getDate(),
      inCurrentMonth: date.getFullYear() === year && date.getMonth() === month - 1,
      isToday: key === todayKey.value,
      isSelected: key === props.modelValue,
      items: itemsByDate.value.get(key) ?? [],
    }
  })
})
const weekCount = computed(() => Math.max(1, days.value.length / 7))
const calendarStyle = computed(() => ({
  '--dl-calendar-day-min-height': `${Math.max(72, props.dayMinHeight)}px`,
  '--dl-calendar-week-count': weekCount.value,
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
}))

watch([days, () => props.modelValue], ([visibleDays, selected]) => {
  if (visibleDays.some(day => day.key === focusedDayKey.value)) return
  focusedDayKey.value = visibleDays.find(day => day.key === selected)?.key
    ?? visibleDays.find(day => day.isToday)?.key
    ?? visibleDays.find(day => day.inCurrentMonth)?.key
    ?? visibleDays[0]?.key
    ?? ''
}, { immediate: true })

function normalizeMonth(value?: string) {
  const match = value?.match(/^(\d{4})-(0[1-9]|1[0-2])$/)
  return match ? value : undefined
}

function dateKey(value: Date) {
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`
}

function monthKey(value: Date) {
  return dateKey(value).slice(0, 7)
}

function setView(year: number, month: number) {
  const next = new Date(year, month - 1, 1)
  const value = monthKey(next)
  internalView.value = value
  emit('update:viewValue', value)
}

function changeMonth(amount: number) {
  const [year, month] = viewParts.value
  setView(year, month + amount)
}

function goToday() {
  const now = new Date()
  setView(now.getFullYear(), now.getMonth() + 1)
  emit('update:modelValue', dateKey(now))
}

function selectDay(day: DlCalendarDay, event: MouseEvent | KeyboardEvent) {
  if (props.disabled || (!props.showOutsideDays && !day.inCurrentMonth)) return
  emit('update:modelValue', day.key)
  focusedDayKey.value = day.key
  emit('day-click', day, event)
  if (!day.inCurrentMonth) setView(day.date.getFullYear(), day.date.getMonth() + 1)
}

function handleDayKeydown(day: DlCalendarDay, event: KeyboardEvent) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    selectDay(day, event)
    return
  }
  const movement = event.key === 'ArrowLeft' ? -1
    : event.key === 'ArrowRight' ? 1
      : event.key === 'ArrowUp' ? -7
        : event.key === 'ArrowDown' ? 7
          : 0
  if (movement) {
    event.preventDefault()
    moveDayFocus(day.date, movement)
    return
  }
  if (event.key === 'Home' || event.key === 'End') {
    event.preventDefault()
    const index = days.value.findIndex(candidate => candidate.key === day.key)
    const offset = index % 7
    moveDayFocus(day.date, event.key === 'Home' ? -offset : 6 - offset)
    return
  }
  if (event.key === 'PageUp' || event.key === 'PageDown') {
    event.preventDefault()
    moveDayFocusByMonth(day.date, (event.key === 'PageUp' ? -1 : 1) * (event.shiftKey ? 12 : 1))
  }
}

function focusDay(value: Date) {
  const key = dateKey(value)
  focusedDayKey.value = key
  if (monthKey(value) !== resolvedView.value)
    setView(value.getFullYear(), value.getMonth() + 1)
  nextTick(() => calendarRoot.value?.querySelector<HTMLElement>(`[data-day-key="${key}"]`)?.focus())
}

function moveDayFocus(value: Date, amount: number) {
  const next = new Date(value)
  next.setDate(next.getDate() + amount)
  focusDay(next)
}

function moveDayFocusByMonth(value: Date, amount: number) {
  const targetMonth = new Date(value.getFullYear(), value.getMonth() + amount, 1)
  const lastDay = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0).getDate()
  targetMonth.setDate(Math.min(value.getDate(), lastDay))
  focusDay(targetMonth)
}

function createForDay(day: DlCalendarDay, event: MouseEvent) {
  event.stopPropagation()
  if (!props.disabled) emit('create', day, event)
}

function clickItem(item: DlCalendarItem, day: DlCalendarDay, event: MouseEvent) {
  event.stopPropagation()
  if (!props.disabled && !item.disabled) emit('item-click', item, day, event)
}

function dayForDate(value: Date): DlCalendarDay {
  const key = dateKey(value)
  const [year, month] = viewParts.value
  return {
    key,
    date: value,
    day: value.getDate(),
    inCurrentMonth: value.getFullYear() === year && value.getMonth() === month - 1,
    isToday: key === todayKey.value,
    isSelected: key === props.modelValue,
    items: itemsByDate.value.get(key) ?? [],
  }
}

function moveItemByKeyboard(item: DlCalendarItem, day: DlCalendarDay, event: KeyboardEvent) {
  if (!event.altKey || !itemDraggable(item)) return
  const amount = event.key === 'ArrowLeft' ? -1
    : event.key === 'ArrowRight' ? 1
      : event.key === 'ArrowUp' ? -7
        : event.key === 'ArrowDown' ? 7
          : 0
  if (!amount) return
  event.preventDefault()
  event.stopPropagation()
  const targetDate = new Date(day.date)
  targetDate.setDate(targetDate.getDate() + amount)
  emit('item-move', item, day, dayForDate(targetDate), event)
}

function itemDraggable(item: DlCalendarItem) {
  return props.draggable && item.draggable !== false && !props.disabled && !item.disabled
}

function startDrag(item: DlCalendarItem, event: DragEvent) {
  if (!itemDraggable(item)) return
  draggingId.value = String(item.id)
  event.dataTransfer?.setData('application/x-dragon-liquid-calendar-item', String(item.id))
  event.dataTransfer?.setData('text/plain', String(item.id))
  if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move'
  emit('item-drag-start', item, event)
}

function endDrag(item: DlCalendarItem, event: DragEvent) {
  draggingId.value = ''
  dropTarget.value = ''
  emit('item-drag-end', item, event)
}

function markDropTarget(day: DlCalendarDay, event: DragEvent) {
  if (!draggingId.value || props.disabled || (!props.showOutsideDays && !day.inCurrentMonth)) return
  event.preventDefault()
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'move'
  dropTarget.value = day.key
}

function dropItem(day: DlCalendarDay, event: DragEvent) {
  if (!draggingId.value || props.disabled) return
  event.preventDefault()
  const id = event.dataTransfer?.getData('application/x-dragon-liquid-calendar-item') || draggingId.value
  const item = props.items.find(candidate => String(candidate.id) === id)
  draggingId.value = ''
  dropTarget.value = ''
  if (!item || item.date === day.key || item.disabled) return
  emit('item-drop', item, day, event)
}
</script>

<template>
  <section ref="calendarRoot" data-dl data-slot="calendar" class="dl-calendar" :data-disabled="disabled || undefined" :style="calendarStyle">
    <header v-if="showToolbar" class="dl-calendar__toolbar">
      <slot name="toolbar" :view-value="resolvedView" :heading="heading" :previous="() => changeMonth(-1)" :next="() => changeMonth(1)" :today="goToday">
        <button type="button" class="dl-calendar__nav" aria-label="上个月" :disabled="disabled" @click="changeMonth(-1)">‹</button>
        <slot name="heading" :view-value="resolvedView" :heading="heading"><strong>{{ heading }}</strong></slot>
        <button v-if="showToday" type="button" class="dl-calendar__today" :disabled="disabled" @click="goToday">{{ todayLabel }}</button>
        <button type="button" class="dl-calendar__nav" aria-label="下个月" :disabled="disabled" @click="changeMonth(1)">›</button>
      </slot>
    </header>

    <div class="dl-calendar__viewport">
      <div class="dl-calendar__weekdays" role="row">
        <span v-for="label in weekDays" :key="label" role="columnheader">{{ label }}</span>
      </div>
      <div class="dl-calendar__grid" role="grid" :aria-label="heading">
        <article
          v-for="day in days"
          :key="day.key"
          class="dl-calendar__day"
          :class="{
            'is-outside': !day.inCurrentMonth,
            'is-today': day.isToday,
            'is-selected': day.isSelected,
            'is-blank': !showOutsideDays && !day.inCurrentMonth,
          }"
          :data-drop-target="dropTarget === day.key || undefined"
          :data-day-key="day.key"
          role="gridcell"
          :aria-label="day.key"
          :aria-selected="day.isSelected"
          :aria-current="day.isToday ? 'date' : undefined"
          :tabindex="disabled || (!showOutsideDays && !day.inCurrentMonth) || day.key !== focusedDayKey ? -1 : 0"
          @click="selectDay(day, $event)"
          @focus="focusedDayKey = day.key"
          @keydown="handleDayKeydown(day, $event)"
          @dragenter="markDropTarget(day, $event)"
          @dragover="markDropTarget(day, $event)"
          @drop="dropItem(day, $event)"
        >
          <template v-if="showOutsideDays || day.inCurrentMonth">
            <header class="dl-calendar__day-heading">
              <slot name="day-heading" :day="day"><strong>{{ day.day }}</strong></slot>
              <slot name="day-action" :day="day">
                <button v-if="showCreate" type="button" class="dl-calendar__create" :aria-label="`${createLabel}，${day.key}`" @click="createForDay(day, $event)">＋</button>
              </slot>
            </header>
            <div class="dl-calendar__items">
              <button
                v-for="item in day.items"
                :key="item.id"
                type="button"
                class="dl-calendar__item"
                :data-completed="item.completed || undefined"
                :data-dragging="draggingId === String(item.id) || undefined"
                :disabled="disabled || item.disabled"
                :draggable="itemDraggable(item)"
                :aria-keyshortcuts="itemDraggable(item) ? 'Alt+ArrowLeft Alt+ArrowRight Alt+ArrowUp Alt+ArrowDown' : undefined"
                :style="{ '--dl-calendar-item-color': item.color || 'var(--dl-accent)' }"
                @click="clickItem(item, day, $event)"
                @keydown="moveItemByKeyboard(item, day, $event)"
                @dragstart="startDrag(item, $event)"
                @dragend="endDrag(item, $event)"
              >
                <slot name="item" :item="item" :day="day"><span>{{ item.title }}</span><i v-if="itemDraggable(item)" aria-hidden="true">⋮</i></slot>
              </button>
              <slot v-if="!day.items.length" name="empty-day" :day="day" />
            </div>
          </template>
        </article>
      </div>
    </div>
  </section>
</template>

<style>
.dl-calendar { display: grid; width: 100%; min-width: 0; min-height: 0; grid-template-rows: auto minmax(0, 1fr); gap: 9px; color: var(--dl-text); }
.dl-calendar[data-disabled] { opacity: .55; }
.dl-calendar__toolbar { display: grid; min-height: 40px; grid-template-columns: auto minmax(0, 1fr) auto auto; align-items: center; gap: 7px; }
.dl-calendar__toolbar > strong { overflow: hidden; font-size: .92rem; text-align: center; text-overflow: ellipsis; white-space: nowrap; }
.dl-calendar__nav, .dl-calendar__today, .dl-calendar__create { border: 1px solid var(--dl-border); background: var(--dl-surface); color: var(--dl-text-muted); outline: none; cursor: pointer; transition: .16s ease; }
.dl-calendar__nav { display: grid; width: 34px; height: 34px; place-items: center; border-radius: 10px; font-size: 1.15rem; }
.dl-calendar__today { min-height: 32px; padding-inline: 10px; border-radius: 9px; font-size: .68rem; font-weight: 800; }
.dl-calendar__nav:hover:not(:disabled), .dl-calendar__today:hover:not(:disabled), .dl-calendar__create:hover:not(:disabled) { border-color: var(--dl-accent-border); background: var(--dl-accent-surface); color: var(--dl-accent-text); }
.dl-calendar__nav:focus-visible, .dl-calendar__today:focus-visible, .dl-calendar__create:focus-visible, .dl-calendar__day:focus-visible, .dl-calendar__item:focus-visible { box-shadow: var(--dl-focus); }
.dl-calendar__nav:disabled, .dl-calendar__today:disabled { cursor: not-allowed; opacity: .4; }
.dl-calendar__viewport { min-width: 0; min-height: 0; overflow: auto; scrollbar-gutter: stable; }
.dl-calendar__weekdays, .dl-calendar__grid { display: grid; min-width: 720px; grid-template-columns: repeat(7, minmax(96px, 1fr)); gap: 7px; }
.dl-calendar__weekdays { position: sticky; top: 0; z-index: 2; min-height: 30px; align-items: center; padding-bottom: 4px; background: var(--dl-surface-solid); }
.dl-calendar__weekdays span { color: var(--dl-text-faint); font-size: .62rem; font-weight: 800; text-align: center; }
.dl-calendar__grid { grid-template-rows: repeat(var(--dl-calendar-week-count), minmax(var(--dl-calendar-day-min-height), 1fr)); }
.dl-calendar__day { display: grid; min-width: 0; min-height: 0; grid-template-rows: auto minmax(0, 1fr); overflow: hidden; padding: 6px; border: 1px solid var(--dl-border); border-radius: 12px; background: var(--dl-night-soft); outline: none; transition: border-color .16s ease, background .16s ease, opacity .16s ease; }
.dl-calendar__day:hover { border-color: var(--dl-border-strong); }
.dl-calendar__day.is-outside { opacity: .46; }
.dl-calendar__day.is-today { border-color: var(--dl-accent-border); background: var(--dl-accent-surface); }
.dl-calendar__day.is-selected { box-shadow: inset 0 0 0 1px var(--dl-accent); }
.dl-calendar__day.is-blank { visibility: hidden; pointer-events: none; }
.dl-calendar__day[data-drop-target] { border-color: var(--dl-accent); background: color-mix(in srgb, var(--dl-accent-surface) 78%, var(--dl-surface)); box-shadow: inset 0 0 0 1px var(--dl-accent); }
.dl-calendar__day-heading { display: flex; min-height: 25px; align-items: center; justify-content: space-between; gap: 5px; }
.dl-calendar__day-heading strong { display: grid; min-width: 24px; height: 24px; place-items: center; border-radius: 8px; font-size: .72rem; font-variant-numeric: tabular-nums; }
.dl-calendar__day.is-today .dl-calendar__day-heading strong { background: var(--dl-accent); color: var(--dl-button-primary-text); }
.dl-calendar__create { display: grid; width: 24px; height: 24px; place-items: center; padding: 0; border-color: transparent; border-radius: 8px; background: transparent; font-size: .8rem; }
.dl-calendar__items { min-height: 0; overflow-y: auto; overscroll-behavior: contain; padding: 1px 2px 1px 0; scrollbar-gutter: stable; scrollbar-width: thin; }
.dl-calendar__item { display: grid; width: 100%; min-width: 0; min-height: 25px; grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: 4px; margin-top: 4px; padding: 4px 5px 4px 7px; overflow: hidden; border: 0; border-left: 3px solid var(--dl-calendar-item-color); border-radius: 5px; background: var(--dl-surface); color: var(--dl-text-muted); outline: none; cursor: pointer; text-align: left; }
.dl-calendar__item:hover:not(:disabled) { background: var(--dl-surface-hover); color: var(--dl-text); }
.dl-calendar__item span { overflow: hidden; font-size: .64rem; font-weight: 720; text-overflow: ellipsis; white-space: nowrap; }
.dl-calendar__item i { color: var(--dl-text-faint); font-size: .62rem; font-style: normal; }
.dl-calendar__item[data-completed] { opacity: .48; text-decoration: line-through; }
.dl-calendar__item[data-dragging] { opacity: .3; }
.dl-calendar__item[draggable='true'] { cursor: grab; }
.dl-calendar__item[draggable='true']:active { cursor: grabbing; }
.dl-calendar__item:disabled { cursor: not-allowed; opacity: .42; }
@media (max-width: 720px) { .dl-calendar__weekdays, .dl-calendar__grid { min-width: 680px; } }
</style>
