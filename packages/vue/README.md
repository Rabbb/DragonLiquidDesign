# @dragon-liquid/vue

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
import { DlButton, DlCard, DlCheckbox, DlDialog, DlInput, DlTabs } from '@dragon-liquid/vue'
import '@dragon-liquid/vue/style.css'
```

```vue
<DlCard interactive>
  <DlInput v-model="keyword" placeholder="搜索收藏" />
  <DlButton>确认</DlButton>
</DlCard>
```

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

配置在创建时会被规范化、深度冻结并隐藏在闭包中，内嵌 WASM 模块在每次 URL 校验前核对白名单完整性指纹；异常时默认拒绝。WASM 不能阻止拥有页面控制权的人替换整个前端程序，因此生产环境仍需使用服务端 URL 校验和 CSP 作为真正的安全边界。

当前公共组件共 64 个：

- 42 个稳定组件覆盖基础、表单、内容、导航、菜单、浮层和反馈。
- 22 个先行组件覆盖 Autocomplete、Rating、Color、Dates、Drawer、Tree 与 Mdx；它们可正常导入，但保留 Alpha API 语义。
- `0.4.0-alpha.2` 从 TodoMoe 只读提取 Toast、Modal/Dialog、Tooltip 与近源 Popover 的玻璃面、语义色、能量线和反馈动效，并继续由 Reka UI 管理交互。
- `0.4.0-alpha.3` 继续迁移 Drawer 与线性 Progress 的样式，同时保留 Reka UI 的抽屉手势、焦点和进度语义。
- `0.4.0-alpha.4` 修复 Portal 浮层样式作用域与 Accordion 收起行为，并精简 Drawer 标题区。
- `0.4.0-alpha.5` 从 TodoMoe 的 Popconfirm 与 Tooltip 提取 Hover Card 玻璃面、方位能量边和反馈动效。
- `0.4.0-alpha.6` 修正 Popover 炫彩条随实际弹出方位定位，并补齐左右侧纵向渐变。
- `0.4.0-alpha.7` 调整 Input 字段外壳，允许业务 label 合法包裹控件，并扩展组件展厅常用案例。
- `0.4.0-alpha.8` 让 Tooltip Accent 继承 Button Primary 的明亮金色视觉，与 Warning 的深橙警示面明确区分。
- `0.4.0-alpha.9` 将 Tooltip Warning 优化为琥珀熔岩视觉，以金黄熔融核心和深褐岩层区别于红色 Danger。
- `0.4.0-alpha.10` 将 Tooltip Accent 从实体金色改为浅金玻璃、乳白高光与青绿折射的光魔法视觉。
- `0.4.0-alpha.11` 统一 Tooltip Accent 与 Warning 的深色玻璃基底，以克制的金白魔法微光和琥珀熔光表达语义。
- `0.5.0-alpha.4` 新增可由 `app.use` 安装的 MarkdownX 全局组件注册表、64 个官方组件定义和局部插槽覆盖机制；组件块属性支持受限结构化数据。
- `0.5.0-alpha.5` 修复官方组件分组切换时 MarkdownX 组件实例与交互状态被错误复用的问题。
- `0.5.0-alpha.6` 新增可在 `main.ts` 安装的 MarkdownX 域名、图片与文件白名单，并使用内嵌 WASM 完整性守卫保护冻结后的策略快照。
- `0.5.0-alpha.7` 拒绝反斜杠伪装的协议相对 URL，并验证创建策略后修改原始配置数组不会改变已生效白名单。
- `0.5.0-alpha.8` 参考 Ant Design 重写 Button 的默认层级、三档尺寸与完整交互状态；默认 `variant` 改为 `secondary`，既有属性名和值保持不变。
- `0.5.0-alpha.9` 将 Button 的 Loading 与 Disabled 视觉分离：Loading 保留当前 variant，仅降低透明度并阻止重复点击。
- `0.5.0-alpha.3` 收紧协议相对链接与图片策略，支持引用和有序列表内的任务回写，并修复编辑器异步加载前触发工具栏时的命令丢失。
- `0.5.0-alpha.2` 将 CodeMirror 改为编辑区挂载时异步加载，预览模式和其他组件不再承担编辑器运行时体积。
- `0.5.0-alpha.1` 从 TodoMoe 迁移并升级 `DlMdx`：提供 CodeMirror 6 编辑器、结构化安全预览、任务回写、资源策略与显式组件插槽，同时保留 `DlMarkdownX` 兼容别名。
- `0.4.0-alpha.12` 将 Tooltip 全部六种 tone 统一为分层深色玻璃，并升级 Default、Success、Danger 与 Muted 的语义光色。
- 日期对象 `CalendarDate`、`Time` 及相关类型从包入口统一导出。
