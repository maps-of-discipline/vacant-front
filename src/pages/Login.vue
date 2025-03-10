<script setup>
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../store/authStore.js";
import AuthService from "../services/authService.js";
import { onMounted } from "vue";

const router = useRouter();
const route = useRoute();
const token = route.query.token;
const authStore = useAuthStore();

async function handleToken() {
  if (token) {
    try {
      await authStore.setAdminApiToken(token); // Set token in authStore
      await router.push("/"); // Redirect to homepage
    } catch (error) {
      console.error("Failed to set token or redirect", error);
      AuthService.redirectToLogin(); // In case of error, redirect to login
    }

  } else {
    AuthService.redirectToLogin(); // No token, redirect to login
  }
}

onMounted(() => {
  handleToken();
});
</script>

<template>
</template>

<style scoped>

</style>
