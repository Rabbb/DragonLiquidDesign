# @dragon-liquid/vue

## API 调用测试

`DlApiTester` 支持 HTTP 方法、查询参数、请求头、独立 Bearer Token、JSON、文本、URL 编码表单和文件表单。点击“发送请求”才会调用接口，显示 HTTP 状态、耗时、响应头和正文；支持取消、超时及复制 Bash cURL。浏览器请求受目标接口 CORS 限制，不携带站点 Cookie，不跟随重定向，正文最多显示 1 MiB。

```md
+++component:ApiTester
title = "查询接口"
url = "https://api.example.com/items"
method = "GET"
query = "page=1"
+++end
```

Token 输入仅保留在控件内存中，复制 cURL 默认遮蔽认证请求头。宿主可安装 `createDlApiTesterPolicy({ enabled: () => false })` 禁止执行，文档属性不能覆盖该策略。受保护的 Markdown 图片可通过 `createDlMdxImageLoader((url, signal) => fetchImage(url, signal))` 加载，返回 Blob 或图片地址；Blob 地址在控件卸载时释放。

## 文档导航窗格

`DlNavigationPane` 自动读取正文标题并跟踪当前章节。桌面空间足够时显示右侧浮动目录；窄屏或分栏空间不足时显示右下角菜单按钮。没有标题时不显示，打印时隐藏。

在 DlMdx 正文中使用官方组件块，无需注册脚本：

```md
+++component:NavigationPane
title = "本页目录"
minLevel = 2
+++end

## 接口说明

正文内容。
```

也可在 Vue 页面使用 `<DlNavigationPane target-id="document-content" />`。`targetId` 指定包含标题的正文容器，省略时读取组件所在的 DlMdx 文档；嵌入正文时自动为浮动目录预留宽度。`items` 可指定条目，`minLevel` / `maxLevel` 限定标题层级，`breakpoint` 指定桌面断点，`topOffset` 为固定顶栏预留高度，`width` 设置目录宽度。同一正文重复放入导航组件时只显示一份。

## Portal 浮层层级

组件库使用 `data-dl-layer` 和主题变量统一管理 Portal 浮层，不依赖组件在业务 DOM 中的嵌套关系：

| 层级 | 默认值 | 用途 |
| --- | ---: | --- |
| `--dl-layer-modal` | 1000 | Dialog 遮罩和内容基准 |
| `--dl-layer-popover` | 1030 | Popover |
| `--dl-layer-select` | 1050 | Select、Dropdown |
| `--dl-layer-tooltip` | 1070 | Tooltip |
| `--dl-layer-message` | 2010 | Message |
| `--dl-layer-notification` | 2050 | Toast、全局通知 |

层级上下文参考 Ant Design：顶层 Dialog 使用 `1000`，容器上下文递增 `100`，Select 等消费型浮层再递增 `50`。因此顶层 Select 默认是 `1050`，Dialog 内通过 Portal 渲染的 Select 自动提升到 `1150`；嵌套 Dialog、Popover 和 Tooltip 也会继续递增。业务主题可以覆盖变量，浮层组件也可以用 `z-index` 属性覆盖。

Dragon Liquid Design 的 Vue 3 组件包，使用 Reka UI、Tailwind CSS 与 Tailwind Variants 构建。

```ts
import { DlButton, DlCard, DlCheckbox, DlDialog, DlInputSearch, DlTabs } from '@dragon-liquid/vue'
import '@dragon-liquid/vue/style.css'
```

```vue
<DlCard interactive>
  <DlInputSearch v-model="keyword" placeholder="搜索收藏" />
  <DlButton>确认</DlButton>
</DlCard>
```

## 多套主题与日夜模式

组件库内置 `white`、`black`、`warm`、`midnight` 和魔法森林 `forest` 五套主题。默认跟随浏览器日夜模式，白天使用 `white`，夜间使用 `black`；模式和实际配色相互独立，因此也可以让白天、夜间都使用同一主题。

```ts
import { createApp } from 'vue'
import { createDlTheme } from '@dragon-liquid/vue'
import App from './App.vue'

const theme = createDlTheme({
  mode: 'system',
  lightTheme: 'white',
  darkTheme: 'black', // 改成 white 即可让夜间仍使用白色主题
  storageKey: 'my-site-theme',
  themes: [
    {
      name: 'brand-blue',
      label: 'Brand Blue',
      colorScheme: 'light',
      base: 'white',
      tokens: {
        '--dl-accent': '#356b92',
        '--dl-accent-text': '#285778',
        '--dl-border-focus': 'rgba(53, 107, 146, 0.72)',
      },
    },
  ],
})

createApp(App).use(theme).mount('#app')
```

网站用户手动选择时，可在组件中调用 `useDlTheme()`：`setMode('system' | 'light' | 'dark')` 切换模式，`setTheme('white' | 'black' | 'forest' | 自定义名称)` 固定主题，`clearThemeOverride()` 恢复当前模式映射。`registerTheme()` 还可以在运行时注册用户主题；设置了 `storageKey` 后，用户选择会写入 `localStorage`。

## 组件实例、运行时属性与事件

包入口导出的 102 个目录组件都带有统一的 `DlComponentRef`。声明式 props 和 `v-model` 仍然是常规数据流；需要桌面应用式控制时，可通过模板 `ref` 建立响应式实例覆盖：

```vue
<script setup lang="ts">
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

function save() {
  button.value?.setProperties({ variant: 'primary', loading: true })
}
</script>

<template>
  <DlButton ref="button" @ready="connect">保存</DlButton>
</template>
```

所有组件统一提供以下行为：

- 属性：`getProperty`、`getProperties`、`setProperty`、`setProperties`、`resetProperty`、`resetProperties`。
- 状态：`getValue`、`setValue`、`clear`、`open`、`close`、`toggle`、`enable`、`disable`、`show`、`hide`。
- DOM：`focus`、`blur`、`click`、`select`、`scrollIntoView`。
- 事件：`on`、`once`、`off`、`offAll`、`dispatch`；也可继续使用模板 `@事件名`。
- 反射：`getPropertyNames`、`getMethodNames`、`getEventNames`、`invoke`。

`beforePropertyChange` 与 `beforeMethodCall` 支持 `preventDefault()`。实例设置 `modelValue`、`open`、`page` 等受控属性时，会同步调用对应的 `update:*` 监听器；`resetProperty()` 删除实例覆盖后，组件会重新跟随父组件 props。Accordion、NumberField、Pagination、Stepper、Tabs、TagsInput、Tree 与 Mdx 还提供面板、步进、导航和文档模式等专有方法。

如果业务组件也要获得同一能力，可以使用 `createDlManagedComponent(rawComponent, options)` 包装，并在 `options.methods` 中注册专有行为。

## MarkdownX 域名白名单

安全策略在应用入口一次安装，随后约束应用内全部 `DlMdx` 实例。域名支持精确匹配、`*.example.com` 子域通配、显式协议和端口；普通链接、图片与文件可分别配置。

```ts
import { createApp } from 'vue'
import { createDlMdxSecurityPolicy } from '@dragon-liquid/vue'
import App from './App.vue'

const mdxSecurity = createDlMdxSecurityPolicy({
  domains: {
    links: ['docs.example.com'],
    images: ['images.example.com', '*.cdn.example.com'],
    files: ['download.example.com'],
  },
  fileExtensions: ['pdf', 'zip', 'tar.gz'],
  allowedProtocols: ['https'],
  allowRelative: true,
})

createApp(App).use(mdxSecurity).mount('#app')
```

配置在创建时会被规范化、深度冻结并隐藏在闭包中，内嵌 Rust/WASM 核心在每次 URL 校验前核对白名单完整性指纹；异常时默认拒绝。WASM 不能阻止拥有页面控制权的人替换整个前端程序，因此生产环境仍需使用服务端 URL 校验和 CSP 作为真正的安全边界。

## MarkdownX Rust/WASM 核心

`parseDlMdx()` 保持同步 API：纯 Markdown、MarkdownX 组件块、`+++slot:default` / `+++endslot` 可编辑 MDX 插槽、文档统计、URL 协议识别与预览代码高亮由内嵌 Rust/WASM 核心处理；包含受支持 HTML 标签时，继续由浏览器 `DOMParser` 转换为受限 Vue 节点。WASM 二进制随 npm 包构建并内嵌，不产生运行时网络请求；不支持 WebAssembly 的环境会回退到 TypeScript 解析器，代码块降级为纯文本，安全白名单遵循默认拒绝原则。

围栏代码支持 JavaScript/TypeScript、Python、Rust、C/C++/C#/Java、Go、Shell、PowerShell、SQL、JSON、YAML、CSS 与 HTML/Vue 等常用语言。预览高亮只输出固定类型的文本 token；编辑态由 CodeMirror 按围栏语言加载解析器，并高亮完整代码域。

```ts
import { getDlMdxRustCoreStatus, parseDlMdx } from '@dragon-liquid/vue'

const status = getDlMdxRustCoreStatus()
const document = parseDlMdx('# Archive\n\n- [x] indexed')
```

## MarkdownX 文档工作区与语言服务

`DlMdx` 可以把 MDX 作为主结构文档，并通过 `v-model:script-value`、`v-model:style-value` 分别保存 TypeScript/JavaScript 与 CSS 附加文档。附加脚本只用于提取导出动作的类型提示，不会在预览中执行；真实动作必须由宿主通过 `actions` 注册。

组件源码块默认折叠为一行，可从折叠标记展开；传入 `:fold-components="false"` 可关闭自动折叠。渲染默认使用 `density="compact"`：收紧标题、正文、列表、表格、代码域及组件内部控件，同时保留 `density="comfortable"` 供长文阅读场景切换。紧凑模式中 H2～H6 只比正文逐级略大，不再制造大块标题留白。

```vue
<DlMdx
  v-model="document"
  v-model:script-value="script"
  v-model:style-value="style"
  :actions="{ saveDocument }"
  show-companion-documents
/>
```

语言服务提供组件、属性、事件、动作和枚举补全，悬浮类型说明、可修复诊断，以及由 `formatOptions` 控制的确定性格式化。按 `Ctrl+Space` 主动补全，按 `Shift+Alt+F` 格式化 MDX 主文档。

编辑态粘贴富文本时优先读取 `text/html`：标题、段落、显式换行、粗斜体、删除线、下划线、背景标记、上下标、链接、嵌套/任务列表、引用、代码块和表格都会转换为可维护的 MarkdownX。Word/WPS 的 `MsoHeading`、`mso-list` 与常见内联样式会先归一为语义结构；`rowspan` / `colspan` 会展开为规则表格，并保留列对齐。脚本、iframe、对象节点、危险 URL 和网页布局样式始终丢弃。

普通复制会同时写入精确 MarkdownX、`text/markdown`、纯文本和语义 HTML：粘贴回 `DlMdx` 时使用私有 MIME 保持组件源码无损，粘贴到邮件、Word 等富编辑器时使用 HTML。渲染态双击正文即可进入源码编辑，按 `Escape` 返回渲染，保留“预览优先、需要时看源码”的文档体验。

`attachmentAdapter` 除 `upload()` 外可选实现 `list()` 与 `remove()`。实现后工具栏自动出现“文档图片”，集中提供上传并插入、重新插入、替换、下载和二次确认移除；宿主仍负责鉴权、持久化和引用计数。若后端只在 MDX 保存成功后同步引用，请设置 `referenceMode: 'document-save'`：组件会乐观更新管理器，但不会提前调用 `remove()` 改变正式引用。

## MarkdownX 项目引擎

`DlMdx` 继续负责单文档编辑；`createDlMdxEngine()` 在它下面增加项目级虚拟文件系统、清单、原子事务、自动页面路由、跨文件诊断和存储协议。这样用户可以从一份文档平滑扩展为包含 `/pages`、脚本、样式、数据与资源的线上项目，而不必更换文档语言。

普通段落中的单个换行会按文本文档原样显示，无需在行尾额外输入两个空格。需要强调连续文本时，可使用内置 `Highlight` 组件：

```md
+++component:Highlight
variant = "gradient"
color = "#ffd76e"
colorEnd = "#68e1ff"
+++slot:default
第一行高亮文本
第二行仍然保留换行
+++endslot
+++end
```

`variant` 支持 `solid`、`gradient`、`rainbow`、`breathing`、`wavy` 和 `underline`。彩虹与呼吸灯可用 `colors = ["#ff5f6d", "#68e1ff", "#a78bfa"]` 自定义色序，呼吸周期可通过 `speed`（0.6–12 秒）调整。

```ts
import {
  createDlMdxEngine,
  createDlMdxHttpStorageAdapter,
} from '@dragon-liquid/vue'

const project = createDlMdxEngine({
  project: {
    manifest: { id: 'team-handbook', name: 'Team handbook' },
  },
  limits: { maxFileBytes: 2 * 1024 * 1024 },
})

project.transaction((draft) => {
  draft.writeFile('/pages/guide.mdx', '# Guide', { language: 'mdx' })
  draft.writeFile('/pages/guide.ts', 'export function publish() {}', { language: 'typescript' })
})

const build = project.build()
await project.save(createDlMdxHttpStorageAdapter({ baseUrl: '/api/mdx/projects' }))
```

默认限制为 1,000 个条目、单文件 2 MiB、项目 25 MiB、目录深度 32 层，所有超限写入都会随事务回滚。内置 Memory、LocalStorage 与 HTTP 三种存储适配器；宿主可以实现同一接口接入数据库、版本历史或对象存储。构建会解析页面并分析附属脚本的导出契约，但绝不执行脚本；发布服务仍需负责鉴权、配额、隔离编译、CSP 和可信动作装载。

完整的活网站源码结构、Vue 接入、HTTP 后端契约、可信 JavaScript 动作和控件接口读取方式见 [DL-MDX 活网站接入指南](../../docs/MDX_WEBSITE_HOSTING.md)。npm 包提供引擎与协议，不内置通用账号或数据库后端；后端必须由宿主结合自己的身份和租户模型实现。

`0.6.0-alpha.40` 将函数页面的唯一只读运行时入口统一为 `$dlx`，集中提供 `env`、`navigation`、`route`、`project`、`page`、`data`、`actions` 与 `state`，并禁止局部变量或函数参数覆盖该保留字。

`0.6.0-alpha.39` 新增安全的函数式 MDX 模板运行时：用户可在项目内编辑母版和函数化页面，通过 `If`、`For`、`Slot`、`Fill` 与局部函数组件控制结构；清单支持 `layout` 和 `dataFiles`，宿主只需注入导航、路由、环境、项目数据与可信动作。

`0.6.0-alpha.37` 允许数据库文本在 front matter 前带有空行，页面元数据仍会被识别并从公开正文中可靠剥离。

`0.6.0-alpha.36` 新增网站布局组件族：`DlSiteShell`、`DlSiteHeader`、`DlSiteNavigation`、`DlBreadcrumbs`、`DlPageFrame`、`DlContainer`、`DlStack`、`DlCluster` 与 `DlGrid`。DL-MDX 页面同时支持隐藏的强类型 front matter、目录 `_group.json`、自动导航组、宿主环境变量和编辑/发布一致的整站预览。

`0.6.0-alpha.35` 新增 userscript 引擎：`buildDlMdxUserscript()`、`parseDlMdxUserscript()`、`validateDlMdxUserscript()` 与 `dlMdxUserscriptMatchesUrl()` 可构建、导入、检查和匹配 Tampermonkey / Violentmonkey 脚本。所有操作都只处理源码，绝不在组件库上下文执行用户 JavaScript；跨站注入交给浏览器扩展，账号与共享目录仍由宿主后端提供。

当前目录组件共 104 个，应用焦点导航 `DlFocusNavigator` 另行导出：

- 68 个稳定或自研组件覆盖基础、表单、内容、导航、菜单、浮层和反馈；22 种原生 input type 均由独立的 `DlInputXxx` 控件固定封装，不公开 `type` 属性。
- 22 个先行组件覆盖 Autocomplete、Rating、Color、Dates、Drawer、Tree 与 Mdx；它们可正常导入，但保留 Alpha API 语义。
- `0.6.0-alpha.77` 为 AlertDialog 增加 `loading`、`confirmDisabled`、`closeOnConfirm` 和默认内容插槽。默认同步确认继续自动关闭；异步请求应使用 `closeOnConfirm=false`，由宿主在成功后关闭，并在失败时显示错误供重试。loading 期间阻止重复确认、取消与 Escape 关闭。
- `0.6.0-alpha.75` 为 TimePicker 的 TIME WHEEL 面板增加直接时间输入，并把鼠标滚轮事件量化为一次一格；指针拖动继续按真实位移滚动，不受滚轮节流影响。
- `0.6.0-alpha.34` 将 MarkdownX 提升为项目引擎：新增受限虚拟文件系统、原子事务、项目清单、自动路由、跨文件构建诊断，以及 Memory、LocalStorage、HTTP 存储适配器和可操作的线上项目工作台。
- `0.6.0-alpha.33` 新增 MarkdownX 类型提示、诊断、格式化、安全声明式事件，以及 MDX 主文档配合 Script/Style 附加文档的编辑工作区。
- `0.6.0-alpha.32` 为 MarkdownX 增加 Rust/WASM 预览语法高亮、CodeMirror 多语言解析和围栏代码域高亮；未知语言安全降级为原文。
- `0.6.0-alpha.31` 新增 Rust/WASM MarkdownX 核心，接管纯文档解析、统计、URL 协议识别和完整性哈希，移除手写 WAT，并保留 HTML 安全适配与无 WASM 回退路径。
- `0.6.0-alpha.29` 修正 MarkdownX 中 `ColorSlider` 的默认值绑定，并增加官方默认属性与实际组件 Props 一致性的自动回归检查。
- `0.6.0-alpha.28` 将 `DlColorArea` 收紧为纯二维色域，并新增确认提交型 `DlColorPicker` 弹出选择器，明确区分嵌入式专业积木与普通表单入口。
- `0.6.0-alpha.23` 新增 `DlFocusNavigator` 应用焦点切换器：可自动发现或显式配置顶部导航、侧栏、内容和浮层区域，在捕获阶段接管方向键，并通过 `Alt+J` 蒙版直接聚焦目标控件。
- `0.6.0-alpha.24` 新增 7 套编辑器工作台风格的网站主题，完整覆盖背景、面板、边框、焦点、按钮与语义色，并可由主题管理器直接切换。
- `0.6.0-alpha.22` 将键盘提升为全库一等交互：日期时间支持整段粘贴与格式归一化，选择器支持键盘打开，日历、滚轮、虚拟列表和分段控件补齐网格/列表导航，并为拖拽和右键菜单提供键盘替代路径。
- `0.6.0-alpha.21` 修复 TimePicker 抢占字段焦点、滚轮忽略时间范围和精确分钟被取整的问题，并让小时粒度使用对应的单列滚轮。
- `0.6.0-alpha.20` 保留 Field 与 Picker 两个清晰入口，让 Picker 复用 Field 的值、范围、状态和清除能力；TimeWheel 收进 TimePicker 作为内部选择面板，删除重复的 InputDate / InputTime / InputMonth 入口，并新增支持事项滚动、创建和拖动的业务月历。
- `0.6.0-alpha.19` 将 22 个 `DlInputXxx` 从原生外观薄封装升级为 DL 交互控件：文本规范化、搜索提交、密码反馈、数值步进、日期时间面板、拖放文件和自绘选择等逻辑由组件负责，原生字段退回表单兼容层。
- `0.6.0-alpha.18` 为 `DlChoicePortal` 增加逐字段检索高亮，并在隐藏关键词或值命中时展示匹配依据。
- `0.6.0-alpha.17` 将 22 种 HTML input type 拆成独立 `DlInputXxx` 控件，删除通用 `DlInput` 与公开 `type` 属性。
- `0.6.0-alpha.16` 为推荐控件补齐实例 API 元数据，并发布不可变的最终本地包。
- `0.6.0-alpha.15` 从 TodoMoe 推荐控件中迁移 `DlMultiChoice`、`DlSegmented` 与 `DlVirtualList`，补充分组多选、互斥分段和等高长列表窗口化渲染。
- `0.6.0-alpha.12` 将 TodoMoe 原版 Select 与 TimePicker 迁移为独立命名的 `DlChoicePortal`、`DlTimeWheel`，保留分组检索、自定义值、自适应抽屉、双滚轮、分钟步长与禁用时段。
- `0.6.0-alpha.11` 参考 TodoMoe 原版新增 `DlSplitButton`，统一主动作、SVG 菜单箭头、独立禁用状态与下拉菜单交互。
- `0.6.0-alpha.9` 统一 Date、Month 与 Year 选择器的分层快速导航，为范围选择增加独立双面板、动态高亮与规则化年月网格。
- `0.6.0-alpha.8` 补齐 Popover 与 Tooltip 的十二方位数字枚举、方位实验台、箭头和贴边间距控制，收敛 Popover 炫彩条，并统一日期浮层的紧凑表面；`alpha.6`、`alpha.7` 仅为已废弃的本地构建号，不再复用。
- `0.6.0-alpha.5` 修复 Accordion 关闭动画的作用域冲突，确保再次点击已展开标题时完成收起。
- `0.6.0-alpha.4` 保持 Button 默认 `secondary`，并为历史上依赖默认主按钮的用法显式补充 `variant="primary"`。
- `0.6.0-alpha.3` 修复 Dialog 的 `size` 宽度约束与运行时尺寸切换，并补充对应回归测试。
- `0.6.0-alpha.2` 补齐 Tooltip、HoverCard、Select、Combobox、Autocomplete 与日期选择器的受控打开事件，并增强按钮、编辑、分页、标签、树与反馈组件的专有方法。
- `0.6.0-alpha.1` 为 64 个正式导出组件增加统一实例控制器、运行时属性覆盖、可取消事件、反射 API 与组件专有行为。
- `0.5.0-alpha.9` 将 Button 的 Loading 与 Disabled 视觉分离：Loading 保留当前 variant，仅降低透明度并阻止重复点击。
- `0.5.0-alpha.8` 参考 Ant Design 重写 Button 的默认层级、三档尺寸与完整交互状态；默认 `variant` 改为 `secondary`，既有属性名和值保持不变。
- `0.5.0-alpha.7` 拒绝反斜杠伪装的协议相对 URL，并验证创建策略后修改原始配置数组不会改变已生效白名单。
- `0.5.0-alpha.6` 新增可在 `main.ts` 安装的 MarkdownX 域名、图片与文件白名单，并使用内嵌 WASM 完整性守卫保护冻结后的策略快照。
- `0.5.0-alpha.5` 修复官方组件分组切换时 MarkdownX 组件实例与交互状态被错误复用的问题。
- `0.5.0-alpha.4` 新增可由 `app.use` 安装的 MarkdownX 全局组件注册表、64 个官方组件定义和局部插槽覆盖机制；组件块属性支持受限结构化数据。
- `0.5.0-alpha.3` 收紧协议相对链接与图片策略，支持引用和有序列表内的任务回写，并修复编辑器异步加载前触发工具栏时的命令丢失。
- `0.5.0-alpha.2` 将 CodeMirror 改为编辑区挂载时异步加载，预览模式和其他组件不再承担编辑器运行时体积。
- `0.5.0-alpha.1` 从 TodoMoe 迁移并升级 `DlMdx`：提供 CodeMirror 6 编辑器、结构化安全预览、任务回写、资源策略与显式组件插槽，同时保留 `DlMarkdownX` 兼容别名。
- `0.4.0-alpha.12` 将 Tooltip 全部六种 tone 统一为分层深色玻璃，并升级 Default、Success、Danger 与 Muted 的语义光色。
- `0.4.0-alpha.11` 统一 Tooltip Accent 与 Warning 的深色玻璃基底，以克制的金白魔法微光和琥珀熔光表达语义。
- `0.4.0-alpha.10` 将 Tooltip Accent 从实体金色改为浅金玻璃、乳白高光与青绿折射的光魔法视觉。
- `0.4.0-alpha.9` 将 Tooltip Warning 优化为琥珀熔岩视觉，以金黄熔融核心和深褐岩层区别于红色 Danger。
- `0.4.0-alpha.8` 让 Tooltip Accent 继承 Button Primary 的明亮金色视觉，与 Warning 的深橙警示面明确区分。
- `0.4.0-alpha.7` 调整 Input 字段外壳，允许业务 label 合法包裹控件，并扩展组件展厅常用案例。
- `0.4.0-alpha.6` 修正 Popover 炫彩条随实际弹出方位定位，并补齐左右侧纵向渐变。
- `0.4.0-alpha.5` 从 TodoMoe 的 Popconfirm 与 Tooltip 提取 Hover Card 玻璃面、方位能量边和反馈动效。
- `0.4.0-alpha.4` 修复 Portal 浮层样式作用域与 Accordion 收起行为，并精简 Drawer 标题区。
- `0.4.0-alpha.3` 继续迁移 Drawer 与线性 Progress 的样式，同时保留 Reka UI 的抽屉手势、焦点和进度语义。
- `0.4.0-alpha.2` 从 TodoMoe 只读提取 Toast、Modal/Dialog、Tooltip 与近源 Popover 的玻璃面、语义色、能量线和反馈动效，并继续由 Reka UI 管理交互。
- 日期对象 `CalendarDate`、`Time` 及相关类型从包入口统一导出。

## 选项悬停与主题预览

`DlDropdownMenu` 和 `DlSelect` 支持 `v-model:hoverValue="hoverValue"`（模板也可写作 `v-model:hover-value`）及 `@hover`，参数为 `string | null`。它表示可操作选项的悬停/键盘焦点，与 `modelValue` 和 `select` 独立。离开选项、失焦、关闭、禁用/移除选项、窗口失焦、页面隐藏和组件卸载时归零，无须宿主拼接多个退出事件。触屏仍通过点击确认选择。

主题选择器可监听 `hoverValue` 调用 `theme.setPreviewTheme(value)`，点击时调用 `theme.setTheme(value)`。`setPreviewTheme(null)` 恢复当前正式偏好；预览不写 `localStorage`，不改变 `themeOverride` 或系统模式。`activeTheme` 表示屏幕正在显示的主题，`previewTheme` 单独暴露临时值。
