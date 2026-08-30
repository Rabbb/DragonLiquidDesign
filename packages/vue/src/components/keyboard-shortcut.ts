const modifierAliases: Record<string, 'Ctrl' | 'Alt' | 'Shift' | 'Meta'> = {
  ctrl: 'Ctrl', control: 'Ctrl', alt: 'Alt', option: 'Alt', shift: 'Shift', meta: 'Meta', cmd: 'Meta', command: 'Meta', win: 'Meta',
}
const modifierOrder = ['Ctrl', 'Alt', 'Shift', 'Meta'] as const
const namedKeys: Record<string, string> = {
  esc: 'Escape', escape: 'Escape', enter: 'Enter', return: 'Enter', space: 'Space', tab: 'Tab',
  backspace: 'Backspace', delete: 'Delete', insert: 'Insert', home: 'Home', end: 'End',
  pageup: 'PageUp', pagedown: 'PageDown', arrowup: 'ArrowUp', arrowdown: 'ArrowDown',
  arrowleft: 'ArrowLeft', arrowright: 'ArrowRight',
}

export function normalizeDlKeyboardShortcut(value: string): string | null {
  const parts = value.split('+').map(part => part.trim()).filter(Boolean)
  if (!parts.length || parts.length > 5) return null
  const modifiers = new Set<string>()
  for (const part of parts.slice(0, -1)) {
    const modifier = modifierAliases[part.toLocaleLowerCase()]
    if (!modifier) return null
    modifiers.add(modifier)
  }
  const rawKey = parts.at(-1)!
  const key = rawKey.length === 1 && /[A-Za-z0-9]/.test(rawKey)
    ? rawKey.toLocaleUpperCase()
    : /^F(?:[1-9]|1[0-9]|2[0-4])$/i.test(rawKey)
      ? rawKey.toLocaleUpperCase()
      : namedKeys[rawKey.toLocaleLowerCase()]
  if (!key || (!modifiers.size && key.length === 1)) return null
  return [...modifierOrder.filter(modifier => modifiers.has(modifier)), key].join('+')
}

export function matchesDlKeyboardShortcut(event: KeyboardEvent, shortcut: string): boolean {
  const normalized = normalizeDlKeyboardShortcut(shortcut)
  if (!normalized) return false
  const parts = normalized.split('+')
  const expectedKey = parts.at(-1)
  const eventKey = event.key === ' ' ? 'Space' : event.key.length === 1 ? event.key.toLocaleUpperCase() : event.key
  return eventKey.toLocaleLowerCase() === expectedKey?.toLocaleLowerCase()
    && event.ctrlKey === parts.includes('Ctrl')
    && event.altKey === parts.includes('Alt')
    && event.shiftKey === parts.includes('Shift')
    && event.metaKey === parts.includes('Meta')
}

