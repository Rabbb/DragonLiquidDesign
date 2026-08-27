<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { componentCatalog, componentRoute } from '../catalog'
import { resolveComponentGroups } from '../componentGroups'
import CustomControlMark from './CustomControlMark.vue'

const props = defineProps<{ currentComponentId?: string }>()

const open = ref(false)
const activeIndex = ref(0)
const chordMode = ref(false)
const panel = ref<HTMLElement>()
let previousFocus: HTMLElement | null = null
let previousBodyOverflow = ''

const groupedEntries = computed(() => {
  let index = 0
  return resolveComponentGroups('family').map(group => ({
    ...group,
    entries: group.components.map(component => ({
      id: `${group.id}-${component.id}`,
      index: index++,
      component,
    })),
  }))
})
const switcherEntries = computed(() => groupedEntries.value.flatMap(group => group.entries))
const activeEntry = computed(() => switcherEntries.value[activeIndex.value] ?? switcherEntries.value[0])
const activeComponent = computed(() => activeEntry.value?.component ?? componentCatalog[0])
const activeCardId = computed(() => activeEntry.value ? `component-switcher-card-${activeEntry.value.id}` : undefined)

function currentIndex() {
  const index = switcherEntries.value.findIndex(entry => entry.component.id === props.currentComponentId)
  return index >= 0 ? index : 0
}

function move(step: number) {
  const length = switcherEntries.value.length
  if (!length) return
  activeIndex.value = (activeIndex.value + step + length) % length
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
  else if (event.key === 'End') activeIndex.value = switcherEntries.value.length - 1
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
    block: 'center',
    inline: 'nearest',
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
  <button class="component-switcher-trigger" type="button" aria-label="打开控件文档切换器，快捷键 Alt K" @click="showFromButton">
    <span aria-hidden="true">⇄</span>
    <b>切换文档</b>
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
            <small>COMPONENT DOCS</small>
            <h2 id="component-switcher-title">切换控件文档</h2>
          </div>
          <span>{{ componentCatalog.length }} CONTROLS · {{ groupedEntries.length }} GROUPS</span>
        </header>

        <div class="component-switcher-groups" role="listbox" aria-label="按组件族分组的控件文档">
          <section v-for="group in groupedEntries" :key="group.id" class="component-switcher-group">
            <header>
              <div><small>{{ group.english }}</small><h3>{{ group.label }}</h3></div>
              <span>{{ group.entries.length }}</span>
            </header>
            <div class="component-switcher-grid">
              <button
                v-for="entry in group.entries"
                :id="`component-switcher-card-${entry.id}`"
                :key="entry.id"
                :data-switcher-index="entry.index"
                type="button"
                role="option"
                :aria-selected="entry.index === activeIndex"
                :class="{ active: entry.index === activeIndex }"
                tabindex="-1"
                @mouseenter="activeIndex = entry.index"
                @click="select(entry.index)"
              >
                <i aria-hidden="true">{{ entry.component.id.split('-').map(part => part[0]).join('').slice(0, 2).toUpperCase() }}</i>
                <span>
                  <b>{{ entry.component.name.split(' ')[0] }}<CustomControlMark v-if="entry.component.maturity === 'custom'" /></b>
                  <small>{{ entry.component.id }}</small>
                </span>
              </button>
            </div>
          </section>
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
.component-switcher { display: grid; grid-template-rows: auto minmax(0,1fr) auto; width: min(1180px, 94vw); max-height: min(820px, 90vh); padding: 20px; overflow: hidden; border: 1px solid color-mix(in srgb, var(--dl-accent) 28%, var(--dl-border)); border-radius: 24px; outline: none; background: color-mix(in srgb, var(--dl-surface-strong) 95%, transparent); box-shadow: 0 30px 100px rgba(0,0,0,.35); animation: switcher-in .16s ease-out; }
.component-switcher > header { display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; padding: 2px 4px 16px; }
.component-switcher > header div { display: grid; gap: 4px; }
.component-switcher > header small { color: var(--dl-accent-text); font-size: .58rem; font-weight: 900; letter-spacing: .18em; }
.component-switcher > header h2 { margin: 0; color: var(--dl-text); font-size: 1.15rem; }
.component-switcher > header > span { color: var(--dl-text-faint); font: 700 .68rem "Cascadia Code", Consolas, monospace; }
.component-switcher-groups { display: grid; align-content: start; gap: 18px; overflow: auto; padding: 4px 8px 18px 4px; scroll-padding-block: 72px; }
.component-switcher-group { display: grid; gap: 9px; }
.component-switcher-group > header { display: flex; align-items: end; justify-content: space-between; gap: 16px; padding: 0 3px; }
.component-switcher-group > header div { display: flex; align-items: baseline; gap: 9px; min-width: 0; }
.component-switcher-group > header small { color: var(--dl-accent-text); font: 850 .52rem "Cascadia Code", Consolas, monospace; letter-spacing: .12em; }
.component-switcher-group > header h3 { margin: 0; color: var(--dl-text); font-size: .78rem; }
.component-switcher-group > header > span { color: var(--dl-text-faint); font: 700 .56rem "Cascadia Code", Consolas, monospace; }
.component-switcher-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 7px; }
.component-switcher-grid > button { appearance: none; display: grid; grid-template-columns: 34px minmax(0,1fr); align-items: center; gap: 9px; min-height: 58px; padding: 8px 10px; border: 1px solid var(--dl-border); border-radius: 12px; color: var(--dl-text); background: var(--dl-surface); text-align: left; cursor: pointer; transition: border-color .14s ease, background .14s ease, box-shadow .14s ease, transform .14s ease; }
.component-switcher-grid > button:hover { border-color: var(--dl-border-strong); background: var(--dl-surface-hover); }
.component-switcher-grid > button.active { border-color: var(--dl-accent); background: var(--dl-accent-surface); box-shadow: inset 3px 0 0 var(--dl-accent), 0 7px 20px color-mix(in srgb, var(--dl-accent) 13%, transparent); transform: translateY(-1px); }
.component-switcher-grid > button > i { display: grid; place-items: center; width: 32px; height: 32px; border: 1px solid var(--dl-accent-border); border-radius: 9px; color: var(--dl-accent-text); background: var(--dl-accent-surface); font: normal 850 .62rem "Cascadia Code", Consolas, monospace; }
.component-switcher-grid > button > span { display: grid; gap: 3px; min-width: 0; }
.component-switcher-grid > button small, .component-switcher-grid > button b { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.component-switcher-grid > button small { color: var(--dl-text-faint); font: 650 .5rem "Cascadia Code", Consolas, monospace; }
.component-switcher-grid > button b { font-size: .7rem; }
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
  .component-switcher { max-height: 92vh; }
  .component-switcher-grid { grid-template-columns: repeat(auto-fill, minmax(132px, 1fr)); }
  .component-switcher > footer { align-items: stretch; }
  .component-switcher > footer > div { display: none; }
}
@media (prefers-reduced-motion: reduce) { .component-switcher-mask, .component-switcher { animation: none; } .component-switcher-grid > button { transition: none; } }
</style>
