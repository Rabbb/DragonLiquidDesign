import { computed, inject, provide, type ComputedRef, type InjectionKey } from 'vue'

type CustomZIndex = () => number | undefined

const dlLayerContextKey: InjectionKey<ComputedRef<string>> = Symbol('dragon-liquid-layer-context')

function addLayerOffset(base: string, offset: string) {
  return `calc(${base} + ${offset})`
}

/**
 * Mirrors Ant Design's z-index context model: top-level containers use their
 * component token, nested containers add a container offset, and consumers
 * such as Select add a smaller offset to the nearest container context.
 */
export function useDlModalLayer(customZIndex: CustomZIndex) {
  const parentLayer = inject(dlLayerContextKey, undefined)

  const modalZIndex = computed(() => {
    const customValue = customZIndex()
    if (customValue !== undefined) return String(customValue)
    if (parentLayer) {
      return addLayerOffset(parentLayer.value, 'var(--dl-layer-container-offset)')
    }
    return 'var(--dl-layer-modal)'
  })

  const childLayerContext = computed(() => {
    const customValue = customZIndex()
    if (customValue !== undefined) return String(customValue)
    if (parentLayer) return modalZIndex.value
    return addLayerOffset('var(--dl-layer-popup-base)', 'var(--dl-layer-container-offset)')
  })

  provide(dlLayerContextKey, childLayerContext)

  return {
    overlayZIndex: modalZIndex,
    contentZIndex: computed(() => addLayerOffset(modalZIndex.value, '1')),
  }
}

export function useDlSelectLayer(customZIndex: CustomZIndex) {
  const parentLayer = inject(dlLayerContextKey, undefined)

  return computed(() => {
    const customValue = customZIndex()
    if (customValue !== undefined) return String(customValue)
    if (parentLayer) {
      return addLayerOffset(parentLayer.value, 'var(--dl-layer-consumer-offset)')
    }
    return 'var(--dl-layer-select)'
  })
}
