<script setup>
import { onMounted, reactive, ref } from 'vue'
import ErrorAlert from '../components/ErrorAlert.vue'
import LoadingBlock from '../components/LoadingBlock.vue'
import { ticketBookingsApi, tripsApi } from '../api'
import { useAuthStore } from '../stores/auth'
import { useAsync } from '../composables/useAsync'
import { TRANSPORT_TYPES, compact, formatDateTime, formatPrice } from '../utils/format'

const auth = useAuthStore()
const filters = reactive({ type: '', fromCity: '', toCity: '', date: '' })
const seats = reactive({})
const trips = ref([])
const success = ref('')
const { loading, error, run } = useAsync()

const search = () => run(async () => (trips.value = await tripsApi.search(compact({ ...filters }))))

async function book(trip) {
  success.value = ''
  const result = await run(() => ticketBookingsApi.book({ tripId: trip.id, seats: seats[trip.id] || 1 }))
  if (result) {
    success.value = `Квитки ${result.route} (${result.seats} шт.) оформлено. Сума: ${formatPrice(result.totalPrice)}.`
    search()
  }
}

onMounted(search)
</script>

<template>
  <h1 class="h3 mb-3">Квитки на транспорт</h1>
  <form class="card border-0 shadow-sm mb-4" @submit.prevent="search">
    <div class="card-body row g-3 align-items-end">
      <div class="col-md-2">
        <label class="form-label small text-muted">Транспорт</label>
        <select v-model="filters.type" class="form-select">
          <option value="">Будь-який</option>
          <option v-for="(label, value) in TRANSPORT_TYPES" :key="value" :value="value">{{ label }}</option>
        </select>
      </div>
      <div class="col-md-3">
        <label class="form-label small text-muted">Звідки</label>
        <input v-model="filters.fromCity" class="form-control" />
      </div>
      <div class="col-md-3">
        <label class="form-label small text-muted">Куди</label>
        <input v-model="filters.toCity" class="form-control" />
      </div>
      <div class="col-md-2">
        <label class="form-label small text-muted">Дата</label>
        <input v-model="filters.date" type="date" class="form-control" />
      </div>
      <div class="col-md-2"><button class="btn btn-brand w-100">Знайти</button></div>
    </div>
  </form>

  <ErrorAlert :message="error" />
  <div v-if="success" class="alert alert-success py-2">{{ success }}</div>
  <LoadingBlock v-if="loading && !trips.length" />
  <table v-else class="table bg-white shadow-sm align-middle">
    <thead>
      <tr><th>Рейс</th><th>Відправлення</th><th>Прибуття</th><th>Ціна</th><th>Вільно</th><th></th></tr>
    </thead>
    <tbody>
      <tr v-for="trip in trips" :key="trip.id">
        <td>{{ TRANSPORT_TYPES[trip.type] }}: {{ trip.fromCity }} → {{ trip.toCity }}</td>
        <td>{{ formatDateTime(trip.departureAt) }}</td>
        <td>{{ formatDateTime(trip.arrivalAt) }}</td>
        <td>{{ formatPrice(trip.price) }}</td>
        <td>{{ trip.freeSeats }}</td>
        <td class="text-end" style="min-width: 190px">
          <div v-if="auth.isAuthenticated" class="input-group input-group-sm">
            <input v-model.number="seats[trip.id]" type="number" min="1" placeholder="1" class="form-control" />
            <button class="btn btn-brand" :disabled="loading || trip.freeSeats === 0" @click="book(trip)">Купити</button>
          </div>
        </td>
      </tr>
      <tr v-if="!trips.length"><td colspan="6" class="text-muted">Рейсів не знайдено.</td></tr>
    </tbody>
  </table>
</template>
