import { defineStore } from 'pinia'
import { authApi } from '../api'
import { TOKEN_KEY } from '../api/http'

const USER_KEY = 'ta.user'
const STAFF_ROLES = ['Manager', 'Admin']

/** Стан входу: токен і користувач (зберігаються в localStorage, щоб не входити після оновлення сторінки). */
export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem(TOKEN_KEY),
    user: JSON.parse(localStorage.getItem(USER_KEY) || 'null')
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.token),
    isStaff: (state) => STAFF_ROLES.includes(state.user?.role),
    isAdmin: (state) => state.user?.role === 'Admin'
  },
  actions: {
    async login(credentials) {
      this.remember(await authApi.login(credentials))
    },
    async register(form) {
      this.remember(await authApi.register(form))
    },
    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    },
    hasRole(roles) {
      return roles.includes(this.user?.role)
    },
    remember(response) {
      this.token = response.token
      this.user = response.user
      localStorage.setItem(TOKEN_KEY, response.token)
      localStorage.setItem(USER_KEY, JSON.stringify(response.user))
    }
  }
})
