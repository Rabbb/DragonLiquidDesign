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

interface DlWorkbenchThemePalette {
  name: string
  label: string
  colorScheme: DlThemeColorScheme
  canvas: string
  canvasSoft: string
  surface: string
  surfaceStrong: string
  surfaceHover: string
  text: string
  textMuted: string
  textFaint: string
  border: string
  borderStrong: string
  accent: string
  accentText: string
  accentRgb: string
  primaryText: string
  green: string
  orange: string
  yellow: string
  red: string
  cyan: string
  purple: string
}

function workbenchTheme(palette: DlWorkbenchThemePalette): Readonly<DlThemeDefinition> {
  const dark = palette.colorScheme === 'dark'
  return Object.freeze({
    name: palette.name,
    label: palette.label,
    colorScheme: palette.colorScheme,
    base: dark ? 'black' : 'white',
    tokens: Object.freeze({
      '--dragon-green': palette.green,
      '--dragon-orange': palette.orange,
      '--dragon-yellow': palette.yellow,
      '--dragon-red': palette.red,
      '--dragon-cyan': palette.cyan,
      '--dragon-purple': palette.purple,
      '--dl-text': palette.text,
      '--dl-text-muted': palette.textMuted,
      '--dl-text-faint': palette.textFaint,
      '--dl-night': palette.canvas,
      '--dl-night-soft': palette.canvasSoft,
      '--dl-surface': palette.surface,
      '--dl-surface-strong': palette.surfaceStrong,
      '--dl-surface-solid': palette.surfaceStrong,
      '--dl-surface-hover': palette.surfaceHover,
      '--dl-border': palette.border,
      '--dl-border-strong': palette.borderStrong,
      '--dl-border-focus': `rgba(${palette.accentRgb}, 0.82)`,
      '--dl-accent': palette.accent,
      '--dl-accent-text': palette.accentText,
      '--dl-accent-surface': `rgba(${palette.accentRgb}, 0.13)`,
      '--dl-accent-surface-hover': `rgba(${palette.accentRgb}, 0.21)`,
      '--dl-accent-border': `rgba(${palette.accentRgb}, 0.4)`,
      '--dl-primary': palette.accent,
      '--dl-primary-hover': palette.accentText,
      '--dl-button-primary-bg': palette.accent,
      '--dl-button-primary-bg-hover': palette.accentText,
      '--dl-button-primary-bg-active': `color-mix(in srgb, ${palette.accent} 78%, ${palette.canvas})`,
      '--dl-button-primary-border': palette.accent,
      '--dl-button-primary-border-hover': palette.accentText,
      '--dl-button-primary-border-active': `color-mix(in srgb, ${palette.accent} 72%, ${palette.canvas})`,
      '--dl-button-primary-text': palette.primaryText,
      '--dl-button-primary-text-shadow': 'none',
      '--dl-button-primary-text-shadow-hover': 'none',
      '--dl-button-primary-shadow': `0 5px 18px rgba(${palette.accentRgb}, ${dark ? '0.18' : '0.14'})`,
      '--dl-button-primary-shadow-hover': `0 7px 24px rgba(${palette.accentRgb}, ${dark ? '0.25' : '0.2'})`,
      '--dl-button-primary-shadow-active': `inset 0 2px 5px rgba(0, 0, 0, ${dark ? '0.24' : '0.14'})`,
      '--dl-button-secondary-bg': palette.surface,
      '--dl-button-secondary-bg-hover': palette.surfaceHover,
      '--dl-button-secondary-bg-active': palette.canvasSoft,
      '--dl-button-secondary-border': palette.border,
      '--dl-button-secondary-border-hover': palette.borderStrong,
      '--dl-button-secondary-border-active': palette.accent,
      '--dl-button-secondary-text': palette.text,
      '--dl-button-secondary-text-hover': palette.text,
      '--dl-button-secondary-text-active': palette.accentText,
      '--dl-button-ghost-text': palette.textMuted,
      '--dl-button-ghost-text-hover': palette.text,
      '--dl-button-ghost-text-active': palette.accentText,
      '--dl-button-ghost-bg-hover': `rgba(${palette.accentRgb}, 0.08)`,
      '--dl-button-ghost-bg-active': `rgba(${palette.accentRgb}, 0.14)`,
      '--dl-button-disabled-bg': palette.canvasSoft,
      '--dl-button-disabled-border': palette.border,
      '--dl-button-disabled-text': palette.textFaint,
      '--dl-panel': `radial-gradient(circle at 88% 0%, rgba(${palette.accentRgb}, 0.1), transparent 42%), linear-gradient(145deg, ${palette.surfaceStrong}, ${palette.canvas})`,
      '--dl-shadow': `0 12px 34px rgba(0, 0, 0, ${dark ? '0.3' : '0.1'}), inset 0 1px 0 rgba(255, 255, 255, ${dark ? '0.045' : '0.72'})`,
      '--dl-shadow-hover': `0 17px 44px rgba(0, 0, 0, ${dark ? '0.38' : '0.14'}), 0 0 24px rgba(${palette.accentRgb}, 0.08)`,
      '--dl-focus': `0 0 0 3px rgba(${palette.accentRgb}, 0.2), 0 0 0 1px rgba(${palette.accentRgb}, 0.66)`,
    }),
  })
}

const builtinThemeNames = new Set([
  'white', 'black', 'warm', 'midnight', 'forest',
  'one-dark', 'violet-nocturne', 'mocha-mauve', 'tokyo-indigo',
  'retro-amber', 'nordic-frost', 'git-daylight',
])

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
  workbenchTheme({
    name: 'one-dark', label: 'Code One Dark', colorScheme: 'dark',
    canvas: '#21252b', canvasSoft: '#282c34', surface: 'rgba(40, 44, 52, 0.94)', surfaceStrong: '#2c313c', surfaceHover: '#353b47',
    text: '#e5e9f0', textMuted: 'rgba(171, 178, 191, 0.78)', textFaint: 'rgba(171, 178, 191, 0.5)', border: 'rgba(171, 178, 191, 0.14)', borderStrong: 'rgba(171, 178, 191, 0.25)',
    accent: '#61afef', accentText: '#8fc8f5', accentRgb: '97, 175, 239', primaryText: '#14202a',
    green: '#98c379', orange: '#d19a66', yellow: '#e5c07b', red: '#e06c75', cyan: '#56b6c2', purple: '#c678dd',
  }),
  workbenchTheme({
    name: 'violet-nocturne', label: 'Violet Nocturne', colorScheme: 'dark',
    canvas: '#21222c', canvasSoft: '#282a36', surface: 'rgba(40, 42, 54, 0.95)', surfaceStrong: '#343746', surfaceHover: '#414558',
    text: '#f8f8f2', textMuted: 'rgba(248, 248, 242, 0.72)', textFaint: 'rgba(248, 248, 242, 0.46)', border: 'rgba(248, 248, 242, 0.13)', borderStrong: 'rgba(248, 248, 242, 0.23)',
    accent: '#bd93f9', accentText: '#d6b8ff', accentRgb: '189, 147, 249', primaryText: '#241b31',
    green: '#50fa7b', orange: '#ffb86c', yellow: '#f1fa8c', red: '#ff5555', cyan: '#8be9fd', purple: '#ff79c6',
  }),
  workbenchTheme({
    name: 'mocha-mauve', label: 'Mocha Mauve', colorScheme: 'dark',
    canvas: '#11111b', canvasSoft: '#181825', surface: 'rgba(30, 30, 46, 0.96)', surfaceStrong: '#242438', surfaceHover: '#313244',
    text: '#cdd6f4', textMuted: 'rgba(205, 214, 244, 0.74)', textFaint: 'rgba(205, 214, 244, 0.48)', border: 'rgba(205, 214, 244, 0.13)', borderStrong: 'rgba(205, 214, 244, 0.24)',
    accent: '#cba6f7', accentText: '#dfc5ff', accentRgb: '203, 166, 247', primaryText: '#1e1e2e',
    green: '#a6e3a1', orange: '#fab387', yellow: '#f9e2af', red: '#f38ba8', cyan: '#94e2d5', purple: '#cba6f7',
  }),
  workbenchTheme({
    name: 'tokyo-indigo', label: 'Tokyo Indigo', colorScheme: 'dark',
    canvas: '#16161e', canvasSoft: '#1a1b26', surface: 'rgba(31, 35, 53, 0.96)', surfaceStrong: '#24283b', surfaceHover: '#2f354f',
    text: '#c0caf5', textMuted: 'rgba(192, 202, 245, 0.75)', textFaint: 'rgba(192, 202, 245, 0.48)', border: 'rgba(192, 202, 245, 0.13)', borderStrong: 'rgba(192, 202, 245, 0.24)',
    accent: '#7aa2f7', accentText: '#a9c4ff', accentRgb: '122, 162, 247', primaryText: '#151927',
    green: '#9ece6a', orange: '#ff9e64', yellow: '#e0af68', red: '#f7768e', cyan: '#7dcfff', purple: '#bb9af7',
  }),
  workbenchTheme({
    name: 'retro-amber', label: 'Retro Amber', colorScheme: 'dark',
    canvas: '#1d2021', canvasSoft: '#282828', surface: 'rgba(50, 48, 47, 0.96)', surfaceStrong: '#3c3836', surfaceHover: '#504945',
    text: '#ebdbb2', textMuted: 'rgba(235, 219, 178, 0.76)', textFaint: 'rgba(235, 219, 178, 0.49)', border: 'rgba(235, 219, 178, 0.14)', borderStrong: 'rgba(235, 219, 178, 0.25)',
    accent: '#fabd2f', accentText: '#ffd86a', accentRgb: '250, 189, 47', primaryText: '#282828',
    green: '#b8bb26', orange: '#fe8019', yellow: '#fabd2f', red: '#fb4934', cyan: '#8ec07c', purple: '#d3869b',
  }),
  workbenchTheme({
    name: 'nordic-frost', label: 'Nordic Frost', colorScheme: 'dark',
    canvas: '#242933', canvasSoft: '#2e3440', surface: 'rgba(53, 60, 75, 0.96)', surfaceStrong: '#3b4252', surfaceHover: '#434c5e',
    text: '#eceff4', textMuted: 'rgba(229, 233, 240, 0.76)', textFaint: 'rgba(216, 222, 233, 0.5)', border: 'rgba(216, 222, 233, 0.14)', borderStrong: 'rgba(216, 222, 233, 0.25)',
    accent: '#88c0d0', accentText: '#a9d7e3', accentRgb: '136, 192, 208', primaryText: '#223038',
    green: '#a3be8c', orange: '#d08770', yellow: '#ebcb8b', red: '#bf616a', cyan: '#8fbcbb', purple: '#b48ead',
  }),
  workbenchTheme({
    name: 'git-daylight', label: 'Git Daylight', colorScheme: 'light',
    canvas: '#f6f8fa', canvasSoft: '#eef1f4', surface: 'rgba(255, 255, 255, 0.96)', surfaceStrong: '#ffffff', surfaceHover: '#f3f4f6',
    text: '#1f2328', textMuted: 'rgba(31, 35, 40, 0.72)', textFaint: 'rgba(31, 35, 40, 0.48)', border: 'rgba(31, 35, 40, 0.14)', borderStrong: 'rgba(31, 35, 40, 0.24)',
    accent: '#0969da', accentText: '#0550ae', accentRgb: '9, 105, 218', primaryText: '#ffffff',
    green: '#1a7f37', orange: '#bc4c00', yellow: '#9a6700', red: '#cf222e', cyan: '#0a7e8c', purple: '#8250df',
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
