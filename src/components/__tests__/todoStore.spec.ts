import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTodoStore } from '@/stores/todoStore'

const fetchMock = vi.fn()
global.fetch = fetchMock as unknown as typeof fetch

describe('useTodoStore', () => {
  let store: ReturnType<typeof useTodoStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useTodoStore()
    vi.clearAllMocks()
  })
  it('should add a new todo', () => {
    store.addTodo('New Todo')
    expect(store.todos.length).toBe(1)
    expect(store.todos[0].title).toBe('New Todo')
  })

  it('should update a todo', () => {
    store.addTodo('Original Todo')
    const todoId = store.todos[0].id
    store.updateTodo(todoId, { title: 'Updated Todo', completed: true })
    expect(store.todos[0].title).toBe('Updated Todo')
    expect(store.todos[0].completed).toBe(true)
  })

  it('should delete a todo', () => {
    store.addTodo('Todo to delete')
    const todoId = store.todos[0].id
    store.deleteTodo(todoId)
    expect(store.todos.length).toBe(0)
  })

  it('should clear completed todos', () => {
    store.addTodo('Completed Todo')
    store.addTodo('Incomplete Todo')
    store.updateTodo(store.todos[0].id, { completed: true })
    store.clearCompleted()
    expect(store.todos.length).toBe(1)
    expect(store.todos[0].title).toBe('Incomplete Todo')
  })

  it('should fetch todos', async () => {
    const mockTodos = [
      { id: 1, title: 'Mock Todo 1', completed: false },
      { id: 2, title: 'Mock Todo 2', completed: true }
    ]
    fetchMock.mockResolvedValueOnce({
      json: () => Promise.resolve(mockTodos)
    } as Response)

    await store.fetchTodos()
    expect(store.todos.length).toBe(2)
    expect(store.todos[0].title).toBe('Mock Todo 1')
    expect(store.todos[1].title).toBe('Mock Todo 2')
  })

  it('should handle fetch error', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    fetchMock.mockRejectedValueOnce(new Error('Fetch error'))

    await store.fetchTodos()
    expect(consoleSpy).toHaveBeenCalledWith('Error fetching todos:', expect.any(Error))
    expect(store.todos.length).toBe(0)

    consoleSpy.mockRestore()
  })

  it('should save and load todos from localStorage', () => {
    store.addTodo('Local Storage Todo')
    const newStore = useTodoStore()
    newStore.loadTodosFromLocalStorage()
    expect(newStore.todos.length).toBe(1)
    expect(newStore.todos[0].title).toBe('Local Storage Todo')
  })
})
