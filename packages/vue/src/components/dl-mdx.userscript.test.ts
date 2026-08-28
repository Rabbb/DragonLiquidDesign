import { describe, expect, it } from 'vitest'
import {
  buildDlMdxUserscript,
  dlMdxUserscriptMatchesUrl,
  parseDlMdxUserscript,
  validateDlMdxUserscript,
  type DlMdxUserscriptProject,
} from './dl-mdx.userscript'

const project: DlMdxUserscriptProject = {
  metadata: {
    id: 'focus-reading-tools',
    name: 'Focus reading tools',
    namespace: 'https://todo.moe/userscripts',
    version: '1.2.0',
    description: 'Reduce distractions on article pages.',
    matches: ['https://*.example.com/articles/*'],
    excludes: ['*://private.example.com/*'],
    grants: ['GM_addStyle', 'GM_getValue'],
    runAt: 'document-idle',
  },
  source: 'GM_addStyle("aside { display: none }")',
}

describe('DL-MDX userscript engine', () => {
  it('builds an installable userscript without executing source', () => {
    globalThis.__userscriptExecuted = false
    const result = buildDlMdxUserscript({ ...project, source: 'globalThis.__userscriptExecuted = true' })

    expect(result.ok).toBe(true)
    expect(result.filename).toBe('focus-reading-tools.user.js')
    expect(result.code).toContain('// ==UserScript==')
    expect(result.code).toContain('@match          https://*.example.com/articles/*')
    expect(result.code).toContain('@grant          GM_addStyle')
    expect(result.code).toContain('globalThis.__userscriptExecuted = true')
    expect(globalThis.__userscriptExecuted).toBe(false)
  })

  it('round-trips standard metadata and strips imported header from source', () => {
    const built = buildDlMdxUserscript(project)
    const parsed = parseDlMdxUserscript(built.code)

    expect(parsed.metadata).toMatchObject({
      name: project.metadata.name,
      namespace: project.metadata.namespace,
      version: project.metadata.version,
      matches: project.metadata.matches,
      grants: project.metadata.grants,
    })
    expect(parsed.source).toBe(project.source)
  })

  it('matches browser-extension target patterns and applies excludes first', () => {
    expect(dlMdxUserscriptMatchesUrl(project, 'https://docs.example.com/articles/42')).toBe(true)
    expect(dlMdxUserscriptMatchesUrl(project, 'https://private.example.com/articles/42')).toBe(false)
    expect(dlMdxUserscriptMatchesUrl(project, 'http://docs.example.com/articles/42')).toBe(false)
    expect(dlMdxUserscriptMatchesUrl(project, 'https://docs.example.com/account')).toBe(false)
  })

  it('rejects unsafe dependencies, malformed targets and missing source', () => {
    const diagnostics = validateDlMdxUserscript({
      metadata: {
        ...project.metadata,
        id: 'BAD ID',
        matches: ['example.com/*'],
        grants: ['none', 'GM_getValue'],
        requires: ['http://cdn.example.com/tool.js'],
      },
      source: '',
    })

    expect(diagnostics.filter(item => item.severity === 'error').map(item => item.code)).toEqual(expect.arrayContaining([
      'id.invalid',
      'match.invalid',
      'grant.none',
      'require.https',
      'source.empty',
    ]))
  })
})

declare global {
  var __userscriptExecuted: boolean
}
