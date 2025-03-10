<script setup>
import AuthService from "../services/authService.js";
import Button from "primevue/button";
import config from "../config";

import {useAuthStore} from "../store/authStore.js";
const authStore = useAuthStore();

</script>

<template>
  <div>
    <h1>hello world</h1>
    <Button label="send dickpick" @click='AuthService.redirectToLogin()'/>
    <p>{{ authStore.userData }}</p>
  </div>
</template>

<style scoped>

</style>
