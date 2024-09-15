<script setup lang="ts">
import { Button } from '@/components/ui/button'

defineProps<{
    modelValue: string
    placeholder: string
    label: string
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
    (e: 'submit'): void
}>()
</script>

<template>
    <div class="space-y-2">
        <label :for="label" class="block text-sm font-medium">{{ label }}</label>
        <div class="flex flex-col md:flex-row space-x-2">
            <input :id="label" :value="modelValue"
                @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
                @keyup.enter="emit('submit')" :placeholder="placeholder" class="flex-grow p-2 border rounded text-sm" />
            <Button @click="emit('submit')" class="shrink-0 mt-4 md:mt-0">Add Task</Button>
        </div>
    </div>
</template>