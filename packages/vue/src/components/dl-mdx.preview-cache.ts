import { parseDlMdx } from './dl-mdx.parser'
import type { DlMdxDocument } from './dl-mdx.types'

const previewDocuments = new Map<string, DlMdxDocument>()
const maxPreviewDocuments = 192

/** Shares immutable parse results between compact, read-only preview instances. */
export function parseCachedDlMdx(source: string) {
  const cached = previewDocuments.get(source)
  if (cached) {
    previewDocuments.delete(source)
    previewDocuments.set(source, cached)
    return cached
  }
  const document = parseDlMdx(source)
  previewDocuments.set(source, document)
  if (previewDocuments.size > maxPreviewDocuments) {
    const oldest = previewDocuments.keys().next().value as string | undefined
    if (oldest !== undefined) previewDocuments.delete(oldest)
  }
  return document
}
