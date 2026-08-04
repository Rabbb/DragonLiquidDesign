import { createApp, h } from 'vue'
import {
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
  .use(mdxRegistry)
  .use(mdxSecurity)
  .mount('#app')
