export type ArchiveStatus = 'watching' | 'completed' | 'planned' | 'paused'
export type ArchiveFormat = 'tv' | 'movie' | 'ova'

export interface ArchiveItem {
  id: string
  title: string
  originalTitle: string
  summary: string
  year: number
  format: ArchiveFormat
  status: ArchiveStatus
  episodes: number
  watched: number
  rating: number
  tags: string[]
  studio: string
  accent: string
  updatedAt: string
}

export interface DemoSettings {
  compactCards: boolean
  autoplayPreview: boolean
  showAdultContent: boolean
  defaultView: 'grid' | 'list'
  weekStartsOn: 'monday' | 'sunday'
  pageSize: string
  themeTone: 'forest' | 'aurora' | 'ember'
}

export interface DemoToast {
  open: boolean
  title: string
  description: string
  tone: 'default' | 'accent' | 'success' | 'warning' | 'danger' | 'muted'
}
