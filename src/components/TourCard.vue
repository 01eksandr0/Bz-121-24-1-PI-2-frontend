<script setup>
import PriceTag from './PriceTag.vue'
import { TOUR_TYPES, formatDate } from '../utils/format'

defineProps({ tour: { type: Object, required: true } })
</script>

<template>
  <div class="card h-100 card-hover border-0 shadow-sm">
    <div class="card-body d-flex flex-column">
      <div class="d-flex justify-content-between align-items-start mb-2">
        <span class="badge bg-light text-dark">{{ TOUR_TYPES[tour.type] }}</span>
        <span v-if="tour.isHot" class="badge badge-hot">🔥 −{{ tour.discountPercent }}%</span>
      </div>
      <h5 class="card-title">{{ tour.title }}</h5>
      <p class="text-muted small mb-2">📍 {{ tour.countryName }}, {{ tour.regionName }}</p>
      <p class="small mb-3">
        {{ formatDate(tour.startDate) }} · {{ tour.nights }} ноч.
        <br />
        <span :class="tour.freePlaces > 0 ? 'text-success' : 'text-danger'">
          {{ tour.freePlaces > 0 ? `Вільних місць: ${tour.freePlaces}` : 'Місць немає' }}
        </span>
      </p>
      <div class="mt-auto d-flex justify-content-between align-items-end">
        <PriceTag :price="tour.pricePerPerson" :final-price="tour.finalPrice" :discount="tour.discountPercent" />
        <RouterLink :to="{ name: 'tour', params: { id: tour.id } }" class="btn btn-sm btn-brand">Детальніше</RouterLink>
      </div>
    </div>
  </div>
</template>
