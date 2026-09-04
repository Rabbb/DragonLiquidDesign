import { copyFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const dist = resolve(root, 'dist')
const index = resolve(dist, 'index.html')
const routes = [
  'mdx',
  'mdx/overview',
  'mdx/project-engine',
  'mdx/site-layout',
  'mdx/host-integration',
  'mdx/attachments',
  'mdx/component-api',
  'mdx/component-registry',
  'mdx/document-model',
  'mdx/formatter',
  'mdx/syntax',
  'mdx/language-service',
  'mdx/events',
  'mdx/rust-core',
  'mdx/userscripts',
  // Legacy entry points remain deployable and resolve to the first page in each new submenu.
  'mdx/project',
  'mdx/integration',
  'mdx/api',
  'mdx/editing',
  'mdx/language',
  'mdx/core',
  'mdx/extensions',
  'mdx/security',
  'themes',
  'keyboard',
  'patterns',
  'patterns/library',
  'patterns/create',
  'patterns/detail',
  'patterns/editor',
  'patterns/import',
  'patterns/settings',
  'patterns/feedback',
  'patterns/coverage',
  'instance-api',
]

for (const route of routes) {
  const directory = resolve(dist, route)
  mkdirSync(directory, { recursive: true })
  copyFileSync(index, resolve(directory, 'index.html'))
}

writeFileSync(resolve(dist, '_redirects'), '/* /index.html 200\n')
copyFileSync(index, resolve(dist, '404.html'))

console.log(`Created ${routes.length} static route entries, _redirects, and 404.html.`)
