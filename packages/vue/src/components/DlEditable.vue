<script setup lang="ts">
import { EditableArea, EditableCancelTrigger, EditableEditTrigger, EditableInput, EditablePreview, EditableRoot, EditableSubmitTrigger } from 'reka-ui'

withDefaults(defineProps<{
  modelValue?: string | null
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  activationMode?: 'focus' | 'dblclick' | 'none'
  submitMode?: 'blur' | 'enter' | 'both' | 'none'
  maxLength?: number
  name?: string
}>(), { modelValue: '', placeholder: '点击编辑', disabled: false, readonly: false, activationMode: 'dblclick', submitMode: 'both', maxLength: undefined, name: undefined })
const emit = defineEmits<{ 'update:modelValue': [value: string]; submit: [value: string | null | undefined] }>()
</script>

<template>
  <EditableRoot data-dl data-slot="editable" :model-value="modelValue" :placeholder="placeholder" :disabled="disabled" :readonly="readonly" :activation-mode="activationMode" :submit-mode="submitMode" :max-length="maxLength" :name="name" class="group flex min-h-11 w-full items-center gap-2 rounded-[var(--dl-radius-sm)] border border-[var(--dl-border)] bg-[var(--dl-surface)] px-3 text-sm text-[var(--dl-text)] transition focus-within:border-[var(--dl-border-focus)] focus-within:[box-shadow:var(--dl-focus)] data-[disabled]:opacity-50" @update:model-value="emit('update:modelValue', $event)" @submit="emit('submit', $event)">
    <EditableArea class="min-w-0 flex-1">
      <EditablePreview class="block min-h-6 w-full truncate text-[var(--dl-text)] data-[placeholder-shown]:text-[var(--dl-text-faint)]" />
      <EditableInput class="min-h-6 w-full border-0 bg-transparent text-[var(--dl-text)] outline-none" />
    </EditableArea>
    <EditableEditTrigger data-slot="editable-edit" class="rounded-lg px-2 py-1 text-xs text-[var(--dl-text-faint)] hover:bg-white/[0.08] hover:text-amber-200">编辑</EditableEditTrigger>
    <EditableSubmitTrigger data-slot="editable-submit" class="rounded-lg px-2 py-1 text-xs text-emerald-200 hover:bg-emerald-300/10">保存</EditableSubmitTrigger>
    <EditableCancelTrigger data-slot="editable-cancel" class="rounded-lg px-2 py-1 text-xs text-[var(--dl-text-faint)] hover:bg-white/[0.08]">取消</EditableCancelTrigger>
  </EditableRoot>
</template>
