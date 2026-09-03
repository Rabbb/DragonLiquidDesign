<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'

type HighlightVariant = 'solid' | 'gradient' | 'rainbow' | 'breathing' | 'wavy' | 'underline'

const props = withDefaults(defineProps<{
  text?: string
  variant?: HighlightVariant
  color?: string
  colorEnd?: string
  colors?: string[]
  textColor?: string
  speed?: number
}>(), {
  text: '',
  variant: 'solid',
  color: '',
  colorEnd: '',
  colors: () => [],
  textColor: '',
  speed: 2.4,
})

const defaultRainbow = ['#ff5f6d', '#ffc371', '#fff06a', '#62e6a7', '#68e1ff', '#a78bfa', '#ff6cd6']
const namedColor = /^(?:transparent|currentcolor|[a-z]{3,24})$/i
const hexColor = /^#[\da-f]{3,8}$/i
const functionColor = /^(?:rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch|color)\([\d\s.,%+\-/a-z]+\)$/i
const themeColor = /^var\(--[a-z][a-z0-9-]*\)$/i

function safeColor(value: string | undefined): string | undefined {
  const candidate = value?.trim()
  if (!candidate || candidate.length > 80) return undefined
  return namedColor.test(candidate) || hexColor.test(candidate) || functionColor.test(candidate) || themeColor.test(candidate)
    ? candidate
    : undefined
}

const highlightStyle = computed<CSSProperties>(() => {
  const style: Record<string, string> = {
    '--dl-highlight-speed': `${Math.min(12, Math.max(0.6, Number(props.speed) || 2.4))}s`,
  }
  const color = safeColor(props.color)
  const colorEnd = safeColor(props.colorEnd)
  const textColor = safeColor(props.textColor)
  if (color) style['--dl-highlight-color'] = color
  if (colorEnd) style['--dl-highlight-color-end'] = colorEnd
  if (textColor) style['--dl-highlight-text'] = textColor

  const rainbow = props.colors.map(safeColor).filter((value): value is string => Boolean(value)).slice(0, 8)
  style['--dl-highlight-rainbow'] = (rainbow.length >= 2 ? rainbow : defaultRainbow)
    .map(value => `color-mix(in srgb, ${value} 48%, transparent)`)
    .join(', ')
  return style
})
</script>

<template>
  <span class="dl-mdx-highlight" :data-variant="variant" :style="highlightStyle"><slot>{{ text }}</slot></span>
</template>

<style scoped>
.dl-mdx-highlight {
  --dl-highlight-color: var(--dl-accent, #f1c84d);
  --dl-highlight-color-end: var(--dl-accent-text, #68e1ff);
  --dl-highlight-text: inherit;
  --dl-highlight-rainbow: color-mix(in srgb, #ff5f6d 48%, transparent), color-mix(in srgb, #ffc371 48%, transparent), color-mix(in srgb, #fff06a 48%, transparent), color-mix(in srgb, #62e6a7 48%, transparent), color-mix(in srgb, #68e1ff 48%, transparent), color-mix(in srgb, #a78bfa 48%, transparent), color-mix(in srgb, #ff6cd6 48%, transparent);
  --dl-highlight-speed: 2.4s;

  display: inline;
  padding: .08em .2em;
  border-radius: .32em;
  color: var(--dl-highlight-text);
  font: inherit;
  line-height: inherit;
  white-space: break-spaces;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
}

.dl-mdx-highlight[data-variant='solid'] {
  background: color-mix(in srgb, var(--dl-highlight-color) 34%, transparent);
  box-shadow: inset 0 -1px color-mix(in srgb, var(--dl-highlight-color) 48%, transparent);
}

.dl-mdx-highlight[data-variant='gradient'] {
  background: linear-gradient(110deg,
    color-mix(in srgb, var(--dl-highlight-color) 38%, transparent),
    color-mix(in srgb, var(--dl-highlight-color-end) 42%, transparent));
}

.dl-mdx-highlight[data-variant='rainbow'],
.dl-mdx-highlight[data-variant='breathing'] {
  background: linear-gradient(100deg, var(--dl-highlight-rainbow));
  background-size: 260% 100%;
  color: var(--dl-highlight-text, var(--dl-text));
}

.dl-mdx-highlight[data-variant='breathing'] {
  animation: dl-mdx-highlight-breathe var(--dl-highlight-speed) ease-in-out infinite alternate;
}

.dl-mdx-highlight[data-variant='wavy'] {
  padding-inline: .05em;
  text-decoration-line: underline;
  text-decoration-style: wavy;
  text-decoration-color: var(--dl-highlight-color);
  text-decoration-thickness: .12em;
  text-underline-offset: .24em;
}

.dl-mdx-highlight[data-variant='underline'] {
  padding-inline: .05em;
  text-decoration-line: underline;
  text-decoration-style: solid;
  text-decoration-color: var(--dl-highlight-color);
  text-decoration-thickness: .14em;
  text-underline-offset: .22em;
}

@keyframes dl-mdx-highlight-breathe {
  from {
    background-position: 0 50%;
    box-shadow: 0 0 0 color-mix(in srgb, var(--dl-highlight-color) 0%, transparent);
    filter: saturate(.88) brightness(.94);
  }

  to {
    background-position: 100% 50%;
    box-shadow: 0 0 .8em color-mix(in srgb, var(--dl-highlight-color-end) 42%, transparent);
    filter: saturate(1.14) brightness(1.06);
  }
}

@media (prefers-reduced-motion: reduce) {
  .dl-mdx-highlight[data-variant='breathing'] { animation: none; }
}
</style>
