<script setup lang="ts">
import { computed } from 'vue'
import { DlButton, useDlTheme, type DlThemeDefinition, type DlThemeMode } from '@dragon-liquid/vue'

const theme = useDlTheme()
const builtinThemeNames = new Set(['white', 'black', 'warm', 'midnight', 'forest'])

const modes: Array<{ value: DlThemeMode; label: string; description: string }> = [
  { value: 'system', label: '跟随浏览器', description: '自动响应 prefers-color-scheme' },
  { value: 'light', label: '白天模式', description: '使用项目配置的白天主题' },
  { value: 'dark', label: '夜间模式', description: '使用项目配置的夜间主题' },
]

const lightThemes = computed(() => theme.themes.value.filter(item => item.colorScheme === 'light'))
const darkThemes = computed(() => theme.themes.value.filter(item => item.colorScheme === 'dark'))

const setupCode = `import { createApp } from 'vue'
import { createDlTheme } from '@dragon-liquid/vue'
import '@dragon-liquid/vue/style.css'

const dlTheme = createDlTheme({
  mode: 'system',
  lightTheme: 'white',
  darkTheme: 'black',
  storageKey: 'my-app-theme',
})

createApp(App).use(dlTheme).mount('#app')`

const customThemeCode = `const dlTheme = createDlTheme({
  themes: [{
    name: 'brand-blue',
    label: 'Brand Blue',
    colorScheme: 'light',
    base: 'white',
    tokens: {
      '--dl-accent': '#356b92',
      '--dl-accent-text': '#285778',
      '--dl-accent-surface': 'rgba(53, 107, 146, .1)',
      '--dl-accent-border': 'rgba(53, 107, 146, .28)',
    },
  }],
})

// 运行时固定主题；也可以 clearThemeOverride() 恢复模式映射
dlTheme.setTheme('brand-blue')`

function selectTheme(name: string) {
  theme.setTheme(name)
}

function selectMode(mode: DlThemeMode) {
  theme.setMode(mode)
}

function updateModeTheme(mode: 'light' | 'dark', event: Event) {
  const value = (event.target as HTMLSelectElement).value
  theme.setModeThemes({ [mode]: value })
}

function previewClass(item: DlThemeDefinition) {
  return `theme-preview--${item.name}`
}
</script>

<template>
  <main class="theme-page">
    <section class="theme-hero">
      <div>
        <p class="theme-eyebrow">THEME SYSTEM · 主题系统</p>
        <h1>让组件与文档界面<br><em>共享同一套视觉语言</em></h1>
        <p class="theme-lead">
          Dragon Liquid 支持内置主题、浏览器日夜模式映射和项目自定义主题。组件、属性表格、说明卡、导航与页面背景都会同步响应当前主题。
        </p>
      </div>
      <aside class="theme-status" aria-label="当前主题状态">
        <span>当前生效</span>
        <strong>{{ theme.activeThemeDefinition.value.label ?? theme.activeTheme.value }}</strong>
        <dl>
          <div><dt>运行模式</dt><dd>{{ theme.mode.value }}</dd></div>
          <div><dt>系统模式</dt><dd>{{ theme.systemMode.value }}</dd></div>
          <div><dt>配色类型</dt><dd>{{ theme.activeThemeDefinition.value.colorScheme }}</dd></div>
        </dl>
      </aside>
    </section>

    <section class="theme-section" aria-labelledby="preset-title">
      <header class="theme-section-heading">
        <div>
          <span>01 · PRESETS</span>
          <h2 id="preset-title">选择一套主题</h2>
          <p>点击即可实时预览。Dragon Forest 以幽林翡翠、龙焰金与少量极光蓝紫构成魔法层次。</p>
        </div>
        <DlButton v-if="theme.themeOverride.value" variant="secondary" size="sm" @click="theme.clearThemeOverride()">
          恢复模式映射
        </DlButton>
      </header>

      <div class="theme-preset-grid">
        <button
          v-for="item in theme.themes.value"
          :key="item.name"
          type="button"
          class="theme-preset"
          :class="{ active: theme.activeTheme.value === item.name }"
          :aria-pressed="theme.activeTheme.value === item.name"
          @click="selectTheme(item.name)"
        >
          <span class="theme-preview" :class="previewClass(item)" aria-hidden="true">
            <i /><i /><i />
          </span>
          <span class="theme-preset-copy">
            <b>{{ item.label ?? item.name }}</b>
            <small>{{ item.colorScheme === 'light' ? '浅色' : '深色' }} · {{ builtinThemeNames.has(item.name) ? '内置' : '项目自定义' }}</small>
          </span>
          <span class="theme-check" aria-hidden="true">{{ theme.activeTheme.value === item.name ? '✓' : '→' }}</span>
        </button>
      </div>
    </section>

    <section class="theme-section" aria-labelledby="mode-title">
      <header class="theme-section-heading">
        <div>
          <span>02 · COLOR MODE</span>
          <h2 id="mode-title">配置日夜模式</h2>
          <p>模式决定何时切换，主题映射决定白天和夜间各自使用哪套配色。</p>
        </div>
      </header>

      <div class="theme-mode-layout">
        <div class="theme-mode-list">
          <button
            v-for="item in modes"
            :key="item.value"
            type="button"
            :class="{ active: !theme.themeOverride.value && theme.mode.value === item.value }"
            @click="selectMode(item.value)"
          >
            <span><b>{{ item.label }}</b><small>{{ item.description }}</small></span>
            <i aria-hidden="true">{{ !theme.themeOverride.value && theme.mode.value === item.value ? '●' : '○' }}</i>
          </button>
        </div>

        <div class="theme-mapping-card">
          <label>
            <span><b>白天模式主题</b><small>lightTheme</small></span>
            <select :value="theme.lightTheme.value" @change="updateModeTheme('light', $event)">
              <option v-for="item in lightThemes" :key="item.name" :value="item.name">{{ item.label ?? item.name }}</option>
            </select>
          </label>
          <label>
            <span><b>夜间模式主题</b><small>darkTheme</small></span>
            <select :value="theme.darkTheme.value" @change="updateModeTheme('dark', $event)">
              <option v-for="item in darkThemes" :key="item.name" :value="item.name">{{ item.label ?? item.name }}</option>
            </select>
          </label>
          <p>切换映射后，选择“跟随浏览器 / 白天模式 / 夜间模式”即可查看对应效果。</p>
        </div>
      </div>
    </section>

    <section class="theme-code-grid" aria-label="主题接入代码">
      <article>
        <header><span>03 · PROJECT SETUP</span><h2>在 main.ts 中设置默认主题</h2></header>
        <pre><code>{{ setupCode }}</code></pre>
      </article>
      <article>
        <header><span>04 · CUSTOM THEME</span><h2>用设计令牌扩展自定义主题</h2></header>
        <pre><code>{{ customThemeCode }}</code></pre>
      </article>
    </section>

    <section class="theme-token-note">
      <span>统一适配原则</span>
      <div>
        <h2>站点自有样式也应消费主题令牌</h2>
        <p>页面容器、表格、代码之外的文本、边框和交互状态，应优先使用 <code>--dl-text</code>、<code>--dl-surface</code>、<code>--dl-border</code> 与 <code>--dl-accent-*</code>，不要再绑定某一套固定色值。</p>
      </div>
    </section>
  </main>
</template>

<style scoped>
.theme-page { width: min(1180px, calc(100% - 64px)); margin-inline: auto; padding: 76px 0 110px; }
.theme-hero { display: grid; grid-template-columns: minmax(0, 1.45fr) minmax(280px, .55fr); gap: 52px; align-items: end; padding-bottom: 66px; }
.theme-eyebrow, .theme-section-heading span, .theme-code-grid header span, .theme-token-note > span { margin: 0; color: var(--dl-accent-text); font-size: .66rem; font-weight: 900; letter-spacing: .17em; }
.theme-hero h1 { margin: 18px 0; color: var(--dl-text); font-size: clamp(2.8rem, 6vw, 5.6rem); line-height: .98; letter-spacing: -.065em; }
.theme-hero h1 em { color: var(--dl-accent-text); font-family: Georgia, "Songti SC", serif; font-weight: 500; }
.theme-lead { max-width: 760px; margin: 0; color: var(--dl-text-muted); font-size: .94rem; line-height: 1.85; }
.theme-status { padding: 22px; border: 1px solid var(--dl-border); border-radius: 20px; color: var(--dl-text); background: var(--dl-surface); box-shadow: var(--dl-shadow); }
.theme-status > span { color: var(--dl-text-faint); font-size: .63rem; font-weight: 800; letter-spacing: .1em; }
.theme-status > strong { display: block; margin: 8px 0 20px; color: var(--dl-accent-text); font-size: 1.5rem; }
.theme-status dl { display: grid; gap: 10px; margin: 0; }
.theme-status dl div { display: flex; justify-content: space-between; gap: 16px; padding-top: 10px; border-top: 1px solid var(--dl-border); }
.theme-status dt { color: var(--dl-text-faint); font-size: .68rem; }
.theme-status dd { margin: 0; color: var(--dl-text-muted); font: 700 .68rem "Cascadia Code", Consolas, monospace; }
.theme-section { padding: 44px 0; border-top: 1px solid var(--dl-border); }
.theme-section-heading { display: flex; align-items: end; justify-content: space-between; gap: 24px; margin-bottom: 26px; }
.theme-section-heading h2, .theme-code-grid h2, .theme-token-note h2 { margin: 8px 0 6px; color: var(--dl-text); font-size: 1.35rem; letter-spacing: -.025em; }
.theme-section-heading p, .theme-token-note p { margin: 0; color: var(--dl-text-muted); font-size: .78rem; line-height: 1.7; }
.theme-preset-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 13px; }
.theme-preset { display: grid; grid-template-columns: 76px minmax(0, 1fr) auto; align-items: center; gap: 15px; min-height: 104px; padding: 13px; border: 1px solid var(--dl-border); border-radius: 17px; color: var(--dl-text); background: var(--dl-surface); text-align: left; cursor: pointer; transition: .2s ease; }
.theme-preset:hover { border-color: var(--dl-border-strong); background: var(--dl-surface-hover); transform: translateY(-2px); }
.theme-preset.active { border-color: var(--dl-accent-border); background: var(--dl-accent-surface); box-shadow: var(--dl-focus); }
.theme-preview { position: relative; display: flex; align-items: end; gap: 5px; width: 76px; height: 70px; padding: 10px; overflow: hidden; border: 1px solid rgba(127, 127, 127, .2); border-radius: 12px; background: #fff; }
.theme-preview::before { content: ''; position: absolute; inset: 9px 9px auto; height: 6px; border-radius: 9px; background: rgba(31, 41, 55, .16); }
.theme-preview i { flex: 1; height: 18px; border-radius: 5px; background: #e5e7eb; }
.theme-preview i:nth-child(2) { height: 30px; background: #477f8d; }
.theme-preview i:nth-child(3) { height: 23px; }
.theme-preview--black { background: #141414; }
.theme-preview--black::before { background: rgba(255,255,255,.2); }
.theme-preview--black i { background: #303030; }
.theme-preview--black i:nth-child(2) { background: #1677ff; }
.theme-preview--warm { background: #f7f2e8; }
.theme-preview--warm i { background: #e5d9c8; }
.theme-preview--warm i:nth-child(2) { background: #8f5b12; }
.theme-preview--midnight { background: #08111e; }
.theme-preview--midnight::before { background: rgba(185,218,240,.22); }
.theme-preview--midnight i { background: #20344b; }
.theme-preview--midnight i:nth-child(2) { background: #7fb4d8; }
.theme-preview--forest { background: #06100b; }
.theme-preview--forest::before { background: rgba(226,255,239,.2); }
.theme-preview--forest i { background: #244f39; }
.theme-preview--forest i:nth-child(2) { background: linear-gradient(180deg, #f4d35e, #73d8a4); }
.theme-preview--docs-blue { background: #f6f7f9; }
.theme-preview--docs-blue i { background: #dbe4ea; }
.theme-preview--docs-blue i:nth-child(2) { background: #356b92; }
.theme-preset-copy { display: grid; gap: 6px; min-width: 0; }
.theme-preset-copy b { overflow: hidden; color: var(--dl-text); font-size: .82rem; text-overflow: ellipsis; white-space: nowrap; }
.theme-preset-copy small { color: var(--dl-text-faint); font-size: .63rem; }
.theme-check { color: var(--dl-accent-text); font-weight: 900; }
.theme-mode-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
.theme-mode-list, .theme-mapping-card { padding: 8px; border: 1px solid var(--dl-border); border-radius: 18px; background: var(--dl-surface); }
.theme-mode-list { display: grid; gap: 4px; }
.theme-mode-list button { display: flex; align-items: center; justify-content: space-between; gap: 18px; min-height: 66px; padding: 10px 14px; border: 1px solid transparent; border-radius: 13px; color: var(--dl-text); background: transparent; text-align: left; cursor: pointer; }
.theme-mode-list button:hover { background: var(--dl-surface-hover); }
.theme-mode-list button.active { border-color: var(--dl-accent-border); background: var(--dl-accent-surface); }
.theme-mode-list button span { display: grid; gap: 5px; }
.theme-mode-list button b { font-size: .78rem; }
.theme-mode-list button small { color: var(--dl-text-faint); font-size: .63rem; }
.theme-mode-list button i { color: var(--dl-accent-text); font-style: normal; }
.theme-mapping-card { display: grid; align-content: center; gap: 8px; padding: 18px; }
.theme-mapping-card label { display: flex; align-items: center; justify-content: space-between; gap: 20px; min-height: 62px; padding: 11px 0; border-bottom: 1px solid var(--dl-border); }
.theme-mapping-card label > span { display: grid; gap: 4px; }
.theme-mapping-card label b { color: var(--dl-text); font-size: .75rem; }
.theme-mapping-card label small { color: var(--dl-text-faint); font: .6rem "Cascadia Code", Consolas, monospace; }
.theme-mapping-card select { min-width: 150px; height: 38px; padding: 0 34px 0 12px; border: 1px solid var(--dl-border-strong); border-radius: 10px; color: var(--dl-text); background: var(--dl-surface-strong); outline: none; cursor: pointer; }
.theme-mapping-card select:focus-visible { border-color: var(--dl-border-focus); box-shadow: var(--dl-focus); }
.theme-mapping-card > p { margin: 9px 0 0; color: var(--dl-text-faint); font-size: .65rem; line-height: 1.6; }
.theme-code-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; padding: 44px 0; border-top: 1px solid var(--dl-border); }
.theme-code-grid article { min-width: 0; overflow: hidden; border: 1px solid var(--dl-border); border-radius: 19px; background: var(--dl-surface); box-shadow: 0 8px 24px color-mix(in srgb, var(--dl-night) 6%, transparent); }
.theme-code-grid header { padding: 19px 20px 15px; }
.theme-code-grid pre { min-height: 380px; margin: 0; padding: 20px; overflow: auto; border-top: 1px solid rgba(255,255,255,.08); color: #d8e5ef; background: #151b22; font: .7rem/1.8 "Cascadia Code", Consolas, monospace; tab-size: 2; }
.theme-token-note { display: grid; grid-template-columns: 180px 1fr; gap: 30px; padding: 30px; border: 1px solid var(--dl-accent-border); border-radius: 20px; background: linear-gradient(135deg, var(--dl-accent-surface), var(--dl-surface)); }
.theme-token-note code { padding: 2px 6px; border-radius: 6px; color: var(--dl-accent-text); background: var(--dl-surface); font: .7rem "Cascadia Code", Consolas, monospace; }
@media (max-width: 900px) { .theme-hero, .theme-code-grid { grid-template-columns: 1fr; } .theme-preset-grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 720px) { .theme-page { width: min(100% - 36px, 1180px); padding-top: 54px; } .theme-preset-grid, .theme-mode-layout { grid-template-columns: 1fr; } .theme-section-heading { align-items: flex-start; flex-direction: column; } .theme-token-note { grid-template-columns: 1fr; gap: 12px; padding: 22px; } }
@media (max-width: 440px) { .theme-preset { grid-template-columns: 64px minmax(0, 1fr) auto; } .theme-preview { width: 64px; } .theme-mapping-card label { align-items: flex-start; flex-direction: column; gap: 10px; } .theme-mapping-card select { width: 100%; } }
</style>
