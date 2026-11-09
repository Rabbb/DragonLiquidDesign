import { onBeforeUnmount, onDeactivated, onMounted, ref, watch } from 'vue'

/** A transient option value, independent of the committed selection. */
export function useDlHoverValue(options: {
  value: () => string | null | undefined
  open: () => boolean
  choices: () => string[]
  update: (value: string | null) => void
}) {
  const current = ref<string | null>(null)
  function set(value: string | null) {
    const next = options.open() && value !== null && options.choices().includes(value) ? value : null
    if (current.value === next) return
    current.value = next
    options.update(next)
  }
  function clear() { set(null) }
  function leave(value: string) { if (current.value === value) clear() }
  function pointer(event: PointerEvent, value: string) {
    if (event.pointerType !== 'touch') set(value)
  }
  function visibility() { if (document.hidden) clear() }
  watch(() => options.value(), value => {
    current.value = value ?? null
    if (!options.open() || !options.choices().includes(value ?? '')) clear()
  }, { immediate: true })
  watch(() => [options.open(), options.choices()] as const, () => {
    if (!options.open() || current.value !== null && !options.choices().includes(current.value)) clear()
  }, { deep: true, flush: 'sync' })
  onMounted(() => {
    window.addEventListener('blur', clear)
    document.addEventListener('visibilitychange', visibility)
  })
  onDeactivated(clear)
  onBeforeUnmount(() => {
    clear()
    window.removeEventListener('blur', clear)
    document.removeEventListener('visibilitychange', visibility)
  })
  return { set, clear, leave, pointer }
}
