<script setup>
import { onMounted, reactive, ref } from 'vue'
import ErrorAlert from '../components/ErrorAlert.vue'
import LoadingBlock from '../components/LoadingBlock.vue'
import CountryRegionSelect from '../components/CountryRegionSelect.vue'
import { geographyApi, hotelsApi } from '../api'
import { useAsync } from '../composables/useAsync'
import { compact, formatPrice } from '../utils/format'

const filters = reactive({ countryId: '', regionId: '', minStars: '', text: '' })
const hotels = ref([])
const countries = ref([])
const { loading, error, run } = useAsync()

const search = () => run(async () => (hotels.value = await hotelsApi.search(compact({ ...filters }))))

onMounted(async () => {
  await run(async () => (countries.value = await geographyApi.countries()))
  search()
})
</script>

<template>
  <h1 class="h3 mb-3">Готелі</h1>
  <form class="card border-0 shadow-sm mb-4" @submit.prevent="search">
    <div class="card-body row g-3 align-items-end">
      <div class="col-lg-5">
        <CountryRegionSelect v-model:country-id="filters.countryId" v-model:region-id="filters.regionId" :countries="countries" />
      </div>
      <div class="col-6 col-lg-2">
        <label class="form-label small text-muted">Зірок від</label>
        <select v-model="filters.minStars" class="form-select">
          <option value="">Будь-яка</option>
          <option v-for="stars in 5" :key="stars" :value="stars">{{ stars }}★</option>
        </select>
      </div>
      <div class="col-6 col-lg-3">
        <label class="form-label small text-muted">Назва</label>
        <input v-model="filters.text" class="form-control" />
      </div>
      <div class="col-lg-2">
        <button class="btn btn-brand w-100">Знайти</button>
      </div>
    </div>
  </form>

  <ErrorAlert :message="error" />
  <LoadingBlock v-if="loading" />
  <div v-else class="row g-3">
    <div v-for="hotel in hotels" :key="hotel.id" class="col-md-6 col-lg-4">
      <div class="card h-100 border-0 shadow-sm card-hover">
        <div class="card-body d-flex flex-column">
          <div class="text-warning">{{ '★'.repeat(hotel.stars) }}</div>
          <h5 class="card-title">{{ hotel.name }}</h5>
          <p class="text-muted small">📍 {{ hotel.countryName }}, {{ hotel.regionName }}</p>
          <p class="small">{{ hotel.description }}</p>
          <div class="mt-auto d-flex justify-content-between align-items-end">
            <span>від <strong class="text-brand">{{ formatPrice(hotel.minPricePerNight) }}</strong> / ніч</span>
            <RouterLink :to="{ name: 'hotel', params: { id: hotel.id } }" class="btn btn-sm btn-brand">Номери</RouterLink>
          </div>
        </div>
      </div>
    </div>
    <p v-if="!hotels.length" class="text-muted">Готелів не знайдено.</p>
  </div>
</template>
