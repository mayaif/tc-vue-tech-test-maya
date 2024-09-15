import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Todo {
  id: number
  title: string
  completed: boolean
  inProgress?: boolean
}

export const useTodoStore = defineStore('todo', () => {
  const todos = ref<Todo[]>([])
  const loading = ref(false)

  async function fetchTodos() {
    loading.value = true
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/1/todos`)
      const data = await response.json()
      todos.value = data.map((todo: any) => ({
        id: todo.id,
        title: todo.title,
        completed: todo.completed,
        inProgress: false
      }))
      saveTodosToLocalStorage()
    } catch (error) {
      console.error('Error fetching todos:', error)
    } finally {
      loading.value = false
    }
  }

  function addTodo(title: string) {
    const newTodo: Todo = {
      id: Date.now(),
      title,
      completed: false,
      inProgress: false
    }
    todos.value.push(newTodo)
    saveTodosToLocalStorage()
  }

  function updateTodo(id: number, updates: Partial<Todo>) {
    const index = todos.value.findIndex((todo) => todo.id === id)
    if (index !== -1) {
      const todo = todos.value[index]

      console.log('Before update:', JSON.stringify(todo))

      if (updates.title !== undefined) todo.title = updates.title
      if (updates.completed !== undefined) {
        todo.completed = updates.completed
        if (todo.completed) {
          todo.inProgress = false
        }
      }
      if (updates.inProgress !== undefined) {
        todo.inProgress = updates.inProgress
        if (todo.inProgress) {
          todo.completed = false
        }
      }

      console.log('After update:', JSON.stringify(todo))
      saveTodosToLocalStorage()
    } else {
      console.log('Todo not found:', id)
    }
  }

  function deleteTodo(id: number) {
    todos.value = todos.value.filter((todo) => todo.id !== id)
    saveTodosToLocalStorage()
  }

  function clearCompleted() {
    todos.value = todos.value.filter((todo) => !todo.completed)
    saveTodosToLocalStorage()
  }

  function saveTodosToLocalStorage() {
    localStorage.setItem('todos', JSON.stringify(todos.value))
  }

  function loadTodosFromLocalStorage() {
    const storedTodos = localStorage.getItem('todos')
    if (storedTodos) {
      todos.value = JSON.parse(storedTodos)
    }
  }

  return {
    todos,
    loading,
    fetchTodos,
    addTodo,
    updateTodo,
    deleteTodo,
    clearCompleted,
    loadTodosFromLocalStorage
  }
})
