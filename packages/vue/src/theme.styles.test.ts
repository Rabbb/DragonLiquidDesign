import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const themeFile = './styles/index.css'
const themeCss = readFileSync(new URL(themeFile, import.meta.url), 'utf8')

describe('Dragon Liquid theme palettes', () => {
  it('uses a pearl-white canvas with a calm mist-teal accent by default', () => {
    expect(themeCss).toContain('color-scheme: light')
    expect(themeCss).toContain('--dl-night: #f4f6f4')
    expect(themeCss).toContain('--dl-surface-strong: #ffffff')
    expect(themeCss).toContain('--dl-accent: #477f8d')
    expect(themeCss).not.toContain('--dl-surface: rgba(17, 46, 31')
  })

  it('gives the white primary action a restrained deep-water gradient', () => {
    expect(themeCss).toContain('--dl-button-primary-bg: linear-gradient(135deg, #4b8290 0%, #3c7180 55%, #315e6c 100%)')
    expect(themeCss).toContain('--dl-button-primary-text: #ffffff')
  })

  it('includes a conventional neutral black palette and a no-JavaScript system fallback', () => {
    expect(themeCss).toContain('[data-dl-theme="black"]')
    expect(themeCss).toContain('[data-dl-theme-base="black"]')
    expect(themeCss).toContain('--dl-night: #141414')
    expect(themeCss).toContain('--dl-surface-solid: #1f1f1f')
    expect(themeCss).toContain('--dl-accent: #1677ff')
    expect(themeCss).toContain('--dl-button-primary-bg: #1677ff')
    expect(themeCss).toContain('@media (prefers-color-scheme: dark)')
    expect(themeCss).toContain(':root:not([data-dl-theme])')
  })
})
