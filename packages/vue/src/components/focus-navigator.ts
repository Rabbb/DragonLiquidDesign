export type DlFocusNavigatorZoneDefinition = {
  id: string
  label: string
  icon?: string
  selector: string
  targetSelector?: string
}

export type DlFocusNavigatorTarget = {
  id: string
  label: string
  kind: string
  element: HTMLElement
}

export type DlFocusNavigatorResolvedZone = {
  id: string
  label: string
  icon: string
  targets: DlFocusNavigatorTarget[]
}

export type DlFocusNavigatorDiscoveryOptions = {
  scope: ParentNode
  zones?: readonly DlFocusNavigatorZoneDefinition[]
  autoDiscover?: boolean
  targetSelector?: string
  maxTargetsPerZone?: number
}

export const dlFocusNavigatorTargetSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[contenteditable="true"]',
  '[tabindex]:not([tabindex="-1"])',
  '[data-dl-focus-target]',
].join(',')

function normalizedText(value?: string | null) {
  return value?.replace(/\s+/g, ' ').trim() ?? ''
}

function elementIsVisible(element: HTMLElement) {
  if (element.hidden || element.closest('[hidden], [inert], [aria-hidden="true"]')) return false
  if ('disabled' in element && Boolean((element as HTMLButtonElement).disabled)) return false
  const style = window.getComputedStyle(element)
  if (style.display === 'none' || style.visibility === 'hidden' || style.visibility === 'collapse') return false
  return element.getClientRects().length > 0
}

function labelFor(element: HTMLElement) {
  const explicit = normalizedText(element.dataset.dlFocusLabel)
    || normalizedText(element.getAttribute('aria-label'))
  if (explicit) return explicit

  if (element instanceof HTMLInputElement || element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement) {
    const label = normalizedText(element.labels?.[0]?.textContent)
    if (label) return label
    const placeholder = normalizedText(element.getAttribute('placeholder'))
    if (placeholder) return placeholder
  }

  const title = normalizedText(element.getAttribute('title'))
  if (title) return title
  const text = normalizedText(element.textContent)
  if (text) return text.slice(0, 72)
  return normalizedText(element.getAttribute('name'))
    || normalizedText(element.id)
    || '未命名控件'
}

function kindFor(element: HTMLElement) {
  if (element instanceof HTMLInputElement) return `INPUT · ${element.type.toLocaleUpperCase()}`
  if (element instanceof HTMLAnchorElement) return 'LINK'
  if (element instanceof HTMLButtonElement) return 'BUTTON'
  const role = normalizedText(element.getAttribute('role'))
  return role ? role.toLocaleUpperCase() : element.tagName
}

function queryContainers(scope: ParentNode, selector: string) {
  const containers: HTMLElement[] = []
  if (scope instanceof HTMLElement && scope.matches(selector)) containers.push(scope)
  containers.push(...scope.querySelectorAll<HTMLElement>(selector))
  return containers
}

function targetsFor(container: HTMLElement, selector: string, zoneId: string, maximum: number) {
  return [...container.querySelectorAll<HTMLElement>(selector)]
    .filter(element => !element.closest('[data-dl-focus-navigator]'))
    .filter(elementIsVisible)
    .slice(0, maximum)
    .map((element, index) => ({
      id: `${zoneId}-${index}`,
      label: labelFor(element),
      kind: kindFor(element),
      element,
    }))
}

function zoneLabel(container: HTMLElement, fallback: string) {
  return normalizedText(container.dataset.dlFocusLabel)
    || normalizedText(container.getAttribute('aria-label'))
    || fallback
}

function zoneIcon(container: HTMLElement, fallback: string) {
  return normalizedText(container.dataset.dlFocusIcon) || fallback
}

export function discoverDlFocusNavigatorZones(options: DlFocusNavigatorDiscoveryOptions): DlFocusNavigatorResolvedZone[] {
  const targetSelector = options.targetSelector ?? dlFocusNavigatorTargetSelector
  const maximum = Math.max(1, Math.floor(options.maxTargetsPerZone ?? 40))
  const candidates: Array<{ id: string; label: string; icon: string; container: HTMLElement; targetSelector: string }> = []
  const claimedContainers = new Set<HTMLElement>()

  for (const definition of options.zones ?? []) {
    for (const [index, container] of queryContainers(options.scope, definition.selector).entries()) {
      candidates.push({
        id: index ? `${definition.id}-${index + 1}` : definition.id,
        label: index ? `${definition.label} ${index + 1}` : definition.label,
        icon: definition.icon ?? '◇',
        container,
        targetSelector: definition.targetSelector ?? targetSelector,
      })
      claimedContainers.add(container)
    }
  }

  const explicitContainers = queryContainers(options.scope, '[data-dl-focus-zone]')
  for (const [index, container] of explicitContainers.entries()) {
    if (claimedContainers.has(container)) continue
    const id = normalizedText(container.dataset.dlFocusZone) || `region-${index + 1}`
    candidates.push({ id, label: zoneLabel(container, `区域 ${index + 1}`), icon: zoneIcon(container, '◇'), container, targetSelector })
    claimedContainers.add(container)
  }

  if (options.autoDiscover !== false) {
    const automatic = [
      { id: 'dialog', label: '当前浮层', icon: '◇', selector: '[role="dialog"][aria-modal="true"]' },
      { id: 'top-navigation', label: '顶部导航', icon: '⌂', selector: 'header nav' },
      { id: 'sidebar', label: '侧边栏', icon: '≡', selector: 'aside' },
      { id: 'content', label: '当前内容', icon: '▦', selector: 'main, [role="main"]' },
    ]
    for (const definition of automatic) {
      for (const [index, container] of queryContainers(options.scope, definition.selector).entries()) {
        if (claimedContainers.has(container)) continue
        if ([...claimedContainers].some(claimed => claimed.contains(container) || container.contains(claimed))) continue
        candidates.push({
          id: index ? `${definition.id}-${index + 1}` : definition.id,
          label: zoneLabel(container, index ? `${definition.label} ${index + 1}` : definition.label),
          icon: zoneIcon(container, definition.icon),
          container,
          targetSelector,
        })
        claimedContainers.add(container)
      }
    }
  }

  if (!candidates.length && options.scope instanceof HTMLElement) {
    candidates.push({ id: 'content', label: zoneLabel(options.scope, '当前内容'), icon: zoneIcon(options.scope, '▦'), container: options.scope, targetSelector })
  }

  const zones = new Map<string, DlFocusNavigatorResolvedZone>()
  for (const candidate of candidates) {
    const targets = targetsFor(candidate.container, candidate.targetSelector, candidate.id, maximum)
    if (!targets.length) continue
    const existing = zones.get(candidate.id)
    if (!existing) {
      zones.set(candidate.id, { id: candidate.id, label: candidate.label, icon: candidate.icon, targets })
      continue
    }
    const elements = new Set(existing.targets.map(target => target.element))
    for (const target of targets) {
      if (!elements.has(target.element) && existing.targets.length < maximum) existing.targets.push(target)
    }
    existing.targets.forEach((target, index) => { target.id = `${existing.id}-${index}` })
  }
  return [...zones.values()]
}
