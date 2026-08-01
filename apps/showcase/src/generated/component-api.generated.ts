// 此文件由 scripts/generate-component-api.mjs 根据组件源码生成，请勿手工编辑。
export default {
  "accordion": {
    "props": [
      {
        "prop": "modelValue",
        "description": "组件当前值；使用 v-model 进行双向绑定。",
        "type": "string | string[]",
        "defaultValue": "undefined"
      },
      {
        "prop": "items",
        "description": "用于渲染控件内容的结构化项目列表。",
        "type": "DlAccordionItem[]",
        "defaultValue": "—"
      },
      {
        "prop": "type",
        "description": "设置组件的选择模式或原生类型。",
        "type": "'single' | 'multiple'",
        "defaultValue": "'single'"
      },
      {
        "prop": "collapsible",
        "description": "单选模式下是否允许收起当前已展开项。",
        "type": "boolean",
        "defaultValue": "true"
      },
      {
        "prop": "disabled",
        "description": "是否禁用控件及其交互。",
        "type": "boolean",
        "defaultValue": "false"
      }
    ],
    "structures": [
      {
        "name": "DlAccordionItem",
        "description": "Accordion 的单个折叠面板配置。",
        "rows": [
          {
            "prop": "value",
            "description": "表单提交或选择操作使用的值。",
            "type": "string",
            "defaultValue": "必填"
          },
          {
            "prop": "title",
            "description": "控件或浮层显示的标题。",
            "type": "string",
            "defaultValue": "必填"
          },
          {
            "prop": "description",
            "description": "补充说明文字；不传时隐藏说明区域。",
            "type": "string",
            "defaultValue": "可选"
          },
          {
            "prop": "content",
            "description": "设置 content 字段。",
            "type": "string",
            "defaultValue": "可选"
          },
          {
            "prop": "disabled",
            "description": "是否禁用控件及其交互。",
            "type": "boolean",
            "defaultValue": "可选"
          }
        ],
        "title": "DlAccordionItem[]"
      }
    ]
  },
  "alert-dialog": {
    "props": [
      {
        "prop": "open",
        "description": "浮层或内容区域是否打开；使用 v-model:open 双向绑定。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "title",
        "description": "控件或浮层显示的标题。",
        "type": "string",
        "defaultValue": "—"
      },
      {
        "prop": "description",
        "description": "补充说明文字；不传时隐藏说明区域。",
        "type": "string",
        "defaultValue": "undefined"
      },
      {
        "prop": "confirmLabel",
        "description": "确认操作按钮显示的文字。",
        "type": "string",
        "defaultValue": "'确认'"
      },
      {
        "prop": "cancelLabel",
        "description": "取消操作按钮显示的文字。",
        "type": "string",
        "defaultValue": "'取消'"
      },
      {
        "prop": "tone",
        "description": "设置语义色调。",
        "type": "'warning' | 'danger'",
        "defaultValue": "'danger'"
      },
      {
        "prop": "zIndex",
        "description": "覆盖默认浮层层级；不传时由 Dragon Liquid 层级系统计算。",
        "type": "number",
        "defaultValue": "undefined"
      }
    ],
    "structures": []
  },
  "aspect-ratio": {
    "props": [
      {
        "prop": "ratio",
        "description": "内容区域需要保持的宽高比。",
        "type": "number",
        "defaultValue": "16 / 9"
      }
    ],
    "structures": []
  },
  "autocomplete": {
    "props": [
      {
        "prop": "modelValue",
        "description": "组件当前值；使用 v-model 进行双向绑定。",
        "type": "string",
        "defaultValue": "''"
      },
      {
        "prop": "suggestions",
        "description": "自动补全候选内容列表。",
        "type": "string[]",
        "defaultValue": "—"
      },
      {
        "prop": "placeholder",
        "description": "当前值为空时显示的占位提示。",
        "type": "string",
        "defaultValue": "'输入关键词'"
      },
      {
        "prop": "size",
        "description": "设置控件尺寸。",
        "type": "DlSize",
        "defaultValue": "'md'"
      },
      {
        "prop": "disabled",
        "description": "是否禁用控件及其交互。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "name",
        "description": "参与表单提交时使用的字段名称。",
        "type": "string",
        "defaultValue": "undefined"
      },
      {
        "prop": "required",
        "description": "是否标记为表单必填项。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "zIndex",
        "description": "覆盖默认浮层层级；不传时由 Dragon Liquid 层级系统计算。",
        "type": "number",
        "defaultValue": "undefined"
      }
    ],
    "structures": []
  },
  "avatar": {
    "props": [
      {
        "prop": "src",
        "description": "要加载的图片资源地址。",
        "type": "string",
        "defaultValue": "undefined"
      },
      {
        "prop": "alt",
        "description": "图片无法展示时使用的替代文本。",
        "type": "string",
        "defaultValue": "''"
      },
      {
        "prop": "fallback",
        "description": "图片不可用时显示的回退文字。",
        "type": "string",
        "defaultValue": "'?'"
      },
      {
        "prop": "size",
        "description": "设置控件尺寸。",
        "type": "DlSize",
        "defaultValue": "'md'"
      },
      {
        "prop": "shape",
        "description": "设置控件的外轮廓形状。",
        "type": "'circle' | 'rounded'",
        "defaultValue": "'circle'"
      },
      {
        "prop": "delayMs",
        "description": "加载回退内容前等待的时间，单位毫秒。",
        "type": "number",
        "defaultValue": "0"
      }
    ],
    "structures": []
  },
  "badge": {
    "props": [
      {
        "prop": "tone",
        "description": "设置语义色调。",
        "type": "DlTone",
        "defaultValue": "'default'"
      },
      {
        "prop": "size",
        "description": "设置控件尺寸。",
        "type": "DlSize",
        "defaultValue": "'sm'"
      },
      {
        "prop": "variant",
        "description": "设置控件的视觉变体。",
        "type": "'soft' | 'outline' | 'solid'",
        "defaultValue": "'soft'"
      }
    ],
    "structures": []
  },
  "button": {
    "props": [
      {
        "prop": "variant",
        "description": "设置控件的视觉变体。",
        "type": "'primary' | 'secondary' | 'ghost' | 'danger'",
        "defaultValue": "'primary'"
      },
      {
        "prop": "size",
        "description": "设置控件尺寸。",
        "type": "DlSize",
        "defaultValue": "'md'"
      },
      {
        "prop": "type",
        "description": "设置组件的选择模式或原生类型。",
        "type": "'button' | 'submit' | 'reset'",
        "defaultValue": "'button'"
      },
      {
        "prop": "block",
        "description": "是否让控件占满父容器宽度。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "loading",
        "description": "是否显示加载状态并阻止重复操作。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "disabled",
        "description": "是否禁用控件及其交互。",
        "type": "boolean",
        "defaultValue": "false"
      }
    ],
    "structures": []
  },
  "calendar": {
    "props": [
      {
        "prop": "modelValue",
        "description": "组件当前值；使用 v-model 进行双向绑定。",
        "type": "DateValue | DateValue[] | null",
        "defaultValue": "null"
      },
      {
        "prop": "locale",
        "description": "日期、时间或数字格式使用的区域语言。",
        "type": "string",
        "defaultValue": "'zh-CN'"
      },
      {
        "prop": "weekStartsOn",
        "description": "一周起始日，0 表示星期日。",
        "type": "0 | 1 | 2 | 3 | 4 | 5 | 6",
        "defaultValue": "1"
      },
      {
        "prop": "fixedWeeks",
        "description": "是否固定显示完整的六周日期网格。",
        "type": "boolean",
        "defaultValue": "true"
      },
      {
        "prop": "numberOfMonths",
        "description": "同时显示的月份面板数量。",
        "type": "number",
        "defaultValue": "1"
      },
      {
        "prop": "multiple",
        "description": "是否允许同时选择多个值。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "disabled",
        "description": "是否禁用控件及其交互。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "readonly",
        "description": "是否只读；保留浏览能力但禁止修改。",
        "type": "boolean",
        "defaultValue": "false"
      }
    ],
    "structures": []
  },
  "card": {
    "props": [
      {
        "prop": "interactive",
        "description": "是否启用悬停抬升等可交互视觉反馈。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "padding",
        "description": "设置内容区域的内边距尺寸。",
        "type": "'none' | 'sm' | 'md' | 'lg'",
        "defaultValue": "'md'"
      }
    ],
    "structures": []
  },
  "checkbox": {
    "props": [
      {
        "prop": "modelValue",
        "description": "组件当前值；使用 v-model 进行双向绑定。",
        "type": "boolean | 'indeterminate'",
        "defaultValue": "false"
      },
      {
        "prop": "label",
        "description": "控件的显示标签或无障碍名称。",
        "type": "string",
        "defaultValue": "undefined"
      },
      {
        "prop": "description",
        "description": "补充说明文字；不传时隐藏说明区域。",
        "type": "string",
        "defaultValue": "undefined"
      },
      {
        "prop": "size",
        "description": "设置控件尺寸。",
        "type": "DlSize",
        "defaultValue": "'md'"
      },
      {
        "prop": "disabled",
        "description": "是否禁用控件及其交互。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "name",
        "description": "参与表单提交时使用的字段名称。",
        "type": "string",
        "defaultValue": "undefined"
      },
      {
        "prop": "required",
        "description": "是否标记为表单必填项。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "value",
        "description": "表单提交或选择操作使用的值。",
        "type": "string",
        "defaultValue": "'on'"
      }
    ],
    "structures": []
  },
  "collapsible": {
    "props": [
      {
        "prop": "open",
        "description": "浮层或内容区域是否打开；使用 v-model:open 双向绑定。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "title",
        "description": "控件或浮层显示的标题。",
        "type": "string",
        "defaultValue": "'展开详情'"
      },
      {
        "prop": "description",
        "description": "补充说明文字；不传时隐藏说明区域。",
        "type": "string",
        "defaultValue": "undefined"
      },
      {
        "prop": "disabled",
        "description": "是否禁用控件及其交互。",
        "type": "boolean",
        "defaultValue": "false"
      }
    ],
    "structures": []
  },
  "color-area": {
    "props": [
      {
        "prop": "modelValue",
        "description": "组件当前值；使用 v-model 进行双向绑定。",
        "type": "string",
        "defaultValue": "'#ff8c00'"
      },
      {
        "prop": "colorSpace",
        "description": "颜色值采用的色彩空间。",
        "type": "ColorSpace",
        "defaultValue": "'hsl'"
      },
      {
        "prop": "xChannel",
        "description": "二维颜色区域横轴控制的颜色通道。",
        "type": "ColorChannel",
        "defaultValue": "'saturation'"
      },
      {
        "prop": "yChannel",
        "description": "二维颜色区域纵轴控制的颜色通道。",
        "type": "ColorChannel",
        "defaultValue": "'lightness'"
      },
      {
        "prop": "disabled",
        "description": "是否禁用控件及其交互。",
        "type": "boolean",
        "defaultValue": "false"
      }
    ],
    "structures": []
  },
  "color-field": {
    "props": [
      {
        "prop": "modelValue",
        "description": "组件当前值；使用 v-model 进行双向绑定。",
        "type": "string",
        "defaultValue": "'#ff8c00'"
      },
      {
        "prop": "colorSpace",
        "description": "颜色值采用的色彩空间。",
        "type": "ColorSpace",
        "defaultValue": "'hsl'"
      },
      {
        "prop": "channel",
        "description": "当前编辑或滑动控制的颜色通道。",
        "type": "ColorChannel",
        "defaultValue": "undefined"
      },
      {
        "prop": "placeholder",
        "description": "当前值为空时显示的占位提示。",
        "type": "string",
        "defaultValue": "'#RRGGBB'"
      },
      {
        "prop": "disabled",
        "description": "是否禁用控件及其交互。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "readonly",
        "description": "是否只读；保留浏览能力但禁止修改。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "name",
        "description": "参与表单提交时使用的字段名称。",
        "type": "string",
        "defaultValue": "undefined"
      }
    ],
    "structures": []
  },
  "color-slider": {
    "props": [
      {
        "prop": "modelValue",
        "description": "组件当前值；使用 v-model 进行双向绑定。",
        "type": "string",
        "defaultValue": "'#ff8c00'"
      },
      {
        "prop": "channel",
        "description": "当前编辑或滑动控制的颜色通道。",
        "type": "ColorChannel",
        "defaultValue": "—"
      },
      {
        "prop": "colorSpace",
        "description": "颜色值采用的色彩空间。",
        "type": "ColorSpace",
        "defaultValue": "'hsl'"
      },
      {
        "prop": "orientation",
        "description": "设置控件的水平或垂直方向。",
        "type": "'horizontal' | 'vertical'",
        "defaultValue": "'horizontal'"
      },
      {
        "prop": "disabled",
        "description": "是否禁用控件及其交互。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "step",
        "description": "每次操作改变的数值步长。",
        "type": "number",
        "defaultValue": "undefined"
      }
    ],
    "structures": []
  },
  "color-swatch": {
    "props": [
      {
        "prop": "color",
        "description": "要展示或编辑的颜色值。",
        "type": "string",
        "defaultValue": "'#ff8c00'"
      },
      {
        "prop": "label",
        "description": "控件的显示标签或无障碍名称。",
        "type": "string",
        "defaultValue": "undefined"
      },
      {
        "prop": "size",
        "description": "设置控件尺寸。",
        "type": "DlSize",
        "defaultValue": "'md'"
      },
      {
        "prop": "shape",
        "description": "设置控件的外轮廓形状。",
        "type": "'circle' | 'rounded'",
        "defaultValue": "'rounded'"
      }
    ],
    "structures": []
  },
  "color-swatch-picker": {
    "props": [
      {
        "prop": "modelValue",
        "description": "组件当前值；使用 v-model 进行双向绑定。",
        "type": "string | string[]",
        "defaultValue": "undefined"
      },
      {
        "prop": "colors",
        "description": "供用户选择的颜色值列表。",
        "type": "string[]",
        "defaultValue": "—"
      },
      {
        "prop": "multiple",
        "description": "是否允许同时选择多个值。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "disabled",
        "description": "是否禁用控件及其交互。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "name",
        "description": "参与表单提交时使用的字段名称。",
        "type": "string",
        "defaultValue": "undefined"
      }
    ],
    "structures": []
  },
  "combobox": {
    "props": [
      {
        "prop": "modelValue",
        "description": "组件当前值；使用 v-model 进行双向绑定。",
        "type": "string",
        "defaultValue": "undefined"
      },
      {
        "prop": "options",
        "description": "可供用户选择的选项列表。",
        "type": "DlChoiceOption[]",
        "defaultValue": "—"
      },
      {
        "prop": "placeholder",
        "description": "当前值为空时显示的占位提示。",
        "type": "string",
        "defaultValue": "'搜索或选择'"
      },
      {
        "prop": "size",
        "description": "设置控件尺寸。",
        "type": "DlSize",
        "defaultValue": "'md'"
      },
      {
        "prop": "disabled",
        "description": "是否禁用控件及其交互。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "name",
        "description": "参与表单提交时使用的字段名称。",
        "type": "string",
        "defaultValue": "undefined"
      },
      {
        "prop": "zIndex",
        "description": "覆盖默认浮层层级；不传时由 Dragon Liquid 层级系统计算。",
        "type": "number",
        "defaultValue": "undefined"
      }
    ],
    "structures": [
      {
        "name": "DlChoiceOption",
        "description": "列表、组合框或切换组使用的通用选择项。",
        "rows": [
          {
            "prop": "value",
            "description": "表单提交或选择操作使用的值。",
            "type": "string",
            "defaultValue": "必填"
          },
          {
            "prop": "label",
            "description": "控件的显示标签或无障碍名称。",
            "type": "string",
            "defaultValue": "必填"
          },
          {
            "prop": "description",
            "description": "补充说明文字；不传时隐藏说明区域。",
            "type": "string",
            "defaultValue": "可选"
          },
          {
            "prop": "disabled",
            "description": "是否禁用控件及其交互。",
            "type": "boolean",
            "defaultValue": "可选"
          }
        ],
        "title": "DlChoiceOption[]"
      }
    ]
  },
  "context-menu": {
    "props": [
      {
        "prop": "items",
        "description": "用于渲染控件内容的结构化项目列表。",
        "type": "DlMenuItem[]",
        "defaultValue": "—"
      },
      {
        "prop": "label",
        "description": "控件的显示标签或无障碍名称。",
        "type": "string",
        "defaultValue": "undefined"
      },
      {
        "prop": "modal",
        "description": "是否启用模态交互与焦点限制。",
        "type": "boolean",
        "defaultValue": "true"
      },
      {
        "prop": "zIndex",
        "description": "覆盖默认浮层层级；不传时由 Dragon Liquid 层级系统计算。",
        "type": "number",
        "defaultValue": "undefined"
      }
    ],
    "structures": [
      {
        "name": "DlMenuItem",
        "description": "菜单、下拉菜单、上下文菜单与工具栏使用的命令项。",
        "rows": [
          {
            "prop": "value",
            "description": "表单提交或选择操作使用的值。",
            "type": "string",
            "defaultValue": "必填"
          },
          {
            "prop": "label",
            "description": "控件的显示标签或无障碍名称。",
            "type": "string",
            "defaultValue": "必填"
          },
          {
            "prop": "shortcut",
            "description": "菜单命令旁展示的键盘快捷键说明。",
            "type": "string",
            "defaultValue": "可选"
          },
          {
            "prop": "disabled",
            "description": "是否禁用控件及其交互。",
            "type": "boolean",
            "defaultValue": "可选"
          },
          {
            "prop": "separator",
            "description": "是否将该项目渲染为菜单分隔线。",
            "type": "boolean",
            "defaultValue": "可选"
          }
        ],
        "title": "DlMenuItem[]"
      }
    ]
  },
  "date-field": {
    "props": [
      {
        "prop": "modelValue",
        "description": "组件当前值；使用 v-model 进行双向绑定。",
        "type": "DateValue | null",
        "defaultValue": "null"
      },
      {
        "prop": "locale",
        "description": "日期、时间或数字格式使用的区域语言。",
        "type": "string",
        "defaultValue": "'zh-CN'"
      },
      {
        "prop": "granularity",
        "description": "允许编辑到的最小日期或时间粒度。",
        "type": "'day' | 'hour' | 'minute' | 'second'",
        "defaultValue": "'day'"
      },
      {
        "prop": "hourCycle",
        "description": "时间字段使用 12 小时制或 24 小时制。",
        "type": "12 | 24",
        "defaultValue": "24"
      },
      {
        "prop": "disabled",
        "description": "是否禁用控件及其交互。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "readonly",
        "description": "是否只读；保留浏览能力但禁止修改。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "name",
        "description": "参与表单提交时使用的字段名称。",
        "type": "string",
        "defaultValue": "undefined"
      },
      {
        "prop": "id",
        "description": "控件或输入元素使用的唯一标识。",
        "type": "string",
        "defaultValue": "undefined"
      }
    ],
    "structures": []
  },
  "date-picker": {
    "props": [
      {
        "prop": "modelValue",
        "description": "组件当前值；使用 v-model 进行双向绑定。",
        "type": "DateValue | null",
        "defaultValue": "null"
      },
      {
        "prop": "placeholder",
        "description": "当前值为空时显示的占位提示。",
        "type": "string",
        "defaultValue": "'选择日期'"
      },
      {
        "prop": "locale",
        "description": "日期、时间或数字格式使用的区域语言。",
        "type": "string",
        "defaultValue": "'zh-CN'"
      },
      {
        "prop": "disabled",
        "description": "是否禁用控件及其交互。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "zIndex",
        "description": "覆盖默认浮层层级；不传时由 Dragon Liquid 层级系统计算。",
        "type": "number",
        "defaultValue": "undefined"
      }
    ],
    "structures": []
  },
  "date-range-field": {
    "props": [
      {
        "prop": "modelValue",
        "description": "组件当前值；使用 v-model 进行双向绑定。",
        "type": "DateRange | null",
        "defaultValue": "null"
      },
      {
        "prop": "locale",
        "description": "日期、时间或数字格式使用的区域语言。",
        "type": "string",
        "defaultValue": "'zh-CN'"
      },
      {
        "prop": "granularity",
        "description": "允许编辑到的最小日期或时间粒度。",
        "type": "'day' | 'hour' | 'minute' | 'second'",
        "defaultValue": "'day'"
      },
      {
        "prop": "hourCycle",
        "description": "时间字段使用 12 小时制或 24 小时制。",
        "type": "12 | 24",
        "defaultValue": "24"
      },
      {
        "prop": "disabled",
        "description": "是否禁用控件及其交互。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "readonly",
        "description": "是否只读；保留浏览能力但禁止修改。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "name",
        "description": "参与表单提交时使用的字段名称。",
        "type": "string",
        "defaultValue": "undefined"
      }
    ],
    "structures": []
  },
  "date-range-picker": {
    "props": [
      {
        "prop": "modelValue",
        "description": "组件当前值；使用 v-model 进行双向绑定。",
        "type": "DateRange | null",
        "defaultValue": "null"
      },
      {
        "prop": "placeholder",
        "description": "当前值为空时显示的占位提示。",
        "type": "string",
        "defaultValue": "'选择日期范围'"
      },
      {
        "prop": "locale",
        "description": "日期、时间或数字格式使用的区域语言。",
        "type": "string",
        "defaultValue": "'zh-CN'"
      },
      {
        "prop": "disabled",
        "description": "是否禁用控件及其交互。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "numberOfMonths",
        "description": "同时显示的月份面板数量。",
        "type": "number",
        "defaultValue": "1"
      },
      {
        "prop": "zIndex",
        "description": "覆盖默认浮层层级；不传时由 Dragon Liquid 层级系统计算。",
        "type": "number",
        "defaultValue": "undefined"
      }
    ],
    "structures": []
  },
  "dialog": {
    "props": [
      {
        "prop": "open",
        "description": "浮层或内容区域是否打开；使用 v-model:open 双向绑定。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "title",
        "description": "控件或浮层显示的标题。",
        "type": "string",
        "defaultValue": "—"
      },
      {
        "prop": "description",
        "description": "补充说明文字；不传时隐藏说明区域。",
        "type": "string",
        "defaultValue": "undefined"
      },
      {
        "prop": "size",
        "description": "设置控件尺寸。",
        "type": "'sm' | 'md' | 'lg'",
        "defaultValue": "'md'"
      },
      {
        "prop": "tone",
        "description": "设置语义色调。",
        "type": "DlTone",
        "defaultValue": "'default'"
      },
      {
        "prop": "closable",
        "description": "是否显示并允许使用关闭操作。",
        "type": "boolean",
        "defaultValue": "true"
      },
      {
        "prop": "zIndex",
        "description": "覆盖默认浮层层级；不传时由 Dragon Liquid 层级系统计算。",
        "type": "number",
        "defaultValue": "undefined"
      }
    ],
    "structures": []
  },
  "drawer": {
    "props": [
      {
        "prop": "open",
        "description": "浮层或内容区域是否打开；使用 v-model:open 双向绑定。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "title",
        "description": "控件或浮层显示的标题。",
        "type": "string",
        "defaultValue": "—"
      },
      {
        "prop": "description",
        "description": "补充说明文字；不传时隐藏说明区域。",
        "type": "string",
        "defaultValue": "undefined"
      },
      {
        "prop": "placement",
        "description": "抽屉从视口的哪一侧进入。",
        "type": "'bottom' | 'top' | 'left' | 'right'",
        "defaultValue": "'bottom'"
      },
      {
        "prop": "size",
        "description": "设置控件尺寸。",
        "type": "DlSize",
        "defaultValue": "'sm'"
      },
      {
        "prop": "tone",
        "description": "设置语义色调。",
        "type": "DlTone",
        "defaultValue": "'default'"
      },
      {
        "prop": "modal",
        "description": "是否启用模态交互与焦点限制。",
        "type": "boolean | 'trap-focus'",
        "defaultValue": "true"
      },
      {
        "prop": "closable",
        "description": "是否显示并允许使用关闭操作。",
        "type": "boolean",
        "defaultValue": "true"
      },
      {
        "prop": "zIndex",
        "description": "覆盖默认浮层层级；不传时由 Dragon Liquid 层级系统计算。",
        "type": "number",
        "defaultValue": "undefined"
      }
    ],
    "structures": []
  },
  "dropdown-menu": {
    "props": [
      {
        "prop": "open",
        "description": "浮层或内容区域是否打开；使用 v-model:open 双向绑定。",
        "type": "boolean",
        "defaultValue": "undefined"
      },
      {
        "prop": "items",
        "description": "用于渲染控件内容的结构化项目列表。",
        "type": "DlMenuItem[]",
        "defaultValue": "—"
      },
      {
        "prop": "label",
        "description": "控件的显示标签或无障碍名称。",
        "type": "string",
        "defaultValue": "undefined"
      },
      {
        "prop": "side",
        "description": "设置浮层相对触发器出现的方位。",
        "type": "'top' | 'right' | 'bottom' | 'left'",
        "defaultValue": "'bottom'"
      },
      {
        "prop": "align",
        "description": "设置浮层相对触发器的对齐方式。",
        "type": "'start' | 'center' | 'end'",
        "defaultValue": "'start'"
      },
      {
        "prop": "modal",
        "description": "是否启用模态交互与焦点限制。",
        "type": "boolean",
        "defaultValue": "true"
      },
      {
        "prop": "zIndex",
        "description": "覆盖默认浮层层级；不传时由 Dragon Liquid 层级系统计算。",
        "type": "number",
        "defaultValue": "undefined"
      }
    ],
    "structures": [
      {
        "name": "DlMenuItem",
        "description": "菜单、下拉菜单、上下文菜单与工具栏使用的命令项。",
        "rows": [
          {
            "prop": "value",
            "description": "表单提交或选择操作使用的值。",
            "type": "string",
            "defaultValue": "必填"
          },
          {
            "prop": "label",
            "description": "控件的显示标签或无障碍名称。",
            "type": "string",
            "defaultValue": "必填"
          },
          {
            "prop": "shortcut",
            "description": "菜单命令旁展示的键盘快捷键说明。",
            "type": "string",
            "defaultValue": "可选"
          },
          {
            "prop": "disabled",
            "description": "是否禁用控件及其交互。",
            "type": "boolean",
            "defaultValue": "可选"
          },
          {
            "prop": "separator",
            "description": "是否将该项目渲染为菜单分隔线。",
            "type": "boolean",
            "defaultValue": "可选"
          }
        ],
        "title": "DlMenuItem[]"
      }
    ]
  },
  "editable": {
    "props": [
      {
        "prop": "modelValue",
        "description": "组件当前值；使用 v-model 进行双向绑定。",
        "type": "string | null",
        "defaultValue": "''"
      },
      {
        "prop": "placeholder",
        "description": "当前值为空时显示的占位提示。",
        "type": "string",
        "defaultValue": "'点击编辑'"
      },
      {
        "prop": "disabled",
        "description": "是否禁用控件及其交互。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "readonly",
        "description": "是否只读；保留浏览能力但禁止修改。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "activationMode",
        "description": "设置组件进入激活或编辑状态的方式。",
        "type": "'focus' | 'dblclick' | 'none'",
        "defaultValue": "'dblclick'"
      },
      {
        "prop": "submitMode",
        "description": "设置编辑内容提交的触发方式。",
        "type": "'blur' | 'enter' | 'both' | 'none'",
        "defaultValue": "'both'"
      },
      {
        "prop": "maxLength",
        "description": "允许输入的最大字符数。",
        "type": "number",
        "defaultValue": "undefined"
      },
      {
        "prop": "name",
        "description": "参与表单提交时使用的字段名称。",
        "type": "string",
        "defaultValue": "undefined"
      }
    ],
    "structures": []
  },
  "hover-card": {
    "props": [
      {
        "prop": "openDelay",
        "description": "触发后打开浮层的延迟时间，单位毫秒。",
        "type": "number",
        "defaultValue": "500"
      },
      {
        "prop": "closeDelay",
        "description": "指针离开后关闭浮层的延迟时间，单位毫秒。",
        "type": "number",
        "defaultValue": "250"
      },
      {
        "prop": "side",
        "description": "设置浮层相对触发器出现的方位。",
        "type": "'top' | 'right' | 'bottom' | 'left'",
        "defaultValue": "'bottom'"
      },
      {
        "prop": "align",
        "description": "设置浮层相对触发器的对齐方式。",
        "type": "'start' | 'center' | 'end'",
        "defaultValue": "'center'"
      },
      {
        "prop": "zIndex",
        "description": "覆盖默认浮层层级；不传时由 Dragon Liquid 层级系统计算。",
        "type": "number",
        "defaultValue": "undefined"
      }
    ],
    "structures": []
  },
  "icon-button": {
    "props": [
      {
        "prop": "label",
        "description": "控件的显示标签或无障碍名称。",
        "type": "string",
        "defaultValue": "—"
      },
      {
        "prop": "variant",
        "description": "设置控件的视觉变体。",
        "type": "'primary' | 'secondary' | 'ghost' | 'danger'",
        "defaultValue": "'secondary'"
      },
      {
        "prop": "size",
        "description": "设置控件尺寸。",
        "type": "DlSize",
        "defaultValue": "'md'"
      },
      {
        "prop": "type",
        "description": "设置组件的选择模式或原生类型。",
        "type": "'button' | 'submit' | 'reset'",
        "defaultValue": "'button'"
      },
      {
        "prop": "disabled",
        "description": "是否禁用控件及其交互。",
        "type": "boolean",
        "defaultValue": "false"
      }
    ],
    "structures": []
  },
  "input": {
    "props": [
      {
        "prop": "modelValue",
        "description": "组件当前值；使用 v-model 进行双向绑定。",
        "type": "string | number | null",
        "defaultValue": "''"
      },
      {
        "prop": "size",
        "description": "设置控件尺寸。",
        "type": "DlSize",
        "defaultValue": "'md'"
      },
      {
        "prop": "status",
        "description": "设置业务状态及对应视觉反馈。",
        "type": "'default' | 'success' | 'warning' | 'error'",
        "defaultValue": "'default'"
      },
      {
        "prop": "type",
        "description": "设置组件的选择模式或原生类型。",
        "type": "string",
        "defaultValue": "'text'"
      },
      {
        "prop": "disabled",
        "description": "是否禁用控件及其交互。",
        "type": "boolean",
        "defaultValue": "false"
      }
    ],
    "structures": []
  },
  "label": {
    "props": [
      {
        "prop": "for",
        "description": "关联表单控件的 id。",
        "type": "string",
        "defaultValue": "undefined"
      },
      {
        "prop": "required",
        "description": "是否标记为表单必填项。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "disabled",
        "description": "是否禁用控件及其交互。",
        "type": "boolean",
        "defaultValue": "false"
      }
    ],
    "structures": []
  },
  "listbox": {
    "props": [
      {
        "prop": "modelValue",
        "description": "组件当前值；使用 v-model 进行双向绑定。",
        "type": "string | string[]",
        "defaultValue": "undefined"
      },
      {
        "prop": "options",
        "description": "可供用户选择的选项列表。",
        "type": "DlChoiceOption[]",
        "defaultValue": "—"
      },
      {
        "prop": "multiple",
        "description": "是否允许同时选择多个值。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "disabled",
        "description": "是否禁用控件及其交互。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "orientation",
        "description": "设置控件的水平或垂直方向。",
        "type": "'horizontal' | 'vertical'",
        "defaultValue": "'vertical'"
      },
      {
        "prop": "name",
        "description": "参与表单提交时使用的字段名称。",
        "type": "string",
        "defaultValue": "undefined"
      }
    ],
    "structures": [
      {
        "name": "DlChoiceOption",
        "description": "列表、组合框或切换组使用的通用选择项。",
        "rows": [
          {
            "prop": "value",
            "description": "表单提交或选择操作使用的值。",
            "type": "string",
            "defaultValue": "必填"
          },
          {
            "prop": "label",
            "description": "控件的显示标签或无障碍名称。",
            "type": "string",
            "defaultValue": "必填"
          },
          {
            "prop": "description",
            "description": "补充说明文字；不传时隐藏说明区域。",
            "type": "string",
            "defaultValue": "可选"
          },
          {
            "prop": "disabled",
            "description": "是否禁用控件及其交互。",
            "type": "boolean",
            "defaultValue": "可选"
          }
        ],
        "title": "DlChoiceOption[]"
      }
    ]
  },
  "menubar": {
    "props": [
      {
        "prop": "modelValue",
        "description": "组件当前值；使用 v-model 进行双向绑定。",
        "type": "string",
        "defaultValue": "undefined"
      },
      {
        "prop": "menus",
        "description": "菜单栏中显示的菜单分组与命令列表。",
        "type": "DlMenuGroup[]",
        "defaultValue": "—"
      },
      {
        "prop": "zIndex",
        "description": "覆盖默认浮层层级；不传时由 Dragon Liquid 层级系统计算。",
        "type": "number",
        "defaultValue": "undefined"
      }
    ],
    "structures": [
      {
        "name": "DlMenuGroup",
        "description": "Menubar 的一级菜单分组，内部通过 items 提供命令。",
        "rows": [
          {
            "prop": "value",
            "description": "表单提交或选择操作使用的值。",
            "type": "string",
            "defaultValue": "必填"
          },
          {
            "prop": "label",
            "description": "控件的显示标签或无障碍名称。",
            "type": "string",
            "defaultValue": "必填"
          },
          {
            "prop": "items",
            "description": "用于渲染控件内容的结构化项目列表。",
            "type": "DlMenuItem[]",
            "defaultValue": "必填"
          }
        ],
        "title": "DlMenuGroup[]"
      },
      {
        "name": "DlMenuItem",
        "description": "菜单、下拉菜单、上下文菜单与工具栏使用的命令项。",
        "rows": [
          {
            "prop": "value",
            "description": "表单提交或选择操作使用的值。",
            "type": "string",
            "defaultValue": "必填"
          },
          {
            "prop": "label",
            "description": "控件的显示标签或无障碍名称。",
            "type": "string",
            "defaultValue": "必填"
          },
          {
            "prop": "shortcut",
            "description": "菜单命令旁展示的键盘快捷键说明。",
            "type": "string",
            "defaultValue": "可选"
          },
          {
            "prop": "disabled",
            "description": "是否禁用控件及其交互。",
            "type": "boolean",
            "defaultValue": "可选"
          },
          {
            "prop": "separator",
            "description": "是否将该项目渲染为菜单分隔线。",
            "type": "boolean",
            "defaultValue": "可选"
          }
        ],
        "title": "DlMenuItem[]"
      }
    ]
  },
  "month-picker": {
    "props": [
      {
        "prop": "modelValue",
        "description": "组件当前值；使用 v-model 进行双向绑定。",
        "type": "DateValue | DateValue[] | null",
        "defaultValue": "null"
      },
      {
        "prop": "locale",
        "description": "日期、时间或数字格式使用的区域语言。",
        "type": "string",
        "defaultValue": "'zh-CN'"
      },
      {
        "prop": "multiple",
        "description": "是否允许同时选择多个值。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "disabled",
        "description": "是否禁用控件及其交互。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "readonly",
        "description": "是否只读；保留浏览能力但禁止修改。",
        "type": "boolean",
        "defaultValue": "false"
      }
    ],
    "structures": []
  },
  "month-range-picker": {
    "props": [
      {
        "prop": "modelValue",
        "description": "组件当前值；使用 v-model 进行双向绑定。",
        "type": "DateRange | null",
        "defaultValue": "null"
      },
      {
        "prop": "locale",
        "description": "日期、时间或数字格式使用的区域语言。",
        "type": "string",
        "defaultValue": "'zh-CN'"
      },
      {
        "prop": "disabled",
        "description": "是否禁用控件及其交互。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "readonly",
        "description": "是否只读；保留浏览能力但禁止修改。",
        "type": "boolean",
        "defaultValue": "false"
      }
    ],
    "structures": []
  },
  "navigation-menu": {
    "props": [
      {
        "prop": "modelValue",
        "description": "组件当前值；使用 v-model 进行双向绑定。",
        "type": "string",
        "defaultValue": "undefined"
      },
      {
        "prop": "items",
        "description": "用于渲染控件内容的结构化项目列表。",
        "type": "DlNavigationItem[]",
        "defaultValue": "—"
      },
      {
        "prop": "delayDuration",
        "description": "触发后显示浮层的延迟时间，单位毫秒。",
        "type": "number",
        "defaultValue": "200"
      }
    ],
    "structures": [
      {
        "name": "DlNavigationItem",
        "description": "Navigation Menu 使用的可递归导航节点。",
        "rows": [
          {
            "prop": "value",
            "description": "表单提交或选择操作使用的值。",
            "type": "string",
            "defaultValue": "必填"
          },
          {
            "prop": "label",
            "description": "控件的显示标签或无障碍名称。",
            "type": "string",
            "defaultValue": "必填"
          },
          {
            "prop": "description",
            "description": "补充说明文字；不传时隐藏说明区域。",
            "type": "string",
            "defaultValue": "可选"
          },
          {
            "prop": "href",
            "description": "点击导航项后前往的目标地址。",
            "type": "string",
            "defaultValue": "可选"
          },
          {
            "prop": "disabled",
            "description": "是否禁用控件及其交互。",
            "type": "boolean",
            "defaultValue": "可选"
          },
          {
            "prop": "children",
            "description": "当前节点或导航项包含的下一级项目。",
            "type": "DlNavigationItem[]",
            "defaultValue": "可选"
          }
        ],
        "title": "DlNavigationItem[]"
      }
    ]
  },
  "number-field": {
    "props": [
      {
        "prop": "modelValue",
        "description": "组件当前值；使用 v-model 进行双向绑定。",
        "type": "number | null",
        "defaultValue": "null"
      },
      {
        "prop": "min",
        "description": "允许的最小值。",
        "type": "number",
        "defaultValue": "undefined"
      },
      {
        "prop": "max",
        "description": "允许的最大值。",
        "type": "number",
        "defaultValue": "undefined"
      },
      {
        "prop": "step",
        "description": "每次操作改变的数值步长。",
        "type": "number",
        "defaultValue": "1"
      },
      {
        "prop": "locale",
        "description": "日期、时间或数字格式使用的区域语言。",
        "type": "string",
        "defaultValue": "'zh-CN'"
      },
      {
        "prop": "formatOptions",
        "description": "传递给 Intl.NumberFormat 的数字格式化选项。",
        "type": "Intl.NumberFormatOptions",
        "defaultValue": "undefined"
      },
      {
        "prop": "size",
        "description": "设置控件尺寸。",
        "type": "DlSize",
        "defaultValue": "'md'"
      },
      {
        "prop": "disabled",
        "description": "是否禁用控件及其交互。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "readonly",
        "description": "是否只读；保留浏览能力但禁止修改。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "name",
        "description": "参与表单提交时使用的字段名称。",
        "type": "string",
        "defaultValue": "undefined"
      }
    ],
    "structures": []
  },
  "pagination": {
    "props": [
      {
        "prop": "page",
        "description": "当前页码；使用 v-model:page 双向绑定。",
        "type": "number",
        "defaultValue": "1"
      },
      {
        "prop": "total",
        "description": "数据总条数。",
        "type": "number",
        "defaultValue": "—"
      },
      {
        "prop": "itemsPerPage",
        "description": "每页显示的数据条数。",
        "type": "number",
        "defaultValue": "10"
      },
      {
        "prop": "siblingCount",
        "description": "当前页两侧保留显示的相邻页码数量。",
        "type": "number",
        "defaultValue": "1"
      },
      {
        "prop": "showEdges",
        "description": "是否显示首页与末页导航按钮。",
        "type": "boolean",
        "defaultValue": "true"
      },
      {
        "prop": "disabled",
        "description": "是否禁用控件及其交互。",
        "type": "boolean",
        "defaultValue": "false"
      }
    ],
    "structures": []
  },
  "pin-input": {
    "props": [
      {
        "prop": "modelValue",
        "description": "组件当前值；使用 v-model 进行双向绑定。",
        "type": "string[]",
        "defaultValue": "() => []"
      },
      {
        "prop": "length",
        "description": "需要渲染或允许输入的项目数量。",
        "type": "number",
        "defaultValue": "6"
      },
      {
        "prop": "placeholder",
        "description": "当前值为空时显示的占位提示。",
        "type": "string",
        "defaultValue": "'○'"
      },
      {
        "prop": "mask",
        "description": "是否隐藏输入字符。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "otp",
        "description": "是否启用一次性验证码输入行为。",
        "type": "boolean",
        "defaultValue": "true"
      },
      {
        "prop": "size",
        "description": "设置控件尺寸。",
        "type": "DlSize",
        "defaultValue": "'md'"
      },
      {
        "prop": "disabled",
        "description": "是否禁用控件及其交互。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "name",
        "description": "参与表单提交时使用的字段名称。",
        "type": "string",
        "defaultValue": "undefined"
      }
    ],
    "structures": []
  },
  "popover": {
    "props": [
      {
        "prop": "open",
        "description": "浮层或内容区域是否打开；使用 v-model:open 双向绑定。",
        "type": "boolean",
        "defaultValue": "undefined"
      },
      {
        "prop": "side",
        "description": "设置浮层相对触发器出现的方位。",
        "type": "'top' | 'right' | 'bottom' | 'left'",
        "defaultValue": "'bottom'"
      },
      {
        "prop": "align",
        "description": "设置浮层相对触发器的对齐方式。",
        "type": "'start' | 'center' | 'end'",
        "defaultValue": "'center'"
      },
      {
        "prop": "modal",
        "description": "是否启用模态交互与焦点限制。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "title",
        "description": "控件或浮层显示的标题。",
        "type": "string",
        "defaultValue": "undefined"
      },
      {
        "prop": "tone",
        "description": "设置语义色调。",
        "type": "DlTone",
        "defaultValue": "'default'"
      },
      {
        "prop": "closeLabel",
        "description": "关闭按钮的无障碍名称。",
        "type": "string",
        "defaultValue": "'关闭'"
      },
      {
        "prop": "zIndex",
        "description": "覆盖默认浮层层级；不传时由 Dragon Liquid 层级系统计算。",
        "type": "number",
        "defaultValue": "undefined"
      }
    ],
    "structures": []
  },
  "progress": {
    "props": [
      {
        "prop": "modelValue",
        "description": "组件当前值；使用 v-model 进行双向绑定。",
        "type": "number | null",
        "defaultValue": "null"
      },
      {
        "prop": "max",
        "description": "允许的最大值。",
        "type": "number",
        "defaultValue": "100"
      },
      {
        "prop": "label",
        "description": "控件的显示标签或无障碍名称。",
        "type": "string",
        "defaultValue": "undefined"
      },
      {
        "prop": "helper",
        "description": "显示在主内容下方的辅助说明。",
        "type": "string",
        "defaultValue": "undefined"
      },
      {
        "prop": "showValue",
        "description": "是否显示格式化后的当前数值。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "size",
        "description": "设置控件尺寸。",
        "type": "DlSize",
        "defaultValue": "'md'"
      },
      {
        "prop": "tone",
        "description": "设置语义色调。",
        "type": "DlTone",
        "defaultValue": "'default'"
      },
      {
        "prop": "status",
        "description": "设置业务状态及对应视觉反馈。",
        "type": "DlProgressStatus",
        "defaultValue": "'default'"
      }
    ],
    "structures": []
  },
  "radio-group": {
    "props": [
      {
        "prop": "modelValue",
        "description": "组件当前值；使用 v-model 进行双向绑定。",
        "type": "string",
        "defaultValue": "undefined"
      },
      {
        "prop": "options",
        "description": "可供用户选择的选项列表。",
        "type": "DlRadioOption[]",
        "defaultValue": "—"
      },
      {
        "prop": "orientation",
        "description": "设置控件的水平或垂直方向。",
        "type": "'horizontal' | 'vertical'",
        "defaultValue": "'vertical'"
      },
      {
        "prop": "size",
        "description": "设置控件尺寸。",
        "type": "DlSize",
        "defaultValue": "'md'"
      },
      {
        "prop": "disabled",
        "description": "是否禁用控件及其交互。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "name",
        "description": "参与表单提交时使用的字段名称。",
        "type": "string",
        "defaultValue": "undefined"
      },
      {
        "prop": "required",
        "description": "是否标记为表单必填项。",
        "type": "boolean",
        "defaultValue": "false"
      }
    ],
    "structures": [
      {
        "name": "DlRadioOption",
        "description": "Radio Group 中一个互斥选项的配置。",
        "rows": [
          {
            "prop": "value",
            "description": "表单提交或选择操作使用的值。",
            "type": "string",
            "defaultValue": "必填"
          },
          {
            "prop": "label",
            "description": "控件的显示标签或无障碍名称。",
            "type": "string",
            "defaultValue": "必填"
          },
          {
            "prop": "description",
            "description": "补充说明文字；不传时隐藏说明区域。",
            "type": "string",
            "defaultValue": "可选"
          },
          {
            "prop": "disabled",
            "description": "是否禁用控件及其交互。",
            "type": "boolean",
            "defaultValue": "可选"
          }
        ],
        "title": "DlRadioOption[]"
      }
    ]
  },
  "range-calendar": {
    "props": [
      {
        "prop": "modelValue",
        "description": "组件当前值；使用 v-model 进行双向绑定。",
        "type": "DateRange | null",
        "defaultValue": "null"
      },
      {
        "prop": "locale",
        "description": "日期、时间或数字格式使用的区域语言。",
        "type": "string",
        "defaultValue": "'zh-CN'"
      },
      {
        "prop": "weekStartsOn",
        "description": "一周起始日，0 表示星期日。",
        "type": "0 | 1 | 2 | 3 | 4 | 5 | 6",
        "defaultValue": "1"
      },
      {
        "prop": "fixedWeeks",
        "description": "是否固定显示完整的六周日期网格。",
        "type": "boolean",
        "defaultValue": "true"
      },
      {
        "prop": "numberOfMonths",
        "description": "同时显示的月份面板数量。",
        "type": "number",
        "defaultValue": "1"
      },
      {
        "prop": "disabled",
        "description": "是否禁用控件及其交互。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "readonly",
        "description": "是否只读；保留浏览能力但禁止修改。",
        "type": "boolean",
        "defaultValue": "false"
      }
    ],
    "structures": []
  },
  "rating": {
    "props": [
      {
        "prop": "modelValue",
        "description": "组件当前值；使用 v-model 进行双向绑定。",
        "type": "number",
        "defaultValue": "0"
      },
      {
        "prop": "length",
        "description": "需要渲染或允许输入的项目数量。",
        "type": "number",
        "defaultValue": "5"
      },
      {
        "prop": "step",
        "description": "每次操作改变的数值步长。",
        "type": "1 | 0.5 | 0.25 | 0.1",
        "defaultValue": "1"
      },
      {
        "prop": "clearable",
        "description": "是否允许再次操作以清空当前值。",
        "type": "boolean",
        "defaultValue": "true"
      },
      {
        "prop": "hoverable",
        "description": "是否在指针悬停时预览将要提交的评分。",
        "type": "boolean",
        "defaultValue": "true"
      },
      {
        "prop": "disabled",
        "description": "是否禁用控件及其交互。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "size",
        "description": "设置控件尺寸。",
        "type": "DlSize",
        "defaultValue": "'md'"
      },
      {
        "prop": "name",
        "description": "参与表单提交时使用的字段名称。",
        "type": "string",
        "defaultValue": "undefined"
      }
    ],
    "structures": []
  },
  "scroll-area": {
    "props": [
      {
        "prop": "type",
        "description": "设置组件的选择模式或原生类型。",
        "type": "'auto' | 'always' | 'scroll' | 'hover'",
        "defaultValue": "'hover'"
      },
      {
        "prop": "scrollHideDelay",
        "description": "停止滚动后隐藏滚动条的延迟时间，单位毫秒。",
        "type": "number",
        "defaultValue": "600"
      },
      {
        "prop": "horizontal",
        "description": "是否同时启用横向滚动。",
        "type": "boolean",
        "defaultValue": "false"
      }
    ],
    "structures": []
  },
  "select": {
    "props": [
      {
        "prop": "modelValue",
        "description": "组件当前值；使用 v-model 进行双向绑定。",
        "type": "string",
        "defaultValue": "undefined"
      },
      {
        "prop": "options",
        "description": "可供用户选择的选项列表。",
        "type": "DlSelectOption[]",
        "defaultValue": "—"
      },
      {
        "prop": "placeholder",
        "description": "当前值为空时显示的占位提示。",
        "type": "string",
        "defaultValue": "'请选择'"
      },
      {
        "prop": "size",
        "description": "设置控件尺寸。",
        "type": "DlSize",
        "defaultValue": "'md'"
      },
      {
        "prop": "disabled",
        "description": "是否禁用控件及其交互。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "name",
        "description": "参与表单提交时使用的字段名称。",
        "type": "string",
        "defaultValue": "undefined"
      },
      {
        "prop": "zIndex",
        "description": "覆盖默认浮层层级；不传时由 Dragon Liquid 层级系统计算。",
        "type": "number",
        "defaultValue": "undefined"
      }
    ],
    "structures": [
      {
        "name": "DlSelectOption",
        "description": "Select 下拉列表中的一个可选项目。",
        "rows": [
          {
            "prop": "label",
            "description": "控件的显示标签或无障碍名称。",
            "type": "string",
            "defaultValue": "必填"
          },
          {
            "prop": "value",
            "description": "表单提交或选择操作使用的值。",
            "type": "string",
            "defaultValue": "必填"
          },
          {
            "prop": "description",
            "description": "补充说明文字；不传时隐藏说明区域。",
            "type": "string",
            "defaultValue": "可选"
          },
          {
            "prop": "disabled",
            "description": "是否禁用控件及其交互。",
            "type": "boolean",
            "defaultValue": "可选"
          }
        ],
        "title": "DlSelectOption[]"
      }
    ]
  },
  "separator": {
    "props": [
      {
        "prop": "orientation",
        "description": "设置控件的水平或垂直方向。",
        "type": "'horizontal' | 'vertical'",
        "defaultValue": "'horizontal'"
      },
      {
        "prop": "decorative",
        "description": "是否仅作为视觉装饰并从无障碍树中隐藏。",
        "type": "boolean",
        "defaultValue": "true"
      },
      {
        "prop": "label",
        "description": "控件的显示标签或无障碍名称。",
        "type": "string",
        "defaultValue": "undefined"
      }
    ],
    "structures": []
  },
  "slider": {
    "props": [
      {
        "prop": "modelValue",
        "description": "组件当前值；使用 v-model 进行双向绑定。",
        "type": "number[]",
        "defaultValue": "() => [0]"
      },
      {
        "prop": "min",
        "description": "允许的最小值。",
        "type": "number",
        "defaultValue": "0"
      },
      {
        "prop": "max",
        "description": "允许的最大值。",
        "type": "number",
        "defaultValue": "100"
      },
      {
        "prop": "step",
        "description": "每次操作改变的数值步长。",
        "type": "number",
        "defaultValue": "1"
      },
      {
        "prop": "size",
        "description": "设置控件尺寸。",
        "type": "DlSize",
        "defaultValue": "'md'"
      },
      {
        "prop": "disabled",
        "description": "是否禁用控件及其交互。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "name",
        "description": "参与表单提交时使用的字段名称。",
        "type": "string",
        "defaultValue": "undefined"
      },
      {
        "prop": "required",
        "description": "是否标记为表单必填项。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "showValue",
        "description": "是否显示格式化后的当前数值。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "label",
        "description": "控件的显示标签或无障碍名称。",
        "type": "string",
        "defaultValue": "undefined"
      }
    ],
    "structures": []
  },
  "splitter": {
    "props": [
      {
        "prop": "panels",
        "description": "分割布局中各面板的尺寸与约束配置。",
        "type": "DlSplitterPanel[]",
        "defaultValue": "—"
      },
      {
        "prop": "direction",
        "description": "设置布局分割方向。",
        "type": "'horizontal' | 'vertical'",
        "defaultValue": "'horizontal'"
      },
      {
        "prop": "keyboardResizeBy",
        "description": "键盘操作每次调整面板的百分比。",
        "type": "number",
        "defaultValue": "10"
      }
    ],
    "structures": [
      {
        "name": "DlSplitterPanel",
        "description": "Splitter 中一个可调整面板的尺寸与折叠约束。",
        "rows": [
          {
            "prop": "id",
            "description": "控件或输入元素使用的唯一标识。",
            "type": "string",
            "defaultValue": "必填"
          },
          {
            "prop": "defaultSize",
            "description": "面板首次渲染时所占的尺寸百分比。",
            "type": "number",
            "defaultValue": "可选"
          },
          {
            "prop": "minSize",
            "description": "面板允许调整到的最小尺寸百分比。",
            "type": "number",
            "defaultValue": "可选"
          },
          {
            "prop": "maxSize",
            "description": "面板允许调整到的最大尺寸百分比。",
            "type": "number",
            "defaultValue": "可选"
          },
          {
            "prop": "collapsible",
            "description": "单选模式下是否允许收起当前已展开项。",
            "type": "boolean",
            "defaultValue": "可选"
          }
        ],
        "title": "DlSplitterPanel[]"
      }
    ]
  },
  "stepper": {
    "props": [
      {
        "prop": "modelValue",
        "description": "组件当前值；使用 v-model 进行双向绑定。",
        "type": "number",
        "defaultValue": "1"
      },
      {
        "prop": "items",
        "description": "用于渲染控件内容的结构化项目列表。",
        "type": "DlStepItem[]",
        "defaultValue": "—"
      },
      {
        "prop": "orientation",
        "description": "设置控件的水平或垂直方向。",
        "type": "'horizontal' | 'vertical'",
        "defaultValue": "'horizontal'"
      },
      {
        "prop": "linear",
        "description": "是否要求按顺序完成步骤。",
        "type": "boolean",
        "defaultValue": "false"
      }
    ],
    "structures": [
      {
        "name": "DlStepItem",
        "description": "Stepper 中一个流程步骤的标题与状态。",
        "rows": [
          {
            "prop": "step",
            "description": "每次操作改变的数值步长。",
            "type": "number",
            "defaultValue": "必填"
          },
          {
            "prop": "title",
            "description": "控件或浮层显示的标题。",
            "type": "string",
            "defaultValue": "必填"
          },
          {
            "prop": "description",
            "description": "补充说明文字；不传时隐藏说明区域。",
            "type": "string",
            "defaultValue": "可选"
          },
          {
            "prop": "disabled",
            "description": "是否禁用控件及其交互。",
            "type": "boolean",
            "defaultValue": "可选"
          },
          {
            "prop": "completed",
            "description": "该步骤是否已经完成。",
            "type": "boolean",
            "defaultValue": "可选"
          }
        ],
        "title": "DlStepItem[]"
      }
    ]
  },
  "switch": {
    "props": [
      {
        "prop": "modelValue",
        "description": "组件当前值；使用 v-model 进行双向绑定。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "label",
        "description": "控件的显示标签或无障碍名称。",
        "type": "string",
        "defaultValue": "undefined"
      },
      {
        "prop": "description",
        "description": "补充说明文字；不传时隐藏说明区域。",
        "type": "string",
        "defaultValue": "undefined"
      },
      {
        "prop": "size",
        "description": "设置控件尺寸。",
        "type": "DlSize",
        "defaultValue": "'md'"
      },
      {
        "prop": "disabled",
        "description": "是否禁用控件及其交互。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "name",
        "description": "参与表单提交时使用的字段名称。",
        "type": "string",
        "defaultValue": "undefined"
      },
      {
        "prop": "required",
        "description": "是否标记为表单必填项。",
        "type": "boolean",
        "defaultValue": "false"
      }
    ],
    "structures": []
  },
  "tabs": {
    "props": [
      {
        "prop": "modelValue",
        "description": "组件当前值；使用 v-model 进行双向绑定。",
        "type": "string",
        "defaultValue": "undefined"
      },
      {
        "prop": "items",
        "description": "用于渲染控件内容的结构化项目列表。",
        "type": "DlTabItem[]",
        "defaultValue": "—"
      },
      {
        "prop": "orientation",
        "description": "设置控件的水平或垂直方向。",
        "type": "'horizontal' | 'vertical'",
        "defaultValue": "'horizontal'"
      },
      {
        "prop": "activationMode",
        "description": "设置组件进入激活或编辑状态的方式。",
        "type": "'automatic' | 'manual'",
        "defaultValue": "'automatic'"
      },
      {
        "prop": "size",
        "description": "设置控件尺寸。",
        "type": "DlSize",
        "defaultValue": "'md'"
      }
    ],
    "structures": [
      {
        "name": "DlTabItem",
        "description": "Tabs 中一个标签及对应内容入口的配置。",
        "rows": [
          {
            "prop": "value",
            "description": "表单提交或选择操作使用的值。",
            "type": "string",
            "defaultValue": "必填"
          },
          {
            "prop": "label",
            "description": "控件的显示标签或无障碍名称。",
            "type": "string",
            "defaultValue": "必填"
          },
          {
            "prop": "description",
            "description": "补充说明文字；不传时隐藏说明区域。",
            "type": "string",
            "defaultValue": "可选"
          },
          {
            "prop": "disabled",
            "description": "是否禁用控件及其交互。",
            "type": "boolean",
            "defaultValue": "可选"
          }
        ],
        "title": "DlTabItem[]"
      }
    ]
  },
  "tags-input": {
    "props": [
      {
        "prop": "modelValue",
        "description": "组件当前值；使用 v-model 进行双向绑定。",
        "type": "string[]",
        "defaultValue": "() => []"
      },
      {
        "prop": "placeholder",
        "description": "当前值为空时显示的占位提示。",
        "type": "string",
        "defaultValue": "'输入后按 Enter'"
      },
      {
        "prop": "disabled",
        "description": "是否禁用控件及其交互。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "max",
        "description": "允许的最大值。",
        "type": "number",
        "defaultValue": "undefined"
      },
      {
        "prop": "delimiter",
        "description": "输入多个值时用于分隔内容的字符。",
        "type": "string",
        "defaultValue": "'"
      },
      {
        "prop": "clearable",
        "description": "是否允许再次操作以清空当前值。",
        "type": "boolean",
        "defaultValue": "true"
      },
      {
        "prop": "name",
        "description": "参与表单提交时使用的字段名称。",
        "type": "string",
        "defaultValue": "undefined"
      }
    ],
    "structures": []
  },
  "textarea": {
    "props": [
      {
        "prop": "modelValue",
        "description": "组件当前值；使用 v-model 进行双向绑定。",
        "type": "string | null",
        "defaultValue": "''"
      },
      {
        "prop": "size",
        "description": "设置控件尺寸。",
        "type": "DlSize",
        "defaultValue": "'md'"
      },
      {
        "prop": "status",
        "description": "设置业务状态及对应视觉反馈。",
        "type": "'default' | 'success' | 'warning' | 'error'",
        "defaultValue": "'default'"
      },
      {
        "prop": "disabled",
        "description": "是否禁用控件及其交互。",
        "type": "boolean",
        "defaultValue": "false"
      }
    ],
    "structures": []
  },
  "time-field": {
    "props": [
      {
        "prop": "modelValue",
        "description": "组件当前值；使用 v-model 进行双向绑定。",
        "type": "TimeValue | null",
        "defaultValue": "null"
      },
      {
        "prop": "locale",
        "description": "日期、时间或数字格式使用的区域语言。",
        "type": "string",
        "defaultValue": "'zh-CN'"
      },
      {
        "prop": "granularity",
        "description": "允许编辑到的最小日期或时间粒度。",
        "type": "'hour' | 'minute' | 'second'",
        "defaultValue": "'minute'"
      },
      {
        "prop": "hourCycle",
        "description": "时间字段使用 12 小时制或 24 小时制。",
        "type": "12 | 24",
        "defaultValue": "24"
      },
      {
        "prop": "disabled",
        "description": "是否禁用控件及其交互。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "readonly",
        "description": "是否只读；保留浏览能力但禁止修改。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "name",
        "description": "参与表单提交时使用的字段名称。",
        "type": "string",
        "defaultValue": "undefined"
      },
      {
        "prop": "id",
        "description": "控件或输入元素使用的唯一标识。",
        "type": "string",
        "defaultValue": "undefined"
      }
    ],
    "structures": []
  },
  "time-range-field": {
    "props": [
      {
        "prop": "modelValue",
        "description": "组件当前值；使用 v-model 进行双向绑定。",
        "type": "DlTimeRange | null",
        "defaultValue": "null"
      },
      {
        "prop": "locale",
        "description": "日期、时间或数字格式使用的区域语言。",
        "type": "string",
        "defaultValue": "'zh-CN'"
      },
      {
        "prop": "granularity",
        "description": "允许编辑到的最小日期或时间粒度。",
        "type": "'hour' | 'minute' | 'second'",
        "defaultValue": "'minute'"
      },
      {
        "prop": "hourCycle",
        "description": "时间字段使用 12 小时制或 24 小时制。",
        "type": "12 | 24",
        "defaultValue": "24"
      },
      {
        "prop": "disabled",
        "description": "是否禁用控件及其交互。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "readonly",
        "description": "是否只读；保留浏览能力但禁止修改。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "name",
        "description": "参与表单提交时使用的字段名称。",
        "type": "string",
        "defaultValue": "undefined"
      }
    ],
    "structures": []
  },
  "toast": {
    "props": [
      {
        "prop": "open",
        "description": "浮层或内容区域是否打开；使用 v-model:open 双向绑定。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "title",
        "description": "控件或浮层显示的标题。",
        "type": "string",
        "defaultValue": "—"
      },
      {
        "prop": "description",
        "description": "补充说明文字；不传时隐藏说明区域。",
        "type": "string",
        "defaultValue": "undefined"
      },
      {
        "prop": "duration",
        "description": "内容自动关闭前的停留时间，单位毫秒。",
        "type": "number",
        "defaultValue": "5000"
      },
      {
        "prop": "tone",
        "description": "设置语义色调。",
        "type": "DlTone",
        "defaultValue": "'default'"
      },
      {
        "prop": "size",
        "description": "设置控件尺寸。",
        "type": "DlSize",
        "defaultValue": "'md'"
      },
      {
        "prop": "icon",
        "description": "自定义状态图标；不传时按色调选择默认图标。",
        "type": "string",
        "defaultValue": "undefined"
      },
      {
        "prop": "closable",
        "description": "是否显示并允许使用关闭操作。",
        "type": "boolean",
        "defaultValue": "true"
      },
      {
        "prop": "actionLabel",
        "description": "操作按钮显示的文字；不传时不显示该操作。",
        "type": "string",
        "defaultValue": "undefined"
      },
      {
        "prop": "closeLabel",
        "description": "关闭按钮的无障碍名称。",
        "type": "string",
        "defaultValue": "'关闭通知'"
      },
      {
        "prop": "showProgress",
        "description": "是否显示随持续时间递减的进度指示。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "progress",
        "description": "自定义进度百分比。",
        "type": "number",
        "defaultValue": "100"
      },
      {
        "prop": "zIndex",
        "description": "覆盖默认浮层层级；不传时由 Dragon Liquid 层级系统计算。",
        "type": "number",
        "defaultValue": "undefined"
      }
    ],
    "structures": []
  },
  "toggle": {
    "props": [
      {
        "prop": "modelValue",
        "description": "组件当前值；使用 v-model 进行双向绑定。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "size",
        "description": "设置控件尺寸。",
        "type": "DlSize",
        "defaultValue": "'md'"
      },
      {
        "prop": "disabled",
        "description": "是否禁用控件及其交互。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "ariaLabel",
        "description": "提供给辅助技术读取的控件名称。",
        "type": "string",
        "defaultValue": "undefined"
      }
    ],
    "structures": []
  },
  "toggle-group": {
    "props": [
      {
        "prop": "modelValue",
        "description": "组件当前值；使用 v-model 进行双向绑定。",
        "type": "string | string[]",
        "defaultValue": "undefined"
      },
      {
        "prop": "items",
        "description": "用于渲染控件内容的结构化项目列表。",
        "type": "DlChoiceOption[]",
        "defaultValue": "—"
      },
      {
        "prop": "type",
        "description": "设置组件的选择模式或原生类型。",
        "type": "'single' | 'multiple'",
        "defaultValue": "'single'"
      },
      {
        "prop": "orientation",
        "description": "设置控件的水平或垂直方向。",
        "type": "'horizontal' | 'vertical'",
        "defaultValue": "'horizontal'"
      },
      {
        "prop": "size",
        "description": "设置控件尺寸。",
        "type": "DlSize",
        "defaultValue": "'md'"
      },
      {
        "prop": "disabled",
        "description": "是否禁用控件及其交互。",
        "type": "boolean",
        "defaultValue": "false"
      }
    ],
    "structures": [
      {
        "name": "DlChoiceOption",
        "description": "列表、组合框或切换组使用的通用选择项。",
        "rows": [
          {
            "prop": "value",
            "description": "表单提交或选择操作使用的值。",
            "type": "string",
            "defaultValue": "必填"
          },
          {
            "prop": "label",
            "description": "控件的显示标签或无障碍名称。",
            "type": "string",
            "defaultValue": "必填"
          },
          {
            "prop": "description",
            "description": "补充说明文字；不传时隐藏说明区域。",
            "type": "string",
            "defaultValue": "可选"
          },
          {
            "prop": "disabled",
            "description": "是否禁用控件及其交互。",
            "type": "boolean",
            "defaultValue": "可选"
          }
        ],
        "title": "DlChoiceOption[]"
      }
    ]
  },
  "toolbar": {
    "props": [
      {
        "prop": "items",
        "description": "用于渲染控件内容的结构化项目列表。",
        "type": "DlMenuItem[]",
        "defaultValue": "—"
      },
      {
        "prop": "orientation",
        "description": "设置控件的水平或垂直方向。",
        "type": "'horizontal' | 'vertical'",
        "defaultValue": "'horizontal'"
      },
      {
        "prop": "loop",
        "description": "键盘导航到边界时是否循环。",
        "type": "boolean",
        "defaultValue": "true"
      }
    ],
    "structures": [
      {
        "name": "DlMenuItem",
        "description": "菜单、下拉菜单、上下文菜单与工具栏使用的命令项。",
        "rows": [
          {
            "prop": "value",
            "description": "表单提交或选择操作使用的值。",
            "type": "string",
            "defaultValue": "必填"
          },
          {
            "prop": "label",
            "description": "控件的显示标签或无障碍名称。",
            "type": "string",
            "defaultValue": "必填"
          },
          {
            "prop": "shortcut",
            "description": "菜单命令旁展示的键盘快捷键说明。",
            "type": "string",
            "defaultValue": "可选"
          },
          {
            "prop": "disabled",
            "description": "是否禁用控件及其交互。",
            "type": "boolean",
            "defaultValue": "可选"
          },
          {
            "prop": "separator",
            "description": "是否将该项目渲染为菜单分隔线。",
            "type": "boolean",
            "defaultValue": "可选"
          }
        ],
        "title": "DlMenuItem[]"
      }
    ]
  },
  "tooltip": {
    "props": [
      {
        "prop": "text",
        "description": "控件显示的主要文字内容。",
        "type": "string",
        "defaultValue": "''"
      },
      {
        "prop": "title",
        "description": "控件或浮层显示的标题。",
        "type": "string",
        "defaultValue": "undefined"
      },
      {
        "prop": "tone",
        "description": "设置语义色调。",
        "type": "DlTone",
        "defaultValue": "'default'"
      },
      {
        "prop": "side",
        "description": "设置浮层相对触发器出现的方位。",
        "type": "'top' | 'right' | 'bottom' | 'left'",
        "defaultValue": "'top'"
      },
      {
        "prop": "align",
        "description": "设置浮层相对触发器的对齐方式。",
        "type": "'start' | 'center' | 'end'",
        "defaultValue": "'center'"
      },
      {
        "prop": "delayDuration",
        "description": "触发后显示浮层的延迟时间，单位毫秒。",
        "type": "number",
        "defaultValue": "350"
      },
      {
        "prop": "skipDelayDuration",
        "description": "连续触发提示时跳过延迟的有效时间，单位毫秒。",
        "type": "number",
        "defaultValue": "300"
      },
      {
        "prop": "disabled",
        "description": "是否禁用控件及其交互。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "maxWidth",
        "description": "浮层内容允许使用的最大宽度。",
        "type": "number | string",
        "defaultValue": "280"
      },
      {
        "prop": "zIndex",
        "description": "覆盖默认浮层层级；不传时由 Dragon Liquid 层级系统计算。",
        "type": "number",
        "defaultValue": "undefined"
      }
    ],
    "structures": []
  },
  "tree": {
    "props": [
      {
        "prop": "modelValue",
        "description": "组件当前值；使用 v-model 进行双向绑定。",
        "type": "DlTreeNode | DlTreeNode[]",
        "defaultValue": "undefined"
      },
      {
        "prop": "items",
        "description": "用于渲染控件内容的结构化项目列表。",
        "type": "DlTreeNode[]",
        "defaultValue": "—"
      },
      {
        "prop": "expanded",
        "description": "当前已展开节点的标识列表。",
        "type": "string[]",
        "defaultValue": "() => []"
      },
      {
        "prop": "multiple",
        "description": "是否允许同时选择多个值。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "disabled",
        "description": "是否禁用控件及其交互。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "propagateSelect",
        "description": "选中节点时是否同步选择其子节点。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "bubbleSelect",
        "description": "选中节点时是否向父节点冒泡选择状态。",
        "type": "boolean",
        "defaultValue": "false"
      }
    ],
    "structures": [
      {
        "name": "DlTreeNode",
        "description": "Tree 使用的可递归树节点。",
        "rows": [
          {
            "prop": "id",
            "description": "控件或输入元素使用的唯一标识。",
            "type": "string",
            "defaultValue": "必填"
          },
          {
            "prop": "label",
            "description": "控件的显示标签或无障碍名称。",
            "type": "string",
            "defaultValue": "必填"
          },
          {
            "prop": "description",
            "description": "补充说明文字；不传时隐藏说明区域。",
            "type": "string",
            "defaultValue": "可选"
          },
          {
            "prop": "disabled",
            "description": "是否禁用控件及其交互。",
            "type": "boolean",
            "defaultValue": "可选"
          },
          {
            "prop": "children",
            "description": "当前节点或导航项包含的下一级项目。",
            "type": "DlTreeNode[]",
            "defaultValue": "可选"
          }
        ],
        "title": "DlTreeNode[]"
      }
    ]
  },
  "year-picker": {
    "props": [
      {
        "prop": "modelValue",
        "description": "组件当前值；使用 v-model 进行双向绑定。",
        "type": "DateValue | DateValue[] | null",
        "defaultValue": "null"
      },
      {
        "prop": "locale",
        "description": "日期、时间或数字格式使用的区域语言。",
        "type": "string",
        "defaultValue": "'zh-CN'"
      },
      {
        "prop": "multiple",
        "description": "是否允许同时选择多个值。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "disabled",
        "description": "是否禁用控件及其交互。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "readonly",
        "description": "是否只读；保留浏览能力但禁止修改。",
        "type": "boolean",
        "defaultValue": "false"
      }
    ],
    "structures": []
  },
  "year-range-picker": {
    "props": [
      {
        "prop": "modelValue",
        "description": "组件当前值；使用 v-model 进行双向绑定。",
        "type": "DateRange | null",
        "defaultValue": "null"
      },
      {
        "prop": "locale",
        "description": "日期、时间或数字格式使用的区域语言。",
        "type": "string",
        "defaultValue": "'zh-CN'"
      },
      {
        "prop": "disabled",
        "description": "是否禁用控件及其交互。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "readonly",
        "description": "是否只读；保留浏览能力但禁止修改。",
        "type": "boolean",
        "defaultValue": "false"
      }
    ],
    "structures": []
  }
} as const
