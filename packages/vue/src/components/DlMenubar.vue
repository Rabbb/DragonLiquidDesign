<script setup lang="ts">
import { MenubarContent, MenubarItem, MenubarMenu, MenubarPortal, MenubarRoot, MenubarSeparator, MenubarTrigger } from 'reka-ui'
import { useDlPopoverLayer } from '../composables/useDlLayer'
import type { DlMenuGroup } from './primitive.types'

const props = withDefaults(defineProps<{ modelValue?: string; menus: DlMenuGroup[]; zIndex?: number }>(), { modelValue: undefined, zIndex: undefined })
const emit = defineEmits<{ 'update:modelValue': [value: string]; select: [value: string] }>()
const layer = useDlPopoverLayer(() => props.zIndex)
</script>

<template>
  <MenubarRoot data-dl data-slot="menubar" :model-value="modelValue" class="inline-flex gap-1 rounded-[var(--dl-radius-sm)] border border-[var(--dl-border)] bg-[var(--dl-surface)] p-1" @update:model-value="emit('update:modelValue', $event as unknown as string)">
    <MenubarMenu v-for="menu in menus" :key="menu.value" :value="menu.value">
      <MenubarTrigger class="min-h-9 rounded-[9px] px-3 text-sm font-semibold text-[var(--dl-text-muted)] outline-none hover:bg-[var(--dl-surface-hover)] hover:text-[var(--dl-text)] data-[state=open]:bg-[var(--dl-surface-hover)] data-[state=open]:text-[var(--dl-accent-text)] focus-visible:[box-shadow:var(--dl-focus)]">{{ menu.label }}</MenubarTrigger>
      <MenubarPortal>
        <MenubarContent data-dl data-dl-layer="popover" :style="{ zIndex: layer }" :side-offset="7" align="start" class="min-w-52 rounded-[var(--dl-radius-md)] border border-[var(--dl-border-strong)] [background:var(--dl-panel)] p-1.5 text-sm text-[var(--dl-text)] shadow-[0_24px_70px_rgba(0,0,0,.44)] outline-none backdrop-blur-2xl">
          <template v-for="item in menu.items" :key="item.value">
            <MenubarSeparator v-if="item.separator" class="my-1 h-px bg-[var(--dl-border)]" />
            <MenubarItem v-else :disabled="item.disabled" class="flex min-h-9 cursor-default items-center justify-between gap-4 rounded-xl px-3 outline-none data-[disabled]:opacity-40 data-[highlighted]:bg-[var(--dl-surface-hover)] data-[highlighted]:text-[var(--dl-accent-text)]" @select="emit('select', item.value)">
              {{ item.label }}<kbd v-if="item.shortcut" class="text-[10px] text-[var(--dl-text-faint)]">{{ item.shortcut }}</kbd>
            </MenubarItem>
          </template>
        </MenubarContent>
      </MenubarPortal>
    </MenubarMenu>
  </MenubarRoot>
</template>
