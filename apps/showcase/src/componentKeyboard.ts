export type ComponentKeyboardGuidance = {
  summary: string
  keys: readonly string[]
  paste?: string
}

const guidance: Record<string, ComponentKeyboardGuidance> = {}

function define(ids: readonly string[], profile: ComponentKeyboardGuidance) {
  for (const id of ids) guidance[id] = profile
}

define(['badge', 'aspect-ratio', 'avatar', 'input-hidden', 'label', 'progress', 'separator', 'color-swatch'], {
  summary: '该组件只呈现信息，不额外进入 Tab 顺序；键盘焦点应落在相邻的真实操作控件上。',
  keys: ['无独立按键'],
})

define(['button', 'icon-button', 'input-button', 'input-image', 'input-reset', 'input-submit'], {
  summary: '遵循原生按钮语义，不另造快捷键，保证与表单和辅助技术一致。',
  keys: ['Tab 聚焦', 'Enter / Space 执行'],
})

define(['input-checkbox', 'input-radio', 'checkbox', 'switch', 'toggle'], {
  summary: '布尔控件保持原生切换方式，并持续暴露当前选中或按下状态。',
  keys: ['Tab 聚焦', 'Space 切换'],
})

define(['input-email', 'input-file', 'input-password', 'input-search', 'input-tel', 'input-text', 'input-url', 'textarea', 'editable', 'pin-input', 'tags-input'], {
  summary: '文本录入保留浏览器编辑、选择、撤销和剪贴板能力，不截获平台通用组合键。',
  keys: ['Tab 聚焦', 'Ctrl/Cmd+A/C/X/V/Z', 'Enter 提交（控件支持时）', 'Escape 取消（控件支持时）'],
  paste: '直接粘贴文本；组件只进行自身声明过的格式化或校验。',
})

define(['color-field'], {
  summary: '完整颜色值可直接录入、粘贴和切换格式；独立通道模式使用数值控件的键盘步进规则。',
  keys: ['Tab 切换格式、输入与复制', 'Enter 提交', 'Escape 恢复提交前的值', '方向键微调通道', 'PageUp / PageDown 大步调整', 'Home / End 到通道边界'],
  paste: '支持带或不带 # 的 HEX，以及 CSS RGB、HSL、HSB 颜色文本；无效内容保留在字段中并显示文字错误。',
})

define(['input-color', 'input-number', 'input-range', 'number-field', 'rating', 'slider', 'color-area', 'color-slider', 'splitter'], {
  summary: '连续值和数值控件可完全通过键盘微调，并遵守最小值、最大值和步长。',
  keys: ['方向键微调', 'PageUp / PageDown 大步调整', 'Home / End 到边界'],
})

define(['input-week'], {
  summary: '周字段兼容原生键入，并保留组件提供的前一周、后一周和本周快捷动作。',
  keys: ['Tab 聚焦', '方向键调整', '平台粘贴快捷键'],
  paste: '粘贴符合 YYYY-Www 的周值。',
})

define(['input-datetime-local', 'date-field', 'date-range-field', 'time-field', 'time-range-field'], {
  summary: '可逐段键入，也可一次粘贴完整值；粘贴成功后统一归一化并验证范围。',
  keys: ['方向键切换/调整分段', 'Tab 离开字段', 'Ctrl/Cmd+V 整段粘贴'],
  paste: '支持 2026-8-28、2026/8/28、中文年月日、日期/时间范围以及常见时间格式。',
})

define(['date-picker', 'date-range-picker', 'time-picker', 'month-picker', 'month-range-picker', 'year-picker', 'year-range-picker'], {
  summary: '字段可直接录入，选择面板通过独立按钮或 Alt+↓ 打开，关闭后焦点返回入口。',
  keys: ['Alt+↓ 打开', '方向键导航', 'Enter / Space 选择', 'Escape 关闭'],
  paste: '入口获得焦点时可直接粘贴完整日期、时间、月份、年份或范围。',
})

define(['calendar', 'range-calendar'], {
  summary: '采用单一 Tab 停靠点的网格导航，避免月份中的每一天都占用一次 Tab。',
  keys: ['方向键按日/周移动', 'Home / End 周首尾', 'PageUp / PageDown 切月', 'Shift+PageUp / PageDown 切年', 'Enter / Space 选择'],
})

define(['choice-portal', 'multi-choice', 'autocomplete', 'combobox', 'listbox', 'select'], {
  summary: '选择控件支持从入口直接搜索、方向键高亮、快速翻页和确认选项。',
  keys: ['↓ 打开', '↑ / ↓ 移动', 'PageUp / PageDown 快移', 'Home / End 首尾', 'Enter 确认', 'Escape 关闭'],
  paste: 'ChoicePortal 可粘贴标签或值；MultiChoice 可一次粘贴逗号、分号或换行分隔的多项。',
})

define(['segmented', 'radio-group', 'toggle-group', 'color-swatch-picker', 'tabs', 'toolbar'], {
  summary: '同组控件使用 roving tabindex，仅当前项进入 Tab 顺序，方向键在组内移动。',
  keys: ['方向键移动', 'Home / End 首尾', 'Enter / Space 激活'],
})

define(['split-button', 'context-menu', 'dropdown-menu', 'menubar', 'navigation-menu'], {
  summary: '菜单入口和菜单项保持标准菜单键盘模型，并提供明确的关闭与焦点返回。',
  keys: ['Enter / Space / ↓ 打开', 'Shift+F10 / Menu 打开右键菜单', '方向键移动', 'Home / End 首尾', 'Escape 关闭'],
})

define(['accordion', 'collapsible'], {
  summary: '标题或触发器是唯一交互入口，内容展开后自然加入页面 Tab 顺序。',
  keys: ['Enter / Space 展开或折叠', '方向键在同组标题间移动'],
})

define(['alert-dialog', 'dialog', 'drawer', 'popover'], {
  summary: '打开后管理焦点范围，Escape 关闭可撤销浮层，并在关闭后返回触发入口。',
  keys: ['Tab / Shift+Tab 遍历', 'Escape 关闭', 'Enter 执行默认操作'],
})

define(['hover-card', 'tooltip'], {
  summary: '鼠标悬停信息也会在触发器获得键盘焦点时显示，内容不制造额外焦点陷阱。',
  keys: ['Tab 聚焦触发器', 'Escape 关闭'],
})

define(['card'], {
  summary: '静态卡片不进入 Tab 顺序；交互卡片必须能通过 Enter 或 Space 执行同一动作。',
  keys: ['Tab 聚焦（interactive）', 'Enter / Space 执行'],
})

define(['mdx'], {
  summary: '编辑器保留常用文档快捷键，并确保工具栏中的每项操作都有键盘等价入口。',
  keys: ['Ctrl/Cmd+B/I/K', 'Ctrl/Cmd+Z / Shift+Ctrl/Cmd+Z', 'Tab / Shift+Tab 缩进', 'Escape 关闭组件库'],
  paste: '支持粘贴 Markdown、纯文本和允许的 HTML 标记。',
})

define(['virtual-list'], {
  summary: '焦点停留在虚拟视口，通过活动索引导航尚未渲染的项目。',
  keys: ['↑ / ↓ 移动', 'PageUp / PageDown 翻页', 'Home / End 首尾', 'Enter / Space 激活'],
})

define(['pagination', 'stepper'], {
  summary: '各步骤或页码保持真实按钮语义，并可直接跳到首尾或相邻位置。',
  keys: ['Tab 聚焦', 'Enter / Space 激活', 'Home / End 首尾（提供时）'],
})

define(['tree'], {
  summary: '树节点使用层级导航，左右键负责折叠、展开或父子移动，上下键负责同层浏览。',
  keys: ['↑ / ↓ 移动', '← 折叠/父级', '→ 展开/子级', 'Home / End 首尾', 'Enter 选择'],
})

define(['scroll-area'], {
  summary: '滚动区域获得焦点后保留浏览器标准滚动按键，内部可操作内容仍按正常 Tab 顺序访问。',
  keys: ['方向键滚动', 'PageUp / PageDown 翻页', 'Home / End 首尾'],
})

define(['toast'], {
  summary: '通知本身不会抢占当前焦点；其中的动作和关闭按钮仍可通过正常 Tab 顺序访问。',
  keys: ['Tab 聚焦通知动作', 'Enter / Space 执行'],
})

export const componentKeyboardGuidance = guidance

export function componentKeyboardGuidanceFor(id: string) {
  const profile = guidance[id]
  if (!profile) throw new Error(`Missing keyboard guidance for ${id}`)
  return profile
}

export function componentsMissingKeyboardGuidance(ids: readonly string[]) {
  return ids.filter(id => !guidance[id])
}
