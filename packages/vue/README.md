# @dragon-liquid/vue

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
