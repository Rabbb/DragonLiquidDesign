<script setup lang="ts">
import { NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuRoot, NavigationMenuTrigger, NavigationMenuViewport } from 'reka-ui'
import type { DlNavigationItem } from './primitive.types'

withDefaults(defineProps<{ modelValue?: string; items: DlNavigationItem[]; delayDuration?: number }>(), { modelValue: undefined, delayDuration: 200 })
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
const triggerClass = 'flex min-h-10 items-center gap-2 rounded-[10px] px-3 text-sm font-semibold text-[var(--dl-text-muted)] outline-none transition hover:bg-[var(--dl-surface-hover)] hover:text-[var(--dl-text)] data-[state=open]:bg-[var(--dl-surface-hover)] data-[state=open]:text-[var(--dl-accent-text)] focus-visible:[box-shadow:var(--dl-focus)]'
</script>

<template>
  <NavigationMenuRoot data-dl data-slot="navigation-menu" :model-value="modelValue" :delay-duration="delayDuration" class="relative" @update:model-value="emit('update:modelValue', $event)">
    <NavigationMenuList class="flex gap-1 rounded-[var(--dl-radius-sm)] border border-[var(--dl-border)] bg-[var(--dl-surface)] p-1">
      <NavigationMenuItem v-for="item in items" :key="item.value" :value="item.value">
        <NavigationMenuLink v-if="!item.children?.length" :href="item.href" :class="triggerClass">{{ item.label }}</NavigationMenuLink>
        <template v-else>
          <NavigationMenuTrigger :disabled="item.disabled" :class="triggerClass">{{ item.label }} <span class="text-[10px]">▼</span></NavigationMenuTrigger>
          <NavigationMenuContent class="absolute left-0 top-0 w-full p-2">
            <div class="grid min-w-[420px] grid-cols-2 gap-1">
              <NavigationMenuLink v-for="child in item.children" :key="child.value" :href="child.href" class="rounded-xl p-3 outline-none transition hover:bg-[var(--dl-surface-hover)] focus-visible:[box-shadow:var(--dl-focus)]">
                <b class="block text-sm text-[var(--dl-text)]">{{ child.label }}</b><small v-if="child.description" class="mt-1 block leading-5 text-[var(--dl-text-faint)]">{{ child.description }}</small>
              </NavigationMenuLink>
            </div>
          </NavigationMenuContent>
        </template>
      </NavigationMenuItem>
    </NavigationMenuList>
    <div class="absolute left-0 top-full flex w-full justify-center [perspective:2000px]">
      <NavigationMenuViewport class="relative mt-2 h-[var(--reka-navigation-menu-viewport-height)] w-[var(--reka-navigation-menu-viewport-width)] overflow-hidden rounded-[var(--dl-radius-md)] border border-[var(--dl-border-strong)] [background:var(--dl-panel)] shadow-[0_24px_70px_rgba(0,0,0,.44)] backdrop-blur-2xl transition-[width,height]" />
    </div>
  </NavigationMenuRoot>
</template>
