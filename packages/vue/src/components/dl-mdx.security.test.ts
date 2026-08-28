import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import DlMdx from './DlMdx.vue'
import { safeDlMdxUrl } from './dl-mdx.parser'
import { createDlMdxSecurityPolicy } from './dl-mdx.security'
import type { DlMdxLinkPolicy } from './dl-mdx.types'

const linkPolicy: Required<DlMdxLinkPolicy> = {
  allowExternal: true,
  openExternal: true,
  allowImages: true,
  allowDataImages: true,
}

const security = createDlMdxSecurityPolicy({
  domains: {
    links: ['docs.example.com'],
    images: ['*.images.example.com'],
    files: ['https://download.example.com'],
  },
  fileExtensions: ['pdf', '.tar.gz'],
})

describe('DlMdx WASM URL security policy', () => {
  it('separates exact link, wildcard image, and file domain rules', () => {
    expect(safeDlMdxUrl('https://docs.example.com/guide', 'link', linkPolicy, security)).toBe('https://docs.example.com/guide')
    expect(safeDlMdxUrl('https://other.example.com/guide', 'link', linkPolicy, security)).toBeUndefined()
    expect(safeDlMdxUrl('https://a.images.example.com/cover.webp', 'image', linkPolicy, security)).toBe('https://a.images.example.com/cover.webp')
    expect(safeDlMdxUrl('https://images.example.com/cover.webp', 'image', linkPolicy, security)).toBeUndefined()
    expect(safeDlMdxUrl('https://download.example.com/archive.tar.gz', 'link', linkPolicy, security)).toBe('https://download.example.com/archive.tar.gz')
  })

  it('rejects unlisted file extensions and protocol-relative bypasses', () => {
    expect(safeDlMdxUrl('https://download.example.com/setup.exe', 'link', linkPolicy, security)).toBeUndefined()
    expect(safeDlMdxUrl('//evil.example.com/cover.webp', 'image', linkPolicy, security)).toBeUndefined()
    expect(safeDlMdxUrl('//a.images.example.com/cover.webp', 'image', linkPolicy, security)).toBe('//a.images.example.com/cover.webp')
    expect(safeDlMdxUrl('/documents/guide.pdf', 'link', linkPolicy, security)).toBe('/documents/guide.pdf')
    expect(safeDlMdxUrl('/documents/setup.exe', 'link', linkPolicy, security)).toBeUndefined()
  })

  it('requires explicit opt-in for non-https protocols and special URLs', () => {
    const local = createDlMdxSecurityPolicy({
      domains: { links: ['http://localhost:8030'] },
      allowedProtocols: ['https', 'http'],
      allowRelative: false,
      allowMailto: true,
    })
    expect(local.validate('http://localhost:8030/docs', 'link')).toBe('http://localhost:8030/docs')
    expect(local.validate('http://localhost:8031/docs', 'link')).toBeUndefined()
    expect(local.validate('/docs', 'link')).toBeUndefined()
    expect(local.validate('mailto:team@example.com', 'link')).toBe('mailto:team@example.com')
    expect(local.validate('tel:10086', 'link')).toBeUndefined()
  })

  it('keeps the WASM-backed policy immutable and reports integrity', () => {
    expect(Object.isFrozen(security)).toBe(true)
    expect(security.verifyIntegrity()).toBe(true)
    expect(security.status()).toMatchObject({
      wasm: true,
      engine: 'rust-wasm',
      abiVersion: 1,
      integrity: true,
      domainRuleCount: 3,
      fileExtensionCount: 2,
    })
    expect(security.status().fingerprint).toMatch(/^[a-f0-9]{8}$/)
  })

  it('copies the source arrays so later console-side mutations cannot change rules', () => {
    const links = ['safe.example.com']
    const extensions = ['pdf']
    const isolated = createDlMdxSecurityPolicy({ domains: { links }, fileExtensions: extensions })
    links[0] = 'evil.example.com'
    extensions[0] = 'exe'

    expect(isolated.validate('https://safe.example.com/guide', 'link')).toBe('https://safe.example.com/guide')
    expect(isolated.validate('https://evil.example.com/guide', 'link')).toBeUndefined()
    expect(isolated.validate('/guide.pdf', 'link')).toBe('/guide.pdf')
    expect(isolated.validate('/setup.exe', 'link')).toBeUndefined()
  })

  it('injects the main.ts policy into DlMdx and cannot broaden local linkPolicy', () => {
    const source = '[允许](https://docs.example.com/guide) [拒绝](https://evil.example.com)\n\n![封面](https://a.images.example.com/cover.webp)'
    const wrapper = mount(DlMdx, {
      props: { modelValue: source, mode: 'preview', debounce: 0, linkPolicy: { allowExternal: true, allowImages: true } },
      global: { plugins: [security] },
    })
    expect(wrapper.findAll('a.dl-mdx__link')).toHaveLength(1)
    expect(wrapper.get('a.dl-mdx__link').attributes('href')).toBe('https://docs.example.com/guide')
    expect(wrapper.findAll('.dl-mdx__unsafe-link')).toHaveLength(1)
    expect(wrapper.get('img').attributes('src')).toBe('https://a.images.example.com/cover.webp')
  })

  it('rejects malformed or overbroad whitelist rules at startup', () => {
    expect(() => createDlMdxSecurityPolicy({ domains: { links: ['https://example.com/path'] } })).toThrow(/路径/)
    expect(() => createDlMdxSecurityPolicy({ domains: { links: ['https://example.com\\@evil.example'] } })).toThrow(/路径/)
    expect(() => createDlMdxSecurityPolicy({ domains: { links: ['*.localhost'] } })).toThrow(/通配域名/)
    expect(() => createDlMdxSecurityPolicy({ domains: {}, fileExtensions: ['../exe'] })).toThrow(/扩展名/)
  })
})
