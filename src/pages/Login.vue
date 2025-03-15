<template>
  <div class="flex h-screen align-items-center justify-content-center surface-50">
    <div class="w-3 border-round-2xl flex flex-column align-items-center p-2 surface-100 montserrat-font text-center">
      <h2 class="mb-2">Добро пожaловать!</h2>
      <h3 class="m-3">Для подачи заявления необходимо авторизоваться</h3>

      <div class="buttons flex flex-column mt-4">
        <Button
            class="p-2 mb-2 text-base border-round-xl border-none"
            @click="AuthService.redirectToLogin()"
            label="Войчти через ЛК"
        />
        <Button
            severity="secondary"
            class="p-2 mb-2 text-sm border-round-xl border-none"
            @click="router.push('/sign-up')"
            label="Я студент из другого ВУЗа"
        />
        <a class="p-2 text-xs text-color" href="/sign-up"></a>
      </div>
    </div>
  </div>
</template>


<script setup>
import {onMounted, ref} from 'vue';
import {useRoute, useRouter} from "vue-router";
import {useAuthStore} from "../store/authStore.js";
import AuthService from "../services/authService.js";
import Button from 'primevue/button'

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

async function handleToken() {
  const token = route.query.token;
  console.log(token)
  if (token) {
    try {
      await authStore.authWithAdminApiToken(token); // Set token in authStore
      await router.push("/"); // Redirect to homepage
    } catch (error) {
      // TODO: create modal or notification
      console.error("Failed to set token or redirect", error);
    }
  }
}

function toggleTheme() {
  document.documentElement.classList.toggle('my-app-dark');
}

onMounted(async () => {
  await handleToken();
});

</script>


<style scoped lang="css">
.p-card {
  border-radius: 12px;
}

.montserrat-font {
  font-family: "Montserrat", sans-serif;
  font-optical-sizing: auto;
  font-style: normal;
}
</style>
