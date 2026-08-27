import { readFileSync, readdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { componentCatalog } from '../src/catalog.ts'
import inputControls from '../src/input-controls.json' with { type: 'json' }
import { componentHomes, componentUsageLocations, coveragePageIds, scenarioCoverage } from '../src/patterns/pattern.coverage.ts'

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const patternRoot = resolve(scriptDirectory, '../src/patterns')
const inputControlDocsSource = readFileSync(resolve(scriptDirectory, '../src/docs/InputControlDocs.vue'), 'utf8')
const errors = []

function collectVueFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = resolve(directory, entry.name)
    if (entry.isDirectory()) return collectVueFiles(path)
    return entry.isFile() && entry.name.endsWith('.vue') ? [path] : []
  })
}

function componentTag(id) {
  if (id === 'mdx') return 'DlMdx'
  return `Dl${id.split('-').map(part => part[0].toUpperCase() + part.slice(1)).join('')}`
}

const pageIds = new Set(coveragePageIds)
const componentIds = new Set(componentCatalog.map(component => component.id))
const vueSource = collectVueFiles(patternRoot).map(path => readFileSync(path, 'utf8')).join('\n')
let scenarioCount = 0

for (const component of componentCatalog) {
  const home = componentHomes[component.id]
  if (!home) errors.push(`${component.id} 没有指定主要演示页面。`)
  else if (!pageIds.has(home)) errors.push(`${component.id} 指向不存在的演示页面 ${home}。`)

  if (!componentUsageLocations[component.id]) errors.push(`${component.id} 没有详细的实景位置说明。`)

  if (component.id.startsWith('input-')) {
    const inputControl = inputControls.find(input => input.id === component.id)
    const tag = componentTag(component.id)
    if (!inputControl) errors.push(`${component.id} 缺少独立 input 控件定义。`)
    else if (!new RegExp(`<${tag}\\b`).test(inputControlDocsSource)) {
      errors.push(`${component.id} 没有使用独立控件 ${tag} 渲染案例。`)
    }
  } else {
    const tag = componentTag(component.id)
    if (!new RegExp(`<${tag}\\b`).test(vueSource)) errors.push(`${component.id} 没有在应用演示站实际渲染 ${tag}。`)
  }

  const coverage = scenarioCoverage(component)
  scenarioCount += component.scenarios.length
  if (coverage.length !== component.scenarios.length) errors.push(`${component.id} 的场景覆盖数量不完整。`)
  for (const scenario of component.scenarios) {
    const record = coverage.find(item => item.scenarioId === scenario.id)
    if (!record) errors.push(`${component.id}/${scenario.id} 没有演示位置。`)
    else if (!pageIds.has(record.pageId)) errors.push(`${component.id}/${scenario.id} 指向不存在的页面 ${record.pageId}。`)
  }
}

for (const id of Object.keys(componentHomes)) {
  if (!componentIds.has(id)) errors.push(`覆盖清单包含未知组件 ${id}。`)
}

for (const id of Object.keys(componentUsageLocations)) {
  if (!componentIds.has(id)) errors.push(`位置说明包含未知组件 ${id}。`)
}

if (errors.length) {
  console.error(`应用演示覆盖审计失败（${errors.length} 项）：`)
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}

console.log(`应用演示覆盖审计通过：${componentCatalog.length} 个组件、${scenarioCount} 个场景、${coveragePageIds.length} 个共享状态页面。`)
