<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from 'reka-ui'
import { useDlModalLayer } from '../composables/useDlLayer'
import type { DlTone } from '../types'
import type { DlDialogDimensions, DlDialogDock, DlDialogPosition } from './dialog.types'
import { dialogStyles } from './overlay.styles'

type DialogInteraction =
  | {
      type: 'drag'
      pointerX: number
      pointerY: number
      position: DlDialogPosition
      dimensions: DlDialogDimensions
    }
  | {
      type: 'resize'
      pointerX: number
      pointerY: number
      position: DlDialogPosition
      dimensions: DlDialogDimensions
    }

type DialogContentRef = HTMLElement | { $el?: HTMLElement; forwardRef?: HTMLElement }

const props = withDefaults(defineProps<{
  open?: boolean
  title: string
  description?: string
  size?: 'sm' | 'md' | 'lg'
  tone?: DlTone
  closable?: boolean
  zIndex?: number
  draggable?: boolean
  resizable?: boolean
  position?: DlDialogPosition | null
  dimensions?: DlDialogDimensions | null
  minWidth?: number
  minHeight?: number
  resetGeometryOnClose?: boolean
  fullscreen?: boolean
  modal?: boolean
  overlay?: boolean
  dismissOnInteractOutside?: boolean
  floating?: boolean
  collapsible?: boolean
  collapsed?: boolean
  collapsedWidth?: number
  dockable?: boolean
  dock?: DlDialogDock
}>(), {
  open: false,
  description: undefined,
  size: 'md',
  tone: 'default',
  closable: true,
  zIndex: undefined,
  draggable: true,
  resizable: true,
  position: undefined,
  dimensions: undefined,
  minWidth: 320,
  minHeight: 200,
  resetGeometryOnClose: true,
  fullscreen: false,
  modal: true,
  overlay: true,
  dismissOnInteractOutside: true,
  floating: false,
  collapsible: false,
  collapsed: false,
  collapsedWidth: 320,
  dockable: false,
  dock: 'none',
})

const emit = defineEmits<{
  'update:open': [value: boolean]
  'update:position': [value: DlDialogPosition | null]
  'update:dimensions': [value: DlDialogDimensions | null]
  'update:collapsed': [value: boolean]
  'update:dock': [value: DlDialogDock]
  'collapse-change': [value: boolean]
  'dock-change': [value: DlDialogDock]
  'drag-start': [value: DlDialogPosition]
  'drag-end': [value: DlDialogPosition]
  'resize-start': [value: DlDialogDimensions]
  'resize-end': [value: DlDialogDimensions]
}>()

const { overlayZIndex, contentZIndex } = useDlModalLayer(() => props.zIndex)
const contentRef = ref<DialogContentRef | null>(null)
const localPosition = ref<DlDialogPosition | null>(copyPosition(props.position))
const localDimensions = ref<DlDialogDimensions | null>(copyDimensions(props.dimensions))
const interaction = ref<DialogInteraction | null>(null)
const compactLayout = ref(false)
const viewportMargin = 12
let initialPosition = copyPosition(props.position)
let initialDimensions = copyDimensions(props.dimensions)
let previousBodyCursor = ''
let previousBodyUserSelect = ''

const contentStyle = computed(() => {
  const style: Record<string, string> = { zIndex: contentZIndex.value }
  if (props.fullscreen) return style

  if (props.collapsed) {
    style.width = `min(${finitePositive(props.collapsedWidth, 320)}px, calc(100vw - ${viewportMargin * 2}px))`
    style.height = 'auto'
    style.maxWidth = 'none'
    style.maxHeight = 'none'
    style.transform = 'none'
    if (props.dock === 'left') {
      style.left = `${viewportMargin}px`
      style.top = `${viewportMargin}px`
    } else if (props.dock === 'bottom') {
      style.right = `${viewportMargin}px`
      style.bottom = `${viewportMargin}px`
      style.left = 'auto'
      style.top = 'auto'
    } else if (props.dock === 'right') {
      style.right = `${viewportMargin}px`
      style.top = `${viewportMargin}px`
      style.left = 'auto'
    } else if (localPosition.value && !compactLayout.value) {
      style.left = `${localPosition.value.x}px`
      style.top = `${localPosition.value.y}px`
    } else {
      style.right = `${viewportMargin}px`
      style.bottom = `${viewportMargin}px`
      style.left = 'auto'
      style.top = 'auto'
    }
    return style
  }

  if (compactLayout.value) return style

  if (props.dock !== 'none') {
    style.transform = 'none'
    style.maxWidth = 'none'
    style.maxHeight = 'none'
    if (props.dock === 'left' || props.dock === 'right') {
      style.top = `${viewportMargin}px`
      style.bottom = `${viewportMargin}px`
      style.left = props.dock === 'left' ? `${viewportMargin}px` : 'auto'
      style.right = props.dock === 'right' ? `${viewportMargin}px` : 'auto'
      style.width = `${Math.min(localDimensions.value?.width ?? 860, window.innerWidth - viewportMargin * 2)}px`
      style.height = 'auto'
    } else {
      style.left = `${viewportMargin}px`
      style.right = `${viewportMargin}px`
      style.bottom = `${viewportMargin}px`
      style.top = 'auto'
      style.width = 'auto'
      style.height = `${Math.min(localDimensions.value?.height ?? 520, window.innerHeight - viewportMargin * 2)}px`
    }
    return style
  }

  if (localPosition.value) {
    style.left = `${localPosition.value.x}px`
    style.top = `${localPosition.value.y}px`
    style.transform = 'none'
  }
  if (localDimensions.value) {
    style.width = `${localDimensions.value.width}px`
    style.height = `${localDimensions.value.height}px`
    style.maxWidth = 'none'
    style.maxHeight = 'none'
  }
  return style
})

function copyPosition(value?: DlDialogPosition | null) {
  return value ? { x: value.x, y: value.y } : null
}

function copyDimensions(value?: DlDialogDimensions | null) {
  return value ? { width: value.width, height: value.height } : null
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), Math.max(min, max))
}

function finitePositive(value: number, fallback: number) {
  return Number.isFinite(value) && value > 0 ? value : fallback
}

function isCompactViewport() {
  return window.innerWidth <= 720 || window.innerHeight <= 520
}

function getViewportLimits() {
  return {
    width: Math.max(1, window.innerWidth - viewportMargin * 2),
    height: Math.max(1, window.innerHeight - viewportMargin * 2),
  }
}

function normalizeDimensions(value: DlDialogDimensions, position: DlDialogPosition) {
  const viewport = getViewportLimits()
  const maxWidth = Math.max(1, window.innerWidth - position.x - viewportMargin)
  const maxHeight = Math.max(1, window.innerHeight - position.y - viewportMargin)
  const minWidth = Math.min(finitePositive(props.minWidth, 320), viewport.width, maxWidth)
  const minHeight = Math.min(finitePositive(props.minHeight, 200), viewport.height, maxHeight)
  return {
    width: clamp(finitePositive(value.width, minWidth), minWidth, maxWidth),
    height: clamp(finitePositive(value.height, minHeight), minHeight, maxHeight),
  }
}

function normalizePosition(value: DlDialogPosition, dimensions: DlDialogDimensions) {
  const viewport = getViewportLimits()
  const width = Math.min(finitePositive(dimensions.width, viewport.width), viewport.width)
  const height = Math.min(finitePositive(dimensions.height, viewport.height), viewport.height)
  return {
    x: clamp(Number.isFinite(value.x) ? value.x : viewportMargin, viewportMargin, window.innerWidth - width - viewportMargin),
    y: clamp(Number.isFinite(value.y) ? value.y : viewportMargin, viewportMargin, window.innerHeight - height - viewportMargin),
  }
}

function contentElement() {
  const value = contentRef.value
  if (value instanceof HTMLElement) return value
  if (value?.forwardRef instanceof HTMLElement) return value.forwardRef
  return value?.$el instanceof HTMLElement ? value.$el : null
}

function currentGeometry() {
  const rect = contentElement()?.getBoundingClientRect()
  if (!rect) return null
  const dimensions = props.collapsed
    ? { width: rect.width, height: rect.height }
    : localDimensions.value ?? { width: rect.width, height: rect.height }
  const position = localPosition.value ?? { x: rect.left, y: rect.top }
  return {
    dimensions,
    position: normalizePosition(position, dimensions),
  }
}

function updatePosition(value: DlDialogPosition, notify = true) {
  localPosition.value = { ...value }
  if (notify) emit('update:position', { ...value })
}

function updateDimensions(value: DlDialogDimensions, notify = true) {
  localDimensions.value = { ...value }
  if (notify) emit('update:dimensions', { ...value })
}

function beginInteraction(type: DialogInteraction['type'], event: PointerEvent) {
  if (event.button !== 0 || event.isPrimary === false || compactLayout.value || props.fullscreen) return
  if (props.dock !== 'none') return
  if (type === 'drag' && !props.draggable) return
  if (type === 'resize' && !props.resizable) return

  const geometry = currentGeometry()
  if (!geometry) return
  const dimensions = type === 'resize'
    ? normalizeDimensions(geometry.dimensions, geometry.position)
    : geometry.dimensions
  const position = normalizePosition(geometry.position, dimensions)
  updatePosition(position, false)
  if (type === 'resize') updateDimensions(dimensions, false)
  interaction.value = {
    type,
    pointerX: event.clientX,
    pointerY: event.clientY,
    position,
    dimensions,
  }
  previousBodyCursor = document.body.style.cursor
  previousBodyUserSelect = document.body.style.userSelect
  document.body.style.cursor = type === 'drag' ? 'grabbing' : 'nwse-resize'
  document.body.style.userSelect = 'none'
  window.addEventListener('pointermove', handlePointerMove)
  window.addEventListener('pointerup', finishInteraction)
  window.addEventListener('pointercancel', finishInteraction)
  event.preventDefault()
  if (type === 'drag') emit('drag-start', { ...position })
  else emit('resize-start', { ...dimensions })
}

function startHeaderDrag(event: PointerEvent) {
  const target = event.target as HTMLElement | null
  if (target?.closest('button, a, input, textarea, select, [contenteditable="true"], [data-dl-no-drag]')) return
  beginInteraction('drag', event)
}

function handlePointerMove(event: PointerEvent) {
  const active = interaction.value
  if (!active) return
  const deltaX = event.clientX - active.pointerX
  const deltaY = event.clientY - active.pointerY
  if (active.type === 'drag') {
    updatePosition(normalizePosition({
      x: active.position.x + deltaX,
      y: active.position.y + deltaY,
    }, active.dimensions))
  } else {
    updateDimensions(normalizeDimensions({
      width: active.dimensions.width + deltaX,
      height: active.dimensions.height + deltaY,
    }, active.position))
  }
  event.preventDefault()
}

function finishInteraction() {
  const active = interaction.value
  if (!active) return
  interaction.value = null
  window.removeEventListener('pointermove', handlePointerMove)
  window.removeEventListener('pointerup', finishInteraction)
  window.removeEventListener('pointercancel', finishInteraction)
  document.body.style.cursor = previousBodyCursor
  document.body.style.userSelect = previousBodyUserSelect
  if (active.type === 'drag' && localPosition.value) emit('drag-end', { ...localPosition.value })
  if (active.type === 'resize' && localDimensions.value) emit('resize-end', { ...localDimensions.value })
}

function moveWithKeyboard(event: KeyboardEvent) {
  if (!props.draggable || compactLayout.value) return
  const directions: Record<string, [number, number]> = {
    ArrowLeft: [-1, 0],
    ArrowRight: [1, 0],
    ArrowUp: [0, -1],
    ArrowDown: [0, 1],
  }
  const direction = directions[event.key]
  if (!direction) return
  const geometry = currentGeometry()
  if (!geometry) return
  const step = event.shiftKey ? 40 : 10
  updatePosition(normalizePosition({
    x: geometry.position.x + direction[0] * step,
    y: geometry.position.y + direction[1] * step,
  }, geometry.dimensions))
  event.preventDefault()
}

function resizeWithKeyboard(event: KeyboardEvent) {
  if (!props.resizable || compactLayout.value || props.collapsed || props.dock !== 'none') return
  const directions: Record<string, [number, number]> = {
    ArrowLeft: [-1, 0],
    ArrowRight: [1, 0],
    ArrowUp: [0, -1],
    ArrowDown: [0, 1],
  }
  const direction = directions[event.key]
  if (!direction) return
  const geometry = currentGeometry()
  if (!geometry) return
  const step = event.shiftKey ? 40 : 10
  updatePosition(geometry.position, false)
  updateDimensions(normalizeDimensions({
    width: geometry.dimensions.width + direction[0] * step,
    height: geometry.dimensions.height + direction[1] * step,
  }, geometry.position))
  event.preventDefault()
}

function resetPosition() {
  const value = copyPosition(initialPosition)
  localPosition.value = value
  emit('update:position', value)
}

function resetDimensions() {
  const value = copyDimensions(initialDimensions)
  localDimensions.value = value
  emit('update:dimensions', value)
}

function captureInitialGeometry() {
  initialPosition = copyPosition(props.position)
  initialDimensions = copyDimensions(props.dimensions)
  localPosition.value = copyPosition(props.position)
  localDimensions.value = copyDimensions(props.dimensions)
}

function resetGeometry(notify = true) {
  finishInteraction()
  localPosition.value = copyPosition(initialPosition)
  localDimensions.value = copyDimensions(initialDimensions)
  if (notify) {
    emit('update:position', copyPosition(initialPosition))
    emit('update:dimensions', copyDimensions(initialDimensions))
  }
}

async function keepGeometryInViewport() {
  compactLayout.value = isCompactViewport()
  if (compactLayout.value || !props.open) return
  await nextTick()
  const geometry = currentGeometry()
  if (!geometry) return
  if (localDimensions.value) {
    const dimensions = normalizeDimensions(geometry.dimensions, geometry.position)
    updateDimensions(dimensions)
    updatePosition(normalizePosition(geometry.position, dimensions))
  } else if (localPosition.value) {
    updatePosition(normalizePosition(geometry.position, geometry.dimensions))
  }
}

function handleOpenChange(value: boolean) {
  emit('update:open', value)
  if (!value) finishInteraction()
}

function handleInteractOutside(event: Event) {
  if (!props.dismissOnInteractOutside) event.preventDefault()
}

function handleHeaderDoubleClick(event: MouseEvent) {
  const target = event.target as HTMLElement | null
  if (target?.closest('button, a, input, textarea, select, [contenteditable="true"], [data-dl-no-drag]')) return
  toggleCollapsed()
}

function toggleCollapsed() {
  if (!props.collapsible || props.fullscreen) return
  const value = !props.collapsed
  emit('update:collapsed', value)
  emit('collapse-change', value)
}

const dockSequence: DlDialogDock[] = ['none', 'right', 'bottom', 'left']

function cycleDock() {
  if (!props.dockable || props.fullscreen) return
  const currentIndex = dockSequence.indexOf(props.dock)
  const value = dockSequence[(currentIndex + 1) % dockSequence.length]
  emit('update:dock', value)
  emit('dock-change', value)
}

const dockActionLabel = computed(() => ({
  none: '停靠到右侧',
  right: '停靠到底部',
  bottom: '停靠到左侧',
  left: '恢复为浮动窗口',
}[props.dock]))

const dockGlyph = computed(() => ({
  none: '◧',
  right: '▐',
  bottom: '▄',
  left: '▌',
}[props.dock]))

watch(() => [props.position?.x, props.position?.y], () => {
  localPosition.value = copyPosition(props.position)
  if (!props.open) initialPosition = copyPosition(props.position)
})
watch(() => [props.dimensions?.width, props.dimensions?.height], () => {
  localDimensions.value = copyDimensions(props.dimensions)
  if (!props.open) initialDimensions = copyDimensions(props.dimensions)
})
watch(() => props.open, (open) => {
  if (!open) {
    if (props.resetGeometryOnClose) resetGeometry()
    else finishInteraction()
    return
  }
  captureInitialGeometry()
  void keepGeometryInViewport()
})

onMounted(() => {
  compactLayout.value = isCompactViewport()
  window.addEventListener('resize', keepGeometryInViewport)
  if (props.open) void keepGeometryInViewport()
})

onBeforeUnmount(() => {
  finishInteraction()
  window.removeEventListener('resize', keepGeometryInViewport)
})
</script>

<template>
  <DialogRoot :open="open" :modal="modal" @update:open="handleOpenChange">
    <DialogTrigger v-if="$slots.trigger" as-child><slot name="trigger" /></DialogTrigger>
    <DialogPortal>
      <DialogOverlay
        v-if="modal && overlay"
        data-dl
        data-dl-layer="overlay"
        :style="{ zIndex: overlayZIndex }"
        class="dl-dialog-overlay"
      />
      <DialogContent
        ref="contentRef"
        data-dl
        data-slot="dialog"
        :data-dl-layer="modal ? 'modal' : 'floating'"
        data-guide-surface="dialog"
        :data-size="size"
        :data-fullscreen="fullscreen ? 'true' : 'false'"
        :data-modal="modal ? 'true' : 'false'"
        :data-floating="floating ? 'true' : 'false'"
        :data-collapsed="collapsed ? 'true' : 'false'"
        :data-dock="dock"
        :data-draggable="draggable && !compactLayout && !fullscreen && dock === 'none' ? 'true' : 'false'"
        :data-resizable="resizable && !compactLayout && !fullscreen && !collapsed && dock === 'none' ? 'true' : 'false'"
        :data-interaction="interaction?.type"
        :style="contentStyle"
        :class="dialogStyles({ size, tone })"
        @interact-outside="handleInteractOutside"
      >
        <header class="dl-dialog__header" @pointerdown="startHeaderDrag" @dblclick="handleHeaderDoubleClick">
          <div class="dl-dialog__meta">
            <DialogTitle class="dl-dialog__title">{{ title }}</DialogTitle>
            <DialogDescription v-if="description" v-show="!collapsed" class="dl-dialog__description">{{ description }}</DialogDescription>
          </div>
          <div class="dl-dialog__window-actions">
            <button
              v-if="draggable && !fullscreen && dock === 'none'"
              data-slot="dialog-drag-handle"
              class="dl-dialog__drag-handle"
              type="button"
              aria-label="移动对话框；使用方向键微调位置"
              title="拖动或使用方向键移动；双击恢复居中"
              @pointerdown.stop="beginInteraction('drag', $event)"
              @keydown="moveWithKeyboard"
              @dblclick="resetPosition"
            >
              <span aria-hidden="true">⠿</span>
            </button>
            <button
              v-if="dockable && !fullscreen"
              data-dl-no-drag
              data-slot="dialog-dock-control"
              class="dl-dialog__window-button dl-dialog__dock-control"
              type="button"
              :aria-label="dockActionLabel"
              :title="`${dockActionLabel}；依次切换右侧、底部、左侧和浮动`"
              @click.stop="cycleDock"
            ><span aria-hidden="true">{{ dockGlyph }}</span></button>
            <button
              v-if="collapsible && !fullscreen"
              data-dl-no-drag
              data-slot="dialog-collapse-control"
              class="dl-dialog__window-button dl-dialog__collapse-control"
              type="button"
              :aria-label="collapsed ? '展开对话框' : '折叠对话框'"
              :title="collapsed ? '展开对话框' : '折叠为标题条；也可以双击标题栏'"
              :aria-expanded="!collapsed"
              @click.stop="toggleCollapsed"
            ><span aria-hidden="true">{{ collapsed ? '□' : '−' }}</span></button>
            <DialogClose
              v-if="closable"
              data-guide-closes="dialog"
              class="dl-dialog__close"
              aria-label="关闭"
            >
              ×
            </DialogClose>
          </div>
        </header>
        <div v-show="!collapsed" class="dl-dialog__body"><slot /></div>
        <footer v-if="$slots.footer" v-show="!collapsed" class="dl-dialog__footer">
          <slot name="footer" />
        </footer>
        <button
          v-if="resizable && !fullscreen && !collapsed && dock === 'none'"
          data-slot="dialog-resize-handle"
          class="dl-dialog__resize-handle"
          type="button"
          aria-label="调整对话框尺寸；使用方向键微调大小"
          title="拖动或使用方向键调整尺寸；双击恢复默认尺寸"
          @pointerdown="beginInteraction('resize', $event)"
          @keydown="resizeWithKeyboard"
          @dblclick="resetDimensions"
        ><span aria-hidden="true" /></button>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<style>
.dl-dialog-overlay {
  position: fixed;
  inset: 0;
  background:
    radial-gradient(circle at 50% 12%, rgba(190, 126, 22, 0.05), transparent 24%),
    rgba(15, 23, 42, 0.28);
  backdrop-filter: blur(10px) saturate(104%);
}

.dl-dialog {
  --dl-dialog-width: 640px;
  --dl-dialog-background: var(--dl-panel);
  --dl-dialog-inset-highlight: rgba(255, 255, 255, 0.9);
  --dl-dialog-sheen: linear-gradient(135deg, rgba(255, 255, 255, 0.65), transparent 24%);
  --dl-dialog-sheen-opacity: 0.6;
  --dl-overlay-border: rgba(15, 23, 42, 0.14);
  --dl-overlay-rail: linear-gradient(90deg, rgba(164, 105, 11, 0.12), rgba(148, 163, 184, 0.32), rgba(71, 85, 105, 0.08));
  --dl-overlay-glow: rgba(15, 23, 42, 0.04);
  position: fixed;
  left: 50%;
  top: 50%;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  gap: 20px;
  width: min(calc(100vw - 2rem), var(--dl-dialog-width));
  max-width: var(--dl-dialog-width);
  max-height: calc(100dvh - 48px);
  padding: 24px;
  transform: translate(-50%, -50%);
  overflow: hidden;
  isolation: isolate;
  border: 1px solid var(--dl-overlay-border);
  border-radius: 28px;
  background: var(--dl-dialog-background);
  box-shadow:
    inset 0 1px 0 var(--dl-dialog-inset-highlight),
    0 24px 60px rgba(15, 23, 42, 0.18),
    0 0 40px var(--dl-overlay-glow);
  color: var(--dl-text);
  outline: none;
  backdrop-filter: blur(24px) saturate(106%);
  box-sizing: border-box;
}

.dl-dialog::before {
  content: '';
  position: absolute;
  inset: 1px;
  z-index: -1;
  border-radius: inherit;
  pointer-events: none;
  background: var(--dl-dialog-sheen);
  opacity: var(--dl-dialog-sheen-opacity);
}

.dl-dialog::after {
  content: '';
  position: absolute;
  inset: 0 0 auto;
  height: 3px;
  background: var(--dl-overlay-rail);
  opacity: 0.92;
  pointer-events: none;
}

.dl-dialog--sm { --dl-dialog-width: 500px; gap: 16px; padding: 20px; border-radius: 22px; }
.dl-dialog--md { --dl-dialog-width: 640px; }
.dl-dialog--lg { --dl-dialog-width: 840px; gap: 24px; padding: 28px; border-radius: 32px; }
.dl-dialog[data-fullscreen='true']{inset:12px;width:auto;max-width:none;height:auto;max-height:none;transform:none;border-radius:20px}
.dl-dialog[data-floating='true']{gap:0;padding:0;border-color:var(--dl-border-strong);border-radius:12px;background:var(--dl-surface-solid);box-shadow:0 12px 34px rgba(15,23,42,.2),0 2px 8px rgba(15,23,42,.1);backdrop-filter:blur(14px) saturate(104%)}
.dl-dialog[data-floating='true']::before,.dl-dialog[data-floating='true']::after{display:none}
.dl-dialog[data-floating='true'] .dl-dialog__header{align-items:center;gap:8px;padding:6px 7px 6px 10px;border-bottom:1px solid var(--dl-border)}
.dl-dialog[data-floating='true'] .dl-dialog__meta{gap:2px}.dl-dialog[data-floating='true'] .dl-dialog__title{font-size:.74rem;line-height:1.15;letter-spacing:.02em}.dl-dialog[data-floating='true'] .dl-dialog__description{font-size:.62rem;line-height:1.25}
.dl-dialog[data-floating='true'] .dl-dialog__body{gap:4px;padding:6px}.dl-dialog[data-floating='true'] .dl-dialog__footer{gap:5px;padding:6px;border-top:1px solid var(--dl-border)}
.dl-dialog[data-floating='true'] .dl-dialog__window-actions{gap:3px}.dl-dialog[data-floating='true'] .dl-dialog__drag-handle,.dl-dialog[data-floating='true'] .dl-dialog__close{width:26px;height:26px;border-radius:7px;font-size:.76rem}.dl-dialog[data-floating='true'] .dl-dialog__drag-handle{height:26px}.dl-dialog[data-floating='true'] .dl-dialog__resize-handle{right:2px;bottom:2px;width:18px;height:18px}
.dl-dialog[data-floating='true'] .dl-dialog__window-button{width:26px;height:26px;border-radius:7px;font-size:.72rem}
.dl-dialog[data-collapsed='true']{display:block;min-height:0;padding:0;border-radius:9px}
.dl-dialog[data-collapsed='true'] .dl-dialog__header{min-height:34px;padding:4px 5px 4px 9px;border:0}
.dl-dialog[data-collapsed='true'] .dl-dialog__meta{display:block;overflow:hidden}
.dl-dialog[data-collapsed='true'] .dl-dialog__title{overflow:hidden;font-size:.72rem;line-height:1.1;text-overflow:ellipsis;white-space:nowrap}
.dl-dialog[data-collapsed='true'] .dl-dialog__drag-handle{display:none}
.dl-tone-accent { --dl-overlay-border: rgba(255, 223, 128, 0.34); --dl-overlay-rail: linear-gradient(90deg, rgba(104, 225, 255, 0.18), rgba(255, 215, 110, 0.74), rgba(104, 225, 255, 0.24)); --dl-overlay-glow: rgba(104, 225, 255, 0.12); }
.dl-tone-success { --dl-overlay-border: rgba(113, 209, 173, 0.34); --dl-overlay-rail: linear-gradient(90deg, rgba(124, 255, 190, 0.22), rgba(0, 206, 209, 0.62), rgba(124, 255, 190, 0.18)); --dl-overlay-glow: rgba(124, 255, 190, 0.12); }
.dl-tone-warning { --dl-overlay-border: rgba(255, 179, 71, 0.34); --dl-overlay-rail: linear-gradient(90deg, rgba(255, 178, 89, 0.24), rgba(255, 215, 110, 0.74), rgba(255, 178, 89, 0.2)); --dl-overlay-glow: rgba(255, 178, 89, 0.14); }
.dl-tone-danger { --dl-overlay-border: rgba(255, 123, 123, 0.34); --dl-overlay-rail: linear-gradient(90deg, rgba(255, 112, 112, 0.24), rgba(255, 140, 0, 0.68), rgba(255, 112, 112, 0.22)); --dl-overlay-glow: rgba(255, 112, 112, 0.14); }
.dl-tone-muted { --dl-overlay-border: rgba(116, 134, 160, 0.28); --dl-overlay-rail: linear-gradient(90deg, rgba(148, 163, 184, 0.2), rgba(104, 225, 255, 0.22), rgba(148, 163, 184, 0.14)); --dl-overlay-glow: rgba(148, 163, 184, 0.08); }

.dl-dialog__header { position: relative; z-index: 1; display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
.dl-dialog[data-draggable='true'] .dl-dialog__header { cursor: grab; touch-action: none; }
.dl-dialog[data-interaction='drag'] .dl-dialog__header { cursor: grabbing; }
.dl-dialog__meta { display: grid; gap: 9px; min-width: 0; }
.dl-dialog__title { margin: 0; color: var(--dl-text); font-size: 1.24rem; line-height: 1.18; font-weight: 900; letter-spacing: 0.01em; }
.dl-dialog--sm .dl-dialog__title { font-size: 1.12rem; }
.dl-dialog--lg .dl-dialog__title { font-size: 1.32rem; }
.dl-dialog__description { margin: 0; color: var(--dl-text-muted); font-size: 0.96rem; line-height: 1.65; }
.dl-dialog__body { position: relative; z-index: 1; min-height: 0; display: grid; gap: 14px; overflow: auto; overscroll-behavior: contain; }
.dl-dialog__footer { position: relative; z-index: 1; display: flex; justify-content: flex-end; gap: 10px; flex-wrap: wrap; }
.dl-dialog__window-actions { display: flex; align-items: center; gap: 7px; flex: 0 0 auto; }
.dl-dialog__window-button { display: grid; place-items: center; width: 34px; height: 38px; padding: 0; border: 0; border-radius: 16px; background: transparent; color: var(--dl-text-faint); font-size: .88rem; line-height: 1; cursor: pointer; outline: none; transition: .18s ease; }
.dl-dialog__window-button:hover { background: var(--dl-surface-hover); color: var(--dl-accent-text); }
.dl-dialog__window-button:focus-visible { box-shadow: var(--dl-focus); color: var(--dl-text); }
.dl-dialog__drag-handle { display: grid; place-items: center; width: 34px; height: 38px; padding: 0; border: 0; border-radius: 16px; background: transparent; color: var(--dl-text-faint); font-size: 1.15rem; line-height: 1; cursor: grab; outline: none; touch-action: none; transition: 0.18s ease; }
.dl-dialog__drag-handle:hover { background: var(--dl-surface-hover); color: var(--dl-text-muted); }
.dl-dialog__drag-handle:active { cursor: grabbing; }
.dl-dialog__drag-handle:focus-visible { box-shadow: var(--dl-focus); color: var(--dl-text); }
.dl-dialog__close { flex: 0 0 auto; display: grid; place-items: center; width: 38px; height: 38px; padding: 0; border: 1px solid var(--dl-border); border-radius: 18px; background: var(--dl-surface); color: var(--dl-text-muted); font-size: 1.1rem; line-height: 1; cursor: pointer; outline: none; transition: 0.18s ease; }
.dl-dialog__close:hover { transform: translateY(-1px); border-color: var(--dl-border-strong); background: var(--dl-surface-hover); color: var(--dl-text); box-shadow: 0 6px 16px rgba(15, 23, 42, 0.08); }
.dl-dialog__close:focus-visible, .dl-dialog:focus-visible { box-shadow: var(--dl-focus); }
.dl-dialog__resize-handle { position: absolute; right: 5px; bottom: 5px; z-index: 2; width: 24px; height: 24px; padding: 0; border: 0; border-radius: 8px 0 14px 0; background: transparent; color: var(--dl-text-faint); cursor: nwse-resize; outline: none; touch-action: none; }
.dl-dialog__resize-handle::before, .dl-dialog__resize-handle::after, .dl-dialog__resize-handle span { content: ''; position: absolute; right: 4px; bottom: 4px; height: 1px; border-radius: 1px; background: currentColor; transform: rotate(-45deg); transform-origin: right center; }
.dl-dialog__resize-handle::before { width: 7px; }
.dl-dialog__resize-handle::after { width: 12px; }
.dl-dialog__resize-handle span { width: 17px; }
.dl-dialog__resize-handle:hover { color: var(--dl-accent); background: var(--dl-surface-hover); }
.dl-dialog__resize-handle:focus-visible { box-shadow: var(--dl-focus); color: var(--dl-accent); }
.dl-dialog[data-state='open'], .dl-dialog-overlay[data-state='open'] { animation: dl-overlay-in 180ms ease-out; }
.dl-dialog[data-state='closed'], .dl-dialog-overlay[data-state='closed'] { animation: dl-overlay-out 150ms ease-in; }

@keyframes dl-overlay-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes dl-overlay-out { from { opacity: 1; } to { opacity: 0; } }

@media (max-width: 720px) {
  .dl-dialog, .dl-dialog--sm, .dl-dialog--md, .dl-dialog--lg { width: calc(100vw - 1.75rem); }
  .dl-dialog__header { cursor: default !important; touch-action: auto !important; }
  .dl-dialog__drag-handle, .dl-dialog__resize-handle { display: none; }
  .dl-dialog[data-collapsed='true'] { width: min(320px, calc(100vw - 1.5rem)); min-height: 0; }
}

@media (max-height: 520px) and (orientation: landscape) {
  .dl-dialog, .dl-dialog--sm, .dl-dialog--md, .dl-dialog--lg { width: 100%; max-width: none; min-height: 100dvh; max-height: 100dvh; gap: 8px; padding: 10px 12px; border-radius: 0; }
  .dl-dialog__header { align-items: center; gap: 10px; }
  .dl-dialog__meta { gap: 2px; }
  .dl-dialog__title { font-size: 1rem; }
  .dl-dialog__description { max-height: 2.6em; overflow: hidden; font-size: 0.78rem; line-height: 1.3; }
  .dl-dialog__body { gap: 10px; }
  .dl-dialog__close { width: 34px; height: 34px; border-radius: 16px; }
  .dl-dialog__header { cursor: default !important; touch-action: auto !important; }
  .dl-dialog__drag-handle, .dl-dialog__resize-handle { display: none; }
  .dl-dialog[data-collapsed='true'] { width: min(320px, calc(100vw - 1.5rem)); min-height: 0; max-height: none; padding: 0; border-radius: 9px; }
}
</style>
