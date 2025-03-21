<script setup>
import { onMounted } from "vue";
import AuthService from "../services/authService.js";
import Button from "primevue/button";

import { useAuthStore } from "../store/authStore.js";
const authStore = useAuthStore();
import { useRouter } from "vue-router";
import { on } from "@primeuix/themes/aura/floatlabel";

const router = useRouter();

</script>

<template>
  <div class="flex-flex-row gap-3">
    <div class="sidebar">

    </div>
  </div>
</template>

<style scoped></style>
