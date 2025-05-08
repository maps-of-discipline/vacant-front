<script setup>
import Header from './components/Header.vue';
import { Toast } from 'primevue';
</script>

<template>
  <div class="page surface-50">
    <Toast />
    <Header />
    <RouterView />
  </div>
</template>

<style scoped></style>
