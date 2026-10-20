<script setup>
import { onMounted, reactive, ref } from 'vue'
import TourCard from '../components/TourCard.vue'
import ErrorAlert from '../components/ErrorAlert.vue'
import LoadingBlock from '../components/LoadingBlock.vue'
import CountryRegionSelect from '../components/CountryRegionSelect.vue'
import { geographyApi, toursApi } from '../api'
import { useAsync } from '../composables/useAsync'
import { SORT_OPTIONS, TOUR_TYPES, compact } from '../utils/format'

const emptyFilters = () => ({
  text: '',
  countryId: '',
  regionId: '',
  type: '',
  hotOnly: false,
  onlyAvailable: false,
  minPrice: '',
  maxPrice: '',
  dateFrom: '',
  dateTo: '',
  sortBy: 'StartDate'
})

const filters = reactive(emptyFilters())
const tours = ref([])
const countries = ref([])
const { loading, error, run } = useAsync()

const search = () => run(async () => (tours.value = await toursApi.search(compact({ ...filters }))))

function reset() {
  Object.assign(filters, emptyFilters())
  search()
}

onMounted(async () => {
  await run(async () => (countries.value = await geographyApi.countries()))
  search()
})
</script>

<template>
  <h1 class="h3 mb-3">Тури</h1>
  <form class="card border-0 shadow-sm mb-4" @submit.prevent="search">
    <div class="card-body">
      <div class="row g-3">
        <div class="col-lg-4">
          <label class="form-label small text-muted">Пошук</label>
          <input v-model="filters.text" class="form-control" placeholder="Назва, опис, місто..." />
        </div>
        <div class="col-lg-5">
          <CountryRegionSelect v-model:country-id="filters.countryId" v-model:region-id="filters.regionId" :countries="countries" />
        </div>
        <div class="col-lg-3">
          <label class="form-label small text-muted">Тип туру</label>
          <select v-model="filters.type" class="form-select">
            <option value="">Усі</option>
            <option v-for="(label, value) in TOUR_TYPES" :key="value" :value="value">{{ label }}</option>
          </select>
        </div>
        <div class="col-6 col-lg-2">
          <label class="form-label small text-muted">Ціна від, $</label>
          <input v-model="filters.minPrice" type="number" min="0" class="form-control" />
        </div>
        <div class="col-6 col-lg-2">
          <label class="form-label small text-muted">Ціна до, $</label>
          <input v-model="filters.maxPrice" type="number" min="0" class="form-control" />
        </div>
        <div class="col-6 col-lg-2">
          <label class="form-label small text-muted">Виїзд з</label>
          <input v-model="filters.dateFrom" type="date" class="form-control" />
        </div>
        <div class="col-6 col-lg-2">
          <label class="form-label small text-muted">Виїзд до</label>
          <input v-model="filters.dateTo" type="date" class="form-control" />
        </div>
        <div class="col-lg-4">
          <label class="form-label small text-muted">Сортування</label>
          <select v-model="filters.sortBy" class="form-select">
            <option v-for="(label, value) in SORT_OPTIONS" :key="value" :value="value">{{ label }}</option>
          </select>
        </div>
        <div class="col-12 d-flex flex-wrap align-items-center gap-3">
          <div class="form-check">
            <input id="hot" v-model="filters.hotOnly" class="form-check-input" type="checkbox" />
            <label for="hot" class="form-check-label">Тільки гарячі</label>
          </div>
          <div class="form-check">
            <input id="free" v-model="filters.onlyAvailable" class="form-check-input" type="checkbox" />
            <label for="free" class="form-check-label">Є вільні місця</label>
          </div>
          <div class="ms-auto d-flex gap-2">
            <button type="button" class="btn btn-outline-secondary" @click="reset">Скинути</button>
            <button type="submit" class="btn btn-brand">Знайти</button>
          </div>
        </div>
      </div>
    </div>
  </form>

  <ErrorAlert :message="error" />
  <LoadingBlock v-if="loading" />
  <template v-else>
    <p class="text-muted small">Знайдено турів: {{ tours.length }}</p>
    <div class="row g-3">
      <div v-for="tour in tours" :key="tour.id" class="col-md-6 col-lg-4">
        <TourCard :tour="tour" />
      </div>
    </div>
  </template>
</template>
