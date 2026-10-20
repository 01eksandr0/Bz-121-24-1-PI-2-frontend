<script setup>
import { onMounted, ref } from 'vue'
import ErrorAlert from '../../components/ErrorAlert.vue'
import LoadingBlock from '../../components/LoadingBlock.vue'
import { toursApi } from '../../api'
import { useAsync } from '../../composables/useAsync'
import { TOUR_TYPES, formatDate, formatPrice } from '../../utils/format'

const tours = ref([])
const { loading, error, run } = useAsync()

const load = () => run(async () => (tours.value = await toursApi.search({})))

async function remove(tour) {
  if (!confirm(`Видалити тур «${tour.title}»?`)) {
    return
  }
  await run(() => toursApi.remove(tour.id))
  if (!error.value) {
    load()
  }
}

onMounted(load)
</script>

<template>
  <div class="d-flex justify-content-between align-items-center mb-3">
    <h1 class="h3 mb-0">Керування турами</h1>
    <RouterLink :to="{ name: 'tour-create' }" class="btn btn-brand">+ Новий тур</RouterLink>
  </div>
  <ErrorAlert :message="error" />
  <LoadingBlock v-if="loading && !tours.length" />
  <table v-else class="table bg-white shadow-sm align-middle">
    <thead>
      <tr><th>Назва</th><th>Тип</th><th>Напрямок</th><th>Дата</th><th>Ціна</th><th>Місця</th><th></th></tr>
    </thead>
    <tbody>
      <tr v-for="tour in tours" :key="tour.id">
        <td>{{ tour.title }} <span v-if="tour.isHot" class="badge badge-hot">−{{ tour.discountPercent }}%</span></td>
        <td>{{ TOUR_TYPES[tour.type] }}</td>
        <td>{{ tour.countryName }}, {{ tour.regionName }}</td>
        <td>{{ formatDate(tour.startDate) }}</td>
        <td>{{ formatPrice(tour.finalPrice) }}</td>
        <td>{{ tour.capacity - tour.freePlaces }} / {{ tour.capacity }}</td>
        <td class="text-end text-nowrap">
          <RouterLink :to="{ name: 'tour-edit', params: { id: tour.id } }" class="btn btn-sm btn-outline-secondary me-1">Змінити</RouterLink>
          <button class="btn btn-sm btn-outline-danger" :disabled="loading" @click="remove(tour)">Видалити</button>
        </td>
      </tr>
    </tbody>
  </table>
</template>
