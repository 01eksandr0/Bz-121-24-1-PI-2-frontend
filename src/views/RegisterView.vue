<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import ErrorAlert from '../components/ErrorAlert.vue'
import { useAuthStore } from '../stores/auth'
import { useAsync } from '../composables/useAsync'

const MIN_PASSWORD_LENGTH = 8
const form = reactive({ fullName: '', email: '', password: '' })
const auth = useAuthStore()
const router = useRouter()
const { loading, error, run } = useAsync()

async function submit() {
  await run(() => auth.register(form))
  if (auth.isAuthenticated) {
    router.push('/')
  }
}
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-md-5">
      <div class="card border-0 shadow-sm">
        <div class="card-body p-4">
          <h1 class="h4 mb-3">Реєстрація</h1>
          <ErrorAlert :message="error" />
          <form @submit.prevent="submit">
            <input v-model="form.fullName" class="form-control mb-2" placeholder="Ім'я та прізвище" required />
            <input v-model="form.email" type="email" class="form-control mb-2" placeholder="Email" required />
            <input
              v-model="form.password"
              type="password"
              class="form-control mb-3"
              :placeholder="`Пароль (від ${MIN_PASSWORD_LENGTH} символів)`"
              :minlength="MIN_PASSWORD_LENGTH"
              required
            />
            <button class="btn btn-brand w-100" :disabled="loading">Зареєструватися</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
