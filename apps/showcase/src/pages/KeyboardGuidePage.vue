<script setup lang="ts">
import { shallowRef } from 'vue'
import { CalendarDate, DlButton, DlDateField, DlSegmented, DlTimeField, Time } from '@dragon-liquid/vue'

const sampleDate = shallowRef(new CalendarDate(2026, 8, 28))
const sampleTime = shallowRef(new Time(9, 30))
const practiceMode = shallowRef('keyboard')
const practiceModes = [
  { value: 'keyboard', label: '键盘' },
  { value: 'mouse', label: '鼠标' },
  { value: 'touch', label: '触摸' },
]

const shortcuts = [
  { keys: ['Tab'], title: '前往下一个控件', note: '页面只让真正可操作的元素进入 Tab 顺序。' },
  { keys: ['Shift', 'Tab'], title: '返回上一个控件', note: '用于回退，不需要重新从页面顶部开始。' },
  { keys: ['Enter', 'Space'], title: '确认或执行', note: '按钮、卡片、选项和日期都遵循同一套确认方式。' },
  { keys: ['Esc'], title: '关闭或取消', note: '关闭菜单、选择器和蒙版，并把焦点送回入口。' },
  { keys: ['←', '→', '↑', '↓'], title: '在控件内部移动', note: '用于菜单、日期网格、选项组和组件切换器。' },
  { keys: ['Home', 'End'], title: '跳到首尾', note: '列表、日期、分段选择和滚轮都支持快速抵达边界。' },
]

function openComponentSwitcher() {
  window.dispatchEvent(new CustomEvent('dl:open-component-switcher'))
}
</script>

<template>
  <main class="keyboard-guide-page">
    <section class="keyboard-guide-hero">
      <div>
        <p>KEYBOARD FIRST · 键盘使用指南</p>
        <h1>少移动鼠标，<br><em>让操作保持连续</em></h1>
        <span>从页面移动、整段粘贴到跨组件切换，这套教程覆盖 Dragon Liquid 的统一键盘模型。</span>
        <div class="keyboard-hero-actions">
          <DlButton variant="primary" @click="openComponentSwitcher">打开组件切换器</DlButton>
          <span><kbd>Alt</kbd><b>+</b><kbd>K</kbd></span>
        </div>
      </div>
      <aside aria-label="组件切换器操作示意">
        <div class="switcher-mini-card muted">DateField</div>
        <div class="switcher-mini-card active">TimePicker</div>
        <div class="switcher-mini-card muted">Calendar</div>
        <small>按住 Alt · 方向键选择 · 松开 Alt 打开</small>
      </aside>
    </section>

    <section class="keyboard-guide-section">
      <header><span>01</span><div><small>FOUNDATION</small><h2>所有控件共用的基础动作</h2><p>先记住少量平台惯例，其余操作会自然延伸。</p></div></header>
      <div class="shortcut-grid">
        <article v-for="shortcut in shortcuts" :key="shortcut.title">
          <div><kbd v-for="key in shortcut.keys" :key="key">{{ key }}</kbd></div>
          <h3>{{ shortcut.title }}</h3>
          <p>{{ shortcut.note }}</p>
        </article>
      </div>
    </section>

    <section class="keyboard-guide-section switcher-tutorial">
      <header><span>02</span><div><small>ALT+TAB STYLE</small><h2>像切换窗口一样切换控件</h2><p>组件切换不再要求返回目录，也不打断当前浏览节奏。</p></div></header>
      <div class="tutorial-steps">
        <article><b>1</b><div><h3>按住 <kbd>Alt</kbd>，按 <kbd>K</kbd></h3><p>打开蒙版并预选当前控件的下一项；继续按 K 可连续向前。</p></div></article>
        <article><b>2</b><div><h3>使用四个方向键</h3><p>左右或上下均可调整选择，Home 与 End 可直接跳到组件目录首尾。</p></div></article>
        <article><b>3</b><div><h3>松开 <kbd>Alt</kbd> 即打开</h3><p>也可以按 Enter 确认，按 Esc 原路返回。点击顶栏入口时则始终使用 Enter 确认。</p></div></article>
      </div>
      <p class="platform-note"><b>为什么不是 Alt+Tab？</b> Alt+Tab 由操作系统保留，网页无法可靠截获；Alt+K 保留相同的“按住、选择、松开”节奏。</p>
    </section>

    <section class="keyboard-guide-section paste-tutorial">
      <header><span>03</span><div><small>PASTE WHOLE VALUE</small><h2>日期与时间可以整段粘贴</h2><p>不必逐段选择年月日，复制业务文案里的值后直接粘贴即可。</p></div></header>
      <div class="paste-playground">
        <article>
          <small>DATE FIELD</small>
          <DlDateField v-model="sampleDate" locale="zh-CN" aria-label="练习粘贴日期" />
          <p>试试粘贴 <code>2026/08/28</code>、<code>2026年8月28日</code> 或 <code>20260828</code></p>
        </article>
        <article>
          <small>TIME FIELD</small>
          <DlTimeField v-model="sampleTime" aria-label="练习粘贴时间" />
          <p>试试粘贴 <code>9:35</code>、<code>下午 3:25</code> 或 <code>9点35分</code></p>
        </article>
      </div>
    </section>

    <section class="keyboard-guide-section practice-tutorial">
      <header><span>04</span><div><small>ROVING FOCUS</small><h2>组选项只占一个 Tab 停靠点</h2><p>Tab 用来离开一组控件，方向键才负责在组内移动。</p></div></header>
      <div class="practice-card">
        <DlSegmented v-model="practiceMode" :items="practiceModes" aria-label="输入方式练习" />
        <p>当前选择：<b>{{ practiceModes.find(item => item.value === practiceMode)?.label }}</b></p>
        <small>Tab 聚焦后，按 ← → 切换；Home / End 可到首尾。</small>
      </div>
    </section>

    <section class="keyboard-guide-section quick-reference">
      <header><span>05</span><div><small>QUICK REFERENCE</small><h2>进阶操作速查</h2><p>这些动作解决右键、拖拽和长列表等纯键盘难点。</p></div></header>
      <dl>
        <div><dt><kbd>Alt</kbd> + <kbd>↓</kbd></dt><dd><b>打开选择器</b><span>日期、时间、月份和年份选择器</span></dd></div>
        <div><dt><kbd>Shift</kbd> + <kbd>F10</kbd></dt><dd><b>打开右键菜单</b><span>等同鼠标右键，也兼容键盘的 Menu 键</span></dd></div>
        <div><dt><kbd>Alt</kbd> + <kbd>方向键</kbd></dt><dd><b>移动日历事项</b><span>替代拖拽，按日或按周调整事项日期</span></dd></div>
        <div><dt><kbd>PageUp</kbd> / <kbd>PageDown</kbd></dt><dd><b>大步移动</b><span>长列表、时间滚轮和日历月份快速翻页</span></dd></div>
        <div><dt><kbd>Ctrl</kbd> + <kbd>K</kbd></dt><dd><b>全站搜索</b><span>知道名字时直接搜索；浏览相邻控件时使用 Alt+K</span></dd></div>
      </dl>
    </section>
  </main>
</template>

<style scoped>
.keyboard-guide-page { position: relative; z-index: 1; width: min(1180px, calc(100% - 40px)); margin: 0 auto; padding: 72px 0 100px; }
.keyboard-guide-hero { display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(360px, .85fr); align-items: center; gap: clamp(40px, 8vw, 100px); min-height: 460px; }
.keyboard-guide-hero > div { display: grid; justify-items: start; gap: 18px; }
.keyboard-guide-hero > div > p, .keyboard-guide-section header small { margin: 0; color: var(--dl-accent-text); font-size: .66rem; font-weight: 900; letter-spacing: .18em; }
.keyboard-guide-hero h1 { margin: 0; color: var(--dl-text); font-size: clamp(2.5rem, 6vw, 5rem); line-height: .98; letter-spacing: -.055em; }
.keyboard-guide-hero h1 em { color: var(--dl-accent-text); font-style: normal; }
.keyboard-guide-hero > div > span { max-width: 650px; color: var(--dl-text-muted); font-size: .96rem; line-height: 1.8; }
.keyboard-hero-actions { display: flex; align-items: center; gap: 15px; }
.keyboard-hero-actions > span { display: flex; align-items: center; gap: 6px; color: var(--dl-text-faint); }
kbd { display: inline-grid; min-width: 27px; min-height: 25px; place-items: center; padding: 3px 7px; border: 1px solid var(--dl-border-strong); border-bottom-width: 3px; border-radius: 7px; color: var(--dl-text); background: var(--dl-surface-strong); box-shadow: 0 2px 5px rgba(15,23,42,.08); font: 750 .64rem/1 "Cascadia Code", Consolas, monospace; }
.keyboard-guide-hero aside { position: relative; display: flex; align-items: center; justify-content: center; gap: 10px; min-width: 0; min-height: 270px; padding: 30px; overflow: hidden; border: 1px solid var(--dl-border); border-radius: 30px; background: color-mix(in srgb, var(--dl-night) 88%, transparent); box-shadow: 0 30px 80px rgba(15,23,42,.22); }
.switcher-mini-card { display: grid; place-items: end start; width: 126px; height: 130px; padding: 14px; border: 1px solid color-mix(in srgb, white 14%, transparent); border-radius: 17px; color: white; background: color-mix(in srgb, white 8%, transparent); font-size: .7rem; font-weight: 800; }
.switcher-mini-card.active { border-color: var(--dl-accent); background: color-mix(in srgb, var(--dl-accent) 24%, transparent); box-shadow: 0 12px 34px color-mix(in srgb, var(--dl-accent) 22%, transparent); transform: translateY(-8px); }
.switcher-mini-card.muted { opacity: .42; transform: scale(.9); }
.keyboard-guide-hero aside > small { position: absolute; right: 24px; bottom: 18px; left: 24px; color: color-mix(in srgb, white 58%, transparent); font-size: .6rem; text-align: center; }
.keyboard-guide-section { display: grid; gap: 26px; padding: 66px 0; border-top: 1px solid var(--dl-border); }
.keyboard-guide-section > header { display: grid; grid-template-columns: 42px minmax(0, 1fr); gap: 15px; align-items: start; }
.keyboard-guide-section > header > span { color: var(--dl-accent-text); font: 800 .7rem "Cascadia Code", Consolas, monospace; }
.keyboard-guide-section header div { display: grid; gap: 7px; }
.keyboard-guide-section h2 { margin: 0; color: var(--dl-text); font-size: clamp(1.4rem, 3vw, 2.15rem); letter-spacing: -.025em; }
.keyboard-guide-section header p { margin: 0; color: var(--dl-text-faint); font-size: .78rem; }
.shortcut-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
.shortcut-grid article { min-height: 158px; padding: 20px; border: 1px solid var(--dl-border); border-radius: 18px; background: var(--dl-surface); }
.shortcut-grid article > div { display: flex; gap: 5px; min-height: 33px; }
.shortcut-grid h3, .tutorial-steps h3 { margin: 13px 0 7px; color: var(--dl-text); font-size: .83rem; }
.shortcut-grid p, .tutorial-steps p, .paste-playground p { margin: 0; color: var(--dl-text-faint); font-size: .7rem; line-height: 1.65; }
.tutorial-steps { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 12px; }
.tutorial-steps article { display: grid; grid-template-columns: 34px minmax(0,1fr); gap: 12px; padding: 20px; border: 1px solid var(--dl-border); border-radius: 18px; background: var(--dl-surface); }
.tutorial-steps article > b { display: grid; place-items: center; width: 30px; height: 30px; border-radius: 10px; color: var(--dl-accent-text); background: var(--dl-accent-surface); }
.tutorial-steps h3 { margin-top: 3px; }
.platform-note { margin: 0; padding: 14px 17px; border-left: 3px solid var(--dl-accent); border-radius: 3px 12px 12px 3px; color: var(--dl-text-muted); background: var(--dl-accent-surface); font-size: .72rem; line-height: 1.65; }
.paste-playground { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 14px; }
.paste-playground article { display: grid; justify-items: start; gap: 14px; padding: 22px; border: 1px solid var(--dl-border); border-radius: 18px; background: var(--dl-surface); }
.paste-playground article > small { color: var(--dl-accent-text); font-size: .58rem; font-weight: 900; letter-spacing: .14em; }
.paste-playground code { padding: 2px 5px; border-radius: 5px; color: var(--dl-accent-text); background: var(--dl-accent-surface); font-size: .65rem; }
.practice-card { display: grid; justify-items: start; gap: 13px; padding: 22px; border: 1px solid var(--dl-border); border-radius: 18px; background: var(--dl-surface); }
.practice-card p { margin: 0; color: var(--dl-text-muted); font-size: .75rem; }
.practice-card small { color: var(--dl-text-faint); font-size: .68rem; }
.quick-reference dl { display: grid; margin: 0; border: 1px solid var(--dl-border); border-radius: 18px; overflow: hidden; background: var(--dl-surface); }
.quick-reference dl > div { display: grid; grid-template-columns: minmax(210px,.4fr) 1fr; align-items: center; gap: 22px; padding: 17px 20px; border-top: 1px solid var(--dl-border); }
.quick-reference dl > div:first-child { border-top: 0; }
.quick-reference dt { display: flex; align-items: center; gap: 6px; }
.quick-reference dd { display: grid; grid-template-columns: 150px 1fr; gap: 14px; margin: 0; color: var(--dl-text-faint); font-size: .7rem; }
.quick-reference dd b { color: var(--dl-text); }
@media (max-width: 900px) { .keyboard-guide-hero { grid-template-columns: 1fr; padding-top: 30px; } .shortcut-grid, .tutorial-steps { grid-template-columns: repeat(2, minmax(0,1fr)); } }
@media (max-width: 620px) { .keyboard-guide-page { width: min(100% - 24px, 1180px); padding-top: 34px; } .keyboard-guide-hero aside { min-height: 220px; padding-inline: 12px; } .switcher-mini-card { width: 96px; height: 108px; } .shortcut-grid, .tutorial-steps, .paste-playground { grid-template-columns: 1fr; } .quick-reference dl > div, .quick-reference dd { grid-template-columns: 1fr; gap: 10px; } }
</style>
