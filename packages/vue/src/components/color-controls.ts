import { colorToString, convertToRgb, parseColor } from 'reka-ui'

export type DlColorFormat = 'hex' | 'rgb' | 'hsl' | 'hsb'

export interface DlColorSwatchOption {
  value: string
  label?: string
  description?: string
  disabled?: boolean
}

export type DlColorSwatchSource = string | DlColorSwatchOption

export function normalizeColorInput(value: string) {
  const trimmed = value.trim()
  return /^(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i.test(trimmed) ? `#${trimmed}` : trimmed
}

export function formatColorValue(value: string, format: DlColorFormat, allowAlpha = true) {
  const parsed = parseColor(normalizeColorInput(value))
  const color = allowAlpha ? parsed : { ...parsed, alpha: 1 }
  return colorToString(color, format)
}

export function safeColorValue(value: string, fallback = '#000000') {
  try {
    return colorToString(parseColor(normalizeColorInput(value)), 'hex')
  }
  catch {
    return fallback
  }
}

export function resolveColorSwatches(colors: readonly DlColorSwatchSource[]): DlColorSwatchOption[] {
  return colors.map(color => typeof color === 'string'
    ? { value: color, label: color.toUpperCase() }
    : { ...color, label: color.label ?? color.value.toUpperCase() })
}

export function readableColorInk(value: string) {
  try {
    const { r, g, b } = convertToRgb(parseColor(normalizeColorInput(value)))
    const luminance = (0.2126 * channelLuminance(r) + 0.7152 * channelLuminance(g) + 0.0722 * channelLuminance(b))
    return luminance > 0.42 ? '#111827' : '#ffffff'
  }
  catch {
    return '#ffffff'
  }
}

function channelLuminance(value: number) {
  const channel = value / 255
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
}
