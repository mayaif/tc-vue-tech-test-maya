<script setup lang="ts">
import { ref, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2, ChevronDown } from 'lucide-vue-next'
import type { Todo } from '@/stores/todoStore'

const props = defineProps<{
    todo: Todo
    editingId: number | null
    openStatusDropdown: number | null
}>()

const emit = defineEmits<{
    (e: 'toggleTodo', id: number, completed: boolean): void
    (e: 'updateTodoStatus', id: number, status: 'not_started' | 'in_progress' | 'completed'): void
    (e: 'startEditing', id: number, title: string): void
    (e: 'saveEdit', id: number, newTitle: string): void
    (e: 'cancelEdit'): void
    (e: 'deleteTodo', id: number): void
    (e: 'toggleStatusDropdown', id: number): void
}>()

const editedTitle = ref(props.todo.title)

watch(() => props.editingId, (newEditingId) => {
    if (newEditingId === props.todo.id) {
        editedTitle.value = props.todo.title
    }
})

const getStatus = (todo: Todo): 'not_started' | 'in_progress' | 'completed' => {
    if (todo.completed) return 'completed'
    if (todo.inProgress) return 'in_progress'
    return 'not_started'
}

const getStatusColor = (todo: Todo) => {
    const status = getStatus(todo)
    switch (status) {
        case 'completed':
            return 'bg-green-500'
        case 'in_progress':
            return 'bg-yellow-500'
        case 'not_started':
            return 'bg-gray-500'
    }
}

const getStatusText = (todo: Todo): string => {
    const status = getStatus(todo)
    switch (status) {
        case 'completed':
            return 'Completed'
        case 'in_progress':
            return 'In Progress'
        case 'not_started':
            return 'Not Started'
    }
}

const handleSaveEdit = () => {
    if (editedTitle.value.trim()) {
        emit('saveEdit', props.todo.id, editedTitle.value.trim())
    }
}
</script>

<template>
    <li class="p-3 border rounded bg-white shadow-sm">
        <div v-if="editingId === todo.id" class="space-y-2">
            <label :for="'edit-title-' + todo.id" class="block text-sm font-medium">Edit task title</label>
            <input :id="'edit-title-' + todo.id" v-model="editedTitle" @keyup.enter="handleSaveEdit"
                @keyup.esc="emit('cancelEdit')" class="w-full p-2 border rounded text-sm" />
            <div class="flex justify-end space-x-2">
                <Button @click="handleSaveEdit" size="sm">Save</Button>
                <Button @click="emit('cancelEdit')" variant="outline" size="sm">Cancel</Button>
            </div>
        </div>
        <div v-else class="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0">
            <div class="flex items-start space-x-2 flex-grow">
                <input :id="'todo-checkbox-' + todo.id" type="checkbox" :checked="todo.completed"
                    @change="emit('toggleTodo', todo.id, !todo.completed)"
                    class="mt-1 form-checkbox h-4 w-4 text-green-500 focus:ring-0" />
                <label :for="'todo-checkbox-' + todo.id" :class="{ 'line-through': todo.completed }" class="text-sm">
                    {{ todo.title }}
                </label>
            </div>
            <div class="flex items-center space-x-2 justify-center sm:justify-end">
                <div class="relative">
                    <button @click="emit('toggleStatusDropdown', todo.id)"
                        class="flex items-center space-x-1 bg-gray-100 rounded p-1"
                        :aria-label="`Change status: currently ${getStatusText(todo)}`"
                        :aria-expanded="openStatusDropdown === todo.id">
                        <span :class="['w-3 h-3 rounded-full', getStatusColor(todo)]"></span>
                        <ChevronDown class="w-4 h-4" />
                    </button>
                    <div v-if="openStatusDropdown === todo.id"
                        class="absolute left-0 sm:right-0 sm:left-auto mt-1 w-32 bg-white border rounded shadow-lg z-10">
                        <button @click="emit('updateTodoStatus', todo.id, 'not_started')"
                            class="block w-full text-left px-4 py-2 hover:bg-gray-100">
                            Not Started
                        </button>
                        <button @click="emit('updateTodoStatus', todo.id, 'in_progress')"
                            class="block w-full text-left px-4 py-2 hover:bg-gray-100">
                            In Progress
                        </button>
                        <button @click="emit('updateTodoStatus', todo.id, 'completed')"
                            class="block w-full text-left px-4 py-2 hover:bg-gray-100">
                            Completed
                        </button>
                    </div>
                </div>
                <Button @click="emit('startEditing', todo.id, todo.title)" size="sm"
                    class="bg-transparent hover:bg-slate-200 rounded p-1" aria-label="Edit task" title="Edit">
                    <Pencil class="w-4 h-4 text-gray-600" />
                </Button>
                <Button @click="emit('deleteTodo', todo.id)" size="sm"
                    class="bg-transparent hover:bg-slate-200 rounded p-1" aria-label="Delete task" title="Delete">
                    <Trash2 class="w-4 h-4 text-red-500" />
                </Button>
            </div>
        </div>
    </li>
</template>