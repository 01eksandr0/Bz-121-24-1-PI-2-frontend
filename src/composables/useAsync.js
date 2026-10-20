import { ref } from 'vue'

/**
 * Обгортка для асинхронних дій сторінки: стан завантаження і текст помилки в одному місці,
 * щоб не повторювати try/catch у кожному компоненті.
 */
export function useAsync() {
  const loading = ref(false)
  const error = ref('')

  async function run(action) {
    loading.value = true
    error.value = ''
    try {
      return await action()
    } catch (exception) {
      error.value = exception.message
      return undefined
    } finally {
      loading.value = false
    }
  }

  return { loading, error, run }
}
