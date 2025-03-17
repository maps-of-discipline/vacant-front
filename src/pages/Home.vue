<script setup>
import { onMounted } from "vue";
import AuthService from "../services/authService.js";
import Button from "primevue/button";

import { useAuthStore } from "../store/authStore.js";
const authStore = useAuthStore();
import { useRouter } from "vue-router";
import { on } from "@primeuix/themes/aura/floatlabel";

const router = useRouter();
onMounted(() => {
  router.replace({name: "SelfApplications"});
});
</script>

<template>
  <div class="w-10 flex flex-column gap-2">
    <h1>hello world</h1>
    <Button label="send dickpick" @click="AuthService.redirectToLogin()" />
    <Button label="logout" @click="authStore.logout()" />
    <Button label="Check perm1" @click="router.push('/perm1')" />
    <p v-if="authStore.isAuthenticated">{{ authStore.permissions }}</p>
  </div>
</template>

<style scoped></style>
