import { camelize, defineComponent, h, reactive, toHandlerKey, watch, type Component, type PropType, type VNodeChild } from 'vue'
import type { DlMdxActionInvocation, DlMdxActionMap, DlMdxComponentDefinition } from './dl-mdx.registry'
import { resolveDlMdxEventSchema, toDlMdxRenderContext } from './dl-mdx.registry'
import type { DlMdxComponentContext, DlMdxValue } from './dl-mdx.types'

const forbiddenProps = new Set(['class', 'style', 'is', 'key', 'ref', 'innerHTML', 'textContent'])
const stateProps = ['modelValue', 'open', 'page', 'expanded'] as const

function componentPropNames(component?: Component): Set<string> {
  const declared = (component as { props?: string[] | Record<string, unknown> } | undefined)?.props
  return new Set(Array.isArray(declared) ? declared : Object.keys(declared ?? {}))
}

function safeProps(definition: DlMdxComponentDefinition, values: Record<string, DlMdxValue>): Record<string, unknown> {
  const allowed = definition.allowedProps?.length ? new Set(definition.allowedProps) : componentPropNames(definition.component)
  return Object.fromEntries(Object.entries(values).filter(([name]) =>
    allowed.has(name) && !forbiddenProps.has(name) && !/^on[A-Z-]/.test(name),
  ))
}

export default defineComponent({
  name: 'MdxRegisteredComponent',
  props: {
    definition: { type: Object as PropType<DlMdxComponentDefinition>, required: true },
    context: { type: Object as PropType<DlMdxComponentContext>, required: true },
    actions: { type: Object as PropType<DlMdxActionMap>, default: undefined },
    onAction: { type: Function as PropType<(invocation: DlMdxActionInvocation) => void>, default: undefined },
  },
  setup(props) {
    const localState = reactive<Record<string, DlMdxValue>>({})
    watch(() => [props.definition, props.context] as const, () => {
      for (const name of Object.keys(localState)) delete localState[name]
      const merged = { ...(props.definition.defaultProps ?? {}), ...props.context.props }
      for (const name of stateProps) {
        if (name in merged) localState[name] = merged[name]
      }
    }, { immediate: true })

    return () => {
      const renderContext = toDlMdxRenderContext(props.context, props.definition)
      if (props.definition.render) return props.definition.render(renderContext)
      if (!props.definition.component) return null

      const component = props.definition.component
      const declared = componentPropNames(component)
      const passed = safeProps(props.definition, renderContext.props)
      for (const name of stateProps) {
        if (!declared.has(name) || !(name in localState)) continue
        passed[name] = localState[name]
        passed[`onUpdate:${name}`] = (value: DlMdxValue) => { localState[name] = value }
      }
      const declaredEvents = resolveDlMdxEventSchema(props.definition)
      for (const [event, action] of Object.entries(props.context.events)) {
        if (!declaredEvents[event]) continue
        const handlerKey = toHandlerKey(camelize(event))
        const stateHandler = passed[handlerKey]
        passed[handlerKey] = (...payload: unknown[]) => {
          if (typeof stateHandler === 'function') stateHandler(...payload)
          const invocation: DlMdxActionInvocation = { action, event, payload, component: props.context }
          props.onAction?.(invocation)
          const configured = props.actions?.[action]
          const handler = typeof configured === 'function' ? configured : configured?.handler
          void handler?.(invocation)
        }
      }

      const slots: Record<string, () => VNodeChild> = {}
      if (renderContext.content) slots.default = () => renderContext.content
      if (props.definition.triggerLabel) {
        slots.trigger = () => h('button', { type: 'button', class: 'dl-mdx__registry-trigger' }, props.definition.triggerLabel)
      }
      return h(component, passed, slots)
    }
  },
})
