<script setup>
import BookingsPanel from '../components/BookingsPanel.vue'
</script>

<template>
  <h1 class="h3 mb-3">Мої бронювання</h1>
  <p class="small text-muted">Бронювання туру можна скасувати не пізніше ніж за 3 дні до початку, номер і квиток — до дати заїзду / відправлення.</p>
  <BookingsPanel scope="mine" />
</template>
