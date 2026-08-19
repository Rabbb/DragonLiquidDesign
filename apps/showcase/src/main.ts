import { createApp, h } from 'vue'
import {
  createDlTheme,
  createDlMdxOfficialRegistry,
  createDlMdxSecurityPolicy,
  defineDlMdxComponent,
  DlBadge,
  DlCard,
  type DlTone,
} from '@dragon-liquid/vue'
import '@dragon-liquid/vue/style.css'
import './showcase.css'
import App from './App.vue'

const dlTheme = createDlTheme({
  mode: 'system',
  lightTheme: 'white',
  darkTheme: 'black',
  storageKey: 'dragon-liquid-showcase-theme',
  themes: [
    {
      name: 'docs-blue',
      label: 'Docs Blue',
      colorScheme: 'light',
      base: 'white',
      tokens: {
        '--dl-accent': '#356b92',
        '--dl-accent-text': '#285778',
        '--dl-accent-surface': 'rgba(53, 107, 146, 0.1)',
        '--dl-accent-surface-hover': 'rgba(53, 107, 146, 0.16)',
        '--dl-accent-border': 'rgba(53, 107, 146, 0.28)',
        '--dl-border-focus': 'rgba(53, 107, 146, 0.72)',
        '--dl-focus': '0 0 0 3px rgba(53, 107, 146, 0.14), 0 0 0 1px rgba(53, 107, 146, 0.5)',
      },
    },
  ],
})

const mdxRegistry = createDlMdxOfficialRegistry([
  defineDlMdxComponent({
    name: 'Callout',
    aliases: ['Notice'],
    category: 'general',
    maturity: 'custom',
    description: '组件库网站在 main.ts 注册的业务提示卡。',
    render: ({ props }) => h(DlCard, { padding: 'lg', class: 'mdx-callout-card' }, {
      default: () => [
        h(DlBadge, { tone: (props.tone as DlTone | undefined) ?? 'accent' }, () => String(props.tone ?? 'accent')),
        h('div', { class: 'mdx-callout-content' }, [
          h('small', 'DRAGON LIQUID · GLOBAL REGISTRY'),
          h('h3', String(props.title ?? '全局扩展组件')),
          h('p', '该内容由组件库网站的 main.ts 注册，无需在每个 DlMdx 实例重复声明插槽。'),
        ]),
      ],
    }),
  }),
])

const mdxSecurity = createDlMdxSecurityPolicy({
  domains: {
    links: ['developer.mozilla.org', 'reka-ui.com', 'nuxt.com'],
    images: ['images.unsplash.com', '*.githubusercontent.com'],
    files: ['registry.npmjs.org'],
  },
  fileExtensions: ['pdf', 'json', 'zip', 'tgz'],
  allowedProtocols: ['https'],
  allowRelative: true,
})

createApp(App)
  .use(dlTheme)
  .use(mdxRegistry)
  .use(mdxSecurity)
  .mount('#app')
