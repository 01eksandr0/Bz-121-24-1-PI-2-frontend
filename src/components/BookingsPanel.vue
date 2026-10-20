<script setup>
import { computed, onMounted, ref } from 'vue'
import ErrorAlert from './ErrorAlert.vue'
import LoadingBlock from './LoadingBlock.vue'
import StatusBadge from './StatusBadge.vue'
import { roomBookingsApi, ticketBookingsApi, tourBookingsApi } from '../api'
import { useAsync } from '../composables/useAsync'
import { formatDate, formatDateTime, formatPrice, TRANSPORT_TYPES } from '../utils/format'

/**
 * Три вкладки бронювань (тури, номери, квитки). scope = 'mine' - бронювання поточного користувача,
 * 'all' - усі бронювання (сторінка персоналу). Одна логіка для обох сторінок (DRY).
 */
const props = defineProps({ scope: { type: String, default: 'mine' } })

const tabs = [
  {
    key: 'tours',
    title: 'Тури',
    api: tourBookingsApi,
    describe: (b) => `${b.tourTitle} · ${formatDate(b.tourStartDate)} · ${b.persons} ос.`
  },
  {
    key: 'rooms',
    title: 'Готелі',
    api: roomBookingsApi,
    describe: (b) => `${b.hotelName}, ${b.roomName} · ${formatDate(b.checkIn)} — ${formatDate(b.checkOut)} (${b.nights} ноч.)`
  },
  {
    key: 'tickets',
    title: 'Квитки',
    api: ticketBookingsApi,
    describe: (b) => `${TRANSPORT_TYPES[b.transportType]}: ${b.route} · ${formatDateTime(b.departureAt)} · ${b.seats} місць`
  }
]

const activeKey = ref('tours')
const bookings = ref([])
const active = computed(() => tabs.find((tab) => tab.key === activeKey.value))
const { loading, error, run } = useAsync()

const load = () =>
  run(async () => {
    const api = active.value.api
    bookings.value = props.scope === 'all' ? await api.all() : await api.mine()
  })

function select(key) {
  activeKey.value = key
  load()
}

async function cancel(booking) {
  if (!confirm('Скасувати бронювання?')) {
    return
  }
  await run(() => active.value.api.cancel(booking.id))
  if (!error.value) {
    load()
  }
}

onMounted(load)
</script>

<template>
  <ul class="nav nav-tabs mb-3">
    <li v-for="tab in tabs" :key="tab.key" class="nav-item">
      <button class="nav-link" :class="{ active: tab.key === activeKey }" @click="select(tab.key)">{{ tab.title }}</button>
    </li>
  </ul>
  <ErrorAlert :message="error" />
  <LoadingBlock v-if="loading && !bookings.length" />
  <table v-else class="table bg-white shadow-sm align-middle">
    <thead>
      <tr>
        <th>Що заброньовано</th>
        <th v-if="scope === 'all'">Клієнт</th>
        <th>Сума</th>
        <th>Стан</th>
        <th>Створено</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="booking in bookings" :key="booking.id">
        <td>{{ active.describe(booking) }}</td>
        <td v-if="scope === 'all'">{{ booking.userName }}</td>
        <td>{{ formatPrice(booking.totalPrice) }}</td>
        <td><StatusBadge :status="booking.status" /></td>
        <td class="small text-muted">{{ formatDateTime(booking.createdAt) }}</td>
        <td class="text-end">
          <button v-if="booking.status === 'Active'" class="btn btn-sm btn-outline-danger" :disabled="loading" @click="cancel(booking)">
            Скасувати
          </button>
        </td>
      </tr>
      <tr v-if="!bookings.length"><td colspan="6" class="text-muted">Бронювань немає.</td></tr>
    </tbody>
  </table>
</template>
