<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTodoStore, type Todo } from '@/stores/todoStore'
import { Button } from '@/components/ui/button'
import { Trash, ChevronLeft } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import TodoItem from './TodoItem.vue'
import FormItem from '../common/forms/FormItem.vue'
import FilterItem from '../common/filters/FilterItem.vue'

const todoStore = useTodoStore()
const newTodoTitle = ref('')
const editingId = ref<number | null>(null)
const editedTitle = ref('')
const searchTerm = ref('')
const statusFilter = ref<'all' | 'not_started' | 'in_progress' | 'completed'>('all')
const openStatusDropdown = ref<number | null>(null)

const router = useRouter()
const goHome = () => router.push({ name: 'home' })

onMounted(() => {
    todoStore.loadTodosFromLocalStorage()
    if (todoStore.todos.length === 0) {
        todoStore.fetchTodos()
    }
})

const filteredTodos = computed(() => {
    return todoStore.todos.filter(todo =>
        todo.title.toLowerCase().includes(searchTerm.value.toLowerCase()) &&
        (statusFilter.value === 'all' || getStatus(todo) === statusFilter.value)
    )
})

const addTodo = () => {
    if (newTodoTitle.value.trim()) {
        todoStore.addTodo(newTodoTitle.value.trim())
        newTodoTitle.value = ''
    }
}

const toggleTodo = (id: number, completed: boolean) => {
    todoStore.updateTodo(id, { completed, inProgress: false })
}

const updateTodoStatus = (id: number, status: 'not_started' | 'in_progress' | 'completed') => {
    const updates: Partial<Todo> = {
        completed: status === 'completed',
        inProgress: status === 'in_progress'
    }
    todoStore.updateTodo(id, updates)
    openStatusDropdown.value = null
}

const startEditing = (id: number, title: string) => {
    editingId.value = id
    editedTitle.value = title
}

const saveEdit = (id: number) => {
    if (editedTitle.value.trim()) {
        todoStore.updateTodo(id, {
            title: editedTitle.value.trim()
        })
        editingId.value = null
    }
}

const cancelEdit = () => {
    editingId.value = null
    editedTitle.value = ''
}

const deleteTodo = (id: number) => {
    todoStore.deleteTodo(id)
}

const getStatus = (todo: Todo): 'not_started' | 'in_progress' | 'completed' => {
    if (todo.completed) return 'completed'
    if (todo.inProgress) return 'in_progress'
    return 'not_started'
}

const toggleStatusDropdown = (id: number) => {
    openStatusDropdown.value = openStatusDropdown.value === id ? null : id
}

const statusOptions = [
    { value: 'all', label: 'All' },
    { value: 'not_started', label: 'Not Started' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' }
]
</script>

<template>
    <div class="max-w-xl px-2 sm:px-4 mx-auto">
        <h1 id="todo-list-title" class="text-2xl md:text-3xl lg:text-4xl font-bold mb-24 relative inline-block">

            <span
                class="block text-xl md:text-2xl lg:text-4xl text-secondary-foreground font-extrabold mt-2 relative z-10 animate-fadeIn delay-200">My
                Todos</span>
            <span aria-hidden="true"
                class="absolute -bottom-4 left-0 w-full h-3 bg-secondary transform -skew-x-12"></span>
        </h1>
        <div class="mb-4 space-y-2">
            <label for="search-tasks" class="block mb-1">Search tasks</label>
            <input id="search-tasks" v-model="searchTerm" placeholder="Search tasks"
                class="w-full p-2 border rounded mb-2" />
            <FilterItem v-model="statusFilter" label="Filter by status" :options="statusOptions" />
            <FormItem v-model="newTodoTitle" label="Add a new task" placeholder="Add a new task" @submit="addTodo" />
        </div>
        <ul v-if="!todoStore.loading" class="space-y-4" aria-labelledby="todo-list-title">
            <TodoItem v-for="todo in filteredTodos" :key="todo.id" :todo="todo" :editing-id="editingId"
                :open-status-dropdown="openStatusDropdown" @toggle-todo="toggleTodo"
                @update-todo-status="updateTodoStatus" @start-editing="startEditing" @save-edit="saveEdit"
                @cancel-edit="cancelEdit" @delete-todo="deleteTodo" @toggle-status-dropdown="toggleStatusDropdown" />
        </ul>
        <p v-else class="text-center py-4">Loading todos...</p>
        <div class="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Button @click="goHome" class="w-full sm:w-auto">
                <ChevronLeft class="w-4 h-4 mr-2" />Back to Home
            </Button>
            <Button @click="todoStore.clearCompleted" variant="outline"
                class="w-full sm:w-auto bg-white border-blue-950">
                Clear Completed Tasks
                <Trash class="w-4 h-4 ml-2" />
            </Button>
        </div>
    </div>
</template>
