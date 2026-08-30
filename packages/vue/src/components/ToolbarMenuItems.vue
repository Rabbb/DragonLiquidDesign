<script setup lang="ts">
import { MenubarItem, MenubarSeparator, MenubarSub, MenubarSubContent, MenubarSubTrigger } from 'reka-ui'
import type { DlMenuItem } from './primitive.types'

defineProps<{ items: DlMenuItem[] }>()
const emit = defineEmits<{ select: [value: string] }>()
</script>

<template>
  <template v-for="item in items" :key="item.value">
    <MenubarSeparator v-if="item.separator" class="dl-toolbar-menu__separator" />
    <MenubarSub v-else-if="item.children?.length">
      <MenubarSubTrigger :disabled="item.disabled" class="dl-toolbar-menu__item dl-toolbar-menu__item--sub">
        <span class="dl-toolbar-menu__item-main"><i v-if="item.icon" aria-hidden="true">{{ item.icon }}</i><span>{{ item.label }}</span></span>
        <span class="dl-toolbar-menu__item-end"><kbd v-if="item.shortcut">{{ item.shortcut }}</kbd><b aria-hidden="true">›</b></span>
      </MenubarSubTrigger>
      <MenubarSubContent data-dl data-slot="toolbar-submenu" data-dl-layer="popover" :side-offset="5" :align-offset="-5" class="dl-toolbar-menu__content">
        <ToolbarMenuItems :items="item.children" @select="emit('select', $event)" />
      </MenubarSubContent>
    </MenubarSub>
    <MenubarItem v-else :disabled="item.disabled" class="dl-toolbar-menu__item" @select="emit('select', item.value)">
      <span class="dl-toolbar-menu__item-main"><i v-if="item.icon" aria-hidden="true">{{ item.icon }}</i><span>{{ item.label }}</span><small v-if="item.description">{{ item.description }}</small></span>
      <span class="dl-toolbar-menu__item-end"><span v-if="item.checked" aria-label="已选择">✓</span><kbd v-if="item.shortcut">{{ item.shortcut }}</kbd></span>
    </MenubarItem>
  </template>
</template>

