<script setup lang="ts">
import { computed, ref } from 'vue'
import { DlMdx, dlMdxOfficialComponents, useDlMdxSecurityPolicy, type DlMdxComponentCategory } from '@dragon-liquid/vue'
import DocExampleShell from '../components/DocExampleShell.vue'
import { vueSfc } from './exampleCode'

const props = defineProps<{ scenario: string }>()
const installedSecurity = useDlMdxSecurityPolicy()
const securityStatus = installedSecurity?.status()

const writingSource = ref([
  '# 《葬送的芙莉莲》资料草稿',
  '',
  '> 勇者一行结束旅程以后，时间仍在向前。',
  '',
  '## 整理进度',
  '',
  '- [x] 基础资料',
  '- [ ] 补充角色关系',
  '- [ ] 校对剧集标题',
  '',
  '使用 **粗体** 标记关键信息，用 `inline code` 记录原始字段名。',
].join('\n'))

const archiveSource = [
  '# 星海档案 · 作品条目',
  '',
  '## 基本信息',
  '',
  '| 字段 | 内容 | 完整度 |',
  '| :--- | :--- | ---: |',
  '| 原名 | フリーレン | 100% |',
  '| 类型 | 奇幻 / 公路 / 治愈 | 90% |',
  '| 状态 | 连载中 | 100% |',
  '',
  '> **编辑注记** 这不是传统的冒险开端，而是一段发生在冒险结束后的旅程。',
  '',
  '### 发布检查',
  '',
  '1. 核对官方译名',
  '2. 检查封面授权',
  '3. 关联季度与制作公司',
  '',
  '```ts',
  'type ArchiveState = "draft" | "published"',
  'const state: ArchiveState = "draft"',
  '```',
].join('\n')

const componentSource = [
  '# 可扩展的发布说明',
  '',
  '正文仍然使用普通 Markdown。',
  '',
  '+++component:Callout',
  'id = "release-notice"',
  'tone = "accent"',
  'title = "先行预览"',
  '+++end',
  '',
  '组件块之后可以继续书写，不会中断文档流。',
].join('\n')

const unsafeSource = [
  '# 不受信任内容预览',
  '',
  '[相对站内链接](/anime/42) 可以继续使用。',
  '',
  '[外部链接](https://example.com) 会按当前策略阻止。',
  '',
  '[脚本链接](javascript:alert(1)) 永远不会成为可点击链接。',
  '',
  '![内嵌数据图片](data:text/html;base64,PHNjcmlwdD4=)',
  '',
  '<' + 'script>window.archiveCompromised = true<' + '/script>',
].join('\n')

const securitySource = [
  '# WASM 域名白名单',
  '',
  '[允许的文档链接](https://developer.mozilla.org/en-US/docs/WebAssembly)',
  '',
  '[未列入白名单的链接](https://example.com/private)',
  '',
  '[允许的 npm 包](https://registry.npmjs.org/@dragon-liquid/vue/-/vue-0.6.0-alpha.5.tgz)',
  '',
  '[未允许的可执行文件](/packages/setup.exe)',
  '',
  '![允许的图片域名](https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=960&q=70)',
].join('\n')

const officialScenarioCategories: Record<string, DlMdxComponentCategory> = {
  'official-foundation': 'foundation',
  'official-form': 'form',
  'official-color': 'color',
  'official-dates': 'dates',
  'official-general': 'general',
}
const officialLabels: Record<DlMdxComponentCategory, string> = {
  foundation: '基础组件', form: '表单组件', color: '色彩组件', dates: '日期时间组件', general: '通用组件',
}
const officialCategory = computed(() => officialScenarioCategories[props.scenario])
const officialSource = computed(() => {
  const category = officialCategory.value
  if (!category) return ''
  const definitions = dlMdxOfficialComponents.filter(item => item.category === category)
  return [
    `# 官方注册 · ${officialLabels[category]}`,
    '',
    `当前分组包含 ${definitions.length} 个经过白名单约束的注册定义。`,
    '',
    ...definitions.flatMap(item => [
      `## ${item.name} · ${(item.maturity ?? 'stable').toUpperCase()}`,
      '',
      `+++component:${item.name}`,
      '+++end',
      '',
    ]),
  ].join('\n')
})

function officialExampleCode(category: DlMdxComponentCategory) {
  return `// main.ts
import { createApp } from 'vue'
import { createDlMdxOfficialRegistry } from '@dragon-liquid/vue'
import App from './App.vue'

createApp(App)
  .use(createDlMdxOfficialRegistry())
  .mount('#app')

// App.vue
${vueSfc({
    imports: ['DlMdx', 'dlMdxOfficialComponents', 'type DlMdxComponentCategory'],
    script: `const category: DlMdxComponentCategory = '${category}'\nconst source = dlMdxOfficialComponents\n  .filter(item => item.category === category)\n  .map(item => \`## \${item.name}\\n\\n+++component:\${item.name}\\n+++end\`)\n  .join('\\n\\n')`,
    template: `  <DlMdx :model-value="source" mode="preview" readonly />`,
  })}`
}

const globalRegistryExample = `// main.ts
import { createApp, h } from 'vue'
import {
  createDlMdxOfficialRegistry,
  defineDlMdxComponent,
  DlCard,
} from '@dragon-liquid/vue'
import App from './App.vue'

const mdxRegistry = createDlMdxOfficialRegistry([
  defineDlMdxComponent({
    name: 'Callout',
    aliases: ['Notice'],
    render: ({ props }) => h(DlCard, { padding: 'lg' }, () =>
      String(props.title ?? '全局提示卡'),
    ),
  }),
])

createApp(App).use(mdxRegistry).mount('#app')

// App.vue
${vueSfc({
  imports: ['DlMdx'],
  script: `const document = [\n  '+++component:Callout',\n  'tone = "accent"',\n  'title = "先行预览"',\n  '+++end',\n].join('\\n')`,
  template: `  <DlMdx :model-value="document" mode="preview" />`,
})}`

const securityPolicyExample = `// main.ts
import { createApp } from 'vue'
import { createDlMdxSecurityPolicy } from '@dragon-liquid/vue'
import App from './App.vue'

const mdxSecurity = createDlMdxSecurityPolicy({
  domains: {
    links: ['developer.mozilla.org', 'reka-ui.com'],
    images: ['images.unsplash.com', '*.githubusercontent.com'],
    files: ['download.example.com'],
  },
  fileExtensions: ['pdf', 'json', 'zip', 'tgz'],
  allowedProtocols: ['https'],
  allowRelative: true,
  allowMailto: false,
  allowTel: false,
  allowDataImages: false,
  allowBlobImages: false,
})

createApp(App)
  .use(mdxSecurity)
  .mount('#app')

// App.vue
${vueSfc({
  imports: ['DlMdx'],
  script: `const document = [
  '[文档](https://developer.mozilla.org/en-US/docs/WebAssembly)',
  '![封面](https://images.unsplash.com/photo-1578632767115-351597cf2477)',
  '[资料包](https://download.example.com/archive.zip)',
].join('\\n\\n')`,
  template: `  <DlMdx :model-value="document" mode="preview" readonly />`,
})}`

const content = computed(() => {
  const category = officialCategory.value
  if (category) return {
    title: `官方注册 · ${officialLabels[category]}`,
    description: `该页面直接使用 main.ts 安装的官方注册表，按需展示 ${officialLabels[category]}，其中 Alpha 定义与稳定版遵循同一安全边界。`,
    code: officialExampleCode(category),
    tips: ['createDlMdxOfficialRegistry() 包含组件库当前全部 64 个公开组件。', '组件按场景分组展示，避免一次渲染全部定义造成页面卡顿。'],
  }
  return ({
  basic: {
    title: '沉浸式双栏写作',
    description: '迁移 TodoMoe 的编辑工作流，并用 CodeMirror 6 补回行号、语法高亮、折叠、括号匹配、撤销历史与键盘快捷键。',
    code: vueSfc({
      imports: ['DlMdx'],
      script: `import { ref } from 'vue'\n\nconst source = ref([\n  '# 作品资料草稿',\n  '',\n  '> 在左侧编辑，右侧会安全地实时预览。',\n  '',\n  '- [ ] 补充角色关系',\n].join('\\n'))`,
      template: `  <DlMdx\n    v-model="source"\n    mode="split"\n    min-height="30rem"\n    aria-label="作品资料"\n  />`,
    }),
    tips: ['Ctrl/Cmd + B 与 Ctrl/Cmd + I 可直接操作当前选区。', '预览默认防抖 120ms；超长文档可适当提高 debounce。'],
  },
  'archive-document': {
    title: '发布后的内容档案',
    description: '只读预览支持标题锚点、引用、嵌套列表、任务、表格、围栏代码与安全链接，适合文章和作品资料。',
    code: vueSfc({
      imports: ['DlMdx'],
      script: `const document = [\n  '# 星海档案',\n  '',\n  '| 字段 | 状态 |',\n  '| :--- | ---: |',\n  '| 标题 | 完成 |',\n  '',\n  '- [x] 已发布',\n].join('\\n')`,
      template: `  <DlMdx\n    :model-value="document"\n    mode="preview"\n    readonly\n    :show-toolbar="false"\n  />`,
    }),
    tips: ['预览由 Vue 节点构成，不使用 v-html。', '代码复制依赖现代 Clipboard API；不可用时给出失败状态，不回退到已废弃的 execCommand。'],
  },
  'component-blocks': {
    title: 'main.ts 全局组件注册',
    description: '网站在入口文件安装官方注册表并追加 Callout 业务定义，因此每个 DlMdx 实例无需重复声明同名插槽。',
    code: globalRegistryExample,
    tips: ['解析优先级为局部 component-* 插槽、全局注册表、最后才是安全占位。', '业务 render 只应在 main.ts 等可信源码中声明，Markdown 文档本身不能注入函数。'],
  },
  'safe-preview': {
    title: '面向外部内容的安全预览',
    description: '链接策略在渲染前过滤脚本协议、外部地址和 Data URL；原始 HTML 始终作为普通文本显示。',
    code: vueSfc({
      imports: ['DlMdx', 'type DlMdxLinkPolicy'],
      script: `const policy: DlMdxLinkPolicy = {\n  allowExternal: false,\n  openExternal: true,\n  allowImages: true,\n  allowDataImages: false,\n}\n\nconst untrusted = '[站外链接](https://example.com)\\n\\n<' + 'script>alert(1)<' + '/script>'`,
      template: `  <DlMdx\n    :model-value="untrusted"\n    mode="preview"\n    readonly\n    :link-policy="policy"\n  />`,
    }),
    tips: ['javascript:、vbscript: 和非图片 Data URL 不会进入 DOM 链接属性。', '外部链接启用时自动附加 noopener noreferrer。'],
  },
  'security-policy': {
    title: 'main.ts · WASM 域名白名单',
    description: '网站入口统一安装 URL 安全策略，分别约束普通链接、图片与文件来源；文件还必须同时命中允许的扩展名。',
    code: securityPolicyExample,
    tips: ['白名单被规范化后封存在闭包中，策略对象被冻结；WASM 持有完整性指纹，校验异常时所有受控 URL 默认拒绝。', 'WASM 无法抵抗拥有页面控制权的人替换整个前端程序；生产环境仍应同步配置服务端校验与 CSP。'],
  },
  }[props.scenario] ?? {} as { title: string; description: string; code: string; tips: string[] })
})
</script>

<template>
  <DocExampleShell v-bind="content">
    <div class="mdx-doc-demo">
      <DlMdx v-if="scenario === 'basic'" v-model="writingSource" min-height="31rem" aria-label="作品资料草稿" />

      <DlMdx v-else-if="scenario === 'archive-document'" :model-value="archiveSource" mode="preview" readonly :show-toolbar="false" min-height="31rem" />

      <DlMdx v-else-if="scenario === 'component-blocks'" :model-value="componentSource" mode="preview" min-height="24rem" />

      <DlMdx v-else-if="officialCategory" :model-value="officialSource" mode="preview" readonly :show-toolbar="false" min-height="24rem" class="mdx-official-gallery" />

      <template v-else-if="scenario === 'security-policy'">
        <div class="mdx-security-status">
          <span><i /> WASM ACTIVE</span>
          <b>INTEGRITY {{ securityStatus?.integrity ? 'VERIFIED' : 'FAILED' }}</b>
          <code>{{ securityStatus?.fingerprint }}</code>
        </div>
        <DlMdx :model-value="securitySource" mode="preview" readonly min-height="24rem" />
      </template>

      <DlMdx
        v-else
        :model-value="unsafeSource"
        mode="preview"
        readonly
        :link-policy="{ allowExternal: false, allowImages: true, allowDataImages: false }"
        min-height="24rem"
      />
    </div>
  </DocExampleShell>
</template>

<style scoped>
.mdx-doc-demo { width: 100%; min-width: 0; }
.mdx-official-gallery :deep(.dl-mdx__component-block) { min-width: 0; padding: 14px; border: 1px solid rgba(255,255,255,.075); border-radius: 16px; background: rgba(255,255,255,.025); }
.mdx-security-status { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; padding: 12px 14px; border: 1px solid rgba(115,255,207,.2); border-radius: 14px; background: rgba(42,121,96,.12); color: #c9ffea; font-size: 12px; letter-spacing: .08em; }
.mdx-security-status span { display: inline-flex; align-items: center; gap: 7px; font-weight: 800; }
.mdx-security-status i { width: 7px; height: 7px; border-radius: 999px; background: #7dffd0; box-shadow: 0 0 12px rgba(125,255,208,.8); }
.mdx-security-status b { margin-left: auto; color: #91f6cf; }
.mdx-security-status code { color: rgba(225,255,244,.68); }
@media (max-width: 640px) { .mdx-security-status { align-items: flex-start; flex-direction: column; } .mdx-security-status b { margin-left: 0; } }
</style>
