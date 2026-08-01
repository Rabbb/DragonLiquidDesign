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

层级上下文参考 Ant Design：顶层 Dialog 使用 `1000`，容器上下文递增 `100`，Select 等消费型浮层再递增 `50`。因此顶层 Select 默认是 `1050`，Dialog 内通过 Portal 渲染的 Select 自动提升到 `1150`；嵌套 Dialog 也会继续递增。业务主题可以覆盖变量，单个 `DlDialog`/`DlSelect` 也可以用 `z-index` 属性覆盖。

Dragon Liquid Design 的 Vue 3 组件包，使用 Reka UI、Tailwind CSS 与 Tailwind Variants 构建。

```ts
import { DlButton, DlCard, DlDialog, DlInput } from '@dragon-liquid/vue'
import '@dragon-liquid/vue/style.css'
```

```vue
<DlCard interactive>
  <DlInput v-model="keyword" placeholder="搜索收藏" />
  <DlButton>确认</DlButton>
</DlCard>
```

当前公共组件：`DlBadge`、`DlButton`、`DlCard`、`DlDialog`、`DlIconButton`、`DlInput`、`DlSelect`、`DlTextarea`。
