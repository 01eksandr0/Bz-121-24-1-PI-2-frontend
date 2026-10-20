<script setup>
import { reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ErrorAlert from '../components/ErrorAlert.vue'
import { useAuthStore } from '../stores/auth'
import { useAsync } from '../composables/useAsync'

const form = reactive({ email: '', password: '' })
const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const { loading, error, run } = useAsync()

async function submit() {
  await run(() => auth.login(form))
  if (auth.isAuthenticated) {
    router.push(route.query.redirect || '/')
  }
}
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-md-5">
      <div class="card border-0 shadow-sm">
        <div class="card-body p-4">
          <h1 class="h4 mb-3">Вхід</h1>
          <ErrorAlert :message="error" />
          <form @submit.prevent="submit">
            <input v-model="form.email" type="email" class="form-control mb-2" placeholder="Email" required />
            <input v-model="form.password" type="password" class="form-control mb-3" placeholder="Пароль" required />
            <button class="btn btn-brand w-100" :disabled="loading">Увійти</button>
          </form>
          <p class="small text-muted mt-3 mb-0">
            Немає акаунта? <RouterLink to="/register">Зареєструватися</RouterLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
