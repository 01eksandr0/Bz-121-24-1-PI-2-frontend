<script setup>
defineProps({ status: { type: String, required: true } })
</script>

<template>
  <span class="badge" :class="status === 'Active' ? 'bg-success' : 'bg-secondary'">
    {{ status === 'Active' ? 'Активне' : 'Скасоване' }}
  </span>
</template>
