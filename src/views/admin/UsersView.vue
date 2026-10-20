<script setup>
import { onMounted, ref } from 'vue'
import ErrorAlert from '../../components/ErrorAlert.vue'
import LoadingBlock from '../../components/LoadingBlock.vue'
import { usersApi } from '../../api'
import { useAuthStore } from '../../stores/auth'
import { useAsync } from '../../composables/useAsync'
import { ROLES } from '../../utils/format'

const auth = useAuthStore()
const users = ref([])
const { loading, error, run } = useAsync()

const load = () => run(async () => (users.value = await usersApi.all()))

async function changeRole(user, role) {
  const updated = await run(() => usersApi.changeRole(user.id, role))
  if (updated) {
    user.role = updated.role
  } else {
    load()
  }
}

onMounted(load)
</script>

<template>
  <h1 class="h3 mb-3">Користувачі</h1>
  <ErrorAlert :message="error" />
  <LoadingBlock v-if="loading && !users.length" />
  <table v-else class="table bg-white shadow-sm align-middle">
    <thead><tr><th>Ім'я</th><th>Email</th><th style="width: 220px">Роль</th></tr></thead>
    <tbody>
      <tr v-for="user in users" :key="user.id">
        <td>{{ user.fullName }}</td>
        <td>{{ user.email }}</td>
        <td>
          <select
            class="form-select form-select-sm"
            :value="user.role"
            :disabled="user.id === auth.user.id"
            @change="changeRole(user, $event.target.value)"
          >
            <option v-for="(label, value) in ROLES" :key="value" :value="value">{{ label }}</option>
          </select>
        </td>
      </tr>
    </tbody>
  </table>
</template>
