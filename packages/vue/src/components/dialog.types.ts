export interface DlDialogPosition {
  x: number
  y: number
}

export interface DlDialogDimensions {
  width: number
  height: number
}

/** Dialog 相对视口边缘的停靠方式；none 表示保持可移动浮窗。 */
export type DlDialogDock = 'none' | 'left' | 'right' | 'bottom'
