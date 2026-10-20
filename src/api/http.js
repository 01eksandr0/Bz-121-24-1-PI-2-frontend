import axios from 'axios'

/**
 * Єдиний HTTP-клієнт для всіх запитів до WebAPI.
 * Додає JWT-токен і перетворює відповідь сервера з помилкою (ProblemDetails) на зрозуміле повідомлення.
 */
const TOKEN_KEY = 'ta.token'

const http = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`
})

http.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

http.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(new Error(extractMessage(error)))
)

function extractMessage(error) {
  const data = error.response?.data
  if (!error.response) {
    return 'Сервер недоступний. Перевірте, чи запущено WebAPI.'
  }
  if (data?.errors) {
    // помилки перевірки моделі від [ApiController]
    return Object.values(data.errors).flat().join(' ')
  }
  if (error.response.status === 401) {
    return data?.detail || 'Потрібно увійти в систему.'
  }
  if (error.response.status === 403) {
    return data?.detail || 'Недостатньо прав для цієї дії.'
  }
  return data?.detail || data?.title || 'Сталася помилка.'
}

export { TOKEN_KEY }
export default http
