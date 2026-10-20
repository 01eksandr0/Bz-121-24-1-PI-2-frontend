<script setup>
import { onMounted, ref } from 'vue'
import TourCard from '../components/TourCard.vue'
import ErrorAlert from '../components/ErrorAlert.vue'
import LoadingBlock from '../components/LoadingBlock.vue'
import { toursApi } from '../api'
import { useAsync } from '../composables/useAsync'

const HOT_TOURS_ON_HOME = 6
const hotTours = ref([])
const { loading, error, run } = useAsync()

onMounted(() =>
  run(async () => {
    const tours = await toursApi.search({ hotOnly: true, sortBy: 'DiscountDescending' })
    hotTours.value = tours.slice(0, HOT_TOURS_ON_HOME)
  })
)
</script>

<template>
  <section class="hero p-5 mb-5">
    <h1 class="display-6 fw-bold">Подорожуйте з нами</h1>
    <p class="lead mb-4">Пляжні, екскурсійні та гірськолижні тури, готелі й квитки — в одному місці.</p>
    <div class="d-flex flex-wrap gap-2">
      <RouterLink class="btn btn-light" to="/tours">Знайти тур</RouterLink>
      <RouterLink class="btn btn-outline-light" to="/hotels">Обрати готель</RouterLink>
      <RouterLink class="btn btn-outline-light" to="/transport">Купити квиток</RouterLink>
    </div>
  </section>

  <h2 class="h4 mb-3">🔥 Гарячі тури</h2>
  <ErrorAlert :message="error" />
  <LoadingBlock v-if="loading" />
  <div v-else class="row g-3">
    <div v-for="tour in hotTours" :key="tour.id" class="col-md-6 col-lg-4">
      <TourCard :tour="tour" />
    </div>
    <p v-if="!hotTours.length && !error" class="text-muted">Зараз немає гарячих пропозицій.</p>
  </div>
</template>
