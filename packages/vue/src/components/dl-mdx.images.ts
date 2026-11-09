import type { App, InjectionKey } from 'vue'

/** 为受保护的 Markdown 图片加载数据，原始正文仍保留原地址。 */
export type DlMdxImageLoader = (url: string, signal: AbortSignal) => string | Blob | Promise<string | Blob>
export const dlMdxImageLoaderKey: InjectionKey<DlMdxImageLoader> = Symbol('dragon-liquid-mdx-image-loader')
export function createDlMdxImageLoader(loader: DlMdxImageLoader) {
  return { install(app: App) { app.provide(dlMdxImageLoaderKey, loader) } }
}
