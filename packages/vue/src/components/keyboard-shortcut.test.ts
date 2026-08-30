import { describe, expect, it } from 'vitest'
import { matchesDlKeyboardShortcut, normalizeDlKeyboardShortcut } from './keyboard-shortcut'

describe('DL keyboard shortcuts', () => {
  it('normalizes modifiers into a stable display order', () => {
    expect(normalizeDlKeyboardShortcut('shift + control + s')).toBe('Ctrl+Shift+S')
    expect(normalizeDlKeyboardShortcut('alt+F4')).toBe('Alt+F4')
    expect(normalizeDlKeyboardShortcut('x')).toBeNull()
  })

  it('matches exact keyboard modifier combinations', () => {
    expect(matchesDlKeyboardShortcut(new KeyboardEvent('keydown', { key: 's', ctrlKey: true }), 'Ctrl+S')).toBe(true)
    expect(matchesDlKeyboardShortcut(new KeyboardEvent('keydown', { key: 's', ctrlKey: true, shiftKey: true }), 'Ctrl+S')).toBe(false)
  })
})
