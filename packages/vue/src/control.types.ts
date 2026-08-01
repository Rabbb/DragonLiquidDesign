import type { Component, ComponentPublicInstance, Ref } from 'vue'

export type DlPropertyKey<TProperties extends Record<string, unknown> = Record<string, unknown>> = Extract<keyof TProperties, string> | (string & {})

export type DlPropertyChangeOrigin = 'instance' | 'reset' | 'props'

export interface DlCancelableEvent {
  readonly cancelable: true
  defaultPrevented: boolean
  preventDefault: () => void
}

export interface DlPropertyChangeEvent<T = unknown> extends DlCancelableEvent {
  readonly component: DlComponentRef
  readonly componentName: string
  readonly name: string
  readonly previousValue: T
  readonly value: T
  readonly origin: DlPropertyChangeOrigin
}

export interface DlMethodCallEvent extends DlCancelableEvent {
  readonly component: DlComponentRef
  readonly componentName: string
  readonly name: string
  readonly args: readonly unknown[]
}

export interface DlMethodCalledEvent {
  readonly component: DlComponentRef
  readonly componentName: string
  readonly name: string
  readonly args: readonly unknown[]
  readonly result: unknown
}

export type DlComponentEventHandler = (...args: any[]) => void
export type DlComponentEventSubscription = () => void

export interface DlPropertyUpdateResult {
  changed: string[]
  rejected: string[]
}

export interface DlComponentRef<TProperties extends Record<string, unknown> = Record<string, unknown>> {
  readonly componentName: string
  readonly element: Element | null
  readonly mounted: boolean
  readonly inner: unknown

  getProperty<K extends DlPropertyKey<TProperties>>(name: K): K extends keyof TProperties ? TProperties[K] : unknown
  getProperties(): Readonly<TProperties & Record<string, unknown>>
  getPropertyNames(): string[]
  setProperty<K extends DlPropertyKey<TProperties>>(name: K, value: K extends keyof TProperties ? TProperties[K] : unknown): boolean
  setProperties(properties: Partial<TProperties> & Record<string, unknown>): DlPropertyUpdateResult
  resetProperty(name: DlPropertyKey<TProperties>): boolean
  resetProperties(names?: readonly DlPropertyKey<TProperties>[]): string[]

  getValue<T = unknown>(): T
  setValue(value: unknown): boolean
  clear(): boolean
  open(): boolean
  close(): boolean
  toggle(force?: boolean): boolean
  enable(): boolean
  disable(): boolean
  setEnabled(value: boolean): boolean
  show(): boolean
  hide(): boolean

  focus(options?: FocusOptions): Promise<boolean>
  blur(): boolean
  click(): Promise<boolean>
  select(): Promise<boolean>
  scrollIntoView(options?: ScrollIntoViewOptions): boolean
  invoke<TResult = unknown>(name: string, ...args: unknown[]): TResult

  on(event: string, handler: DlComponentEventHandler): DlComponentEventSubscription
  once(event: string, handler: DlComponentEventHandler): DlComponentEventSubscription
  off(event: string, handler?: DlComponentEventHandler): void
  offAll(): void
  dispatch(event: string, ...args: unknown[]): void
  getEventNames(): string[]
  getMethodNames(): string[]
}

export interface DlComponentMethodDefinition {
  name: string
  description: string
  signature: string
  returns: string
}

export interface DlComponentEventDefinition {
  name: string
  description: string
  payload: string
}

export interface DlComponentBehaviorMetadata {
  componentName: string
  valueProperty?: string
  openProperty?: string
  disabledProperty?: string
  methods: readonly DlComponentMethodDefinition[]
  events: readonly DlComponentEventDefinition[]
}

export interface DlComponentBehaviorContext {
  readonly control: DlComponentRef
  readonly element: Element | null
  readonly inner: unknown
  get(name: string): unknown
  set(name: string, value: unknown): boolean
}

export interface DlManagedComponentOptions {
  name: string
  valueProperty?: string
  openProperty?: string
  disabledProperty?: string
  domEvents?: readonly string[]
  methods?: Record<string, (context: DlComponentBehaviorContext, ...args: any[]) => unknown>
  methodDefinitions?: readonly DlComponentMethodDefinition[]
  eventDefinitions?: readonly DlComponentEventDefinition[]
}

export type DlManagedComponent<TComponent extends Component = Component> = TComponent & {
  new (): ComponentPublicInstance & DlComponentRef
}

export type DlComponentTemplateRef<TProperties extends Record<string, unknown> = Record<string, unknown>> = Ref<DlComponentRef<TProperties> | null>
