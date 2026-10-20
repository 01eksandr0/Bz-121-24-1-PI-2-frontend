<script setup>
import { onMounted, reactive, ref } from 'vue'
import ErrorAlert from '../components/ErrorAlert.vue'
import LoadingBlock from '../components/LoadingBlock.vue'
import { hotelsApi, roomBookingsApi } from '../api'
import { useAuthStore } from '../stores/auth'
import { useAsync } from '../composables/useAsync'
import { formatPrice, isoDate } from '../utils/format'

const DEFAULT_CHECK_IN_DAYS = 14
const DEFAULT_NIGHTS = 3
const props = defineProps({ id: { type: String, required: true } })
const auth = useAuthStore()
const hotel = ref(null)
const rooms = ref(null)
const success = ref('')
const query = reactive({
  checkIn: isoDate(DEFAULT_CHECK_IN_DAYS),
  checkOut: isoDate(DEFAULT_CHECK_IN_DAYS + DEFAULT_NIGHTS),
  guests: 2
})
const page = useAsync()
const action = useAsync()

const findRooms = () =>
  action.run(async () => {
    success.value = ''
    rooms.value = await hotelsApi.availableRooms(props.id, query)
  })

async function book(room) {
  const result = await action.run(() => roomBookingsApi.book({ roomId: room.id, ...query }))
  if (result) {
    success.value = `Номер «${result.roomName}» заброньовано на ${result.nights} ноч. Сума: ${formatPrice(result.totalPrice)}.`
    rooms.value = rooms.value.filter((r) => r.id !== room.id)
  }
}

onMounted(() => page.run(async () => (hotel.value = await hotelsApi.get(props.id))))
</script>

<template>
  <ErrorAlert :message="page.error.value" />
  <LoadingBlock v-if="page.loading.value" />
  <template v-else-if="hotel">
    <RouterLink to="/hotels" class="small">← До списку готелів</RouterLink>
    <h1 class="h3 mt-2">{{ hotel.name }} <span class="text-warning">{{ '★'.repeat(hotel.stars) }}</span></h1>
    <p class="text-muted">📍 {{ hotel.countryName }}, {{ hotel.regionName }}</p>
    <p>{{ hotel.description }}</p>

    <form class="card border-0 shadow-sm mb-4" @submit.prevent="findRooms">
      <div class="card-body row g-3 align-items-end">
        <div class="col-md-3">
          <label class="form-label small text-muted">Заїзд</label>
          <input v-model="query.checkIn" type="date" class="form-control" required />
        </div>
        <div class="col-md-3">
          <label class="form-label small text-muted">Виїзд</label>
          <input v-model="query.checkOut" type="date" class="form-control" required />
        </div>
        <div class="col-md-3">
          <label class="form-label small text-muted">Гостей</label>
          <input v-model.number="query.guests" type="number" min="1" class="form-control" required />
        </div>
        <div class="col-md-3">
          <button class="btn btn-brand w-100" :disabled="action.loading.value">Перевірити вільні номери</button>
        </div>
      </div>
    </form>

    <ErrorAlert :message="action.error.value" />
    <div v-if="success" class="alert alert-success py-2">{{ success }}</div>

    <table class="table bg-white shadow-sm">
      <thead>
        <tr><th>Номер</th><th>Місткість</th><th>Ціна за ніч</th><th></th></tr>
      </thead>
      <tbody>
        <tr v-for="room in rooms ?? hotel.rooms" :key="room.id">
          <td>{{ room.name }}</td>
          <td>{{ room.capacity }} ос.</td>
          <td>{{ formatPrice(room.pricePerNight) }}</td>
          <td class="text-end">
            <button
              v-if="rooms && auth.isAuthenticated"
              class="btn btn-sm btn-brand"
              :disabled="action.loading.value"
              @click="book(room)"
            >
              Забронювати
            </button>
          </td>
        </tr>
        <tr v-if="rooms && !rooms.length">
          <td colspan="4" class="text-muted">На ці дати вільних номерів немає.</td>
        </tr>
      </tbody>
    </table>
    <p v-if="!auth.isAuthenticated" class="small text-muted">Щоб забронювати номер, потрібно увійти.</p>
    <p v-else-if="!rooms" class="small text-muted">Оберіть дати і натисніть «Перевірити вільні номери».</p>
  </template>
</template>
