<script setup lang="ts">
defineProps<{
    modelValue: string
    options: { value: string; label: string }[]
    label: string
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
}>()
</script>

<template>
    <div class="space-y-2">
        <label :for="label" class="block text-sm font-medium">{{ label }}</label>
        <select :id="label" :value="modelValue"
            @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
            class="w-full p-2 border rounded text-sm">
            <option v-for="option in options" :key="option.value" :value="option.value">
                {{ option.label }}
            </option>
        </select>
    </div>
</template>