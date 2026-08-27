<script setup lang="ts">
import { computed, ref } from 'vue'
import { DlBadge, DlButton, DlDialog, DlInputText, DlSelect, type DlSelectOption, type DlTone } from '@dragon-liquid/vue'
import DocExampleShell from '../components/DocExampleShell.vue'
import { vueSfc } from './exampleCode'

const props = defineProps<{ scenario: string }>()
const basicOpen = ref(false)
const basicSize = ref<'sm' | 'md' | 'lg'>('md')
const toneGalleryOpen = ref(false)
const activeTone = ref<DlTone>('default')
const createOpen = ref(false)
const featuredOpen = ref(false)
const successOpen = ref(false)
const warningOpen = ref(false)
const deleteOpen = ref(false)
const archiveOpen = ref(false)
const title = ref('来自深渊')
const status = ref('planned')
const statusOptions: DlSelectOption[] = [{ value: 'planned', label: '等待观看' }, { value: 'watching', label: '正在观看' }, { value: 'completed', label: '已经看完' }]
const toneOptions: { value: DlTone; label: string; description: string }[] = [
  { value: 'default', label: 'Default 默认', description: '普通信息与基础任务' },
  { value: 'accent', label: 'Accent 强调', description: '品牌重点与当前任务' },
  { value: 'success', label: 'Success 成功', description: '已经正确完成的结果' },
  { value: 'warning', label: 'Warning 警告', description: '可恢复且需要留意的问题' },
  { value: 'danger', label: 'Danger 危险', description: '失败或不可逆操作' },
  { value: 'muted', label: 'Muted 弱化', description: '低优先级与只读信息' },
]
const activeToneInfo = computed(() => toneOptions.find(item => item.value === activeTone.value) ?? toneOptions[0])

function openBasicDialog(size: 'sm' | 'md' | 'lg') {
  basicSize.value = size
  basicOpen.value = true
}

const content = computed(() => ({
  basic: {
    title: '可移动、可调整尺寸的模态窗口',
    description: 'Dialog 在保留焦点锁定与关闭语义的同时，支持桌面端拖动位置和调整窗口尺寸。',
    code: vueSfc({ imports: ['DlButton', 'DlDialog'], script: `import { ref } from 'vue'

type DialogSize = 'sm' | 'md' | 'lg'

const open = ref(false)
const size = ref<DialogSize>('md')
const sizes: DialogSize[] = ['sm', 'md', 'lg']

function showDialog(nextSize: DialogSize) {
  size.value = nextSize
  open.value = true
}`, template: `  <div class="size-actions">
    <DlButton
      v-for="item in sizes"
      :key="item"
      variant="secondary"
      @click="showDialog(item)"
    >
      打开 {{ item.toUpperCase() }}
    </DlButton>
  </div>

  <DlDialog
    v-model:open="open"
    :title="\`对话框尺寸 · \${size.toUpperCase()}\`"
    description="size 控制对话框的宽度规格。"
    :size="size"
    draggable
    resizable
    :min-width="320"
    :min-height="200"
  >
    <p>拖动标题栏移动窗口，拖动右下角调整尺寸。</p>
    <template #footer>
      <DlButton variant="ghost" @click="open = false">取消</DlButton>
      <DlButton variant="primary" @click="open = false">完成</DlButton>
    </template>
  </DlDialog>`, style: `.size-actions { display: flex; flex-wrap: wrap; gap: 10px; }` }),
    tips: ['拖动标题栏或顶部拖动柄可移动窗口，右下角缩放柄用于调整尺寸；双击对应控制柄可重置。', '控制柄支持方向键微调，按住 Shift 时使用更大的步长；窄屏和横屏低高度下会自动回到固定布局。', 'sm、md、lg 控制初始宽度；minWidth、minHeight 约束用户可调整的最小尺寸。', '打开后焦点应进入对话框，关闭后返回触发元素。'],
  },
  'tone-gallery': {
    title: 'Dialog 全部语义色调',
    description: '逐一打开六种 DlTone，比较边框、顶部炫彩条与环境光的语义变化。',
    code: vueSfc({ imports: ['DlButton', 'DlDialog', 'type DlTone'], script: `import { ref } from 'vue'

const open = ref(false)
const activeTone = ref<DlTone>('default')
const tones: { value: DlTone; label: string; description: string }[] = [
  { value: 'default', label: 'Default 默认', description: '普通信息与基础任务' },
  { value: 'accent', label: 'Accent 强调', description: '品牌重点与当前任务' },
  { value: 'success', label: 'Success 成功', description: '已经正确完成的结果' },
  { value: 'warning', label: 'Warning 警告', description: '可恢复且需要留意的问题' },
  { value: 'danger', label: 'Danger 危险', description: '失败或不可逆操作' },
  { value: 'muted', label: 'Muted 弱化', description: '低优先级与只读信息' },
]

function showTone(tone: DlTone) {
  activeTone.value = tone
  open.value = true
}`, template: `  <div class="tone-grid">
    <button v-for="item in tones" :key="item.value" type="button" @click="showTone(item.value)">
      <b>{{ item.label }}</b>
      <span>{{ item.description }}</span>
    </button>
  </div>
  <DlDialog
    v-model:open="open"
    :title="activeTone + ' 色调对话框'"
    :description="tones.find(item => item.value === activeTone)?.description"
    :tone="activeTone"
    size="sm"
  >
    <p>当前 Dialog 正在展示 <code>{{ activeTone }}</code> 的完整视觉。</p>
    <template #footer>
      <DlButton variant="primary" @click="open = false">关闭预览</DlButton>
    </template>
  </DlDialog>`, style: `.tone-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
.tone-grid button { display: grid; gap: 5px; padding: 14px; border: 1px solid rgba(255,255,255,.12); border-radius: 14px; background: rgba(255,255,255,.06); color: #fff; text-align: left; cursor: pointer; }
.tone-grid span { color: #a9b9b0; font-size: .78rem; }` }),
    tips: ['Tone 只改变语义视觉，不改变 Dialog 的焦点锁定与关闭行为。', '业务场景应选择一个固定 tone；此页用于设计对照与验收。'],
  },
  'create-record': {
    title: '创建收藏记录',
    description: '适合字段较少、上下文明确的小型创建流程。',
    code: vueSfc({ imports: ['DlButton', 'DlDialog', 'DlInputText', 'DlSelect', 'type DlSelectOption'], script: `import { ref } from 'vue'\n\nconst open = ref(false)\nconst title = ref('')\nconst status = ref('planned')\nconst statusOptions: DlSelectOption[] = [\n  { value: 'planned', label: '计划观看' },\n  { value: 'watching', label: '正在观看' },\n]`, template: `  <DlButton variant="primary" @click="open = true">收录新作品</DlButton>\n  <DlDialog v-model:open="open" title="收录新作品" size="md">\n    <div class="form">\n      <DlInputText v-model="title" placeholder="作品标题" />\n      <DlSelect v-model="status" :options="statusOptions" />\n    </div>\n    <template #footer>\n      <DlButton variant="ghost" @click="open = false">取消</DlButton>\n      <DlButton variant="primary" @click="open = false">确认收录</DlButton>\n    </template>\n  </DlDialog>`, style: `.form { display: grid; gap: 12px; }` }),
    tips: ['表单内容超过一个屏幕时优先使用独立页面。', '提交成功后关闭浮层，并在原页面提供结果反馈。'],
  },
  'featured-preview': {
    title: '重点内容预览',
    description: 'Accent 用于当前推荐、品牌重点或需要被优先看见的任务。',
    code: vueSfc({ imports: ['DlBadge', 'DlButton', 'DlDialog'], script: `import { ref } from 'vue'\n\nconst open = ref(false)`, template: `  <DlButton variant="primary" @click="open = true">查看本周推荐</DlButton>
  <DlDialog
    v-model:open="open"
    title="本周推荐 · 葬送的芙莉莲"
    description="根据收藏偏好生成的重点内容预览。"
    tone="accent"
    size="lg"
  >
    <div class="feature-preview">
      <DlBadge tone="accent">编辑精选</DlBadge>
      <h3>跨越时间的旅程，适合慢慢观看</h3>
      <p>预览推荐理由、分类与观看建议，再决定是否加入收藏。</p>
    </div>
    <template #footer>
      <DlButton variant="ghost" @click="open = false">稍后再看</DlButton>
      <DlButton variant="primary" @click="open = false">加入收藏</DlButton>
    </template>
  </DlDialog>`, style: `.feature-preview { display: grid; gap: 12px; }
.feature-preview h3, .feature-preview p { margin: 0; }
.feature-preview p { color: #a9b9b0; line-height: 1.7; }` }),
    tips: ['Accent 表达被强调的正常内容，不应替代 Warning 或 Danger。', '重点内容仍要提供清晰的关闭与稍后处理路径。'],
  },
  'publish-success': {
    title: '发布完成',
    description: 'Success 用于确认操作已经完成，并把下一步保持为可选项。',
    code: vueSfc({ imports: ['DlBadge', 'DlButton', 'DlDialog'], script: `import { ref } from 'vue'\n\nconst open = ref(false)`, template: `  <DlButton variant="primary" @click="open = true">查看发布结果</DlButton>
  <DlDialog
    v-model:open="open"
    title="收藏记录已发布"
    description="作品资料和分类标签已经同步。"
    tone="success"
    size="sm"
  >
    <div class="result-message">
      <DlBadge tone="success">同步完成</DlBadge>
      <p>《迷宫饭》现在可在公开收藏页中查看。</p>
    </div>
    <template #footer>
      <DlButton variant="ghost" @click="open = false">关闭</DlButton>
      <DlButton variant="primary" @click="open = false">查看作品</DlButton>
    </template>
  </DlDialog>`, style: `.result-message { display: grid; gap: 12px; }
.result-message p { margin: 0; color: #a9b9b0; line-height: 1.7; }` }),
    tips: ['只在任务确实完成后使用 Success。', '完成提示应说明结果，不必再次要求用户确认。'],
  },
  'unsaved-warning': {
    title: '未保存提醒',
    description: 'Warning 提醒用户可恢复的问题，同时保留继续编辑的安全路径。',
    code: vueSfc({ imports: ['DlButton', 'DlDialog'], script: `import { ref } from 'vue'\n\nconst open = ref(false)\n\nfunction discardChanges() {\n  open.value = false\n}`, template: `  <DlButton variant="secondary" @click="open = true">离开编辑器</DlButton>
  <DlDialog
    v-model:open="open"
    title="尚有未保存的修改"
    description="简介与个人标签的修改还没有保存。"
    tone="warning"
    size="sm"
  >
    <p>直接离开会丢失本次编辑，你也可以返回并保存。</p>
    <template #footer>
      <DlButton variant="ghost" @click="discardChanges">放弃修改</DlButton>
      <DlButton variant="primary" @click="open = false">继续编辑</DlButton>
    </template>
  </DlDialog>` }),
    tips: ['Warning 适合可恢复的风险；不可逆操作使用 Danger。', '默认路径应帮助用户保留已有工作。'],
  },
  'delete-confirm': {
    title: '删除确认',
    description: '明确指出将被删除的对象、不可逆后果以及安全的取消路径。',
    code: vueSfc({ imports: ['DlButton', 'DlDialog'], script: `import { ref } from 'vue'\n\nconst open = ref(false)\nfunction remove() {\n  console.log('removed')\n  open.value = false\n}`, template: `  <DlButton variant="danger" @click="open = true">移出收藏</DlButton>\n  <DlDialog\n    v-model:open="open"\n    title="移出收藏"\n    description="这个操作无法撤销。"\n    tone="danger"\n    size="sm"\n  >\n    <p>确定移除《来自深渊》吗？</p>\n    <template #footer>\n      <DlButton variant="secondary" @click="open = false">保留作品</DlButton>\n      <DlButton variant="danger" @click="remove">确认移除</DlButton>\n    </template>\n  </DlDialog>` }),
    tips: ['默认焦点优先放在安全操作上。', '危险按钮文案应描述动作，不使用模糊的“确定”。'],
  },
  'archive-note': {
    title: '归档说明',
    description: 'Muted 承载低优先级、只读且无需立即采取行动的信息。',
    code: vueSfc({ imports: ['DlBadge', 'DlButton', 'DlDialog'], script: `import { ref } from 'vue'\n\nconst open = ref(false)`, template: `  <DlButton variant="ghost" @click="open = true">查看归档说明</DlButton>
  <DlDialog
    v-model:open="open"
    title="自动归档说明"
    description="这是一条无需立即处理的系统信息。"
    tone="muted"
    size="sm"
  >
    <div class="archive-note">
      <DlBadge tone="muted" variant="outline">只读</DlBadge>
      <p>超过 180 天没有更新的草稿会移入归档，但仍可随时恢复。</p>
    </div>
    <template #footer>
      <DlButton variant="secondary" @click="open = false">知道了</DlButton>
    </template>
  </DlDialog>`, style: `.archive-note { display: grid; gap: 12px; }
.archive-note p { margin: 0; color: #a9b9b0; line-height: 1.7; }` }),
    tips: ['Muted 不应承载必须立即处理的状态。', '低优先级说明仍需保持足够的文字对比度。'],
  },
}[props.scenario] ?? {} as { title: string; description: string; code: string; tips: string[] }))
</script>

<template>
  <DocExampleShell v-bind="content">
    <div v-if="scenario === 'basic'" class="dialog-trigger-grid">
      <div v-for="size in (['sm', 'md', 'lg'] as const)" :key="size"><span>{{ size.toUpperCase() }}</span><p>{{ size === 'sm' ? '确认与简短反馈' : size === 'md' ? '小型表单与配置' : '较宽内容与预览' }}</p><DlButton variant="secondary" @click="openBasicDialog(size)">打开 {{ size }}</DlButton></div>
      <DlDialog v-model:open="basicOpen" :title="`Dragon Liquid Dialog · ${basicSize.toUpperCase()}`" description="拖动标题栏移动窗口，拖动右下角调整尺寸。" :size="basicSize"><div class="dialog-inline-demo"><span>龍</span><p>当前初始宽度规格为 <strong>{{ basicSize }}</strong>。也可以用控制柄的方向键精确移动和缩放。</p></div><template #footer><DlButton variant="ghost" @click="basicOpen = false">取消</DlButton><DlButton variant="primary" @click="basicOpen = false">完成</DlButton></template></DlDialog>
    </div>

    <div v-else-if="scenario === 'tone-gallery'" class="tone-gallery-grid">
      <button v-for="item in toneOptions" :key="item.value" type="button" class="tone-gallery-item" @click="activeTone = item.value; toneGalleryOpen = true"><b>{{ item.label }}</b><span>{{ item.description }}</span></button>
      <DlDialog v-model:open="toneGalleryOpen" :title="`${activeTone} 色调对话框`" :description="activeToneInfo.description" :tone="activeTone" size="sm"><p>当前 Dialog 正在展示 <code>{{ activeTone }}</code> 的完整视觉。</p><template #footer><DlButton variant="primary" @click="toneGalleryOpen = false">关闭预览</DlButton></template></DlDialog>
    </div>

    <div v-else-if="scenario === 'create-record'" class="center-trigger"><DlButton variant="primary" size="lg" @click="createOpen = true"><template #leading>＋</template>收录新作品</DlButton>
      <DlDialog v-model:open="createOpen" title="收录新作品" description="填写最基本的信息，之后可以继续完善资料。" size="md"><div class="dialog-form"><label class="scenario-field"><span>作品标题</span><DlInputText v-model="title" /></label><label class="scenario-field"><span>观看状态</span><DlSelect v-model="status" :options="statusOptions" /></label></div><template #footer><DlButton variant="ghost" @click="createOpen = false">取消</DlButton><DlButton variant="primary" @click="createOpen = false">确认收录</DlButton></template></DlDialog>
    </div>

    <div v-else-if="scenario === 'featured-preview'" class="center-trigger"><DlButton variant="primary" size="lg" @click="featuredOpen = true">查看本周推荐</DlButton>
      <DlDialog v-model:open="featuredOpen" title="本周推荐 · 葬送的芙莉莲" description="根据收藏偏好生成的重点内容预览。" size="lg" tone="accent"><div class="dialog-message"><DlBadge tone="accent">编辑精选</DlBadge><h3>跨越时间的旅程，适合慢慢观看</h3><p>预览推荐理由、分类与观看建议，再决定是否加入收藏。</p></div><template #footer><DlButton variant="ghost" @click="featuredOpen = false">稍后再看</DlButton><DlButton variant="primary" @click="featuredOpen = false">加入收藏</DlButton></template></DlDialog>
    </div>

    <div v-else-if="scenario === 'publish-success'" class="center-trigger"><DlButton variant="primary" size="lg" @click="successOpen = true">查看发布结果</DlButton>
      <DlDialog v-model:open="successOpen" title="收藏记录已发布" description="作品资料和分类标签已经同步。" size="sm" tone="success"><div class="dialog-message"><DlBadge tone="success">同步完成</DlBadge><p>《迷宫饭》现在可在公开收藏页中查看。</p></div><template #footer><DlButton variant="ghost" @click="successOpen = false">关闭</DlButton><DlButton variant="primary" @click="successOpen = false">查看作品</DlButton></template></DlDialog>
    </div>

    <div v-else-if="scenario === 'unsaved-warning'" class="center-trigger"><DlButton variant="secondary" size="lg" @click="warningOpen = true">离开编辑器</DlButton>
      <DlDialog v-model:open="warningOpen" title="尚有未保存的修改" description="简介与个人标签的修改还没有保存。" size="sm" tone="warning"><p>直接离开会丢失本次编辑，你也可以返回并保存。</p><template #footer><DlButton variant="ghost" @click="warningOpen = false">放弃修改</DlButton><DlButton variant="primary" @click="warningOpen = false">继续编辑</DlButton></template></DlDialog>
    </div>

    <div v-else-if="scenario === 'delete-confirm'" class="center-trigger"><DlButton variant="danger" size="lg" @click="deleteOpen = true">移出收藏</DlButton>
      <DlDialog v-model:open="deleteOpen" title="移出收藏" description="这个操作无法撤销。" size="sm" tone="danger"><div class="delete-dialog-content"><span>!</span><h3>确定移除《来自深渊》吗？</h3><p>作品资料、观看进度和个人标签都将被永久删除。</p></div><template #footer><DlButton variant="secondary" @click="deleteOpen = false">保留作品</DlButton><DlButton variant="danger" @click="deleteOpen = false">确认移除</DlButton></template></DlDialog>
    </div>

    <div v-else class="center-trigger"><DlButton variant="ghost" size="lg" @click="archiveOpen = true">查看归档说明</DlButton>
      <DlDialog v-model:open="archiveOpen" title="自动归档说明" description="这是一条无需立即处理的系统信息。" size="sm" tone="muted"><div class="dialog-message"><DlBadge tone="muted" variant="outline">只读</DlBadge><p>超过 180 天没有更新的草稿会移入归档，但仍可随时恢复。</p></div><template #footer><DlButton variant="secondary" @click="archiveOpen = false">知道了</DlButton></template></DlDialog>
    </div>
  </DocExampleShell>
</template>

<style scoped>
.dialog-message { display: grid; gap: 12px; }
.dialog-message h3, .dialog-message p { margin: 0; }
.dialog-message p { color: var(--dl-text-muted); line-height: 1.7; }
.tone-gallery-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; width: min(100%, 660px); margin: 0 auto; }
.tone-gallery-item { display: grid; gap: 5px; padding: 14px; border: 1px solid var(--dl-border); border-radius: var(--dl-radius-md); background: rgba(255,255,255,.06); color: var(--dl-text); text-align: left; cursor: pointer; }
.tone-gallery-item:hover { border-color: var(--dl-border-strong); background: rgba(255,255,255,.1); }
.tone-gallery-item span { color: var(--dl-text-muted); font-size: .78rem; }
@media (max-width: 560px) { .tone-gallery-grid { grid-template-columns: 1fr; } }
</style>
