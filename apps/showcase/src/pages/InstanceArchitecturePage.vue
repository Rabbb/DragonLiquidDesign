<script setup lang="ts">
import { DlBadge, DlButton, DlCard } from '@dragon-liquid/vue'

const wrapperCode = `const managed = defineComponent({
  inheritAttrs: false,
  setup(_, { expose, slots }) {
    const attrs = useAttrs()
    const overrides = reactive<Record<string, unknown>>({})

    expose(control)

    return () => h(
      rawComponent,
      { ...mergeProps(attrs, overrides), ref: innerRef },
      slots,
    )
  },
})`

const propertyCode = `button.value?.setProperties({
  variant: 'primary',
  loading: true,
})

// 删除实例覆盖，重新跟随父组件 props
button.value?.resetProperty('variant')
button.value?.resetProperties()`

const scriptEnd = '</' + 'script>'
const eventCode = `<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import {
  DlButton,
  type DlComponentEventSubscription,
  type DlComponentRef,
  type DlPropertyChangeEvent,
} from '@dragon-liquid/vue'

const button = ref<DlComponentRef | null>(null)
const isSaving = ref(false)
const logs = ref<string[]>([])

let stopPropertyChange: DlComponentEventSubscription | undefined
let stopBeforeChange: DlComponentEventSubscription | undefined

function connect(instance: DlComponentRef) {
  // ready 可能因组件重新挂载再次触发，先取消上一轮订阅。
  disposeSubscriptions()

  // on() 返回一个“取消订阅函数”，保存后可以主动移除监听器。
  stopPropertyChange = instance.on(
    'propertyChange',
    (event: DlPropertyChangeEvent) => {
      logs.value.unshift(
        \`${'${event.name}'}: ${'${String(event.previousValue)}'} → ${'${String(event.value)}'}\`,
      )
    },
  )

  stopBeforeChange = instance.on(
    'beforePropertyChange',
    (event: DlPropertyChangeEvent) => {
      if (event.name === 'disabled' && isSaving.value) {
        event.preventDefault()
      }
    },
  )
}

function disposeSubscriptions() {
  // ?.() 是可选调用：仅当取消函数已经存在时才执行。
  stopPropertyChange?.()
  stopBeforeChange?.()
  stopPropertyChange = undefined
  stopBeforeChange = undefined
}

function simulateSaving() {
  isSaving.value = true
  button.value?.setProperties({ loading: true, variant: 'primary' })
}

function finishSaving() {
  isSaving.value = false
  button.value?.setProperty('loading', false)
}

onBeforeUnmount(disposeSubscriptions)
${scriptEnd}

<template>
  <DlButton variant="primary" ref="button" @ready="connect">受控按钮</DlButton>

  <button type="button" @click="simulateSaving">开始保存</button>
  <button type="button" @click="button?.disable()">尝试禁用</button>
  <button type="button" @click="finishSaving">结束保存</button>

  <pre>{{ logs.join('\\n') || '等待属性事件…' }}</pre>
</template>`

const completeCode = `<script setup lang="ts">
import { ref } from 'vue'
import {
  DlButton,
  type DlComponentRef,
  type DlPropertyChangeEvent,
} from '@dragon-liquid/vue'

const button = ref<DlComponentRef | null>(null)

function connect(instance: DlComponentRef) {
  instance.on('propertyChange', (event: DlPropertyChangeEvent) => {
    console.log(event.name, event.previousValue, event.value)
  })
}

function start() {
  button.value?.setProperties({
    variant: 'primary',
    loading: true,
  })
}
${scriptEnd}

<template>
  <DlButton variant="primary" ref="button" @ready="connect">保存资料</DlButton>
  <button type="button" @click="start">实例更新</button>
  <button type="button" @click="button?.resetProperties()">恢复 Props</button>
</template>`

const commonMethods = [
  ['属性', 'getProperty · setProperty · setProperties · resetProperty'],
  ['状态', 'getValue · setValue · clear · open · close · toggle'],
  ['可用性', 'enable · disable · show · hide'],
  ['DOM', 'focus · blur · click · select · scrollIntoView'],
  ['事件', 'on · once · off · offAll · dispatch'],
  ['反射', 'getPropertyNames · getMethodNames · getEventNames · invoke'],
]

const componentMethods = [
  ['Accordion', 'expand · collapse · expandAll · collapseAll'],
  ['Button', 'startLoading · stopLoading'],
  ['Editable', 'edit · submit · cancel'],
  ['NumberField', 'increment · decrement'],
  ['Pagination', 'first · previous · next · last · goTo'],
  ['Stepper / Tabs', 'previous · next · goTo · activate'],
  ['TagsInput / Tree', 'add · remove · expand · collapse · collapseAll'],
  ['Mdx', 'setMode · setSource'],
]

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <main class="instance-page">
    <section class="instance-hero">
      <div class="instance-hero__copy">
        <div class="instance-kicker">
          <DlBadge tone="accent" variant="outline">ARCHITECTURE</DlBadge>
          <DlBadge tone="success" variant="outline">65 MANAGED COMPONENTS</DlBadge>
        </div>
        <h1>组件实例与行为体系</h1>
        <p>在 Vue 声明式数据流上增加一层可撤销、可监听、类型化的命令式控制。普通页面继续使用 props 与 v-model，复杂工作台则可以像桌面控件一样操作组件实例。</p>
        <div class="instance-hero__actions">
          <a href="/instance-api" @click.prevent="scrollToSection('instance-complete')"><DlButton variant="primary">查看完整代码</DlButton></a>
          <a href="/components/button/instance-api"><DlButton variant="secondary">运行交互案例</DlButton></a>
        </div>
      </div>
      <div class="instance-hero__metrics" aria-label="实例体系概览">
        <article><b>65</b><span>正式导出组件</span><small>统一 DlComponentRef</small></article>
        <article><b>3</b><span>状态来源层级</span><small>覆盖值 → Props → 默认值</small></article>
        <article><b>2</b><span>并行调用风格</span><small>声明式 + 命令式</small></article>
      </div>
    </section>

    <div class="instance-layout">
      <aside class="instance-outline">
        <p>ON THIS PAGE</p>
        <nav aria-label="实例体系页面大纲">
          <a href="/instance-api" @click.prevent="scrollToSection('instance-overview')">设计目标</a>
          <a href="/instance-api" @click.prevent="scrollToSection('instance-wrapper')">受管包装层</a>
          <a href="/instance-api" @click.prevent="scrollToSection('instance-properties')">属性覆盖</a>
          <a href="/instance-api" @click.prevent="scrollToSection('instance-model')">v-model 同步</a>
          <a href="/instance-api" @click.prevent="scrollToSection('instance-events')">事件管线</a>
          <a href="/instance-api" @click.prevent="scrollToSection('instance-methods')">组件行为</a>
          <a href="/instance-api" @click.prevent="scrollToSection('instance-complete')">完整案例</a>
          <a href="/instance-api" @click.prevent="scrollToSection('instance-boundaries')">行为边界</a>
        </nav>
      </aside>

      <article class="instance-content">
        <section id="instance-overview" class="instance-section">
          <div class="section-heading"><span>01</span><div><small>DESIGN GOAL</small><h2>声明式为主，实例控制为增强</h2></div></div>
          <p class="section-lead">这套实现没有修改 Vue 的只读 props，也没有让组件内部状态脱离父组件管理。它在正式导出层包裹原组件，把运行时属性、事件和方法集中到一个受管实例中。</p>
          <div class="architecture-flow" aria-label="组件实例调用链">
            <div><small>DECLARATIVE INPUT</small><b>父组件 Props / v-model</b><span>常规业务数据流</span></div>
            <i>↓</i>
            <div class="active"><small>MANAGED CONTROL</small><b>受管组件包装层</b><span>属性 · 事件 · 方法 · 反射</span></div>
            <i>↓</i>
            <div><small>RENDER TARGET</small><b>原始 Dl 组件 / Reka UI</b><span>视觉与无障碍交互</span></div>
          </div>
        </section>

        <section id="instance-wrapper" class="instance-section">
          <div class="section-heading"><span>02</span><div><small>MANAGED WRAPPER</small><h2>原组件保持纯净，导出层统一增强</h2></div></div>
          <p>原始 SFC 继续只处理自己的 props、slots、emits 和样式。<code>createDlManagedComponent()</code> 创建外层组件，完整转发原 API，并通过 <code>expose(control)</code> 把实例控制器交给模板 ref。</p>
          <pre class="code-panel"><code>{{ wrapperCode }}</code></pre>
          <div class="principle-grid">
            <DlCard padding="md"><b>兼容</b><p>现有组件属性、插槽和事件名保持不变。</p></DlCard>
            <DlCard padding="md"><b>隔离</b><p>行为层不需要侵入重写 89 个公开组件。</p></DlCard>
            <DlCard padding="md"><b>扩展</b><p>新组件包装后自动继承通用实例能力。</p></DlCard>
          </div>
        </section>

        <section id="instance-properties" class="instance-section">
          <div class="section-heading"><span>03</span><div><small>PROPERTY LAYER</small><h2>响应式覆盖，而不是修改 Props</h2></div></div>
          <p>每个实例拥有独立的 <code>reactive overrides</code>。读取属性时按固定优先级解析，重置时只删除覆盖项，所以组件会自然恢复到父组件数据。</p>
          <div class="priority-line">
            <span><b>1</b>实例覆盖值</span><i>优先于</i><span><b>2</b>外部 Props</span><i>优先于</i><span><b>3</b>组件默认值</span>
          </div>
          <pre class="code-panel"><code>{{ propertyCode }}</code></pre>
        </section>

        <section id="instance-model" class="instance-section">
          <div class="section-heading"><span>04</span><div><small>CONTROLLED STATE</small><h2>实例修改仍然同步 update:* 事件</h2></div></div>
          <p>包装层读取原组件声明的 emits。设置 <code>modelValue</code>、<code>open</code>、<code>page</code> 等受控属性时，会同时更新实例覆盖并调用对应的父组件监听器。</p>
          <div class="event-pipeline model-pipeline">
            <span>setProperty('page', 3)</span><i>→</i><span>runtime override</span><i>→</i><span>update:page</span><i>→</i><span>父组件 page</span>
          </div>
          <div class="instance-note"><b>为什么覆盖不会立刻消失？</b><p>父组件更新后，实例覆盖仍然拥有最高优先级；只有显式调用 resetProperty() 才重新完全跟随父组件。这就是桌面控件式控制和普通 v-model 的边界。</p></div>
        </section>

        <section id="instance-events" class="instance-section">
          <div class="section-heading"><span>05</span><div><small>EVENT PIPELINE</small><h2>模板事件与实例订阅共享触发源</h2></div></div>
          <p>原组件 emits、配置的 DOM 事件和行为层事件都会进入实例事件总线。模板 <code>@click</code> 与实例 <code>on('click')</code> 可以同时存在，并且父组件监听器不会因包装而丢失。</p>
          <div class="event-phases">
            <div><small>BEFORE</small><b>beforePropertyChange</b><span>可通过 preventDefault() 取消</span></div>
            <i>→</i>
            <div><small>COMMIT</small><b>响应式属性更新</b><span>同步 update:* 与组件渲染</span></div>
            <i>→</i>
            <div><small>AFTER</small><b>propertyChange</b><span>同时派发 propertyNameChange</span></div>
          </div>
          <pre class="code-panel"><code>{{ eventCode }}</code></pre>
          <div class="instance-note">
            <b><code>stop?.()</code> 是什么意思？</b>
            <p><code>on()</code> 返回一个取消订阅函数，并赋给 <code>stop</code>。可选调用运算符 <code>?.()</code> 会在函数存在时执行它，在尚未订阅时则安全跳过。案例在重新连接和组件卸载时都会清理订阅，避免重复回调与闭包残留。</p>
          </div>
        </section>

        <section id="instance-methods" class="instance-section">
          <div class="section-heading"><span>06</span><div><small>CONTROL BEHAVIOR</small><h2>通用控制接口与组件专有动作</h2></div></div>
          <p>通用方法覆盖属性、状态、DOM、事件和反射；组件专有方法通过统一上下文读取属性、更新状态、访问根元素或调用原组件 expose。</p>
          <div class="method-columns">
            <div class="method-list"><h3>通用实例方法</h3><dl><template v-for="item in commonMethods" :key="item[0]"><dt>{{ item[0] }}</dt><dd>{{ item[1] }}</dd></template></dl></div>
            <div class="method-list"><h3>部分专有方法</h3><dl><template v-for="item in componentMethods" :key="item[0]"><dt>{{ item[0] }}</dt><dd>{{ item[1] }}</dd></template></dl></div>
          </div>
          <div class="event-pipeline"><span>beforeMethodCall</span><i>→</i><span>通用 / 专有 / inner expose</span><i>→</i><span>methodCall</span></div>
        </section>

        <section id="instance-complete" class="instance-section">
          <div class="section-heading"><span>07</span><div><small>COMPLETE VUE SFC</small><h2>完整使用案例</h2></div></div>
          <p>实例通过模板 ref 获取；<code>@ready</code> 保证控制器已经挂载，可以安全注册事件或调用 DOM 方法。</p>
          <pre class="code-panel code-panel--large"><code>{{ completeCode }}</code></pre>
          <a class="case-link" href="/components/button/instance-api"><DlButton variant="primary">打开可运行案例 →</DlButton></a>
        </section>

        <section id="instance-boundaries" class="instance-section boundary-section">
          <div class="section-heading"><span>08</span><div><small>BEHAVIOR BOUNDARIES</small><h2>明确的能力边界</h2></div></div>
          <div class="boundary-grid">
            <article><b>优先使用 Props</b><p>页面状态和可序列化业务数据仍应由父组件、store 或 v-model 管理。</p></article>
            <article><b>实例适合动作</b><p>聚焦、打开浮层、批量临时设置、工作台命令和外部控制器适合实例 API。</p></article>
            <article><b>挂载后访问 DOM</b><p>focus、select、click 等方法只在浏览器挂载后执行，SSR 阶段不会访问 DOM。</p></article>
            <article><b>覆盖需要显式释放</b><p>实例属性不会被后续同名 prop 自动抢占；调用 resetProperty 才恢复跟随。</p></article>
          </div>
        </section>
      </article>
    </div>
  </main>
</template>

<style scoped>
.instance-page { position: relative; z-index: 1; width: min(1320px, calc(100% - 48px)); margin: 0 auto; padding: 42px 0 90px; }
.instance-hero { display: grid; grid-template-columns: minmax(0, 1fr) minmax(340px, .62fr); gap: 44px; align-items: center; padding: clamp(34px, 5vw, 58px); overflow: hidden; position: relative; border: 1px solid var(--dl-border); border-radius: 30px; background: var(--dl-panel); box-shadow: var(--dl-shadow); backdrop-filter: blur(24px); }
.instance-hero::after { content: ''; position: absolute; inset: 0 12% auto; height: 2px; background: linear-gradient(90deg, transparent, var(--dl-accent), transparent); opacity: .6; }
.instance-kicker, .instance-hero__actions { display: flex; flex-wrap: wrap; gap: 10px; }
.instance-hero h1 { max-width: 760px; margin: 20px 0 18px; color: var(--dl-text); font-size: clamp(2.5rem, 5vw, 4.9rem); line-height: .96; letter-spacing: -.05em; }
.instance-hero__copy > p { max-width: 780px; margin: 0; color: var(--dl-text-muted); font-size: 1.05rem; line-height: 1.9; }
.instance-hero__actions { margin-top: 28px; }
.instance-hero__actions a, .case-link { text-decoration: none; }
.instance-hero__metrics { display: grid; gap: 12px; }
.instance-hero__metrics article { display: grid; grid-template-columns: 70px 1fr; gap: 2px 16px; align-items: center; padding: 18px 20px; border: 1px solid var(--dl-border); border-radius: 18px; background: var(--dl-surface); }
.instance-hero__metrics b { grid-row: span 2; color: var(--dl-accent-text); font-size: 2.2rem; line-height: 1; }
.instance-hero__metrics span { color: var(--dl-text); font-weight: 800; }
.instance-hero__metrics small { color: var(--dl-text-faint); }
.instance-layout { display: grid; grid-template-columns: 210px minmax(0, 1fr); gap: 32px; align-items: start; margin-top: 36px; }
.instance-outline { position: sticky; top: 96px; padding: 16px; border: 1px solid var(--dl-border); border-radius: 18px; background: var(--dl-surface); box-shadow: 0 10px 28px rgba(15,23,42,.06); backdrop-filter: blur(20px); }
.instance-outline p { margin: 0 0 10px; color: var(--dl-accent-text); font-size: .66rem; font-weight: 900; letter-spacing: .12em; }
.instance-outline nav { display: grid; }
.instance-outline a { padding: 9px 10px; border-radius: 10px; color: var(--dl-text-muted); font-size: .82rem; text-decoration: none; transition: .18s ease; }
.instance-outline a:hover { background: var(--dl-surface-hover); color: var(--dl-text); transform: translateX(2px); }
.instance-content { min-width: 0; display: grid; gap: 22px; }
.instance-section { scroll-margin-top: 100px; padding: clamp(24px, 4vw, 40px); border: 1px solid var(--dl-border); border-radius: 24px; background: var(--dl-surface); box-shadow: 0 8px 28px rgba(15,23,42,.045), inset 0 1px 0 rgba(255,255,255,.045); }
.section-heading { display: flex; align-items: center; gap: 15px; margin-bottom: 18px; }
.section-heading > span { display: grid; place-items: center; width: 42px; height: 42px; flex: none; border: 1px solid var(--dl-accent-border); border-radius: 14px; background: var(--dl-accent-surface); color: var(--dl-accent-text); font-size: .78rem; font-weight: 900; }
.section-heading small { color: var(--dl-accent-text); font-size: .66rem; font-weight: 900; letter-spacing: .11em; }
.section-heading h2 { margin: 4px 0 0; color: var(--dl-text); font-size: clamp(1.3rem, 2.5vw, 1.9rem); }
.instance-section > p, .section-lead { color: var(--dl-text-muted); line-height: 1.85; }
.instance-section code { color: var(--dl-accent-text); font-family: "Cascadia Code", Consolas, monospace; }
.architecture-flow { display: grid; grid-template-columns: 1fr auto 1.12fr auto 1fr; gap: 13px; align-items: center; margin-top: 28px; }
.architecture-flow div { display: grid; gap: 7px; min-height: 126px; align-content: center; padding: 19px; border: 1px solid var(--dl-border); border-radius: 17px; background: var(--dl-night-soft); }
.architecture-flow div.active { border-color: var(--dl-accent-border); background: var(--dl-accent-surface); }
.architecture-flow small { color: var(--dl-accent-text); font-size: .61rem; font-weight: 900; letter-spacing: .08em; }
.architecture-flow b { color: var(--dl-text); }
.architecture-flow span { color: var(--dl-text-faint); font-size: .76rem; }
.architecture-flow i, .event-phases > i, .event-pipeline > i { color: var(--dl-accent-text); font-style: normal; }
.code-panel { margin: 24px 0 0; padding: 20px; overflow-x: auto; border: 1px solid rgba(104,225,255,.11); border-radius: 18px; background: rgba(2, 12, 10, .68); box-shadow: inset 0 1px 0 rgba(255,255,255,.035); }
.code-panel code { display: block; color: #dcebe5; font-size: .79rem; line-height: 1.75; white-space: pre; }
.code-panel--large code { font-size: .76rem; }
.principle-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 16px; }
.principle-grid b { color: var(--dl-text); }
.principle-grid p { margin: 8px 0 0; color: var(--dl-text-faint); font-size: .8rem; line-height: 1.6; }
.priority-line, .event-pipeline { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 12px; margin-top: 23px; padding: 17px; border: 1px solid var(--dl-border); border-radius: 17px; background: var(--dl-night-soft); }
.priority-line span, .event-pipeline span { padding: 8px 11px; border-radius: 11px; color: var(--dl-text); background: var(--dl-surface); font-size: .8rem; }
.priority-line span b { margin-right: 7px; color: var(--dl-accent-text); }
.priority-line i { color: var(--dl-text-faint); font-size: .72rem; font-style: normal; }
.instance-note { margin-top: 16px; padding: 18px; border-left: 3px solid var(--dl-accent); border-radius: 4px 16px 16px 4px; background: var(--dl-accent-surface); }
.instance-note b { color: var(--dl-text); }
.instance-note p { margin: 8px 0 0; color: var(--dl-text-muted); font-size: .82rem; line-height: 1.7; }
.event-phases { display: grid; grid-template-columns: 1fr auto 1fr auto 1fr; gap: 12px; align-items: center; margin-top: 24px; }
.event-phases div { display: grid; gap: 6px; padding: 17px; border: 1px solid var(--dl-border); border-radius: 15px; background: var(--dl-night-soft); }
.event-phases small { color: var(--dl-accent-text); font-size: .6rem; font-weight: 900; letter-spacing: .1em; }
.event-phases b { color: var(--dl-text); font-size: .84rem; }
.event-phases span { color: var(--dl-text-faint); font-size: .7rem; line-height: 1.5; }
.method-columns { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 22px; }
.method-list { padding: 20px; border: 1px solid var(--dl-border); border-radius: 17px; background: var(--dl-night-soft); }
.method-list h3 { margin: 0 0 16px; color: var(--dl-text); font-size: .95rem; }
.method-list dl { display: grid; gap: 11px; margin: 0; }
.method-list dl > template { display: none; }
.method-list dt { color: var(--dl-accent-text); font-size: .74rem; font-weight: 800; }
.method-list dd { margin: -7px 0 0; color: var(--dl-text-faint); font: .7rem/1.6 "Cascadia Code", Consolas, monospace; }
.case-link { display: inline-flex; margin-top: 18px; }
.boundary-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.boundary-grid article { padding: 20px; border: 1px solid var(--dl-border); border-radius: 17px; background: var(--dl-night-soft); }
.boundary-grid b { color: var(--dl-text); }
.boundary-grid p { margin: 9px 0 0; color: var(--dl-text-faint); font-size: .8rem; line-height: 1.7; }
.boundary-section { background: var(--dl-panel); }
@media (max-width: 980px) {
  .instance-hero { grid-template-columns: 1fr; padding: 38px; }
  .instance-hero__metrics { grid-template-columns: repeat(3, 1fr); }
  .instance-hero__metrics article { grid-template-columns: 1fr; }
  .instance-hero__metrics b { grid-row: auto; }
  .instance-layout { grid-template-columns: 1fr; }
  .instance-outline { position: static; overflow-x: auto; }
  .instance-outline nav { display: flex; min-width: max-content; }
}
@media (max-width: 720px) {
  .instance-page { width: min(100% - 24px, 1440px); padding-top: 28px; }
  .instance-hero { padding: 27px 22px; border-radius: 25px; }
  .instance-hero__metrics, .principle-grid, .method-columns, .boundary-grid { grid-template-columns: 1fr; }
  .architecture-flow, .event-phases { grid-template-columns: 1fr; }
  .architecture-flow > i, .event-phases > i { text-align: center; transform: rotate(0deg); }
  .instance-section { padding: 22px 17px; border-radius: 20px; }
}
</style>
