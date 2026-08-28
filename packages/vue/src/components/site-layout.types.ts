export type DlSiteNavigationMode = 'top' | 'side' | 'hybrid' | 'rail' | 'minimal'

export interface DlSiteEnvironment {
  siteName?: string
  siteCaption?: string
  homePath?: string
  basePath?: string
  variables?: Record<string, string | number | boolean | null | undefined>
}

export interface DlSiteNavigationItem {
  id: string
  label: string
  href: string
  description?: string
  file?: string
  icon?: string
  order?: number
  external?: boolean
}

export interface DlSiteNavigationGroup {
  id: string
  label: string
  items: DlSiteNavigationItem[]
  order?: number
  collapsed?: boolean
}

export interface DlBreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}
