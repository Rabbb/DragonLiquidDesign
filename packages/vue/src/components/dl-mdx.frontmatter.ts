export interface DlMdxPageMetadata {
  title?: string
  route?: string
  description?: string
  group?: string
  groupTitle?: string
  groupOrder?: number
  order?: number
  icon?: string
  layout?: string
  hidden?: boolean
}

export interface DlMdxFrontMatterDiagnostic {
  code: 'frontmatter.unclosed' | 'frontmatter.syntax' | 'frontmatter.key' | 'frontmatter.value'
  severity: 'warning' | 'error'
  message: string
  line: number
}

export interface DlMdxFrontMatterResult {
  metadata: DlMdxPageMetadata
  body: string
  bodyStartLine: number
  raw: string
  diagnostics: DlMdxFrontMatterDiagnostic[]
}

const keyAliases: Record<string, keyof DlMdxPageMetadata> = {
  title: 'title', name: 'title', route: 'route', path: 'route', description: 'description',
  group: 'group', 'group-title': 'groupTitle', grouptitle: 'groupTitle',
  'group-order': 'groupOrder', grouporder: 'groupOrder', order: 'order',
  icon: 'icon', layout: 'layout', hidden: 'hidden', navigation: 'hidden', nav: 'hidden',
}

function scalar(source: string): string | number | boolean {
  const value = source.trim()
  if (!value) return ''
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) return value.slice(1, -1)
  if (/^-?(?:\d+\.?\d*|\.\d+)$/.test(value)) return Number(value)
  if (/^(?:true|yes|on)$/i.test(value)) return true
  if (/^(?:false|no|off)$/i.test(value)) return false
  return value.replace(/\s+#.*$/, '').trim()
}

export function parseDlMdxFrontMatter(source: string): DlMdxFrontMatterResult {
  const normalized = source.replace(/^\uFEFF/, '')
  const lines = normalized.split(/\r?\n/)
  const opening = lines.findIndex(line => line.trim().length > 0)
  if (opening < 0 || lines[opening]?.trim() !== '---') return { metadata: {}, body: normalized, bodyStartLine: 1, raw: '', diagnostics: [] }
  const closing = lines.findIndex((line, index) => index > opening && line.trim() === '---')
  if (closing < 0) return {
    metadata: {}, body: normalized, bodyStartLine: 1, raw: '',
    diagnostics: [{ code: 'frontmatter.unclosed', severity: 'error', message: '页面元数据缺少结束分隔线 ---。', line: opening + 1 }],
  }

  const metadata: DlMdxPageMetadata = {}
  const diagnostics: DlMdxFrontMatterDiagnostic[] = []
  for (let index = opening + 1; index < closing; index += 1) {
    const line = lines[index]
    if (!line.trim() || line.trimStart().startsWith('#')) continue
    const match = line.match(/^\s*([A-Za-z][\w-]*)\s*:\s*(.*?)\s*$/)
    if (!match) {
      diagnostics.push({ code: 'frontmatter.syntax', severity: 'error', message: '页面元数据必须使用 key: value 格式。', line: index + 1 })
      continue
    }
    const inputKey = match[1].toLowerCase()
    const key = keyAliases[inputKey]
    if (!key) {
      diagnostics.push({ code: 'frontmatter.key', severity: 'warning', message: `未知的页面元数据字段：${match[1]}。`, line: index + 1 })
      continue
    }
    const value = scalar(match[2])
    if (key === 'order' || key === 'groupOrder') {
      if (typeof value !== 'number' || !Number.isFinite(value)) diagnostics.push({ code: 'frontmatter.value', severity: 'error', message: `${match[1]} 必须是数字。`, line: index + 1 })
      else metadata[key] = value
      continue
    }
    if (key === 'hidden') {
      if (inputKey === 'navigation' || inputKey === 'nav') metadata.hidden = value === false || String(value).toLowerCase() === 'hidden'
      else if (typeof value === 'boolean') metadata.hidden = value
      else diagnostics.push({ code: 'frontmatter.value', severity: 'error', message: `${match[1]} 必须是 true 或 false。`, line: index + 1 })
      continue
    }
    if (typeof value !== 'string' || !value.trim()) diagnostics.push({ code: 'frontmatter.value', severity: 'error', message: `${match[1]} 不能为空。`, line: index + 1 })
    else metadata[key] = value.trim() as never
  }
  return {
    metadata,
    body: lines.slice(closing + 1).join('\n').replace(/^\s*\n/, ''),
    bodyStartLine: closing + 2,
    raw: lines.slice(0, closing + 1).join('\n'),
    diagnostics,
  }
}

export function createDlMdxPageFrontMatter(metadata: DlMdxPageMetadata): string {
  const entries: Array<[string, unknown]> = [
    ['title', metadata.title], ['route', metadata.route], ['description', metadata.description],
    ['group', metadata.group], ['group-title', metadata.groupTitle], ['group-order', metadata.groupOrder],
    ['order', metadata.order], ['icon', metadata.icon], ['layout', metadata.layout], ['hidden', metadata.hidden],
  ]
  const lines = entries.flatMap(([key, value]) => value === undefined ? [] : [`${key}: ${typeof value === 'string' && /[:#]/.test(value) ? JSON.stringify(value) : value}`])
  return lines.length ? ['---', ...lines, '---'].join('\n') : ''
}
