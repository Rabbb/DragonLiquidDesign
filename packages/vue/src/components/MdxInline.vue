<script setup lang="ts">
import type { DlMdxInlineToken, DlMdxLinkPolicy } from './dl-mdx.types'
import type { DlMdxSecurityPolicy } from './dl-mdx.security'
import { safeDlMdxUrl } from './dl-mdx.parser'

const props = defineProps<{
  tokens: DlMdxInlineToken[]
  linkPolicy: Required<DlMdxLinkPolicy>
  securityPolicy?: DlMdxSecurityPolicy
}>()

function linkHref(token: Extract<DlMdxInlineToken, { type: 'link' }>) {
  return safeDlMdxUrl(token.href, 'link', props.linkPolicy, props.securityPolicy)
}

function imageSrc(token: Extract<DlMdxInlineToken, { type: 'image' }>) {
  return props.linkPolicy.allowImages ? safeDlMdxUrl(token.src, 'image', props.linkPolicy, props.securityPolicy) : undefined
}

function isExternal(href: string) { return /^https?:\/\//i.test(href) }
</script>

<template>
  <template v-for="(token, index) in tokens" :key="index">
    <template v-if="token.type === 'text'">{{ token.value }}</template>
    <br v-else-if="token.type === 'break'">
    <code v-else-if="token.type === 'code'" class="dl-mdx__inline-code">{{ token.value }}</code>
    <strong v-else-if="token.type === 'strong'"><MdxInline :tokens="token.children" :link-policy="linkPolicy" :security-policy="securityPolicy" /></strong>
    <em v-else-if="token.type === 'em'"><MdxInline :tokens="token.children" :link-policy="linkPolicy" :security-policy="securityPolicy" /></em>
    <del v-else-if="token.type === 'strike'"><MdxInline :tokens="token.children" :link-policy="linkPolicy" :security-policy="securityPolicy" /></del>
    <mark v-else-if="token.type === 'mark'"><MdxInline :tokens="token.children" :link-policy="linkPolicy" :security-policy="securityPolicy" /></mark>
    <sub v-else-if="token.type === 'sub'"><MdxInline :tokens="token.children" :link-policy="linkPolicy" :security-policy="securityPolicy" /></sub>
    <sup v-else-if="token.type === 'sup'"><MdxInline :tokens="token.children" :link-policy="linkPolicy" :security-policy="securityPolicy" /></sup>
    <kbd v-else-if="token.type === 'kbd'"><MdxInline :tokens="token.children" :link-policy="linkPolicy" :security-policy="securityPolicy" /></kbd>
    <template v-else-if="token.type === 'link'">
      <a
        v-if="linkHref(token)"
        :href="linkHref(token)"
        :title="token.title"
        :target="linkPolicy.openExternal && isExternal(token.href) ? '_blank' : undefined"
        :rel="isExternal(token.href) ? 'noopener noreferrer' : undefined"
        class="dl-mdx__link"
      ><MdxInline :tokens="token.children" :link-policy="linkPolicy" :security-policy="securityPolicy" /></a>
      <span v-else class="dl-mdx__unsafe-link" title="该链接已被安全策略阻止"><MdxInline :tokens="token.children" :link-policy="linkPolicy" :security-policy="securityPolicy" /></span>
    </template>
    <template v-else-if="token.type === 'image'">
      <img v-if="imageSrc(token)" :src="imageSrc(token)" :alt="token.alt" :title="token.title" class="dl-mdx__image" loading="lazy" decoding="async">
      <span v-else class="dl-mdx__blocked-image" role="img" :aria-label="`图片已被阻止：${token.alt}`">图片已被阻止 · {{ token.alt || '无替代文字' }}</span>
    </template>
  </template>
</template>
