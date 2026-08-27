export interface DlCalendarItem {
  id: string | number
  date: string
  title: string
  color?: string
  kind?: string
  completed?: boolean
  draggable?: boolean
  disabled?: boolean
  meta?: unknown
}

export interface DlCalendarDay {
  key: string
  date: Date
  day: number
  inCurrentMonth: boolean
  isToday: boolean
  isSelected: boolean
  items: DlCalendarItem[]
}
