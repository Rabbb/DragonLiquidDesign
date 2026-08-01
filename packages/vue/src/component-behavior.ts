import {
  defineComponent,
  getCurrentInstance,
  h,
  mergeProps,
  nextTick,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  reactive,
  ref,
  toHandlerKey,
  useAttrs,
  type Component,
} from 'vue'
import type {
  DlCancelableEvent,
  DlComponentBehaviorContext,
  DlComponentBehaviorMetadata,
  DlComponentEventDefinition,
  DlComponentEventHandler,
  DlComponentMethodDefinition,
  DlComponentRef,
  DlManagedComponent,
  DlManagedComponentOptions,
  DlMethodCallEvent,
  DlPropertyChangeEvent,
  DlPropertyChangeOrigin,
  DlPropertyUpdateResult,
} from './control.types'

type RuntimeComponentOptions = {
  name?: string
  __name?: string
  props?: string[] | Record<string, unknown>
  emits?: string[] | Record<string, unknown>
}

const commonMethods: readonly DlComponentMethodDefinition[] = [
  { name: 'getProperty', description: '读取当前生效属性（实例覆盖优先，其次是外部 props 与默认值）。', signature: '(name: string)', returns: 'unknown' },
  { name: 'getProperties', description: '返回当前全部生效属性的只读快照。', signature: '()', returns: 'Readonly<Record<string, unknown>>' },
  { name: 'setProperty', description: '运行时覆盖一个属性，并同步对应的 update:* 事件。', signature: '(name: string, value: unknown)', returns: 'boolean' },
  { name: 'setProperties', description: '批量更新多个属性，返回已更新与被取消的属性名。', signature: '(properties: Record<string, unknown>)', returns: 'DlPropertyUpdateResult' },
  { name: 'resetProperty', description: '删除一个实例覆盖值，恢复跟随外部 prop。', signature: '(name: string)', returns: 'boolean' },
  { name: 'resetProperties', description: '删除指定或全部实例覆盖值。', signature: '(names?: string[])', returns: 'string[]' },
  { name: 'getValue', description: '读取组件的主值属性。', signature: '()', returns: 'unknown' },
  { name: 'setValue', description: '设置组件的主值属性。', signature: '(value: unknown)', returns: 'boolean' },
  { name: 'clear', description: '清空组件主值；数组型值会重置为空数组。', signature: '()', returns: 'boolean' },
  { name: 'open', description: '打开具有 open 属性的浮层或可折叠组件。', signature: '()', returns: 'boolean' },
  { name: 'close', description: '关闭具有 open 属性的浮层或可折叠组件。', signature: '()', returns: 'boolean' },
  { name: 'toggle', description: '切换打开状态，也可传入目标状态。', signature: '(force?: boolean)', returns: 'boolean' },
  { name: 'enable / disable', description: '切换具有 disabled 属性的组件可用状态。', signature: '()', returns: 'boolean' },
  { name: 'focus / blur / click / select', description: '调用组件内部最合适的原生交互元素。', signature: '(options?)', returns: 'Promise<boolean> | boolean' },
  { name: 'invoke', description: '按名称调用公开的通用、专有或内部 expose 方法。', signature: '(name: string, ...args: unknown[])', returns: 'unknown' },
  { name: 'on / once / off / offAll', description: '以实例方式订阅或取消组件事件。', signature: '(event: string, handler?: Function)', returns: '() => void | void' },
  { name: 'dispatch', description: '向实例订阅者和模板事件监听器派发自定义事件。', signature: '(event: string, ...args: unknown[])', returns: 'void' },
]

const commonEvents: readonly DlComponentEventDefinition[] = [
  { name: 'ready', description: '组件已挂载且可以调用实例方法。', payload: 'DlComponentRef' },
  { name: 'beforePropertyChange', description: '实例属性变更前触发；调用 preventDefault() 可取消。', payload: 'DlPropertyChangeEvent' },
  { name: 'propertyChange', description: '实例属性完成变更或外部 prop 改变后触发。', payload: 'DlPropertyChangeEvent' },
  { name: '<propertyName>Change', description: '指定属性的精细变更事件，例如 loadingChange。', payload: 'DlPropertyChangeEvent' },
  { name: 'beforeMethodCall', description: '实例方法执行前触发；调用 preventDefault() 可取消。', payload: 'DlMethodCallEvent' },
  { name: 'methodCall', description: '实例方法执行完成后触发。', payload: 'DlMethodCalledEvent' },
]

const behaviorCatalog = new Map<string, DlComponentBehaviorMetadata>()

function eventNames(options: RuntimeComponentOptions, configured: readonly string[] = []) {
  const declared = Array.isArray(options.emits) ? options.emits : Object.keys(options.emits ?? {})
  return [...new Set([...declared, ...configured])]
}

function propNames(options: RuntimeComponentOptions) {
  return Array.isArray(options.props) ? options.props : Object.keys(options.props ?? {})
}

function propDefault(options: RuntimeComponentOptions, name: string) {
  if (Array.isArray(options.props)) return undefined
  const declaration = options.props?.[name]
  if (!declaration || typeof declaration !== 'object' || Array.isArray(declaration)) return declaration === Boolean ? false : undefined
  const value = declaration as { default?: unknown; type?: unknown }
  if (!Object.prototype.hasOwnProperty.call(value, 'default')) return value.type === Boolean ? false : undefined
  return typeof value.default === 'function' && value.type !== Function ? (value.default as () => unknown)() : value.default
}

function callHandler(handler: unknown, args: readonly unknown[]) {
  if (Array.isArray(handler)) {
    handler.forEach(item => callHandler(item, args))
    return
  }
  if (typeof handler === 'function') handler(...args)
}

function createCancelable<T extends object>(event: T): T & DlCancelableEvent {
  const result = Object.assign(event, {
    cancelable: true as const,
    defaultPrevented: false,
    preventDefault() { result.defaultPrevented = true },
  })
  return result
}

function findElement(value: unknown, fallback: Element | null): Element | null {
  if (typeof Element !== 'undefined' && value instanceof Element) return value
  if (value && typeof value === 'object') {
    const candidate = (value as { $el?: unknown }).$el
    if (typeof Element !== 'undefined' && candidate instanceof Element) return candidate
  }
  return fallback
}

function targetElement(root: Element | null, selector: string): HTMLElement | null {
  if (!root) return null
  if (root instanceof HTMLElement && root.matches(selector)) return root
  return root.querySelector<HTMLElement>(selector)
}

function handlerKey(event: string) {
  return toHandlerKey(event)
}

export function getDlComponentBehavior(componentName: string): DlComponentBehaviorMetadata | undefined {
  const normalized = componentName.startsWith('Dl') ? componentName : `Dl${componentName.split(' ')[0]}`
  return behaviorCatalog.get(normalized)
}

export function getDlComponentBehaviors(): readonly DlComponentBehaviorMetadata[] {
  return [...behaviorCatalog.values()]
}

export function createDlManagedComponent<TComponent extends Component>(
  rawComponent: TComponent,
  config: DlManagedComponentOptions,
): DlManagedComponent<TComponent> {
  const rawOptions = rawComponent as RuntimeComponentOptions
  const properties = propNames(rawOptions)
  const configuredEvents = config.eventDefinitions?.map(event => event.name) ?? []
  const interceptedEvents = eventNames(rawOptions, [...(config.domEvents ?? []), ...configuredEvents])
  const valueProperty = config.valueProperty ?? (properties.includes('modelValue') ? 'modelValue' : undefined)
  const openProperty = config.openProperty ?? (properties.includes('open') ? 'open' : undefined)
  const disabledProperty = config.disabledProperty ?? (properties.includes('disabled') ? 'disabled' : undefined)
  const specificMethods = config.methodDefinitions ?? Object.keys(config.methods ?? {}).map(name => ({
    name,
    description: `${config.name} 的专有实例行为。`,
    signature: `(...args: unknown[])`,
    returns: 'unknown',
  }))
  const declaredEvents: DlComponentEventDefinition[] = eventNames(rawOptions).map(name => ({
    name,
    description: name.startsWith('update:') ? `对应 ${name.slice(7)} 属性的双向更新事件。` : `${config.name} 公开组件事件。`,
    payload: name.startsWith('update:') ? '新属性值' : '组件事件参数',
  }))
  const domEventDefinitions: DlComponentEventDefinition[] = (config.domEvents ?? []).map(name => ({
    name,
    description: `${config.name} 转发的原生 ${name} 交互事件。`,
    payload: name.startsWith('key') ? 'KeyboardEvent' : name === 'click' ? 'MouseEvent' : 'FocusEvent | Event',
  }))
  const metadataEvents = [...commonEvents, ...declaredEvents, ...domEventDefinitions, ...(config.eventDefinitions ?? [])]
    .filter((event, index, events) => events.findIndex(item => item.name === event.name) === index)

  behaviorCatalog.set(config.name, {
    componentName: config.name,
    valueProperty,
    openProperty,
    disabledProperty,
    methods: [...commonMethods, ...specificMethods],
    events: metadataEvents,
  })

  const managed = defineComponent({
    name: config.name,
    inheritAttrs: false,
    setup(_, { expose, slots }) {
      const attrs = useAttrs()
      const owner = getCurrentInstance()
      const innerRef = ref<unknown>()
      const overrides = reactive<Record<string, unknown>>({})
      const listeners = new Map<string, Set<DlComponentEventHandler>>()
      let mounted = false
      let externalSnapshot: Record<string, unknown> = {}

      const hasOverride = (name: string) => Object.prototype.hasOwnProperty.call(overrides, name)
      const externalValue = (name: string) => Object.prototype.hasOwnProperty.call(attrs, name) ? attrs[name] : propDefault(rawOptions, name)
      const get = (name: string) => hasOverride(name) ? overrides[name] : externalValue(name)
      const element = () => findElement(
        innerRef.value,
        typeof Element !== 'undefined' && owner?.subTree?.el instanceof Element ? owner.subTree.el : null,
      )

      function publish(event: string, ...args: unknown[]) {
        listeners.get(event)?.forEach(handler => handler(...args))
        listeners.get('*')?.forEach(handler => handler(event, ...args))
      }

      function publishPublic(event: string, ...args: unknown[]) {
        publish(event, ...args)
        callHandler(attrs[handlerKey(event)], args)
      }

      function propertyEvent(name: string, previousValue: unknown, value: unknown, origin: DlPropertyChangeOrigin) {
        return createCancelable({
          component: control,
          componentName: config.name,
          name,
          previousValue,
          value,
          origin,
        }) as DlPropertyChangeEvent
      }

      function notifyProperty(event: DlPropertyChangeEvent) {
        publishPublic('propertyChange', event)
        publishPublic(`${event.name}Change`, event)
      }

      function syncUpdateEvent(name: string, value: unknown) {
        const updateEvent = `update:${name}`
        if (!interceptedEvents.includes(updateEvent)) return
        publish(updateEvent, value)
        callHandler(attrs[handlerKey(updateEvent)], [value])
      }

      function set(name: string, value: unknown): boolean {
        if (!name || name === 'ref' || name === 'key' || name.startsWith('onVnode')) return false
        const previousValue = get(name)
        if (Object.is(previousValue, value) && hasOverride(name)) return false
        const event = propertyEvent(name, previousValue, value, 'instance')
        publishPublic('beforePropertyChange', event)
        if (event.defaultPrevented) return false
        overrides[name] = value
        syncUpdateEvent(name, value)
        notifyProperty(event)
        return true
      }

      function reset(name: string): boolean {
        if (!hasOverride(name)) return false
        const previousValue = overrides[name]
        const value = externalValue(name)
        const event = propertyEvent(name, previousValue, value, 'reset')
        publishPublic('beforePropertyChange', event)
        if (event.defaultPrevented) return false
        delete overrides[name]
        syncUpdateEvent(name, value)
        notifyProperty(event)
        return true
      }

      function allProperties() {
        return Object.freeze(Object.fromEntries(
          [...new Set([...properties, ...Object.keys(attrs).filter(name => !name.startsWith('on')), ...Object.keys(overrides)])]
            .map(name => [name, get(name)]),
        ))
      }

      const context: DlComponentBehaviorContext = {
        get control() { return control },
        get element() { return element() },
        get inner() { return innerRef.value },
        get,
        set,
      }

      function runMethod(name: string, args: unknown[], operation: () => unknown) {
        const before = createCancelable({ component: control, componentName: config.name, name, args }) as DlMethodCallEvent
        publishPublic('beforeMethodCall', before)
        if (before.defaultPrevented) return undefined
        const result = operation()
        if (result instanceof Promise) {
          return result.then(value => {
            publishPublic('methodCall', { component: control, componentName: config.name, name, args, result: value })
            return value
          })
        }
        publishPublic('methodCall', { component: control, componentName: config.name, name, args, result })
        return result
      }

      const focusTarget = () => targetElement(element(), 'input:not(:disabled), textarea:not(:disabled), select:not(:disabled), button:not(:disabled), [tabindex]:not([tabindex="-1"])')
      const clickableTarget = () => targetElement(element(), 'button:not(:disabled), [role="button"], input[type="button"], input[type="submit"]')

      const methods: Record<string, (...args: any[]) => unknown> = {
        async focus(options?: FocusOptions) {
          await nextTick()
          const target = focusTarget()
          target?.focus(options)
          return document.activeElement === target
        },
        blur() {
          const target = document.activeElement instanceof HTMLElement && element()?.contains(document.activeElement)
            ? document.activeElement
            : focusTarget()
          target?.blur()
          return Boolean(target)
        },
        async click() {
          await nextTick()
          const target = clickableTarget()
          target?.click()
          return Boolean(target)
        },
        async select() {
          await nextTick()
          const target = targetElement(element(), 'input, textarea') as HTMLInputElement | HTMLTextAreaElement | null
          target?.select()
          return Boolean(target)
        },
        scrollIntoView(options?: ScrollIntoViewOptions) {
          const target = element()
          target?.scrollIntoView(options)
          return Boolean(target)
        },
        setValue(value: unknown) { return valueProperty ? set(valueProperty, value) : false },
        clear() {
          if (!valueProperty) return false
          const current = get(valueProperty)
          return set(valueProperty, Array.isArray(current) ? [] : typeof current === 'number' ? 0 : '')
        },
        open() { return openProperty ? set(openProperty, true) : false },
        close() { return openProperty ? set(openProperty, false) : false },
        toggle(force?: boolean) {
          if (openProperty) return set(openProperty, force ?? !Boolean(get(openProperty)))
          if (valueProperty && typeof get(valueProperty) === 'boolean') return set(valueProperty, force ?? !Boolean(get(valueProperty)))
          return false
        },
        enable() { return disabledProperty ? set(disabledProperty, false) : false },
        disable() { return disabledProperty ? set(disabledProperty, true) : false },
        setEnabled(value: boolean) { return disabledProperty ? set(disabledProperty, !value) : false },
        show() { return openProperty ? set(openProperty, true) : set('hidden', false) },
        hide() { return openProperty ? set(openProperty, false) : set('hidden', true) },
        ...(config.methods ?? {}),
      }

      function invoke(name: string, ...args: unknown[]) {
        return runMethod(name, args, () => {
          const method = methods[name]
          if (method) return config.methods?.[name] ? method(context, ...args) : method(...args)
          const inner = innerRef.value as Record<string, unknown> | undefined
          const exposedMethod = inner?.[name]
          if (typeof exposedMethod === 'function') return exposedMethod.apply(inner, args)
          throw new Error(`${config.name} 不支持实例方法 ${name}()`)
        })
      }

      const control: DlComponentRef = {
        get componentName() { return config.name },
        get element() { return element() },
        get mounted() { return mounted },
        get inner() { return innerRef.value },
        getProperty: get as DlComponentRef['getProperty'],
        getProperties: allProperties,
        getPropertyNames: () => Object.keys(allProperties()),
        setProperty: set,
        setProperties(values): DlPropertyUpdateResult {
          const result: DlPropertyUpdateResult = { changed: [], rejected: [] }
          Object.entries(values).forEach(([name, value]) => (set(name, value) ? result.changed : result.rejected).push(name))
          return result
        },
        resetProperty: reset,
        resetProperties(names) {
          const targets = names?.map(String) ?? Object.keys(overrides)
          return targets.filter(reset)
        },
        getValue: (() => valueProperty ? get(valueProperty) : undefined) as DlComponentRef['getValue'],
        setValue: value => invoke('setValue', value) as boolean,
        clear: () => invoke('clear') as boolean,
        open: () => invoke('open') as boolean,
        close: () => invoke('close') as boolean,
        toggle: force => invoke('toggle', force) as boolean,
        enable: () => invoke('enable') as boolean,
        disable: () => invoke('disable') as boolean,
        setEnabled: value => invoke('setEnabled', value) as boolean,
        show: () => invoke('show') as boolean,
        hide: () => invoke('hide') as boolean,
        focus: options => invoke('focus', options) as Promise<boolean>,
        blur: () => invoke('blur') as boolean,
        click: () => invoke('click') as Promise<boolean>,
        select: () => invoke('select') as Promise<boolean>,
        scrollIntoView: options => invoke('scrollIntoView', options) as boolean,
        invoke: invoke as DlComponentRef['invoke'],
        on(event, handler) {
          const handlers = listeners.get(event) ?? new Set()
          handlers.add(handler)
          listeners.set(event, handlers)
          return () => control.off(event, handler)
        },
        once(event, handler) {
          const stop = control.on(event, (...args) => { stop(); handler(...args) })
          return stop
        },
        off(event, handler) {
          if (!handler) listeners.delete(event)
          else listeners.get(event)?.delete(handler)
        },
        offAll: () => listeners.clear(),
        dispatch: publishPublic,
        getEventNames: () => [...new Set(['ready', 'beforePropertyChange', 'propertyChange', 'beforeMethodCall', 'methodCall', ...interceptedEvents])],
        getMethodNames: () => [...new Set([...Object.keys(methods), 'getProperty', 'getProperties', 'setProperty', 'setProperties', 'resetProperty', 'resetProperties', 'invoke', 'on', 'once', 'off', 'offAll', 'dispatch'])],
      }

      expose(control)

      onMounted(() => {
        mounted = true
        externalSnapshot = Object.fromEntries(properties.map(name => [name, externalValue(name)]))
        nextTick(() => publishPublic('ready', control))
      })

      onUpdated(() => {
        properties.forEach(name => {
          const value = externalValue(name)
          const previousValue = externalSnapshot[name]
          if (!hasOverride(name) && !Object.is(value, previousValue)) notifyProperty(propertyEvent(name, previousValue, value, 'props'))
          externalSnapshot[name] = value
        })
      })

      onBeforeUnmount(() => {
        mounted = false
        listeners.clear()
      })

      return () => {
        const forwarded = mergeProps(attrs, overrides)
        interceptedEvents.forEach(event => {
          const key = handlerKey(event)
          const parentHandler = attrs[key]
          forwarded[key] = (...args: unknown[]) => {
            publish(event, ...args)
            callHandler(parentHandler, args)
          }
        })
        return h(rawComponent, { ...forwarded, ref: innerRef }, slots)
      }
    },
  })

  return managed as unknown as DlManagedComponent<TComponent>
}
