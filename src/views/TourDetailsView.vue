<script setup>
import { computed, onMounted, ref } from 'vue'
import ErrorAlert from '../components/ErrorAlert.vue'
import LoadingBlock from '../components/LoadingBlock.vue'
import PriceTag from '../components/PriceTag.vue'
import { toursApi, tourBookingsApi } from '../api'
import { useAuthStore } from '../stores/auth'
import { useAsync } from '../composables/useAsync'
import { TOUR_TYPES, formatDate, formatPrice } from '../utils/format'

const MAX_PERSONS = 10
const props = defineProps({ id: { type: String, required: true } })
const auth = useAuthStore()
const tour = ref(null)
const persons = ref(1)
const success = ref('')
const page = useAsync()
const booking = useAsync()

const total = computed(() => (tour.value ? tour.value.finalPrice * persons.value : 0))
const load = () => page.run(async () => (tour.value = await toursApi.get(props.id)))

async function book() {
  success.value = ''
  const result = await booking.run(() => tourBookingsApi.book({ tourId: tour.value.id, persons: persons.value }))
  if (result) {
    success.value = `Тур заброньовано на ${result.persons} ос. Сума: ${formatPrice(result.totalPrice)}.`
    load()
  }
}

onMounted(load)
</script>

<template>
  <ErrorAlert :message="page.error.value" />
  <LoadingBlock v-if="page.loading.value && !tour" />
  <div v-else-if="tour" class="row g-4">
    <div class="col-lg-8">
      <RouterLink to="/tours" class="small">← До списку турів</RouterLink>
      <h1 class="h3 mt-2">{{ tour.title }}</h1>
      <p class="text-muted">📍 {{ tour.countryName }}, {{ tour.regionName }} · {{ TOUR_TYPES[tour.type] }}</p>
      <span v-if="tour.isHot" class="badge badge-hot mb-3">🔥 Гарячий тур: знижка {{ tour.discountPercent }}%</span>
      <p>{{ tour.description }}</p>
      <ul class="list-unstyled">
        <li>🗓 {{ formatDate(tour.startDate) }} — {{ formatDate(tour.endDate) }} ({{ tour.nights }} ноч.)</li>
        <li>👥 Місць: {{ tour.capacity }}, вільних: {{ tour.freePlaces }}</li>
      </ul>
    </div>
    <div class="col-lg-4">
      <div class="card border-0 shadow-sm">
        <div class="card-body">
          <PriceTag :price="tour.pricePerPerson" :final-price="tour.finalPrice" :discount="tour.discountPercent" />
          <hr />
          <template v-if="auth.isAuthenticated">
            <label class="form-label small text-muted">Кількість осіб</label>
            <input v-model.number="persons" type="number" min="1" :max="MAX_PERSONS" class="form-control mb-2" />
            <p class="mb-3">Разом: <strong>{{ formatPrice(total) }}</strong></p>
            <ErrorAlert :message="booking.error.value" />
            <div v-if="success" class="alert alert-success py-2">{{ success }}</div>
            <button
              class="btn btn-brand w-100"
              :disabled="booking.loading.value || tour.freePlaces === 0"
              @click="book"
            >
              Забронювати
            </button>
          </template>
          <p v-else class="mb-0">
            <RouterLink :to="{ name: 'login', query: { redirect: $route.fullPath } }">Увійдіть</RouterLink>,
            щоб забронювати тур.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
