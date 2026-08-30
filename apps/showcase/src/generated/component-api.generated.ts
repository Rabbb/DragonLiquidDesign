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
    "relatedTypes": [
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
            "description": "从指定内容属性解析出的默认插槽文本。",
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
        "kind": "structure",
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
    "relatedTypes": []
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
    "relatedTypes": []
  },
  "autocomplete": {
    "props": [
      {
        "prop": "open",
        "description": "浮层或内容区域是否打开；使用 v-model:open 双向绑定。",
        "type": "boolean",
        "defaultValue": "undefined"
      },
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
    "relatedTypes": [
      {
        "kind": "enum",
        "name": "DlSize",
        "title": "DlSize",
        "description": "组件可用的标准尺寸。",
        "rows": [
          {
            "prop": "sm",
            "description": "紧凑尺寸，适合密集界面和次要操作。",
            "type": "'sm'",
            "defaultValue": "紧凑"
          },
          {
            "prop": "md",
            "description": "默认尺寸，适合大多数常规界面。",
            "type": "'md'",
            "defaultValue": "标准"
          },
          {
            "prop": "lg",
            "description": "放大尺寸，适合重点内容和宽松布局。",
            "type": "'lg'",
            "defaultValue": "宽松"
          }
        ]
      }
    ]
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
    "relatedTypes": [
      {
        "kind": "enum",
        "name": "DlSize",
        "title": "DlSize",
        "description": "组件可用的标准尺寸。",
        "rows": [
          {
            "prop": "sm",
            "description": "紧凑尺寸，适合密集界面和次要操作。",
            "type": "'sm'",
            "defaultValue": "紧凑"
          },
          {
            "prop": "md",
            "description": "默认尺寸，适合大多数常规界面。",
            "type": "'md'",
            "defaultValue": "标准"
          },
          {
            "prop": "lg",
            "description": "放大尺寸，适合重点内容和宽松布局。",
            "type": "'lg'",
            "defaultValue": "宽松"
          }
        ]
      }
    ]
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
    "relatedTypes": [
      {
        "kind": "enum",
        "name": "DlTone",
        "title": "DlTone",
        "description": "Dragon Liquid 组件共享的语义色调。",
        "rows": [
          {
            "prop": "default",
            "description": "默认中性色调，适合普通信息与基础状态。",
            "type": "'default'",
            "defaultValue": "中性"
          },
          {
            "prop": "accent",
            "description": "强调色调，适合品牌重点、当前任务或推荐内容。",
            "type": "'accent'",
            "defaultValue": "强调"
          },
          {
            "prop": "success",
            "description": "成功色调，表示任务已经正确完成。",
            "type": "'success'",
            "defaultValue": "成功"
          },
          {
            "prop": "warning",
            "description": "警告色调，提示可恢复且需要留意的问题。",
            "type": "'warning'",
            "defaultValue": "警告"
          },
          {
            "prop": "danger",
            "description": "危险色调，表示失败、破坏性操作或高风险状态。",
            "type": "'danger'",
            "defaultValue": "危险"
          },
          {
            "prop": "muted",
            "description": "弱化色调，适合低优先级、只读或后台信息。",
            "type": "'muted'",
            "defaultValue": "弱化"
          }
        ]
      },
      {
        "kind": "enum",
        "name": "DlSize",
        "title": "DlSize",
        "description": "组件可用的标准尺寸。",
        "rows": [
          {
            "prop": "sm",
            "description": "紧凑尺寸，适合密集界面和次要操作。",
            "type": "'sm'",
            "defaultValue": "紧凑"
          },
          {
            "prop": "md",
            "description": "默认尺寸，适合大多数常规界面。",
            "type": "'md'",
            "defaultValue": "标准"
          },
          {
            "prop": "lg",
            "description": "放大尺寸，适合重点内容和宽松布局。",
            "type": "'lg'",
            "defaultValue": "宽松"
          }
        ]
      }
    ]
  },
  "breadcrumbs": {
    "props": [
      {
        "prop": "items",
        "description": "用于渲染控件内容的结构化项目列表。",
        "type": "DlBreadcrumbItem[]",
        "defaultValue": "—"
      },
      {
        "prop": "separator",
        "description": "是否将该项目渲染为菜单分隔线。",
        "type": "string",
        "defaultValue": "'/'"
      }
    ],
    "relatedTypes": []
  },
  "button": {
    "props": [
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
    "relatedTypes": [
      {
        "kind": "enum",
        "name": "DlSize",
        "title": "DlSize",
        "description": "组件可用的标准尺寸。",
        "rows": [
          {
            "prop": "sm",
            "description": "紧凑尺寸，适合密集界面和次要操作。",
            "type": "'sm'",
            "defaultValue": "紧凑"
          },
          {
            "prop": "md",
            "description": "默认尺寸，适合大多数常规界面。",
            "type": "'md'",
            "defaultValue": "标准"
          },
          {
            "prop": "lg",
            "description": "放大尺寸，适合重点内容和宽松布局。",
            "type": "'lg'",
            "defaultValue": "宽松"
          }
        ]
      }
    ]
  },
  "calendar": {
    "props": [
      {
        "prop": "modelValue",
        "description": "组件当前值；使用 v-model 进行双向绑定。",
        "type": "string | null",
        "defaultValue": "null"
      },
      {
        "prop": "viewValue",
        "description": "月历当前浏览的 YYYY-MM 月份；使用 v-model:view-value 双向绑定。",
        "type": "string",
        "defaultValue": "undefined"
      },
      {
        "prop": "items",
        "description": "用于渲染控件内容的结构化项目列表。",
        "type": "DlCalendarItem[]",
        "defaultValue": "() => []"
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
        "prop": "showOutsideDays",
        "description": "是否显示当前月份之外的补齐日期。",
        "type": "boolean",
        "defaultValue": "true"
      },
      {
        "prop": "showToolbar",
        "description": "是否显示格式操作和视图模式工具栏。",
        "type": "boolean",
        "defaultValue": "true"
      },
      {
        "prop": "showToday",
        "description": "是否在月历工具栏显示返回今天操作。",
        "type": "boolean",
        "defaultValue": "true"
      },
      {
        "prop": "showCreate",
        "description": "是否在日期单元格中显示新建事项入口。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "todayLabel",
        "description": "月历工具栏返回今天按钮显示的文字。",
        "type": "string",
        "defaultValue": "'今天'"
      },
      {
        "prop": "createLabel",
        "description": "日历单元格新建按钮使用的无障碍名称。",
        "type": "string",
        "defaultValue": "'新建'"
      },
      {
        "prop": "dayMinHeight",
        "description": "月历中每个日期单元格允许使用的最小高度，单位像素。",
        "type": "number",
        "defaultValue": "112"
      },
      {
        "prop": "height",
        "description": "窗口或区域的高度。",
        "type": "string | number",
        "defaultValue": "undefined"
      },
      {
        "prop": "draggable",
        "description": "是否允许在桌面视口中拖动标题栏或拖动柄来移动对话框。",
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
    "relatedTypes": [
      {
        "name": "DlCalendarItem",
        "description": "Calendar 在指定日期单元格中展示、点击和拖动的业务事项。",
        "rows": [
          {
            "prop": "id",
            "description": "控件或输入元素使用的唯一标识。",
            "type": "string | number",
            "defaultValue": "必填"
          },
          {
            "prop": "date",
            "description": "设置 date 字段。",
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
            "prop": "color",
            "description": "要展示或编辑的颜色值。",
            "type": "string",
            "defaultValue": "可选"
          },
          {
            "prop": "kind",
            "description": "设置 kind 字段。",
            "type": "string",
            "defaultValue": "可选"
          },
          {
            "prop": "completed",
            "description": "该步骤是否已经完成。",
            "type": "boolean",
            "defaultValue": "可选"
          },
          {
            "prop": "draggable",
            "description": "是否允许在桌面视口中拖动标题栏或拖动柄来移动对话框。",
            "type": "boolean",
            "defaultValue": "可选"
          },
          {
            "prop": "disabled",
            "description": "是否禁用控件及其交互。",
            "type": "boolean",
            "defaultValue": "可选"
          },
          {
            "prop": "meta",
            "description": "设置 meta 字段。",
            "type": "unknown",
            "defaultValue": "可选"
          }
        ],
        "kind": "structure",
        "title": "DlCalendarItem[]"
      }
    ]
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
        "prop": "disabled",
        "description": "是否禁用控件及其交互。",
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
    "relatedTypes": []
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
    "relatedTypes": [
      {
        "kind": "enum",
        "name": "DlSize",
        "title": "DlSize",
        "description": "组件可用的标准尺寸。",
        "rows": [
          {
            "prop": "sm",
            "description": "紧凑尺寸，适合密集界面和次要操作。",
            "type": "'sm'",
            "defaultValue": "紧凑"
          },
          {
            "prop": "md",
            "description": "默认尺寸，适合大多数常规界面。",
            "type": "'md'",
            "defaultValue": "标准"
          },
          {
            "prop": "lg",
            "description": "放大尺寸，适合重点内容和宽松布局。",
            "type": "'lg'",
            "defaultValue": "宽松"
          }
        ]
      }
    ]
  },
  "choice-portal": {
    "props": [
      {
        "prop": "open",
        "description": "浮层或内容区域是否打开；使用 v-model:open 双向绑定。",
        "type": "boolean",
        "defaultValue": "undefined"
      },
      {
        "prop": "modelValue",
        "description": "组件当前值；使用 v-model 进行双向绑定。",
        "type": "string",
        "defaultValue": "''"
      },
      {
        "prop": "options",
        "description": "可供用户选择的选项列表。",
        "type": "DlChoicePortalEntry[]",
        "defaultValue": "—"
      },
      {
        "prop": "placeholder",
        "description": "当前值为空时显示的占位提示。",
        "type": "string",
        "defaultValue": "'请选择'"
      },
      {
        "prop": "searchPlaceholder",
        "description": "搜索输入框为空时显示的提示文字。",
        "type": "string",
        "defaultValue": "'搜索名称、值或关键词'"
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
        "type": "ChoicePortalStatus",
        "defaultValue": "'default'"
      },
      {
        "prop": "overlay",
        "description": "设置浮层固定为模态面板、底部抽屉或按视口自动适配。",
        "type": "DlChoicePortalOverlay",
        "defaultValue": "'auto'"
      },
      {
        "prop": "searchable",
        "description": "是否始终显示选项搜索框；不传时根据选项数量自动判断。",
        "type": "boolean",
        "defaultValue": "undefined"
      },
      {
        "prop": "searchThreshold",
        "description": "自动启用搜索框所需的最少选项数量。",
        "type": "number",
        "defaultValue": "8"
      },
      {
        "prop": "clearable",
        "description": "是否允许再次操作以清空当前值。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "allowCustom",
        "description": "是否允许把清理后的搜索文字作为自定义选项提交。",
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
    "relatedTypes": [
      {
        "kind": "enum",
        "name": "DlSize",
        "title": "DlSize",
        "description": "组件可用的标准尺寸。",
        "rows": [
          {
            "prop": "sm",
            "description": "紧凑尺寸，适合密集界面和次要操作。",
            "type": "'sm'",
            "defaultValue": "紧凑"
          },
          {
            "prop": "md",
            "description": "默认尺寸，适合大多数常规界面。",
            "type": "'md'",
            "defaultValue": "标准"
          },
          {
            "prop": "lg",
            "description": "放大尺寸，适合重点内容和宽松布局。",
            "type": "'lg'",
            "defaultValue": "宽松"
          }
        ]
      }
    ]
  },
  "cluster": {
    "props": [
      {
        "prop": "as",
        "description": "设置 as 属性。",
        "type": "string",
        "defaultValue": "'div'"
      },
      {
        "prop": "gap",
        "description": "设置 gap 属性。",
        "type": "'none' | 'xs' | 'sm' | 'md' | 'lg'",
        "defaultValue": "'sm'"
      },
      {
        "prop": "align",
        "description": "设置浮层相对触发器的对齐方式。",
        "type": "'start' | 'center' | 'end' | 'baseline' | 'stretch'",
        "defaultValue": "'center'"
      },
      {
        "prop": "justify",
        "description": "设置 justify 属性。",
        "type": "'start' | 'center' | 'end' | 'between' | 'around'",
        "defaultValue": "'start'"
      },
      {
        "prop": "wrap",
        "description": "设置 wrap 属性。",
        "type": "boolean",
        "defaultValue": "true"
      }
    ],
    "relatedTypes": []
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
    "relatedTypes": []
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
      },
      {
        "prop": "size",
        "description": "设置控件尺寸。",
        "type": "'sm' | 'md' | 'lg'",
        "defaultValue": "'md'"
      }
    ],
    "relatedTypes": []
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
        "prop": "format",
        "description": "完整颜色值提交和显示时使用的 HEX、RGB、HSL 或 HSB 格式。",
        "type": "DlColorFormat",
        "defaultValue": "'hex'"
      },
      {
        "prop": "formatOptions",
        "description": "格式切换入口中允许用户选择的颜色格式列表。",
        "type": "readonly DlColorFormat[]",
        "defaultValue": "() => ['hex', 'rgb', 'hsl', 'hsb']"
      },
      {
        "prop": "channel",
        "description": "当前编辑或滑动控制的颜色通道。",
        "type": "ColorChannel",
        "defaultValue": "undefined"
      },
      {
        "prop": "label",
        "description": "控件的显示标签或无障碍名称。",
        "type": "string",
        "defaultValue": "undefined"
      },
      {
        "prop": "hint",
        "description": "显示在标签下方的格式或操作提示。",
        "type": "string",
        "defaultValue": "undefined"
      },
      {
        "prop": "error",
        "description": "字段的外部校验错误；显示文字反馈并标记 aria-invalid。",
        "type": "string",
        "defaultValue": "undefined"
      },
      {
        "prop": "placeholder",
        "description": "当前值为空时显示的占位提示。",
        "type": "string",
        "defaultValue": "undefined"
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
        "prop": "required",
        "description": "是否标记为表单必填项。",
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
        "prop": "allowAlpha",
        "description": "是否保留输入颜色中的透明度通道；关闭时统一输出不透明颜色。",
        "type": "boolean",
        "defaultValue": "true"
      },
      {
        "prop": "showPreview",
        "description": "是否在颜色字段内显示实时颜色预览。",
        "type": "boolean",
        "defaultValue": "true"
      },
      {
        "prop": "showFormat",
        "description": "是否显示颜色格式切换入口。",
        "type": "boolean",
        "defaultValue": "true"
      },
      {
        "prop": "copyable",
        "description": "是否提供复制当前值的快捷按钮。",
        "type": "boolean",
        "defaultValue": "true"
      },
      {
        "prop": "step",
        "description": "每次操作改变的数值步长。",
        "type": "number",
        "defaultValue": "undefined"
      },
      {
        "prop": "disableWheelChange",
        "description": "是否阻止滚轮误改独立颜色通道；方向键仍可微调。",
        "type": "boolean",
        "defaultValue": "true"
      }
    ],
    "relatedTypes": [
      {
        "kind": "enum",
        "name": "DlColorFormat",
        "title": "DlColorFormat",
        "description": "ColorField 支持的颜色字符串输出格式。",
        "rows": [
          {
            "prop": "hex",
            "description": "十六进制颜色；透明时输出八位 HEX。",
            "type": "'hex'",
            "defaultValue": "HEX"
          },
          {
            "prop": "rgb",
            "description": "CSS rgb() 颜色格式。",
            "type": "'rgb'",
            "defaultValue": "RGB"
          },
          {
            "prop": "hsl",
            "description": "CSS hsl() 颜色格式。",
            "type": "'hsl'",
            "defaultValue": "HSL"
          },
          {
            "prop": "hsb",
            "description": "色相、饱和度、亮度颜色格式。",
            "type": "'hsb'",
            "defaultValue": "HSB"
          }
        ]
      }
    ]
  },
  "color-picker": {
    "props": [
      {
        "prop": "open",
        "description": "浮层或内容区域是否打开；使用 v-model:open 双向绑定。",
        "type": "boolean",
        "defaultValue": "undefined"
      },
      {
        "prop": "modelValue",
        "description": "组件当前值；使用 v-model 进行双向绑定。",
        "type": "string",
        "defaultValue": "'#ff8c00'"
      },
      {
        "prop": "format",
        "description": "浮层内 ColorField 提交和显示时使用的 HEX、RGB、HSL 或 HSB 格式。",
        "type": "DlColorFormat",
        "defaultValue": "'hex'"
      },
      {
        "prop": "formatOptions",
        "description": "浮层内颜色格式切换入口允许选择的格式列表。",
        "type": "readonly DlColorFormat[]",
        "defaultValue": "() => ['hex', 'rgb', 'hsl', 'hsb']"
      },
      {
        "prop": "colorSpace",
        "description": "颜色值采用的色彩空间。",
        "type": "ColorSpace",
        "defaultValue": "'hsl'"
      },
      {
        "prop": "label",
        "description": "控件的显示标签或无障碍名称。",
        "type": "string",
        "defaultValue": "undefined"
      },
      {
        "prop": "hint",
        "description": "显示在标签下方的格式或操作提示。",
        "type": "string",
        "defaultValue": "undefined"
      },
      {
        "prop": "placeholder",
        "description": "当前值为空时显示的占位提示。",
        "type": "string",
        "defaultValue": "'选择颜色'"
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
        "prop": "required",
        "description": "是否标记为表单必填项。",
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
        "prop": "allowAlpha",
        "description": "是否保留输入颜色中的透明度通道；关闭时统一输出不透明颜色。",
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
        "prop": "orientation",
        "description": "设置完整选色面板的布局方向；默认横向并排，纵向仅用于窄空间等特殊场景。",
        "type": "'horizontal' | 'vertical'",
        "defaultValue": "'horizontal'"
      },
      {
        "prop": "side",
        "description": "设置浮层相对触发器出现的方位。",
        "type": "DlOverlaySide | DlOverlayBaseSide",
        "defaultValue": "'bottom'"
      },
      {
        "prop": "align",
        "description": "设置浮层相对触发器的对齐方式。",
        "type": "'start' | 'center' | 'end'",
        "defaultValue": "'start'"
      },
      {
        "prop": "title",
        "description": "颜色选择浮层的标题；不传时使用“选择颜色”。",
        "type": "string",
        "defaultValue": "'选择颜色'"
      },
      {
        "prop": "confirmLabel",
        "description": "确认操作按钮显示的文字。",
        "type": "string",
        "defaultValue": "'应用'"
      },
      {
        "prop": "cancelLabel",
        "description": "取消操作按钮显示的文字。",
        "type": "string",
        "defaultValue": "'取消'"
      },
      {
        "prop": "zIndex",
        "description": "覆盖默认浮层层级；不传时由 Dragon Liquid 层级系统计算。",
        "type": "number",
        "defaultValue": "undefined"
      }
    ],
    "relatedTypes": [
      {
        "kind": "enum",
        "name": "DlColorFormat",
        "title": "DlColorFormat",
        "description": "ColorField 支持的颜色字符串输出格式。",
        "rows": [
          {
            "prop": "hex",
            "description": "十六进制颜色；透明时输出八位 HEX。",
            "type": "'hex'",
            "defaultValue": "HEX"
          },
          {
            "prop": "rgb",
            "description": "CSS rgb() 颜色格式。",
            "type": "'rgb'",
            "defaultValue": "RGB"
          },
          {
            "prop": "hsl",
            "description": "CSS hsl() 颜色格式。",
            "type": "'hsl'",
            "defaultValue": "HSL"
          },
          {
            "prop": "hsb",
            "description": "色相、饱和度、亮度颜色格式。",
            "type": "'hsb'",
            "defaultValue": "HSB"
          }
        ]
      },
      {
        "kind": "enum",
        "name": "DlSize",
        "title": "DlSize",
        "description": "组件可用的标准尺寸。",
        "rows": [
          {
            "prop": "sm",
            "description": "紧凑尺寸，适合密集界面和次要操作。",
            "type": "'sm'",
            "defaultValue": "紧凑"
          },
          {
            "prop": "md",
            "description": "默认尺寸，适合大多数常规界面。",
            "type": "'md'",
            "defaultValue": "标准"
          },
          {
            "prop": "lg",
            "description": "放大尺寸，适合重点内容和宽松布局。",
            "type": "'lg'",
            "defaultValue": "宽松"
          }
        ]
      },
      {
        "kind": "enum",
        "name": "DlOverlaySide",
        "title": "DlOverlaySide",
        "description": "Popover 与 Tooltip 共用的十二方位数字枚举。",
        "rows": [
          {
            "prop": "Top",
            "description": "上方居中。",
            "type": "0",
            "defaultValue": "上"
          },
          {
            "prop": "TopLeft",
            "description": "上方靠左。",
            "type": "1",
            "defaultValue": "左上"
          },
          {
            "prop": "TopRight",
            "description": "上方靠右。",
            "type": "2",
            "defaultValue": "右上"
          },
          {
            "prop": "Right",
            "description": "右侧居中。",
            "type": "3",
            "defaultValue": "右"
          },
          {
            "prop": "RightTop",
            "description": "右侧靠上。",
            "type": "4",
            "defaultValue": "右上"
          },
          {
            "prop": "RightBottom",
            "description": "右侧靠下。",
            "type": "5",
            "defaultValue": "右下"
          },
          {
            "prop": "Bottom",
            "description": "下方居中。",
            "type": "6",
            "defaultValue": "下"
          },
          {
            "prop": "BottomLeft",
            "description": "下方靠左。",
            "type": "7",
            "defaultValue": "左下"
          },
          {
            "prop": "BottomRight",
            "description": "下方靠右。",
            "type": "8",
            "defaultValue": "右下"
          },
          {
            "prop": "Left",
            "description": "左侧居中。",
            "type": "9",
            "defaultValue": "左"
          },
          {
            "prop": "LeftTop",
            "description": "左侧靠上。",
            "type": "10",
            "defaultValue": "左上"
          },
          {
            "prop": "LeftBottom",
            "description": "左侧靠下。",
            "type": "11",
            "defaultValue": "左下"
          }
        ]
      },
      {
        "kind": "enum",
        "name": "DlOverlayBaseSide",
        "title": "DlOverlayBaseSide",
        "description": "兼容 Reka UI 的四个基础方位字符串。",
        "rows": [
          {
            "prop": "top",
            "description": "DlOverlayBaseSide 的 top 选项。",
            "type": "'top'",
            "defaultValue": "枚举值"
          },
          {
            "prop": "right",
            "description": "DlOverlayBaseSide 的 right 选项。",
            "type": "'right'",
            "defaultValue": "枚举值"
          },
          {
            "prop": "bottom",
            "description": "DlOverlayBaseSide 的 bottom 选项。",
            "type": "'bottom'",
            "defaultValue": "枚举值"
          },
          {
            "prop": "left",
            "description": "DlOverlayBaseSide 的 left 选项。",
            "type": "'left'",
            "defaultValue": "枚举值"
          }
        ]
      }
    ]
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
        "prop": "showValue",
        "description": "是否显示格式化后的当前数值。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "size",
        "description": "设置控件尺寸。",
        "type": "'sm' | 'md' | 'lg'",
        "defaultValue": "'md'"
      }
    ],
    "relatedTypes": []
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
        "prop": "shape",
        "description": "设置控件的外轮廓形状。",
        "type": "'circle' | 'rounded' | 'square'",
        "defaultValue": "'rounded'"
      },
      {
        "prop": "labelPosition",
        "description": "颜色样本标签的显示位置；可隐藏、置右或置于下方。",
        "type": "'hidden' | 'right' | 'bottom'",
        "defaultValue": "'hidden'"
      },
      {
        "prop": "showValue",
        "description": "是否显示格式化后的当前数值。",
        "type": "boolean",
        "defaultValue": "false"
      }
    ],
    "relatedTypes": [
      {
        "kind": "enum",
        "name": "DlSize",
        "title": "DlSize",
        "description": "组件可用的标准尺寸。",
        "rows": [
          {
            "prop": "sm",
            "description": "紧凑尺寸，适合密集界面和次要操作。",
            "type": "'sm'",
            "defaultValue": "紧凑"
          },
          {
            "prop": "md",
            "description": "默认尺寸，适合大多数常规界面。",
            "type": "'md'",
            "defaultValue": "标准"
          },
          {
            "prop": "lg",
            "description": "放大尺寸，适合重点内容和宽松布局。",
            "type": "'lg'",
            "defaultValue": "宽松"
          }
        ]
      }
    ]
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
        "type": "readonly (string | DlColorSwatchOption)[]",
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
      },
      {
        "prop": "showLabels",
        "description": "是否在颜色样本右侧显示名称和说明；选项仍按容器宽度二维流式换行。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "showValues",
        "description": "是否在颜色选项缺少说明时，于右侧补充显示原始色值。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "size",
        "description": "设置控件尺寸。",
        "type": "'sm' | 'md' | 'lg'",
        "defaultValue": "'md'"
      },
      {
        "prop": "loop",
        "description": "键盘导航到边界时是否循环。",
        "type": "boolean",
        "defaultValue": "true"
      }
    ],
    "relatedTypes": [
      {
        "name": "DlColorSwatchOption",
        "description": "ColorSwatchPicker 使用的命名颜色选项，可附带说明或禁用状态。",
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
            "defaultValue": "可选"
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
        "kind": "structure",
        "title": "DlColorSwatchOption"
      }
    ]
  },
  "combobox": {
    "props": [
      {
        "prop": "open",
        "description": "浮层或内容区域是否打开；使用 v-model:open 双向绑定。",
        "type": "boolean",
        "defaultValue": "undefined"
      },
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
    "relatedTypes": [
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
        "kind": "structure",
        "title": "DlChoiceOption[]"
      },
      {
        "kind": "enum",
        "name": "DlSize",
        "title": "DlSize",
        "description": "组件可用的标准尺寸。",
        "rows": [
          {
            "prop": "sm",
            "description": "紧凑尺寸，适合密集界面和次要操作。",
            "type": "'sm'",
            "defaultValue": "紧凑"
          },
          {
            "prop": "md",
            "description": "默认尺寸，适合大多数常规界面。",
            "type": "'md'",
            "defaultValue": "标准"
          },
          {
            "prop": "lg",
            "description": "放大尺寸，适合重点内容和宽松布局。",
            "type": "'lg'",
            "defaultValue": "宽松"
          }
        ]
      }
    ]
  },
  "container": {
    "props": [
      {
        "prop": "as",
        "description": "设置 as 属性。",
        "type": "string",
        "defaultValue": "'div'"
      },
      {
        "prop": "size",
        "description": "设置控件尺寸。",
        "type": "'sm' | 'md' | 'lg' | 'xl' | 'full'",
        "defaultValue": "'lg'"
      },
      {
        "prop": "gutter",
        "description": "设置 gutter 属性。",
        "type": "'none' | 'sm' | 'md' | 'lg'",
        "defaultValue": "'md'"
      }
    ],
    "relatedTypes": []
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
    "relatedTypes": [
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
            "prop": "description",
            "description": "补充说明文字；不传时隐藏说明区域。",
            "type": "string",
            "defaultValue": "可选"
          },
          {
            "prop": "icon",
            "description": "自定义状态图标；不传时按色调选择默认图标。",
            "type": "string",
            "defaultValue": "可选"
          },
          {
            "prop": "checked",
            "description": "设置 checked 字段。",
            "type": "boolean",
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
          },
          {
            "prop": "children",
            "description": "当前节点或导航项包含的下一级项目。",
            "type": "DlMenuItem[]",
            "defaultValue": "可选"
          }
        ],
        "kind": "structure",
        "title": "DlMenuItem[]"
      }
    ]
  },
  "data-table": {
    "props": [
      {
        "prop": "rows",
        "description": "设置 rows 属性。",
        "type": "TRow[]",
        "defaultValue": "() => []"
      },
      {
        "prop": "columns",
        "description": "色板网格使用的固定列数；不传时根据容器宽度自动排列。",
        "type": "DlDataTableColumn[]",
        "defaultValue": "—"
      },
      {
        "prop": "selectedKeys",
        "description": "设置 selectedKeys 属性。",
        "type": "DlDataTableRowKey[]",
        "defaultValue": "() => []"
      },
      {
        "prop": "rowKey",
        "description": "设置 rowKey 属性。",
        "type": "string",
        "defaultValue": "'id'"
      },
      {
        "prop": "loading",
        "description": "是否显示加载状态并阻止重复操作。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "border",
        "description": "设置 border 属性。",
        "type": "boolean | 'default' | 'full' | 'outer' | 'inner' | 'none'",
        "defaultValue": "'inner'"
      },
      {
        "prop": "stripe",
        "description": "设置 stripe 属性。",
        "type": "boolean",
        "defaultValue": "true"
      },
      {
        "prop": "round",
        "description": "设置 round 属性。",
        "type": "boolean",
        "defaultValue": "true"
      },
      {
        "prop": "size",
        "description": "设置控件尺寸。",
        "type": "'mini' | 'small' | 'medium'",
        "defaultValue": "'small'"
      },
      {
        "prop": "height",
        "description": "窗口或区域的高度。",
        "type": "string | number",
        "defaultValue": "undefined"
      },
      {
        "prop": "maxHeight",
        "description": "设置 maxHeight 属性。",
        "type": "string | number",
        "defaultValue": "undefined"
      },
      {
        "prop": "emptyText",
        "description": "文档没有可渲染内容时显示的占位说明。",
        "type": "string",
        "defaultValue": "'暂无数据'"
      }
    ],
    "relatedTypes": [
      {
        "name": "DlDataTableColumn",
        "description": "DlDataTableColumn 数据结构。",
        "rows": [
          {
            "prop": "field",
            "description": "设置 field 字段。",
            "type": "string",
            "defaultValue": "可选"
          },
          {
            "prop": "title",
            "description": "控件或浮层显示的标题。",
            "type": "string",
            "defaultValue": "可选"
          },
          {
            "prop": "type",
            "description": "设置组件的选择模式或原生类型。",
            "type": "'checkbox' | 'seq' | 'radio' | 'expand'",
            "defaultValue": "可选"
          },
          {
            "prop": "width",
            "description": "窗口或区域的宽度。",
            "type": "string | number",
            "defaultValue": "可选"
          },
          {
            "prop": "minWidth",
            "description": "组件允许使用的最小宽度。",
            "type": "string | number",
            "defaultValue": "可选"
          },
          {
            "prop": "fixed",
            "description": "设置 fixed 字段。",
            "type": "'left' | 'right'",
            "defaultValue": "可选"
          },
          {
            "prop": "align",
            "description": "设置浮层相对触发器的对齐方式。",
            "type": "'left' | 'center' | 'right'",
            "defaultValue": "可选"
          },
          {
            "prop": "headerAlign",
            "description": "设置 headerAlign 字段。",
            "type": "'left' | 'center' | 'right'",
            "defaultValue": "可选"
          },
          {
            "prop": "sortable",
            "description": "设置 sortable 字段。",
            "type": "boolean",
            "defaultValue": "可选"
          },
          {
            "prop": "visible",
            "description": "设置 visible 字段。",
            "type": "boolean",
            "defaultValue": "可选"
          },
          {
            "prop": "showOverflow",
            "description": "设置 showOverflow 字段。",
            "type": "boolean | 'ellipsis' | 'title' | 'tooltip'",
            "defaultValue": "可选"
          },
          {
            "prop": "className",
            "description": "设置 className 字段。",
            "type": "string",
            "defaultValue": "可选"
          }
        ],
        "kind": "structure",
        "title": "DlDataTableColumn[]"
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
        "prop": "minValue",
        "description": "允许选择的最早日期。",
        "type": "DateValue",
        "defaultValue": "undefined"
      },
      {
        "prop": "maxValue",
        "description": "允许选择的最晚日期。",
        "type": "DateValue",
        "defaultValue": "undefined"
      },
      {
        "prop": "isDateUnavailable",
        "description": "设置 isDateUnavailable 属性。",
        "type": "(date: DateValue) => boolean",
        "defaultValue": "undefined"
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
        "prop": "clearable",
        "description": "是否允许再次操作以清空当前值。",
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
    "relatedTypes": [
      {
        "kind": "enum",
        "name": "DlSize",
        "title": "DlSize",
        "description": "组件可用的标准尺寸。",
        "rows": [
          {
            "prop": "sm",
            "description": "紧凑尺寸，适合密集界面和次要操作。",
            "type": "'sm'",
            "defaultValue": "紧凑"
          },
          {
            "prop": "md",
            "description": "默认尺寸，适合大多数常规界面。",
            "type": "'md'",
            "defaultValue": "标准"
          },
          {
            "prop": "lg",
            "description": "放大尺寸，适合重点内容和宽松布局。",
            "type": "'lg'",
            "defaultValue": "宽松"
          }
        ]
      }
    ]
  },
  "date-picker": {
    "props": [
      {
        "prop": "open",
        "description": "浮层或内容区域是否打开；使用 v-model:open 双向绑定。",
        "type": "boolean",
        "defaultValue": "undefined"
      },
      {
        "prop": "modelValue",
        "description": "组件当前值；使用 v-model 进行双向绑定。",
        "type": "DateValue | null",
        "defaultValue": "null"
      },
      {
        "prop": "presentation",
        "description": "选择器入口使用可编辑字段或紧凑按钮呈现；不改变值模型和选择面板。",
        "type": "DlDatePickerPresentation",
        "defaultValue": "'button'"
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
        "prop": "weekStartsOn",
        "description": "一周起始日，0 表示星期日。",
        "type": "0 | 1 | 2 | 3 | 4 | 5 | 6",
        "defaultValue": "1"
      },
      {
        "prop": "minValue",
        "description": "允许选择的最早日期。",
        "type": "DateValue",
        "defaultValue": "undefined"
      },
      {
        "prop": "maxValue",
        "description": "允许选择的最晚日期。",
        "type": "DateValue",
        "defaultValue": "undefined"
      },
      {
        "prop": "isDateDisabled",
        "description": "设置 isDateDisabled 属性。",
        "type": "(date: DateValue) => boolean",
        "defaultValue": "undefined"
      },
      {
        "prop": "isDateUnavailable",
        "description": "设置 isDateUnavailable 属性。",
        "type": "(date: DateValue) => boolean",
        "defaultValue": "undefined"
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
        "prop": "clearable",
        "description": "是否允许再次操作以清空当前值。",
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
      },
      {
        "prop": "zIndex",
        "description": "覆盖默认浮层层级；不传时由 Dragon Liquid 层级系统计算。",
        "type": "number",
        "defaultValue": "undefined"
      }
    ],
    "relatedTypes": [
      {
        "kind": "enum",
        "name": "DlDatePickerPresentation",
        "title": "DlDatePickerPresentation",
        "description": "DlDatePickerPresentation 可用的枚举值。",
        "rows": [
          {
            "prop": "field",
            "description": "DlDatePickerPresentation 的 field 选项。",
            "type": "'field'",
            "defaultValue": "枚举值"
          },
          {
            "prop": "button",
            "description": "DlDatePickerPresentation 的 button 选项。",
            "type": "'button'",
            "defaultValue": "枚举值"
          }
        ]
      },
      {
        "kind": "enum",
        "name": "DlSize",
        "title": "DlSize",
        "description": "组件可用的标准尺寸。",
        "rows": [
          {
            "prop": "sm",
            "description": "紧凑尺寸，适合密集界面和次要操作。",
            "type": "'sm'",
            "defaultValue": "紧凑"
          },
          {
            "prop": "md",
            "description": "默认尺寸，适合大多数常规界面。",
            "type": "'md'",
            "defaultValue": "标准"
          },
          {
            "prop": "lg",
            "description": "放大尺寸，适合重点内容和宽松布局。",
            "type": "'lg'",
            "defaultValue": "宽松"
          }
        ]
      }
    ]
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
        "prop": "minValue",
        "description": "允许选择的最早日期。",
        "type": "DateValue",
        "defaultValue": "undefined"
      },
      {
        "prop": "maxValue",
        "description": "允许选择的最晚日期。",
        "type": "DateValue",
        "defaultValue": "undefined"
      },
      {
        "prop": "isDateUnavailable",
        "description": "设置 isDateUnavailable 属性。",
        "type": "(date: DateValue) => boolean",
        "defaultValue": "undefined"
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
        "prop": "clearable",
        "description": "是否允许再次操作以清空当前值。",
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
      },
      {
        "prop": "name",
        "description": "参与表单提交时使用的字段名称。",
        "type": "string",
        "defaultValue": "undefined"
      }
    ],
    "relatedTypes": [
      {
        "kind": "enum",
        "name": "DlSize",
        "title": "DlSize",
        "description": "组件可用的标准尺寸。",
        "rows": [
          {
            "prop": "sm",
            "description": "紧凑尺寸，适合密集界面和次要操作。",
            "type": "'sm'",
            "defaultValue": "紧凑"
          },
          {
            "prop": "md",
            "description": "默认尺寸，适合大多数常规界面。",
            "type": "'md'",
            "defaultValue": "标准"
          },
          {
            "prop": "lg",
            "description": "放大尺寸，适合重点内容和宽松布局。",
            "type": "'lg'",
            "defaultValue": "宽松"
          }
        ]
      }
    ]
  },
  "date-range-picker": {
    "props": [
      {
        "prop": "open",
        "description": "浮层或内容区域是否打开；使用 v-model:open 双向绑定。",
        "type": "boolean",
        "defaultValue": "undefined"
      },
      {
        "prop": "modelValue",
        "description": "组件当前值；使用 v-model 进行双向绑定。",
        "type": "DateRange | null",
        "defaultValue": "null"
      },
      {
        "prop": "presentation",
        "description": "选择器入口使用可编辑字段或紧凑按钮呈现；不改变值模型和选择面板。",
        "type": "DlDateRangePickerPresentation",
        "defaultValue": "'button'"
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
        "prop": "clearable",
        "description": "是否允许再次操作以清空当前值。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "isDateUnavailable",
        "description": "设置 isDateUnavailable 属性。",
        "type": "(date: DateValue) => boolean",
        "defaultValue": "undefined"
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
        "prop": "minValue",
        "description": "允许选择的最早日期。",
        "type": "DateValue",
        "defaultValue": "undefined"
      },
      {
        "prop": "maxValue",
        "description": "允许选择的最晚日期。",
        "type": "DateValue",
        "defaultValue": "undefined"
      },
      {
        "prop": "numberOfMonths",
        "description": "同时显示的月份面板数量。",
        "type": "number",
        "defaultValue": "2"
      },
      {
        "prop": "zIndex",
        "description": "覆盖默认浮层层级；不传时由 Dragon Liquid 层级系统计算。",
        "type": "number",
        "defaultValue": "undefined"
      }
    ],
    "relatedTypes": [
      {
        "kind": "enum",
        "name": "DlDateRangePickerPresentation",
        "title": "DlDateRangePickerPresentation",
        "description": "DlDateRangePickerPresentation 可用的枚举值。",
        "rows": [
          {
            "prop": "field",
            "description": "DlDateRangePickerPresentation 的 field 选项。",
            "type": "'field'",
            "defaultValue": "枚举值"
          },
          {
            "prop": "button",
            "description": "DlDateRangePickerPresentation 的 button 选项。",
            "type": "'button'",
            "defaultValue": "枚举值"
          }
        ]
      },
      {
        "kind": "enum",
        "name": "DlSize",
        "title": "DlSize",
        "description": "组件可用的标准尺寸。",
        "rows": [
          {
            "prop": "sm",
            "description": "紧凑尺寸，适合密集界面和次要操作。",
            "type": "'sm'",
            "defaultValue": "紧凑"
          },
          {
            "prop": "md",
            "description": "默认尺寸，适合大多数常规界面。",
            "type": "'md'",
            "defaultValue": "标准"
          },
          {
            "prop": "lg",
            "description": "放大尺寸，适合重点内容和宽松布局。",
            "type": "'lg'",
            "defaultValue": "宽松"
          }
        ]
      }
    ]
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
      },
      {
        "prop": "draggable",
        "description": "是否允许在桌面视口中拖动标题栏或拖动柄来移动对话框。",
        "type": "boolean",
        "defaultValue": "true"
      },
      {
        "prop": "resizable",
        "description": "是否允许在桌面视口中拖动右下角缩放柄来调整对话框尺寸。",
        "type": "boolean",
        "defaultValue": "true"
      },
      {
        "prop": "position",
        "description": "对话框左上角的视口坐标；使用 v-model:position 读取或保存用户拖动后的位置。",
        "type": "DlDialogPosition | null",
        "defaultValue": "undefined"
      },
      {
        "prop": "dimensions",
        "description": "对话框当前宽高；使用 v-model:dimensions 读取或保存用户调整后的尺寸。",
        "type": "DlDialogDimensions | null",
        "defaultValue": "undefined"
      },
      {
        "prop": "minWidth",
        "description": "组件允许使用的最小宽度。",
        "type": "number",
        "defaultValue": "320"
      },
      {
        "prop": "minHeight",
        "description": "组件或工作区允许使用的最小高度。",
        "type": "number",
        "defaultValue": "200"
      },
      {
        "prop": "resetGeometryOnClose",
        "description": "关闭后是否恢复居中位置与 size 对应的初始尺寸。",
        "type": "boolean",
        "defaultValue": "true"
      }
    ],
    "relatedTypes": [
      {
        "kind": "enum",
        "name": "DlTone",
        "title": "DlTone",
        "description": "Dragon Liquid 组件共享的语义色调。",
        "rows": [
          {
            "prop": "default",
            "description": "默认中性色调，适合普通信息与基础状态。",
            "type": "'default'",
            "defaultValue": "中性"
          },
          {
            "prop": "accent",
            "description": "强调色调，适合品牌重点、当前任务或推荐内容。",
            "type": "'accent'",
            "defaultValue": "强调"
          },
          {
            "prop": "success",
            "description": "成功色调，表示任务已经正确完成。",
            "type": "'success'",
            "defaultValue": "成功"
          },
          {
            "prop": "warning",
            "description": "警告色调，提示可恢复且需要留意的问题。",
            "type": "'warning'",
            "defaultValue": "警告"
          },
          {
            "prop": "danger",
            "description": "危险色调，表示失败、破坏性操作或高风险状态。",
            "type": "'danger'",
            "defaultValue": "危险"
          },
          {
            "prop": "muted",
            "description": "弱化色调，适合低优先级、只读或后台信息。",
            "type": "'muted'",
            "defaultValue": "弱化"
          }
        ]
      },
      {
        "name": "DlDialogPosition",
        "description": "Dialog 左上角相对视口的像素坐标。",
        "rows": [
          {
            "prop": "x",
            "description": "相对视口左侧的横向坐标。",
            "type": "number",
            "defaultValue": "必填"
          },
          {
            "prop": "y",
            "description": "相对视口顶部的纵向坐标。",
            "type": "number",
            "defaultValue": "必填"
          }
        ],
        "kind": "structure",
        "title": "DlDialogPosition"
      },
      {
        "name": "DlDialogDimensions",
        "description": "Dialog 调整后的像素尺寸。",
        "rows": [
          {
            "prop": "width",
            "description": "窗口或区域的宽度。",
            "type": "number",
            "defaultValue": "必填"
          },
          {
            "prop": "height",
            "description": "窗口或区域的高度。",
            "type": "number",
            "defaultValue": "必填"
          }
        ],
        "kind": "structure",
        "title": "DlDialogDimensions"
      }
    ]
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
    "relatedTypes": [
      {
        "kind": "enum",
        "name": "DlSize",
        "title": "DlSize",
        "description": "组件可用的标准尺寸。",
        "rows": [
          {
            "prop": "sm",
            "description": "紧凑尺寸，适合密集界面和次要操作。",
            "type": "'sm'",
            "defaultValue": "紧凑"
          },
          {
            "prop": "md",
            "description": "默认尺寸，适合大多数常规界面。",
            "type": "'md'",
            "defaultValue": "标准"
          },
          {
            "prop": "lg",
            "description": "放大尺寸，适合重点内容和宽松布局。",
            "type": "'lg'",
            "defaultValue": "宽松"
          }
        ]
      },
      {
        "kind": "enum",
        "name": "DlTone",
        "title": "DlTone",
        "description": "Dragon Liquid 组件共享的语义色调。",
        "rows": [
          {
            "prop": "default",
            "description": "默认中性色调，适合普通信息与基础状态。",
            "type": "'default'",
            "defaultValue": "中性"
          },
          {
            "prop": "accent",
            "description": "强调色调，适合品牌重点、当前任务或推荐内容。",
            "type": "'accent'",
            "defaultValue": "强调"
          },
          {
            "prop": "success",
            "description": "成功色调，表示任务已经正确完成。",
            "type": "'success'",
            "defaultValue": "成功"
          },
          {
            "prop": "warning",
            "description": "警告色调，提示可恢复且需要留意的问题。",
            "type": "'warning'",
            "defaultValue": "警告"
          },
          {
            "prop": "danger",
            "description": "危险色调，表示失败、破坏性操作或高风险状态。",
            "type": "'danger'",
            "defaultValue": "危险"
          },
          {
            "prop": "muted",
            "description": "弱化色调，适合低优先级、只读或后台信息。",
            "type": "'muted'",
            "defaultValue": "弱化"
          }
        ]
      }
    ]
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
    "relatedTypes": [
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
            "prop": "description",
            "description": "补充说明文字；不传时隐藏说明区域。",
            "type": "string",
            "defaultValue": "可选"
          },
          {
            "prop": "icon",
            "description": "自定义状态图标；不传时按色调选择默认图标。",
            "type": "string",
            "defaultValue": "可选"
          },
          {
            "prop": "checked",
            "description": "设置 checked 字段。",
            "type": "boolean",
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
          },
          {
            "prop": "children",
            "description": "当前节点或导航项包含的下一级项目。",
            "type": "DlMenuItem[]",
            "defaultValue": "可选"
          }
        ],
        "kind": "structure",
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
    "relatedTypes": []
  },
  "grid": {
    "props": [
      {
        "prop": "as",
        "description": "设置 as 属性。",
        "type": "string",
        "defaultValue": "'div'"
      },
      {
        "prop": "minItemWidth",
        "description": "设置 minItemWidth 属性。",
        "type": "string",
        "defaultValue": "'240px'"
      },
      {
        "prop": "columns",
        "description": "色板网格使用的固定列数；不传时根据容器宽度自动排列。",
        "type": "number",
        "defaultValue": "0"
      },
      {
        "prop": "gap",
        "description": "设置 gap 属性。",
        "type": "'xs' | 'sm' | 'md' | 'lg'",
        "defaultValue": "'md'"
      },
      {
        "prop": "dense",
        "description": "设置 dense 属性。",
        "type": "boolean",
        "defaultValue": "false"
      }
    ],
    "relatedTypes": []
  },
  "hover-card": {
    "props": [
      {
        "prop": "open",
        "description": "浮层或内容区域是否打开；使用 v-model:open 双向绑定。",
        "type": "boolean",
        "defaultValue": "undefined"
      },
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
    "relatedTypes": []
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
    "relatedTypes": [
      {
        "kind": "enum",
        "name": "DlSize",
        "title": "DlSize",
        "description": "组件可用的标准尺寸。",
        "rows": [
          {
            "prop": "sm",
            "description": "紧凑尺寸，适合密集界面和次要操作。",
            "type": "'sm'",
            "defaultValue": "紧凑"
          },
          {
            "prop": "md",
            "description": "默认尺寸，适合大多数常规界面。",
            "type": "'md'",
            "defaultValue": "标准"
          },
          {
            "prop": "lg",
            "description": "放大尺寸，适合重点内容和宽松布局。",
            "type": "'lg'",
            "defaultValue": "宽松"
          }
        ]
      }
    ]
  },
  "input-button": {
    "props": [
      {
        "prop": "value",
        "description": "表单提交或选择操作使用的值。",
        "type": "string",
        "defaultValue": "'执行操作'"
      },
      {
        "prop": "size",
        "description": "设置控件尺寸。",
        "type": "DlSize",
        "defaultValue": "'md'"
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
      },
      {
        "prop": "name",
        "description": "定义表单提交时使用的字段名称。",
        "type": "string",
        "defaultValue": "—"
      },
      {
        "prop": "form",
        "description": "通过表单 id 把输入关联到其所属 form 元素。",
        "type": "string",
        "defaultValue": "最近的祖先 form"
      }
    ],
    "relatedTypes": [
      {
        "kind": "enum",
        "name": "DlSize",
        "title": "DlSize",
        "description": "组件可用的标准尺寸。",
        "rows": [
          {
            "prop": "sm",
            "description": "紧凑尺寸，适合密集界面和次要操作。",
            "type": "'sm'",
            "defaultValue": "紧凑"
          },
          {
            "prop": "md",
            "description": "默认尺寸，适合大多数常规界面。",
            "type": "'md'",
            "defaultValue": "标准"
          },
          {
            "prop": "lg",
            "description": "放大尺寸，适合重点内容和宽松布局。",
            "type": "'lg'",
            "defaultValue": "宽松"
          }
        ]
      }
    ]
  },
  "input-checkbox": {
    "props": [
      {
        "prop": "modelValue",
        "description": "组件当前值；使用 v-model 进行双向绑定。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "value",
        "description": "表单提交或选择操作使用的值。",
        "type": "string",
        "defaultValue": "'on'"
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
        "prop": "disabled",
        "description": "是否禁用控件及其交互。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "name",
        "description": "定义表单提交时使用的字段名称。",
        "type": "string",
        "defaultValue": "—"
      },
      {
        "prop": "required",
        "description": "要求该控件在表单提交前提供有效值或选择。",
        "type": "boolean attribute",
        "defaultValue": "false"
      },
      {
        "prop": "form",
        "description": "通过表单 id 把输入关联到其所属 form 元素。",
        "type": "string",
        "defaultValue": "最近的祖先 form"
      }
    ],
    "relatedTypes": []
  },
  "input-color": {
    "props": [
      {
        "prop": "modelValue",
        "description": "组件当前值；使用 v-model 进行双向绑定。",
        "type": "string | null",
        "defaultValue": "'#000000'"
      },
      {
        "prop": "defaultValue",
        "description": "设置 defaultValue 属性。",
        "type": "string",
        "defaultValue": "'#000000'"
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
      },
      {
        "prop": "readonly",
        "description": "是否只读；保留浏览能力但禁止修改。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "copyable",
        "description": "是否提供复制当前值的快捷按钮。",
        "type": "boolean",
        "defaultValue": "true"
      },
      {
        "prop": "resettable",
        "description": "设置 resettable 属性。",
        "type": "boolean",
        "defaultValue": "true"
      },
      {
        "prop": "name",
        "description": "定义表单提交时使用的字段名称。",
        "type": "string",
        "defaultValue": "—"
      },
      {
        "prop": "list",
        "description": "关联 datalist 的 id，为输入提供原生建议值。",
        "type": "string",
        "defaultValue": "—"
      },
      {
        "prop": "alpha",
        "description": "允许颜色值包含透明度通道；浏览器支持情况需要单独确认。",
        "type": "boolean attribute",
        "defaultValue": "false"
      },
      {
        "prop": "colorspace",
        "description": "声明颜色选择器使用的颜色空间。",
        "type": "\"limited-srgb\" | \"display-p3\"",
        "defaultValue": "\"limited-srgb\""
      },
      {
        "prop": "form",
        "description": "通过表单 id 把输入关联到其所属 form 元素。",
        "type": "string",
        "defaultValue": "最近的祖先 form"
      }
    ],
    "relatedTypes": [
      {
        "kind": "enum",
        "name": "DlSize",
        "title": "DlSize",
        "description": "组件可用的标准尺寸。",
        "rows": [
          {
            "prop": "sm",
            "description": "紧凑尺寸，适合密集界面和次要操作。",
            "type": "'sm'",
            "defaultValue": "紧凑"
          },
          {
            "prop": "md",
            "description": "默认尺寸，适合大多数常规界面。",
            "type": "'md'",
            "defaultValue": "标准"
          },
          {
            "prop": "lg",
            "description": "放大尺寸，适合重点内容和宽松布局。",
            "type": "'lg'",
            "defaultValue": "宽松"
          }
        ]
      }
    ]
  },
  "input-datetime-local": {
    "props": [
      {
        "prop": "modelValue",
        "description": "组件当前值；使用 v-model 进行双向绑定。",
        "type": "string | null",
        "defaultValue": "''"
      },
      {
        "prop": "min",
        "description": "允许的最小值。",
        "type": "string",
        "defaultValue": "undefined"
      },
      {
        "prop": "max",
        "description": "允许的最大值。",
        "type": "string",
        "defaultValue": "undefined"
      },
      {
        "prop": "step",
        "description": "每次操作改变的数值步长。",
        "type": "number",
        "defaultValue": "300"
      },
      {
        "prop": "locale",
        "description": "日期、时间或数字格式使用的区域语言。",
        "type": "string",
        "defaultValue": "'zh-CN'"
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
      },
      {
        "prop": "readonly",
        "description": "是否只读；保留浏览能力但禁止修改。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "clearable",
        "description": "是否允许再次操作以清空当前值。",
        "type": "boolean",
        "defaultValue": "true"
      },
      {
        "prop": "nowShortcut",
        "description": "设置 nowShortcut 属性。",
        "type": "boolean",
        "defaultValue": "true"
      },
      {
        "prop": "name",
        "description": "定义表单提交时使用的字段名称。",
        "type": "string",
        "defaultValue": "—"
      },
      {
        "prop": "list",
        "description": "关联 datalist 的 id，为输入提供原生建议值。",
        "type": "string",
        "defaultValue": "—"
      },
      {
        "prop": "required",
        "description": "要求该控件在表单提交前提供有效值或选择。",
        "type": "boolean attribute",
        "defaultValue": "false"
      },
      {
        "prop": "form",
        "description": "通过表单 id 把输入关联到其所属 form 元素。",
        "type": "string",
        "defaultValue": "最近的祖先 form"
      }
    ],
    "relatedTypes": [
      {
        "kind": "enum",
        "name": "DlSize",
        "title": "DlSize",
        "description": "组件可用的标准尺寸。",
        "rows": [
          {
            "prop": "sm",
            "description": "紧凑尺寸，适合密集界面和次要操作。",
            "type": "'sm'",
            "defaultValue": "紧凑"
          },
          {
            "prop": "md",
            "description": "默认尺寸，适合大多数常规界面。",
            "type": "'md'",
            "defaultValue": "标准"
          },
          {
            "prop": "lg",
            "description": "放大尺寸，适合重点内容和宽松布局。",
            "type": "'lg'",
            "defaultValue": "宽松"
          }
        ]
      }
    ]
  },
  "input-email": {
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
      },
      {
        "prop": "readonly",
        "description": "是否只读；保留浏览能力但禁止修改。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "clearable",
        "description": "是否允许再次操作以清空当前值。",
        "type": "boolean",
        "defaultValue": "true"
      },
      {
        "prop": "normalizeOnBlur",
        "description": "设置 normalizeOnBlur 属性。",
        "type": "boolean",
        "defaultValue": "true"
      },
      {
        "prop": "showValidation",
        "description": "设置 showValidation 属性。",
        "type": "boolean",
        "defaultValue": "true"
      },
      {
        "prop": "name",
        "description": "定义表单提交时使用的字段名称。",
        "type": "string",
        "defaultValue": "—"
      },
      {
        "prop": "autocomplete",
        "description": "提示浏览器该字段允许采用的自动填充语义。",
        "type": "string",
        "defaultValue": "—"
      },
      {
        "prop": "list",
        "description": "关联 datalist 的 id，为输入提供原生建议值。",
        "type": "string",
        "defaultValue": "—"
      },
      {
        "prop": "multiple",
        "description": "允许输入接收多个邮箱地址或多个文件。",
        "type": "boolean attribute",
        "defaultValue": "false"
      },
      {
        "prop": "minlength",
        "description": "要求输入至少包含指定数量的 UTF-16 代码单元。",
        "type": "non-negative integer",
        "defaultValue": "—"
      },
      {
        "prop": "maxlength",
        "description": "限制用户可输入的 UTF-16 代码单元最大数量。",
        "type": "non-negative integer",
        "defaultValue": "—"
      },
      {
        "prop": "pattern",
        "description": "使用 JavaScript 正则表达式约束输入的完整值。",
        "type": "regular expression source",
        "defaultValue": "—"
      },
      {
        "prop": "placeholder",
        "description": "在空值时显示简短格式提示，不能替代 label。",
        "type": "string",
        "defaultValue": "—"
      },
      {
        "prop": "required",
        "description": "要求该控件在表单提交前提供有效值或选择。",
        "type": "boolean attribute",
        "defaultValue": "false"
      },
      {
        "prop": "form",
        "description": "通过表单 id 把输入关联到其所属 form 元素。",
        "type": "string",
        "defaultValue": "最近的祖先 form"
      }
    ],
    "relatedTypes": [
      {
        "kind": "enum",
        "name": "DlSize",
        "title": "DlSize",
        "description": "组件可用的标准尺寸。",
        "rows": [
          {
            "prop": "sm",
            "description": "紧凑尺寸，适合密集界面和次要操作。",
            "type": "'sm'",
            "defaultValue": "紧凑"
          },
          {
            "prop": "md",
            "description": "默认尺寸，适合大多数常规界面。",
            "type": "'md'",
            "defaultValue": "标准"
          },
          {
            "prop": "lg",
            "description": "放大尺寸，适合重点内容和宽松布局。",
            "type": "'lg'",
            "defaultValue": "宽松"
          }
        ]
      }
    ]
  },
  "input-file": {
    "props": [
      {
        "prop": "accept",
        "description": "设置 accept 属性。",
        "type": "string",
        "defaultValue": "undefined"
      },
      {
        "prop": "capture",
        "description": "设置 capture 属性。",
        "type": "'user' | 'environment'",
        "defaultValue": "undefined"
      },
      {
        "prop": "multiple",
        "description": "是否允许同时选择多个值。",
        "type": "boolean",
        "defaultValue": "false"
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
      },
      {
        "prop": "maxFiles",
        "description": "设置 maxFiles 属性。",
        "type": "number",
        "defaultValue": "undefined"
      },
      {
        "prop": "maxFileSize",
        "description": "设置 maxFileSize 属性。",
        "type": "number",
        "defaultValue": "undefined"
      },
      {
        "prop": "prompt",
        "description": "设置 prompt 属性。",
        "type": "string",
        "defaultValue": "'拖放文件到这里，或点击选择'"
      },
      {
        "prop": "name",
        "description": "定义表单提交时使用的字段名称。",
        "type": "string",
        "defaultValue": "—"
      },
      {
        "prop": "form",
        "description": "通过表单 id 把输入关联到其所属 form 元素。",
        "type": "string",
        "defaultValue": "最近的祖先 form"
      }
    ],
    "relatedTypes": []
  },
  "input-hidden": {
    "props": [
      {
        "prop": "modelValue",
        "description": "组件当前值；使用 v-model 进行双向绑定。",
        "type": "string | number | null",
        "defaultValue": "''"
      },
      {
        "prop": "name",
        "description": "定义表单提交时使用的字段名称。",
        "type": "string",
        "defaultValue": "—"
      },
      {
        "prop": "form",
        "description": "通过表单 id 把输入关联到其所属 form 元素。",
        "type": "string",
        "defaultValue": "最近的祖先 form"
      }
    ],
    "relatedTypes": []
  },
  "input-image": {
    "props": [
      {
        "prop": "src",
        "description": "要加载的图片资源地址。",
        "type": "string",
        "defaultValue": "—"
      },
      {
        "prop": "alt",
        "description": "图片无法展示时使用的替代文本。",
        "type": "string",
        "defaultValue": "—"
      },
      {
        "prop": "width",
        "description": "窗口或区域的宽度。",
        "type": "number | string",
        "defaultValue": "undefined"
      },
      {
        "prop": "height",
        "description": "窗口或区域的高度。",
        "type": "number | string",
        "defaultValue": "undefined"
      },
      {
        "prop": "disabled",
        "description": "是否禁用控件及其交互。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "name",
        "description": "定义表单提交时使用的字段名称。",
        "type": "string",
        "defaultValue": "—"
      },
      {
        "prop": "formaction",
        "description": "覆盖所属表单的 action，仅对提交型输入生效。",
        "type": "URL string",
        "defaultValue": "form.action"
      },
      {
        "prop": "formenctype",
        "description": "覆盖提交数据的编码方式，仅对提交型输入生效。",
        "type": "\"application/x-www-form-urlencoded\" | \"multipart/form-data\" | \"text/plain\"",
        "defaultValue": "form.enctype"
      },
      {
        "prop": "formmethod",
        "description": "覆盖提交使用的 HTTP 方法，仅对提交型输入生效。",
        "type": "\"get\" | \"post\" | \"dialog\"",
        "defaultValue": "form.method"
      },
      {
        "prop": "formnovalidate",
        "description": "提交时跳过原生约束校验，仅对提交型输入生效。",
        "type": "boolean attribute",
        "defaultValue": "false"
      },
      {
        "prop": "formtarget",
        "description": "覆盖提交结果打开的位置，仅对提交型输入生效。",
        "type": "string",
        "defaultValue": "form.target"
      },
      {
        "prop": "form",
        "description": "通过表单 id 把输入关联到其所属 form 元素。",
        "type": "string",
        "defaultValue": "最近的祖先 form"
      }
    ],
    "relatedTypes": []
  },
  "input-number": {
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
        "prop": "precision",
        "description": "设置 precision 属性。",
        "type": "number",
        "defaultValue": "undefined"
      },
      {
        "prop": "unit",
        "description": "设置 unit 属性。",
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
      },
      {
        "prop": "readonly",
        "description": "是否只读；保留浏览能力但禁止修改。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "clearable",
        "description": "是否允许再次操作以清空当前值。",
        "type": "boolean",
        "defaultValue": "true"
      },
      {
        "prop": "clampOnBlur",
        "description": "设置 clampOnBlur 属性。",
        "type": "boolean",
        "defaultValue": "true"
      },
      {
        "prop": "name",
        "description": "定义表单提交时使用的字段名称。",
        "type": "string",
        "defaultValue": "—"
      },
      {
        "prop": "list",
        "description": "关联 datalist 的 id，为输入提供原生建议值。",
        "type": "string",
        "defaultValue": "—"
      },
      {
        "prop": "placeholder",
        "description": "在空值时显示简短格式提示，不能替代 label。",
        "type": "string",
        "defaultValue": "—"
      },
      {
        "prop": "required",
        "description": "要求该控件在表单提交前提供有效值或选择。",
        "type": "boolean attribute",
        "defaultValue": "false"
      },
      {
        "prop": "form",
        "description": "通过表单 id 把输入关联到其所属 form 元素。",
        "type": "string",
        "defaultValue": "最近的祖先 form"
      }
    ],
    "relatedTypes": [
      {
        "kind": "enum",
        "name": "DlSize",
        "title": "DlSize",
        "description": "组件可用的标准尺寸。",
        "rows": [
          {
            "prop": "sm",
            "description": "紧凑尺寸，适合密集界面和次要操作。",
            "type": "'sm'",
            "defaultValue": "紧凑"
          },
          {
            "prop": "md",
            "description": "默认尺寸，适合大多数常规界面。",
            "type": "'md'",
            "defaultValue": "标准"
          },
          {
            "prop": "lg",
            "description": "放大尺寸，适合重点内容和宽松布局。",
            "type": "'lg'",
            "defaultValue": "宽松"
          }
        ]
      }
    ]
  },
  "input-password": {
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
      },
      {
        "prop": "readonly",
        "description": "是否只读；保留浏览能力但禁止修改。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "revealable",
        "description": "设置 revealable 属性。",
        "type": "boolean",
        "defaultValue": "true"
      },
      {
        "prop": "showStrength",
        "description": "设置 showStrength 属性。",
        "type": "boolean",
        "defaultValue": "true"
      },
      {
        "prop": "clearable",
        "description": "是否允许再次操作以清空当前值。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "name",
        "description": "定义表单提交时使用的字段名称。",
        "type": "string",
        "defaultValue": "—"
      },
      {
        "prop": "autocomplete",
        "description": "提示浏览器该字段允许采用的自动填充语义。",
        "type": "string",
        "defaultValue": "—"
      },
      {
        "prop": "minlength",
        "description": "要求输入至少包含指定数量的 UTF-16 代码单元。",
        "type": "non-negative integer",
        "defaultValue": "—"
      },
      {
        "prop": "maxlength",
        "description": "限制用户可输入的 UTF-16 代码单元最大数量。",
        "type": "non-negative integer",
        "defaultValue": "—"
      },
      {
        "prop": "pattern",
        "description": "使用 JavaScript 正则表达式约束输入的完整值。",
        "type": "regular expression source",
        "defaultValue": "—"
      },
      {
        "prop": "placeholder",
        "description": "在空值时显示简短格式提示，不能替代 label。",
        "type": "string",
        "defaultValue": "—"
      },
      {
        "prop": "required",
        "description": "要求该控件在表单提交前提供有效值或选择。",
        "type": "boolean attribute",
        "defaultValue": "false"
      },
      {
        "prop": "form",
        "description": "通过表单 id 把输入关联到其所属 form 元素。",
        "type": "string",
        "defaultValue": "最近的祖先 form"
      }
    ],
    "relatedTypes": [
      {
        "kind": "enum",
        "name": "DlSize",
        "title": "DlSize",
        "description": "组件可用的标准尺寸。",
        "rows": [
          {
            "prop": "sm",
            "description": "紧凑尺寸，适合密集界面和次要操作。",
            "type": "'sm'",
            "defaultValue": "紧凑"
          },
          {
            "prop": "md",
            "description": "默认尺寸，适合大多数常规界面。",
            "type": "'md'",
            "defaultValue": "标准"
          },
          {
            "prop": "lg",
            "description": "放大尺寸，适合重点内容和宽松布局。",
            "type": "'lg'",
            "defaultValue": "宽松"
          }
        ]
      }
    ]
  },
  "input-radio": {
    "props": [
      {
        "prop": "modelValue",
        "description": "组件当前值；使用 v-model 进行双向绑定。",
        "type": "string | number | null",
        "defaultValue": "null"
      },
      {
        "prop": "value",
        "description": "表单提交或选择操作使用的值。",
        "type": "string | number",
        "defaultValue": "—"
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
        "prop": "disabled",
        "description": "是否禁用控件及其交互。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "name",
        "description": "定义表单提交时使用的字段名称。",
        "type": "string",
        "defaultValue": "—"
      },
      {
        "prop": "required",
        "description": "要求该控件在表单提交前提供有效值或选择。",
        "type": "boolean attribute",
        "defaultValue": "false"
      },
      {
        "prop": "form",
        "description": "通过表单 id 把输入关联到其所属 form 元素。",
        "type": "string",
        "defaultValue": "最近的祖先 form"
      }
    ],
    "relatedTypes": []
  },
  "input-range": {
    "props": [
      {
        "prop": "modelValue",
        "description": "组件当前值；使用 v-model 进行双向绑定。",
        "type": "number | null",
        "defaultValue": "50"
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
      },
      {
        "prop": "showValue",
        "description": "是否显示格式化后的当前数值。",
        "type": "boolean",
        "defaultValue": "true"
      },
      {
        "prop": "minLabel",
        "description": "设置 minLabel 属性。",
        "type": "string",
        "defaultValue": "undefined"
      },
      {
        "prop": "maxLabel",
        "description": "设置 maxLabel 属性。",
        "type": "string",
        "defaultValue": "undefined"
      },
      {
        "prop": "formatValue",
        "description": "设置 formatValue 属性。",
        "type": "(value: number) => string",
        "defaultValue": "undefined"
      },
      {
        "prop": "name",
        "description": "定义表单提交时使用的字段名称。",
        "type": "string",
        "defaultValue": "—"
      },
      {
        "prop": "list",
        "description": "关联 datalist 的 id，为输入提供原生建议值。",
        "type": "string",
        "defaultValue": "—"
      },
      {
        "prop": "form",
        "description": "通过表单 id 把输入关联到其所属 form 元素。",
        "type": "string",
        "defaultValue": "最近的祖先 form"
      }
    ],
    "relatedTypes": [
      {
        "kind": "enum",
        "name": "DlSize",
        "title": "DlSize",
        "description": "组件可用的标准尺寸。",
        "rows": [
          {
            "prop": "sm",
            "description": "紧凑尺寸，适合密集界面和次要操作。",
            "type": "'sm'",
            "defaultValue": "紧凑"
          },
          {
            "prop": "md",
            "description": "默认尺寸，适合大多数常规界面。",
            "type": "'md'",
            "defaultValue": "标准"
          },
          {
            "prop": "lg",
            "description": "放大尺寸，适合重点内容和宽松布局。",
            "type": "'lg'",
            "defaultValue": "宽松"
          }
        ]
      }
    ]
  },
  "input-reset": {
    "props": [
      {
        "prop": "value",
        "description": "表单提交或选择操作使用的值。",
        "type": "string",
        "defaultValue": "'重置'"
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
        "description": "定义表单提交时使用的字段名称。",
        "type": "string",
        "defaultValue": "—"
      },
      {
        "prop": "form",
        "description": "通过表单 id 把输入关联到其所属 form 元素。",
        "type": "string",
        "defaultValue": "最近的祖先 form"
      }
    ],
    "relatedTypes": [
      {
        "kind": "enum",
        "name": "DlSize",
        "title": "DlSize",
        "description": "组件可用的标准尺寸。",
        "rows": [
          {
            "prop": "sm",
            "description": "紧凑尺寸，适合密集界面和次要操作。",
            "type": "'sm'",
            "defaultValue": "紧凑"
          },
          {
            "prop": "md",
            "description": "默认尺寸，适合大多数常规界面。",
            "type": "'md'",
            "defaultValue": "标准"
          },
          {
            "prop": "lg",
            "description": "放大尺寸，适合重点内容和宽松布局。",
            "type": "'lg'",
            "defaultValue": "宽松"
          }
        ]
      }
    ]
  },
  "input-search": {
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
      },
      {
        "prop": "readonly",
        "description": "是否只读；保留浏览能力但禁止修改。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "clearable",
        "description": "是否允许再次操作以清空当前值。",
        "type": "boolean",
        "defaultValue": "true"
      },
      {
        "prop": "submitButton",
        "description": "设置 submitButton 属性。",
        "type": "boolean",
        "defaultValue": "true"
      },
      {
        "prop": "searchOnInput",
        "description": "设置 searchOnInput 属性。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "debounce",
        "description": "源文本变化后等待多少毫秒再刷新预览；设为 0 时同步解析。",
        "type": "number",
        "defaultValue": "250"
      },
      {
        "prop": "name",
        "description": "定义表单提交时使用的字段名称。",
        "type": "string",
        "defaultValue": "—"
      },
      {
        "prop": "autocomplete",
        "description": "提示浏览器该字段允许采用的自动填充语义。",
        "type": "string",
        "defaultValue": "—"
      },
      {
        "prop": "list",
        "description": "关联 datalist 的 id，为输入提供原生建议值。",
        "type": "string",
        "defaultValue": "—"
      },
      {
        "prop": "minlength",
        "description": "要求输入至少包含指定数量的 UTF-16 代码单元。",
        "type": "non-negative integer",
        "defaultValue": "—"
      },
      {
        "prop": "maxlength",
        "description": "限制用户可输入的 UTF-16 代码单元最大数量。",
        "type": "non-negative integer",
        "defaultValue": "—"
      },
      {
        "prop": "pattern",
        "description": "使用 JavaScript 正则表达式约束输入的完整值。",
        "type": "regular expression source",
        "defaultValue": "—"
      },
      {
        "prop": "placeholder",
        "description": "在空值时显示简短格式提示，不能替代 label。",
        "type": "string",
        "defaultValue": "—"
      },
      {
        "prop": "required",
        "description": "要求该控件在表单提交前提供有效值或选择。",
        "type": "boolean attribute",
        "defaultValue": "false"
      },
      {
        "prop": "form",
        "description": "通过表单 id 把输入关联到其所属 form 元素。",
        "type": "string",
        "defaultValue": "最近的祖先 form"
      }
    ],
    "relatedTypes": [
      {
        "kind": "enum",
        "name": "DlSize",
        "title": "DlSize",
        "description": "组件可用的标准尺寸。",
        "rows": [
          {
            "prop": "sm",
            "description": "紧凑尺寸，适合密集界面和次要操作。",
            "type": "'sm'",
            "defaultValue": "紧凑"
          },
          {
            "prop": "md",
            "description": "默认尺寸，适合大多数常规界面。",
            "type": "'md'",
            "defaultValue": "标准"
          },
          {
            "prop": "lg",
            "description": "放大尺寸，适合重点内容和宽松布局。",
            "type": "'lg'",
            "defaultValue": "宽松"
          }
        ]
      }
    ]
  },
  "input-submit": {
    "props": [
      {
        "prop": "value",
        "description": "表单提交或选择操作使用的值。",
        "type": "string",
        "defaultValue": "'提交'"
      },
      {
        "prop": "size",
        "description": "设置控件尺寸。",
        "type": "DlSize",
        "defaultValue": "'md'"
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
      },
      {
        "prop": "name",
        "description": "定义表单提交时使用的字段名称。",
        "type": "string",
        "defaultValue": "—"
      },
      {
        "prop": "formaction",
        "description": "覆盖所属表单的 action，仅对提交型输入生效。",
        "type": "URL string",
        "defaultValue": "form.action"
      },
      {
        "prop": "formenctype",
        "description": "覆盖提交数据的编码方式，仅对提交型输入生效。",
        "type": "\"application/x-www-form-urlencoded\" | \"multipart/form-data\" | \"text/plain\"",
        "defaultValue": "form.enctype"
      },
      {
        "prop": "formmethod",
        "description": "覆盖提交使用的 HTTP 方法，仅对提交型输入生效。",
        "type": "\"get\" | \"post\" | \"dialog\"",
        "defaultValue": "form.method"
      },
      {
        "prop": "formnovalidate",
        "description": "提交时跳过原生约束校验，仅对提交型输入生效。",
        "type": "boolean attribute",
        "defaultValue": "false"
      },
      {
        "prop": "formtarget",
        "description": "覆盖提交结果打开的位置，仅对提交型输入生效。",
        "type": "string",
        "defaultValue": "form.target"
      },
      {
        "prop": "form",
        "description": "通过表单 id 把输入关联到其所属 form 元素。",
        "type": "string",
        "defaultValue": "最近的祖先 form"
      }
    ],
    "relatedTypes": [
      {
        "kind": "enum",
        "name": "DlSize",
        "title": "DlSize",
        "description": "组件可用的标准尺寸。",
        "rows": [
          {
            "prop": "sm",
            "description": "紧凑尺寸，适合密集界面和次要操作。",
            "type": "'sm'",
            "defaultValue": "紧凑"
          },
          {
            "prop": "md",
            "description": "默认尺寸，适合大多数常规界面。",
            "type": "'md'",
            "defaultValue": "标准"
          },
          {
            "prop": "lg",
            "description": "放大尺寸，适合重点内容和宽松布局。",
            "type": "'lg'",
            "defaultValue": "宽松"
          }
        ]
      }
    ]
  },
  "input-tel": {
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
      },
      {
        "prop": "readonly",
        "description": "是否只读；保留浏览能力但禁止修改。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "clearable",
        "description": "是否允许再次操作以清空当前值。",
        "type": "boolean",
        "defaultValue": "true"
      },
      {
        "prop": "format",
        "description": "设置 format 属性。",
        "type": "'none' | 'cn-mobile'",
        "defaultValue": "'none'"
      },
      {
        "prop": "name",
        "description": "定义表单提交时使用的字段名称。",
        "type": "string",
        "defaultValue": "—"
      },
      {
        "prop": "autocomplete",
        "description": "提示浏览器该字段允许采用的自动填充语义。",
        "type": "string",
        "defaultValue": "—"
      },
      {
        "prop": "list",
        "description": "关联 datalist 的 id，为输入提供原生建议值。",
        "type": "string",
        "defaultValue": "—"
      },
      {
        "prop": "minlength",
        "description": "要求输入至少包含指定数量的 UTF-16 代码单元。",
        "type": "non-negative integer",
        "defaultValue": "—"
      },
      {
        "prop": "maxlength",
        "description": "限制用户可输入的 UTF-16 代码单元最大数量。",
        "type": "non-negative integer",
        "defaultValue": "—"
      },
      {
        "prop": "pattern",
        "description": "使用 JavaScript 正则表达式约束输入的完整值。",
        "type": "regular expression source",
        "defaultValue": "—"
      },
      {
        "prop": "placeholder",
        "description": "在空值时显示简短格式提示，不能替代 label。",
        "type": "string",
        "defaultValue": "—"
      },
      {
        "prop": "required",
        "description": "要求该控件在表单提交前提供有效值或选择。",
        "type": "boolean attribute",
        "defaultValue": "false"
      },
      {
        "prop": "form",
        "description": "通过表单 id 把输入关联到其所属 form 元素。",
        "type": "string",
        "defaultValue": "最近的祖先 form"
      }
    ],
    "relatedTypes": [
      {
        "kind": "enum",
        "name": "DlSize",
        "title": "DlSize",
        "description": "组件可用的标准尺寸。",
        "rows": [
          {
            "prop": "sm",
            "description": "紧凑尺寸，适合密集界面和次要操作。",
            "type": "'sm'",
            "defaultValue": "紧凑"
          },
          {
            "prop": "md",
            "description": "默认尺寸，适合大多数常规界面。",
            "type": "'md'",
            "defaultValue": "标准"
          },
          {
            "prop": "lg",
            "description": "放大尺寸，适合重点内容和宽松布局。",
            "type": "'lg'",
            "defaultValue": "宽松"
          }
        ]
      }
    ]
  },
  "input-text": {
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
      },
      {
        "prop": "readonly",
        "description": "是否只读；保留浏览能力但禁止修改。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "clearable",
        "description": "是否允许再次操作以清空当前值。",
        "type": "boolean",
        "defaultValue": "true"
      },
      {
        "prop": "showCount",
        "description": "设置 showCount 属性。",
        "type": "boolean",
        "defaultValue": "true"
      },
      {
        "prop": "trimOnBlur",
        "description": "设置 trimOnBlur 属性。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "selectOnFocus",
        "description": "设置 selectOnFocus 属性。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "name",
        "description": "定义表单提交时使用的字段名称。",
        "type": "string",
        "defaultValue": "—"
      },
      {
        "prop": "autocomplete",
        "description": "提示浏览器该字段允许采用的自动填充语义。",
        "type": "string",
        "defaultValue": "—"
      },
      {
        "prop": "list",
        "description": "关联 datalist 的 id，为输入提供原生建议值。",
        "type": "string",
        "defaultValue": "—"
      },
      {
        "prop": "minlength",
        "description": "要求输入至少包含指定数量的 UTF-16 代码单元。",
        "type": "non-negative integer",
        "defaultValue": "—"
      },
      {
        "prop": "maxlength",
        "description": "限制用户可输入的 UTF-16 代码单元最大数量。",
        "type": "non-negative integer",
        "defaultValue": "—"
      },
      {
        "prop": "pattern",
        "description": "使用 JavaScript 正则表达式约束输入的完整值。",
        "type": "regular expression source",
        "defaultValue": "—"
      },
      {
        "prop": "placeholder",
        "description": "在空值时显示简短格式提示，不能替代 label。",
        "type": "string",
        "defaultValue": "—"
      },
      {
        "prop": "required",
        "description": "要求该控件在表单提交前提供有效值或选择。",
        "type": "boolean attribute",
        "defaultValue": "false"
      },
      {
        "prop": "form",
        "description": "通过表单 id 把输入关联到其所属 form 元素。",
        "type": "string",
        "defaultValue": "最近的祖先 form"
      }
    ],
    "relatedTypes": [
      {
        "kind": "enum",
        "name": "DlSize",
        "title": "DlSize",
        "description": "组件可用的标准尺寸。",
        "rows": [
          {
            "prop": "sm",
            "description": "紧凑尺寸，适合密集界面和次要操作。",
            "type": "'sm'",
            "defaultValue": "紧凑"
          },
          {
            "prop": "md",
            "description": "默认尺寸，适合大多数常规界面。",
            "type": "'md'",
            "defaultValue": "标准"
          },
          {
            "prop": "lg",
            "description": "放大尺寸，适合重点内容和宽松布局。",
            "type": "'lg'",
            "defaultValue": "宽松"
          }
        ]
      }
    ]
  },
  "input-url": {
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
      },
      {
        "prop": "readonly",
        "description": "是否只读；保留浏览能力但禁止修改。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "clearable",
        "description": "是否允许再次操作以清空当前值。",
        "type": "boolean",
        "defaultValue": "true"
      },
      {
        "prop": "normalizeOnBlur",
        "description": "设置 normalizeOnBlur 属性。",
        "type": "boolean",
        "defaultValue": "true"
      },
      {
        "prop": "openable",
        "description": "设置 openable 属性。",
        "type": "boolean",
        "defaultValue": "true"
      },
      {
        "prop": "name",
        "description": "定义表单提交时使用的字段名称。",
        "type": "string",
        "defaultValue": "—"
      },
      {
        "prop": "autocomplete",
        "description": "提示浏览器该字段允许采用的自动填充语义。",
        "type": "string",
        "defaultValue": "—"
      },
      {
        "prop": "list",
        "description": "关联 datalist 的 id，为输入提供原生建议值。",
        "type": "string",
        "defaultValue": "—"
      },
      {
        "prop": "minlength",
        "description": "要求输入至少包含指定数量的 UTF-16 代码单元。",
        "type": "non-negative integer",
        "defaultValue": "—"
      },
      {
        "prop": "maxlength",
        "description": "限制用户可输入的 UTF-16 代码单元最大数量。",
        "type": "non-negative integer",
        "defaultValue": "—"
      },
      {
        "prop": "pattern",
        "description": "使用 JavaScript 正则表达式约束输入的完整值。",
        "type": "regular expression source",
        "defaultValue": "—"
      },
      {
        "prop": "placeholder",
        "description": "在空值时显示简短格式提示，不能替代 label。",
        "type": "string",
        "defaultValue": "—"
      },
      {
        "prop": "required",
        "description": "要求该控件在表单提交前提供有效值或选择。",
        "type": "boolean attribute",
        "defaultValue": "false"
      },
      {
        "prop": "form",
        "description": "通过表单 id 把输入关联到其所属 form 元素。",
        "type": "string",
        "defaultValue": "最近的祖先 form"
      }
    ],
    "relatedTypes": [
      {
        "kind": "enum",
        "name": "DlSize",
        "title": "DlSize",
        "description": "组件可用的标准尺寸。",
        "rows": [
          {
            "prop": "sm",
            "description": "紧凑尺寸，适合密集界面和次要操作。",
            "type": "'sm'",
            "defaultValue": "紧凑"
          },
          {
            "prop": "md",
            "description": "默认尺寸，适合大多数常规界面。",
            "type": "'md'",
            "defaultValue": "标准"
          },
          {
            "prop": "lg",
            "description": "放大尺寸，适合重点内容和宽松布局。",
            "type": "'lg'",
            "defaultValue": "宽松"
          }
        ]
      }
    ]
  },
  "input-week": {
    "props": [
      {
        "prop": "modelValue",
        "description": "组件当前值；使用 v-model 进行双向绑定。",
        "type": "string | null",
        "defaultValue": "''"
      },
      {
        "prop": "min",
        "description": "允许的最小值。",
        "type": "string",
        "defaultValue": "undefined"
      },
      {
        "prop": "max",
        "description": "允许的最大值。",
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
      },
      {
        "prop": "readonly",
        "description": "是否只读；保留浏览能力但禁止修改。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "clearable",
        "description": "是否允许再次操作以清空当前值。",
        "type": "boolean",
        "defaultValue": "true"
      },
      {
        "prop": "currentShortcut",
        "description": "设置 currentShortcut 属性。",
        "type": "boolean",
        "defaultValue": "true"
      },
      {
        "prop": "name",
        "description": "定义表单提交时使用的字段名称。",
        "type": "string",
        "defaultValue": "—"
      },
      {
        "prop": "step",
        "description": "设置合法值之间的步进间隔；可使用 any 取消步进约束。",
        "type": "number | \"any\"",
        "defaultValue": "类型默认值"
      },
      {
        "prop": "list",
        "description": "关联 datalist 的 id，为输入提供原生建议值。",
        "type": "string",
        "defaultValue": "—"
      },
      {
        "prop": "required",
        "description": "要求该控件在表单提交前提供有效值或选择。",
        "type": "boolean attribute",
        "defaultValue": "false"
      },
      {
        "prop": "form",
        "description": "通过表单 id 把输入关联到其所属 form 元素。",
        "type": "string",
        "defaultValue": "最近的祖先 form"
      }
    ],
    "relatedTypes": [
      {
        "kind": "enum",
        "name": "DlSize",
        "title": "DlSize",
        "description": "组件可用的标准尺寸。",
        "rows": [
          {
            "prop": "sm",
            "description": "紧凑尺寸，适合密集界面和次要操作。",
            "type": "'sm'",
            "defaultValue": "紧凑"
          },
          {
            "prop": "md",
            "description": "默认尺寸，适合大多数常规界面。",
            "type": "'md'",
            "defaultValue": "标准"
          },
          {
            "prop": "lg",
            "description": "放大尺寸，适合重点内容和宽松布局。",
            "type": "'lg'",
            "defaultValue": "宽松"
          }
        ]
      }
    ]
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
    "relatedTypes": []
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
    "relatedTypes": [
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
        "kind": "structure",
        "title": "DlChoiceOption[]"
      }
    ]
  },
  "mdx": {
    "props": [
      {
        "prop": "modelValue",
        "description": "组件当前值；使用 v-model 进行双向绑定。",
        "type": "string | null",
        "defaultValue": "''"
      },
      {
        "prop": "mode",
        "description": "编辑器当前视图模式；使用 v-model:mode 进行双向绑定。",
        "type": "DlMdxMode",
        "defaultValue": "'split'"
      },
      {
        "prop": "toolbar",
        "description": "格式工具栏中启用的动作及排列顺序；不传时显示全部内置动作。",
        "type": "DlMdxToolbarAction[]",
        "defaultValue": "undefined"
      },
      {
        "prop": "linkPolicy",
        "description": "链接、外部页面与图片资源的安全渲染策略。",
        "type": "DlMdxLinkPolicy",
        "defaultValue": "undefined"
      },
      {
        "prop": "placeholder",
        "description": "当前值为空时显示的占位提示。",
        "type": "string",
        "defaultValue": "'开始书写 Markdown…'"
      },
      {
        "prop": "emptyText",
        "description": "文档没有可渲染内容时显示的占位说明。",
        "type": "string",
        "defaultValue": "'还没有可预览的内容。'"
      },
      {
        "prop": "readonly",
        "description": "是否只读；保留浏览能力但禁止修改。",
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
        "prop": "lineWrapping",
        "description": "是否在编辑器中启用长行自动换行。",
        "type": "boolean",
        "defaultValue": "true"
      },
      {
        "prop": "showToolbar",
        "description": "是否显示格式操作和视图模式工具栏。",
        "type": "boolean",
        "defaultValue": "true"
      },
      {
        "prop": "showStatus",
        "description": "是否显示行数、字符数、阅读时间和解析状态。",
        "type": "boolean",
        "defaultValue": "true"
      },
      {
        "prop": "taskInteractive",
        "description": "是否允许在预览区直接切换任务列表状态。",
        "type": "boolean",
        "defaultValue": "true"
      },
      {
        "prop": "debounce",
        "description": "源文本变化后等待多少毫秒再刷新预览；设为 0 时同步解析。",
        "type": "number",
        "defaultValue": "120"
      },
      {
        "prop": "minHeight",
        "description": "组件或工作区允许使用的最小高度。",
        "type": "string",
        "defaultValue": "'28rem'"
      },
      {
        "prop": "maxPreviewHeight",
        "description": "预览区域的最大高度，超过后在区域内滚动。",
        "type": "string",
        "defaultValue": "'none'"
      },
      {
        "prop": "ariaLabel",
        "description": "提供给辅助技术读取的控件名称。",
        "type": "string",
        "defaultValue": "'MarkdownX 文档'"
      },
      {
        "prop": "registry",
        "description": "覆盖 main.ts 注入的全局 MarkdownX 组件注册表；通常无需逐实例传入。",
        "type": "DlMdxRegistry",
        "defaultValue": "undefined"
      },
      {
        "prop": "actions",
        "description": "设置 actions 属性。",
        "type": "DlMdxActionMap",
        "defaultValue": "undefined"
      },
      {
        "prop": "scriptValue",
        "description": "设置 scriptValue 属性。",
        "type": "string | null",
        "defaultValue": "null"
      },
      {
        "prop": "styleValue",
        "description": "设置 styleValue 属性。",
        "type": "string | null",
        "defaultValue": "null"
      },
      {
        "prop": "showCompanionDocuments",
        "description": "设置 showCompanionDocuments 属性。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "scriptLanguage",
        "description": "设置 scriptLanguage 属性。",
        "type": "'javascript' | 'typescript'",
        "defaultValue": "'typescript'"
      },
      {
        "prop": "languageOptions",
        "description": "设置 languageOptions 属性。",
        "type": "DlMdxLanguageOptions",
        "defaultValue": "undefined"
      },
      {
        "prop": "formatOptions",
        "description": "传递给 Intl.NumberFormat 的数字格式化选项。",
        "type": "DlMdxFormatOptions",
        "defaultValue": "undefined"
      },
      {
        "prop": "sourceLanguage",
        "description": "设置 sourceLanguage 属性。",
        "type": "DlMdxEditorDocumentLanguage",
        "defaultValue": "'mdx'"
      },
      {
        "prop": "runtimeSymbols",
        "description": "设置 runtimeSymbols 属性。",
        "type": "DlMdxRuntimeSymbol[]",
        "defaultValue": "() => []"
      }
    ],
    "relatedTypes": [
      {
        "kind": "enum",
        "name": "DlMdxMode",
        "title": "DlMdxMode",
        "description": "MarkdownX 的编辑、预览和分栏工作模式。",
        "rows": [
          {
            "prop": "edit",
            "description": "只显示 CodeMirror 编辑器，适合集中书写。",
            "type": "'edit'",
            "defaultValue": "编辑"
          },
          {
            "prop": "preview",
            "description": "只显示结构化安全预览，适合发布和阅读。",
            "type": "'preview'",
            "defaultValue": "预览"
          },
          {
            "prop": "split",
            "description": "并排显示编辑器与实时预览，小屏时自动上下排列。",
            "type": "'split'",
            "defaultValue": "分栏"
          }
        ]
      },
      {
        "kind": "enum",
        "name": "DlMdxToolbarAction",
        "title": "DlMdxToolbarAction[]",
        "description": "MarkdownX 内置格式工具栏支持的动作。",
        "rows": [
          {
            "prop": "bold",
            "description": "切换当前选区的粗体标记。",
            "type": "'bold'",
            "defaultValue": "粗体"
          },
          {
            "prop": "italic",
            "description": "切换当前选区的斜体标记。",
            "type": "'italic'",
            "defaultValue": "斜体"
          },
          {
            "prop": "strike",
            "description": "切换当前选区的删除线标记。",
            "type": "'strike'",
            "defaultValue": "删除线"
          },
          {
            "prop": "inline-code",
            "description": "切换当前选区的行内代码标记。",
            "type": "'inline-code'",
            "defaultValue": "行内代码"
          },
          {
            "prop": "link",
            "description": "把当前选区转换为 Markdown 链接。",
            "type": "'link'",
            "defaultValue": "链接"
          },
          {
            "prop": "heading",
            "description": "把当前行切换为二级标题。",
            "type": "'heading'",
            "defaultValue": "标题"
          },
          {
            "prop": "blockquote",
            "description": "切换当前行或所选行的引用前缀。",
            "type": "'blockquote'",
            "defaultValue": "引用"
          },
          {
            "prop": "unordered-list",
            "description": "切换当前行或所选行的无序列表前缀。",
            "type": "'unordered-list'",
            "defaultValue": "无序列表"
          },
          {
            "prop": "task-list",
            "description": "切换当前行或所选行的任务列表前缀。",
            "type": "'task-list'",
            "defaultValue": "任务列表"
          },
          {
            "prop": "code-block",
            "description": "把选区插入 TypeScript 围栏代码块。",
            "type": "'code-block'",
            "defaultValue": "代码块"
          },
          {
            "prop": "component",
            "description": "插入显式插槽渲染的安全组件块。",
            "type": "'component'",
            "defaultValue": "组件块"
          },
          {
            "prop": "format",
            "description": "DlMdxToolbarAction 的 format 选项。",
            "type": "'format'",
            "defaultValue": "枚举值"
          }
        ]
      },
      {
        "name": "DlMdxLinkPolicy",
        "description": "MarkdownX 对外部链接、打开方式和图片资源的安全策略。",
        "rows": [
          {
            "prop": "allowExternal",
            "description": "是否允许 http 与 https 外部链接；关闭后相对路径仍然可用。",
            "type": "boolean",
            "defaultValue": "可选"
          },
          {
            "prop": "openExternal",
            "description": "是否在新标签页打开外部链接；外部链接始终带有 noopener noreferrer。",
            "type": "boolean",
            "defaultValue": "可选"
          },
          {
            "prop": "allowImages",
            "description": "是否允许渲染 Markdown 图片。",
            "type": "boolean",
            "defaultValue": "可选"
          },
          {
            "prop": "allowDataImages",
            "description": "是否额外允许受限的 base64 图片 Data URL；默认关闭。",
            "type": "boolean",
            "defaultValue": "可选"
          }
        ],
        "kind": "structure",
        "title": "DlMdxLinkPolicy"
      },
      {
        "name": "DlMdxRegistry",
        "description": "可通过 app.use 安装，并支持注册、覆盖、查询和移除组件定义的全局注册表。",
        "rows": [
          {
            "prop": "install",
            "description": "把当前工具注入 Vue 应用；通常由 app.use 自动调用。",
            "type": "(app: App) => void",
            "defaultValue": "必填"
          },
          {
            "prop": "register",
            "description": "注册或按规范化名称覆盖一个组件定义。",
            "type": "(definition: DlMdxComponentDefinition) => DlMdxRegistry",
            "defaultValue": "必填"
          },
          {
            "prop": "registerAll",
            "description": "按顺序注册一组组件定义，后注册的同名定义优先。",
            "type": "(definitions: DlMdxComponentDefinition[]) => DlMdxRegistry",
            "defaultValue": "必填"
          },
          {
            "prop": "unregister",
            "description": "按名称或别名移除一个注册定义。",
            "type": "(name: string) => boolean",
            "defaultValue": "必填"
          },
          {
            "prop": "resolve",
            "description": "按组件名或别名查询当前生效的注册定义。",
            "type": "(name: string) => DlMdxComponentDefinition | undefined",
            "defaultValue": "必填"
          },
          {
            "prop": "entries",
            "description": "按注册顺序返回去重后的组件定义快照。",
            "type": "() => DlMdxComponentDefinition[]",
            "defaultValue": "必填"
          }
        ],
        "kind": "structure",
        "title": "DlMdxRegistry"
      },
      {
        "name": "DlMdxComponentDefinition",
        "description": "一个允许 MarkdownX 安全渲染的组件或自定义渲染器定义。",
        "rows": [
          {
            "prop": "name",
            "description": "参与表单提交时使用的字段名称。",
            "type": "string",
            "defaultValue": "必填"
          },
          {
            "prop": "aliases",
            "description": "组件块可使用的附加名称；同时自动支持 Dl 前缀别名。",
            "type": "string[]",
            "defaultValue": "可选"
          },
          {
            "prop": "component",
            "description": "官方或业务注册定义实际渲染的 Vue 组件。",
            "type": "Component",
            "defaultValue": "可选"
          },
          {
            "prop": "render",
            "description": "不直接使用 Vue 组件时，由业务提供的受信任渲染函数。",
            "type": "DlMdxComponentRenderer",
            "defaultValue": "可选"
          },
          {
            "prop": "defaultProps",
            "description": "组件块未覆盖时使用的安全默认属性。",
            "type": "Record<string, DlMdxValue>",
            "defaultValue": "可选"
          },
          {
            "prop": "allowedProps",
            "description": "允许文档传入的属性白名单；不传时读取组件公开 Props。",
            "type": "string[]",
            "defaultValue": "可选"
          },
          {
            "prop": "propSchema",
            "description": "设置 propSchema 字段。",
            "type": "Record<string, DlMdxPropSchema>",
            "defaultValue": "可选"
          },
          {
            "prop": "eventSchema",
            "description": "设置 eventSchema 字段。",
            "type": "Record<string, DlMdxEventSchema>",
            "defaultValue": "可选"
          },
          {
            "prop": "contentProp",
            "description": "指定哪个组件块属性用作默认插槽文本。",
            "type": "string",
            "defaultValue": "可选"
          },
          {
            "prop": "defaultContent",
            "description": "组件块没有提供内容属性时使用的默认插槽文本。",
            "type": "string",
            "defaultValue": "可选"
          },
          {
            "prop": "triggerLabel",
            "description": "需要触发器插槽的浮层组件所显示的默认按钮文字。",
            "type": "string",
            "defaultValue": "可选"
          },
          {
            "prop": "category",
            "description": "官方组件定义所属的文档与功能类别。",
            "type": "DlMdxComponentCategory",
            "defaultValue": "可选"
          },
          {
            "prop": "maturity",
            "description": "组件定义的稳定版、Alpha 或业务自定义标记。",
            "type": "DlMdxComponentMaturity",
            "defaultValue": "可选"
          },
          {
            "prop": "description",
            "description": "补充说明文字；不传时隐藏说明区域。",
            "type": "string",
            "defaultValue": "可选"
          },
          {
            "prop": "insertable",
            "description": "是否允许该可信注册定义出现在 MarkdownX 浮动组件库中。",
            "type": "boolean",
            "defaultValue": "可选"
          }
        ],
        "kind": "structure",
        "title": "DlMdxComponentDefinition[]"
      },
      {
        "name": "DlMdxEventSchema",
        "description": "DlMdxEventSchema 数据结构。",
        "rows": [
          {
            "prop": "description",
            "description": "补充说明文字；不传时隐藏说明区域。",
            "type": "string",
            "defaultValue": "可选"
          },
          {
            "prop": "payload",
            "description": "设置 payload 字段。",
            "type": "DlMdxTypeSchema",
            "defaultValue": "可选"
          },
          {
            "prop": "deprecated",
            "description": "设置 deprecated 字段。",
            "type": "boolean | string",
            "defaultValue": "可选"
          }
        ],
        "kind": "structure",
        "title": "DlMdxEventSchema"
      },
      {
        "name": "DlMdxTypeSchema",
        "description": "DlMdxTypeSchema 数据结构。",
        "rows": [
          {
            "prop": "type",
            "description": "设置组件的选择模式或原生类型。",
            "type": "DlMdxSchemaType | DlMdxSchemaType[]",
            "defaultValue": "可选"
          },
          {
            "prop": "description",
            "description": "补充说明文字；不传时隐藏说明区域。",
            "type": "string",
            "defaultValue": "可选"
          },
          {
            "prop": "enum",
            "description": "设置 enum 字段。",
            "type": "DlMdxValue[]",
            "defaultValue": "可选"
          },
          {
            "prop": "items",
            "description": "用于渲染控件内容的结构化项目列表。",
            "type": "DlMdxTypeSchema",
            "defaultValue": "可选"
          },
          {
            "prop": "properties",
            "description": "设置 properties 字段。",
            "type": "Record<string, DlMdxTypeSchema>",
            "defaultValue": "可选"
          },
          {
            "prop": "requiredProperties",
            "description": "设置 requiredProperties 字段。",
            "type": "string[]",
            "defaultValue": "可选"
          },
          {
            "prop": "minimum",
            "description": "设置 minimum 字段。",
            "type": "number",
            "defaultValue": "可选"
          },
          {
            "prop": "maximum",
            "description": "设置 maximum 字段。",
            "type": "number",
            "defaultValue": "可选"
          },
          {
            "prop": "minLength",
            "description": "设置 minLength 字段。",
            "type": "number",
            "defaultValue": "可选"
          },
          {
            "prop": "maxLength",
            "description": "允许输入的最大字符数。",
            "type": "number",
            "defaultValue": "可选"
          },
          {
            "prop": "pattern",
            "description": "设置 pattern 字段。",
            "type": "string",
            "defaultValue": "可选"
          }
        ],
        "kind": "structure",
        "title": "DlMdxTypeSchema"
      },
      {
        "kind": "enum",
        "name": "DlMdxSchemaType",
        "title": "DlMdxSchemaType[]",
        "description": "DlMdxSchemaType 可用的枚举值。",
        "rows": [
          {
            "prop": "string",
            "description": "DlMdxSchemaType 的 string 选项。",
            "type": "'string'",
            "defaultValue": "枚举值"
          },
          {
            "prop": "number",
            "description": "DlMdxSchemaType 的 number 选项。",
            "type": "'number'",
            "defaultValue": "枚举值"
          },
          {
            "prop": "boolean",
            "description": "DlMdxSchemaType 的 boolean 选项。",
            "type": "'boolean'",
            "defaultValue": "枚举值"
          },
          {
            "prop": "null",
            "description": "DlMdxSchemaType 的 null 选项。",
            "type": "'null'",
            "defaultValue": "枚举值"
          },
          {
            "prop": "array",
            "description": "DlMdxSchemaType 的 array 选项。",
            "type": "'array'",
            "defaultValue": "枚举值"
          },
          {
            "prop": "object",
            "description": "DlMdxSchemaType 的 object 选项。",
            "type": "'object'",
            "defaultValue": "枚举值"
          },
          {
            "prop": "any",
            "description": "DlMdxSchemaType 的 any 选项。",
            "type": "'any'",
            "defaultValue": "枚举值"
          }
        ]
      },
      {
        "kind": "enum",
        "name": "DlMdxComponentCategory",
        "title": "DlMdxComponentCategory",
        "description": "官方注册定义使用的组件类别。",
        "rows": [
          {
            "prop": "foundation",
            "description": "DlMdxComponentCategory 的 foundation 选项。",
            "type": "'foundation'",
            "defaultValue": "枚举值"
          },
          {
            "prop": "layout",
            "description": "DlMdxComponentCategory 的 layout 选项。",
            "type": "'layout'",
            "defaultValue": "枚举值"
          },
          {
            "prop": "form",
            "description": "DlMdxComponentCategory 的 form 选项。",
            "type": "'form'",
            "defaultValue": "枚举值"
          },
          {
            "prop": "color",
            "description": "DlMdxComponentCategory 的 color 选项。",
            "type": "'color'",
            "defaultValue": "枚举值"
          },
          {
            "prop": "dates",
            "description": "DlMdxComponentCategory 的 dates 选项。",
            "type": "'dates'",
            "defaultValue": "枚举值"
          },
          {
            "prop": "general",
            "description": "DlMdxComponentCategory 的 general 选项。",
            "type": "'general'",
            "defaultValue": "枚举值"
          }
        ]
      },
      {
        "kind": "enum",
        "name": "DlMdxComponentMaturity",
        "title": "DlMdxComponentMaturity",
        "description": "官方注册定义的稳定度或自定义来源标记。",
        "rows": [
          {
            "prop": "custom",
            "description": "DlMdxComponentMaturity 的 custom 选项。",
            "type": "'custom'",
            "defaultValue": "枚举值"
          },
          {
            "prop": "stable",
            "description": "DlMdxComponentMaturity 的 stable 选项。",
            "type": "'stable'",
            "defaultValue": "枚举值"
          },
          {
            "prop": "alpha",
            "description": "DlMdxComponentMaturity 的 alpha 选项。",
            "type": "'alpha'",
            "defaultValue": "枚举值"
          }
        ]
      },
      {
        "name": "DlMdxLanguageOptions",
        "description": "DlMdxLanguageOptions 数据结构。",
        "rows": [
          {
            "prop": "completion",
            "description": "设置 completion 字段。",
            "type": "boolean",
            "defaultValue": "可选"
          },
          {
            "prop": "diagnostics",
            "description": "设置 diagnostics 字段。",
            "type": "boolean",
            "defaultValue": "可选"
          },
          {
            "prop": "actionNames",
            "description": "设置 actionNames 字段。",
            "type": "string[]",
            "defaultValue": "可选"
          },
          {
            "prop": "actionDescriptions",
            "description": "设置 actionDescriptions 字段。",
            "type": "Record<string, string>",
            "defaultValue": "可选"
          },
          {
            "prop": "severity",
            "description": "设置 severity 字段。",
            "type": "Partial<Record<DlMdxDiagnosticCode, DlMdxDiagnosticSeverity | 'off'>>",
            "defaultValue": "可选"
          },
          {
            "prop": "validators",
            "description": "设置 validators 字段。",
            "type": "DlMdxValidator[]",
            "defaultValue": "可选"
          }
        ],
        "kind": "structure",
        "title": "DlMdxLanguageOptions"
      },
      {
        "kind": "enum",
        "name": "DlMdxDiagnosticSeverity",
        "title": "DlMdxDiagnosticSeverity",
        "description": "DlMdxDiagnosticSeverity 可用的枚举值。",
        "rows": [
          {
            "prop": "error",
            "description": "DlMdxDiagnosticSeverity 的 error 选项。",
            "type": "'error'",
            "defaultValue": "枚举值"
          },
          {
            "prop": "warning",
            "description": "DlMdxDiagnosticSeverity 的 warning 选项。",
            "type": "'warning'",
            "defaultValue": "枚举值"
          },
          {
            "prop": "info",
            "description": "DlMdxDiagnosticSeverity 的 info 选项。",
            "type": "'info'",
            "defaultValue": "枚举值"
          }
        ]
      },
      {
        "name": "DlMdxFormatOptions",
        "description": "DlMdxFormatOptions 数据结构。",
        "rows": [
          {
            "prop": "propertyOrder",
            "description": "设置 propertyOrder 字段。",
            "type": "'preserve' | 'schema' | 'alphabetical'",
            "defaultValue": "可选"
          },
          {
            "prop": "equalsSpacing",
            "description": "设置 equalsSpacing 字段。",
            "type": "'none' | 'single' | 'align'",
            "defaultValue": "可选"
          },
          {
            "prop": "quoteStyle",
            "description": "设置 quoteStyle 字段。",
            "type": "'preserve' | 'double' | 'single'",
            "defaultValue": "可选"
          },
          {
            "prop": "indentSize",
            "description": "设置 indentSize 字段。",
            "type": "number",
            "defaultValue": "可选"
          },
          {
            "prop": "bulletMarker",
            "description": "设置 bulletMarker 字段。",
            "type": "'preserve' | '-' | '*'",
            "defaultValue": "可选"
          },
          {
            "prop": "normalizeFenceLanguages",
            "description": "设置 normalizeFenceLanguages 字段。",
            "type": "boolean",
            "defaultValue": "可选"
          },
          {
            "prop": "maxBlankLines",
            "description": "设置 maxBlankLines 字段。",
            "type": "number",
            "defaultValue": "可选"
          },
          {
            "prop": "trailingNewline",
            "description": "设置 trailingNewline 字段。",
            "type": "boolean",
            "defaultValue": "可选"
          }
        ],
        "kind": "structure",
        "title": "DlMdxFormatOptions"
      },
      {
        "name": "DlMdxRuntimeSymbol",
        "description": "DlMdxRuntimeSymbol 数据结构。",
        "rows": [
          {
            "prop": "name",
            "description": "参与表单提交时使用的字段名称。",
            "type": "string",
            "defaultValue": "必填"
          },
          {
            "prop": "kind",
            "description": "设置 kind 字段。",
            "type": "'variable' | 'method'",
            "defaultValue": "必填"
          },
          {
            "prop": "description",
            "description": "补充说明文字；不传时隐藏说明区域。",
            "type": "string",
            "defaultValue": "可选"
          },
          {
            "prop": "signature",
            "description": "设置 signature 字段。",
            "type": "string",
            "defaultValue": "可选"
          },
          {
            "prop": "value",
            "description": "表单提交或选择操作使用的值。",
            "type": "unknown",
            "defaultValue": "可选"
          },
          {
            "prop": "resolve",
            "description": "按组件名或别名查询当前生效的注册定义。",
            "type": "() => unknown",
            "defaultValue": "可选"
          }
        ],
        "kind": "structure",
        "title": "DlMdxRuntimeSymbol[]"
      },
      {
        "name": "DlMdxSecurityPolicy",
        "description": "由 app.use 安装的全局 MarkdownX URL 安全守卫，负责验证、完整性检查和状态报告。",
        "rows": [
          {
            "prop": "install",
            "description": "把当前工具注入 Vue 应用；通常由 app.use 自动调用。",
            "type": "(app: App) => void",
            "defaultValue": "必填"
          },
          {
            "prop": "validate",
            "description": "使用冻结白名单和 WASM 完整性守卫验证 URL；失败时返回 undefined。",
            "type": "(value: string, kind: Exclude<DlMdxUrlKind, 'file'>) => string | undefined",
            "defaultValue": "必填"
          },
          {
            "prop": "verifyIntegrity",
            "description": "重新计算并核对白名单的 WASM 完整性指纹。",
            "type": "() => boolean",
            "defaultValue": "必填"
          },
          {
            "prop": "status",
            "description": "设置业务状态及对应视觉反馈。",
            "type": "() => DlMdxSecurityStatus",
            "defaultValue": "必填"
          }
        ],
        "kind": "structure",
        "title": "DlMdxSecurityPolicy"
      },
      {
        "name": "DlMdxSecurityOptions",
        "description": "创建 MarkdownX 域名、协议、文件类型及特殊 URL 白名单时使用的配置。",
        "rows": [
          {
            "prop": "domains",
            "description": "按普通链接、图片和文件分别设置的域名白名单。",
            "type": "DlMdxDomainAllowlist",
            "defaultValue": "必填"
          },
          {
            "prop": "fileExtensions",
            "description": "允许下载或引用的文件扩展名白名单；可填写 pdf 或 tar.gz。",
            "type": "readonly string[]",
            "defaultValue": "可选"
          },
          {
            "prop": "allowedProtocols",
            "description": "外部白名单资源允许使用的网络协议；默认仅 https。",
            "type": "readonly ('https' | 'http')[]",
            "defaultValue": "可选"
          },
          {
            "prop": "allowRelative",
            "description": "是否允许站内相对链接、图片和符合扩展名规则的文件；默认开启。",
            "type": "boolean",
            "defaultValue": "可选"
          },
          {
            "prop": "allowMailto",
            "description": "是否允许 mailto 邮件链接；默认关闭。",
            "type": "boolean",
            "defaultValue": "可选"
          },
          {
            "prop": "allowTel",
            "description": "是否允许 tel 电话链接；默认关闭。",
            "type": "boolean",
            "defaultValue": "可选"
          },
          {
            "prop": "allowDataImages",
            "description": "是否额外允许受限的 base64 图片 Data URL；默认关闭。",
            "type": "boolean",
            "defaultValue": "可选"
          },
          {
            "prop": "allowBlobImages",
            "description": "是否允许浏览器运行时创建的 blob 图片 URL；默认关闭。",
            "type": "boolean",
            "defaultValue": "可选"
          }
        ],
        "kind": "structure",
        "title": "DlMdxSecurityOptions"
      },
      {
        "name": "DlMdxDomainAllowlist",
        "description": "分别约束普通链接、图片、文件以及共享来源的域名规则集合。",
        "rows": [
          {
            "prop": "all",
            "description": "对普通链接、图片和文件同时生效的共享域名规则。",
            "type": "readonly string[]",
            "defaultValue": "可选"
          },
          {
            "prop": "links",
            "description": "允许作为普通页面链接使用的域名规则。",
            "type": "readonly string[]",
            "defaultValue": "可选"
          },
          {
            "prop": "images",
            "description": "允许加载 Markdown 图片资源的域名规则。",
            "type": "readonly string[]",
            "defaultValue": "可选"
          },
          {
            "prop": "files",
            "description": "允许下载文件的域名规则；仍需同时通过扩展名校验。",
            "type": "readonly string[]",
            "defaultValue": "可选"
          }
        ],
        "kind": "structure",
        "title": "DlMdxDomainAllowlist"
      },
      {
        "name": "DlMdxSecurityStatus",
        "description": "Rust/WASM 安全核心的当前状态、指纹和规则数量快照。",
        "rows": [
          {
            "prop": "wasm",
            "description": "安全策略是否已经启用内嵌 Rust/WASM 核心。",
            "type": "true",
            "defaultValue": "必填"
          },
          {
            "prop": "engine",
            "description": "MarkdownX 当前使用的解析与安全核心实现。",
            "type": "'rust-wasm'",
            "defaultValue": "必填"
          },
          {
            "prop": "abiVersion",
            "description": "JavaScript 包装层与 Rust/WASM 核心之间的 ABI 版本。",
            "type": "number",
            "defaultValue": "必填"
          },
          {
            "prop": "binarySize",
            "description": "内嵌 Rust/WASM 二进制的字节数。",
            "type": "number",
            "defaultValue": "必填"
          },
          {
            "prop": "binaryFingerprint",
            "description": "构建时生成的 Rust/WASM 二进制 SHA-256 指纹。",
            "type": "string",
            "defaultValue": "必填"
          },
          {
            "prop": "integrity",
            "description": "当前白名单规范化快照是否通过完整性校验。",
            "type": "boolean",
            "defaultValue": "必填"
          },
          {
            "prop": "fingerprint",
            "description": "由 Rust/WASM 计算的只读白名单完整性指纹。",
            "type": "string",
            "defaultValue": "必填"
          },
          {
            "prop": "domainRuleCount",
            "description": "当前策略包含的域名规则总数。",
            "type": "number",
            "defaultValue": "必填"
          },
          {
            "prop": "fileExtensionCount",
            "description": "当前策略包含的文件扩展名数量。",
            "type": "number",
            "defaultValue": "必填"
          }
        ],
        "kind": "structure",
        "title": "DlMdxSecurityStatus"
      },
      {
        "kind": "enum",
        "name": "DlMdxUrlKind",
        "title": "DlMdxUrlKind",
        "description": "MarkdownX URL 守卫区分的普通链接、图片和文件资源类型。",
        "rows": [
          {
            "prop": "link",
            "description": "普通页面、路由或协议链接。",
            "type": "'link'",
            "defaultValue": "链接"
          },
          {
            "prop": "image",
            "description": "由 Markdown 图片语法引用的资源。",
            "type": "'image'",
            "defaultValue": "图片"
          },
          {
            "prop": "file",
            "description": "带有非页面扩展名并受扩展名白名单约束的下载资源。",
            "type": "'file'",
            "defaultValue": "文件"
          }
        ]
      },
      {
        "name": "DlMdxRustCoreStatus",
        "description": "Rust/WASM 解析核心的 ABI、二进制尺寸和构建指纹。",
        "rows": [
          {
            "prop": "engine",
            "description": "MarkdownX 当前使用的解析与安全核心实现。",
            "type": "'rust-wasm'",
            "defaultValue": "必填"
          },
          {
            "prop": "available",
            "description": "Rust/WASM 核心是否已成功初始化并可调用。",
            "type": "boolean",
            "defaultValue": "必填"
          },
          {
            "prop": "abiVersion",
            "description": "JavaScript 包装层与 Rust/WASM 核心之间的 ABI 版本。",
            "type": "number",
            "defaultValue": "必填"
          },
          {
            "prop": "binarySize",
            "description": "内嵌 Rust/WASM 二进制的字节数。",
            "type": "number",
            "defaultValue": "必填"
          },
          {
            "prop": "binaryFingerprint",
            "description": "构建时生成的 Rust/WASM 二进制 SHA-256 指纹。",
            "type": "string",
            "defaultValue": "必填"
          }
        ],
        "kind": "structure",
        "title": "DlMdxRustCoreStatus"
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
    "relatedTypes": [
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
        "kind": "structure",
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
            "prop": "description",
            "description": "补充说明文字；不传时隐藏说明区域。",
            "type": "string",
            "defaultValue": "可选"
          },
          {
            "prop": "icon",
            "description": "自定义状态图标；不传时按色调选择默认图标。",
            "type": "string",
            "defaultValue": "可选"
          },
          {
            "prop": "checked",
            "description": "设置 checked 字段。",
            "type": "boolean",
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
          },
          {
            "prop": "children",
            "description": "当前节点或导航项包含的下一级项目。",
            "type": "DlMenuItem[]",
            "defaultValue": "可选"
          }
        ],
        "kind": "structure",
        "title": "DlMenuItem[]"
      }
    ]
  },
  "month-picker": {
    "props": [
      {
        "prop": "open",
        "description": "浮层或内容区域是否打开；使用 v-model:open 双向绑定。",
        "type": "boolean",
        "defaultValue": "undefined"
      },
      {
        "prop": "modelValue",
        "description": "组件当前值；使用 v-model 进行双向绑定。",
        "type": "DateValue | DateValue[] | null",
        "defaultValue": "null"
      },
      {
        "prop": "placeholder",
        "description": "当前值为空时显示的占位提示。",
        "type": "string",
        "defaultValue": "'选择月份'"
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
        "prop": "preventDeselect",
        "description": "设置 preventDeselect 属性。",
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
      },
      {
        "prop": "zIndex",
        "description": "覆盖默认浮层层级；不传时由 Dragon Liquid 层级系统计算。",
        "type": "number",
        "defaultValue": "undefined"
      }
    ],
    "relatedTypes": []
  },
  "month-range-picker": {
    "props": [
      {
        "prop": "open",
        "description": "浮层或内容区域是否打开；使用 v-model:open 双向绑定。",
        "type": "boolean",
        "defaultValue": "undefined"
      },
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
        "defaultValue": "'选择月份范围'"
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
      },
      {
        "prop": "zIndex",
        "description": "覆盖默认浮层层级；不传时由 Dragon Liquid 层级系统计算。",
        "type": "number",
        "defaultValue": "undefined"
      }
    ],
    "relatedTypes": []
  },
  "multi-choice": {
    "props": [
      {
        "prop": "open",
        "description": "浮层或内容区域是否打开；使用 v-model:open 双向绑定。",
        "type": "boolean",
        "defaultValue": "undefined"
      },
      {
        "prop": "modelValue",
        "description": "组件当前值；使用 v-model 进行双向绑定。",
        "type": "string[]",
        "defaultValue": "() => []"
      },
      {
        "prop": "options",
        "description": "可供用户选择的选项列表。",
        "type": "DlMultiChoiceEntry[]",
        "defaultValue": "—"
      },
      {
        "prop": "placeholder",
        "description": "当前值为空时显示的占位提示。",
        "type": "string",
        "defaultValue": "'请选择多项'"
      },
      {
        "prop": "searchPlaceholder",
        "description": "搜索输入框为空时显示的提示文字。",
        "type": "string",
        "defaultValue": "'搜索名称、值或关键词'"
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
        "type": "MultiChoiceStatus",
        "defaultValue": "'default'"
      },
      {
        "prop": "overlay",
        "description": "设置浮层固定为模态面板、底部抽屉或按视口自动适配。",
        "type": "DlChoicePortalOverlay",
        "defaultValue": "'auto'"
      },
      {
        "prop": "searchable",
        "description": "是否始终显示选项搜索框；不传时根据选项数量自动判断。",
        "type": "boolean",
        "defaultValue": "undefined"
      },
      {
        "prop": "searchThreshold",
        "description": "自动启用搜索框所需的最少选项数量。",
        "type": "number",
        "defaultValue": "8"
      },
      {
        "prop": "clearable",
        "description": "是否允许再次操作以清空当前值。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "maxTagCount",
        "description": "触发器中直接展示的已选标签数量，更多结果合并为计数。",
        "type": "number",
        "defaultValue": "3"
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
    "relatedTypes": [
      {
        "kind": "enum",
        "name": "DlSize",
        "title": "DlSize",
        "description": "组件可用的标准尺寸。",
        "rows": [
          {
            "prop": "sm",
            "description": "紧凑尺寸，适合密集界面和次要操作。",
            "type": "'sm'",
            "defaultValue": "紧凑"
          },
          {
            "prop": "md",
            "description": "默认尺寸，适合大多数常规界面。",
            "type": "'md'",
            "defaultValue": "标准"
          },
          {
            "prop": "lg",
            "description": "放大尺寸，适合重点内容和宽松布局。",
            "type": "'lg'",
            "defaultValue": "宽松"
          }
        ]
      }
    ]
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
    "relatedTypes": [
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
        "kind": "structure",
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
    "relatedTypes": [
      {
        "kind": "enum",
        "name": "DlSize",
        "title": "DlSize",
        "description": "组件可用的标准尺寸。",
        "rows": [
          {
            "prop": "sm",
            "description": "紧凑尺寸，适合密集界面和次要操作。",
            "type": "'sm'",
            "defaultValue": "紧凑"
          },
          {
            "prop": "md",
            "description": "默认尺寸，适合大多数常规界面。",
            "type": "'md'",
            "defaultValue": "标准"
          },
          {
            "prop": "lg",
            "description": "放大尺寸，适合重点内容和宽松布局。",
            "type": "'lg'",
            "defaultValue": "宽松"
          }
        ]
      }
    ]
  },
  "page-frame": {
    "props": [
      {
        "prop": "as",
        "description": "设置 as 属性。",
        "type": "string",
        "defaultValue": "'main'"
      },
      {
        "prop": "layout",
        "description": "设置 layout 属性。",
        "type": "'article' | 'sidebar' | 'aside' | 'three-column' | 'full'",
        "defaultValue": "'article'"
      },
      {
        "prop": "sidebarWidth",
        "description": "设置 sidebarWidth 属性。",
        "type": "string",
        "defaultValue": "'240px'"
      },
      {
        "prop": "asideWidth",
        "description": "设置 asideWidth 属性。",
        "type": "string",
        "defaultValue": "'220px'"
      },
      {
        "prop": "gap",
        "description": "设置 gap 属性。",
        "type": "string",
        "defaultValue": "'36px'"
      },
      {
        "prop": "stickySecondary",
        "description": "设置 stickySecondary 属性。",
        "type": "boolean",
        "defaultValue": "true"
      }
    ],
    "relatedTypes": []
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
    "relatedTypes": []
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
    "relatedTypes": [
      {
        "kind": "enum",
        "name": "DlSize",
        "title": "DlSize",
        "description": "组件可用的标准尺寸。",
        "rows": [
          {
            "prop": "sm",
            "description": "紧凑尺寸，适合密集界面和次要操作。",
            "type": "'sm'",
            "defaultValue": "紧凑"
          },
          {
            "prop": "md",
            "description": "默认尺寸，适合大多数常规界面。",
            "type": "'md'",
            "defaultValue": "标准"
          },
          {
            "prop": "lg",
            "description": "放大尺寸，适合重点内容和宽松布局。",
            "type": "'lg'",
            "defaultValue": "宽松"
          }
        ]
      }
    ]
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
        "type": "DlOverlaySide | DlOverlayBaseSide",
        "defaultValue": "DlOverlaySide.Bottom"
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
        "type": "DlPopoverTone",
        "defaultValue": "'default'"
      },
      {
        "prop": "closeLabel",
        "description": "关闭按钮的无障碍名称。",
        "type": "string",
        "defaultValue": "'关闭'"
      },
      {
        "prop": "arrow",
        "description": "是否显示指向触发器的箭头；Popover 与 Tooltip 关闭箭头后，未显式设置的间距会自动归零。",
        "type": "boolean",
        "defaultValue": "true"
      },
      {
        "prop": "sideOffset",
        "description": "浮层与触发器之间的间距；Popover 有箭头时默认 6、无箭头时默认 0，Tooltip 默认 4。",
        "type": "number",
        "defaultValue": "undefined"
      },
      {
        "prop": "contentClass",
        "description": "设置 contentClass 属性。",
        "type": "string",
        "defaultValue": "undefined"
      },
      {
        "prop": "manualTrigger",
        "description": "设置 manualTrigger 属性。",
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
    "relatedTypes": [
      {
        "kind": "enum",
        "name": "DlOverlaySide",
        "title": "DlOverlaySide",
        "description": "Popover 与 Tooltip 共用的十二方位数字枚举。",
        "rows": [
          {
            "prop": "Top",
            "description": "上方居中。",
            "type": "0",
            "defaultValue": "上"
          },
          {
            "prop": "TopLeft",
            "description": "上方靠左。",
            "type": "1",
            "defaultValue": "左上"
          },
          {
            "prop": "TopRight",
            "description": "上方靠右。",
            "type": "2",
            "defaultValue": "右上"
          },
          {
            "prop": "Right",
            "description": "右侧居中。",
            "type": "3",
            "defaultValue": "右"
          },
          {
            "prop": "RightTop",
            "description": "右侧靠上。",
            "type": "4",
            "defaultValue": "右上"
          },
          {
            "prop": "RightBottom",
            "description": "右侧靠下。",
            "type": "5",
            "defaultValue": "右下"
          },
          {
            "prop": "Bottom",
            "description": "下方居中。",
            "type": "6",
            "defaultValue": "下"
          },
          {
            "prop": "BottomLeft",
            "description": "下方靠左。",
            "type": "7",
            "defaultValue": "左下"
          },
          {
            "prop": "BottomRight",
            "description": "下方靠右。",
            "type": "8",
            "defaultValue": "右下"
          },
          {
            "prop": "Left",
            "description": "左侧居中。",
            "type": "9",
            "defaultValue": "左"
          },
          {
            "prop": "LeftTop",
            "description": "左侧靠上。",
            "type": "10",
            "defaultValue": "左上"
          },
          {
            "prop": "LeftBottom",
            "description": "左侧靠下。",
            "type": "11",
            "defaultValue": "左下"
          }
        ]
      },
      {
        "kind": "enum",
        "name": "DlOverlayBaseSide",
        "title": "DlOverlayBaseSide",
        "description": "兼容 Reka UI 的四个基础方位字符串。",
        "rows": [
          {
            "prop": "top",
            "description": "DlOverlayBaseSide 的 top 选项。",
            "type": "'top'",
            "defaultValue": "枚举值"
          },
          {
            "prop": "right",
            "description": "DlOverlayBaseSide 的 right 选项。",
            "type": "'right'",
            "defaultValue": "枚举值"
          },
          {
            "prop": "bottom",
            "description": "DlOverlayBaseSide 的 bottom 选项。",
            "type": "'bottom'",
            "defaultValue": "枚举值"
          },
          {
            "prop": "left",
            "description": "DlOverlayBaseSide 的 left 选项。",
            "type": "'left'",
            "defaultValue": "枚举值"
          }
        ]
      },
      {
        "kind": "enum",
        "name": "DlPopoverTone",
        "title": "DlPopoverTone",
        "description": "Popover 可用的语义色调，并额外提供低调表面。",
        "rows": [
          {
            "prop": "default",
            "description": "默认气泡卡片色调，适合普通信息与基础任务。",
            "type": "'default'",
            "defaultValue": "中性"
          },
          {
            "prop": "accent",
            "description": "强调色调，适合品牌重点与当前任务。",
            "type": "'accent'",
            "defaultValue": "强调"
          },
          {
            "prop": "success",
            "description": "成功色调，表示任务已经正确完成。",
            "type": "'success'",
            "defaultValue": "成功"
          },
          {
            "prop": "warning",
            "description": "警告色调，提示可恢复且需要留意的问题。",
            "type": "'warning'",
            "defaultValue": "警告"
          },
          {
            "prop": "danger",
            "description": "危险色调，表示失败或高风险操作。",
            "type": "'danger'",
            "defaultValue": "危险"
          },
          {
            "prop": "muted",
            "description": "弱化色调，适合低优先级与只读信息。",
            "type": "'muted'",
            "defaultValue": "弱化"
          },
          {
            "prop": "subtle",
            "description": "低调的纯净表面，适合日期、菜单等以内容为主的紧凑浮层。",
            "type": "'subtle'",
            "defaultValue": "低调"
          }
        ]
      }
    ]
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
    "relatedTypes": [
      {
        "kind": "enum",
        "name": "DlSize",
        "title": "DlSize",
        "description": "组件可用的标准尺寸。",
        "rows": [
          {
            "prop": "sm",
            "description": "紧凑尺寸，适合密集界面和次要操作。",
            "type": "'sm'",
            "defaultValue": "紧凑"
          },
          {
            "prop": "md",
            "description": "默认尺寸，适合大多数常规界面。",
            "type": "'md'",
            "defaultValue": "标准"
          },
          {
            "prop": "lg",
            "description": "放大尺寸，适合重点内容和宽松布局。",
            "type": "'lg'",
            "defaultValue": "宽松"
          }
        ]
      },
      {
        "kind": "enum",
        "name": "DlTone",
        "title": "DlTone",
        "description": "Dragon Liquid 组件共享的语义色调。",
        "rows": [
          {
            "prop": "default",
            "description": "默认中性色调，适合普通信息与基础状态。",
            "type": "'default'",
            "defaultValue": "中性"
          },
          {
            "prop": "accent",
            "description": "强调色调，适合品牌重点、当前任务或推荐内容。",
            "type": "'accent'",
            "defaultValue": "强调"
          },
          {
            "prop": "success",
            "description": "成功色调，表示任务已经正确完成。",
            "type": "'success'",
            "defaultValue": "成功"
          },
          {
            "prop": "warning",
            "description": "警告色调，提示可恢复且需要留意的问题。",
            "type": "'warning'",
            "defaultValue": "警告"
          },
          {
            "prop": "danger",
            "description": "危险色调，表示失败、破坏性操作或高风险状态。",
            "type": "'danger'",
            "defaultValue": "危险"
          },
          {
            "prop": "muted",
            "description": "弱化色调，适合低优先级、只读或后台信息。",
            "type": "'muted'",
            "defaultValue": "弱化"
          }
        ]
      },
      {
        "kind": "enum",
        "name": "DlProgressStatus",
        "title": "DlProgressStatus",
        "description": "Progress 用于表达任务结果的业务状态。",
        "rows": [
          {
            "prop": "default",
            "description": "未指定额外业务状态，视觉由 tone 决定。",
            "type": "'default'",
            "defaultValue": "常规"
          },
          {
            "prop": "success",
            "description": "任务已经完成，并覆盖为成功视觉。",
            "type": "'success'",
            "defaultValue": "成功"
          },
          {
            "prop": "warning",
            "description": "任务仍可继续，但需要用户留意。",
            "type": "'warning'",
            "defaultValue": "警告"
          },
          {
            "prop": "error",
            "description": "任务执行失败；与 danger 使用相同的危险视觉。",
            "type": "'error'",
            "defaultValue": "错误"
          },
          {
            "prop": "danger",
            "description": "任务失败或已经中断，并覆盖为危险视觉。",
            "type": "'danger'",
            "defaultValue": "危险"
          }
        ]
      }
    ]
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
    "relatedTypes": [
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
        "kind": "structure",
        "title": "DlRadioOption[]"
      },
      {
        "kind": "enum",
        "name": "DlSize",
        "title": "DlSize",
        "description": "组件可用的标准尺寸。",
        "rows": [
          {
            "prop": "sm",
            "description": "紧凑尺寸，适合密集界面和次要操作。",
            "type": "'sm'",
            "defaultValue": "紧凑"
          },
          {
            "prop": "md",
            "description": "默认尺寸，适合大多数常规界面。",
            "type": "'md'",
            "defaultValue": "标准"
          },
          {
            "prop": "lg",
            "description": "放大尺寸，适合重点内容和宽松布局。",
            "type": "'lg'",
            "defaultValue": "宽松"
          }
        ]
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
    "relatedTypes": []
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
        "prop": "readonly",
        "description": "是否只读；保留浏览能力但禁止修改。",
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
    "relatedTypes": [
      {
        "kind": "enum",
        "name": "DlSize",
        "title": "DlSize",
        "description": "组件可用的标准尺寸。",
        "rows": [
          {
            "prop": "sm",
            "description": "紧凑尺寸，适合密集界面和次要操作。",
            "type": "'sm'",
            "defaultValue": "紧凑"
          },
          {
            "prop": "md",
            "description": "默认尺寸，适合大多数常规界面。",
            "type": "'md'",
            "defaultValue": "标准"
          },
          {
            "prop": "lg",
            "description": "放大尺寸，适合重点内容和宽松布局。",
            "type": "'lg'",
            "defaultValue": "宽松"
          }
        ]
      }
    ]
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
    "relatedTypes": []
  },
  "segmented": {
    "props": [
      {
        "prop": "modelValue",
        "description": "组件当前值；使用 v-model 进行双向绑定。",
        "type": "string",
        "defaultValue": "''"
      },
      {
        "prop": "items",
        "description": "用于渲染控件内容的结构化项目列表。",
        "type": "DlChoiceOption[]",
        "defaultValue": "—"
      },
      {
        "prop": "size",
        "description": "设置控件尺寸。",
        "type": "DlSize",
        "defaultValue": "'md'"
      },
      {
        "prop": "orientation",
        "description": "设置控件的水平或垂直方向。",
        "type": "'horizontal' | 'vertical'",
        "defaultValue": "'horizontal'"
      },
      {
        "prop": "block",
        "description": "是否让控件占满父容器宽度。",
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
    "relatedTypes": [
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
        "kind": "structure",
        "title": "DlChoiceOption[]"
      },
      {
        "kind": "enum",
        "name": "DlSize",
        "title": "DlSize",
        "description": "组件可用的标准尺寸。",
        "rows": [
          {
            "prop": "sm",
            "description": "紧凑尺寸，适合密集界面和次要操作。",
            "type": "'sm'",
            "defaultValue": "紧凑"
          },
          {
            "prop": "md",
            "description": "默认尺寸，适合大多数常规界面。",
            "type": "'md'",
            "defaultValue": "标准"
          },
          {
            "prop": "lg",
            "description": "放大尺寸，适合重点内容和宽松布局。",
            "type": "'lg'",
            "defaultValue": "宽松"
          }
        ]
      }
    ]
  },
  "select": {
    "props": [
      {
        "prop": "open",
        "description": "浮层或内容区域是否打开；使用 v-model:open 双向绑定。",
        "type": "boolean",
        "defaultValue": "undefined"
      },
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
    "relatedTypes": [
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
        "kind": "structure",
        "title": "DlSelectOption[]"
      },
      {
        "kind": "enum",
        "name": "DlSize",
        "title": "DlSize",
        "description": "组件可用的标准尺寸。",
        "rows": [
          {
            "prop": "sm",
            "description": "紧凑尺寸，适合密集界面和次要操作。",
            "type": "'sm'",
            "defaultValue": "紧凑"
          },
          {
            "prop": "md",
            "description": "默认尺寸，适合大多数常规界面。",
            "type": "'md'",
            "defaultValue": "标准"
          },
          {
            "prop": "lg",
            "description": "放大尺寸，适合重点内容和宽松布局。",
            "type": "'lg'",
            "defaultValue": "宽松"
          }
        ]
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
    "relatedTypes": []
  },
  "site-header": {
    "props": [
      {
        "prop": "siteName",
        "description": "设置 siteName 属性。",
        "type": "string",
        "defaultValue": "—"
      },
      {
        "prop": "caption",
        "description": "设置 caption 属性。",
        "type": "string",
        "defaultValue": "''"
      },
      {
        "prop": "homeHref",
        "description": "设置 homeHref 属性。",
        "type": "string",
        "defaultValue": "'/'"
      },
      {
        "prop": "mark",
        "description": "设置 mark 属性。",
        "type": "string",
        "defaultValue": "'DL'"
      },
      {
        "prop": "sticky",
        "description": "设置 sticky 属性。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "compact",
        "description": "设置 compact 属性。",
        "type": "boolean",
        "defaultValue": "false"
      }
    ],
    "relatedTypes": []
  },
  "site-navigation": {
    "props": [
      {
        "prop": "groups",
        "description": "设置 groups 属性。",
        "type": "DlSiteNavigationGroup[]",
        "defaultValue": "—"
      },
      {
        "prop": "activePath",
        "description": "设置 activePath 属性。",
        "type": "string",
        "defaultValue": "'/'"
      },
      {
        "prop": "mode",
        "description": "编辑器当前视图模式；使用 v-model:mode 进行双向绑定。",
        "type": "'top' | 'sidebar' | 'tabs' | 'rail'",
        "defaultValue": "'sidebar'"
      },
      {
        "prop": "managed",
        "description": "设置 managed 属性。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "label",
        "description": "控件的显示标签或无障碍名称。",
        "type": "string",
        "defaultValue": "'网站导航'"
      }
    ],
    "relatedTypes": []
  },
  "site-shell": {
    "props": [
      {
        "prop": "siteName",
        "description": "设置 siteName 属性。",
        "type": "string",
        "defaultValue": "'Untitled site'"
      },
      {
        "prop": "caption",
        "description": "设置 caption 属性。",
        "type": "string",
        "defaultValue": "''"
      },
      {
        "prop": "mark",
        "description": "设置 mark 属性。",
        "type": "string",
        "defaultValue": "'DL'"
      },
      {
        "prop": "navigation",
        "description": "设置 navigation 属性。",
        "type": "DlSiteNavigationGroup[]",
        "defaultValue": "() => []"
      },
      {
        "prop": "activePath",
        "description": "设置 activePath 属性。",
        "type": "string",
        "defaultValue": "'/'"
      },
      {
        "prop": "navigationMode",
        "description": "设置 navigationMode 属性。",
        "type": "DlSiteNavigationMode",
        "defaultValue": "'hybrid'"
      },
      {
        "prop": "environment",
        "description": "设置 environment 属性。",
        "type": "DlSiteEnvironment",
        "defaultValue": "() => ({})"
      },
      {
        "prop": "contentSize",
        "description": "设置 contentSize 属性。",
        "type": "'sm' | 'md' | 'lg' | 'xl' | 'full'",
        "defaultValue": "'lg'"
      },
      {
        "prop": "stickyHeader",
        "description": "设置 stickyHeader 属性。",
        "type": "boolean",
        "defaultValue": "true"
      },
      {
        "prop": "sidebarWidth",
        "description": "设置 sidebarWidth 属性。",
        "type": "string",
        "defaultValue": "'236px'"
      }
    ],
    "relatedTypes": []
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
    "relatedTypes": [
      {
        "kind": "enum",
        "name": "DlSize",
        "title": "DlSize",
        "description": "组件可用的标准尺寸。",
        "rows": [
          {
            "prop": "sm",
            "description": "紧凑尺寸，适合密集界面和次要操作。",
            "type": "'sm'",
            "defaultValue": "紧凑"
          },
          {
            "prop": "md",
            "description": "默认尺寸，适合大多数常规界面。",
            "type": "'md'",
            "defaultValue": "标准"
          },
          {
            "prop": "lg",
            "description": "放大尺寸，适合重点内容和宽松布局。",
            "type": "'lg'",
            "defaultValue": "宽松"
          }
        ]
      }
    ]
  },
  "split-button": {
    "props": [
      {
        "prop": "label",
        "description": "控件的显示标签或无障碍名称。",
        "type": "string",
        "defaultValue": "''"
      },
      {
        "prop": "items",
        "description": "用于渲染控件内容的结构化项目列表。",
        "type": "DlMenuItem[]",
        "defaultValue": "() => []"
      },
      {
        "prop": "open",
        "description": "浮层或内容区域是否打开；使用 v-model:open 双向绑定。",
        "type": "boolean",
        "defaultValue": "undefined"
      },
      {
        "prop": "variant",
        "description": "设置控件的视觉变体。",
        "type": "DlButtonVariant",
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
      },
      {
        "prop": "mainDisabled",
        "description": "设置 mainDisabled 属性。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "menuDisabled",
        "description": "设置 menuDisabled 属性。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "menuLabel",
        "description": "设置 menuLabel 属性。",
        "type": "string",
        "defaultValue": "''"
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
        "defaultValue": "'end'"
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
    "relatedTypes": [
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
            "prop": "description",
            "description": "补充说明文字；不传时隐藏说明区域。",
            "type": "string",
            "defaultValue": "可选"
          },
          {
            "prop": "icon",
            "description": "自定义状态图标；不传时按色调选择默认图标。",
            "type": "string",
            "defaultValue": "可选"
          },
          {
            "prop": "checked",
            "description": "设置 checked 字段。",
            "type": "boolean",
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
          },
          {
            "prop": "children",
            "description": "当前节点或导航项包含的下一级项目。",
            "type": "DlMenuItem[]",
            "defaultValue": "可选"
          }
        ],
        "kind": "structure",
        "title": "DlMenuItem[]"
      },
      {
        "kind": "enum",
        "name": "DlButtonVariant",
        "title": "DlButtonVariant",
        "description": "DlButtonVariant 可用的枚举值。",
        "rows": [
          {
            "prop": "primary",
            "description": "DlButtonVariant 的 primary 选项。",
            "type": "'primary'",
            "defaultValue": "枚举值"
          },
          {
            "prop": "secondary",
            "description": "DlButtonVariant 的 secondary 选项。",
            "type": "'secondary'",
            "defaultValue": "枚举值"
          },
          {
            "prop": "ghost",
            "description": "DlButtonVariant 的 ghost 选项。",
            "type": "'ghost'",
            "defaultValue": "枚举值"
          },
          {
            "prop": "danger",
            "description": "DlButtonVariant 的 danger 选项。",
            "type": "'danger'",
            "defaultValue": "枚举值"
          }
        ]
      },
      {
        "kind": "enum",
        "name": "DlSize",
        "title": "DlSize",
        "description": "组件可用的标准尺寸。",
        "rows": [
          {
            "prop": "sm",
            "description": "紧凑尺寸，适合密集界面和次要操作。",
            "type": "'sm'",
            "defaultValue": "紧凑"
          },
          {
            "prop": "md",
            "description": "默认尺寸，适合大多数常规界面。",
            "type": "'md'",
            "defaultValue": "标准"
          },
          {
            "prop": "lg",
            "description": "放大尺寸，适合重点内容和宽松布局。",
            "type": "'lg'",
            "defaultValue": "宽松"
          }
        ]
      }
    ]
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
    "relatedTypes": [
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
        "kind": "structure",
        "title": "DlSplitterPanel[]"
      }
    ]
  },
  "stack": {
    "props": [
      {
        "prop": "as",
        "description": "设置 as 属性。",
        "type": "string",
        "defaultValue": "'div'"
      },
      {
        "prop": "gap",
        "description": "设置 gap 属性。",
        "type": "'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",
        "defaultValue": "'md'"
      },
      {
        "prop": "align",
        "description": "设置浮层相对触发器的对齐方式。",
        "type": "'stretch' | 'start' | 'center' | 'end'",
        "defaultValue": "'stretch'"
      }
    ],
    "relatedTypes": []
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
    "relatedTypes": [
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
        "kind": "structure",
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
    "relatedTypes": [
      {
        "kind": "enum",
        "name": "DlSize",
        "title": "DlSize",
        "description": "组件可用的标准尺寸。",
        "rows": [
          {
            "prop": "sm",
            "description": "紧凑尺寸，适合密集界面和次要操作。",
            "type": "'sm'",
            "defaultValue": "紧凑"
          },
          {
            "prop": "md",
            "description": "默认尺寸，适合大多数常规界面。",
            "type": "'md'",
            "defaultValue": "标准"
          },
          {
            "prop": "lg",
            "description": "放大尺寸，适合重点内容和宽松布局。",
            "type": "'lg'",
            "defaultValue": "宽松"
          }
        ]
      }
    ]
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
    "relatedTypes": [
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
        "kind": "structure",
        "title": "DlTabItem[]"
      },
      {
        "kind": "enum",
        "name": "DlSize",
        "title": "DlSize",
        "description": "组件可用的标准尺寸。",
        "rows": [
          {
            "prop": "sm",
            "description": "紧凑尺寸，适合密集界面和次要操作。",
            "type": "'sm'",
            "defaultValue": "紧凑"
          },
          {
            "prop": "md",
            "description": "默认尺寸，适合大多数常规界面。",
            "type": "'md'",
            "defaultValue": "标准"
          },
          {
            "prop": "lg",
            "description": "放大尺寸，适合重点内容和宽松布局。",
            "type": "'lg'",
            "defaultValue": "宽松"
          }
        ]
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
        "defaultValue": "','"
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
    "relatedTypes": []
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
    "relatedTypes": [
      {
        "kind": "enum",
        "name": "DlSize",
        "title": "DlSize",
        "description": "组件可用的标准尺寸。",
        "rows": [
          {
            "prop": "sm",
            "description": "紧凑尺寸，适合密集界面和次要操作。",
            "type": "'sm'",
            "defaultValue": "紧凑"
          },
          {
            "prop": "md",
            "description": "默认尺寸，适合大多数常规界面。",
            "type": "'md'",
            "defaultValue": "标准"
          },
          {
            "prop": "lg",
            "description": "放大尺寸，适合重点内容和宽松布局。",
            "type": "'lg'",
            "defaultValue": "宽松"
          }
        ]
      }
    ]
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
        "prop": "minValue",
        "description": "允许选择的最早日期。",
        "type": "TimeValue",
        "defaultValue": "undefined"
      },
      {
        "prop": "maxValue",
        "description": "允许选择的最晚日期。",
        "type": "TimeValue",
        "defaultValue": "undefined"
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
        "prop": "clearable",
        "description": "是否允许再次操作以清空当前值。",
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
    "relatedTypes": [
      {
        "kind": "enum",
        "name": "DlSize",
        "title": "DlSize",
        "description": "组件可用的标准尺寸。",
        "rows": [
          {
            "prop": "sm",
            "description": "紧凑尺寸，适合密集界面和次要操作。",
            "type": "'sm'",
            "defaultValue": "紧凑"
          },
          {
            "prop": "md",
            "description": "默认尺寸，适合大多数常规界面。",
            "type": "'md'",
            "defaultValue": "标准"
          },
          {
            "prop": "lg",
            "description": "放大尺寸，适合重点内容和宽松布局。",
            "type": "'lg'",
            "defaultValue": "宽松"
          }
        ]
      }
    ]
  },
  "time-picker": {
    "props": [
      {
        "prop": "open",
        "description": "浮层或内容区域是否打开；使用 v-model:open 双向绑定。",
        "type": "boolean",
        "defaultValue": "undefined"
      },
      {
        "prop": "modelValue",
        "description": "组件当前值；使用 v-model 进行双向绑定。",
        "type": "TimeValue | null",
        "defaultValue": "null"
      },
      {
        "prop": "presentation",
        "description": "选择器入口使用可编辑字段或紧凑按钮呈现；不改变值模型和选择面板。",
        "type": "DlTimePickerPresentation",
        "defaultValue": "'field'"
      },
      {
        "prop": "placeholder",
        "description": "当前值为空时显示的占位提示。",
        "type": "string",
        "defaultValue": "'选择时间'"
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
        "type": "'hour' | 'minute'",
        "defaultValue": "'minute'"
      },
      {
        "prop": "hourCycle",
        "description": "时间字段使用 12 小时制或 24 小时制。",
        "type": "12 | 24",
        "defaultValue": "24"
      },
      {
        "prop": "minValue",
        "description": "允许选择的最早日期。",
        "type": "TimeValue",
        "defaultValue": "undefined"
      },
      {
        "prop": "maxValue",
        "description": "允许选择的最晚日期。",
        "type": "TimeValue",
        "defaultValue": "undefined"
      },
      {
        "prop": "minuteStep",
        "description": "分钟滚轮生成选项时使用的步长，限制在 1–30 分钟。",
        "type": "number",
        "defaultValue": "5"
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
        "prop": "overlay",
        "description": "设置浮层固定为模态面板、底部抽屉或按视口自动适配。",
        "type": "'auto' | 'modal' | 'drawer'",
        "defaultValue": "'auto'"
      },
      {
        "prop": "clearable",
        "description": "是否允许再次操作以清空当前值。",
        "type": "boolean",
        "defaultValue": "false"
      },
      {
        "prop": "shortcutValue",
        "description": "时间滚轮可一键选取的 HH:mm 快捷值。",
        "type": "string",
        "defaultValue": "undefined"
      },
      {
        "prop": "shortcutLabel",
        "description": "时间滚轮中快捷时间按钮显示的文字。",
        "type": "string",
        "defaultValue": "'常用时间'"
      },
      {
        "prop": "disabledTime",
        "description": "判断指定 HH:mm 时间是否不可选择的函数。",
        "type": "(value: string) => boolean",
        "defaultValue": "undefined"
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
    "relatedTypes": [
      {
        "kind": "enum",
        "name": "DlTimePickerPresentation",
        "title": "DlTimePickerPresentation",
        "description": "DlTimePickerPresentation 可用的枚举值。",
        "rows": [
          {
            "prop": "field",
            "description": "DlTimePickerPresentation 的 field 选项。",
            "type": "'field'",
            "defaultValue": "枚举值"
          },
          {
            "prop": "button",
            "description": "DlTimePickerPresentation 的 button 选项。",
            "type": "'button'",
            "defaultValue": "枚举值"
          }
        ]
      },
      {
        "kind": "enum",
        "name": "DlSize",
        "title": "DlSize",
        "description": "组件可用的标准尺寸。",
        "rows": [
          {
            "prop": "sm",
            "description": "紧凑尺寸，适合密集界面和次要操作。",
            "type": "'sm'",
            "defaultValue": "紧凑"
          },
          {
            "prop": "md",
            "description": "默认尺寸，适合大多数常规界面。",
            "type": "'md'",
            "defaultValue": "标准"
          },
          {
            "prop": "lg",
            "description": "放大尺寸，适合重点内容和宽松布局。",
            "type": "'lg'",
            "defaultValue": "宽松"
          }
        ]
      }
    ]
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
    "relatedTypes": []
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
    "relatedTypes": [
      {
        "kind": "enum",
        "name": "DlTone",
        "title": "DlTone",
        "description": "Dragon Liquid 组件共享的语义色调。",
        "rows": [
          {
            "prop": "default",
            "description": "默认中性色调，适合普通信息与基础状态。",
            "type": "'default'",
            "defaultValue": "中性"
          },
          {
            "prop": "accent",
            "description": "强调色调，适合品牌重点、当前任务或推荐内容。",
            "type": "'accent'",
            "defaultValue": "强调"
          },
          {
            "prop": "success",
            "description": "成功色调，表示任务已经正确完成。",
            "type": "'success'",
            "defaultValue": "成功"
          },
          {
            "prop": "warning",
            "description": "警告色调，提示可恢复且需要留意的问题。",
            "type": "'warning'",
            "defaultValue": "警告"
          },
          {
            "prop": "danger",
            "description": "危险色调，表示失败、破坏性操作或高风险状态。",
            "type": "'danger'",
            "defaultValue": "危险"
          },
          {
            "prop": "muted",
            "description": "弱化色调，适合低优先级、只读或后台信息。",
            "type": "'muted'",
            "defaultValue": "弱化"
          }
        ]
      },
      {
        "kind": "enum",
        "name": "DlSize",
        "title": "DlSize",
        "description": "组件可用的标准尺寸。",
        "rows": [
          {
            "prop": "sm",
            "description": "紧凑尺寸，适合密集界面和次要操作。",
            "type": "'sm'",
            "defaultValue": "紧凑"
          },
          {
            "prop": "md",
            "description": "默认尺寸，适合大多数常规界面。",
            "type": "'md'",
            "defaultValue": "标准"
          },
          {
            "prop": "lg",
            "description": "放大尺寸，适合重点内容和宽松布局。",
            "type": "'lg'",
            "defaultValue": "宽松"
          }
        ]
      }
    ]
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
    "relatedTypes": [
      {
        "kind": "enum",
        "name": "DlSize",
        "title": "DlSize",
        "description": "组件可用的标准尺寸。",
        "rows": [
          {
            "prop": "sm",
            "description": "紧凑尺寸，适合密集界面和次要操作。",
            "type": "'sm'",
            "defaultValue": "紧凑"
          },
          {
            "prop": "md",
            "description": "默认尺寸，适合大多数常规界面。",
            "type": "'md'",
            "defaultValue": "标准"
          },
          {
            "prop": "lg",
            "description": "放大尺寸，适合重点内容和宽松布局。",
            "type": "'lg'",
            "defaultValue": "宽松"
          }
        ]
      }
    ]
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
    "relatedTypes": [
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
        "kind": "structure",
        "title": "DlChoiceOption[]"
      },
      {
        "kind": "enum",
        "name": "DlSize",
        "title": "DlSize",
        "description": "组件可用的标准尺寸。",
        "rows": [
          {
            "prop": "sm",
            "description": "紧凑尺寸，适合密集界面和次要操作。",
            "type": "'sm'",
            "defaultValue": "紧凑"
          },
          {
            "prop": "md",
            "description": "默认尺寸，适合大多数常规界面。",
            "type": "'md'",
            "defaultValue": "标准"
          },
          {
            "prop": "lg",
            "description": "放大尺寸，适合重点内容和宽松布局。",
            "type": "'lg'",
            "defaultValue": "宽松"
          }
        ]
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
    "relatedTypes": [
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
            "prop": "description",
            "description": "补充说明文字；不传时隐藏说明区域。",
            "type": "string",
            "defaultValue": "可选"
          },
          {
            "prop": "icon",
            "description": "自定义状态图标；不传时按色调选择默认图标。",
            "type": "string",
            "defaultValue": "可选"
          },
          {
            "prop": "checked",
            "description": "设置 checked 字段。",
            "type": "boolean",
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
          },
          {
            "prop": "children",
            "description": "当前节点或导航项包含的下一级项目。",
            "type": "DlMenuItem[]",
            "defaultValue": "可选"
          }
        ],
        "kind": "structure",
        "title": "DlMenuItem[]"
      }
    ]
  },
  "toolbar-menu": {
    "props": [
      {
        "prop": "menus",
        "description": "菜单栏中显示的菜单分组与命令列表。",
        "type": "DlMenuGroup[]",
        "defaultValue": "—"
      },
      {
        "prop": "modelValue",
        "description": "组件当前值；使用 v-model 进行双向绑定。",
        "type": "string",
        "defaultValue": "undefined"
      },
      {
        "prop": "bindShortcuts",
        "description": "设置 bindShortcuts 属性。",
        "type": "boolean",
        "defaultValue": "true"
      },
      {
        "prop": "active",
        "description": "设置 active 属性。",
        "type": "boolean",
        "defaultValue": "true"
      },
      {
        "prop": "ariaLabel",
        "description": "提供给辅助技术读取的控件名称。",
        "type": "string",
        "defaultValue": "'应用菜单'"
      },
      {
        "prop": "zIndex",
        "description": "覆盖默认浮层层级；不传时由 Dragon Liquid 层级系统计算。",
        "type": "number",
        "defaultValue": "undefined"
      }
    ],
    "relatedTypes": [
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
        "kind": "structure",
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
            "prop": "description",
            "description": "补充说明文字；不传时隐藏说明区域。",
            "type": "string",
            "defaultValue": "可选"
          },
          {
            "prop": "icon",
            "description": "自定义状态图标；不传时按色调选择默认图标。",
            "type": "string",
            "defaultValue": "可选"
          },
          {
            "prop": "checked",
            "description": "设置 checked 字段。",
            "type": "boolean",
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
          },
          {
            "prop": "children",
            "description": "当前节点或导航项包含的下一级项目。",
            "type": "DlMenuItem[]",
            "defaultValue": "可选"
          }
        ],
        "kind": "structure",
        "title": "DlMenuItem[]"
      }
    ]
  },
  "tooltip": {
    "props": [
      {
        "prop": "open",
        "description": "浮层或内容区域是否打开；使用 v-model:open 双向绑定。",
        "type": "boolean",
        "defaultValue": "undefined"
      },
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
        "type": "DlOverlaySide | DlOverlayBaseSide",
        "defaultValue": "DlOverlaySide.Top"
      },
      {
        "prop": "align",
        "description": "设置浮层相对触发器的对齐方式。",
        "type": "'start' | 'center' | 'end'",
        "defaultValue": "'center'"
      },
      {
        "prop": "arrow",
        "description": "是否显示指向触发器的箭头；Popover 与 Tooltip 关闭箭头后，未显式设置的间距会自动归零。",
        "type": "boolean",
        "defaultValue": "true"
      },
      {
        "prop": "arrowPadding",
        "description": "设置 Tooltip 箭头与内容圆角边缘之间的安全距离。",
        "type": "number",
        "defaultValue": "8"
      },
      {
        "prop": "sideOffset",
        "description": "浮层与触发器之间的间距；Popover 有箭头时默认 6、无箭头时默认 0，Tooltip 默认 4。",
        "type": "number",
        "defaultValue": "undefined"
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
    "relatedTypes": [
      {
        "kind": "enum",
        "name": "DlTone",
        "title": "DlTone",
        "description": "Dragon Liquid 组件共享的语义色调。",
        "rows": [
          {
            "prop": "default",
            "description": "默认中性色调，适合普通信息与基础状态。",
            "type": "'default'",
            "defaultValue": "中性"
          },
          {
            "prop": "accent",
            "description": "强调色调，适合品牌重点、当前任务或推荐内容。",
            "type": "'accent'",
            "defaultValue": "强调"
          },
          {
            "prop": "success",
            "description": "成功色调，表示任务已经正确完成。",
            "type": "'success'",
            "defaultValue": "成功"
          },
          {
            "prop": "warning",
            "description": "警告色调，提示可恢复且需要留意的问题。",
            "type": "'warning'",
            "defaultValue": "警告"
          },
          {
            "prop": "danger",
            "description": "危险色调，表示失败、破坏性操作或高风险状态。",
            "type": "'danger'",
            "defaultValue": "危险"
          },
          {
            "prop": "muted",
            "description": "弱化色调，适合低优先级、只读或后台信息。",
            "type": "'muted'",
            "defaultValue": "弱化"
          }
        ]
      },
      {
        "kind": "enum",
        "name": "DlOverlaySide",
        "title": "DlOverlaySide",
        "description": "Popover 与 Tooltip 共用的十二方位数字枚举。",
        "rows": [
          {
            "prop": "Top",
            "description": "上方居中。",
            "type": "0",
            "defaultValue": "上"
          },
          {
            "prop": "TopLeft",
            "description": "上方靠左。",
            "type": "1",
            "defaultValue": "左上"
          },
          {
            "prop": "TopRight",
            "description": "上方靠右。",
            "type": "2",
            "defaultValue": "右上"
          },
          {
            "prop": "Right",
            "description": "右侧居中。",
            "type": "3",
            "defaultValue": "右"
          },
          {
            "prop": "RightTop",
            "description": "右侧靠上。",
            "type": "4",
            "defaultValue": "右上"
          },
          {
            "prop": "RightBottom",
            "description": "右侧靠下。",
            "type": "5",
            "defaultValue": "右下"
          },
          {
            "prop": "Bottom",
            "description": "下方居中。",
            "type": "6",
            "defaultValue": "下"
          },
          {
            "prop": "BottomLeft",
            "description": "下方靠左。",
            "type": "7",
            "defaultValue": "左下"
          },
          {
            "prop": "BottomRight",
            "description": "下方靠右。",
            "type": "8",
            "defaultValue": "右下"
          },
          {
            "prop": "Left",
            "description": "左侧居中。",
            "type": "9",
            "defaultValue": "左"
          },
          {
            "prop": "LeftTop",
            "description": "左侧靠上。",
            "type": "10",
            "defaultValue": "左上"
          },
          {
            "prop": "LeftBottom",
            "description": "左侧靠下。",
            "type": "11",
            "defaultValue": "左下"
          }
        ]
      },
      {
        "kind": "enum",
        "name": "DlOverlayBaseSide",
        "title": "DlOverlayBaseSide",
        "description": "兼容 Reka UI 的四个基础方位字符串。",
        "rows": [
          {
            "prop": "top",
            "description": "DlOverlayBaseSide 的 top 选项。",
            "type": "'top'",
            "defaultValue": "枚举值"
          },
          {
            "prop": "right",
            "description": "DlOverlayBaseSide 的 right 选项。",
            "type": "'right'",
            "defaultValue": "枚举值"
          },
          {
            "prop": "bottom",
            "description": "DlOverlayBaseSide 的 bottom 选项。",
            "type": "'bottom'",
            "defaultValue": "枚举值"
          },
          {
            "prop": "left",
            "description": "DlOverlayBaseSide 的 left 选项。",
            "type": "'left'",
            "defaultValue": "枚举值"
          }
        ]
      }
    ]
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
    "relatedTypes": [
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
        "kind": "structure",
        "title": "DlTreeNode[]"
      }
    ]
  },
  "virtual-list": {
    "props": [
      {
        "prop": "items",
        "description": "用于渲染控件内容的结构化项目列表。",
        "type": "unknown[]",
        "defaultValue": "—"
      },
      {
        "prop": "estimatedItemHeight",
        "description": "虚拟列表每个等高项目使用的预估像素高度。",
        "type": "number",
        "defaultValue": "56"
      },
      {
        "prop": "viewportHeight",
        "description": "虚拟列表可滚动视口的像素高度。",
        "type": "number",
        "defaultValue": "320"
      },
      {
        "prop": "overscan",
        "description": "可见窗口上下额外渲染的项目数量，用于避免快速滚动露白。",
        "type": "number",
        "defaultValue": "4"
      },
      {
        "prop": "itemKey",
        "description": "从项目读取或计算稳定渲染键的字段名或函数。",
        "type": "ItemKey",
        "defaultValue": "undefined"
      },
      {
        "prop": "ariaLabel",
        "description": "提供给辅助技术读取的控件名称。",
        "type": "string",
        "defaultValue": "'虚拟列表'"
      },
      {
        "prop": "activeIndex",
        "description": "设置 activeIndex 属性。",
        "type": "number",
        "defaultValue": "undefined"
      },
      {
        "prop": "keyboardNavigation",
        "description": "设置 keyboardNavigation 属性。",
        "type": "boolean",
        "defaultValue": "true"
      }
    ],
    "relatedTypes": []
  },
  "year-picker": {
    "props": [
      {
        "prop": "open",
        "description": "浮层或内容区域是否打开；使用 v-model:open 双向绑定。",
        "type": "boolean",
        "defaultValue": "undefined"
      },
      {
        "prop": "modelValue",
        "description": "组件当前值；使用 v-model 进行双向绑定。",
        "type": "DateValue | DateValue[] | null",
        "defaultValue": "null"
      },
      {
        "prop": "placeholder",
        "description": "当前值为空时显示的占位提示。",
        "type": "string",
        "defaultValue": "'选择年份'"
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
        "prop": "preventDeselect",
        "description": "设置 preventDeselect 属性。",
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
      },
      {
        "prop": "zIndex",
        "description": "覆盖默认浮层层级；不传时由 Dragon Liquid 层级系统计算。",
        "type": "number",
        "defaultValue": "undefined"
      }
    ],
    "relatedTypes": []
  },
  "year-range-picker": {
    "props": [
      {
        "prop": "open",
        "description": "浮层或内容区域是否打开；使用 v-model:open 双向绑定。",
        "type": "boolean",
        "defaultValue": "undefined"
      },
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
        "defaultValue": "'选择年份范围'"
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
      },
      {
        "prop": "zIndex",
        "description": "覆盖默认浮层层级；不传时由 Dragon Liquid 层级系统计算。",
        "type": "number",
        "defaultValue": "undefined"
      }
    ],
    "relatedTypes": []
  }
} as const
