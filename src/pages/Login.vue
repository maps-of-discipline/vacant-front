<template>
  <div class="flex h-screen align-items-center justify-content-center surface-50">
    <Panel
      class="login-form w-full md:w-5 lg:w-3 border-round-2xl shadow-4 flex flex-column p-0 montserrat-font mx-3 md:mx-0"
    >
      <template #header>
        <div class="text-center w-full pt-4 pb-3 flex flex-column align-items-center">
          <div class="mb-3">
            <img
              :src="'/logo-white.png'"
              alt="Московский Политех"
              height="70"
              :class="{ 'logo-light-mode': !appStore.isDarkMode }"
              class="mb-3"
            />
          </div>
          <h2 class="text-2xl font-bold m-0 text-900">Добро пожаловать!</h2>
        </div>
      </template>
      <div class="px-4 py-5">
        <h4 class="text-lg text-600 text-center mb-5 mt-0 font-medium">
          Для подачи заявления необходимо авторизоваться
        </h4>

        <div class="buttons w-full flex flex-column gap-3">
          <Button
            class="p-3 font-medium text-base"
            label="Войти через ЛК"
            icon="pi pi-sign-in"
            icon-pos="right"
            raised
            @click="AuthService.redirectToLogin()"
          />
          <Button
            severity="secondary"
            class="p-3 font-medium"
            label="Я студент из другого ВУЗа"
            icon="pi pi-external-link"
            icon-pos="right"
            outlined
            @click="router.push({ name: 'External Login' })"
          />
        </div>
      </div>
    </Panel>
  </div>
</template>

<script setup>
import { onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../store/authStore.js';
import { useAppStore } from '../store/appStore.js';
import AuthService from '../services/authService.js';
import { Button, Panel } from 'primevue';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const appStore = useAppStore();

async function handleTokens(access, refresh) {
  await authStore.setAuthData(access, refresh);
  router.push({ name: 'Home' });
}

onBeforeMount(async () => {
  const access = route.query.access;
  const refresh = route.query.refresh;
  if (access && refresh) await handleTokens(access, refresh);
});
</script>

<style scoped lang="css">
.login-form {
  width: 100%;
  max-width: 470px;
  min-width: 370px;
  margin: 0 auto;
}

.p-card {
  border-radius: 12px;
}

.montserrat-font {
  font-family: 'Montserrat', sans-serif;
  font-optical-sizing: auto;
  font-style: normal;
}

.logo-light-mode {
  filter: invert(1);
}
</style>
