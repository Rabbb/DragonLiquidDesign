import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { basename, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { componentCatalog } from '../src/catalog.ts'
import { componentGroupDefinitions, componentGroupingModes } from '../src/componentGroups.ts'
import {
  componentChoiceFamilies,
  componentChoiceProfileFor,
  recommendedComponentCount,
} from '../src/componentChoices.ts'
import { componentGuidance, componentsMissingGuidance } from '../src/componentGuidance.ts'
import { componentKeyboardGuidance, componentsMissingKeyboardGuidance } from '../src/componentKeyboard.ts'
import componentApi from '../src/generated/component-api.generated.ts'
import inputControls from '../src/input-controls.json' with { type: 'json' }

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const showcaseRoot = resolve(scriptDirectory, '..')
const docsPagePath = resolve(showcaseRoot, 'src/pages/ComponentDocsPage.vue')
const packageComponentsRoot = resolve(showcaseRoot, '../../packages/vue/src/components')
const docsPageSource = readFileSync(docsPagePath, 'utf8')
const errors = []

function report(condition, message) {
  if (!condition) errors.push(message)
}

function collectVueFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = resolve(directory, entry.name)
    if (entry.isDirectory()) return collectVueFiles(path)
    return entry.isFile() && entry.name.endsWith('.vue') ? [path] : []
  })
}

const ids = componentCatalog.map(component => component.id)
report(ids.length === 89, `组件目录应为 89 项，当前为 ${ids.length} 项。`)
report(new Set(ids).size === ids.length, '组件目录存在重复 id。')
report(recommendedComponentCount >= 40 && recommendedComponentCount <= 65, `精简目录应收敛为 40–65 个高频控件，当前为 ${recommendedComponentCount} 个。`)

const choiceFamilyIds = componentChoiceFamilies.map(family => family.id)
report(new Set(choiceFamilyIds).size === choiceFamilyIds.length, '控件选择指南存在重复 family id。')
for (const family of componentChoiceFamilies) {
  const optionIds = family.options.map(option => option.id)
  report(optionIds.length >= 4, `${family.id} 的选型比较项过少。`)
  report(new Set(optionIds).size === optionIds.length, `${family.id} 的选型比较项存在重复控件。`)
  report(optionIds.includes(family.preferredId), `${family.id} 的常见首选未包含在比较项中。`)
  for (const option of family.options) {
    report(ids.includes(option.id), `${family.id} 引用了未知控件 ${option.id}。`)
    report(option.useWhen.trim().length >= 8, `${family.id}/${option.id} 缺少明确选择条件。`)
  }
}

for (const id of ids) {
  const profile = componentChoiceProfileFor(id)
  report(Boolean(profile.label) && profile.summary.trim().length >= 8, `${id} 缺少目录层级说明。`)
  if (profile.tier === 'compatibility') {
    report(Boolean(profile.preferredId) && ids.includes(profile.preferredId), `${id} 兼容封装缺少有效的推荐替代项。`)
  }
}

for (const mode of componentGroupingModes) {
  const groups = componentGroupDefinitions[mode.value]
  const groupIds = groups.map(group => group.id)
  const placements = groups.flatMap(group => group.componentIds)
  const placementCounts = new Map(ids.map(id => [id, placements.filter(placement => placement === id).length]))

  report(groups.length >= 10, `${mode.label}分组过粗，当前只有 ${groups.length} 组。`)
  report(new Set(groupIds).size === groupIds.length, `${mode.label}存在重复分组 id。`)
  for (const group of groups) {
    report(Boolean(group.label.trim()) && Boolean(group.english.trim()), `${mode.label}/${group.id} 缺少中英文名称。`)
    report(group.summary.trim().length >= 8, `${mode.label}/${group.id} 缺少分组说明。`)
    report(group.componentIds.length > 0, `${mode.label}/${group.id} 是空分组。`)
    report(new Set(group.componentIds).size === group.componentIds.length, `${mode.label}/${group.id} 内存在重复控件。`)
    for (const id of group.componentIds) report(ids.includes(id), `${mode.label}/${group.id} 引用了未知控件 ${id}。`)
  }
  for (const [id, count] of placementCounts) {
    report(count > 0, `${id} 未进入${mode.label}分组。`)
  }
  report(placements.length > new Set(placements).size, `${mode.label}应允许并实际包含跨组复用控件。`)
}

for (const component of componentCatalog) {
  report(Boolean(component.name.trim()), `${component.id} 缺少名称。`)
  report(component.summary.trim().length >= 12, `${component.id} 的目录描述过短或缺失。`)
  report(component.scenarios.length > 0, `${component.id} 至少需要一个真实案例。`)
  for (const scenario of component.scenarios) {
    report(Boolean(scenario.id.trim()), `${component.id} 存在缺少 id 的案例。`)
    report(Boolean(scenario.label.trim()), `${component.id}/${scenario.id} 缺少案例名称。`)
    report(scenario.summary.trim().length >= 4, `${component.id}/${scenario.id} 缺少案例说明。`)
  }
}

for (const id of componentsMissingGuidance(ids)) errors.push(`${id} 缺少使用决策说明。`)
for (const id of componentsMissingKeyboardGuidance(ids)) errors.push(`${id} 缺少键盘场景说明。`)
for (const id of ids) {
  const keyboard = componentKeyboardGuidance[id]
  if (!keyboard) continue
  report(keyboard.summary.trim().length >= 8, `${id} 缺少键盘行为摘要。`)
  report(keyboard.keys.length > 0, `${id} 缺少键盘按键说明。`)
}
for (const id of ids) {
  const guidance = componentGuidance[id]
  if (!guidance) continue
  report(guidance.useWhen.length === 2 && guidance.useWhen.every(item => item.trim().length >= 8), `${id} 的适用场景说明不完整。`)
  report(guidance.avoidWhen.trim().length >= 8, `${id} 缺少误用边界。`)
  report(guidance.accessibility.trim().length >= 8, `${id} 缺少无障碍说明。`)
  report(guidance.example.trim().length >= 8, `${id} 缺少案例观察重点。`)
}

for (const input of inputControls) {
  const componentName = input.type === 'datetime-local'
    ? 'DlInputDatetimeLocal'
    : `DlInput${input.type[0].toUpperCase()}${input.type.slice(1)}`
  const sourcePath = resolve(packageComponentsRoot, `${componentName}.vue`)
  report(existsSync(sourcePath), `${componentName} 缺少独立组件源码。`)
  if (existsSync(sourcePath)) {
    const source = readFileSync(sourcePath, 'utf8')
    report(new RegExp(`<input\\b[^>]*\\btype=["']${input.type}["']`).test(source), `${componentName} 没有固定 input[type="${input.type}"]。`)
    report(!/\btype\s*\??\s*:/.test(source), `${componentName} 不应公开 type 属性。`)
  }
  report(!componentApi[input.id]?.props.some(prop => prop.prop === 'type'), `${input.id} 的 API 不应包含 type 属性。`)
}

for (const vuePath of collectVueFiles(resolve(showcaseRoot, 'src'))) {
  const source = readFileSync(vuePath, 'utf8')
  const buttonTags = [...source.matchAll(/<DlButton\b(?:(?!>).)*>/gs)].map(match => match[0])
  const implicitButtons = buttonTags.filter(tag => !/\b:?variant\s*=/.test(tag))
  const allowedDefaults = basename(vuePath) === 'ButtonDocs.vue'
    ? implicitButtons.filter(tag => tag === '<DlButton>')
    : []
  const accidentalDefaults = implicitButtons.filter(tag => !allowedDefaults.includes(tag))

  report(accidentalDefaults.length === 0, `${basename(vuePath)} 存在未显式声明 variant 的历史按钮。`)
  if (basename(vuePath) === 'ButtonDocs.vue') {
    report(allowedDefaults.length === 2, 'ButtonDocs.vue 应只保留代码与预览各一个默认 secondary 示例。')
  }
}

const apiIds = Object.keys(componentApi)
report(apiIds.length === ids.length, `API 组件数 ${apiIds.length} 与目录数 ${ids.length} 不一致。`)
for (const id of ids) {
  const definition = componentApi[id]
  report(Boolean(definition), `${id} 缺少 API 定义。`)
  if (!definition) continue
  report(definition.props.length > 0, `${id} 的 Props API 为空。`)
  for (const row of definition.props) {
    report(Boolean(row.prop.trim()), `${id} 存在无名称的 Prop。`)
    report(Boolean(row.type.trim()), `${id}.${row.prop} 缺少类型。`)
    report(row.description.trim().length >= 4, `${id}.${row.prop} 缺少描述。`)
  }
}

const loaderPattern = /^\s{2}(?:'([^']+)'|([a-z][\w-]*)):\s*\(\)\s*=>\s*import\('([^']+)'\)/gm
const docLoaders = new Map()
for (const match of docsPageSource.matchAll(loaderPattern)) {
  docLoaders.set(match[1] ?? match[2], match[3])
}

for (const id of ids) {
  const loader = docLoaders.get(id)
  report(Boolean(loader), `${id} 缺少文档路由。`)
  if (!loader) continue
  const docPath = resolve(dirname(docsPagePath), loader)
  report(existsSync(docPath), `${id} 的文档文件不存在：${loader}`)
  if (!existsSync(docPath)) continue
  const source = readFileSync(docPath, 'utf8')
  report(source.includes('DocExampleShell'), `${id} 的文档没有使用统一案例壳。`)
  report(source.includes('vueSfc('), `${id} 的文档没有生成完整 Vue SFC。`)
}

if (errors.length) {
  console.error(`组件文档审计失败（${errors.length} 项）：`)
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}

const scenarioCount = componentCatalog.reduce((total, component) => total + component.scenarios.length, 0)
console.log(`组件文档审计通过：${ids.length} 个组件、${scenarioCount} 个按需案例、${apiIds.length} 份 API、${Object.keys(componentGuidance).length} 份使用决策说明、${Object.keys(componentKeyboardGuidance).length} 份键盘说明、${componentGroupingModes.length} 套目录分组。`)
