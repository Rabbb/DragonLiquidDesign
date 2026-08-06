import { tv } from 'tailwind-variants'
import { DlOverlaySide, type DlOverlayBaseSide } from '../types'

type DlRekaAlign = 'start' | 'center' | 'end'

const dlOverlayPlacements = [
  ['top'], ['top', 'start'], ['top', 'end'],
  ['right'], ['right', 'start'], ['right', 'end'],
  ['bottom'], ['bottom', 'start'], ['bottom', 'end'],
  ['left'], ['left', 'start'], ['left', 'end'],
] as const satisfies readonly (readonly [DlOverlayBaseSide, DlRekaAlign?])[]

export function resolveDlOverlayPlacement(side: DlOverlaySide | DlOverlayBaseSide, align: DlRekaAlign) {
  const placement: readonly [DlOverlayBaseSide, DlRekaAlign?] = typeof side === 'number' ? dlOverlayPlacements[side] : [side]
  return [placement[0], placement[1] ?? align] as const
}

const toneVariants = {
  default: 'dl-tone-default',
  accent: 'dl-tone-accent',
  success: 'dl-tone-success',
  warning: 'dl-tone-warning',
  danger: 'dl-tone-danger',
  muted: 'dl-tone-muted',
} as const

const popoverToneVariants = {
  ...toneVariants,
  subtle: 'dl-tone-subtle',
} as const

export const dialogStyles = tv({
  base: 'dl-dialog',
  variants: {
    tone: toneVariants,
    size: {
      sm: 'dl-dialog--sm',
      md: 'dl-dialog--md',
      lg: 'dl-dialog--lg',
    },
  },
  defaultVariants: { tone: 'default', size: 'md' },
})

export const toastStyles = tv({
  base: 'dl-toast',
  variants: {
    tone: toneVariants,
    size: {
      sm: 'dl-toast--sm',
      md: 'dl-toast--md',
      lg: 'dl-toast--lg',
    },
  },
  defaultVariants: { tone: 'default', size: 'md' },
})

export const tooltipStyles = tv({
  base: 'dl-tooltip',
  variants: { tone: toneVariants },
  defaultVariants: { tone: 'default' },
})

export const popoverStyles = tv({
  base: 'dl-popover',
  variants: { tone: popoverToneVariants },
  defaultVariants: { tone: 'default' },
})

export const drawerStyles = tv({
  base: 'dl-drawer',
  variants: {
    tone: toneVariants,
    size: {
      sm: 'dl-drawer--sm',
      md: 'dl-drawer--md',
      lg: 'dl-drawer--lg',
    },
    placement: {
      top: 'dl-drawer--top',
      right: 'dl-drawer--right',
      bottom: 'dl-drawer--bottom',
      left: 'dl-drawer--left',
    },
  },
  defaultVariants: { tone: 'default', size: 'sm', placement: 'bottom' },
})
