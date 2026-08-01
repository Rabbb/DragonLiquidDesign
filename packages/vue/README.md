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

当前公共组件共 63 个：

- 42 个稳定组件覆盖基础、表单、内容、导航、菜单、浮层和反馈。
- 21 个先行组件覆盖 Autocomplete、Rating、Color、Dates、Drawer 与 Tree；它们可正常导入，但在 `0.4.0-alpha.1` 中保留 Alpha API 语义。
- `0.4.0-alpha.2` 从 TodoMoe 只读提取 Toast、Modal/Dialog、Tooltip 与近源 Popover 的玻璃面、语义色、能量线和反馈动效，并继续由 Reka UI 管理交互。
- `0.4.0-alpha.3` 继续迁移 Drawer 与线性 Progress 的样式，同时保留 Reka UI 的抽屉手势、焦点和进度语义。
- `0.4.0-alpha.4` 修复 Portal 浮层样式作用域与 Accordion 收起行为，并精简 Drawer 标题区。
- `0.4.0-alpha.5` 从 TodoMoe 的 Popconfirm 与 Tooltip 提取 Hover Card 玻璃面、方位能量边和反馈动效。
- `0.4.0-alpha.6` 修正 Popover 炫彩条随实际弹出方位定位，并补齐左右侧纵向渐变。
- `0.4.0-alpha.7` 调整 Input 字段外壳，允许业务 label 合法包裹控件，并扩展组件展厅常用案例。
- 日期对象 `CalendarDate`、`Time` 及相关类型从包入口统一导出。
