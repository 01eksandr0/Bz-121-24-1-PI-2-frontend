<script setup>
import { formatPrice } from '../utils/format'

defineProps({
  price: { type: Number, required: true },
  finalPrice: { type: Number, required: true },
  discount: { type: Number, default: 0 }
})
</script>

<template>
  <div>
    <span v-if="discount > 0" class="price-old me-2">{{ formatPrice(price) }}</span>
    <span class="fs-5 fw-bold text-brand">{{ formatPrice(finalPrice) }}</span>
    <span class="text-muted small"> / особа</span>
  </div>
</template>
