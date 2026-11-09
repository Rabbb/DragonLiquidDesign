import { createApp, h } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createDlTheme, dlThemePresets } from './theme'

function mockSystemTheme(initialDark = false) {
  let matches = initialDark
  const listeners = new Set<(event: MediaQueryListEvent) => void>()
  const mediaQuery = {
    get matches() { return matches },
    media: '(prefers-color-scheme: dark)',
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn((_type: string, listener: (event: MediaQueryListEvent) => void) => listeners.add(listener)),
    removeEventListener: vi.fn((_type: string, listener: (event: MediaQueryListEvent) => void) => listeners.delete(listener)),
    dispatchEvent: vi.fn(() => true),
  } as unknown as MediaQueryList

  vi.stubGlobal('matchMedia', vi.fn(() => mediaQuery))

  return {
    setDark(next: boolean) {
      matches = next
      const event = { matches: next, media: mediaQuery.media } as MediaQueryListEvent
      listeners.forEach(listener => listener(event))
    },
  }
}

function installTheme(theme: ReturnType<typeof createDlTheme>) {
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp({ render: () => h('div') })
  app.use(theme)
  app.mount(host)
  return () => {
    app.unmount()
    host.remove()
    theme.destroy()
  }
}

beforeEach(() => {
  document.documentElement.removeAttribute('style')
  document.documentElement.removeAttribute('data-dl-theme')
  document.documentElement.removeAttribute('data-dl-theme-base')
  document.documentElement.removeAttribute('data-dl-theme-mode')
  document.documentElement.removeAttribute('data-dl-color-mode')
  window.localStorage.clear()
})

afterEach(() => vi.unstubAllGlobals())

describe('createDlTheme', () => {
  it('previews without persisting and restores the committed or system palette', () => {
    const system = mockSystemTheme(false)
    const theme = createDlTheme({storageKey:'theme-preview-test'})
    const cleanup = installTheme(theme)
    theme.setTheme('warm')
    const saved = localStorage.getItem('theme-preview-test')
    theme.setPreviewTheme('forest')
    expect(theme.activeTheme.value).toBe('forest')
    expect(theme.themeOverride.value).toBe('warm')
    expect(localStorage.getItem('theme-preview-test')).toBe(saved)
    theme.setPreviewTheme(null)
    expect(theme.activeTheme.value).toBe('warm')
    theme.setPreviewTheme('black'); theme.setTheme('midnight'); theme.setPreviewTheme(null)
    expect(theme.activeTheme.value).toBe('midnight')
    theme.setMode('system'); theme.setPreviewTheme('warm'); system.setDark(true); theme.setPreviewTheme(null)
    expect(theme.activeTheme.value).toBe('black')
    cleanup()
  })
  it('ships the core palettes and editor-inspired workbench themes as selectable presets', () => {
    expect(dlThemePresets.map(theme => theme.name)).toEqual([
      'white',
      'black',
      'warm',
      'midnight',
      'forest',
      'one-dark',
      'violet-nocturne',
      'mocha-mauve',
      'tokyo-indigo',
      'retro-amber',
      'nordic-frost',
      'git-daylight',
    ])
    const forest = dlThemePresets.find(theme => theme.name === 'forest')!
    expect(forest.tokens?.['--dragon-green']).toBe('#244f3a')
    expect(forest.tokens?.['--dl-surface']).toBe('rgba(14, 39, 26, 0.82)')
    expect(forest.tokens?.['--dl-accent']).toBe('#f4d35e')
    expect(forest.tokens?.['--dl-button-primary-bg']).toContain('#73d8a4')
    expect(forest.tokens?.['--dl-dialog-background']).not.toContain('244, 211, 94')
    expect(forest.tokens?.['--dl-dialog-inset-highlight']).toBe('rgba(226, 242, 233, 0.09)')
    expect(forest.tokens?.['--dl-dialog-sheen-opacity']).toBe('0.42')

    const mocha = dlThemePresets.find(theme => theme.name === 'mocha-mauve')!
    expect(mocha.base).toBe('black')
    expect(mocha.tokens?.['--dl-night']).toBe('#11111b')
    expect(mocha.tokens?.['--dl-accent']).toBe('#cba6f7')
    expect(mocha.tokens?.['--dl-button-primary-bg']).toBe('#cba6f7')

    const daylight = dlThemePresets.find(theme => theme.name === 'git-daylight')!
    expect(daylight.base).toBe('white')
    expect(daylight.colorScheme).toBe('light')
    expect(daylight.tokens?.['--dl-surface-strong']).toBe('#ffffff')
  })

  it('follows the browser color scheme using white by day and black by night', () => {
    const system = mockSystemTheme(false)
    const theme = createDlTheme()
    const cleanup = installTheme(theme)

    expect(theme.activeTheme.value).toBe('white')
    expect(document.documentElement.dataset.dlColorMode).toBe('light')

    system.setDark(true)
    expect(theme.activeTheme.value).toBe('black')
    expect(document.documentElement.dataset.dlColorMode).toBe('dark')
    cleanup()
  })

  it('allows light and dark browser modes to map to the same palette', () => {
    mockSystemTheme(true)
    const theme = createDlTheme({ lightTheme: 'white', darkTheme: 'white' })
    const cleanup = installTheme(theme)

    expect(theme.resolvedMode.value).toBe('dark')
    expect(theme.activeTheme.value).toBe('white')
    expect(document.documentElement.dataset.dlColorMode).toBe('light')
    cleanup()
  })

  it('supports manual built-in and custom theme selection', () => {
    mockSystemTheme(false)
    const theme = createDlTheme({
      themes: [{
        name: 'brand-theme',
        colorScheme: 'light',
        base: 'white',
        tokens: { '--dl-accent': '#345678' },
      }],
    })
    const cleanup = installTheme(theme)

    theme.setTheme('forest')
    expect(document.documentElement.dataset.dlTheme).toBe('forest')
    expect(document.documentElement.dataset.dlThemeBase).toBe('black')
    expect(document.documentElement.style.getPropertyValue('--dragon-green')).toBe('#244f3a')

    theme.setTheme('brand-theme')
    expect(document.documentElement.dataset.dlTheme).toBe('brand-theme')
    expect(document.documentElement.style.getPropertyValue('--dl-accent')).toBe('#345678')

    theme.clearThemeOverride()
    expect(theme.activeTheme.value).toBe('white')
    expect(document.documentElement.style.getPropertyValue('--dl-accent')).toBe('')
    cleanup()
  })
})
