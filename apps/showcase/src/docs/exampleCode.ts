export type VueExampleSource = {
  imports: string[]
  script?: string
  template: string
  style?: string
}

export function vueSfc(source: VueExampleSource) {
  const imports = source.imports.length
    ? `import { ${source.imports.join(', ')} } from '@dragon-liquid/vue'\n`
    : ''
  const script = [imports.trimEnd(), source.script?.trim()].filter(Boolean).join('\n')
  const style = source.style?.trim()

  return `<script setup lang="ts">
${script}
</script>

<template>
${source.template.trim()}
</template>${style ? `\n\n<style scoped>\n${style}\n</style>` : ''}`
}
