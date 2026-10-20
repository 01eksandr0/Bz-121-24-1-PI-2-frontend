<script setup>
defineProps({ message: { type: String, default: '' } })
</script>

<template>
  <div v-if="message" class="alert alert-danger py-2" role="alert">{{ message }}</div>
</template>
