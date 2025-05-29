<script setup>
import Header from './components/Header.vue';
import { Toast, ConfirmPopup } from 'primevue';
</script>

<template>
  <div class="page surface-50">
    <Toast />
    <ConfirmPopup />
    <Header />
    <RouterView />
  </div>
</template>

<style scoped></style>
