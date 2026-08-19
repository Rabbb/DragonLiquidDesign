import {
  computed,
  inject,
  readonly,
  ref,
  type App,
  type ComputedRef,
  type InjectionKey,
  type Ref,
} from 'vue'

export type DlThemeMode = 'system' | 'light' | 'dark'
export type DlResolvedThemeMode = Exclude<DlThemeMode, 'system'>
export type DlThemeColorScheme = 'light' | 'dark'
export type DlThemeTokens = Partial<Record<`--${string}`, string>>

export interface DlThemeDefinition {
  name: string
  label?: string
  colorScheme: DlThemeColorScheme
  base?: string
  tokens?: DlThemeTokens
}

export type DlThemeTarget = HTMLElement | string | (() => HTMLElement | null | undefined)

export interface DlThemeOptions {
  mode?: DlThemeMode
  lightTheme?: string
  darkTheme?: string
  themes?: DlThemeDefinition[]
  target?: DlThemeTarget
  storageKey?: string | false
}

export interface DlThemeModeThemes {
  light?: string
  dark?: string
}

export interface DlThemeManager {
  install: (app: App) => void
  mode: Readonly<Ref<DlThemeMode>>
  systemMode: Readonly<Ref<DlResolvedThemeMode>>
  resolvedMode: ComputedRef<DlResolvedThemeMode>
  lightTheme: Readonly<Ref<string>>
  darkTheme: Readonly<Ref<string>>
  themeOverride: Readonly<Ref<string | undefined>>
  activeTheme: ComputedRef<string>
  activeThemeDefinition: ComputedRef<DlThemeDefinition>
  themes: ComputedRef<DlThemeDefinition[]>
  setMode: (mode: DlThemeMode) => void
  setTheme: (name: string) => void
  clearThemeOverride: () => void
  setModeThemes: (themes: DlThemeModeThemes) => void
  registerTheme: (theme: DlThemeDefinition) => DlThemeManager
  unregisterTheme: (name: string) => boolean
  apply: () => void
  destroy: () => void
}

const builtinThemeNames = new Set(['white', 'black', 'warm', 'midnight', 'forest'])

export const dlThemePresets: readonly DlThemeDefinition[] = Object.freeze([
  Object.freeze({ name: 'white', label: 'White', colorScheme: 'light' as const }),
  Object.freeze({
    name: 'black',
    label: 'Black',
    colorScheme: 'dark' as const,
  }),
  Object.freeze({
    name: 'warm',
    label: 'Warm Paper',
    colorScheme: 'light' as const,
    base: 'white',
    tokens: Object.freeze({
      '--dl-night': '#f7f2e8',
      '--dl-night-soft': '#efe7da',
      '--dl-surface-hover': '#f3ede3',
      '--dl-accent': '#8f5b12',
      '--dl-accent-text': '#6f4308',
      '--dl-panel': 'radial-gradient(circle at 12% 0%, rgba(174, 113, 22, 0.05), transparent 38%), linear-gradient(145deg, #fffdf9, #f8f2e8)',
    }),
  }),
  Object.freeze({
    name: 'midnight',
    label: 'Midnight',
    colorScheme: 'dark' as const,
    base: 'black',
    tokens: Object.freeze({
      '--dl-night': '#08111e',
      '--dl-night-soft': '#101c2b',
      '--dl-surface': 'rgba(18, 31, 47, 0.9)',
      '--dl-surface-strong': '#162538',
      '--dl-surface-solid': '#162538',
      '--dl-surface-hover': '#20344b',
      '--dl-accent': '#7fb4d8',
      '--dl-accent-text': '#b9daf0',
      '--dl-accent-surface': 'rgba(88, 153, 197, 0.14)',
      '--dl-accent-surface-hover': 'rgba(88, 153, 197, 0.22)',
      '--dl-accent-border': 'rgba(127, 180, 216, 0.34)',
      '--dl-border-focus': 'rgba(127, 180, 216, 0.76)',
      '--dl-focus': '0 0 0 3px rgba(88, 153, 197, 0.2), 0 0 0 1px rgba(127, 180, 216, 0.52)',
      '--dl-panel': 'radial-gradient(circle at 88% 0%, rgba(88, 153, 197, 0.09), transparent 42%), linear-gradient(145deg, rgba(24, 39, 57, 0.98), rgba(10, 20, 32, 0.99))',
    }),
  }),
  Object.freeze({
    name: 'forest',
    label: 'Dragon Forest',
    colorScheme: 'dark' as const,
    base: 'black',
    tokens: Object.freeze({
      '--dragon-green': '#244f3a',
      '--dragon-green-dark': '#07170e',
      '--dragon-green-light': '#63d7a1',
      '--dragon-orange': '#d36f58',
      '--dragon-orange-light': '#ee927a',
      '--dragon-yellow': '#f4d35e',
      '--dl-text': '#f2f7f4',
      '--dl-text-muted': 'rgba(224, 237, 230, 0.72)',
      '--dl-text-faint': 'rgba(224, 237, 230, 0.48)',
      '--dl-night': '#06100b',
      '--dl-night-soft': '#0c1c13',
      '--dl-surface': 'rgba(14, 39, 26, 0.82)',
      '--dl-surface-strong': 'rgba(19, 50, 34, 0.96)',
      '--dl-surface-solid': '#133222',
      '--dl-surface-hover': 'rgba(34, 75, 52, 0.84)',
      '--dl-border': 'rgba(221, 239, 228, 0.14)',
      '--dl-border-strong': 'rgba(221, 239, 228, 0.25)',
      '--dl-border-focus': 'rgba(246, 211, 95, 0.82)',
      '--dl-accent': '#f4d35e',
      '--dl-accent-text': '#ffe99a',
      '--dl-accent-surface': 'rgba(244, 211, 94, 0.11)',
      '--dl-accent-surface-hover': 'rgba(244, 211, 94, 0.18)',
      '--dl-accent-border': 'rgba(244, 211, 94, 0.34)',
      '--dl-primary': 'linear-gradient(135deg, #ffe477 0%, #f1c84d 50%, #73d8a4 100%)',
      '--dl-primary-hover': 'linear-gradient(135deg, #ffeb8c 0%, #f8d35b 50%, #82e3b1 100%)',
      '--dl-button-primary-bg': 'linear-gradient(135deg, #ffe477 0%, #f1c84d 50%, #73d8a4 100%)',
      '--dl-button-primary-bg-hover': 'linear-gradient(135deg, #ffeb8c 0%, #f8d35b 50%, #82e3b1 100%)',
      '--dl-button-primary-bg-active': 'linear-gradient(135deg, #dcb13a 0%, #c99b2f 50%, #5cb889 100%)',
      '--dl-button-primary-border': 'rgba(255, 239, 172, 0.38)',
      '--dl-button-primary-border-hover': 'rgba(255, 246, 202, 0.54)',
      '--dl-button-primary-border-active': 'rgba(134, 101, 27, 0.76)',
      '--dl-button-primary-text': '#071c13',
      '--dl-button-primary-text-shadow': '0 1px 0 rgba(232, 255, 245, 0.26)',
      '--dl-button-primary-text-shadow-hover': '0 1px 0 rgba(239, 255, 249, 0.32)',
      '--dl-button-primary-text-shadow-active': '0 1px 0 rgba(225, 246, 255, 0.2)',
      '--dl-button-primary-shadow': 'inset 0 1px 0 rgba(255, 255, 255, 0.3), inset 0 -1px 0 rgba(110, 79, 12, 0.18), 0 2px 0 rgba(71, 51, 8, 0.22), 0 6px 20px rgba(244, 211, 94, 0.2)',
      '--dl-button-primary-shadow-hover': 'inset 0 1px 0 rgba(255, 255, 255, 0.36), inset 0 -1px 0 rgba(110, 79, 12, 0.2), 0 2px 0 rgba(71, 51, 8, 0.22), 0 8px 27px rgba(115, 216, 164, 0.22)',
      '--dl-button-primary-shadow-active': 'inset 0 2px 5px rgba(83, 56, 6, 0.34), 0 1px 0 rgba(255, 244, 198, 0.14)',
      '--dl-button-secondary-bg': 'rgba(232, 244, 237, 0.055)',
      '--dl-button-secondary-bg-hover': 'rgba(244, 211, 94, 0.08)',
      '--dl-button-secondary-bg-active': 'rgba(244, 211, 94, 0.13)',
      '--dl-button-secondary-border': 'rgba(221, 239, 228, 0.2)',
      '--dl-button-secondary-border-hover': 'rgba(244, 211, 94, 0.5)',
      '--dl-button-secondary-border-active': 'rgba(224, 184, 66, 0.62)',
      '--dl-button-secondary-text': 'var(--dl-text)',
      '--dl-button-secondary-text-hover': '#fff0b3',
      '--dl-button-secondary-text-active': '#f4d776',
      '--dl-button-secondary-shadow': 'inset 0 1px 0 rgba(255, 255, 255, 0.075), 0 2px 0 rgba(0, 0, 0, 0.12)',
      '--dl-button-secondary-shadow-active': 'inset 0 2px 5px rgba(0, 0, 0, 0.2)',
      '--dl-button-ghost-text': 'var(--dl-text-muted)',
      '--dl-button-ghost-text-hover': 'var(--dl-text)',
      '--dl-button-ghost-text-active': '#ffe99a',
      '--dl-button-ghost-bg-hover': 'rgba(232, 244, 237, 0.075)',
      '--dl-button-ghost-bg-active': 'rgba(244, 211, 94, 0.1)',
      '--dl-button-disabled-bg': 'rgba(232, 244, 237, 0.035)',
      '--dl-button-disabled-border': 'rgba(221, 239, 228, 0.09)',
      '--dl-button-disabled-text': 'rgba(224, 237, 230, 0.3)',
      '--dl-panel': 'radial-gradient(circle at 12% 0%, rgba(244, 211, 94, 0.12), transparent 38%), radial-gradient(circle at 82% 4%, rgba(99, 215, 161, 0.09), transparent 38%), radial-gradient(circle at 100% 72%, rgba(108, 126, 232, 0.08), transparent 36%), linear-gradient(145deg, rgba(19, 57, 39, 0.92), rgba(5, 21, 13, 0.97))',
      '--dl-shadow': '0 22px 60px rgba(0, 0, 0, 0.34), 0 0 38px rgba(244, 211, 94, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.11)',
      '--dl-shadow-hover': '0 26px 68px rgba(0, 0, 0, 0.4), 0 0 44px rgba(99, 215, 161, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
      '--dl-focus': '0 0 0 3px rgba(244, 211, 94, 0.18), 0 0 22px rgba(99, 215, 161, 0.18)',
    }),
  }),
])

export const dlThemeKey: InjectionKey<DlThemeManager> = Symbol('dragon-liquid-theme')

function cloneTheme(theme: DlThemeDefinition): DlThemeDefinition {
  return { ...theme, tokens: theme.tokens ? { ...theme.tokens } : undefined }
}

function validateThemeName(name: string) {
  if (!/^[a-z][a-z0-9-]*$/i.test(name)) throw new Error(`Invalid Dragon Liquid theme name: ${name}`)
}

function validateTheme(theme: DlThemeDefinition) {
  validateThemeName(theme.name)
  if (theme.base) validateThemeName(theme.base)
  for (const token of Object.keys(theme.tokens ?? {})) {
    if (!token.startsWith('--')) throw new Error(`Theme token must be a CSS custom property: ${token}`)
  }
}

function getInitialSystemMode(): DlResolvedThemeMode {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function resolveTarget(target?: DlThemeTarget): HTMLElement | undefined {
  if (typeof document === 'undefined') return undefined
  if (!target) return document.documentElement
  if (typeof target === 'function') return target() ?? undefined
  if (typeof target === 'string') return document.querySelector<HTMLElement>(target) ?? undefined
  return target
}

type PersistedThemePreference = {
  mode?: DlThemeMode
  themeOverride?: string
}

export function createDlTheme(options: DlThemeOptions = {}): DlThemeManager {
  const registry = new Map<string, DlThemeDefinition>()
  for (const preset of dlThemePresets) registry.set(preset.name, cloneTheme(preset))
  for (const theme of options.themes ?? []) {
    validateTheme(theme)
    registry.set(theme.name, cloneTheme(theme))
  }

  const initialMode = ref<DlThemeMode>(options.mode ?? 'system')
  const currentSystemMode = ref<DlResolvedThemeMode>(getInitialSystemMode())
  const currentLightTheme = ref(options.lightTheme ?? 'white')
  const currentDarkTheme = ref(options.darkTheme ?? 'black')
  const currentOverride = ref<string>()
  const revision = ref(0)
  const storageKey = options.storageKey === undefined ? false : options.storageKey
  let mediaQuery: MediaQueryList | undefined
  let appliedTarget: HTMLElement | undefined
  let appliedTokens = new Set<string>()
  let started = false

  function getTheme(name: string): DlThemeDefinition | undefined {
    revision.value
    return registry.get(name)
  }

  function assertTheme(name: string) {
    if (!registry.has(name)) throw new Error(`Unknown Dragon Liquid theme: ${name}`)
  }

  assertTheme(currentLightTheme.value)
  assertTheme(currentDarkTheme.value)

  if (storageKey && typeof window !== 'undefined') {
    try {
      const saved = JSON.parse(window.localStorage.getItem(storageKey) ?? 'null') as PersistedThemePreference | null
      if (saved?.mode && ['system', 'light', 'dark'].includes(saved.mode)) initialMode.value = saved.mode
      if (saved?.themeOverride && registry.has(saved.themeOverride)) currentOverride.value = saved.themeOverride
    }
    catch {
      // Ignore unavailable storage and malformed values; theme application must remain deterministic.
    }
  }

  const resolvedMode = computed<DlResolvedThemeMode>(() => initialMode.value === 'system' ? currentSystemMode.value : initialMode.value)
  const activeTheme = computed(() => currentOverride.value ?? (resolvedMode.value === 'light' ? currentLightTheme.value : currentDarkTheme.value))
  const activeThemeDefinition = computed(() => getTheme(activeTheme.value) ?? getTheme(resolvedMode.value === 'light' ? 'white' : 'black')!)
  const themes = computed(() => {
    revision.value
    return [...registry.values()].map(cloneTheme)
  })

  function resolveThemeChain(theme: DlThemeDefinition) {
    const chain: DlThemeDefinition[] = []
    const visited = new Set<string>()
    let current: DlThemeDefinition | undefined = theme
    while (current) {
      if (visited.has(current.name)) throw new Error(`Circular Dragon Liquid theme base: ${current.name}`)
      visited.add(current.name)
      chain.unshift(current)
      current = current.base ? getTheme(current.base) : undefined
    }
    return chain
  }

  function persist() {
    if (!storageKey || typeof window === 'undefined') return
    try {
      window.localStorage.setItem(storageKey, JSON.stringify({
        mode: initialMode.value,
        themeOverride: currentOverride.value,
      } satisfies PersistedThemePreference))
    }
    catch {
      // Storage is optional and must never prevent a theme change.
    }
  }

  function apply() {
    const target = resolveTarget(options.target)
    if (!target) return
    if (appliedTarget && appliedTarget !== target) {
      for (const token of appliedTokens) appliedTarget.style.removeProperty(token)
      delete appliedTarget.dataset.dlTheme
      delete appliedTarget.dataset.dlThemeBase
      delete appliedTarget.dataset.dlThemeMode
      delete appliedTarget.dataset.dlColorMode
      appliedTokens = new Set()
    }

    const theme = activeThemeDefinition.value
    const chain = resolveThemeChain(theme)
    const base = chain.find(item => item.name === 'white' || item.name === 'black')?.name
      ?? (theme.colorScheme === 'dark' ? 'black' : 'white')
    const tokens = Object.assign({}, ...chain.map(item => item.tokens ?? {})) as DlThemeTokens

    for (const token of appliedTokens) target.style.removeProperty(token)
    appliedTokens = new Set(Object.keys(tokens))
    for (const [token, value] of Object.entries(tokens)) {
      if (value !== undefined) target.style.setProperty(token, value)
    }

    target.dataset.dlTheme = theme.name
    target.dataset.dlThemeBase = base
    target.dataset.dlThemeMode = initialMode.value
    target.dataset.dlColorMode = theme.colorScheme
    target.style.colorScheme = theme.colorScheme
    appliedTarget = target

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('dl-theme-change', {
        detail: {
          mode: initialMode.value,
          systemMode: currentSystemMode.value,
          theme: theme.name,
          colorScheme: theme.colorScheme,
        },
      }))
    }
  }

  function start() {
    if (started) return
    started = true
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      currentSystemMode.value = mediaQuery.matches ? 'dark' : 'light'
      mediaQuery.addEventListener?.('change', handleSystemModeChange)
    }
    apply()
  }

  function handleSystemModeChange(event: MediaQueryListEvent) {
    currentSystemMode.value = event.matches ? 'dark' : 'light'
    if (initialMode.value === 'system' && !currentOverride.value) apply()
  }

  const manager: DlThemeManager = {
    install(app) {
      app.provide(dlThemeKey, manager)
      start()
    },
    mode: readonly(initialMode),
    systemMode: readonly(currentSystemMode),
    resolvedMode,
    lightTheme: readonly(currentLightTheme),
    darkTheme: readonly(currentDarkTheme),
    themeOverride: readonly(currentOverride),
    activeTheme,
    activeThemeDefinition,
    themes,
    setMode(mode) {
      initialMode.value = mode
      currentOverride.value = undefined
      persist()
      apply()
    },
    setTheme(name) {
      assertTheme(name)
      currentOverride.value = name
      persist()
      apply()
    },
    clearThemeOverride() {
      currentOverride.value = undefined
      persist()
      apply()
    },
    setModeThemes(nextThemes) {
      if (nextThemes.light) {
        assertTheme(nextThemes.light)
        currentLightTheme.value = nextThemes.light
      }
      if (nextThemes.dark) {
        assertTheme(nextThemes.dark)
        currentDarkTheme.value = nextThemes.dark
      }
      apply()
    },
    registerTheme(theme) {
      validateTheme(theme)
      if (builtinThemeNames.has(theme.name)) throw new Error(`Built-in Dragon Liquid theme cannot be replaced: ${theme.name}`)
      if (theme.base) assertTheme(theme.base)
      registry.set(theme.name, cloneTheme(theme))
      revision.value += 1
      if (currentOverride.value === theme.name) apply()
      return manager
    },
    unregisterTheme(name) {
      if (builtinThemeNames.has(name)) return false
      const removed = registry.delete(name)
      if (!removed) return false
      revision.value += 1
      if (currentOverride.value === name) currentOverride.value = undefined
      if (currentLightTheme.value === name) currentLightTheme.value = 'white'
      if (currentDarkTheme.value === name) currentDarkTheme.value = 'black'
      persist()
      apply()
      return true
    },
    apply,
    destroy() {
      mediaQuery?.removeEventListener?.('change', handleSystemModeChange)
      mediaQuery = undefined
      started = false
    },
  }

  return manager
}

export function useDlTheme(): DlThemeManager {
  const theme = inject(dlThemeKey, undefined)
  if (!theme) throw new Error('useDlTheme() requires app.use(createDlTheme())')
  return theme
}
