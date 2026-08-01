import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const showcaseRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const componentsRoot = resolve(showcaseRoot, '../../packages/vue/src/components')
const outputFile = resolve(showcaseRoot, 'src/generated/component-api.generated.ts')

const descriptions = {
  actionLabel: '操作按钮显示的文字；不传时不显示该操作。',
  activationMode: '设置组件进入激活或编辑状态的方式。',
  align: '设置浮层相对触发器的对齐方式。',
  alt: '图片无法展示时使用的替代文本。',
  ariaLabel: '提供给辅助技术读取的控件名称。',
  block: '是否让控件占满父容器宽度。',
  bubbleSelect: '选中节点时是否向父节点冒泡选择状态。',
  cancelLabel: '取消操作按钮显示的文字。',
  channel: '当前编辑或滑动控制的颜色通道。',
  children: '当前节点或导航项包含的下一级项目。',
  clearable: '是否允许再次操作以清空当前值。',
  closeDelay: '指针离开后关闭浮层的延迟时间，单位毫秒。',
  closeLabel: '关闭按钮的无障碍名称。',
  closable: '是否显示并允许使用关闭操作。',
  collapsible: '单选模式下是否允许收起当前已展开项。',
  color: '要展示或编辑的颜色值。',
  colors: '供用户选择的颜色值列表。',
  colorSpace: '颜色值采用的色彩空间。',
  confirmLabel: '确认操作按钮显示的文字。',
  completed: '该步骤是否已经完成。',
  decorative: '是否仅作为视觉装饰并从无障碍树中隐藏。',
  delayDuration: '触发后显示浮层的延迟时间，单位毫秒。',
  delayMs: '加载回退内容前等待的时间，单位毫秒。',
  delimiter: '输入多个值时用于分隔内容的字符。',
  description: '补充说明文字；不传时隐藏说明区域。',
  defaultSize: '面板首次渲染时所占的尺寸百分比。',
  direction: '设置布局分割方向。',
  disabled: '是否禁用控件及其交互。',
  duration: '内容自动关闭前的停留时间，单位毫秒。',
  expanded: '当前已展开节点的标识列表。',
  fallback: '图片不可用时显示的回退文字。',
  fixedWeeks: '是否固定显示完整的六周日期网格。',
  for: '关联表单控件的 id。',
  formatOptions: '传递给 Intl.NumberFormat 的数字格式化选项。',
  granularity: '允许编辑到的最小日期或时间粒度。',
  helper: '显示在主内容下方的辅助说明。',
  href: '点击导航项后前往的目标地址。',
  horizontal: '是否同时启用横向滚动。',
  hourCycle: '时间字段使用 12 小时制或 24 小时制。',
  icon: '自定义状态图标；不传时按色调选择默认图标。',
  id: '控件或输入元素使用的唯一标识。',
  interactive: '是否启用悬停抬升等可交互视觉反馈。',
  items: '用于渲染控件内容的结构化项目列表。',
  itemsPerPage: '每页显示的数据条数。',
  keyboardResizeBy: '键盘操作每次调整面板的百分比。',
  label: '控件的显示标签或无障碍名称。',
  length: '需要渲染或允许输入的项目数量。',
  linear: '是否要求按顺序完成步骤。',
  loading: '是否显示加载状态并阻止重复操作。',
  locale: '日期、时间或数字格式使用的区域语言。',
  loop: '键盘导航到边界时是否循环。',
  mask: '是否隐藏输入字符。',
  max: '允许的最大值。',
  maxSize: '面板允许调整到的最大尺寸百分比。',
  maxLength: '允许输入的最大字符数。',
  maxWidth: '浮层内容允许使用的最大宽度。',
  min: '允许的最小值。',
  minSize: '面板允许调整到的最小尺寸百分比。',
  modal: '是否启用模态交互与焦点限制。',
  modelValue: '组件当前值；使用 v-model 进行双向绑定。',
  multiple: '是否允许同时选择多个值。',
  name: '参与表单提交时使用的字段名称。',
  numberOfMonths: '同时显示的月份面板数量。',
  open: '浮层或内容区域是否打开；使用 v-model:open 双向绑定。',
  openDelay: '触发后打开浮层的延迟时间，单位毫秒。',
  options: '可供用户选择的选项列表。',
  orientation: '设置控件的水平或垂直方向。',
  otp: '是否启用一次性验证码输入行为。',
  padding: '设置内容区域的内边距尺寸。',
  page: '当前页码；使用 v-model:page 双向绑定。',
  panels: '分割布局中各面板的尺寸与约束配置。',
  placeholder: '当前值为空时显示的占位提示。',
  placement: '抽屉从视口的哪一侧进入。',
  progress: '自定义进度百分比。',
  propagateSelect: '选中节点时是否同步选择其子节点。',
  ratio: '内容区域需要保持的宽高比。',
  readonly: '是否只读；保留浏览能力但禁止修改。',
  required: '是否标记为表单必填项。',
  scrollHideDelay: '停止滚动后隐藏滚动条的延迟时间，单位毫秒。',
  separator: '是否将该项目渲染为菜单分隔线。',
  shape: '设置控件的外轮廓形状。',
  showEdges: '是否显示首页与末页导航按钮。',
  showProgress: '是否显示随持续时间递减的进度指示。',
  showValue: '是否显示格式化后的当前数值。',
  shortcut: '菜单命令旁展示的键盘快捷键说明。',
  siblingCount: '当前页两侧保留显示的相邻页码数量。',
  side: '设置浮层相对触发器出现的方位。',
  size: '设置控件尺寸。',
  skipDelayDuration: '连续触发提示时跳过延迟的有效时间，单位毫秒。',
  src: '要加载的图片资源地址。',
  status: '设置业务状态及对应视觉反馈。',
  step: '每次操作改变的数值步长。',
  submitMode: '设置编辑内容提交的触发方式。',
  suggestions: '自动补全候选内容列表。',
  text: '控件显示的主要文字内容。',
  title: '控件或浮层显示的标题。',
  tone: '设置语义色调。',
  total: '数据总条数。',
  type: '设置组件的选择模式或原生类型。',
  menus: '菜单栏中显示的菜单分组与命令列表。',
  hoverable: '是否在指针悬停时预览将要提交的评分。',
  value: '表单提交或选择操作使用的值。',
  variant: '设置控件的视觉变体。',
  weekStartsOn: '一周起始日，0 表示星期日。',
  xChannel: '二维颜色区域横轴控制的颜色通道。',
  yChannel: '二维颜色区域纵轴控制的颜色通道。',
  zIndex: '覆盖默认浮层层级；不传时由 Dragon Liquid 层级系统计算。',
}

const structureDescriptions = {
  DlAccordionItem: 'Accordion 的单个折叠面板配置。',
  DlChoiceOption: '列表、组合框或切换组使用的通用选择项。',
  DlMenuGroup: 'Menubar 的一级菜单分组，内部通过 items 提供命令。',
  DlMenuItem: '菜单、下拉菜单、上下文菜单与工具栏使用的命令项。',
  DlNavigationItem: 'Navigation Menu 使用的可递归导航节点。',
  DlRadioOption: 'Radio Group 中一个互斥选项的配置。',
  DlSelectOption: 'Select 下拉列表中的一个可选项目。',
  DlSplitterPanel: 'Splitter 中一个可调整面板的尺寸与折叠约束。',
  DlStepItem: 'Stepper 中一个流程步骤的标题与状态。',
  DlTabItem: 'Tabs 中一个标签及对应内容入口的配置。',
  DlTreeNode: 'Tree 使用的可递归树节点。',
}

const enumDescriptions = {
  DlSize: '组件可用的标准尺寸。',
  DlTone: 'Dragon Liquid 组件共享的语义色调。',
  DlProgressStatus: 'Progress 用于表达任务结果的业务状态。',
}

const enumValueDescriptions = {
  DlSize: {
    sm: ['紧凑尺寸，适合密集界面和次要操作。', '紧凑'],
    md: ['默认尺寸，适合大多数常规界面。', '标准'],
    lg: ['放大尺寸，适合重点内容和宽松布局。', '宽松'],
  },
  DlTone: {
    default: ['默认中性色调，适合普通信息与基础状态。', '中性'],
    accent: ['强调色调，适合品牌重点、当前任务或推荐内容。', '强调'],
    success: ['成功色调，表示任务已经正确完成。', '成功'],
    warning: ['警告色调，提示可恢复且需要留意的问题。', '警告'],
    danger: ['危险色调，表示失败、破坏性操作或高风险状态。', '危险'],
    muted: ['弱化色调，适合低优先级、只读或后台信息。', '弱化'],
  },
  DlProgressStatus: {
    default: ['未指定额外业务状态，视觉由 tone 决定。', '常规'],
    success: ['任务已经完成，并覆盖为成功视觉。', '成功'],
    warning: ['任务仍可继续，但需要用户留意。', '警告'],
    error: ['任务执行失败；与 danger 使用相同的危险视觉。', '错误'],
    danger: ['任务失败或已经中断，并覆盖为危险视觉。', '危险'],
  },
}

function componentId(filename) {
  return filename
    .replace(/^Dl/, '')
    .replace(/\.vue$/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()
}

function matchingBrace(source, openingIndex) {
  let depth = 0
  let quote = ''
  let escaped = false

  for (let index = openingIndex; index < source.length; index += 1) {
    const character = source[index]
    if (quote) {
      if (escaped) escaped = false
      else if (character === '\\') escaped = true
      else if (character === quote) quote = ''
      continue
    }
    if (character === '"' || character === "'" || character === '`') {
      quote = character
      continue
    }
    if (character === '{') depth += 1
    if (character === '}') {
      depth -= 1
      if (depth === 0) return index
    }
  }
  throw new Error('无法解析 withDefaults 默认值对象。')
}

function defaultValues(source, propNames) {
  const marker = source.indexOf('withDefaults(defineProps<')
  if (marker === -1) return new Map()
  const propsEnd = source.indexOf('}>()', marker)
  const openingIndex = source.indexOf('{', propsEnd)
  if (propsEnd === -1 || openingIndex === -1) return new Map()
  const body = source.slice(openingIndex + 1, matchingBrace(source, openingIndex))
  const result = new Map()

  for (const name of propNames) {
    const match = body.match(new RegExp(`(?:^|[,\\n])\\s*${name}\\s*:\\s*([^,\\n}]+)`, 'm'))
    if (match) result.set(name, match[1].trim())
  }
  return result
}

function propsFromSource(source) {
  const propsMatch = source.match(/defineProps<\{([\s\S]*?)\}>\(\)/)
  if (!propsMatch) return []
  const declarations = propsMatch[1].replaceAll(';', '\n')
  const props = [...declarations.matchAll(/^\s*([A-Za-z]\w*)(\?)?:\s*([^\n]+?)\s*$/gm)].map(match => ({
    name: match[1],
    optional: Boolean(match[2]),
    type: match[3].trim(),
  }))
  const defaults = defaultValues(source, props.map(prop => prop.name))

  return props.map(prop => ({
    prop: prop.name,
    description: descriptions[prop.name] ?? `设置 ${prop.name} 属性。`,
    type: prop.type,
    defaultValue: defaults.get(prop.name) ?? (prop.optional ? 'undefined' : '—'),
  }))
}

function modelFromSource(source) {
  const modelMatch = source.match(/defineModel<([^>]+)>\(\)/)
  if (!modelMatch) return []
  return [{
    prop: 'modelValue',
    description: descriptions.modelValue,
    type: modelMatch[1].replace(/\s*\|\s*undefined\s*$/, '').trim(),
    defaultValue: 'undefined',
  }]
}

function structuresFromSource(source) {
  const result = {}
  const interfaces = source.matchAll(/export interface\s+(Dl[A-Za-z0-9]+)\s*\{([\s\S]*?)\n\}/g)

  for (const match of interfaces) {
    const name = match[1]
    const rows = match[2].split(/\r?\n/).map(line => line.trim()).filter(Boolean).map(line => {
      const field = line.match(/^([A-Za-z]\w*)(\?)?:\s*(.+)$/)
      if (!field) throw new Error(`无法解析 ${name} 的字段：${line}`)
      return {
        prop: field[1],
        description: descriptions[field[1]] ?? `设置 ${field[1]} 字段。`,
        type: field[3].trim(),
        defaultValue: field[2] ? '可选' : '必填',
      }
    })
    result[name] = {
      name,
      description: structureDescriptions[name] ?? `${name} 数据结构。`,
      rows,
    }
  }

  return result
}

function enumsFromSource(source) {
  const result = {}
  const aliases = source.matchAll(/(?:export\s+)?type\s+(Dl[A-Za-z0-9]+)\s*=\s*((?:'[^']+'\s*\|\s*)*'[^']+')/g)

  for (const match of aliases) {
    const name = match[1]
    const values = [...match[2].matchAll(/'([^']+)'/g)].map(value => value[1])
    result[name] = {
      kind: 'enum',
      name,
      title: name,
      description: enumDescriptions[name] ?? `${name} 可用的枚举值。`,
      rows: values.map(value => ({
        prop: value,
        description: enumValueDescriptions[name]?.[value]?.[0] ?? `${name} 的 ${value} 选项。`,
        type: `'${value}'`,
        defaultValue: enumValueDescriptions[name]?.[value]?.[1] ?? '枚举值',
      })),
    }
  }

  return result
}

function mentionedTypes(type, definitions) {
  return Object.keys(definitions).filter(name => new RegExp(`\\b${name}\\b`).test(type))
}

function relatedTypesForRows(rows, definitions) {
  const usageCandidates = new Map()
  const selected = []

  function visit(name, usageType) {
    if (!usageCandidates.has(name)) usageCandidates.set(name, [])
    usageCandidates.get(name).push(usageType)
    if (selected.includes(name)) return
    selected.push(name)
    const definition = definitions[name]
    if (definition.kind === 'structure') {
      for (const row of definition.rows) {
        for (const dependency of mentionedTypes(row.type, definitions)) {
          visit(dependency, row.type)
        }
      }
    }
  }

  for (const row of rows) {
    for (const name of mentionedTypes(row.type, definitions)) visit(name, row.type)
  }

  return selected.map(name => {
    const usages = usageCandidates.get(name) ?? []
    const definition = definitions[name]
    const title = definition.kind === 'structure' && usages.some(type => new RegExp(`\\b${name}\\[\\]`).test(type)) ? `${name}[]` : name
    return { ...definition, title }
  })
}

const filenames = (await readdir(componentsRoot))
  .filter(filename => /^Dl.+\.vue$/.test(filename))
  .sort((left, right) => left.localeCompare(right, 'en'))

const structures = {}
for (const filename of ['primitive.types.ts', 'select.types.ts']) {
  const parsed = structuresFromSource(await readFile(resolve(componentsRoot, filename), 'utf8'))
  Object.assign(structures, Object.fromEntries(Object.entries(parsed).map(([name, structure]) => [name, { ...structure, kind: 'structure' }])))
}
const sharedEnums = enumsFromSource(await readFile(resolve(componentsRoot, '../types.ts'), 'utf8'))

const api = {}
for (const filename of filenames) {
  const source = await readFile(resolve(componentsRoot, filename), 'utf8')
  const rows = [...modelFromSource(source), ...propsFromSource(source)]
  if (!rows.length) throw new Error(`${filename} 未提取到任何公开属性。`)
  const definitions = { ...structures, ...sharedEnums, ...enumsFromSource(source) }
  api[componentId(filename)] = {
    props: rows,
    relatedTypes: relatedTypesForRows(rows, definitions),
  }
}

if (!api.toolbar.relatedTypes.some(type => type.title === 'DlMenuItem[]')) {
  throw new Error('Toolbar 缺少 DlMenuItem[] 数据结构 API。')
}
for (const [id, definition] of Object.entries(api)) {
  if (definition.props.some(prop => /\\bDlTone\\b/.test(prop.type)) && !definition.relatedTypes.some(type => type.name === 'DlTone')) {
    throw new Error(`${id} 使用 DlTone，但缺少 DlTone 枚举 API。`)
  }
}

await mkdir(dirname(outputFile), { recursive: true })
await writeFile(
  outputFile,
  `// 此文件由 scripts/generate-component-api.mjs 根据组件源码生成，请勿手工编辑。\nexport default ${JSON.stringify(api, null, 2)} as const\n`,
  'utf8',
)
console.log(`已生成 ${Object.keys(api).length} 个组件的属性 API：${outputFile}`)
