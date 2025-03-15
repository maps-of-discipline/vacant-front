<script setup>
import {ref} from 'vue'
import {Menubar} from "primevue";
import { useAuthStore } from "../store/authStore.js";

const authStore = useAuthStore();

const items = ref([
  {
    label: "Подать заявление",
  },
  {
    label: "Список поднанных заявлений",
  },
  {
    label: "Профиль",
  },
])

</script>

<template>
  <div class="flex flex-row justify-content-start align-items-center w-12 p-2 shadow-2" v-if="authStore.isAuthenticated">


      <Menubar :model="items"/>
  </div>
</template>

<style scoped>

</style>