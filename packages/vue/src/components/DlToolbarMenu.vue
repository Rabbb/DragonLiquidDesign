<script setup lang="ts">
import { MenubarContent, MenubarMenu, MenubarPortal, MenubarRoot, MenubarTrigger } from 'reka-ui'
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { useDlPopoverLayer } from '../composables/useDlLayer'
import { matchesDlKeyboardShortcut } from './keyboard-shortcut'
import type { DlMenuGroup, DlMenuItem } from './primitive.types'
import ToolbarMenuItems from './ToolbarMenuItems.vue'

const props = withDefaults(defineProps<{
  menus: DlMenuGroup[]
  modelValue?: string
  bindShortcuts?: boolean
  active?: boolean
  ariaLabel?: string
  zIndex?: number
}>(), {
  modelValue: undefined,
  bindShortcuts: true,
  active: true,
  ariaLabel: '应用菜单',
  zIndex: undefined,
})
const emit = defineEmits<{ 'update:modelValue': [value: string]; select: [value: string] }>()
const layer = useDlPopoverLayer(() => props.zIndex)
const actionableItems = computed(() => {
  const flatten = (items: DlMenuItem[]): DlMenuItem[] => items.flatMap(item => [item, ...flatten(item.children ?? [])])
  return props.menus.flatMap(menu => flatten(menu.items)).filter(item => !item.separator && !item.children?.length)
})

function handleKeydown(event: KeyboardEvent) {
  if (!props.active || !props.bindShortcuts || event.defaultPrevented || event.repeat) return
  const item = actionableItems.value.find(candidate => !candidate.disabled && candidate.shortcut && matchesDlKeyboardShortcut(event, candidate.shortcut))
  if (!item) return
  event.preventDefault()
  event.stopPropagation()
  emit('select', item.value)
}

onMounted(() => window.addEventListener('keydown', handleKeydown, true))
onBeforeUnmount(() => window.removeEventListener('keydown', handleKeydown, true))
</script>

<template>
  <MenubarRoot
    data-dl
    data-slot="toolbar-menu"
    :aria-label="ariaLabel"
    :model-value="modelValue"
    class="dl-toolbar-menu"
    @update:model-value="emit('update:modelValue', $event as unknown as string)"
  >
    <MenubarMenu v-for="menu in menus" :key="menu.value" :value="menu.value">
      <MenubarTrigger class="dl-toolbar-menu__trigger"><i v-if="menu.icon" aria-hidden="true">{{ menu.icon }}</i><span>{{ menu.label }}</span></MenubarTrigger>
      <MenubarPortal>
        <MenubarContent data-dl data-slot="toolbar-menu-content" data-dl-layer="popover" :style="{ zIndex: layer }" :side-offset="5" align="start" class="dl-toolbar-menu__content">
          <ToolbarMenuItems :items="menu.items" @select="emit('select', $event)" />
        </MenubarContent>
      </MenubarPortal>
    </MenubarMenu>
  </MenubarRoot>
</template>

<style>
.dl-toolbar-menu{display:inline-flex;align-items:center;gap:1px;min-width:0;padding:2px;border:0;background:transparent;color:var(--dl-text)}
.dl-toolbar-menu__trigger{display:inline-flex;min-height:30px;align-items:center;gap:6px;padding:0 10px;border:0;border-radius:7px;color:var(--dl-text-muted);background:transparent;font:600 .78rem/1 var(--dl-font-sans,system-ui,sans-serif);outline:0;cursor:default}.dl-toolbar-menu__trigger>i{display:grid;width:1rem;place-items:center;font-style:normal}
.dl-toolbar-menu__trigger:hover,.dl-toolbar-menu__trigger[data-state="open"]{color:var(--dl-text);background:var(--dl-surface-hover)}
.dl-toolbar-menu__trigger:focus-visible{box-shadow:var(--dl-focus)}
.dl-toolbar-menu__content{min-width:230px;padding:5px;border:1px solid var(--dl-border-strong);border-radius:var(--dl-radius-md);color:var(--dl-text);background:var(--dl-panel);box-shadow:0 24px 70px rgba(0,0,0,.38);outline:0;backdrop-filter:blur(22px)}
.dl-toolbar-menu__item{display:flex;min-height:35px;align-items:center;justify-content:space-between;gap:18px;padding:6px 10px;border-radius:9px;color:var(--dl-text-muted);font-size:.76rem;line-height:1.25;outline:0;cursor:default;user-select:none}
.dl-toolbar-menu__item[data-highlighted]{color:var(--dl-accent-text);background:var(--dl-surface-hover)}
.dl-toolbar-menu__item[data-disabled]{opacity:.38}.dl-toolbar-menu__item-main,.dl-toolbar-menu__item-end{display:flex;align-items:center;gap:8px}.dl-toolbar-menu__item-main i{display:grid;width:18px;place-items:center;color:var(--dl-text-faint);font-style:normal}.dl-toolbar-menu__item-main small{max-width:190px;color:var(--dl-text-faint);font-size:.66rem}.dl-toolbar-menu__item-end{margin-left:auto;color:var(--dl-text-faint)}.dl-toolbar-menu__item kbd{padding:2px 5px;border:1px solid var(--dl-border);border-radius:5px;background:var(--dl-night-soft);font:600 .61rem/1.2 ui-monospace,monospace}.dl-toolbar-menu__item--sub b{font-size:1rem;font-weight:500}.dl-toolbar-menu__separator{height:1px;margin:4px 7px;background:var(--dl-border)}
</style>
