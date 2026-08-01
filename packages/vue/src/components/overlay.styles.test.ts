import { describe, expect, it } from 'vitest'
import { dialogStyles, drawerStyles, popoverStyles, toastStyles, tooltipStyles } from './overlay.styles'

describe('TodoMoe overlay style variants', () => {
  it('maps dialog size and semantic tone to stable classes', () => {
    expect(dialogStyles({ size: 'sm', tone: 'danger' })).toContain('dl-dialog--sm')
    expect(dialogStyles({ size: 'sm', tone: 'danger' })).toContain('dl-tone-danger')
  })

  it('maps toast size and semantic tone to stable classes', () => {
    expect(toastStyles({ size: 'lg', tone: 'success' })).toContain('dl-toast--lg')
    expect(toastStyles({ size: 'lg', tone: 'success' })).toContain('dl-tone-success')
  })

  it('keeps tooltip and popover surfaces independently addressable', () => {
    expect(tooltipStyles({ tone: 'warning' })).toContain('dl-tooltip')
    expect(tooltipStyles({ tone: 'warning' })).toContain('dl-tone-warning')
    expect(popoverStyles({ tone: 'accent' })).toContain('dl-popover')
    expect(popoverStyles({ tone: 'accent' })).toContain('dl-tone-accent')
  })

  it('maps drawer placement, size and tone without changing Reka behavior', () => {
    const classes = drawerStyles({ placement: 'right', size: 'lg', tone: 'muted' })
    expect(classes).toContain('dl-drawer--right')
    expect(classes).toContain('dl-drawer--lg')
    expect(classes).toContain('dl-tone-muted')
  })
})
