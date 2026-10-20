<script setup>
import AppNavbar from './components/AppNavbar.vue'
</script>

<template>
  <AppNavbar />
  <main class="container py-4">
    <RouterView />
  </main>
  <footer class="text-center text-muted small py-4">Туристична агенція · курсова робота</footer>
</template>
