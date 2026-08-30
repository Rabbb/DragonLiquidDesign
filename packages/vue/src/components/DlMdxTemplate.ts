import { computed, defineComponent, h, inject, watch, type Component, type PropType, type Slots, type VNodeChild } from 'vue'
import {
  evaluateDlMdxTemplateExpression,
  isDlMdxTemplateNativeElement,
  parseDlMdxTemplate,
  type DlMdxTemplateAttribute,
  type DlMdxTemplateFunction,
  type DlMdxTemplateNode,
  type DlMdxTemplateProgram,
  type DlMdxTemplateScope,
} from './dl-mdx.template'
import {
  dlMdxRegistryKey,
  resolveDlMdxEventSchema,
  type DlMdxComponentDefinition,
  type DlMdxRegistry,
} from './dl-mdx.registry'
import { safeDlMdxUrl } from './dl-mdx.parser'
import { useDlMdxSecurityPolicy } from './dl-mdx.security'

export interface DlMdxTemplateContext {
  readonly env?: Readonly<Record<string, unknown>>
  readonly navigation?: unknown
  readonly route?: unknown
  readonly project?: unknown
  readonly page?: unknown
  readonly data?: unknown
  readonly actions?: Readonly<Record<string, unknown>>
  readonly state?: Readonly<Record<string, unknown>>
  readonly [key: string]: unknown
}

const forbiddenProperties = new Set(['is', 'key', 'ref', 'innerHTML', 'textContent', 'srcdoc'])
const nativeProperties = new Set([
  'alt', 'aria-current', 'aria-label', 'class', 'disabled', 'height', 'href', 'id', 'loading', 'name', 'rel', 'role', 'src',
  'style', 'tabindex', 'target', 'title', 'type', 'value', 'width',
])

function componentPropNames(component?: Component): Set<string> {
  const declared = (component as { props?: string[] | Record<string, unknown> } | undefined)?.props
  return new Set(Array.isArray(declared) ? declared : Object.keys(declared ?? {}))
}

function attributeValue(attribute: DlMdxTemplateAttribute, scope: DlMdxTemplateScope) {
  return attribute.value.type === 'literal' ? attribute.value.value : evaluateDlMdxTemplateExpression(attribute.value.expression, scope)
}

function attributes(node: Extract<DlMdxTemplateNode, { type: 'element' }>, scope: DlMdxTemplateScope) {
  return Object.fromEntries(node.attributes.map(attribute => [attribute.name, attributeValue(attribute, scope)]))
}

function primitive(value: unknown): VNodeChild {
  if (value === null || value === undefined || value === false) return null
  if (Array.isArray(value)) return value.map(primitive)
  if (['string', 'number', 'bigint'].includes(typeof value)) return String(value)
  if (typeof value === 'boolean') return value ? 'true' : null
  return JSON.stringify(value)
}

function renderError(program: DlMdxTemplateProgram) {
  return h('section', { class: 'dl-mdx-template__error', role: 'alert' }, [
    h('strong', 'DL-MDX TEMPLATE ERROR'),
    ...program.diagnostics.map(item => h('p', { key: `${item.from}:${item.code}` }, [
      h('code', `${item.line}:${item.column}`),
      ` ${item.message}`,
    ])),
  ])
}

function safeNativeProps(name: string, input: Record<string, unknown>) {
  const output: Record<string, unknown> = {}
  for (const [property, value] of Object.entries(input)) {
    if (forbiddenProperties.has(property)) continue
    if (property.startsWith('data-') || property.startsWith('aria-') || nativeProperties.has(property)) output[property] = value
    else if (/^on[A-Z]/.test(property) && typeof value === 'function') output[property] = value
  }
  if (name === 'a' && typeof output.href === 'string') {
    output.href = safeDlMdxUrl(output.href, 'link', { allowExternal: true, openExternal: false, allowImages: true, allowDataImages: false }) ?? '#'
  }
  if (name === 'img' && typeof output.src === 'string') {
    output.src = safeDlMdxUrl(output.src, 'image', { allowExternal: true, openExternal: false, allowImages: true, allowDataImages: false })
  }
  return output
}

function safeComponentProps(definition: DlMdxComponentDefinition, input: Record<string, unknown>) {
  const allowed = definition.allowedProps?.length ? new Set(definition.allowedProps) : componentPropNames(definition.component)
  const events = resolveDlMdxEventSchema(definition)
  const output: Record<string, unknown> = {}
  for (const [property, value] of Object.entries(input)) {
    if (forbiddenProperties.has(property)) continue
    if (property === 'class' || property === 'style' || allowed.has(property)) output[property] = value
    else if (/^on[A-Z]/.test(property) && typeof value === 'function') {
      const event = property.slice(2).replace(/^[A-Z]/, character => character.toLowerCase()).replace(/[A-Z]/g, character => `-${character.toLowerCase()}`)
      if (events[event] || events[event.replaceAll('-', '')]) output[property] = value
    }
  }
  return { ...(definition.defaultProps ?? {}), ...output }
}

function hasWritableModelBinding(node: Extract<DlMdxTemplateNode, { type: 'element' }>) {
  const attribute = node.attributes.find(item => item.name === 'modelValue')
  if (!attribute || attribute.value.type !== 'expression') return false
  return attribute.value.expression.type === 'identifier' || attribute.value.expression.type === 'member'
}

function hasFixedModelBinding(node: Extract<DlMdxTemplateNode, { type: 'element' }>) {
  return node.attributes.some(item => item.name === 'modelValue') && !hasWritableModelBinding(node)
}

function lockFixedModelBinding(definition: DlMdxComponentDefinition, input: Record<string, unknown>, locked: boolean) {
  if (!locked || !Object.prototype.hasOwnProperty.call(input, 'modelValue')) return input
  const output = { ...input }
  const declared = componentPropNames(definition.component)
  if (declared.has('readonly')) output.readonly = true
  else if (declared.has('disabled')) output.disabled = true
  else output.inert = true
  output['aria-readonly'] = 'true'
  output['data-dl-binding'] = 'literal-readonly'
  return output
}

function namedChildren(node: Extract<DlMdxTemplateNode, { type: 'element' }>) {
  const named = new Map<string, DlMdxTemplateNode[]>()
  const defaults: DlMdxTemplateNode[] = []
  for (const child of node.children) {
    if (child.type === 'element' && child.name === 'Fill') {
      const name = child.attributes.find(attribute => attribute.name === 'name')
      if (name?.value.type === 'literal' && typeof name.value.value === 'string') named.set(name.value.value, child.children)
      continue
    }
    defaults.push(child)
  }
  return { named, defaults }
}

function templateRenderer(program: DlMdxTemplateProgram, registry: DlMdxRegistry | undefined, hostSlots: Slots, lockLiteralBindings: boolean) {
  const renderNodes = (nodes: DlMdxTemplateNode[], scope: DlMdxTemplateScope): VNodeChild[] => nodes.flatMap(node => {
    const rendered = renderNode(node, scope)
    return Array.isArray(rendered) ? rendered : [rendered]
  })

  const renderFunction = (component: DlMdxTemplateFunction, input: DlMdxTemplateScope, children: DlMdxTemplateNode[] = [], fills = new Map<string, DlMdxTemplateNode[]>()): VNodeChild => {
    const scope: DlMdxTemplateScope = { ...input, children, $fills: fills }
    for (const binding of component.bindings) scope[binding.name] = evaluateDlMdxTemplateExpression(binding.expression, scope)
    return renderNode(component.root, scope)
  }

  const renderNode = (node: DlMdxTemplateNode, scope: DlMdxTemplateScope): VNodeChild => {
    if (node.type === 'text') return node.value.trim() ? node.value : null
    if (node.type === 'expression') return primitive(evaluateDlMdxTemplateExpression(node.expression, scope))
    const props = attributes(node, scope)
    if (node.name === 'Fragment') return renderNodes(node.children, scope)
    if (node.name === 'If') {
      const condition = props.when ?? props.test
      const alternate = node.children.find(child => child.type === 'element' && child.name === 'Else')
      const consequent = node.children.filter(child => child !== alternate)
      return condition ? renderNodes(consequent, scope) : alternate?.type === 'element' ? renderNodes(alternate.children, scope) : null
    }
    if (node.name === 'Else' || node.name === 'Fill') return renderNodes(node.children, scope)
    if (node.name === 'For') {
      const values = Array.isArray(props.each) ? props.each : props.each && typeof props.each === 'object' ? Object.values(props.each as object) : []
      const itemName = typeof props.as === 'string' && /^[A-Za-z_$][\w$]*$/.test(props.as) ? props.as : 'item'
      const indexName = typeof props.index === 'string' && /^[A-Za-z_$][\w$]*$/.test(props.index) ? props.index : 'index'
      return values.flatMap((value, index) => renderNodes(node.children, { ...scope, [itemName]: value, [indexName]: index }))
    }
    if (node.name === 'Slot') {
      const slotName = typeof props.name === 'string' ? props.name : 'default'
      const fills = scope.$fills instanceof Map ? scope.$fills as Map<string, DlMdxTemplateNode[]> : undefined
      if (fills?.has(slotName)) return renderNodes(fills.get(slotName)!, scope)
      if (slotName === 'default' && Array.isArray(scope.children) && scope.children.length) return renderNodes(scope.children as DlMdxTemplateNode[], scope)
      return hostSlots[slotName]?.(scope) ?? renderNodes(node.children, scope)
    }
    const local = program.functions[node.name]
    const { named, defaults } = namedChildren(node)
    if (local) return renderFunction(local, { ...scope, ...props }, defaults, named)
    const slots: Record<string, () => VNodeChild> = {}
    if (defaults.length) slots.default = () => renderNodes(defaults, scope)
    for (const [name, children] of named) slots[name] = () => renderNodes(children, scope)
    if (isDlMdxTemplateNativeElement(node.name)) return h(node.name, safeNativeProps(node.name, props), renderNodes(defaults, scope))
    const definition = registry?.resolve(node.name)
    if (!definition) return null
    const componentProps = lockFixedModelBinding(definition, safeComponentProps(definition, props), lockLiteralBindings && hasFixedModelBinding(node))
    if (definition.render) return definition.render({ name: definition.name, props: componentProps as never, sourceLine: 1 })
    return definition.component ? h(definition.component, componentProps, slots) : null
  }

  return (scope: DlMdxTemplateScope) => {
    const entry = program.functions[program.entry]
    return entry ? renderFunction(entry, scope) : renderError(program)
  }
}

export default defineComponent({
  name: 'DlMdxTemplate',
  props: {
    source: { type: String, required: true },
    context: { type: Object as PropType<DlMdxTemplateContext>, default: () => ({}) },
    registry: { type: Object as PropType<DlMdxRegistry>, default: undefined },
    lockLiteralBindings: { type: Boolean, default: true },
    ariaLabel: { type: String, default: 'DL-MDX 函数模板' },
  },
  emits: {
    diagnostics: (_value: DlMdxTemplateProgram['diagnostics']) => true,
  },
  setup(props, { slots, emit }) {
    const injectedRegistry = inject(dlMdxRegistryKey, undefined)
    useDlMdxSecurityPolicy()
    const registry = computed(() => props.registry ?? injectedRegistry)
    const program = computed(() => parseDlMdxTemplate(props.source, registry.value))
    const renderer = computed(() => templateRenderer(program.value, registry.value, slots, props.lockLiteralBindings))
    watch(program, current => emit('diagnostics', current.diagnostics), { immediate: true })
    return () => {
      const current = program.value
      return h('div', { class: 'dl-mdx-template', 'data-dl': '', 'data-slot': 'mdx-template', 'data-literal-bindings': props.lockLiteralBindings ? 'readonly' : 'mutable', 'aria-label': props.ariaLabel }, [
        current.diagnostics.some(item => item.severity === 'error') ? renderError(current) : renderer.value({ $dlx: props.context }),
      ])
    }
  },
})
