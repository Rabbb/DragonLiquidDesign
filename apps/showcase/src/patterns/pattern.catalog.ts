import type { PatternSourceFile } from './PatternSourceDialog.vue'

export type PatternPageId = 'overview' | 'library' | 'create' | 'detail' | 'editor' | 'import' | 'settings' | 'feedback' | 'coverage'

export interface PatternPageDefinition {
  id: PatternPageId
  label: string
  eyebrow: string
  description: string
  href: string
  loadSource: () => Promise<PatternSourceFile[]>
}

type RawSourceModule = { default: string }

async function readRaw(module: Promise<RawSourceModule>): Promise<string> {
  return (await module).default
}

async function loadSharedFiles(): Promise<PatternSourceFile[]> {
  const [storeSource, dataSource, typesSource, guideSource] = await Promise.all([
    readRaw(import('./useArchiveDemo.ts?raw')),
    readRaw(import('./demo.data.ts?raw')),
    readRaw(import('./demo.types.ts?raw')),
    readRaw(import('./PatternControlGuide.vue?raw')),
  ])

  return [
    { name: 'useArchiveDemo.ts', language: 'TypeScript', source: storeSource },
    { name: 'demo.data.ts', language: 'TypeScript', source: dataSource },
    { name: 'demo.types.ts', language: 'TypeScript', source: typesSource },
    { name: 'PatternControlGuide.vue', language: 'Vue', source: guideSource },
  ]
}

export const patternPages: PatternPageDefinition[] = [
  {
    id: 'overview',
    label: '逻辑地图',
    eyebrow: 'SYSTEM MAP',
    description: '理解组件如何组成一条稳定的应用工作流。',
    href: '/patterns',
    loadSource: async () => {
      const [pageSource, shellSource, sharedFiles] = await Promise.all([
        readRaw(import('./pages/PatternOverviewPage.vue?raw')),
        readRaw(import('./PatternShowcasePage.vue?raw')),
        loadSharedFiles(),
      ])
      return [
        { name: 'PatternOverviewPage.vue', language: 'Vue', source: pageSource },
        { name: 'PatternShowcasePage.vue', language: 'Vue', source: shellSource },
        ...sharedFiles,
      ]
    },
  },
  {
    id: 'library',
    label: '收藏库',
    eyebrow: 'DISCOVER',
    description: '搜索、组合筛选、浏览、快捷预览和选择内容。',
    href: '/patterns/library',
    loadSource: async () => {
      const [pageSource, sharedFiles] = await Promise.all([
        readRaw(import('./pages/LibraryPatternPage.vue?raw')),
        loadSharedFiles(),
      ])
      return [{ name: 'LibraryPatternPage.vue', language: 'Vue', source: pageSource }, ...sharedFiles]
    },
  },
  {
    id: 'create',
    label: '创建收藏',
    eyebrow: 'COMPOSE',
    description: '完整表单、即时校验、嵌套浮层预览与提交。',
    href: '/patterns/create',
    loadSource: async () => {
      const [pageSource, sharedFiles] = await Promise.all([
        readRaw(import('./pages/CreatePatternPage.vue?raw')),
        loadSharedFiles(),
      ])
      return [{ name: 'CreatePatternPage.vue', language: 'Vue', source: pageSource }, ...sharedFiles]
    },
  },
  {
    id: 'detail',
    label: '作品详情',
    eyebrow: 'UNDERSTAND',
    description: '阅读资料、维护进度并进入上下文操作。',
    href: '/patterns/detail',
    loadSource: async () => {
      const [pageSource, sharedFiles] = await Promise.all([
        readRaw(import('./pages/DetailPatternPage.vue?raw')),
        loadSharedFiles(),
      ])
      return [{ name: 'DetailPatternPage.vue', language: 'Vue', source: pageSource }, ...sharedFiles]
    },
  },
  {
    id: 'editor',
    label: '编辑工作台',
    eyebrow: 'EDIT',
    description: '树形大纲、MDX、属性面板、保存与发布。',
    href: '/patterns/editor',
    loadSource: async () => {
      const [pageSource, mainSource, sharedFiles] = await Promise.all([
        readRaw(import('./pages/EditorPatternPage.vue?raw')),
        readRaw(import('../main.ts?raw')),
        loadSharedFiles(),
      ])
      return [
        { name: 'EditorPatternPage.vue', language: 'Vue', source: pageSource },
        { name: 'main.ts', language: 'TypeScript', source: mainSource },
        ...sharedFiles,
      ]
    },
  },
  {
    id: 'import',
    label: '导入任务',
    eyebrow: 'EXECUTE',
    description: '阶段化长任务、冲突策略、进度与结果反馈。',
    href: '/patterns/import',
    loadSource: async () => {
      const [pageSource, sharedFiles] = await Promise.all([
        readRaw(import('./pages/ImportPatternPage.vue?raw')),
        loadSharedFiles(),
      ])
      return [{ name: 'ImportPatternPage.vue', language: 'Vue', source: pageSource }, ...sharedFiles]
    },
  },
  {
    id: 'settings',
    label: '偏好设置',
    eyebrow: 'PREFERENCE',
    description: '集中管理持续生效的界面与行为偏好。',
    href: '/patterns/settings',
    loadSource: async () => {
      const [pageSource, sharedFiles] = await Promise.all([
        readRaw(import('./pages/SettingsPatternPage.vue?raw')),
        loadSharedFiles(),
      ])
      return [{ name: 'SettingsPatternPage.vue', language: 'Vue', source: pageSource }, ...sharedFiles]
    },
  },
  {
    id: 'feedback',
    label: '任务中心',
    eyebrow: 'FEEDBACK',
    description: '全部色调、浮层层级、恢复动作与实例行为。',
    href: '/patterns/feedback',
    loadSource: async () => {
      const [pageSource, sharedFiles] = await Promise.all([
        readRaw(import('./pages/FeedbackPatternPage.vue?raw')),
        loadSharedFiles(),
      ])
      return [{ name: 'FeedbackPatternPage.vue', language: 'Vue', source: pageSource }, ...sharedFiles]
    },
  },
  {
    id: 'coverage',
    label: '覆盖索引',
    eyebrow: 'COVERAGE',
    description: '追踪全部公开组件及每一个目录场景的演示位置。',
    href: '/patterns/coverage',
    loadSource: async () => {
      const [pageSource, coverageSource, sharedFiles] = await Promise.all([
        readRaw(import('./pages/CoveragePatternPage.vue?raw')),
        readRaw(import('./pattern.coverage.ts?raw')),
        loadSharedFiles(),
      ])
      return [
        { name: 'CoveragePatternPage.vue', language: 'Vue', source: pageSource },
        { name: 'pattern.coverage.ts', language: 'TypeScript', source: coverageSource },
        ...sharedFiles,
      ]
    },
  },
]

export function resolvePatternPage(value?: string): PatternPageDefinition {
  return patternPages.find(page => page.id === value) ?? patternPages[0]
}
