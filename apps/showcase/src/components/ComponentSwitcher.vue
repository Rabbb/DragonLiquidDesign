<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { componentCatalog, componentCategories, componentRoute } from '../catalog'
import CustomControlMark from './CustomControlMark.vue'

const props = defineProps<{ currentComponentId?: string }>()

const open = ref(false)
const activeIndex = ref(0)
const chordMode = ref(false)
const panel = ref<HTMLElement>()
let previousFocus: HTMLElement | null = null
let previousBodyOverflow = ''

const categoryLabels = Object.fromEntries(componentCategories.map(category => [category.id, category.label]))
const activeComponent = computed(() => componentCatalog[activeIndex.value] ?? componentCatalog[0])
const activeCardId = computed(() => `component-switcher-card-${activeComponent.value.id}`)

function currentIndex() {
  const index = componentCatalog.findIndex(component => component.id === props.currentComponentId)
  return index >= 0 ? index : 0
}

function move(step: number) {
  activeIndex.value = (activeIndex.value + step + componentCatalog.length) % componentCatalog.length
}

function show(options: { chord?: boolean } = {}) {
  if (!open.value) {
    previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    activeIndex.value = currentIndex()
    open.value = true
  }
  chordMode.value = options.chord ?? false
}

function showFromButton() {
  show()
}

function close(restoreFocus = true) {
  open.value = false
  chordMode.value = false
  if (restoreFocus) nextTick(() => previousFocus?.focus())
}

function activate() {
  const component = activeComponent.value
  if (!component) return
  close(false)
  window.history.pushState(window.history.state, '', componentRoute(component.id, component.scenarios[0]?.id))
  window.dispatchEvent(new PopStateEvent('popstate'))
}

function select(index: number) {
  activeIndex.value = index
  activate()
}

function handleGlobalKeydown(event: KeyboardEvent) {
  const key = event.key.toLocaleLowerCase()
  if (!open.value && event.altKey && key === 'k') {
    event.preventDefault()
    event.stopPropagation()
    show({ chord: true })
    move(event.shiftKey ? -1 : 1)
    return
  }
  if (!open.value) return

  if (event.altKey && key === 'k') {
    event.preventDefault()
    event.stopPropagation()
    chordMode.value = true
    move(event.shiftKey ? -1 : 1)
    return
  }

  const handled = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'Enter', 'Escape', 'Tab'].includes(event.key)
  if (!handled) return
  event.preventDefault()
  event.stopPropagation()

  if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') move(-1)
  else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') move(1)
  else if (event.key === 'Home') activeIndex.value = 0
  else if (event.key === 'End') activeIndex.value = componentCatalog.length - 1
  else if (event.key === 'Enter') activate()
  else if (event.key === 'Escape') close()
}

function handleGlobalKeyup(event: KeyboardEvent) {
  if (!open.value || !chordMode.value || event.key !== 'Alt') return
  event.preventDefault()
  activate()
}

function handleOpenRequest() {
  showFromButton()
}

watch(open, async value => {
  if (value) {
    previousBodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    await nextTick()
    panel.value?.focus()
    return
  }
  document.body.style.overflow = previousBodyOverflow
})

watch(activeIndex, async index => {
  if (!open.value) return
  await nextTick()
  panel.value?.querySelector<HTMLElement>(`[data-switcher-index="${index}"]`)?.scrollIntoView({
    block: 'nearest',
    inline: 'center',
  })
})

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown, true)
  window.addEventListener('keyup', handleGlobalKeyup, true)
  window.addEventListener('dl:open-component-switcher', handleOpenRequest)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleGlobalKeydown, true)
  window.removeEventListener('keyup', handleGlobalKeyup, true)
  window.removeEventListener('dl:open-component-switcher', handleOpenRequest)
  document.body.style.overflow = previousBodyOverflow
})
</script>

<template>
  <button class="component-switcher-trigger" type="button" aria-label="打开组件切换器，快捷键 Alt K" @click="showFromButton">
    <span aria-hidden="true">⇄</span>
    <b>切换组件</b>
    <kbd>Alt K</kbd>
  </button>

  <Teleport to="body">
    <div v-if="open" class="component-switcher-mask" @pointerdown.self="close()">
      <section
        ref="panel"
        class="component-switcher"
        role="dialog"
        aria-modal="true"
        aria-labelledby="component-switcher-title"
        :aria-activedescendant="activeCardId"
        tabindex="-1"
      >
        <header>
          <div>
            <small>COMPONENT SWITCHER</small>
            <h2 id="component-switcher-title">切换控件</h2>
          </div>
          <span>{{ activeIndex + 1 }} / {{ componentCatalog.length }}</span>
        </header>

        <div class="component-switcher-track" role="listbox" aria-label="可用组件">
          <button
            v-for="(component, index) in componentCatalog"
            :id="`component-switcher-card-${component.id}`"
            :key="component.id"
            :data-switcher-index="index"
            type="button"
            role="option"
            :aria-selected="index === activeIndex"
            :class="{ active: index === activeIndex }"
            tabindex="-1"
            @mouseenter="activeIndex = index"
            @click="select(index)"
          >
            <i aria-hidden="true">{{ component.id.split('-').map(part => part[0]).join('').slice(0, 2).toUpperCase() }}</i>
            <span>
              <small>{{ categoryLabels[component.category] }}</small>
              <b>{{ component.name.split(' ')[0] }}<CustomControlMark v-if="component.maturity === 'custom'" /></b>
            </span>
          </button>
        </div>

        <footer>
          <p aria-live="polite"><b>{{ activeComponent.name }}</b><span>{{ activeComponent.summary }}</span></p>
          <div><kbd>←</kbd><kbd>→</kbd><kbd>↑</kbd><kbd>↓</kbd><span>选择</span><kbd>Enter</kbd><span>打开</span><kbd>Esc</kbd><span>取消</span></div>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.component-switcher-trigger { display: inline-flex; align-items: center; gap: 8px; height: 36px; padding: 0 9px 0 11px; border: 1px solid var(--dl-border); border-radius: 11px; color: var(--dl-text-muted); background: var(--dl-surface); box-shadow: 0 1px 2px rgba(15,23,42,.05); cursor: pointer; transition: .18s ease; }
.component-switcher-trigger:hover { border-color: var(--dl-border-strong); color: var(--dl-text); background: var(--dl-surface-hover); }
.component-switcher-trigger:focus-visible { outline: none; box-shadow: var(--dl-focus); }
.component-switcher-trigger > span { color: var(--dl-accent-text); font-size: 1rem; line-height: 1; }
.component-switcher-trigger b { font-size: .72rem; white-space: nowrap; }
.component-switcher-trigger kbd, .component-switcher kbd { padding: 3px 6px; border: 1px solid var(--dl-border); border-radius: 6px; color: var(--dl-text-faint); background: var(--dl-night-soft); font: 700 .58rem/1 "Cascadia Code", Consolas, monospace; white-space: nowrap; }
.component-switcher-mask { position: fixed; z-index: 12000; inset: 0; display: grid; place-items: center; padding: 24px; background: color-mix(in srgb, var(--dl-night) 64%, transparent); backdrop-filter: blur(16px) saturate(.8); animation: switcher-mask-in .14s ease-out; }
.component-switcher { width: min(980px, 92vw); padding: 20px; overflow: hidden; border: 1px solid color-mix(in srgb, var(--dl-accent) 28%, var(--dl-border)); border-radius: 24px; outline: none; background: color-mix(in srgb, var(--dl-surface-strong) 95%, transparent); box-shadow: 0 30px 100px rgba(0,0,0,.35); animation: switcher-in .16s ease-out; }
.component-switcher > header { display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; padding: 2px 4px 16px; }
.component-switcher > header div { display: grid; gap: 4px; }
.component-switcher > header small { color: var(--dl-accent-text); font-size: .58rem; font-weight: 900; letter-spacing: .18em; }
.component-switcher > header h2 { margin: 0; color: var(--dl-text); font-size: 1.15rem; }
.component-switcher > header > span { color: var(--dl-text-faint); font: 700 .68rem "Cascadia Code", Consolas, monospace; }
.component-switcher-track { display: flex; gap: 12px; overflow: hidden; padding: 10px 45%; scroll-padding-inline: 45%; }
.component-switcher-track > button { flex: 0 0 148px; display: grid; grid-template-rows: 1fr auto; gap: 12px; min-height: 124px; padding: 15px; border: 1px solid var(--dl-border); border-radius: 17px; color: var(--dl-text); background: var(--dl-surface); box-shadow: 0 4px 14px rgba(15,23,42,.06); text-align: left; cursor: pointer; opacity: .54; transform: scale(.92); transition: border-color .14s ease, background .14s ease, opacity .14s ease, transform .14s ease, box-shadow .14s ease; }
.component-switcher-track > button.active { border-color: var(--dl-accent); background: var(--dl-accent-surface); box-shadow: 0 12px 32px color-mix(in srgb, var(--dl-accent) 18%, transparent); opacity: 1; transform: scale(1); }
.component-switcher-track > button > i { display: grid; place-items: center; width: 42px; height: 42px; border: 1px solid var(--dl-accent-border); border-radius: 13px; color: var(--dl-accent-text); background: var(--dl-accent-surface); font: normal 850 .72rem "Cascadia Code", Consolas, monospace; }
.component-switcher-track > button > span { display: grid; gap: 4px; min-width: 0; }
.component-switcher-track > button small { color: var(--dl-text-faint); font-size: .58rem; }
.component-switcher-track > button b { overflow: hidden; font-size: .76rem; text-overflow: ellipsis; white-space: nowrap; }
.component-switcher > footer { display: flex; align-items: end; justify-content: space-between; gap: 20px; min-height: 68px; padding: 16px 4px 1px; border-top: 1px solid var(--dl-border); }
.component-switcher > footer p { display: grid; gap: 4px; min-width: 0; margin: 0; }
.component-switcher > footer p b { color: var(--dl-text); font-size: .78rem; }
.component-switcher > footer p span { overflow: hidden; max-width: 520px; color: var(--dl-text-faint); font-size: .66rem; text-overflow: ellipsis; white-space: nowrap; }
.component-switcher > footer > div { display: flex; align-items: center; gap: 5px; color: var(--dl-text-faint); font-size: .6rem; white-space: nowrap; }
@keyframes switcher-mask-in { from { opacity: 0; } }
@keyframes switcher-in { from { opacity: 0; transform: translateY(10px) scale(.98); } }
@media (max-width: 1160px) { .component-switcher-trigger b { display: none; } }
@media (max-width: 720px) {
  .component-switcher-trigger kbd { display: none; }
  .component-switcher-trigger { width: 36px; justify-content: center; padding: 0; }
  .component-switcher-mask { padding: 12px; }
  .component-switcher { width: 96vw; padding: 15px; border-radius: 20px; }
  .component-switcher-track { padding-inline: 38%; }
  .component-switcher-track > button { flex-basis: 132px; min-height: 112px; }
  .component-switcher > footer { align-items: stretch; }
  .component-switcher > footer > div { display: none; }
}
@media (prefers-reduced-motion: reduce) { .component-switcher-mask, .component-switcher { animation: none; } .component-switcher-track > button { transition: none; } }
</style>
