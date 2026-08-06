import { describe, expect, it } from 'vitest'
import { DlOverlaySide } from '../types'
import { dialogStyles, drawerStyles, popoverStyles, resolveDlOverlayPlacement, toastStyles, tooltipStyles } from './overlay.styles'

describe('TodoMoe overlay style variants', () => {
  it('maps dialog size and semantic tone to stable classes', () => {
    expect(dialogStyles({ size: 'sm', tone: 'danger' })).toContain('dl-dialog--sm')
    expect(dialogStyles({ size: 'sm', tone: 'danger' })).toContain('dl-tone-danger')
    expect(dialogStyles({ size: 'md' })).toContain('dl-dialog--md')
    expect(dialogStyles({ size: 'lg' })).toContain('dl-dialog--lg')
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
    expect(popoverStyles({ tone: 'subtle' })).toContain('dl-tone-subtle')
  })

  it.each([
    [DlOverlaySide.TopLeft, 'top', 'start'],
    [DlOverlaySide.TopRight, 'top', 'end'],
    [DlOverlaySide.RightTop, 'right', 'start'],
    [DlOverlaySide.RightBottom, 'right', 'end'],
    [DlOverlaySide.BottomLeft, 'bottom', 'start'],
    [DlOverlaySide.BottomRight, 'bottom', 'end'],
    [DlOverlaySide.LeftTop, 'left', 'start'],
    [DlOverlaySide.LeftBottom, 'left', 'end'],
  ] as const)('maps numeric placement %s to Reka side and align', (side, rekaSide, align) => {
    expect(resolveDlOverlayPlacement(side, 'center')).toEqual([rekaSide, align])
  })

  it('keeps custom alignment for a base side', () => {
    expect(resolveDlOverlayPlacement('top', 'end')).toEqual(['top', 'end'])
  })

  it('maps drawer placement, size and tone without changing Reka behavior', () => {
    const classes = drawerStyles({ placement: 'right', size: 'lg', tone: 'muted' })
    expect(classes).toContain('dl-drawer--right')
    expect(classes).toContain('dl-drawer--lg')
    expect(classes).toContain('dl-tone-muted')
  })
})
