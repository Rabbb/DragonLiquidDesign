import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  buildDlMdxProject,
  createDlMdxEngine,
  createDlMdxHttpStorageAdapter,
  createDlMdxLocalStorageAdapter,
  createDlMdxMemoryStorageAdapter,
  normalizeDlMdxProjectPath,
  parseDlMdxProject,
  serializeDlMdxProject,
} from './dl-mdx.engine'

beforeEach(() => localStorage.clear())

describe('MarkdownX project engine', () => {
  it('manages a normalized virtual directory tree', () => {
    const engine = createDlMdxEngine()
    engine.createDirectory('content/guides')
    engine.writeFile('content/guides/start.mdx', '# Start')

    expect(engine.exists('/content/guides/start.mdx')).toBe(true)
    expect(engine.readFile('/content/guides/start.mdx')).toMatchObject({ language: 'mdx', encoding: 'utf8' })
    expect(engine.tree().children.map(node => node.entry.path)).toEqual(['/content', '/pages'])
    expect(engine.list('/content', true).map(entry => entry.path)).toEqual(['/content/guides', '/content/guides/start.mdx'])
  })

  it('commits a transaction atomically and rolls it back after an error', () => {
    const engine = createDlMdxEngine()
    const listener = vi.fn()
    engine.subscribe(listener)

    engine.transaction((draft) => {
      draft.writeFile('/pages/about.mdx', '# About')
      draft.writeFile('/pages/about.ts', 'export function visitAbout() {}')
    })
    expect(engine.revision).toBe(1)
    expect(listener).toHaveBeenCalledTimes(1)
    expect(listener.mock.calls[0][0].changes).toHaveLength(2)

    expect(() => engine.transaction((draft) => {
      draft.writeFile('/pages/broken.mdx', '# Broken')
      draft.move('/', '/broken')
    })).toThrow()
    expect(engine.exists('/pages/broken.mdx')).toBe(false)
    expect(engine.revision).toBe(1)
  })

  it('enforces project limits atomically and isolates subscriber failures', () => {
    const engine = createDlMdxEngine({ limits: { maxFileBytes: 40 } })
    engine.subscribe(() => { throw new Error('broken subscriber') })

    expect(() => engine.writeFile('/pages/small.mdx', '# Fine')).not.toThrow()
    expect(engine.exists('/pages/small.mdx')).toBe(true)
    expect(() => engine.writeFile('/pages/large.mdx', 'this file is intentionally much too large for the configured online project limit')).toThrow(/40/)
    expect(engine.exists('/pages/large.mdx')).toBe(false)
  })

  it('moves directories and updates manifest references', () => {
    const engine = createDlMdxEngine()
    engine.transaction((draft) => {
      draft.writeFile('/pages/index.ts', 'export function save() {}')
      draft.writeFile('/pages/index.css', '.page {}')
      draft.updateManifest({ sharedScripts: ['/pages/index.ts'], sharedStyles: ['/pages/index.css'] })
    })
    engine.move('/pages', '/site')

    expect(engine.manifest()).toMatchObject({
      entry: '/site/index.mdx',
      sharedScripts: ['/site/index.ts'],
      sharedStyles: ['/site/index.css'],
    })
    expect(engine.exists('/site/index.mdx')).toBe(true)
  })

  it('discovers page routes and combines shared and page companion files', () => {
    const engine = createDlMdxEngine()
    engine.transaction((draft) => {
      draft.writeFile('/shared/actions.ts', '/** Shared save. */\nexport function saveProject() {}')
      draft.writeFile('/shared/theme.css', ':root { --brand: gold; }')
      draft.writeFile('/pages/index.mdx', '# Home\n')
      draft.writeFile('/pages/about.mdx', '# About\n')
      draft.writeFile('/pages/about.ts', 'export const visitAbout = () => {}')
      draft.writeFile('/pages/about.css', '.about { color: var(--brand); }')
      draft.updateManifest({ sharedScripts: ['/shared/actions.ts'], sharedStyles: ['/shared/theme.css'] })
    })

    const result = engine.build()
    expect(result.ok).toBe(true)
    expect(result.routes.map(route => route.route)).toEqual(['/', '/about'])
    expect(result.routes[1]).toMatchObject({
      file: '/pages/about.mdx',
      scriptFiles: ['/shared/actions.ts', '/pages/about.ts'],
      styleFiles: ['/shared/theme.css', '/pages/about.css'],
    })
    expect(result.routes[1].actionSymbols.map(symbol => symbol.name)).toEqual(['saveProject', 'visitAbout'])
  })

  it('builds hidden front matter into routes and directory navigation groups', () => {
    const engine = createDlMdxEngine()
    engine.transaction((draft) => {
      draft.writeFile('/pages/_group.json', JSON.stringify({ title: 'Overview', order: 1 }))
      draft.writeFile('/pages/guides/_group.json', JSON.stringify({ title: '使用指南', order: 10 }))
      draft.writeFile('/pages/index.mdx', '---\ntitle: Welcome\norder: 1\n---\n# Visible heading')
      draft.writeFile('/pages/guides/start.mdx', '---\ntitle: Quick start\nroute: /start\ndescription: First project\norder: 2\nicon: S\n---\n# Internal heading')
      draft.writeFile('/pages/guides/private.mdx', '---\ntitle: Draft\nhidden: true\n---\n# Draft')
    })

    const result = engine.build()
    expect(result.ok).toBe(true)
    expect(result.routes.map(route => route.route).sort()).toEqual(['/', '/guides/private', '/start'])
    expect(result.routes[0]).toMatchObject({ title: 'Welcome', source: '# Visible heading', metadata: { order: 1 } })
    expect(result.navigation).toEqual([
      expect.objectContaining({ id: 'main', label: 'Overview', items: [expect.objectContaining({ label: 'Welcome', href: '/' })] }),
      expect.objectContaining({ id: 'guides', label: '使用指南', items: [expect.objectContaining({ label: 'Quick start', href: '/start', icon: 'S' })] }),
    ])
  })

  it('reports malformed page and directory metadata without rendering it', () => {
    const engine = createDlMdxEngine()
    engine.transaction((draft) => {
      draft.writeFile('/pages/_group.json', '{ broken')
      draft.writeFile('/pages/index.mdx', '---\norder: first\nroute: https://invalid.example\n---\n# Home')
    })
    const result = engine.build()

    expect(result.ok).toBe(false)
    expect(result.routes[0].document.blocks[0]).toMatchObject({ type: 'heading' })
    expect(result.diagnostics.map(item => item.code)).toEqual(expect.arrayContaining(['frontmatter.value', 'frontmatter.route', 'navigation.group-config']))
  })

  it('reports duplicate routes and missing entry files without executing scripts', () => {
    globalThis.__mdxEngineScriptExecuted = false
    const engine = createDlMdxEngine()
    engine.transaction((draft) => {
      draft.writeFile('/pages/other.mdx', '# Other')
      draft.writeFile('/pages/index.ts', 'globalThis.__mdxEngineScriptExecuted = true\nexport function unsafe() {}')
      draft.updateManifest({
        entry: '/pages/missing.mdx',
        routes: [{ path: '/', file: '/pages/index.mdx' }, { path: '/', file: '/pages/other.mdx' }],
      })
    })

    const result = buildDlMdxProject(engine.snapshot())
    expect(result.ok).toBe(false)
    expect(result.diagnostics.map(item => item.code)).toEqual(expect.arrayContaining(['manifest.entry', 'route.duplicate']))
    expect(globalThis.__mdxEngineScriptExecuted).toBe(false)
  })

  it('round-trips projects through JSON, memory storage and local storage', async () => {
    const engine = createDlMdxEngine()
    engine.writeFile('/pages/guide.mdx', '# Guide')
    const serialized = serializeDlMdxProject(engine.snapshot())
    expect(parseDlMdxProject(serialized)).toEqual(engine.snapshot())

    const memory = createDlMdxMemoryStorageAdapter()
    await engine.save(memory)
    const restored = createDlMdxEngine()
    expect(await restored.restore(memory, engine.manifest().id)).toBe(true)
    expect(restored.readFile('/pages/guide.mdx')?.content).toBe('# Guide')

    const browser = createDlMdxLocalStorageAdapter({ prefix: 'test:mdx:' })
    await engine.save(browser)
    expect((await browser.list())[0]).toMatchObject({ id: 'untitled-mdx-project' })
    expect((await browser.load('untitled-mdx-project'))?.entries).toEqual(engine.snapshot().entries)
  })

  it('persists projects through the host HTTP storage contract', async () => {
    const engine = createDlMdxEngine()
    const request = vi.fn(async (input: string | URL | Request, init?: RequestInit) => {
      const url = String(input)
      if (init?.method === 'PUT') return new Response(null, { status: 204 })
      if (init?.method === 'DELETE') return new Response(null, { status: 204 })
      if (url.endsWith('/untitled-mdx-project')) return Response.json(engine.snapshot())
      return Response.json([{ id: 'untitled-mdx-project', name: 'Untitled MarkdownX Project', version: '0.1.0' }])
    })
    const storage = createDlMdxHttpStorageAdapter({ baseUrl: '/api/mdx/projects/', fetch: request as typeof fetch })

    await storage.save(engine.snapshot())
    expect((await storage.load('untitled-mdx-project'))?.manifest.id).toBe('untitled-mdx-project')
    expect(await storage.list()).toHaveLength(1)
    await storage.remove('untitled-mdx-project')
    expect(request.mock.calls.map(call => call[1]?.method ?? 'GET')).toEqual(['PUT', 'GET', 'GET', 'DELETE'])
  })

  it('rejects paths that escape or impersonate the project root', () => {
    expect(() => normalizeDlMdxProjectPath('../../secret')).toThrow()
    expect(() => normalizeDlMdxProjectPath('C:\\secret')).toThrow()
    expect(() => normalizeDlMdxProjectPath('https://example.com/file')).toThrow()
    expect(normalizeDlMdxProjectPath('./pages//index.mdx')).toBe('/pages/index.mdx')
  })
})

declare global {
  var __mdxEngineScriptExecuted: boolean
}
