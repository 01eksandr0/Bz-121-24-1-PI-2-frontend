<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { ROLES } from '../utils/format'

const auth = useAuthStore()
const router = useRouter()
const open = ref(false)

function logout() {
  auth.logout()
  router.push({ name: 'home' })
}
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark" style="background: var(--brand)">
    <div class="container">
      <RouterLink class="navbar-brand fw-bold" to="/">✈ TravelAgency</RouterLink>
      <button class="navbar-toggler" type="button" @click="open = !open" aria-label="Меню">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" :class="{ show: open }" @click="open = false">
        <ul class="navbar-nav me-auto">
          <li class="nav-item"><RouterLink class="nav-link" to="/tours">Тури</RouterLink></li>
          <li class="nav-item"><RouterLink class="nav-link" to="/hotels">Готелі</RouterLink></li>
          <li class="nav-item"><RouterLink class="nav-link" to="/transport">Квитки</RouterLink></li>
          <li v-if="auth.isAuthenticated" class="nav-item">
            <RouterLink class="nav-link" to="/my-bookings">Мої бронювання</RouterLink>
          </li>
          <template v-if="auth.isStaff">
            <li class="nav-item"><RouterLink class="nav-link" to="/manage/tours">Керування турами</RouterLink></li>
            <li class="nav-item"><RouterLink class="nav-link" to="/manage/bookings">Усі бронювання</RouterLink></li>
            <li class="nav-item"><RouterLink class="nav-link" to="/manage/catalog">Довідники</RouterLink></li>
          </template>
          <li v-if="auth.isAdmin" class="nav-item">
            <RouterLink class="nav-link" to="/admin/users">Користувачі</RouterLink>
          </li>
        </ul>
        <div class="d-flex align-items-center gap-2">
          <template v-if="auth.isAuthenticated">
            <span class="text-white small">
              {{ auth.user.fullName }} <span class="badge bg-light text-dark">{{ ROLES[auth.user.role] }}</span>
            </span>
            <button class="btn btn-sm btn-outline-light" @click="logout">Вийти</button>
          </template>
          <template v-else>
            <RouterLink class="btn btn-sm btn-outline-light" to="/login">Увійти</RouterLink>
            <RouterLink class="btn btn-sm btn-light" to="/register">Реєстрація</RouterLink>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>
